import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Wifi, AppWindow, LucideIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: string;
  color?: string;
  description?: string | null;
  problemCount?: number;
  index?: number;
}

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  monitor: Monitor,
  wifi: Wifi,
  'app-window': AppWindow,
  celular: Smartphone,
  computador: Monitor,
  internet: Wifi,
  aplicativos: AppWindow,
};

const colorConfig: Record<string, { bg: string; icon: string; gradient: string; border: string }> = {
  celular: {
    bg: 'bg-blue-500/10 hover:bg-blue-500/20',
    icon: 'text-blue-500',
    gradient: 'from-blue-500/20 to-blue-600/5',
    border: 'hover:border-blue-500/50',
  },
  computador: {
    bg: 'bg-green-500/10 hover:bg-green-500/20',
    icon: 'text-green-500',
    gradient: 'from-green-500/20 to-green-600/5',
    border: 'hover:border-green-500/50',
  },
  internet: {
    bg: 'bg-purple-500/10 hover:bg-purple-500/20',
    icon: 'text-purple-500',
    gradient: 'from-purple-500/20 to-purple-600/5',
    border: 'hover:border-purple-500/50',
  },
  aplicativos: {
    bg: 'bg-orange-500/10 hover:bg-orange-500/20',
    icon: 'text-orange-500',
    gradient: 'from-orange-500/20 to-orange-600/5',
    border: 'hover:border-orange-500/50',
  },
};

export function CategoryCard({ name, slug, icon, description, problemCount, index = 0 }: CategoryCardProps) {
  const Icon = iconMap[icon.toLowerCase()] || iconMap[slug.toLowerCase()] || AppWindow;
  const colors = colorConfig[slug.toLowerCase()] || {
    bg: 'bg-primary/10 hover:bg-primary/20',
    icon: 'text-primary',
    gradient: 'from-primary/20 to-primary/5',
    border: 'hover:border-primary/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`/${slug}`}
        className={cn(
          'group relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300',
          'border border-border shadow-sm hover:shadow-lg',
          'min-h-[160px] touch-action-manipulation overflow-hidden',
          colors.bg,
          colors.border
        )}
      >
        {/* Gradient overlay */}
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300', colors.gradient)} />

        {/* Icon container */}
        <motion.div
          className={cn('relative z-10 p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 mb-4 shadow-md', 'group-hover:shadow-lg transition-shadow duration-300')}
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.3 }}
        >
          <Icon className={cn('h-10 w-10', colors.icon)} />
        </motion.div>

        {/* Text content */}
        <h3 className="relative z-10 font-bold text-lg text-foreground text-center">{name}</h3>
        
        {problemCount !== undefined && (
          <span className="relative z-10 text-xs text-muted-foreground mt-1">
            {problemCount} {problemCount === 1 ? 'problema' : 'problemas'}
          </span>
        )}

        {description && (
          <p className="relative z-10 text-xs text-muted-foreground mt-2 text-center line-clamp-2">{description}</p>
        )}

        {/* Arrow indicator */}
        <motion.div
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          <ChevronRight className={cn('h-5 w-5', colors.icon)} />
        </motion.div>
      </Link>
    </motion.div>
  );
}
