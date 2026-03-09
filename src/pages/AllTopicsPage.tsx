import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, Plus, Clock, CheckCircle2, Pin, ChevronRight, 
  ArrowLeft, Eye, X, Hash, FolderOpen,
  SortDesc, Search, Crown
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserAvatar } from '@/components/UserAvatar';
import { useCategories } from '@/hooks/useCategories';
import { useForumQuestions } from '@/hooks/useForum';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumUsers } from '@/hooks/usePremiumUsers';
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

export default function AllTopicsPage() {
  const { user } = useAuth();
  const { data: categories } = useCategories();
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Build filters for hook
  const filters = useMemo(() => ({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
    tag: tagFilter || undefined,
  }), [statusFilter, categoryFilter, tagFilter]);
  
  const { data: topics, isLoading } = useForumQuestions(filters);
  const topicUserIds = useMemo(() => topics?.map(t => t.user_id) ?? [], [topics]);
  const { data: premiumUsers } = usePremiumUsers(topicUserIds);
  
  // Extract all unique tags from topics
  const allTags = useMemo(() => {
    if (!topics) return [];
    const tags = new Set<string>();
    topics.forEach(topic => {
      topic.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [topics]);
  
  // Filter and sort topics
  const filteredTopics = useMemo(() => {
    if (!topics) return [];
    
    let result = [...topics];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(topic => 
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.author_name?.toLowerCase().includes(query)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      // Pinned always first
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      
      switch (sortBy) {
        case 'popular':
          return b.answer_count - a.answer_count;
        case 'views':
          return b.view_count - a.view_count;
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'recent':
        default:
          return new Date(b.last_activity_at || b.created_at).getTime() - 
                 new Date(a.last_activity_at || a.created_at).getTime();
      }
    });
    
    return result;
  }, [topics, searchQuery, sortBy]);
  
  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || tagFilter || searchQuery;
  
  const clearFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setTagFilter('');
    setSearchQuery('');
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-6 px-4 border-b border-border bg-muted/30">
        <div className="container">
          <Link
            to="/comunidade"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar à comunidade
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Todos os Tópicos
              </h1>
              <p className="text-muted-foreground">
                {filteredTopics.length} {filteredTopics.length === 1 ? 'tópico encontrado' : 'tópicos encontrados'}
              </p>
            </div>
            
            <Link to={user ? "/comunidade/novo-topico" : "/auth"}>
              <Button className="gap-2">
                <Plus className="h-5 w-5" />
                Novo Tópico
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 px-4 border-b border-border sticky top-16 bg-background/95 backdrop-blur z-40">
        <div className="container">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tópicos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <FolderOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categories?.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="open">Abertos</SelectItem>
                <SelectItem value="resolved">Resolvidos</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Tag Filter */}
            {allTags.length > 0 && (
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-[160px]">
                  <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas tags</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>#{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SortDesc className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigos</SelectItem>
                <SelectItem value="popular">Mais comentados</SelectItem>
                <SelectItem value="views">Mais vistos</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Topics List */}
      <section className="py-6 px-4">
        <div className="container">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-4 bg-card border border-border rounded-xl flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full shimmer" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 shimmer" />
                    <Skeleton className="h-4 w-full shimmer" />
                    <Skeleton className="h-3 w-1/3 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTopics.length > 0 ? (
            <div className="space-y-3">
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  {(() => {
                    const isPremiumAuthor = topic.user_id ? premiumUsers?.has(topic.user_id) : false;
                    return (
                  <Link
                    to={`/comunidade/topico/${topic.id}`}
                    className={cn(
                      "group relative flex gap-4 p-4 bg-card border-2 rounded-xl hover:shadow-lg transition-all",
                      isPremiumAuthor
                        ? "border-amber-400 shadow-md shadow-amber-400/20 hover:border-amber-500 hover:shadow-amber-400/30"
                        : topic.is_pinned
                          ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60"
                          : "border-border hover:border-primary/50"
                    )}
                  >
                    {/* Premium badge */}
                    {isPremiumAuthor && (
                      <div className="absolute -top-2.5 left-3 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-sm">
                        <Crown className="h-3 w-3 text-amber-900 fill-amber-900" />
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide">Premium</span>
                      </div>
                    )}

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
                        <h3 className={cn(
                          "font-semibold transition-colors line-clamp-1",
                          isPremiumAuthor ? "text-foreground group-hover:text-amber-600" : "text-foreground group-hover:text-primary"
                        )}>
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {topic.status === 'resolved' && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Resolvido
                            </Badge>
                          )}
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {topic.description}
                      </p>
                      
                      {/* Tags */}
                      {topic.tags && topic.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {topic.tags.slice(0, 3).map(tag => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="text-xs gap-0.5 bg-purple-500/10 text-purple-500 border-0"
                            >
                              <Hash className="h-2.5 w-2.5" />
                              {tag}
                            </Badge>
                          ))}
                          {topic.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{topic.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {topic.author_name || 'Anônimo'}
                        </span>
                        {topic.category && (
                          <span className="flex items-center gap-1 text-primary">
                            <FolderOpen className="h-3 w-3" />
                            {topic.category.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(topic.last_activity_at || topic.created_at)}
                        </span>
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
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Nenhum tópico encontrado
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {hasActiveFilters 
                  ? "Tente ajustar os filtros ou limpar a busca" 
                  : "Seja o primeiro a iniciar uma discussão!"}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              ) : (
                <Link to={user ? "/comunidade/novo-topico" : "/auth"}>
                  <Button>Criar tópico</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
