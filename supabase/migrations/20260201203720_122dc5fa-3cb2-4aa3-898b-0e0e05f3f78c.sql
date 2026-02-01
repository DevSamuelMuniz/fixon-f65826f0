-- Add category and tags to forum_questions
ALTER TABLE public.forum_questions
ADD COLUMN category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN tags text[] DEFAULT '{}'::text[];

-- Create index for filtering
CREATE INDEX idx_forum_questions_category ON public.forum_questions(category_id);
CREATE INDEX idx_forum_questions_tags ON public.forum_questions USING GIN(tags);