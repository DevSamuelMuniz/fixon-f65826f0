import { Search, CheckCircle2, PartyPopper } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Busque',
    description: 'Digite o problema que você quer resolver',
  },
  {
    icon: CheckCircle2,
    title: 'Siga',
    description: 'Siga os passos simples da solução',
  },
  {
    icon: PartyPopper,
    title: 'Resolvido!',
    description: 'Problema resolvido, volte ao normal',
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-4">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          Como funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
