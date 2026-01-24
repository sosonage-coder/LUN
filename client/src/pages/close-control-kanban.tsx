import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  FileText,
  Paperclip,
  Calendar
} from "lucide-react";
import type { CloseTask, CloseTasklist } from "@shared/schema";

type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "REVIEWED" | "APPROVED" | "LOCKED";

const statusColumns: { status: TaskStatus; label: string; color: string }[] = [
  { status: "NOT_STARTED", label: "Not Started", color: "bg-muted" },
  { status: "IN_PROGRESS", label: "In Progress", color: "bg-blue-500/10" },
  { status: "SUBMITTED", label: "Submitted", color: "bg-yellow-500/10" },
  { status: "REVIEWED", label: "Reviewed", color: "bg-purple-500/10" },
  { status: "APPROVED", label: "Approved", color: "bg-green-500/10" },
];

const priorityColors: Record<string, string> = {
  CRITICAL: "bg-red-500 text-white",
  HIGH: "bg-orange-500 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  LOW: "bg-green-500 text-white",
};

interface TaskCardProps {
  task: CloseTask;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  isUpdating: boolean;
}

function TaskCard({ task, onStatusChange, isUpdating }: TaskCardProps) {
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
    <Card className="mb-2 hover-elevate cursor-pointer" data-testid={`task-card-${task.id}`}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-medium text-sm leading-tight">{task.name}</h4>
          <Badge className={`text-xs shrink-0 ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          {task.preparerName && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{task.preparerName}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.evidenceCount > 0 && (
            <Badge variant="outline" className="text-xs">
              <Paperclip className="h-3 w-3 mr-1" />
              {task.evidenceCount}
            </Badge>
          )}
          {task.linkedSchedules && task.linkedSchedules.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              {task.linkedSchedules.length}
            </Badge>
          )}
        </div>

        {next && task.status !== "LOCKED" && (
          <Button 
            size="sm" 
            className="w-full mt-3" 
            variant="outline"
            disabled={isUpdating}
            onClick={() => onStatusChange(task.id, next)}
            data-testid={`button-advance-${task.id}`}
          >
            <ChevronRight className="h-3 w-3 mr-1" />
            Move to {statusColumns.find(c => c.status === next)?.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function CloseControlKanbanPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    priority: "MEDIUM" as string,
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
    mutationFn: async (taskData: { name: string; description: string; priority: string }) => {
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
      setNewTask({ name: "", description: "", priority: "MEDIUM" });
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

  const tasksByStatus = statusColumns.reduce((acc, col) => {
    acc[col.status] = tasks.filter(t => t.status === col.status);
    return acc;
  }, {} as Record<TaskStatus, CloseTask[]>);

  const completedCount = tasks.filter(t => t.status === "APPROVED" || t.status === "LOCKED").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

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
            <span className="text-xs text-muted-foreground">({completedCount}/{tasks.length} tasks)</span>
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
          {statusColumns.map((column) => (
            <div 
              key={column.status} 
              className={`w-72 flex flex-col rounded-lg ${column.color}`}
              data-testid={`column-${column.status}`}
            >
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{column.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {tasksByStatus[column.status]?.length || 0}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 p-2 overflow-y-auto">
                {tasksByStatus[column.status]?.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    isUpdating={updateTaskMutation.isPending}
                  />
                ))}
                {(!tasksByStatus[column.status] || tasksByStatus[column.status].length === 0) && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
