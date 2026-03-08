import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Home, Wrench, Wifi, Tv, Heart, Car } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const popularCategories = [
  { label: 'Tecnologia', slug: 'tecnologia', icon: Wrench },
  { label: 'Internet', slug: 'internet', icon: Wifi },
  { label: 'TV & Som', slug: 'tv-som', icon: Tv },
  { label: 'Saúde', slug: 'saude', icon: Heart },
  { label: 'Automóveis', slug: 'automoveis', icon: Car },
];

const NotFound = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Layout>
      <div className="container px-4 py-16 max-w-2xl mx-auto text-center">
        {/* Big 404 */}
        <div className="mb-6">
          <span className="text-8xl sm:text-9xl font-black text-primary/20 select-none">404</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground mb-10 max-w-md mx-auto">
          Oops! A página que você procura não existe ou foi movida. Mas talvez possamos te ajudar a encontrar o que precisa:
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-10 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar soluções..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>

        {/* Popular Categories */}
        <div className="mb-10">
          <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
            Categorias populares
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card hover:bg-muted hover:border-primary/30 text-sm font-medium text-foreground transition-colors"
              >
                <cat.icon className="h-4 w-4 text-primary" />
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Home button */}
        <Link to="/">
          <Button variant="outline" size="lg" className="gap-2">
            <Home className="h-4 w-4" />
            Voltar para a início
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
