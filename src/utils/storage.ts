import { BusinessConfig, CustomerRecord, ServiceCategory, ServiceDefinition } from '../types/booking';
import { calculateAge } from './ageCalculator';

export const SERVICES_CONFIG: ServiceDefinition[] = [
  {
    id: 'railway',
    name: 'Railway Booking',
    iconName: 'Train',
    tagline: 'IRCTC Authorized Tatkal & Premium Rail Reservations',
    subServices: [
      'Tatkal Booking (AC & Non-AC)',
      'AC Classes (1A, 2A, 3A, 3E, CC)',
      'Non-AC Sleeper & Second Sitting',
      'Premium Tatkal Fast Booking',
      'Senior Citizen / Concession Assistance'
    ],
    fieldsHint: 'Origin, Destination & Travel Date',
    description: 'Guaranteed quick Tatkal slots, quota verification, berth preference selection, and real-time PNR status tracking.'
  },
  {
    id: 'flight',
    name: 'Flight Booking',
    iconName: 'Plane',
    tagline: 'Domestic & International Air Tickets at Lowest Fares',
    subServices: [
      'Domestic Air Tickets (IndiGo, Air India, SpiceJet)',
      'International Flight Reservations',
      'Economy / Premium / Business Class',
      'Baggage & Meal Add-ons',
      'Rescheduling & Cancellation Support'
    ],
    fieldsHint: 'From, To & Travel Date',
    description: 'Instant flight price comparison across airlines, web check-in assistance, and personalized travel schedules.'
  },
  {
    id: 'bus',
    name: 'Bus Booking',
    iconName: 'Bus',
    tagline: 'Intercity AC Sleeper & Luxury Bus Travel',
    subServices: [
      'AC Sleeper & Multi-Axle Volvo',
      'Semi-Sleeper & Seater Coach',
      'State Transport & Private Operators',
      'Return Journey Package'
    ],
    fieldsHint: 'Boarding Point & Drop City',
    description: 'Direct seat layout selection, live bus tracking coordinates, and reliable pickup point verification.'
  },
  {
    id: 'passport',
    name: 'Passport Services',
    iconName: 'BookUser',
    tagline: 'PSK Appointment & Application Processing',
    subServices: [
      'New Passport Application (Fresh)',
      'Passport Renewal Assistance',
      'Tatkaal Passport Dispatch Assistance',
      'Police Clearance Certificate (PCC)',
      'Name / Address Correction in Passport'
    ],
    fieldsHint: 'Preferred PSK / Regional Passport Office',
    description: 'End-to-end documentation auditing, slot booking at PSK/POPSK, annexure drafting, and interview guidelines.'
  },
  {
    id: 'driving_license',
    name: 'Driving License Assistance',
    iconName: 'IdCard',
    tagline: 'Sarathi Parivahan RTO Test & Documentation',
    subServices: [
      'Learner License (LL) Online Slot',
      'Permanent Driving License (DL)',
      'DL Renewal & Expired License Renewal',
      'Addition of Class of Vehicle (MCWG / LMV)',
      'Duplicate License / Address Update'
    ],
    fieldsHint: 'RTO Office & Vehicle Category (Bike / Car)',
    description: 'RTO slot appointment scheduling, Parivahan form uploading, medical certificate guidance, and mock test preparation.'
  },
  {
    id: 'job_application',
    name: 'Job Application Help',
    iconName: 'Briefcase',
    tagline: 'Government & Private Portal Application Support',
    subServices: [
      'Documentation & Certificate Attestation',
      'Form-Filling Support (SSC, UPSC, Banking, Railway)',
      'State Govt & Public Service Commission Forms',
      'Photo / Signature / Thumb Impression Resizing',
      'Resume & Bio-Data Formatting'
    ],
    fieldsHint: 'Exam / Post Name & Last Submission Date',
    description: 'Error-free online form submissions, precise photo dimension compliance, Challan/fee payment, and final acknowledgment printout.'
  }
];

