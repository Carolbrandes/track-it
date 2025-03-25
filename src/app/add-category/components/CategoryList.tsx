'use client';

import { useState } from 'react';
import * as S from '../styles';

export default function CategoryList({
    categories,
    onUpdate,
    onDelete,
}: {
    categories: any[];
    onUpdate: (category: any) => void;
    onDelete: (id: string) => void;
}) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleEdit = (category: any) => {
        setEditingId(category._id);
        setEditName(category.name);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleUpdate = async (id: string) => {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: editName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update category');
            }

            const updatedCategory = await response.json();
            onUpdate(updatedCategory);
            setEditingId(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            onDelete(id);
        } catch (err: any) {
            setError(err.message);
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
                                            onClick={() => handleUpdate(category._id)}
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
                                            onClick={() => handleDelete(category._id)}
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