'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';

import { Plantation } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sprout,
  MapPin,
  Maximize,
  User,
  Users,
  Loader2,
  Save,
  Map as MapIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LatLngExpression } from 'leaflet';

interface PlantationFormData {
  name: string;
  farmerId: string;
  crops: string;
  area: number;
  city: string;
  latitude: number;
  longitude: number;
  employeeIds: string[];
}

interface PlantationFormProps {
  plantation?: Plantation;
  onSuccess?: () => void;
}

export function PlantationForm({ plantation, onSuccess }: PlantationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState<LatLngExpression[]>(
    plantation?.polygon || []
  );
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const farmers = useAppStore((state) => state.farmers);
  const employees = useAppStore((state) => state.employees);
  const addPlantation = useAppStore((state) => state.addPlantation);
  const updatePlantation = useAppStore((state) => state.updatePlantation);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<PlantationFormData>({
    defaultValues: plantation
      ? {
          name: plantation.name,
          farmerId: plantation.farmerId,
          crops: plantation.crops.join(', '),
          area: plantation.area,
          city: plantation.city,
          latitude: plantation.latitude,
          longitude: plantation.longitude,
          employeeIds: plantation.employeeIds,
        }
      : undefined,
  });

  const selectedEmployeeIds = watch('employeeIds') || [];

  const handleAddPolygonPoint = () => {
    const lat = watch('latitude');
    const lng = watch('longitude');
    if (lat && lng) {
      setPolygonPoints(prev => [...prev, [Number(lat), Number(lng)]]);
    }
  };

  const handleClearPolygon = () => {
    setPolygonPoints([]);
  };

  const onSubmit = async (data: PlantationFormData) => {
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const now = new Date().toISOString();
      const cropsArray = data.crops.split(',').map(c => c.trim()).filter(Boolean);

      if (plantation) {
        const updatedPlantation: Plantation = {
          ...plantation,
          name: data.name,
          farmerId: data.farmerId,
          crops: cropsArray,
          area: Number(data.area),
          city: data.city,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          polygon: polygonPoints.length > 0 ? polygonPoints : undefined,
          employeeIds: data.employeeIds,
          updatedAt: now,
        };

        localStorageService.updatePlantation(plantation.id, updatedPlantation);
        updatePlantation(plantation.id, updatedPlantation);
      } else {
        const newPlantation: Plantation = {
          id: crypto.randomUUID(),
          name: data.name,
          farmerId: data.farmerId,
          crops: cropsArray,
          area: Number(data.area),
          city: data.city,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          polygon: polygonPoints.length > 0 ? polygonPoints : undefined,
          employeeIds: data.employeeIds,
          createdAt: now,
          updatedAt: now,
        };

        localStorageService.addPlantation(newPlantation);
        addPlantation(newPlantation);
        reset();
        setPolygonPoints([]);
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
          <Sprout className="h-5 w-5" />
          {plantation ? translations.plantations.editPlantation : translations.plantations.addPlantation}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          {/* Plantation Name */}
          <div className="space-y-2.5">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              {translations.plantations.name} *
            </Label>
            <Input
              id="name"
              {...register('name', { required: `${translations.plantations.name} est requis` })}
              disabled={isSubmitting}
              className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Farmer Selection */}
          <div className="space-y-2.5">
            <Label htmlFor="farmerId" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {translations.plantations.farmer} *
            </Label>
            <Controller
              name="farmerId"
              control={control}
              rules={{ required: `${translations.plantations.farmer} est requis` }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
                  >
                    <SelectValue placeholder={translations.plantations.selectFarmer} />
                  </SelectTrigger>
                  <SelectContent>
                    {farmers.map(farmer => (
                      <SelectItem key={farmer.id} value={farmer.id}>
                        {farmer.firstName} {farmer.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.farmerId && (
              <p className="text-sm text-destructive">{errors.farmerId.message}</p>
            )}
          </div>

          {/* Crops */}
          <div className="space-y-2.5">
            <Label htmlFor="crops" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              {translations.plantations.crops} *
            </Label>
            <Input
              id="crops"
              placeholder={translations.plantations.cropsPlaceholder}
              {...register('crops', { required: 'Au moins une culture est requise' })}
              disabled={isSubmitting}
              className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
            />
            <p className="text-sm text-muted-foreground">{translations.plantations.cropsDesc}</p>
            {errors.crops && (
              <p className="text-sm text-destructive">{errors.crops.message}</p>
            )}
          </div>

          {/* Area and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="area" className="flex items-center gap-2">
                <Maximize className="h-4 w-4" />
                {translations.plantations.area} (hectares) *
              </Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                min="0"
                {...register('area', {
                  required: `${translations.plantations.area} est requise`,
                  min: { value: 0, message: 'La superficie doit être positive' },
                })}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
              />
              {errors.area && (
                <p className="text-sm text-destructive">{errors.area.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="city" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {translations.plantations.city} *
              </Label>
              <Input
                id="city"
                {...register('city', { required: `${translations.plantations.city} est requise` })}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="latitude" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {translations.plantations.latitude} *
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                {...register('latitude', {
                  required: `${translations.plantations.latitude} est requise`,
                  min: { value: -90, message: 'Latitude invalide' },
                  max: { value: 90, message: 'Latitude invalide' },
                })}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
              />
              {errors.latitude && (
                <p className="text-sm text-destructive">{errors.latitude.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="longitude" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {translations.plantations.longitude} *
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                {...register('longitude', {
                  required: `${translations.plantations.longitude} est requise`,
                  min: { value: -180, message: 'Longitude invalide' },
                  max: { value: 180, message: 'Longitude invalide' },
                })}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'bg-muted cursor-not-allowed')}
              />
              {errors.longitude && (
                <p className="text-sm text-destructive">{errors.longitude.message}</p>
              )}
            </div>
          </div>

          {/* Polygon Drawing */}
          <div className="space-y-2.5">
            <Label className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              Contour de la Plantation
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddPolygonPoint}
                disabled={isSubmitting}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {translations.plantations.addPolygonPoint} ({polygonPoints.length})
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearPolygon}
                disabled={isSubmitting || polygonPoints.length === 0}
              >
                Effacer le Polygone
              </Button>
            </div>
            {polygonPoints.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {polygonPoints.length} point(s) ajouté(s) au polygone
              </p>
            )}
          </div>

          {/* Employee Selection */}
          <div className="space-y-2.5">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {translations.plantations.employees}
            </Label>
            <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
              {employees.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun employé disponible</p>
              ) : (
                <Controller
                  name="employeeIds"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <>
                      {employees.map(employee => (
                        <div key={employee.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={employee.id}
                            checked={field.value?.includes(employee.id)}
                            onCheckedChange={checked => {
                              const newValue = checked
                                ? [...(field.value || []), employee.id]
                                : (field.value || []).filter(id => id !== employee.id);
                              field.onChange(newValue);
                            }}
                            disabled={isSubmitting}
                          />
                          <label
                            htmlFor={employee.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {employee.firstName} {employee.lastName} - {employee.position}
                          </label>
                        </div>
                      ))}
                    </>
                  )}
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {plantation ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {plantation ? 'Mettre à jour' : 'Créer'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
