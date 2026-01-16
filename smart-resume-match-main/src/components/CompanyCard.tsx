import { Building2, TrendingUp, MapPin } from "lucide-react";
import { ScoreRing } from "./ui/score-ring";
import { cn } from "@/lib/utils";

interface CompanyCardProps {
  rank: number;
  company: string;
  position: string;
  location: string;
  score: number;
  matchedSkills: number;
  totalSkills: number;
}

export function CompanyCard({
  rank,
  company,
  position,
  location,
  score,
  matchedSkills,
  totalSkills,
}: CompanyCardProps) {
  return (
    <div
      className={cn(
        "group relative p-6 rounded-xl bg-card border border-border/50 shadow-card",
        "hover:shadow-card-hover hover:border-primary/20 transition-all duration-300",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${rank * 100}ms` }}
    >
      <div className="absolute top-4 left-4 w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
        <span className="text-sm font-bold text-primary-foreground">#{rank}</span>
      </div>
      
      <div className="flex items-start justify-between ml-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-display font-semibold text-lg">{company}</h3>
          </div>
          <p className="text-foreground/80 font-medium mb-2">{position}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {location}
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm">
              <span className="font-semibold text-primary">{matchedSkills}</span>
              <span className="text-muted-foreground">/{totalSkills} skills matched</span>
            </span>
          </div>
        </div>
        
        <ScoreRing score={score} size={80} strokeWidth={6} label="Match" />
      </div>
    </div>
  );
}
