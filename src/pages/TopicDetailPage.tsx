import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MessageCircle, Clock, ThumbsUp, CheckCircle2, Send, 
  Eye, Pin, LogIn, Sparkles, FolderOpen
} from 'lucide-react';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { UserAvatar } from '@/components/UserAvatar';
import { useToast } from '@/hooks/use-toast';
import { useForumQuestion, useCreateAnswer, useToggleUpvote, useUserUpvotes, useMarkAsSolution, useIncrementViewCount } from '@/hooks/useForum';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const commentSchema = z.object({
  content: z.string().min(5, 'Comentário muito curto (mínimo 5 caracteres)').max(5000, 'Comentário muito longo'),
});

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', { 
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
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

export default function TopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, profile } = useAuth();
  
  const { data: topic, isLoading } = useForumQuestion(topicId || '');
  const answerIds = topic?.answers?.map(a => a.id) || [];
  const { data: userUpvotes } = useUserUpvotes(answerIds);
  const incrementView = useIncrementViewCount();
  
  const createAnswer = useCreateAnswer();
  const toggleUpvote = useToggleUpvote();
  const markAsSolution = useMarkAsSolution();
  
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState('');

  // Increment view count on first load
  useEffect(() => {
    if (topicId) {
      incrementView.mutate(topicId);
    }
  }, [topicId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user) {
      toast({ title: 'Faça login para comentar', variant: 'destructive' });
      return;
    }
    
    const result = commentSchema.safeParse({ content: commentContent });
    if (!result.success) {
      setError(result.error.errors[0]?.message || 'Erro de validação');
      return;
    }
    
    try {
      await createAnswer.mutateAsync({
        question_id: topicId!,
        content: commentContent,
        author_name: profile?.display_name || user.email?.split('@')[0] || undefined,
        user_id: user.id,
      });
      
      toast({ title: 'Comentário enviado!' });
      setCommentContent('');
    } catch (err) {
      toast({ title: 'Erro ao enviar', variant: 'destructive' });
    }
  };

  const handleUpvote = async (answerId: string) => {
    try {
      await toggleUpvote.mutateAsync({ answerId, questionId: topicId! });
    } catch (err) {
      toast({ title: 'Erro ao votar', variant: 'destructive' });
    }
  };

  const handleMarkSolution = async (answerId: string) => {
    try {
      await markAsSolution.mutateAsync({ answerId, questionId: topicId! });
      toast({ title: 'Resposta marcada como solução!' });
    } catch (err) {
      toast({ title: 'Erro', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl px-4 py-8">
          <Skeleton className="h-6 w-32 mb-6 shimmer" />
          <div className="p-6 bg-card border border-border rounded-2xl mb-8">
            <div className="flex gap-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full shimmer" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4 shimmer" />
                <Skeleton className="h-4 w-1/2 shimmer" />
              </div>
            </div>
            <Skeleton className="h-32 w-full shimmer" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!topic) {
    return (
      <Layout>
        <EmptyState
          type="notFound"
          title="Tópico não encontrado"
          description="Este tópico não existe ou foi removido."
        />
      </Layout>
    );
  }

  const isResolved = topic.status === 'resolved';

  return (
    <Layout>
      <div className="container max-w-4xl px-4 py-8">
        {/* Back link */}
        <Link
          to={topic.category ? `/comunidade/${topic.category.slug}` : "/comunidade"}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para {topic.category?.name || 'comunidade'}
        </Link>

        {/* Topic Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mb-8 p-6 bg-card border rounded-2xl",
            topic.is_pinned ? "border-amber-500/30" : "border-border"
          )}
        >
          {/* Pinned badge */}
          {topic.is_pinned && (
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-amber-500 text-white">
                <Pin className="h-3 w-3 mr-1" />
                Fixado
              </Badge>
            </div>
          )}
          
          {/* Author header */}
          <div className="flex items-start gap-4 mb-4">
            <UserAvatar 
              name={topic.author_name} 
              size="lg"
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-foreground">
                  {topic.author_name || 'Anônimo'}
                </span>
                {isResolved && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Resolvido
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(topic.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {topic.view_count || 0} visualizações
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
            {topic.title}
          </h1>
          
          {/* Description */}
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {topic.description}
            </p>
          </div>

          {/* Category */}
          {topic.category && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <Badge variant="outline" className="gap-1 bg-primary/5 border-primary/20 text-primary">
                <FolderOpen className="h-3 w-3" />
                {topic.category.name}
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {topic.answer_count} {topic.answer_count === 1 ? 'Comentário' : 'Comentários'}
          </h2>

          {topic.answers && topic.answers.length > 0 ? (
            <div className="space-y-4">
              {[...topic.answers]
                .sort((a, b) => {
                  if (a.is_solution && !b.is_solution) return -1;
                  if (!a.is_solution && b.is_solution) return 1;
                  return b.upvote_count - a.upvote_count;
                })
                .map((comment, index) => {
                  const isUpvoted = userUpvotes?.includes(comment.id);
                  
                  return (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        'relative p-5 rounded-xl border transition-all',
                        comment.is_solution 
                          ? 'bg-green-500/5 border-green-500/30 ring-1 ring-green-500/20' 
                          : 'bg-card border-border'
                      )}
                    >
                      {/* Solution badge */}
                      {comment.is_solution && (
                        <div className="absolute -top-3 left-4 flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          <Sparkles className="h-3 w-3" />
                          Melhor resposta
                        </div>
                      )}
                      
                      {/* Author info */}
                      <div className="flex items-start gap-3 mb-3">
                        <UserAvatar 
                          name={comment.author_name} 
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground text-sm">
                              {comment.author_name || 'Anônimo'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(comment.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed mb-4 pl-11">
                        {comment.content}
                      </p>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pl-11">
                        <Button
                          variant={isUpvoted ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleUpvote(comment.id)}
                          className={cn(
                            'gap-1.5 h-8 px-3',
                            isUpvoted 
                              ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <ThumbsUp className={cn('h-4 w-4', isUpvoted && 'fill-current')} />
                          <span className="font-medium">{comment.upvote_count}</span>
                        </Button>
                        
                        {isAdmin && !comment.is_solution && topic.status === 'open' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkSolution(comment.id)}
                            className="gap-1.5 h-8 text-green-600 border-green-500/30 hover:bg-green-500/10"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Marcar solução
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Nenhum comentário ainda</p>
              <p className="text-sm text-muted-foreground mt-1">Seja o primeiro a ajudar!</p>
            </div>
          )}
        </div>

        {/* Comment Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-card border border-border rounded-2xl"
        >
          {user ? (
            <>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Adicionar comentário
              </h3>
              
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserAvatar 
                    name={profile?.display_name || user.email?.split('@')[0]} 
                    size="sm"
                    className="flex-shrink-0 mt-2"
                  />
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Compartilhe sua experiência ou ajude com uma resposta..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className={cn(
                        'min-h-[100px] resize-none',
                        error && 'border-destructive focus-visible:ring-destructive'
                      )}
                    />
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={createAnswer.isPending}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {createAnswer.isPending ? 'Enviando...' : 'Enviar comentário'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <LogIn className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Faça login para comentar</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Entre na sua conta para participar da discussão
              </p>
              <Link to="/auth">
                <Button className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
