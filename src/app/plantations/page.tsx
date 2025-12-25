'use client';

import React, { useState, Suspense } from 'react';
import { useAppStore } from '@/store';
import { useSearchParams } from 'next/navigation';
import { translations } from '@/lib/translations';

import { Plantation } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import { DataTable, Column } from '@/components/common/DataTable';
import { PlantationForm } from '@/components/plantations/PlantationForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout, Plus, Edit, Trash2, MapPin, Search, User, Briefcase } from 'lucide-react';

function PlantationsPageContent() {
  const searchParams = useSearchParams();
  const plantations = useAppStore((state) => state.plantations);
  const farmers = useAppStore((state) => state.farmers);
  const deletePlantation = useAppStore((state) => state.deletePlantation);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(searchParams.get('action') === 'add');
  const [selectedPlantation, setSelectedPlantation] = useState<Plantation | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredPlantations = cityFilter
    ? plantations.filter(p => p.city.toLowerCase().includes(cityFilter.toLowerCase()))
    : plantations;

  const paginatedPlantations = filteredPlantations.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleDelete = (plantation: Plantation) => {
    if (confirm(`${translations.plantations.confirmDelete}`)) {
      localStorageService.deletePlantation(plantation.id);
      deletePlantation(plantation.id);
    }
  };

  const getFarmerName = (farmerId: string) => {
    const farmer = farmers.find(f => f.id === farmerId);
    return farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Inconnu';
  };

  const handleRowClick = (plantation: Plantation) => {
    setSelectedPlantation(plantation);
    setIsPanelOpen(true);
  };

  const columns: Column<Plantation>[] = [
    {
      header: translations.plantations.name,
      icon: <Sprout className="h-4 w-4" />,
      accessorKey: 'name',
    },
    {
      header: translations.plantations.farmer,
      cell: (plantation) => getFarmerName(plantation.farmerId),
    },
    {
      header: translations.plantations.crops,
      cell: (plantation) => plantation.crops.join(', '),
    },
    {
      header: `${translations.plantations.area} (${translations.units.hectares})`,
      accessorKey: 'area',
    },
    {
      header: translations.plantations.city,
      icon: <MapPin className="h-4 w-4" />,
      accessorKey: 'city',
    },
    {
      header: translations.plantations.location,
      cell: (plantation) => `${Number(plantation.latitude).toFixed(4)}, ${Number(plantation.longitude).toFixed(4)}`,
    },
  ];

  const cities = [...new Set(plantations.map(p => p.city))].sort();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            background: 'color-mix(in srgb, #00a540 10%, transparent)'
          }}>
            <Sprout style={{ width: '20px', height: '20px', color: '#00a540' }} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {translations.plantations.title}
            </h1>
            <p className="text-muted-foreground text-sm">Gérer et consulter toutes les plantations</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedPlantation(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {translations.plantations.addPlantation}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="cityFilter" className="flex items-center gap-2 mb-2">
            <Search className="h-4 w-4" />
            {translations.plantations.filterByCity}
          </Label>
          <Input
            id="cityFilter"
            placeholder="Entrez le nom de la ville..."
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setPage(1);
            }}
          />
        </div>
        {cityFilter && (
          <div className="flex items-end">
            <Button variant="outline" onClick={() => setCityFilter('')}>
              Effacer
            </Button>
          </div>
        )}
      </div>

      {cityFilter && (
        <p className="text-sm text-muted-foreground">
          Affichage de {filteredPlantations.length} plantation(s) correspondant à "{cityFilter}"
        </p>
      )}

      <DataTable
        data={paginatedPlantations}
        columns={columns}
        onRowClick={handleRowClick}
        pagination={{
          page,
          pageSize,
          total: filteredPlantations.length,
          onPageChange: setPage,
          onPageSizeChange: () => {},
        }}
      />

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setSelectedPlantation(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedPlantation ? translations.plantations.editPlantation : translations.plantations.addPlantation}
            </DialogTitle>
          </DialogHeader>
          <PlantationForm
            plantation={selectedPlantation || undefined}
            onSuccess={() => {
              setIsAddDialogOpen(false);
              setSelectedPlantation(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Right Panel */}
      {isPanelOpen && selectedPlantation && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-[998] fade-in-overlay"
            onClick={() => setIsPanelOpen(false)}
          />
          <div className="w-[31%] fixed bottom-0 right-0 top-0 z-[999] min-h-screen bg-white shadow-2xl slide-in-left">
            <div className="flex h-screen flex-col border-l border-neutral-200 bg-white">
              {/* Close Button */}
              <div className="absolute left-6 top-10 h-12 w-12">
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-900 cursor-pointer hover:opacity-70 transition-all duration-300"
                >
                  <svg className="h-6 w-6 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.6666 2.6835L21.3166 0.333496L11.9999 9.65016L2.68325 0.333496L0.333252 2.6835L9.64992 12.0002L0.333252 21.3168L2.68325 23.6668L11.9999 14.3502L21.3166 23.6668L23.6666 21.3168L14.3499 12.0002L23.6666 2.6835Z" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-grow overflow-y-auto pt-28 pb-8">
                {/* Plantation Name */}
                <div className="flex flex-col items-center justify-center gap-5 mb-10">
                  <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
                    <Sprout className="h-12 w-12 text-green-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-semibold leading-10 text-neutral-900">
                      {selectedPlantation.name}
                    </div>
                    <div className="text-base text-neutral-600 mt-1">{selectedPlantation.crops.join(', ')}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-6 border-t border-b border-neutral-200 px-6 py-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Agriculteur</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{getFarmerName(selectedPlantation.farmerId)}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Surface</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedPlantation.area} {translations.units.hectares}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Ville</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedPlantation.city}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Coordonnées</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">
                      {Number(selectedPlantation.latitude).toFixed(4)}, {Number(selectedPlantation.longitude).toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 mt-8 flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      setIsAddDialogOpen(true);
                      setIsPanelOpen(false);
                    }}
                    className="w-full"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm(`${translations.plantations.confirmDelete}`)) {
                        handleDelete(selectedPlantation);
                        setIsPanelOpen(false);
                      }
                    }}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function PlantationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">{translations.common.loading}</div>}>
      <PlantationsPageContent />
    </Suspense>
  );
}
