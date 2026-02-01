import { useEffect } from 'react';
import { useNiche } from '@/contexts/NicheContext';

export function AdSenseScript() {
  const { niche } = useNiche();
  const adsenseId = niche.monetization.adsenseId;

  useEffect(() => {
    if (!adsenseId) return;

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="pagead2.googlesyndication.com"]`);
    if (existingScript) return;

    // Create and append AdSense script
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    document.head.appendChild(script);

    return () => {
      // Cleanup is not necessary as AdSense should persist
    };
  }, [adsenseId]);

  return null;
}
