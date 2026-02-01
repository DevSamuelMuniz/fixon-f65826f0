/**
 * Configuração centralizada de monetização
 * 
 * Para configurar o Google AdSense:
 * 1. Acesse https://www.google.com/adsense
 * 2. Crie uma conta ou faça login
 * 3. Adicione seu site para verificação
 * 4. Após aprovação, copie o ID do Publisher (ca-pub-XXXXXXXXXX)
 * 5. Cole o ID abaixo
 * 
 * O mesmo ID será usado em todos os nichos.
 * Para usar IDs diferentes por nicho, edite cada arquivo em src/config/niches/
 */

// ID do Google AdSense Publisher
export const ADSENSE_PUBLISHER_ID = 'ca-pub-8733445144027820';

// Slots de anúncio por formato (crie no painel do AdSense)
export const AD_SLOTS = {
  banner: '1234567890',      // Banner horizontal (728x90)
  rectangle: '2345678901',   // Retângulo (300x250)
  inArticle: '3456789012',   // In-article (responsivo)
  inFeed: '4567890123',      // In-feed (nativo)
  sidebar: '5678901234',     // Sidebar vertical (300x600)
};

// Links de afiliados padrão
export const DEFAULT_AFFILIATE_LINKS = {
  amazon: 'https://amazon.com.br/?tag=fixon-20',
  mercadolivre: 'https://mercadolivre.com.br/?ref=fixon',
  magazineluiza: 'https://magazineluiza.com.br/?ref=fixon',
};
