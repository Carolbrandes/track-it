/**
 * Seed: Custom transactions for specific user
 * Usage: node scripts/seed-custom-transactions.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const TARGET_USER = {
  _id: new mongoose.Types.ObjectId("69a81feef9e7f7d0094e4687"),
  email: "johndoetestetrackit@gmail.com",
  selectedTheme: "light",
  currencyId: new mongoose.Types.ObjectId("67e12322a2f7b8353bceb3f6"),
  __v: 0
};

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
  'Educação',
  'Viagem'
];

// Gera transações realistas
function generateTransactions(userId, categoryIds, currency) {
  const categories = categoryIds;
  const expenseCategories = categories.slice(0, -1); // Salário é o último (receita)
  const incomeCategoryId = categories[categories.length - 1];

  const transactions = [];
  
  // Dates for the last 3 months
  const dec = (d) => new Date(2025, 11, d);
  const jan = (d) => new Date(2026, 0, d);
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

  // Expense templates
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
    { desc: 'Livros', cat: 8, min: 50, max: 150 },
    { desc: 'Passagem aérea', cat: 9, min: 500, max: 1500 },
  ];

  // More dates to reach ~60 transactions
  // 3 income + ~19 per month * 3 months = ~60
  const months = [
    [dec(1), dec(2), dec(3), dec(8), dec(9), dec(10), dec(12), dec(13), dec(15), dec(16), dec(18), dec(20), dec(21), dec(22), dec(23), dec(26), dec(28), dec(29), dec(30)],
    [jan(2), jan(3), jan(4), jan(7), jan(8), jan(10), jan(11), jan(14), jan(15), jan(16), jan(18), jan(20), jan(21), jan(22), jan(24), jan(25), jan(27), jan(28), jan(30)],
    [feb(1), feb(2), feb(3), feb(4), feb(6), feb(8), feb(9), feb(10), feb(11), feb(13), feb(14), feb(15), feb(17), feb(18), feb(20), feb(21), feb(22), feb(24), feb(25)],
  ];

  months.forEach((days) => {
    days.forEach((date) => {
      const t = pick(expenseTemplates);
      // Map template category index to actual category ID
      // If template index is out of bounds of created categories, fallback to first one
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
  console.log('Connecting to', uri.replace(/:[^:@]+@/, ':***@'));
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  const users = db.collection('users');
  const categories = db.collection('categories');
  const transactions = db.collection('transactions');
  const currencies = db.collection('currencies');

  // 1. Upsert User
  console.log('Upserting user:', TARGET_USER.email);
  await users.updateOne(
    { _id: TARGET_USER._id },
    { $set: TARGET_USER },
    { upsert: true }
  );

  // 2. Determine Currency
  let currency = 'BRL';
  if (TARGET_USER.currencyId) {
    const cur = await currencies.findOne({ _id: TARGET_USER.currencyId });
    if (cur && cur.code) {
      currency = cur.code;
    } else {
        console.warn('Currency ID provided but not found in DB. Defaulting to BRL.');
    }
  }
  console.log('Currency:', currency);

  // 3. Setup Categories
  const userId = TARGET_USER._id;
  let categoryIds = [];
  
  // Check existing categories
  const existing = await categories.find({ userId }).sort({ createdAt: 1 }).toArray();
  
  if (existing.length >= CATEGORY_NAMES.length) {
     categoryIds = existing.map(c => c._id);
     console.log('Using', existing.length, 'existing categories.');
  } else {
    // Create missing categories
    for (const name of CATEGORY_NAMES) {
        // Check if user already has this category by name
        const alreadyHas = await categories.findOne({ name, userId });
        if (alreadyHas) {
            categoryIds.push(alreadyHas._id);
            continue;
        }

        // Create new
        const { insertedId } = await categories.insertOne({
            name,
            userId,
            createdAt: new Date(),
            // Assuming icon and color are optional or handled by frontend defaults, 
            // but adding some defaults just in case
            icon: 'FaTag', 
            color: '#cccccc' 
        });
        categoryIds.push(insertedId);
    }
    console.log('Categories setup complete.');
  }

  // 4. Generate and Insert Transactions
  const toInsert = generateTransactions(userId, categoryIds, currency);
  
  console.log(`Generating ${toInsert.length} transactions...`);
  
  const result = await transactions.insertMany(toInsert);
  console.log('Inserted', result.insertedCount, 'transactions.');

  await mongoose.disconnect();
  console.log('Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});