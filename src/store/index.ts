import { create } from 'zustand';
import { Farmer, Plantation, Employee, Weighing, Credit, Payment, TransferOrder, Transporter, Vehicle, Bank, Bulletin, CompanySettings, Mandatary } from '@/types';
import { localStorageService } from '@/lib/localStorage';

interface AppState {
  farmers: Farmer[];
  plantations: Plantation[];
  employees: Employee[];
  weighings: Weighing[];
  credits: Credit[];
  payments: Payment[];
  transferOrders: TransferOrder[];
  transporters: Transporter[];
  vehicles: Vehicle[];
  banks: Bank[];
  bulletins: Bulletin[];
  companySettings: CompanySettings | null;
  mandataries: Mandatary[];
  isSidebarOpen: boolean;

  setFarmers: (farmers: Farmer[]) => void;
  setPlantations: (plantations: Plantation[]) => void;
  setEmployees: (employees: Employee[]) => void;
  setWeighings: (weighings: Weighing[]) => void;
  setCredits: (credits: Credit[]) => void;
  setPayments: (payments: Payment[]) => void;
  setTransferOrders: (transferOrders: TransferOrder[]) => void;
  setTransporters: (transporters: Transporter[]) => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  setBanks: (banks: Bank[]) => void;
  setBulletins: (bulletins: Bulletin[]) => void;
  setCompanySettings: (settings: CompanySettings | null) => void;
  setMandataries: (mandataries: Mandatary[]) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  addFarmer: (farmer: Farmer) => void;
  updateFarmer: (id: string, farmer: Farmer) => void;
  deleteFarmer: (id: string) => void;

