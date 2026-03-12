import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Tenta carregar .env.local primeiro, depois .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI não encontrada nas variáveis de ambiente.');
  process.exit(1);
}

// Schemas simplificados apenas para leitura
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  currencyId: mongoose.Schema.Types.Mixed,
}, { strict: false });

const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  currency: String,
  date: Date,
  type: String,
  userId: mongoose.Schema.Types.ObjectId,
  category: mongoose.Schema.Types.Mixed,
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

async function listData() {
  try {
    console.log('📡 Conectando ao MongoDB...');
    // Mascara a URI para segurança no log
    const maskedUri = MONGODB_URI?.replace(/:([^:@]+)@/, ':****@');
    console.log(`   URI: ${maskedUri}`);
    
    await mongoose.connect(MONGODB_URI as string);
    console.log('✅ Conectado!');

    const users = await User.find({});
    console.log(`\n👥 Encontrados ${users.length} usuários.`);

    for (const user of users) {
      console.log(`\n---------------------------------------------------`);
      console.log(`👤 Usuário: ${user.name} (${user.email})`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Moeda Preferida (no perfil): ${user.currencyId || 'Não definida'}`);

      const count = await Transaction.countDocuments({ userId: user._id });
      console.log(`   📊 Total de Transações: ${count}`);

      if (count > 0) {
        const lastTransactions = await Transaction.find({ userId: user._id })
          .sort({ date: -1 })
          .limit(5);

        console.log(`   🗓️  Últimas 5 transações:`);
        lastTransactions.forEach(t => {
          const dateStr = t.date ? new Date(t.date).toISOString().split('T')[0] : 'Sem data';
          console.log(`      - ${dateStr} | ${t.currency} ${t.amount} | ${t.description} (${t.type})`);
        });
        
        // Verifica se existem transações com moeda diferente da padrão
        const currencies = await Transaction.distinct('currency', { userId: user._id });
        console.log(`   💰 Moedas encontradas neste usuário: ${currencies.join(', ')}`);
      } else {
        console.log(`   ⚠️  Nenhuma transação encontrada.`);
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado.');
  }
}

listData();
