'use client'

import { useState } from 'react';
import { TbPigMoney } from "react-icons/tb";
import { Spinner } from '../components/Spinner';
import * as S from './styles';

export default function Login() {
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
                credentials: 'include' // Importante para cookies
            });

            const data = await res.json();

            if (data.success) {
                // Forçar recarregamento completo para garantir que o middleware processe o cookie
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
        <S.LoginContainer>
            <S.LoginHeader>
                <TbPigMoney size={45} />
                <h1>Track It </h1>
            </S.LoginHeader>

            <S.LoginBox>
                <S.Title>Login</S.Title>
                <S.Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {isCodeSent ? (
                    <>
                        <S.Input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <S.Button onClick={handleVerifyCode}>{
                            isLoading ? <Spinner /> : 'Verify Code'
                        }</S.Button>
                    </>
                ) : (
                    <S.Button onClick={handleSendCode}>{isLoading ? <Spinner /> : 'Send Code'}</S.Button>
                )}
            </S.LoginBox>
        </S.LoginContainer>
    );
}