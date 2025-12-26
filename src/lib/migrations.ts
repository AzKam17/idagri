/**
 * Data migration utilities for updating localStorage data structure
 */

import { Farmer } from '@/types';

/**
 * Migrate farmer data from old structure (with numberOfEmployees)
 * to new structure (with nationality, idCardType, idCardNumber)
 */
export function migrateFarmerData(): void {
  if (typeof window === 'undefined') return;

  try {
    const farmersData = localStorage.getItem('farmers');
    if (!farmersData) return;

    const farmers: Farmer[] = JSON.parse(farmersData);
    let needsMigration = false;

    const migratedFarmers = farmers.map((farmer: any) => {
      // Check if farmer has old structure
      if ('numberOfEmployees' in farmer && !('nationality' in farmer)) {
        needsMigration = true;
        const { numberOfEmployees, ...rest } = farmer;
        return {
          ...rest,
          nationality: 'Ivoirienne',
          idCardType: 'cni' as const,
          idCardNumber: '',
        };
      }

      // Farmer already has new structure or needs field addition
      if (!('nationality' in farmer)) {
        needsMigration = true;
        return {
          ...farmer,
          nationality: 'Ivoirienne',
          idCardType: 'cni' as const,
          idCardNumber: '',
        };
      }

      return farmer;
    });

    if (needsMigration) {
      localStorage.setItem('farmers', JSON.stringify(migratedFarmers));
      console.log('Farmer data migrated successfully');
    }
  } catch (error) {
    console.error('Error migrating farmer data:', error);
  }
}

/**
 * Run all migrations
 */
export function runMigrations(): void {
  migrateFarmerData();
}
