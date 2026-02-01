export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          display_order: number
          icon: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      forum_answers: {
        Row: {
          author_name: string | null
          content: string
          created_at: string
          id: string
          is_solution: boolean
          question_id: string
          upvote_count: number
        }
        Insert: {
          author_name?: string | null
          content: string
          created_at?: string
          id?: string
          is_solution?: boolean
          question_id: string
          upvote_count?: number
        }
        Update: {
          author_name?: string | null
          content?: string
          created_at?: string
          id?: string
          is_solution?: boolean
          question_id?: string
          upvote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "forum_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_questions: {
        Row: {
          answer_count: number
          author_email: string | null
          author_name: string | null
          converted_problem_id: string | null
          created_at: string
          description: string
          id: string
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          answer_count?: number
          author_email?: string | null
          author_name?: string | null
          converted_problem_id?: string | null
          created_at?: string
          description: string
          id?: string
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          answer_count?: number
          author_email?: string | null
          author_name?: string | null
          converted_problem_id?: string | null
          created_at?: string
          description?: string
          id?: string
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_questions_converted_problem_id_fkey"
            columns: ["converted_problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_upvotes: {
        Row: {
          answer_id: string
          created_at: string
          id: string
          voter_fingerprint: string
        }
        Insert: {
          answer_id: string
          created_at?: string
          id?: string
          voter_fingerprint: string
        }
        Update: {
          answer_id?: string
          created_at?: string
          id?: string
          voter_fingerprint?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_upvotes_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "forum_answers"
            referencedColumns: ["id"]
          },
        ]
      }
      problems: {
        Row: {
          category_id: string
          created_at: string
          featured: boolean
          id: string
          meta_description: string | null
          quick_answer: string
          related_problems: string[] | null
          slug: string
          status: string
          steps: Json
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number
          warnings: string[] | null
        }
        Insert: {
          category_id: string
          created_at?: string
          featured?: boolean
          id?: string
          meta_description?: string | null
          quick_answer: string
          related_problems?: string[] | null
          slug: string
          status?: string
          steps?: Json
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number
          warnings?: string[] | null
        }
        Update: {
          category_id?: string
          created_at?: string
          featured?: boolean
          id?: string
          meta_description?: string | null
          quick_answer?: string
          related_problems?: string[] | null
          slug?: string
          status?: string
          steps?: Json
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number
          warnings?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "problems_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_problems: {
        Args: { search_query: string }
        Returns: {
          category_id: string
          created_at: string
          featured: boolean
          id: string
          meta_description: string | null
          quick_answer: string
          related_problems: string[] | null
          slug: string
          status: string
          steps: Json
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number
          warnings: string[] | null
        }[]
        SetofOptions: {
          from: "*"
          to: "problems"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
