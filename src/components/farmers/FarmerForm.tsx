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
  Spinner
} from '@fluentui/react-components';
import { User, Briefcase, MapPin, Users, Upload, Loader2, Save } from 'lucide-react';

interface FarmerFormData {
  firstName: string;
  lastName: string;
  profession: string;
  city: string;
  numberOfEmployees: number;
}

interface FarmerFormProps {
  farmer?: Farmer;
  onSuccess?: () => void;
}

export function FarmerForm({ farmer, onSuccess }: FarmerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(farmer?.photo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFarmer = useAppStore((state) => state.addFarmer);
  const updateFarmer = useAppStore((state) => state.updateFarmer);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FarmerFormData>({
    defaultValues: farmer
      ? {
          firstName: farmer.firstName,
          lastName: farmer.lastName,
          profession: farmer.profession,
          city: farmer.city,
          numberOfEmployees: farmer.numberOfEmployees,
        }
      : undefined,
  });

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

  const onSubmit = async (data: FarmerFormData) => {
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation

      const now = new Date().toISOString();

      if (farmer) {
        // Update existing farmer
        const updatedFarmer: Farmer = {
          ...farmer,
          ...data,
          photo,
          updatedAt: now,
        };

        localStorageService.updateFarmer(farmer.id, updatedFarmer);
        updateFarmer(farmer.id, updatedFarmer);
      } else {
        // Create new farmer
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
      }

      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={{ padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <CardHeader
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User className="h-5 w-5" />
            <Body1 style={{ fontWeight: 'bold' }}>
              {farmer ? translations.farmers.editFarmer : translations.farmers.addFarmer}
            </Body1>
          </div>
        }
      />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" style={{ marginTop: '20px' }}>
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
                {...register('firstName', { required: `${translations.farmers.firstName} est requis` })}
                disabled={isSubmitting}
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
                {...register('lastName', { required: `${translations.farmers.lastName} est requis` })}
                disabled={isSubmitting}
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
              {...register('profession', { required: `${translations.farmers.profession} est requise` })}
              disabled={isSubmitting}
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
              {...register('city', { required: `${translations.farmers.city} est requise` })}
              disabled={isSubmitting}
            />
            {errors.city && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.city.message}</p>
            )}
          </div>

          {/* Number of Employees */}
          <div className="space-y-2.5">
            <Label htmlFor="numberOfEmployees" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users className="h-4 w-4" />
              {translations.farmers.numberOfEmployees} *
            </Label>
            <Input
              id="numberOfEmployees"
              type="number"
              min="0"
              {...register('numberOfEmployees', {
                required: `${translations.farmers.numberOfEmployees} est requis`,
                min: { value: 0, message: 'Doit être au moins 0' },
              })}
              disabled={isSubmitting}
            />
            {errors.numberOfEmployees && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>
                {errors.numberOfEmployees.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            appearance="primary"
            disabled={isSubmitting}
            icon={isSubmitting ? <Spinner size="tiny" /> : <Save className="h-4 w-4" />}
            style={{
              width: '100%',
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
        </form>
      </div>
    </Card>
  );
}
