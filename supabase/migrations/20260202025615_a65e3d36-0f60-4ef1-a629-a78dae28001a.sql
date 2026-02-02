-- Add images column to forum_questions and forum_answers
ALTER TABLE public.forum_questions ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';
ALTER TABLE public.forum_answers ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Add mentions column (stores user_ids that were mentioned)
ALTER TABLE public.forum_questions ADD COLUMN IF NOT EXISTS mentions text[] DEFAULT '{}';
ALTER TABLE public.forum_answers ADD COLUMN IF NOT EXISTS mentions text[] DEFAULT '{}';

-- Create user badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_type text NOT NULL,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- Enable RLS on user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view badges (public display)
CREATE POLICY "Badges are publicly viewable"
ON public.user_badges FOR SELECT
USING (true);

-- Only system can manage badges (via functions)
CREATE POLICY "Only admins can manage badges"
ON public.user_badges FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for community images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('community-images', 'community-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: anyone can view community images
CREATE POLICY "Community images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-images');

-- Storage policy: authenticated users can upload
CREATE POLICY "Authenticated users can upload community images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'community-images');

-- Storage policy: users can delete their own uploads
CREATE POLICY "Users can delete own community images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'community-images' AND auth.uid()::text = (storage.foldername(name))[1]);