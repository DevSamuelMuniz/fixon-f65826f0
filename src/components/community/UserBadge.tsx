import { 
  Award, Star, MessageCircle, ThumbsUp, CheckCircle2, Crown, 
  Flame, Heart, Zap, Shield, type LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type BadgeType = 
  | 'newcomer'      // New member
  | 'contributor'   // 5+ answers
  | 'helper'        // 10+ answers
  | 'expert'        // 25+ answers
  | 'guru'          // 50+ answers
  | 'problem_solver' // 5+ solutions
  | 'popular'       // 50+ upvotes received
  | 'early_adopter' // First 100 users
  | 'trusted'       // Verified user
  | 'moderator'     // Mod role
  | 'admin';        // Admin role

interface BadgeConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
}

const badgeConfigs: Record<BadgeType, BadgeConfig> = {
  newcomer: {
    icon: Star,
    label: 'Novato',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  contributor: {
    icon: MessageCircle,
    label: 'Colaborador',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  helper: {
    icon: Heart,
    label: 'Ajudante',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  expert: {
    icon: Award,
    label: 'Expert',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  guru: {
    icon: Crown,
    label: 'Guru',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  problem_solver: {
    icon: CheckCircle2,
    label: 'Solucionador',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  popular: {
    icon: Flame,
    label: 'Popular',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  early_adopter: {
    icon: Zap,
    label: 'Early Adopter',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  trusted: {
    icon: Shield,
    label: 'Confiável',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  moderator: {
    icon: Shield,
    label: 'Moderador',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  admin: {
    icon: Crown,
    label: 'Admin',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
};

interface UserBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function UserBadge({ type, size = 'sm', showLabel = false, className }: UserBadgeProps) {
  const config = badgeConfigs[type];
  if (!config) return null;

  const Icon = config.icon;
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
  const padding = size === 'sm' ? 'px-1.5 py-0.5' : size === 'md' ? 'px-2 py-1' : 'px-3 py-1.5';
  const textSize = size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        config.bgColor,
        config.color,
        padding,
        textSize,
        className
      )}
      title={config.label}
    >
      <Icon className={iconSize} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

interface UserBadgesProps {
  badges: BadgeType[];
  size?: 'sm' | 'md' | 'lg';
  maxDisplay?: number;
  className?: string;
}

export function UserBadges({ badges, size = 'sm', maxDisplay = 3, className }: UserBadgesProps) {
  if (!badges || badges.length === 0) return null;

  const displayBadges = badges.slice(0, maxDisplay);
  const remaining = badges.length - maxDisplay;

  return (
    <div className={cn('inline-flex items-center gap-1 flex-wrap', className)}>
      {displayBadges.map((badge) => (
        <UserBadge key={badge} type={badge} size={size} />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground">+{remaining}</span>
      )}
    </div>
  );
}
