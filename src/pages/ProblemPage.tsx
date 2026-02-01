import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Eye, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProgressChecklist } from '@/components/ProgressChecklist';
import { WarningBox } from '@/components/WarningBox';
import { ProblemCard } from '@/components/ProblemCard';
import { FeedbackButtons } from '@/components/FeedbackButtons';
import { EmptyState } from '@/components/EmptyState';
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
          <Skeleton className="h-6 w-24 mb-4 shimmer" />
          <Skeleton className="h-10 w-full mb-4 shimmer" />
          <Skeleton className="h-24 w-full mb-6 shimmer" />
          <Skeleton className="h-48 w-full shimmer" />
        </div>
      </Layout>
    );
  }

  if (!problem) {
    return (
      <Layout>
        <EmptyState
          type="notFound"
          title="Problema não encontrado"
          description="O problema que você está procurando não existe ou foi removido."
        />
      </Layout>
    );
  }

  const formattedDate = new Date(problem.created_at).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Layout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-border bg-gradient-to-br from-muted/50 to-transparent"
      >
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              to={`/${categorySlug}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors min-h-0 min-w-0"
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

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-foreground mb-4"
          >
            {problem.title}
          </motion.h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {problem.view_count} visualizações
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container px-4 py-8">
        {/* Quick Answer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 md:p-6 bg-primary/5 border border-primary/20 rounded-2xl mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2 relative z-10">
            💡 Resposta rápida
          </h2>
          <p className="text-lg text-foreground relative z-10">{problem.quick_answer}</p>
        </motion.div>

        {/* Warnings */}
        <WarningBox warnings={problem.warnings} className="mb-8" />

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProgressChecklist steps={problem.steps} />
        </motion.div>

        {/* Tags */}
        {problem.tags && problem.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 pt-8 border-t border-border"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full hover:bg-muted/80 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <FeedbackButtons problemId={problem.id} />
        </motion.div>

        {/* Related Problems */}
        {filteredRelated.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Problemas relacionados</h2>
            <div className="space-y-4">
              {filteredRelated.map((relatedProblem, index) => (
                <ProblemCard key={relatedProblem.id} problem={relatedProblem} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link to={`/${categorySlug}`}>
            <Button variant="outline" size="lg">
              Ver outras soluções de {problem.category?.name}
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
