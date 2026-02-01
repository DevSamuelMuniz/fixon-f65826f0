import { useEffect } from 'react';
import { useNiche } from '@/contexts/NicheContext';

interface DynamicSEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
}

/**
 * Component to dynamically update SEO meta tags based on the current niche
 * and page-specific content.
 */
export function DynamicSEO({ title, description, path, type = 'website', image }: DynamicSEOProps) {
  const { niche } = useNiche();
  
  // Compute final values
  const finalTitle = title 
    ? `${title} | ${niche.displayName}`
    : niche.seo.title;
    
  const finalDescription = description || niche.seo.description;
  
  const finalImage = image || niche.seo.ogImage || '/og-default.png';
  
  const canonicalUrl = typeof window !== 'undefined'
    ? `https://${niche.domain}${path || window.location.pathname}`
    : '';

  useEffect(() => {
    // Update document title
    document.title = finalTitle;
    
    // Helper to update or create meta tag
    const updateMeta = (selector: string, content: string, attribute = 'content') => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attribute, content);
      }
    };
    
    // Update meta description
    updateMeta('meta[name="description"]', finalDescription);
    
    // Update Open Graph tags
    updateMeta('meta[property="og:title"]', finalTitle);
    updateMeta('meta[property="og:description"]', finalDescription);
    updateMeta('meta[property="og:type"]', type);
    updateMeta('meta[property="og:image"]', finalImage);
    
    // Update Twitter tags
    updateMeta('meta[name="twitter:title"]', finalTitle);
    updateMeta('meta[name="twitter:description"]', finalDescription);
    updateMeta('meta[name="twitter:image"]', finalImage);
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink && canonicalUrl) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    if (canonicalLink && canonicalUrl) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }
    
  }, [finalTitle, finalDescription, finalImage, type, canonicalUrl]);

  // Add JSON-LD structured data
  useEffect(() => {
    const existingScript = document.querySelector('script[data-seo="jsonld"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebSite',
      name: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      ...(type === 'website' && {
        potentialAction: {
          '@type': 'SearchAction',
          target: `https://${niche.domain}/buscar?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }),
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'jsonld');
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    
    return () => {
      script.remove();
    };
  }, [finalTitle, finalDescription, canonicalUrl, type, niche.domain]);

  return null;
}
