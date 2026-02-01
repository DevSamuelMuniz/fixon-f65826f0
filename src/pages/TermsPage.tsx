import { Layout } from '@/components/layout/Layout';

export default function TermsPage() {
  return (
    <Layout>
      <div className="container px-4 py-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Termos de Uso</h1>

        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="mb-6">
            Ao acessar e usar o Fix-on, você concorda com os seguintes termos:
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Uso do conteúdo</h2>
          <p className="mb-6">
            O conteúdo do Fix-on é fornecido apenas para fins informativos. As soluções
            apresentadas são sugestões baseadas em problemas comuns e podem não funcionar
            em todos os casos ou dispositivos.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. Responsabilidade</h2>
          <p className="mb-6">
            O Fix-on não se responsabiliza por danos causados pela aplicação das soluções
            sugeridas. Sempre faça backup de seus dados antes de realizar qualquer
            procedimento técnico.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. Propriedade intelectual</h2>
          <p className="mb-6">
            Todo o conteúdo do Fix-on, incluindo textos, imagens e logo, são de propriedade
            exclusiva do Fix-on e não podem ser reproduzidos sem autorização prévia.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. Modificações</h2>
          <p className="mb-6">
            Reservamos o direito de modificar estes termos a qualquer momento. As alterações
            entram em vigor imediatamente após sua publicação.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. Contato</h2>
          <p>
            Dúvidas sobre estes termos podem ser enviadas através da nossa página de contato.
          </p>
        </div>
      </div>
    </Layout>
  );
}
