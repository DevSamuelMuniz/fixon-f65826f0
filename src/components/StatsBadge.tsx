import { motion } from 'framer-motion';
import { CheckCircle2, Users, Zap } from 'lucide-react';

const stats = [
  { icon: CheckCircle2, value: '500+', label: 'Soluções' },
  { icon: Users, value: '10K+', label: 'Usuários' },
  { icon: Zap, value: '2min', label: 'Tempo médio' },
];

export function StatsBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
          className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-sm"
        >
          <stat.icon className="h-4 w-4 text-primary" />
          <span className="font-bold text-foreground">{stat.value}</span>
          <span className="text-sm text-muted-foreground">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
