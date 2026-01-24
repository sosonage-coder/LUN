import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import type { CloseTask } from "@shared/schema";

type ViewMode = "date" | "status";

const statusColors: Record<string, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  SUBMITTED: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  REVIEWED: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const priorityColors: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  LOW: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function TaskCard({ task, viewMode }: { task: CloseTask; viewMode: ViewMode }) {
  const initials = task.preparerName
    ? task.preparerName.split(" ").map(n => n[0]).join("").toUpperCase()
    : "?";

  return (
    <Card 
      className="hover-elevate cursor-pointer transition-all"
      data-testid={`task-card-${task.id}`}
    >
      <CardContent className="p-3 space-y-2">
        {viewMode === "date" && (
          <div className="flex items-center justify-between">
            <Badge className={`${statusColors[task.status]} text-xs`}>
              {task.status.replace("_", " ")}
            </Badge>
            {task.priority && (
              <Badge variant="outline" className={`${priorityColors[task.priority]} text-xs`}>
                {task.priority}
              </Badge>
            )}
          </div>
        )}
        
        {viewMode === "status" && task.dueDate && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
            {task.priority && (
              <Badge variant="outline" className={`${priorityColors[task.priority]} text-xs`}>
                {task.priority}
              </Badge>
            )}
          </div>
        )}

        <p className="font-medium text-sm line-clamp-2">{task.name}</p>

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {task.preparerName || "Unassigned"}
            </span>
          </div>
          <Link href={`/close-control/tasklist/${task.tasklistId}`}>
            <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-accent">
              {task.tasklistId}
            </Badge>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CloseControlCalendar() {
  const [viewMode, setViewMode] = useState<ViewMode>("date");

  const { data: tasks = [], isLoading } = useQuery<CloseTask[]>({
    queryKey: ["/api/close-control/my-tasks"],
  });

  const dateColumns = (() => {
    const columns: Record<string, CloseTask[]> = {};
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toISOString().split("T")[0];
      columns[dateKey] = [];
    }
    columns["unscheduled"] = [];

    tasks.forEach(task => {
      if (task.dueDate) {
        const taskDate = task.dueDate.split("T")[0];
        if (columns[taskDate]) {
          columns[taskDate].push(task);
        } else if (new Date(taskDate) < today) {
          if (!columns["overdue"]) columns["overdue"] = [];
          columns["overdue"].push(task);
        } else {
          columns["unscheduled"].push(task);
        }
      } else {
        columns["unscheduled"].push(task);
      }
    });

    return columns;
  })();

  const statusColumns: Record<string, CloseTask[]> = {
    NOT_STARTED: tasks.filter(t => t.status === "NOT_STARTED"),
    IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS"),
    SUBMITTED: tasks.filter(t => t.status === "SUBMITTED"),
    REVIEWED: tasks.filter(t => t.status === "REVIEWED"),
    APPROVED: tasks.filter(t => t.status === "APPROVED"),
  };

  const columns = viewMode === "date" ? dateColumns : statusColumns;

  const formatColumnHeader = (key: string) => {
    if (viewMode === "status") {
      return key.replace("_", " ");
    }
    if (key === "unscheduled") return "Unscheduled";
    if (key === "overdue") return "Overdue";
    const date = new Date(key);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = date.toDateString() === today.toDateString();
    return isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6" data-testid="calendar-page">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-96 w-72" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="calendar-page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="page-title">Task Calendar</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "date" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("date")}
            data-testid="button-view-by-date"
          >
            <Calendar className="h-4 w-4 mr-1" />
            By Date
          </Button>
          <Button
            variant={viewMode === "status" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("status")}
            data-testid="button-view-by-status"
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            By Status
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(columns).map(([key, columnTasks]) => (
          <div 
            key={key} 
            className="flex-shrink-0 w-72"
            data-testid={`column-${key}`}
          >
            <Card className="h-full">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {formatColumnHeader(key)}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-2 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No tasks
                  </p>
                ) : (
                  columnTasks.map(task => (
                    <TaskCard key={task.id} task={task} viewMode={viewMode} />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
