import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, Clock, CheckCircle2, FileText, ChevronRight, HelpCircle, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAvatar } from '@/components/UserAvatar';
import { useForumQuestions } from '@/hooks/useForum';
import { cn } from '@/lib/utils';
import { AdInFeed } from '@/components/ads';
import React from 'react';

const statusConfig = {
  open: { label: 'Aberta', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: HelpCircle },
  resolved: { label: 'Resolvida', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 },
  converted: { label: 'Artigo criado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: FileText },
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

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
                    <div key={i} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                      <Skeleton className="h-10 w-10 rounded-full shimmer" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4 shimmer" />
                        <Skeleton className="h-4 w-full shimmer" />
                        <Skeleton className="h-3 w-1/3 shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : questions && questions.length > 0 ? (
                <div className="space-y-3">
                  {questions.map((question, index) => {
                    const status = statusConfig[question.status as keyof typeof statusConfig];
                    const StatusIcon = status?.icon || HelpCircle;
                    
                    return (
                      <React.Fragment key={question.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={`/forum/${question.id}`}
                            className="group block p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
                          >
                            <div className="flex gap-3">
                              {/* Avatar */}
                              <UserAvatar 
                                name={question.author_name} 
                                size="md"
                                className="flex-shrink-0 mt-0.5"
                              />
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                    {question.title}
                                  </h3>
                                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                                </div>
                                
                                {/* Description */}
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {question.description}
                                </p>
                                
                                {/* Footer */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                                  {/* Author */}
                                  <span className="font-medium text-foreground">
                                    {question.author_name || 'Anônimo'}
                                  </span>
                                  
                                  {/* Time */}
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatTimeAgo(question.created_at)}
                                  </span>
                                  
                                  {/* Answers */}
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <MessageCircle className="h-3 w-3" />
                                    {question.answer_count} {question.answer_count === 1 ? 'resposta' : 'respostas'}
                                  </span>
                                  
                                  {/* Status Badge */}
                                  <span className={cn(
                                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                                    status?.color
                                  )}>
                                    <StatusIcon className="h-3 w-3" />
                                    {status?.label}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                        {/* Show ad after every 5 questions */}
                        {(index + 1) % 5 === 0 && index < questions.length - 1 && (
                          <AdInFeed />
                        )}
                      </React.Fragment>
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
