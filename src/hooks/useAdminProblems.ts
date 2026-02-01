import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Problem, ProblemStep, Category } from '@/types/database';
import { Json } from '@/integrations/supabase/types';

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

export function useProblemsAdmin() {
  return useQuery({
    queryKey: ['admin-problems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(p => mapProblem(p as unknown as ProblemRow));
    },
  });
}

export function useProblemById(id: string) {
  return useQuery({
    queryKey: ['admin-problem', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return mapProblem(data as unknown as ProblemRow);
    },
    enabled: !!id && id !== 'novo',
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (problem: Partial<Problem>) => {
      const stepsAsJson = (problem.steps || []).map(step => ({
        order: step.order,
        title: step.title,
        description: step.description,
      })) as unknown as Json;

      const { data, error } = await supabase
        .from('problems')
        .insert({
          title: problem.title!,
          slug: problem.slug!,
          category_id: problem.category_id!,
          quick_answer: problem.quick_answer!,
          steps: stepsAsJson,
          tags: problem.tags || [],
          warnings: problem.warnings || [],
          meta_description: problem.meta_description || null,
          status: problem.status || 'draft',
          featured: problem.featured || false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}

export function useUpdateProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...problem }: Partial<Problem> & { id: string }) => {
      const stepsAsJson = (problem.steps || []).map(step => ({
        order: step.order,
        title: step.title,
        description: step.description,
      })) as unknown as Json;

      const { data, error } = await supabase
        .from('problems')
        .update({
          title: problem.title,
          slug: problem.slug,
          category_id: problem.category_id,
          quick_answer: problem.quick_answer,
          steps: stepsAsJson,
          tags: problem.tags,
          warnings: problem.warnings,
          meta_description: problem.meta_description,
          status: problem.status,
          featured: problem.featured,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
      queryClient.invalidateQueries({ queryKey: ['admin-problem'] });
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('problems')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}

export function useToggleProblemStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('problems')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}
