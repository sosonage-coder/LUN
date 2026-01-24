# Non-Monetary Schedule Engine

## Overview

A deterministic, auditable scheduling engine for allocating non-monetary costs over time. The system manages prepaid expenses and fixed assets with full audit trails, supporting multi-currency display while maintaining reporting currency as the source of truth.

Core capabilities:
- Schedule creation with straight-line amortization
- Event-driven adjustments (amount changes, timeline modifications)
- Late onboarding support for mid-cycle schedule starts
- Period-based allocation with closed period protection
- Dual currency display (reporting currency for calculations, local currency for context)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ESM modules
- **API Pattern**: REST endpoints under /api prefix
- **Development**: Vite middleware for HMR in development
- **Production**: Static file serving from dist/public

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Shared TypeScript types in /shared/schema.ts
- **Validation**: Zod schemas with drizzle-zod integration
- **Storage**: Interface-based storage abstraction (IStorage)

### Key Design Patterns

**Immutable Recognition Snapshots**: Initial schedule data is never modified. All changes are recorded as append-only events that adjust future periods.

**Derived FX Rates**: Exchange rates are calculated as reporting amount divided by local amount, never user-editable.

**Prospective Adjustments Only**: Changes apply to open periods going forward. Closed periods remain immutable.

**Period State Machine**: Periods transition through states (EXTERNAL → SYSTEM_BASE → SYSTEM_ADJUSTED → CLOSED), with each state having specific rules.

### Project Structure
```
client/src/          # React frontend
  components/        # UI components (app-specific and shadcn/ui)
  pages/            # Route components
  hooks/            # Custom React hooks
  lib/              # Utilities and query client
server/             # Express backend
  routes.ts         # API endpoint definitions
  storage.ts        # Data access layer
shared/             # Shared types and schemas
  schema.ts         # Drizzle schema and Zod validators
```

## External Dependencies

### Database
- PostgreSQL (via DATABASE_URL environment variable)
- Drizzle Kit for migrations (npm run db:push)

### UI Framework
- Radix UI primitives for accessible components
- Tailwind CSS for styling
- Lucide React for icons

### Development Tools
- Replit-specific Vite plugins for error overlay and dev banner
- TSX for TypeScript execution
- esbuild for production server bundling