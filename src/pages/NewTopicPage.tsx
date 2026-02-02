import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft, Send, FolderOpen, LogIn } from 'lucide-react';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateQuestion } from '@/hooks/useForum';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';

const topicSchema = z.object({
  title: z.string().min(10, 'O título deve ter pelo menos 10 caracteres').max(300, 'O título deve ter no máximo 300 caracteres'),
  description: z.string().min(20, 'Descreva melhor sua dúvida (mínimo 20 caracteres)').max(5000, 'Descrição muito longa'),
  category_id: z.string().min(1, 'Selecione uma categoria'),
});

export default function NewTopicPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const createQuestion = useCreateQuestion();
  const { data: categories } = useCategories();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: searchParams.get('categoria') || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: 'Faça login primeiro',
        description: 'Você precisa estar logado para criar um tópico.',
        variant: 'destructive',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!user) {
      toast({ title: 'Faça login para continuar', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    
    const result = topicSchema.safeParse(formData);
    
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
      const topic = await createQuestion.mutateAsync({
        title: formData.title,
        description: formData.description,
        author_name: profile?.display_name || user.email?.split('@')[0] || undefined,
        category_id: formData.category_id,
        user_id: user.id,
      });
      
      toast({
        title: 'Tópico criado!',
        description: 'A comunidade vai ajudar você em breve.',
      });
      
      navigate(`/comunidade/topico/${topic.id}`);
    } catch (err) {
      toast({
        title: 'Erro ao criar',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <Layout>
        <div className="container max-w-md px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8 bg-card border border-border rounded-2xl"
          >
            <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2">Faça login para participar</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para criar tópicos na comunidade.
            </p>
            <div className="space-y-3">
              <Link to="/auth" className="block">
                <Button className="w-full gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </Button>
              </Link>
              <Link to="/comunidade" className="block">
                <Button variant="outline" className="w-full">
                  Voltar à comunidade
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-2xl px-4 py-8">
        <Link
          to="/comunidade"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar à comunidade
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <MessageCircle className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Novo Tópico</h1>
              <p className="text-sm text-muted-foreground">Inicie uma discussão na comunidade</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Categoria *
              </Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger className={errors.category_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        {cat.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-destructive">{errors.category_id}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ex: Como resolver Wi-Fi que desconecta sozinho?"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                placeholder="Explique em detalhes o problema ou assunto que você quer discutir..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`min-h-[180px] ${errors.description ? 'border-destructive' : ''}`}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Quanto mais detalhes você fornecer, mais fácil será para a comunidade ajudar.
              </p>
            </div>

            {/* Author info */}
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground">
                Publicando como: <span className="font-medium text-foreground">{profile?.display_name || user.email?.split('@')[0] || 'Usuário'}</span>
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={createQuestion.isPending}
            >
              <Send className="h-5 w-5" />
              {createQuestion.isPending ? 'Criando...' : 'Criar tópico'}
            </Button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
