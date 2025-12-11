'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';

import { Employee } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, MapPin, Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  position: string;
  city: string;
}

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess?: () => void;
}

export function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addEmployee = useAppStore((state) => state.addEmployee);
  const updateEmployee = useAppStore((state) => state.updateEmployee);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    defaultValues: employee
      ? {
          firstName: employee.firstName,
          lastName: employee.lastName,
          position: employee.position,
          city: employee.city,
        }
      : undefined,
  });

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const now = new Date().toISOString();

      if (employee) {
        const updatedEmployee: Employee = {
          ...employee,
          ...data,
          updatedAt: now,
        };

        localStorageService.updateEmployee(employee.id, updatedEmployee);
        updateEmployee(employee.id, updatedEmployee);
      } else {
        const newEmployee: Employee = {
          id: crypto.randomUUID(),
          ...data,
          plantationIds: [],
          createdAt: now,
          updatedAt: now,
        };

        localStorageService.addEmployee(newEmployee);
        addEmployee(newEmployee);
        reset();
      }

      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {employee ? translations.employees.editEmployee : translations.employees.addEmployee}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {translations.employees.firstName} *
              </Label>
              <Input
                id="firstName"
                {...register('firstName', { required: `${translations.employees.firstName} est requis` })}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {translations.employees.lastName} *
              </Label>
              <Input
                id="lastName"
                {...register('lastName', { required: `${translations.employees.lastName} est requis` })}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2.5">
            <Label htmlFor="position" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {translations.employees.position} *
            </Label>
            <Input
              id="position"
              {...register('position', { required: `${translations.employees.position} est requis` })}
              disabled={isSubmitting}
              className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
            />
            {errors.position && (
              <p className="text-sm text-destructive">{errors.position.message}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2.5">
            <Label htmlFor="city" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {translations.employees.city} *
            </Label>
            <Input
              id="city"
              {...register('city', { required: `${translations.employees.city} est requise` })}
              disabled={isSubmitting}
              className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {employee ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {employee ? 'Mettre à jour' : 'Créer'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
