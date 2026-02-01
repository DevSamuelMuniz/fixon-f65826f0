import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/CategoryCard';
import { ProblemCard } from '@/components/ProblemCard';
import { HowItWorks } from '@/components/HowItWorks';
import { FloatingIcons } from '@/components/FloatingIcons';
import { StatsBadge } from '@/components/StatsBadge';
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
      <section className="relative py-16 md:py-24 px-4 overflow-hidden gradient-hero">
        <FloatingIcons />
        
        <div className="container max-w-2xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
          >
            <Zap className="h-4 w-4" />
            Grátis e rápido
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 text-balance"
          >
            Qual problema você quer{' '}
            <span className="text-primary">resolver</span> agora?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8"
          >
            Soluções rápidas e simples para seus problemas de tecnologia
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SearchBar size="large" />
          </motion.div>

          <StatsBadge />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Categorias</h2>
          </motion.div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[160px] rounded-2xl shimmer" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  slug={category.slug}
                  icon={category.icon}
                  color={category.color}
                  description={category.description}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CategoryCard name="Celular" slug="celular" icon="smartphone" index={0} />
              <CategoryCard name="Computador" slug="computador" icon="monitor" index={1} />
              <CategoryCard name="Internet" slug="internet" icon="wifi" index={2} />
              <CategoryCard name="Aplicativos" slug="aplicativos" icon="app-window" index={3} />
            </div>
          )}
        </div>
      </section>

      {/* Popular Problems Section */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-500 text-xs font-medium rounded-full mb-3">
              🔥 Mais buscados
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Problemas populares</h2>
          </motion.div>

          {problemsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl shimmer" />
              ))}
            </div>
          ) : popularProblems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularProblems.map((problem, index) => (
                <ProblemCard key={problem.id} problem={problem} showCategory index={index} />
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
        <section className="py-12 px-4">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                ✨ Em destaque
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Conteúdo em destaque</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProblems.map((problem, index) => (
                <ProblemCard key={problem.id} problem={problem} showCategory index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Index;
