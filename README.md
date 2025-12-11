# IdAgri - Farmer Identification System

A comprehensive web application for managing farmers, plantations, and employees with interactive mapping capabilities.

## Features

### Farmer Management
- **Registration**: Record farmer details including first name, last name, profession, city, and number of employees
- **Photo Upload**: Import and store farmer photos (base64 encoded)
- **QR Code Generation**: Generate unique QR codes for each farmer that link directly to their profile
- **Data Table**: View all farmers in a sortable, paginated table with search capabilities

### Plantation Management
- **Plantation Registration**: Record plantation details including:
  - Name and assigned farmer
  - Crops grown (comma-separated)
  - Area in hectares
  - City location
  - GPS coordinates (latitude/longitude)
- **Polygon Drawing**: Define plantation boundaries by adding multiple GPS points to create geometric shapes
- **Employee Assignment**: Assign multiple employees to work on specific plantations
- **City Filtering**: Filter plantations by city name
- **Interactive Tables**: View all plantations with pagination and filtering

### Employee Management
- **Employee Records**: Track employee information including:
  - First name and last name
  - Position/role
  - City
  - Assigned plantations (multiple assignments supported)
- **Assignment Tracking**: See which plantations each employee works on

### Interactive Map
- **Leaflet Integration**: View all plantations on an interactive map
- **Marker Popups**: Hover over markers to see plantation details including:
  - Plantation name
  - Owner information
  - Crops grown
  - Area
  - City
- **Polygon Visualization**: View plantation boundaries as colored polygons on the map
- **City Filtering**: Filter map view by city
- **Statistics Panel**: Real-time statistics showing:
  - Total plantations
  - Total area
  - Number of cities
  - Filtered statistics

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Data Fetching**: TanStack Query (React Query)
- **Mapping**: Leaflet
- **QR Codes**: qrcode.react
- **Icons**: Lucide React
- **Storage**: Local Storage (client-side)
- **Type Safety**: TypeScript

## Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── farmers/             # Farmers list and management
│   ├── plantations/         # Plantations list and management
│   ├── employees/           # Employees list and management
│   ├── map/                 # Interactive map view
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Home page
├── components/
│   ├── common/              # Shared components
│   │   ├── DataTable.tsx    # Reusable table with pagination
│   │   └── PlantationMap.tsx # Leaflet map component
│   ├── farmers/             # Farmer-specific components
│   │   └── FarmerForm.tsx
│   ├── plantations/         # Plantation-specific components
│   │   └── PlantationForm.tsx
│   ├── employees/           # Employee-specific components
│   │   └── EmployeeForm.tsx
│   ├── layout/              # Layout components
│   │   ├── Navigation.tsx   # Main navigation
│   │   ├── Providers.tsx    # React Query provider
│   │   └── DataLoader.tsx   # LocalStorage data loader
│   └── ui/                  # shadcn/ui components
├── store/                   # Zustand store
│   └── index.ts
├── hooks/                   # Custom React hooks
│   └── useLocalStorage.ts
├── lib/                     # Utility functions
│   ├── localStorage.ts      # LocalStorage service
│   └── utils.ts             # Helper functions
└── types/                   # TypeScript type definitions
    └── index.ts
```

## Getting Started

### Prerequisites
- Node.js 20 or later
- npm, yarn, or bun

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage Guide

### Adding a Farmer
1. Navigate to the Farmers page
2. Click "Add Farmer"
3. Fill in the required information:
   - First and last name
   - Profession
   - City
   - Number of employees
   - (Optional) Upload a photo
4. Click "Create Farmer"
5. A QR code will be generated automatically

### Adding a Plantation
1. Navigate to the Plantations page
2. Click "Add Plantation"
3. Fill in the required information:
   - Plantation name
   - Select farmer (owner)
   - Enter crops (comma-separated)
   - Area in hectares
   - City
   - Latitude and longitude
4. (Optional) Add polygon points by:
   - Entering coordinates
   - Clicking "Add Point"
   - Repeat to create a boundary shape
5. (Optional) Select employees who work on this plantation
6. Click "Create Plantation"

### Adding Employees
1. Navigate to the Employees page
2. Click "Add Employee"
3. Fill in the required information:
   - First and last name
   - Position
   - City
4. Click "Create Employee"
5. Assign to plantations through the Plantation form

### Viewing the Map
1. Navigate to the Map page
2. All plantations are displayed as markers
3. Hover over markers to see details
4. Polygons show plantation boundaries (if defined)
5. Use the city filter to narrow the view
6. Click on a marker to see detailed information in the sidebar

## Data Persistence

All data is stored in the browser's LocalStorage:
- `idagri_farmers`: Farmer records
- `idagri_plantations`: Plantation records
- `idagri_employees`: Employee records

Data persists across browser sessions but is specific to each browser/device.

## Features Implemented

✅ Farmer registration with photo upload
✅ QR code generation for farmers
✅ Plantation management with GPS coordinates
✅ Polygon drawing for plantation boundaries
✅ Employee management and assignment
✅ Interactive Leaflet map with markers and polygons
✅ Filtering by city
✅ Reusable data table component with pagination
✅ Skeleton loading states
✅ Form validation
✅ Loading indicators on buttons
✅ Icons throughout the UI
✅ Responsive design
✅ LocalStorage persistence

## Future Enhancements

- Export data to CSV/PDF
- Print farmer profiles with QR codes
- Advanced search and filtering
- Data import functionality
- Multi-language support
- Role-based access control
- Cloud synchronization
- Mobile app integration

## License

This project is licensed under the MIT License.
