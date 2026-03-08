import { useEffect } from 'react';
import { useNiche } from '@/contexts/NicheContext';

export function AdSenseScript() {
  const { niche } = useNiche();
  const adsenseId = niche.monetization.adsenseId;

  useEffect(() => {
    if (!adsenseId) return;
    const existingScript = document.querySelector(`script[src*="pagead2.googlesyndication.com"]`);
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [adsenseId]);

  return null;
}
