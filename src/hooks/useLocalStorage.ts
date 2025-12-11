import { useEffect } from 'react';
import { useAppStore } from '@/store';



import { localStorageService } from '@/lib/localStorage';

export const useLoadFromLocalStorage = () => {
  const setFarmers = useSetRecoilState(farmersState);
  const setPlantations = useSetRecoilState(plantationsState);
  const setEmployees = useSetRecoilState(employeesState);

  useEffect(() => {
    // Load data from localStorage on mount
    const farmers = localStorageService.getFarmers();
    const plantations = localStorageService.getPlantations();
    const employees = localStorageService.getEmployees();

    setFarmers(farmers);
    setPlantations(plantations);
    setEmployees(employees);
  }, [setFarmers, setPlantations, setEmployees]);
};
