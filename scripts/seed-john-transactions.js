/**
 * Seed: categorias e transações para o usuário johndoetestetrackit@gmail.com
 * Últimos 3 meses (dez/2025, jan/2026, fev/2026).
 *
 * Uso (na pasta web):
 *   npm run seed:john
 *   (usa MONGODB_URI do .env; para local: MONGODB_URI=mongodb://localhost:27017/trackit npm run seed:john)
 * No servidor (Docker):
 *   docker compose exec app node scripts/seed-john-transactions.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const USER_EMAIL = 'johndoetestetrackit@gmail.com';

// Categorias a criar (nome único no banco)
const CATEGORY_NAMES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Salário',
  'Supermercado',
  'Contas e serviços',
];

// Gera transações realistas para os últimos 3 meses
function generateTransactions(userId, categoryIds, currency) {
  const categories = categoryIds; // [ idDespesa1, idDespesa2, ..., idReceita ]
  const expenseCategories = categories.slice(0, -1); // Salário é o último (receita)
  const incomeCategoryId = categories[categories.length - 1];

  const transactions = [];
  const now = new Date();

  // Dezembro 2025
  const dec = (d) => new Date(2025, 11, d);
  // Janeiro 2026
  const jan = (d) => new Date(2026, 0, d);
  // Fevereiro 2026
  const feb = (d) => new Date(2026, 1, d);

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (min, max) => Math.round((min + Math.random() * (max - min)) * 100) / 100;

  // Salário (receita) todo mês
  [dec(5), jan(5), feb(5)].forEach((date) => {
    transactions.push({
      description: 'Salário mensal',
      amount: 8500,
      currency,
      date,
      type: 'income',
      is_fixed: true,
      category: incomeCategoryId,
      userId,
    });
  });

  // Despesas variadas por mês
  // Índices: 0 Alimentação, 1 Transporte, 2 Moradia, 3 Lazer, 4 Saúde, 5 Supermercado, 6 Contas (7 = Salário receita)
  const expenseTemplates = [
    { desc: 'Supermercado', cat: 0, min: 400, max: 700 },
    { desc: 'Restaurante', cat: 0, min: 80, max: 200 },
    { desc: 'Uber/99', cat: 1, min: 30, max: 80 },
    { desc: 'Combustível', cat: 1, min: 200, max: 350 },
    { desc: 'Aluguel', cat: 2, min: 2200, max: 2200 },
    { desc: 'Condomínio', cat: 2, min: 350, max: 450 },
    { desc: 'Conta de luz', cat: 2, min: 120, max: 250 },
    { desc: 'Internet', cat: 2, min: 99, max: 99 },
    { desc: 'Cinema', cat: 3, min: 60, max: 120 },
    { desc: 'Streaming (Netflix etc)', cat: 3, min: 55, max: 55 },
    { desc: 'Farmácia', cat: 4, min: 40, max: 150 },
    { desc: 'Academia', cat: 4, min: 99, max: 99 },
    { desc: 'Compras mercado', cat: 5, min: 80, max: 200 },
    { desc: 'Água', cat: 6, min: 60, max: 100 },
    { desc: 'Celular', cat: 6, min: 80, max: 80 },
  ];

  const months = [
    [dec(1), dec(8), dec(12), dec(15), dec(20), dec(22), dec(28)],
    [jan(3), jan(7), jan(10), jan(15), jan(18), jan(25), jan(28)],
    [feb(2), feb(5), feb(10), feb(14), feb(20), feb(25)],
  ];

  months.forEach((days) => {
    days.forEach((date) => {
      const t = pick(expenseTemplates);
      const catId = expenseCategories[t.cat] || expenseCategories[0];
      transactions.push({
        description: t.desc,
        amount: rand(t.min, t.max),
        currency,
        date,
        type: 'expense',
        is_fixed: null,
        category: catId,
        userId,
      });
    });
  });

  return transactions;
}

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/trackit';
  console.log('Conectando em', uri.replace(/:[^:@]+@/, ':***@'));
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  const users = db.collection('users');
  const categories = db.collection('categories');
  const transactions = db.collection('transactions');
  const currencies = db.collection('currencies');

  const user = await users.findOne({ email: USER_EMAIL.toLowerCase().trim() });
  if (!user) {
    console.error('Usuário não encontrado:', USER_EMAIL);
    process.exit(1);
  }

  const userId = user._id;
  let currency = 'BRL';
  if (user.currencyId) {
    const cur = await currencies.findOne({ _id: new mongoose.Types.ObjectId(String(user.currencyId)) });
    if (cur && cur.code) currency = cur.code;
  }
  console.log('Usuário:', user.email, '| Moeda:', currency);

  // Categorias: usar as do usuário ou criar (nome único na collection)
  let categoryIds = [];
  const existing = await categories.find({ userId }).sort({ createdAt: 1 }).toArray();
  if (existing.length >= CATEGORY_NAMES.length) {
    categoryIds = existing.map((c) => c._id);
    console.log('Usando', existing.length, 'categorias existentes do usuário.');
  } else {
    for (const name of CATEGORY_NAMES) {
      const ours = await categories.findOne({ name, userId });
      if (ours) {
        categoryIds.push(ours._id);
        continue;
      }
      // Nome deve ser único na collection; se já existe de outro usuário, usa sufixo
      let uniqueName = name;
      let exists = await categories.findOne({ name: uniqueName });
      if (exists) {
        uniqueName = `${name} (${userId.toString().slice(-6)})`;
      }
      const { insertedId } = await categories.insertOne({
        name: uniqueName,
        userId,
        createdAt: new Date(),
      });
      categoryIds.push(insertedId);
    }
    console.log('Criadas/vinculadas', categoryIds.length, 'categorias.');
  }

  const toInsert = generateTransactions(userId, categoryIds, currency);
  const result = await transactions.insertMany(toInsert);
  console.log('Inseridas', result.insertedCount, 'transações (dez/2025 a fev/2026).');

  await mongoose.disconnect();
  console.log('Concluído.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
