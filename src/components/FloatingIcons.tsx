import { motion } from 'framer-motion';
import { Smartphone, Wifi, Monitor, AppWindow, Settings, Zap, Shield, HelpCircle } from 'lucide-react';

const icons = [
  { Icon: Smartphone, delay: 0, x: '10%', y: '20%' },
  { Icon: Wifi, delay: 0.5, x: '85%', y: '15%' },
  { Icon: Monitor, delay: 1, x: '15%', y: '75%' },
  { Icon: AppWindow, delay: 1.5, x: '80%', y: '70%' },
  { Icon: Settings, delay: 0.3, x: '5%', y: '45%' },
  { Icon: Zap, delay: 0.8, x: '90%', y: '40%' },
  { Icon: Shield, delay: 1.2, x: '25%', y: '85%' },
  { Icon: HelpCircle, delay: 0.6, x: '70%', y: '10%' },
];

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/10"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            delay,
            duration: 0.5,
            y: {
              delay: delay + 0.5,
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <Icon className="h-8 w-8 md:h-12 md:w-12" />
        </motion.div>
      ))}
    </div>
  );
}
