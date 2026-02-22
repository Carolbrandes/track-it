'use client';

import { Category, useCategories } from '@/app/hooks/useCategories';
import { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useUserData } from '../../hooks/useUserData';
import * as S from '../styles';



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
        <S.ListContainer>
            {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

            {categories.length === 0 ? (
                <S.EmptyMessage>{t.categories.noCategoriesFound}</S.EmptyMessage>
            ) : (
                <S.List>
                    {categories.map((category) => (
                        <S.ListItem key={category._id}>
                            {editingId === category._id ? (
                                <S.EditForm>
                                    <S.Input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                    <S.ButtonGroup>
                                        <S.Button
                                            $small
                                            onClick={() => handleUpdateCategory({
                                                id: category._id,
                                                name: editName,
                                            })}
                                        >
                                            {t.categories.save}
                                        </S.Button>
                                        <S.Button
                                            $small
                                            $secondary
                                            onClick={handleCancel}
                                        >
                                            {t.categories.cancel}
                                        </S.Button>
                                    </S.ButtonGroup>
                                </S.EditForm>
                            ) : (
                                <>
                                    <S.ListItemText>{category.name}</S.ListItemText>
                                    <S.ButtonGroup>
                                        <S.Button
                                            $small
                                            onClick={() => handleEdit(category)}
                                        >
                                            {t.categories.edit}
                                        </S.Button>
                                        <S.Button
                                            $small
                                            $danger
                                            onClick={() => handleDeleteCategory(category._id)}
                                        >
                                            {t.categories.delete}
                                        </S.Button>
                                    </S.ButtonGroup>
                                </>
                            )}
                        </S.ListItem>
                    ))}
                </S.List>
            )}
        </S.ListContainer>
    );
}