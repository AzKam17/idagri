'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
            className="rounded-lg"
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            {...register('lastName', { required: 'Le nom est requis' })}
            className="rounded-lg"
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="village">Village *</Label>
        <Input
          id="village"
          {...register('village', { required: 'Le village est requis' })}
          className="rounded-lg"
        />
        {errors.village && (
          <p className="text-sm text-red-600">{errors.village.message}</p>
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
          className="rounded-lg"
        />
        {errors.plantationSize && (
          <p className="text-sm text-red-600">{errors.plantationSize.message}</p>
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
            className="rounded-lg"
            placeholder="Ex: 5.345678"
          />
          {errors.latitude && (
            <p className="text-sm text-red-600">{errors.latitude.message}</p>
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
            className="rounded-lg"
            placeholder="Ex: -3.456789"
          />
          {errors.longitude && (
            <p className="text-sm text-red-600">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          className="rounded-lg"
          placeholder="Ex: +225 01 02 03 04 05"
        />
      </div>

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium">Informations Bancaires</h3>

        <div className="space-y-2">
          <Label htmlFor="bankName">Nom de la Banque</Label>
          <Input
            id="bankName"
            {...register('bankName')}
            className="rounded-lg"
            placeholder="Ex: COOPEC BIANOUAN"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankAccountNumber">Numéro de Compte Bancaire</Label>
          <Input
            id="bankAccountNumber"
            {...register('bankAccountNumber')}
            className="rounded-lg"
            placeholder="Ex: 203110003019"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          className="rounded-lg"
        >
          Annuler
        </Button>
        <Button type="submit" className="bg-black text-white hover:bg-black/90 rounded-lg shadow-md">
          {planter ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
