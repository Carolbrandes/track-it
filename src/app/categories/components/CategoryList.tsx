'use client';

import { Category, useCategories } from '@/app/hooks/useCategories';
import { cn } from '@/app/lib/cn';
import { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useUserData } from '../../hooks/useUserData';

const buttonBase = 'px-4 py-2 border-none rounded-lg cursor-pointer font-medium font-[inherit] transition-opacity duration-200 whitespace-nowrap hover:opacity-85';

export default function CategoryList({
    categories
}: {
    categories: Category[]
}) {
    const { t } = useTranslation();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { data: userData } = useUserData()
    const { updateCategory,
        deleteCategory, } = useCategories(userData?._id)

    const handleEdit = (category: Category) => {
        setEditingId(category._id);
        setEditName(category.name);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleUpdateCategory = async ({ id, name }: { id: string; name: string }) => {
        try {
            await updateCategory(id, name);
            setEditingId(null);
            setEditName('');
        } catch (error) {
            console.error("Update error:", error);
            setError('Error updating category');
        }
    };

    const handleDeleteCategory = (id: string) => {
        try {
            deleteCategory(id);

        } catch (error) {
            console.error("🚀 ~ handleDeleteCategory ~ error:", error)
            setError('Ocurred an error on delete category')
        }
    };


    return (
        <div>
            {error && <div className="text-danger bg-danger/[0.07] py-3 px-4 rounded-lg mb-4 border border-danger/20 text-[0.9rem]">{error}</div>}

            {categories.length === 0 ? (
                <div className="text-center p-8 text-text-secondary italic text-[0.9rem]">{t.categories.noCategoriesFound}</div>
            ) : (
                <ul className="list-none p-0 m-0">
                    {categories.map((category) => (
                        <li key={category._id} className="flex justify-between items-center py-3 border-b border-gray-300/40 last:border-b-0">
                            {editingId === category._id ? (
                                <div className="flex gap-2 w-full items-center">
                                    <input
                                        className="grow py-2 px-3 border border-gray-300 rounded-lg text-[0.95rem] bg-background text-text-primary font-[inherit] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]"
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                    <div className="flex gap-1.5">
                                        <button
                                            className={cn(buttonBase, '!px-3 !py-1.5 !text-xs bg-primary text-white')}
                                            onClick={() => handleUpdateCategory({
                                                id: category._id,
                                                name: editName,
                                            })}
                                        >
                                            {t.categories.save}
                                        </button>
                                        <button
                                            className={cn(buttonBase, '!px-3 !py-1.5 !text-xs bg-gray-300 text-text-primary')}
                                            onClick={handleCancel}
                                        >
                                            {t.categories.cancel}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="grow text-text-primary text-[0.95rem]">{category.name}</span>
                                    <div className="flex gap-1.5">
                                        <button
                                            className={cn(buttonBase, '!px-3 !py-1.5 !text-xs bg-primary text-white')}
                                            onClick={() => handleEdit(category)}
                                        >
                                            {t.categories.edit}
                                        </button>
                                        <button
                                            className={cn(buttonBase, '!px-3 !py-1.5 !text-xs bg-danger text-white')}
                                            onClick={() => handleDeleteCategory(category._id)}
                                        >
                                            {t.categories.delete}
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
