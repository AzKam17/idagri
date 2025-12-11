import { Farmer, Plantation, Employee } from '@/types';

const STORAGE_KEYS = {
  FARMERS: 'idagri_farmers',
  PLANTATIONS: 'idagri_plantations',
  EMPLOYEES: 'idagri_employees',
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
};
