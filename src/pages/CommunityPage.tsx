import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, Users, FolderOpen, TrendingUp, Clock, Eye, Pin, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/hooks/useCategories';
import { useForumStats } from '@/hooks/useForum';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export default function CommunityPage() {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: stats, isLoading: loadingStats } = useForumStats();
  const { user } = useAuth();

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
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-8 px-4">
        <div className="container">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Categorias
          </h2>
          
          {loadingCategories ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => {
                const categoryStats = stats?.byCategory?.[category.id];
                
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
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          {category.icon}
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
        </div>
      </section>

      {/* Recent Topics */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container">
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
        </div>
      </section>
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
                <span>{topic.category_name}</span>
                <span>•</span>
                <span>{topic.author_name || 'Anônimo'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {topic.answer_count}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {topic.view_count || 0}
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
