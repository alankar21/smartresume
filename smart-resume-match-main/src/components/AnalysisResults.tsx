import { ScoreRing } from "./ui/score-ring";
import { SkillBadge } from "./SkillBadge";
import { CompanyCard } from "./CompanyCard";
import { SuggestionCard } from "./SuggestionCard";
import { FileText, Target, TrendingUp, Lightbulb, Building2 } from "lucide-react";

interface AnalysisResult {
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  topCompanies: Array<{
    company: string;
    position: string;
    location: string;
    score: number;
    matchedSkills: number;
    totalSkills: number;
  }>;
}

interface AnalysisResultsProps {
  results: AnalysisResult;
  targetCompany: string;
}

export function AnalysisResults({ results, targetCompany }: AnalysisResultsProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Score Section */}
      <div className="relative p-8 rounded-2xl bg-card border border-border/50 shadow-card overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 gradient-bg opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <ScoreRing score={results.atsScore} size={160} strokeWidth={12} label="ATS Score" />
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display text-2xl font-bold mb-2">
              Resume Analysis for{" "}
              <span className="gradient-text">{targetCompany}</span>
            </h2>
            <p className="text-muted-foreground max-w-lg">
              {results.atsScore >= 80
                ? "Excellent match! Your resume is well-optimized for this position."
                : results.atsScore >= 60
                ? "Good match with room for improvement. Review the suggestions below."
                : "Consider updating your resume to better match this role."}
            </p>
            
            <div className="flex flex-wrap gap-6 mt-6 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{results.matchedSkills.length}</p>
                  <p className="text-xs text-muted-foreground">Skills Matched</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{results.missingSkills.length}</p>
                  <p className="text-xs text-muted-foreground">Skills to Add</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success/10">
              <Target className="w-5 h-5 text-success" />
            </div>
            <h3 className="font-display font-semibold">Matched Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.matchedSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} type="matched" />
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-destructive/10">
              <FileText className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="font-display font-semibold">Missing Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.missingSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} type="missing" />
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="p-6 rounded-xl bg-card border border-border/50 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg gradient-bg">
            <Lightbulb className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold">Improvement Suggestions</h3>
            <p className="text-sm text-muted-foreground">Actionable tips to boost your ATS score</p>
          </div>
        </div>
        <div className="space-y-4">
          {results.suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={index}
              index={index}
              title={suggestion.title}
              description={suggestion.description}
              priority={suggestion.priority}
            />
          ))}
        </div>
      </div>

      {/* Top Company Matches */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg gradient-bg">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-xl">Top 5 Company Matches</h3>
            <p className="text-sm text-muted-foreground">Based on your resume's ATS compatibility</p>
          </div>
        </div>
        <div className="grid gap-4">
          {results.topCompanies.map((company, index) => (
            <CompanyCard
              key={company.company}
              rank={index + 1}
              company={company.company}
              position={company.position}
              location={company.location}
              score={company.score}
              matchedSkills={company.matchedSkills}
              totalSkills={company.totalSkills}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
