import { GoogleGenerativeAI } from '@google/generative-ai';
import mongoose from 'mongoose';
import db from './db';
import Transaction from '@/models/Transaction';
import InsightsCache from '@/models/InsightsCache';

const INSIGHTS_CACHE_TTL_MS = 3 * 60 * 60 * 1000; // 3 horas

export interface CategoryBreakdown {
    category: string;
    currentMonth: number;
    previousAverage: number;
    percentChange: number;
}

export interface GhostExpense {
    description: string;
    amount: number;
    monthsRepeated: number;
    suggestion: string;
}

export interface CashFlowForecast {
    endOfMonth: number;
    next90Days: number;
    canAffordInstallment: string;
}

export interface InsightsData {
    summary: string;
    anomalies: string[];
    ghostExpenses: GhostExpense[];
    cashFlowForecast: CashFlowForecast;
    savingsProjection: string;
    categoryBreakdowns: CategoryBreakdown[];
    motivationalTip: string;
}

export interface InsightsResponse {
    success: boolean;
    data?: InsightsData;
    error?: string;
}

interface PopulatedTransaction {
    description: string;
    amount: number;
    currency: string;
    date: Date;
    type: 'expense' | 'income';
    is_fixed: boolean | null;
    category: { _id: string; name: string } | null;
}

function formatTransactionsForPrompt(transactions: PopulatedTransaction[]): string {
    return transactions
        .map((t) => ({
            description: t.description,
            amount: t.amount,
            currency: t.currency,
            date: new Date(t.date).toISOString().split('T')[0],
            type: t.type,
            is_fixed: t.is_fixed,
            category: t.category?.name ?? 'Sem categoria',
        }))
        .map((t) => JSON.stringify(t))
        .join('\n');
}

async function callGeminiWithRetry(prompt: string, maxRetries = 3): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[generateInsightsCore] GEMINI_API_KEY is undefined — check .env and restart the server.');
        throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err: unknown) {
            const isRateLimit = err instanceof Error && err.message.includes('429');
            if (!isRateLimit || attempt === maxRetries) throw err;

            const delay = Math.min(2000 * Math.pow(2, attempt), 30000);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw new Error('Max retries exceeded');
}

