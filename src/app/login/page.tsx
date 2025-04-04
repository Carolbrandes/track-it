'use client';

import { useState } from 'react';
import { TbPigMoney } from "react-icons/tb";
import { Spinner } from '../components/Spinner';
import styles from '../styles/Login.module.scss'; // Importando o SCSS Module

export default function Login() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendCode = async () => {
        try {
            setIsLoading(true);

            const res = await fetch('/api/auth/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setIsCodeSent(true);
            }
        } catch (error) {
            console.error("🚀 ~ handleSendCode ~ error:", error);
        } finally {
            setIsLoading(false);
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
        <div className={styles.loginContainer}>
            <header className={styles.loginHeader}>
                <TbPigMoney size={45} />
                <h1>Track It</h1>
            </header>

            <div className={styles.loginBox}>
                <h1 className={styles.title}>Login</h1>
                <input
                    className={styles.input}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {isCodeSent ? (
                    <>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button className={styles.button} onClick={handleVerifyCode}>
                            {isLoading ? <Spinner /> : 'Verify Code'}
                        </button>
                    </>
                ) : (
                    <button className={styles.button} onClick={handleSendCode}>
                        {isLoading ? <Spinner /> : 'Send Code'}
                    </button>
                )}
            </div>
        </div>
    );
}