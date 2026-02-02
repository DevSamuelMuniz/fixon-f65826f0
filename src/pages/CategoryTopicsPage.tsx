import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, Plus, Clock, CheckCircle2, Pin, ChevronRight, 
  ArrowLeft, Eye, HelpCircle, Users, TrendingUp
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/UserAvatar';
import { EmptyState } from '@/components/EmptyState';
import { useCategoryBySlug } from '@/hooks/useCategories';
import { useTopicsByCategory } from '@/hooks/useForum';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

export default function CategoryTopicsPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [activeTab, setActiveTab] = useState<string>('recent');
  const { user } = useAuth();
  
  const { data: category, isLoading: loadingCategory } = useCategoryBySlug(categorySlug || '');
  const { data: topics, isLoading: loadingTopics } = useTopicsByCategory(category?.id || '', activeTab);
  
  if (loadingCategory) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4 shimmer" />
          <Skeleton className="h-6 w-96 mb-8 shimmer" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full shimmer" />
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
          description="Esta categoria não existe ou foi removida."
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Category Header */}
      <section className="relative py-8 px-4 border-b border-border" style={{ backgroundColor: `${category.color}08` }}>
        <div className="container">
          <Link
            to="/comunidade"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar à comunidade
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-muted-foreground mt-1">{category.description}</p>
                )}
              </div>
            </div>
            
            <Link to={user ? `/comunidade/novo-topico?categoria=${category.id}` : "/auth"}>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                {user ? 'Novo Tópico' : 'Entre para participar'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Topics List */}
      <section className="py-8 px-4">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="recent" className="gap-2">
                <Clock className="h-4 w-4" />
                Recentes
              </TabsTrigger>
              <TabsTrigger value="popular" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Populares
              </TabsTrigger>
              <TabsTrigger value="resolved" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Resolvidos
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loadingTopics ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-4 bg-card border border-border rounded-xl">
                      <div className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full shimmer" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4 shimmer" />
                          <Skeleton className="h-4 w-full shimmer" />
                          <Skeleton className="h-3 w-1/3 shimmer" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : topics && topics.length > 0 ? (
                <div className="space-y-3">
                  {topics.map((topic, index) => (
                    <TopicCard key={topic.id} topic={topic} index={index} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <MessageCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Nenhum tópico nesta categoria
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Seja o primeiro a iniciar uma discussão!
                  </p>
                  <Link to={user ? `/comunidade/novo-topico?categoria=${category.id}` : "/auth"}>
                    <Button>{user ? 'Criar tópico' : 'Entre para criar'}</Button>
                  </Link>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    description: string;
    author_name: string | null;
    status: string;
    answer_count: number;
    view_count: number;
    is_pinned: boolean;
    created_at: string;
    last_activity_at: string | null;
  };
  index: number;
}

function TopicCard({ topic, index }: TopicCardProps) {
  const isResolved = topic.status === 'resolved';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        to={`/comunidade/topico/${topic.id}`}
        className={cn(
          "group flex gap-4 p-4 bg-card border rounded-xl hover:shadow-lg transition-all",
          topic.is_pinned ? "border-amber-500/30 bg-amber-500/5" : "border-border hover:border-primary/50"
        )}
      >
        {/* Pinned indicator */}
        {topic.is_pinned && (
          <div className="flex-shrink-0">
            <Pin className="h-5 w-5 text-amber-500" />
          </div>
        )}
        
        {/* Avatar */}
        <UserAvatar 
          name={topic.author_name} 
          size="md"
          className="flex-shrink-0"
        />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {topic.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isResolved && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Resolvido
                </Badge>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {topic.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {topic.author_name || 'Anônimo'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(topic.last_activity_at || topic.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {topic.answer_count} {topic.answer_count === 1 ? 'comentário' : 'comentários'}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {topic.view_count || 0} {topic.view_count === 1 ? 'visualização' : 'visualizações'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
