import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICard {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "default" | "success" | "warning" | "danger" | "muted";
  icon?: React.ReactNode;
}

interface DashboardKPICardsProps {
  cards: KPICard[];
  columns?: 2 | 3 | 4 | 5 | 6;
  testIdPrefix?: string;
}

const colorClasses: Record<string, string> = {
  default: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
  muted: "text-muted-foreground",
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

export function DashboardKPICards({ cards, columns = 4, testIdPrefix = "kpi" }: DashboardKPICardsProps) {
  const gridClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  }[columns];

  return (
    <div className={cn("grid gap-4", gridClass)} data-testid={`${testIdPrefix}-cards`}>
      {cards.map((card, index) => {
        const TrendIcon = card.trend ? trendIcons[card.trend] : null;
        const testId = `${testIdPrefix}-${card.title.toLowerCase().replace(/\s+/g, "-")}`;
        
        return (
          <Card key={index} data-testid={testId}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              {card.icon && (
                <div className="text-muted-foreground">
                  {card.icon}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div 
                  className={cn("text-2xl font-bold", colorClasses[card.color || "default"])}
                  data-testid={`${testId}-value`}
                >
                  {card.value}
                </div>
                {card.trend && TrendIcon && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    card.trend === "up" && "text-emerald-600",
                    card.trend === "down" && "text-red-600",
                    card.trend === "neutral" && "text-muted-foreground"
                  )}>
                    <TrendIcon className="h-3 w-3" />
                    {card.trendValue}
                  </div>
                )}
              </div>
              {card.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
