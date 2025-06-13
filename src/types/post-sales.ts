
export interface PostSaleIssue {
  id: string;
  vehicleId: string;
  customerId: string;
  customerName: string;
  vehicleName: string;
  issueType: IssueType;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: IssueStatus;
  reportedDate: string;
  resolvedDate?: string;
  resolution?: string;
  cost?: number;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export enum IssueType {
  MECHANICAL = 'mechanical',
  ELECTRICAL = 'electrical',
  DOCUMENTATION = 'documentation',
  COSMETIC = 'cosmetic',
  OTHER = 'other'
}

export enum IssueStatus {
  REPORTED = 'reported',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export interface NegotiationHistory {
  id: string;
  customerId: string;
  vehicleId: string;
  originalPrice: number;
  requestedDiscount: number;
  approvedDiscount: number;
  finalPrice: number;
  negotiationNotes: string;
  employeeId: string;
  date: string;
  status: 'ongoing' | 'accepted' | 'rejected';
}
