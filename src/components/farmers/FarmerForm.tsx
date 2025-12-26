'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';

import { Farmer } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  Body1,
  Spinner,
  Dropdown,
  Option
} from '@fluentui/react-components';
import { User, Briefcase, MapPin, Upload, Save, ChevronRight, ChevronLeft, CreditCard, Globe } from 'lucide-react';

interface FarmerFormData {
  firstName: string;
  lastName: string;
  profession: string;
  city: string;
  nationality: string;
  idCardType: 'cni' | 'passport' | 'residence_permit';
  idCardNumber: string;
}

interface FarmerFormProps {
  farmer?: Farmer;
  onSuccess?: () => void;
}

export function FarmerForm({ farmer, onSuccess }: FarmerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(farmer?.photo);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFarmer = useAppStore((state) => state.addFarmer);
  const updateFarmer = useAppStore((state) => state.updateFarmer);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    watch,
    setValue
  } = useForm<FarmerFormData>({
    defaultValues: farmer
      ? {
          firstName: farmer.firstName,
          lastName: farmer.lastName,
          profession: farmer.profession,
          city: farmer.city,
          nationality: farmer.nationality,
          idCardType: farmer.idCardType,
          idCardNumber: farmer.idCardNumber,
        }
      : {
          idCardType: 'cni',
          nationality: 'Ivoirienne'
        },
  });

  const idCardType = watch('idCardType');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = async () => {
    const fieldsToValidate = ['firstName', 'lastName', 'profession', 'city'] as const;
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const onSubmit = async (data: FarmerFormData) => {
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const now = new Date().toISOString();

      if (farmer) {
        const updatedFarmer: Farmer = {
          ...farmer,
          ...data,
          photo,
          updatedAt: now,
        };

        localStorageService.updateFarmer(farmer.id, updatedFarmer);
        updateFarmer(farmer.id, updatedFarmer);
      } else {
        const newFarmer: Farmer = {
          id: crypto.randomUUID(),
          ...data,
          photo,
          createdAt: now,
          updatedAt: now,
        };

        localStorageService.addFarmer(newFarmer);
        addFarmer(newFarmer);
        reset();
        setPhoto(undefined);
        setCurrentStep(1);
      }

      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const idCardTypeLabels = {
    cni: 'Carte Nationale d\'Identité (CNI)',
    passport: 'Passeport',
    residence_permit: 'Titre de Séjour'
  };

  return (
    <Card style={{ padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <CardHeader
        header={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User className="h-5 w-5" />
              <Body1 style={{ fontWeight: 'bold' }}>
                {farmer ? translations.farmers.editFarmer : translations.farmers.addFarmer}
              </Body1>
            </div>
            <div style={{ fontSize: '14px', color: '#605e5c' }}>
              Étape {currentStep} sur 2
            </div>
          </div>
        }
      />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" style={{ marginTop: '20px' }}>
          {currentStep === 1 && (
            <>
              {/* Photo Upload */}
              <div className="space-y-2.5">
                <Label>{translations.farmers.photo}</Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {photo && (
                    <img
                      src={photo}
                      alt="Agriculteur"
                      style={{ height: '96px', width: '96px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                      disabled={isSubmitting}
                    />
                    <Button
                      appearance="outline"
                      icon={<Upload className="h-4 w-4" />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSubmitting}
                    >
                      {translations.farmers.photoUpload}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="firstName" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User className="h-4 w-4" />
                    {translations.farmers.firstName} *
                  </Label>
                  <Input
                    id="firstName"
                    appearance="underline"
                    {...register('firstName', { required: `${translations.farmers.firstName} est requis` })}
                    disabled={isSubmitting}
                    style={{ borderColor: '#d1d1d1' }}
                  />
                  {errors.firstName && (
                    <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="lastName" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User className="h-4 w-4" />
                    {translations.farmers.lastName} *
                  </Label>
                  <Input
                    id="lastName"
                    appearance="underline"
                    {...register('lastName', { required: `${translations.farmers.lastName} est requis` })}
                    disabled={isSubmitting}
                    style={{ borderColor: '#d1d1d1' }}
                  />
                  {errors.lastName && (
                    <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Profession */}
              <div className="space-y-2.5">
                <Label htmlFor="profession" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase className="h-4 w-4" />
                  {translations.farmers.profession} *
                </Label>
                <Input
                  id="profession"
                  appearance="underline"
                  {...register('profession', { required: `${translations.farmers.profession} est requise` })}
                  disabled={isSubmitting}
                  style={{ borderColor: '#d1d1d1' }}
                />
                {errors.profession && (
                  <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.profession.message}</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-2.5">
                <Label htmlFor="city" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin className="h-4 w-4" />
                  {translations.farmers.city} *
                </Label>
                <Input
                  id="city"
                  appearance="underline"
                  {...register('city', { required: `${translations.farmers.city} est requise` })}
                  disabled={isSubmitting}
                  style={{ borderColor: '#d1d1d1' }}
                />
                {errors.city && (
                  <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.city.message}</p>
                )}
              </div>

              {/* Next Button */}
              <Button
                type="button"
                appearance="primary"
                onClick={handleNextStep}
                disabled={isSubmitting}
                icon={<ChevronRight className="h-4 w-4" />}
                iconPosition="after"
                style={{
                  width: '100%',
                  backgroundColor: '#00a540',
                  color: '#fff',
                  borderRadius: '8px'
                }}
              >
                Suivant
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Nationality */}
              <div className="space-y-2.5">
                <Label htmlFor="nationality" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe className="h-4 w-4" />
                  Nationalité *
                </Label>
                <Input
                  id="nationality"
                  appearance="underline"
                  {...register('nationality', { required: 'La nationalité est requise' })}
                  disabled={isSubmitting}
                  style={{ borderColor: '#d1d1d1' }}
                />
                {errors.nationality && (
                  <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.nationality.message}</p>
                )}
              </div>

              {/* ID Card Type */}
              <div className="space-y-2.5">
                <Label htmlFor="idCardType" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard className="h-4 w-4" />
                  Type de Pièce d'Identité *
                </Label>
                <Dropdown
                  appearance="underline"
                  value={idCardTypeLabels[idCardType || 'cni']}
                  selectedOptions={[idCardType || 'cni']}
                  onOptionSelect={(_, data) => setValue('idCardType', data.optionValue as any)}
                  disabled={isSubmitting}
                  style={{ width: '100%', borderColor: '#d1d1d1' }}
                >
                  <Option value="cni">Carte Nationale d'Identité (CNI)</Option>
                  <Option value="passport">Passeport</Option>
                  <Option value="residence_permit">Titre de Séjour</Option>
                </Dropdown>
                {errors.idCardType && (
                  <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.idCardType.message}</p>
                )}
              </div>

              {/* ID Card Number */}
              <div className="space-y-2.5">
                <Label htmlFor="idCardNumber" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard className="h-4 w-4" />
                  Numéro de la Pièce d'Identité *
                </Label>
                <Input
                  id="idCardNumber"
                  appearance="underline"
                  {...register('idCardNumber', { required: 'Le numéro de pièce d\'identité est requis' })}
                  disabled={isSubmitting}
                  style={{ borderColor: '#d1d1d1' }}
                />
                {errors.idCardNumber && (
                  <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.idCardNumber.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  appearance="outline"
                  onClick={handlePreviousStep}
                  disabled={isSubmitting}
                  icon={<ChevronLeft className="h-4 w-4" />}
                  style={{
                    borderRadius: '8px'
                  }}
                >
                  Précédent
                </Button>
                <Button
                  type="submit"
                  appearance="primary"
                  disabled={isSubmitting}
                  icon={isSubmitting ? <Spinner size="tiny" /> : <Save className="h-4 w-4" />}
                  style={{
                    backgroundColor: '#00a540',
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                >
                  {isSubmitting
                    ? (farmer ? 'Mise à jour...' : 'Création...')
                    : (farmer ? 'Mettre à jour' : 'Créer')
                  }
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </Card>
  );
}
