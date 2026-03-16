import { Metadata } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://trackit.app';

export const metadata: Metadata = {
  title: 'Termos de Uso e Política de Privacidade',
  description:
    'Leia os Termos de Uso e a Política de Privacidade do Track It. Saiba como seus dados são coletados, armazenados e protegidos.',
  alternates: {
    canonical: `${APP_URL}/terms`,
  },
  robots: {
    index: true,
    follow: false,
  },
  openGraph: {
    title: 'Termos de Uso e Política de Privacidade | Track It',
    description:
      'Entenda como o Track It coleta, armazena e protege seus dados pessoais e financeiros.',
    url: `${APP_URL}/terms`,
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
