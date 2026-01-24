# Non-Monetary Schedule Engine

## Overview
A sophisticated financial accounting application for deterministic, auditable cost allocation over time. The system handles prepaid expenses and fixed assets with time-based allocation, append-only event tracking, and derived FX rates.

## Core Principles

1. **Reporting Currency is Source of Truth**: All calculations are based on reporting currency amounts. Local currency amounts are secondary.

2. **FX is Always Derived**: FX rate = Reporting Amount / Local Amount. The FX rate is never manually edited - it's always calculated from the two currency amounts.

3. **Append-Only Events**: All modifications to schedules are recorded as immutable events. Events are sorted deterministically (by effective period, then creation time) for consistent rebuilds.

4. **Closed Periods are Immutable**: Once a period is closed, no events can be added that affect it. All changes must be prospective only.

## Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── currency-display.tsx
│   │   │   ├── event-log.tsx
│   │   │   ├── period-schedule-table.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── pages/
│   │   │   ├── dashboard.tsx
│   │   │   ├── schedules-list.tsx
│   │   │   ├── schedule-detail.tsx
│   │   │   ├── create-schedule.tsx
│   │   │   ├── prepaid-calculator.tsx     # Prepaid schedule calculator
│   │   │   ├── prepaids-dashboard.tsx     # Prepaids Category Dashboard
│   │   │   ├── fixed-assets-dashboard.tsx # Fixed Assets Category Dashboard
│   │   │   └── not-found.tsx
│   │   ├── lib/            # Utilities
│   │   └── App.tsx         # Main app with routing
│   └── index.html
├── server/                  # Express backend
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # In-memory storage with rebuild algorithm
│   └── vite.ts             # Vite integration
└── shared/
    ├── schema.ts           # Data models and types
    └── prepaid-engine.ts   # Prepaid schedule calculation engine (Decimal.js)
