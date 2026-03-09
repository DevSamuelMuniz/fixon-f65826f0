import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';

/**
 * Syncs the theme preference between next-themes (localStorage) and the DB profile.
 * - On login: reads theme from DB and applies it.
 * - On theme change by user: saves the new value to DB.
 */
export function useThemeSync(userId: string | null | undefined) {
  const { resolvedTheme, setTheme } = useTheme();
  const didLoadFromDb = useRef(false);
  const prevUserId = useRef<string | null | undefined>(null);

  // When userId becomes available (login), load theme from DB
  useEffect(() => {
    if (!userId) {
      didLoadFromDb.current = false;
      prevUserId.current = null;
      return;
    }

    // Only load once per login session
    if (didLoadFromDb.current && prevUserId.current === userId) return;

    prevUserId.current = userId;

    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('theme')
        .eq('user_id', userId)
        .maybeSingle();

      if (data?.theme && (data.theme === 'light' || data.theme === 'dark')) {
        setTheme(data.theme);
      }
      didLoadFromDb.current = true;
    })();
  }, [userId, setTheme]);

  // When user changes theme (after load), persist to DB
  useEffect(() => {
    if (!userId || !didLoadFromDb.current || !resolvedTheme) return;
    if (resolvedTheme !== 'light' && resolvedTheme !== 'dark') return;

    supabase
      .from('profiles')
      .update({ theme: resolvedTheme })
      .eq('user_id', userId)
      .then(({ error }) => {
        if (error) console.warn('[useThemeSync] Failed to save theme:', error.message);
      });
  }, [resolvedTheme, userId]);
}
