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
- **NetTool (Financial Statement Notes Disclosure Engine)**:
    - Core disclosure management with notes, schedules, narratives, and review workflows.
    - 6 schedule layout types: Rollforward, Movement by Category, Timing/Maturity, Gross to Net, Composition, Reconciliation.
    - Spreadsheet-style grids with locked system columns and editable user columns.
    - **Financial Statements Module** (read-only, comparative):
        - Company Profile: Entity context and front page information.
        - Auditor's Opinion: Audit opinion text and signed document upload.
        - Balance Sheet: Comparative statement of financial position with note links.
        - Income Statement: Comparative statement of operations with note links.
        - Statement of Changes in Equity: Equity component movements.
        - Cash Flow Statement: Indirect method with reconciliation check.
    - All financial statement values are system-calculated with locked editing.
    - Statement lines link to disclosure notes for navigation and traceability.
    - **Trial Balance Workspace**:
        - Single-column net amount format (DR positive, CR negative in parentheses).
        - FS Category tagging with dropdown selectors for account classification.
        - Footnote tagging with multi-select capability.
        - Column visibility toggles for adjustment columns.
        - Cross-reference hover trails showing source chain (GL → Split → WP → Note) with colored node indicators.
    - **Split Declaration Panel**: Right drawer opened by clicking account codes, showing:
        - TB balance and breakdown with assigned/unassigned tracking.
        - Component list with source types (DECLARED, GL_BACKED, CALCULATED).
        - Incomplete balance warnings when unassigned amounts exist.
    - **Working Papers Module**:
        - List view showing all working papers with type, status, and linked items.
        - Grid detail view with spreadsheet-style functionality.
        - Supports multiple types: Rollforward, Aging, Linear, Custom.
        - Features: frozen headers, locked columns, formula columns with "fx" badge.
        - Row types: DATA, HEADER, SUBTOTAL, TOTAL with differentiated styling.
        - Text blocks for notes and annotations.
        - Breadcrumb navigation between list and detail views.
    - **Print/Export Engine**:
        - Generate Financial Statements dialog with format selection (PDF, Excel, Word).
        - Statement selection toggles for Balance Sheet, Income Statement, Equity, Cash Flow.
        - Additional content options: Notes, Schedules, Working Papers.
        - Period lock option to prevent changes after export.
        - DRAFT watermark option.
        - Progress indicator during document generation.
    - **TB Adjustments Workspace**:
        - Main grid with columns: Initial TB, RJE-1, RJE-2, Total RJE, AJE-1, AJE-2, AJE-3, Total AJE, Net Movement, Final Balance.
        - Entry summary cards showing RJE/AJE entries with status (DRAFT, PENDING_REVIEW, APPROVED, REJECTED).
        - Account-level FS Category and Footnote tagging.
        - Entry detail sheet opens when clicking entry cards.
    - **Final TB View**:
        - Read-only comparative view showing Prior Year Closing vs Current Year Final.
        - Variance columns showing changes year-over-year.
        - Values looked up from TB Adjustments Workspace.
    - **Template Repository**:
        - Central repository for managing all template types.
        - Four template categories: Disclosure, Working Paper, Reconciliation, Close Control.
        - Full CRUD operations (add, edit, delete) for disclosure templates.
        - Template properties: Name, Layout Type (6 options), Framework (IFRS/US GAAP/Both).
        - Pre-built templates for working papers (Rollforward, Aging, Linear, Custom).
        - Pre-built templates for reconciliations (Cash, Prepaid, Accrual, Fixed Asset, Intercompany).
        - Pre-built templates for close control (Month-End, Quarter-End, Year-End, Consolidation, Audit Prep).
        - **Template Preview**: Eye icon buttons on all template types to preview before use, showing category, type, layout, framework, column structure with badges, and sample data visualization in a scrollable dialog.
- **One Compliance (Entity Governance & Compliance System)**:
    - Restructured into 5 purpose-built tabs: Dashboard, Entity Registry, Obligations, Board & Governance, and Startup Equity.
    - **Dashboard**: Health scores, risk overview, deadline heatmaps, and AI compliance insights.
    - **Entity Registry**: Entity profiles, organizational structure, and ownership details.
    - **Obligations**: Filing requirements library with 50+ regulatory filings across USA, Canada, EU, UK, UAE; supports Financial Services, Healthcare, Manufacturing, Technology, Energy, Retail, and Insurance industries.
    - **Board & Governance**: Meeting management, resolutions, authority register, and lifecycle changes.
    - **Startup Equity** (nested tabs):
        - **Funding Rounds**: Track fundraising with valuations, investor participation, and terms.
        - **Convertibles**: SAFE/Note management with conversion tracking and cap details.
        - **Options**: Option pool and grant management with vesting schedules.
    - Filing requirements include penalty levels (Critical/High/Medium), lead times, frequencies, and responsible departments.

## External Dependencies
- **React**: Frontend UI library.
- **TypeScript**: Statically typed superset of JavaScript.
- **TanStack Query**: Data fetching and caching.
- **Wouter**: Routing library.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Reusable UI components.
- **Express**: Backend web framework.
- **Decimal.js**: Arbitrary-precision decimal arithmetic library.