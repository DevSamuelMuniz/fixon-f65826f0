import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeedbackButtonsProps {
  problemId: string;
  className?: string;
}

export function FeedbackButtons({ problemId, className }: FeedbackButtonsProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    setSubmitted(true);
    // Here you could send the feedback to the backend
    console.log(`Feedback for problem ${problemId}: ${type}`);
  };

  return (
    <div className={cn('p-6 bg-muted/50 rounded-2xl border border-border', className)}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Esta solução te ajudou?</h3>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleFeedback('positive')}
                className="flex items-center gap-2 hover:bg-green-500/10 hover:border-green-500 hover:text-green-600 transition-all"
              >
                <ThumbsUp className="h-5 w-5" />
                Sim, resolveu!
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleFeedback('negative')}
                className="flex items-center gap-2 hover:bg-red-500/10 hover:border-red-500 hover:text-red-600 transition-all"
              >
                <ThumbsDown className="h-5 w-5" />
                Não ajudou
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center"
            >
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </motion.div>
            <h3 className="font-semibold text-foreground mb-1">Obrigado pelo feedback!</h3>
            <p className="text-sm text-muted-foreground">
              {feedback === 'positive'
                ? 'Ficamos felizes em ajudar! 🎉'
                : 'Vamos melhorar essa solução!'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
