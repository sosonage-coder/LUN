import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AlertCircle, ArrowLeft, ArrowDown, ArrowUp, Calendar, Clock, Copy, Edit, GripVertical, Link2, Plus, Save, Shield, Trash2, User, Users } from "lucide-react";
import { useState } from "react";
import type { CloseTemplate, CloseTemplateTask, InsertCloseTemplateTask, UpdateCloseTemplateTask, CloseRole, LinkedScheduleType } from "@shared/schema";

type TemplateWithTasks = CloseTemplate & { tasks: CloseTemplateTask[] };

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  MEDIUM: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  HIGH: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const roleLabels: Record<string, string> = {
  PREPARER: "Preparer",
  REVIEWER: "Reviewer",
  CONTROLLER: "Controller",
  CFO: "CFO",
};

const scheduleTypeLabels: Record<string, string> = {
  PREPAID: "Prepaids",
  FIXED_ASSET: "Fixed Assets",
  ACCRUAL: "Accruals",
  REVENUE: "Revenue",
  INVESTMENT: "Investment Income",
  DEBT: "Debt",
  CASH: "Cash",
};

export default function CloseControlTemplateEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<CloseTemplateTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<CloseTemplateTask | null>(null);
  const [newTask, setNewTask] = useState<Partial<InsertCloseTemplateTask>>({
    name: "",
    description: "",
    priority: "MEDIUM",
    estimatedHours: 1,
    order: 0,
    defaultPreparerRole: null,
    defaultReviewerRole: null,
    linkedScheduleType: null,
    dueDayOffset: 0,
    dependencies: [],
  });

  const { data: template, isLoading } = useQuery<TemplateWithTasks>({
    queryKey: [`/api/close-control/templates/${id}`],
    enabled: !!id,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertCloseTemplateTask) => {
      const res = await apiRequest("POST", `/api/close-control/templates/${id}/tasks`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/close-control/templates/${id}`] });
      setAddTaskDialogOpen(false);
      resetNewTask();
      toast({ title: "Task added", description: "New task has been added to the template." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add task.", variant: "destructive" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, data }: { taskId: string; data: UpdateCloseTemplateTask }) => {
      const res = await apiRequest("PATCH", `/api/close-control/template-tasks/${taskId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/close-control/templates/${id}`] });
      setEditTaskDialogOpen(false);
      setTaskToEdit(null);
      toast({ title: "Task updated", description: "Task has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update task.", variant: "destructive" });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await apiRequest("DELETE", `/api/close-control/template-tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/close-control/templates/${id}`] });
      setDeleteTaskDialogOpen(false);
      setTaskToDelete(null);
      toast({ title: "Task deleted", description: "Task has been removed from the template." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete task.", variant: "destructive" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (taskIds: string[]) => {
      const res = await apiRequest("POST", `/api/close-control/templates/${id}/tasks/reorder`, { taskIds });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/close-control/templates/${id}`] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reorder tasks.", variant: "destructive" });
    },
  });

  const resetNewTask = () => {
    setNewTask({
      name: "",
      description: "",
      priority: "MEDIUM",
      estimatedHours: 1,
      order: 0,
      defaultPreparerRole: null,
      defaultReviewerRole: null,
      linkedScheduleType: null,
      dueDayOffset: 0,
      dependencies: [],
    });
  };

  const handleAddTask = () => {
    if (!newTask.name || !id) return;
    const order = (template?.tasks?.length ?? 0);
    createTaskMutation.mutate({
      ...newTask,
      templateId: id,
      order,
    } as InsertCloseTemplateTask);
  };

  const handleEditTask = () => {
    if (!taskToEdit) return;
    updateTaskMutation.mutate({
      taskId: taskToEdit.id,
      data: taskToEdit,
    });
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    deleteTaskMutation.mutate(taskToDelete.id);
  };

  const handleMoveTask = (task: CloseTemplateTask, direction: "up" | "down") => {
    if (!template?.tasks) return;
    const tasks = [...template.tasks].sort((a, b) => a.order - b.order);
    const currentIndex = tasks.findIndex(t => t.id === task.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= tasks.length) return;
    
    const [movedTask] = tasks.splice(currentIndex, 1);
    tasks.splice(newIndex, 0, movedTask);
    
    reorderMutation.mutate(tasks.map(t => t.id));
  };

  const openEditDialog = (task: CloseTemplateTask) => {
    setTaskToEdit({ ...task });
    setEditTaskDialogOpen(true);
  };

  const openDeleteDialog = (task: CloseTemplateTask) => {
    setTaskToDelete(task);
    setDeleteTaskDialogOpen(true);
  };

  const isEditable = template && !template.isSystemTemplate;
  const sortedTasks = template?.tasks?.slice().sort((a, b) => a.order - b.order) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Template not found</h2>
        <Button asChild>
          <Link href="/close-control/templates">Back to Templates</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="template-editor-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/close-control/templates">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold" data-testid="template-name">{template.name}</h1>
            {template.isSystemTemplate && (
              <Badge variant="secondary">
                <Shield className="h-3 w-3 mr-1" />
                System Template
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{template.description}</p>
        </div>
        {!isEditable && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Clone to edit</span>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="kpi-task-count">{sortedTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="kpi-total-hours">
              {sortedTasks.reduce((sum, t) => sum + (t.estimatedHours ?? 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="kpi-estimated-days">{template.estimatedDays}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Version</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="kpi-version">v{template.version}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Template Tasks</CardTitle>
            <CardDescription>
              {isEditable 
                ? "Define and organize the tasks for this template" 
                : "View tasks in this system template - clone to customize"}
            </CardDescription>
          </div>
          {isEditable && (
            <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-task">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add Task</DialogTitle>
                  <DialogDescription>Add a new task to this template</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskName">Task Name</Label>
                    <Input 
                      id="taskName" 
                      value={newTask.name} 
                      onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                      placeholder="e.g., Bank Reconciliation"
                      data-testid="input-task-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taskDescription">Description</Label>
                    <Textarea 
                      id="taskDescription" 
                      value={newTask.description} 
                      onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Brief description of this task"
                      data-testid="input-task-description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select 
                        value={newTask.priority} 
                        onValueChange={(v) => setNewTask({ ...newTask, priority: v as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" })}
                      >
                        <SelectTrigger data-testid="select-priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedHours">Est. Hours</Label>
                      <Input 
                        id="estimatedHours" 
                        type="number"
                        min="0"
                        step="0.5"
                        value={newTask.estimatedHours} 
                        onChange={e => setNewTask({ ...newTask, estimatedHours: parseFloat(e.target.value) || 0 })}
                        data-testid="input-estimated-hours"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preparer Role</Label>
                      <Select 
                        value={newTask.defaultPreparerRole ?? "none"} 
                        onValueChange={(v) => setNewTask({ ...newTask, defaultPreparerRole: v === "none" ? null : v as CloseRole })}
                      >
                        <SelectTrigger data-testid="select-preparer-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="PREPARER">Preparer</SelectItem>
                          <SelectItem value="REVIEWER">Reviewer</SelectItem>
                          <SelectItem value="CONTROLLER">Controller</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Reviewer Role</Label>
                      <Select 
                        value={newTask.defaultReviewerRole ?? "none"} 
                        onValueChange={(v) => setNewTask({ ...newTask, defaultReviewerRole: v === "none" ? null : v as CloseRole })}
                      >
                        <SelectTrigger data-testid="select-reviewer-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="REVIEWER">Reviewer</SelectItem>
                          <SelectItem value="CONTROLLER">Controller</SelectItem>
                          <SelectItem value="CFO">CFO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Linked Schedule</Label>
                      <Select 
                        value={newTask.linkedScheduleType ?? "none"} 
                        onValueChange={(v) => setNewTask({ ...newTask, linkedScheduleType: v === "none" ? null : v as LinkedScheduleType })}
                      >
                        <SelectTrigger data-testid="select-linked-schedule">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="PREPAID">Prepaids</SelectItem>
                          <SelectItem value="FIXED_ASSET">Fixed Assets</SelectItem>
                          <SelectItem value="ACCRUAL">Accruals</SelectItem>
                          <SelectItem value="REVENUE">Revenue</SelectItem>
                          <SelectItem value="INVESTMENT">Investment Income</SelectItem>
                          <SelectItem value="DEBT">Debt</SelectItem>
                          <SelectItem value="CASH">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDayOffset">Due Day Offset</Label>
                      <Input 
                        id="dueDayOffset" 
                        type="number"
                        min="0"
                        value={newTask.dueDayOffset} 
                        onChange={e => setNewTask({ ...newTask, dueDayOffset: parseInt(e.target.value) || 0 })}
                        data-testid="input-due-day-offset"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddTaskDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddTask} disabled={!newTask.name || createTaskMutation.isPending} data-testid="button-confirm-add-task">
                    Add Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {sortedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="empty-tasks-message">
              No tasks defined yet.{isEditable && " Click 'Add Task' to create your first task."}
            </div>
          ) : (
            <Table data-testid="tasks-table">
              <TableHeader>
                <TableRow>
                  {isEditable && <TableHead className="w-10"></TableHead>}
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-center">Est. Hours</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Linked</TableHead>
                  <TableHead className="text-center">Due Offset</TableHead>
                  {isEditable && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTasks.map((task, index) => (
                  <TableRow key={task.id} data-testid={`task-row-${task.id}`}>
                    {isEditable && (
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            disabled={index === 0}
                            onClick={() => handleMoveTask(task, "up")}
                            data-testid={`button-move-up-${task.id}`}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            disabled={index === sortedTasks.length - 1}
                            onClick={() => handleMoveTask(task, "down")}
                            data-testid={`button-move-down-${task.id}`}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{task.name}</span>
                        {task.description && (
                          <span className="text-xs text-muted-foreground">{task.description}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{task.estimatedHours ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs">
                        {task.defaultPreparerRole && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {roleLabels[task.defaultPreparerRole] || task.defaultPreparerRole}
                          </div>
                        )}
                        {task.defaultReviewerRole && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            {roleLabels[task.defaultReviewerRole] || task.defaultReviewerRole}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.linkedScheduleType ? (
                        <div className="flex items-center gap-1 text-xs">
                          <Link2 className="h-3 w-3 text-muted-foreground" />
                          {scheduleTypeLabels[task.linkedScheduleType] || task.linkedScheduleType}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {task.dueDayOffset ? `+${task.dueDayOffset}d` : "-"}
                    </TableCell>
                    {isEditable && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(task)}
                            data-testid={`button-edit-${task.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openDeleteDialog(task)}
                            data-testid={`button-delete-${task.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={editTaskDialogOpen} onOpenChange={setEditTaskDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Modify the task details</DialogDescription>
          </DialogHeader>
          {taskToEdit && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editTaskName">Task Name</Label>
                <Input 
                  id="editTaskName" 
                  value={taskToEdit.name} 
                  onChange={e => setTaskToEdit({ ...taskToEdit, name: e.target.value })}
                  data-testid="input-edit-task-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTaskDescription">Description</Label>
                <Textarea 
                  id="editTaskDescription" 
                  value={taskToEdit.description ?? ""} 
                  onChange={e => setTaskToEdit({ ...taskToEdit, description: e.target.value })}
                  data-testid="input-edit-task-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={taskToEdit.priority} 
                    onValueChange={(v) => setTaskToEdit({ ...taskToEdit, priority: v as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" })}
                  >
                    <SelectTrigger data-testid="select-edit-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEstimatedHours">Est. Hours</Label>
                  <Input 
                    id="editEstimatedHours" 
                    type="number"
                    min="0"
                    step="0.5"
                    value={taskToEdit.estimatedHours ?? 0} 
                    onChange={e => setTaskToEdit({ ...taskToEdit, estimatedHours: parseFloat(e.target.value) || 0 })}
                    data-testid="input-edit-estimated-hours"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preparer Role</Label>
                  <Select 
                    value={taskToEdit.defaultPreparerRole ?? "none"} 
                    onValueChange={(v) => setTaskToEdit({ ...taskToEdit, defaultPreparerRole: v === "none" ? null : v as CloseRole })}
                  >
                    <SelectTrigger data-testid="select-edit-preparer-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="PREPARER">Preparer</SelectItem>
                      <SelectItem value="REVIEWER">Reviewer</SelectItem>
                      <SelectItem value="CONTROLLER">Controller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reviewer Role</Label>
                  <Select 
                    value={taskToEdit.defaultReviewerRole ?? "none"} 
                    onValueChange={(v) => setTaskToEdit({ ...taskToEdit, defaultReviewerRole: v === "none" ? null : v as CloseRole })}
                  >
                    <SelectTrigger data-testid="select-edit-reviewer-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="REVIEWER">Reviewer</SelectItem>
                      <SelectItem value="CONTROLLER">Controller</SelectItem>
                      <SelectItem value="CFO">CFO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Linked Schedule</Label>
                  <Select 
                    value={taskToEdit.linkedScheduleType ?? "none"} 
                    onValueChange={(v) => setTaskToEdit({ ...taskToEdit, linkedScheduleType: v === "none" ? null : v as LinkedScheduleType })}
                  >
                    <SelectTrigger data-testid="select-edit-linked-schedule">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="PREPAID">Prepaids</SelectItem>
                      <SelectItem value="FIXED_ASSET">Fixed Assets</SelectItem>
                      <SelectItem value="ACCRUAL">Accruals</SelectItem>
                      <SelectItem value="REVENUE">Revenue</SelectItem>
                      <SelectItem value="INVESTMENT">Investment Income</SelectItem>
                      <SelectItem value="DEBT">Debt</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDueDayOffset">Due Day Offset</Label>
                  <Input 
                    id="editDueDayOffset" 
                    type="number"
                    min="0"
                    value={taskToEdit.dueDayOffset ?? 0} 
                    onChange={e => setTaskToEdit({ ...taskToEdit, dueDayOffset: parseInt(e.target.value) || 0 })}
                    data-testid="input-edit-due-day-offset"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTaskDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTask} disabled={updateTaskMutation.isPending} data-testid="button-confirm-edit-task">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteTaskDialogOpen} onOpenChange={setDeleteTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{taskToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTaskDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTask} disabled={deleteTaskMutation.isPending} data-testid="button-confirm-delete-task">
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
