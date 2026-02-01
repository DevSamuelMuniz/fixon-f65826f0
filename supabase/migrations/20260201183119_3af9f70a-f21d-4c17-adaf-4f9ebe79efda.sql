-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, phone, state, city)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'city'
  );
  RETURN NEW;
END;
$$;