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
  Users,
  Briefcase,
  Server,
  Zap,
  MoreHorizontal,
  FileText,
  Eye,
  ExternalLink
} from "lucide-react";
import type { 
  AccrualSchedule,
  AccrualCategory
} from "@shared/schema";

const categoryIcons: Record<AccrualCategory, typeof Users> = {
  PAYROLL: Users,
  BONUSES_COMMISSIONS: DollarSign,
  PROFESSIONAL_FEES: Briefcase,
  HOSTING_SAAS: Server,
  UTILITIES: Zap,
  OTHER: MoreHorizontal,
};

const categoryLabels: Record<AccrualCategory, string> = {
  PAYROLL: "Payroll",
  BONUSES_COMMISSIONS: "Bonuses & Commissions",
  PROFESSIONAL_FEES: "Professional Fees",
  HOSTING_SAAS: "Hosting & SaaS",
  UTILITIES: "Utilities",
  OTHER: "Other",
};

const categoryColors: Record<AccrualCategory, string> = {
  PAYROLL: "bg-blue-500",
  BONUSES_COMMISSIONS: "bg-amber-500",
  PROFESSIONAL_FEES: "bg-emerald-500",
  HOSTING_SAAS: "bg-purple-500",
  UTILITIES: "bg-rose-500",
  OTHER: "bg-slate-500",
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AccrualsCategory() {
  const params = useParams<{ category: string }>();
  const categoryKey = params.category?.toUpperCase().replace(/-/g, "_") as AccrualCategory;
  
  const { data: schedules = [], isLoading } = useQuery<AccrualSchedule[]>({
    queryKey: ["/api/accruals", categoryKey],
    queryFn: async () => {
      const res = await fetch(`/api/accruals?category=${categoryKey}`);
      if (!res.ok) throw new Error("Failed to fetch accruals");
      return res.json();
    },
    enabled: !!categoryKey,
  });

  const activeSchedules = schedules.filter(s => s.lifecycleState === "ACTIVE" || s.lifecycleState === "DORMANT");
  const totalBalance = activeSchedules.reduce((sum, s) => sum + s.accrualAmount, 0);
  const totalTrueUp = activeSchedules.reduce((sum, s) => sum + s.trueUpAmount, 0);
  
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
          <Link href="/accruals">
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
              <p className="text-muted-foreground">Active accrual schedules in this category</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" data-testid="button-new-accrual">
            <Plus className="h-4 w-4 mr-2" />
            New Accrual
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
        <Card data-testid="kpi-ending-balance">
          <CardHeader className="pb-2">
            <CardDescription>Ending Balance</CardDescription>
            <CardTitle className="text-2xl text-amber-500">{formatCurrency(totalBalance)}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-net-true-up">
          <CardHeader className="pb-2">
            <CardDescription>Net True-Up</CardDescription>
            <CardTitle className={`text-2xl ${totalTrueUp >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {formatCurrency(totalTrueUp)}
            </CardTitle>
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
          <CardTitle>Accrual Schedules</CardTitle>
          <CardDescription>
            All active and dormant schedules in {categoryLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table data-testid="schedules-table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Accrual Amount</TableHead>
                <TableHead className="text-right">True-Up</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No active accruals in this category
                  </TableCell>
                </TableRow>
              ) : (
                activeSchedules.map((schedule) => (
                  <TableRow key={schedule.id} data-testid={`schedule-row-${schedule.id}`} className="hover-elevate">
                    <TableCell>
                      <Link 
                        href={`/accruals/${params.category}/schedule/${schedule.id}`}
                        className="font-medium hover:underline flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {schedule.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={lifecycleColors[schedule.lifecycleState]} variant="secondary">
                        {lifecycleLabels[schedule.lifecycleState]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(schedule.accrualAmount, schedule.currency)}
                    </TableCell>
                    <TableCell className={`text-right font-mono ${schedule.trueUpAmount >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {formatCurrency(schedule.trueUpAmount, schedule.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={confidenceColors[schedule.confidenceLevel]} variant="secondary">
                        {schedule.confidenceLevel}
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
                    <TableCell className="text-sm text-muted-foreground">
                      {schedule.owner}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link href={`/accruals/${params.category}/schedule/${schedule.id}`}>
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
