import { NicheConfig } from './types';

export const healthNiche: NicheConfig = {
  id: 'health',
  slug: 'health',
  name: 'Saúde',
  displayName: 'Fix-On Saúde',
  domain: 'health.fixon.com',
  theme: {
    primaryColor: '142 76% 36%', // Green
    primaryColorHex: '#16A34A',
    gradientFrom: '142 76% 36%',
    gradientTo: '168 84% 40%',
    accentColor: '168 84% 40%',
  },
  seo: {
    title: 'Fix-On Saúde - Dicas Rápidas de Saúde e Bem-estar',
    description: 'Soluções práticas para problemas de saúde do dia a dia. Dicas de bem-estar, primeiros socorros e cuidados pessoais.',
    keywords: ['saúde', 'bem-estar', 'dor', 'remédio caseiro', 'cuidados', 'sintomas'],
    ogImage: '/og-health.png',
  },
  monetization: {
    adsenseId: 'ca-pub-health-xxxxxxxxxx',
    affiliateLinks: {
      drogasil: 'https://drogasil.com.br/?ref=fixon-health',
      drogaraia: 'https://drogaraia.com.br/?ref=fixon-health',
    },
    leadCaptureEnabled: true,
  },
  categories: [
    { id: 'dor', name: 'Dores', slug: 'dor', icon: 'heart-pulse', description: 'Alívio para dores comuns' },
    { id: 'digestao', name: 'Digestão', slug: 'digestao', icon: 'apple', description: 'Problemas digestivos' },
    { id: 'pele', name: 'Pele', slug: 'pele', icon: 'sparkles', description: 'Cuidados com a pele' },
    { id: 'sono', name: 'Sono', slug: 'sono', icon: 'moon', description: 'Problemas de sono' },
  ],
  heroTitle: 'Qual problema de saúde você quer resolver agora?',
  heroSubtitle: 'Dicas práticas e soluções para seu bem-estar',
  contentTypes: ['tip', 'remedy', 'symptom', 'prevention'],
  language: 'pt-BR',
  enabled: true,
};
