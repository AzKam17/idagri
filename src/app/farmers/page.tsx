'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store';
import { Farmer } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import { DataTable, Column } from '@/components/common/DataTable';
import { FarmerForm } from '@/components/farmers/FarmerForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Plus, Eye, Trash2, Edit, QrCode, MapPin, Briefcase, Users, Sprout, CreditCard, Globe } from 'lucide-react';
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
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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
    setIsPanelOpen(true);
  };

  const handleRowClick = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setIsPanelOpen(true);
  };

  const columns: Column<Farmer>[] = [
    {
      header: 'Avatar',
      icon: <User className="h-4 w-4" />,
      cell: (farmer) => (
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shadow-sm">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
      ),
    },
    {
      header: 'Code',
      cell: (farmer) => farmer.code,
    },
    {
      header: 'Nom',
      icon: <User className="h-4 w-4" />,
      cell: (farmer) => `${farmer.firstName} ${farmer.lastName}`,
    },
    {
      header: 'Village',
      accessorKey: 'village',
    },
    {
      header: 'Superficie (ha)',
      cell: (farmer) => farmer.plantationSize != null ? farmer.plantationSize.toFixed(2) : '–',
    },
    {
      header: 'Nationalité',
      cell: (farmer) => farmer.village,
    },
    {
      header: translations.farmers.plantations,
      cell: (farmer) => getPlantationsByFarmer(farmer.id).length,
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
                <div className="h-28 w-28 rounded-full bg-muted flex items-center justify-center shadow-lg">
                  <User className="h-14 w-14 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">
                    {selectedFarmer.firstName} {selectedFarmer.lastName}
                  </h2>
                  <p className="text-lg text-muted-foreground">{selectedFarmer.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{translations.farmers.city}</p>
                  <p className="text-lg font-semibold">{selectedFarmer.village}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Nationalité</p>
                  <p className="text-lg font-semibold">{selectedFarmer.village}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pièce d'Identité</p>
                  <p className="text-lg font-semibold">{selectedFarmer.idCardNumber}</p>
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
            <User style={{ width: '20px', height: '20px', color: '#00a540' }} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {translations.farmers.title}
            </h1>
            <p className="text-muted-foreground text-sm">Gérer et consulter tous les agriculteurs enregistrés</p>
          </div>
        </div>
        <Button onClick={() => { setSelectedFarmer(null); setIsAddDialogOpen(true); }}>
          <Plus className="h-4 w-4" />
          {translations.farmers.addFarmer}
        </Button>
      </div>

      <DataTable
        data={paginatedFarmers}
        columns={columns}
        onRowClick={handleRowClick}
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
          <FarmerForm
            farmer={selectedFarmer || undefined}
            onSuccess={() => {
              setIsAddDialogOpen(false);
              setSelectedFarmer(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Right Panel */}
      {isPanelOpen && selectedFarmer && (
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
                {/* Farmer Photo and Name */}
                <div className="flex flex-col items-center justify-center gap-5 mb-10">
                  <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center shadow-lg">
                    <User className="h-12 w-12 text-neutral-400" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-semibold leading-10 text-neutral-900">
                      {selectedFarmer.firstName} {selectedFarmer.lastName}
                    </div>
                    <div className="text-base text-neutral-600 mt-1">{selectedFarmer.code}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-6 border-t border-b border-neutral-200 px-6 py-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Ville</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedFarmer.village}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Nationalité</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedFarmer.village}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Pièce d'Identité</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedFarmer.idCardNumber}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sprout className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Plantations</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{getPlantationsByFarmer(selectedFarmer.id).length}</div>
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
                      if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFarmer.firstName} ${selectedFarmer.lastName} ?`)) {
                        handleDelete(selectedFarmer);
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

export default function FarmersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">{translations.common.loading}</div>}>
      <FarmersPageContent />
    </Suspense>
  );
}
