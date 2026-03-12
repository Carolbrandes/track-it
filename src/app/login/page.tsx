'use client'

import Link from 'next/link';
import { useState } from 'react';
import { TbPigMoney } from "react-icons/tb";
import { Spinner } from '../components/Spinner';
import { useTranslation } from '../i18n/LanguageContext';

export default function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false)


    const handleSendCode = async () => {
        try {
            setIsLoading(true)

            const res = await fetch('/api/auth/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setIsCodeSent(true);
            }

        } catch (error) {
            console.error("🚀 ~ handleSendCode ~ error:", error)

        } finally {
            setIsLoading(false)
        }
    };


    const handleVerifyCode = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
                credentials: 'include'
            });

            const data = await res.json();

            if (data.success) {
                window.location.href = '/';
            } else {
                alert(data.message || 'Erro ao verificar código.');
            }
        } catch (error) {
            console.error('Erro ao verificar código:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-background">
            <header className="flex flex-col items-center text-primary">
                <TbPigMoney size={45} />
                <h1 className="mt-2">Track It </h1>
            </header>

            <div className="flex flex-col items-center p-8 rounded-2xl bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-300 w-full max-w-[400px]">
                <h1 className="text-2xl text-text-primary mb-5">{t.login.title}</h1>
                <input
                    className="w-full px-3.5 py-2.5 my-1.5 rounded-[10px] border border-gray-300 bg-background text-text-primary font-[inherit] text-[0.95rem] placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]"
                    type="email"
                    placeholder={t.login.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {isCodeSent ? (
                    <>
                        <input
                            className="w-full px-3.5 py-2.5 my-1.5 rounded-[10px] border border-gray-300 bg-background text-text-primary font-[inherit] text-[0.95rem] placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]"
                            type="text"
                            placeholder={t.login.codePlaceholder}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button
                            className="w-full h-11 px-2.5 mt-2 rounded-[10px] bg-primary border-none text-white font-semibold text-[0.95rem] font-[inherit] cursor-pointer transition-opacity duration-200 flex items-center justify-center gap-2 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={handleVerifyCode}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner /> {t.login.verifyingCode}
                                </>
                            ) : (
                                t.login.verifyCode
                            )}
                        </button>
                    </>
                ) : (
                    <button
                        className="w-full h-11 px-2.5 mt-2 rounded-[10px] bg-primary border-none text-white font-semibold text-[0.95rem] font-[inherit] cursor-pointer transition-opacity duration-200 flex items-center justify-center gap-2 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={handleSendCode}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner /> {t.login.sendingCode}
                            </>
                        ) : (
                            t.login.sendCode
                        )}
                    </button>
                )}
            </div>
            <Link
                className="mt-5 text-xs text-text-secondary no-underline hover:text-primary hover:underline"
                href="/terms"
            >
                {t.terms.pageTitle}
            </Link>
        </div>
    );
}
