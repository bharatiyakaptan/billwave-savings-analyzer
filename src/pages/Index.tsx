
import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { LeadForm } from "@/components/LeadForm";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const { toast } = useToast();

  const handleFileAccepted = (file: File) => {
    setIsUploadOpen(false);
    setIsAnalyzing(true);
    simulateAnalysis();
  };

  const simulateAnalysis = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setAnalysisProgress(progress);
      
      if (progress === 25) setAnalysisStep(1);
      if (progress === 50) setAnalysisStep(2);
      if (progress === 75) setAnalysisStep(3);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsAnalyzing(false);
        setIsLeadFormOpen(true);
      }
    }, 100);
  };

  const handleLeadSubmit = (data: any) => {
    console.log("Lead data:", data);
    setIsLeadFormOpen(false);
    toast({
      title: "Success!",
      description: "Your savings report is being generated. We'll send it to your email shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Footer />

      <FileUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onFileAccepted={handleFileAccepted}
      />

      {isAnalyzing && (
        <AnalysisProgress
          currentStep={analysisStep}
          progress={analysisProgress}
        />
      )}

      <LeadForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        onSubmit={handleLeadSubmit}
        potentialSavings={15}
      />
    </div>
  );
};

export default Index;
