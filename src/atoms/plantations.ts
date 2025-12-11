import { atom, selector } from 'recoil';
import { Plantation } from '@/types';

export const plantationsState = atom<Plantation[]>({
  key: 'plantationsState',
  default: [],
});

export const plantationsByCitySelector = selector({
  key: 'plantationsByCitySelector',
  get: ({ get }) => {
    const plantations = get(plantationsState);
    const cities = new Map<string, Plantation[]>();

    plantations.forEach(plantation => {
      const city = plantation.city;
      if (!cities.has(city)) {
        cities.set(city, []);
      }
      cities.get(city)?.push(plantation);
    });

    return cities;
  },
});

export const plantationsByFarmerSelector = selector({
  key: 'plantationsByFarmerSelector',
  get: ({ get }) => (farmerId: string) => {
    const plantations = get(plantationsState);
    return plantations.filter(p => p.farmerId === farmerId);
  },
});
