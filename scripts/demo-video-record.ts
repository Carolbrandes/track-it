/**
 * Script Playwright para gravar vídeo de demonstração do Track It (LinkedIn).
 *
 * Uso:
 *   npm run demo:video
 *
 * O script carrega automaticamente o arquivo .env na raiz do projeto web (onde está o package.json).
 * Variáveis usadas: BASE_URL, TEST_EMAIL. O código de verificação você preenche na hora.
 *
 * Variáveis de ambiente (podem vir do .env ou do shell):
 *   BASE_URL     - URL do app (default: http://localhost:3000)
 *   TEST_EMAIL   - Email para login (opcional; se não definir, preencha tudo manualmente)
 */

import { config as loadEnv } from 'dotenv';
import { chromium } from 'playwright';
import * as path from 'node:path';
import * as fs from 'node:fs';

// Carrega .env do diretório atual (ao rodar "npm run demo:video" o cwd é web/)
loadEnv({ path: path.join(process.cwd(), '.env') });

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').trim();
const TEST_EMAIL = (process.env.TEST_EMAIL || '').trim();

// Pasta onde os vídeos serão salvos (relativa ao CWD ao rodar o script)
const VIDEO_DIR = path.join(process.cwd(), 'videos');

// Garantir que a pasta existe
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

async function main() {
  const browser = await chromium.launch({
    headless: false, // headed para você ver a gravação; use true se quiser só gerar o vídeo
    slowMo: 800,     // Velocidade mais humana entre ações
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  // Aceitar alert()/confirm() para não travar (ex.: quando o código de verificação falha)
  page.on('dialog', (dialog) => dialog.accept());

  try {
    // ---------- 1. Acessar página de login ----------
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    if (!TEST_EMAIL) {
      console.warn(
        '⚠️  TEST_EMAIL não definido. Preencha e-mail e código manualmente; o script vai pausar no login.'
      );
      await page.waitForTimeout(8000);
    } else {
      // ---------- 2. Preencher email e solicitar código ----------
      await page.locator('input[type="email"]').fill(TEST_EMAIL);
      await page.waitForTimeout(500);

      const sendCodeResponse = page.waitForResponse(
        (resp) => resp.url().includes('/api/auth/send-code') && resp.request().method() === 'POST',
        { timeout: 15000 }
      );
      await page.getByRole('button').first().click({ force: true });
      await sendCodeResponse;
      await page.waitForTimeout(1000);

      const codeInput = page.locator('input').nth(1);
      await codeInput.waitFor({ state: 'visible', timeout: 10000 });
      await page.waitForTimeout(500);

      // ---------- 3. Código: você preenche na hora e clica em Verificar ----------
      console.log('\n▶  Preencha o código do e-mail e clique em "Verificar código". O script segue quando o dashboard carregar.\n');
    }

    // ---------- 4. Aguardar Dashboard carregar (ou você fazer login manual) ----------
    await page.waitForURL(/\/$|\/dashboard/, { timeout: 90000 }).catch(() => {});

    await page.waitForTimeout(2000);

    // ---------- 5. Navegar para "Adicionar Transação" ----------
    // Opção A: ir direto na URL da página de nova transação
    await page.goto(`${BASE_URL}/add-transaction`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Opção B (alternativa): abrir o modal pelo Dashboard
    // Descomente e comente a Opção A se preferir clicar no botão do Dashboard:
    // await page.getByRole('button', { name: /adicionar transação|add transaction/i }).click();
    // await page.waitForTimeout(1500);

    // ---------- 6. Preencher formulário: despesa "Conta de Luz", R$ 150,00, categoria ----------
    // Descrição (campo name="description" no Form)
    // TROCAR: se usar data-testid, ex: page.getByTestId('transaction-description')
    await page.locator('input[name="description"]').fill('Conta de Luz');
    await page.waitForTimeout(600);

    // Valor (NumberFormat com placeholder "0.00" no seu app)
    // TROCAR: se o valor tiver name="amount" ou outro seletor
    await page.getByPlaceholder('0.00').fill('150');
    await page.waitForTimeout(600);

    // Data (campo name="date")
    // TROCAR: se o campo de data tiver outro name ou label
    const today = new Date().toISOString().slice(0, 10);
    await page.locator('input[name="date"]').fill(today);
    await page.waitForTimeout(600);

    // Tipo: Despesa (botão/radio com texto "Despesa" ou "Expense")
    // TROCAR: se for um select, use page.selectOption('select[name="type"]', 'expense')
    await page.getByRole('button', { name: /despesa|expense/i }).click();
    await page.waitForTimeout(600);

    // Categoria (autocomplete: placeholder "Buscar ou criar categoria..." / "Search or create category...")
    // TROCAR: se o placeholder for outro
    const categoryInput = page.getByPlaceholder(/buscar|search|crear|create|category|categoria/i);
    await categoryInput.click();
    await categoryInput.fill('Contas');
    await page.waitForTimeout(1000);

    // Clicar na opção "Contas" ou na primeira categoria da lista (dropdown é ul > li no CategoryAutocomplete)
    // TROCAR: se a lista usar outro markup (ex: role="option")
    const categoryOption = page.getByRole('listitem').filter({ hasText: /contas/i }).first();
    if (await categoryOption.count() > 0) {
      await categoryOption.click();
    } else {
      await page.getByRole('listitem').first().click();
    }
    await page.waitForTimeout(800);

    // Submeter formulário (botão type="submit" com texto "Adicionar Transação" / "Add Transaction")
    // TROCAR: se o botão tiver data-testid, ex: getByTestId('submit-transaction')
    await page.getByRole('button', { name: /adicionar transação|add transaction|adicionar|add/i }).click();
    await page.waitForTimeout(2000);

    // ---------- 7. Voltar ao Dashboard e mostrar saldo ----------
    await page.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    // ---------- 8. Mostrar opções de configuração (dropdown do ícone de engrenagem) ----------
    await page.locator('nav button').last().click();
    await page.waitForTimeout(2500);

    // Fechar o dropdown (clique fora) e ir para Categorias
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // ---------- 9. Página de Categorias ----------
    await page.getByRole('link', { name: /categor/i }).click();
    await page.waitForURL(/\/categories/, { timeout: 10000 });
    await page.waitForTimeout(2500);

    // ---------- 10. Página Financial Analytics (gráficos) ----------
    await page.getByRole('link', { name: /financial|analytics|gráfico/i }).click();
    await page.waitForURL(/\/financial-analytics/, { timeout: 10000 });
    await page.waitForTimeout(3000);
  } catch (err) {
    console.error('Erro durante a gravação:', err);
  } finally {
    // Fechar o context primeiro para o Playwright salvar o vídeo corretamente
    await context.close();
    await browser.close();
    console.log(`Vídeo salvo em: ${VIDEO_DIR}`);
  }
}

void main();
