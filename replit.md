# Lunari - Financial Accounting Platform

## Overview
Lunari is a comprehensive financial accounting application designed to streamline and automate complex financial processes. It manages prepaid expenses, fixed assets, accruals, revenue recognition, investment income, and debt amortization. The platform supports financial statement preparation, working papers, entity governance, and compliance, aiming to provide a robust solution for modern financial management.

Key capabilities include:
- Management of financial instruments (prepaids, fixed assets, accruals, revenue, investments, debt).
- Cash flow tracking with detailed category summaries.
- Close management with certification workflows and task tracking.
- Balance sheet account reconciliation workspaces.
- A complete financial reporting suite including Trial Balance, Balance Sheet, Income Statement, and Working Papers.
- Entity governance and regulatory compliance tracking.

## User Preferences
- Financial application styling with professional appearance
- Clear currency formatting with proper decimal places
- Dark mode support
- Period state visual indicators (badges with colors)

## System Architecture
Lunari employs a full-stack architecture with a React frontend and an Express.js backend, communicating via a RESTful API. TypeScript is used across the entire codebase for type safety.

**UI/UX Decisions:**
- Frontend built with React, utilizing TanStack Query for data fetching and caching, and Wouter for client-side routing.
- Styling is managed with Tailwind CSS, complemented by shadcn/ui for pre-built, accessible UI components, ensuring a professional and consistent user experience.
- Features like dark mode support and clear currency formatting are prioritized for user experience.

**Technical Implementations:**
- **Frontend (`client/`):** Organizes components, pages, hooks, and utility functions for a modular React application.
- **Backend (`server/`):** An Express.js server handles API requests, database interactions, and business logic. It includes defined routes, storage mechanisms, database connection (`db.ts`), and middleware for authentication and authorization.
- **Shared Code (`shared/`):** Contains common definitions like Zod schemas for data validation and TypeScript types, ensuring consistency between frontend and backend.

**Feature Specifications:**
- **Schedule Studio:** Manages financial instruments with dedicated sections for prepaids, fixed assets, accruals, revenue, investments, and debt. Entry point is a FileGRID-style unified pivot grid at `/schedule-studio` providing 5 pivot views (By Type, By Entity, By Period, By Owner, By Evidence).
- **Cash Scheduler:** Provides tools for cash flow tracking and summarization.
- **OneClose:** Facilitates financial close processes with certification workflows and task management.
- **Reconciliations:** Offers workspaces for balance sheet account reconciliations. Entry point is a FileGRID-style pivot grid at `/reconciliations` with 3-tier hierarchy (Type → Account Group → Individual Account) and 5 pivot views (By Type, By Group, By Status, By Preparer, By Variance).
- **NetTool (Financial Statements):** A comprehensive reporting suite including Trial Balance, Balance Sheet, Income Statement, Working Papers, GL Master Mapping, and TB Import functionalities.
- **One Compliance:** Focuses on entity governance and regulatory compliance tracking.

**FileGRID Pivot System:**
The platform uses reusable pivot grid components (`client/src/components/pivot/`) for Excel-like data exploration:
- `PivotViewSelector.tsx`: Toggle buttons for switching between different grouping perspectives
- `CollapsibleGridRow.tsx`: Expandable tree rows with counts, progress bars, and totals
- `DashboardKPICards.tsx`: Grid of metric cards with trend indicators
- `FilterBar.tsx`: Search + select filter controls
- `GridItemRow.tsx`: Individual item links within collapsed sections

Reconciliation Account Groups (25 sub-categories organized by type):
- Cash: Operating Cash, Restricted Cash
- Accounts Receivable: Trade Receivables, Other Receivables
- Accounts Payable: Trade Payables, Other Payables
- Prepaid: Short-term Prepaids, Long-term Prepaids
- Fixed Asset: Land & Buildings, Equipment, Intangibles, Accumulated Depreciation
- Accrual: Compensation Accruals, Tax Accruals, Other Accruals
- Inventory: Raw Materials, Finished Goods, Work in Progress
- Intercompany: IC Receivables, IC Payables
- Debt: Short-term Debt, Long-term Debt
- Equity: Capital Stock, Retained Earnings
- Other: Miscellaneous

**System Design Choices:**
- **Database:** PostgreSQL is used as the relational database, accessed via Drizzle ORM for type-safe query building.
- **Environment Management:** Utilizes `.env` files for configuration, including `DATABASE_URL` and `SESSION_SECRET`.
- **API Design:** All API endpoints are prefixed with `/api/` and follow REST principles for interacting with various modules such as Schedules, GL Master Mapping, Trial Balance Import, Working Papers, Entities & Periods, Reconciliations, and Close Control.
- **Data Precision:** Decimal.js is integrated for precise financial calculations, avoiding floating-point inaccuracies.
- **File Handling:** `xlsx` for Excel operations, `pdfkit` for PDF generation, and `multer` for file uploads.

## External Dependencies
- **React:** Frontend UI library.
- **TypeScript:** For type-safe development.
- **TanStack Query:** Data fetching, caching, and state management for the frontend.
- **Wouter:** Client-side routing for React applications.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **shadcn/ui:** Re-usable UI components.
- **Express:** Backend web server framework.
- **PostgreSQL:** Primary database.
- **Drizzle ORM:** TypeScript ORM for PostgreSQL.
- **Zod:** Schema declaration and validation library.
- **Decimal.js:** High-precision decimal arithmetic library.
- **xlsx:** Library for reading and writing Excel files.
- **pdfkit:** JavaScript PDF generation library.
- **multer:** Middleware for handling `multipart/form-data`, primarily for file uploads.
- **OpenAI API:** (Optional) Used for AI Policy Assistant features.