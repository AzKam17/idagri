'use client';

import React, { useState, Suspense } from 'react';
import { useAppStore } from '@/store';
import { useSearchParams } from 'next/navigation';


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
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      localStorageService.deleteEmployee(employee.id);
      deleteEmployee(employee.id);
    }
  };

  const getPlantationNames = (plantationIds: string[]) => {
    return plantationIds
      .map(id => {
        const plantation = plantations.find(p => p.id === id);
        return plantation?.name || 'Unknown';
      })
      .join(', ');
  };

  const columns: Column<Employee>[] = [
    {
      header: 'Name',
      icon: <Users className="h-4 w-4" />,
      cell: (employee) => `${employee.firstName} ${employee.lastName}`,
    },
    {
      header: 'Position',
      icon: <Briefcase className="h-4 w-4" />,
      accessorKey: 'position',
    },
    {
      header: 'City',
      icon: <MapPin className="h-4 w-4" />,
      accessorKey: 'city',
    },
    {
      header: 'Plantations',
      cell: (employee) => {
        const names = getPlantationNames(employee.plantationIds);
        return names || 'None assigned';
      },
    },
    {
      header: 'Actions',
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Employees
          </h1>
          <p className="text-muted-foreground">Manage and view all employees</p>
        </div>
        <Button
          onClick={() => {
            setSelectedEmployee(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
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
            <DialogTitle>
              {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
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
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeesPageContent />
    </Suspense>
  );
}
