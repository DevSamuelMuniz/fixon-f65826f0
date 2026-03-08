import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, ArrowRight, Loader2, Phone, MapPin,
  Wrench, MessageCircle, Zap, Shield, Eye, EyeOff, CheckCircle2, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';
import logo from '@/assets/logo.png';

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

const stats = [
  { value: '12k+', label: 'Soluções publicadas' },
  { value: '98%', label: 'Problemas resolvidos' },
  { value: '50k+', label: 'Usuários ativos' },
];

const testimonials = [
  { name: 'Ana Lima', city: 'São Paulo', text: 'Resolvi meu problema de Wi-Fi em 5 minutos!' },
  { name: 'Carlos Silva', city: 'Belo Horizonte', text: 'Melhor plataforma de soluções que já usei.' },
];

const features = [
  { icon: Wrench, title: 'Soluções práticas', description: 'Passo a passo para qualquer problema' },
  { icon: Zap, title: 'Respostas rápidas', description: 'Encontre soluções em segundos' },
  { icon: MessageCircle, title: 'Comunidade ativa', description: 'Tire dúvidas com especialistas' },
  { icon: Shield, title: '100% gratuito', description: 'Acesse todo o conteúdo sem pagar' },
];

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter no mínimo 6 caracteres');
const phoneSchema = z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido').optional().or(z.literal(''));

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const validateForm = () => {
    try { emailSchema.parse(email); } catch { toast.error('Por favor, insira um email válido'); return false; }
    try { passwordSchema.parse(password); } catch { toast.error('A senha deve ter no mínimo 6 caracteres'); return false; }
    if (!isLogin) {
      if (!displayName.trim()) { toast.error('Por favor, insira seu nome'); return false; }
      if (password !== confirmPassword) { toast.error('As senhas não coincidem'); return false; }
      if (phone) { try { phoneSchema.parse(phone); } catch { toast.error('Telefone inválido. Use o formato (XX) XXXXX-XXXX'); return false; } }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message.includes('Invalid login credentials') ? 'Email ou senha incorretos' : 'Erro ao fazer login. Tente novamente.');
        } else {
          toast.success('Login realizado com sucesso!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, {
          display_name: displayName,
          phone: phone || undefined,
          state: state || undefined,
          city: city || undefined,
        });
        if (error) {
          toast.error(error.message.includes('User already registered') ? 'Este email já está cadastrado. Tente fazer login.' : 'Erro ao criar conta. Tente novamente.');
        } else {
          toast.success('Conta criada! Verifique seu email para confirmar.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setEmail(''); setPassword(''); setConfirmPassword('');
    setDisplayName(''); setPhone(''); setState(''); setCity('');
    setShowPassword(false); setShowConfirmPassword(false);
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">

      {/* ─── Left Panel ─── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-blue-700 flex-col justify-between p-12 xl:p-16">

        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -left-20 w-[32rem] h-[32rem] rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/2 -translate-y-1/2" />

        {/* Floating decorative icons */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 right-16 bg-white/15 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
        >
          <Wrench className="h-7 w-7 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 right-12 bg-white/15 backdrop-blur-sm rounded-2xl p-3 shadow-lg"
        >
          <Zap className="h-5 w-5 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-36 right-24 bg-white/15 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </motion.div>

        {/* Logo */}
        <Link to="/" className="relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <img src={logo} alt="Fix-on" className="h-10 w-10 object-contain brightness-0 invert" />
            <span className="text-2xl font-bold text-white tracking-tight">Fix-on</span>
          </motion.div>
        </Link>

        {/* Main copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4"
          >
            A plataforma de soluções do Brasil
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5"
          >
            Resolva qualquer<br />
            <span className="text-white/75">problema em minutos.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-white/65 text-base leading-relaxed max-w-sm mb-10"
          >
            Tecnologia, casa, saúde e muito mais. Guias passo a passo verificados pela comunidade.
          </motion.p>

          {/* Feature list */}
          <div className="space-y-4 mb-12">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-white font-medium text-sm">{f.title}</span>
                  <span className="text-white/55 text-xs ml-2">{f.description}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-white/55 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="relative z-10 space-y-3"
        >
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                {t.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-300 text-yellow-300" />)}
                </div>
                <p className="text-white/80 text-xs leading-snug">"{t.text}"</p>
                <p className="text-white/45 text-xs mt-0.5">{t.name} · {t.city}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <img src={logo} alt="Fix-on" className="h-9 w-9 object-contain" />
            <span className="text-xl font-bold text-primary">Fix-on</span>
          </Link>

          {/* Mode toggle */}
          <div className="bg-muted rounded-xl p-1 flex mb-8">
            {[
              { value: true, label: 'Entrar' },
              { value: false, label: 'Criar conta' },
            ].map((tab) => (
              <button
                key={String(tab.value)}
                type="button"
                onClick={() => switchMode(tab.value)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isLogin === tab.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-header' : 'signup-header'}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-2xl font-bold text-foreground">
                {isLogin ? 'Bem-vindo de volta 👋' : 'Crie sua conta grátis'}
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                {isLogin ? 'Entre para acessar soluções e sua comunidade.' : 'Junte-se a milhares de pessoas que já resolveram seus problemas.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden space-y-4"
                >
                  {/* Nome */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium">Nome completo <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input id="name" type="text" placeholder="Seu nome completo" value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)} className="pl-10 h-11" maxLength={100} />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-medium">Telefone <span className="text-muted-foreground font-normal text-xs">(opcional)</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))} className="pl-10 h-11" maxLength={15} />
                    </div>
                  </div>

                  {/* Estado + Cidade */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Estado</Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger className="h-11">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-1.5 flex-shrink-0" />
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                        <SelectContent>
                          {brazilianStates.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-sm font-medium">Cidade</Label>
                      <Input id="city" type="text" placeholder="Sua cidade" value={city}
                        onChange={(e) => setCity(e.target.value)} className="h-11" maxLength={100} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input id="email" type="email" placeholder="seu@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" maxLength={255} autoComplete="email" />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Senha <span className="text-destructive">*</span></Label>
                {isLogin && (
                  <Link to="/recuperar-senha" className="text-xs text-primary hover:underline">
                    Esqueceu a senha?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-11" autoComplete={isLogin ? 'current-password' : 'new-password'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && password.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                      password.length >= [6, 8, 10, 12][i]
                        ? i < 2 ? 'bg-destructive' : i === 2 ? 'bg-yellow-400' : 'bg-green-500'
                        : 'bg-muted'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            {/* Confirmar Senha */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirmar senha <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-10 pr-10 h-11 ${confirmPassword && confirmPassword !== password ? 'border-destructive focus-visible:ring-destructive' : confirmPassword && confirmPassword === password ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                        autoComplete="new-password" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword === password && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Senhas conferem
                      </p>
                    )}
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-xs text-destructive">As senhas não coincidem</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" className="w-full h-11 mt-2 text-sm font-semibold" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Entrar na conta' : 'Criar conta grátis'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Mobile features */}
          {!isLogin && (
            <div className="lg:hidden mt-6 pt-5 border-t border-border grid grid-cols-2 gap-2.5">
              {features.map((f) => (
                <div key={f.title} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span>{f.title}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Ao continuar, você concorda com nossos{' '}
            <Link to="/termos" className="text-primary hover:underline">Termos</Link>{' '}e{' '}
            <Link to="/privacidade" className="text-primary hover:underline">Privacidade</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
