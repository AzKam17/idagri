'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { Vehicle, VehicleType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSuccess?: () => void;
}

interface VehicleFormData {
  registration: string;
  type: VehicleType;
  transporterId: string;
  driverName?: string;
}

const vehicleTypes: { value: VehicleType; label: string }[] = [
  { value: 'tricycle', label: 'Tricycle' },
  { value: 'camion', label: 'Camion' },
  { value: 'camionnette', label: 'Camionnette' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'autre', label: 'Autre' },
];

export default function VehicleForm({ vehicle, onSuccess }: VehicleFormProps) {
  const { addVehicle, updateVehicle, transporters } = useAppStore();
  const [selectedType, setSelectedType] = useState<VehicleType | undefined>(vehicle?.type);
  const [selectedTransporterId, setSelectedTransporterId] = useState<string | undefined>(vehicle?.transporterId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    defaultValues: vehicle
      ? {
          registration: vehicle.registration,
          type: vehicle.type,
          transporterId: vehicle.transporterId,
          driverName: vehicle.driverName,
        }
      : {},
  });

  const onSubmit = async (data: VehicleFormData) => {
    if (vehicle) {
      updateVehicle(vehicle.id, {
        ...vehicle,
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        registration: data.registration,
        type: data.type,
        transporterId: data.transporterId,
        driverName: data.driverName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addVehicle(newVehicle);
    }

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registration">Immatriculation *</Label>
          <Input
            id="registration"
            {...register('registration', { required: 'L\'immatriculation est requise' })}
            placeholder="Ex: AB-1234-CD"
          />
          {errors.registration && (
            <p className="text-sm text-red-500">{errors.registration.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type de véhicule *</Label>
          <Select
            value={selectedType}
            onValueChange={(value) => {
              setSelectedType(value as VehicleType);
              setValue('type', value as VehicleType, { shouldValidate: true });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register('type', { required: 'Le type est requis' })}
          />
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transporterId">Transporteur *</Label>
        <Select
          value={selectedTransporterId}
          onValueChange={(value) => {
            setSelectedTransporterId(value);
            setValue('transporterId', value, { shouldValidate: true });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un transporteur" />
          </SelectTrigger>
          <SelectContent>
            {transporters.map((transporter) => (
              <SelectItem key={transporter.id} value={transporter.id}>
                {transporter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          type="hidden"
          {...register('transporterId', { required: 'Le transporteur est requis' })}
        />
        {errors.transporterId && (
          <p className="text-sm text-red-500">{errors.transporterId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="driverName">Nom du chauffeur (optionnel)</Label>
        <Input
          id="driverName"
          {...register('driverName')}
          placeholder="Entrez le nom du chauffeur"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting} className="bg-black text-white hover:bg-black/90">
          {isSubmitting
            ? vehicle
              ? 'Mise à jour...'
              : 'Création...'
            : vehicle
            ? 'Mettre à jour'
            : 'Créer le véhicule'}
        </Button>
      </div>
    </form>
  );
}
