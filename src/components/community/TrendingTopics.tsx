import { Link } from 'react-router-dom';
import { TrendingUp, MessageCircle, Eye, Flame, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrendingTopics } from '@/hooks/useTrendingTopics';

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const diffHours = Math.floor((Date.now() - date.getTime()) / 3600000);
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 1) return 'agora';
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays}d`;
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

export function TrendingTopics() {
  const { data: topics, isLoading } = useTrendingTopics(5);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3 items-start">
            <Skeleton className="h-6 w-6 rounded-full flex-shrink-0 shimmer" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-1 shimmer" />
              <Skeleton className="h-3 w-1/2 shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        Nenhum tópico em alta esta semana.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topics.map((topic, index) => (
        <Link
          key={topic.id}
          to={`/comunidade/topico/${topic.id}`}
          className="flex items-start gap-3 group"
        >
          {/* Rank number */}
          <div className={`
            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
          ${index === 0 ? 'bg-amber-500 text-white' :
              index === 1 ? 'bg-muted-foreground/60 text-white' :
              index === 2 ? 'bg-amber-700/80 text-white' :
              'bg-muted text-muted-foreground'}
          `}>
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {topic.title}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-0.5">
                <MessageCircle className="h-3 w-3" />
                {topic.answer_count}
              </span>
              <span className="flex items-center gap-0.5">
                <Eye className="h-3 w-3" />
                {topic.view_count}
              </span>
              <span>{formatTimeAgo(topic.last_activity_at)}</span>
              {topic.status === 'resolved' && (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
