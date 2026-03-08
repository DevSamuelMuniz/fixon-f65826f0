import { useState } from 'react';
import { Mail, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  message: z.string().trim().min(10, 'Mensagem muito curta (mínimo 10 caracteres)').max(2000, 'Mensagem muito longa'),
});

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = contactSchema.safeParse({ name, email, message });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: validation.data.name,
        email: validation.data.email,
        message: validation.data.message,
      });

    setLoading(false);

    if (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      return;
    }

    toast.success('Mensagem enviada! Obrigado pelo contato. Responderemos em breve.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <Layout>
      <div className="container px-4 py-12 max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Fale conosco</h1>
          <p className="text-muted-foreground">
            Tem alguma dúvida ou sugestão? Entre em contato!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Nome
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              maxLength={255}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Mensagem
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              rows={5}
              required
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">{message.length}/2000</p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar mensagem
              </>
            )}
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Ou entre em contato diretamente:
          </p>
          <a
            href="mailto:contato@fix-on.com"
            className="inline-flex items-center text-primary hover:underline"
          >
            <Mail className="h-4 w-4 mr-2" />
            contato@fix-on.com
          </a>
        </div>
      </div>
    </Layout>
  );
}
