import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  Plus, 
  Download, 
  Landmark,
  CreditCard,
  FileText as FileTextIcon,
  Building,
  FileSpreadsheet,
  MoreHorizontal,
  FileText,
  Eye,
  ExternalLink,
  CheckCircle2,
  Clock
} from "lucide-react";
import type { 
  DebtSchedule,
  DebtCategory
} from "@shared/schema";

const categoryIcons: Record<DebtCategory, typeof Landmark> = {
  TERM_LOANS: Landmark,
  REVOLVING_CREDIT: CreditCard,
  BONDS_NOTES: FileTextIcon,
  INTERCOMPANY_LOANS: Building,
  LEASE_LIABILITIES: FileSpreadsheet,
  OTHER: MoreHorizontal,
};

const categoryLabels: Record<DebtCategory, string> = {
  TERM_LOANS: "Term Loans",
  REVOLVING_CREDIT: "Revolving Credit",
  BONDS_NOTES: "Bonds & Notes",
  INTERCOMPANY_LOANS: "Intercompany Loans",
  LEASE_LIABILITIES: "Lease Liabilities",
  OTHER: "Other Debt",
};

const categoryColors: Record<DebtCategory, string> = {
  TERM_LOANS: "bg-blue-500",
  REVOLVING_CREDIT: "bg-emerald-500",
  BONDS_NOTES: "bg-amber-500",
  INTERCOMPANY_LOANS: "bg-purple-500",
  LEASE_LIABILITIES: "bg-rose-500",
  OTHER: "bg-slate-500",
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

const interestTypeColors: Record<string, string> = {
  FIXED: "bg-blue-500",
  VARIABLE: "bg-amber-500",
};

const evidenceColors: Record<string, string> = {
  ATTACHED: "bg-emerald-600",
  MISSING: "bg-red-500",
};

const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export default function DebtCategoryPage() {
  const params = useParams<{ category: string }>();
  const categoryKey = params.category?.toUpperCase().replace(/-/g, "_") as DebtCategory;
  
  const { data: schedules = [], isLoading } = useQuery<DebtSchedule[]>({
    queryKey: ["/api/debt", categoryKey],
    queryFn: async () => {
      const res = await fetch(`/api/debt?category=${categoryKey}`);
      if (!res.ok) throw new Error("Failed to fetch debt");
      return res.json();
    },
    enabled: !!categoryKey,
  });

  const activeSchedules = schedules.filter(s => s.lifecycleState === "ACTIVE" || s.lifecycleState === "DORMANT");
  const totalPrincipal = activeSchedules.reduce((sum, s) => sum + s.outstandingPrincipal, 0);
  const totalInterest = activeSchedules.reduce((sum, s) => sum + s.interestIncurredPeriod, 0);
  
  const CategoryIcon = categoryIcons[categoryKey] || MoreHorizontal;
  const categoryLabel = categoryLabels[categoryKey] || params.category;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/debt">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${categoryColors[categoryKey]} flex items-center justify-center`}>
              <CategoryIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="page-title">{categoryLabel}</h1>
              <p className="text-muted-foreground">Active debt instruments in this category</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" data-testid="button-new-debt">
            <Plus className="h-4 w-4 mr-2" />
            New Debt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="kpi-active-instruments">
          <CardHeader className="pb-2">
            <CardDescription>Active Instruments</CardDescription>
            <CardTitle className="text-2xl">{activeSchedules.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-outstanding-principal">
          <CardHeader className="pb-2">
            <CardDescription>Outstanding Principal</CardDescription>
            <CardTitle className="text-2xl text-red-500">{formatCurrency(totalPrincipal)}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-interest-incurred">
          <CardHeader className="pb-2">
            <CardDescription>Interest Incurred</CardDescription>
            <CardTitle className="text-2xl text-amber-500">{formatCurrency(totalInterest)}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-missing-evidence">
          <CardHeader className="pb-2">
            <CardDescription>Missing Evidence</CardDescription>
            <CardTitle className="text-2xl text-red-500">
              {activeSchedules.filter(s => s.evidence === "MISSING").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Debt Instruments</CardTitle>
          <CardDescription>
            All instruments in {categoryLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table data-testid="debt-table">
            <TableHeader>
              <TableRow>
                <TableHead>Instrument Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Original Amount</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Interest Rate</TableHead>
                <TableHead className="text-right">Interest Incurred</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Review</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No debt instruments in this category
                  </TableCell>
                </TableRow>
              ) : (
                activeSchedules.map((schedule) => (
                  <TableRow key={schedule.id} data-testid={`debt-row-${schedule.id}`} className="hover-elevate">
                    <TableCell>
                      <Link 
                        href={`/debt/${params.category}/instrument/${schedule.id}`}
                        className="font-medium hover:underline flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {schedule.instrumentName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={lifecycleColors[schedule.lifecycleState]} variant="secondary">
                        {lifecycleLabels[schedule.lifecycleState]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(schedule.originalPrincipal, schedule.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-red-500">
                      {formatCurrency(schedule.outstandingPrincipal, schedule.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-500">
                      {formatPercent(schedule.interestRate)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-amber-500">
                      {formatCurrency(schedule.interestIncurredPeriod, schedule.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={interestTypeColors[schedule.interestType]} variant="secondary">
                        {schedule.interestType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={evidenceColors[schedule.evidence]} variant="secondary">
                        {schedule.evidence}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {schedule.reviewStatus === "REVIEWED" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link href={`/debt/${params.category}/instrument/${schedule.id}`}>
                          <Button variant="ghost" size="icon" data-testid={`button-view-${schedule.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" data-testid={`button-external-${schedule.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
