import { NicheConfig } from './types';

export const techNiche: NicheConfig = {
  id: 'tech',
  slug: 'tech',
  name: 'Tech',
  displayName: 'Fix-On Tech',
  domain: 'tech.fixon.com',
  theme: {
    primaryColor: '217 91% 60%', // Blue
    primaryColorHex: '#3B82F6',
    gradientFrom: '217 91% 60%',
    gradientTo: '263 70% 50%',
    accentColor: '263 70% 50%',
  },
  seo: {
    title: 'Fix-On Tech - Soluções Rápidas para Tecnologia',
    description: 'Resolva problemas de celular, computador, internet e aplicativos de forma rápida e fácil. Tutoriais simples e passo a passo.',
    keywords: ['celular', 'computador', 'internet', 'tecnologia', 'tutorial', 'como resolver', 'problema'],
    ogImage: '/og-tech.png',
  },
  monetization: {
    adsenseId: 'ca-pub-tech-xxxxxxxxxx',
    affiliateLinks: {
      amazon: 'https://amazon.com.br/?tag=fixon-tech-20',
      mercadolivre: 'https://mercadolivre.com.br/?ref=fixon-tech',
    },
    leadCaptureEnabled: true,
  },
  categories: [
    { id: 'celular', name: 'Celular', slug: 'celular', icon: 'smartphone', description: 'Problemas com celular e smartphone' },
    { id: 'computador', name: 'Computador', slug: 'computador', icon: 'monitor', description: 'Problemas com PC e notebook' },
    { id: 'internet', name: 'Internet', slug: 'internet', icon: 'wifi', description: 'Problemas de conexão e rede' },
    { id: 'aplicativos', name: 'Aplicativos', slug: 'aplicativos', icon: 'app-window', description: 'Problemas com apps e software' },
  ],
  heroTitle: 'Qual problema de tecnologia você quer resolver agora?',
  heroSubtitle: 'Soluções rápidas e simples para seus problemas de tecnologia',
  contentTypes: ['tutorial', 'troubleshooting', 'how-to', 'faq'],
  language: 'pt-BR',
  enabled: true,
};
