export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string | null
          customer_id: string | null
          description: string | null
          employee_id: string
          end_time: string
          id: string
          lead_id: string | null
          start_time: string
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          employee_id: string
          end_time: string
          id?: string
          lead_id?: string | null
          start_time: string
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          employee_id?: string
          end_time?: string
          id?: string
          lead_id?: string | null
          start_time?: string
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_clauses: {
        Row: {
          content: string
          contract_id: string
          created_at: string | null
          id: string
          is_editable: boolean | null
          order_number: number
          title: string
        }
        Insert: {
          content: string
          contract_id: string
          created_at?: string | null
          id?: string
          is_editable?: boolean | null
          order_number: number
          title: string
        }
        Update: {
          content?: string
          contract_id?: string
          created_at?: string | null
          id?: string
          is_editable?: boolean | null
          order_number?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_clauses_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          commission_rate: number | null
          consignment_days: number | null
          contract_number: string
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string | null
          customer_id: string
          employee_id: string
          id: string
          observations: string | null
          sale_price: number
          signed_at: string | null
          status: Database["public"]["Enums"]["contract_status"] | null
          updated_at: string | null
          vehicle_id: string
          warranty_amount: number | null
          warranty_issue: string | null
        }
        Insert: {
          commission_rate?: number | null
          consignment_days?: number | null
          contract_number: string
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at?: string | null
          customer_id: string
          employee_id: string
          id?: string
          observations?: string | null
          sale_price: number
          signed_at?: string | null
          status?: Database["public"]["Enums"]["contract_status"] | null
          updated_at?: string | null
          vehicle_id: string
          warranty_amount?: number | null
          warranty_issue?: string | null
        }
        Update: {
          commission_rate?: number | null
          consignment_days?: number | null
          contract_number?: string
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string | null
          customer_id?: string
          employee_id?: string
          id?: string
          observations?: string | null
          sale_price?: number
          signed_at?: string | null
          status?: Database["public"]["Enums"]["contract_status"] | null
          updated_at?: string | null
          vehicle_id?: string
          warranty_amount?: number | null
          warranty_issue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          birth_date: string | null
          city: string | null
          created_at: string | null
          document: string | null
          email: string | null
          id: string
          name: string
          neighborhood: string | null
          number: string | null
          phone: string | null
          state: string | null
          street: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          name: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          commission_rate: number | null
          created_at: string | null
          document: string | null
          email: string
          hire_date: string
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["employee_role"]
          salary: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          commission_rate?: number | null
          created_at?: string | null
          document?: string | null
          email: string
          hire_date?: string
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          salary?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          commission_rate?: number | null
          created_at?: string | null
          document?: string | null
          email?: string
          hire_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          salary?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fixed_costs: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string
          due_date: string | null
          frequency: string
          id: string
          is_recurring: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description: string
          due_date?: string | null
          frequency?: string
          id?: string
          is_recurring?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string
          due_date?: string | null
          frequency?: string
          id?: string
          is_recurring?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string | null
          email: string | null
          employee_id: string | null
          id: string
          interest: string | null
          name: string
          notes: string | null
          origin: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          id?: string
          interest?: string | null
          name: string
          notes?: string | null
          origin?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          id?: string
          interest?: string | null
          name?: string
          notes?: string | null
          origin?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      post_sale_issues: {
        Row: {
          actual_cost: number | null
          assigned_to: string | null
          created_at: string | null
          customer_id: string
          description: string
          estimated_cost: number | null
          id: string
          issue_type: string
          priority: Database["public"]["Enums"]["issue_priority"] | null
          report_date: string
          resolution: string | null
          resolved_date: string | null
          status: Database["public"]["Enums"]["issue_status"] | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          actual_cost?: number | null
          assigned_to?: string | null
          created_at?: string | null
          customer_id: string
          description: string
          estimated_cost?: number | null
          id?: string
          issue_type: string
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          report_date?: string
          resolution?: string | null
          resolved_date?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          actual_cost?: number | null
          assigned_to?: string | null
          created_at?: string | null
          customer_id?: string
          description?: string
          estimated_cost?: number | null
          id?: string
          issue_type?: string
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          report_date?: string
          resolution?: string | null
          resolved_date?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_sale_issues_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_sale_issues_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_sale_issues_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_at: string | null
          customer_id: string
          down_payment: number | null
          employee_id: string
          financing_amount: number | null
          id: string
          notes: string | null
          payment_method: string
          sale_date: string
          sale_price: number
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          down_payment?: number | null
          employee_id: string
          financing_amount?: number | null
          id?: string
          notes?: string | null
          payment_method: string
          sale_date?: string
          sale_price: number
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          down_payment?: number | null
          employee_id?: string
          financing_amount?: number | null
          id?: string
          notes?: string | null
          payment_method?: string
          sale_date?: string
          sale_price?: number
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          priority: Database["public"]["Enums"]["issue_priority"] | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_costs: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string
          id: string
          invoice_number: string | null
          notes: string | null
          supplier: string | null
          type: Database["public"]["Enums"]["cost_type"]
          vehicle_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          supplier?: string | null
          type: Database["public"]["Enums"]["cost_type"]
          vehicle_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          supplier?: string | null
          type?: Database["public"]["Enums"]["cost_type"]
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_costs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_costs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          chassis: string | null
          color: string
          condition: string | null
          created_at: string | null
          description: string | null
          fuel: string
          id: string
          mileage: number | null
          model: string
          plate: string | null
          price: number
          purchase_date: string | null
          purchase_price: number | null
          status: Database["public"]["Enums"]["vehicle_status"] | null
          supplier: string | null
          transmission: string
          updated_at: string | null
          year: number
        }
        Insert: {
          brand: string
          chassis?: string | null
          color: string
          condition?: string | null
          created_at?: string | null
          description?: string | null
          fuel: string
          id?: string
          mileage?: number | null
          model: string
          plate?: string | null
          price: number
          purchase_date?: string | null
          purchase_price?: number | null
          status?: Database["public"]["Enums"]["vehicle_status"] | null
          supplier?: string | null
          transmission: string
          updated_at?: string | null
          year: number
        }
        Update: {
          brand?: string
          chassis?: string | null
          color?: string
          condition?: string | null
          created_at?: string | null
          description?: string | null
          fuel?: string
          id?: string
          mileage?: number | null
          model?: string
          plate?: string | null
          price?: number
          purchase_date?: string | null
          purchase_price?: number | null
          status?: Database["public"]["Enums"]["vehicle_status"] | null
          supplier?: string | null
          transmission?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_manager_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      contract_status: "draft" | "pending_signature" | "signed" | "cancelled"
      contract_type: "warranty_term" | "consignment" | "sale"
      cost_type:
        | "purchase"
        | "maintenance"
        | "documentation"
        | "transport"
        | "marketing"
        | "other"
      employee_role: "admin" | "manager" | "salesperson" | "mechanic"
      issue_priority: "low" | "medium" | "high" | "urgent"
      issue_status: "open" | "in_progress" | "resolved" | "closed"
      vehicle_status:
        | "purchased"
        | "available"
        | "reserved"
        | "sold"
        | "maintenance"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contract_status: ["draft", "pending_signature", "signed", "cancelled"],
      contract_type: ["warranty_term", "consignment", "sale"],
      cost_type: [
        "purchase",
        "maintenance",
        "documentation",
        "transport",
        "marketing",
        "other",
      ],
      employee_role: ["admin", "manager", "salesperson", "mechanic"],
      issue_priority: ["low", "medium", "high", "urgent"],
      issue_status: ["open", "in_progress", "resolved", "closed"],
      vehicle_status: [
        "purchased",
        "available",
        "reserved",
        "sold",
        "maintenance",
      ],
    },
  },
} as const
