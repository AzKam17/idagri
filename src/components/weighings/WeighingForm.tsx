'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
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
import { Weighing } from '@/types';
import { getCurrentPeriod, calculateWeighingTotals } from '@/lib/planterUtils';
import { useState, useEffect } from 'react';

interface WeighingFormProps {
  weighing?: Weighing | null;
  onSuccess?: () => void;
}

interface WeighingFormData {
  planterId: string;
  period: string;
  weighingDate: string;
  driverName: string;
  vehicleRegistration: string;
  grossWeight: number;
  tare: number;
  price: number;
  transportCostPerKg: number;
  taxRate: number;
}

export default function WeighingForm({ weighing, onSuccess }: WeighingFormProps) {
  const { addWeighing, updateWeighing, planters } = useAppStore();
  const [calculatedValues, setCalculatedValues] = useState({
    netWeight: 0,
    grossAmount: 0,
    transportCost: 0,
    taxAmount: 0,
    netAmount: 0,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WeighingFormData>({
    defaultValues: weighing
      ? {
          planterId: weighing.planterId,
          period: weighing.period,
          weighingDate: weighing.weighingDate,
          driverName: weighing.driverName,
          vehicleRegistration: weighing.vehicleRegistration,
          grossWeight: weighing.grossWeight,
          tare: weighing.tare,
          price: weighing.price,
          transportCostPerKg: weighing.transportCost / weighing.netWeight,
          taxRate: weighing.taxRate,
        }
      : {
          period: getCurrentPeriod(),
          weighingDate: new Date().toISOString().split('T')[0],
          price: 275,
          transportCostPerKg: 35,
          taxRate: 1.5,
          tare: 0,
          grossWeight: 0,
        },
  });

  const grossWeight = watch('grossWeight');
  const tare = watch('tare');
  const price = watch('price');
  const transportCostPerKg = watch('transportCostPerKg');
  const taxRate = watch('taxRate');

  useEffect(() => {
    if (grossWeight && tare >= 0 && price && transportCostPerKg >= 0 && taxRate >= 0) {
      const calculated = calculateWeighingTotals(
        grossWeight,
        tare,
        price,
        transportCostPerKg,
        taxRate
      );
      setCalculatedValues(calculated);
    }
  }, [grossWeight, tare, price, transportCostPerKg, taxRate]);

  const onSubmit = (data: WeighingFormData) => {
    const calculated = calculateWeighingTotals(
      data.grossWeight,
      data.tare,
      data.price,
      data.transportCostPerKg,
      data.taxRate
    );

    if (weighing) {
      updateWeighing(weighing.id, {
        ...weighing,
        ...data,
        netWeight: calculated.netWeight,
        transportCost: calculated.transportCost,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const newWeighing: Weighing = {
        id: Date.now().toString(),
        planterId: data.planterId,
        period: data.period,
        weighingDate: data.weighingDate,
        driverName: data.driverName,
        vehicleRegistration: data.vehicleRegistration,
        grossWeight: data.grossWeight,
        tare: data.tare,
        netWeight: calculated.netWeight,
        price: data.price,
        transportCost: calculated.transportCost,
        taxRate: data.taxRate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addWeighing(newWeighing);
    }

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="planterId">Planteur *</Label>
        <Select
          onValueChange={(value) => setValue('planterId', value)}
          defaultValue={weighing?.planterId}
        >
          <SelectTrigger className="rounded-lg">
            <SelectValue placeholder="Sélectionner un planteur" />
          </SelectTrigger>
          <SelectContent>
            {planters.map((planter) => (
              <SelectItem key={planter.id} value={planter.id}>
                {planter.code} - {planter.firstName} {planter.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register('planterId', { required: true })} />
        {errors.planterId && (
          <p className="text-sm text-red-600">Le planteur est requis</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="period">Période *</Label>
          <Input
            id="period"
            {...register('period', { required: 'La période est requise' })}
            className="rounded-lg"
            placeholder="Ex: PA-06/2023-1"
          />
          {errors.period && (
            <p className="text-sm text-red-600">{errors.period.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weighingDate">Date de Pesée *</Label>
          <Input
            id="weighingDate"
            type="date"
            {...register('weighingDate', { required: 'La date est requise' })}
            className="rounded-lg"
          />
          {errors.weighingDate && (
            <p className="text-sm text-red-600">{errors.weighingDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium">Informations Pesée</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grossWeight">Poids Brut (kg) *</Label>
            <Input
              id="grossWeight"
              type="number"
              step="0.01"
              {...register('grossWeight', {
                required: 'Le poids brut est requis',
                valueAsNumber: true,
                min: { value: 0, message: 'Le poids doit être positif' },
              })}
              className="rounded-lg"
            />
            {errors.grossWeight && (
              <p className="text-sm text-red-600">{errors.grossWeight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tare">Tare (kg) *</Label>
            <Input
              id="tare"
              type="number"
              step="0.01"
              {...register('tare', {
                required: 'La tare est requise',
                valueAsNumber: true,
                min: { value: 0, message: 'La tare doit être positive' },
              })}
              className="rounded-lg"
            />
            {errors.tare && (
              <p className="text-sm text-red-600">{errors.tare.message}</p>
            )}
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border">
          <div className="text-sm text-gray-600">Poids Net Calculé</div>
          <div className="text-2xl font-bold">
            {calculatedValues.netWeight.toFixed(2)} kg
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium">Tarification</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Prix (FCFA/kg) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price', {
                required: 'Le prix est requis',
                valueAsNumber: true,
                min: { value: 0, message: 'Le prix doit être positif' },
              })}
              className="rounded-lg"
            />
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="transportCostPerKg">Transport (FCFA/kg) *</Label>
            <Input
              id="transportCostPerKg"
              type="number"
              step="0.01"
              {...register('transportCostPerKg', {
                required: 'Le coût de transport est requis',
                valueAsNumber: true,
                min: { value: 0, message: 'Le coût doit être positif' },
              })}
              className="rounded-lg"
            />
            {errors.transportCostPerKg && (
              <p className="text-sm text-red-600">{errors.transportCostPerKg.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxRate">Taux d&apos;Impôt (%) *</Label>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              {...register('taxRate', {
                required: 'Le taux est requis',
                valueAsNumber: true,
                min: { value: 0, message: 'Le taux doit être positif' },
              })}
              className="rounded-lg"
            />
            {errors.taxRate && (
              <p className="text-sm text-red-600">{errors.taxRate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border">
            <div className="text-xs text-gray-600">Montant Brut</div>
            <div className="text-lg font-bold">
              {new Intl.NumberFormat('fr-FR').format(calculatedValues.grossAmount)} FCFA
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border">
            <div className="text-xs text-gray-600">Coût Transport</div>
            <div className="text-lg font-bold text-orange-600">
              -{new Intl.NumberFormat('fr-FR').format(calculatedValues.transportCost)} FCFA
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border">
            <div className="text-xs text-gray-600">Impôt ({taxRate}%)</div>
            <div className="text-lg font-bold text-orange-600">
              -{new Intl.NumberFormat('fr-FR').format(calculatedValues.taxAmount)} FCFA
            </div>
          </div>

          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs text-green-700">Net à Payer</div>
            <div className="text-lg font-bold text-green-700">
              {new Intl.NumberFormat('fr-FR').format(calculatedValues.netAmount)} FCFA
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium">Informations Transport</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="driverName">Nom du Chauffeur *</Label>
            <Input
              id="driverName"
              {...register('driverName', { required: 'Le nom du chauffeur est requis' })}
              className="rounded-lg"
            />
            {errors.driverName && (
              <p className="text-sm text-red-600">{errors.driverName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleRegistration">Immatriculation *</Label>
            <Input
              id="vehicleRegistration"
              {...register('vehicleRegistration', {
                required: 'L&apos;immatriculation est requise',
              })}
              className="rounded-lg"
              placeholder="Ex: AB-1234-CD"
            />
            {errors.vehicleRegistration && (
              <p className="text-sm text-red-600">{errors.vehicleRegistration.message}</p>
            )}
          </div>
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
          {weighing ? 'Mettre à jour' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
