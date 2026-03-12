import { NicheConfig } from './types';

// Default niche for main domain (fixon.com, fixon.lovable.app, localhost)
export const defaultNiche: NicheConfig = {
  id: 'default',
  slug: 'default',
  name: 'Fix-On',
  displayName: 'Fix-On',
  domain: 'fixon.com',
  theme: {
    primaryColor: '217 91% 60%', // Blue
    primaryColorHex: '#3B82F6',
    gradientFrom: '217 91% 60%',
    gradientTo: '263 70% 50%',
    accentColor: '263 70% 50%',
  },
  seo: {
    title: 'Fix-On - Resolva Problemas Rápido',
    description: 'Soluções rápidas e simples para seus problemas do dia a dia. Tecnologia, saúde, carro e casa.',
    keywords: ['solução', 'problema', 'tutorial', 'como resolver', 'passo a passo', 'dica'],
    ogImage: '/og-default.png',
  },
  monetization: {
    affiliateLinks: {},
    leadCaptureEnabled: true,
  },
  categories: [
    { id: 'celular', name: 'Celular', slug: 'celular', icon: 'smartphone', description: 'Problemas com celular' },
    { id: 'computador', name: 'Computador', slug: 'computador', icon: 'monitor', description: 'Problemas com PC' },
    { id: 'internet', name: 'Internet', slug: 'internet', icon: 'wifi', description: 'Problemas de conexão' },
    { id: 'aplicativos', name: 'Aplicativos', slug: 'aplicativos', icon: 'app-window', description: 'Problemas com apps' },
    { id: 'casa', name: 'Casa', slug: 'casa', icon: 'home', description: 'Problemas domésticos e manutenção' },
    { id: 'carro', name: 'Carro', slug: 'carro', icon: 'car', description: 'Problemas automotivos' },
    { id: 'saude', name: 'Saúde', slug: 'saude', icon: 'heart-pulse', description: 'Dicas de saúde e bem-estar' },
    { id: 'financas', name: 'Finanças', slug: 'financas', icon: 'wallet', description: 'Problemas financeiros e dicas' },
  ],
  heroTitle: 'Qual problema você quer resolver agora?',
  heroSubtitle: 'Soluções rápidas e simples para seus problemas do dia a dia',
  contentTypes: ['tutorial', 'troubleshooting', 'how-to', 'faq'],
  language: 'pt-BR',
  enabled: true,
};
