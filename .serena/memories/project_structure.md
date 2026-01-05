# Project Structure

```
idagri/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── farmers/                  # Farmers management page
│   │   ├── planters/                 # Planters (cocoa farmers) management page
│   │   ├── plantations/              # Plantations management page
│   │   ├── employees/                # Employees management page
│   │   ├── weighings/                # Weighings tracking page
│   │   ├── credits/                  # Credits management page
│   │   ├── map/                      # Interactive map view
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components (Card, Button, Input, etc.)
│   │   ├── layout/                   # Layout components (Navigation, Providers, DataLoader)
│   │   ├── common/                   # Shared components (DataTable, PlantationMap)
│   │   ├── farmers/                  # Farmer-specific components (FarmerForm)
│   │   ├── planters/                 # Planter-specific components (PlanterForm)
│   │   ├── plantations/              # Plantation-specific components (PlantationForm)
│   │   ├── employees/                # Employee-specific components (EmployeeForm)
│   │   ├── weighings/                # Weighing-specific components (WeighingForm)
│   │   └── credits/                  # Credit-specific components (CreditForm)
│   │
│   ├── types/
│   │   └── index.ts                  # All TypeScript type definitions
│   │
│   ├── store/
│   │   └── index.ts                  # Zustand global state store
│   │
│   ├── hooks/
│   │   └── useLocalStorage.ts        # Custom hooks
│   │
│   └── lib/
│       ├── localStorage.ts           # LocalStorage service layer
│       ├── migrations.ts             # Data migration utilities
│       ├── planterUtils.ts           # Planter-specific utilities
│       ├── translations.ts           # Translation utilities
│       └── utils.ts                  # General utility functions
│
├── public/                           # Static assets
├── files/                            # File storage (likely for uploads)
├── .next/                            # Next.js build output
├── node_modules/                     # Dependencies
│
├── package.json                      # Project dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── components.json                   # shadcn/ui configuration
├── CLAUDE.md                         # Project instructions for Claude
└── README.md                         # Project documentation
```

## Key Files to Know

### Type Definitions (src/types/index.ts)
Contains all interfaces:
- Farmer, Plantation, Employee
- Planter, Weighing, Credit, Payment
- TransferOrder, RevenueStatement
- Related types and utility types

### Global Store (src/store/index.ts)
Zustand store with:
- State for all entities
- CRUD operations for each entity
- LocalStorage persistence integration

### LocalStorage Service (src/lib/localStorage.ts)
Handles all localStorage operations:
- Save/load operations for each entity type
- Data persistence layer

## Data Entities

Current entities stored in LocalStorage:
- `idagri_farmers` - Farmer records
- `idagri_plantations` - Plantation records
- `idagri_employees` - Employee records
- `idagri_planters` - Planter (cocoa farmer) records
- `idagri_weighings` - Weighing records
- `idagri_credits` - Credit records
- `idagri_payments` - Payment records
- `idagri_transfer_orders` - Transfer order records

To be added (per TODO):
- Transporters
- Vehicles
- Banks
- Credit Installments
- Bulletins
- Company Settings
- Mandataries