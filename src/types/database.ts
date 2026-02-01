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
  order?: number;
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

// Forum Types
export interface ForumQuestion {
  id: string;
  author_name: string | null;
  author_email: string | null;
  title: string;
  description: string;
  status: 'open' | 'resolved' | 'converted';
  resolved_at: string | null;
  converted_problem_id: string | null;
  answer_count: number;
  category_id: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ForumAnswer {
  id: string;
  question_id: string;
  author_name: string | null;
  content: string;
  is_solution: boolean;
  upvote_count: number;
  created_at: string;
}

export interface ForumUpvote {
  id: string;
  answer_id: string;
  voter_fingerprint: string;
  created_at: string;
}

export interface ForumQuestionWithAnswers extends ForumQuestion {
  answers?: ForumAnswer[];
}
