import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WarningBoxProps {
  warnings: string[];
  className?: string;
}

export function WarningBox({ warnings, className }: WarningBoxProps) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className={cn(
      'p-4 rounded-xl bg-destructive/10 border border-destructive/20',
      className
    )}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-destructive mb-2">Atenção</h3>
          <ul className="space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="text-sm text-destructive/80">
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
