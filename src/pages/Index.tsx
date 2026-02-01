import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/CategoryCard';
import { ProblemCard } from '@/components/ProblemCard';
import { HowItWorks } from '@/components/HowItWorks';
import { useCategories } from '@/hooks/useCategories';
import { useFeaturedProblems, useProblems } from '@/hooks/useProblems';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredProblems, isLoading: featuredLoading } = useFeaturedProblems();
  const { data: allProblems, isLoading: problemsLoading } = useProblems();

  // Get most viewed problems
  const popularProblems = allProblems?.slice(0, 4) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Qual problema você quer resolver agora?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Soluções rápidas e simples para seus problemas de tecnologia
          </p>
          <SearchBar size="large" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 px-4">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-6">Categorias</h2>
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[140px] rounded-2xl" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  slug={category.slug}
                  icon={category.icon}
                  color={category.color}
                  description={category.description}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CategoryCard name="Celular" slug="celular" icon="smartphone" />
              <CategoryCard name="Computador" slug="computador" icon="monitor" />
              <CategoryCard name="Internet" slug="internet" icon="wifi" />
              <CategoryCard name="Aplicativos" slug="aplicativos" icon="app-window" />
            </div>
          )}
        </div>
      </section>

      {/* Popular Problems Section */}
      <section className="py-8 px-4">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-6">Problemas mais buscados</h2>
          {problemsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : popularProblems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} showCategory />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhum problema cadastrado ainda.
            </p>
          )}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Featured Content */}
      {featuredProblems && featuredProblems.length > 0 && (
        <section className="py-8 px-4">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-6">Conteúdo em destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} showCategory />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Index;
