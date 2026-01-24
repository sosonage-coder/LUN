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
  Repeat,
  FileText as FileTextIcon,
  Wrench,
  Box,
  Shield,
  MoreHorizontal,
  FileText,
  Eye,
  ExternalLink,
  CheckCircle2,
  Clock
} from "lucide-react";
import type { 
  RevenueSchedule,
  RevenueCategory
} from "@shared/schema";

const categoryIcons: Record<RevenueCategory, typeof Repeat> = {
  SUBSCRIPTIONS: Repeat,
  SUPPORT_MAINTENANCE: Wrench,
  USAGE_BASED: Shield,
  MILESTONE_BASED: Box,
  LICENSING: FileTextIcon,
  OTHER: MoreHorizontal,
};

const categoryLabels: Record<RevenueCategory, string> = {
  SUBSCRIPTIONS: "Subscriptions",
  SUPPORT_MAINTENANCE: "Support & Maintenance",
  USAGE_BASED: "Usage-Based",
  MILESTONE_BASED: "Milestone-Based",
  LICENSING: "Licensing",
  OTHER: "Other Revenue",
};

const categoryColors: Record<RevenueCategory, string> = {
  SUBSCRIPTIONS: "bg-blue-500",
  SUPPORT_MAINTENANCE: "bg-amber-500",
  USAGE_BASED: "bg-emerald-500",
  MILESTONE_BASED: "bg-purple-500",
  LICENSING: "bg-rose-500",
  OTHER: "bg-slate-500",
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function RevenueCategory() {
  const params = useParams<{ category: string }>();
  const categoryKey = params.category?.toUpperCase().replace(/-/g, "_") as RevenueCategory;
  
  const { data: schedules = [], isLoading } = useQuery<RevenueSchedule[]>({
    queryKey: ["/api/revenue", categoryKey],
    queryFn: async () => {
      const res = await fetch(`/api/revenue?category=${categoryKey}`);
      if (!res.ok) throw new Error("Failed to fetch revenue");
      return res.json();
    },
    enabled: !!categoryKey,
  });

  const activeSchedules = schedules.filter(s => s.lifecycleState === "ACTIVE" || s.lifecycleState === "DORMANT");
  const totalRecognized = activeSchedules.reduce((sum, s) => sum + s.revenueRecognizedToDate, 0);
  const totalDeferred = activeSchedules.reduce((sum, s) => sum + s.deferredRevenue, 0);
  
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
          <Link href="/revenue">
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
              <p className="text-muted-foreground">Active revenue contracts in this category</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" data-testid="button-new-contract">
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="kpi-active-contracts">
          <CardHeader className="pb-2">
            <CardDescription>Active Contracts</CardDescription>
            <CardTitle className="text-2xl">{activeSchedules.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-recognized">
          <CardHeader className="pb-2">
            <CardDescription>Revenue Recognized</CardDescription>
            <CardTitle className="text-2xl text-emerald-500">{formatCurrency(totalRecognized)}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-deferred">
          <CardHeader className="pb-2">
            <CardDescription>Deferred Revenue</CardDescription>
            <CardTitle className="text-2xl text-amber-500">{formatCurrency(totalDeferred)}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-high-judgment">
          <CardHeader className="pb-2">
            <CardDescription>High Judgment</CardDescription>
            <CardTitle className="text-2xl text-red-500">
              {activeSchedules.filter(s => s.judgmentLevel === "HIGH").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Contracts</CardTitle>
          <CardDescription>
            All contracts in {categoryLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table data-testid="contracts-table">
            <TableHeader>
              <TableRow>
                <TableHead>Contract Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Contract Value</TableHead>
                <TableHead className="text-right">Recognized</TableHead>
                <TableHead className="text-right">Deferred</TableHead>
                <TableHead>Judgment</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No contracts in this category
                  </TableCell>
                </TableRow>
              ) : (
                activeSchedules.map((schedule) => (
                  <TableRow key={schedule.id} data-testid={`contract-row-${schedule.id}`} className="hover-elevate">
                    <TableCell>
                      <Link 
                        href={`/revenue/${params.category}/contract/${schedule.id}`}
                        className="font-medium hover:underline flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {schedule.contractName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={lifecycleColors[schedule.lifecycleState]} variant="secondary">
                        {lifecycleLabels[schedule.lifecycleState]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(schedule.totalContractValue, schedule.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-emerald-500">
                      {formatCurrency(schedule.revenueRecognizedToDate, schedule.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-amber-500">
                      {formatCurrency(schedule.deferredRevenue, schedule.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={judgmentColors[schedule.judgmentLevel]} variant="secondary">
                        {schedule.judgmentLevel}
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
                        <Link href={`/revenue/${params.category}/contract/${schedule.id}`}>
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
