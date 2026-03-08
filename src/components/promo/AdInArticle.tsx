import { AdUnit } from './AdUnit';
import { cn } from '@/lib/utils';
import { AD_SLOTS } from '@/config/monetization';

interface AdInArticleProps {
  slot?: string;
  className?: string;
}

export function AdInArticle({ slot = AD_SLOTS.inArticle, className }: AdInArticleProps) {
  return (
    <div className={cn('w-full py-6 my-6 border-y border-border/50', className)}>
      <p className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-wider">
        Publicidade
      </p>
      <AdUnit format="in-article" slot={slot} responsive />
    </div>
  );
}
