import { LatLngExpression } from 'leaflet';

export interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  profession: string;
  city: string;
  numberOfEmployees: number;
  createdAt: string;
  updatedAt: string;
}

export interface Plantation {
  id: string;
  farmerId: string;
  name: string;
  crops: string[];
  area: number;
  city: string;
  latitude: number;
  longitude: number;
  polygon?: LatLngExpression[];
  employeeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  city: string;
  plantationIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Planter {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  village: string;
  plantationSize: number;
  latitude: number;
  longitude: number;
  phone?: string;
  bankName?: string;
  bankAccountNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Weighing {
  id: string;
  planterId: string;
  period: string;
  weighingDate: string;
  driverName: string;
  vehicleRegistration: string;
  grossWeight: number;
  tare: number;
  netWeight: number;
  price: number;
  transportCost: number;
  taxRate: number;
  createdAt: string;
  updatedAt: string;
}

export type CreditType = 'money' | 'tools';

export interface Credit {
  id: string;
  planterId: string;
  type: CreditType;
  amount: number;
  description: string;
  date: string;
  isPaid: boolean;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'cash' | 'transfer' | 'check';

export interface Payment {
  id: string;
  planterId: string;
  weighingId: string;
  grossAmount: number;
  creditsDeducted: number;
  netAmount: number;
  method: PaymentMethod;
  checkNumber?: string;
  transferReference?: string;
  isPaid: boolean;
  paidDate?: string;
  installments?: PaymentInstallment[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInstallment {
  id: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
}

export interface MonthlyRevenue {
  month: string;
  tonnage: number;
  netPaid: number;
}

export interface RevenueStatement {
  planterId: string;
  planterCode: string;
  planterName: string;
  year: number;
  monthlyRevenues: MonthlyRevenue[];
  totalTonnage: number;
  totalRevenue: number;
  averageRevenue: number;
}

export interface TransferOrder {
  id: string;
  period: string;
  bankName: string;
  debitAccount: string;
  totalAmount: number;
  transfers: {
    accountNumber: string;
    planterCode: string;
    planterName: string;
    production: number;
    netAmount: number;
  }[];
  createdAt: string;
}

export interface PlantationWithFarmer extends Plantation {
  farmer: Farmer;
}

export interface FarmerWithPlantations extends Farmer {
  plantations: Plantation[];
}

export interface PlanterWithDetails extends Planter {
  weighings: Weighing[];
  credits: Credit[];
  payments: Payment[];
  totalProduction: number;
  totalRevenue: number;
  totalCredits: number;
  pendingCredits: number;
}

export type SortDirection = 'asc' | 'desc';

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
