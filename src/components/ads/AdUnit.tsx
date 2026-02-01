import { useEffect, useRef } from 'react';
import { useNiche } from '@/contexts/NicheContext';
import { cn } from '@/lib/utils';

export type AdFormat = 'banner' | 'rectangle' | 'vertical' | 'in-article' | 'in-feed';

interface AdUnitProps {
  format: AdFormat;
  slot: string;
  className?: string;
  responsive?: boolean;
}

const formatStyles: Record<AdFormat, { width: string; height: string }> = {
  banner: { width: '728px', height: '90px' },
  rectangle: { width: '300px', height: '250px' },
  vertical: { width: '300px', height: '600px' },
  'in-article': { width: '100%', height: 'auto' },
  'in-feed': { width: '100%', height: 'auto' },
};

export function AdUnit({ format, slot, className, responsive = true }: AdUnitProps) {
  const { niche } = useNiche();
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  const adsenseId = niche.monetization.adsenseId;
  const styles = formatStyles[format];

  useEffect(() => {
    if (!adsenseId || isLoaded.current) return;

    try {
      // Push ad to AdSense
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [adsenseId]);

  if (!adsenseId) {
    return null;
  }

  return (
    <div
      ref={adRef}
      className={cn(
        'ad-container flex items-center justify-center overflow-hidden',
        className
      )}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: responsive ? '100%' : styles.width,
          height: responsive && (format === 'in-article' || format === 'in-feed') ? 'auto' : styles.height,
          maxWidth: styles.width,
        }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={responsive ? 'auto' : undefined}
        data-full-width-responsive={responsive ? 'true' : undefined}
      />
    </div>
  );
}
