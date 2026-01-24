import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Plus, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  LayoutGrid,
  CalendarDays,
  Clock,
  PlayCircle,
  Send,
  Eye,
  Check
} from "lucide-react";
import type { CloseTask, CloseTasklist } from "@shared/schema";

type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "REVIEWED" | "APPROVED" | "LOCKED";
type ViewMode = "by-date" | "by-status";

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

interface TaskCardProps {
  task: CloseTask;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  isUpdating: boolean;
  viewMode: ViewMode;
}

function TaskCard({ task, onStatusChange, isUpdating, viewMode }: TaskCardProps) {
  const status = statusInfo[task.status as TaskStatus] || statusInfo.NOT_STARTED;
  const StatusIcon = status.icon;

  const nextStatus: Record<TaskStatus, TaskStatus | null> = {
    NOT_STARTED: "IN_PROGRESS",
    IN_PROGRESS: "SUBMITTED",
    SUBMITTED: "REVIEWED",
    REVIEWED: "APPROVED",
    APPROVED: null,
    LOCKED: null,
  };

  const next = nextStatus[task.status as TaskStatus];

  return (
    <Card className="mb-3 hover-elevate cursor-pointer border-l-4" style={{ borderLeftColor: task.priority === "CRITICAL" ? "#ef4444" : task.priority === "HIGH" ? "#f97316" : task.priority === "MEDIUM" ? "#eab308" : "#94a3b8" }} data-testid={`task-card-${task.id}`}>
      <CardContent className="p-3">
        {viewMode === "by-date" && (
          <div className="flex items-center gap-1 mb-2">
            <Badge variant="outline" className={`text-xs ${status.bgColor} ${status.color} border-0`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        )}

        {viewMode === "by-status" && task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3" />
            <span>{formatDateLabel(task.dueDate)}</span>
          </div>
        )}

        <h4 className="font-medium text-sm leading-tight mb-2">{task.name}</h4>
        
        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {task.preparerName ? (
              <div className="flex items-center gap-1 text-xs">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span className="text-muted-foreground">{task.preparerName}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-3 w-3" />
                </div>
                <span>Unassigned</span>
              </div>
            )}
          </div>
          <Badge className={`text-xs shrink-0 ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
        </div>

        {next && task.status !== "LOCKED" && (
          <Button 
            size="sm" 
            className="w-full mt-3" 
            variant="outline"
            disabled={isUpdating}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, next);
            }}
            data-testid={`button-advance-${task.id}`}
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Mark as {statusInfo[next]?.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "No Date";
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getCloseDayLabel(dateStr: string, periodEndDate: string | undefined): string {
  if (!dateStr || !periodEndDate) return formatDateLabel(dateStr);
  
  const taskDate = new Date(dateStr + "T00:00:00");
  const periodEnd = new Date(periodEndDate + "T00:00:00");
  const diffDays = Math.ceil((taskDate.getTime() - periodEnd.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return `Day ${diffDays}`;
  return `Day +${diffDays}`;
}

export default function CloseControlKanbanPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("by-date");
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    priority: "MEDIUM" as string,
    dueDate: "",
    preparerName: "",
  });

  const { data: tasklist, isLoading: tasklistLoading } = useQuery<CloseTasklist>({
    queryKey: [`/api/close-control/tasklists/${id}`],
    enabled: !!id,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<CloseTask[]>({
    queryKey: [`/api/close-control/tasklists/${id}/tasks`],
    enabled: !!id,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      return apiRequest("PATCH", `/api/close-control/tasks/${taskId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/close-control/tasklists/${id}/tasks`] });
      queryClient.invalidateQueries({ queryKey: [`/api/close-control/tasklists/${id}`] });
      toast({ title: "Task updated", description: "Task status has been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update task status.", variant: "destructive" });
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async (taskData: typeof newTask) => {
      return apiRequest("POST", `/api/close-control/tasklists/${id}/tasks`, {
        ...taskData,
        tasklistId: id,
        closeScheduleId: tasklist?.closeScheduleId,
        status: "NOT_STARTED",
        evidenceStatus: "MISSING",
        evidenceCount: 0,
        order: tasks.length,
        period: tasklist?.period,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/close-control/tasklists/${id}/tasks`] });
      queryClient.invalidateQueries({ queryKey: [`/api/close-control/tasklists/${id}`] });
      setAddTaskOpen(false);
      setNewTask({ name: "", description: "", priority: "MEDIUM", dueDate: "", preparerName: "" });
      toast({ title: "Task added", description: "New task has been added to the tasklist." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add task.", variant: "destructive" });
    },
  });

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskMutation.mutate({ taskId, status: newStatus });
  };

  const handleAddTask = () => {
    if (!newTask.name.trim()) {
      toast({ title: "Error", description: "Task name is required.", variant: "destructive" });
      return;
    }
    addTaskMutation.mutate(newTask);
  };

  const dateColumns = useMemo(() => {
    if (!tasks.length) return [];
    
    const uniqueDates = Array.from(new Set(tasks.map(t => t.dueDate).filter(Boolean))).sort();
    const noDateTasks = tasks.filter(t => !t.dueDate);
    
    const columns = uniqueDates.map(date => ({
      key: date,
      label: formatDateLabel(date),
      subLabel: getCloseDayLabel(date, tasklist?.period ? `${tasklist.period}-31` : undefined),
      tasks: tasks.filter(t => t.dueDate === date),
    }));
    
    if (noDateTasks.length > 0) {
      columns.push({
        key: "no-date",
        label: "Unscheduled",
        subLabel: "No due date",
        tasks: noDateTasks,
      });
    }
    
    return columns;
  }, [tasks, tasklist?.period]);

  const statusColumns = useMemo(() => {
    const statuses: TaskStatus[] = ["NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "REVIEWED", "APPROVED"];
    return statuses.map(status => ({
      key: status,
      label: statusInfo[status].label,
      color: statusInfo[status].bgColor,
      tasks: tasks.filter(t => t.status === status),
    }));
  }, [tasks]);

  const isLoading = tasklistLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (!tasklist) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Tasklist not found</h2>
        <Button asChild>
          <Link href="/close-control">Back to Close Control</Link>
        </Button>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.status === "APPROVED" || t.status === "LOCKED").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const columns = viewMode === "by-date" ? dateColumns : statusColumns;

  return (
    <div className="flex flex-col h-full" data-testid="kanban-page">
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/close-control/tasklist/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold" data-testid="tasklist-name">{tasklist.name}</h1>
            <p className="text-sm text-muted-foreground">{tasklist.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">{progressPercent}% Complete</span>
            <span className="text-xs text-muted-foreground">({completedCount}/{tasks.length})</span>
          </div>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button 
              variant={viewMode === "by-date" ? "default" : "ghost"} 
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("by-date")}
              data-testid="button-view-by-date"
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              By Date
            </Button>
            <Button 
              variant={viewMode === "by-status" ? "default" : "ghost"} 
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("by-status")}
              data-testid="button-view-by-status"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              By Status
            </Button>
          </div>
          
          <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-task">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-name">Task Name</Label>
                  <Input 
                    id="task-name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    placeholder="Enter task name"
                    data-testid="input-task-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea 
                    id="task-description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                    data-testid="input-task-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(v) => setNewTask({ ...newTask, priority: v })}
                    >
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-due-date">Due Date</Label>
                    <Input 
                      id="task-due-date"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      data-testid="input-due-date"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-preparer">Assigned To</Label>
                  <Input 
                    id="task-preparer"
                    value={newTask.preparerName}
                    onChange={(e) => setNewTask({ ...newTask, preparerName: e.target.value })}
                    placeholder="Enter preparer name"
                    data-testid="input-preparer"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddTaskOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleAddTask} 
                  disabled={addTaskMutation.isPending}
                  data-testid="button-confirm-add-task"
                >
                  {addTaskMutation.isPending ? "Adding..." : "Add Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 min-w-max h-full">
          {columns.map((column) => (
            <div 
              key={column.key} 
              className={`w-72 flex flex-col rounded-lg ${viewMode === "by-status" ? (column as any).color || "bg-muted" : "bg-muted"}`}
              data-testid={`column-${column.key}`}
            >
              <div className="p-3 border-b bg-card/50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{column.label}</h3>
                    {viewMode === "by-date" && "subLabel" in column && (
                      <p className="text-xs text-muted-foreground">{column.subLabel}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {column.tasks.length}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 p-2 overflow-y-auto">
                {column.tasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    isUpdating={updateTaskMutation.isPending}
                    viewMode={viewMode}
                  />
                ))}
                {column.tasks.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {columns.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks yet. Click "Add Task" to create one.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
