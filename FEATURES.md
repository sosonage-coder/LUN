# Lunari - Module Features

This document provides detailed feature descriptions for each module in the Lunari financial accounting platform.

---

## Implementation Status

This document describes the **full vision** for Lunari's capabilities. Some features are fully implemented with backend support, while others are currently UI demonstrations with sample data. The status of each module is noted below:

| Module | Status | Notes |
|--------|--------|-------|
| Schedule Studio | Partial | Core CRUD operations and calculations implemented; KPI dashboards display sample data |
| Cash Scheduler | UI Demo | Dashboard with sample data; backend integration planned |
| OneClose | Partial | Template and task management implemented; SoD and certification workflows in progress |
| Reconciliations | Implemented | Full CRUD, template system, and TB import with working paper auto-population |
| NetTool | Partial | GL Mapping, TB Import, and Working Papers implemented; Financial statements display sample data |
| One Compliance | UI Demo | Comprehensive UI with sample data; backend integration planned |

Features marked as "planned" or within UI Demo modules represent the product roadmap.

---

## Table of Contents
1. [Schedule Studio](#1-schedule-studio)
2. [Cash Scheduler](#2-cash-scheduler)
3. [OneClose](#3-oneclose)
4. [Reconciliations](#4-reconciliations)
5. [NetTool (Financial Statements)](#5-nettool-financial-statements)
6. [One Compliance](#6-one-compliance)

---

## 1. Schedule Studio

**Purpose**: Manages financial instruments with deterministic and auditable cost allocation over time.

### Modules

#### 1.1 Prepaids
Manage prepaid expenses with automated amortization.

**Features**:
- Create and manage prepaid expense schedules
- Automatic amortization calculation (FIRST_FULL_MONTH method)
- Period-by-period expense recognition
- KPI dashboard with key metrics:
  - Total prepaid balance
  - Monthly expense run rate
  - Active schedule count
- Breakdown by category (Insurance, Software, Marketing, etc.)
- Trend analysis showing expense patterns over time
- Event logging for audit trail

#### 1.2 Fixed Assets
Track and depreciate capital assets.

**Features**:
- Asset registration with acquisition details
- Multiple depreciation methods:
  - Straight-line
  - Double declining balance
  - Units of production
- Useful life and salvage value configuration
- Asset lifecycle management:
  - In Service
  - Disposed
  - Impaired
  - Fully Depreciated
- Flag tracking for assets requiring attention
- Depreciation schedule generation
- Asset category breakdown (Equipment, Vehicles, Buildings, IT Hardware)

#### 1.3 Accruals
Manage expense accruals and reversals.

**Features**:
- Accrual schedule creation
- Automatic reversal processing
- Category management (Legal, Consulting, Utilities, etc.)
- Risk indicators for aging accruals
- Trend analysis for accrual patterns
- Mix analysis by type and department

#### 1.4 Revenue Recognition
Handle complex revenue recognition scenarios.

**Features**:
- Revenue schedule management
- Multi-period revenue allocation
- Category tracking (Subscription, Services, License, etc.)
- Roll-forward analysis
- Revenue mix by stream
- Risk identification for recognition timing
- Performance obligation tracking

#### 1.5 Investment Income
Track investment returns and income.

**Features**:
- Investment portfolio tracking
- Income recognition schedules
- Category management (Dividends, Interest, Capital Gains)
- Accrued vs. received income tracking
- Mix analysis by investment type
- Risk monitoring for investments

#### 1.6 Debt Amortization
Manage debt instruments and interest expense.

**Features**:
- Debt schedule creation
- Amortization table generation
- Interest expense calculation
- Principal vs. interest split tracking
- Debt category management (Term Loans, Bonds, Lines of Credit)
- Risk monitoring for covenant compliance

### Common Schedule Features

All schedule types share these capabilities:

- **Append-only Event System**: Every change creates an immutable event record
- **Period Lines**: Automatic generation of period-by-period allocations
- **Rebuild Algorithm**: Deterministic reconstruction of schedules
- **FX Rate Support**: Multi-currency handling with derived rates
- **Period State Management**:
  - Open: Fully editable
  - Soft Close: Limited changes
  - Hard Close: Locked, prospective changes only
- **Reporting Currency**: Source of truth for all calculations
- **Decimal.js Precision**: No floating-point errors in calculations

---

## 2. Cash Scheduler

**Purpose**: Provides comprehensive cash flow tracking and analysis.

### Features

#### Dashboard
- Cash position overview
- Key metrics display:
  - Current cash balance
  - Inflows this period
  - Outflows this period
  - Net change

#### Category Summaries
- Operating cash flows
- Investing activities
- Financing activities
- Cash by bank account/location

#### Cash Mix Analysis
- Breakdown by source
- Breakdown by use
- Visualization charts

#### Movement Tracking
- Individual transaction logging
- Movement detail views
- Untagged transaction identification
- Bank context integration

#### Operating Expenses
- Expense tracking by category
- Budget vs. actual comparisons

---

## 3. OneClose

**Purpose**: Manages period-end financial close processes with governance and certification workflows.

### Features

#### Close Templates
- Predefined close checklist templates
- Task categorization by area:
  - Revenue
  - Expenses
  - Assets
  - Liabilities
  - Equity
- Custom template creation

#### Task Management
- Task assignment to team members
- Due date tracking
- Status workflow:
  - Not Started
  - In Progress
  - Pending Review
  - Completed
  - Blocked
- Priority levels (Critical, High, Medium, Low)
- Dependency linking between tasks
- Task reordering via drag-and-drop

#### Certification Workflows
- Multi-level certification process
- Role-based certification requirements:
  - Preparer certification
  - Reviewer certification
  - Controller sign-off
- Certification status tracking
- Decertification capability with audit trail

#### Segregation of Duties (SoD)
- SoD rule configuration
- Conflict detection between roles
- Violation monitoring
- Override workflow with justification capture
- Real-time compliance checking

#### Close Calendar
- Close period scheduling
- Milestone tracking
- Timeline visualization

#### KPIs & Reporting
- Close completion percentage
- Task aging analysis
- Bottleneck identification
- Historical close metrics

---

## 4. Reconciliations

**Purpose**: Provides workspaces for balance sheet account reconciliations.

### Features

#### Reconciliation Dashboard
- Account listing with status
- KPI overview:
  - Total accounts to reconcile
  - Reconciled count
  - Pending review count
  - Not started count
- Balance tracking

#### Account Management
- Account registration
- Balance Sheet category assignment
- GL account linking
- Target reconciliation date setting

#### Template-Driven Workspaces
Reconciliation templates for different account types:

| Template | Use Case |
|----------|----------|
| CASH_3WAY | Bank reconciliation (Book, Bank, Outstanding) |
| ACCRUAL_12M_ROLLFORWARD | Accrual account roll-forward |
| PREPAID_SCHEDULE_ANCHORED | Prepaid tied to amortization schedule |
| FIXED_ASSET_REGISTER | Asset register reconciliation |
| STANDARD | General ledger reconciliation |

#### Workspace Features
- Section-based layout matching template
- Line item entry
- Supporting document attachment
- Variance calculation (GL Balance vs. Reconciled Balance)
- Adjustment entry tracking
- Event timeline

#### Status Workflow
- Not Started
- In Progress
- Pending Review
- Approved
- Locked

#### Trial Balance Integration
- TB Import from CSV/Excel files
- Entity and period selection
- Batch import history
- Working Paper auto-population from TB data

---

## 5. NetTool (Financial Statements)

**Purpose**: Complete financial disclosure management and reporting engine.

### Modules

#### 5.1 Dashboard
- Overview metrics:
  - Total disclosure notes
  - Active schedules
  - Narratives count
  - Pending reviews
- Status distribution charts
- Recent activity feed
- Quick action buttons

#### 5.2 Disclosure Notes
- Note creation and management
- Standard note templates:
  - Note 1: Summary of Significant Accounting Policies
  - Note 2: Cash and Cash Equivalents
  - Note 3: Accounts Receivable
  - Note 4: Property, Plant & Equipment
  - etc.
- Review status tracking
- Statement linking (BS, IS, SCE, CFS)

#### 5.3 Schedules
Disclosure schedule grids with layout types:

| Layout Type | Description |
|-------------|-------------|
| ROLLFORWARD | Opening, Activity, Closing format |
| MOVEMENT_BY_CATEGORY | Categorized movement analysis |
| TIMING_MATURITY | Maturity date bucketing |
| GROSS_TO_NET | Gross amount to net calculation |
| COMPOSITION | Component breakdown |
| RECONCILIATION | Two-column reconciliation |

#### 5.4 Narratives
- MD&A section management
- Text block editor
- Rich text formatting
- Linked to disclosure notes

#### 5.5 Review Workflows
- Multi-level review process
- Comment threading
- Approval tracking
- Revision history

#### 5.6 Financial Statements

**Balance Sheet**
- Assets, Liabilities, Equity sections
- Comparative periods
- Note references
- Drill-down to supporting schedules

**Income Statement**
- Revenue and expense categorization
- Gross profit calculation
- Operating income
- Net income
- Comparative analysis

**Statement of Changes in Equity**
- Opening balances
- Current period changes
- Comprehensive income
- Dividends
- Closing balances

**Cash Flow Statement**
- Operating activities
- Investing activities
- Financing activities
- Reconciliation to cash position

#### 5.7 Trial Balance Workspace
- Trial Balance view
- BS/PL category tagging
- Financial statement category assignment
- Footnote number tagging
- Sub-note classification

#### 5.8 TB Adjustments
- RJE (Reclassifying Journal Entries)
- AJE (Adjusting Journal Entries)
- Entry management grid
- Final TB calculation

#### 5.9 GL Master Mapping
- GL Account Number (unique identifier)
- GL Description Category
- Footnote Description
- Working Paper Name
- Footnote Number
- BS/PL Category assignment
- Classification dropdown with "Use Existing" toggle
- Sample mappings included

#### 5.10 Working Papers
- Working paper creation
- TB-based auto-population
- Entity and period scoping
- Assigned account codes tracking
- Deduplication logic

#### 5.11 Accounting Policies
- 17 standard policy templates:
  - Basis of Presentation
  - Use of Estimates
  - Cash and Cash Equivalents
  - Debt Securities
  - Loans and CECL
  - Fair Value Measurement
  - Revenue Recognition
  - Property, Plant & Equipment
  - Goodwill & Intangibles
  - Leases
  - Inventory
  - Derivatives
  - Stock-Based Compensation
  - Income Taxes
  - Commitments & Contingencies
  - Recently Adopted Standards
  - Pending Accounting Standards
- Policy CRUD operations
- Show/hide toggle
- Print inclusion control
- Display order management
- AI Policy Assistant (GPT-4o powered)
- Note 1 Print Preview

#### 5.12 Export Capabilities
- PDF export (Balance Sheet, Income Statement, Cash Flow)
- Excel export (Trial Balance, Schedules)
- Word export for narratives

---

## 6. One Compliance

**Purpose**: Entity governance, regulatory compliance, and corporate administration.

### Modules

#### 6.1 Dashboard
- Compliance health score
- Risk overview
- Upcoming deadlines
- Action items

#### 6.2 Entity Registry
- Entity profile management
- Ownership structure
- Organization chart
- Contact information
- Key dates

#### 6.3 Obligations Registry
- Regulatory filing requirements
- 50+ standard filing types across industries:
  - SEC filings (10-K, 10-Q, 8-K)
  - State filings (Annual Reports)
  - Tax filings (Corporate, Payroll)
  - Industry-specific (FINRA, OCC, FDIC)
- Due date tracking
- Responsible party assignment
- Status management

#### 6.4 Compliance Calendar
- Visual calendar view
- Deadline highlighting
- Reminder configuration
- Integration with close periods

#### 6.5 Board & Governance

**Authority Matrix**
- Approval thresholds
- Signatory limits
- Delegation rules

**Board Management**
- Board member profiles
- Committee assignments
- Term tracking
- Meeting scheduling

**Meeting Management**
- Agenda creation
- Minutes recording
- Resolution tracking
- Attendance logging

**Policy Management**
- Corporate policy repository
- Version control
- Approval workflows

**Capital Management**
- Authorized share capital
- Issued shares tracking
- Share class management

#### 6.6 Entity Lifecycle
- Formation documents
- Amendment history
- Status changes
- Dissolution tracking

#### 6.7 Risk Management
- Risk register
- Risk assessment
- Mitigation tracking
- Correspondence logging
- Escalation management

#### 6.8 Documents & Evidence
- Document vault
- Point-in-time snapshots
- Audit readiness scoring
- Evidence collection

#### 6.9 Startup Equity
For venture-backed companies:

**Funding Rounds**
- Round details (Seed, Series A, B, etc.)
- Investor tracking
- Valuation history
- Investment amounts

**Convertibles**
- SAFE and convertible note tracking
- Conversion terms
- Cap and discount management

**Options**
- Option pool management
- Grant tracking
- Vesting schedules
- Exercise tracking

#### 6.10 Integrations
- E-signature platform connections
- Document management integrations

#### 6.11 Insights
- Compliance dashboard
- Status reporting
- ROI analysis

---

## Cross-Module Features

### Authentication & Authorization
- Replit Auth integration (Google, GitHub, Email)
- Role-based access control:
  - ADMIN: Full system access
  - CONTROLLER: Certification and approval authority
  - REVIEWER: Review and comment capabilities
  - PREPARER: Data entry and preparation
- Multi-entity support
- User-entity role assignments

### Audit Trail
- All create/update/delete operations logged
- User identification
- Timestamp recording
- Old/new value capture
- Export operations tracked

### Data Precision
- Decimal.js for all financial calculations
- No floating-point rounding errors
- Configurable decimal places

### Dark Mode
- System-wide dark mode support
- Consistent color theming

### Currency Formatting
- Proper decimal placement
- Thousand separators
- Currency symbol display

### Period Management
- Entity-based period configuration
- Period state indicators (Open, Soft Close, Hard Close)
- Visual badges for period status

---

*Last updated: January 2026*
