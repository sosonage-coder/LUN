import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Plus, 
  Download, 
  DollarSign, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  History,
  Paperclip,
  Shield,
  Edit,
  TrendingUp,
  TrendingDown,
  MoreHorizontal
} from "lucide-react";
import type { 
  AccrualSchedule,
  AccrualCategory
} from "@shared/schema";

const categoryLabels: Record<AccrualCategory, string> = {
  PAYROLL: "Payroll",
  BONUSES_COMMISSIONS: "Bonuses & Commissions",
  PROFESSIONAL_FEES: "Professional Fees",
  HOSTING_SAAS: "Hosting & SaaS",
  UTILITIES: "Utilities",
  OTHER: "Other",
};

const lifecycleColors: Record<string, string> = {
  ACTIVE: "bg-emerald-600",
  DORMANT: "bg-amber-500",
  CLOSED: "bg-slate-500",
  ARCHIVED: "bg-slate-400",
};

const lifecycleLabels: Record<string, string> = {
  ACTIVE: "Active",
  DORMANT: "Dormant",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};

const confidenceColors: Record<string, string> = {
  HIGH: "bg-emerald-600",
  MEDIUM: "bg-amber-500",
  LOW: "bg-red-500",
};

const evidenceColors: Record<string, string> = {
  ATTACHED: "bg-emerald-600",
  MISSING: "bg-red-500",
};

const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

interface PeriodLine {
  period: string;
  state: string;
  amount: number;
  cumulative: number;
  remaining: number;
  trueUp: number;
}

