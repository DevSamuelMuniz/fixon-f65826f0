// Multi-tenant niche configuration types

export interface NicheCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

export interface NicheSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface NicheMonetization {
  adsenseId?: string;
  affiliateLinks?: Record<string, string>;
  leadCaptureEnabled?: boolean;
}

export interface NicheTheme {
  primaryColor: string; // HSL format: "217 91% 60%"
  primaryColorHex: string; // For external use
  gradientFrom: string;
  gradientTo: string;
  accentColor?: string;
}

export interface NicheConfig {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  domain: string; // e.g., "tech.fixon.com"
  theme: NicheTheme;
  seo: NicheSEO;
  monetization: NicheMonetization;
  categories: NicheCategory[];
  heroTitle: string;
  heroSubtitle: string;
  contentTypes: string[];
  language: string;
  enabled: boolean;
}

export type NicheSlug = 'tech' | 'health' | 'auto' | 'casa' | 'default';
