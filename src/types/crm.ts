
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  
  // CRM específico
  origin: CustomerOrigin;
  status: CustomerStatus;
  vehicleInterest?: string;
  priceRange?: string;
  financingInterest?: boolean;
  priority: Priority;
  assignedEmployee?: string;
  lastContact?: string;
  nextFollowUp?: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interaction {
  id: string;
  customerId: string;
  type: InteractionType;
  description: string;
  result?: InteractionResult;
  followUpDate?: string;
  employeeId: string;
  employeeName: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  type: AppointmentType;
  title: string;
  description?: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  employeeId: string;
  employeeName: string;
  reminder?: boolean;
  reminderTime?: number;
  vehicleId?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: Priority;
  dueDate: string;
  dueTime?: string;
  status: TaskStatus;
  customerId?: string;
  customerName?: string;
  employeeId: string;
  employeeName: string;
  createdAt: string;
  completedAt?: string;
}

export enum CustomerOrigin {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  WALK_IN = 'walk_in',
  PHONE_CALL = 'phone_call',
  ADVERTISING = 'advertising',
  PARTNER = 'partner',
  OTHER = 'other'
}

export enum CustomerStatus {
  PROSPECT = 'prospect',
  NEGOTIATING = 'negotiating',
  HOT_LEAD = 'hot_lead',
  COLD_LEAD = 'cold_lead',
  CLIENT = 'client',
  LOST = 'lost'
}

export enum InteractionType {
  CALL = 'call',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  VISIT = 'visit',
  TEST_DRIVE = 'test_drive',
  MEETING = 'meeting',
  OTHER = 'other'
}

export enum InteractionResult {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  SCHEDULED_FOLLOWUP = 'scheduled_followup',
  SALE_CLOSED = 'sale_closed',
  LOST_CLIENT = 'lost_client'
}

export enum AppointmentType {
  TEST_DRIVE = 'test_drive',
  MEETING = 'meeting',
  CALL_BACK = 'call_back',
  DOCUMENTATION = 'documentation',
  DELIVERY = 'delivery',
  OTHER = 'other'
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum TaskType {
  CALL = 'call',
  EMAIL = 'email',
  FOLLOW_UP = 'follow_up',
  DOCUMENTATION = 'documentation',
  PREPARATION = 'preparation',
  OTHER = 'other'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}
