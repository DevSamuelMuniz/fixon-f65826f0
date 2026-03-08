import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Subscription {
  user_id: string;
  status: string;
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export function useSubscription() {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const isPremium = subscription?.status === 'active' && subscription?.plan === 'premium';

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    setSubscription(data as Subscription | null);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  // Realtime subscription updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`subscription-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subscriptions',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        fetchSubscription();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const createCheckout = async (priceId: string) => {
    if (!session?.access_token) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { priceId },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (error) throw error;
    return data as { url: string; sessionId: string };
  };

  const openCustomerPortal = async () => {
    if (!session?.access_token) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (error) throw error;
    return data as { url: string };
  };

  return {
    subscription,
    isPremium,
    loading,
    createCheckout,
    openCustomerPortal,
    refetch: fetchSubscription,
  };
}
