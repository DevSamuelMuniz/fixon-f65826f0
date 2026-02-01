export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProblemStep {
  order: number;
  title: string;
  description: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  quick_answer: string;
  steps: ProblemStep[];
  tags: string[];
  warnings: string[];
  related_problems: string[];
  meta_description: string | null;
  status: 'draft' | 'published';
  featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}
