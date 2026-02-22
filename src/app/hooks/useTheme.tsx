'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { DefaultTheme, ThemeProvider as StyledThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../styles/theme';

interface ThemeProviderProps {
    children: ReactNode;
}

interface ThemeContextProps {
    theme: DefaultTheme;
    toggleTheme: () => void;
    isLightTheme: boolean;
}

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<DefaultTheme>(lightTheme);
    const isLightTheme = theme === lightTheme;

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme === 'light' ? lightTheme : darkTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = isLightTheme ? darkTheme : lightTheme;
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme === lightTheme ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isLightTheme }}>
            <StyledThemeProvider theme={theme}>
                {children}
            </StyledThemeProvider>
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