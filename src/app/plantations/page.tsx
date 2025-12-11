'use client';

import React, { useState, Suspense } from 'react';
import { useAppStore } from '@/store';
import { useSearchParams } from 'next/navigation';


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
    if (confirm(`Are you sure you want to delete ${plantation.name}?`)) {
      localStorageService.deletePlantation(plantation.id);
      deletePlantation(plantation.id);
    }
  };

  const getFarmerName = (farmerId: string) => {
    const farmer = farmers.find(f => f.id === farmerId);
    return farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown';
  };

  const columns: Column<Plantation>[] = [
    {
      header: 'Name',
      icon: <Sprout className="h-4 w-4" />,
      accessorKey: 'name',
    },
    {
      header: 'Farmer',
      cell: (plantation) => getFarmerName(plantation.farmerId),
    },
    {
      header: 'Crops',
      cell: (plantation) => plantation.crops.join(', '),
    },
    {
      header: 'Area (ha)',
      accessorKey: 'area',
    },
    {
      header: 'City',
      icon: <MapPin className="h-4 w-4" />,
      accessorKey: 'city',
    },
    {
      header: 'Location',
      cell: (plantation) => `${plantation.latitude.toFixed(4)}, ${plantation.longitude.toFixed(4)}`,
    },
    {
      header: 'Actions',
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sprout className="h-8 w-8" />
            Plantations
          </h1>
          <p className="text-muted-foreground">Manage and view all plantations</p>
        </div>
        <Button
          onClick={() => {
            setSelectedPlantation(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Plantation
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="cityFilter" className="flex items-center gap-2 mb-2">
            <Search className="h-4 w-4" />
            Filter by City
          </Label>
          <Input
            id="cityFilter"
            placeholder="Enter city name..."
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
              Clear Filter
            </Button>
          </div>
        )}
      </div>

      {cityFilter && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredPlantations.length} plantation(s) in cities matching "{cityFilter}"
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
            <DialogTitle>
              {selectedPlantation ? 'Edit Plantation' : 'Add New Plantation'}
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
    <Suspense fallback={<div>Loading...</div>}>
      <PlantationsPageContent />
    </Suspense>
  );
}
