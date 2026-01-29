import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink, ChevronRight } from "lucide-react";

interface GridItemRowProps {
  id: string;
  name: string;
  href: string;
  status?: { label: string; color: string };
  evidence?: { label: string; color: string };
  amount?: number;
  formatAmount?: (amount: number) => string;
  secondaryInfo?: string;
  owner?: string;
  level?: number;
  testId?: string;
}

export function GridItemRow({
  id,
  name,
  href,
  status,
  evidence,
  amount,
  formatAmount = (a) => a.toLocaleString(),
  secondaryInfo,
  owner,
  level = 1,
  testId,
}: GridItemRowProps) {
  const paddingLeft = level * 24;

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 hover-elevate transition-colors cursor-pointer border-b border-border/50 last:border-b-0"
        )}
        style={{ paddingLeft: `${paddingLeft + 32}px` }}
        data-testid={testId || `grid-item-${id}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{name}</span>
            {status && (
              <Badge 
                variant="outline" 
                className={cn("text-xs", status.color)}
              >
                {status.label}
              </Badge>
            )}
            {evidence && (
              <Badge 
                variant="outline" 
                className={cn("text-xs", evidence.color)}
              >
                {evidence.label}
              </Badge>
            )}
          </div>
          {secondaryInfo && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {secondaryInfo}
            </p>
          )}
        </div>
        
        {owner && (
          <div className="hidden md:block text-xs text-muted-foreground w-24 truncate">
            {owner}
          </div>
        )}
        
        {amount !== undefined && (
          <div className="text-right text-sm font-medium tabular-nums w-28">
            {formatAmount(amount)}
          </div>
        )}
        
        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </div>
    </Link>
  );
}
