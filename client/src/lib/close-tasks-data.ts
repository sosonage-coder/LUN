export type TaskStatus = 'NOT_STARTED' | 'IN_PROCESS' | 'COMPLETED';

export type CloseType = 'MONTHLY' | 'QUARTERLY';

export type TrialBalanceClass = 
  | 'ASSETS'
  | 'LIABILITIES'
  | 'EQUITY'
  | 'REVENUE'
  | 'EXPENSES';

export type CloseProcess = 
  | 'CASH'
  | 'PREPAIDS'
  | 'FIXED_ASSETS'
  | 'ACCRUALS'
  | 'PAYROLL'
  | 'REVENUE'
  | 'TAXES'
  | 'INTERCOMPANY'
  | 'CONSOLIDATION'
  | 'CLOSE_FINALIZATION';

export interface ClosePeriod {
  id: string;
  name: string;
  closeType: CloseType;
  startDate: string;
  endDate: string;
  closeDeadline: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  year: number;
  month: number;
  quarter?: number;
}

export interface CloseControl {
  id: string;
  name: string;
  description: string;
  tbClass: TrialBalanceClass;
  process: CloseProcess;
  isRequired: boolean;
  linkedTaskId?: string;
}

export interface CloseTask {
  id: string;
  name: string;
  description?: string;
  periodId: string;
  process: CloseProcess;
  tbClass: TrialBalanceClass;
  controlId?: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  dueDay: number;
  status: TaskStatus;
  completedAt?: string;
  completedBy?: string;
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface CloseTaskTemplate {
  id: string;
  name: string;
  description?: string;
  process: CloseProcess;
  tbClass: TrialBalanceClass;
  controlId: string;
  defaultDueDay: number;
  defaultAssignee?: string;
}

export interface CloseUser {
  id: string;
  name: string;
  email: string;
  role: 'CONTROLLER' | 'SENIOR_ACCOUNTANT' | 'STAFF_ACCOUNTANT' | 'MANAGER';
}

export const PROCESS_LABELS: Record<CloseProcess, string> = {
  CASH: 'Cash',
  PREPAIDS: 'Prepaids',
  FIXED_ASSETS: 'Fixed Assets',
  ACCRUALS: 'Accruals',
  PAYROLL: 'Payroll',
  REVENUE: 'Revenue',
  TAXES: 'Taxes',
  INTERCOMPANY: 'Intercompany',
  CONSOLIDATION: 'Consolidation',
  CLOSE_FINALIZATION: 'Close Finalization',
};

export const TB_CLASS_LABELS: Record<TrialBalanceClass, string> = {
  ASSETS: 'Assets',
  LIABILITIES: 'Liabilities',
  EQUITY: 'Equity',
  REVENUE: 'Revenue',
  EXPENSES: 'Expenses',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROCESS: 'In Process',
  COMPLETED: 'Completed',
};

export const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; border: string }> = {
  NOT_STARTED: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' },
  IN_PROCESS: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  COMPLETED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
};

const SAMPLE_USERS: CloseUser[] = [
  { id: 'user-1', name: 'Alex Chen', email: 'alex.chen@company.com', role: 'CONTROLLER' },
  { id: 'user-2', name: 'Sam Rodriguez', email: 'sam.r@company.com', role: 'SENIOR_ACCOUNTANT' },
  { id: 'user-3', name: 'Nina Patel', email: 'nina.p@company.com', role: 'STAFF_ACCOUNTANT' },
  { id: 'user-4', name: 'Jordan Kim', email: 'jordan.k@company.com', role: 'MANAGER' },
];

