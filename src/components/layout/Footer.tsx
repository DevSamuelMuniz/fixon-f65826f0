import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
export function Footer() {
  const currentYear = new Date().getFullYear();
  return <footer className="border-t border-border bg-muted/30">
      <div className="container px-4 py-8">
        {/* Logo and Description */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-3 min-h-0 min-w-0">
            <img alt="Fix-on" className="h-full w-20" src="/lovable-uploads/29378dcb-691e-4fdd-ac92-4722a2b25bed.png" />
            
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Soluções rápidas para seus problemas de tecnologia.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8 max-w-md mx-auto">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/celular" className="text-sm text-muted-foreground hover:text-primary min-h-0 min-w-0">
                  Celular
                </Link>
              </li>
              <li>
                <Link to="/computador" className="text-sm text-muted-foreground hover:text-primary min-h-0 min-w-0">
                  Computador
                </Link>
              </li>
              <li>
                <Link to="/internet" className="text-sm text-muted-foreground hover:text-primary min-h-0 min-w-0">
                  Internet
                </Link>
              </li>
              <li>
                <Link to="/aplicativos" className="text-sm text-muted-foreground hover:text-primary min-h-0 min-w-0">
                  Aplicativos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre" className="text-sm text-muted-foreground hover:text-primary min-h-0 min-w-0">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-sm text-muted-foreground hover:text-primary min-h-0 min-w-0">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-sm text-muted-foreground hover:text-primary min-h-0 min-w-0">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-primary min-h-0 min-w-0">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Fix-on. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>;
}