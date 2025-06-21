
import type { Database } from '@/integrations/supabase/types';

export type Customer = Database['public']['Tables']['customers']['Row'];
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export type Employee = Database['public']['Tables']['employees']['Row'];
export type EmployeeInsert = Database['public']['Tables']['employees']['Insert'];
export type EmployeeUpdate = Database['public']['Tables']['employees']['Update'];

export type Vehicle = Database['public']['Tables']['vehicles']['Row'];
export type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
export type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];

export type Contract = Database['public']['Tables']['contracts']['Row'];
export type ContractInsert = Database['public']['Tables']['contracts']['Insert'];
export type ContractUpdate = Database['public']['Tables']['contracts']['Update'];

export type ContractClause = Database['public']['Tables']['contract_clauses']['Row'];
export type ContractClauseInsert = Database['public']['Tables']['contract_clauses']['Insert'];

export type Lead = Database['public']['Tables']['leads']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type Sale = Database['public']['Tables']['sales']['Row'];
export type PostSaleIssue = Database['public']['Tables']['post_sale_issues']['Row'];
export type VehicleCost = Database['public']['Tables']['vehicle_costs']['Row'];
export type FixedCost = Database['public']['Tables']['fixed_costs']['Row'];

// Extended types for joined data
export type ContractWithRelations = Contract & {
  customers?: Customer;
  vehicles?: Vehicle;
  employees?: Employee;
};
