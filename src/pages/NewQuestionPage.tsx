import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, User, Mail, ArrowLeft, Send, Tag, FolderOpen } from 'lucide-react';
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
import { Link } from 'react-router-dom';

const questionSchema = z.object({
  title: z.string().min(10, 'O título deve ter pelo menos 10 caracteres').max(300, 'O título deve ter no máximo 300 caracteres'),
  description: z.string().min(20, 'Descreva melhor sua dúvida (mínimo 20 caracteres)').max(5000, 'Descrição muito longa'),
  author_name: z.string().max(100, 'Nome muito longo').optional(),
  author_email: z.string().email('Email inválido').optional().or(z.literal('')),
});

const TAGS = [
  { value: 'urgente', label: 'Urgente' },
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'avancado', label: 'Avançado' },
  { value: 'dica', label: 'Dica' },
  { value: 'erro', label: 'Erro' },
  { value: 'configuracao', label: 'Configuração' },
  { value: 'instalacao', label: 'Instalação' },
  { value: 'atualizacao', label: 'Atualização' },
];

export default function NewQuestionPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createQuestion = useCreateQuestion();
  const { data: categories } = useCategories();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author_name: '',
    author_email: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = questionSchema.safeParse(formData);
    
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
      // Find category ID from slug
      const categoryId = selectedCategory 
        ? categories?.find(c => c.id === selectedCategory)?.id 
        : undefined;
      
      const question = await createQuestion.mutateAsync({
        title: formData.title,
        description: formData.description,
        author_name: formData.author_name || undefined,
        author_email: formData.author_email || undefined,
        category_id: categoryId,
        tags: selectedTag ? [selectedTag] : [],
      });
      
      toast({
        title: 'Pergunta enviada!',
        description: 'A comunidade vai ajudar você em breve.',
      });
      
      navigate(`/forum/${question.id}`);
    } catch (error) {
      toast({
        title: 'Erro ao enviar',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl px-4 py-8">
        <Link
          to="/forum"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 min-h-0 min-w-0"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao fórum
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
              <h1 className="text-2xl font-bold text-foreground">Nova Pergunta</h1>
              <p className="text-sm text-muted-foreground">Descreva sua dúvida para a comunidade</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título da pergunta *</Label>
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
              <Label htmlFor="description">Descreva sua dúvida *</Label>
              <Textarea
                id="description"
                placeholder="Explique em detalhes o problema que você está enfrentando. Quanto mais informações, melhor!"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`min-h-[150px] ${errors.description ? 'border-destructive' : ''}`}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Filters - Category and Tag */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Categoria
                </Label>
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
                <p className="text-xs text-muted-foreground">Ajuda a organizar, não é obrigatório</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tag" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tag
                </Label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAGS.map((tag) => (
                      <SelectItem key={tag.value} value={tag.value}>
                        {tag.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Ajuda a filtrar, não é obrigatório</p>
              </div>
            </div>

            {/* Optional info */}
            <div className="p-4 bg-muted/50 rounded-xl space-y-4">
              <p className="text-sm font-medium text-foreground">Informações opcionais</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author_name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Seu nome
                  </Label>
                  <Input
                    id="author_name"
                    placeholder="Anônimo"
                    value={formData.author_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author_email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Seu email
                  </Label>
                  <Input
                    id="author_email"
                    type="email"
                    placeholder="Para receber notificações"
                    value={formData.author_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, author_email: e.target.value }))}
                    className={errors.author_email ? 'border-destructive' : ''}
                  />
                  {errors.author_email && (
                    <p className="text-sm text-destructive">{errors.author_email}</p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={createQuestion.isPending}
            >
              <Send className="h-5 w-5" />
              {createQuestion.isPending ? 'Enviando...' : 'Enviar pergunta'}
            </Button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
