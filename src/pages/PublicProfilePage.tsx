import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2, Award, MapPin, ArrowRight, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/UserAvatar';
import { UserBadges } from '@/components/community';
import { useUserBadges } from '@/hooks/useUserBadges';
import { supabase } from '@/integrations/supabase/client';
import type { BadgeType } from '@/components/community/UserBadge';

interface PublicProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface UserStats {
  topicsCount: number;
  answersCount: number;
  solutionsCount: number;
}

interface RecentTopic {
  id: string;
  title: string;
  status: string;
  answer_count: number;
  created_at: string;
}

interface RecentAnswer {
  id: string;
  content: string;
  is_solution: boolean;
  created_at: string;
  question_id: string;
  question_title?: string;
}

const brazilianStates: Record<string, string> = {
  AC:'Acre',AL:'Alagoas',AP:'Amapá',AM:'Amazonas',BA:'Bahia',CE:'Ceará',
  DF:'Distrito Federal',ES:'Espírito Santo',GO:'Goiás',MA:'Maranhão',
  MT:'Mato Grosso',MS:'Mato Grosso do Sul',MG:'Minas Gerais',PA:'Pará',
  PB:'Paraíba',PR:'Paraná',PE:'Pernambuco',PI:'Piauí',RJ:'Rio de Janeiro',
  RN:'Rio Grande do Norte',RS:'Rio Grande do Sul',RO:'Rondônia',RR:'Roraima',
  SC:'Santa Catarina',SP:'São Paulo',SE:'Sergipe',TO:'Tocantins',
};

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return 'ontem';
  if (diffDays < 30) return `há ${diffDays} dias`;
  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

function formatJoinDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ topicsCount: 0, answersCount: 0, solutionsCount: 0 });
  const [recentTopics, setRecentTopics] = useState<RecentTopic[]>([]);
  const [recentAnswers, setRecentAnswers] = useState<RecentAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { data: userBadges } = useUserBadges(userId);

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);

    // Fetch from profiles_public view (no PII exposed)
    const { data: profileData } = await supabase
      .from('profiles_public')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!profileData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setProfile(profileData as unknown as PublicProfile);

    // Parallel: topics, answers, stats
    const [topicsRes, answersRes, topicsCountRes, answersCountRes, solutionsCountRes] = await Promise.all([
      supabase
        .from('forum_questions')
        .select('id, title, status, answer_count, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('forum_answers')
        .select('id, content, is_solution, created_at, question_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('forum_questions').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('forum_answers').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('forum_answers').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_solution', true),
    ]);

    const topics = (topicsRes.data || []) as RecentTopic[];
    const answers = (answersRes.data || []) as RecentAnswer[];
    setRecentTopics(topics);

    // Fetch question titles for recent answers
    if (answers.length > 0) {
      const qIds = [...new Set(answers.map(a => a.question_id))];
      const { data: questions } = await supabase
        .from('forum_questions')
        .select('id, title')
        .in('id', qIds);
      const qMap: Record<string, string> = {};
      (questions || []).forEach((q: any) => { qMap[q.id] = q.title; });
      setRecentAnswers(answers.map(a => ({ ...a, question_title: qMap[a.question_id] })));
    }

    setStats({
      topicsCount: topicsCountRes.count || 0,
      answersCount: answersCountRes.count || 0,
      solutionsCount: solutionsCountRes.count || 0,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-3xl py-8 px-4 space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl shimmer" />
          <Skeleton className="h-24 w-full rounded-2xl shimmer" />
          <Skeleton className="h-48 w-full rounded-2xl shimmer" />
        </div>
      </Layout>
    );
  }

  if (notFound || !profile) {
    return (
      <Layout>
        <div className="container max-w-3xl py-16 px-4 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Usuário não encontrado</h1>
          <p className="text-muted-foreground mb-6">Este perfil não existe ou não está disponível.</p>
          <Link to="/comunidade">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
              Voltar à Comunidade
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  const displayName = profile.display_name || 'Usuário';

  return (
    <Layout>
      <div className="container max-w-3xl py-8 px-4 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/comunidade" className="hover:text-primary transition-colors">Comunidade</Link>
          <span>/</span>
          <span className="text-foreground">{displayName}</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
            {/* Cover gradient */}
            <div className="h-24 bg-gradient-to-r from-purple-500/20 via-primary/20 to-primary/10" />

            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-10 mb-4">
                <UserAvatar
                  name={displayName}
                  avatarUrl={profile.avatar_url}
                  size="lg"
                  className="h-20 w-20 border-4 border-card ring-2 ring-primary/20"
                />
                {/* Join date badge */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  <Calendar className="h-3 w-3" />
                  Membro desde {formatJoinDate(profile.created_at)}
                </div>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-1">{displayName}</h1>

              {profile.bio && (
                <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{profile.bio}</p>
              )}

              {/* Badges */}
              {userBadges && userBadges.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Conquistas</p>
                  <UserBadges badges={userBadges.map(b => b.badge_type as BadgeType)} size="md" maxDisplay={10} />
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Tópicos', value: stats.topicsCount, icon: MessageCircle, color: 'text-primary' },
              { label: 'Respostas', value: stats.answersCount, icon: Award, color: 'text-green-500' },
              { label: 'Soluções', value: stats.solutionsCount, icon: CheckCircle2, color: 'text-amber-500' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
                <Icon className={`h-5 w-5 mx-auto mb-1 ${color}`} />
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {/* Recent topics */}
          {recentTopics.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 mb-6">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Tópicos recentes
              </h2>
              <div className="space-y-2">
                {recentTopics.map(topic => (
                  <Link
                    key={topic.id}
                    to={`/comunidade/topico/${topic.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {topic.title}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />{topic.answer_count}
                        </span>
                        <span>{formatTimeAgo(topic.created_at)}</span>
                      </p>
                    </div>
                    {topic.status === 'resolved' && (
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/30 flex-shrink-0">
                        Resolvido
                      </Badge>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent answers */}
          {recentAnswers.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-green-500" />
                Respostas recentes
              </h2>
              <div className="space-y-2">
                {recentAnswers.map(answer => (
                  <Link
                    key={answer.id}
                    to={`/comunidade/topico/${answer.question_id}`}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      {answer.question_title && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-0.5 group-hover:text-primary transition-colors">
                          Em: {answer.question_title}
                        </p>
                      )}
                      <p className="text-sm text-foreground/80 line-clamp-2">
                        {answer.content.replace(/<[^>]+>/g, '').substring(0, 120)}...
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(answer.created_at)}</span>
                        {answer.is_solution && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/30">
                            <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                            Solução
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {recentTopics.length === 0 && recentAnswers.length === 0 && (
            <div className="text-center py-12 bg-card border border-dashed border-border rounded-2xl">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Ainda sem atividade pública</p>
              <p className="text-sm text-muted-foreground mt-1">
                {displayName} ainda não criou tópicos ou respondeu perguntas.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