export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  businessName: 'Omorjit Singha Online Booking Services',
  ownerName: 'Omorjit Singha',
  primaryPhone: '+91 70996 26706',
  whatsappPhone: '+917099626706',
  email: 'omorjitsingha305@gmail.com',
  location: 'Main Service Center, Silchar / Northeast Hub',
  workingHours: 'Mon - Sun: 7:00 AM - 10:30 PM (Tatkal 10AM/11AM)'
};

const STORAGE_KEY_CUSTOMERS = 'omorjit_singha_customers_v1';
const STORAGE_KEY_CONFIG = 'omorjit_singha_business_config_v1';

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'OSB-2026-1001',
    fullName: 'Rahul Sharma',
    phoneNumber: '+91 98765 12345',
    dob: '1995-04-12',
    age: calculateAge('1995-04-12'),
    service: 'railway',
    subService: 'Tatkal Booking (AC & Non-AC)',
    status: 'Confirmed',
    priority: 'Tatkal',
    journeyOrTargetDate: '2026-10-15',
    sourceCity: 'Guwahati',
    destinationCity: 'New Delhi',
    notes: 'Train 12423 Rajdhani Express, 3A preferred. Tatkal ticket confirmed at 10:01 AM.',
    createdAt: '2026-09-28T09:30:00Z',
    updatedAt: '2026-09-28T10:05:00Z'
  },
  {
    id: 'OSB-2026-1002',
    fullName: 'Priya Mukherjee',
    phoneNumber: '+91 98123 45678',
    dob: '1999-11-20',
    age: calculateAge('1999-11-20'),
    service: 'passport',
    subService: 'New Passport Application (Fresh)',
    status: 'In Progress',
    priority: 'Standard',
    journeyOrTargetDate: '2026-10-22',
    sourceCity: 'Silchar PSK',
    destinationCity: 'Guwahati RPO',
    notes: 'Aadhaar and 10th marksheet verified. PSK appointment booked for Oct 22, 11:30 AM.',
    createdAt: '2026-09-29T14:15:00Z',
    updatedAt: '2026-09-30T16:20:00Z'
  },
  {
    id: 'OSB-2026-1003',
    fullName: 'Debasish Nath',
    phoneNumber: '+91 94350 88219',
    dob: '1992-08-05',
    age: calculateAge('1992-08-05'),
    service: 'driving_license',
    subService: 'Permanent Driving License (DL)',
    status: 'Confirmed',
    priority: 'Standard',
    journeyOrTargetDate: '2026-10-10',
    sourceCity: 'Cachar RTO',
    destinationCity: 'Silchar',
    notes: 'Learner license completed 30 days. RTO driving test slot scheduled for Oct 10 morning.',
    createdAt: '2026-09-30T11:00:00Z',
    updatedAt: '2026-09-30T11:45:00Z'
  },
  {
    id: 'OSB-2026-1004',
    fullName: 'Ananya Singha',
    phoneNumber: '+91 97061 54321',
    dob: '2001-03-14',
    age: calculateAge('2001-03-14'),
    service: 'job_application',
    subService: 'Form-Filling Support (SSC, UPSC, Banking, Railway)',
    status: 'Completed',
    priority: 'Urgent',
    journeyOrTargetDate: '2026-10-05',
    sourceCity: 'Assam State Commission',
    destinationCity: 'Online Portal',
    notes: 'ADRE Grade-III form submitted. Photo and signature resized to 50KB. Challan paid.',
    createdAt: '2026-09-25T16:00:00Z',
    updatedAt: '2026-09-26T10:10:00Z'
  },
  {
    id: 'OSB-2026-1005',
    fullName: 'Vikramjit Paul',
    phoneNumber: '+91 99540 67890',
    dob: '1988-12-01',
    age: calculateAge('1988-12-01'),
    service: 'flight',
    subService: 'Domestic Air Tickets (IndiGo, Air India, SpiceJet)',
    status: 'Pending',
    priority: 'Standard',
    journeyOrTargetDate: '2026-10-18',
    sourceCity: 'Silchar (IXS)',
    destinationCity: 'Kolkata (CCU)',
    notes: 'Morning direct flight requested. Baggage 15kg plus extra cabin piece.',
    createdAt: '2026-10-01T08:20:00Z',
    updatedAt: '2026-10-01T08:20:00Z'
  },
  {
    id: 'OSB-2026-1006',
    fullName: 'Bikram Das',
    phoneNumber: '+91 88765 99123',
    dob: '1997-06-25',
    age: calculateAge('1997-06-25'),
    service: 'bus',
    subService: 'AC Sleeper & Multi-Axle Volvo',
    status: 'Confirmed',
    priority: 'Standard',
    journeyOrTargetDate: '2026-10-12',
    sourceCity: 'Silchar',
    destinationCity: 'Shillong',
    notes: 'Upper sleeper single berth requested. Night coach departing at 8:30 PM.',
    createdAt: '2026-09-30T17:40:00Z',
    updatedAt: '2026-09-30T18:00:00Z'
  }
];

