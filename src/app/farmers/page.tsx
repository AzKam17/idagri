'use client';

import React, { useState, Suspense } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useRouter, useSearchParams } from 'next/navigation';
import { farmersState } from '@/atoms/farmers';
import { plantationsByFarmerSelector } from '@/atoms/plantations';
import { Farmer } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import { DataTable, Column } from '@/components/common/DataTable';
import { FarmerForm } from '@/components/farmers/FarmerForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Plus, Eye, Trash2, Edit, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function FarmersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const farmers = useRecoilValue(farmersState);
  const setFarmers = useSetRecoilState(farmersState);
  const getPlantationsByFarmer = useRecoilValue(plantationsByFarmerSelector);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(searchParams.get('action') === 'add');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paginatedFarmers = farmers.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (farmer: Farmer) => {
    if (confirm(`Are you sure you want to delete ${farmer.firstName} ${farmer.lastName}?`)) {
      localStorageService.deleteFarmer(farmer.id);
      setFarmers(prev => prev.filter(f => f.id !== farmer.id));
    }
  };

  const handleViewDetails = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setViewMode('detail');
  };

  const columns: Column<Farmer>[] = [
    {
      header: 'Photo',
      icon: <User className="h-4 w-4" />,
      cell: (farmer) => (
        farmer.photo ? (
          <img src={farmer.photo} alt={farmer.firstName} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
        )
      ),
    },
    {
      header: 'Name',
      icon: <User className="h-4 w-4" />,
      cell: (farmer) => `${farmer.firstName} ${farmer.lastName}`,
    },
    {
      header: 'Profession',
      accessorKey: 'profession',
    },
    {
      header: 'City',
      accessorKey: 'city',
    },
    {
      header: 'Employees',
      cell: (farmer) => farmer.numberOfEmployees,
    },
    {
      header: 'Plantations',
      cell: (farmer) => getPlantationsByFarmer(farmer.id).length,
    },
    {
      header: 'Actions',
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
            ← Back to List
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Farmer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                {selectedFarmer.photo ? (
                  <img
                    src={selectedFarmer.photo}
                    alt={selectedFarmer.firstName}
                    className="h-24 w-24 rounded-full object-cover border-2"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">
                    {selectedFarmer.firstName} {selectedFarmer.lastName}
                  </h2>
                  <p className="text-muted-foreground">{selectedFarmer.profession}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{selectedFarmer.city}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Employees</p>
                  <p className="font-medium">{selectedFarmer.numberOfEmployees}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plantations</p>
                  <p className="font-medium">{plantations.length}</p>
                </div>
              </div>

              {plantations.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Plantations</h3>
                  <ul className="space-y-2">
                    {plantations.map(p => (
                      <li key={p.id} className="flex justify-between text-sm">
                        <span>{p.name}</span>
                        <span className="text-muted-foreground">{p.area} ha</span>
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
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <QRCodeSVG value={farmerUrl} size={200} level="H" />
              <p className="text-xs text-center text-muted-foreground">
                Scan to view farmer profile
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <User className="h-8 w-8" />
            Farmers
          </h1>
          <p className="text-muted-foreground">Manage and view all registered farmers</p>
        </div>
        <Button onClick={() => { setSelectedFarmer(null); setIsAddDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Farmer
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
            <DialogTitle>{selectedFarmer ? 'Edit Farmer' : 'Add New Farmer'}</DialogTitle>
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
    <Suspense fallback={<div>Loading...</div>}>
      <FarmersPageContent />
    </Suspense>
  );
}
