import { Layout } from "@/components/layout/Layout";
import { EmptyState } from "@/components/EmptyState";

const NotFound = () => {
  return (
    <Layout>
      <EmptyState
        type="notFound"
        title="404 - Página não encontrada"
        description="Oops! A página que você procura não existe ou foi movida."
      />
    </Layout>
  );
};

export default NotFound;
