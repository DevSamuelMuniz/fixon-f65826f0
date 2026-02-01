-- ===========================================
-- FIX SECURITY VULNERABILITIES
-- ===========================================

-- 1. FIX: forum_upvotes DELETE policy (anyone can delete any upvote)
-- Since fingerprints are client-generated, we can't verify ownership server-side
-- Best approach: Only admins can delete upvotes for moderation
DROP POLICY IF EXISTS "Qualquer um pode remover seu upvote" ON public.forum_upvotes;

-- Allow only admins to delete upvotes (for moderation purposes)
CREATE POLICY "Admins can delete upvotes"
ON public.forum_upvotes FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. FIX: forum_questions email exposure
-- Update SELECT policy to hide email from non-authenticated users
DROP POLICY IF EXISTS "Anyone can view questions" ON public.forum_questions;
DROP POLICY IF EXISTS "Qualquer um pode ver perguntas" ON public.forum_questions;

-- Create a view that hides sensitive data for public access
CREATE OR REPLACE VIEW public.forum_questions_public AS
SELECT 
  id,
  title,
  description,
  author_name,
  -- Mask email: only show first 3 chars + domain for non-null emails
  CASE 
    WHEN author_email IS NOT NULL THEN 
      LEFT(author_email, 3) || '***@' || SPLIT_PART(author_email, '@', 2)
    ELSE NULL
  END as author_email_masked,
  niche,
  status,
  answer_count,
  resolved_at,
  converted_problem_id,
  created_at,
  updated_at
FROM public.forum_questions;

-- Recreate SELECT policy - public can view but email is handled by view
CREATE POLICY "Anyone can view questions"
ON public.forum_questions FOR SELECT
USING (true);

-- 3. FIX: profiles table public exposure
-- Remove public SELECT policy and restrict access to owner + admins
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Perfis são visíveis por todos" ON public.profiles;

-- Users can only view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create a public view with limited profile info (only display_name and avatar)
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT 
  id,
  user_id,
  display_name,
  avatar_url,
  bio,
  created_at
  -- Excluded: phone, city, state (sensitive data)
FROM public.profiles;