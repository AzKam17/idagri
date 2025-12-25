'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';

import { Employee } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  Body1,
  Spinner
} from '@fluentui/react-components';
import { User, Briefcase, MapPin, Save } from 'lucide-react';

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
    <Card style={{ padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <CardHeader
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User className="h-5 w-5" />
            <Body1 style={{ fontWeight: 'bold' }}>
              {employee ? translations.employees.editEmployee : translations.employees.addEmployee}
            </Body1>
          </div>
        }
      />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" style={{ marginTop: '20px' }}>
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="firstName" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User className="h-4 w-4" />
                {translations.employees.firstName} *
              </Label>
              <Input
                id="firstName"
                {...register('firstName', { required: `${translations.employees.firstName} est requis` })}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="lastName" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User className="h-4 w-4" />
                {translations.employees.lastName} *
              </Label>
              <Input
                id="lastName"
                {...register('lastName', { required: `${translations.employees.lastName} est requis` })}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2.5">
            <Label htmlFor="position" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase className="h-4 w-4" />
              {translations.employees.position} *
            </Label>
            <Input
              id="position"
              {...register('position', { required: `${translations.employees.position} est requis` })}
              disabled={isSubmitting}
            />
            {errors.position && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.position.message}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2.5">
            <Label htmlFor="city" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin className="h-4 w-4" />
              {translations.employees.city} *
            </Label>
            <Input
              id="city"
              {...register('city', { required: `${translations.employees.city} est requise` })}
              disabled={isSubmitting}
            />
            {errors.city && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.city.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            appearance="primary"
            disabled={isSubmitting}
            icon={isSubmitting ? <Spinner size="tiny" /> : <Save className="h-4 w-4" />}
            style={{
              width: '100%',
              backgroundColor: '#00a540',
              color: '#fff',
              borderRadius: '8px'
            }}
          >
            {isSubmitting
              ? (employee ? 'Mise à jour...' : 'Création...')
              : (employee ? 'Mettre à jour' : 'Créer')
            }
          </Button>
        </form>
      </div>
    </Card>
  );
}
