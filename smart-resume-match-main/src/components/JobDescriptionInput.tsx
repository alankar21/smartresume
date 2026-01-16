import { Briefcase } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

interface JobDescriptionInputProps {
  jobDescription: string;
  companyName: string;
  onJobDescriptionChange: (text: string) => void;
  onCompanyNameChange: (name: string) => void;
}

export function JobDescriptionInput({
  jobDescription,
  companyName,
  onJobDescriptionChange,
  onCompanyNameChange,
}: JobDescriptionInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg gradient-bg">
          <Briefcase className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold">Target Job</h3>
          <p className="text-sm text-muted-foreground">Paste the job description you're applying for</p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Company Name</label>
        <Input
          placeholder="e.g., Google, Microsoft, Amazon..."
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Job Description</label>
        <Textarea
          placeholder="Paste the complete job description here including requirements, responsibilities, and qualifications..."
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          className="min-h-[250px] resize-none"
        />
      </div>
    </div>
  );
}
