'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Montserrat } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { CookieConsent } from './components/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { DateFormatProvider } from './contexts/DateFormatContext';
import { ThemeProvider } from './hooks/useTheme';
import { LanguageProvider } from './i18n/LanguageContext';
import { cn } from './lib/cn';
import './globals.css';

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
                <DateFormatProvider>
                <html lang="en" className={montserrat.className}>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    </head>
                    <body>
                        <QueryClientProvider client={queryClient}>
                            <ErrorBoundary>
                                <div className={cn(
                                    "flex flex-col min-h-screen bg-background",
                                    isPublicPage ? "justify-center" : "justify-start pt-[60px]"
                                )}>
                                    {!isPublicPage && <Sidebar />}
                                    {children}
                                </div>
                            </ErrorBoundary>
                            <CookieConsent />
                        </QueryClientProvider>
                    </body>
                </html>
                </DateFormatProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
