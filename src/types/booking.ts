export type ServiceCategory = 
  | 'railway'
  | 'flight'
  | 'bus'
  | 'passport'
  | 'driving_license'
  | 'job_application';

export type CustomerStatus = 
  | 'Pending'
  | 'In Progress'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export type PriorityLevel = 'Standard' | 'Urgent' | 'Tatkal';

export interface CustomerRecord {
  id: string; // e.g. OSB-2026-1042
  fullName: string;
  phoneNumber: string;
  dob: string; // YYYY-MM-DD
  age: number; // Automatically calculated
  service: ServiceCategory;
  subService: string;
  status: CustomerStatus;
  priority: PriorityLevel;
  journeyOrTargetDate?: string;
  sourceCity?: string;
  destinationCity?: string;
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ServiceDefinition {
  id: ServiceCategory;
  name: string;
  iconName: string;
  tagline: string;
  subServices: string[];
  fieldsHint: string;
  description: string;
}

export interface BusinessConfig {
  businessName: string;
  ownerName: string;
  primaryPhone: string;
  whatsappPhone: string;
  email: string;
  location: string;
  workingHours: string;
}
