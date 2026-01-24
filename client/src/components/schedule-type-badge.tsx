import { Badge } from "@/components/ui/badge";
import type { ScheduleType } from "@shared/schema";
import { Receipt, Landmark } from "lucide-react";

interface ScheduleTypeBadgeProps {
  type: ScheduleType;
  className?: string;
}

const typeConfig: Record<ScheduleType, { 
  label: string; 
  icon: typeof Receipt;
  className: string;
}> = {
  PREPAID: {
    label: "Prepaid",
    icon: Receipt,
    className: "bg-chart-1/10 text-chart-1 border-chart-1/20 dark:bg-chart-1/20",
  },
  FIXED_ASSET: {
    label: "Fixed Asset",
    icon: Landmark,
    className: "bg-chart-3/10 text-chart-3 border-chart-3/20 dark:bg-chart-3/20",
  },
};

export function ScheduleTypeBadge({ type, className = "" }: ScheduleTypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`gap-1 ${config.className} ${className}`}
      data-testid={`badge-type-${type.toLowerCase()}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
