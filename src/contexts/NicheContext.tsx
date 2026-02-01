import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { NicheConfig, detectNicheFromHost, defaultNiche, getNicheBySlug } from '@/config/niches';

interface NicheContextValue {
  niche: NicheConfig;
  isLoading: boolean;
  nicheSlug: string;
}

const NicheContext = createContext<NicheContextValue | undefined>(undefined);

interface NicheProviderProps {
  children: React.ReactNode;
  overrideNiche?: string; // For testing purposes
}

export function NicheProvider({ children, overrideNiche }: NicheProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  const niche = useMemo(() => {
    if (overrideNiche) {
      return getNicheBySlug(overrideNiche) || defaultNiche;
    }
    
    if (typeof window === 'undefined') {
      return defaultNiche;
    }
    
    return detectNicheFromHost(window.location.hostname);
  }, [overrideNiche]);

  // Apply theme colors when niche changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply primary color from niche theme
    root.style.setProperty('--primary', niche.theme.primaryColor);
    root.style.setProperty('--accent', niche.theme.accentColor || niche.theme.primaryColor);
    root.style.setProperty('--ring', niche.theme.primaryColor);
    
    // Apply sidebar colors
    root.style.setProperty('--sidebar-primary', niche.theme.primaryColor);
    root.style.setProperty('--sidebar-ring', niche.theme.primaryColor);
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-niche', niche.slug);
    
    setIsLoading(false);
  }, [niche]);

  // Update document meta tags for SEO
  useEffect(() => {
    // Update title
    document.title = niche.seo.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', niche.seo.description);
    }
    
    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', niche.seo.title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', niche.seo.description);
    }
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', niche.seo.title);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', niche.seo.description);
    }
  }, [niche]);

  const value = useMemo(() => ({
    niche,
    isLoading,
    nicheSlug: niche.slug,
  }), [niche, isLoading]);

  return (
    <NicheContext.Provider value={value}>
      {children}
    </NicheContext.Provider>
  );
}

export function useNiche() {
  const context = useContext(NicheContext);
  if (context === undefined) {
    throw new Error('useNiche must be used within a NicheProvider');
  }
  return context;
}

// Hook for accessing specific niche config parts
export function useNicheTheme() {
  const { niche } = useNiche();
  return niche.theme;
}

export function useNicheSEO() {
  const { niche } = useNiche();
  return niche.seo;
}

export function useNicheCategories() {
  const { niche } = useNiche();
  return niche.categories;
}

export function useNicheMonetization() {
  const { niche } = useNiche();
  return niche.monetization;
}
