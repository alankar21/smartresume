import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Your job is to analyze resumes against job descriptions and provide detailed, actionable feedback.

When analyzing a resume against a job description, you must:
1. Calculate an ATS score (0-100) based on keyword matching, skills alignment, and experience relevance
2. Identify matched skills that appear in both the resume and job description
3. Identify missing skills that are in the job description but not in the resume
4. Provide 3-5 prioritized improvement suggestions
5. Suggest 5 similar companies where this resume might be a good fit

Be specific, actionable, and encouraging. Focus on practical improvements.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, jobDescription, companyName } = await req.json();
    
    if (!resume || !jobDescription || !companyName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: resume, jobDescription, companyName" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    const userPrompt = `Analyze this resume against the job description for ${companyName}.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Provide your analysis using the analyze_resume function.`;

    console.log("Calling AI gateway for resume analysis...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_resume",
              description: "Returns structured resume analysis results",
              parameters: {
                type: "object",
                properties: {
                  atsScore: {
                    type: "number",
                    description: "ATS compatibility score from 0-100"
                  },
                  matchedSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Skills found in both resume and job description"
                  },
                  missingSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Important skills from job description missing in resume"
                  },
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        priority: { 
                          type: "string", 
                          enum: ["high", "medium", "low"] 
                        }
                      },
                      required: ["title", "description", "priority"]
                    },
                    description: "3-5 prioritized improvement suggestions"
                  },
                  topCompanies: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        company: { type: "string" },
                        position: { type: "string" },
                        location: { type: "string" },
                        score: { type: "number" },
                        matchedSkills: { type: "number" },
                        totalSkills: { type: "number" }
                      },
                      required: ["company", "position", "location", "score", "matchedSkills", "totalSkills"]
                    },
                    description: "Top 5 company matches based on resume"
                  }
                },
                required: ["atsScore", "matchedSkills", "missingSkills", "suggestions", "topCompanies"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_resume" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received:", JSON.stringify(data).slice(0, 200));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "analyze_resume") {
      console.error("Unexpected response format:", data);
      throw new Error("Invalid AI response format");
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    console.log("Analysis complete, ATS score:", analysisResult.atsScore);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-resume function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
