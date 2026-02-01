import { AdUnit } from './AdUnit';
import { cn } from '@/lib/utils';

interface AdInFeedProps {
  slot?: string;
  className?: string;
}

export function AdInFeed({ slot = '4567890123', className }: AdInFeedProps) {
  return (
    <div className={cn('w-full p-4 bg-muted/30 rounded-xl border border-border/50', className)}>
      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
        Publicidade
      </p>
      <AdUnit
        format="in-feed"
        slot={slot}
        responsive
      />
    </div>
  );
}
