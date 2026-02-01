import { Layout } from '@/components/layout/Layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="container px-4 py-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Política de Privacidade</h1>

        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="mb-6">
            Sua privacidade é importante para nós. Esta política explica como tratamos
            suas informações.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Coleta de dados</h2>
          <p className="mb-6">
            O Fix-on pode coletar informações básicas de navegação para melhorar a
            experiência do usuário e entender quais conteúdos são mais úteis.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Uso das informações</h2>
          <p className="mb-6">
            As informações coletadas são usadas exclusivamente para:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Melhorar o conteúdo e a experiência do site</li>
            <li>Entender as necessidades dos usuários</li>
            <li>Responder a contatos e solicitações</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Cookies</h2>
          <p className="mb-6">
            Utilizamos cookies essenciais para o funcionamento do site. Você pode
            desabilitar cookies nas configurações do seu navegador.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Compartilhamento</h2>
          <p className="mb-6">
            Não vendemos ou compartilhamos suas informações pessoais com terceiros,
            exceto quando exigido por lei.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Contato</h2>
          <p>
            Para questões sobre privacidade, entre em contato através da nossa
            página de contato.
          </p>
        </div>
      </div>
    </Layout>
  );
}
