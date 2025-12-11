import { LatLngExpression } from 'leaflet';

export interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string; // Base64 encoded image
  profession: string;
  city: string;
  numberOfEmployees: number;
  createdAt: string;
  updatedAt: string;
}

export interface Plantation {
  id: string;
  farmerId: string;
  name: string;
  crops: string[]; // Array of crop types
  area: number; // in hectares
  city: string;
  latitude: number;
  longitude: number;
  polygon?: LatLngExpression[]; // Polygon coordinates for the plantation outline
  employeeIds: string[]; // Employees working on this plantation
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  city: string;
  plantationIds: string[]; // Plantations where this employee works
  createdAt: string;
  updatedAt: string;
}

export interface PlantationWithFarmer extends Plantation {
  farmer: Farmer;
}

export interface FarmerWithPlantations extends Farmer {
  plantations: Plantation[];
}

export type SortDirection = 'asc' | 'desc';

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
