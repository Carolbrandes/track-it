'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser } from 'react-icons/fi';
import { useTranslation, localeLabels } from '../i18n/LanguageContext';
import { useUserData } from '../hooks/useUserData';
import { useCurrency } from '../hooks/useCurrency';
import * as S from '../styles/shared';

export default function MyDataPage() {
    const { t, locale } = useTranslation();
    const router = useRouter();
    const { data: user, isLoading: userLoading } = useUserData();
    const { currencies } = useCurrency();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const currencyName = user?.currencyId && currencies.length > 0
        ? currencies.find((c) => c._id === user.currencyId)?.name ?? user.currencyId
        : '—';

    const themeLabel = user?.selectedTheme === 'dark' ? t.myData.themeDark : t.myData.themeLight;
    const languageLabel = localeLabels[locale] ?? locale;

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            const res = await fetch('/api/user/delete-account', { method: 'DELETE', credentials: 'include' });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setDeleteError(data.message ?? t.myData.deleteError);
                setIsDeleting(false);
                return;
            }
            await fetch('/api/logout', { method: 'POST', credentials: 'include' });
            router.push('/login');
            return;
        } catch {
            setDeleteError(t.myData.deleteError);
        } finally {
            setIsDeleting(false);
        }
    };

    if (userLoading) {
        return (
            <S.PageContainer>
                <S.Title>{t.myData.title}</S.Title>
                <S.LoadingIndicator>Carregando...</S.LoadingIndicator>
            </S.PageContainer>
        );
    }
    if (!user) {
        return (
            <S.PageContainer>
                <S.Title>{t.myData.title}</S.Title>
                <S.LoadingIndicator>—</S.LoadingIndicator>
            </S.PageContainer>
        );
    }

    return (
        <S.PageContainer>
            <S.Title style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiUser size={24} />
                {t.myData.title}
            </S.Title>

            <S.Section>
                <DataRow label={t.myData.email} value={user.email ?? '—'} />
                <DataRow label={t.myData.language} value={languageLabel} />
                <DataRow label={t.myData.currency} value={currencyName} />
                <DataRow label={t.myData.theme} value={themeLabel} />
            </S.Section>

            <S.Section>
                <S.SectionTitle>{t.myData.deleteAccount}</S.SectionTitle>
                <p style={{ color: 'var(--color-text-secondary, #666)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                    {t.myData.confirmDelete.split('.')[0]}.
                </p>
                {showConfirm ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
                        <p style={{ color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>
                            {t.myData.confirmDelete}
                        </p>
                        {deleteError && <S.ErrorMessage>{deleteError}</S.ErrorMessage>}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <S.Button
                                $danger
                                $disabled={isDeleting}
                                onClick={handleDeleteAccount}
                            >
                                {isDeleting ? t.myData.deleting : t.myData.deleteAccount}
                            </S.Button>
                            <S.Button
                                $disabled={isDeleting}
                                onClick={() => { setShowConfirm(false); setDeleteError(null); }}
                            >
                                {t.myData.cancel}
                            </S.Button>
                        </div>
                    </div>
                ) : (
                    <S.Button $danger onClick={() => setShowConfirm(true)}>
                        {t.myData.deleteAccount}
                    </S.Button>
                )}
            </S.Section>
        </S.PageContainer>
    );
}

function DataRow({ label, value }: Readonly<{ label: string; value: string }>) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--color-gray-300, #e5e7eb)',
        }}>
            <S.Label style={{ margin: 0 }}>{label}</S.Label>
            <span style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>{value}</span>
        </div>
    );
}
