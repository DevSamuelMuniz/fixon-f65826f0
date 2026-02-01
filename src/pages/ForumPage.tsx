import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, Clock, CheckCircle2, FileText, ChevronRight, HelpCircle, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForumQuestions } from '@/hooks/useForum';
import { cn } from '@/lib/utils';

const statusConfig = {
  open: { label: 'Aberta', color: 'bg-blue-500/10 text-blue-500', icon: HelpCircle },
  resolved: { label: 'Resolvida', color: 'bg-green-500/10 text-green-500', icon: CheckCircle2 },
  converted: { label: 'Artigo criado', color: 'bg-purple-500/10 text-purple-500', icon: FileText },
};

export default function ForumPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { data: questions, isLoading } = useForumQuestions(activeTab === 'all' ? undefined : activeTab);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-purple-500/5 via-primary/5 to-transparent overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-sm font-medium mb-4">
                <Users className="h-4 w-4" />
                Comunidade
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Fórum de Dúvidas
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Não encontrou a solução? Pergunte à comunidade! Outros usuários e nossos especialistas vão te ajudar.
              </p>
            </div>
            <Link to="/forum/nova-pergunta">
              <Button size="lg" className="gap-2 shadow-lg">
                <Plus className="h-5 w-5" />
                Nova Pergunta
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Questions List */}
      <section className="py-8 px-4">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="open">Abertas</TabsTrigger>
              <TabsTrigger value="resolved">Resolvidas</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl shimmer" />
                  ))}
                </div>
              ) : questions && questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const status = statusConfig[question.status as keyof typeof statusConfig];
                    const StatusIcon = status?.icon || HelpCircle;
                    
                    return (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={`/forum/${question.id}`}
                          className="group flex gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all"
                        >
                          <div className={cn('flex-shrink-0 p-3 rounded-xl', status?.color)}>
                            <StatusIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {question.title}
                              </h3>
                              <span className={cn('flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium', status?.color)}>
                                {status?.label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {question.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3.5 w-3.5" />
                                {question.answer_count} respostas
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {new Date(question.created_at).toLocaleDateString('pt-BR')}
                              </span>
                              {question.author_name && (
                                <span>por {question.author_name}</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 self-center" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <MessageCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Nenhuma pergunta ainda</h3>
                  <p className="text-muted-foreground mb-6">Seja o primeiro a fazer uma pergunta!</p>
                  <Link to="/forum/nova-pergunta">
                    <Button>Fazer uma pergunta</Button>
                  </Link>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
