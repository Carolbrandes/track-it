'use client'; // Mark this component as a Client Component

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const router = useRouter();

    const handleSendCode = async () => {
        const res = await fetch('/api/auth/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (res.ok) {
            setIsCodeSent(true);
        }
    };

    const handleVerifyCode = async () => {
        const res = await fetch('/api/auth/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });
        if (res.ok) {
            router.push('/');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {isCodeSent ? (
                <>
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={handleVerifyCode}>Verify Code</button>
                </>
            ) : (
                <button onClick={handleSendCode}>Send Code</button>
            )}
        </div>
    );
}