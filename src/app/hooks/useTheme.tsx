'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface ThemeProviderProps {
    children: ReactNode;
}

interface ThemeContextProps {
    toggleTheme: () => void;
    isLightTheme: boolean;
}

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [isLight, setIsLight] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsLight(false);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const next = !isLight;
        setIsLight(next);
        if (next) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <ThemeContext.Provider value={{ toggleTheme, isLightTheme: isLight }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
