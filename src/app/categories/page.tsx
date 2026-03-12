'use client';

import { useCategories } from '../hooks/useCategories';
import { useUserData } from '../hooks/useUserData';
import { useTranslation } from '../i18n/LanguageContext';
import CategoryForm from './components/CategoryForm';
import CategoryList from './components/CategoryList';

export default function Categories() {
    const { t } = useTranslation();
    const { data: userData } = useUserData();

    const {
        categories,
        isLoading,
        isError,
        error,
        addCategory
    } = useCategories(userData?._id);

    const handleAddCategory = (name: string) => {
        addCategory(name);
    };

    return (
        <div className="p-4 w-full min-w-0 overflow-x-hidden flex-1 md:p-8 md:max-w-[1400px] md:mx-auto">
            <h1 className="text-[1.75rem] font-bold mb-8 text-text-primary">{t.categories.title}</h1>

            {isError && <div className="text-danger bg-danger/[0.07] py-3 px-4 rounded-lg mb-4 border border-danger/20 text-[0.9rem]">{error?.message}</div>}

            <section className="mb-8">
                <h2 className="text-[1.1rem] font-semibold mb-4 text-text-secondary uppercase tracking-[0.5px]">{t.categories.addNew}</h2>
                <div className="bg-surface border border-gray-300 rounded-xl p-5">
                    <CategoryForm onAdd={handleAddCategory} />
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.1rem] font-semibold mb-4 text-text-secondary uppercase tracking-[0.5px]">{t.categories.existing}</h2>
                <div className="bg-surface border border-gray-300 rounded-xl p-5">
                    {isLoading ? (
                        <div className="text-center p-8 text-text-secondary">{t.categories.loading}</div>
                    ) : categories && categories.length > 0 ? (
                        <CategoryList categories={categories} />
                    ) : (
                        <div className="text-center p-8 text-text-secondary italic text-[0.9rem]">{t.categories.noCategories}</div>
                    )}
                </div>
            </section>
        </div>
    );
}
