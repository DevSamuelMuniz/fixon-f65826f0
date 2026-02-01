import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Problem, ProblemStep, Category } from '@/types/database';

interface ProblemRow {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  quick_answer: string;
  steps: unknown;
  tags: string[] | null;
  warnings: string[] | null;
  related_problems: string[] | null;
  meta_description: string | null;
  status: string;
  featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

function mapProblem(p: ProblemRow): Problem {
  return {
    ...p,
    steps: Array.isArray(p.steps) ? (p.steps as ProblemStep[]) : [],
    tags: p.tags || [],
    warnings: p.warnings || [],
    related_problems: p.related_problems || [],
    status: p.status as 'draft' | 'published',
  };
}

export function useProblems(categorySlug?: string) {
  return useQuery({
    queryKey: ['problems', categorySlug],
    queryFn: async () => {
      let query = supabase
        .from('problems')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('status', 'published')
        .order('view_count', { ascending: false });

      if (categorySlug) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();
        
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(p => mapProblem(p as unknown as ProblemRow));
    },
  });
}

export function useFeaturedProblems() {
  return useQuery({
    queryKey: ['problems', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('status', 'published')
        .eq('featured', true)
        .order('view_count', { ascending: false })
        .limit(6);

      if (error) throw error;
      return (data || []).map(p => mapProblem(p as unknown as ProblemRow));
    },
  });
}

export function useProblemBySlug(categorySlug: string, problemSlug: string) {
  return useQuery({
    queryKey: ['problem', categorySlug, problemSlug],
    queryFn: async () => {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (!category) throw new Error('Categoria não encontrada');

      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('category_id', category.id)
        .eq('slug', problemSlug)
        .single();

      if (error) throw error;
      
      return mapProblem(data as unknown as ProblemRow);
    },
    enabled: !!categorySlug && !!problemSlug,
  });
}

export function useSearchProblems(query: string) {
  return useQuery({
    queryKey: ['problems', 'search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];

      const { data, error } = await supabase
        .rpc('search_problems', { search_query: query });

      if (error) throw error;
      return (data || []).map(p => mapProblem(p as unknown as ProblemRow));
    },
    enabled: query.length >= 2,
  });
}

export function useIncrementViewCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (problemId: string) => {
      // Get current view count and increment
      const { data } = await supabase
        .from('problems')
        .select('view_count')
        .eq('id', problemId)
        .single();

      if (data) {
        await supabase
          .from('problems')
          .update({ view_count: data.view_count + 1 })
          .eq('id', problemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}
