import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { useProblemById, useCreateProblem, useUpdateProblem } from '@/hooks/useAdminProblems';
import { useToast } from '@/hooks/use-toast';
import type { ProblemStep } from '@/types/database';

export default function AdminProblemForm() {
  const { problemId } = useParams();
  const isEditing = problemId && problemId !== 'novo';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: categories } = useCategories();
  const { data: existingProblem, isLoading } = useProblemById(problemId || '');
  const { mutate: createProblem, isPending: isCreating } = useCreateProblem();
  const { mutate: updateProblem, isPending: isUpdating } = useUpdateProblem();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    quick_answer: '',
    meta_description: '',
    status: 'draft' as 'draft' | 'published',
    featured: false,
  });

  const [steps, setSteps] = useState<ProblemStep[]>([
    { order: 1, title: '', description: '' },
  ]);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const [warnings, setWarnings] = useState<string[]>([]);
  const [warningInput, setWarningInput] = useState('');

  useEffect(() => {
    if (existingProblem) {
      setFormData({
        title: existingProblem.title,
        slug: existingProblem.slug,
        category_id: existingProblem.category_id,
        quick_answer: existingProblem.quick_answer,
        meta_description: existingProblem.meta_description || '',
        status: existingProblem.status,
        featured: existingProblem.featured,
      });
      setSteps(existingProblem.steps.length > 0 ? existingProblem.steps : [{ order: 1, title: '', description: '' }]);
      setTags(existingProblem.tags);
      setWarnings(existingProblem.warnings);
    }
  }, [existingProblem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const slug = formData.slug || formData.title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const problemData = {
      ...formData,
      slug,
      steps: steps.filter(s => s.title.trim()),
      tags,
      warnings,
    };

    if (isEditing && problemId) {
      updateProblem(
        { id: problemId, ...problemData },
        {
          onSuccess: () => {
            toast({ title: 'Problema atualizado!' });
            navigate('/admin/problemas');
          },
          onError: (error) => {
            toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
          },
        }
      );
    } else {
      createProblem(problemData, {
        onSuccess: () => {
          toast({ title: 'Problema criado!' });
          navigate('/admin/problemas');
        },
        onError: (error) => {
          toast({ title: 'Erro ao criar', description: error.message, variant: 'destructive' });
        },
      });
    }
  };

  const addStep = () => {
    setSteps([...steps, { order: steps.length + 1, title: '', description: '' }]);
  };

  const updateStep = (index: number, field: keyof ProblemStep, value: string | number) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps.map((s, i) => ({ ...s, order: i + 1 })));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addWarning = () => {
    if (warningInput.trim() && !warnings.includes(warningInput.trim())) {
      setWarnings([...warnings, warningInput.trim()]);
      setWarningInput('');
    }
  };

  const removeWarning = (warning: string) => {
    setWarnings(warnings.filter(w => w !== warning));
  };

  if (isEditing && isLoading) {
    return (
      <AdminLayout title="Carregando...">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? 'Editar problema' : 'Novo problema'}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Basic Info */}
        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
          <h2 className="font-semibold text-foreground">Informações básicas</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Título *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Celular não liga"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categoria *</label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
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

          <div>
            <label className="block text-sm font-medium mb-2">Resposta rápida *</label>
            <Textarea
              value={formData.quick_answer}
              onChange={(e) => setFormData({ ...formData, quick_answer: e.target.value })}
              placeholder="Tente segurar o botão de ligar por 10 segundos..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meta descrição (SEO)</label>
            <Input
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="Aprenda como resolver quando seu celular não liga..."
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.meta_description.length}/160 caracteres
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Passo a passo</h2>
            <Button type="button" variant="outline" size="sm" onClick={addStep}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>

          {steps.map((step, index) => (
            <div key={index} className="flex gap-3 items-start p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 pt-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  placeholder="Título do passo"
                />
                <Textarea
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  placeholder="Descrição detalhada..."
                  rows={2}
                />
              </div>
              {steps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(index)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
          <h2 className="font-semibold text-foreground">Tags</h2>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Nova tag..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              Adicionar
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-destructive min-h-0 min-w-0"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Warnings */}
        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
          <h2 className="font-semibold text-foreground">Avisos de risco</h2>
          <div className="flex gap-2">
            <Input
              value={warningInput}
              onChange={(e) => setWarningInput(e.target.value)}
              placeholder="Novo aviso..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWarning())}
            />
            <Button type="button" variant="outline" onClick={addWarning}>
              Adicionar
            </Button>
          </div>
          {warnings.length > 0 && (
            <div className="space-y-2">
              {warnings.map((warning) => (
                <div
                  key={warning}
                  className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-center justify-between"
                >
                  {warning}
                  <button
                    type="button"
                    onClick={() => removeWarning(warning)}
                    className="text-destructive hover:text-destructive/70 min-h-0 min-w-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
          <h2 className="font-semibold text-foreground">Configurações</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Publicar</p>
              <p className="text-sm text-muted-foreground">Tornar visível no site</p>
            </div>
            <Switch
              checked={formData.status === 'published'}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, status: checked ? 'published' : 'draft' })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Destaque</p>
              <p className="text-sm text-muted-foreground">Exibir na home</p>
            </div>
            <Switch
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/problemas')}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar problema'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
