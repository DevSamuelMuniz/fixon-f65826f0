import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useForumSearch(query: string) {
  const debouncedQuery = useDebounce(query.trim(), 350);

  return useQuery({
    queryKey: ['forum-search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];

      const { data, error } = await supabase
        .from('forum_questions')
        .select('id, title, description, status, answer_count, view_count, author_name, created_at, category:categories(name, slug)')
        .or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
        .order('last_activity_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 10000,
  });
}
