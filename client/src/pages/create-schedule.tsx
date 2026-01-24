import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
import { Switch } from "@/components/ui/switch";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertScheduleMasterSchema, type InsertScheduleMaster, type Entity } from "@shared/schema";
import { ArrowLeft, Calculator, Info, Calendar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

const currencies = [
  "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "HKD", "SGD",
  "MXN", "BRL", "INR", "KRW", "SEK", "NOK", "DKK", "NZD", "ZAR", "THB"
];

export default function CreateSchedule() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLateOnboarding, setIsLateOnboarding] = useState(false);
  const [derivedFx, setDerivedFx] = useState<number | null>(null);
  const [periodCount, setPeriodCount] = useState<number | null>(null);

  const { data: entities } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const form = useForm<InsertScheduleMaster>({
    resolver: zodResolver(insertScheduleMasterSchema),
    defaultValues: {
      scheduleType: "PREPAID",
      entityId: "",
      description: "",
      localCurrency: "USD",
      reportingCurrency: "USD",
      startDate: "",
      endDate: "",
      totalAmountLocal: 0,
      totalAmountReporting: 0,
      systemPostingStartPeriod: null,
    },
  });

  const watchLocal = form.watch("totalAmountLocal");
  const watchReporting = form.watch("totalAmountReporting");
  const watchStart = form.watch("startDate");
  const watchEnd = form.watch("endDate");

  useEffect(() => {
    if (watchLocal && watchReporting && watchLocal > 0) {
      setDerivedFx(watchReporting / watchLocal);
    } else {
      setDerivedFx(null);
    }
  }, [watchLocal, watchReporting]);

  useEffect(() => {
    if (watchStart && watchEnd) {
      const [startYear, startMonth] = watchStart.split("-").map(Number);
      const [endYear, endMonth] = watchEnd.split("-").map(Number);
      
      if (startYear && startMonth && endYear && endMonth) {
        const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
        setPeriodCount(months > 0 ? months : null);
      }
    } else {
      setPeriodCount(null);
    }
  }, [watchStart, watchEnd]);

  const mutation = useMutation({
    mutationFn: async (data: InsertScheduleMaster) => {
      return apiRequest("POST", "/api/schedules", data);
    },
    onSuccess: async (response) => {
      const result = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      toast({
        title: "Schedule created",
        description: "Your new schedule has been created successfully.",
      });
      navigate(`/schedules/${result.scheduleId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create schedule",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertScheduleMaster) => {
    const submitData = {
      ...data,
      systemPostingStartPeriod: isLateOnboarding ? data.systemPostingStartPeriod : null,
    };
    mutation.mutate(submitData);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto" data-testid="create-schedule-page">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/schedules">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Create Schedule</h1>
          <p className="text-sm text-muted-foreground">
            Define a new cost allocation schedule
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <CardDescription>
                Core details for the schedule master record
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-schedule-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PREPAID">Prepaid Expense</SelectItem>
                          <SelectItem value="FIXED_ASSET">Fixed Asset</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entity</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-entity">
                            <SelectValue placeholder="Select entity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {entities?.map((entity) => (
                            <SelectItem key={entity.id} value={entity.id}>
                              {entity.name}
                            </SelectItem>
                          )) || (
                            <>
                              <SelectItem value="CORP-001">Corp HQ</SelectItem>
                              <SelectItem value="SUB-US">US Subsidiary</SelectItem>
                              <SelectItem value="SUB-EU">EU Subsidiary</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Annual Software License - Vendor ABC"
                        {...field}
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Currencies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Currency Configuration</CardTitle>
              <CardDescription>
                Reporting currency is truth. Local currency is for context only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="localCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Local Currency
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Transaction currency for reconciliation</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-local-currency">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reportingCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Reporting Currency
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>All calculations occur in this currency</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-reporting-currency">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Amounts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Initial Amounts</CardTitle>
              <CardDescription>
                FX rate will be derived from reporting / local amounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalAmountLocal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount (Local)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-amount-local"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalAmountReporting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount (Reporting)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-amount-reporting"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {derivedFx !== null && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Implied FX Rate: <span className="font-mono font-medium">{derivedFx.toFixed(6)}</span>
                    <span className="text-muted-foreground ml-1">
                      (1 {form.getValues("localCurrency")} = {derivedFx.toFixed(4)} {form.getValues("reportingCurrency")})
                    </span>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recognition Period */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recognition Period</CardTitle>
              <CardDescription>
                Time-based allocation schedule (monthly granularity)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Period</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="YYYY-MM"
                          pattern="\d{4}-\d{2}"
                          {...field}
                          data-testid="input-start-date"
                        />
                      </FormControl>
                      <FormDescription>Format: YYYY-MM (e.g., 2024-01)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Period</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="YYYY-MM"
                          pattern="\d{4}-\d{2}"
                          {...field}
                          value={field.value || ""}
                          data-testid="input-end-date"
                        />
                      </FormControl>
                      <FormDescription>Leave empty for ongoing schedules</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {periodCount !== null && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Recognition periods: <span className="font-mono font-medium">{periodCount}</span> months
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Late Onboarding */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Late Onboarding</CardTitle>
                  <CardDescription>
                    For schedules that started before system implementation
                  </CardDescription>
                </div>
                <Switch
                  checked={isLateOnboarding}
                  onCheckedChange={setIsLateOnboarding}
                  data-testid="switch-late-onboarding"
                />
              </div>
            </CardHeader>
            {isLateOnboarding && (
              <CardContent>
                <FormField
                  control={form.control}
                  name="systemPostingStartPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Posting Start Period</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="YYYY-MM"
                          pattern="\d{4}-\d{2}"
                          {...field}
                          value={field.value || ""}
                          data-testid="input-system-start"
                        />
                      </FormControl>
                      <FormDescription>
                        Periods before this date will be marked as EXTERNAL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            )}
          </Card>

          {/* Submit */}
          <div className="flex items-center gap-3 justify-end">
            <Link href="/schedules">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              data-testid="button-create-schedule"
            >
              {mutation.isPending ? "Creating..." : "Create Schedule"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
