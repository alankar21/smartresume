import { Lightbulb, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionCardProps {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  index: number;
}

export function SuggestionCard({ title, description, priority, index }: SuggestionCardProps) {
  const priorityColors = {
    high: "border-l-destructive bg-destructive/5",
    medium: "border-l-warning bg-warning/5",
    low: "border-l-primary bg-primary/5",
  };

  const priorityLabels = {
    high: "High Impact",
    medium: "Medium Impact",
    low: "Quick Win",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-lg border border-border/50 border-l-4 transition-all hover:shadow-card",
        priorityColors[priority],
        "animate-slide-up"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-card">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">{title}</h4>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              priority === "high" && "bg-destructive/10 text-destructive",
              priority === "medium" && "bg-warning/10 text-warning",
              priority === "low" && "bg-primary/10 text-primary"
            )}>
              {priorityLabels[priority]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
