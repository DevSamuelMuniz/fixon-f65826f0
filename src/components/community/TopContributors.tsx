import { useQuery } from '@tanstack/react-query';
import { Trophy, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { UserAvatar } from '@/components/UserAvatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

interface Contributor {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  answer_count: number;
}

function useTopContributors() {
  return useQuery({
    queryKey: ['top-contributors'],
    queryFn: async () => {
      // Get answers grouped by user_id
      const { data: answers, error } = await supabase
        .from('forum_answers')
        .select('user_id')
        .not('user_id', 'is', null);

      if (error) throw error;

      // Count per user
      const counts: Record<string, number> = {};
      (answers || []).forEach(a => {
        if (a.user_id) counts[a.user_id] = (counts[a.user_id] || 0) + 1;
      });

      const topIds = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id);

      if (topIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from('profiles_public')
        .select('user_id, display_name, avatar_url')
        .in('user_id', topIds);

      return topIds.map((id): Contributor => {
        const profile = profiles?.find(p => p.user_id === id);
        return {
          user_id: id,
          display_name: profile?.display_name || null,
          avatar_url: profile?.avatar_url || null,
          answer_count: counts[id],
        };
      });
    },
    staleTime: 60000,
  });
}

export function TopContributors() {
  const { data: contributors, isLoading } = useTopContributors();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full shimmer" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24 shimmer" />
              <Skeleton className="h-3 w-16 shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!contributors || contributors.length === 0) return null;

  const medals = ['🥇', '🥈', '🥉', '4°', '5°'];

  return (
    <div className="space-y-2">
      {contributors.map((c, idx) => (
        <motion.div
          key={c.user_id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.06 }}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm w-6 text-center">{medals[idx]}</span>
          <UserAvatar name={c.display_name} avatarUrl={c.avatar_url || undefined} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {c.display_name || 'Anônimo'}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {c.answer_count} {c.answer_count === 1 ? 'resposta' : 'respostas'}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
