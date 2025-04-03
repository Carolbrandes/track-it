'use client';
import { useState } from 'react';
import Form, { FormField } from '../../components/Form';
import { Toast } from '../../components/Toast';

export default function CategoryForm({ onAdd }: { onAdd: (name: string) => void }) {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        setIsSubmitting(true);
        setSuccessMsg(null);

        try {
            await onAdd(name);
            setName('');
            setSuccessMsg('Category successfully registered!');

            setTimeout(() => setSuccessMsg(null), 3000);
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
        <>
            <Form
                fields={fields}
                onSubmit={handleSubmit}
                submitText={isSubmitting ? 'Adding...' : 'Add Category'}
                isSubmitting={isSubmitting}
                error={error}
            />

            {successMsg && <Toast type='success' message={successMsg} />}
        </>
    );
}