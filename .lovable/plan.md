
# FIX-ON - Plataforma de Soluções Rápidas de Tecnologia

## Visão Geral
Site mobile-first focado em resolver problemas de tecnologia de forma rápida e direta, com painel administrativo para gestão de conteúdo e busca funcional.

---

## 🎨 Design & Identidade Visual
- **Cor principal**: Azul (#2563EB) transmitindo tecnologia e confiança
- **Design**: Minimalista, limpo, muito espaço em branco
- **Tipografia**: Sans-serif moderna (Inter)
- **Logo**: Usar o logo fornecido (F geométrico) no header
- **Botões**: Grandes, arredondados, "thumb-friendly"
- **Mobile-first**: Toda interface pensada primeiro para celular

---

## 📱 Páginas Públicas

### 1. Home
- **Hero**: "Qual problema você quer resolver agora?" + barra de busca grande + botão "Resolver agora"
- **Categorias**: 4 cards grandes (Celular, Computador, Internet, Aplicativos) com ícones
- **Problemas Mais Buscados**: Lista dos problemas mais acessados
- **Como Funciona**: 3 passos simples ilustrados
- **Conteúdo em Destaque**: Soluções recentes
- **Footer**: Links rápidos, termos, privacidade

### 2. Página de Categoria
- Título da categoria
- Lista de todos os problemas dessa categoria em cards
- Filtro por subcategoria (se houver)

### 3. Página de Problema (SEO-friendly)
- URL amigável: `/celular/nao-liga`
- H1 claro com o problema
- Resposta direta no topo (destaque visual)
- Passo a passo numerado com ícones
- Avisos de risco quando necessário
- Seção "Problemas relacionados"
- CTA: "Ver outras soluções"

### 4. Página de Busca
- Resultados em tempo real conforme digita
- Filtros por categoria
- Destaque dos termos buscados

### 5. Páginas Institucionais
- Sobre
- Contato
- Termos de Uso
- Política de Privacidade

---

## 🔧 Painel Administrativo

### Acesso
- Login com email/senha
- Área restrita para administradores

### Gestão de Categorias
- Criar, editar, excluir categorias
- Definir ícone e cor de cada categoria
- Ordenar categorias

### Gestão de Problemas
- Criar novo problema com:
  - Título (SEO)
  - Categoria
  - Resposta direta
  - Passos da solução (editor simples)
  - Tags para busca
  - Avisos de risco
  - Problemas relacionados
- Editar e excluir problemas existentes
- Marcar como "destaque" para aparecer na home
- Status: rascunho ou publicado

### Dashboard
- Total de problemas publicados
- Categorias ativas

---

## 🗄️ Backend (Lovable Cloud/Supabase)

### Estrutura de Dados
- **Categorias**: nome, slug, ícone, cor, ordem
- **Problemas**: título, slug, resposta, passos, categoria, tags, avisos, status, destaque, data
- **Usuários Admin**: autenticação para o painel

### Funcionalidades
- Busca com filtro por categoria e tags
- Autenticação de administradores

---

## 📦 Conteúdo Inicial (10-15 problemas)

### Celular (4 problemas)
- Celular não liga
- Celular travando/lento
- Tela não responde ao toque
- Bateria acabando rápido

### Internet (4 problemas)
- Wi-Fi lento
- Wi-Fi caindo toda hora
- Não consigo conectar no Wi-Fi
- Internet do celular não funciona

### Computador (4 problemas)
- PC não reconhece SSD
- Computador lento
- PC não liga
- Tela azul no Windows

### Aplicativos (3 problemas)
- WhatsApp não abre
- App travando/fechando sozinho
- Instagram não carrega

---

## ⚡ Performance & SEO
- Páginas leves e rápidas
- Meta tags otimizadas para cada problema
- URLs amigáveis (slug)
- Preparado para PWA (instalável no celular)

---

## 🚀 Escalabilidade
- Estrutura modular de componentes
- Sistema de categorias flexível
- Preparado para adicionar novos nichos futuramente (mudando cores e conteúdo)

---

## Componentes Principais
- Header fixo com logo e menu hambúrguer
- Barra de busca com autocomplete
- Cards de categoria (ícone + título)
- Cards de problema (título + preview)
- Componente de passo a passo
- Footer responsivo
