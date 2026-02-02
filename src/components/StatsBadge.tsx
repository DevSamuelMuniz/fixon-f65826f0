import { motion } from 'framer-motion';
import { CheckCircle2, Users, Zap } from 'lucide-react';
import { useHomeStats, formatCount } from '@/hooks/useHomeStats';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsBadge() {
  const { data: stats, isLoading } = useHomeStats();

  const items = [
    { icon: CheckCircle2, value: stats ? formatCount(stats.solutionsCount) : '0+', label: 'Soluções' },
    { icon: Users, value: stats ? formatCount(stats.usersCount) : '0+', label: 'Usuários' },
    { icon: Zap, value: stats?.avgResponseTime || '< 5min', label: 'Tempo médio' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8"
    >
      {items.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
          className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-sm"
        >
          <stat.icon className="h-4 w-4 text-primary" />
          {isLoading ? (
            <Skeleton className="h-4 w-8" />
          ) : (
            <span className="font-bold text-foreground">{stat.value}</span>
          )}
          <span className="text-sm text-muted-foreground">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
