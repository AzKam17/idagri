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
  Spinner,
  Dropdown,
  Option
} from '@fluentui/react-components';
import { User, Briefcase, MapPin, Upload, Save, ChevronRight, ChevronLeft, CreditCard, Globe, Camera } from 'lucide-react';

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
    <div style={{ position: 'relative' }}>
      {/* Loading Indicator */}
      {isSubmitting && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
          animation: 'shimmer 1.5s infinite',
          zIndex: 10,
          borderRadius: '8px 8px 0 0'
        }} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User className="h-5 w-5" />
          <h2 style={{ fontWeight: '600', fontSize: '20px', margin: 0 }}>
            {farmer ? translations.farmers.editFarmer : translations.farmers.addFarmer}
          </h2>
        </div>
        <div style={{ fontSize: '14px', color: '#605e5c', fontWeight: '500' }}>
          Étape {currentStep} sur 2
        </div>
      </div>

      {/* Form */}
      <div style={{ minHeight: '520px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Photo Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid #f0f0f0' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                  disabled={isSubmitting}
                />
                {photo ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      height: '120px',
                      width: '120px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                  >
                    <img
                      src={photo}
                      alt="Agriculteur"
                      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      height: '120px',
                      width: '120px',
                      borderRadius: '50%',
                      background: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '2px dashed #d1d1d1'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ebebeb';
                      e.currentTarget.style.borderColor = '#00a540';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f5f5f5';
                      e.currentTarget.style.borderColor = '#d1d1d1';
                    }}
                  >
                    <Camera style={{ width: '40px', height: '40px', color: '#8a8886' }} />
                  </div>
                )}
                <Label style={{ fontSize: '14px', color: '#605e5c', textAlign: 'center' }}>
                  {photo ? 'Cliquer pour changer la photo' : 'Cliquer pour ajouter une photo'}
                </Label>
              </div>

              {/* Name Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Label htmlFor="firstName" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#323130' }}>
                    <User className="h-4 w-4" style={{ color: '#605e5c' }} />
                    {translations.farmers.firstName} *
                  </Label>
                  <Input
                    id="firstName"
                    appearance="underline"
                    {...register('firstName', { required: `${translations.farmers.firstName} est requis` })}
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <p style={{ fontSize: '12px', color: '#d13438', marginTop: '2px' }}>{errors.firstName.message}</p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Label htmlFor="lastName" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#323130' }}>
                    <User className="h-4 w-4" style={{ color: '#605e5c' }} />
                    {translations.farmers.lastName} *
                  </Label>
                  <Input
                    id="lastName"
                    appearance="underline"
                    {...register('lastName', { required: `${translations.farmers.lastName} est requis` })}
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p style={{ fontSize: '12px', color: '#d13438', marginTop: '2px' }}>{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Profession */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="profession" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#323130' }}>
                  <Briefcase className="h-4 w-4" style={{ color: '#605e5c' }} />
                  {translations.farmers.profession} *
                </Label>
                <Input
                  id="profession"
                  appearance="underline"
                  {...register('profession', { required: `${translations.farmers.profession} est requise` })}
                  disabled={isSubmitting}
                />
                {errors.profession && (
                  <p style={{ fontSize: '12px', color: '#d13438', marginTop: '2px' }}>{errors.profession.message}</p>
                )}
              </div>

              {/* City */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="city" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#323130' }}>
                  <MapPin className="h-4 w-4" style={{ color: '#605e5c' }} />
                  {translations.farmers.city} *
                </Label>
                <Input
                  id="city"
                  appearance="underline"
                  {...register('city', { required: `${translations.farmers.city} est requise` })}
                  disabled={isSubmitting}
                />
                {errors.city && (
                  <p style={{ fontSize: '12px', color: '#d13438', marginTop: '2px' }}>{errors.city.message}</p>
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
                  borderRadius: '8px',
                  height: '44px',
                  fontSize: '15px',
                  fontWeight: '600',
                  marginTop: '12px'
                }}
              >
                Suivant
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Nationality */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="nationality" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#323130' }}>
                  <Globe className="h-4 w-4" style={{ color: '#605e5c' }} />
                  Nationalité *
                </Label>
                <Input
                  id="nationality"
                  appearance="underline"
                  {...register('nationality', { required: 'La nationalité est requise' })}
                  disabled={isSubmitting}
                />
                {errors.nationality && (
                  <p style={{ fontSize: '12px', color: '#d13438', marginTop: '2px' }}>{errors.nationality.message}</p>
                )}
              </div>

              {/* ID Card Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="idCardType" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#323130' }}>
                  <CreditCard className="h-4 w-4" style={{ color: '#605e5c' }} />
                  Type de Pièce d'Identité *
                </Label>
                <Dropdown
                  appearance="underline"
                  value={idCardTypeLabels[idCardType || 'cni']}
                  selectedOptions={[idCardType || 'cni']}
                  onOptionSelect={(_, data) => setValue('idCardType', data.optionValue as any)}
                  disabled={isSubmitting}
                  style={{ width: '100%' }}
                >
                  <Option value="cni">Carte Nationale d'Identité (CNI)</Option>
                  <Option value="passport">Passeport</Option>
                  <Option value="residence_permit">Titre de Séjour</Option>
                </Dropdown>
                {errors.idCardType && (
                  <p style={{ fontSize: '12px', color: '#d13438', marginTop: '2px' }}>{errors.idCardType.message}</p>
                )}
              </div>

              {/* ID Card Number */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="idCardNumber" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#323130' }}>
                  <CreditCard className="h-4 w-4" style={{ color: '#605e5c' }} />
                  Numéro de la Pièce d'Identité *
                </Label>
                <Input
                  id="idCardNumber"
                  appearance="underline"
                  {...register('idCardNumber', { required: 'Le numéro de pièce d\'identité est requis' })}
                  disabled={isSubmitting}
                />
                {errors.idCardNumber && (
                  <p style={{ fontSize: '12px', color: '#d13438', marginTop: '2px' }}>{errors.idCardNumber.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                <Button
                  type="button"
                  appearance="outline"
                  onClick={handlePreviousStep}
                  disabled={isSubmitting}
                  icon={<ChevronLeft className="h-4 w-4" />}
                  style={{
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '15px',
                    fontWeight: '600'
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
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '15px',
                    fontWeight: '600'
                  }}
                >
                  {isSubmitting
                    ? (farmer ? 'Mise à jour...' : 'Création...')
                    : (farmer ? 'Mettre à jour' : 'Créer')
                  }
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
