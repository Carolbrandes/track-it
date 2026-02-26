import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ReceiptItem {
    description: string;
    amount: number;
    quantity?: number;
}

export interface ParsedReceipt {
    storeName: string;
    date: string;
    items: ReceiptItem[];
    total: number;
    type: 'expense' | 'income';
    suggestedCategory: string;
    currency: string;
}

export interface ParseReceiptResponse {
    success: boolean;
    data?: ParsedReceipt;
    error?: string;
}

export async function parseReceiptCore(
    base64Image: string,
    mimeType: string,
    locale: string = 'pt',
    existingCategories: string[] = []
): Promise<ParseReceiptResponse> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('[parseReceiptCore] GEMINI_API_KEY is undefined — check .env and restart the server.');
            return { success: false, error: 'GEMINI_API_KEY not configured' };
        }

        const langMap: Record<string, string> = {
            pt: 'português brasileiro',
            en: 'English',
            es: 'español',
        };
        const language = langMap[locale] || 'português brasileiro';

        const categoriesHint = existingCategories.length > 0
            ? `\nCATEGORIAS EXISTENTES DO USUÁRIO: [${existingCategories.join(', ')}]\nEscolha a categoria mais adequada dessa lista para "suggestedCategory". Se nenhuma se encaixar, sugira um nome genérico apropriado.`
            : '';

        const prompt = `Analise esta imagem de um comprovante, nota fiscal ou recibo.

RESPONDA EXCLUSIVAMENTE em ${language}.

Extraia as seguintes informações:
1. Nome do estabelecimento (storeName)
2. Data da compra no formato YYYY-MM-DD (date)
3. Lista de itens individuais (items) — CADA item deve ter o nome ESPECÍFICO do produto/serviço (ex: "Arroz 5kg", "Coca-Cola 2L", "Pão Francês"), NUNCA use o nome da loja como descrição do item
4. Valor total (total)
5. Tipo: "expense" se é um gasto/compra, "income" se é um recebimento/depósito/transferência recebida/salário
6. Categoria sugerida (suggestedCategory) — baseada no CONTEÚDO real do comprovante. Exemplos: compra de supermercado = "Mercado", depósito bancário = "Depósito", transferência recebida = "Transferência", restaurante = "Alimentação", farmácia = "Saúde"
7. Moeda (currency) — código ISO: R$ = "BRL", $ (contexto americano) = "USD", € = "EUR"
${categoriesHint}

REGRAS IMPORTANTES:
- A "description" de cada item deve ser o NOME DO PRODUTO, NUNCA o nome da loja/estabelecimento
- Se o comprovante for um depósito, transferência recebida ou pagamento recebido, o type deve ser "income"
- Se o comprovante for uma compra, pagamento ou saque, o type deve ser "expense"
- Se não houver itens individuais (ex: depósito), crie um único item com a descrição do que é (ex: "Depósito bancário")
- A data deve estar no formato YYYY-MM-DD. Se não encontrar, use a data de hoje
- Valores devem ser numéricos (sem símbolo de moeda)
- Se a imagem não for um comprovante/recibo válido, retorne: {"error": "NOT_A_RECEIPT"}

RETORNE EXCLUSIVAMENTE um JSON válido (sem markdown, sem backticks):
{
  "storeName": "Nome do Estabelecimento",
  "date": "2025-01-15",
  "items": [
    { "description": "Nome específico do produto ou serviço", "amount": 10.50, "quantity": 1 }
  ],
  "total": 150.00,
  "type": "expense",
  "suggestedCategory": "Mercado",
  "currency": "BRL"
}`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType,
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;

        if (!response) {
            console.error('[parseReceiptCore] Gemini returned no response (e.g. blocked or empty)');
            return { success: false, error: 'No response from AI. The image may have been blocked. Try again.' };
        }

        let responseText: string;
        try {
            responseText = response.text();
        } catch (textErr) {
            console.error('[parseReceiptCore] response.text() failed:', textErr);
            return { success: false, error: 'Could not read AI response. Try again with a clearer photo.' };
        }

        if (!responseText || !responseText.trim()) {
            console.error('[parseReceiptCore] Empty response text');
            return { success: false, error: 'Empty response from AI. Try again.' };
        }

        let cleaned = responseText
            .replaceAll(/```json\n?/g, '')
            .replaceAll(/```\n?/g, '')
            .trim();

        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleaned = jsonMatch[0];
        }

        let parsed: Record<string, unknown>;
        try {
            parsed = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error('[parseReceiptCore] JSON parse error. Raw (first 400 chars):', cleaned.slice(0, 400));
            return { success: false, error: 'Invalid AI response. Please try again.' };
        }

        if (parsed.error === 'NOT_A_RECEIPT') {
            return { success: false, error: 'NOT_A_RECEIPT' };
        }

        return {
            success: true,
            data: parsed as unknown as ParsedReceipt,
        };
    } catch (error) {
        // Log detalhado: ver no terminal do backend exatamente o que o Gemini retorna
        console.error('[parseReceiptCore] Error parsing receipt (full):', error);
        if (error && typeof error === 'object') {
            console.error('[parseReceiptCore] stack:', (error as Error).stack);
            console.error('[parseReceiptCore] name:', (error as Error).name);
            if ('response' in error) console.error('[parseReceiptCore] response:', (error as { response?: unknown }).response);
            if ('cause' in error) console.error('[parseReceiptCore] cause:', (error as { cause?: unknown }).cause);
        }

        const isRateLimit = error instanceof Error && error.message.includes('429');
        if (isRateLimit) {
            return { success: false, error: 'RATE_LIMIT' };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to parse receipt',
        };
    }
}
