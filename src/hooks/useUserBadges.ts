import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BadgeType } from '@/components/community/UserBadge';

export interface UserBadgeData {
  id: string;
  user_id: string;
  badge_type: BadgeType;
  earned_at: string;
}

// Fetch badges for a single user
export function useUserBadges(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-badges', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return (data || []) as UserBadgeData[];
    },
    enabled: !!userId,
  });
}

// Fetch badges for multiple users
export function useMultipleUserBadges(userIds: string[]) {
  return useQuery({
    queryKey: ['user-badges-multiple', userIds],
    queryFn: async () => {
      if (userIds.length === 0) return {};
      
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .in('user_id', userIds);
      
      if (error) throw error;
      
      // Group badges by user_id
      const badgesByUser: Record<string, BadgeType[]> = {};
      (data || []).forEach((badge: UserBadgeData) => {
        if (!badgesByUser[badge.user_id]) {
          badgesByUser[badge.user_id] = [];
        }
        badgesByUser[badge.user_id].push(badge.badge_type);
      });
      
      return badgesByUser;
    },
    enabled: userIds.length > 0,
  });
}
