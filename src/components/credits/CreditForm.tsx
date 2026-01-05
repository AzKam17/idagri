'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { Credit, CreditType, CreditInstallment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface CreditFormProps {
  credit?: Credit | null;
  onSuccess?: () => void;
}

interface CreditFormData {
  planterId: string;
  type: CreditType;
  amount: number;
  description: string;
  date: string;
  installmentsCount?: number;
  deductionStartDate?: string;
}

export default function CreditForm({ credit, onSuccess }: CreditFormProps) {
  const { addCredit, updateCredit, planters } = useAppStore();
  const [selectedPlanterId, setSelectedPlanterId] = useState<string | undefined>(credit?.planterId);
  const [selectedType, setSelectedType] = useState<CreditType | undefined>(credit?.type || 'money');
  const [installmentAmount, setInstallmentAmount] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreditFormData>({
    defaultValues: credit
      ? {
          planterId: credit.planterId,
          type: credit.type,
          amount: credit.amount,
          description: credit.description,
          date: credit.date,
          installmentsCount: credit.installmentsCount,
          deductionStartDate: credit.deductionStartDate,
        }
      : {
          date: new Date().toISOString().split('T')[0],
          type: 'money',
        },
  });

  const amount = watch('amount');
  const installmentsCount = watch('installmentsCount');
  const loanDate = watch('date');
  const deductionStartDate = watch('deductionStartDate');

  // Calculate installment amount
  useEffect(() => {
    if (amount && installmentsCount && installmentsCount > 0) {
      setInstallmentAmount(amount / installmentsCount);
    } else {
      setInstallmentAmount(0);
    }
  }, [amount, installmentsCount]);

  // Generate installment schedule
  const generateInstallments = (
    creditId: string,
    totalAmount: number,
    count: number,
    startDate: string
  ): CreditInstallment[] => {
    if (!count || count <= 0) return [];

    const installments: CreditInstallment[] = [];
    const installmentAmount = totalAmount / count;
    const start = new Date(startDate);

    for (let i = 0; i < count; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(dueDate.getMonth() + i);

      installments.push({
        id: `${creditId}-${i + 1}`,
        creditId,
        amount: installmentAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        isPaid: false,
      });
    }

    return installments;
  };

  const onSubmit = (data: CreditFormData) => {
    if (credit) {
      updateCredit(credit.id, {
        ...credit,
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const creditId = Date.now().toString();
      const installments =
        data.installmentsCount && data.deductionStartDate
          ? generateInstallments(creditId, data.amount, data.installmentsCount, data.deductionStartDate)
          : undefined;

      const newCredit: Credit = {
        id: creditId,
        planterId: data.planterId,
        type: data.type,
        amount: data.amount,
        description: data.description,
        date: data.date,
        installmentsCount: data.installmentsCount,
        deductionStartDate: data.deductionStartDate,
        installments,
        isPaid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addCredit(newCredit);
    }

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="planterId">Planteur *</Label>
        <Select
          value={selectedPlanterId}
          onValueChange={(value) => {
            setSelectedPlanterId(value);
            setValue('planterId', value, { shouldValidate: true });
          }}
        >
          <SelectTrigger>
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
          <p className="text-sm text-red-500">Le planteur est requis</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type de Créance *</Label>
          <Select
            value={selectedType}
            onValueChange={(value) => {
              setSelectedType(value as CreditType);
              setValue('type', value as CreditType, { shouldValidate: true });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="money">Argent</SelectItem>
              <SelectItem value="tools">Outils</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register('type', { required: true })} />
          {errors.type && (
            <p className="text-sm text-red-500">Le type est requis</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date d&apos;emprunt *</Label>
          <Input
            id="date"
            type="date"
            {...register('date', { required: 'La date est requise' })}
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Montant (FCFA) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...register('amount', {
            required: 'Le montant est requis',
            valueAsNumber: true,
            min: { value: 0, message: 'Le montant doit être positif' },
          })}
          placeholder="Ex: 50000"
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-medium">Échéancier de remboursement (optionnel)</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="installmentsCount">Nombre d&apos;échéances</Label>
            <Input
              id="installmentsCount"
              type="number"
              {...register('installmentsCount', {
                valueAsNumber: true,
                min: { value: 1, message: 'Minimum 1 échéance' },
              })}
              placeholder="Ex: 6"
            />
            {errors.installmentsCount && (
              <p className="text-sm text-red-500">{errors.installmentsCount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deductionStartDate">Date de début de prélèvement</Label>
            <Input
              id="deductionStartDate"
              type="date"
              {...register('deductionStartDate', {
                validate: (value) => {
                  if (!value) return true;
                  const startDate = new Date(value);
                  const loanDateObj = new Date(loanDate);
                  return startDate >= loanDateObj || 'La date de début doit être après la date d\'emprunt';
                },
              })}
            />
            {errors.deductionStartDate && (
              <p className="text-sm text-red-500">{errors.deductionStartDate.message}</p>
            )}
          </div>
        </div>

        {installmentAmount > 0 && (
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Montant par échéance</div>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR').format(installmentAmount)} FCFA
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {installmentsCount} échéances mensuelles
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'La description est requise' })}
          placeholder="Ex: Avance sur salaire, Achat outils..."
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit" className="bg-black text-white hover:bg-black/90">
          {credit ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
