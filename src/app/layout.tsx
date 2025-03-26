'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Sidebar } from './components/Sidebar';
import { GlobalStyle } from './styles/global';
import { darkTheme, lightTheme } from './styles/theme';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(lightTheme);
  const pathname = usePathname();

  const isLoginPage = pathname.includes("login")

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
              {!isLoginPage && <Sidebar toggleTheme={toggleTheme} />}
              <div style={{ flex: 1 }}>{children}</div>
            </div>
          </QueryClientProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}