import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, MessageCircle, Users, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/CategoryCard';
import { ProblemCard } from '@/components/ProblemCard';
import { HowItWorks } from '@/components/HowItWorks';
import { FloatingIcons } from '@/components/FloatingIcons';
import { StatsBadge } from '@/components/StatsBadge';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import { useFeaturedProblems, useProblems } from '@/hooks/useProblems';
import { useNiche } from '@/contexts/NicheContext';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { niche, nicheSlug } = useNiche();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredProblems, isLoading: featuredLoading } = useFeaturedProblems();
  const { data: allProblems, isLoading: problemsLoading } = useProblems();

  // Filter problems by current niche
  const nicheProblems = allProblems?.filter(p => 
    (p as any).niche === nicheSlug || 
    (nicheSlug === 'default' && ((p as any).niche === 'tech' || !(p as any).niche))
  ) || [];
  
  // Get most viewed problems for current niche
  const popularProblems = nicheProblems.slice(0, 4);

  // Filter featured problems by niche
  const nicheFeatured = featuredProblems?.filter(p =>
    (p as any).niche === nicheSlug ||
    (nicheSlug === 'default' && ((p as any).niche === 'tech' || !(p as any).niche))
  ) || [];

  // Use niche categories from config, or fall back to database categories
  const displayCategories = niche.categories.length > 0 
    ? niche.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        color: niche.theme.primaryColorHex,
        description: cat.description,
      }))
    : categories?.filter(c => 
        (c as any).niche === nicheSlug || 
        (nicheSlug === 'default' && ((c as any).niche === 'tech' || !(c as any).niche))
      ) || [];

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
            {niche.heroTitle.split(' ').map((word, i) => {
              const highlightWords = ['resolver', 'tecnologia', 'saúde', 'carro', 'casa'];
              const isHighlight = highlightWords.some(hw => word.toLowerCase().includes(hw));
              return isHighlight ? (
                <span key={i} className="text-primary">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              );
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8"
          >
            {niche.heroSubtitle}
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

          {categoriesLoading && displayCategories.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[160px] rounded-2xl shimmer" />
              ))}
            </div>
          ) : displayCategories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
              {displayCategories.map((category, index) => (
                <CategoryCard
                  key={category.id || category.slug}
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
            <p className="text-muted-foreground text-center py-8">
              Nenhuma categoria disponível para este nicho.
            </p>
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

      {/* Forum CTA */}
      <section className="py-12 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-primary/5 to-transparent p-8 md:p-12 border border-purple-500/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <Users className="h-10 w-10 text-purple-500" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Não encontrou a solução?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Pergunte à comunidade! Outros usuários e especialistas vão te ajudar a resolver seu problema.
                </p>
                <Link to="/forum">
                  <Button size="lg" className="gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Ir para o Fórum
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Content */}
      {nicheFeatured.length > 0 && (
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
              {nicheFeatured.map((problem, index) => (
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
