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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          inquiry_type: string
          message: string
          name: string
          phone: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          inquiry_type: string
          message: string
          name: string
          phone?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string
        }
        Relationships: []
      }
      demo_bookings: {
        Row: {
          area: string | null
          board: string | null
          city: string | null
          class_level: string | null
          created_at: string
          exam: string | null
          exam_category: string | null
          frequency: string | null
          goals: string[] | null
          hobby_type: string | null
          id: string
          mode: string | null
          name: string | null
          otp_verified: boolean
          phone: string
          preferred_time: string | null
          prep_level: string | null
          skill_type: string | null
          start_time: string | null
          step_reached: number
          subjects: string[] | null
          status: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          area?: string | null
          board?: string | null
          city?: string | null
          class_level?: string | null
          created_at?: string
          exam?: string | null
          exam_category?: string | null
          frequency?: string | null
          goals?: string[] | null
          hobby_type?: string | null
          id?: string
          mode?: string | null
          name?: string | null
          otp_verified?: boolean
          phone: string
          preferred_time?: string | null
          prep_level?: string | null
          skill_type?: string | null
          start_time?: string | null
          step_reached?: number
          subjects?: string[] | null
          status?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          area?: string | null
          board?: string | null
          city?: string | null
          class_level?: string | null
          created_at?: string
          exam?: string | null
          exam_category?: string | null
          frequency?: string | null
          goals?: string[] | null
          hobby_type?: string | null
          id?: string
          mode?: string | null
          name?: string | null
          otp_verified?: boolean
          phone?: string
          preferred_time?: string | null
          prep_level?: string | null
          skill_type?: string | null
          start_time?: string | null
          step_reached?: number
          subjects?: string[] | null
          status?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      counselling_requests: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          type: string | null
          class_age: string | null
          concern: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          phone?: string | null
          type?: string | null
          class_age?: string | null
          concern?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          type?: string | null
          class_age?: string | null
          concern?: string | null
          status?: string | null
          created_at?: string
        }
        Relationships: []
      }
      reported_tutors: {
        Row: {
          id: string
          tutor_name: string | null
          mobile: string | null
          whatsapp: string | null
          state: string | null
          city: string | null
          area: string | null
          fraud_type: string | null
          description: string | null
          incident_date: string | null
          agency_name: string | null
          contact_person: string | null
          agency_phone: string | null
          agency_email: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tutor_name?: string | null
          mobile?: string | null
          whatsapp?: string | null
          state?: string | null
          city?: string | null
          area?: string | null
          fraud_type?: string | null
          description?: string | null
          incident_date?: string | null
          agency_name?: string | null
          contact_person?: string | null
          agency_phone?: string | null
          agency_email?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tutor_name?: string | null
          mobile?: string | null
          whatsapp?: string | null
          state?: string | null
          city?: string | null
          area?: string | null
          fraud_type?: string | null
          description?: string | null
          incident_date?: string | null
          agency_name?: string | null
          contact_person?: string | null
          agency_phone?: string | null
          agency_email?: string | null
          status?: string | null
          created_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          area: string | null
          board: string | null
          budget: string | null
          city: string | null
          class_level: string | null
          created_at: string
          exam: string | null
          exam_category: string | null
          frequency: string | null
          goals: string[] | null
          hobby_type: string | null
          id: string
          is_new: boolean | null
          lead_score: number | null
          lead_temperature: string | null
          mode: string | null
          name: string | null
          next_follow_up: string | null
          otp_verified: boolean
          phone: string
          preferred_time: string | null
          prep_level: string | null
          skill_type: string | null
          start_time: string | null
          status: string | null
          step_reached: number
          subjects: string[] | null
          updated_at: string
          urgency: string | null
          user_type: string | null
        }
        Insert: {
          area?: string | null
          board?: string | null
          budget?: string | null
          city?: string | null
          class_level?: string | null
          created_at?: string
          exam?: string | null
          exam_category?: string | null
          frequency?: string | null
          goals?: string[] | null
          hobby_type?: string | null
          id?: string
          is_new?: boolean | null
          lead_score?: number | null
          lead_temperature?: string | null
          mode?: string | null
          name?: string | null
          next_follow_up?: string | null
          otp_verified?: boolean
          phone: string
          preferred_time?: string | null
          prep_level?: string | null
          skill_type?: string | null
          start_time?: string | null
          status?: string | null
          step_reached?: number
          subjects?: string[] | null
          updated_at?: string
          urgency?: string | null
          user_type?: string | null
        }
        Update: {
          area?: string | null
          board?: string | null
          budget?: string | null
          city?: string | null
          class_level?: string | null
          created_at?: string
          exam?: string | null
          exam_category?: string | null
          frequency?: string | null
          goals?: string[] | null
          hobby_type?: string | null
          id?: string
          is_new?: boolean | null
          lead_score?: number | null
          lead_temperature?: string | null
          mode?: string | null
          name?: string | null
          next_follow_up?: string | null
          otp_verified?: boolean
          phone?: string
          preferred_time?: string | null
          prep_level?: string | null
          skill_type?: string | null
          start_time?: string | null
          status?: string | null
          step_reached?: number
          subjects?: string[] | null
          updated_at?: string
          urgency?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      otp_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          phone: string
          verified: boolean
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: string
          phone: string
          verified?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
          verified?: boolean
        }
        Relationships: []
      }
      tutor_registrations: {
        Row: {
          available_days: string[]
          bio: string | null
          boards: string[]
          city: string
          classes: string[]
          created_at: string
          current_status: string
          email: string
          expected_fees: string
          experience: string
          id: string
          id_proof_name: string | null
          languages: string[]
          name: string
          phone: string
          photo_name: string | null
          pincode: string
          preferred_locations: string | null
          qualification: string
          resume_name: string | null
          specialization: string | null
          state: string
          subjects: string[]
          teaching_mode: string
          time_slots: string[]
          travel_radius: string | null
          travel_willing: string
          video_link: string | null
        }
        Insert: {
          available_days: string[]
          bio?: string | null
          boards: string[]
          city: string
          classes: string[]
          created_at?: string
          current_status: string
          email: string
          expected_fees: string
          experience: string
          id?: string
          id_proof_name?: string | null
          languages: string[]
          name: string
          phone: string
          photo_name?: string | null
          pincode: string
          preferred_locations?: string | null
          qualification: string
          resume_name?: string | null
          specialization?: string | null
          state: string
          subjects: string[]
          teaching_mode: string
          time_slots: string[]
          travel_radius?: string | null
          travel_willing: string
          video_link?: string | null
        }
        Update: {
          available_days?: string[]
          bio?: string | null
          boards?: string[]
          city?: string
          classes?: string[]
          created_at?: string
          current_status?: string
          email?: string
          expected_fees?: string
          experience?: string
          id?: string
          id_proof_name?: string | null
          languages?: string[]
          name?: string
          phone?: string
          photo_name?: string | null
          pincode?: string
          preferred_locations?: string | null
          qualification?: string
          resume_name?: string | null
          specialization?: string | null
          state?: string
          subjects?: string[]
          teaching_mode?: string
          time_slots?: string[]
          travel_radius?: string | null
          travel_willing?: string
          video_link?: string | null
        }
        Relationships: []
      }
      agency_activity_logs: {
        Row: {
          action_type: string
          created_at: string
          device_fingerprint: string | null
          id: string
          ip_address: string | null
          location_approx: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          location_approx?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          location_approx?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "trust_users"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_clusters: {
        Row: {
          categories: string[] | null
          city: string | null
          created_at: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          normalized_phone: string
          primary_name: string | null
          report_count: number | null
          state: string | null
          status: Database["public"]["Enums"]["cluster_status"] | null
          unique_reporters_count: number | null
          updated_at: string
          risk_score: number | null
        }
        Insert: {
          categories?: string[] | null
          city?: string | null
          created_at?: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          normalized_phone: string
          primary_name?: string | null
          report_count?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["cluster_status"] | null
          unique_reporters_count?: number | null
          updated_at?: string
          risk_score?: number | null
        }
        Update: {
          categories?: string[] | null
          city?: string | null
          created_at?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          normalized_phone?: string
          primary_name?: string | null
          report_count?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["cluster_status"] | null
          unique_reporters_count?: number | null
          updated_at?: string
          risk_score?: number | null
        }
        Relationships: []
      }
      entity_reports: {
        Row: {
          amount: number | null
          category: string | null
          city: string | null
          created_at: string
          description: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          fraud_type: string | null
          id: string
          incident_date: string | null
          issue_type: string | null
          name: string | null
          normalized_phone: string
          phone: string
          proof_urls: string[] | null
          reported_by_user_id: string | null
          state: string | null
          status: string | null
          admin_notes: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          fraud_type?: string | null
          id?: string
          incident_date?: string | null
          issue_type?: string | null
          name?: string | null
          normalized_phone: string
          phone: string
          proof_urls?: string[] | null
          reported_by_user_id?: string | null
          state?: string | null
          status?: string | null
          admin_notes?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          fraud_type?: string | null
          id?: string
          incident_date?: string | null
          issue_type?: string | null
          name?: string | null
          normalized_phone?: string
          phone?: string
          proof_urls?: string[] | null
          reported_by_user_id?: string | null
          state?: string | null
          status?: string | null
          admin_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_reports_reported_by_user_id_fkey"
            columns: ["reported_by_user_id"]
            isOneToOne: false
            referencedRelation: "trust_users"
            referencedColumns: ["id"]
          },
        ]
      }
      intelligence_alerts: {
        Row: {
          alert_type: string
          cluster_id: string | null
          created_at: string
          description: string | null
          id: string
          is_resolved: boolean | null
          metadata: Json | null
          severity: string | null
        }
        Insert: {
          alert_type: string
          cluster_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          severity?: string | null
        }
        Update: {
          alert_type?: string
          cluster_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intelligence_alerts_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "entity_clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_users: {
        Row: {
          city: string
          created_at: string
          id: string
          institute_name: string
          mobile: string
          owner_name: string
          trust_score: number | null
          updated_at: string | null
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          institute_name: string
          mobile: string
          owner_name: string
          trust_score?: number | null
          updated_at?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          institute_name?: string
          mobile?: string
          owner_name?: string
          trust_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      entity_type: "tutor" | "parent"
      cluster_status: "normal" | "repeat_offender" | "high_risk"
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
    Enums: {},
  },
} as const