```

## Key Data Models

### ScheduleMaster
The main entity representing a prepaid expense or fixed asset schedule:
- scheduleId, scheduleType (PREPAID | FIXED_ASSET)
- entityId, description
- localCurrency, reportingCurrency
- startDate, endDate (YYYY-MM format)
- totalAmountLocalInitial, totalAmountReportingInitial
- impliedFxInitial (derived: reporting / local)
- recognitionPeriods, systemPostingStartPeriod

### ScheduleEvent
Append-only events that modify schedules:
- eventType: AMOUNT_ADJUSTMENT, TIMELINE_EXTENSION, TIMELINE_REDUCTION, ONBOARDING_BOUNDARY
- effectivePeriod, eventPayload
- reason, createdAt, createdBy

### PeriodLine
Calculated period allocations (not stored, rebuilt from events):
- period (YYYY-MM), state (EXTERNAL | SYSTEM_BASE | SYSTEM_ADJUSTED | CLOSED)
- amountReporting, amountLocal, effectiveFx
- cumulativeAmountReporting, remainingAmountReporting
- adjustmentDelta, explanation

## Period States

| State | Description |
|-------|-------------|
| EXTERNAL | Before systemPostingStartPeriod (late onboarding) |
| SYSTEM_BASE | Standard system-generated allocation |
| SYSTEM_ADJUSTED | Has adjustments from events |
| CLOSED | Period has been closed, immutable |

## API Endpoints

### Schedule Management
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/schedules | List all schedules |
| GET | /api/schedules/summary | Get summary statistics |
| GET | /api/schedules/:id | Get schedule with events and periods |
| POST | /api/schedules | Create new schedule |
| POST | /api/schedules/:id/events | Add event to schedule |
| POST | /api/schedules/:id/rebuild | Rebuild schedule periods |
| GET | /api/entities | List entities |
| GET | /api/entities/:id/periods | Get period statuses |
| POST | /api/entities/:id/periods/:period/close | Close a period |

### Prepaids Dashboard
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/prepaids | List all prepaid schedules |
| GET | /api/prepaids/kpis | Get dashboard KPIs |
| GET | /api/prepaids/breakdown | Get category breakdown |
| GET | /api/prepaids/trend | Get amortization trend |
| POST | /api/prepaids | Create new prepaid schedule |

### Fixed Assets Dashboard
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/fixed-assets | List all fixed assets |
| GET | /api/fixed-assets/kpis | Get dashboard KPIs |
| GET | /api/fixed-assets/breakdown | Get asset class breakdown |
| GET | /api/fixed-assets/trend | Get depreciation trend |
| GET | /api/fixed-assets/lifecycle | Get useful life distribution |
| GET | /api/fixed-assets/flags | Get control flags |
| POST | /api/fixed-assets | Create new fixed asset |

## Rebuild Algorithm

The deterministic rebuild algorithm processes events in order to calculate period allocations:

1. Initialize with schedule's initial amounts
2. Sort events by (effectivePeriod, createdAt)
3. Apply each event to accumulate adjustments
4. Calculate base amount per period
5. Generate period lines with appropriate states
6. Apply true-up on last period to eliminate rounding drift

## Development

### Running the Application
```bash
npm run dev
```

This starts both the Express backend and Vite frontend on port 5000.

### Key Technologies
- **Frontend**: React, TypeScript, TanStack Query, Wouter, Tailwind CSS, shadcn/ui
- **Backend**: Express, TypeScript
- **Data**: In-memory storage (MemStorage)

## Prepaid Calculator

The Prepaid Calculator (`/prepaid-calculator`) implements the FIRST_FULL_MONTH convention with Decimal.js precision:

### Features
- **FIRST_FULL_MONTH Convention**: Start date Jan 15 → first amortization = Feb
- **Decimal.js Precision**: Accurate financial calculations with proper rounding
- **Event Support**: REBASIS_AMOUNT, CHANGE_DATES, RECLASSIFICATION events
- **Onboarding Modes**: CONTINUE_ONLY (default) or CATCH_UP
- **Period States**: EXTERNAL, SYSTEM_BASE, SYSTEM_ADJUSTED, CLOSED

### Key Rules
- FX is derived from reporting/local amounts and locked at recognition
- Closed periods are immutable - adjustments flow forward only
- True-up applied on final period to eliminate rounding drift

## Recent Changes

- 2026-01-24: Added Fixed Assets Category Dashboard
  - Portfolio-level view at /fixed-assets with period-aware snapshot
  - 6 KPI tiles: Gross Asset Value, Accumulated Depreciation, Net Book Value, Depreciation This Period, Assets In Service, Assets Fully Depreciated
  - 3 charts: Depreciation Trend (6-period bar), Asset Mix by Class, Remaining Useful Life Distribution
  - Control Flags section for compliance risks (missing evidence, not in service, fully depreciated)
  - Fixed Asset Register table with drill-down, progress bars, and filtering
  - Asset classes: IT, Furniture, Leasehold, Vehicles, Machinery, Other
  - Depreciation methods: Straight Line, Double Declining Balance, Units of Production, Custom
  - E2E testing passed

- 2026-01-24: Added Prepaids Category Dashboard
  - Portfolio-level view at /prepaids with KPIs, trends, and category breakdown
  - 5 KPI tiles: Total Prepaid Balance, Active Schedules, Expense This Period, Remaining Balance, Upcoming Expirations
  - Amortization Trend chart (6-period bar chart)
  - Balance by Category breakdown (Insurance, Rent, Software, Other)
  - Filterable/searchable schedules table with drill-down
  - Evidence status tracking (ATTACHED/MISSING) with operational alerts
  - Updated sidebar with Categories section

- 2026-01-24: Added Prepaid Calculator
  - Sophisticated prepaid schedule engine with Decimal.js
  - FIRST_FULL_MONTH convention implementation
  - Rebasis and date change event support
  - CATCH_UP onboarding mode for late onboarding

- 2026-01-24: Initial implementation complete
  - Full schema with Schedule Master, Events, Period Lines
  - Professional financial UI with dark mode support
  - Deterministic rebuild algorithm with proper period state management
  - All API endpoints implemented
  - E2E testing passed

## User Preferences

- Financial application styling with professional appearance
- Clear currency formatting with proper decimal places
- Dark mode support
- Period state visual indicators (badges with colors)
