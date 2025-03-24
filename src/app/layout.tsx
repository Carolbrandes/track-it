'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Sidebar } from './components/Sidebar';
import { GlobalStyle } from './styles/global';
import { darkTheme, lightTheme } from './styles/theme';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(lightTheme);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        console.log("🚀 ~ checkAuth ~ data:", data)
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('Erro ao verificar login:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme === lightTheme ? 'light' : 'dark');
  };

  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        </Head>

        <body>
          <GlobalStyle />
          <QueryClientProvider client={queryClient}>
            <div style={{ display: 'flex' }}>
              {/* Renderizar a Sidebar apenas se o usuário estiver logado */}
              {isLoggedIn && <Sidebar toggleTheme={toggleTheme} />}
              <div style={{ flex: 1 }}>{children}</div>
            </div>
          </QueryClientProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}