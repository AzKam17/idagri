# Code Style & Conventions

## General Guidelines (from CLAUDE.md)
1. Use tanstack for caching and data fetching
2. Use react-hook-form for form handling
3. Use zustand for state management
4. Use shadcn/ui for UI components
5. Use tailwindcss for styling
6. Save everything in local storage (no backend)
7. For maps use leaflet
8. Use Next.js App Router for routing
9. Use typescript for type safety
10. Do not mention claude in commits
11. Start each commit with "feat:", "fix:", "docs:", or "chore:" followed by brief description
12. Make one line comments for commits
13. Ensure all components are functional components using React hooks
14. Use leaflet for map rendering and interactions

## Design System
- **No solid borders** - avoid hard borders in design
- **Light shadows** for depth
- **Black backgrounds** for buttons with white text
- **Rounded corners** for all UI elements
- **Consistent spacing** and padding throughout
- **Accessibility standards** must be met

## Component Patterns
- All components are functional components
- Use TypeScript interfaces for props
- Export types alongside components
- Use React Hook Form for all forms
- Use Zod for form validation schemas

## State Management Pattern
- Global state in Zustand store (src/store/index.ts)
- LocalStorage persistence for data entities
- Pattern: State updates trigger LocalStorage saves automatically

## Naming Conventions
- Components: PascalCase (e.g., FarmerForm.tsx)
- Files: kebab-case for utilities, PascalCase for components
- Interfaces: PascalCase with descriptive names
- Types: PascalCase, use 'Type' suffix for union types (e.g., CreditType)

## File Organization
- Group by feature in src/app/ (Next.js pages)
- Components organized by feature in src/components/
- Shared UI components in src/components/ui/
- Common/reusable components in src/components/common/
- Types centralized in src/types/index.ts
- Utils in src/lib/

## Dropdown/Select Components
- Use autocomplete for all dropdowns (per user instruction)
- Leverage shadcn/ui select with search/filter capabilities