interface ScheduleEvent {
  id: string;
  type: string;
  effectivePeriod: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

export default function AccrualsWorkspace() {
  const params = useParams<{ category: string; id: string }>();
  
  const { data: schedule, isLoading } = useQuery<AccrualSchedule>({
    queryKey: ["/api/accruals", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/accruals/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch accrual");
      return res.json();
    },
    enabled: !!params.id,
  });

  const mockPeriodLines: PeriodLine[] = [
    { period: "2025-07", state: "CLOSED", amount: 45000, cumulative: 45000, remaining: 180000, trueUp: 0 },
    { period: "2025-08", state: "CLOSED", amount: 45000, cumulative: 90000, remaining: 135000, trueUp: 0 },
    { period: "2025-09", state: "CLOSED", amount: 47500, cumulative: 137500, remaining: 87500, trueUp: 2500 },
    { period: "2025-10", state: "SYSTEM_BASE", amount: 45000, cumulative: 182500, remaining: 42500, trueUp: 0 },
    { period: "2025-11", state: "SYSTEM_BASE", amount: 45000, cumulative: 227500, remaining: -2500, trueUp: 0 },
    { period: "2025-12", state: "SYSTEM_BASE", amount: 42500, cumulative: 270000, remaining: -45000, trueUp: -2500 },
  ];

  const mockEvents: ScheduleEvent[] = [
    { id: "1", type: "CREATED", effectivePeriod: "2025-07", description: "Schedule created with initial accrual of $45,000/month", createdAt: "2025-07-01T10:00:00Z", createdBy: "John Smith" },
    { id: "2", type: "TRUE_UP", effectivePeriod: "2025-09", description: "Adjusted for actual invoice: +$2,500", createdAt: "2025-09-15T14:30:00Z", createdBy: "Jane Doe" },
    { id: "3", type: "REVIEWED", effectivePeriod: "2025-10", description: "Monthly review completed", createdAt: "2025-10-05T09:00:00Z", createdBy: "Controller" },
  ];

  const stateColors: Record<string, string> = {
    CLOSED: "bg-slate-600",
    SYSTEM_BASE: "bg-blue-500",
    SYSTEM_ADJUSTED: "bg-amber-500",
    EXTERNAL: "bg-purple-500",
  };

  const stateLabels: Record<string, string> = {
    CLOSED: "Closed",
    SYSTEM_BASE: "Base",
    SYSTEM_ADJUSTED: "Adjusted",
    EXTERNAL: "External",
  };

  const eventTypeColors: Record<string, string> = {
    CREATED: "bg-emerald-500",
    TRUE_UP: "bg-amber-500",
    REVIEWED: "bg-blue-500",
    ADJUSTMENT: "bg-purple-500",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Accrual schedule not found
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/accruals/${params.category}`}>
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" data-testid="schedule-name">{schedule.name}</h1>
              <Badge className={lifecycleColors[schedule.lifecycleState]} variant="secondary">
                {lifecycleLabels[schedule.lifecycleState]}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {categoryLabels[schedule.category]} • {schedule.owner}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" data-testid="button-edit">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" data-testid="button-add-event">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card data-testid="kpi-accrual-amount">
          <CardHeader className="pb-2">
            <CardDescription>Current Accrual</CardDescription>
            <CardTitle className="text-xl text-amber-500">
              {formatCurrency(schedule.accrualAmount, schedule.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-prior-period">
          <CardHeader className="pb-2">
            <CardDescription>Prior Period</CardDescription>
            <CardTitle className="text-xl">
              {formatCurrency(schedule.priorPeriodAmount, schedule.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-true-up">
          <CardHeader className="pb-2">
            <CardDescription>True-Up</CardDescription>
            <CardTitle className={`text-xl flex items-center gap-1 ${schedule.trueUpAmount >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {schedule.trueUpAmount >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {formatCurrency(schedule.trueUpAmount, schedule.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-confidence">
          <CardHeader className="pb-2">
            <CardDescription>Confidence</CardDescription>
            <CardTitle className="text-xl">
              <Badge className={confidenceColors[schedule.confidenceLevel]} variant="secondary">
                {schedule.confidenceLevel}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-evidence">
          <CardHeader className="pb-2">
            <CardDescription>Evidence</CardDescription>
            <CardTitle className="text-xl">
              <Badge className={evidenceColors[schedule.evidence]} variant="secondary">
                {schedule.evidence}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="periods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="periods" data-testid="tab-periods">
            <Calendar className="h-4 w-4 mr-2" />
            Period Schedule
          </TabsTrigger>
          <TabsTrigger value="events" data-testid="tab-events">
            <History className="h-4 w-4 mr-2" />
            Event History
          </TabsTrigger>
          <TabsTrigger value="evidence" data-testid="tab-evidence">
            <Paperclip className="h-4 w-4 mr-2" />
            Evidence
          </TabsTrigger>
          <TabsTrigger value="audit" data-testid="tab-audit">
            <Shield className="h-4 w-4 mr-2" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="periods">
          <Card>
            <CardHeader>
              <CardTitle>Period Schedule</CardTitle>
              <CardDescription>
                Line-level accrual amounts by period with cumulative tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table data-testid="period-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Accrual Amount</TableHead>
                    <TableHead className="text-right">True-Up</TableHead>
                    <TableHead className="text-right">Cumulative</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPeriodLines.map((line) => (
                    <TableRow key={line.period} data-testid={`period-row-${line.period}`}>
                      <TableCell className="font-mono">{line.period}</TableCell>
                      <TableCell>
                        <Badge className={stateColors[line.state]} variant="secondary">
                          {stateLabels[line.state]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(line.amount)}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${line.trueUp !== 0 ? (line.trueUp > 0 ? "text-emerald-500" : "text-red-500") : ""}`}>
                        {line.trueUp !== 0 ? formatCurrency(line.trueUp) : "—"}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(line.cumulative)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {formatCurrency(line.remaining)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event History</CardTitle>
              <CardDescription>
                Append-only log of all modifications to this schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="events-list">
                {mockEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg" data-testid={`event-${event.id}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${eventTypeColors[event.type]}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{event.type}</Badge>
                        <span className="text-sm text-muted-foreground font-mono">{event.effectivePeriod}</span>
                      </div>
                      <p className="mt-1">{event.description}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {formatDate(event.createdAt)} by {event.createdBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card>
            <CardHeader>
              <CardTitle>Evidence & Attachments</CardTitle>
              <CardDescription>
                Supporting documentation for this accrual schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedule.evidence === "ATTACHED" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover-elevate">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">Invoice_Q4_2025.pdf</p>
                      <p className="text-sm text-muted-foreground">Uploaded Oct 15, 2025</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover-elevate">
                    <FileText className="h-5 w-5 text-emerald-500" />
                    <div className="flex-1">
                      <p className="font-medium">Contract_Agreement.pdf</p>
                      <p className="text-sm text-muted-foreground">Uploaded Jul 1, 2025</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No evidence attached to this schedule</p>
                  <Button>
                    <Paperclip className="h-4 w-4 mr-2" />
                    Upload Evidence
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Complete history of all changes and reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table data-testid="audit-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">{formatDate(schedule.createdAt)}</TableCell>
                    <TableCell><Badge variant="outline">Created</Badge></TableCell>
                    <TableCell>{schedule.owner}</TableCell>
                    <TableCell className="text-muted-foreground">Initial schedule creation</TableCell>
                  </TableRow>
                  {schedule.lastReviewedAt && (
                    <TableRow>
                      <TableCell className="font-mono text-sm">{formatDate(schedule.lastReviewedAt)}</TableCell>
                      <TableCell><Badge variant="outline">Reviewed</Badge></TableCell>
                      <TableCell>{schedule.lastReviewedBy}</TableCell>
                      <TableCell className="text-muted-foreground">Period review completed</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
