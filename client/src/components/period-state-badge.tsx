import { Badge } from "@/components/ui/badge";
import type { PeriodState } from "@shared/schema";
import { 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  StopCircle 
} from "lucide-react";

interface PeriodStateBadgeProps {
  state: PeriodState;
  className?: string;
}

const stateConfig: Record<PeriodState, { 
  label: string; 
  variant: "default" | "secondary" | "outline" | "destructive";
  icon: typeof ExternalLink;
  className: string;
}> = {
  EXTERNAL: {
    label: "External",
    variant: "outline",
    icon: ExternalLink,
    className: "text-muted-foreground border-muted-foreground/30",
  },
  SYSTEM_BASE: {
    label: "System",
    variant: "secondary",
    icon: CheckCircle2,
    className: "bg-chart-2/10 text-chart-2 border-chart-2/20 dark:bg-chart-2/20",
  },
  SYSTEM_ADJUSTED: {
    label: "Adjusted",
    variant: "default",
    icon: AlertCircle,
    className: "bg-chart-4/10 text-chart-4 border-chart-4/20 dark:bg-chart-4/20",
  },
  CLOSED: {
    label: "Closed",
    variant: "secondary",
    icon: Lock,
    className: "bg-muted text-muted-foreground",
  },
  STOPPED: {
    label: "Stopped",
    variant: "destructive",
    icon: StopCircle,
    className: "",
  },
};

export function PeriodStateBadge({ state, className = "" }: PeriodStateBadgeProps) {
  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={`gap-1 ${config.className} ${className}`}
      data-testid={`badge-state-${state.toLowerCase()}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
