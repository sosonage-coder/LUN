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
  Percent,
  TrendingDown,
  FolderOpen
} from "lucide-react";
import type { 
  DebtSchedule,
  DebtCategory
} from "@shared/schema";

const categoryLabels: Record<DebtCategory, string> = {
  TERM_LOANS: "Term Loans",
  REVOLVING_CREDIT: "Revolving Credit",
  BONDS_NOTES: "Bonds & Notes",
  INTERCOMPANY_LOANS: "Intercompany Loans",
  LEASE_LIABILITIES: "Lease Liabilities",
  OTHER: "Other Debt",
};

const lifecycleColors: Record<string, string> = {
  ACTIVE: "bg-emerald-600",
  DORMANT: "bg-amber-500",
  REPAID: "bg-slate-500",
  ARCHIVED: "bg-slate-400",
};

const lifecycleLabels: Record<string, string> = {
  ACTIVE: "Active",
  DORMANT: "Dormant",
  REPAID: "Repaid",
  ARCHIVED: "Archived",
};

const methodLabels: Record<string, string> = {
  NOMINAL: "Nominal",
  EFFECTIVE_INTEREST: "Effective Interest",
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

const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
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
  principalPayment: number;
  interestPayment: number;
  outstandingBalance: number;
}

export default function DebtWorkspace() {
  const params = useParams<{ category: string; id: string }>();
  
  const { data: schedule, isLoading } = useQuery<DebtSchedule>({
    queryKey: ["/api/debt", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/debt/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch debt");
      return res.json();
    },
    enabled: !!params.id,
  });

  const mockPeriodLines: PeriodLine[] = [
    { period: "2025-07", state: "CLOSED", principalPayment: 83333.33, interestPayment: 12500.00, outstandingBalance: 916666.67 },
    { period: "2025-08", state: "CLOSED", principalPayment: 83333.33, interestPayment: 11458.33, outstandingBalance: 833333.34 },
    { period: "2025-09", state: "CLOSED", principalPayment: 83333.33, interestPayment: 10416.67, outstandingBalance: 750000.01 },
    { period: "2025-10", state: "SYSTEM_BASE", principalPayment: 83333.33, interestPayment: 9375.00, outstandingBalance: 666666.68 },
    { period: "2025-11", state: "SYSTEM_BASE", principalPayment: 83333.33, interestPayment: 8333.33, outstandingBalance: 583333.35 },
    { period: "2025-12", state: "SYSTEM_BASE", principalPayment: 83333.35, interestPayment: 7291.67, outstandingBalance: 500000.00 },
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
            Debt instrument not found
          </CardContent>
        </Card>
      </div>
    );
  }

  const repaymentPercent = ((schedule.originalPrincipal - schedule.outstandingPrincipal) / schedule.originalPrincipal) * 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/debt/${params.category}`}>
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" data-testid="debt-name">{schedule.instrumentName}</h1>
              <Badge className={lifecycleColors[schedule.lifecycleState]} variant="secondary">
                {lifecycleLabels[schedule.lifecycleState]}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {categoryLabels[schedule.category]} • {methodLabels[schedule.amortizationMethod]} • {schedule.owner}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/artifacts?entityId=${schedule.entityId}&linkedSchedule=${encodeURIComponent(schedule.instrumentName)}`}>
            <Button variant="outline" size="sm" data-testid="button-view-artifacts">
              <FolderOpen className="h-4 w-4 mr-2" />
              Related Artifacts
            </Button>
          </Link>
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
        <Card data-testid="kpi-original">
          <CardHeader className="pb-2">
            <CardDescription>Original Principal</CardDescription>
            <CardTitle className="text-xl">
              {formatCurrency(schedule.originalPrincipal, schedule.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-outstanding">
          <CardHeader className="pb-2">
            <CardDescription>Outstanding</CardDescription>
            <CardTitle className="text-xl text-red-500">
              {formatCurrency(schedule.outstandingPrincipal, schedule.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-rate">
          <CardHeader className="pb-2">
            <CardDescription>Interest Rate</CardDescription>
            <CardTitle className="text-xl text-blue-500 flex items-center gap-1">
              <Percent className="h-4 w-4" />
              {formatPercent(schedule.interestRate)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-repaid">
          <CardHeader className="pb-2">
            <CardDescription>Repaid</CardDescription>
            <CardTitle className="text-xl text-emerald-500 flex items-center gap-1">
              <TrendingDown className="h-4 w-4" />
              {repaymentPercent.toFixed(1)}%
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
            <span className="text-sm font-medium">Repayment Progress</span>
            <span className="text-sm text-muted-foreground">{repaymentPercent.toFixed(1)}% repaid</span>
          </div>
          <Progress value={repaymentPercent} className="h-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="periods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="periods" data-testid="tab-periods">
            <Calendar className="h-4 w-4 mr-2" />
            Amortization Schedule
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
              <CardTitle>Amortization Schedule</CardTitle>
              <CardDescription>
                Principal and interest payments over the loan term
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table data-testid="period-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Principal</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                    <TableHead className="text-right">Outstanding Balance</TableHead>
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
                        {formatCurrency(line.principalPayment)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-amber-500">
                        {formatCurrency(line.interestPayment)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-red-500">
                        {formatCurrency(line.outstandingBalance)}
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
                      <Badge variant="outline">LOAN_ORIGINATED</Badge>
                      <span className="text-sm text-muted-foreground font-mono">{schedule.originationDate.substring(0, 7)}</span>
                    </div>
                    <p className="mt-1">Loan originated with principal of {formatCurrency(schedule.originalPrincipal, schedule.currency)} at {formatPercent(schedule.interestRate)}</p>
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
                Loan documentation and agreements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedule.evidence === "ATTACHED" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover-elevate">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">Loan_Agreement.pdf</p>
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
                    <TableCell className="text-muted-foreground">Debt instrument record created</TableCell>
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
