import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lock, 
  ListChecks,
  FileCheck,
  Users,
  ArrowRight,
  TrendingUp,
  Target,
  Shield
} from "lucide-react";
import type { CloseControlKPIs, CloseProgressSummary, CloseScheduleStatus, CloseRiskLevel } from "@shared/schema";

const statusColors: Record<CloseScheduleStatus, string> = {
  PLANNED: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  ACTIVE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  AT_RISK: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  COMPLETE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  LOCKED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const riskColors: Record<CloseRiskLevel, string> = {
  HIGH: "text-red-500",
  MEDIUM: "text-amber-500",
  LOW: "text-emerald-500",
  NONE: "text-muted-foreground",
};

const statusIcons: Record<CloseScheduleStatus, typeof Calendar> = {
  PLANNED: Calendar,
  ACTIVE: Clock,
  AT_RISK: AlertTriangle,
  COMPLETE: CheckCircle2,
  LOCKED: Lock,
};

export default function CloseControlDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("2026-01");

  const { data: kpis, isLoading: kpisLoading } = useQuery<CloseControlKPIs>({
    queryKey: [`/api/close-control/kpis?period=${selectedPeriod}`],
  });

  const { data: schedules, isLoading: schedulesLoading } = useQuery<CloseProgressSummary[]>({
    queryKey: [`/api/close-control/schedules?period=${selectedPeriod}`],
  });

  const activeSchedules = schedules ?? [];

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="close-control-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="page-title">Close Control</h1>
          <p className="text-muted-foreground">Period-end close orchestration and governance</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]" data-testid="select-period">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-01">Jan 2026</SelectItem>
              <SelectItem value="2025-12">Dec 2025</SelectItem>
              <SelectItem value="2025-11">Nov 2025</SelectItem>
              <SelectItem value="2025-10">Oct 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild data-testid="button-new-schedule">
            <Link href="/close-control/new">
              <Calendar className="h-4 w-4 mr-2" />
              New Schedule
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card data-testid="kpi-schedules">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Close Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold" data-testid="value-schedules">
                  {kpis?.totalSchedules || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {kpis?.activeSchedules || 0} active, {kpis?.atRiskSchedules || 0} at risk
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-tasks">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold" data-testid="value-tasks">
                  {kpis?.totalTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {kpis?.completedTasks || 0} completed, {kpis?.approvedTasks || 0} approved
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-overdue">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${(kpis?.overdueTasks || 0) > 0 ? "text-red-500" : ""}`} data-testid="value-overdue">
                  {kpis?.overdueTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-review">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-500" data-testid="value-review">
                  {kpis?.tasksNeedingReview || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting reviewer sign-off
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-evidence">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Evidence Pending</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${(kpis?.evidencePending || 0) > 0 ? "text-amber-500" : ""}`} data-testid="value-evidence">
                  {kpis?.evidencePending || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks missing evidence
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="close-schedules-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Close Schedules
          </CardTitle>
          <CardDescription>Active and recent period-end close schedules</CardDescription>
        </CardHeader>
        <CardContent>
          {schedulesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : activeSchedules.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Close Schedules</h3>
              <p className="text-muted-foreground mb-4">Create your first close schedule to begin orchestrating period-end activities.</p>
              <Button asChild>
                <Link href="/close-control/new">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Schedule
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table data-testid="schedules-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Days Left</TableHead>
                    <TableHead className="text-center">Risk</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSchedules.map((schedule) => {
                    const StatusIcon = statusIcons[schedule.status];
                    return (
                      <TableRow key={schedule.scheduleId} data-testid={`schedule-row-${schedule.scheduleId}`} className="hover-elevate">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                              <Target className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{schedule.scheduleName}</div>
                              <div className="text-sm text-muted-foreground">
                                {schedule.tasksCompleted}/{schedule.tasksTotal} tasks
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{schedule.period}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-[120px]">
                            <Progress value={schedule.progressPercent} className="h-2 flex-1" />
                            <span className="text-sm font-medium w-10">{schedule.progressPercent}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusColors[schedule.status]} variant="secondary">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {schedule.status === "AT_RISK" ? "At Risk" : schedule.status.charAt(0) + schedule.status.slice(1).toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-medium ${schedule.daysRemaining < 0 ? "text-red-500" : schedule.daysRemaining <= 2 ? "text-amber-500" : ""}`}>
                            {schedule.daysRemaining < 0 ? `${Math.abs(schedule.daysRemaining)}d overdue` : `${schedule.daysRemaining}d`}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-medium ${riskColors[schedule.riskLevel]}`}>
                            {schedule.riskLevel === "NONE" ? "-" : schedule.riskLevel}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/close-control/schedule/${schedule.scheduleId}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="templates-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Start Templates</CardTitle>
            <CardDescription>Pre-built close schedule templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Month-End Close (Lean)", days: 5, tasks: 24 },
                { name: "Month-End Close (SOX-Style)", days: 7, tasks: 42 },
                { name: "Quarter-End Close", days: 10, tasks: 56 },
                { name: "Year-End Close", days: 15, tasks: 78 },
              ].map((template) => (
                <div key={template.name} className="flex items-center justify-between p-3 rounded-md border hover-elevate">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                      <FileCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {template.days} days, {template.tasks} tasks
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Use</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="governance-card">
          <CardHeader>
            <CardTitle className="text-lg">Governance Controls</CardTitle>
            <CardDescription>Segregation of duties and approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium">Preparer ≠ Reviewer</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Enforced</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium">Evidence Required</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Enforced</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium">Period Lock Controls</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Audit Trail</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Recording</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
