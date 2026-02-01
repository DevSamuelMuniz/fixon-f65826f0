import { NicheConfig } from './types';

export const casaNiche: NicheConfig = {
  id: 'casa',
  slug: 'casa',
  name: 'Casa',
  displayName: 'Fix-On Casa',
  domain: 'casa.fixon.com',
  theme: {
    primaryColor: '263 70% 50%', // Purple
    primaryColorHex: '#8B5CF6',
    gradientFrom: '263 70% 50%',
    gradientTo: '280 65% 60%',
    accentColor: '280 65% 60%',
  },
  seo: {
    title: 'Fix-On Casa - Soluções Rápidas para sua Casa',
    description: 'Resolva problemas domésticos de forma simples. Dicas de reparos, manutenção e melhorias para sua casa.',
    keywords: ['casa', 'reparo', 'elétrica', 'hidráulica', 'manutenção', 'conserto', 'DIY'],
    ogImage: '/og-casa.png',
  },
  monetization: {
    adsenseId: 'ca-pub-casa-xxxxxxxxxx',
    affiliateLinks: {
      leroymerlin: 'https://leroymerlin.com.br/?ref=fixon-casa',
      telhanorte: 'https://telhanorte.com.br/?ref=fixon-casa',
    },
    leadCaptureEnabled: true,
  },
  categories: [
    { id: 'eletrica', name: 'Elétrica', slug: 'eletrica', icon: 'zap', description: 'Problemas elétricos' },
    { id: 'hidraulica', name: 'Hidráulica', slug: 'hidraulica', icon: 'droplets', description: 'Problemas de encanamento' },
    { id: 'pintura', name: 'Pintura', slug: 'pintura', icon: 'paintbrush', description: 'Pintura e acabamento' },
    { id: 'moveis', name: 'Móveis', slug: 'moveis', icon: 'armchair', description: 'Reparos em móveis' },
  ],
  heroTitle: 'Qual problema da sua casa você quer resolver agora?',
  heroSubtitle: 'Reparos simples e soluções práticas para seu lar',
  contentTypes: ['repair', 'maintenance', 'DIY', 'improvement'],
  language: 'pt-BR',
  enabled: true,
};
