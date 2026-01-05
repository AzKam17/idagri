'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { Weighing } from '@/types';
import { getCurrentPeriod, calculateWeighingTotals } from '@/lib/planterUtils';
import { useState, useEffect } from 'react';
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

interface WeighingFormProps {
  weighing?: Weighing | null;
  onSuccess?: () => void;
}

interface WeighingFormData {
  farmerId: string;
  period: string;
  weighingDate: string;
  transporterId?: string;
  vehicleId?: string;
  driverName: string;
  vehicleRegistration: string;
  loadedWeight: number;
  emptyWeight: number;
  price: number;
  transportCostPerKg: number;
  taxRate: number;
}

export default function WeighingForm({ weighing, onSuccess }: WeighingFormProps) {
  const { addWeighing, updateWeighing, farmers, transporters, vehicles } = useAppStore();
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | undefined>(weighing?.farmerId);
  const [selectedTransporterId, setSelectedTransporterId] = useState<string | undefined>(weighing?.transporterId);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>(weighing?.vehicleId);

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
          farmerId: weighing.farmerId,
          period: weighing.period,
          weighingDate: weighing.weighingDate,
          transporterId: weighing.transporterId,
          vehicleId: weighing.vehicleId,
          driverName: weighing.driverName,
          vehicleRegistration: weighing.vehicleRegistration,
          loadedWeight: weighing.loadedWeight,
          emptyWeight: weighing.emptyWeight,
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
          emptyWeight: 0,
          loadedWeight: 0,
        },
  });

  const loadedWeight = watch('loadedWeight');
  const emptyWeight = watch('emptyWeight');
  const price = watch('price');
  const transportCostPerKg = watch('transportCostPerKg');
  const taxRate = watch('taxRate');

  // Auto-populate vehicle info when vehicle is selected
  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
      if (vehicle) {
        setValue('vehicleRegistration', vehicle.registration);
        if (vehicle.driverName) {
          setValue('driverName', vehicle.driverName);
        }
        if (vehicle.transporterId) {
          setSelectedTransporterId(vehicle.transporterId);
          setValue('transporterId', vehicle.transporterId);
        }
      }
    }
  }, [selectedVehicleId, vehicles, setValue]);

  useEffect(() => {
    if (loadedWeight && emptyWeight >= 0 && price && transportCostPerKg >= 0 && taxRate >= 0) {
      const netWeight = loadedWeight - emptyWeight;
      const calculated = calculateWeighingTotals(
        loadedWeight,
        emptyWeight,
        price,
        transportCostPerKg,
        taxRate
      );
      setCalculatedValues(calculated);
    }
  }, [loadedWeight, emptyWeight, price, transportCostPerKg, taxRate]);

  const onSubmit = (data: WeighingFormData) => {
    const netWeight = data.loadedWeight - data.emptyWeight;
    const calculated = calculateWeighingTotals(
      data.loadedWeight,
      data.emptyWeight,
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
        farmerId: data.farmerId,
        period: data.period,
        weighingDate: data.weighingDate,
        transporterId: data.transporterId,
        vehicleId: data.vehicleId,
        driverName: data.driverName,
        vehicleRegistration: data.vehicleRegistration,
        loadedWeight: data.loadedWeight,
        emptyWeight: data.emptyWeight,
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

  const selectedFarmer = farmers.find((f) => f.id === selectedFarmerId);
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="farmerId">Agriculteur *</Label>
        <Select
          value={selectedFarmerId}
          onValueChange={(value) => {
            setSelectedFarmerId(value);
            setValue('farmerId', value, { shouldValidate: true });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un planteur" />
          </SelectTrigger>
          <SelectContent>
            {farmers.map((farmer) => (
              <SelectItem key={farmer.id} value={farmer.id}>
                {farmer.code} - {farmer.firstName} {farmer.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register('farmerId', { required: true })} />
        {errors.farmerId && (
          <p className="text-sm text-red-500">L'agriculteur est requis</p>
        )}
        {selectedFarmer && (
          <p className="text-sm text-gray-600">Code: {selectedFarmer.code}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="period">Période *</Label>
          <Input
            id="period"
            {...register('period', { required: 'La période est requise' })}
            placeholder="Ex: PA-06/2023-1"
          />
          {errors.period && (
            <p className="text-sm text-red-500">{errors.period.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weighingDate">Date de Pesée *</Label>
          <Input
            id="weighingDate"
            type="date"
            {...register('weighingDate', { required: 'La date est requise' })}
          />
          {errors.weighingDate && (
            <p className="text-sm text-red-500">{errors.weighingDate.message}</p>
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-medium">Informations Transport</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transporterId">Transporteur</Label>
            <Select
              value={selectedTransporterId}
              onValueChange={(value) => {
                setSelectedTransporterId(value);
                setValue('transporterId', value);
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleId">Véhicule</Label>
            <Select
              value={selectedVehicleId}
              onValueChange={(value) => {
                setSelectedVehicleId(value);
                setValue('vehicleId', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.registration} - {vehicle.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedVehicle && (
              <p className="text-sm text-gray-600">Type: {selectedVehicle.type}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="driverName">Nom du Chauffeur *</Label>
            <Input
              id="driverName"
              {...register('driverName', { required: 'Le nom du chauffeur est requis' })}
            />
            {errors.driverName && (
              <p className="text-sm text-red-500">{errors.driverName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleRegistration">Immatriculation *</Label>
            <Input
              id="vehicleRegistration"
              {...register('vehicleRegistration', {
                required: 'L\'immatriculation est requise',
              })}
              placeholder="Ex: AB-1234-CD"
            />
            {errors.vehicleRegistration && (
              <p className="text-sm text-red-500">{errors.vehicleRegistration.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-medium">Informations Pesée</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loadedWeight">Poids à charge (kg) *</Label>
            <Input
              id="loadedWeight"
              type="number"
              step="0.01"
              {...register('loadedWeight', {
                required: 'Le poids à charge est requis',
                valueAsNumber: true,
                min: { value: 0, message: 'Le poids doit être positif' },
              })}
            />
            {errors.loadedWeight && (
              <p className="text-sm text-red-500">{errors.loadedWeight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emptyWeight">Poids à vide (kg) *</Label>
            <Input
              id="emptyWeight"
              type="number"
              step="0.01"
              {...register('emptyWeight', {
                required: 'Le poids à vide est requis',
                valueAsNumber: true,
                min: { value: 0, message: 'Le poids doit être positif' },
              })}
            />
            {errors.emptyWeight && (
              <p className="text-sm text-red-500">{errors.emptyWeight.message}</p>
            )}
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Poids Net Calculé</div>
          <div className="text-2xl font-bold">
            {calculatedValues.netWeight.toFixed(2)} kg
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
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
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
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
            />
            {errors.transportCostPerKg && (
              <p className="text-sm text-red-500">{errors.transportCostPerKg.message}</p>
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
            />
            {errors.taxRate && (
              <p className="text-sm text-red-500">{errors.taxRate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-xs text-gray-600">Montant Brut</div>
            <div className="text-lg font-bold">
              {new Intl.NumberFormat('fr-FR').format(calculatedValues.grossAmount)} FCFA
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-xs text-gray-600">Coût Transport</div>
            <div className="text-lg font-bold text-orange-600">
              -{new Intl.NumberFormat('fr-FR').format(calculatedValues.transportCost)} FCFA
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-gray-200">
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

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit" className="bg-black text-white hover:bg-black/90">
          {weighing ? 'Mettre à jour' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
