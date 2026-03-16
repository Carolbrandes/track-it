import { Metadata } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://trackit.app';

export const metadata: Metadata = {
  title: 'Entrar',
  description:
    'Acesse o Track It com seu e-mail e comece a controlar suas finanças com inteligência artificial. Sem senha, sem complicação.',
  alternates: {
    canonical: `${APP_URL}/login`,
  },
  openGraph: {
    title: 'Entrar no Track It',
    description:
      'Acesse sua conta e controle suas finanças com IA. Registre gastos, escaneie comprovantes e obtenha insights automáticos.',
    url: `${APP_URL}/login`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Track It',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web, Android, iOS',
  description:
    'App de gestão financeira pessoal com IA integrada para controle de gastos, análise de transações, scanner de comprovantes e insights automáticos.',
  url: APP_URL,
  image: `${APP_URL}/piggy-bank.png`,
  author: {
    '@type': 'Person',
    name: 'Carolina Marques Brandes',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'Controle de gastos e receitas',
    'Scanner de comprovantes com IA',
    'Insights financeiros automáticos',
    'Categorização de transações',
    'Relatórios e gráficos analíticos',
    'Suporte a múltiplas moedas (BRL, PYG, USD)',
    'Exportação de dados em CSV e PDF',
    'Tema claro e escuro',
    'Suporte multilíngue (PT, ES, EN)',
  ],
  inLanguage: ['pt-BR', 'es', 'en'],
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
