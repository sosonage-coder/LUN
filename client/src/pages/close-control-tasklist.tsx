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
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lock, 
  ListChecks,
  ArrowRight,
  User,
  FileCheck,
  Paperclip,
  Link2,
  PlayCircle,
  Send,
  Eye
} from "lucide-react";
import type { CloseTasklist, CloseTask, CloseTaskStatus, CloseEvidenceStatus, TaskPriority } from "@shared/schema";

const statusColors: Record<CloseTaskStatus, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SUBMITTED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  REVIEWED: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  LOCKED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const priorityColors: Record<TaskPriority, string> = {
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  LOW: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
};

const evidenceColors: Record<CloseEvidenceStatus, string> = {
  ATTACHED: "text-emerald-500",
  MISSING: "text-red-500",
  PENDING: "text-amber-500",
};

const statusIcons: Record<CloseTaskStatus, typeof Clock> = {
  NOT_STARTED: Clock,
  IN_PROGRESS: PlayCircle,
  SUBMITTED: Send,
  REVIEWED: Eye,
  APPROVED: CheckCircle2,
  LOCKED: Lock,
};

export default function CloseControlTasklistPage() {
  const { id } = useParams<{ id: string }>();

  const { data: tasklist, isLoading: tasklistLoading } = useQuery<CloseTasklist>({
    queryKey: [`/api/close-control/tasklists/${id}`],
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<CloseTask[]>({
    queryKey: [`/api/close-control/tasklists/${id}/tasks`],
  });

  const taskItems = tasks ?? [];
  const completedCount = taskItems.filter(t => t.status === "APPROVED" || t.status === "LOCKED").length;
  const progressPercent = taskItems.length > 0 ? Math.round((completedCount / taskItems.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="close-control-tasklist-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/close-control/schedule/${tasklist?.closeScheduleId || ""}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          {tasklistLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            <>
              <h1 className="text-2xl font-semibold" data-testid="page-title">{tasklist?.name || "Tasklist"}</h1>
              <p className="text-muted-foreground">Level 2 — Individual tasks and evidence</p>
            </>
          )}
        </div>
        <Button variant="outline" disabled data-testid="button-lock-tasklist">
          <Lock className="h-4 w-4 mr-2" />
          Lock Tasklist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="kpi-tasks">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {tasklistLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold" data-testid="value-tasks">
                  {tasklist?.totalTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tasklist?.completedTasks || 0} completed
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-approved">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {tasklistLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-emerald-500" data-testid="value-approved">
                {tasklist?.approvedTasks || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-owner">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Owner</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {tasklistLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-lg font-medium" data-testid="value-owner">
                {tasklist?.ownerName || "Unassigned"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-due">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due Date</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {tasklistLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-lg font-mono" data-testid="value-due">
                {tasklist?.dueDate || "-"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="progress-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tasklist Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Approval Progress</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Card data-testid="tasks-card">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Individual close activities with evidence and linked schedules</CardDescription>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : taskItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks in this tasklist
            </div>
          ) : (
            <div className="rounded-md border">
              <Table data-testid="tasks-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Preparer</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead className="text-center">Priority</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Evidence</TableHead>
                    <TableHead className="text-center">Links</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskItems.map((task, index) => {
                    const StatusIcon = statusIcons[task.status];
                    return (
                      <TableRow key={task.id} data-testid={`task-row-${task.id}`} className="hover-elevate">
                        <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{task.name}</div>
                            {task.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">{task.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{task.preparerName || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{task.reviewerName || "-"}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={priorityColors[task.priority]} variant="secondary">
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusColors[task.status]} variant="secondary">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {task.status === "NOT_STARTED" ? "Not Started" :
                             task.status === "IN_PROGRESS" ? "In Progress" :
                             task.status.charAt(0) + task.status.slice(1).toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Paperclip className={`h-4 w-4 ${evidenceColors[task.evidenceStatus]}`} />
                            <span className="text-sm">{task.evidenceCount}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{task.linkedSchedules.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{task.dueDate}</span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/close-control/task/${task.id}`}>
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
