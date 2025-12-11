'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { employeesState } from '@/atoms/employees';
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
  const setEmployees = useSetRecoilState(employeesState);

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
        setEmployees(prev =>
          prev.map(e => (e.id === employee.id ? updatedEmployee : e))
        );
      } else {
        const newEmployee: Employee = {
          id: crypto.randomUUID(),
          ...data,
          plantationIds: [],
          createdAt: now,
          updatedAt: now,
        };

        localStorageService.addEmployee(newEmployee);
        setEmployees(prev => [...prev, newEmployee]);
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
          {employee ? 'Edit Employee' : 'Add New Employee'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name *
              </Label>
              <Input
                id="firstName"
                {...register('firstName', { required: 'First name is required' })}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Last Name *
              </Label>
              <Input
                id="lastName"
                {...register('lastName', { required: 'Last name is required' })}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Position *
            </Label>
            <Input
              id="position"
              {...register('position', { required: 'Position is required' })}
              disabled={isSubmitting}
              className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
            />
            {errors.position && (
              <p className="text-sm text-destructive">{errors.position.message}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              City *
            </Label>
            <Input
              id="city"
              {...register('city', { required: 'City is required' })}
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
                {employee ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {employee ? 'Update Employee' : 'Create Employee'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
