import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logo from '@/assets/logo.png';

export function Header() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: 'Início', href: '/' },
    { label: 'Celular', href: '/celular' },
    { label: 'Computador', href: '/computador' },
    { label: 'Internet', href: '/internet' },
    { label: 'Aplicativos', href: '/aplicativos' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 min-h-0 min-w-0">
          <img src={logo} alt="Fix-on" className="h-8 w-8" />
          <span className="text-xl font-bold text-foreground">Fix-on</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.slice(1, 5).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors min-h-0 min-w-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/buscar">
            <Button variant="ghost" size="icon" className="min-h-10 min-w-10">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="min-h-10 min-w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 min-h-0 min-w-0">
                    <img src={logo} alt="Fix-on" className="h-8 w-8" />
                    <span className="text-xl font-bold">Fix-on</span>
                  </Link>
                </div>
                <nav className="flex flex-col p-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center py-3 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border last:border-0"
                    >
                      {item.label}
                    </Link>
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
