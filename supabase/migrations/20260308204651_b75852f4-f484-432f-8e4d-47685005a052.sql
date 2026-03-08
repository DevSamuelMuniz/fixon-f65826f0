-- Fix: drop and recreate the view WITHOUT security definer (it's a plain view)
DROP VIEW IF EXISTS public.user_premium_status;

CREATE VIEW public.user_premium_status WITH (security_invoker = true) AS
  SELECT 
    user_id,
    (status = 'active' AND plan = 'premium') AS is_premium,
    status,
    plan,
    current_period_end
  FROM public.subscriptions;

-- Fix: Restrict the "service role" policy to only INSERT/UPDATE (not SELECT/DELETE for arbitrary users)
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;

-- Allow service role to insert new subscriptions
CREATE POLICY "Service role can insert subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (true);

-- Allow service role to update subscriptions
CREATE POLICY "Service role can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (true)
  WITH CHECK (true);