import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TrendingTopic {
  id: string;
  title: string;
  answer_count: number;
  view_count: number;
  status: string;
  created_at: string;
  last_activity_at: string | null;
  author_name: string | null;
  score: number;
}

export function useTrendingTopics(limit = 5) {
  return useQuery({
    queryKey: ['trending-topics', limit],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('forum_questions')
        .select('id, title, answer_count, view_count, status, created_at, last_activity_at, author_name')
        .gte('last_activity_at', sevenDaysAgo.toISOString())
        .order('answer_count', { ascending: false })
        .limit(limit * 2); // over-fetch to compute score

      if (error) throw error;

      // Compute trending score: answers weighted 3x + views
      const scored = (data || []).map(t => ({
        ...t,
        score: (t.answer_count || 0) * 3 + (t.view_count || 0),
      })) as TrendingTopic[];

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
