'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { localStorageService } from '@/lib/localStorage';
import { runMigrations } from '@/lib/migrations';

export function DataLoader({ children }: { children: React.ReactNode }) {
  const setFarmers = useAppStore((state) => state.setFarmers);
  const setPlantations = useAppStore((state) => state.setPlantations);
  const setEmployees = useAppStore((state) => state.setEmployees);
  const setWeighings = useAppStore((state) => state.setWeighings);
  const setCredits = useAppStore((state) => state.setCredits);
  const setPayments = useAppStore((state) => state.setPayments);
  const setTransferOrders = useAppStore((state) => state.setTransferOrders);
  const setTransporters = useAppStore((state) => state.setTransporters);
  const setVehicles = useAppStore((state) => state.setVehicles);
  const setBanks = useAppStore((state) => state.setBanks);
  const setBulletins = useAppStore((state) => state.setBulletins);
  const setCompanySettings = useAppStore((state) => state.setCompanySettings);
  const setMandataries = useAppStore((state) => state.setMandataries);

  useEffect(() => {
    // Run data migrations first
    runMigrations();
    const farmers = localStorageService.getFarmers();
    const plantations = localStorageService.getPlantations();
    const employees = localStorageService.getEmployees();
    const weighings = localStorageService.getWeighings();
    const credits = localStorageService.getCredits();
    const payments = localStorageService.getPayments();
    const transferOrders = localStorageService.getTransferOrders();
    const transporters = localStorageService.getTransporters();
    const vehicles = localStorageService.getVehicles();
    const banks = localStorageService.getBanks();
    const bulletins = localStorageService.getBulletins();
    const companySettings = localStorageService.getCompanySettings();
    const mandataries = localStorageService.getMandataries();

    setFarmers(farmers);
    setPlantations(plantations);
    setEmployees(employees);
    setWeighings(weighings);
    setCredits(credits);
    setPayments(payments);
    setTransferOrders(transferOrders);
    setTransporters(transporters);
    setVehicles(vehicles);
    setBanks(banks);
    setBulletins(bulletins);
    setCompanySettings(companySettings);
    setMandataries(mandataries);
  }, [setFarmers, setPlantations, setEmployees, setWeighings, setCredits, setPayments, setTransferOrders, setTransporters, setVehicles, setBanks, setBulletins, setCompanySettings, setMandataries]);

  return <>{children}</>;
}
