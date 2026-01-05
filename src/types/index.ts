import { LatLngExpression } from 'leaflet';

export interface Farmer {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  village: string;
  plantationSize: number;
  latitude: number;
  longitude: number;
  phone?: string;
  idCardType?: 'cni' | 'passport' | 'residence_permit';
  idCardNumber?: string;
  bankName?: string;
  bankAgency?: string;
  bankAccountNumber?: string;
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

export interface Transporter {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type VehicleType = 'tricycle' | 'camion' | 'camionnette' | 'pickup' | 'autre';

export interface Vehicle {
  id: string;
  registration: string;
  type: VehicleType;
  transporterId: string;
  driverName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Weighing {
  id: string;
  farmerId: string;
  period: string;
  weighingDate: string;
  transporterId?: string;
  vehicleId?: string;
  driverName: string;
  vehicleRegistration: string;
  loadedWeight: number;
  emptyWeight: number;
  netWeight: number;
  price: number;
  transportCost: number;
  taxRate: number;
  createdAt: string;
  updatedAt: string;
}

export type CreditType = 'money' | 'tools';

export interface CreditInstallment {
  id: string;
  creditId: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
  paymentId?: string;
}

export interface Credit {
  id: string;
  farmerId: string;
  type: CreditType;
  amount: number;
  description: string;
  date: string;
  installmentsCount?: number;
  deductionStartDate?: string;
  installments?: CreditInstallment[];
  isPaid: boolean;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'cash' | 'transfer' | 'check';

export interface Payment {
  id: string;
  farmerId: string;
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
  farmerId: string;
  farmerCode: string;
  farmerName: string;
  year: number;
  monthlyRevenues: MonthlyRevenue[];
  totalTonnage: number;
  totalRevenue: number;
  averageRevenue: number;
}

export interface Bank {
  id: string;
  name: string;
  agency?: string;
  createdAt: string;
  updatedAt: string;
}

export type BulletinStatus = 'draft' | 'validated' | 'cancelled';

export interface BulletinDeduction {
  creditId: string;
  creditType: CreditType;
  description: string;
  amount: number;
}

export interface Bulletin {
  id: string;
  farmerId: string;
  period: string;
  weighingIds: string[];
  grossAmount: number;
  deductions: BulletinDeduction[];
  totalDeductions: number;
  netAmount: number;
  status: BulletinStatus;
  generatedDate: string;
  validatedDate?: string;
  cancelledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferOrder {
  id: string;
  period: string;
  bankId: string;
  bankName: string;
  debitAccount?: string;
  totalAmount: number;
  bulletinIds: string[];
  transfers: {
    accountNumber: string;
    farmerCode: string;
    farmerName: string;
    production: number;
    netAmount: number;
  }[];
  createdAt: string;
}

export interface CompanySettings {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  registrationNumber?: string;
  logoBase64?: string;
  customMessage?: string;
  bonusEnabled: boolean;
  bonusMinDeliveries: number;
  bonusAmountPerKg: number;
  bonusPeriodMonths: number;
  createdAt: string;
  updatedAt: string;
}

export interface Mandatary {
  id: string;
  name: string;
  title: string;
  createdAt: string;
  updatedAt: string;
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
