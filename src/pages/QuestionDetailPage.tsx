import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MessageCircle, Clock, User, ThumbsUp, 
  CheckCircle2, Send, Shield, FileText, HelpCircle 
} from 'lucide-react';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
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
  open: { label: 'Aberta', color: 'bg-blue-500/10 text-blue-500', icon: HelpCircle },
  resolved: { label: 'Resolvida', color: 'bg-green-500/10 text-green-500', icon: CheckCircle2 },
  converted: { label: 'Artigo criado', color: 'bg-purple-500/10 text-purple-500', icon: FileText },
};

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
          <Skeleton className="h-10 w-full mb-4 shimmer" />
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

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={cn('p-3 rounded-xl flex-shrink-0', status?.color)}>
              <StatusIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{question.title}</h1>
                <span className={cn('flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium', status?.color)}>
                  {status?.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(question.created_at).toLocaleDateString('pt-BR', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })}
                </span>
                {question.author_name && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {question.author_name}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-xl">
            <p className="text-foreground whitespace-pre-wrap">{question.description}</p>
          </div>

          {/* Admin Actions */}
          {isAdmin && question.status !== 'converted' && (
            <div className="flex gap-2 mt-4">
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

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {question.answer_count} {question.answer_count === 1 ? 'Resposta' : 'Respostas'}
          </h2>

          {question.answers && question.answers.length > 0 ? (
            <div className="space-y-4">
              {question.answers.map((answer, index) => {
                const isUpvoted = userUpvotes?.includes(answer.id);
                
                return (
                  <motion.div
                    key={answer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'p-4 rounded-xl border',
                      answer.is_solution 
                        ? 'bg-green-500/5 border-green-500/30' 
                        : 'bg-card border-border'
                    )}
                  >
                    {answer.is_solution && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-3">
                        <CheckCircle2 className="h-4 w-4" />
                        Melhor resposta
                      </div>
                    )}
                    
                    <p className="text-foreground whitespace-pre-wrap mb-4">{answer.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(answer.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        {answer.author_name && (
                          <span>{answer.author_name}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpvote(answer.id)}
                          className={cn(
                            'gap-1 min-h-8 min-w-8',
                            isUpvoted && 'text-primary'
                          )}
                        >
                          <ThumbsUp className={cn('h-4 w-4', isUpvoted && 'fill-current')} />
                          {answer.upvote_count}
                        </Button>
                        
                        {isAdmin && !answer.is_solution && question.status === 'open' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkSolution(answer.id)}
                            className="gap-1 min-h-8"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Marcar solução
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/30 rounded-xl">
              <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Nenhuma resposta ainda. Seja o primeiro!</p>
            </div>
          )}
        </div>

        {/* Answer Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-card border border-border rounded-xl"
        >
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Send className="h-5 w-5" />
            Sua resposta
          </h3>
          
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Compartilhe sua solução ou dica..."
                value={answerForm.content}
                onChange={(e) => setAnswerForm(prev => ({ ...prev, content: e.target.value }))}
                className={`min-h-[120px] ${errors.content ? 'border-destructive' : ''}`}
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="answer_name" className="text-sm">
                  Seu nome (opcional)
                </Label>
                <Input
                  id="answer_name"
                  placeholder="Anônimo"
                  value={answerForm.author_name}
                  onChange={(e) => setAnswerForm(prev => ({ ...prev, author_name: e.target.value }))}
                />
              </div>
              <Button type="submit" disabled={createAnswer.isPending} className="gap-2">
                <Send className="h-4 w-4" />
                {createAnswer.isPending ? 'Enviando...' : 'Enviar'}
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
