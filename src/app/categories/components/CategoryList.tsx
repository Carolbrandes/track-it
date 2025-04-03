'use client';

import { useCategories } from '@/app/hooks/useCategories';
import { useUserData } from '@/app/hooks/useUserData';
import { useState } from 'react';
import * as S from '../styles';

interface Category {
    _id: string
    name: string
    userId: string
    createdAt: Date | string

}

export default function CategoryList({
    categories
}: {
    categories: Category[]
}) {
    console.log("🚀 ~ categories:", categories)

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { data: userData } = useUserData()
    const { updateCategory,
        deleteCategory, } = useCategories(userData?.user?.id)

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
                <S.EmptyMessage>No categories found</S.EmptyMessage>
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
                                            Save
                                        </S.Button>
                                        <S.Button
                                            $small
                                            $secondary
                                            onClick={handleCancel}
                                        >
                                            Cancel
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
                                            Edit
                                        </S.Button>
                                        <S.Button
                                            $small
                                            $danger
                                            onClick={() => handleDeleteCategory(category._id)}
                                        >
                                            Delete
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