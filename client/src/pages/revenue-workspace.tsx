import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Plus, 
  Download, 
  AlertTriangle,
  FileText,
  Calendar,
  History,
  Paperclip,
  Shield,
  Edit,
  TrendingUp
} from "lucide-react";
import type { 
  RevenueSchedule,
  RevenueCategory
} from "@shared/schema";

const categoryLabels: Record<RevenueCategory, string> = {
  SUBSCRIPTIONS: "Subscriptions",
  SUPPORT_MAINTENANCE: "Support & Maintenance",
  USAGE_BASED: "Usage-Based",
  MILESTONE_BASED: "Milestone-Based",
  LICENSING: "Licensing",
  OTHER: "Other Revenue",
};

const lifecycleColors: Record<string, string> = {
  ACTIVE: "bg-emerald-600",
  DORMANT: "bg-amber-500",
  COMPLETED: "bg-slate-500",
  ARCHIVED: "bg-slate-400",
};

const lifecycleLabels: Record<string, string> = {
  ACTIVE: "Active",
  DORMANT: "Dormant",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

const judgmentColors: Record<string, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-amber-500",
  LOW: "bg-emerald-600",
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
  recognized: number;
  cumulative: number;
  deferred: number;
}

export default function RevenueWorkspace() {
  const params = useParams<{ category: string; id: string }>();
  
  const { data: schedule, isLoading } = useQuery<RevenueSchedule>({
    queryKey: ["/api/revenue", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/revenue/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch contract");
      return res.json();
    },
    enabled: !!params.id,
  });

  const mockPeriodLines: PeriodLine[] = [
    { period: "2025-07", state: "CLOSED", recognized: 25000, cumulative: 25000, deferred: 275000 },
    { period: "2025-08", state: "CLOSED", recognized: 25000, cumulative: 50000, deferred: 250000 },
    { period: "2025-09", state: "CLOSED", recognized: 25000, cumulative: 75000, deferred: 225000 },
    { period: "2025-10", state: "SYSTEM_BASE", recognized: 25000, cumulative: 100000, deferred: 200000 },
    { period: "2025-11", state: "SYSTEM_BASE", recognized: 25000, cumulative: 125000, deferred: 175000 },
    { period: "2025-12", state: "SYSTEM_BASE", recognized: 25000, cumulative: 150000, deferred: 150000 },
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
            Contract not found
          </CardContent>
        </Card>
      </div>
    );
  }

  const recognitionPercent = (schedule.revenueRecognizedToDate / schedule.totalContractValue) * 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/revenue/${params.category}`}>
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" data-testid="contract-name">{schedule.contractName}</h1>
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
        <Card data-testid="kpi-contract-value">
          <CardHeader className="pb-2">
            <CardDescription>Contract Value</CardDescription>
            <CardTitle className="text-xl">
              {formatCurrency(schedule.totalContractValue, schedule.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-recognized">
          <CardHeader className="pb-2">
            <CardDescription>Revenue Recognized</CardDescription>
            <CardTitle className="text-xl text-emerald-500 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {formatCurrency(schedule.revenueRecognizedToDate, schedule.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-deferred">
          <CardHeader className="pb-2">
            <CardDescription>Deferred Revenue</CardDescription>
            <CardTitle className="text-xl text-amber-500">
              {formatCurrency(schedule.deferredRevenue, schedule.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-judgment">
          <CardHeader className="pb-2">
            <CardDescription>Judgment Level</CardDescription>
            <CardTitle className="text-xl">
              <Badge className={judgmentColors[schedule.judgmentLevel]} variant="secondary">
                {schedule.judgmentLevel}
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

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Recognition Progress</span>
            <span className="text-sm text-muted-foreground">{recognitionPercent.toFixed(1)}% recognized</span>
          </div>
          <Progress value={recognitionPercent} className="h-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="periods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="periods" data-testid="tab-periods">
            <Calendar className="h-4 w-4 mr-2" />
            Recognition Schedule
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
              <CardTitle>Recognition Schedule</CardTitle>
              <CardDescription>
                Revenue recognition over the contract period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table data-testid="period-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Recognized</TableHead>
                    <TableHead className="text-right">Cumulative</TableHead>
                    <TableHead className="text-right">Deferred</TableHead>
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
                      <TableCell className="text-right font-mono text-emerald-500">
                        {formatCurrency(line.recognized)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(line.cumulative)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-amber-500">
                        {formatCurrency(line.deferred)}
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
                Append-only log of all modifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="events-list">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-2 h-2 rounded-full mt-2 bg-emerald-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">CONTRACT_SIGNED</Badge>
                      <span className="text-sm text-muted-foreground font-mono">{schedule.contractStartDate.substring(0, 7)}</span>
                    </div>
                    <p className="mt-1">Contract signed with value of {formatCurrency(schedule.totalContractValue, schedule.currency)}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {formatDate(schedule.createdAt)} by {schedule.owner}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card>
            <CardHeader>
              <CardTitle>Evidence & Attachments</CardTitle>
              <CardDescription>
                Contract documentation and supporting evidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedule.evidence === "ATTACHED" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover-elevate">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">Signed_Contract.pdf</p>
                      <p className="text-sm text-muted-foreground">Uploaded {formatDate(schedule.createdAt)}</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No evidence attached</p>
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
                Complete history of all changes
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
                    <TableCell className="text-muted-foreground">Contract record created</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
