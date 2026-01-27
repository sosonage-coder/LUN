# Lunari

## Overview
Lunari is a financial accounting application designed for deterministic and auditable cost allocation over time. It manages various financial instruments, including prepaid expenses, fixed assets, accruals, revenue recognition, investment income, debt amortization, and cash flow tracking. The system utilizes an append-only event tracking mechanism and derived FX rates to ensure accuracy. Key modules include Schedule Studio for financial instrument management, Cash Scheduler for cash flow, OneClose for close management with certification, Reconciliations for balance sheet accounts, and One Compliance for entity governance. Lunari aims to provide comprehensive financial oversight, reporting, and compliance.

## User Preferences
- Financial application styling with professional appearance
- Clear currency formatting with proper decimal places
- Dark mode support
- Period state visual indicators (badges with colors)

## System Architecture
The application employs a client-server architecture.

**Frontend:**
- Built with React, TypeScript, TanStack Query, Wouter, Tailwind CSS, and shadcn/ui, providing a professional financial UI with dashboards for various accounting categories.
- Features include schedule listings, detailed views, creation forms, and specialized calculators.
- UI/UX emphasizes clear currency formatting, dark mode, and visual indicators for period states.

**Backend:**
- Developed with Express and TypeScript.
- Manages API endpoints for schedule management and category-specific dashboards, utilizing an in-memory storage solution with plans for persistent storage.
- Core principles include reporting currency as the source of truth, derived FX rates, append-only events for immutable schedule modifications, and immutable closed periods requiring prospective changes.

**Data Models & Algorithms:**
- Core entities include `ScheduleMaster`, `ScheduleEvent`, and `PeriodLine`.
- `Period States` define the status and mutability of period allocations.
- A `Rebuild Algorithm` deterministically reconstructs period allocations, processing events chronologically and performing a true-up to eliminate rounding errors.
- The `Prepaid Calculator` implements FIRST_FULL_MONTH amortization with `Decimal.js` for precision.

