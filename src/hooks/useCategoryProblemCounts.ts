import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useCategoryProblemCounts() {
  return useQuery({
    queryKey: ['category-problem-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('category_id')
        .eq('status', 'published');

      if (error) throw error;

      const counts: Record<string, number> = {};
      for (const row of data || []) {
        counts[row.category_id] = (counts[row.category_id] || 0) + 1;
      }
      return counts;
    },
  });
}
