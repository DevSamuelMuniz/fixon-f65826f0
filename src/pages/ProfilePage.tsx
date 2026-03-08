import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Edit2, Save as SaveIcon, Loader2, Phone, MapPin, Camera,
  MessageCircle, CheckCircle2, ThumbsUp, Award, ArrowRight
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/UserAvatar';
import { UserBadges } from '@/components/community';
import { useAuth } from '@/hooks/useAuth';
import { useUserBadges } from '@/hooks/useUserBadges';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { BadgeType } from '@/components/community/UserBadge';

const brazilianStates = [
  { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' }, { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' }, { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  state: string | null;
  city: string | null;
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

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [stats, setStats] = useState<UserStats>({ topicsCount: 0, answersCount: 0, solutionsCount: 0 });
  const [recentTopics, setRecentTopics] = useState<RecentTopic[]>([]);
  const [recentAnswers, setRecentAnswers] = useState<RecentAnswer[]>([]);

  const { data: userBadges } = useUserBadges(user?.id);

  useEffect(() => {
    if (!authLoading && !user) navigate('/entrar');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [user]);

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);

    const [profileRes, topicsRes, answersRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase
        .from('forum_questions')
        .select('id, title, status, answer_count, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('forum_answers')
        .select('id, content, is_solution, created_at, question_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    if (profileRes.data) {
      const p = profileRes.data as Profile;
      setProfile(p);
      setDisplayName(p.display_name || '');
      setBio(p.bio || '');
      setPhone(p.phone || '');
      setState(p.state || '');
      setCity(p.city || '');
    }

    const topics = (topicsRes.data || []) as RecentTopic[];
    const answers = (answersRes.data || []) as RecentAnswer[];
    setRecentTopics(topics);

    // Fetch question titles for answers
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

    // Stats
    const [{ count: topicsCount }, { count: answersCount }, { count: solutionsCount }] = await Promise.all([
      supabase.from('forum_questions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('forum_answers').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('forum_answers').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_solution', true),
    ]);

    setStats({
      topicsCount: topicsCount || 0,
      answersCount: answersCount || 0,
      solutionsCount: solutionsCount || 0,
    });

    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande (máx 5MB)');
      return;
    }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('community-images')
        .getPublicUrl(path);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success('Foto atualizada!');
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar foto');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, bio, phone: phone || null, state: state || null, city: city || null })
      .eq('user_id', user.id);

    if (error) {
      toast.error('Erro ao salvar perfil');
    } else {
      toast.success('Perfil atualizado!');
      setEditing(false);
      fetchAll();
    }
    setSaving(false);
  };

  const getStateName = (code: string) => brazilianStates.find(s => s.value === code)?.label || code;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffDays === 0) return 'hoje';
    if (diffDays === 1) return 'ontem';
    if (diffDays < 7) return `há ${diffDays} dias`;
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container max-w-3xl py-8 px-4 space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl shimmer" />
          <Skeleton className="h-32 w-full rounded-2xl shimmer" />
          <Skeleton className="h-48 w-full rounded-2xl shimmer" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="container max-w-3xl py-8 px-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Profile Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
            {/* Cover */}
            <div className="h-24 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/10" />

            {/* Avatar + info */}
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="relative">
                  <UserAvatar
                    name={profile?.display_name || user.email?.split('@')[0]}
                    avatarUrl={profile?.avatar_url}
                    size="lg"
                    className="h-20 w-20 border-4 border-card ring-2 ring-primary/20"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                    title="Alterar foto"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Camera className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>

                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar perfil
                  </Button>
                ) : null}
              </div>

              <h1 className="text-xl font-bold text-foreground">
                {profile?.display_name || 'Usuário'}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
              {(profile?.city || profile?.state) && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="h-3 w-3" />
                  {profile?.city}{profile?.city && profile?.state && ', '}{profile?.state && getStateName(profile.state)}
                </p>
              )}
              {profile?.bio && (
                <p className="text-sm text-foreground/80 mb-3">{profile.bio}</p>
              )}

              {/* Badges */}
              {userBadges && userBadges.length > 0 && (
                <div className="mt-3">
                  <UserBadges badges={userBadges.map(b => b.badge_type as BadgeType)} size="md" maxDisplay={10} />
                </div>
              )}
            </div>

            {/* Edit form */}
            {editing && (
              <div className="px-6 pb-6 pt-2 border-t border-border space-y-4">
                <div className="space-y-2">
                  <Label>Nome de exibição</Label>
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="(XX) XXXXX-XXXX"
                      value={phone}
                      onChange={e => setPhone(formatPhone(e.target.value))}
                      className="pl-10"
                      maxLength={15}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {brazilianStates.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Sua cidade" maxLength={100} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Conte um pouco sobre você..." rows={3} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><SaveIcon className="h-4 w-4 mr-2" />Salvar</>}
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
                </div>
              </div>
            )}
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
                Meus tópicos recentes
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
                <ThumbsUp className="h-5 w-5 text-green-500" />
                Minhas respostas recentes
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
                        <p className="text-xs text-muted-foreground mb-0.5 line-clamp-1">
                          em: {answer.question_title}
                        </p>
                      )}
                      <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {answer.content.replace(/@\w+|#\w+/g, '').trim()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatTimeAgo(answer.created_at)}</p>
                    </div>
                    {answer.is_solution && (
                      <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30 flex-shrink-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Solução
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {recentTopics.length === 0 && recentAnswers.length === 0 && (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium mb-2">Você ainda não participou da comunidade</p>
              <Link to="/comunidade">
                <Button variant="outline" size="sm" className="gap-2">
                  Explorar a comunidade
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}



