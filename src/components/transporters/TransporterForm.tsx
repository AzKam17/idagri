'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { Transporter } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TransporterFormProps {
  transporter?: Transporter | null;
  onSuccess?: () => void;
}

interface TransporterFormData {
  name: string;
}

export default function TransporterForm({ transporter, onSuccess }: TransporterFormProps) {
  const { addTransporter, updateTransporter } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransporterFormData>({
    defaultValues: transporter
      ? {
          name: transporter.name,
        }
      : {},
  });

  const onSubmit = async (data: TransporterFormData) => {
    if (transporter) {
      updateTransporter(transporter.id, {
        ...transporter,
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const newTransporter: Transporter = {
        id: Date.now().toString(),
        name: data.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addTransporter(newTransporter);
    }

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du transporteur *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Le nom est requis' })}
          placeholder="Entrez le nom du transporteur"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting} className="bg-black text-white hover:bg-black/90">
          {isSubmitting
            ? transporter
              ? 'Mise à jour...'
              : 'Création...'
            : transporter
            ? 'Mettre à jour'
            : 'Créer le transporteur'}
        </Button>
      </div>
    </form>
  );
}
