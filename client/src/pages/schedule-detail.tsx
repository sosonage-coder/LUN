import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScheduleSummaryCard } from "@/components/schedule-summary-card";
import { PeriodScheduleTable } from "@/components/period-schedule-table";
import { EventLog } from "@/components/event-log";
import { EmptyState } from "@/components/empty-state";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  RefreshCw, 
  Plus,
  Calendar,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { 
  ScheduleMaster, 
  ScheduleEvent, 
  PeriodLine, 
  EventType,
  InsertScheduleEvent
} from "@shared/schema";

interface ScheduleDetailData {
  schedule: ScheduleMaster;
  events: ScheduleEvent[];
  periods: PeriodLine[];
}

function AddEventDialog({ 
  scheduleId, 
  onSuccess 
}: { 
  scheduleId: string; 
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState<EventType>("AMOUNT_ADJUSTMENT");
  const [effectivePeriod, setEffectivePeriod] = useState("");
  const [amountDelta, setAmountDelta] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: InsertScheduleEvent) => {
      return apiRequest("POST", `/api/schedules/${scheduleId}/events`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules", scheduleId] });
      toast({
        title: "Event created",
        description: "The schedule has been updated.",
      });
      setOpen(false);
      resetForm();
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create event",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setEventType("AMOUNT_ADJUSTMENT");
    setEffectivePeriod("");
    setAmountDelta("");
    setNewEndDate("");
    setReason("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: InsertScheduleEvent["eventPayload"] = {};
    
    if (eventType === "AMOUNT_ADJUSTMENT" && amountDelta) {
      payload.amountReportingDelta = parseFloat(amountDelta);
    }
    
    if ((eventType === "TIMELINE_EXTENSION" || eventType === "TIMELINE_REDUCTION") && newEndDate) {
      payload.newEndDate = newEndDate;
    }

    mutation.mutate({
      scheduleId,
      eventType,
      effectivePeriod,
      eventPayload: payload,
      reason: reason || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-add-event">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Schedule Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
              <SelectTrigger data-testid="select-event-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AMOUNT_ADJUSTMENT">Amount Adjustment</SelectItem>
                <SelectItem value="TIMELINE_EXTENSION">Timeline Extension</SelectItem>
                <SelectItem value="TIMELINE_REDUCTION">Timeline Reduction</SelectItem>
                <SelectItem value="PROFILE_CHANGE">Profile Change</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Effective Period (YYYY-MM)</Label>
            <Input
              placeholder="2024-03"
              value={effectivePeriod}
              onChange={(e) => setEffectivePeriod(e.target.value)}
              pattern="\d{4}-\d{2}"
              required
              data-testid="input-effective-period"
            />
          </div>

          {eventType === "AMOUNT_ADJUSTMENT" && (
            <div className="space-y-2">
              <Label>Amount Delta (Reporting Currency)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="1000.00"
                value={amountDelta}
                onChange={(e) => setAmountDelta(e.target.value)}
                data-testid="input-amount-delta"
              />
              <p className="text-xs text-muted-foreground">
                Positive for increase, negative for decrease
              </p>
            </div>
          )}

          {(eventType === "TIMELINE_EXTENSION" || eventType === "TIMELINE_REDUCTION") && (
            <div className="space-y-2">
              <Label>New End Date (YYYY-MM)</Label>
              <Input
                placeholder="2025-12"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                pattern="\d{4}-\d{2}"
                data-testid="input-new-end-date"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder="Describe the reason for this change..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              data-testid="input-reason"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1"
              data-testid="button-submit-event"
            >
              {mutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ScheduleDetail() {
  const [, params] = useRoute("/schedules/:id");
  const scheduleId = params?.id;
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery<ScheduleDetailData>({
    queryKey: ["/api/schedules", scheduleId],
    enabled: !!scheduleId,
  });

  const rebuildMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/schedules/${scheduleId}/rebuild`, {});
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Schedule rebuilt",
        description: "The schedule has been recalculated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Rebuild failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertTriangle}
          title="Schedule not found"
          description="The requested schedule could not be found."
          action={{
            label: "Back to Schedules",
            onClick: () => window.location.href = "/schedules",
          }}
        />
      </div>
    );
  }

  const { schedule, events, periods } = data;

  return (
    <div className="p-6 space-y-6" data-testid="schedule-detail-page">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/schedules">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {schedule.description}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {schedule.scheduleId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => rebuildMutation.mutate()}
            disabled={rebuildMutation.isPending}
            data-testid="button-rebuild"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${rebuildMutation.isPending ? "animate-spin" : ""}`} />
            Rebuild
          </Button>
          <AddEventDialog 
            scheduleId={schedule.scheduleId} 
            onSuccess={() => refetch()}
          />
        </div>
      </div>

      {/* Alert for late onboarding */}
      {schedule.systemPostingStartPeriod && (
        <Card className="border-chart-4/30 bg-chart-4/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-chart-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Late Onboarding Schedule</p>
              <p className="text-xs text-muted-foreground">
                System posting starts from {schedule.systemPostingStartPeriod}. 
                Earlier periods are marked as EXTERNAL and are read-only.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary and Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ScheduleSummaryCard schedule={schedule} periods={periods} />
        <div className="lg:col-span-2">
          <EventLog 
            events={events} 
            localCurrency={schedule.localCurrency}
            reportingCurrency={schedule.reportingCurrency}
          />
        </div>
      </div>

      {/* Period Schedule Table */}
      <PeriodScheduleTable 
        periods={periods}
        localCurrency={schedule.localCurrency}
        reportingCurrency={schedule.reportingCurrency}
      />
    </div>
  );
}
