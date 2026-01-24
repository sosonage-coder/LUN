import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lock, 
  ListChecks,
  ArrowRight,
  User,
  FileCheck,
  Target
} from "lucide-react";
import type { CloseSchedule, TasklistSummary, TasklistStatus, CloseRiskLevel } from "@shared/schema";

const statusColors: Record<TasklistStatus, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  LOCKED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const riskColors: Record<CloseRiskLevel, string> = {
  HIGH: "text-red-500",
  MEDIUM: "text-amber-500",
  LOW: "text-emerald-500",
  NONE: "text-muted-foreground",
};

const statusIcons: Record<TasklistStatus, typeof Calendar> = {
  NOT_STARTED: Calendar,
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle2,
  LOCKED: Lock,
};

export default function CloseControlSchedulePage() {
  const { id } = useParams<{ id: string }>();

  const { data: schedule, isLoading: scheduleLoading } = useQuery<CloseSchedule>({
    queryKey: [`/api/close-control/schedules/${id}`],
  });

  const { data: tasklists, isLoading: tasklistsLoading } = useQuery<TasklistSummary[]>({
    queryKey: [`/api/close-control/schedules/${id}/tasklists`],
  });

  const tasklistItems = tasklists ?? [];

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="close-control-schedule-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/close-control">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          {scheduleLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            <>
              <h1 className="text-2xl font-semibold" data-testid="page-title">{schedule?.name || "Close Schedule"}</h1>
              <p className="text-muted-foreground">Level 1 — Tasklists and work packages</p>
            </>
          )}
        </div>
        <Button variant="outline" disabled data-testid="button-lock-schedule">
          <Lock className="h-4 w-4 mr-2" />
          Lock Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="kpi-period">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {scheduleLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold font-mono" data-testid="value-period">
                {schedule?.period || "-"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-tasklists">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasklists</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {scheduleLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold" data-testid="value-tasklists">
                  {schedule?.completedTasklists || 0}/{schedule?.totalTasklists || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {schedule?.lockedTasklists || 0} locked
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-tasks">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {scheduleLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold" data-testid="value-tasks">
                  {schedule?.approvedTasks || 0}/{schedule?.totalTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {schedule?.completedTasks || 0} completed
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-overdue">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {scheduleLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className={`text-2xl font-bold ${(schedule?.overdueTasks || 0) > 0 ? "text-red-500" : ""}`} data-testid="value-overdue">
                {schedule?.overdueTasks || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="overall-progress-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduleLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span className="font-medium">
                  {schedule?.totalTasks ? Math.round((schedule.approvedTasks / schedule.totalTasks) * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={schedule?.totalTasks ? (schedule.approvedTasks / schedule.totalTasks) * 100 : 0} 
                className="h-3" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{schedule?.startDate}</span>
                <span>{schedule?.endDate}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card data-testid="tasklists-card">
        <CardHeader>
          <CardTitle>Tasklists</CardTitle>
          <CardDescription>Close work packages ordered by dependency and due date</CardDescription>
        </CardHeader>
        <CardContent>
          {tasklistsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : tasklistItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasklists in this schedule
            </div>
          ) : (
            <div className="rounded-md border">
              <Table data-testid="tasklists-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Tasklist</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-center">Risk</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasklistItems.map((tasklist, index) => {
                    const StatusIcon = statusIcons[tasklist.status];
                    return (
                      <TableRow key={tasklist.id} data-testid={`tasklist-row-${tasklist.id}`} className="hover-elevate">
                        <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                              <FileCheck className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{tasklist.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {tasklist.completedTasks}/{tasklist.totalTasks} tasks
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{tasklist.ownerName || "Unassigned"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-[100px]">
                            <Progress value={tasklist.progressPercent} className="h-2 flex-1" />
                            <span className="text-sm font-medium w-10">{tasklist.progressPercent}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusColors[tasklist.status]} variant="secondary">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {tasklist.status === "NOT_STARTED" ? "Not Started" : 
                             tasklist.status === "IN_PROGRESS" ? "In Progress" : 
                             tasklist.status.charAt(0) + tasklist.status.slice(1).toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`font-mono text-sm ${tasklist.isOverdue ? "text-red-500" : ""}`}>
                            {tasklist.dueDate}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-medium ${riskColors[tasklist.riskLevel]}`}>
                            {tasklist.riskLevel === "NONE" ? "-" : tasklist.riskLevel}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/close-control/tasklist/${tasklist.id}`}>
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
    </div>
  );
}
