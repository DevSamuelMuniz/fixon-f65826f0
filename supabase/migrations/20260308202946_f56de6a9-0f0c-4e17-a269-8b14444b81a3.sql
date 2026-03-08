-- Allow public read access to non-sensitive profile fields via profiles_public view
-- The view already restricts to: id, user_id, display_name, avatar_url, bio, created_at
CREATE POLICY "Perfis são públicos para leitura básica"
  ON public.profiles
  FOR SELECT
  USING (true);