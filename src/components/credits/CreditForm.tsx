'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
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
import { Credit, CreditType } from '@/types';

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
}

export default function CreditForm({ credit, onSuccess }: CreditFormProps) {
  const { addCredit, updateCredit, planters } = useAppStore();

  const {
    register,
    handleSubmit,
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
        }
      : {
          date: new Date().toISOString().split('T')[0],
          type: 'money',
        },
  });

  const onSubmit = (data: CreditFormData) => {
    if (credit) {
      updateCredit(credit.id, {
        ...credit,
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const newCredit: Credit = {
        id: Date.now().toString(),
        planterId: data.planterId,
        type: data.type,
        amount: data.amount,
        description: data.description,
        date: data.date,
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
          onValueChange={(value) => setValue('planterId', value)}
          defaultValue={credit?.planterId}
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
          <Label htmlFor="type">Type de Créance *</Label>
          <Select
            onValueChange={(value) => setValue('type', value as CreditType)}
            defaultValue={credit?.type || 'money'}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="money">Argent</SelectItem>
              <SelectItem value="tools">Outils</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register('type', { required: true })} />
          {errors.type && (
            <p className="text-sm text-red-600">Le type est requis</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            {...register('date', { required: 'La date est requise' })}
            className="rounded-lg"
          />
          {errors.date && (
            <p className="text-sm text-red-600">{errors.date.message}</p>
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
          className="rounded-lg"
          placeholder="Ex: 50000"
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'La description est requise' })}
          className="rounded-lg"
          placeholder="Ex: Avance sur salaire, Achat outils..."
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
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
          {credit ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
