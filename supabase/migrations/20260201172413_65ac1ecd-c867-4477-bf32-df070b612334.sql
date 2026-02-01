-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Criar tabela de roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar role (security definer para evitar recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy para user_roles (apenas admins podem ver/editar)
CREATE POLICY "Admins podem ver todas as roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

-- Criar tabela de categorias
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL DEFAULT 'folder',
    color VARCHAR(7) NOT NULL DEFAULT '#2563EB',
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias (leitura pública, escrita admin)
CREATE POLICY "Categorias são públicas para leitura"
ON public.categories
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins podem criar categorias"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem editar categorias"
ON public.categories
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem excluir categorias"
ON public.categories
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Criar tabela de problemas
CREATE TABLE public.problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    quick_answer TEXT NOT NULL,
    steps JSONB NOT NULL DEFAULT '[]',
    tags TEXT[] DEFAULT '{}',
    warnings TEXT[] DEFAULT '{}',
    related_problems UUID[] DEFAULT '{}',
    meta_description VARCHAR(160),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    featured BOOLEAN NOT NULL DEFAULT false,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(category_id, slug)
);

-- Habilitar RLS
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Políticas para problemas
CREATE POLICY "Problemas publicados são públicos"
ON public.problems
FOR SELECT
TO anon, authenticated
USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem criar problemas"
ON public.problems
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem editar problemas"
ON public.problems
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem excluir problemas"
ON public.problems
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Índices para performance
CREATE INDEX idx_problems_category ON public.problems(category_id);
CREATE INDEX idx_problems_status ON public.problems(status);
CREATE INDEX idx_problems_featured ON public.problems(featured);
CREATE INDEX idx_problems_tags ON public.problems USING GIN(tags);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_problems_updated_at
BEFORE UPDATE ON public.problems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para busca full-text
CREATE OR REPLACE FUNCTION public.search_problems(search_query TEXT)
RETURNS SETOF public.problems
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT *
  FROM public.problems
  WHERE status = 'published'
    AND (
      title ILIKE '%' || search_query || '%'
      OR quick_answer ILIKE '%' || search_query || '%'
      OR search_query = ANY(tags)
    )
  ORDER BY 
    CASE WHEN title ILIKE search_query || '%' THEN 0 ELSE 1 END,
    view_count DESC
  LIMIT 20;
$$;