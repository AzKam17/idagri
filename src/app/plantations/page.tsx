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
import { Sprout, Plus, Edit, Trash2, MapPin, Search } from 'lucide-react';

function PlantationsPageContent() {
  const searchParams = useSearchParams();
  const plantations = useAppStore((state) => state.plantations);
  const farmers = useAppStore((state) => state.farmers);
  const deletePlantation = useAppStore((state) => state.deletePlantation);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(searchParams.get('action') === 'add');
  const [selectedPlantation, setSelectedPlantation] = useState<Plantation | null>(null);
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
    {
      header: translations.common.actions,
      cell: (plantation) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPlantation(plantation);
              setIsAddDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(plantation);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const cities = [...new Set(plantations.map(p => p.city))].sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sprout className="h-9 w-9" />
            {translations.plantations.title}
          </h1>
          <p className="text-muted-foreground">Gérer et consulter toutes les plantations</p>
        </div>
        <Button
          onClick={() => {
            setSelectedPlantation(null);
            setIsAddDialogOpen(true);
          }}
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
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
