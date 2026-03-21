'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser } from 'react-icons/fi';
import { useDateFormat, type DateFormatPreference } from '../contexts/DateFormatContext';
import { useTranslation, localeLabels } from '../i18n/LanguageContext';
import { useUserData } from '../hooks/useUserData';
import { useCurrency } from '../hooks/useCurrency';
import { authFetch } from '@/app/lib/authFetch';
import { cn } from '@/app/lib/cn';

export default function MyDataPage() {
    const { t, locale } = useTranslation();
    const router = useRouter();
    const { data: user, isLoading: userLoading } = useUserData();
    const { currencies } = useCurrency();
    const { dateFormat, setDateFormat } = useDateFormat();
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
            const res = await authFetch('/api/user/delete-account', { method: 'DELETE', credentials: 'include' });
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
            <div className="p-4 w-full min-w-0 overflow-x-hidden flex-1 md:p-8 md:max-w-[1400px] md:mx-auto">
                <h1 className="text-[1.75rem] mb-8 text-text-primary">{t.myData.title}</h1>
                <div className="text-center p-8 text-lg text-text-secondary">Carregando...</div>
            </div>
        );
    }
    if (!user) {
        return (
            <div className="p-4 w-full min-w-0 overflow-x-hidden flex-1 md:p-8 md:max-w-[1400px] md:mx-auto">
                <h1 className="text-[1.75rem] mb-8 text-text-primary">{t.myData.title}</h1>
                <div className="text-center p-8 text-lg text-text-secondary">—</div>
            </div>
        );
    }

    return (
        <div className="p-4 w-full min-w-0 overflow-x-hidden flex-1 md:p-8 md:max-w-[1400px] md:mx-auto">
            <h1 className="text-[1.75rem] mb-8 text-text-primary flex items-center gap-2">
                <FiUser size={24} />
                {t.myData.title}
            </h1>

            <div className="mb-8">
                <DataRow label={t.myData.email} value={user.email ?? '—'} />
                <DataRow label={t.myData.language} value={languageLabel} />
                <DataRow label={t.myData.currency} value={currencyName} />
                <DataRow label={t.myData.theme} value={themeLabel} />
                <div className="flex flex-col gap-1 mb-4 pb-4 border-b border-gray-300">
                    <span className="font-semibold text-sm text-text-secondary">{t.myData.dateFormat}</span>
                    <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value as DateFormatPreference)}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-base max-w-[280px]"
                    >
                        <option value="mm/dd/yyyy">{t.myData.dateFormatMmDd}</option>
                        <option value="dd/mm/yyyy">{t.myData.dateFormatDdMm}</option>
                        <option value="long">{t.myData.dateFormatLong}</option>
                    </select>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl mb-6 text-text-primary">{t.myData.deleteAccount}</h2>
                <p className="text-text-secondary mb-4 text-[0.95rem]">
                    {t.myData.confirmDelete.split('.')[0]}.
                </p>
                {showConfirm ? (
                    <div className="flex flex-col gap-3 max-w-[320px]">
                        <p className="text-text-primary text-[0.9rem]">
                            {t.myData.confirmDelete}
                        </p>
                        {deleteError && (
                            <div className="text-danger bg-surface p-4 rounded-lg mb-4 border border-danger">
                                {deleteError}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                className={cn(
                                    "px-5 py-2.5 border-none rounded-lg cursor-pointer transition-all duration-200 w-fit font-medium hover:opacity-85",
                                    "bg-danger text-white",
                                    isDeleting && "cursor-not-allowed opacity-70"
                                )}
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                {isDeleting ? t.myData.deleting : t.myData.deleteAccount}
                            </button>
                            <button
                                className={cn(
                                    "px-5 py-2.5 border-none rounded-lg cursor-pointer transition-all duration-200 w-fit font-medium hover:opacity-85",
                                    "bg-gray-300 text-inherit",
                                    isDeleting && "cursor-not-allowed opacity-70"
                                )}
                                onClick={() => { setShowConfirm(false); setDeleteError(null); }}
                                disabled={isDeleting}
                            >
                                {t.myData.cancel}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className="px-5 py-2.5 border-none rounded-lg cursor-pointer transition-all duration-200 w-fit font-medium hover:opacity-85 bg-danger text-white"
                        onClick={() => setShowConfirm(true)}
                    >
                        {t.myData.deleteAccount}
                    </button>
                )}
            </div>
        </div>
    );
}

function DataRow({ label, value }: Readonly<{ label: string; value: string }>) {
    return (
        <div className="flex flex-col gap-1 mb-4 pb-4 border-b border-gray-300">
            <span className="font-semibold text-sm text-text-secondary">{label}</span>
            <span className="text-base text-text-primary">{value}</span>
        </div>
    );
}
