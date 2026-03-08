import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useUnreadMessages() {
  const [count, setCount] = useState<number>(0);

  const fetchCount = async () => {
    const { count: c } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);
    setCount(c ?? 0);
  };

  useEffect(() => {
    fetchCount();

    const channel = supabase
      .channel('unread-messages-count')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        () => fetchCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
