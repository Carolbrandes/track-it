'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Montserrat } from 'next/font/google';
import { usePathname } from 'next/navigation';
import StyledComponentsRegistry from '../../StyledComponentsRegistry';
import { CookieConsent } from './components/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './hooks/useTheme';
import { LanguageProvider } from './i18n/LanguageContext';
import * as S from "./styles";
import { GlobalStyle } from './styles/global';

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicPage = pathname?.includes("login") || pathname?.includes("terms") || false;

    return (
        <ThemeProvider>
            <LanguageProvider>
                <html lang="en" className={montserrat.className}>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    </head>
                    <body>
                        <GlobalStyle />
                        <QueryClientProvider client={queryClient}>
                            <StyledComponentsRegistry>
                                <ErrorBoundary>
                                    <S.PageLayoutContainer $isLoginPage={isPublicPage}>
                                        {!isPublicPage && <Sidebar />}
                                        {children}
                                    </S.PageLayoutContainer>
                                </ErrorBoundary>
                                <CookieConsent />
                            </StyledComponentsRegistry>
                        </QueryClientProvider>
                    </body>
                </html>
            </LanguageProvider>
        </ThemeProvider>
    );
}