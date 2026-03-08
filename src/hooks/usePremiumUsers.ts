import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Given a list of user IDs, returns a Set of those that have an active premium subscription.
 */
export function usePremiumUsers(userIds: (string | null | undefined)[]) {
  const validIds = [...new Set(userIds.filter((id): id is string => !!id))];

  return useQuery({
    queryKey: ['premium-users', validIds.sort().join(',')],
    queryFn: async (): Promise<Set<string>> => {
      if (validIds.length === 0) return new Set();

      const { data, error } = await supabase
        .from('subscriptions')
        .select('user_id')
        .in('user_id', validIds)
        .eq('status', 'active')
        .eq('plan', 'premium');

      if (error) throw error;
      return new Set((data || []).map((s) => s.user_id));
    },
    enabled: validIds.length > 0,
    staleTime: 60000,
  });
}
