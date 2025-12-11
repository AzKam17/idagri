'use client';

import { useEffect } from 'react';
import { useLoadFromLocalStorage } from '@/hooks/useLocalStorage';

export function DataLoader({ children }: { children: React.ReactNode }) {
  useLoadFromLocalStorage();

  return <>{children}</>;
}
