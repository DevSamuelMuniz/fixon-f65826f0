
# Plano: Sistema de Anúncios Multi-Nicho

## Visão Geral

Implementar um sistema de anúncios Google AdSense integrado à arquitetura multi-tenant, onde cada nicho (tech, health, auto, casa) utiliza seu próprio ID de AdSense e posicionamentos estratégicos de ads.

---

## Componentes a Criar

### 1. Componente Base de Anúncio
**Arquivo:** `src/components/ads/AdUnit.tsx`

Componente reutilizável que:
- Carrega o AdSense ID do nicho atual via `useNiche()`
- Suporta diferentes formatos (banner, retângulo, in-article, sidebar)
- Renderiza condicionalmente baseado na configuração de monetização
- Inclui placeholder visual durante carregamento

### 2. Componentes Especializados

| Componente | Uso | Formato |
|------------|-----|---------|
| `AdBanner.tsx` | Topo/rodapé de páginas | 728x90 / responsivo |
| `AdInArticle.tsx` | Entre seções de conteúdo | 300x250 / nativo |
| `AdSidebar.tsx` | Lateral em desktop | 300x600 / vertical |

### 3. Script Loader
**Arquivo:** `src/components/ads/AdSenseScript.tsx`

Carrega o script do Google AdSense dinamicamente com o Publisher ID correto do nicho.

---

## Posicionamento dos Anúncios

### Página Inicial (`Index.tsx`)
- 1 banner após seção "Categorias"
- 1 ad in-article antes da seção "Como funciona"

### Página de Problema (`ProblemPage.tsx`)
- 1 ad após "Resposta rápida"
- 1 ad após os passos (antes de "Problemas relacionados")
- 1 ad sidebar em desktop

### Página de Categoria (`CategoryPage.tsx`)
- 1 banner após lista de 3 problemas
- 1 ad no final da página

### Fórum (`ForumPage.tsx`)
- 1 ad in-feed a cada 5 perguntas

---

## Configuração por Nicho

A estrutura já existente em `src/config/niches/` será utilizada:

```text
monetization: {
  adsenseId: 'ca-pub-XXXXX',  // ID único por nicho
  affiliateLinks: {...},
  leadCaptureEnabled: true,
}
```

---

## Arquivos a Criar/Modificar

### Criar:
1. `src/components/ads/AdUnit.tsx` - Componente base
2. `src/components/ads/AdBanner.tsx` - Banner horizontal
3. `src/components/ads/AdInArticle.tsx` - Ad nativo em conteúdo
4. `src/components/ads/AdSidebar.tsx` - Ad vertical lateral
5. `src/components/ads/AdSenseScript.tsx` - Loader do script
6. `src/components/ads/index.ts` - Exports

### Modificar:
1. `src/components/layout/Layout.tsx` - Adicionar AdSenseScript
2. `src/pages/Index.tsx` - Inserir ads nas posições
3. `src/pages/ProblemPage.tsx` - Inserir ads nas posições
4. `src/pages/CategoryPage.tsx` - Inserir ads nas posições
5. `src/pages/ForumPage.tsx` - Inserir ads in-feed

---

## Detalhes Técnicos

### Estrutura do AdUnit

O componente base detectará o nicho e renderizará:

```text
┌─────────────────────────────────────┐
│  [AdUnit]                           │
│  - Detecta nicho via useNiche()     │
│  - Pega adsenseId da config         │
│  - Renderiza slot do Google Ads     │
│  - Fallback: placeholder ou nada    │
└─────────────────────────────────────┘
```

### Formatos Suportados

| Formato | Dimensões | Uso |
|---------|-----------|-----|
| `banner` | 728x90, 320x50 (mobile) | Header/Footer |
| `rectangle` | 300x250 | Conteúdo |
| `vertical` | 300x600 | Sidebar |
| `in-article` | Responsivo | Entre parágrafos |
| `in-feed` | Nativo | Listas |

### Responsividade

Os ads serão adaptados para mobile:
- Banner desktop (728x90) → mobile (320x50)
- Sidebar oculta em mobile
- In-article mantém proporção

---

## Considerações de Performance

- Scripts carregados de forma assíncrona
- Ads renderizados após conteúdo principal
- Lazy loading para ads abaixo da dobra
- Sem impacto em Core Web Vitals

