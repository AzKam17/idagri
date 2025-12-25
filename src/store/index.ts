import { create } from 'zustand';
import { Farmer, Plantation, Employee, Planter, Weighing, Credit, Payment, TransferOrder } from '@/types';
import { localStorageService } from '@/lib/localStorage';

interface AppState {
  farmers: Farmer[];
  plantations: Plantation[];
  employees: Employee[];
  planters: Planter[];
  weighings: Weighing[];
  credits: Credit[];
  payments: Payment[];
  transferOrders: TransferOrder[];
  isSidebarOpen: boolean;

  setFarmers: (farmers: Farmer[]) => void;
  setPlantations: (plantations: Plantation[]) => void;
  setEmployees: (employees: Employee[]) => void;
  setPlanters: (planters: Planter[]) => void;
  setWeighings: (weighings: Weighing[]) => void;
  setCredits: (credits: Credit[]) => void;
  setPayments: (payments: Payment[]) => void;
  setTransferOrders: (transferOrders: TransferOrder[]) => void;
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

  addPlanter: (planter: Planter) => void;
  updatePlanter: (id: string, planter: Planter) => void;
  deletePlanter: (id: string) => void;

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
}

export const useAppStore = create<AppState>((set) => ({
  farmers: [],
  plantations: [],
  employees: [],
  planters: [],
  weighings: [],
  credits: [],
  payments: [],
  transferOrders: [],
  isSidebarOpen: true,

  setFarmers: (farmers) => set({ farmers }),
  setPlantations: (plantations) => set({ plantations }),
  setEmployees: (employees) => set({ employees }),
  setPlanters: (planters) => set({ planters }),
  setWeighings: (weighings) => set({ weighings }),
  setCredits: (credits) => set({ credits }),
  setPayments: (payments) => set({ payments }),
  setTransferOrders: (transferOrders) => set({ transferOrders }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  addFarmer: (farmer) => set((state) => ({ farmers: [...state.farmers, farmer] })),
  updateFarmer: (id, farmer) => set((state) => ({
    farmers: state.farmers.map((f) => (f.id === id ? farmer : f)),
  })),
  deleteFarmer: (id) => set((state) => ({
    farmers: state.farmers.filter((f) => f.id !== id),
  })),

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

  addPlanter: (planter) => set((state) => {
    const planters = [...state.planters, planter];
    localStorageService.savePlanters(planters);
    return { planters };
  }),
  updatePlanter: (id, planter) => set((state) => {
    const planters = state.planters.map((p) => (p.id === id ? planter : p));
    localStorageService.savePlanters(planters);
    return { planters };
  }),
  deletePlanter: (id) => set((state) => {
    const planters = state.planters.filter((p) => p.id !== id);
    localStorageService.savePlanters(planters);
    return { planters };
  }),

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
}));
