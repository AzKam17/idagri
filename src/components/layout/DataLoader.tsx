'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { localStorageService } from '@/lib/localStorage';

export function DataLoader({ children }: { children: React.ReactNode }) {
  const setFarmers = useAppStore((state) => state.setFarmers);
  const setPlantations = useAppStore((state) => state.setPlantations);
  const setEmployees = useAppStore((state) => state.setEmployees);
  const setPlanters = useAppStore((state) => state.setPlanters);
  const setWeighings = useAppStore((state) => state.setWeighings);
  const setCredits = useAppStore((state) => state.setCredits);
  const setPayments = useAppStore((state) => state.setPayments);
  const setTransferOrders = useAppStore((state) => state.setTransferOrders);

  useEffect(() => {
    const farmers = localStorageService.getFarmers();
    const plantations = localStorageService.getPlantations();
    const employees = localStorageService.getEmployees();
    const planters = localStorageService.getPlanters();
    const weighings = localStorageService.getWeighings();
    const credits = localStorageService.getCredits();
    const payments = localStorageService.getPayments();
    const transferOrders = localStorageService.getTransferOrders();

    setFarmers(farmers);
    setPlantations(plantations);
    setEmployees(employees);
    setPlanters(planters);
    setWeighings(weighings);
    setCredits(credits);
    setPayments(payments);
    setTransferOrders(transferOrders);
  }, [setFarmers, setPlantations, setEmployees, setPlanters, setWeighings, setCredits, setPayments, setTransferOrders]);

  return <>{children}</>;
}
