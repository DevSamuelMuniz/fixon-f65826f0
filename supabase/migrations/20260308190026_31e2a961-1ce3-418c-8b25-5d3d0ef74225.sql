-- Garantir que o schema está acessível para o PostgREST
ALTER TABLE public.contact_messages OWNER TO postgres;
GRANT ALL ON public.contact_messages TO postgres;
GRANT SELECT, INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
-- Forçar reload do PostgREST
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';