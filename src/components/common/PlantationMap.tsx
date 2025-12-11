'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PlantationWithFarmer } from '@/types';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface PlantationMapProps {
  plantations: PlantationWithFarmer[];
  center?: [number, number];
  zoom?: number;
  onPlantationClick?: (plantation: PlantationWithFarmer) => void;
}

export function PlantationMap({
  plantations,
  center = [0, 0],
  zoom = 2,
  onPlantationClick,
}: PlantationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(center, zoom);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear existing layers (except tile layer)
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon) {
        map.removeLayer(layer);
      }
    });

    if (plantations.length === 0) return;

    const bounds = L.latLngBounds([]);

    plantations.forEach(plantation => {
      const { latitude, longitude, polygon, farmer, name, crops, area } = plantation;

      // Add marker
      const marker = L.marker([latitude, longitude]);

      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold text-lg mb-1">${name}</h3>
          <p class="text-sm"><strong>Owner:</strong> ${farmer.firstName} ${farmer.lastName}</p>
          <p class="text-sm"><strong>Crops:</strong> ${crops.join(', ')}</p>
          <p class="text-sm"><strong>Area:</strong> ${area} ha</p>
          <p class="text-sm"><strong>City:</strong> ${plantation.city}</p>
        </div>
      `;

      marker.bindPopup(popupContent);

      if (onPlantationClick) {
        marker.on('click', () => onPlantationClick(plantation));
      }

      marker.addTo(map);
      bounds.extend([latitude, longitude]);

      // Add polygon if it exists
      if (polygon && polygon.length > 0) {
        const polygonLayer = L.polygon(polygon as L.LatLngExpression[], {
          color: '#16a34a',
          fillColor: '#22c55e',
          fillOpacity: 0.3,
          weight: 2,
        });

        polygonLayer.bindPopup(popupContent);

        if (onPlantationClick) {
          polygonLayer.on('click', () => onPlantationClick(plantation));
        }

        polygonLayer.addTo(map);
        polygon.forEach(point => {
          if (Array.isArray(point)) {
            bounds.extend(point as L.LatLngExpression);
          }
        });
      }
    });

    // Fit map to bounds if there are plantations
    if (plantations.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [plantations, onPlantationClick]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[600px] rounded-lg border shadow-sm"
      style={{ zIndex: 0 }}
    />
  );
}
