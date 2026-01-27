# Lunari - Workflow Systems Documentation

This document provides complete technical documentation for all workflow systems in Lunari. Developers can use this guide to understand, extend, and maintain workflow functionality.

---

## Table of Contents
1. [Overview](#overview)
2. [Close Control Workflow](#close-control-workflow)
3. [Reconciliation Workflow](#reconciliation-workflow)
4. [Certification Workflow](#certification-workflow)
5. [Disclosure Review Workflow](#disclosure-review-workflow)
6. [Implementation Guide](#implementation-guide)

---

## Overview

Lunari implements several interconnected workflow systems for financial close processes:

| Workflow | Purpose | Status States | Implementation |
|----------|---------|---------------|----------------|
| Close Control | Period-end task management | 6 states | Full backend + UI |
| Reconciliation | Account balance verification | 6 states | Full backend + UI |
| Certification | Multi-level sign-off | 4 states | Backend + UI (in Close Control) |
| Disclosure Review | Financial statement preparation | 4 states | UI only (sample data) |

### UI File Locations

| Workflow | Files |
|----------|-------|
| Close Control | `close-control-dashboard.tsx`, `close-control-kanban.tsx`, `close-control-schedule.tsx`, `close-control-templates.tsx`, `close-control-template-editor.tsx`, `close-control-tasklist.tsx`, `close-control-certification.tsx`, `close-control-calendar.tsx`, `close-control-new.tsx`, `close-tasks.tsx`, `my-tasks.tsx` |
| Reconciliation | `reconciliations.tsx`, `reconciliation-workspace.tsx`, `reconciliation-templates.tsx` |
| Certification | `close-control-certification.tsx` |
| Disclosure Review | `nettool.tsx` (UI demo with sample data) |

### Core Principles

1. **Status-Driven**: All workflows use explicit status values defined in `shared/schema.ts` (Implemented)
2. **Audit Trail**: Status changes should be logged with user, timestamp, and reason (Schema defined, logging partially implemented)
3. **Role-Based**: Actions restricted by user roles - Preparer, Reviewer, Controller, etc. (Schema defined, enforcement planned)
4. **Period-Scoped**: Workflows operate within accounting periods using YYYY-MM format (Implemented)

---

## Close Control Workflow

### Purpose
Manages the period-end financial close process with structured task management, assignment, and approval flows.

### Architecture

```
CloseSchedule (period timeline)
    └── CloseTasklist (work packages)
            └── CloseTask (individual work items)
```

### Status Definitions

#### CloseTask Statuses
Located in: `shared/schema.ts` (line 785)

```typescript
export type CloseTaskStatus = 
  | "NOT_STARTED"   // Task created, no work begun
  | "IN_PROGRESS"   // Preparer actively working
  | "SUBMITTED"     // Preparer completed, awaiting review
  | "REVIEWED"      // Reviewer approved, awaiting final approval
  | "APPROVED"      // Controller/final approval granted
  | "LOCKED";       // Period closed, no further changes
```

#### Status Transitions

```
┌─────────────┐
│ NOT_STARTED │
└──────┬──────┘
       │ Preparer starts work
       ▼
┌─────────────┐
│ IN_PROGRESS │◄────────────────┐
└──────┬──────┘                 │
       │ Preparer submits       │ Reviewer rejects
       ▼                        │
┌─────────────┐                 │
│  SUBMITTED  │─────────────────┘
└──────┬──────┘
       │ Reviewer approves
       ▼
┌─────────────┐
│  REVIEWED   │◄────────────────┐
└──────┬──────┘                 │
       │ Controller approves    │ Controller rejects
       ▼                        │
┌─────────────┐                 │
│  APPROVED   │─────────────────┘
└──────┬──────┘
       │ Period lock triggered
       ▼
┌─────────────┐
│   LOCKED    │
└─────────────┘
```

### Data Models

#### CloseTask Interface
```typescript
// shared/schema.ts (line 825)
export interface CloseTask {
  id: string;
  tasklistId: string;
  closeScheduleId: string;
  name: string;
  description: string;
  status: CloseTaskStatus;
  priority: TaskPriority;           // CRITICAL | HIGH | MEDIUM | LOW
  preparerId: string | null;
  preparerName: string | null;
  reviewerId: string | null;
  reviewerName: string | null;
  dueDate: string;
  completedAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  evidenceStatus: CloseEvidenceStatus;
  evidenceCount: number;
  linkedSchedules: LinkedScheduleReference[];
  dependencies: string[];           // Task IDs that must complete first
  order: number;
  period: string;                   // YYYY-MM format
  createdAt: string;
}
```

#### CloseTasklist Interface
```typescript
// shared/schema.ts (line 859)
export interface CloseTasklist {
  id: string;
  closeScheduleId: string;
  name: string;
  description: string;
  templateId: string | null;
  status: TasklistStatus;           // NOT_STARTED | IN_PROGRESS | COMPLETED | LOCKED
  ownerId: string | null;
  ownerName: string | null;
  totalTasks: number;
  completedTasks: number;
  approvedTasks: number;
  dueDate: string;
  completedAt: string | null;
  lockedAt: string | null;
  lockedBy: string | null;
  period: string;
  order: number;
  createdAt: string;
}
```

#### CloseSchedule Interface
```typescript
// shared/schema.ts (line 881)
export interface CloseSchedule {
  id: string;
  name: string;
  period: string;
  periodType: ClosePeriodType;      // MONTHLY | QUARTERLY | YEARLY | AD_HOC
  templateId: string | null;
  status: CloseScheduleStatus;      // PLANNED | ACTIVE | AT_RISK | COMPLETE | LOCKED
  startDate: string;
  endDate: string;
  totalTasklists: number;
  completedTasklists: number;
  lockedTasklists: number;
  totalTasks: number;
  completedTasks: number;
  approvedTasks: number;
  riskLevel: CloseRiskLevel;        // HIGH | MEDIUM | LOW | NONE
  overdueTasks: number;
  ownerId: string | null;
  ownerName: string | null;
  lockedAt: string | null;
  lockedBy: string | null;
  createdAt: string;
}
```

### API Endpoints

All endpoints prefixed with `/api/close-control/`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **Dashboard & Core** | | |
| GET | `/kpis` | Dashboard metrics |
| GET | `/my-tasks` | Get current user's assigned tasks |
| GET | `/users` | List available users for assignment |
| **Schedules** | | |
| GET | `/schedules` | List all close schedules |
| POST | `/schedules` | Create new close schedule |
| GET | `/schedules/:id` | Get schedule details |
| GET | `/schedules/:id/tasklists` | Get tasklists for schedule |
| **Tasklists & Tasks** | | |
| GET | `/tasklists` | List all tasklists |
| GET | `/tasklists/:id` | Get tasklist details |
| GET | `/tasklists/:id/tasks` | Get tasks for tasklist |
| POST | `/tasklists/:id/tasks` | Create task in tasklist |
| PATCH | `/tasks/:id` | Update task (status, assignee, etc.) |
| **Templates** | | |
| GET | `/templates` | List close templates |
| GET | `/templates/:id` | Get template details |
| POST | `/templates` | Create new template |
| PATCH | `/templates/:id` | Update template |
| DELETE | `/templates/:id` | Delete template |
| POST | `/templates/:id/clone` | Clone template |
| GET | `/templates/:id/tasks` | Get template tasks |
| POST | `/templates/:id/tasks` | Add task to template |
| PATCH | `/template-tasks/:taskId` | Update template task |
| DELETE | `/template-tasks/:taskId` | Delete template task |
| POST | `/templates/:id/tasks/reorder` | Reorder template tasks |
| **Segregation of Duties (SoD)** | | |
| GET | `/sod/config` | Get SoD configuration |
| GET | `/sod/rules` | List SoD rules |
| GET | `/sod/violations` | List SoD violations |
| POST | `/sod/violations/:id/override` | Override a violation |
| POST | `/sod/check` | Check for SoD conflicts |
| **Certifications** | | |
| GET | `/certifications` | List certifications |
| POST | `/certifications` | Create certification |
| POST | `/certifications/:id/decertify` | Revoke certification |
| GET | `/certifications/kpis` | Certification metrics |

### Templates

Templates allow reusable close checklists:

```typescript
// shared/schema.ts (line 906)
export interface CloseTemplate {
  id: string;
  name: string;
  description: string;
  periodType: ClosePeriodType;
  templateType: "TASKLIST" | "SCHEDULE";
  isSystemTemplate: boolean;        // Built-in vs custom
  version: number;
  taskCount: number;
  estimatedDays: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}
```

### User Roles

```typescript
// shared/schema.ts (line 803)
export type CloseRole = "PREPARER" | "REVIEWER" | "CONTROLLER" | "AUDITOR" | "CFO";
```

| Role | Permissions |
|------|-------------|
| PREPARER | Create/edit tasks, submit for review, attach evidence |
| REVIEWER | Review submitted tasks, approve/reject, add comments |
| CONTROLLER | Final approval, lock periods, override SoD |
| AUDITOR | Read-only access, view audit trail |
| CFO | Full access, certification authority |

### Implementation Files

| File | Purpose |
|------|---------|
| `shared/schema.ts` | Type definitions and Zod schemas |
| `server/routes.ts` (lines 1079-1897) | API endpoint handlers |
| `server/storage.ts` | Data storage and retrieval |
| **Frontend Pages** | |
| `client/src/pages/close-control-dashboard.tsx` | Main dashboard with KPIs |
| `client/src/pages/close-control-kanban.tsx` | Kanban board view of tasks |
| `client/src/pages/close-control-schedule.tsx` | Schedule detail view |
| `client/src/pages/close-control-templates.tsx` | Template management |
| `client/src/pages/close-control-template-editor.tsx` | Template editor |
| `client/src/pages/close-control-tasklist.tsx` | Tasklist detail view |
| `client/src/pages/close-control-certification.tsx` | Certification workflows |
| `client/src/pages/close-control-calendar.tsx` | Calendar view |
| `client/src/pages/close-control-new.tsx` | Create new schedule |
| `client/src/pages/close-tasks.tsx` | Task management |
| `client/src/pages/my-tasks.tsx` | Current user's tasks |

### Extension Points

To add new functionality:

1. **Add new status**: Update `CloseTaskStatus` type in `shared/schema.ts`
2. **Add new field**: Update interfaces and insert schemas
3. **Add validation**: Update Zod schemas with new rules
4. **Add API**: Add route handler in `server/routes.ts`
5. **Add UI**: Update page component

---

## Reconciliation Workflow

### Purpose
Verifies GL account balances against supporting documentation with structured review and approval.

### Status Definitions

```typescript
// shared/schema.ts (line 1322)
export type ReconciliationStatus = 
  | "NOT_STARTED"     // Reconciliation created, no work done
  | "IN_PROGRESS"     // Preparer actively reconciling
  | "PENDING_REVIEW"  // Submitted for reviewer
  | "REVIEWED"        // Reviewer approved
  | "APPROVED"        // Final approval granted
  | "LOCKED";         // Period closed
```

### Status Transitions

```
┌─────────────┐
│ NOT_STARTED │
└──────┬──────┘
       │ Preparer opens reconciliation
       ▼
┌─────────────┐
│ IN_PROGRESS │◄────────────────┐
└──────┬──────┘                 │
       │ Preparer completes     │ Reviewer returns
       ▼                        │
┌───────────────┐               │
│PENDING_REVIEW │───────────────┘
└──────┬────────┘
       │ Reviewer approves
       ▼
┌─────────────┐
│  REVIEWED   │◄────────────────┐
└──────┬──────┘                 │
       │ Controller approves    │ Controller returns
       ▼                        │
┌─────────────┐                 │
│  APPROVED   │─────────────────┘
└──────┬──────┘
       │ Period lock
       ▼
┌─────────────┐
│   LOCKED    │
└─────────────┘
```

### Data Models

#### Reconciliation Interface
```typescript
// shared/schema.ts (line 1401)
export interface Reconciliation {
  reconciliationId: string;
  accountId: string;
  templateId: string;
  period: string;                    // YYYY-MM
  status: ReconciliationStatus;
  glBalance: number;
  reconciledBalance: number;
  variance: number;
  sections: ReconciliationSectionInstance[];
  // FX-related fields
  reportingCurrency: string;
  bankAccounts: ReconciliationBankAccount[];
  totalBankBalance: number;
  fxRevaluationAmount: number;
  fxRevaluationManualAdj: number;
  reconciliationEquation: ReconciliationEquation | null;
  // Workflow fields
  preparedBy: string | null;
  preparedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  notes: string | null;
  attachmentCount: number;
  createdAt: string;
  updatedAt: string;
}
```

#### ReconciliationAccount Interface
```typescript
// shared/schema.ts (line 1378)
export interface ReconciliationAccount {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: ReconciliationAccountType;
  entityId: string;
  currency: string;
  defaultTemplateId: string | null;
  isActive: boolean;
  createdAt: string;
}
```

### Template System

Reconciliation templates define the structure:

```typescript
// shared/schema.ts (line 1340)
export interface ReconciliationTemplate {
  templateId: string;
  name: string;
  description: string;
  accountTypes: ReconciliationAccountType[];
  monetaryType: MonetaryType;
  fxApplicable: boolean;
  templateVariant?: string;
  sections: ReconciliationTemplateSection[];
  isSystemTemplate: boolean;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}
```

### Built-in Templates

| Template ID | Name | Use Case |
|-------------|------|----------|
| `CASH_3WAY` | Cash 3-Way Reconciliation | Bank/Book/Outstanding items |
| `ACCRUAL_12M_ROLLFORWARD` | Accrual 12-Month Rollforward | Monthly accrual tracking |
| `PREPAID_SCHEDULE_ANCHORED` | Prepaid Schedule-Anchored | Ties to Schedule Studio |
| `FIXED_ASSET_REGISTER` | Fixed Asset Register | Asset subledger tie-out |
| `STANDARD` | Standard GL Reconciliation | General ledger accounts |

### API Endpoints

All endpoints prefixed with `/api/reconciliations/`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/kpis` | Dashboard metrics |
| GET | `/templates` | List templates |
| GET | `/templates/:id` | Get template details |
| GET | `/accounts` | List accounts to reconcile |
| GET | `/accounts/:id` | Get account details |
| GET | `/` | List reconciliations (filter by entity/period) |
| GET | `/:id` | Get reconciliation details |
| POST | `/` | Create new reconciliation |
| PATCH | `/:id/status` | Update reconciliation status |
| POST | `/:id/sections/:sectionId/items` | Add line item |
| PATCH | `/:id/template` | Change template |

### Implementation Files

| File | Purpose |
|------|---------|
| `shared/schema.ts` (lines 1280-1630) | Type definitions |
| `server/routes.ts` (lines 1897-2049) | API endpoints |
| `server/storage.ts` | Data operations |
| `client/src/pages/reconciliations.tsx` | Dashboard |
| `client/src/pages/reconciliation-workspace.tsx` | Workspace UI |

---

## Certification Workflow

### Purpose
Provides multi-level sign-off for close periods with segregation of duties enforcement.

### Status Definitions

```typescript
// shared/schema.ts (line 1130)
export type CertificationStatus = 
  | "NOT_CERTIFIED"  // No certification action taken
  | "PENDING"        // Awaiting required sign-offs
  | "CERTIFIED"      // All required certifications obtained
  | "DECERTIFIED";   // Previously certified, now revoked
```

### Data Models

#### Certification Interface
```typescript
// shared/schema.ts (line 1181)
export interface Certification {
  id: string;
  closeScheduleId: string;
  tasklistId: string | null;
  userId: string;
  userName: string;
  status: CertificationStatus;
  statement: string;              // Certification statement text
  certifiedAt: string | null;
  decertifiedAt: string | null;
  decertifiedBy: string | null;
  decertificationReason: string | null;
  createdAt: string;
}
```

#### CertificationSignOff Interface
```typescript
// shared/schema.ts (line 1201)
export interface CertificationSignOff {
  userId: string;
  role: CloseRole;
  statement: string;
  acknowledgments: CertificationAcknowledgment[];
}

export interface CertificationAcknowledgment {
  id: string;
  text: string;
  required: boolean;
  acknowledged: boolean;
}
```

### Segregation of Duties (SoD)

SoD prevents conflicts of interest:

```typescript
// shared/schema.ts (SoD Configuration)
export interface SoDConfiguration {
  enabled: boolean;
  rules: SoDRule[];
  allowOverride: boolean;
  requireOverrideApproval: boolean;
  overrideApproverRole: CloseRole;
}

export interface SoDRule {
  id: string;
  conflictingRoles: [CloseRole, CloseRole];
  description: string;
  severity: "BLOCKING" | "WARNING";
}
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/certifications` | List certifications |
| POST | `/certifications` | Create certification |
| POST | `/certifications/:id/decertify` | Revoke certification |
| GET | `/certifications/kpis` | Certification metrics |
| GET | `/sod/config` | Get SoD configuration |
| GET | `/sod/rules` | List SoD rules |
| GET | `/sod/violations` | List violations |
| POST | `/sod/violations/:id/override` | Override violation |
| POST | `/sod/check` | Check for SoD conflicts |

---

## Disclosure Review Workflow

> **Implementation Status**: UI demonstration with sample data. Backend API not yet implemented.

### Purpose
Manages the preparation and review of financial statement disclosures.

### Status Definitions (Planned)

```typescript
// Intended for NetTool notes, schedules, narratives (not yet in schema)
type DisclosureStatus = 
  | "DRAFT"        // Initial creation, editable
  | "UNDER_REVIEW" // Submitted for review
  | "APPROVED"     // Reviewer approved
  | "PUBLISHED";   // Included in final statements
```

### Components

1. **Disclosure Notes**: Text explanations for financial statements
2. **Schedules**: Tabular data grids (rollforward, composition, etc.)
3. **Narratives**: MD&A sections and commentary

### Current Implementation

- **UI Location**: `client/src/pages/nettool.tsx`
- **Data**: Sample/mock data for demonstration
- **Backend**: Not yet implemented - no API endpoints for disclosure review workflow

### Future Development

To fully implement this workflow:
1. Add `DisclosureStatus` type to `shared/schema.ts`
2. Create API endpoints in `server/routes.ts` for status transitions
3. Add storage methods in `server/storage.ts`
4. Connect UI to backend APIs

---

## Implementation Guide

### Adding a New Workflow Status

1. **Update Schema** (`shared/schema.ts`):
```typescript
export type CloseTaskStatus = 
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "REVIEWED"
  | "APPROVED"
  | "LOCKED"
  | "NEW_STATUS";  // Add here
```

2. **Update Insert Schema**:
```typescript
export const insertCloseTaskSchema = z.object({
  // ...
  status: z.enum([
    "NOT_STARTED", "IN_PROGRESS", "SUBMITTED", 
    "REVIEWED", "APPROVED", "LOCKED", "NEW_STATUS"
  ]),
});
```

3. **Update Storage** (`server/storage.ts`):
```typescript
// Add validation logic for status transitions
async updateTaskStatus(id: string, newStatus: CloseTaskStatus) {
  const task = await this.getTask(id);
  // Validate transition is allowed
  const allowedTransitions = {
    "NOT_STARTED": ["IN_PROGRESS"],
    "IN_PROGRESS": ["SUBMITTED", "NOT_STARTED"],
    "SUBMITTED": ["REVIEWED", "IN_PROGRESS"],
    // Add new transitions
  };
  // ...
}
```

4. **Update UI** (e.g., `client/src/pages/close-control-dashboard.tsx` or relevant page):
```typescript
const statusColors: Record<CloseTaskStatus, string> = {
  NOT_STARTED: "bg-gray-500",
  IN_PROGRESS: "bg-blue-500",
  SUBMITTED: "bg-yellow-500",
  REVIEWED: "bg-purple-500",
  APPROVED: "bg-green-500",
  LOCKED: "bg-slate-500",
  NEW_STATUS: "bg-orange-500",  // Add here
};
```

### Adding Status Transition Validation

```typescript
// server/routes.ts
app.patch("/api/close-control/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { status, ...updates } = req.body;
  
  if (status) {
    const task = await storage.getCloseTask(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    // Validate transition
    const allowedTransitions: Record<CloseTaskStatus, CloseTaskStatus[]> = {
      NOT_STARTED: ["IN_PROGRESS"],
      IN_PROGRESS: ["SUBMITTED", "NOT_STARTED"],
      SUBMITTED: ["REVIEWED", "IN_PROGRESS"],
      REVIEWED: ["APPROVED", "IN_PROGRESS"],
      APPROVED: ["LOCKED"],
      LOCKED: [],
    };
    
    if (!allowedTransitions[task.status]?.includes(status)) {
      return res.status(400).json({ 
        error: `Cannot transition from ${task.status} to ${status}` 
      });
    }
  }
  
  const updated = await storage.updateCloseTask(id, { status, ...updates });
  res.json(updated);
});
```

### Adding Audit Logging

```typescript
// server/storage.ts
async logAuditEntry(entry: Omit<CloseAuditLogEntry, "id" | "timestamp">) {
  const auditEntry: CloseAuditLogEntry = {
    id: randomUUID(),
    ...entry,
    timestamp: new Date().toISOString(),
  };
  this.auditLog.set(auditEntry.id, auditEntry);
  return auditEntry;
}

// Usage in route handler
app.patch("/api/close-control/tasks/:id", async (req, res) => {
  const task = await storage.getCloseTask(id);
  const updated = await storage.updateCloseTask(id, updates);
  
  // Log the change
  await storage.logAuditEntry({
    objectType: "TASK",
    objectId: id,
    action: "STATUS_CHANGE",
    userId: req.user.id,
    userName: req.user.name,
    beforeValue: JSON.stringify({ status: task.status }),
    afterValue: JSON.stringify({ status: updated.status }),
    period: task.period,
  });
  
  res.json(updated);
});
```

### Adding Role-Based Authorization

```typescript
// server/middleware/auth.ts
export function requireRole(...allowedRoles: CloseRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: "Insufficient permissions",
        required: allowedRoles,
        current: userRole 
      });
    }
    next();
  };
}

// Usage
app.patch(
  "/api/close-control/tasks/:id/approve",
  requireRole("CONTROLLER", "CFO"),
  async (req, res) => {
    // Only CONTROLLER or CFO can approve
  }
);
```

---

## Testing Workflows

### Manual Testing Checklist

#### Close Control
- [ ] Create close schedule from template
- [ ] Add tasks to tasklist
- [ ] Assign preparer and reviewer
- [ ] Progress task through all statuses
- [ ] Verify status transitions are enforced
- [ ] Lock completed schedule

#### Reconciliation
- [ ] Create reconciliation for account
- [ ] Add line items to sections
- [ ] Calculate variance
- [ ] Submit for review
- [ ] Approve reconciliation
- [ ] Verify locked state

#### Certification
- [ ] Create certification for tasklist
- [ ] Check SoD violations
- [ ] Override violation with justification
- [ ] Certify tasklist
- [ ] Decertify with reason

---

## Database Schema Reference

The workflow data is stored in-memory using Maps in `server/storage.ts`. For production, migrate to PostgreSQL tables:

```sql
-- Close Tasks
CREATE TABLE close_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tasklist_id UUID NOT NULL REFERENCES close_tasklists(id),
  close_schedule_id UUID NOT NULL REFERENCES close_schedules(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'NOT_STARTED',
  priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
  preparer_id UUID REFERENCES users(id),
  reviewer_id UUID REFERENCES users(id),
  due_date TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  evidence_status VARCHAR(50) DEFAULT 'MISSING',
  period VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reconciliations
CREATE TABLE reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES reconciliation_accounts(id),
  template_id UUID NOT NULL REFERENCES reconciliation_templates(id),
  period VARCHAR(7) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'NOT_STARTED',
  gl_balance DECIMAL(18,2) NOT NULL,
  reconciled_balance DECIMAL(18,2),
  variance DECIMAL(18,2),
  prepared_by UUID REFERENCES users(id),
  prepared_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Certifications
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  close_schedule_id UUID NOT NULL REFERENCES close_schedules(id),
  tasklist_id UUID REFERENCES close_tasklists(id),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'NOT_CERTIFIED',
  statement TEXT NOT NULL,
  certified_at TIMESTAMP,
  decertified_at TIMESTAMP,
  decertified_by UUID REFERENCES users(id),
  decertification_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

*Last updated: January 2026*
