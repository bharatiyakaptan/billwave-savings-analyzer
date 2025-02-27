
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
      <Header />
      <main className="container max-w-5xl mx-auto py-8 px-4 md:px-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">{displayData.customerName}</h1>
          <p className="text-gray-500 mb-6">Bill Analysis for {displayData.billMonth}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
              <h3 className="text-lg font-medium mb-2">Annual Savings</h3>
              <p className="text-3xl font-bold text-green-600">₹{displayData.savingsPerYear}K</p>
              <p className="text-sm text-gray-500 mt-1">Potential savings per year</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-2">Current Bill</h3>
              <p className="text-3xl font-bold">₹{displayData.currentBill.toFixed(2)}K</p>
              <p className="text-sm text-gray-500 mt-1">With {displayData.currentDemand}kVA demand</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <h3 className="text-lg font-medium mb-2">Optimized Bill</h3>
              <p className="text-3xl font-bold text-blue-600">₹{displayData.optimizedBill.toFixed(2)}K</p>
              <p className="text-sm text-gray-500 mt-1">With {displayData.optimizedDemand}kVA demand</p>
            </Card>
          </div>

          <h2 className="text-xl font-bold mb-4">Detailed Recommendations</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Load Management</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Load Factor</p>
                    <p className="font-medium">Current: {displayData.recommendations.loadManagement.loadFactor.current}</p>
                    <p className="font-medium text-blue-600">Target: {displayData.recommendations.loadManagement.loadFactor.target}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Power Factor</p>
                    <p className="font-medium">Current: {displayData.recommendations.loadManagement.powerFactor.current}</p>
                    <p className="font-medium text-green-600">Status: {displayData.recommendations.loadManagement.powerFactor.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Billed Demand</p>
                    <p className="font-medium">Current: {displayData.recommendations.loadManagement.billedDemand.current}kVA</p>
                    <p className="font-medium text-blue-600">Max Recorded: {displayData.recommendations.loadManagement.billedDemand.max}kVA</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Time of Day (TOD) Optimization</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">Potential savings from peak hour optimization: ₹{displayData.recommendations.todOptimization.peakHourSavings}K per month</p>
                <p className="text-sm text-gray-600">
                  {displayData.recommendations.todOptimization.isHigher 
                    ? "Your peak hour consumption is higher than optimal. Consider shifting loads to off-peak hours."
                    : "Your peak hour consumption is well managed."}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Penalties & Discounts</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delayed Payment</p>
                    <p className="font-medium text-red-600">₹{displayData.recommendations.penalties.delayedPayment.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prompt Payment Discount</p>
                    <p className="font-medium text-green-600">₹{displayData.recommendations.penalties.promptDiscount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Arrears Status</p>
                    <p className="font-medium">{displayData.recommendations.penalties.arrearsStatus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Next Steps</h2>
          <p className="mb-4">Based on our analysis, we recommend scheduling a consultation with our experts to implement these optimization strategies.</p>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2">
              <Download className="h-4 w-4" /> Download Full Report
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> Share Results
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex gap-4">
            <Button variant="outline" size="icon" title="Share via Email">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Share on LinkedIn">
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
