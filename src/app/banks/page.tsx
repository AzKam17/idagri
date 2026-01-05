'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Bank } from '@/types';
import { DataTable, Column } from '@/components/common/DataTable';
import BankForm from '@/components/banks/BankForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building, Plus, Edit, Trash2 } from 'lucide-react';

export default function BanksPage() {
  const banks = useAppStore((state) => state.banks);
  const deleteBank = useAppStore((state) => state.deleteBank);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paginatedBanks = banks.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (bank: Bank) => {
    if (confirm(`Voulez-vous vraiment supprimer la banque "${bank.name}" ?`)) {
      deleteBank(bank.id);
    }
  };

  const handleEdit = (bank: Bank) => {
    setSelectedBank(bank);
    setIsEditDialogOpen(true);
  };

  const columns: Column<Bank>[] = [
    {
      header: 'Nom de la banque',
      icon: <Building className="h-4 w-4" />,
      accessorKey: 'name',
    },
    {
      header: 'Agence',
      cell: (bank) => bank.agency || '-',
    },
    {
      header: 'Actions',
      cell: (bank) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleEdit(bank)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDelete(bank)}
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
            <Building className="h-6 w-6" style={{ color: 'white' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Banques</h1>
            <p className="text-gray-500">Gérer les banques partenaires</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-black text-white hover:bg-black/90">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une banque
        </Button>
      </div>

      <DataTable
        data={paginatedBanks}
        columns={columns}
        pagination={{
          page,
          pageSize,
          total: banks.length,
          onPageChange: setPage,
          onPageSizeChange: () => {},
        }}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une banque</DialogTitle>
          </DialogHeader>
          <BankForm
            onSuccess={() => {
              setIsAddDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la banque</DialogTitle>
          </DialogHeader>
          <BankForm
            bank={selectedBank}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              setSelectedBank(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
