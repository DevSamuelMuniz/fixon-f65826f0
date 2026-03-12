
-- Fix 1: Remove overly permissive subscriptions policies that allow any user to self-upgrade to premium.
-- The service_role bypasses RLS automatically and never needs explicit policies.
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.subscriptions;

-- Fix 2: Remove the broad authenticated-read policy on the digital-guides bucket.
-- Access must go through the get-guide-download edge function which verifies purchases first.
DROP POLICY IF EXISTS "Allow authenticated read of guides" ON storage.objects;
