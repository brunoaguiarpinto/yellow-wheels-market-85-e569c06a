
export interface PostSaleIssue {
  id: string;
  vehicleId: string;
  customerId: string;
  customerName: string;
  vehicleInfo: string;
  issueType: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  reportDate: string;
  resolvedDate?: string;
  resolution?: string;
  estimatedCost?: number;
  actualCost?: number;
  assignedTo: string;
  createdAt: string;
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface WarrantyInfo {
  id: string;
  vehicleId: string;
  type: 'factory' | 'extended' | 'dealer';
  startDate: string;
  endDate: string;
  coverage: string;
  isActive: boolean;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  customerId: string;
  serviceType: string;
  description: string;
  cost: number;
  serviceDate: string;
  performedBy: string;
  warranty: boolean;
}
