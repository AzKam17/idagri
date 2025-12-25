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
import { Users, Plus, Edit, Trash2, MapPin, Briefcase, Sprout } from 'lucide-react';

function EmployeesPageContent() {
  const searchParams = useSearchParams();
  const employees = useAppStore((state) => state.employees);
  const plantations = useAppStore((state) => state.plantations);
  const deleteEmployee = useAppStore((state) => state.deleteEmployee);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(searchParams.get('action') === 'add');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsPanelOpen(true);
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
  ];

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
            <Users style={{ width: '20px', height: '20px', color: '#00a540' }} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {translations.employees.title}
            </h1>
            <p className="text-muted-foreground text-sm">Gérer et consulter tous les employés</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedEmployee(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {translations.employees.addEmployee}
        </Button>
      </div>

      <DataTable
        data={paginatedEmployees}
        columns={columns}
        onRowClick={handleRowClick}
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

      {/* Right Panel */}
      {isPanelOpen && selectedEmployee && (
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
                {/* Employee Name */}
                <div className="flex flex-col items-center justify-center gap-5 mb-10">
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center shadow-lg">
                    <Users className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-semibold leading-10 text-neutral-900">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </div>
                    <div className="text-base text-neutral-600 mt-1">{selectedEmployee.position}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-6 border-t border-b border-neutral-200 px-6 py-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Ville</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedEmployee.city}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Poste</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedEmployee.position}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sprout className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Plantations</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">
                      {getPlantationNames(selectedEmployee.plantationIds) || 'Aucune assignée'}
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
                      if (confirm(`${translations.employees.confirmDelete}`)) {
                        handleDelete(selectedEmployee);
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

export default function EmployeesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">{translations.common.loading}</div>}>
      <EmployeesPageContent />
    </Suspense>
  );
}
