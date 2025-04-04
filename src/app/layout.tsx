'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './hooks/useTheme';
import * as S from "./styles";
import { GlobalStyle } from './styles/global';
import './styles/global.scss';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("login") || false;

  return (
    <ThemeProvider>
      <html lang="en">
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <body>
          <GlobalStyle />
          <QueryClientProvider client={queryClient}>
            <S.PageLayoutContainer>
              {!isLoginPage && <Sidebar />}

              {children}
            </S.PageLayoutContainer>

          </QueryClientProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}