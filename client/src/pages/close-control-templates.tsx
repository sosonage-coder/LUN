import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Calendar, CheckCircle2, Clock, Copy, Edit, Eye, LayoutTemplate, ListChecks, Plus, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import type { CloseTemplate, InsertCloseTemplate } from "@shared/schema";

const periodTypeLabels: Record<string, string> = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUAL: "Annual",
};

const periodTypeColors: Record<string, string> = {
  MONTHLY: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  QUARTERLY: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  YEARLY: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
};

export default function CloseControlTemplatesPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [templateToClone, setTemplateToClone] = useState<CloseTemplate | null>(null);
  const [cloneName, setCloneName] = useState("");
  const [newTemplate, setNewTemplate] = useState<Partial<InsertCloseTemplate>>({
    name: "",
    description: "",
    periodType: "MONTHLY",
    templateType: "TASKLIST",
    estimatedDays: 1,
  });

  const { data: templates, isLoading } = useQuery<CloseTemplate[]>({
    queryKey: ["/api/close-control/templates"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCloseTemplate) => {
      const res = await apiRequest("POST", "/api/close-control/templates", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/close-control/templates"] });
      setCreateDialogOpen(false);
      setNewTemplate({ name: "", description: "", periodType: "MONTHLY", templateType: "TASKLIST", estimatedDays: 1 });
      toast({ title: "Template created", description: "New template has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create template.", variant: "destructive" });
    },
  });

  const cloneMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }): Promise<CloseTemplate> => {
      const res = await apiRequest("POST", `/api/close-control/templates/${id}/clone`, { name });
      return res.json();
    },
    onSuccess: (data: CloseTemplate) => {
      queryClient.invalidateQueries({ queryKey: ["/api/close-control/templates"] });
      setCloneDialogOpen(false);
      setTemplateToClone(null);
      setCloneName("");
      toast({ title: "Template cloned", description: `Template "${data.name}" created successfully.` });
      navigate(`/close-control/templates/${data.id}`);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to clone template.", variant: "destructive" });
    },
  });

  const handleClone = (template: CloseTemplate) => {
    setTemplateToClone(template);
    setCloneName(`${template.name} (Copy)`);
    setCloneDialogOpen(true);
  };

  const handleCreate = () => {
    if (!newTemplate.name) return;
    createMutation.mutate(newTemplate as InsertCloseTemplate);
  };

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
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-template">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>Create a new custom template that your team can edit</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input 
                  id="name" 
                  value={newTemplate.name} 
                  onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g., Q4 Revenue Close"
                  data-testid="input-template-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newTemplate.description} 
                  onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Brief description of this template"
                  data-testid="input-template-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template Type</Label>
                  <Select 
                    value={newTemplate.templateType} 
                    onValueChange={(v) => setNewTemplate({ ...newTemplate, templateType: v as "TASKLIST" | "SCHEDULE" })}
                  >
                    <SelectTrigger data-testid="select-template-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TASKLIST">Tasklist</SelectItem>
                      <SelectItem value="SCHEDULE">Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Period Type</Label>
                  <Select 
                    value={newTemplate.periodType} 
                    onValueChange={(v) => setNewTemplate({ ...newTemplate, periodType: v as "MONTHLY" | "QUARTERLY" | "YEARLY" })}
                  >
                    <SelectTrigger data-testid="select-period-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedDays">Estimated Days</Label>
                <Input 
                  id="estimatedDays" 
                  type="number"
                  min="1"
                  value={newTemplate.estimatedDays} 
                  onChange={e => setNewTemplate({ ...newTemplate, estimatedDays: parseInt(e.target.value) || 1 })}
                  data-testid="input-estimated-days"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newTemplate.name || createMutation.isPending} data-testid="button-confirm-create">
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={cloneDialogOpen} onOpenChange={setCloneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Template</DialogTitle>
            <DialogDescription>Create an editable copy of "{templateToClone?.name}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cloneName">New Template Name</Label>
              <Input 
                id="cloneName" 
                value={cloneName} 
                onChange={e => setCloneName(e.target.value)}
                data-testid="input-clone-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloneDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => templateToClone && cloneMutation.mutate({ id: templateToClone.id, name: cloneName })} 
              disabled={!cloneName || cloneMutation.isPending}
              data-testid="button-confirm-clone"
            >
              Clone Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduleTemplates.map(template => (
                      <TableRow key={template.id} data-testid={`template-row-${template.id}`}>
                        <TableCell>
                          <div className="flex flex-col">
                            <Link href={`/close-control/templates/${template.id}`} className="font-medium hover:underline">
                              {template.name}
                            </Link>
                            <span className="text-xs text-muted-foreground">{template.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={periodTypeColors[template.periodType]}>
                            {periodTypeLabels[template.periodType] || template.periodType}
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
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild data-testid={`button-view-${template.id}`}>
                              <Link href={`/close-control/templates/${template.id}`}>
                                {template.isSystemTemplate ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleClone(template)} data-testid={`button-clone-${template.id}`}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasklistTemplates.map(template => (
                      <TableRow key={template.id} data-testid={`template-row-${template.id}`}>
                        <TableCell>
                          <div className="flex flex-col">
                            <Link href={`/close-control/templates/${template.id}`} className="font-medium hover:underline">
                              {template.name}
                            </Link>
                            <span className="text-xs text-muted-foreground">{template.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={periodTypeColors[template.periodType]}>
                            {periodTypeLabels[template.periodType] || template.periodType}
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
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild data-testid={`button-view-${template.id}`}>
                              <Link href={`/close-control/templates/${template.id}`}>
                                {template.isSystemTemplate ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleClone(template)} data-testid={`button-clone-${template.id}`}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
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
