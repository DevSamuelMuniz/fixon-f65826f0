import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'fixon_cookie_consent';

type ConsentStatus = 'accepted' | 'rejected' | null;

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentStatus>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus;
    if (!stored) {
      // Show after short delay for better UX
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
    setConsent(stored);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setConsent('accepted');
    setShow(false);
    // Enable analytics if previously blocked
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setConsent('rejected');
    setShow(false);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
          role="dialog"
          aria-label="Aviso de cookies"
        >
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Cookie className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    Usamos cookies 🍪
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, personalizar conteúdo e anúncios, e analisar nosso tráfego, conforme a{' '}
                    <Link to="/privacidade" className="text-primary hover:underline">
                      Política de Privacidade
                    </Link>{' '}
                    e a LGPD.
                  </p>

                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="font-medium text-foreground mb-1">✅ Essenciais</p>
                            <p className="text-muted-foreground">Necessários para o funcionamento do site. Sempre ativos.</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="font-medium text-foreground mb-1">📊 Analíticos</p>
                            <p className="text-muted-foreground">Google Analytics para entender como você usa o site.</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="font-medium text-foreground mb-1">📢 Publicidade</p>
                            <p className="text-muted-foreground">Google AdSense para exibir anúncios relevantes.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                    className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {showDetails ? (
                      <><ChevronUp className="h-3 w-3" /> Ocultar detalhes</>
                    ) : (
                      <><ChevronDown className="h-3 w-3" /> Ver detalhes</>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleReject}
                  className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReject}
                  className="text-xs h-8"
                >
                  Apenas essenciais
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="text-xs h-8 gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  Aceitar todos
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useCookieConsent() {
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus;
  return stored;
}
