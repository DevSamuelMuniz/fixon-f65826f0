import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MessageCircle, Clock, ThumbsUp, 
  CheckCircle2, Send, FileText, HelpCircle, Sparkles, Tag, FolderOpen
} from 'lucide-react';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { UserAvatar } from '@/components/UserAvatar';
import { useToast } from '@/hooks/use-toast';
import { useForumQuestion, useCreateAnswer, useToggleUpvote, useUserUpvotes, useMarkAsSolution, useConvertToProblem } from '@/hooks/useForum';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const answerSchema = z.object({
  content: z.string().min(10, 'Sua resposta deve ter pelo menos 10 caracteres').max(5000, 'Resposta muito longa'),
  author_name: z.string().max(100, 'Nome muito longo').optional(),
});

const statusConfig = {
  open: { label: 'Aberta', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: HelpCircle },
  resolved: { label: 'Resolvida', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 },
  converted: { label: 'Artigo criado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: FileText },
};

const TAG_CONFIG: Record<string, { label: string; color: string }> = {
  urgente: { label: 'Urgente', color: 'bg-red-500/10 text-red-500 border-red-500/30' },
  iniciante: { label: 'Iniciante', color: 'bg-green-500/10 text-green-500 border-green-500/30' },
  avancado: { label: 'Avançado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
  dica: { label: 'Dica', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  erro: { label: 'Erro', color: 'bg-orange-500/10 text-orange-500 border-orange-500/30' },
  configuracao: { label: 'Configuração', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  instalacao: { label: 'Instalação', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30' },
  atualizacao: { label: 'Atualização', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30' },
};

function getTagConfig(tag: string) {
  return TAG_CONFIG[tag] || { label: tag, color: 'bg-muted text-muted-foreground border-border' };
}

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

export default function QuestionDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  const { data: question, isLoading } = useForumQuestion(questionId || '');
  const { data: categories } = useCategories();
  const answerIds = question?.answers?.map(a => a.id) || [];
  const { data: userUpvotes } = useUserUpvotes(answerIds);
  
  const createAnswer = useCreateAnswer();
  const toggleUpvote = useToggleUpvote();
  const markAsSolution = useMarkAsSolution();
  const convertToProblem = useConvertToProblem();
  
  const [answerForm, setAnswerForm] = useState({ content: '', author_name: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = answerSchema.safeParse(answerForm);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }
    
    try {
      await createAnswer.mutateAsync({
        question_id: questionId!,
        content: answerForm.content,
        author_name: answerForm.author_name || undefined,
      });
      
      toast({ title: 'Resposta enviada!' });
      setAnswerForm({ content: '', author_name: '' });
    } catch (error) {
      toast({ title: 'Erro ao enviar', variant: 'destructive' });
    }
  };

  const handleUpvote = async (answerId: string) => {
    try {
      await toggleUpvote.mutateAsync({ answerId, questionId: questionId! });
    } catch (error) {
      toast({ title: 'Erro ao votar', variant: 'destructive' });
    }
  };

  const handleMarkSolution = async (answerId: string) => {
    try {
      await markAsSolution.mutateAsync({ answerId, questionId: questionId! });
      toast({ title: 'Resposta marcada como solução!' });
    } catch (error) {
      toast({ title: 'Erro', variant: 'destructive' });
    }
  };

  const handleConvert = async () => {
    if (!selectedCategory) return;
    
    try {
      const problem = await convertToProblem.mutateAsync({ 
        questionId: questionId!, 
        categoryId: selectedCategory 
      });
      toast({ title: 'Problema criado como rascunho!' });
      setShowConvertDialog(false);
      navigate(`/admin/problemas/${problem.id}`);
    } catch (error) {
      toast({ title: 'Erro ao converter', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-3xl px-4 py-8">
          <Skeleton className="h-6 w-32 mb-6 shimmer" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-12 w-12 rounded-full shimmer" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-3/4 shimmer" />
              <Skeleton className="h-4 w-1/2 shimmer" />
            </div>
          </div>
          <Skeleton className="h-32 w-full mb-8 shimmer" />
          <Skeleton className="h-24 w-full shimmer" />
        </div>
      </Layout>
    );
  }

  if (!question) {
    return (
      <Layout>
        <EmptyState
          type="notFound"
          title="Pergunta não encontrada"
          description="Esta pergunta não existe ou foi removida."
        />
      </Layout>
    );
  }

  const status = statusConfig[question.status as keyof typeof statusConfig];
  const StatusIcon = status?.icon || HelpCircle;

  return (
    <Layout>
      <div className="container max-w-3xl px-4 py-8">
        <Link
          to="/forum"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 min-h-0 min-w-0"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao fórum
        </Link>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-card border border-border rounded-2xl"
        >
          {/* Author Header */}
          <div className="flex items-start gap-4 mb-4">
            <UserAvatar 
              name={question.author_name} 
              size="lg"
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-foreground">
                  {question.author_name || 'Anônimo'}
                </span>
                <span className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                  status?.color
                )}>
                  <StatusIcon className="h-3 w-3" />
                  {status?.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(question.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
            {question.title}
          </h1>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {question.description}
            </p>
          </div>

          {/* Category & Tags */}
          {(question.category || (question.tags && question.tags.length > 0)) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              {question.category && (
                <Badge variant="outline" className="gap-1 bg-primary/5 border-primary/20 text-primary">
                  <FolderOpen className="h-3 w-3" />
                  {question.category.name}
                </Badge>
              )}
              {question.tags?.map((tag) => {
                const tagConfig = getTagConfig(tag);
                return (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={cn('gap-1 border', tagConfig.color)}
                  >
                    <Tag className="h-3 w-3" />
                    {tagConfig.label}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Admin Actions */}
          {isAdmin && question.status !== 'converted' && (
            <div className="flex gap-2 mt-6 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConvertDialog(true)}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Converter em artigo
              </Button>
            </div>
          )}
        </motion.div>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {question.answer_count} {question.answer_count === 1 ? 'Resposta' : 'Respostas'}
          </h2>

          {question.answers && question.answers.length > 0 ? (
            <div className="space-y-4">
              {/* Sort: solution first, then by upvotes */}
              {[...question.answers]
                .sort((a, b) => {
                  if (a.is_solution && !b.is_solution) return -1;
                  if (!a.is_solution && b.is_solution) return 1;
                  return b.upvote_count - a.upvote_count;
                })
                .map((answer, index) => {
                  const isUpvoted = userUpvotes?.includes(answer.id);
                  
                  return (
                    <motion.div
                      key={answer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'relative p-5 rounded-xl border transition-all',
                        answer.is_solution 
                          ? 'bg-green-500/5 border-green-500/30 ring-1 ring-green-500/20' 
                          : 'bg-card border-border hover:border-border/80'
                      )}
                    >
                      {/* Solution Badge */}
                      {answer.is_solution && (
                        <div className="absolute -top-3 left-4 flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          <Sparkles className="h-3 w-3" />
                          Melhor resposta
                        </div>
                      )}
                      
                      {/* Author Info */}
                      <div className="flex items-start gap-3 mb-3">
                        <UserAvatar 
                          name={answer.author_name} 
                          size="sm"
                          className="flex-shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground text-sm">
                              {answer.author_name || 'Anônimo'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(answer.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Answer Content */}
                      <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed mb-4 pl-11">
                        {answer.content}
                      </p>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pl-11">
                        <Button
                          variant={isUpvoted ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleUpvote(answer.id)}
                          className={cn(
                            'gap-1.5 h-8 px-3',
                            isUpvoted 
                              ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <ThumbsUp className={cn('h-4 w-4', isUpvoted && 'fill-current')} />
                          <span className="font-medium">{answer.upvote_count}</span>
                          <span className="hidden sm:inline">útil</span>
                        </Button>
                        
                        {isAdmin && !answer.is_solution && question.status === 'open' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkSolution(answer.id)}
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
              <p className="text-muted-foreground font-medium">Nenhuma resposta ainda</p>
              <p className="text-sm text-muted-foreground mt-1">Seja o primeiro a ajudar!</p>
            </div>
          )}
        </div>

        {/* Answer Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-card border border-border rounded-2xl"
        >
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Sua resposta
          </h3>
          
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Compartilhe sua solução ou dica para ajudar..."
                value={answerForm.content}
                onChange={(e) => setAnswerForm(prev => ({ ...prev, content: e.target.value }))}
                className={cn(
                  'min-h-[120px] resize-none',
                  errors.content && 'border-destructive focus-visible:ring-destructive'
                )}
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="answer_name" className="text-sm text-muted-foreground">
                  Seu nome (opcional)
                </Label>
                <Input
                  id="answer_name"
                  placeholder="Anônimo"
                  value={answerForm.author_name}
                  onChange={(e) => setAnswerForm(prev => ({ ...prev, author_name: e.target.value }))}
                />
              </div>
              <Button 
                type="submit" 
                disabled={createAnswer.isPending} 
                className="gap-2 h-10 px-6"
              >
                <Send className="h-4 w-4" />
                {createAnswer.isPending ? 'Enviando...' : 'Enviar resposta'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Convert Dialog */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Converter em artigo
            </DialogTitle>
            <DialogDescription>
              Crie um novo problema/solução baseado nesta pergunta do fórum.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <p className="text-sm text-muted-foreground">
              O problema será criado como rascunho para você editar antes de publicar.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConvertDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConvert} 
              disabled={!selectedCategory || convertToProblem.isPending}
            >
              {convertToProblem.isPending ? 'Convertendo...' : 'Criar rascunho'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
