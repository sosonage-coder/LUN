import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Building2,
  Calendar,
  User,
  Shield,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export type PivotView = 
  | "by-type" 
  | "by-entity" 
  | "by-period" 
  | "by-owner" 
  | "by-evidence"
  | "by-status"
  | "by-group"
  | "by-preparer"
  | "by-variance";

interface PivotOption {
  value: PivotView;
  label: string;
  icon: typeof LayoutGrid;
}

const scheduleStudioViews: PivotOption[] = [
  { value: "by-type", label: "By Type", icon: Layers },
  { value: "by-entity", label: "By Entity", icon: Building2 },
  { value: "by-period", label: "By Period", icon: Calendar },
  { value: "by-owner", label: "By Owner", icon: User },
  { value: "by-evidence", label: "By Evidence", icon: Shield },
];

const reconciliationViews: PivotOption[] = [
  { value: "by-type", label: "By Type", icon: Layers },
  { value: "by-group", label: "By Account Group", icon: LayoutGrid },
  { value: "by-status", label: "By Status", icon: CheckCircle2 },
  { value: "by-preparer", label: "By Preparer", icon: User },
  { value: "by-variance", label: "By Variance", icon: TrendingUp },
];

interface PivotViewSelectorProps {
  value: PivotView;
  onChange: (view: PivotView) => void;
  module: "schedules" | "reconciliations";
  className?: string;
}

export function PivotViewSelector({ value, onChange, module, className }: PivotViewSelectorProps) {
  const views = module === "schedules" ? scheduleStudioViews : reconciliationViews;

  return (
    <div className={cn("flex items-center gap-1 bg-muted/50 p-1 rounded-lg", className)} data-testid="pivot-view-selector">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = value === view.value;
        return (
          <Button
            key={view.value}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onChange(view.value)}
            className={cn(
              "gap-2 text-sm",
              isActive && "bg-background shadow-sm"
            )}
            data-testid={`pivot-view-${view.value}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{view.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
