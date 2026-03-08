
-- Create notifications table for real-time notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  actor_name TEXT,
  actor_avatar_url TEXT,
  question_id UUID REFERENCES public.forum_questions(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES public.forum_answers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, read) WHERE read = false;

-- Function to create a notification for topic replies
CREATE OR REPLACE FUNCTION public.notify_topic_reply()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_topic_author_id UUID;
  v_topic_title TEXT;
  v_answerer_name TEXT;
BEGIN
  SELECT user_id, title INTO v_topic_author_id, v_topic_title
  FROM public.forum_questions
  WHERE id = NEW.question_id;

  IF v_topic_author_id IS NOT NULL AND v_topic_author_id IS DISTINCT FROM NEW.user_id THEN
    v_answerer_name := COALESCE(NEW.author_name, 'Alguém');
    INSERT INTO public.notifications (user_id, type, title, message, link, actor_name, question_id, answer_id)
    VALUES (
      v_topic_author_id,
      'reply',
      'Nova resposta no seu tópico',
      v_answerer_name || ' respondeu ao tópico "' || v_topic_title || '"',
      '/comunidade/topico/' || NEW.question_id::text,
      v_answerer_name,
      NEW.question_id,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Function to create notifications for mentions
CREATE OR REPLACE FUNCTION public.notify_mentions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_mention TEXT;
  v_mentioned_user_id UUID;
  v_topic_title TEXT;
  v_actor_name TEXT;
BEGIN
  IF NEW.mentions IS NULL OR array_length(NEW.mentions, 1) = 0 THEN
    RETURN NEW;
  END IF;

  SELECT title INTO v_topic_title
  FROM public.forum_questions
  WHERE id = NEW.question_id;

  v_actor_name := COALESCE(NEW.author_name, 'Alguém');

  FOREACH v_mention IN ARRAY NEW.mentions LOOP
    SELECT user_id INTO v_mentioned_user_id
    FROM public.profiles
    WHERE display_name ILIKE v_mention
    LIMIT 1;

    IF v_mentioned_user_id IS NOT NULL AND v_mentioned_user_id IS DISTINCT FROM NEW.user_id THEN
      INSERT INTO public.notifications (user_id, type, title, message, link, actor_name, question_id, answer_id)
      VALUES (
        v_mentioned_user_id,
        'mention',
        'Você foi mencionado',
        v_actor_name || ' te mencionou em "' || v_topic_title || '"',
        '/comunidade/topico/' || NEW.question_id::text,
        v_actor_name,
        NEW.question_id,
        NEW.id
      );
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;

-- Trigger: notify topic author on new reply
CREATE TRIGGER on_new_answer_notify_author
  AFTER INSERT ON public.forum_answers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_topic_reply();

-- Trigger: notify mentioned users on new answer
CREATE TRIGGER on_new_answer_notify_mentions
  AFTER INSERT ON public.forum_answers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_mentions();
