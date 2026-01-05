'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { CompanySettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Building2, Image, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function SettingsPage() {
  const { companySettings, updateCompanySettings } = useAppStore();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanySettings>({
    defaultValues: companySettings || {
      id: '1',
      name: '',
      address: '',
      phone: '',
      email: '',
      registrationNumber: '',
      customMessage: '',
      bonusEnabled: false,
      bonusMinDeliveries: 6,
      bonusAmountPerKg: 10,
      bonusPeriodMonths: 6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  useEffect(() => {
    if (companySettings?.logoBase64) {
      setLogoPreview(companySettings.logoBase64);
    }
  }, [companySettings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setValue('logoBase64', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: CompanySettings) => {
    updateCompanySettings({
      ...data,
      id: '1',
      updatedAt: new Date().toISOString(),
      createdAt: companySettings?.createdAt || new Date().toISOString(),
    });
    alert('Paramètres enregistrés avec succès !');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Settings className="h-6 w-6" style={{ color: 'white' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-gray-500">Configuration de l'application</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations de l'entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'entreprise *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Le nom est requis' })}
                  placeholder="Ex: Coopérative Agricole XYZ"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Numéro d'enregistrement</Label>
                <Input
                  id="registrationNumber"
                  {...register('registrationNumber')}
                  placeholder="Ex: CI-ABJ-2024-0001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse (Siège social) *</Label>
              <Textarea
                id="address"
                {...register('address', { required: 'L\'adresse est requise' })}
                placeholder="Ex: Cocody Angré, Abidjan, Côte d'Ivoire"
                rows={2}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Ex: +225 01 23 45 67 89"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Ex: contact@cooperative.ci"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Logo de l'entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              {logoPreview && (
                <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Label htmlFor="logo">Télécharger le logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">Format: PNG, JPG. Taille recommandée: 200x200px</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Système de Prime
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bonusEnabled"
                {...register('bonusEnabled')}
                className="w-4 h-4 rounded"
              />
              <Label htmlFor="bonusEnabled" className="cursor-pointer">
                Activer le système de prime
              </Label>
            </div>

            {watch('bonusEnabled') && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="bonusMinDeliveries">Livraisons minimales</Label>
                  <Input
                    id="bonusMinDeliveries"
                    type="number"
                    {...register('bonusMinDeliveries', { valueAsNumber: true })}
                    placeholder="Ex: 6"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonusAmountPerKg">Prime (FCFA/kg)</Label>
                  <Input
                    id="bonusAmountPerKg"
                    type="number"
                    {...register('bonusAmountPerKg', { valueAsNumber: true })}
                    placeholder="Ex: 10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonusPeriodMonths">Période (mois)</Label>
                  <Input
                    id="bonusPeriodMonths"
                    type="number"
                    {...register('bonusPeriodMonths', { valueAsNumber: true })}
                    placeholder="Ex: 6"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="customMessage">Message personnalisé (affiché sur les bulletins)</Label>
              <Textarea
                id="customMessage"
                {...register('customMessage')}
                placeholder="Ex: Prime de 10 FCFA/kg après 6 livraisons"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-black text-white hover:bg-black/90">
            Enregistrer les paramètres
          </Button>
        </div>
      </form>
    </div>
  );
}
