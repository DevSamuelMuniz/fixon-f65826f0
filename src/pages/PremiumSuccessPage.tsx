import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';

export default function PremiumSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { isPremium, loading, refetch } = useSubscription();
  const [polling, setPolling] = useState(true);

  // Poll until subscription is confirmed (webhook can take a few seconds)
  useEffect(() => {
    if (isPremium) {
      setPolling(false);
      return;
    }

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      await refetch();
      if (attempts >= 10) {
        setPolling(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPremium]);

  const confirmed = isPremium && !loading;

  return (
    <Layout>
      <div className="container max-w-lg py-20 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          {polling && !confirmed ? (
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Confirmando seu pagamento...</h1>
              <p className="text-muted-foreground">Aguarde alguns segundos enquanto ativamos seu Premium.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Crown className="h-12 w-12 text-amber-500" />
                </div>
                <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-600 text-sm font-medium mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium ativado!
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Bem-vindo ao Premium! ✨
                </h1>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Sua assinatura está ativa. Aproveite navegação sem anúncios, seu badge exclusivo e diagnóstico IA ilimitado.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full mt-2">
                {[
                  '✅ Badge Premium no seu perfil',
                  '🚫 Anúncios removidos em todo o site',
                  '⚡ Diagnóstico IA sem limite de consultas',
                  '📌 Tópicos do fórum com destaque dourado',
                ].map((benefit) => (
                  <div key={benefit} className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2.5 text-left">
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <Link to="/perfil" className="flex-1">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    Ver meu perfil
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/comunidade" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Ir para a comunidade
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
