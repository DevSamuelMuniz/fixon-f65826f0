import { motion } from 'framer-motion';
import { Smartphone, Monitor, Wifi, AppWindow, LucideIcon } from 'lucide-react';

interface CategoryBannerProps {
  name: string;
  slug: string;
  description?: string | null;
}

const iconMap: Record<string, LucideIcon> = {
  celular: Smartphone,
  computador: Monitor,
  internet: Wifi,
  aplicativos: AppWindow,
};

const gradientMap: Record<string, string> = {
  celular: 'from-blue-500/20 via-blue-400/10 to-transparent',
  computador: 'from-green-500/20 via-green-400/10 to-transparent',
  internet: 'from-purple-500/20 via-purple-400/10 to-transparent',
  aplicativos: 'from-orange-500/20 via-orange-400/10 to-transparent',
};

const iconColorMap: Record<string, string> = {
  celular: 'text-blue-500',
  computador: 'text-green-500',
  internet: 'text-purple-500',
  aplicativos: 'text-orange-500',
};

export function CategoryBanner({ name, slug, description }: CategoryBannerProps) {
  const Icon = iconMap[slug] || AppWindow;
  const gradient = gradientMap[slug] || 'from-primary/20 via-primary/10 to-transparent';
  const iconColor = iconColorMap[slug] || 'text-primary';

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}>
      {/* Floating decorative icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute right-0 top-0 -mr-8 -mt-8"
      >
        <Icon className={`h-48 w-48 ${iconColor}`} />
      </motion.div>

      <div className="container px-4 py-8 md:py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className={`p-3 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-lg`}>
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{name}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
