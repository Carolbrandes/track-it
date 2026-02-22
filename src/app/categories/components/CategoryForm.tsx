'use client';
import { useState } from 'react';
import Form, { FormField } from '../../components/Form';
import { useTranslation } from '../../i18n/LanguageContext';
import { Toast } from '../../components/Toast';

export default function CategoryForm({ onAdd }: { onAdd: (name: string) => void }) {
    const { t } = useTranslation();
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
            setSuccessMsg(t.categories.success);

            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (error: unknown) {
            let errorMessage = 'Failed on operation';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleName = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setName(event.target.value)


    const fields: FormField[] = [
        {
            label: t.categories.categoryName,
            type: 'text' as const,
            name: 'name',
            value: name,
            onChange: handleName,
            required: true,
            placeholder: t.categories.namePlaceholder
        }
    ];
    return (
        <>
            <Form
                fields={fields}
                onSubmit={handleSubmit}
                submitText={isSubmitting ? t.categories.adding : t.categories.addButton}
                isSubmitting={isSubmitting}
                error={error}
            />

            {successMsg && <Toast type='success' message={successMsg} />}
        </>
    );
}