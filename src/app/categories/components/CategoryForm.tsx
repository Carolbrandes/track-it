// app/categories/components/CategoryForm.tsx
'use client';
import { useState } from 'react';
import Form, { FormField } from '../../components/Form';

export default function CategoryForm({ onAdd }: { onAdd: (name: string) => void }) {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setError(null);
        setIsSubmitting(true);

        try {
            await onAdd(name);
            setName('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fields: FormField[] = [
        {
            label: 'Category Name',
            type: 'text' as const,
            name: 'name',
            value: name,
            onChange: setName,
            required: true,
            placeholder: 'Enter category name'
        }
    ];
    return (
        <Form
            fields={fields}
            onSubmit={handleSubmit}
            submitText={isSubmitting ? 'Adding...' : 'Add Category'}
            isSubmitting={isSubmitting}
            error={error}
        />
    );
}