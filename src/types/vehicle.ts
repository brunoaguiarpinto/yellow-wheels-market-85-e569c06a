
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  description?: string;
  images?: string[];
  status: VehicleStatus;
  purchaseInfo?: VehiclePurchase;
  createdAt: string;
  updatedAt: string;
}

export enum VehicleStatus {
  PURCHASED = 'purchased',
  AVAILABLE = 'available', 
  RESERVED = 'reserved',
  SOLD = 'sold',
  MAINTENANCE = 'maintenance'
}

export interface VehiclePurchase {
  id: string;
  vehicleId: string;
  supplier: string;
  purchasePrice: number;
  purchaseDate: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  documentation: string[];
  notes?: string;
  employeeId: string;
  employeeName: string;
  createdAt: string;
}

export interface VehicleHistory {
  id: string;
  vehicleId: string;
  action: 'purchased' | 'status_changed' | 'sold' | 'reserved' | 'maintenance';
  previousStatus?: VehicleStatus;
  newStatus?: VehicleStatus;
  details?: string;
  employeeId: string;
  employeeName: string;
  timestamp: string;
}
