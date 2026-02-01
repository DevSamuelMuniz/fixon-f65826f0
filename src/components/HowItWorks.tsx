import { motion } from 'framer-motion';
import { Search, CheckCircle2, PartyPopper } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Busque',
    description: 'Digite o problema que você quer resolver',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  },
  {
    icon: CheckCircle2,
    title: 'Siga',
    description: 'Siga os passos simples da solução',
    color: 'bg-green-500/10 text-green-500 border-green-500/30',
  },
  {
    icon: PartyPopper,
    title: 'Resolvido!',
    description: 'Problema resolvido, volte ao normal',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function HowItWorks() {
  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Simples e rápido
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Como funciona
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative"
        >
          {/* Connection line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-500/30 via-green-500/30 to-purple-500/30" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number badge */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`relative w-20 h-20 rounded-2xl ${step.color} border-2 flex items-center justify-center mb-6 shadow-lg`}
              >
                <step.icon className="h-10 w-10" />
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-primary-foreground text-sm font-bold rounded-full flex items-center justify-center shadow-md">
                  {index + 1}
                </span>
              </motion.div>

              <h3 className="font-bold text-xl text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground max-w-[200px]">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
