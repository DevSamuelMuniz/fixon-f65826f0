import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MessageCircle, Clock, ThumbsUp, CheckCircle2, Send, 
  Eye, Pin, LogIn, Sparkles, FolderOpen, Hash, Share2, SortAsc, Crown
} from 'lucide-react';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { UserAvatar } from '@/components/UserAvatar';
import { useToast } from '@/hooks/use-toast';
import { useForumQuestion, useCreateAnswer, useToggleUpvote, useUserUpvotes, useMarkAsSolution, useIncrementViewCount } from '@/hooks/useForum';
import { useMultipleUserBadges } from '@/hooks/useUserBadges';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumUsers } from '@/hooks/usePremiumUsers';
import { cn } from '@/lib/utils';
import { RichTextInput, RichTextDisplay, ImageUpload, ImageGallery, UserBadges } from '@/components/community';

const commentSchema = z.object({
  content: z.string().min(5, 'Comentário muito curto (mínimo 5 caracteres)').max(5000, 'Comentário muito longo'),
});

const MAX_CHARS = 5000;

type SortMode = 'best' | 'newest' | 'oldest';

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
  const [sortMode, setSortMode] = useState<SortMode>('best');
  
  const allUserIds = [
    topic?.user_id,
    ...(topic?.answers?.map(a => a.user_id) || [])
  ].filter((id): id is string => !!id);
  const { data: userBadges } = useMultipleUserBadges(allUserIds);
  const { data: premiumUsers } = usePremiumUsers(allUserIds);
  
  const createAnswer = useCreateAnswer();
  const toggleUpvote = useToggleUpvote();
  const markAsSolution = useMarkAsSolution();
  
  const [commentContent, setCommentContent] = useState('');
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const [commentMentions, setCommentMentions] = useState<string[]>([]);
  const [error, setError] = useState('');

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
        images: commentImages,
        mentions: commentMentions,
      });
      
      toast({ title: 'Comentário enviado!' });
      setCommentContent('');
      setCommentImages([]);
      setCommentMentions([]);
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({ title: 'Link copiado!', description: 'O link do tópico foi copiado para a área de transferência.' });
    });
  };

  const sortedAnswers = () => {
    if (!topic?.answers) return [];
    const answers = [...topic.answers];
    
    if (sortMode === 'best') {
      return answers.sort((a, b) => {
        if (a.is_solution && !b.is_solution) return -1;
        if (!a.is_solution && b.is_solution) return 1;
        return b.upvote_count - a.upvote_count;
      });
    }
    if (sortMode === 'newest') {
      return answers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return answers.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  const canMarkSolution = isAdmin || (user && topic?.user_id === user.id);

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
  const isTopicAuthorPremium = topic.user_id ? premiumUsers?.has(topic.user_id) : false;

  return (
    <Layout>
      <div className="container max-w-4xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/comunidade" className="hover:text-primary transition-colors">Comunidade</Link>
          {topic.category && (
            <>
              <span>/</span>
              <Link to={`/comunidade/${topic.category.slug}`} className="hover:text-primary transition-colors">
                {topic.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{topic.title}</span>
        </nav>

        {/* Topic Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mb-8 p-6 bg-card border rounded-2xl",
            isTopicAuthorPremium
              ? "border-amber-400/60 shadow-[0_0_20px_hsl(var(--premium-glow,45_100%_50%)/0.15)] ring-1 ring-amber-400/30"
              : topic.is_pinned
              ? "border-amber-500/30"
              : "border-border"
          )}
        >
          {isTopicAuthorPremium && (
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400/10 text-amber-500 border border-amber-400/30 rounded-full text-xs font-semibold">
                <Crown className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                Premium
              </span>
            </div>
          )}
          {topic.is_pinned && !isTopicAuthorPremium && (
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-amber-500 text-white">
                <Pin className="h-3 w-3 mr-1" />
                Fixado
              </Badge>
            </div>
          )}
          {topic.is_pinned && isTopicAuthorPremium && (
            <Badge className="bg-amber-500 text-white mb-3 mr-2">
              <Pin className="h-3 w-3 mr-1" />
              Fixado
            </Badge>
          )}
          
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
                {isTopicAuthorPremium && (
                  <Crown className="h-4 w-4 fill-amber-400 text-amber-400 flex-shrink-0" />
                )}
                {topic.user_id && userBadges?.[topic.user_id] && (
                  <UserBadges badges={userBadges[topic.user_id]} size="sm" maxDisplay={3} />
                )}
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
            {/* Share button */}
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5 text-muted-foreground hover:text-foreground flex-shrink-0">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
            {topic.title}
          </h1>
          
          <div className="prose prose-sm max-w-none mb-4">
            <RichTextDisplay 
              content={topic.description}
              className="text-foreground/90"
            />
          </div>

          {topic.images && topic.images.length > 0 && (
            <div className="mb-4">
              <ImageGallery images={topic.images} />
            </div>
          )}

          {topic.tags && topic.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {topic.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  <Hash className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              {topic.answer_count} {topic.answer_count === 1 ? 'Comentário' : 'Comentários'}
            </h2>

            {topic.answers && topic.answers.length > 1 && (
              <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden text-xs">
                {(['best', 'newest', 'oldest'] as SortMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSortMode(mode)}
                    className={cn(
                      'px-3 py-1.5 transition-colors font-medium',
                      sortMode === mode
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {mode === 'best' ? 'Melhores' : mode === 'newest' ? 'Recentes' : 'Antigas'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {topic.answers && topic.answers.length > 0 ? (
            <div className="space-y-4">
              {sortedAnswers().map((comment, index) => {
                const isUpvoted = userUpvotes?.includes(comment.id);
                const isCommentAuthorPremium = comment.user_id ? premiumUsers?.has(comment.user_id) : false;
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
                        : isCommentAuthorPremium
                        ? 'bg-amber-400/5 border-amber-400/40 ring-1 ring-amber-400/20'
                        : 'bg-card border-border'
                    )}
                  >
                    {comment.is_solution && (
                      <div className="absolute -top-3 left-4 flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        Melhor resposta
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 mb-3">
                      <UserAvatar 
                        name={comment.author_name} 
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground text-sm">
                            {comment.author_name || 'Anônimo'}
                          </span>
                          {isCommentAuthorPremium && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-400/15 text-amber-500 border border-amber-400/30 rounded-full text-xs font-semibold">
                              <Crown className="h-3 w-3 fill-amber-400 text-amber-400" />
                              Premium
                            </span>
                          )}
                          {comment.user_id && userBadges?.[comment.user_id] && (
                            <UserBadges badges={userBadges[comment.user_id]} size="sm" maxDisplay={2} />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4 pl-11">
                      <RichTextDisplay 
                        content={comment.content}
                        className="text-foreground/90"
                      />
                      {comment.images && comment.images.length > 0 && (
                        <div className="mt-3">
                          <ImageGallery images={comment.images} />
                        </div>
                      )}
                    </div>

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
                      
                      {canMarkSolution && !comment.is_solution && topic.status === 'open' && (
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
                <div>
                  <RichTextInput
                    value={commentContent}
                    onChange={(val, mentions) => {
                      setCommentContent(val);
                      setCommentMentions(mentions || []);
                    }}
                    placeholder="Escreva seu comentário... Use @nome para mencionar alguém"
                    maxChars={MAX_CHARS}
                  />
                  {error && <p className="text-destructive text-sm mt-1">{error}</p>}
                  <div className="text-xs text-muted-foreground text-right mt-1">
                    {commentContent.length}/{MAX_CHARS}
                  </div>
                </div>

                <ImageUpload
                  images={commentImages}
                  onChange={setCommentImages}
                  maxImages={3}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={createAnswer.isPending || !commentContent.trim()}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {createAnswer.isPending ? 'Enviando...' : 'Enviar comentário'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <LogIn className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium mb-2">Entre para comentar</p>
              <p className="text-sm text-muted-foreground mb-4">
                Faça login para participar da discussão
              </p>
              <Link to="/auth">
                <Button className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Fazer login
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Back button */}
        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    </Layout>
  );
}
