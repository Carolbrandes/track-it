// components/CategoryForm.tsx
'use client';

import { useState } from 'react';
import * as S from '../styles';

export default function CategoryForm({ onAdd }: { onAdd: (category: any) => void }) {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add category');
            }

            const newCategory = await response.json();
            onAdd(newCategory);
            setName('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <S.Form onSubmit={handleSubmit}>
            {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

            <S.FormGroup>
                <S.Label htmlFor="name">Category Name</S.Label>
                <S.Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </S.FormGroup>

            <S.Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Category'}
            </S.Button>
        </S.Form>
    );
}