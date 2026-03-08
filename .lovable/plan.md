
## Análise completa do estado atual

**O que já está pronto:**
- 177 problemas com soluções em 8 passos
- Sistema de categorias e busca
- Painel admin (CRUD de problemas e categorias)
- Autenticação (login/cadastro/perfil)
- Fórum/Comunidade com tópicos e respostas
- SEO: JSON-LD HowTo, Open Graph, sitemap dinâmico
- PWA (instalável)
- Google Analytics 4 já configurado no `index.html` (G-FXYX4KKT7Z)
- Google AdSense já no `index.html`
- Sistema de nichos (multi-domínio)
- Página de privacidade e termos

**O que ainda falta para o sistema estar completo:**

### 1. Recuperação de senha (crítico)
`useAuth.ts` não tem `resetPassword`. O `AuthPage.tsx` não tem link "Esqueci minha senha". Usuários que esquecem a senha ficam bloqueados.

### 2. Banner de cookies/LGPD (crítico para AdSense)
Nenhum componente de cookie consent existe no projeto. O Google AdSense exige consentimento explícito para usuários da UE/Brasil (LGPD). Sem ele, risco de suspensão da conta AdSense.

### 3. Formulário de contato não funciona de verdade
`ContactPage.tsx` linha 21: `await new Promise(resolve => setTimeout(resolve, 1000))` — é apenas uma simulação. Mensagens nunca chegam a lugar nenhum.

### 4. Redirecionamento após confirmar email
Após cadastro, o usuário recebe email de confirmação. O `redirectUrl` aponta para `/` mas não há mensagem de boas-vindas ou indicação de que o email foi confirmado com sucesso.

### 5. Página de erro 404 customizada
Existe `NotFound.tsx` mas é muito básico — sem sugestões de conteúdo relacionado ou botão de busca visível.

---

## Plano de implementação — o que falta para estar completo

### Prioridade 1 — Funcional/Crítico

**A) Recuperar senha**
- Adicionar link "Esqueci minha senha" em `AuthPage.tsx`
- Adicionar método `resetPassword(email)` em `useAuth.ts`
- Criar página `/recuperar-senha` para confirmar o envio do email
- Criar página `/nova-senha` para receber o token e permitir nova senha
- Adicionar rota em `App.tsx`

**B) Cookie consent LGPD**
- Criar componente `CookieBanner` persistente no rodapé
- Salvar preferência em `localStorage`
- Bloquear scripts de analytics/ads até consentimento (opcional granular)
- Adicionar ao `Layout.tsx`

**C) Formulário de contato funcional**
- Criar edge function `send-contact-email` usando o `LOVABLE_API_KEY` ou salvar mensagens em tabela `contact_messages` no banco
- Migração de banco: tabela `contact_messages` (id, name, email, message, created_at)
- Atualizar `ContactPage.tsx` para salvar no banco

### Prioridade 2 — UX/Polimento

**D) 404 melhorado**
- Adicionar barra de busca na página 404
- Mostrar categorias populares como sugestão

**E) Email de boas-vindas pós-confirmação**
- Detectar parâmetro `?confirmed=true` na URL e exibir toast de boas-vindas

---

## Arquivos afetados

```text
src/hooks/useAuth.ts              — adicionar resetPassword()
src/pages/AuthPage.tsx            — link "esqueci minha senha"
src/pages/ResetPasswordPage.tsx   — nova página (solicitar reset)
src/pages/NewPasswordPage.tsx     — nova página (definir nova senha)
src/components/CookieBanner.tsx   — novo componente LGPD
src/components/layout/Layout.tsx  — incluir CookieBanner
src/pages/ContactPage.tsx         — formulário real
src/pages/NotFound.tsx            — 404 melhorado
src/App.tsx                       — novas rotas
supabase/migrations/              — tabela contact_messages (opcional)
```

---

## O que NÃO falta (já está feito)

- Google Analytics 4: já no `index.html` (linha 43-49)
- Google AdSense: já no `index.html` (linha 52-58)
- SEO completo: JSON-LD, Open Graph, sitemap
- Auth: login, cadastro, perfil
- Admin: dashboard, CRUD completo
- PWA: instalável
- Comunidade/Fórum: funcional
- Privacidade e Termos: existem
