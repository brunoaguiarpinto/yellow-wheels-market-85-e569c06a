
export interface VehicleCost {
  id: string;
  vehicleId: string;
  type: CostType;
  category: string;
  description: string;
  amount: number;
  date: string;
  invoiceNumber?: string;
  supplier?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export enum CostType {
  PURCHASE = 'purchase',
  MAINTENANCE = 'maintenance',
  DOCUMENTATION = 'documentation',
  TRANSPORT = 'transport',
  MARKETING = 'marketing',
  OTHER = 'other'
}

export interface FixedCost {
  id: string;
  category: string;
  description: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  dueDate?: string;
  isRecurring: boolean;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFinancialSummary {
  vehicleId: string;
  purchasePrice: number;
  salePrice?: number;
  totalCosts: number;
  costsByCategory: { [key: string]: number };
  grossProfit?: number;
  profitMargin?: number;
  status: 'in_stock' | 'sold' | 'reserved';
}

export interface ProfitLossAnalysis {
  vehicleId: string;
  vehicleName: string;
  purchasePrice: number;
  salePrice: number;
  directCosts: number;
  allocatedFixedCosts: number;
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
}
