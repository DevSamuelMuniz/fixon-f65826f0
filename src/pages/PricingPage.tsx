import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Crown, Check, Zap, Shield, Star, Sparkles, ArrowRight, Loader2,
  MessageCircle, Megaphone, BellRing, X
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

// Replace with your actual Stripe Price ID after creating the product in Stripe Dashboard
const PREMIUM_PRICE_ID = 'price_placeholder';

const freeFeatures = [
  'Acesso a todas as soluções',
  'Participar do fórum da comunidade',
  '3 consultas de diagnóstico IA/mês',
  'Perfil público da comunidade',
  'Notificações básicas',
];

const premiumFeatures = [
  { text: 'Tudo do plano Gratuito', highlight: false },
  { text: 'Sem anúncios em todo o site', highlight: true },
  { text: 'Badge exclusivo ⭐ Premium no perfil', highlight: true },
  { text: 'Tópicos destacados no fórum', highlight: true },
  { text: 'Diagnóstico IA ilimitado', highlight: true },
  { text: 'Suporte prioritário', highlight: false },
  { text: 'Acesso antecipado a novidades', highlight: false },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { isPremium, loading, createCheckout, openCustomerPortal } = useSubscription();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/entrar?redirect=/premium');
      return;
    }

    if (PREMIUM_PRICE_ID === 'price_placeholder') {
      toast.error('Configure o Price ID do Stripe primeiro. Veja as instruções abaixo.');
      return;
    }

    setCheckoutLoading(true);
    try {
      const { url } = await createCheckout(PREMIUM_PRICE_ID);
      window.location.href = url;
    } catch (err: any) {
      toast.error('Erro ao iniciar pagamento: ' + err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { url } = await openCustomerPortal();
      window.location.href = url;
    } catch (err: any) {
      toast.error('Erro ao abrir portal: ' + err.message);
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-12 px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-600 text-sm font-medium mb-4">
            <Crown className="h-4 w-4" />
            Plano Premium
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Eleve sua experiência na FixOn
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Sem anúncios, badge exclusivo no perfil e diagnóstico IA ilimitado para resolver qualquer problema.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-foreground">Gratuito</h2>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl font-bold text-foreground">R$ 0</span>
                <span className="text-muted-foreground mb-1">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Para sempre gratuito</p>
            </div>

            <ul className="space-y-2.5 mb-6">
              {freeFeatures.map((feat) => (
                <li key={feat} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            {user ? (
              <Button variant="outline" className="w-full" disabled>
                Seu plano atual
              </Button>
            ) : (
              <Link to="/entrar">
                <Button variant="outline" className="w-full">
                  Começar grátis
                </Button>
              </Link>
            )}
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-orange-500/5 border-2 border-amber-500/40 rounded-2xl p-6 shadow-lg"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-amber-500 text-white border-0 px-3 py-0.5 text-xs font-semibold shadow-md">
                <Sparkles className="h-3 w-3 mr-1" />
                Mais popular
              </Badge>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">Premium</h2>
                <Crown className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl font-bold text-foreground">R$ 9,90</span>
                <span className="text-muted-foreground mb-1">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Cancele a qualquer momento</p>
            </div>

            <ul className="space-y-2.5 mb-6">
              {premiumFeatures.map(({ text, highlight }) => (
                <li key={text} className={`flex items-center gap-2.5 text-sm ${highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {highlight ? (
                    <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                  {text}
                </li>
              ))}
            </ul>

            {loading ? (
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Carregando...
              </Button>
            ) : isPremium ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 text-sm font-medium">
                  <Crown className="h-4 w-4" />
                  Você é Premium! ✨
                </div>
                <Button
                  variant="outline"
                  className="w-full text-sm"
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                >
                  {portalLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Gerenciar assinatura
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                onClick={handleSubscribe}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Crown className="h-4 w-4 mr-2" />
                )}
                {user ? 'Assinar Premium' : 'Começar agora'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </motion.div>
        </div>

        {/* Features highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            { icon: X, color: 'text-red-500 bg-red-500/10', title: 'Zero anúncios', desc: 'Navegue sem interrupções em todo o site' },
            { icon: MessageCircle, color: 'text-amber-500 bg-amber-500/10', title: 'Destaque no fórum', desc: 'Seus tópicos aparecem com badge dourado' },
            { icon: Zap, color: 'text-blue-500 bg-blue-500/10', title: 'IA ilimitada', desc: 'Diagnóstico sem limites mensais' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-5 text-center">
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${color} mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Stripe setup instructions (only shown in dev/when price not configured) */}
        {PREMIUM_PRICE_ID === 'price_placeholder' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-5 text-sm"
          >
            <div className="flex items-center gap-2 font-semibold text-amber-700 mb-3">
              <Shield className="h-4 w-4" />
              Configuração Stripe necessária
            </div>
            <ol className="space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>Acesse o <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer" className="text-primary underline">Stripe Dashboard → Products</a></li>
              <li>Crie um produto chamado <strong>"FixOn Premium"</strong> com preço R$ 9,90/mês recorrente</li>
              <li>Copie o <strong>Price ID</strong> (começa com <code>price_</code>) e substitua <code>price_placeholder</code> neste arquivo</li>
              <li>Vá em <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer" className="text-primary underline">Stripe → Webhooks</a>, crie endpoint apontando para: <br /><code className="text-xs bg-muted px-1 py-0.5 rounded">https://dcvlrtxtepxmafiburip.supabase.co/functions/v1/stripe-webhook</code></li>
              <li>Selecione os eventos: <code>checkout.session.completed</code>, <code>customer.subscription.updated</code>, <code>customer.subscription.deleted</code></li>
              <li>Copie o <strong>Webhook Secret</strong> e adicione como secret chamado <strong>STRIPE_WEBHOOK_SECRET</strong> nas configurações do projeto</li>
            </ol>
          </motion.div>
        )}

        {/* FAQ */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Dúvidas? <Link to="/contato" className="text-primary hover:underline">Fale conosco</Link>. 
            Pagamento seguro via Stripe. Cancele quando quiser.
          </p>
        </div>
      </div>
    </Layout>
  );
}
