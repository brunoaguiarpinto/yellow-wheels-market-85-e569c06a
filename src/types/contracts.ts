
export interface Contract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  salePrice: number;
  employeeId: string;
  employeeName: string;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
  signedAt?: string;
  clauses: ContractClause[];
  observations?: string;
  paymentTerms: PaymentTerms;
}

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_SIGNATURE = 'pending_signature',
  SIGNED = 'signed',
  CANCELLED = 'cancelled'
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  isEditable: boolean;
  order: number;
}

export interface PaymentTerms {
  paymentMethod: 'cash' | 'financing' | 'mixed';
  downPayment?: number;
  financingAmount?: number;
  installments?: number;
  monthlyPayment?: number;
  financingCompany?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  clauses: ContractClause[];
  isDefault: boolean;
}
