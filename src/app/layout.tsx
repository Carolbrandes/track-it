import { Metadata } from 'next';
import ClientLayout from './ClientLayout'; // Your client-side layout

// This is a Server Component (no 'use client')
export const metadata: Metadata = {
  icons: {
    icon: '/piggy-bank.png',
    shortcut: '/piggy-bank.png',
    apple: '/piggy-bank.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}