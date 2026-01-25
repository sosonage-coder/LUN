import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar as CalendarIcon, 
  ListTodo, 
  User, 
  CheckSquare, 
  LayoutDashboard, 
  Settings,
  ChevronRight,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  PlayCircle,
  Filter,
  Search
} from "lucide-react";
import {
  getCurrentPeriod,
  getTasks,
  getCloseUsers,
  getControls,
  getTaskStats,
  getStatsByProcess,
  getControlCoverage,
  updateTaskStatus,
  addTaskComment,
  isTaskOverdue,
  PROCESS_LABELS,
  TB_CLASS_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  type CloseTask,
  type TaskStatus,
  type CloseProcess,
  type TrialBalanceClass,
} from "@/lib/close-tasks-data";

export default function CloseTasksPage() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="flex flex-col h-full" data-testid="close-tasks-page">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold" data-testid="page-title">Close Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {getCurrentPeriod().name}
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="h-10" data-testid="main-tabs">
            <TabsTrigger value="calendar" className="gap-2" data-testid="tab-calendar">
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="task-list" className="gap-2" data-testid="tab-task-list">
              <ListTodo className="h-4 w-4" />
              Task List
            </TabsTrigger>
            <TabsTrigger value="my-tasks" className="gap-2" data-testid="tab-my-tasks">
              <User className="h-4 w-4" />
              My Tasks
            </TabsTrigger>
            <TabsTrigger value="control-checklist" className="gap-2" data-testid="tab-control-checklist">
              <CheckSquare className="h-4 w-4" />
              Control Checklist
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2" data-testid="tab-dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="setup" className="gap-2" data-testid="tab-setup">
              <Settings className="h-4 w-4" />
              Setup
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="calendar" className="mt-0">
            <CalendarView key={refreshKey} />
          </TabsContent>
          <TabsContent value="task-list" className="mt-0">
            <TaskListView key={refreshKey} onUpdate={refresh} />
          </TabsContent>
          <TabsContent value="my-tasks" className="mt-0">
            <MyTasksView key={refreshKey} onUpdate={refresh} />
          </TabsContent>
          <TabsContent value="control-checklist" className="mt-0">
            <ControlChecklistView key={refreshKey} />
          </TabsContent>
          <TabsContent value="dashboard" className="mt-0">
            <DashboardView key={refreshKey} />
          </TabsContent>
          <TabsContent value="setup" className="mt-0">
            <SetupView key={refreshKey} onUpdate={refresh} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CalendarView() {
  const period = getCurrentPeriod();
  const tasks = getTasks(period.id);
  
  const tasksByDay = useMemo(() => {
    const grouped: Record<number, CloseTask[]> = {};
    tasks.forEach(task => {
      const day = task.dueDay;
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(task);
    });
    return grouped;
  }, [tasks]);

  const maxDay = Math.max(...Object.keys(tasksByDay).map(Number), 5);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  const getStatusColor = (task: CloseTask) => {
    if (isTaskOverdue(task)) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300';
    return `${STATUS_COLORS[task.status].bg} ${STATUS_COLORS[task.status].border} ${STATUS_COLORS[task.status].text}`;
  };

  return (
    <div className="space-y-6" data-testid="calendar-view">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {period.name} Timeline
          </CardTitle>
          <CardDescription>
            Tasks plotted by due date. This is a planning view - update status on the Task List page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="flex border-b pb-2 mb-4">
                {days.map(day => (
                  <div key={day} className="flex-1 px-2 text-center">
                    <div className="font-medium">Day {day}</div>
                    <div className="text-xs text-muted-foreground">
                      {tasksByDay[day]?.length || 0} tasks
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                {days.map(day => (
                  <div key={day} className="flex-1 px-1 space-y-2" data-testid={`calendar-day-${day}`}>
                    {tasksByDay[day]?.map(task => (
                      <div
                        key={task.id}
                        className={`p-2 rounded-md border text-xs ${getStatusColor(task)}`}
                        data-testid={`calendar-task-${task.id}`}
                      >
                        <div className="font-medium truncate">{task.name}</div>
                        <div className="opacity-75 truncate">{task.assignedToName}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 pt-4 border-t text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-muted border"></div>
              <span>Not Started</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"></div>
              <span>In Process</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"></div>
              <span>Overdue</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TaskListView({ onUpdate }: { onUpdate: () => void }) {
  const period = getCurrentPeriod();
  const tasks = getTasks(period.id);
  const users = getCloseUsers();
  
  const [filterProcess, setFilterProcess] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filterProcess !== "all" && task.process !== filterProcess) return false;
      if (filterUser !== "all" && task.assignedTo !== filterUser) return false;
      if (filterStatus !== "all" && task.status !== filterStatus) return false;
      if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filterProcess, filterUser, filterStatus, searchQuery]);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    onUpdate();
  };

  return (
    <div className="space-y-4" data-testid="task-list-view">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Task List
          </CardTitle>
          <CardDescription>
            Update task status and add comments. This is the primary execution surface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
                data-testid="search-tasks"
              />
            </div>
            <Select value={filterProcess} onValueChange={setFilterProcess}>
              <SelectTrigger className="w-40" data-testid="filter-process">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Process" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Processes</SelectItem>
                {Object.entries(PROCESS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-40" data-testid="filter-user">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40" data-testid="filter-status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                <SelectItem value="IN_PROCESS">In Process</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Process</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map(task => (
                <TaskRow 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleStatusChange}
                  onUpdate={onUpdate}
                />
              ))}
              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No tasks match your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function TaskRow({ task, onStatusChange, onUpdate }: { 
  task: CloseTask; 
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onUpdate: () => void;
}) {
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [comment, setComment] = useState("");
  const overdue = isTaskOverdue(task);

  const handleAddComment = () => {
    if (comment.trim()) {
      addTaskComment(task.id, comment, 'user-1', 'Alex Chen');
      setComment("");
      setShowCommentDialog(false);
      onUpdate();
    }
  };

  const StatusIcon = task.status === 'COMPLETED' ? CheckCircle2 :
    task.status === 'IN_PROCESS' ? PlayCircle : Circle;

  return (
    <TableRow data-testid={`task-row-${task.id}`}>
      <TableCell>
        <div className="flex items-center gap-2">
          {overdue && <AlertCircle className="h-4 w-4 text-red-500" />}
          <span className="font-medium">{task.name}</span>
          {task.comments.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              {task.comments.length}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{PROCESS_LABELS[task.process]}</Badge>
      </TableCell>
      <TableCell>{task.assignedToName}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          Day {task.dueDay}
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={task.status}
          onValueChange={(value) => onStatusChange(task.id, value as TaskStatus)}
        >
          <SelectTrigger className="w-32" data-testid={`status-select-${task.id}`}>
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${
                task.status === 'COMPLETED' ? 'text-green-600' :
                task.status === 'IN_PROCESS' ? 'text-blue-600' : 'text-muted-foreground'
              }`} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NOT_STARTED">
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4" />
                Not Started
              </div>
            </SelectItem>
            <SelectItem value="IN_PROCESS">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-blue-600" />
                In Process
              </div>
            </SelectItem>
            <SelectItem value="COMPLETED">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Completed
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`comment-btn-${task.id}`}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Comments for {task.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {task.comments.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-auto">
                  {task.comments.map(c => (
                    <div key={c.id} className="p-3 bg-muted rounded-md">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{c.userName}</span>
                        <span className="text-muted-foreground">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{c.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No comments yet</p>
              )}
              <div className="space-y-2">
                <Label>Add Comment</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter your comment..."
                  data-testid="comment-input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddComment} data-testid="submit-comment">
                Add Comment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

function MyTasksView({ onUpdate }: { onUpdate: () => void }) {
  const currentUserId = 'user-1';
  const currentUserName = 'Alex Chen';
  const period = getCurrentPeriod();
  const allTasks = getTasks(period.id);
  const myTasks = allTasks.filter(t => t.assignedTo === currentUserId);

  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, CloseTask[]> = {
      IN_PROCESS: [],
      NOT_STARTED: [],
      COMPLETED: [],
    };
    myTasks.forEach(task => {
      groups[task.status].push(task);
    });
    Object.values(groups).forEach(arr => arr.sort((a, b) => a.dueDay - b.dueDay));
    return groups;
  }, [myTasks]);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    onUpdate();
  };

  return (
    <div className="space-y-6" data-testid="my-tasks-view">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            My Tasks
          </CardTitle>
          <CardDescription>
            Hello {currentUserName}! You have {myTasks.length} tasks assigned to you for {period.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedTasks.IN_PROCESS.length > 0 && (
            <div>
              <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                In Process ({groupedTasks.IN_PROCESS.length})
              </h3>
              <div className="space-y-2">
                {groupedTasks.IN_PROCESS.map(task => (
                  <MyTaskItem key={task.id} task={task} onStatusChange={handleStatusChange} />
                ))}
              </div>
            </div>
          )}

          {groupedTasks.NOT_STARTED.length > 0 && (
            <div>
              <h3 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Circle className="h-4 w-4" />
                Not Started ({groupedTasks.NOT_STARTED.length})
              </h3>
              <div className="space-y-2">
                {groupedTasks.NOT_STARTED.map(task => (
                  <MyTaskItem key={task.id} task={task} onStatusChange={handleStatusChange} />
                ))}
              </div>
            </div>
          )}

          {groupedTasks.COMPLETED.length > 0 && (
            <div>
              <h3 className="font-medium text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Completed ({groupedTasks.COMPLETED.length})
              </h3>
              <div className="space-y-2">
                {groupedTasks.COMPLETED.map(task => (
                  <MyTaskItem key={task.id} task={task} onStatusChange={handleStatusChange} />
                ))}
              </div>
            </div>
          )}

          {myTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tasks assigned to you for this period
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MyTaskItem({ task, onStatusChange }: { 
  task: CloseTask; 
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  const overdue = isTaskOverdue(task);

  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-md border ${
        overdue ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : 'bg-muted/50'
      }`}
      data-testid={`my-task-${task.id}`}
    >
      <div className="flex items-center gap-3">
        {overdue && <AlertCircle className="h-4 w-4 text-red-500" />}
        <div>
          <div className="font-medium">{task.name}</div>
          <div className="text-sm text-muted-foreground">
            {PROCESS_LABELS[task.process]} - Day {task.dueDay}
          </div>
        </div>
      </div>
      <Select
        value={task.status}
        onValueChange={(value) => onStatusChange(task.id, value as TaskStatus)}
      >
        <SelectTrigger className="w-32" data-testid={`my-task-status-${task.id}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NOT_STARTED">Not Started</SelectItem>
          <SelectItem value="IN_PROCESS">In Process</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function ControlChecklistView() {
  const period = getCurrentPeriod();
  const coverage = getControlCoverage(period.id);

  return (
    <div className="space-y-6" data-testid="control-checklist-view">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Control Checklist
          </CardTitle>
          <CardDescription>
            Ensure every required control has a linked task. Controls grouped by Trial Balance class.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{coverage.totalControls}</div>
              <div className="text-sm text-muted-foreground">Total Controls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{coverage.linkedControls}</div>
              <div className="text-sm text-muted-foreground">Linked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{coverage.completedControls}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>

          <div className="space-y-6">
            {(Object.keys(TB_CLASS_LABELS) as TrialBalanceClass[]).map(tbClass => {
              const classData = coverage.byClass[tbClass];
              if (classData.controls.length === 0) return null;
              
              return (
                <div key={tbClass} data-testid={`control-group-${tbClass}`}>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    {TB_CLASS_LABELS[tbClass]}
                    <Badge variant="outline">
                      {classData.controls.filter(c => c.isCompleted).length}/{classData.controls.length}
                    </Badge>
                  </h3>
                  <div className="space-y-2">
                    {classData.controls.map(({ control, task, isLinked, isCompleted }) => (
                      <div 
                        key={control.id}
                        className="flex items-center gap-3 p-2 rounded border bg-muted/30"
                        data-testid={`control-item-${control.id}`}
                      >
                        <div className={`h-5 w-5 rounded flex items-center justify-center ${
                          isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                          isLinked ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : isLinked ? (
                            <PlayCircle className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{control.name}</div>
                          {task && (
                            <div className="text-sm text-muted-foreground">
                              Assigned to {task.assignedToName} - Day {task.dueDay}
                            </div>
                          )}
                        </div>
                        {!isLinked && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300">
                            No Task Linked
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardView() {
  const period = getCurrentPeriod();
  const stats = getTaskStats(period.id);
  const procesStats = getStatsByProcess(period.id);

  return (
    <div className="space-y-6" data-testid="dashboard-view">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.percentComplete}%</div>
            <Progress value={stats.percentComplete} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              {stats.completed}
            </div>
            <p className="text-sm text-muted-foreground mt-1">of {stats.total} tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              In Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              <PlayCircle className="h-6 w-6 text-blue-600" />
              {stats.inProcess}
            </div>
            <p className="text-sm text-muted-foreground mt-1">actively being worked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Not Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              <Circle className="h-6 w-6 text-muted-foreground" />
              {stats.notStarted}
            </div>
            <p className="text-sm text-muted-foreground mt-1">pending start</p>
          </CardContent>
        </Card>
      </div>

      {stats.overdue > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-sm text-muted-foreground mt-1">
              tasks past their due date
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Progress by Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(Object.keys(PROCESS_LABELS) as CloseProcess[]).map(process => {
              const data = procesStats[process];
              if (data.total === 0) return null;
              
              const StatusIcon = data.status === 'complete' ? CheckCircle2 :
                data.status === 'in_progress' ? PlayCircle : Circle;
              const statusColor = data.status === 'complete' ? 'text-green-600' :
                data.status === 'in_progress' ? 'text-blue-600' : 'text-muted-foreground';

              return (
                <div 
                  key={process} 
                  className="p-3 rounded-md border bg-muted/30"
                  data-testid={`process-status-${process}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                    <span className="font-medium text-sm">{PROCESS_LABELS[process]}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data.completed}/{data.total} complete
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SetupView({ onUpdate }: { onUpdate: () => void }) {
  const [closeType, setCloseType] = useState<string>("MONTHLY");
  const [selectedProcesses, setSelectedProcesses] = useState<Set<string>>(
    new Set(Object.keys(PROCESS_LABELS))
  );

  const toggleProcess = (process: string) => {
    const newSet = new Set(selectedProcesses);
    if (newSet.has(process)) {
      newSet.delete(process);
    } else {
      newSet.add(process);
    }
    setSelectedProcesses(newSet);
  };

  return (
    <div className="space-y-6" data-testid="setup-view">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Close Period Setup
          </CardTitle>
          <CardDescription>
            Configure your close period and select applicable processes to auto-generate tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Close Type</Label>
            <Select value={closeType} onValueChange={setCloseType}>
              <SelectTrigger className="w-48" data-testid="close-type-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MONTHLY">Monthly Close</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly Close</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Select Applicable Processes</Label>
            <p className="text-sm text-muted-foreground">
              Tasks will be auto-generated for each selected process based on control templates.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(Object.keys(PROCESS_LABELS) as CloseProcess[]).map(process => (
                <div 
                  key={process}
                  className="flex items-center gap-2 p-3 rounded-md border hover-elevate cursor-pointer"
                  onClick={() => toggleProcess(process)}
                  data-testid={`process-checkbox-${process}`}
                >
                  <Checkbox 
                    checked={selectedProcesses.has(process)}
                    onCheckedChange={() => toggleProcess(process)}
                  />
                  <span className="text-sm">{PROCESS_LABELS[process]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              className="gap-2"
              data-testid="generate-tasks-btn"
              onClick={() => {
                onUpdate();
              }}
            >
              <ChevronRight className="h-4 w-4" />
              Generate Tasks for Period
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This will create control-based tasks with default assignments and due dates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
