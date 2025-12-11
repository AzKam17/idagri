'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store';


import { PlantationWithFarmer } from '@/types';
import { PlantationMap } from '@/components/common/PlantationMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Map as MapIcon, Search, Sprout, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const PlantationMapDynamic = dynamic(
  () => import('@/components/common/PlantationMap').then(mod => mod.PlantationMap),
  { ssr: false }
);

export default function MapPage() {
  const plantations = useAppStore((state) => state.plantations);
  const farmers = useAppStore((state) => state.farmers);
  const [cityFilter, setCityFilter] = useState('');
  const [selectedPlantation, setSelectedPlantation] = useState<PlantationWithFarmer | null>(null);

  const plantationsWithFarmers: PlantationWithFarmer[] = useMemo(() => {
    return plantations.map(plantation => {
      const farmer = farmers.find(f => f.id === plantation.farmerId);
      return {
        ...plantation,
        farmer: farmer || {
          id: '',
          firstName: 'Unknown',
          lastName: 'Farmer',
          profession: '',
          city: '',
          numberOfEmployees: 0,
          createdAt: '',
          updatedAt: '',
        },
      };
    });
  }, [plantations, farmers]);

  const filteredPlantations = cityFilter
    ? plantationsWithFarmers.filter(p =>
        p.city.toLowerCase().includes(cityFilter.toLowerCase())
      )
    : plantationsWithFarmers;

  const cities = [...new Set(plantations.map(p => p.city))].sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MapIcon className="h-8 w-8" />
          Plantation Map
        </h1>
        <p className="text-muted-foreground">
          View all plantations on an interactive map
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {filteredPlantations.length > 0 ? (
                <PlantationMapDynamic
                  plantations={filteredPlantations}
                  onPlantationClick={setSelectedPlantation}
                />
              ) : (
                <div className="h-[600px] rounded-lg border flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-2">
                    <MapIcon className="h-12 w-12 mx-auto opacity-50" />
                    <p>No plantations to display</p>
                    {cityFilter && (
                      <p className="text-sm">Try clearing the city filter</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cityFilter">Filter by City</Label>
                <Input
                  id="cityFilter"
                  placeholder="Enter city name..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                />
                {cityFilter && (
                  <p className="text-xs text-muted-foreground">
                    Showing {filteredPlantations.length} plantation(s)
                  </p>
                )}
              </div>

              {cities.length > 0 && (
                <div className="space-y-2">
                  <Label>Available Cities</Label>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {cities.map(city => (
                      <button
                        key={city}
                        onClick={() => setCityFilter(city)}
                        className="w-full text-left px-2 py-1 rounded hover:bg-muted text-sm transition-colors"
                      >
                        <MapPin className="h-3 w-3 inline mr-2" />
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sprout className="h-5 w-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Plantations</p>
                <p className="text-2xl font-bold">{plantations.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Area</p>
                <p className="text-2xl font-bold">
                  {plantations.reduce((sum, p) => sum + p.area, 0).toFixed(2)} ha
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cities</p>
                <p className="text-2xl font-bold">{cities.length}</p>
              </div>
              {cityFilter && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">Filtered Area</p>
                  <p className="text-2xl font-bold">
                    {filteredPlantations.reduce((sum, p) => sum + p.area, 0).toFixed(2)} ha
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedPlantation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Plantation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedPlantation.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Owner</p>
                  <p className="font-medium">
                    {selectedPlantation.farmer.firstName} {selectedPlantation.farmer.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Crops</p>
                  <p className="font-medium">{selectedPlantation.crops.join(', ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Area</p>
                  <p className="font-medium">{selectedPlantation.area} ha</p>
                </div>
                <div>
                  <p className="text-muted-foreground">City</p>
                  <p className="font-medium">{selectedPlantation.city}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
