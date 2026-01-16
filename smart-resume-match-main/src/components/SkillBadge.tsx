import { cn } from "@/lib/utils";
import { Check, X, AlertCircle } from "lucide-react";

interface SkillBadgeProps {
  skill: string;
  type: "matched" | "missing" | "suggested";
}

export function SkillBadge({ skill, type }: SkillBadgeProps) {
  const variants = {
    matched: "bg-success/10 text-success border-success/20",
    missing: "bg-destructive/10 text-destructive border-destructive/20",
    suggested: "bg-warning/10 text-warning border-warning/20",
  };

  const icons = {
    matched: <Check className="w-3 h-3" />,
    missing: <X className="w-3 h-3" />,
    suggested: <AlertCircle className="w-3 h-3" />,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border transition-all hover:scale-105",
        variants[type]
      )}
    >
      {icons[type]}
      {skill}
    </span>
  );
}
