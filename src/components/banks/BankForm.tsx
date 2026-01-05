'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { Bank } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BankFormProps {
  bank?: Bank | null;
  onSuccess?: () => void;
}

interface BankFormData {
  name: string;
  agency?: string;
}

export default function BankForm({ bank, onSuccess }: BankFormProps) {
  const { addBank, updateBank } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BankFormData>({
    defaultValues: bank
      ? {
          name: bank.name,
          agency: bank.agency,
        }
      : {},
  });

  const onSubmit = async (data: BankFormData) => {
    if (bank) {
      updateBank(bank.id, {
        ...bank,
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const newBank: Bank = {
        id: Date.now().toString(),
        name: data.name,
        agency: data.agency,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addBank(newBank);
    }

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de la banque *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Le nom est requis' })}
          placeholder="Ex: SGBCI, Ecobank, NSIA..."
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agency">Agence (optionnel)</Label>
        <Input
          id="agency"
          {...register('agency')}
          placeholder="Ex: Cocody Angré, Plateau..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting} className="bg-black text-white hover:bg-black/90">
          {isSubmitting
            ? bank
              ? 'Mise à jour...'
              : 'Création...'
            : bank
            ? 'Mettre à jour'
            : 'Créer la banque'}
        </Button>
      </div>
    </form>
  );
}
