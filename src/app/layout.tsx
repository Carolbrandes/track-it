import { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import ClientLayout from './ClientLayout';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://trackit.app';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: 'Track It - Gestão Financeira Inteligente',
    template: '%s | Track It',
  },

  description:
    'Track It é o app de controle financeiro pessoal com IA integrada. Registre gastos, escaneie comprovantes, obtenha insights automáticos e tome decisões financeiras mais inteligentes.',

  keywords: [
    'finanças pessoais',
    'controle de gastos',
    'controle financeiro',
    'gestão financeira',
    'gestão mensal',
    'planejamento financeiro',
    'inteligência artificial finanças',
    'app de finanças',
    'track it',
    'economia pessoal',
    'controle de despesas',
    'receitas e despesas',
    'orçamento pessoal',
    'scanner de comprovantes',
    'insights financeiros',
  ],

  authors: [{ name: 'Carolina Marques Brandes' }],
  creator: 'Carolina Marques Brandes',
  publisher: 'Track It',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    siteName: 'Track It',
    title: 'Track It - Gestão Financeira Inteligente',
    description:
      'Controle seus gastos, escaneie comprovantes com IA e obtenha insights financeiros automáticos. Tudo em um só lugar.',
    locale: 'pt_BR',
    alternateLocale: ['es_PY', 'en_US'],
    url: APP_URL,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Track It - App de Gestão Financeira com IA',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Track It - Gestão Financeira Inteligente',
    description:
      'Controle seus gastos, escaneie comprovantes com IA e obtenha insights financeiros automáticos.',
    images: ['/og-image.png'],
  },

  icons: {
    icon: '/piggy-bank.png',
    shortcut: '/piggy-bank.png',
    apple: '/piggy-bank.png',
  },

  alternates: {
    canonical: APP_URL,
    languages: {
      'pt-BR': `${APP_URL}/login`,
      'es-PY': `${APP_URL}/login`,
      'en-US': `${APP_URL}/login`,
    },
  },

  category: 'finance',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={montserrat.className}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}