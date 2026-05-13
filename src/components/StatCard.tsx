import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: number;
  trendText?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendText,
}: StatCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className="mt-1 text-xl font-bold text-card-foreground">
              {value}
            </p>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            )}

            {trend !== undefined && (
              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
                <span
                  className={`inline-flex items-center gap-0.5 ${isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-muted-foreground"}`}
                >
                  {isPositive ? "↑" : isNegative ? "↓" : "−"}
                  {Math.abs(trend)}%
                </span>
                {trendText && (
                  <span className="text-muted-foreground">{trendText}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
