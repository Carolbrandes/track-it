'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { CookieConsent } from './components/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { DateFormatProvider } from './contexts/DateFormatContext';
import { ThemeProvider } from './hooks/useTheme';
import { LanguageProvider } from './i18n/LanguageContext';
import { cn } from './lib/cn';

const queryClient = new QueryClient();

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const isPublicPage = pathname?.includes("login") || pathname?.includes("terms") || false;

    return (
        <ThemeProvider>
            <LanguageProvider>
                <DateFormatProvider>
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
                </DateFormatProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
