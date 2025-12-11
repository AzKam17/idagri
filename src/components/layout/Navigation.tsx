'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Sprout, Map, Users, Home } from 'lucide-react';
import { translations } from '@/lib/translations';

const navItems = [
  { href: '/', label: translations.nav.home, icon: Home },
  { href: '/farmers', label: translations.nav.farmers, icon: User },
  { href: '/plantations', label: translations.nav.plantations, icon: Sprout },
  { href: '/employees', label: translations.nav.employees, icon: Users },
  { href: '/map', label: translations.nav.map, icon: Map },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">IdAgri</span>
          </div>
          <div className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
