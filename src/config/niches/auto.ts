import { NicheConfig } from './types';

export const autoNiche: NicheConfig = {
  id: 'auto',
  slug: 'auto',
  name: 'Auto',
  displayName: 'Fix-On Auto',
  domain: 'auto.fixon.com',
  theme: {
    primaryColor: '25 95% 53%', // Orange
    primaryColorHex: '#F97316',
    gradientFrom: '25 95% 53%',
    gradientTo: '38 92% 50%',
    accentColor: '38 92% 50%',
  },
  seo: {
    title: 'Fix-On Auto - Soluções Rápidas para seu Carro',
    description: 'Resolva problemas do seu carro de forma simples. Dicas de manutenção, diagnóstico de falhas e tutoriais automotivos.',
    keywords: ['carro', 'moto', 'manutenção', 'mecânica', 'problema', 'não liga', 'barulho'],
    ogImage: '/og-auto.png',
  },
  monetization: {
    adsenseId: 'ca-pub-auto-xxxxxxxxxx',
    affiliateLinks: {
      autozone: 'https://autozone.com.br/?ref=fixon-auto',
      mercadolivre: 'https://mercadolivre.com.br/autopecas?ref=fixon-auto',
    },
    leadCaptureEnabled: true,
  },
  categories: [
    { id: 'motor', name: 'Motor', slug: 'motor', icon: 'cog', description: 'Problemas no motor' },
    { id: 'eletrica', name: 'Elétrica', slug: 'eletrica', icon: 'zap', description: 'Problemas elétricos' },
    { id: 'freios', name: 'Freios', slug: 'freios', icon: 'circle-stop', description: 'Problemas nos freios' },
    { id: 'pneus', name: 'Pneus', slug: 'pneus', icon: 'circle', description: 'Problemas com pneus' },
  ],
  heroTitle: 'Qual problema do seu carro você quer resolver agora?',
  heroSubtitle: 'Diagnósticos rápidos e soluções práticas para seu veículo',
  contentTypes: ['diagnostic', 'maintenance', 'repair', 'tip'],
  language: 'pt-BR',
  enabled: true,
};
