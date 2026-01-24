import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, CheckCircle2, Clock, FileText, LayoutTemplate, ListChecks, Plus, Shield } from "lucide-react";
import type { CloseTemplate } from "@shared/schema";

const periodTypeLabels: Record<string, string> = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUAL: "Annual",
};

const periodTypeColors: Record<string, string> = {
  MONTHLY: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  QUARTERLY: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  ANNUAL: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
};

export default function CloseControlTemplatesPage() {
  const { data: templates, isLoading } = useQuery<CloseTemplate[]>({
    queryKey: ["/api/close-control/templates"],
  });

  const scheduleTemplates = templates?.filter(t => t.templateType === "SCHEDULE") ?? [];
  const tasklistTemplates = templates?.filter(t => t.templateType === "TASKLIST") ?? [];

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="close-control-templates-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/close-control">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold" data-testid="page-title">Close Templates</h1>
          <p className="text-muted-foreground">Reusable templates for close schedules and tasklists</p>
        </div>
        <Button disabled data-testid="button-create-template">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schedule Templates</CardTitle>
            <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="kpi-schedule-templates">{scheduleTemplates.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasklist Templates</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="kpi-tasklist-templates">{tasklistTemplates.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Templates</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="kpi-system-templates">
                {templates?.filter(t => t.isSystemTemplate).length ?? 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks Defined</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="kpi-total-tasks">
                {templates?.reduce((sum, t) => sum + t.taskCount, 0) ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedules" data-testid="tab-schedules">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Templates ({scheduleTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="tasklists" data-testid="tab-tasklists">
            <ListChecks className="h-4 w-4 mr-2" />
            Tasklist Templates ({tasklistTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Templates</CardTitle>
              <CardDescription>Templates for full close schedules with multiple tasklists</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table data-testid="schedule-templates-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-center">Tasks</TableHead>
                      <TableHead className="text-center">Est. Days</TableHead>
                      <TableHead className="text-center">Version</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduleTemplates.map(template => (
                      <TableRow key={template.id} data-testid={`template-row-${template.id}`}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{template.name}</span>
                            <span className="text-xs text-muted-foreground">{template.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={periodTypeColors[template.periodType]}>
                            {periodTypeLabels[template.periodType]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{template.taskCount}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {template.estimatedDays}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">v{template.version}</TableCell>
                        <TableCell>
                          {template.isSystemTemplate ? (
                            <Badge variant="secondary">
                              <Shield className="h-3 w-3 mr-1" />
                              System
                            </Badge>
                          ) : (
                            <Badge variant="outline">Custom</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasklists">
          <Card>
            <CardHeader>
              <CardTitle>Tasklist Templates</CardTitle>
              <CardDescription>Templates for individual tasklists and work packages</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table data-testid="tasklist-templates-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-center">Tasks</TableHead>
                      <TableHead className="text-center">Est. Days</TableHead>
                      <TableHead className="text-center">Version</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasklistTemplates.map(template => (
                      <TableRow key={template.id} data-testid={`template-row-${template.id}`}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{template.name}</span>
                            <span className="text-xs text-muted-foreground">{template.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={periodTypeColors[template.periodType]}>
                            {periodTypeLabels[template.periodType]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{template.taskCount}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {template.estimatedDays}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">v{template.version}</TableCell>
                        <TableCell>
                          {template.isSystemTemplate ? (
                            <Badge variant="secondary">
                              <Shield className="h-3 w-3 mr-1" />
                              System
                            </Badge>
                          ) : (
                            <Badge variant="outline">Custom</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
