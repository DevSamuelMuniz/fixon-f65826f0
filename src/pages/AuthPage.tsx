import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, User, ArrowRight, Loader2, Phone, MapPin, 
  Wrench, MessageCircle, Zap, Shield, CheckCircle2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

const features = [
  { icon: Wrench, title: 'Soluções práticas', description: 'Resolva problemas do dia a dia' },
  { icon: MessageCircle, title: 'Comunidade ativa', description: 'Tire dúvidas com outros usuários' },
  { icon: Zap, title: 'Respostas rápidas', description: 'Encontre soluções em minutos' },
  { icon: Shield, title: '100% gratuito', description: 'Acesse todo o conteúdo sem pagar' },
];

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter no mínimo 6 caracteres');
const phoneSchema = z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido').optional().or(z.literal(''));

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const validateForm = () => {
    try {
      emailSchema.parse(email);
    } catch {
      toast.error('Por favor, insira um email válido');
      return false;
    }

    try {
      passwordSchema.parse(password);
    } catch {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return false;
    }

    if (!isLogin) {
      if (!displayName.trim()) {
        toast.error('Por favor, insira seu nome');
        return false;
      }

      if (password !== confirmPassword) {
        toast.error('As senhas não coincidem');
        return false;
      }

      if (phone) {
        try {
          phoneSchema.parse(phone);
        } catch {
          toast.error('Telefone inválido. Use o formato (XX) XXXXX-XXXX');
          return false;
        }
      }
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
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error('Erro ao fazer login. Tente novamente.');
          }
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
          if (error.message.includes('User already registered')) {
            toast.error('Este email já está cadastrado. Tente fazer login.');
          } else {
            toast.error('Erro ao criar conta. Tente novamente.');
          }
        } else {
          toast.success('Conta criada! Verifique seu email para confirmar.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Features (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Floating Icons */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-20 bg-white/20 backdrop-blur-sm rounded-2xl p-4"
        >
          <Wrench className="h-8 w-8 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-60 left-16 bg-white/20 backdrop-blur-sm rounded-2xl p-4"
        >
          <Zap className="h-8 w-8 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 right-32 bg-white/20 backdrop-blur-sm rounded-2xl p-4"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white mb-12"
            >
              Fix-on
            </motion.div>
          </Link>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Resolva problemas<br />
            <span className="text-white/80">do dia a dia</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg mb-10 max-w-md"
          >
            Junte-se à nossa comunidade e encontre soluções práticas para tecnologia, casa, saúde e muito mais.
          </motion.p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex justify-center mb-8">
            <div className="text-2xl font-bold text-primary">Fix-on</div>
          </Link>

          <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            {/* Header with Tabs */}
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-colors relative ${
                  isLogin 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4" />
                  Entrar
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-colors relative ${
                  !isLogin 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Criar conta
                </div>
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Header Text */}
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-foreground">
                  {isLogin ? 'Bem-vindo de volta!' : 'Junte-se a nós'}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {isLogin 
                    ? 'Entre para acessar sua conta' 
                    : 'Crie sua conta gratuita'}
                </p>
              </div>

              {!isLogin && (
                <>
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">Nome completo *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10"
                        maxLength={100}
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="pl-10"
                        maxLength={15}
                      />
                    </div>
                  </div>

                  {/* Estado e Cidade */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm">Estado</Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger>
                          <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                        <SelectContent>
                          {brazilianStates.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm">Cidade</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Sua cidade"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        maxLength={100}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    maxLength={255}
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Confirmar Senha */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm">Confirmar Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Entrar' : 'Criar conta'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Features list on mobile */}
              {!isLogin && (
                <div className="lg:hidden pt-4 border-t border-border mt-6">
                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature) => (
                      <div key={feature.title} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span>{feature.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer Links */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Ao continuar, você concorda com nossos{' '}
            <Link to="/termos" className="text-primary hover:underline">Termos</Link>
            {' '}e{' '}
            <Link to="/privacidade" className="text-primary hover:underline">Privacidade</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
