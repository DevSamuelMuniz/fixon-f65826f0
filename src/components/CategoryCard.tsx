import { Link } from 'react-router-dom';
import { Smartphone, Monitor, Wifi, AppWindow, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: string;
  color?: string;
  description?: string | null;
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

const colorMap: Record<string, string> = {
  celular: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
  computador: 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
  internet: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20',
  aplicativos: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20',
};

export function CategoryCard({ name, slug, icon, description }: CategoryCardProps) {
  const Icon = iconMap[icon.toLowerCase()] || iconMap[slug.toLowerCase()] || AppWindow;
  const colorClass = colorMap[slug.toLowerCase()] || 'bg-primary/10 text-primary hover:bg-primary/20';

  return (
    <Link
      to={`/${slug}`}
      className={cn(
        'flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-200',
        'border border-transparent hover:border-border',
        'min-h-[140px] touch-action-manipulation',
        colorClass
      )}
    >
      <div className="p-4 rounded-full bg-current/10 mb-3">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-semibold text-lg text-foreground">{name}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 text-center">{description}</p>
      )}
    </Link>
  );
}
