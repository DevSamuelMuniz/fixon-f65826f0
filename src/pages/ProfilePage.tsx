import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Edit2, Save, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast.error('Erro ao carregar perfil');
    } else if (data) {
      setProfile(data);
      setDisplayName(data.display_name || '');
      setBio(data.bio || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        bio: bio,
      })
      .eq('user_id', user.id);

    if (error) {
      toast.error('Erro ao salvar perfil');
    } else {
      toast.success('Perfil atualizado com sucesso!');
      setEditing(false);
      fetchProfile();
    }

    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-2xl py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {profile?.display_name || 'Usuário'}
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </p>
                </div>
              </div>
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome de exibição</Label>
                    <Input
                      id="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Conte um pouco sobre você..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Nome</h3>
                    <p className="text-foreground">{profile?.display_name || 'Não informado'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
                    <p className="text-foreground">{profile?.bio || 'Nenhuma bio adicionada ainda.'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
