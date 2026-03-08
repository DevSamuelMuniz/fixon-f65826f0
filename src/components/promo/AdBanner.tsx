import { AdUnit } from './AdUnit';
import { cn } from '@/lib/utils';
import { AD_SLOTS } from '@/config/monetization';

interface AdBannerProps {
  slot?: string;
  className?: string;
}

export function AdBanner({ slot = AD_SLOTS.banner, className }: AdBannerProps) {
  return (
    <div className={cn('w-full py-4', className)}>
      <div className="container mx-auto">
        <AdUnit format="banner" slot={slot} className="mx-auto" responsive />
      </div>
    </div>
  );
}
