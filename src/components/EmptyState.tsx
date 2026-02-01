import { motion } from 'framer-motion';
import { Search, FileQuestion, Inbox, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type?: 'search' | 'notFound' | 'empty';
  title?: string;
  description?: string;
  showHomeButton?: boolean;
}

const typeConfig: Record<string, { icon: LucideIcon; defaultTitle: string; defaultDescription: string }> = {
  search: {
    icon: Search,
    defaultTitle: 'Nenhum resultado encontrado',
    defaultDescription: 'Tente buscar com outras palavras-chave.',
  },
  notFound: {
    icon: FileQuestion,
    defaultTitle: 'Página não encontrada',
    defaultDescription: 'A página que você procura não existe.',
  },
  empty: {
    icon: Inbox,
    defaultTitle: 'Nada por aqui',
    defaultDescription: 'Não há conteúdo disponível no momento.',
  },
};

export function EmptyState({
  type = 'empty',
  title,
  description,
  showHomeButton = true,
}: EmptyStateProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/20"
        />
      </motion.div>

      <h2 className="text-xl font-bold text-foreground mb-2">
        {title || config.defaultTitle}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {description || config.defaultDescription}
      </p>

      {showHomeButton && (
        <Link to="/">
          <Button>Voltar ao início</Button>
        </Link>
      )}
    </motion.div>
  );
}
