'use client';

import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import {
  Button,
  Input,
  Label,
  Textarea,
  Dropdown,
  Option,
} from '@fluentui/react-components';
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
        <Dropdown
          placeholder="Sélectionner un planteur"
          value={planters.find(p => p.id === credit?.planterId) ? `${planters.find(p => p.id === credit?.planterId)?.code} - ${planters.find(p => p.id === credit?.planterId)?.firstName} ${planters.find(p => p.id === credit?.planterId)?.lastName}` : ''}
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
          <Label htmlFor="type">Type de Créance *</Label>
          <Dropdown
            placeholder="Sélectionner le type"
            value={credit?.type === 'money' ? 'Argent' : credit?.type === 'tools' ? 'Outils' : ''}
            onOptionSelect={(_, data) => setValue('type', data.optionValue as CreditType)}
            style={{ width: '100%' }}
          >
            <Option value="money" text="Argent">Argent</Option>
            <Option value="tools" text="Outils">Outils</Option>
          </Dropdown>
          <input type="hidden" {...register('type', { required: true })} />
          {errors.type && (
            <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>Le type est requis</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            {...register('date', { required: 'La date est requise' })}
          />
          {errors.date && (
            <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.date.message}</p>
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
          <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.amount.message}</p>
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
          <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.description.message}</p>
        )}
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
          {credit ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
