-- Forum Questions table
CREATE TABLE public.forum_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name VARCHAR(100),
  author_email VARCHAR(255),
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'converted')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  converted_problem_id UUID REFERENCES public.problems(id),
  answer_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Forum Answers table
CREATE TABLE public.forum_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.forum_questions(id) ON DELETE CASCADE,
  author_name VARCHAR(100),
  content TEXT NOT NULL,
  is_solution BOOLEAN NOT NULL DEFAULT false,
  upvote_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Forum Upvotes table (track by session/fingerprint for anonymous)
CREATE TABLE public.forum_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID NOT NULL REFERENCES public.forum_answers(id) ON DELETE CASCADE,
  voter_fingerprint VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(answer_id, voter_fingerprint)
);

-- Enable RLS
ALTER TABLE public.forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_upvotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forum_questions
CREATE POLICY "Perguntas do fórum são públicas para leitura"
ON public.forum_questions FOR SELECT
USING (true);

CREATE POLICY "Qualquer um pode criar perguntas"
ON public.forum_questions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins podem editar perguntas"
ON public.forum_questions FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem excluir perguntas"
ON public.forum_questions FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for forum_answers
CREATE POLICY "Respostas são públicas para leitura"
ON public.forum_answers FOR SELECT
USING (true);

CREATE POLICY "Qualquer um pode criar respostas"
ON public.forum_answers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins podem editar respostas"
ON public.forum_answers FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem excluir respostas"
ON public.forum_answers FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for forum_upvotes
CREATE POLICY "Upvotes são públicos para leitura"
ON public.forum_upvotes FOR SELECT
USING (true);

CREATE POLICY "Qualquer um pode dar upvote"
ON public.forum_upvotes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Qualquer um pode remover seu upvote"
ON public.forum_upvotes FOR DELETE
USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_forum_questions_updated_at
BEFORE UPDATE ON public.forum_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment answer count
CREATE OR REPLACE FUNCTION public.increment_answer_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE forum_questions 
  SET answer_count = answer_count + 1 
  WHERE id = NEW.question_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_answer_created
AFTER INSERT ON public.forum_answers
FOR EACH ROW
EXECUTE FUNCTION public.increment_answer_count();

-- Function to update upvote count
CREATE OR REPLACE FUNCTION public.update_upvote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_answers SET upvote_count = upvote_count + 1 WHERE id = NEW.answer_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_answers SET upvote_count = upvote_count - 1 WHERE id = OLD.answer_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_upvote_change
AFTER INSERT OR DELETE ON public.forum_upvotes
FOR EACH ROW
EXECUTE FUNCTION public.update_upvote_count();

-- Index for better performance
CREATE INDEX idx_forum_questions_status ON public.forum_questions(status);
CREATE INDEX idx_forum_questions_created_at ON public.forum_questions(created_at DESC);
CREATE INDEX idx_forum_answers_question_id ON public.forum_answers(question_id);
CREATE INDEX idx_forum_answers_upvote_count ON public.forum_answers(upvote_count DESC);