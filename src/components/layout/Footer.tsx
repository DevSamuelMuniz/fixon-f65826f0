import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Wifi, AppWindow, Info, Mail, FileText, Shield, Heart } from 'lucide-react';

const categories = [
  { label: 'Celular', href: '/celular', icon: Smartphone },
  { label: 'Computador', href: '/computador', icon: Monitor },
  { label: 'Internet', href: '/internet', icon: Wifi },
  { label: 'Aplicativos', href: '/aplicativos', icon: AppWindow },
];

const institutional = [
  { label: 'Sobre', href: '/sobre', icon: Info },
  { label: 'Contato', href: '/contato', icon: Mail },
  { label: 'Termos de Uso', href: '/termos', icon: FileText },
  { label: 'Privacidade', href: '/privacidade', icon: Shield },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container px-4 py-12">
        {/* Logo and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-10"
        >
          <Link to="/" className="mb-4 min-h-0 min-w-0">
            <img
              alt="Fix-on"
              className="h-12 w-auto"
              src="/lovable-uploads/29378dcb-691e-4fdd-ac92-4722a2b25bed.png"
            />
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Soluções rápidas e simples para seus problemas de tecnologia. Resolva em minutos!
          </p>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 max-w-2xl mx-auto">
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <AppWindow className="h-4 w-4 text-primary" />
              Categorias
            </h3>
            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors min-h-0 min-w-0"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Institucional
            </h3>
            <ul className="space-y-3">
              {institutional.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors min-h-0 min-w-0"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            © {currentYear} Fix-on. Feito com <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> no Brasil.
          </p>
        </div>
      </div>
    </footer>
  );
}
