import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string | null;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

// Generate consistent color based on name
function getAvatarColor(name?: string | null): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-amber-500',
    'bg-indigo-500',
  ];
  
  if (!name) return 'bg-muted';
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name?: string | null): string {
  if (!name) return '';
  
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function UserAvatar({ name, avatarUrl, size = 'md', className }: UserAvatarProps) {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);
  
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name || 'Usuário'} />}
      <AvatarFallback className={cn(bgColor, 'text-white font-medium')}>
        {initials || <User className={iconSizes[size]} />}
      </AvatarFallback>
    </Avatar>
  );
}
