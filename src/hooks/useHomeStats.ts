import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HomeStats {
  solutionsCount: number;
  usersCount: number;
  avgResponseTime: string;
}

export function useHomeStats() {
  return useQuery({
    queryKey: ['home-stats'],
    queryFn: async (): Promise<HomeStats> => {
      // Fetch published problems count
      const { count: problemsCount } = await supabase
        .from('problems')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Fetch users count (from profiles)
      const { count: usersCount } = await supabase
        .from('profiles_public')
        .select('*', { count: 'exact', head: true });

      // Fetch forum questions with answers to calculate avg response time
      const { data: questionsWithAnswers } = await supabase
        .from('forum_questions')
        .select('created_at, forum_answers(created_at)')
        .eq('status', 'resolved')
        .limit(50);

      // Calculate average response time
      let avgMinutes = 0;
      if (questionsWithAnswers && questionsWithAnswers.length > 0) {
        const responseTimes: number[] = [];
        
        questionsWithAnswers.forEach((question: any) => {
          if (question.forum_answers && question.forum_answers.length > 0) {
            const questionDate = new Date(question.created_at).getTime();
            const firstAnswerDate = new Date(question.forum_answers[0].created_at).getTime();
            const diffMinutes = (firstAnswerDate - questionDate) / (1000 * 60);
            if (diffMinutes > 0 && diffMinutes < 10080) { // Ignore if > 1 week
              responseTimes.push(diffMinutes);
            }
          }
        });

        if (responseTimes.length > 0) {
          avgMinutes = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        }
      }

      // Format average time
      let avgTimeFormatted = '< 5min';
      if (avgMinutes > 0) {
        if (avgMinutes < 60) {
          avgTimeFormatted = `${Math.round(avgMinutes)}min`;
        } else if (avgMinutes < 1440) {
          avgTimeFormatted = `${Math.round(avgMinutes / 60)}h`;
        } else {
          avgTimeFormatted = `${Math.round(avgMinutes / 1440)}d`;
        }
      }

      return {
        solutionsCount: problemsCount || 0,
        usersCount: usersCount || 0,
        avgResponseTime: avgTimeFormatted,
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace('.0', '')}M+`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace('.0', '')}K+`;
  }
  return `${count}+`;
}
