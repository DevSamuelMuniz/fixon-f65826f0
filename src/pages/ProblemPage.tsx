import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Share2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { StepByStep } from '@/components/StepByStep';
import { WarningBox } from '@/components/WarningBox';
import { ProblemCard } from '@/components/ProblemCard';
import { useProblemBySlug, useProblems, useIncrementViewCount } from '@/hooks/useProblems';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ProblemPage() {
  const { categorySlug, problemSlug } = useParams<{ categorySlug: string; problemSlug: string }>();
  const { data: problem, isLoading } = useProblemBySlug(categorySlug || '', problemSlug || '');
  const { data: relatedProblems } = useProblems(categorySlug);
  const { mutate: incrementView } = useIncrementViewCount();
  const { toast } = useToast();

  // Increment view count on page load
  useEffect(() => {
    if (problem?.id) {
      incrementView(problem.id);
    }
  }, [problem?.id]);

  // Update document title and meta
  useEffect(() => {
    if (problem) {
      document.title = `${problem.title} - Fix-on`;
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', problem.meta_description || problem.quick_answer);
      }
    }
    return () => {
      document.title = 'Fix-on - Soluções Rápidas de Tecnologia';
    };
  }, [problem]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: problem?.title,
          text: problem?.quick_answer,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copiado!',
        description: 'O link foi copiado para a área de transferência.',
      });
    }
  };

  // Filter related problems (same category, different problem)
  const filteredRelated = relatedProblems?.filter(p => p.id !== problem?.id).slice(0, 3) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-24 w-full mb-6" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Layout>
    );
  }

  if (!problem) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Problema não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O problema que você está procurando não existe ou foi removido.
          </p>
          <Link to="/">
            <Button>Voltar ao início</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              to={`/${categorySlug}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary min-h-0 min-w-0"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {problem.category?.name || 'Voltar'}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="min-h-10 min-w-10"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {problem.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        {/* Quick Answer */}
        <div className="p-4 md:p-6 bg-primary/5 border border-primary/20 rounded-xl mb-8">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
            Resposta rápida
          </h2>
          <p className="text-lg text-foreground">{problem.quick_answer}</p>
        </div>

        {/* Warnings */}
        <WarningBox warnings={problem.warnings} className="mb-8" />

        {/* Steps */}
        <StepByStep steps={problem.steps} />

        {/* Tags */}
        {problem.tags && problem.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Problems */}
        {filteredRelated.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-4">Problemas relacionados</h2>
            <div className="space-y-4">
              {filteredRelated.map((relatedProblem) => (
                <ProblemCard key={relatedProblem.id} problem={relatedProblem} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link to={`/${categorySlug}`}>
            <Button variant="outline" size="lg">
              Ver outras soluções de {problem.category?.name}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
