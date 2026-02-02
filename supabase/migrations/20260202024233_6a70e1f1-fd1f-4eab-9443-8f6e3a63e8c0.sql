-- Corrigir políticas RLS para verificar user_id
DROP POLICY IF EXISTS "Usuários logados podem criar tópicos" ON public.forum_questions;
CREATE POLICY "Usuários logados podem criar tópicos"
ON public.forum_questions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS "Usuários logados podem comentar" ON public.forum_answers;
CREATE POLICY "Usuários logados podem comentar"
ON public.forum_answers
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);