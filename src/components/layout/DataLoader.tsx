'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { localStorageService } from '@/lib/localStorage';

export function DataLoader({ children }: { children: React.ReactNode }) {
  const setFarmers = useAppStore((state) => state.setFarmers);
  const setPlantations = useAppStore((state) => state.setPlantations);
  const setEmployees = useAppStore((state) => state.setEmployees);

  useEffect(() => {
    const farmers = localStorageService.getFarmers();
    const plantations = localStorageService.getPlantations();
    const employees = localStorageService.getEmployees();

    setFarmers(farmers);
    setPlantations(plantations);
    setEmployees(employees);
  }, [setFarmers, setPlantations, setEmployees]);

  return <>{children}</>;
}
