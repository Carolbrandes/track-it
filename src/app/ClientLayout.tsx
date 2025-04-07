'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import StyledComponentsRegistry from '../../StyledComponentsRegistry';
import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './hooks/useTheme';
import * as S from "./styles";
import { GlobalStyle } from './styles/global';

const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname?.includes("login") || false;

    return (
        <ThemeProvider>
            <html lang="en">
                <head>
                    {/* Fonts and viewport meta */}
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </head>
                <body>
                    <GlobalStyle />
                    <QueryClientProvider client={queryClient}>
                        <StyledComponentsRegistry>
                            <S.PageLayoutContainer>
                                {!isLoginPage && <Sidebar />}
                                {children}
                            </S.PageLayoutContainer>
                        </StyledComponentsRegistry>
                    </QueryClientProvider>
                </body>
            </html>
        </ThemeProvider>
    );
}