import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { useProblemsAdmin, useDeleteProblem, useToggleProblemStatus } from '@/hooks/useAdminProblems';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminProblems() {
  const { data: problems, isLoading } = useProblemsAdmin();
  const { mutate: deleteProblem } = useDeleteProblem();
  const { mutate: toggleStatus } = useToggleProblemStatus();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = () => {
    if (deleteId) {
      deleteProblem(deleteId, {
        onSuccess: () => {
          toast({ title: 'Problema excluído com sucesso!' });
          setDeleteId(null);
        },
        onError: () => {
          toast({ title: 'Erro ao excluir', variant: 'destructive' });
        },
      });
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    toggleStatus({ id, status: newStatus }, {
      onSuccess: () => {
        toast({
          title: newStatus === 'published' ? 'Problema publicado!' : 'Problema despublicado',
        });
      },
    });
  };

  return (
    <AdminLayout title="Problemas">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {problems?.length || 0} problema(s) cadastrado(s)
        </p>
        <Link to="/admin/problemas/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo problema
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : problems && problems.length > 0 ? (
        <div className="space-y-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-card p-4 rounded-xl border border-border flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">{problem.title}</h3>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      problem.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {problem.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {problem.category?.name} • {problem.view_count} visualizações
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleStatus(problem.id, problem.status)}
                  title={problem.status === 'published' ? 'Despublicar' : 'Publicar'}
                >
                  {problem.status === 'published' ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Link to={`/admin/problemas/${problem.id}`}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(problem.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground mb-4">Nenhum problema cadastrado</p>
          <Link to="/admin/problemas/novo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar primeiro problema
            </Button>
          </Link>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir problema?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O problema será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
