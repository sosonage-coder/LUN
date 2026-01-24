import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  className?: string;
  showSign?: boolean;
  compact?: boolean;
}

export function CurrencyDisplay({ 
  amount, 
  currency, 
  className = "",
  showSign = false,
  compact = false
}: CurrencyDisplayProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: compact ? 'compact' : 'standard',
  });

  const formatted = formatter.format(Math.abs(amount));
  const isNegative = amount < 0;
  const isPositive = amount > 0;

  return (
    <span 
      className={cn(
        "font-mono tabular-nums",
        isNegative && "text-destructive",
        showSign && isPositive && "text-chart-2",
        className
      )}
      data-testid="currency-display"
    >
      {showSign && isPositive && "+"}
      {isNegative && "-"}
      {formatted}
    </span>
  );
}

interface FxDisplayProps {
  fx: number;
  localCurrency: string;
  reportingCurrency: string;
  className?: string;
}

export function FxDisplay({ 
  fx, 
  localCurrency, 
  reportingCurrency, 
  className = "" 
}: FxDisplayProps) {
  return (
    <span 
      className={cn("font-mono text-xs text-muted-foreground tabular-nums", className)}
      data-testid="fx-display"
    >
      1 {localCurrency} = {fx.toFixed(6)} {reportingCurrency}
    </span>
  );
}
