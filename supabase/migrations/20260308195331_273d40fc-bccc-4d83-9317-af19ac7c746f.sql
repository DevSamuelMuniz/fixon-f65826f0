
-- Add UPDATE policy to forum_questions so topic authors can update their own topics
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='forum_questions' AND policyname='Authors can update their own questions'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Authors can update their own questions"
      ON public.forum_questions
      FOR UPDATE
      USING (auth.uid() = user_id)
    $p$;
  END IF;
END $$;

-- Add UPDATE policy to forum_answers so authors can mark solutions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='forum_answers' AND policyname='Authors can update their own answers'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Authors can update their own answers"
      ON public.forum_answers
      FOR UPDATE
      USING (auth.uid() = user_id)
    $p$;
  END IF;
END $$;

-- Trigger: call auto-award-badges edge function after new answer is inserted
CREATE OR REPLACE FUNCTION public.notify_new_answer_for_badges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  edge_function_url text;
  payload jsonb;
BEGIN
  edge_function_url := 'https://dcvlrtxtepxmafiburip.supabase.co/functions/v1/auto-award-badges';
  payload := jsonb_build_object(
    'table', 'forum_answers',
    'record', row_to_json(NEW)::jsonb
  );
  PERFORM net.http_post(
    url := edge_function_url,
    body := payload::text,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_new_answer_award_badges ON public.forum_answers;
CREATE TRIGGER on_new_answer_award_badges
AFTER INSERT ON public.forum_answers
FOR EACH ROW EXECUTE FUNCTION public.notify_new_answer_for_badges();

-- Trigger: call auto-award-badges edge function after question is resolved
CREATE OR REPLACE FUNCTION public.notify_resolved_question_for_badges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  edge_function_url text;
  payload jsonb;
BEGIN
  IF NEW.status = 'resolved' AND (OLD.status IS DISTINCT FROM 'resolved') THEN
    edge_function_url := 'https://dcvlrtxtepxmafiburip.supabase.co/functions/v1/auto-award-badges';
    payload := jsonb_build_object(
      'table', 'forum_questions',
      'record', row_to_json(NEW)::jsonb
    );
    PERFORM net.http_post(
      url := edge_function_url,
      body := payload::text,
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_resolved_question_award_badges ON public.forum_questions;
CREATE TRIGGER on_resolved_question_award_badges
AFTER UPDATE ON public.forum_questions
FOR EACH ROW EXECUTE FUNCTION public.notify_resolved_question_for_badges();

-- Storage policies for avatar uploads in community-images bucket (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='objects' AND schemaname='storage' AND policyname='Users can upload their own avatar'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Users can upload their own avatar"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'community-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
      )
    $p$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='objects' AND schemaname='storage' AND policyname='Users can update their own avatar'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Users can update their own avatar"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = 'community-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
      )
    $p$;
  END IF;
END $$;
