import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Plus, Users, FolderOpen, TrendingUp, Clock, Eye, Pin, ChevronRight,
  Search, X, Trophy, Flame,
  Smartphone, Monitor, Wifi, AppWindow, HeartPulse, Apple, Sparkles, Moon, Cog, Zap,
  CircleStop, Circle, Droplets, Paintbrush, Armchair, Car, Wrench, Home, Lightbulb,
  type LucideIcon
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/UserAvatar';
import { useCategories } from '@/hooks/useCategories';
import { useForumStats } from '@/hooks/useForum';
import { useForumSearch } from '@/hooks/useForumSearch';
import { useAuth } from '@/hooks/useAuth';
import { TopContributors } from '@/components/community/TopContributors';
import { TrendingTopics } from '@/components/community/TrendingTopics';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  'smartphone': Smartphone, 'monitor': Monitor, 'wifi': Wifi,
  'app-window': AppWindow, 'heart-pulse': HeartPulse, 'apple': Apple,
  'sparkles': Sparkles, 'moon': Moon, 'cog': Cog, 'zap': Zap,
  'circle-stop': CircleStop, 'circle': Circle, 'droplets': Droplets,
  'paintbrush': Paintbrush, 'armchair': Armchair, 'car': Car,
  'wrench': Wrench, 'home': Home, 'lightbulb': Lightbulb, 'folder': FolderOpen,
};

function getCategoryIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || FolderOpen;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays} dias`;
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

export default function CommunityPage() {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: stats, isLoading: loadingStats } = useForumStats();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading: searching } = useForumSearch(searchQuery);

  const showSearch = searchQuery.trim().length >= 2;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-purple-500/10 via-primary/5 to-transparent overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-sm font-medium mb-4">
                <Users className="h-4 w-4" />
                Comunidade Fix-on
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Fórum da Comunidade
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Troque experiências, tire dúvidas e ajude outros usuários. Juntos resolvemos mais rápido!
              </p>
            </div>
            
            <Link to={user ? "/comunidade/novo-topico" : "/auth"}>
              <Button size="lg" className="gap-2 shadow-lg">
                <Plus className="h-5 w-5" />
                {user ? 'Novo Tópico' : 'Entre para participar'}
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          {!loadingStats && stats && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              <div className="p-4 bg-card/50 backdrop-blur border border-border rounded-xl text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalTopics}</div>
                <div className="text-sm text-muted-foreground">Tópicos</div>
              </div>
              <div className="p-4 bg-card/50 backdrop-blur border border-border rounded-xl text-center">
                <div className="text-2xl font-bold text-green-500">{stats.totalComments}</div>
                <div className="text-sm text-muted-foreground">Comentários</div>
              </div>
              <div className="p-4 bg-card/50 backdrop-blur border border-border rounded-xl text-center">
                <div className="text-2xl font-bold text-amber-500">{stats.resolvedTopics}</div>
                <div className="text-sm text-muted-foreground">Resolvidos</div>
              </div>
              <div className="p-4 bg-card/50 backdrop-blur border border-border rounded-xl text-center">
                <div className="text-2xl font-bold text-purple-500">{stats.activeToday}</div>
                <div className="text-sm text-muted-foreground">Ativos Hoje</div>
              </div>
            </motion.div>
          )}

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 relative max-w-xl"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pesquisar tópicos na comunidade..."
              className="pl-11 pr-10 h-12 bg-card/80 backdrop-blur border-border text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Search Results */}
      <AnimatePresence>
        {showSearch && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="py-6 px-4 bg-muted/20 border-b border-border"
          >
            <div className="container">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Search className="h-4 w-4" />
                {searching ? 'Buscando...' : `${searchResults?.length || 0} resultado(s) para "${searchQuery}"`}
              </h2>

              {searching ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full shimmer rounded-xl" />)}
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((topic: any) => (
                    <Link
                      key={topic.id}
                      to={`/comunidade/topico/${topic.id}`}
                      className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{topic.author_name || 'Anônimo'}</span>
                          {topic.category?.name && <span>• {topic.category.name}</span>}
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />{topic.answer_count}
                          </span>
                          <span>{formatTimeAgo(topic.created_at)}</span>
                        </div>
                      </div>
                      {topic.status === 'resolved' && (
                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/30 flex-shrink-0">
                          Resolvido
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="mb-2">Nenhum tópico encontrado para "{searchQuery}"</p>
                  <Link to={user ? `/comunidade/novo-topico?title=${encodeURIComponent(searchQuery)}` : '/auth'}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Criar tópico sobre isso
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main content with sidebar */}
      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categories Grid */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Categorias
              </h2>
              
              {loadingCategories ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-6 bg-card border border-border rounded-xl">
                      <Skeleton className="h-10 w-10 rounded-lg mb-4 shimmer" />
                      <Skeleton className="h-6 w-3/4 mb-2 shimmer" />
                      <Skeleton className="h-4 w-full mb-4 shimmer" />
                      <Skeleton className="h-4 w-1/2 shimmer" />
                    </div>
                  ))}
                </div>
              ) : categories && categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category, index) => {
                    const categoryStats = stats?.byCategory?.[category.id];
                    const IconComponent = getCategoryIcon(category.icon);
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={`/comunidade/${category.slug}`}
                          className="group block p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all h-full"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: `${category.color}20`, color: category.color }}
                            >
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {category.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3.5 w-3.5" />
                              {categoryStats?.topics || 0} tópicos
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3.5 w-3.5" />
                              {categoryStats?.comments || 0} comentários
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma categoria disponível</p>
                </div>
              )}
            </section>

            {/* Recent Topics */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Tópicos Recentes
                </h2>
                <Link to="/comunidade/todos" className="text-sm text-primary hover:underline">
                  Ver todos →
                </Link>
              </div>
              <RecentTopicsList />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Em Alta esta Semana
              </h3>
              <TrendingTopics />
            </div>

            {/* Top Contributors */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Top Contribuidores
              </h3>
              <TopContributors />
            </div>

            {/* Quick actions */}
            {!user && (
              <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-5 text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">Entre na comunidade</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Crie uma conta para fazer perguntas e ajudar outros usuários.
                </p>
                <Link to="/auth">
                  <Button size="sm" className="w-full">Criar conta grátis</Button>
                </Link>
              </div>
            )}

            {user && (
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Ações rápidas
                </h3>
                <div className="space-y-2">
                  <Link to="/comunidade/novo-topico">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Plus className="h-4 w-4" />
                      Novo tópico
                    </Button>
                  </Link>
                  <Link to="/comunidade/todos">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Ver todos os tópicos
                    </Button>
                  </Link>
                  <Link to="/perfil">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Users className="h-4 w-4" />
                      Meu perfil
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function RecentTopicsList() {
  const { data: recentTopics, isLoading } = useForumStats();
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 bg-card border border-border rounded-xl flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full shimmer" />
            <div className="flex-1">
              <Skeleton className="h-5 w-3/4 mb-2 shimmer" />
              <Skeleton className="h-4 w-1/2 shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!recentTopics?.recentTopics?.length) {
    return (
      <div className="text-center py-8 bg-card border border-border rounded-xl">
        <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Nenhum tópico ainda. Seja o primeiro!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {recentTopics.recentTopics.map((topic, index) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            to={`/comunidade/topico/${topic.id}`}
            className="group flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all"
          >
            {topic.is_pinned && (
              <Pin className="h-4 w-4 text-amber-500 flex-shrink-0" />
            )}
            <UserAvatar name={topic.author_name} size="sm" className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {topic.title}
                </h3>
                {topic.status === 'resolved' && (
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/30">
                    Resolvido
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">{topic.author_name || 'Anônimo'}</span>
                <span>•</span>
                <span>{topic.category_name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />{topic.answer_count}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />{topic.view_count || 0}
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
