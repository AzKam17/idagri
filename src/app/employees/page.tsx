'use client';

import React, { useState, Suspense } from 'react';
import { useAppStore } from '@/store';
import { useSearchParams } from 'next/navigation';
import { translations } from '@/lib/translations';

import { Employee } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import { DataTable, Column } from '@/components/common/DataTable';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Plus, Edit, Trash2, MapPin, Briefcase } from 'lucide-react';

function EmployeesPageContent() {
  const searchParams = useSearchParams();
  const employees = useAppStore((state) => state.employees);
  const plantations = useAppStore((state) => state.plantations);
  const deleteEmployee = useAppStore((state) => state.deleteEmployee);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(searchParams.get('action') === 'add');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paginatedEmployees = employees.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (employee: Employee) => {
    if (confirm(`${translations.employees.confirmDelete}`)) {
      localStorageService.deleteEmployee(employee.id);
      deleteEmployee(employee.id);
    }
  };

  const getPlantationNames = (plantationIds: string[]) => {
    return plantationIds
      .map(id => {
        const plantation = plantations.find(p => p.id === id);
        return plantation?.name || 'Inconnue';
      })
      .join(', ');
  };

  const columns: Column<Employee>[] = [
    {
      header: 'Nom',
      icon: <Users className="h-4 w-4" />,
      cell: (employee) => `${employee.firstName} ${employee.lastName}`,
    },
    {
      header: translations.employees.position,
      icon: <Briefcase className="h-4 w-4" />,
      accessorKey: 'position',
    },
    {
      header: translations.employees.city,
      icon: <MapPin className="h-4 w-4" />,
      accessorKey: 'city',
    },
    {
      header: translations.employees.assignedPlantations,
      cell: (employee) => {
        const names = getPlantationNames(employee.plantationIds);
        return names || 'Aucune assignée';
      },
    },
    {
      header: translations.common.actions,
      cell: (employee) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEmployee(employee);
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
              handleDelete(employee);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-9 w-9" />
            {translations.employees.title}
          </h1>
          <p className="text-muted-foreground">Gérer et consulter tous les employés</p>
        </div>
        <Button
          onClick={() => {
            setSelectedEmployee(null);
            setIsAddDialogOpen(true);
          }}
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          {translations.employees.addEmployee}
        </Button>
      </div>

      <DataTable
        data={paginatedEmployees}
        columns={columns}
        pagination={{
          page,
          pageSize,
          total: employees.length,
          onPageChange: setPage,
          onPageSizeChange: () => {},
        }}
      />

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setSelectedEmployee(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedEmployee ? translations.employees.editEmployee : translations.employees.addEmployee}
            </DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employee={selectedEmployee || undefined}
            onSuccess={() => {
              setIsAddDialogOpen(false);
              setSelectedEmployee(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">{translations.common.loading}</div>}>
      <EmployeesPageContent />
    </Suspense>
  );
}
