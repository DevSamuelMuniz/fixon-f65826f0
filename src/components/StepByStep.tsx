import { CheckCircle2 } from 'lucide-react';
import type { ProblemStep } from '@/types/database';

interface StepByStepProps {
  steps: ProblemStep[];
}

export function StepByStep({ steps }: StepByStepProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Passo a passo</h2>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className="flex gap-4 p-4 bg-card rounded-xl border border-border"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
