import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchProblems } from '@/hooks/useProblems';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  size?: 'default' | 'large';
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}

export function SearchBar({ className, size = 'default', autoFocus = false, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: results, isLoading } = useSearchProblems(query);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/buscar?q=${encodeURIComponent(query)}`);
      }
      setShowResults(false);
    }
  };

  const handleResultClick = (categorySlug: string, problemSlug: string) => {
    navigate(`/${categorySlug}/${problemSlug}`);
    setShowResults(false);
    setQuery('');
  };

  const isLarge = size === 'large';

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
            isLarge ? 'h-6 w-6 left-4' : 'h-5 w-5'
          )} />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Digite seu problema..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            autoFocus={autoFocus}
            className={cn(
              'pl-10 pr-12 border-2 border-border focus:border-primary transition-colors',
              isLarge && 'h-14 text-lg pl-12 pr-14 rounded-xl'
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground min-h-0 min-w-0 p-1',
                isLarge && 'right-4'
              )}
            >
              <X className={cn('h-4 w-4', isLarge && 'h-5 w-5')} />
            </button>
          )}
        </div>
        {isLarge && (
          <Button
            type="submit"
            size="lg"
            className="mt-4 w-full h-14 text-lg font-semibold rounded-xl"
          >
            Resolver agora
          </Button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Buscando...
            </div>
          ) : results && results.length > 0 ? (
            <ul className="max-h-[300px] overflow-y-auto">
              {results.map((problem) => (
                <li key={problem.id}>
                  <button
                    type="button"
                    onClick={() => handleResultClick(problem.category?.slug || '', problem.slug)}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex flex-col gap-1 min-h-0"
                  >
                    <span className="font-medium text-foreground">{problem.title}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {problem.quick_answer}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}
