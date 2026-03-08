
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name character varying(100) NOT NULL,
  email character varying(255) NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  read boolean DEFAULT false NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver todas as mensagens"
  ON public.contact_messages
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Qualquer pessoa pode enviar mensagem"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);
