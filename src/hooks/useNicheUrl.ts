import { useCallback } from 'react';
import { useNiche } from '@/contexts/NicheContext';

/**
 * Hook to get niche-aware URLs for links and navigation
 */
export function useNicheUrl() {
  const { niche, nicheSlug } = useNiche();
  
  /**
   * Generate a full URL with the correct subdomain for the current niche
   */
  const getFullUrl = useCallback((path: string) => {
    if (typeof window === 'undefined') {
      return path;
    }
    
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    
    // For development, keep the same host
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `${protocol}//${window.location.hostname}${port}${path}?niche=${nicheSlug}`;
    }
    
    return `${protocol}//${niche.domain}${path}`;
  }, [niche, nicheSlug]);
  
  /**
   * Generate a category URL for the current niche
   */
  const getCategoryUrl = useCallback((categorySlug: string) => {
    return `/${categorySlug}`;
  }, []);
  
  /**
   * Generate a problem URL for the current niche
   */
  const getProblemUrl = useCallback((categorySlug: string, problemSlug: string) => {
    return `/${categorySlug}/${problemSlug}`;
  }, []);
  
  return {
    getFullUrl,
    getCategoryUrl,
    getProblemUrl,
  };
}

/**
 * Hook to filter content by the current niche
 */
export function useNicheFilter() {
  const { nicheSlug } = useNiche();
  
  /**
   * Filter items that belong to the current niche
   */
  const filterByNiche = useCallback(<T extends { niche?: string | null }>(items: T[]): T[] => {
    // If we're on the default niche, show all items without a niche OR with 'default' niche
    if (nicheSlug === 'default') {
      return items.filter(item => !item.niche || item.niche === 'default' || item.niche === 'tech');
    }
    
    // Otherwise, only show items that match the current niche
    return items.filter(item => item.niche === nicheSlug);
  }, [nicheSlug]);
  
  return { filterByNiche, currentNiche: nicheSlug };
}

