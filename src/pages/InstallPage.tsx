import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Share, Plus, Check, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = [
    { icon: '⚡', title: 'Acesso Rápido', description: 'Abra direto da tela inicial' },
    { icon: '📴', title: 'Funciona Offline', description: 'Acesse soluções sem internet' },
    { icon: '🔔', title: 'Notificações', description: 'Receba atualizações importantes' },
    { icon: '💾', title: 'Leve e Rápido', description: 'Não ocupa espaço no celular' },
  ];

  return (
    <Layout>
      <div className="container max-w-2xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
            <Smartphone className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Instale o Fix-On
          </h1>
          <p className="text-muted-foreground">
            Tenha soluções rápidas sempre à mão, direto na tela inicial do seu celular
          </p>
        </motion.div>

        {isInstalled ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
              <Check className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">App instalado!</h2>
            <p className="text-muted-foreground">
              O Fix-On já está na sua tela inicial. Aproveite!
            </p>
          </motion.div>
        ) : (
          <>
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-card/50 border-border/50">
                    <CardContent className="p-4 text-center">
                      <span className="text-2xl mb-2 block">{feature.icon}</span>
                      <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Install Button (Android/Desktop) */}
            {deferredPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Button
                  onClick={handleInstall}
                  size="lg"
                  className="w-full gap-2 text-lg py-6"
                >
                  <Download className="h-5 w-5" />
                  Instalar Agora
                </Button>
              </motion.div>
            )}

            {/* iOS Instructions */}
            {isIOS && !deferredPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Card className="bg-blue-500/10 border-blue-500/30">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <Share className="h-5 w-5" />
                      Como instalar no iPhone/iPad
                    </h3>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                        <span className="text-muted-foreground">Toque no botão <strong className="text-foreground">Compartilhar</strong> (ícone de quadrado com seta) no Safari</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                        <span className="text-muted-foreground">Role para baixo e toque em <strong className="text-foreground">"Adicionar à Tela de Início"</strong></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                        <span className="text-muted-foreground">Toque em <strong className="text-foreground">"Adicionar"</strong> no canto superior direito</span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Android Manual Instructions */}
            {isAndroid && !deferredPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Card className="bg-green-500/10 border-green-500/30">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Como instalar no Android
                    </h3>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                        <span className="text-muted-foreground">Toque no menu <strong className="text-foreground">⋮</strong> (três pontos) do navegador</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                        <span className="text-muted-foreground">Toque em <strong className="text-foreground">"Instalar app"</strong> ou <strong className="text-foreground">"Adicionar à tela inicial"</strong></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                        <span className="text-muted-foreground">Confirme tocando em <strong className="text-foreground">"Instalar"</strong></span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Desktop Instructions */}
            {!isIOS && !isAndroid && !deferredPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Card className="bg-purple-500/10 border-purple-500/30">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      Como instalar no computador
                    </h3>
                    <p className="text-muted-foreground">
                      Procure o ícone de instalação <strong className="text-foreground">⊕</strong> na barra de endereços do navegador (Chrome, Edge) e clique para instalar.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
