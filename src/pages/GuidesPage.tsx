import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Download, ShoppingCart, Star, CheckCircle2, Crown, Sparkles,
  ArrowLeft, FileText, Lock, Loader2, ExternalLink
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface DigitalGuide {
  id: string;
  title: string;
  description: string | null;
  category: string;
  stripe_price_id: string;
  price_cents: number;
  cover_image_url: string | null;
  file_path: string | null;
  is_published: boolean;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

const CATEGORY_LABELS: Record<string, string> = {
  eletrica: 'Elétrica',
  hidraulica: 'Hidráulica',
  marcenaria: 'Marcenaria',
  alvenaria: 'Alvenaria',
  geral: 'Geral',
};

export default function GuidesPage() {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingGuideId, setLoadingGuideId] = useState<string | null>(null);
  const [downloadingGuideId, setDownloadingGuideId] = useState<string | null>(null);

  // Read success/session_id/guide_id from URL after Stripe redirect
  const searchParams = new URLSearchParams(window.location.search);
  const successParam = searchParams.get('success');
  const sessionIdParam = searchParams.get('session_id');
  const guideIdParam = searchParams.get('guide_id');

  const { data: guides, isLoading } = useQuery({
    queryKey: ['digital-guides'],
    queryFn: async (): Promise<DigitalGuide[]> => {
      const { data, error } = await supabase
        .from('digital_guides')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's purchases
  const { data: purchases, refetch: refetchPurchases } = useQuery({
    queryKey: ['guide-purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('guide_purchases')
        .select('guide_id, status')
        .eq('user_id', user.id)
        .eq('status', 'completed');
      if (error) throw error;
      return (data || []).map(p => p.guide_id);
    },
    enabled: !!user,
  });

  const hasPurchased = useCallback((guideId: string) => {
    return purchases?.includes(guideId) ?? false;
  }, [purchases]);

  // Handle post-payment verification
  useEffect(() => {
    if (successParam && sessionIdParam && guideIdParam && user && session) {
      const verify = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('verify-guide-purchase', {
            body: { sessionId: sessionIdParam, guideId: guideIdParam },
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (error) throw error;
          if (data?.success) {
            toast({ title: '✅ Compra confirmada!', description: 'Seu guia está disponível para download.' });
            refetchPurchases();
          }
        } catch (err) {
          toast({ title: 'Erro ao verificar compra', variant: 'destructive' });
        }
        // Clean URL
        window.history.replaceState({}, '', '/guias');
      };
      verify();
    }
  }, [successParam, sessionIdParam, guideIdParam, user, session]);

  const handleBuy = async (guide: DigitalGuide) => {
    if (!user || !session) {
      toast({ title: 'Faça login para comprar', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    setLoadingGuideId(guide.id);
    try {
      const { data, error } = await supabase.functions.invoke('create-guide-checkout', {
        body: { guideId: guide.id, priceId: guide.stripe_price_id },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err: any) {
      toast({ title: 'Erro ao iniciar compra', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingGuideId(null);
    }
  };

  const handleDownload = async (guide: DigitalGuide) => {
    if (!user || !session) return;
    setDownloadingGuideId(guide.id);
    try {
      const { data, error } = await supabase.functions.invoke('get-guide-download', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      // Use query param via fetch since invoke doesn't support query params
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-guide-download?guide_id=${guide.id}`,
        { headers: { Authorization: `Bearer ${session.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
      );
      const result = await res.json();
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      } else {
        toast({ title: 'Arquivo não disponível ainda', description: 'O administrador ainda não fez upload do PDF.', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Erro ao baixar', description: err.message, variant: 'destructive' });
    } finally {
      setDownloadingGuideId(null);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-amber-500/10 via-primary/5 to-transparent overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4" />
              Guias Digitais
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Loja de Guias Digitais
            </h1>
            <p className="text-muted-foreground max-w-xl">
              PDFs completos por categoria para você resolver qualquer problema em casa. 
              Compra única, acesso vitalício.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Compra única
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-2">
                <Download className="h-4 w-4 text-primary" />
                Download imediato
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-2">
                <FileText className="h-4 w-4 text-amber-500" />
                Formato PDF
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Guides Grid */}
      <div className="container py-10 px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                <Skeleton className="h-48 w-full shimmer" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4 shimmer" />
                  <Skeleton className="h-4 w-full shimmer" />
                  <Skeleton className="h-4 w-2/3 shimmer" />
                  <Skeleton className="h-10 w-full shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : guides && guides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => {
              const purchased = hasPurchased(guide.id);
              return (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={cn(
                    "bg-card border rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-lg",
                    purchased
                      ? "border-green-500/40 shadow-green-500/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  {/* Cover */}
                  <div className="relative h-44 bg-gradient-to-br from-amber-500/20 to-primary/10 flex items-center justify-center overflow-hidden">
                    {guide.cover_image_url ? (
                      <img src={guide.cover_image_url} alt={guide.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <BookOpen className="h-12 w-12 text-amber-500/60" />
                        <span className="text-sm font-medium">{CATEGORY_LABELS[guide.category] || guide.category}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-amber-500/90 text-white text-xs border-0">
                        {CATEGORY_LABELS[guide.category] || guide.category}
                      </Badge>
                    </div>
                    {purchased && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500 text-white text-xs border-0 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Comprado
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground text-lg mb-2 leading-tight">
                      {guide.title}
                    </h3>
                    {guide.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {guide.description}
                      </p>
                    )}

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">
                          {formatPrice(guide.price_cents)}
                        </span>
                        <span className="text-xs text-muted-foreground">compra única</span>
                      </div>

                      {purchased ? (
                        <Button
                          className="w-full gap-2 bg-green-500 hover:bg-green-600"
                          onClick={() => handleDownload(guide)}
                          disabled={downloadingGuideId === guide.id}
                        >
                          {downloadingGuideId === guide.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          {downloadingGuideId === guide.id ? 'Preparando...' : 'Baixar PDF'}
                        </Button>
                      ) : (
                        <Button
                          className="w-full gap-2"
                          onClick={() => handleBuy(guide)}
                          disabled={loadingGuideId === guide.id}
                        >
                          {loadingGuideId === guide.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShoppingCart className="h-4 w-4" />
                          )}
                          {loadingGuideId === guide.id ? 'Redirecionando...' : 'Comprar Agora'}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">Em breve!</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Nossos guias digitais estão sendo preparados. Volte em breve para conferir.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
