import { Layout } from '@/components/layout/Layout';
import logo from '@/assets/logo-full.png';

export default function AboutPage() {
  return (
    <Layout>
      <div className="container px-4 py-12 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <img src={logo} alt="Fix-on" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Sobre o Fix-on</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            O Fix-on nasceu com uma missão simples: ajudar pessoas a resolver problemas
            de tecnologia de forma rápida e descomplicada.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Sabemos que nem todo mundo entende de tecnologia, e que muitas vezes um
            problema simples pode parecer um bicho de sete cabeças. Por isso, criamos
            soluções diretas, em linguagem simples, que qualquer pessoa consegue seguir.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Nossa missão</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Democratizar o acesso ao conhecimento técnico, transformando problemas
            complexos em soluções simples que qualquer pessoa pode executar.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Como funciona</h2>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li>• Você busca ou escolhe seu problema</li>
            <li>• Mostramos a solução de forma direta e objetiva</li>
            <li>• Você segue os passos simples</li>
            <li>• Problema resolvido!</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Nosso compromisso</h2>
          <p className="text-muted-foreground leading-relaxed">
            Todas as nossas soluções são testadas e revisadas para garantir que funcionem.
            Se algo não resolver seu problema, nosso conteúdo é constantemente atualizado
            para oferecer as melhores alternativas.
          </p>
        </div>
      </div>
    </Layout>
  );
}
