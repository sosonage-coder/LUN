# Lunari

## Overview
Lunari is a financial accounting application focused on deterministic and auditable cost allocation over time. It manages financial instruments such as prepaid expenses, fixed assets, accruals, revenue recognition, investment income, debt amortization, and cash flow tracking. The system uses an append-only event tracking mechanism and derived FX rates to ensure accurate, time-based allocation. Key modules include Schedule Studio for various financial instruments, Cash Scheduler for cash flow tracking, OneClose for close management with certification workflows, Reconciliations for balance sheet accounts, and One Compliance for entity governance. The project aims to provide comprehensive financial oversight, reporting, and compliance capabilities.

## User Preferences
- Financial application styling with professional appearance
- Clear currency formatting with proper decimal places
- Dark mode support
- Period state visual indicators (badges with colors)

## System Architecture
The application uses a client-server architecture.

**Frontend (Client):**
- Built with React, TypeScript, TanStack Query, Wouter, Tailwind CSS, and shadcn/ui.
- Provides a professional financial UI with dashboards for all accounting categories.
- Features include schedule listings, detailed views, creation forms, and specialized calculators.
- UI/UX prioritizes clear currency formatting, dark mode, and visual indicators for period states.

**Backend (Server):**
- Developed with Express and TypeScript.
- Manages API endpoints for schedule management and category-specific dashboards.
- Utilizes an in-memory storage solution for data persistence and real-time processing, with future plans for persistent storage.
- Core principles include:
    - **Reporting Currency as Source of Truth**: All calculations are based on reporting currency.
    - **Derived FX Rates**: FX rates are always calculated (Reporting Amount / Local Amount).
    - **Append-Only Events**: All schedule modifications are recorded as immutable events for consistent rebuilds.
    - **Immutable Closed Periods**: Changes to closed periods must be prospective.

**Data Models & Algorithms:**
- **ScheduleMaster**: Core financial schedule entity.
- **ScheduleEvent**: Captures immutable changes to schedules.
- **PeriodLine**: Dynamically calculated period allocations.
- **Period States**: Defines status and mutability of period allocations (`EXTERNAL`, `SYSTEM_BASE`, `SYSTEM_ADJUSTED`, `CLOSED`).
- **Rebuild Algorithm**: Deterministically reconstructs period allocations by processing events chronologically and performing a true-up on the last period to eliminate rounding errors.
- **Prepaid Calculator**: Implements FIRST_FULL_MONTH amortization with `Decimal.js` for precision, supporting various event types and onboarding modes.

**Key Modules & Features:**
- **Schedule Studio**: Manages prepaid expenses, fixed assets, accruals, revenue recognition, investment income, and debt amortization with a 3-level hierarchy.
- **Cash Scheduler**: Provides a leveled architecture for cash flow tracking (Dashboard, Category Summary, Movement Detail).
- **OneClose (Close Control System)**: Governed close management with certification workflows, segregation of duties (SoD) controls, task lifecycle management, and violation detection.
- **Reconciliations Module**: Template-driven reconciliation workspace supporting various account types (e.g., CASH, ACCRUAL, PREPAID).
    - **Template Variants**: Includes specific templates like `ACCRUAL_12M_ROLLFORWARD` for 12-month rollforward views and `PREPAID_SCHEDULE_ANCHORED` which directly integrates with approved Schedule Studio schedules.
    - **Cash Reconciliation Templates**: Supports single/multi-bank, multi-currency scenarios with FX revaluation.
    - **Accrual Reconciliation**: Validates ERP-performed FX revaluation and uses a 12-month rolling view for line-based accrual tracking.
    - **Prepaid Reconciliation**: Anchored directly to approved prepaid schedules from Schedule Studio, providing a direct tie-out to GL balance.
    - **Workflow**: Reconciliation lifecycle from NOT_STARTED to LOCKED, including multi-level certification.
- **One Compliance (Entity Governance & Compliance System)**:
    - Manages entity profiles, obligation registry, authority register, board governance, and lifecycle changes.
    - Features interactive org charts, risk register, policy mapping, and advisor registry.
    - Includes audit readiness tools and AI insights for recommendations.
    - UI is tab-based with deep linking.

## External Dependencies
- **React**: Frontend UI library.
- **TypeScript**: Statically typed superset of JavaScript.
- **TanStack Query**: Data fetching and caching.
- **Wouter**: Routing library.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Reusable UI components.
- **Express**: Backend web framework.
- **Decimal.js**: Arbitrary-precision decimal arithmetic library.