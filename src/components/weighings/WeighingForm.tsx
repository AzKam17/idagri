'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import {
  Button,
  Input,
  Label,
  Dropdown,
  Option,
} from '@fluentui/react-components';
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
        <Dropdown
          placeholder="Sélectionner un planteur"
          value={planters.find(p => p.id === watch('planterId')) ? `${planters.find(p => p.id === watch('planterId'))?.code} - ${planters.find(p => p.id === watch('planterId'))?.firstName} ${planters.find(p => p.id === watch('planterId'))?.lastName}` : ''}
          onOptionSelect={(_, data) => setValue('planterId', data.optionValue as string)}
          style={{ width: '100%' }}
        >
          {planters.map((planter) => (
            <Option key={planter.id} value={planter.id} text={`${planter.code} - ${planter.firstName} ${planter.lastName}`}>
              {planter.code} - {planter.firstName} {planter.lastName}
            </Option>
          ))}
        </Dropdown>
        <input type="hidden" {...register('planterId', { required: true })} />
        {errors.planterId && (
          <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>Le planteur est requis</p>
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
            <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.period.message}</p>
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
            <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.weighingDate.message}</p>
          )}
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }} className="space-y-4">
        <h3 style={{ fontWeight: '500' }}>Informations Pesée</h3>

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
            />
            {errors.grossWeight && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.grossWeight.message}</p>
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
            />
            {errors.tare && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.tare.message}</p>
            )}
          </div>
        </div>

        <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Poids Net Calculé</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {calculatedValues.netWeight.toFixed(2)} kg
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }} className="space-y-4">
        <h3 style={{ fontWeight: '500' }}>Tarification</h3>

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
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.price.message}</p>
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
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.transportCostPerKg.message}</p>
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
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.taxRate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Montant Brut</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {new Intl.NumberFormat('fr-FR').format(calculatedValues.grossAmount)} FCFA
            </div>
          </div>

          <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Coût Transport</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ea580c' }}>
              -{new Intl.NumberFormat('fr-FR').format(calculatedValues.transportCost)} FCFA
            </div>
          </div>

          <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Impôt ({taxRate}%)</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ea580c' }}>
              -{new Intl.NumberFormat('fr-FR').format(calculatedValues.taxAmount)} FCFA
            </div>
          </div>

          <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
            <div style={{ fontSize: '12px', color: '#15803d' }}>Net à Payer</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#15803d' }}>
              {new Intl.NumberFormat('fr-FR').format(calculatedValues.netAmount)} FCFA
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }} className="space-y-4">
        <h3 style={{ fontWeight: '500' }}>Informations Transport</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="driverName">Nom du Chauffeur *</Label>
            <Input
              id="driverName"
              {...register('driverName', { required: 'Le nom du chauffeur est requis' })}
            />
            {errors.driverName && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.driverName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleRegistration">Immatriculation *</Label>
            <Input
              id="vehicleRegistration"
              {...register('vehicleRegistration', {
                required: 'L&apos;immatriculation est requise',
              })}
              placeholder="Ex: AB-1234-CD"
            />
            {errors.vehicleRegistration && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.vehicleRegistration.message}</p>
            )}
          </div>
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
          {weighing ? 'Mettre à jour' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
