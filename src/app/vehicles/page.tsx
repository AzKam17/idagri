'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Vehicle } from '@/types';
import { DataTable, Column } from '@/components/common/DataTable';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Car, Plus, Edit, Trash2, Truck, User } from 'lucide-react';

const vehicleTypeLabels: Record<string, string> = {
  tricycle: 'Tricycle',
  camion: 'Camion',
  camionnette: 'Camionnette',
  pickup: 'Pickup',
  autre: 'Autre',
};

export default function VehiclesPage() {
  const vehicles = useAppStore((state) => state.vehicles);
  const transporters = useAppStore((state) => state.transporters);
  const deleteVehicle = useAppStore((state) => state.deleteVehicle);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paginatedVehicles = vehicles.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (vehicle: Vehicle) => {
    if (confirm(`Voulez-vous vraiment supprimer le véhicule "${vehicle.registration}" ?`)) {
      deleteVehicle(vehicle.id);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const getTransporterName = (transporterId: string) => {
    const transporter = transporters.find((t) => t.id === transporterId);
    return transporter?.name || 'Inconnu';
  };

  const columns: Column<Vehicle>[] = [
    {
      header: 'Immatriculation',
      icon: <Car className="h-4 w-4" />,
      accessorKey: 'registration',
    },
    {
      header: 'Type',
      icon: <Truck className="h-4 w-4" />,
      cell: (vehicle) => vehicleTypeLabels[vehicle.type] || vehicle.type,
    },
    {
      header: 'Transporteur',
      icon: <User className="h-4 w-4" />,
      cell: (vehicle) => getTransporterName(vehicle.transporterId),
    },
    {
      header: 'Chauffeur',
      icon: <User className="h-4 w-4" />,
      cell: (vehicle) => vehicle.driverName || '-',
    },
    {
      header: 'Actions',
      cell: (vehicle) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleEdit(vehicle)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDelete(vehicle)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Car className="h-6 w-6" style={{ color: 'white' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Véhicules</h1>
            <p className="text-gray-500">Gérer les véhicules</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-black text-white hover:bg-black/90">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un véhicule
        </Button>
      </div>

      <DataTable
        data={paginatedVehicles}
        columns={columns}
        pagination={{
          page,
          pageSize,
          total: vehicles.length,
          onPageChange: setPage,
          onPageSizeChange: () => {},
        }}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un véhicule</DialogTitle>
          </DialogHeader>
          <VehicleForm
            onSuccess={() => {
              setIsAddDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le véhicule</DialogTitle>
          </DialogHeader>
          <VehicleForm
            vehicle={selectedVehicle}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              setSelectedVehicle(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
