import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ScheduleEvent, EventType } from "@shared/schema";
import { CurrencyDisplay } from "@/components/currency-display";
import { 
  PlusCircle, 
  Clock, 
  MinusCircle, 
  Settings, 
  MapPin,
  History
} from "lucide-react";

interface EventLogProps {
  events: ScheduleEvent[];
  localCurrency: string;
  reportingCurrency: string;
}

const eventTypeConfig: Record<EventType, {
  label: string;
  icon: typeof PlusCircle;
  className: string;
}> = {
  AMOUNT_ADJUSTMENT: {
    label: "Amount",
    icon: PlusCircle,
    className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  TIMELINE_EXTENSION: {
    label: "Extend",
    icon: Clock,
    className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  },
  TIMELINE_REDUCTION: {
    label: "Reduce",
    icon: MinusCircle,
    className: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  },
  PROFILE_CHANGE: {
    label: "Profile",
    icon: Settings,
    className: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
  ONBOARDING_BOUNDARY: {
    label: "Onboard",
    icon: MapPin,
    className: "bg-muted text-muted-foreground",
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EventLog({ events, localCurrency, reportingCurrency }: EventLogProps) {
  if (events.length === 0) {
    return (
      <Card data-testid="event-log-empty">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Event Log
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-muted-foreground">
          No events recorded
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="event-log">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4" />
          Event Log
          <Badge variant="secondary" className="ml-auto">
            {events.length} events
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="divide-y">
            {events.map((event) => {
              const config = eventTypeConfig[event.eventType];
              const Icon = config.icon;
              
              return (
                <div 
                  key={event.eventId} 
                  className="flex items-start gap-3 p-4 hover-elevate"
                  data-testid={`event-${event.eventId}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${config.className}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={config.className}>
                        {config.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        Effective: {event.effectivePeriod}
                      </span>
                    </div>
                    
                    {event.eventPayload.amountReportingDelta !== undefined && (
                      <p className="text-sm">
                        Amount adjustment: {' '}
                        <CurrencyDisplay 
                          amount={event.eventPayload.amountReportingDelta} 
                          currency={reportingCurrency}
                          showSign
                          className="font-medium"
                        />
                        {event.eventPayload.amountLocalDelta !== undefined && (
                          <span className="text-muted-foreground ml-1">
                            (<CurrencyDisplay 
                              amount={event.eventPayload.amountLocalDelta} 
                              currency={localCurrency}
                              showSign
                            />)
                          </span>
                        )}
                      </p>
                    )}
                    
                    {event.eventPayload.newEndDate && (
                      <p className="text-sm">
                        New end date: <span className="font-mono">{event.eventPayload.newEndDate}</span>
                      </p>
                    )}
                    
                    {event.reason && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        "{event.reason}"
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {formatDate(event.createdAt)} by {event.createdBy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
