import { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ResumeUploadProps {
  onResumeChange: (text: string) => void;
  resumeText: string;
}

export function ResumeUpload({ onResumeChange, resumeText }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onResumeChange(text);
    };
    reader.readAsText(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFileName(null);
    onResumeChange("");
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          fileName && "border-success bg-success/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {fileName ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 text-success" />
            <div className="text-left">
              <p className="font-medium">{fileName}</p>
              <p className="text-sm text-muted-foreground">File uploaded successfully</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="ml-4"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className={cn(
              "w-12 h-12 mx-auto mb-4 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
            <p className="font-medium mb-1">Drop your resume here</p>
            <p className="text-sm text-muted-foreground">or click to browse (TXT, PDF, DOC)</p>
          </>
        )}
      </div>

      <div className="relative">
        <p className="text-sm font-medium mb-2 flex items-center gap-2">
          <span>Or paste your resume content</span>
          <span className="text-xs text-muted-foreground">(recommended for best results)</span>
        </p>
        <Textarea
          placeholder="Paste your resume text here..."
          value={resumeText}
          onChange={(e) => onResumeChange(e.target.value)}
          className="min-h-[200px] resize-none"
        />
      </div>
    </div>
  );
}
