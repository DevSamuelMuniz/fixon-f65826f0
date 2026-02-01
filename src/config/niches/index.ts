import { NicheConfig, NicheSlug } from './types';
import { techNiche } from './tech';
import { healthNiche } from './health';
import { autoNiche } from './auto';
import { casaNiche } from './casa';
import { defaultNiche } from './default';

// Re-export individual niches for direct access
export { techNiche, healthNiche, autoNiche, casaNiche, defaultNiche };

// Registry of all available niches
export const nicheRegistry: Record<string, NicheConfig> = {
  tech: techNiche,
  health: healthNiche,
  auto: autoNiche,
  casa: casaNiche,
  default: defaultNiche,
};

// Get all enabled niches
export function getEnabledNiches(): NicheConfig[] {
  return Object.values(nicheRegistry).filter(niche => niche.enabled);
}

// Get niche by slug
export function getNicheBySlug(slug: string): NicheConfig | undefined {
  return nicheRegistry[slug];
}

// Get niche by domain
export function getNicheByDomain(domain: string): NicheConfig | undefined {
  return Object.values(nicheRegistry).find(niche => niche.domain === domain);
}

// Detect niche from hostname
export function detectNicheFromHost(hostname: string): NicheConfig {
  // Remove port if present
  const host = hostname.split(':')[0].toLowerCase();
  
  // Check for subdomain patterns
  // e.g., tech.fixon.com, health.fixon.com
  const subdomainMatch = host.match(/^([a-z]+)\.(fixon\.com|fixon\.lovable\.app)$/);
  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];
    if (nicheRegistry[subdomain]) {
      return nicheRegistry[subdomain];
    }
  }
  
  // Check for preview patterns with niche prefix
  // e.g., tech-preview--xxx.lovable.app
  const previewMatch = host.match(/^([a-z]+)-preview--/);
  if (previewMatch) {
    const prefix = previewMatch[1];
    if (nicheRegistry[prefix]) {
      return nicheRegistry[prefix];
    }
  }
  
  // Check for localhost with query param or path (for development)
  // This allows testing different niches locally
  if (host === 'localhost' || host === '127.0.0.1') {
    const urlParams = new URLSearchParams(window.location.search);
    const nicheParam = urlParams.get('niche');
    if (nicheParam && nicheRegistry[nicheParam]) {
      return nicheRegistry[nicheParam];
    }
  }
  
  // Check for exact domain match
  const exactMatch = getNicheByDomain(host);
  if (exactMatch) {
    return exactMatch;
  }
  
  // Default niche
  return defaultNiche;
}

// Export types
export * from './types';