**Key Modules & Features:**
- **Schedule Studio**: Manages various financial instruments with a 3-level hierarchy.
- **Cash Scheduler**: Provides a leveled architecture for cash flow tracking (Dashboard, Category Summary, Movement Detail).
- **OneClose (Close Control System)**: Governed close management with certification workflows, segregation of duties, task lifecycle management, and violation detection.
- **Reconciliations Module**: Template-driven workspace supporting various account types (e.g., CASH, ACCRUAL, PREPAID) with multi-level certification workflows and specific template variants like `ACCRUAL_12M_ROLLFORWARD` and `PREPAID_SCHEDULE_ANCHORED`.
- **NetTool (Financial Statement Notes Disclosure Engine)**:
    - Core disclosure management with notes, schedules, narratives, and review workflows across 6 schedule layout types (Rollforward, Movement by Category, Timing/Maturity, Gross to Net, Composition, Reconciliation).
    - **Financial Statements Module** (read-only, comparative): Includes Balance Sheet, Income Statement, Statement of Changes in Equity, and Cash Flow Statement, all system-calculated with links to disclosure notes.
    - **Trial Balance Workspace**: Features single-column net amount format, BS/PL category and FS category tagging, footnote number tagging, editable footnote descriptions, and sub-notes for intelligent WP auto-population. Includes cross-reference hover trails and a Split Declaration Panel for account balance breakdowns. TB is the source of truth for WP auto-population via BS/PL + Sub Note combination lookups.
    - **Working Papers Module**: Provides a list view and grid detail view with spreadsheet-style functionality, supporting multiple types (Rollforward, Aging, Linear, Custom). Features TB linking and tie-out validation, analyst notes, and attachment support, covering 14 comprehensive working papers.
    - **Rollforward WP Auto-Population**: Calculates rollforward rows using TB data with formula: Opening + Additions + Disposals + Depreciation + Transfers + Revaluations = Closing. Supports user overrides with balancing figure logic. Internal sign conventions: additions positive, disposals/depreciation negative. User inputs normalized at boundary. hasSignConventionViolation flag detects semantic inconsistencies while maintaining mathematical balance.
    - **Disclosure Notes**: 18 notes covering all financial statement line items.
    - **Schedules**: 22 schedules across 6 layout types.
    - **Narratives**: 18 narrative blocks linked to disclosure notes and schedules.
    - **Print/Export Engine**: Generates financial statements in various formats (PDF, Excel, Word) with options for notes, schedules, working papers, and period locking.
    - **TB Adjustments Workspace**: Grid for journal entries (RJE, AJE) with entry summary cards and account-level tagging.
    - **Final TB View**: Read-only comparative view of prior year vs. current year with variance analysis.
    - **Template Repository**: Centralized management for Disclosure, Working Paper, Reconciliation, and Close Control templates with CRUD operations and a preview feature.
    - **GL Master Mapping**: Configuration system for mapping GL account descriptions to footnotes and Working Papers:
      - Maps GL description categories to BS/PL classification, footnote numbers, footnote descriptions, sub-notes, and WP names
      - 20 pre-seeded sample mappings covering common account types (Cash, Trade Receivables, Fixed Assets, Accruals, Revenue, etc.)
      - CRUD operations for adding, editing, and deleting mappings
      - Active/inactive toggle for mappings
      - Search and filter by BS/PL category
      - Used for Working Paper auto-population based on TB data
    - **Trial Balance Import**: File upload system for importing trial balance data:
      - CSV file parsing with automatic column detection (Account Code, Name, Opening, Closing, Debit, Credit)
      - Data preview before import with validation
      - Import batch tracking with history view
      - Entity and period selection for import targeting
      - Normal balance (DEBIT/CREDIT) auto-detection
      - Batch management with view and delete operations
    - **Accounting Policies Module**: Comprehensive policy management for Note 1 (Summary of Significant Accounting Policies) with:
      - 17 standard policy templates covering Basis of Presentation, Use of Estimates, Cash, Debt Securities, Loans/CECL, Fair Value, Revenue, PPE, Goodwill/Intangibles, Leases, Inventory, Derivatives, Stock Compensation, Income Taxes, Commitments, Recently Adopted Standards, and Pending Standards
      - Policy CRUD operations with add/edit/delete functionality
      - Show/hide toggle for hiding policies from view without deletion
      - Print inclusion control (includeInPrint flag) for controlling what appears in printed Note 1
      - Display order management with drag-and-drop reordering
      - AI Policy Assistant powered by GPT-4o for generating policy drafts from natural language prompts
      - Note 1 Print Preview showing Basis of Preparation combined with active, printable policies sorted by displayOrder
      - ASU Adoption tracking for accounting standards updates
      - Industry tagging for policy applicability
- **One Compliance (Entity Governance & Compliance System)**: Structured into Dashboard, Entity Registry, Obligations, Board & Governance, and Startup Equity tabs. Includes health scores, risk overview, entity profiles, a library of 50+ regulatory filings across various industries, meeting management, and detailed tracking for funding rounds, convertibles, and options.

## Production Features

**Authentication & Authorization:**
- Replit Auth integration with Google, GitHub, and email login support
- User roles: ADMIN, CONTROLLER, REVIEWER, PREPARER
- Multi-entity support with user-entity role assignments
- RBAC middleware (isAuthenticated, requireRole, requirePermission)

**Database Schema (PostgreSQL):**
- `users` table with role assignments and profile info
- `sessions` table for Replit Auth session management
- `entities` table for company/organization management
- `user_entity_roles` table for many-to-many role assignments
- `audit_logs` table for tracking all user actions

**Import/Export Capabilities:**
- Trial Balance import API (JSON format with CSV/Excel parsing)
- PDF export for financial statements (balance-sheet, income-statement, cash-flow)
- Excel export for financial data (trial-balance, schedules, prepaids)

**Audit Trail:**
- All create/update/delete operations logged
- Export operations tracked
- User, entity, action, timestamp, old/new values captured

## External Dependencies
- **React**: Frontend UI library.
- **TypeScript**: Statically typed superset of JavaScript.
- **TanStack Query**: Data fetching and caching.
- **Wouter**: Routing library.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Reusable UI components.
- **Express**: Backend web framework.
- **Decimal.js**: Arbitrary-precision decimal arithmetic library.
- **xlsx**: Excel file parsing and generation.
- **pdfkit**: PDF document generation.
- **multer**: File upload handling.