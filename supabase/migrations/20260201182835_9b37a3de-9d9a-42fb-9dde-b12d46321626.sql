-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN phone VARCHAR(20),
ADD COLUMN state VARCHAR(50),
ADD COLUMN city VARCHAR(100);