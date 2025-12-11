import { atom, selector } from 'recoil';
import { Farmer } from '@/types';

export const farmersState = atom<Farmer[]>({
  key: 'farmersState',
  default: [],
});

export const farmerByIdSelector = selector({
  key: 'farmerByIdSelector',
  get: ({ get }) => (id: string) => {
    const farmers = get(farmersState);
    return farmers.find(farmer => farmer.id === id);
  },
});
