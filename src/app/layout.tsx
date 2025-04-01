// app/layout.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './hooks/useTheme';
import { GlobalStyle } from './styles/global';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("login") || false;

  return (
    <ThemeProvider>
      <html lang="en">
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <GlobalStyle />
          <QueryClientProvider client={queryClient}>
            <div style={{ display: 'flex' }}>
              {!isLoginPage && <Sidebar />}
              <div style={{ flex: 1 }}>{children}</div>
            </div>
          </QueryClientProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}