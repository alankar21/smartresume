import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

export function useResumeAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const analyzeResume = async (
    resume: string,
    jobDescription: string,
    companyName: string
  ): Promise<AnalysisResult | null> => {
    if (!resume.trim() || !jobDescription.trim() || !companyName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your resume, company name, and job description.",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resume, jobDescription, companyName },
      });

      if (error) {
        console.error("Analysis error:", error);
        throw new Error(error.message || "Failed to analyze resume");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      toast({
        title: "Analysis complete!",
        description: `Your ATS score for ${companyName} is ${data.atsScore}%`,
      });
      
      return data;
    } catch (error) {
      console.error("Resume analysis failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      if (errorMessage.includes("Rate limit")) {
        toast({
          title: "Too many requests",
          description: "Please wait a moment before trying again.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("credits")) {
        toast({
          title: "Credits exhausted",
          description: "Please add AI credits to continue using this feature.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setResults(null);
  };

  return {
    isAnalyzing,
    results,
    analyzeResume,
    clearResults,
  };
}