export async function generateInsightsCore(
    userId: string,
    locale: string = 'pt'
): Promise<InsightsResponse> {
    try {
        await db();

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const cached = await InsightsCache.findOne({
            userId: userObjectId,
            locale,
            expiresAt: { $gt: new Date() },
        }).lean();

        if (cached?.data) {
            return { success: true, data: cached.data as unknown as InsightsData };
        }

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

        const [currentMonthTransactions, previousTransactions] = await Promise.all([
            Transaction.find({
                userId,
                date: { $gte: currentMonthStart, $lte: currentMonthEnd },
            })
                .populate('category')
                .lean(),
            Transaction.find({
                userId,
                date: { $gte: sixMonthsAgo, $lt: currentMonthStart },
            })
                .populate('category')
                .lean(),
        ]);

        if (currentMonthTransactions.length === 0 && previousTransactions.length === 0) {
            return {
                success: false,
                error: 'NO_TRANSACTIONS',
            };
        }

        const currentFormatted = formatTransactionsForPrompt(
            currentMonthTransactions as unknown as PopulatedTransaction[]
        );
        const previousFormatted = formatTransactionsForPrompt(
            previousTransactions as unknown as PopulatedTransaction[]
        );

        const langMap: Record<string, string> = {
            pt: 'português brasileiro',
            en: 'English',
            es: 'español',
        };
        const language = langMap[locale] || 'português brasileiro';

        const prompt = `
Você é um consultor financeiro pessoal inteligente. Analise as transações do usuário e forneça insights acionáveis avançados.

RESPONDA EXCLUSIVAMENTE em ${language}.

REGRAS ESTRITAS:
- Base-se EXCLUSIVAMENTE nos dados fornecidos abaixo. NÃO invente números, categorias ou transações que não existam nos dados.
- Se não houver dados suficientes para uma análise, diga isso explicitamente.
- Todos os valores monetários devem usar a moeda que aparece nos dados.
- Seja direto, humanizado e motivador no tom.

TRANSAÇÕES DO MÊS ATUAL (${currentMonthStart.toLocaleDateString('pt-BR')} a ${currentMonthEnd.toLocaleDateString('pt-BR')}):
${currentFormatted || 'Nenhuma transação este mês.'}

TRANSAÇÕES DOS 6 MESES ANTERIORES (${sixMonthsAgo.toLocaleDateString('pt-BR')} a ${new Date(currentMonthStart.getTime() - 1).toLocaleDateString('pt-BR')}):
${previousFormatted || 'Nenhuma transação nos meses anteriores.'}

INSTRUÇÕES DE ANÁLISE:

1. RESUMO: Resuma em 2-3 frases a saúde financeira do mês atual.

2. ANOMALIAS & AUMENTOS REPENTINOS: Identifique categorias onde o gasto do mês atual está significativamente acima (>30%) da média dos meses anteriores. Inclua exemplos concretos com valores, tipo: "Sua conta de luz subiu 30% em relação à média dos últimos meses. Quer revisar seus hábitos?".

3. GASTOS FANTASMAS (Ghost Expenses): Procure por assinaturas ou cobranças recorrentes que se repetem todo mês (streaming, serviços, academias, etc) mas que podem estar sendo "esquecidas" pelo usuário. Analise os dados de is_fixed e cobranças com descrição/valor similar que se repetem em múltiplos meses. Para cada gasto fantasma encontrado, informe: a descrição, o valor, há quantos meses se repete, e uma sugestão amigável (ex: "Você realmente ainda usa esse serviço?"). Se nenhum for encontrado, retorne array vazio.

4. PREVISÃO DE SALDO (Cash Flow Forecast): Com base nas transações recorrentes (renda e despesas fixas/repetidas) e no comportamento de gastos dos últimos meses:
   - Projete o saldo estimado ao final do mês atual.
   - Projete o saldo estimado daqui a 90 dias (3 meses à frente).
   - Informe se o usuário poderia se comprometer com uma compra parcelada hoje (uma frase direta e prática).
   Se os dados forem insuficientes para projetar, diga explicitamente e coloque 0 nos valores.

5. PROJEÇÃO DE ECONOMIA: Com base no saldo atual (receitas - despesas), projete se o usuário conseguirá economizar algo até o fim do mês.

6. COMPARAÇÃO POR CATEGORIA: Compare gastos por categoria do mês atual com a média mensal anterior.

7. DICA MOTIVACIONAL: Uma frase direta, personalizada e motivadora.

RETORNE EXCLUSIVAMENTE um JSON válido (sem markdown, sem backticks) neste formato:
{
  "summary": "Resumo geral de 2-3 frases.",
  "anomalies": ["Descrição de cada anomalia. Array vazio se nenhuma."],
  "ghostExpenses": [
    {
      "description": "Nome do serviço/assinatura",
      "amount": 29.90,
      "monthsRepeated": 4,
      "suggestion": "Sugestão amigável"
    }
  ],
  "cashFlowForecast": {
    "endOfMonth": 1500.00,
    "next90Days": 4200.00,
    "canAffordInstallment": "Sim, você pode se comprometer com parcelas de até X por mês."
  },
  "savingsProjection": "Projeção de economia.",
  "categoryBreakdowns": [
    {
      "category": "Nome",
      "currentMonth": 0.00,
      "previousAverage": 0.00,
      "percentChange": 0.0
    }
  ],
  "motivationalTip": "Dica motivacional."
}`;

        const responseText = await callGeminiWithRetry(prompt);

        let cleanedResponse = responseText
            .replaceAll(/```json\n?/g, '')
            .replaceAll(/```\n?/g, '')
            .trim();

        // Try to extract JSON if the model wrapped it in extra text
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResponse = jsonMatch[0];
        }

        let parsed: InsightsData;
        try {
            parsed = JSON.parse(cleanedResponse);
        } catch (parseErr) {
            console.error('[generateInsightsCore] JSON parse error. Raw (first 500 chars):', cleanedResponse.slice(0, 500));
            throw new Error('Invalid JSON response from AI. Please try again.');
        }

        const expiresAt = new Date(Date.now() + INSIGHTS_CACHE_TTL_MS);
        await InsightsCache.findOneAndUpdate(
            { userId: userObjectId, locale },
            { $set: { data: parsed, expiresAt } },
            { upsert: true }
        );

        return {
            success: true,
            data: parsed,
        };
    } catch (error) {
        // Log detalhado: ver no terminal do backend exatamente o que o Gemini retorna
        console.error('[generateInsightsCore] Error generating insights (full):', error);
        if (error && typeof error === 'object') {
            console.error('[generateInsightsCore] stack:', (error as Error).stack);
            console.error('[generateInsightsCore] name:', (error as Error).name);
            if ('response' in error) console.error('[generateInsightsCore] response:', (error as { response?: unknown }).response);
            if ('cause' in error) console.error('[generateInsightsCore] cause:', (error as { cause?: unknown }).cause);
        }

        const isRateLimit = error instanceof Error && error.message.includes('429');
        if (isRateLimit) {
            return {
                success: false,
                error: 'RATE_LIMIT',
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate insights',
        };
    }
}
