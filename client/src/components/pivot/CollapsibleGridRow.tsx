import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CollapsibleGridRowProps {
  title: string;
  icon?: React.ReactNode;
  count: number;
  completedCount?: number;
  totalAmount?: number;
  formatAmount?: (amount: number) => string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  level?: number;
  statusBadges?: { label: string; count: number; color: string }[];
  testId?: string;
}

export function CollapsibleGridRow({
  title,
  icon,
  count,
  completedCount,
  totalAmount,
  formatAmount = (a) => a.toLocaleString(),
  children,
  defaultOpen = false,
  level = 0,
  statusBadges,
  testId,
}: CollapsibleGridRowProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const completionPercent = completedCount !== undefined && count > 0 
    ? Math.round((completedCount / count) * 100) 
    : undefined;

  const paddingLeft = level * 24;

  return (
    <div className="border-b last:border-b-0" data-testid={testId}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 hover-elevate transition-colors text-left",
          isOpen && "bg-muted/30"
        )}
        style={{ paddingLeft: `${paddingLeft + 16}px` }}
        data-testid={testId ? `${testId}-toggle` : undefined}
      >
        <div className="flex-shrink-0 text-muted-foreground">
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium truncate">{title}</span>
            <Badge variant="secondary" className="text-xs">
              {count} {count === 1 ? "item" : "items"}
            </Badge>
          </div>
        </div>
        
        {statusBadges && statusBadges.length > 0 && (
          <div className="hidden md:flex items-center gap-2">
            {statusBadges.map((badge) => (
              <Badge
                key={badge.label}
                variant="outline"
                className={cn("text-xs", badge.color)}
              >
                {badge.count} {badge.label}
              </Badge>
            ))}
          </div>
        )}
        
        {completionPercent !== undefined && (
          <div className="hidden sm:flex items-center gap-2 w-32">
            <Progress value={completionPercent} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground w-10 text-right">
              {completionPercent}%
            </span>
          </div>
        )}
        
        {totalAmount !== undefined && (
          <div className="text-right text-sm font-medium tabular-nums w-28">
            {formatAmount(totalAmount)}
          </div>
        )}
      </button>
      
      {isOpen && (
        <div className="bg-muted/10" data-testid={testId ? `${testId}-content` : undefined}>
          {children}
        </div>
      )}
    </div>
  );
}
