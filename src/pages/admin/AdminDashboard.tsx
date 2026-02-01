import { useQuery } from '@tanstack/react-query';
import { FileText, FolderOpen, Eye, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [categoriesRes, problemsRes, viewsRes] = await Promise.all([
        supabase.from('categories').select('id', { count: 'exact' }),
        supabase.from('problems').select('id, status, view_count'),
        supabase.from('problems').select('view_count'),
      ]);

      const problems = problemsRes.data || [];
      const published = problems.filter(p => p.status === 'published').length;
      const totalViews = problems.reduce((sum, p) => sum + (p.view_count || 0), 0);

      return {
        categories: categoriesRes.count || 0,
        totalProblems: problems.length,
        publishedProblems: published,
        totalViews,
      };
    },
  });

  const statCards = [
    {
      label: 'Categorias',
      value: stats?.categories || 0,
      icon: FolderOpen,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Problemas',
      value: stats?.totalProblems || 0,
      icon: FileText,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Publicados',
      value: stats?.publishedProblems || 0,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      label: 'Visualizações',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-card p-4 rounded-xl border border-border"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-card p-6 rounded-xl border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Bem-vindo ao painel!</h2>
        <p className="text-muted-foreground">
          Use o menu para gerenciar categorias e problemas do Fix-on.
        </p>
      </div>
    </AdminLayout>
  );
}
