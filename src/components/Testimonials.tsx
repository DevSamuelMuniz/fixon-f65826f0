import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Marcos Oliveira',
    city: 'São Paulo, SP',
    avatar: 'MO',
    color: 'bg-blue-500',
    problem: 'Wi-Fi caindo toda hora',
    text: 'Meu roteador ficava desconectando a cada hora e eu não sabia o que fazer. Segui os passos aqui e resolvi em menos de 10 minutos. Incrível!',
    rating: 5,
  },
  {
    name: 'Ana Paula Silva',
    city: 'Belo Horizonte, MG',
    avatar: 'AP',
    color: 'bg-purple-500',
    problem: 'Celular superaquecendo',
    text: 'Meu celular esquentava muito e a bateria durava nada. As dicas foram diretas ao ponto e funcionaram de verdade. Recomendo pra todo mundo!',
    rating: 5,
  },
  {
    name: 'Ricardo Santos',
    city: 'Curitiba, PR',
    avatar: 'RS',
    color: 'bg-green-500',
    problem: 'PC lento demais',
    text: 'Estava quase comprando um computador novo, mas resolvi tentar aqui antes. Ficou muito mais rápido com as dicas de otimização. Salvou meu dinheiro!',
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Testimonials() {
  return (
    <section className="py-16 px-4 bg-muted/20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
            ⭐ Quem já resolveu
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Problemas resolvidos de verdade
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Milhares de pessoas já encontraram a solução que precisavam aqui.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="relative bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Problem tag */}
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary mb-3">
                {t.problem}
              </span>

              {/* Text */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
