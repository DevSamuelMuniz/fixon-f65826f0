import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Home, Info, Mail, MessageCircle, Sparkles, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useNiche } from '@/contexts/NicheContext';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';

// Dynamic icon resolver
function getIconComponent(iconName: string) {
  const iconMap: Record<string, any> = {
    'smartphone': LucideIcons.Smartphone,
    'monitor': LucideIcons.Monitor,
    'wifi': LucideIcons.Wifi,
    'app-window': LucideIcons.AppWindow,
    'heart-pulse': LucideIcons.HeartPulse,
    'apple': LucideIcons.Apple,
    'sparkles': LucideIcons.Sparkles,
    'moon': LucideIcons.Moon,
    'cog': LucideIcons.Cog,
    'zap': LucideIcons.Zap,
    'circle-stop': LucideIcons.CircleStop,
    'circle': LucideIcons.Circle,
    'droplets': LucideIcons.Droplets,
    'paintbrush': LucideIcons.Paintbrush,
    'armchair': LucideIcons.Armchair,
  };
  return iconMap[iconName] || LucideIcons.Folder;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { niche } = useNiche();

  // Generate menu items dynamically based on niche categories
  const menuItems = useMemo(() => {
    const baseItems = [
      { label: 'Início', href: '/', icon: Home },
    ];
    
    // Add niche-specific category items
    const categoryItems = niche.categories.map(category => ({
      label: category.name,
      href: `/${category.slug}`,
      icon: getIconComponent(category.icon),
    }));
    
    // Add static items at the end
    const staticItems = [
      { label: 'Sobre', href: '/sobre', icon: Info },
      { label: 'Contato', href: '/contato', icon: Mail },
    ];
    
    return [...baseItems, ...categoryItems, ...staticItems];
  }, [niche]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Erro ao sair');
    } else {
      toast.success('Você saiu da conta');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side: Logo */}
        <Link to="/" className="flex items-center gap-2 min-h-0 min-w-0">
          <motion.img
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            alt={niche.displayName}
            className="h-10 w-auto"
            src="/lovable-uploads/81ef09f8-7ff1-4caa-9855-b8433a225488.png"
          />
          {niche.slug !== 'default' && niche.slug !== 'tech' && (
            <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
              {niche.name}
            </span>
          )}
        </Link>

        {/* Center: Desktop Navigation */}
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
        </nav>

        {/* Right side: Search + Forum + User + Mobile Menu */}
        <div className="flex items-center gap-2">
          <Link to="/buscar">
            <Button variant="ghost" size="icon" className="min-h-10 min-w-10 hover:bg-primary/10">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          </Link>

          {/* Highlighted Community Link - Desktop */}
          <Link to="/comunidade" className="hidden md:block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Comunidade
            </motion.div>
          </Link>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="min-h-10 min-w-10 hover:bg-primary/10">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/entrar">
              <Button variant="ghost" size="icon" className="min-h-10 min-w-10 hover:bg-primary/10">
                <User className="h-5 w-5" />
                <span className="sr-only">Entrar</span>
              </Button>
            </Link>
          )}

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
                      alt={niche.displayName}
                      className="h-8 w-auto"
                    />
                    {niche.slug !== 'default' && niche.slug !== 'tech' && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                        {niche.name}
                      </span>
                    )}
                  </Link>
                </div>
                
                {/* Mobile Community CTA */}
                <div className="p-4 border-b border-border">
                  <Link to="/comunidade" onClick={() => setOpen(false)}>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Comunidade</p>
                          <p className="text-xs text-muted-foreground">Participe das discussões</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Mobile User Section */}
                <div className="p-4 border-b border-border">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm truncate max-w-[150px]">{user.email}</p>
                          <Link 
                            to="/perfil" 
                            onClick={() => setOpen(false)}
                            className="text-xs text-primary hover:underline"
                          >
                            Ver perfil
                          </Link>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Link to="/entrar" onClick={() => setOpen(false)}>
                      <Button className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Entrar / Cadastrar
                      </Button>
                    </Link>
                  )}
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
