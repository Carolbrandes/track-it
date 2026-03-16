import Category from '../../models/Category';
import mongoose from 'mongoose';
import { invalidateInsightsCache } from './invalidateInsightsCache';

const DEFAULT_CATEGORIES = [
  'Mercado',
  'Contas Fixas',
  'Lazer',
  'Transporte',
  'Saúde',
  'Pets',
  'Assinaturas',
  'Educação',
  'Outros',
];

export async function seedCategories(userId: string | mongoose.Types.ObjectId) {
  try {
    const existingCategories = await Category.find({ userId });
    const existingNames = new Set(existingCategories.map((c) => c.name));

    // Check conditions:
    // 1. Less than 5 categories
    // 2. Missing any of the default categories (we'll just add what's missing from the default list)
    
    // The requirement says: "If they have less than 5 OR if certain essential categories are missing"
    // We can simplify: If we are going to add missing ones anyway, we just need to identify which default ones are missing.
    // However, if a user has customized their categories and deleted 'Mercado' but has 20 other categories, should we force 'Mercado' back?
    // "Se ele tiver menos de 5 ou se certas categorias essenciais estiverem faltando"
    // This implies if they have many categories (>= 5), but are missing essentials, we MIGHT still want to add them?
    // Or does it mean "If (count < 5) OR (missing essentials)"?
    // Let's assume the user wants these defaults to be available.
    // But we don't want to annoy users who deleted them.
    // The prompt says: "insira apenas as que não existem".
    
    // Let's follow the "less than 5 OR missing essentials" rule strictly to decide IF we run the logic,
    // but the insertion logic is "insert only what doesn't exist".
    
    // Actually, if we just iterate through DEFAULT_CATEGORIES and add what's missing, that covers "missing essentials".
    // The "less than 5" condition seems to be a trigger to ensuring they have *something*.
    // If they have 0 categories, they have < 5, so we add defaults.
    // If they have 10 custom categories but no 'Mercado', do we add 'Mercado'?
    // "ou se certas categorias essenciais estiverem faltando". Yes, the OR implies we do.
    
    const categoriesToAdd = DEFAULT_CATEGORIES.filter(
      (cat) => !existingNames.has(cat)
    );

    if (categoriesToAdd.length > 0) {
        // Only insert if we actually have something to add.
        // We might want to check the "less than 5" condition to avoid re-adding deleted categories for power users?
        // But the prompt explicitly says "OR if certain essential categories are missing". 
        // So even if I have 100 categories, if I miss 'Saúde', it should be added? 
        // That might be annoying if I intentionally deleted 'Saúde'.
        // However, "new user" vs "existing user" logic:
        // New user: automatic.
        // Existing user: check conditions.
        
        // Let's implement a check:
        // If total categories < 5, we definitely add missing defaults.
        // If total categories >= 5, we check if they are missing *many* defaults?
        // The prompt is slightly ambiguous on "certas categorias essenciais".
        // Let's assume "essential" means the full list for now.
        // To be safe and not intrusive, maybe we only force add if they have very few categories OR if they are a new user (which this function handles for both).
        
        // Let's refine the trigger:
        // Run insertion IF (existing_count < 5) OR (missing_essential_count > 0)
        // Wait, if I implement "Add missing defaults", it covers both.
        // The only risk is re-adding a category a user intentionally deleted.
        // But since this is likely running on login, it might happen repeatedly.
        // We should probably only do this if the user is "newish" or empty.
        // But the prompt says "Para usuários existentes... verifique... insira".
        
        // I will implement it such that it adds any of the DEFAULT_CATEGORIES that are missing.
        // If this becomes annoying, we can refine it to only "essential" ones like 'Outros' or 'Mercado'.
        // For now, I'll add all missing defaults from the list.
        
      const newCategories = categoriesToAdd.map((name) => ({
        name,
        userId,
        createdAt: new Date(),
      }));

      if (newCategories.length > 0) {
        await Category.insertMany(newCategories);
        await invalidateInsightsCache(userId.toString());
        console.log(`[Seed] Added ${newCategories.length} categories for user ${userId}`);
      }
    }
  } catch (error) {
    console.error('[Seed] Error seeding categories:', error);
    // Don't block login if seeding fails
  }
}
