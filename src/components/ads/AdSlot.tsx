/**
 * AdSlot — componente genérico para exibir qualquer bloco de anúncio.
 *
 * Como usar:
 * 1. No painel do Google AdSense, crie um bloco de anúncio e copie o código <ins>.
 * 2. Cole o código dentro deste componente ou passe o adClient + adSlot como props.
 *
 * Exemplo básico (passando props):
 *   <AdSlot adClient="ca-pub-XXXXXXXXXXXXXXXX" adSlot="1234567890" />
 *
 * Exemplo avançado (HTML raw do AdSense — cole dentro de AdSlot ou crie um
 * componente wrapper):
 *   Ver src/components/ads/AdSlotCustom.tsx
 */

import { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

interface AdSlotProps {
  /** Publisher ID: ca-pub-XXXXXXXXXXXXXXXX */
  adClient: string;
  /** Slot ID do bloco de anúncio */
  adSlot: string;
  /** Formato do anúncio (padrão: auto) */
  adFormat?: string;
  /** Ativar responsividade */
  fullWidth?: boolean;
  className?: string;
  /** Se true, exibe mesmo para usuários Premium */
  ignoreSubscription?: boolean;
}

export function AdSlot({
  adClient,
  adSlot,
  adFormat = 'auto',
  fullWidth = true,
  className,
  ignoreSubscription = false,
}: AdSlotProps) {
  const { isPremium } = useSubscription();
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // bloqueado por ad blocker ou script ainda não carregado
    }
  }, []);

  // Usuários Premium não veem anúncios
  if (!ignoreSubscription && isPremium) return null;

  return (
    <div className={cn('overflow-hidden', className)}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidth ? 'true' : 'false'}
      />
    </div>
  );
}
