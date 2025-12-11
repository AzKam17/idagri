'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store';
import { Farmer } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import { DataTable, Column } from '@/components/common/DataTable';
import { FarmerForm } from '@/components/farmers/FarmerForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Plus, Eye, Trash2, Edit, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { translations } from '@/lib/translations';

function FarmersPageContent() {
  const searchParams = useSearchParams();
  const farmers = useAppStore((state) => state.farmers);
  const plantations = useAppStore((state) => state.plantations);
  const deleteFarmer = useAppStore((state) => state.deleteFarmer);
  const updateFarmer = useAppStore((state) => state.updateFarmer);
  const addFarmer = useAppStore((state) => state.addFarmer);

  const getPlantationsByFarmer = (farmerId: string) =>
    plantations.filter((p) => p.farmerId === farmerId);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(searchParams.get('action') === 'add');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paginatedFarmers = farmers.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (farmer: Farmer) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${farmer.firstName} ${farmer.lastName} ?`)) {
      localStorageService.deleteFarmer(farmer.id);
      deleteFarmer(farmer.id);
    }
  };

  const handleViewDetails = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setViewMode('detail');
  };

  const columns: Column<Farmer>[] = [
    {
      header: translations.farmers.photo,
      icon: <User className="h-4 w-4" />,
      cell: (farmer) => (
        farmer.photo ? (
          <img src={farmer.photo} alt={farmer.firstName} className="h-12 w-12 rounded-full object-cover shadow-sm" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shadow-sm">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
        )
      ),
    },
    {
      header: 'Nom',
      icon: <User className="h-4 w-4" />,
      cell: (farmer) => `${farmer.firstName} ${farmer.lastName}`,
    },
    {
      header: translations.farmers.profession,
      accessorKey: 'profession',
    },
    {
      header: translations.farmers.city,
      accessorKey: 'city',
    },
    {
      header: 'Employés',
      cell: (farmer) => farmer.numberOfEmployees,
    },
    {
      header: translations.farmers.plantations,
      cell: (farmer) => getPlantationsByFarmer(farmer.id).length,
    },
    {
      header: translations.common.actions,
      cell: (farmer) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(farmer);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFarmer(farmer);
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
              handleDelete(farmer);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (viewMode === 'detail' && selectedFarmer) {
    const plantations = getPlantationsByFarmer(selectedFarmer.id);
    const farmerUrl = typeof window !== 'undefined' ? `${window.location.origin}/farmers/${selectedFarmer.id}` : '';

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setViewMode('list')}>
            ← {translations.common.back}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-6 w-6" />
                {translations.farmers.farmerDetails}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                {selectedFarmer.photo ? (
                  <img
                    src={selectedFarmer.photo}
                    alt={selectedFarmer.firstName}
                    className="h-28 w-28 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-full bg-muted flex items-center justify-center shadow-lg">
                    <User className="h-14 w-14 text-muted-foreground" />
                  </div>
                )}
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">
                    {selectedFarmer.firstName} {selectedFarmer.lastName}
                  </h2>
                  <p className="text-lg text-muted-foreground">{selectedFarmer.profession}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{translations.farmers.city}</p>
                  <p className="text-lg font-semibold">{selectedFarmer.city}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{translations.farmers.numberOfEmployees}</p>
                  <p className="text-lg font-semibold">{selectedFarmer.numberOfEmployees}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{translations.farmers.plantations}</p>
                  <p className="text-lg font-semibold">{plantations.length}</p>
                </div>
              </div>

              {plantations.length > 0 && (
                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-lg mb-3">{translations.farmers.plantations}</h3>
                  <ul className="space-y-3">
                    {plantations.map(p => (
                      <li key={p.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-muted-foreground">{Number(p.area).toFixed(2)} {translations.units.hectares}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                {translations.farmers.qrCode}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 py-6">
              <QRCodeSVG value={farmerUrl} size={220} level="H" />
              <p className="text-sm text-center text-muted-foreground">
                {translations.farmers.qrCodeDesc}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <User className="h-8 w-8" />
            {translations.farmers.title}
          </h1>
          <p className="text-muted-foreground">Gérer et consulter tous les agriculteurs enregistrés</p>
        </div>
        <Button onClick={() => { setSelectedFarmer(null); setIsAddDialogOpen(true); }} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          {translations.farmers.addFarmer}
        </Button>
      </div>

      <DataTable
        data={paginatedFarmers}
        columns={columns}
        pagination={{
          page,
          pageSize,
          total: farmers.length,
          onPageChange: setPage,
          onPageSizeChange: () => {},
        }}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) setSelectedFarmer(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedFarmer ? translations.farmers.editFarmer : translations.farmers.addFarmer}</DialogTitle>
          </DialogHeader>
          <FarmerForm
            farmer={selectedFarmer || undefined}
            onSuccess={() => {
              setIsAddDialogOpen(false);
              setSelectedFarmer(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function FarmersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">{translations.common.loading}</div>}>
      <FarmersPageContent />
    </Suspense>
  );
}
