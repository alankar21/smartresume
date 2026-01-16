import { useState } from "react";
import { Header } from "@/components/Header";
import { ResumeUpload } from "@/components/ResumeUpload";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import { useResumeAnalysis } from "@/hooks/useResumeAnalysis";

export default function Index() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  const { isAnalyzing, results, analyzeResume, clearResults } = useResumeAnalysis();

  const handleAnalyze = async () => {
    await analyzeResume(resumeText, jobDescription, companyName);
  };

  const canAnalyze = resumeText.trim() && jobDescription.trim() && companyName.trim();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Analysis
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
              Land Your Dream Job with{" "}
              <span className="gradient-text">SmartResume</span>
            </h1>
            <p className="text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: "100ms" }}>
              Get instant ATS score, identify skill gaps, and receive AI-powered suggestions
              to optimize your resume for any job description.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {[
              { icon: Zap, title: "Instant Analysis", desc: "Get results in seconds" },
              { icon: Target, title: "Skill Matching", desc: "Find gaps & strengths" },
              { icon: TrendingUp, title: "Top Companies", desc: "Best matches for you" }
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card/50 border border-border/50 text-center hover:shadow-card transition-shadow animate-scale-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {!results ? (
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Resume Upload */}
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg gradient-bg">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">Your Resume</h3>
                      <p className="text-sm text-muted-foreground">Upload or paste your resume content</p>
                    </div>
                  </div>
                  <ResumeUpload resumeText={resumeText} onResumeChange={setResumeText} />
                </div>

                {/* Job Description */}
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
                  <JobDescriptionInput
                    jobDescription={jobDescription}
                    companyName={companyName}
                    onJobDescriptionChange={setJobDescription}
                    onCompanyNameChange={setCompanyName}
                  />
                </div>
              </div>

              {/* Analyze Button */}
              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!canAnalyze || isAnalyzing}
                  className="gradient-bg text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-glow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing your resume...
                    </>
                  ) : (
                    <>
                      Analyze Resume
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                {!canAnalyze && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Please fill in your resume, company name, and job description to continue
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={clearResults}
                  className="gap-2"
                >
                  ← Start New Analysis
                </Button>
              </div>
              <AnalysisResults results={results} targetCompany={companyName} />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 SmartResume. AI-powered resume optimization for modern job seekers.</p>
        </div>
      </footer>
    </div>
  );
}