export function getStoredCustomers(): CustomerRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
    if (!raw) {
      // First run: initialize with sample records and save
      saveCustomers(INITIAL_CUSTOMERS);
      return INITIAL_CUSTOMERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Re-calculate age dynamically to ensure always accurate relative to today
      return parsed.map((item: CustomerRecord) => ({
        ...item,
        age: calculateAge(item.dob)
      }));
    }
    return INITIAL_CUSTOMERS;
  } catch (err) {
    console.error('Error reading customers from localStorage:', err);
    return INITIAL_CUSTOMERS;
  }
}

export function saveCustomers(customers: CustomerRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
  } catch (err) {
    console.error('Error saving customers to localStorage:', err);
  }
}

export function getStoredBusinessConfig(): BusinessConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) {
      saveBusinessConfig(DEFAULT_BUSINESS_CONFIG);
      return DEFAULT_BUSINESS_CONFIG;
    }
    const parsed = JSON.parse(raw);
    // Automatically migrate old placeholder number if present
    if (parsed.primaryPhone === '+91 98765 43210' || parsed.primaryPhone?.includes('98765')) {
      parsed.primaryPhone = '+91 70996 26706';
      parsed.whatsappPhone = '+917099626706';
      saveBusinessConfig({ ...DEFAULT_BUSINESS_CONFIG, ...parsed });
    }
    return { ...DEFAULT_BUSINESS_CONFIG, ...parsed };
  } catch {
    return DEFAULT_BUSINESS_CONFIG;
  }
}

export function saveBusinessConfig(config: BusinessConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving business config:', err);
  }
}

export function generateBookingId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `OSB-${year}-${randomSuffix}`;
}

export function exportCustomersToCSV(customers: CustomerRecord[]): void {
  const headers = [
    'Booking ID',
    'Customer Name',
    'Phone Number',
    'Date of Birth',
    'Age',
    'Service',
    'Sub-Service',
    'Status',
    'Priority',
    'Travel/Target Date',
    'Source / Location',
    'Destination',
    'Notes',
    'Created At'
  ];

  const rows = customers.map(c => [
    `"${c.id}"`,
    `"${c.fullName.replace(/"/g, '""')}"`,
    `"${c.phoneNumber}"`,
    `"${c.dob}"`,
    c.age,
    `"${c.service}"`,
    `"${c.subService.replace(/"/g, '""')}"`,
    `"${c.status}"`,
    `"${c.priority}"`,
    `"${c.journeyOrTargetDate || ''}"`,
    `"${(c.sourceCity || '').replace(/"/g, '""')}"`,
    `"${(c.destinationCity || '').replace(/"/g, '""')}"`,
    `"${(c.notes || '').replace(/"/g, '""')}"`,
    `"${new Date(c.createdAt).toLocaleDateString()}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `omorjit_singha_customers_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCustomersToJSON(customers: CustomerRecord[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customers, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `omorjit_singha_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
