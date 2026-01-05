'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Transporter } from '@/types';
import { DataTable, Column } from '@/components/common/DataTable';
import TransporterForm from '@/components/transporters/TransporterForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Truck, Plus, Edit, Trash2 } from 'lucide-react';

export default function TransportersPage() {
  const transporters = useAppStore((state) => state.transporters);
  const deleteTransporter = useAppStore((state) => state.deleteTransporter);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState<Transporter | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paginatedTransporters = transporters.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (transporter: Transporter) => {
    if (confirm(`Voulez-vous vraiment supprimer le transporteur "${transporter.name}" ?`)) {
      deleteTransporter(transporter.id);
    }
  };

  const handleEdit = (transporter: Transporter) => {
    setSelectedTransporter(transporter);
    setIsEditDialogOpen(true);
  };

  const columns: Column<Transporter>[] = [
    {
      header: 'Nom du transporteur',
      icon: <Truck className="h-4 w-4" />,
      accessorKey: 'name',
    },
    {
      header: 'Actions',
      cell: (transporter) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleEdit(transporter)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDelete(transporter)}
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
            <Truck className="h-6 w-6" style={{ color: 'white' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Transporteurs</h1>
            <p className="text-gray-500">Gérer les transporteurs</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-black text-white hover:bg-black/90">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un transporteur
        </Button>
      </div>

      <DataTable
        data={paginatedTransporters}
        columns={columns}
        pagination={{
          page,
          pageSize,
          total: transporters.length,
          onPageChange: setPage,
          onPageSizeChange: () => {},
        }}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un transporteur</DialogTitle>
          </DialogHeader>
          <TransporterForm
            onSuccess={() => {
              setIsAddDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le transporteur</DialogTitle>
          </DialogHeader>
          <TransporterForm
            transporter={selectedTransporter}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              setSelectedTransporter(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
