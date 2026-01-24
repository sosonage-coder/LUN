import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  iconClassName = "",
  trend
}: StatCardProps) {
  return (
    <Card data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 pt-1">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-chart-2" : "text-destructive"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md bg-primary/10",
            iconClassName
          )}>
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
