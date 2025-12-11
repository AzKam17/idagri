import { atom } from 'recoil';
import { Employee } from '@/types';

export const employeesState = atom<Employee[]>({
  key: 'employeesState',
  default: [],
});