  addPlantation: (plantation: Plantation) => void;
  updatePlantation: (id: string, plantation: Plantation) => void;
  deletePlantation: (id: string) => void;

  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Employee) => void;
  deleteEmployee: (id: string) => void;

  addWeighing: (weighing: Weighing) => void;
  updateWeighing: (id: string, weighing: Weighing) => void;
  deleteWeighing: (id: string) => void;

  addCredit: (credit: Credit) => void;
  updateCredit: (id: string, credit: Credit) => void;
  deleteCredit: (id: string) => void;

  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Payment) => void;
  deletePayment: (id: string) => void;

  addTransferOrder: (transferOrder: TransferOrder) => void;

  addTransporter: (transporter: Transporter) => void;
  updateTransporter: (id: string, transporter: Transporter) => void;
  deleteTransporter: (id: string) => void;

  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;

  addBank: (bank: Bank) => void;
  updateBank: (id: string, bank: Bank) => void;
  deleteBank: (id: string) => void;

  addBulletin: (bulletin: Bulletin) => void;
  updateBulletin: (id: string, bulletin: Bulletin) => void;
  deleteBulletin: (id: string) => void;

  updateCompanySettings: (settings: CompanySettings) => void;

  addMandatary: (mandatary: Mandatary) => void;
  updateMandatary: (id: string, mandatary: Mandatary) => void;
  deleteMandatary: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  farmers: [],
  plantations: [],
  employees: [],
  weighings: [],
  credits: [],
  payments: [],
  transferOrders: [],
  transporters: [],
  vehicles: [],
  banks: [],
  bulletins: [],
  companySettings: null,
  mandataries: [],
  isSidebarOpen: true,

  setFarmers: (farmers) => set({ farmers }),
  setPlantations: (plantations) => set({ plantations }),
  setEmployees: (employees) => set({ employees }),
  setWeighings: (weighings) => set({ weighings }),
  setCredits: (credits) => set({ credits }),
  setPayments: (payments) => set({ payments }),
  setTransferOrders: (transferOrders) => set({ transferOrders }),
  setTransporters: (transporters) => set({ transporters }),
  setVehicles: (vehicles) => set({ vehicles }),
  setBanks: (banks) => set({ banks }),
  setBulletins: (bulletins) => set({ bulletins }),
  setCompanySettings: (settings) => set({ companySettings: settings }),
  setMandataries: (mandataries) => set({ mandataries }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  addFarmer: (farmer) => set((state) => {
    const farmers = [...state.farmers, farmer];
    localStorageService.saveFarmers(farmers);
    return { farmers };
  }),
  updateFarmer: (id, farmer) => set((state) => {
    const farmers = state.farmers.map((f) => (f.id === id ? farmer : f));
    localStorageService.saveFarmers(farmers);
    return { farmers };
  }),
  deleteFarmer: (id) => set((state) => {
    const farmers = state.farmers.filter((f) => f.id !== id);
    localStorageService.saveFarmers(farmers);
    return { farmers };
  }),

  addPlantation: (plantation) => set((state) => ({
    plantations: [...state.plantations, plantation],
  })),
  updatePlantation: (id, plantation) => set((state) => ({
    plantations: state.plantations.map((p) => (p.id === id ? plantation : p)),
  })),
  deletePlantation: (id) => set((state) => ({
    plantations: state.plantations.filter((p) => p.id !== id),
  })),

  addEmployee: (employee) => set((state) => ({
    employees: [...state.employees, employee],
  })),
  updateEmployee: (id, employee) => set((state) => ({
    employees: state.employees.map((e) => (e.id === id ? employee : e)),
  })),
  deleteEmployee: (id) => set((state) => ({
    employees: state.employees.filter((e) => e.id !== id),
  })),

  addWeighing: (weighing) => set((state) => {
    const weighings = [...state.weighings, weighing];
    localStorageService.saveWeighings(weighings);
    return { weighings };
  }),
  updateWeighing: (id, weighing) => set((state) => {
    const weighings = state.weighings.map((w) => (w.id === id ? weighing : w));
    localStorageService.saveWeighings(weighings);
    return { weighings };
  }),
  deleteWeighing: (id) => set((state) => {
    const weighings = state.weighings.filter((w) => w.id !== id);
    localStorageService.saveWeighings(weighings);
    return { weighings };
  }),

  addCredit: (credit) => set((state) => {
    const credits = [...state.credits, credit];
    localStorageService.saveCredits(credits);
    return { credits };
  }),
  updateCredit: (id, credit) => set((state) => {
    const credits = state.credits.map((c) => (c.id === id ? credit : c));
    localStorageService.saveCredits(credits);
    return { credits };
  }),
  deleteCredit: (id) => set((state) => {
    const credits = state.credits.filter((c) => c.id !== id);
    localStorageService.saveCredits(credits);
    return { credits };
  }),

  addPayment: (payment) => set((state) => {
    const payments = [...state.payments, payment];
    localStorageService.savePayments(payments);
    return { payments };
  }),
  updatePayment: (id, payment) => set((state) => {
    const payments = state.payments.map((p) => (p.id === id ? payment : p));
    localStorageService.savePayments(payments);
    return { payments };
  }),
  deletePayment: (id) => set((state) => {
    const payments = state.payments.filter((p) => p.id !== id);
    localStorageService.savePayments(payments);
    return { payments };
  }),

  addTransferOrder: (transferOrder) => set((state) => {
    const transferOrders = [...state.transferOrders, transferOrder];
    localStorageService.saveTransferOrders(transferOrders);
    return { transferOrders };
  }),

  addTransporter: (transporter) => set((state) => {
    const transporters = [...state.transporters, transporter];
    localStorageService.saveTransporters(transporters);
    return { transporters };
  }),
  updateTransporter: (id, transporter) => set((state) => {
    const transporters = state.transporters.map((t) => (t.id === id ? transporter : t));
    localStorageService.saveTransporters(transporters);
    return { transporters };
  }),
  deleteTransporter: (id) => set((state) => {
    const transporters = state.transporters.filter((t) => t.id !== id);
    localStorageService.saveTransporters(transporters);
    return { transporters };
  }),

  addVehicle: (vehicle) => set((state) => {
    const vehicles = [...state.vehicles, vehicle];
    localStorageService.saveVehicles(vehicles);
    return { vehicles };
  }),
  updateVehicle: (id, vehicle) => set((state) => {
    const vehicles = state.vehicles.map((v) => (v.id === id ? vehicle : v));
    localStorageService.saveVehicles(vehicles);
    return { vehicles };
  }),
  deleteVehicle: (id) => set((state) => {
    const vehicles = state.vehicles.filter((v) => v.id !== id);
    localStorageService.saveVehicles(vehicles);
    return { vehicles };
  }),

  addBank: (bank) => set((state) => {
    const banks = [...state.banks, bank];
    localStorageService.saveBanks(banks);
    return { banks };
  }),
  updateBank: (id, bank) => set((state) => {
    const banks = state.banks.map((b) => (b.id === id ? bank : b));
    localStorageService.saveBanks(banks);
    return { banks };
  }),
  deleteBank: (id) => set((state) => {
    const banks = state.banks.filter((b) => b.id !== id);
    localStorageService.saveBanks(banks);
    return { banks };
  }),

  addBulletin: (bulletin) => set((state) => {
    const bulletins = [...state.bulletins, bulletin];
    localStorageService.saveBulletins(bulletins);
    return { bulletins };
  }),
  updateBulletin: (id, bulletin) => set((state) => {
    const bulletins = state.bulletins.map((b) => (b.id === id ? bulletin : b));
    localStorageService.saveBulletins(bulletins);
    return { bulletins };
  }),
  deleteBulletin: (id) => set((state) => {
    const bulletins = state.bulletins.filter((b) => b.id !== id);
    localStorageService.saveBulletins(bulletins);
    return { bulletins };
  }),

  updateCompanySettings: (settings) => set(() => {
    localStorageService.saveCompanySettings(settings);
    return { companySettings: settings };
  }),

  addMandatary: (mandatary) => set((state) => {
    const mandataries = [...state.mandataries, mandatary];
    localStorageService.saveMandataries(mandataries);
    return { mandataries };
  }),
  updateMandatary: (id, mandatary) => set((state) => {
    const mandataries = state.mandataries.map((m) => (m.id === id ? mandatary : m));
    localStorageService.saveMandataries(mandataries);
    return { mandataries };
  }),
  deleteMandatary: (id) => set((state) => {
    const mandataries = state.mandataries.filter((m) => m.id !== id);
    localStorageService.saveMandataries(mandataries);
    return { mandataries };
  }),
}));
