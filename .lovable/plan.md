
## Análise Completa da Comunidade

### O que existe hoje:
- `/comunidade` — hub com categorias e tópicos recentes
- `/comunidade/:slug` — tópicos por categoria
- `/comunidade/todos` (ForumPage) — listagem geral com filtros
- `/comunidade/topico/:id` — detalhe do tópico com comentários
- `/comunidade/novo-topico` — criar tópico
- `/perfil` — perfil do usuário (básico)
- Sistema de badges, upvotes, menções, hashtags, imagens

### O que está faltando / pode melhorar:

**1. Engajamento e descoberta**
- Sem barra de busca na comunidade — usuário não consegue pesquisar tópicos
- Sem "Tópicos em Alta" / trending (ordenação por atividade recente + respostas)
- Sem sugestão de tópicos similares dentro de um tópico
- Lista de tópicos recentes no hub usa só 10 itens sem paginação

**2. UX do tópico**
- Autor do tópico não pode marcar a própria resposta como solução — só admin pode
- Sem botão de "Compartilhar" no tópico
- Sem breadcrumb navegável dentro do detalhe
- Não há feedback de "digitando" enquanto o form é preenchido (contador de caracteres)
- Sem ordenação dos comentários (mais votados / cronológico / mais recente)

**3. Perfil do usuário**
- Perfil não mostra histórico de tópicos e respostas do usuário
- Não exibe badges do usuário no perfil
- Sem upload de foto de perfil (avatar_url existe na tabela mas não é usado)
- Sem estatísticas: n° perguntas, n° respostas, n° soluções

**4. Gamificação**
- Badges existem no banco mas não são concedidos automaticamente — nenhuma trigger/edge function para auto-award
- Sem sistema de pontos/reputação visível

**5. UI/Layout**
- Hub da comunidade não tem seção de "Usuários Ativos" ou "Top Contribuidores"
- ForumPage (/comunidade/todos) e CommunityPage (/comunidade) têm designs duplicados — poderia unificar
- Sem dark/light theme consistency nos cards de tópico (já OK com Tailwind, mas layout de stats poderia ter mais destaque visual)

---

## Plano de Melhorias

Agrupei em **4 blocos** priorizados por impacto:

### Bloco A — Busca e Navegação (Alto impacto)
- Adicionar `SearchBar` específico da comunidade no hub `/comunidade`
- Filtrar `forum_questions` por texto (title + description via ILIKE)
- Novo hook `useForumSearch(query)` que busca em tempo real com debounce

### Bloco B — UX do Tópico (Alto impacto)
- Permitir que o **próprio autor** do tópico marque a melhor resposta (não só admin)
  - Alterar condição em `TopicDetailPage`: `isAdmin || user?.id === topic.user_id`
- Adicionar **contador de caracteres** no `RichTextInput`
- Adicionar botão **"Compartilhar"** (copia URL para clipboard) no tópico
- Adicionar **ordenação de comentários** (mais votados / cronológico) no detalhe

### Bloco C — Perfil Completo (Médio impacto)
- Reescrever `ProfilePage` com:
  - Upload de foto de perfil (usar bucket `community-images` existente)
  - Seção de badges do usuário (com `useUserBadges`)
  - Histórico: últimas perguntas e respostas do usuário
  - Stats: n° tópicos criados, n° respostas, n° upvotes recebidos

### Bloco D — Gamificação Automática (Médio impacto)
- Criar edge function `auto-award-badges` chamada após INSERT em `forum_answers`
  - Regras: 1ª resposta → `newcomer`, 5+ → `contributor`, 10+ → `helper`, 25+ → `expert`, 50+ → `guru`
  - Regra: tópico marcado como solução → `problem_solver`
- Adicionar trigger no banco que chama a edge function após INSERT em `forum_answers` e UPDATE em `forum_questions` (status = resolved)

### Bloco E — Hub visual melhorado (Menor impacto, bom apelo)
- Adicionar seção **"Top Contribuidores"** no hub `/comunidade`
  - Query: `forum_answers` GROUP BY `user_id`, ordenado por count
  - Mostra avatar + nome + n° respostas
- Adicionar **barra lateral** no desktop da listagem de tópicos com: categorias rápidas, tópicos em alta, CTA de cadastro

---

## Plano Técnico de Implementação

```text
Alterações de banco:
  - Nenhuma nova tabela necessária
  - Nova edge function: supabase/functions/auto-award-badges/index.ts
  - Trigger: após INSERT em forum_answers → chama auto-award-badges

Novos arquivos:
  src/hooks/useForumSearch.ts          — busca debounced em forum_questions
  src/components/community/SearchBar.tsx — barra de busca da comunidade
  src/components/community/TopContributors.tsx — widget top contribuidores
  src/components/community/CommentSortSelect.tsx — controle de ordenação
  supabase/functions/auto-award-badges/index.ts — auto concessão de badges

Arquivos modificados:
  src/pages/CommunityPage.tsx          — + busca, + top contribuidores
  src/pages/TopicDetailPage.tsx        — + marcar solução pelo autor, + ordenação, + compartilhar, + contador chars
  src/pages/ProfilePage.tsx            — reescrita com upload avatar, badges, histórico, stats
  src/components/community/RichTextInput.tsx — + contador de caracteres
```

### Pontos de atenção:
- O bucket `community-images` já existe e é público — upload de avatar pode usar ele com path `avatars/{user_id}`
- A coluna `avatar_url` já existe em `profiles` — só falta o UI de upload
- A permissão de marcar solução precisa garantir que `user_id` seja comparado com segurança (já vem do auth, não do client)
- A edge function de badges precisa do `SUPABASE_SERVICE_ROLE_KEY` (já configurado como secret)
