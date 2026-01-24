import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import type { CloseTemplate } from "@shared/schema";

const createCloseScheduleSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/, "Must be YYYY-MM format"),
  scheduleName: z.string().min(1, "Schedule name is required"),
  templateId: z.string().optional(),
  description: z.string().optional(),
});

type CreateCloseScheduleForm = z.infer<typeof createCloseScheduleSchema>;

export default function CloseControlNew() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: templates = [] } = useQuery<CloseTemplate[]>({
    queryKey: ["/api/close-control/templates"],
  });

  const scheduleTemplates = templates.filter(t => t.templateType === "SCHEDULE");

  const form = useForm<CreateCloseScheduleForm>({
    resolver: zodResolver(createCloseScheduleSchema),
    defaultValues: {
      period: "",
      scheduleName: "",
      templateId: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateCloseScheduleForm) => {
      return apiRequest("POST", "/api/close-control/schedules", data);
    },
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: "Close Schedule Created",
        description: `Successfully created ${result.scheduleName}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/close-control/schedules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/close-control/kpis"] });
      navigate(`/close-control/schedule/${result.scheduleId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create close schedule",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateCloseScheduleForm) => {
    mutation.mutate(data);
  };

  const watchPeriod = form.watch("period");
  const watchTemplate = form.watch("templateId");

  const selectedTemplate = scheduleTemplates.find(t => t.id === watchTemplate);

  return (
    <div className="p-6 space-y-6" data-testid="create-close-schedule-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/close-control">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">Create Close Schedule</h1>
          <p className="text-muted-foreground">Set up a new period-end close schedule</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Details</CardTitle>
              <CardDescription>
                Configure the close schedule period and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Period</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="2026-02" 
                              {...field} 
                              data-testid="input-period"
                            />
                          </FormControl>
                          <FormDescription>
                            Format: YYYY-MM (e.g., 2026-02 for February 2026)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scheduleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schedule Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="February 2026 Month-End Close" 
                              {...field}
                              data-testid="input-schedule-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template (Optional)</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(value === "none" ? "" : value)} 
                          value={field.value || "none"}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-template">
                              <SelectValue placeholder="Select a template to use" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No template</SelectItem>
                            {scheduleTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name} ({template.taskCount} tasks)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Start from a template to pre-populate tasklists and tasks
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes about this close schedule..."
                            className="resize-none"
                            {...field}
                            data-testid="input-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      disabled={mutation.isPending}
                      data-testid="button-create-schedule"
                    >
                      {mutation.isPending ? "Creating..." : "Create Schedule"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/close-control">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {selectedTemplate && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Template Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">{selectedTemplate.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tasks:</span>
                    <span className="ml-1 font-medium">{selectedTemplate.taskCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. Days:</span>
                    <span className="ml-1 font-medium">{selectedTemplate.estimatedDays}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Period:</span>
                    <span className="ml-1 font-medium">{selectedTemplate.periodType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Version:</span>
                    <span className="ml-1 font-medium">{selectedTemplate.version}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Use templates to speed up schedule creation</li>
                <li>• Period format should be YYYY-MM</li>
                <li>• You can add tasklists after creating the schedule</li>
                <li>• Tasks can be assigned to team members later</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