const SAMPLE_CONTROLS: CloseControl[] = [
  { id: 'ctrl-1', name: 'Cash Reconciliation', description: 'Reconcile all bank accounts to GL', tbClass: 'ASSETS', process: 'CASH', isRequired: true },
  { id: 'ctrl-2', name: 'Petty Cash Count', description: 'Physical count and reconciliation of petty cash', tbClass: 'ASSETS', process: 'CASH', isRequired: true },
  { id: 'ctrl-3', name: 'Prepaid Expense Review', description: 'Review and amortize prepaid expenses', tbClass: 'ASSETS', process: 'PREPAIDS', isRequired: true },
  { id: 'ctrl-4', name: 'Prepaid Schedule Build', description: 'Build prepaid amortization schedules', tbClass: 'ASSETS', process: 'PREPAIDS', isRequired: true },
  { id: 'ctrl-5', name: 'Fixed Asset Additions', description: 'Review and capitalize asset additions', tbClass: 'ASSETS', process: 'FIXED_ASSETS', isRequired: true },
  { id: 'ctrl-6', name: 'Depreciation Calculation', description: 'Calculate and post depreciation', tbClass: 'ASSETS', process: 'FIXED_ASSETS', isRequired: true },
  { id: 'ctrl-7', name: 'Accounts Payable Review', description: 'Review AP aging and cutoff', tbClass: 'LIABILITIES', process: 'ACCRUALS', isRequired: true },
  { id: 'ctrl-8', name: 'Accrued Expenses', description: 'Accrue period expenses', tbClass: 'LIABILITIES', process: 'ACCRUALS', isRequired: true },
  { id: 'ctrl-9', name: 'Payroll Liabilities', description: 'Reconcile payroll liabilities', tbClass: 'LIABILITIES', process: 'PAYROLL', isRequired: true },
  { id: 'ctrl-10', name: 'Payroll Expense Review', description: 'Review payroll expense postings', tbClass: 'EXPENSES', process: 'PAYROLL', isRequired: true },
  { id: 'ctrl-11', name: 'Revenue Cutoff', description: 'Verify revenue recognition cutoff', tbClass: 'REVENUE', process: 'REVENUE', isRequired: true },
  { id: 'ctrl-12', name: 'Deferred Revenue Review', description: 'Review and release deferred revenue', tbClass: 'LIABILITIES', process: 'REVENUE', isRequired: true },
  { id: 'ctrl-13', name: 'Tax Provision', description: 'Calculate income tax provision', tbClass: 'LIABILITIES', process: 'TAXES', isRequired: true },
  { id: 'ctrl-14', name: 'Sales Tax Reconciliation', description: 'Reconcile sales tax liabilities', tbClass: 'LIABILITIES', process: 'TAXES', isRequired: true },
  { id: 'ctrl-15', name: 'Intercompany Reconciliation', description: 'Reconcile intercompany balances', tbClass: 'ASSETS', process: 'INTERCOMPANY', isRequired: true },
  { id: 'ctrl-16', name: 'Intercompany Elimination', description: 'Post intercompany elimination entries', tbClass: 'EQUITY', process: 'INTERCOMPANY', isRequired: false },
  { id: 'ctrl-17', name: 'Expense Variance Analysis', description: 'Analyze expense variances vs budget', tbClass: 'EXPENSES', process: 'CLOSE_FINALIZATION', isRequired: true },
  { id: 'ctrl-18', name: 'Trial Balance Review', description: 'Final TB review and signoff', tbClass: 'EQUITY', process: 'CLOSE_FINALIZATION', isRequired: true },
];

function generateTasksForPeriod(period: ClosePeriod, controls: CloseControl[]): CloseTask[] {
  const tasks: CloseTask[] = [];
  const today = new Date();
  const periodStart = new Date(period.startDate);
  
  controls.forEach((control, index) => {
    const dueDay = Math.min(1 + Math.floor(index / 3), 5);
    const dueDate = new Date(periodStart);
    dueDate.setDate(dueDate.getDate() + dueDay - 1);
    
    const assigneeIndex = index % SAMPLE_USERS.length;
    const assignee = SAMPLE_USERS[assigneeIndex];
    
    let status: TaskStatus = 'NOT_STARTED';
    let completedAt: string | undefined;
    let completedBy: string | undefined;
    
    if (dueDate < today) {
      const rand = Math.random();
      if (rand < 0.7) {
        status = 'COMPLETED';
        completedAt = dueDate.toISOString();
        completedBy = assignee.id;
      } else if (rand < 0.85) {
        status = 'IN_PROCESS';
      }
    } else if (dueDate.getTime() - today.getTime() < 2 * 24 * 60 * 60 * 1000) {
      status = Math.random() < 0.5 ? 'IN_PROCESS' : 'NOT_STARTED';
    }
    
    tasks.push({
      id: `task-${period.id}-${control.id}`,
      name: control.name,
      description: control.description,
      periodId: period.id,
      process: control.process,
      tbClass: control.tbClass,
      controlId: control.id,
      assignedTo: assignee.id,
      assignedToName: assignee.name,
      dueDate: dueDate.toISOString().split('T')[0],
      dueDay,
      status,
      completedAt,
      completedBy,
      comments: [],
      createdAt: period.startDate,
      updatedAt: new Date().toISOString(),
    });
  });
  
  return tasks;
}

function generateCurrentPeriod(): ClosePeriod {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const closeDeadline = new Date(year, month + 1, 10);
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  return {
    id: `period-${year}-${String(month + 1).padStart(2, '0')}`,
    name: `${monthNames[month]} ${year} Close`,
    closeType: 'MONTHLY',
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    closeDeadline: closeDeadline.toISOString().split('T')[0],
    status: 'IN_PROGRESS',
    year,
    month: month + 1,
  };
}

let cachedPeriod: ClosePeriod | null = null;
let cachedTasks: CloseTask[] | null = null;
let cachedControls: CloseControl[] | null = null;

export function getClosePeriods(): ClosePeriod[] {
  if (!cachedPeriod) {
    cachedPeriod = generateCurrentPeriod();
  }
  return [cachedPeriod];
}

