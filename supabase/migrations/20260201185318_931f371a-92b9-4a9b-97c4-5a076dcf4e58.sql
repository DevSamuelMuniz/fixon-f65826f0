-- Add niche column to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS niche character varying DEFAULT 'default';

-- Add niche column to problems table
ALTER TABLE public.problems 
ADD COLUMN IF NOT EXISTS niche character varying DEFAULT 'default';

-- Add niche column to forum_questions table
ALTER TABLE public.forum_questions 
ADD COLUMN IF NOT EXISTS niche character varying DEFAULT 'default';

-- Create index for faster niche-based queries
CREATE INDEX IF NOT EXISTS idx_categories_niche ON public.categories(niche);
CREATE INDEX IF NOT EXISTS idx_problems_niche ON public.problems(niche);
CREATE INDEX IF NOT EXISTS idx_forum_questions_niche ON public.forum_questions(niche);

-- Update existing data to 'tech' niche (since current content is tech-related)
UPDATE public.categories SET niche = 'tech' WHERE niche IS NULL OR niche = 'default';
UPDATE public.problems SET niche = 'tech' WHERE niche IS NULL OR niche = 'default';
UPDATE public.forum_questions SET niche = 'tech' WHERE niche IS NULL OR niche = 'default';