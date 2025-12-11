'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';

import { Farmer } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, MapPin, Users, Upload, Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {farmer ? translations.farmers.editFarmer : translations.farmers.addFarmer}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          {/* Photo Upload */}
          <div className="space-y-2.5">
            <Label>{translations.farmers.photo}</Label>
            <div className="flex items-center gap-4">
              {photo && (
                <img
                  src={photo}
                  alt="Agriculteur"
                  className="h-24 w-24 rounded-full object-cover border-2 shadow-md"
                />
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {translations.farmers.photoUpload}
                </Button>
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {translations.farmers.firstName} *
              </Label>
              <Input
                id="firstName"
                {...register('firstName', { required: `${translations.farmers.firstName} est requis` })}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {translations.farmers.lastName} *
              </Label>
              <Input
                id="lastName"
                {...register('lastName', { required: `${translations.farmers.lastName} est requis` })}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Profession */}
          <div className="space-y-2.5">
            <Label htmlFor="profession" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {translations.farmers.profession} *
            </Label>
            <Input
              id="profession"
              {...register('profession', { required: `${translations.farmers.profession} est requise` })}
              disabled={isSubmitting}
              className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
            />
            {errors.profession && (
              <p className="text-sm text-destructive">{errors.profession.message}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2.5">
            <Label htmlFor="city" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {translations.farmers.city} *
            </Label>
            <Input
              id="city"
              {...register('city', { required: `${translations.farmers.city} est requise` })}
              disabled={isSubmitting}
              className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>

          {/* Number of Employees */}
          <div className="space-y-2.5">
            <Label htmlFor="numberOfEmployees" className="flex items-center gap-2">
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
              className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
            />
            {errors.numberOfEmployees && (
              <p className="text-sm text-destructive">
                {errors.numberOfEmployees.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {farmer ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {farmer ? 'Mettre à jour' : 'Créer'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