export function getCurrentPeriod(): ClosePeriod {
  if (!cachedPeriod) {
    cachedPeriod = generateCurrentPeriod();
  }
  return cachedPeriod;
}

export function getControls(): CloseControl[] {
  if (!cachedControls) {
    cachedControls = [...SAMPLE_CONTROLS];
  }
  return cachedControls;
}

export function getCloseUsers(): CloseUser[] {
  return SAMPLE_USERS;
}

export function getTasks(periodId?: string): CloseTask[] {
  if (!cachedTasks) {
    const period = getCurrentPeriod();
    cachedTasks = generateTasksForPeriod(period, SAMPLE_CONTROLS);
  }
  
  if (periodId) {
    return cachedTasks.filter(t => t.periodId === periodId);
  }
  return cachedTasks;
}

export function getTasksByUser(userId: string): CloseTask[] {
  return getTasks().filter(t => t.assignedTo === userId);
}

export function getTasksByProcess(process: CloseProcess): CloseTask[] {
  return getTasks().filter(t => t.process === process);
}

export function getTasksByTBClass(tbClass: TrialBalanceClass): CloseTask[] {
  return getTasks().filter(t => t.tbClass === tbClass);
}

export function updateTaskStatus(taskId: string, status: TaskStatus): CloseTask | null {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.status = status;
    task.updatedAt = new Date().toISOString();
    if (status === 'COMPLETED') {
      task.completedAt = new Date().toISOString();
      task.completedBy = 'user-1';
    } else {
      task.completedAt = undefined;
      task.completedBy = undefined;
    }
  }
  return task || null;
}

export function addTaskComment(taskId: string, content: string, userId: string, userName: string): TaskComment | null {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    const comment: TaskComment = {
      id: `comment-${Date.now()}`,
      taskId,
      userId,
      userName,
      content,
      createdAt: new Date().toISOString(),
    };
    task.comments.push(comment);
    return comment;
  }
  return null;
}

export function isTaskOverdue(task: CloseTask): boolean {
  if (task.status === 'COMPLETED') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  return dueDate < today;
}

export function getTaskStats(periodId?: string) {
  const tasks = getTasks(periodId);
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProcess = tasks.filter(t => t.status === 'IN_PROCESS').length;
  const notStarted = tasks.filter(t => t.status === 'NOT_STARTED').length;
  const overdue = tasks.filter(t => isTaskOverdue(t)).length;
  
  return {
    total,
    completed,
    inProcess,
    notStarted,
    overdue,
    percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getStatsByProcess(periodId?: string): Record<CloseProcess, { total: number; completed: number; status: 'complete' | 'in_progress' | 'not_started' }> {
  const tasks = getTasks(periodId);
  const result: Record<string, { total: number; completed: number; status: 'complete' | 'in_progress' | 'not_started' }> = {};
  
  Object.keys(PROCESS_LABELS).forEach(process => {
    const processTasks = tasks.filter(t => t.process === process);
    const completed = processTasks.filter(t => t.status === 'COMPLETED').length;
    const inProcess = processTasks.filter(t => t.status === 'IN_PROCESS').length;
    
    let status: 'complete' | 'in_progress' | 'not_started' = 'not_started';
    if (processTasks.length > 0 && completed === processTasks.length) {
      status = 'complete';
    } else if (completed > 0 || inProcess > 0) {
      status = 'in_progress';
    }
    
    result[process] = {
      total: processTasks.length,
      completed,
      status,
    };
  });
  
  return result as Record<CloseProcess, { total: number; completed: number; status: 'complete' | 'in_progress' | 'not_started' }>;
}

export function getControlCoverage(periodId?: string): { 
  byClass: Record<TrialBalanceClass, { controls: Array<{ control: CloseControl; task?: CloseTask; isLinked: boolean; isCompleted: boolean }> }>;
  totalControls: number;
  linkedControls: number;
  completedControls: number;
} {
  const controls = getControls();
  const tasks = getTasks(periodId);
  
  const byClass: Record<string, { controls: Array<{ control: CloseControl; task?: CloseTask; isLinked: boolean; isCompleted: boolean }> }> = {};
  
  Object.keys(TB_CLASS_LABELS).forEach(tbClass => {
    byClass[tbClass] = { controls: [] };
  });
  
  let linkedControls = 0;
  let completedControls = 0;
  
  controls.forEach(control => {
    const task = tasks.find(t => t.controlId === control.id);
    const isLinked = !!task;
    const isCompleted = task?.status === 'COMPLETED';
    
    if (isLinked) linkedControls++;
    if (isCompleted) completedControls++;
    
    byClass[control.tbClass].controls.push({
      control,
      task,
      isLinked,
      isCompleted,
    });
  });
  
  return {
    byClass: byClass as Record<TrialBalanceClass, { controls: Array<{ control: CloseControl; task?: CloseTask; isLinked: boolean; isCompleted: boolean }> }>,
    totalControls: controls.length,
    linkedControls,
    completedControls,
  };
}
