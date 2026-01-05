'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Sprout, Map, Users, Home, UserCheck, Scale, CreditCard, Menu, X, ChevronRight, Truck, Car, Building, FileText, BarChart3, Settings } from 'lucide-react';
import { translations } from '@/lib/translations';
import { useAppStore } from '@/store';
import './Navigation.css';

const navItems = [
  { href: '/', label: translations.nav.home, icon: Home },
  { href: '/farmers', label: 'Agriculteurs', icon: User },
  { href: '/plantations', label: translations.nav.plantations, icon: Sprout },
  { href: '/employees', label: translations.nav.employees, icon: Users },
  { href: '/transporters', label: 'Transporteurs', icon: Truck },
  { href: '/vehicles', label: 'Véhicules', icon: Car },
  { href: '/weighings', label: 'Pesées', icon: Scale },
  { href: '/credits', label: 'Créances', icon: CreditCard },
  { href: '/banks', label: 'Banques', icon: Building },
  { href: '/bulletins', label: 'Bulletins', icon: FileText },
  { href: '/reports', label: 'Rapports', icon: BarChart3 },
  { href: '/settings', label: 'Paramètres', icon: Settings },
  { href: '/map', label: translations.nav.map, icon: Map },
];

export function Navigation() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 lg:hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-green-600" />
            <span className="text-lg font-bold">IdAgri</span>
          </div>
          <div className="w-9" />
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white transition-transform duration-300 z-40 flex flex-col w-64 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.08)' }}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center gap-2 px-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Sprout className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold text-gray-900">IdAgri</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="main-list">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <div key={item.href} className="main-item">
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <span className="nav-icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="nav-label">{item.label}</span>
                    {isActive && (
                      <span className="nav-indicator"></span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Toggle Button (Desktop) */}
        <div className="hidden lg:block p-3" style={{ boxShadow: '0 -1px 3px rgba(0,0,0,0.08)' }}>
          <button
            onClick={toggleSidebar}
            className="collapse-btn"
          >
            <Menu className="h-4 w-4" />
            <span>Réduire</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
