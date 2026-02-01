-- Adicionar campos extras para tópicos (forum_questions já serve como topics)
ALTER TABLE public.forum_questions 
ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false;

-- Criar índice para última atividade
CREATE INDEX IF NOT EXISTS idx_forum_questions_last_activity ON public.forum_questions(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_questions_pinned ON public.forum_questions(is_pinned DESC, last_activity_at DESC);

-- Adicionar user_id para rastrear autor logado (opcional, mantém anônimo também)
ALTER TABLE public.forum_questions 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.forum_answers 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Função para atualizar last_activity_at quando há novo comentário
CREATE OR REPLACE FUNCTION public.update_topic_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_questions 
  SET last_activity_at = now() 
  WHERE id = NEW.question_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para atualizar atividade
DROP TRIGGER IF EXISTS update_topic_activity_trigger ON forum_answers;
CREATE TRIGGER update_topic_activity_trigger
AFTER INSERT ON forum_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_topic_activity();

-- Atualizar políticas para permitir apenas usuários logados criar
DROP POLICY IF EXISTS "Qualquer um pode criar perguntas" ON public.forum_questions;
CREATE POLICY "Usuários logados podem criar tópicos"
ON public.forum_questions
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Qualquer um pode criar respostas" ON public.forum_answers;
CREATE POLICY "Usuários logados podem comentar"
ON public.forum_answers
FOR INSERT
TO authenticated
WITH CHECK (true);