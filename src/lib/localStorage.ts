import { Farmer, Plantation, Employee, Weighing, Credit, Payment, TransferOrder, Transporter, Vehicle, Bank, Bulletin, CompanySettings, Mandatary } from '@/types';

const STORAGE_KEYS = {
  FARMERS: 'idagri_farmers',
  PLANTATIONS: 'idagri_plantations',
  EMPLOYEES: 'idagri_employees',
  WEIGHINGS: 'idagri_weighings',
  CREDITS: 'idagri_credits',
  PAYMENTS: 'idagri_payments',
  TRANSFER_ORDERS: 'idagri_transfer_orders',
  TRANSPORTERS: 'idagri_transporters',
  VEHICLES: 'idagri_vehicles',
  BANKS: 'idagri_banks',
  BULLETINS: 'idagri_bulletins',
  COMPANY_SETTINGS: 'idagri_company_settings',
  MANDATARIES: 'idagri_mandataries',
};

export const localStorageService = {
  // Farmers
  getFarmers: (): Farmer[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.FARMERS);
    return data ? JSON.parse(data) : [];
  },

  saveFarmers: (farmers: Farmer[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
  },

  addFarmer: (farmer: Farmer): void => {
    const farmers = localStorageService.getFarmers();
    farmers.push(farmer);
    localStorageService.saveFarmers(farmers);
  },

  updateFarmer: (id: string, updatedFarmer: Farmer): void => {
    const farmers = localStorageService.getFarmers();
    const index = farmers.findIndex(f => f.id === id);
    if (index !== -1) {
      farmers[index] = updatedFarmer;
      localStorageService.saveFarmers(farmers);
    }
  },

  deleteFarmer: (id: string): void => {
    const farmers = localStorageService.getFarmers();
    const filtered = farmers.filter(f => f.id !== id);
    localStorageService.saveFarmers(filtered);
  },

  // Plantations
  getPlantations: (): Plantation[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PLANTATIONS);
    return data ? JSON.parse(data) : [];
  },

  savePlantations: (plantations: Plantation[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PLANTATIONS, JSON.stringify(plantations));
  },

  addPlantation: (plantation: Plantation): void => {
    const plantations = localStorageService.getPlantations();
    plantations.push(plantation);
    localStorageService.savePlantations(plantations);
  },

  updatePlantation: (id: string, updatedPlantation: Plantation): void => {
    const plantations = localStorageService.getPlantations();
    const index = plantations.findIndex(p => p.id === id);
    if (index !== -1) {
      plantations[index] = updatedPlantation;
      localStorageService.savePlantations(plantations);
    }
  },

  deletePlantation: (id: string): void => {
    const plantations = localStorageService.getPlantations();
    const filtered = plantations.filter(p => p.id !== id);
    localStorageService.savePlantations(filtered);
  },

  // Employees
  getEmployees: (): Employee[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  },

  saveEmployees: (employees: Employee[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  addEmployee: (employee: Employee): void => {
    const employees = localStorageService.getEmployees();
    employees.push(employee);
    localStorageService.saveEmployees(employees);
  },

  updateEmployee: (id: string, updatedEmployee: Employee): void => {
    const employees = localStorageService.getEmployees();
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
      employees[index] = updatedEmployee;
      localStorageService.saveEmployees(employees);
    }
  },

  deleteEmployee: (id: string): void => {
    const employees = localStorageService.getEmployees();
    const filtered = employees.filter(e => e.id !== id);
    localStorageService.saveEmployees(filtered);
  },

  // Weighings
  getWeighings: (): Weighing[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.WEIGHINGS);
    return data ? JSON.parse(data) : [];
  },

  saveWeighings: (weighings: Weighing[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.WEIGHINGS, JSON.stringify(weighings));
  },

  // Credits
  getCredits: (): Credit[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CREDITS);
    return data ? JSON.parse(data) : [];
  },

  saveCredits: (credits: Credit[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(credits));
  },

  // Payments
  getPayments: (): Payment[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data) : [];
  },

  savePayments: (payments: Payment[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  // Transfer Orders
  getTransferOrders: (): TransferOrder[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.TRANSFER_ORDERS);
    return data ? JSON.parse(data) : [];
  },

  saveTransferOrders: (transferOrders: TransferOrder[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TRANSFER_ORDERS, JSON.stringify(transferOrders));
  },

  // Transporters
  getTransporters: (): Transporter[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.TRANSPORTERS);
    return data ? JSON.parse(data) : [];
  },

  saveTransporters: (transporters: Transporter[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TRANSPORTERS, JSON.stringify(transporters));
  },

  // Vehicles
  getVehicles: (): Vehicle[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return data ? JSON.parse(data) : [];
  },

  saveVehicles: (vehicles: Vehicle[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  },

  // Banks
  getBanks: (): Bank[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.BANKS);
    return data ? JSON.parse(data) : [];
  },

  saveBanks: (banks: Bank[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.BANKS, JSON.stringify(banks));
  },

  // Bulletins
  getBulletins: (): Bulletin[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.BULLETINS);
    return data ? JSON.parse(data) : [];
  },

  saveBulletins: (bulletins: Bulletin[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.BULLETINS, JSON.stringify(bulletins));
  },

  // Company Settings
  getCompanySettings: (): CompanySettings | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.COMPANY_SETTINGS);
    return data ? JSON.parse(data) : null;
  },

  saveCompanySettings: (settings: CompanySettings | null): void => {
    if (typeof window === 'undefined') return;
    if (settings === null) {
      localStorage.removeItem(STORAGE_KEYS.COMPANY_SETTINGS);
    } else {
      localStorage.setItem(STORAGE_KEYS.COMPANY_SETTINGS, JSON.stringify(settings));
    }
  },

  // Mandataries
  getMandataries: (): Mandatary[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.MANDATARIES);
    return data ? JSON.parse(data) : [];
  },

  saveMandataries: (mandataries: Mandatary[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.MANDATARIES, JSON.stringify(mandataries));
  },
};
