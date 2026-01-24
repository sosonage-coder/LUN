import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Clock, 
  PlayCircle, 
  Send, 
  Eye, 
  Check,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ClipboardList,
  User
} from "lucide-react";
import type { CloseTask, CloseTasklist, CloseSchedule } from "@shared/schema";

type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "REVIEWED" | "APPROVED" | "LOCKED";

const statusInfo: Record<TaskStatus, { label: string; color: string; icon: typeof Clock; bgColor: string }> = {
  NOT_STARTED: { label: "Not Started", color: "text-slate-500", icon: Clock, bgColor: "bg-slate-100 dark:bg-slate-800" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-500", icon: PlayCircle, bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  SUBMITTED: { label: "Submitted", color: "text-amber-500", icon: Send, bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  REVIEWED: { label: "Reviewed", color: "text-purple-500", icon: Eye, bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  APPROVED: { label: "Approved", color: "text-green-500", icon: Check, bgColor: "bg-green-100 dark:bg-green-900/30" },
  LOCKED: { label: "Locked", color: "text-gray-500", icon: Check, bgColor: "bg-gray-100 dark:bg-gray-900/30" },
};

const priorityColors: Record<string, string> = {
  CRITICAL: "bg-red-500 text-white",
  HIGH: "bg-orange-500 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  LOW: "bg-slate-400 text-white",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "No due date";
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays <= 7) return `In ${diffDays} days`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface TaskRowProps {
  task: CloseTask;
  tasklistName?: string;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  isUpdating: boolean;
}

function TaskRow({ task, tasklistName, onStatusChange, isUpdating }: TaskRowProps) {
  const status = statusInfo[task.status as TaskStatus] || statusInfo.NOT_STARTED;
  const StatusIcon = status.icon;
  const isComplete = task.status === "APPROVED" || task.status === "LOCKED";
  
  const nextStatus: Record<TaskStatus, TaskStatus | null> = {
    NOT_STARTED: "IN_PROGRESS",
    IN_PROGRESS: "SUBMITTED",
    SUBMITTED: "REVIEWED",
    REVIEWED: "APPROVED",
    APPROVED: null,
    LOCKED: null,
  };

  const next = nextStatus[task.status as TaskStatus];

  const handleAdvance = () => {
    if (next) {
      onStatusChange(task.id, next);
    }
  };

  return (
    <Card className={`mb-3 hover-elevate ${isComplete ? "opacity-60" : ""}`} data-testid={`my-task-${task.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="pt-1">
            <Checkbox 
              checked={isComplete}
              disabled={isComplete || isUpdating}
              onCheckedChange={() => handleAdvance()}
              data-testid={`checkbox-${task.id}`}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className={`font-medium ${isComplete ? "line-through text-muted-foreground" : ""}`}>
                {task.name}
              </h4>
              <Badge className={`shrink-0 ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{task.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Badge variant="outline" className={`${status.bgColor} ${status.color} border-0`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
              
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className={task.dueDate < new Date().toISOString().split("T")[0] && !isComplete ? "text-red-500 font-medium" : ""}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              )}
              
              {tasklistName && (
                <Link href={`/close-control/tasklist/${task.tasklistId}/kanban`} className="flex items-center gap-1 hover:text-primary">
                  <ClipboardList className="h-3 w-3" />
                  <span>{tasklistName}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>

          {next && !isComplete && (
            <Button 
              size="sm" 
              variant="outline"
              disabled={isUpdating}
              onClick={handleAdvance}
              data-testid={`button-advance-${task.id}`}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {next === "IN_PROGRESS" ? "Start" : next === "SUBMITTED" ? "Submit" : "Advance"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyTasksPage() {
  const { toast } = useToast();

  const { data: schedules = [], isLoading: schedulesLoading } = useQuery<CloseSchedule[]>({
    queryKey: ["/api/close-control/schedules"],
  });

  const { data: tasklists = [], isLoading: tasklistsLoading } = useQuery<CloseTasklist[]>({
    queryKey: ["/api/close-control/tasklists"],
  });

  const { data: allTasks = [], isLoading: tasksLoading } = useQuery<CloseTask[]>({
    queryKey: ["/api/close-control/my-tasks"],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      return apiRequest("PATCH", `/api/close-control/tasks/${taskId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/close-control/my-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/close-control"] });
      toast({ title: "Task updated", description: "Task status has been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update task status.", variant: "destructive" });
    },
  });

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskMutation.mutate({ taskId, status: newStatus });
  };

  const isLoading = schedulesLoading || tasklistsLoading || tasksLoading;

  const tasklistMap = tasklists.reduce((acc, tl) => {
    acc[tl.id] = tl.name;
    return acc;
  }, {} as Record<string, string>);

  const pendingTasks = allTasks.filter(t => t.status !== "APPROVED" && t.status !== "LOCKED");
  const completedTasks = allTasks.filter(t => t.status === "APPROVED" || t.status === "LOCKED");
  
  const todayTasks = pendingTasks.filter(t => {
    if (!t.dueDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return t.dueDate === today;
  });
  
  const overdueTasks = pendingTasks.filter(t => {
    if (!t.dueDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return t.dueDate < today;
  });
  
  const upcomingTasks = pendingTasks.filter(t => {
    if (!t.dueDate) return true;
    const today = new Date().toISOString().split("T")[0];
    return t.dueDate > today;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6" data-testid="my-tasks-loading">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="my-tasks-page">
      <div className="flex items-center gap-4">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold" data-testid="page-title">My Tasks</h1>
          <p className="text-muted-foreground">Your assigned tasks across all close schedules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="kpi-overdue">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500" data-testid="value-overdue">
              {overdueTasks.length}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="kpi-today">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due Today</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500" data-testid="value-today">
              {todayTasks.length}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="kpi-upcoming">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            <ArrowRight className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500" data-testid="value-upcoming">
              {upcomingTasks.length}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="kpi-completed">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500" data-testid="value-completed">
              {completedTasks.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {overdueTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-red-500 mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Overdue ({overdueTasks.length})
          </h2>
          {overdueTasks.map(task => (
            <TaskRow 
              key={task.id} 
              task={task} 
              tasklistName={tasklistMap[task.tasklistId]}
              onStatusChange={handleStatusChange}
              isUpdating={updateTaskMutation.isPending}
            />
          ))}
        </div>
      )}

      {todayTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-amber-500 mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Due Today ({todayTasks.length})
          </h2>
          {todayTasks.map(task => (
            <TaskRow 
              key={task.id} 
              task={task} 
              tasklistName={tasklistMap[task.tasklistId]}
              onStatusChange={handleStatusChange}
              isUpdating={updateTaskMutation.isPending}
            />
          ))}
        </div>
      )}

      {upcomingTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Upcoming ({upcomingTasks.length})
          </h2>
          {upcomingTasks.map(task => (
            <TaskRow 
              key={task.id} 
              task={task} 
              tasklistName={tasklistMap[task.tasklistId]}
              onStatusChange={handleStatusChange}
              isUpdating={updateTaskMutation.isPending}
            />
          ))}
        </div>
      )}

      {pendingTasks.length === 0 && (
        <Card className="p-12 text-center">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium mb-2">All caught up!</h3>
          <p className="text-muted-foreground">You have no pending tasks.</p>
        </Card>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Completed ({completedTasks.length})
          </h2>
          {completedTasks.slice(0, 5).map(task => (
            <TaskRow 
              key={task.id} 
              task={task} 
              tasklistName={tasklistMap[task.tasklistId]}
              onStatusChange={handleStatusChange}
              isUpdating={updateTaskMutation.isPending}
            />
          ))}
          {completedTasks.length > 5 && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              + {completedTasks.length - 5} more completed tasks
            </p>
          )}
        </div>
      )}
    </div>
  );
}
