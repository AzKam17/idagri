'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';

import { Plantation } from '@/types';
import { localStorageService } from '@/lib/localStorage';
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  Body1,
  Spinner,
  Checkbox,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import {
  Sprout,
  MapPin,
  Maximize,
  User,
  Users,
  Save,
  Map as MapIcon,
} from 'lucide-react';
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
    <Card style={{ padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <CardHeader
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sprout className="h-5 w-5" />
            <Body1 style={{ fontWeight: 'bold' }}>
              {plantation ? translations.plantations.editPlantation : translations.plantations.addPlantation}
            </Body1>
          </div>
        }
      />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" style={{ marginTop: '20px' }}>
          {/* Plantation Name */}
          <div className="space-y-2.5">
            <Label htmlFor="name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sprout className="h-4 w-4" />
              {translations.plantations.name} *
            </Label>
            <Input
              id="name"
              {...register('name', { required: `${translations.plantations.name} est requis` })}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.name.message}</p>
            )}
          </div>

          {/* Farmer Selection */}
          <div className="space-y-2.5">
            <Label htmlFor="farmerId" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User className="h-4 w-4" />
              {translations.plantations.farmer} *
            </Label>
            <Controller
              name="farmerId"
              control={control}
              rules={{ required: `${translations.plantations.farmer} est requis` }}
              render={({ field }) => (
                <Dropdown
                  placeholder={translations.plantations.selectFarmer}
                  value={farmers.find(f => f.id === field.value) ? `${farmers.find(f => f.id === field.value)?.firstName} ${farmers.find(f => f.id === field.value)?.lastName}` : ''}
                  onOptionSelect={(_, data) => field.onChange(data.optionValue)}
                  disabled={isSubmitting}
                  style={{ width: '100%' }}
                >
                  {farmers.map(farmer => (
                    <Option key={farmer.id} value={farmer.id} text={`${farmer.firstName} ${farmer.lastName}`}>
                      {farmer.firstName} {farmer.lastName}
                    </Option>
                  ))}
                </Dropdown>
              )}
            />
            {errors.farmerId && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.farmerId.message}</p>
            )}
          </div>

          {/* Crops */}
          <div className="space-y-2.5">
            <Label htmlFor="crops" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sprout className="h-4 w-4" />
              {translations.plantations.crops} *
            </Label>
            <Input
              id="crops"
              placeholder={translations.plantations.cropsPlaceholder}
              {...register('crops', { required: 'Au moins une culture est requise' })}
              disabled={isSubmitting}
            />
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{translations.plantations.cropsDesc}</p>
            {errors.crops && (
              <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.crops.message}</p>
            )}
          </div>

          {/* Area and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="area" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              />
              {errors.area && (
                <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.area.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="city" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin className="h-4 w-4" />
                {translations.plantations.city} *
              </Label>
              <Input
                id="city"
                {...register('city', { required: `${translations.plantations.city} est requise` })}
                disabled={isSubmitting}
              />
              {errors.city && (
                <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="latitude" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              />
              {errors.latitude && (
                <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.latitude.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="longitude" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              />
              {errors.longitude && (
                <p style={{ fontSize: '12px', color: '#d13438', marginTop: '4px' }}>{errors.longitude.message}</p>
              )}
            </div>
          </div>

          {/* Polygon Drawing */}
          <div className="space-y-2.5">
            <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapIcon className="h-4 w-4" />
              Contour de la Plantation
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                appearance="outline"
                icon={<MapPin className="h-4 w-4" />}
                onClick={handleAddPolygonPoint}
                disabled={isSubmitting}
              >
                {translations.plantations.addPolygonPoint} ({polygonPoints.length})
              </Button>
              <Button
                type="button"
                appearance="outline"
                onClick={handleClearPolygon}
                disabled={isSubmitting || polygonPoints.length === 0}
              >
                Effacer le Polygone
              </Button>
            </div>
            {polygonPoints.length > 0 && (
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                {polygonPoints.length} point(s) ajouté(s) au polygone
              </p>
            )}
          </div>

          {/* Employee Selection */}
          <div className="space-y-2.5">
            <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users className="h-4 w-4" />
              {translations.plantations.employees}
            </Label>
            <div style={{ borderRadius: '8px', padding: '16px', maxHeight: '12rem', overflowY: 'auto' }}>
              {employees.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Aucun employé disponible</p>
              ) : (
                <Controller
                  name="employeeIds"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {employees.map(employee => (
                        <div key={employee.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Checkbox
                            id={employee.id}
                            checked={field.value?.includes(employee.id)}
                            onChange={(_, data) => {
                              const checked = data.checked;
                              const newValue = checked
                                ? [...(field.value || []), employee.id]
                                : (field.value || []).filter(id => id !== employee.id);
                              field.onChange(newValue);
                            }}
                            disabled={isSubmitting}
                          />
                          <label
                            htmlFor={employee.id}
                            style={{ fontSize: '14px', fontWeight: '500', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                          >
                            {employee.firstName} {employee.lastName} - {employee.position}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                />
              )}
            </div>
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
              ? (plantation ? 'Mise à jour...' : 'Création...')
              : (plantation ? 'Mettre à jour' : 'Créer')
            }
          </Button>
        </form>
      </div>
    </Card>
  );
}
