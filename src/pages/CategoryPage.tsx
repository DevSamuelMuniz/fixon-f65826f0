import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProblemCard } from '@/components/ProblemCard';
import { SearchBar } from '@/components/SearchBar';
import { CategoryBanner } from '@/components/CategoryBanner';
import { EmptyState } from '@/components/EmptyState';
import { useCategoryBySlug } from '@/hooks/useCategories';
import { useProblems } from '@/hooks/useProblems';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(categorySlug || '');
  const { data: problems, isLoading: problemsLoading } = useProblems(categorySlug);

  if (categoryLoading) {
    return (
      <Layout>
        <Skeleton className="h-40 w-full shimmer" />
        <div className="container px-4 py-8">
          <Skeleton className="h-12 w-full mb-8 shimmer" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl shimmer" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <EmptyState
          type="notFound"
          title="Categoria não encontrada"
          description="A categoria que você está procurando não existe."
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Category Banner */}
      <CategoryBanner name={category.name} slug={category.slug} description={category.description} />

      {/* Back button */}
      <div className="container px-4 pt-4">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors min-h-0 min-w-0"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar ao início
        </Link>
      </div>

      {/* Search */}
      <div className="container px-4 py-6">
        <SearchBar />
      </div>

      {/* Problems List */}
      <div className="container px-4 pb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-foreground mb-6"
        >
          {problems?.length || 0} problemas de {category.name}
        </motion.h2>

        {problemsLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl shimmer" />
            ))}
          </div>
        ) : problems && problems.length > 0 ? (
          <div className="space-y-4">
            {problems.map((problem, index) => (
              <ProblemCard key={problem.id} problem={problem} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState
            type="empty"
            title="Nenhum problema ainda"
            description="Esta categoria ainda não possui problemas cadastrados."
            showHomeButton={false}
          />
        )}
      </div>
    </Layout>
  );
}
