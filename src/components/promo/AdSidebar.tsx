import { AdUnit } from './AdUnit';
import { cn } from '@/lib/utils';
import { AD_SLOTS } from '@/config/monetization';

interface AdSidebarProps {
  slot?: string;
  className?: string;
}

export function AdSidebar({ slot = AD_SLOTS.sidebar, className }: AdSidebarProps) {
  return (
    <div className={cn('hidden lg:block sticky top-4', className)}>
      <p className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-wider">
        Publicidade
      </p>
      <AdUnit format="vertical" slot={slot} responsive={false} />
    </div>
  );
}
