# Lunari

## Overview
Lunari (Finance Stream) is a financial accounting application designed for deterministic and auditable cost allocation over time. It specializes in managing financial instruments such as prepaid expenses, fixed assets, accruals, revenue recognition, investment income, debt amortization, and cash flow tracking. The system ensures accurate, time-based allocation with an append-only event tracking mechanism and derived FX rates. The project aims to provide comprehensive financial oversight and reporting capabilities for various accounting categories.

**Module Categories:**
- Schedule Studio (Prepaids, Fixed Assets, Accruals, Revenue & Contracts, Investment Income, Debt Amortization) - 3-level drill-down hierarchy
- Cash Scheduler - Leveled architecture for cash flow tracking (Level 0: Dashboard, Level 1: Category Summary, Level 2: Movement Detail)
- OneClose (Close Control System) - Governance-first close management with certification workflows and SoD controls
- Reconciliations - Template-driven reconciliation workspace for balance sheet account reconciliation

## User Preferences
- Financial application styling with professional appearance
- Clear currency formatting with proper decimal places
- Dark mode support
- Period state visual indicators (badges with colors)

## System Architecture
The application follows a client-server architecture.

**Frontend (Client):**
- Built with React, TypeScript, TanStack Query, Wouter, Tailwind CSS, and shadcn/ui.
- Provides a professional financial UI with dashboards for various accounting categories (Prepaids, Fixed Assets, Accruals, Revenue & Contracts, Investment Income, Debt Amortization, Cash).
- Features include: schedule listing, detailed schedule views, creation forms, and a specialized prepaid calculator.
- UI/UX decisions prioritize clear currency formatting, dark mode support, and visual indicators for period states.

**Backend (Server):**
- Developed using Express and TypeScript.
- Manages API endpoints for schedule management (create, list, retrieve, add events, rebuild) and category-specific dashboards (KPIs, trends, breakdowns).
- Utilizes an in-memory storage solution (`MemStorage`) for data persistence and real-time processing.
- Core principles:
    - **Reporting Currency as Source of Truth**: All calculations are based on reporting currency amounts.
    - **Derived FX Rates**: FX rates are always calculated (Reporting Amount / Local Amount) and never manually edited.
    - **Append-Only Events**: All schedule modifications are recorded as immutable events, sorted deterministically for consistent rebuilds.
    - **Immutable Closed Periods**: Once a period is closed, no events can be added that affect it; changes must be prospective.

**Data Models:**
- **ScheduleMaster**: Represents a financial schedule (e.g., prepaid, fixed asset) with details like ID, type, amounts, currencies, and recognition periods.
- **ScheduleEvent**: Captures changes to schedules (e.g., amount adjustments, timeline changes) with an effective period and payload.
- **PeriodLine**: Dynamically calculated period allocations, including amounts, FX rates, and cumulative/remaining balances.
- **Period States**: `EXTERNAL`, `SYSTEM_BASE`, `SYSTEM_ADJUSTED`, `CLOSED` to define the status and mutability of a period's allocation.

**Rebuild Algorithm:**
- A deterministic algorithm reconstructs period allocations by processing events chronologically (effectivePeriod, createdAt).
- It initializes with schedule amounts, applies sorted events, calculates base amounts, generates period lines, and performs a true-up on the last period to eliminate rounding errors.

**Prepaid Calculator:**
- Implements the FIRST_FULL_MONTH convention for amortization.
- Uses `Decimal.js` for high-precision financial calculations.
- Supports various events like `REBASIS_AMOUNT`, `CHANGE_DATES`, `RECLASSIFICATION`, and `ONBOARDING_BOUNDARY`.
- Offers `CONTINUE_ONLY` and `CATCH_UP` onboarding modes.

**OneClose (Close Control System):**
- **Close Schedules**: Period-end close management with tasklists and individual tasks
- **Task Lifecycle**: NOT_STARTED → IN_PROGRESS → SUBMITTED → REVIEWED → APPROVED → LOCKED
- **Certification Workflows**: Multi-level sign-offs for tasklists and schedules with formal attestation
- **Segregation of Duties (SoD)**: Role-based controls (PREPARER, REVIEWER, APPROVER) with conflict detection
- **SoD Policy Rules**: Configurable rules defining prohibited role combinations (e.g., same person cannot prepare and approve)
- **Violation Management**: Detection of SoD conflicts with override capability and audit trail
- **Views**: Dashboard, Calendar/Kanban boards, My Tasks, Templates, Certification Dashboard
- **Current State**: MVP with in-memory data; future enhancements include persistent storage and server-side enforcement

**Reconciliations Module:**
- **Template-Driven**: Reconciliation templates define structure with customizable sections (Opening Balance, Additions, Disposals, etc.)
- **Account Types**: CASH, ACCOUNTS_RECEIVABLE, ACCOUNTS_PAYABLE, PREPAID, FIXED_ASSET, ACCRUAL, INVENTORY, INTERCOMPANY, DEBT, EQUITY, OTHER
- **Section Types**: OPENING_BALANCE, ADDITIONS, DISPOSALS, ADJUSTMENTS, CLOSING_BALANCE, SUBLEDGER_DETAIL, BANK_TRANSACTIONS, OUTSTANDING_ITEMS, VARIANCE_ANALYSIS, SUPPORTING_DOCUMENTATION, CUSTOM
- **Reconciliation Status Workflow**: NOT_STARTED → IN_PROGRESS → PENDING_REVIEW → REVIEWED → APPROVED → LOCKED
- **Views**: Dashboard (KPIs, accounts by category, reconciliation table), Template Library, Reconciliation Workspace
- **Key Features**: Period-specific reconciliation instances, GL/reconciled balance tracking with variance calculation, section-based line items, file attachments, certification workflow
- **Navigation Flow**: Sidebar account categories → Dashboard (filtered view) → Click "Open" button → Workspace (uses reconciliationId, not accountId)
- **Template Selection**: Workspace has "Change Template" button that opens dialog with template dropdown, preview, and apply functionality. Applying template resets status to NOT_STARTED and rebuilds sections
- **Query Key Pattern**: Use string URLs (e.g., "/api/reconciliations?period=2026-01") for TanStack Query to match default queryFn behavior

## External Dependencies
- **React**: Frontend UI library.
- **TypeScript**: Statically typed superset of JavaScript.
- **TanStack Query**: Data fetching and caching library.
- **Wouter**: Small routing library for React.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Reusable UI components.
- **Express**: Backend web application framework.
- **Decimal.js**: Arbitrary-precision decimal arithmetic library, used for financial calculations in the prepaid engine.