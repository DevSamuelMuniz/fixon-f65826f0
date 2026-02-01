import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Home, Smartphone, Monitor, Wifi, AppWindow, Info, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function Header() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Celular', href: '/celular', icon: Smartphone },
    { label: 'Computador', href: '/computador', icon: Monitor },
    { label: 'Internet', href: '/internet', icon: Wifi },
    { label: 'Aplicativos', href: '/aplicativos', icon: AppWindow },
    { label: 'Sobre', href: '/sobre', icon: Info },
    { label: 'Contato', href: '/contato', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 min-h-0 min-w-0">
          <motion.img
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            alt="Fix-on"
            className="h-10 w-auto"
            src="/lovable-uploads/81ef09f8-7ff1-4caa-9855-b8433a225488.png"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.slice(1, 5).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all min-h-0 min-w-0"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          
          {/* Highlighted Forum Link */}
          <Link to="/forum">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Fórum
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                <Sparkles className="h-3 w-3" />
                Novo
              </span>
            </motion.div>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/buscar">
            <Button variant="ghost" size="icon" className="min-h-10 min-w-10 hover:bg-primary/10">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="min-h-10 min-w-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={open ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </motion.div>
                </AnimatePresence>
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 min-h-0 min-w-0">
                    <img
                      src="/lovable-uploads/81ef09f8-7ff1-4caa-9855-b8433a225488.png"
                      alt="Fix-on"
                      className="h-8 w-auto"
                    />
                  </Link>
                </div>
                
                {/* Mobile Forum CTA */}
                <div className="p-4 border-b border-border">
                  <Link to="/forum" onClick={() => setOpen(false)}>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Fórum</p>
                          <p className="text-xs text-muted-foreground">Tire suas dúvidas</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                        Novo
                      </span>
                    </div>
                  </Link>
                </div>

                <nav className="flex flex-col p-4">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 py-3 px-2 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all border-b border-border/50 last:border-0"
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
