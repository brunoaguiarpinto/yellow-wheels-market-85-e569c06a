
export interface ReportFilter {
  dateFrom?: string;
  dateTo?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  fuelType?: string;
  transmission?: string;
  employeeId?: string;
  customerId?: string;
  status?: string;
}

export interface LeadReport {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  leadsByOrigin: LeadOriginStats[];
  leadsByPeriod: PeriodStats[];
}

export interface LeadOriginStats {
  origin: string;
  count: number;
  converted: number;
  conversionRate: number;
}

export interface PeriodStats {
  period: string;
  leads: number;
  sales: number;
  revenue: number;
}

export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  salesByEmployee: EmployeeSalesStats[];
  salesByVehicleType: VehicleTypeSales[];
  salesByPeriod: PeriodStats[];
}

export interface EmployeeSalesStats {
  employeeId: string;
  employeeName: string;
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  conversionRate: number;
}

export interface VehicleTypeSales {
  brand: string;
  model?: string;
  count: number;
  revenue: number;
  averagePrice: number;
}

export interface FinancialReport {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  vehicleAnalysis: VehicleProfitAnalysis[];
}

export interface VehicleProfitAnalysis {
  vehicleId: string;
  vehicleName: string;
  salePrice: number;
  totalCosts: number;
  profit: number;
  profitMargin: number;
}
