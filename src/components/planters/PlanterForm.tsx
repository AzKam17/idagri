'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import {
  Button,
  Input,
  Label,
} from '@fluentui/react-components';
import { Planter } from '@/types';
import { generatePlanterCode } from '@/lib/planterUtils';

interface PlanterFormProps {
  planter?: Planter | null;
  onSuccess?: () => void;
}

interface PlanterFormData {
  firstName: string;
  lastName: string;
  village: string;
  plantationSize: number;
  latitude: number;
  longitude: number;
  phone?: string;
  bankName?: string;
  bankAccountNumber?: string;
}

export default function PlanterForm({ planter, onSuccess }: PlanterFormProps) {
  const { addPlanter, updatePlanter, planters } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanterFormData>({
    defaultValues: planter
      ? {
          firstName: planter.firstName,
          lastName: planter.lastName,
          village: planter.village,
          plantationSize: planter.plantationSize,
          latitude: planter.latitude,
          longitude: planter.longitude,
          phone: planter.phone || '',
          bankName: planter.bankName || '',
          bankAccountNumber: planter.bankAccountNumber || '',
        }
      : undefined,
  });

  const onSubmit = (data: PlanterFormData) => {
    if (planter) {
      updatePlanter(planter.id, {
        ...planter,
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const code = generatePlanterCode(
        data.firstName,
        data.lastName,
        data.village,
        planters
      );

      const newPlanter: Planter = {
        id: Date.now().toString(),
        code,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addPlanter(newPlanter);
    }

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            {...register('firstName', { required: 'Le prénom est requis' })}
          />
          {errors.firstName && (
            <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            {...register('lastName', { required: 'Le nom est requis' })}
          />
          {errors.lastName && (
            <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="village">Village *</Label>
        <Input
          id="village"
          {...register('village', { required: 'Le village est requis' })}
        />
        {errors.village && (
          <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.village.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="plantationSize">Taille de la Plantation (hectares) *</Label>
        <Input
          id="plantationSize"
          type="number"
          step="0.01"
          {...register('plantationSize', {
            required: 'La taille de la plantation est requise',
            valueAsNumber: true,
            min: { value: 0.01, message: 'La taille doit être supérieure à 0' },
          })}
        />
        {errors.plantationSize && (
          <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.plantationSize.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude *</Label>
          <Input
            id="latitude"
            type="number"
            step="0.000001"
            {...register('latitude', {
              required: 'La latitude est requise',
              valueAsNumber: true,
            })}
            placeholder="Ex: 5.345678"
          />
          {errors.latitude && (
            <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.latitude.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude *</Label>
          <Input
            id="longitude"
            type="number"
            step="0.000001"
            {...register('longitude', {
              required: 'La longitude est requise',
              valueAsNumber: true,
            })}
            placeholder="Ex: -3.456789"
          />
          {errors.longitude && (
            <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.longitude.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="Ex: +225 01 02 03 04 05"
        />
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }} className="space-y-4">
        <h3 style={{ fontWeight: '500' }}>Informations Bancaires</h3>

        <div className="space-y-2">
          <Label htmlFor="bankName">Nom de la Banque</Label>
          <Input
            id="bankName"
            {...register('bankName')}
            placeholder="Ex: COOPEC BIANOUAN"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankAccountNumber">Numéro de Compte Bancaire</Label>
          <Input
            id="bankAccountNumber"
            {...register('bankAccountNumber')}
            placeholder="Ex: 203110003019"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          appearance="outline"
          onClick={onSuccess}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          appearance="primary"
          style={{
            backgroundColor: '#00a540',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {planter ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
