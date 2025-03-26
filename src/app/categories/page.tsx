// app/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import CategoryForm from './components/CategoryForm';
import CategoryList from './components/CategoryList';
import * as S from './styles';

export default function Categories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = (newCategory: any) => {
        setCategories([newCategory, ...categories]);
    };

    const handleUpdateCategory = (updatedCategory: any) => {
        setCategories(categories.map(cat =>
            cat._id === updatedCategory._id ? updatedCategory : cat
        ));
    };

    const handleDeleteCategory = (id: string) => {
        setCategories(categories.filter(cat => cat._id !== id));
    };

    return (
        <S.PageContainer>
            <S.Title>Manage Categories</S.Title>

            {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

            <S.Section>
                <S.SectionTitle>Add New Category</S.SectionTitle>
                <CategoryForm onAdd={handleAddCategory} />
            </S.Section>

            <S.Section>
                <S.SectionTitle>Existing Categories</S.SectionTitle>
                {loading ? (
                    <S.LoadingIndicator>Loading...</S.LoadingIndicator>
                ) : (
                    <CategoryList
                        categories={categories}
                        onUpdate={handleUpdateCategory}
                        onDelete={handleDeleteCategory}
                    />
                )}
            </S.Section>
        </S.PageContainer>
    );
}