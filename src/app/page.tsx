'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { User, Sprout, Users, Map, ArrowRight, Plus, TrendingUp, Database, Trash2 } from 'lucide-react';
import { translations } from '@/lib/translations';
import { loadFixtures, clearAllData } from '@/lib/loadFixtures';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const farmers = useAppStore((state) => state.farmers);
  const plantations = useAppStore((state) => state.plantations);
  const employees = useAppStore((state) => state.employees);
  const weighings = useAppStore((state) => state.weighings);
  const [isLoading, setIsLoading] = useState(false);

  const totalArea = plantations.reduce((sum, p) => sum + Number(p.area), 0);

  const handleLoadFixtures = () => {
    setIsLoading(true);
    try {
      loadFixtures();
      // Reload the page to refresh all state from localStorage
      window.location.reload();
    } catch (error) {
      console.error('Error loading fixtures:', error);
      alert('Erreur lors du chargement des données de démonstration');
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      setIsLoading(true);
      try {
        clearAllData();
        window.location.reload();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Erreur lors de la suppression des données');
        setIsLoading(false);
      }
    }
  };

  const hasData = farmers.length > 0 || weighings.length > 0;

  const stats = [
    {
      title: translations.home.totalFarmers,
      value: farmers.length,
      icon: User,
      href: '/farmers',
      description: 'agriculteurs enregistrés',
      iconColor: '#00a540',
    },
    {
      title: translations.home.totalPlantations,
      value: plantations.length,
      icon: Sprout,
      href: '/plantations',
      description: 'plantations actives',
      iconColor: '#00a540',
    },
    {
      title: translations.home.totalEmployees,
      value: employees.length,
      icon: Users,
      href: '/employees',
      description: 'employés actifs',
      iconColor: '#00a540',
    },
  ];

  const features = [
    { text: translations.home.featureManageFarmersDesc },
    { text: translations.home.featureTrackPlantationsDesc },
    { text: translations.home.featureEmployeesDesc },
    { text: translations.home.featureInteractiveMapDesc },
  ];

  return (
    <div className="space-y-xl animate-fade-in">
      {/* Header Section */}
      <div className="section-header">
        <h1 className="section-title">{translations.home.title}</h1>
        <p className="section-subtitle">{translations.home.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="stat-label">{stat.title}</div>
                <Icon style={{ width: '20px', height: '20px', color: stat.iconColor }} />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-description">{stat.description}</div>
              <Link href={stat.href} style={{ textDecoration: 'none' }}>
                <div className="view-details-button" style={{ marginTop: '16px' }}>
                  <span>Voir les détails</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Quick Actions Card */}
        <div className="fluent-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                background: 'color-mix(in srgb, #00a540 10%, transparent)'
              }}>
                <Plus style={{ width: '18px', height: '18px', color: '#00a540' }} />
              </div>
              <div>
                <div className="card-title">{translations.home.quickActions}</div>
                <div className="card-description">Actions courantes pour commencer</div>
              </div>
            </div>
          </div>

          <div className="space-y-sm">
            <Link href="/farmers?action=add" style={{ textDecoration: 'none' }}>
              <div className="action-button">
                <User style={{ width: '16px', height: '16px' }} />
                <span>{translations.home.addFarmer}</span>
              </div>
            </Link>
            <Link href="/plantations?action=add" style={{ textDecoration: 'none' }}>
              <div className="action-button">
                <Sprout style={{ width: '16px', height: '16px' }} />
                <span>{translations.home.addPlantation}</span>
              </div>
            </Link>
            <Link href="/employees?action=add" style={{ textDecoration: 'none' }}>
              <div className="action-button">
                <Users style={{ width: '16px', height: '16px' }} />
                <span>{translations.home.addEmployee}</span>
              </div>
            </Link>
            <Link href="/map" style={{ textDecoration: 'none' }}>
              <div className="action-button-primary action-button">
                <Map style={{ width: '16px', height: '16px' }} />
                <span>{translations.home.viewMap}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Features Card */}
        <div className="fluent-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                background: 'color-mix(in srgb, #00a540 10%, transparent)'
              }}>
                <TrendingUp style={{ width: '18px', height: '18px', color: '#00a540' }} />
              </div>
              <div>
                <div className="card-title">{translations.home.features}</div>
                <div className="card-description">Ce que vous pouvez faire avec IdAgri</div>
              </div>
            </div>
          </div>

          <ul className="feature-list">
            {features.map((feature, index) => (
              <li key={index} className="feature-item">
                <div className="feature-icon">✓</div>
                <div className="feature-text">{feature.text}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sample Data Section */}
      <div className="fluent-card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              background: 'color-mix(in srgb, #00a540 10%, transparent)'
            }}>
              <Database style={{ width: '18px', height: '18px', color: '#00a540' }} />
            </div>
            <div>
              <div className="card-title">Données de démonstration</div>
              <div className="card-description">
                {hasData
                  ? 'Chargez des données d\'exemple ou effacez toutes les données'
                  : 'Commencez avec des données d\'exemple pour explorer l\'application'
                }
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            onClick={handleLoadFixtures}
            disabled={isLoading}
            className="bg-black text-white hover:bg-black/90"
          >
            <Database className="mr-2 h-4 w-4" />
            {isLoading ? 'Chargement...' : 'Charger les données de démonstration'}
          </Button>

          {hasData && (
            <Button
              onClick={handleClearData}
              disabled={isLoading}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Effacer toutes les données
            </Button>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Les données de démonstration incluent : planteurs, transporteurs, véhicules, pesées,
            crédits avec échéanciers, bulletins de paye validés, et paramètres de la coopérative.
          </p>
        </div>
      </div>
    </div>
  );
}
