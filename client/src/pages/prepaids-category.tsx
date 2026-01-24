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
  DollarSign, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Building,
  Laptop,
  MoreHorizontal,
  FileText,
  Eye,
  ExternalLink
} from "lucide-react";
import type { 
  PrepaidSchedule,
  PrepaidSubcategory
} from "@shared/schema";

const categoryIcons: Record<PrepaidSubcategory, typeof Shield> = {
  INSURANCE: Shield,
  RENT: Building,
  SOFTWARE: Laptop,
  OTHER: MoreHorizontal,
};

const categoryLabels: Record<PrepaidSubcategory, string> = {
  INSURANCE: "Insurance",
  RENT: "Rent",
  SOFTWARE: "Software",
  OTHER: "Other",
};

const categoryColors: Record<PrepaidSubcategory, string> = {
  INSURANCE: "bg-blue-500",
  RENT: "bg-amber-500",
  SOFTWARE: "bg-emerald-500",
  OTHER: "bg-slate-500",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-600",
  COMPLETED: "bg-slate-500",
  ON_HOLD: "bg-amber-500",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
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

export default function PrepaidsCategory() {
  const params = useParams<{ category: string }>();
  const categoryKey = params.category?.toUpperCase() as PrepaidSubcategory;
  
  const { data: schedules = [], isLoading } = useQuery<PrepaidSchedule[]>({
    queryKey: ["/api/prepaids", categoryKey],
    queryFn: async () => {
      const res = await fetch(`/api/prepaids?subcategory=${categoryKey}`);
      if (!res.ok) throw new Error("Failed to fetch prepaids");
      return res.json();
    },
    enabled: !!categoryKey,
  });

  const activeSchedules = schedules.filter(s => s.status === "ACTIVE");
  const totalBalance = activeSchedules.reduce((sum, s) => sum + s.remainingBalance, 0);
  const monthlyExpense = activeSchedules.reduce((sum, s) => sum + s.monthlyExpense, 0);
  
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
          <Link href="/prepaids">
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
              <p className="text-muted-foreground">Active prepaid schedules in this category</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" data-testid="button-new-prepaid">
            <Plus className="h-4 w-4 mr-2" />
            New Prepaid
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="kpi-active-schedules">
          <CardHeader className="pb-2">
            <CardDescription>Active Schedules</CardDescription>
            <CardTitle className="text-2xl">{activeSchedules.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-remaining-balance">
          <CardHeader className="pb-2">
            <CardDescription>Remaining Balance</CardDescription>
            <CardTitle className="text-2xl text-blue-500">{formatCurrency(totalBalance)}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-monthly-expense">
          <CardHeader className="pb-2">
            <CardDescription>Monthly Expense</CardDescription>
            <CardTitle className="text-2xl text-amber-500">{formatCurrency(monthlyExpense)}</CardTitle>
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
          <CardTitle>Prepaid Schedules</CardTitle>
          <CardDescription>
            All schedules in {categoryLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table data-testid="schedules-table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Original Amount</TableHead>
                <TableHead className="text-right">Monthly Expense</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No prepaids in this category
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((schedule) => (
                  <TableRow key={schedule.id} data-testid={`schedule-row-${schedule.id}`} className="hover-elevate">
                    <TableCell>
                      <Link 
                        href={`/prepaids/${params.category}/schedule/${schedule.id}`}
                        className="font-medium hover:underline flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {schedule.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[schedule.status]} variant="secondary">
                        {statusLabels[schedule.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{schedule.startDate}</TableCell>
                    <TableCell className="font-mono text-sm">{schedule.endDate}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(schedule.originalAmount, schedule.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-amber-500">
                      {formatCurrency(schedule.monthlyExpense, schedule.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-500">
                      {formatCurrency(schedule.remainingBalance, schedule.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={evidenceColors[schedule.evidence]} variant="secondary">
                        {schedule.evidence}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {schedule.owner}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link href={`/prepaids/${params.category}/schedule/${schedule.id}`}>
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
