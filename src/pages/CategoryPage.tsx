import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProblemCard } from '@/components/ProblemCard';
import { SearchBar } from '@/components/SearchBar';
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
        <div className="container px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-12 w-full mb-8" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Categoria não encontrada</h1>
          <p className="text-muted-foreground mb-6">
            A categoria que você está procurando não existe.
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
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 min-h-0 min-w-0"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="container px-4 py-6">
        <SearchBar />
      </div>

      {/* Problems List */}
      <div className="container px-4 pb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Problemas de {category.name}
        </h2>
        {problemsLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : problems && problems.length > 0 ? (
          <div className="space-y-4">
            {problems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum problema encontrado nesta categoria.
            </p>
            <Link to="/">
              <Button variant="outline">Ver outras categorias</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
