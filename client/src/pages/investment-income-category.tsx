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
  Percent,
  Coins,
  Building2,
  TrendingUp,
  MoreHorizontal,
  FileText,
  Eye,
  ExternalLink,
  CheckCircle2,
  Clock
} from "lucide-react";
import type { 
  InvestmentIncomeSchedule,
  InvestmentCategory
} from "@shared/schema";

const categoryIcons: Record<InvestmentCategory, typeof Percent> = {
  INTEREST_BEARING: Percent,
  DIVIDENDS: Coins,
  FIXED_INCOME: Building2,
  EQUITY_METHOD: TrendingUp,
  OTHER: MoreHorizontal,
};

const categoryLabels: Record<InvestmentCategory, string> = {
  INTEREST_BEARING: "Interest-Bearing",
  DIVIDENDS: "Dividends",
  FIXED_INCOME: "Fixed Income Securities",
  EQUITY_METHOD: "Equity Method",
  OTHER: "Other Investments",
};

const categoryColors: Record<InvestmentCategory, string> = {
  INTEREST_BEARING: "bg-blue-500",
  DIVIDENDS: "bg-emerald-500",
  FIXED_INCOME: "bg-amber-500",
  EQUITY_METHOD: "bg-purple-500",
  OTHER: "bg-slate-500",
};

const lifecycleColors: Record<string, string> = {
  ACTIVE: "bg-emerald-600",
  DORMANT: "bg-amber-500",
  MATURED: "bg-slate-500",
  ARCHIVED: "bg-slate-400",
};

const lifecycleLabels: Record<string, string> = {
  ACTIVE: "Active",
  DORMANT: "Dormant",
  MATURED: "Matured",
  ARCHIVED: "Archived",
};

const yieldBasisColors: Record<string, string> = {
  FIXED_RATE: "bg-blue-500",
  VARIABLE_RATE: "bg-amber-500",
  DIVIDEND_DECLARED: "bg-emerald-500",
  ESTIMATED: "bg-purple-500",
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

export default function InvestmentIncomeCategory() {
  const params = useParams<{ category: string }>();
  const categoryKey = params.category?.toUpperCase().replace(/-/g, "_") as InvestmentCategory;
  
  const { data: schedules = [], isLoading } = useQuery<InvestmentIncomeSchedule[]>({
    queryKey: ["/api/investment-income", categoryKey],
    queryFn: async () => {
      const res = await fetch(`/api/investment-income?category=${categoryKey}`);
      if (!res.ok) throw new Error("Failed to fetch investments");
      return res.json();
    },
    enabled: !!categoryKey,
  });

  const activeSchedules = schedules.filter(s => s.lifecycleState === "ACTIVE" || s.lifecycleState === "DORMANT");
  const totalIncome = activeSchedules.reduce((sum, s) => sum + s.incomeEarnedToDate, 0);
  const totalAccrued = activeSchedules.reduce((sum, s) => sum + s.accruedIncomeBalance, 0);
  
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
          <Link href="/investment-income">
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
              <p className="text-muted-foreground">Active investments in this category</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" data-testid="button-new-investment">
            <Plus className="h-4 w-4 mr-2" />
            New Investment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="kpi-active-investments">
          <CardHeader className="pb-2">
            <CardDescription>Active Investments</CardDescription>
            <CardTitle className="text-2xl">{activeSchedules.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-income-earned">
          <CardHeader className="pb-2">
            <CardDescription>Income Earned</CardDescription>
            <CardTitle className="text-2xl text-emerald-500">{formatCurrency(totalIncome)}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-accrued">
          <CardHeader className="pb-2">
            <CardDescription>Accrued Income</CardDescription>
            <CardTitle className="text-2xl text-amber-500">{formatCurrency(totalAccrued)}</CardTitle>
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
          <CardTitle>Investment Schedules</CardTitle>
          <CardDescription>
            All investments in {categoryLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table data-testid="investments-table">
            <TableHeader>
              <TableRow>
                <TableHead>Investment Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Yield</TableHead>
                <TableHead className="text-right">Income Earned</TableHead>
                <TableHead className="text-right">Accrued</TableHead>
                <TableHead>Yield Basis</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Review</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No investments in this category
                  </TableCell>
                </TableRow>
              ) : (
                activeSchedules.map((schedule) => (
                  <TableRow key={schedule.id} data-testid={`investment-row-${schedule.id}`} className="hover-elevate">
                    <TableCell>
                      <Link 
                        href={`/investment-income/${params.category}/investment/${schedule.id}`}
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
                      {formatCurrency(schedule.principalAmount, schedule.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-500">
                      {formatPercent(schedule.yieldRate)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-emerald-500">
                      {formatCurrency(schedule.incomeEarnedToDate, schedule.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-amber-500">
                      {formatCurrency(schedule.accruedIncomeBalance, schedule.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={yieldBasisColors[schedule.yieldBasis]} variant="secondary">
                        {schedule.yieldBasis.replace(/_/g, " ")}
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
                        <Link href={`/investment-income/${params.category}/investment/${schedule.id}`}>
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
