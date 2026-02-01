import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ForumQuestion, ForumAnswer, Category } from '@/types/database';

// Get a fingerprint for anonymous users (simple hash based on browser info)
const getFingerprint = (): string => {
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ].join('|');
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
};

export interface ForumFilters {
  status?: string;
  categoryId?: string;
  tag?: string;
}

export interface ForumQuestionWithCategory extends ForumQuestion {
  category?: Category | null;
}

// Fetch all forum questions with optional filters
export function useForumQuestions(filters?: ForumFilters) {
  return useQuery({
    queryKey: ['forum-questions', filters],
    queryFn: async () => {
      let query = supabase
        .from('forum_questions')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      
      if (filters?.tag) {
        query = query.contains('tags', [filters.tag]);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ForumQuestionWithCategory[];
    },
  });
}

// Fetch single question with answers and category
export function useForumQuestion(questionId: string) {
  return useQuery({
    queryKey: ['forum-question', questionId],
    queryFn: async () => {
      const { data: question, error: questionError } = await supabase
        .from('forum_questions')
        .select('*, category:categories(*)')
        .eq('id', questionId)
        .maybeSingle();
      
      if (questionError) throw questionError;
      if (!question) return null;
      
      const { data: answers, error: answersError } = await supabase
        .from('forum_answers')
        .select('*')
        .eq('question_id', questionId)
        .order('is_solution', { ascending: false })
        .order('upvote_count', { ascending: false })
        .order('created_at', { ascending: true });
      
      if (answersError) throw answersError;
      
      return { ...question, answers } as ForumQuestionWithCategory & { answers: ForumAnswer[] };
    },
    enabled: !!questionId,
  });
}

// Create question
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { 
      title: string; 
      description: string; 
      author_name?: string; 
      author_email?: string;
      category_id?: string;
      tags?: string[];
    }) => {
      const { data: question, error } = await supabase
        .from('forum_questions')
        .insert({
          title: data.title,
          description: data.description,
          author_name: data.author_name,
          author_email: data.author_email,
          category_id: data.category_id || null,
          tags: data.tags || [],
        })
        .select()
        .single();
      
      if (error) throw error;
      return question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-questions'] });
    },
  });
}

// Create answer
export function useCreateAnswer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { question_id: string; content: string; author_name?: string }) => {
      const { data: answer, error } = await supabase
        .from('forum_answers')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return answer;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-question', variables.question_id] });
      queryClient.invalidateQueries({ queryKey: ['forum-questions'] });
    },
  });
}

// Toggle upvote using secure database function
export function useToggleUpvote() {
  const queryClient = useQueryClient();
  const fingerprint = getFingerprint();
  
  return useMutation({
    mutationFn: async ({ answerId, questionId }: { answerId: string; questionId: string }) => {
      const { data, error } = await supabase
        .rpc('toggle_upvote', {
          p_answer_id: answerId,
          p_voter_fingerprint: fingerprint
        });
      
      if (error) throw error;
      return data as { action: string; success: boolean };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-question', variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ['user-upvotes'] });
    },
  });
}

// Get user's upvotes
export function useUserUpvotes(answerIds: string[]) {
  const fingerprint = getFingerprint();
  
  return useQuery({
    queryKey: ['user-upvotes', answerIds, fingerprint],
    queryFn: async () => {
      if (answerIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('forum_upvotes')
        .select('answer_id')
        .eq('voter_fingerprint', fingerprint)
        .in('answer_id', answerIds);
      
      if (error) throw error;
      return data.map(d => d.answer_id);
    },
    enabled: answerIds.length > 0,
  });
}

// Mark answer as solution (admin only)
export function useMarkAsSolution() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ answerId, questionId }: { answerId: string; questionId: string }) => {
      await supabase
        .from('forum_answers')
        .update({ is_solution: false })
        .eq('question_id', questionId);
      
      const { error: answerError } = await supabase
        .from('forum_answers')
        .update({ is_solution: true })
        .eq('id', answerId);
      
      if (answerError) throw answerError;
      
      const { error: questionError } = await supabase
        .from('forum_questions')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', questionId);
      
      if (questionError) throw questionError;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-question', variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ['forum-questions'] });
    },
  });
}

// Convert to problem (admin only)
export function useConvertToProblem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ questionId, categoryId }: { questionId: string; categoryId: string }) => {
      const { data: question, error: fetchError } = await supabase
        .from('forum_questions')
        .select('*')
        .eq('id', questionId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const { data: solution } = await supabase
        .from('forum_answers')
        .select('content')
        .eq('question_id', questionId)
        .eq('is_solution', true)
        .maybeSingle();
      
      const slug = question.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const { data: problem, error: createError } = await supabase
        .from('problems')
        .insert({
          title: question.title,
          slug,
          category_id: categoryId,
          quick_answer: solution?.content || question.description,
          status: 'draft',
          steps: [],
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      const { error: updateError } = await supabase
        .from('forum_questions')
        .update({ 
          status: 'converted',
          converted_problem_id: problem.id 
        })
        .eq('id', questionId);
      
      if (updateError) throw updateError;
      
      return problem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-question', variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ['forum-questions'] });
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}
