import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Flame, Sparkles, Smartphone, Monitor, Wifi, AppWindow, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Problem } from '@/types/database';

interface ProblemCardProps {
  problem: Problem;
  showCategory?: boolean;
  index?: number;
}

const categoryIconMap: Record<string, LucideIcon> = {
  celular: Smartphone,
  computador: Monitor,
  internet: Wifi,
  aplicativos: AppWindow,
};

const categoryColorMap: Record<string, string> = {
  celular: 'text-blue-500 bg-blue-500/10',
  computador: 'text-green-500 bg-green-500/10',
  internet: 'text-purple-500 bg-purple-500/10',
  aplicativos: 'text-orange-500 bg-orange-500/10',
};

export function ProblemCard({ problem, showCategory = false, index = 0 }: ProblemCardProps) {
  const categorySlug = problem.category?.slug || '';
  const CategoryIcon = categoryIconMap[categorySlug] || AppWindow;
  const categoryColors = categoryColorMap[categorySlug] || 'text-primary bg-primary/10';
  
  const isPopular = problem.view_count > 50;
  const isNew = new Date(problem.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const estimatedTime = problem.steps?.length ? `${problem.steps.length * 2} min` : '5 min';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Link
        to={`/${categorySlug}/${problem.slug}`}
        className={cn(
          'group flex items-center gap-4 p-4 rounded-xl',
          'bg-card border border-border hover:border-primary/50 hover:shadow-lg',
          'transition-all duration-200 touch-action-manipulation'
        )}
      >
        {/* Category Icon */}
        {showCategory && (
          <div className={cn('flex-shrink-0 p-3 rounded-xl', categoryColors)}>
            <CategoryIcon className="h-6 w-6" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {problem.title}
            </h3>
            {isPopular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 text-orange-500 text-xs font-medium rounded-full">
                <Flame className="h-3 w-3" />
                Popular
              </span>
            )}
            {isNew && !isPopular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-medium rounded-full">
                <Sparkles className="h-3 w-3" />
                Novo
              </span>
            )}
          </div>

          {showCategory && problem.category && (
            <span className="text-xs text-muted-foreground block mb-1">
              {problem.category.name}
            </span>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2">
            {problem.quick_answer}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {estimatedTime}
            </span>
            {problem.steps && (
              <span className="text-xs text-muted-foreground">
                {problem.steps.length} passos
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <motion.div
          className="flex-shrink-0"
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
