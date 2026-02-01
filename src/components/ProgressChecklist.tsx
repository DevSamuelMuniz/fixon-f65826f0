import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import type { ProblemStep } from '@/types/database';

interface ProgressChecklistProps {
  steps: ProblemStep[];
}

export function ProgressChecklist({ steps }: ProgressChecklistProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  if (!steps || steps.length === 0) return null;

  const progress = (completedSteps.size / steps.length) * 100;

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Seu progresso</span>
          <span className="text-muted-foreground">
            {completedSteps.size} de {steps.length} passos
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">Passo a passo</h2>
        <ol className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleStep(index)}
                className={cn(
                  'flex gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200',
                  isCompleted
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-md'
                )}
              >
                <div className="flex-shrink-0">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCompleted ? [1, 1.2, 1] : 1,
                      backgroundColor: isCompleted ? 'hsl(var(--primary))' : 'transparent',
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2',
                      isCompleted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30 text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      'font-semibold mb-1 transition-colors',
                      isCompleted ? 'text-green-600 line-through' : 'text-foreground'
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      'text-sm transition-colors',
                      isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* Completion Message */}
      {completedSteps.size === steps.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center"
        >
          <span className="text-2xl mb-2 block">🎉</span>
          <p className="font-semibold text-green-600">Parabéns! Você concluiu todos os passos!</p>
        </motion.div>
      )}
    </div>
  );
}
