
import { ArrowLeft, Download, Share2, Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Results = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const billFile = location.state?.billFile;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Default mockData as fallback
  const mockData = {
    customerName: "Hawkins Cookers Limited",
    billMonth: "January 2024",
    currentDemand: 975,
    currentBill: 35.37632,
    optimizedDemand: 696.3,
    optimizedBill: 31.05454,
    savingsPerYear: 52,
    recommendations: {
      loadManagement: {
        loadFactor: { current: 0.30, target: 0.75 },
        powerFactor: { current: 0.991, status: "excellent" },
        billedDemand: { current: 975, max: 933 }
      },
      todOptimization: {
        peakHourSavings: 2.34,
        isHigher: true
      },
      penalties: {
        delayedPayment: 44.250,
        promptDiscount: 32.337,
        arrearsStatus: "No major arrears found"
      }
    }
  };

  // Use the analyzed data or fall back to mock data
  const displayData = analysisData?.analysis || mockData;

  useEffect(() => {
    const analyzeBill = async () => {
      if (billFile?.path) {
        setIsAnalyzing(true);
        
        try {
          // Call the Supabase Edge Function to analyze the bill
          const { data, error } = await supabase.functions.invoke('analyze-bill', {
            body: { filePath: billFile.path }
          });
          
          if (error) {
            console.error('Error analyzing bill:', error);
            toast({
              title: "Analysis Error",
              description: "Failed to analyze your bill. Please try again.",
              variant: "destructive"
            });
            setIsAnalyzing(false);
            return;
          }
          
          // Successfully analyzed
          setAnalysisData(data);
          toast({
            title: "Analysis Complete",
            description: "Your electricity bill has been analyzed successfully.",
          });
        } catch (err) {
          console.error('Error in bill analysis:', err);
          toast({
            title: "Error",
            description: "An unexpected error occurred during analysis.",
            variant: "destructive"
          });
        } finally {
          setIsAnalyzing(false);
        }
      }
    };
    
    analyzeBill();
  }, [billFile, toast]);

  useEffect(() => {
    const saveBillSubmission = async () => {
      if (formData && billFile && !isAnalyzing && analysisData) {
        try {
          const analysisResult = analysisData.analysis;
          
          const { error } = await supabase
            .from('bill_submissions')
            .insert({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              potential_savings: 15, // From LeadForm's potentialSavings prop
              bill_file_path: billFile.path,
              customer_name: analysisResult.customerName || mockData.customerName,
              bill_month: analysisResult.billMonth || mockData.billMonth,
              current_demand: analysisResult.currentDemand || mockData.currentDemand,
              current_bill: analysisResult.currentBill || mockData.currentBill,
              optimized_demand: analysisResult.optimizedDemand || mockData.optimizedDemand,
              optimized_bill: analysisResult.optimizedBill || mockData.optimizedBill,
              savings_per_year: analysisResult.savingsPerYear || mockData.savingsPerYear
            });

          if (error) {
            console.error('Error saving submission:', error);
            toast({
              title: "Error",
              description: "Failed to save your submission. Please try again.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Success",
              description: "Your bill analysis has been saved successfully.",
            });
          }
        } catch (err) {
          console.error('Error in submission:', err);
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive"
          });
        }
      }
    };

    saveBillSubmission();
  }, [formData, billFile, toast, isAnalyzing, analysisData]);

  // Navigate back if no data is available
  useEffect(() => {
    if (!formData && !billFile) {
      navigate('/');
    }
  }, [formData, billFile, navigate]);

  // Loading state during analysis
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold">Analyzing Your Electricity Bill</h1>
          <p className="text-gray-600">
            Please wait while our AI analyzes your bill to find potential savings.
            This may take a minute or two.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onUploadClick={() => {