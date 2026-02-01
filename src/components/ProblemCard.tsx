import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Problem } from '@/types/database';

interface ProblemCardProps {
  problem: Problem;
  showCategory?: boolean;
}

export function ProblemCard({ problem, showCategory = false }: ProblemCardProps) {
  const categorySlug = problem.category?.slug || '';

  return (
    <Link
      to={`/${categorySlug}/${problem.slug}`}
      className={cn(
        'flex items-center justify-between p-4 rounded-xl',
        'bg-card border border-border hover:border-primary/50 hover:shadow-md',
        'transition-all duration-200 touch-action-manipulation'
      )}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate">{problem.title}</h3>
        {showCategory && problem.category && (
          <span className="text-xs text-muted-foreground mt-1 block">
            {problem.category.name}
          </span>
        )}
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {problem.quick_answer}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-3" />
    </Link>
  );
}
