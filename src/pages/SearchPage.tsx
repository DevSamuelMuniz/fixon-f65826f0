import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/SearchBar';
import { ProblemCard } from '@/components/ProblemCard';
import { useSearchProblems } from '@/hooks/useProblems';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { data: results, isLoading } = useSearchProblems(query);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setSearchParams({ q: newQuery });
  };

  return (
    <Layout>
      <div className="container px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Buscar soluções</h1>
        <SearchBar autoFocus onSearch={handleSearch} className="mb-8" />

        {query && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {isLoading ? (
                'Buscando...'
              ) : results && results.length > 0 ? (
                `${results.length} resultado${results.length > 1 ? 's' : ''} para "${query}"`
              ) : (
                `Nenhum resultado para "${query}"`
              )}
            </p>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : results && results.length > 0 ? (
              <div className="space-y-4">
                {results.map((problem) => (
                  <ProblemCard key={problem.id} problem={problem} showCategory />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  Tente buscar por outros termos como:
                </p>
                <p className="text-sm text-muted-foreground">
                  "celular não liga", "wifi lento", "whatsapp travando"
                </p>
              </div>
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Digite o problema que você quer resolver
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
