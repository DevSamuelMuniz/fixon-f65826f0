-- Create a secure function to toggle upvotes
-- This allows users to remove their own upvotes without direct DELETE access

CREATE OR REPLACE FUNCTION public.toggle_upvote(
  p_answer_id uuid,
  p_voter_fingerprint varchar(64)
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_id uuid;
  result jsonb;
BEGIN
  -- Check if upvote already exists for this fingerprint
  SELECT id INTO existing_id
  FROM public.forum_upvotes
  WHERE answer_id = p_answer_id
    AND voter_fingerprint = p_voter_fingerprint;
  
  IF existing_id IS NOT NULL THEN
    -- Remove the upvote (only their own)
    DELETE FROM public.forum_upvotes WHERE id = existing_id;
    result := jsonb_build_object('action', 'removed', 'success', true);
  ELSE
    -- Add new upvote
    INSERT INTO public.forum_upvotes (answer_id, voter_fingerprint)
    VALUES (p_answer_id, p_voter_fingerprint);
    result := jsonb_build_object('action', 'added', 'success', true);
  END IF;
  
  RETURN result;
END;
$$;