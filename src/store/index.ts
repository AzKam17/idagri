import { create } from 'zustand';
import { Farmer, Plantation, Employee } from '@/types';

interface AppState {
  farmers: Farmer[];
  plantations: Plantation[];
  employees: Employee[];
  setFarmers: (farmers: Farmer[]) => void;
  setPlantations: (plantations: Plantation[]) => void;
  setEmployees: (employees: Employee[]) => void;
  addFarmer: (farmer: Farmer) => void;
  updateFarmer: (id: string, farmer: Farmer) => void;
  deleteFarmer: (id: string) => void;
  addPlantation: (plantation: Plantation) => void;
  updatePlantation: (id: string, plantation: Plantation) => void;
  deletePlantation: (id: string) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Employee) => void;
  deleteEmployee: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  farmers: [],
  plantations: [],
  employees: [],

  setFarmers: (farmers) => set({ farmers }),
  setPlantations: (plantations) => set({ plantations }),
  setEmployees: (employees) => set({ employees }),

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
}));
