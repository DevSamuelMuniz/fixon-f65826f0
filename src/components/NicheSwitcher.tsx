import { useNiche } from '@/contexts/NicheContext';
import { getEnabledNiches, NicheConfig } from '@/config/niches';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

/**
 * Development-only component for testing different niches locally.
 * Only visible when running on localhost.
 */
export function NicheSwitcher() {
  const { niche, nicheSlug } = useNiche();
  
  // Only show on localhost
  if (typeof window !== 'undefined' && 
      !window.location.hostname.includes('localhost') && 
      !window.location.hostname.includes('127.0.0.1')) {
    return null;
  }

  const niches = getEnabledNiches();

  const handleNicheChange = (newNiche: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('niche', newNiche);
    window.location.href = url.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50 p-4 bg-background/95 backdrop-blur border border-border rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
          DEV
        </Badge>
        <span className="text-sm font-medium text-muted-foreground">Nicho:</span>
        <Select value={nicheSlug} onValueChange={handleNicheChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {niches.map((n) => (
              <SelectItem key={n.slug} value={n.slug}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: n.theme.primaryColorHex }}
                  />
                  {n.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Atual: <strong style={{ color: niche.theme.primaryColorHex }}>{niche.displayName}</strong>
      </p>
    </motion.div>
  );
}
