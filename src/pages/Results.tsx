
import { ArrowLeft, Download, Share2, Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Results = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const billFile = location.state?.billFile;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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
      <div className="min-h-screen bg-neutral-10 flex flex-col items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-neutral-90">Analyzing Your Electricity Bill</h1>
          <p className="text-neutral-60">
            Please wait while our AI analyzes your bill to find potential savings.
            This may take a minute or two.
          </p>
          <div className="w-full bg-neutral-20 rounded-full h-2.5">
            <div className="bg-primary-60 h-2.5 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle the upload click
  const handleUploadClick = () => {
    navigate('/');
  };

  // Function to download PDF report
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    setIsDownloading(true);
    toast({
      title: "Preparing Download",
      description: "Generating your PDF report...",
    });

    try {
      // Create a PDF report element specially for the export
      const pdfReport = document.createElement('div');
      pdfReport.innerHTML = `
        <div style="font-family: 'Figtree', sans-serif; padding: 20px; width: 210mm;">
          <div style="background-color: #FFC926; padding: 10px 0; margin-bottom: 20px;">
            <h1 style="margin: 0; color: #091F5F; font-size: 22px; padding-left: 20px;">Electricity Bill Analysis Report</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #091F5F; margin-bottom: 15px;">Summary</h2>
            <div style="display: flex; margin-bottom: 15px;">
              <div style="flex: 1;"><strong>Consumer name</strong> - ${displayData.customerName}</div>
              <div style="flex: 1;"><strong>Bill month</strong> - ${displayData.billMonth}</div>
            </div>
            
            <div style="display: flex; gap: 20px;">
              <div style="flex: 1; background-color: #F5F5F5; padding: 15px; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #091F5F;">CURRENT BILL</h3>
                <div style="margin-bottom: 10px;">
                  <div style="color: #424249;">Current billed demand</div>
                  <div style="font-weight: bold; font-size: 18px;">${displayData.currentDemand} kW</div>
                </div>
                <div>
                  <div style="color: #424249;">Monthly bill</div>
                  <div style="font-weight: bold; font-size: 18px;">₹${displayData.currentBill.toFixed(2)}</div>
                </div>
              </div>
              
              <div style="flex: 1; background-color: #F5F5F5; padding: 15px; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #091F5F;">BILL AFTER RECOMMENDATIONS</h3>
                <div style="margin-bottom: 10px;">
                  <div style="color: #424249;">New billed demand</div>
                  <div style="font-weight: bold; font-size: 18px; display: flex; align-items: center;">
                    ${displayData.optimizedDemand} kW
                    <span style="color: #3AD66C; font-size: 14px; margin-left: 10px;">↓ 28.5%</span>
                  </div>
                </div>
                <div>
                  <div style="color: #424249;">New monthly bill</div>
                  <div style="font-weight: bold; font-size: 18px; display: flex; align-items: center;">
                    ₹${displayData.optimizedBill.toFixed(2)}
                    <span style="color: #3AD66C; font-size: 14px; margin-left: 10px;">↓ 12.2%</span>
                  </div>
                </div>
              </div>
              
              <div style="flex: 0.5; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #F5F5F5; padding: 15px; border-radius: 5px;">
                <div style="color: #424249; text-align: center; margin-bottom: 5px;">POTENTIAL SAVINGS</div>
                <div style="font-weight: bold; color: #3AD66C; font-size: 22px;">₹${displayData.savingsPerYear} lakhs/year</div>
              </div>
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #091F5F; margin-bottom: 15px;">Neufin's recommendations</h2>
            
            <div style="background-color: #F5F5F5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #091F5F;">Consumption and load management</h3>
              
              <div style="margin-bottom: 15px; display: flex;">
                <div style="width: 180px;">
                  <span style="color: ${displayData.recommendations.loadManagement.loadFactor.current < 0.5 ? '#E72C2C' : '#3AD66C'}; margin-right: 5px;">●</span>
                  <strong>Load factor</strong> = ${displayData.recommendations.loadManagement.loadFactor.current}
                </div>
                <div>
                  Reduce your contract demand as per your consumed units to achieve a <strong>load factor > ${displayData.recommendations.loadManagement.loadFactor.target}</strong> and get load factor incentives on your monthly bill
                </div>
              </div>
              
              <div style="margin-bottom: 15px; display: flex;">
                <div style="width: 180px;">
                  <span style="color: #3AD66C; margin-right: 5px;">●</span>
                  <strong>Power factor</strong> = ${displayData.recommendations.loadManagement.powerFactor.current}
                </div>
                <div>
                  Power factor is excellent. Maintain it at the same level to use minimum units for your operations.
                </div>
              </div>
              
              <div style="margin-bottom: 15px; display: flex;">
                <div style="width: 180px;">
                  <span style="color: ${displayData.recommendations.loadManagement.billedDemand.current > displayData.recommendations.loadManagement.billedDemand.max ? '#E72C2C' : '#3AD66C'}; margin-right: 5px;">●</span>
                  <strong>Billed demand</strong> = ${displayData.recommendations.loadManagement.billedDemand.current} kW
                </div>
                <div>
                  Your billed demand is higher than your maximum demand of ${displayData.recommendations.loadManagement.billedDemand.max} kW leading to extra demand charges of ₹${((displayData.recommendations.loadManagement.billedDemand.current - displayData.recommendations.loadManagement.billedDemand.max) * 0.33).toFixed(2)}k/month. Reduce your contract demand as per your maximum demand.
                </div>
              </div>
            </div>
            
            <div style="background-color: #F5F5F5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #091F5F;">Time of day (TOD) optimisation</h3>
              
              <div style="display: flex;">
                <div style="width: 180px;">
                  <span style="color: ${displayData.recommendations.todOptimization.isHigher ? '#E72C2C' : '#3AD66C'}; margin-right: 5px;">●</span>
                  <strong>TOD rebate</strong>
                </div>
                <div>
                  Your peak hour (zone D & C) consumption is higher than non-peak hour (zone A). Get a TOD rebate of ₹${displayData.recommendations.todOptimization.peakHourSavings}k by shifting more consumption to non peak hours
                </div>
              </div>
            </div>
            
            <div style="background-color: #F5F5F5; padding: 15px; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #091F5F;">Penalties and charges</h3>
              
              <div style="margin-bottom: 15px; display: flex;">
                <div style="width: 180px;">
                  <span style="color: #E72C2C; margin-right: 5px;">●</span>
                  <strong>Delayed payment charges</strong>
                </div>
                <div>
                  Pay your bill before due date every month to avoid delayed payment charge of ₹${displayData.recommendations.penalties.delayedPayment.toFixed(2)}/month
                </div>
              </div>
              
              <div style="margin-bottom: 15px; display: flex;">
                <div style="width: 180px;">
                  <span style="color: #3AD66C; margin-right: 5px;">●</span>
                  <strong>Prompt payment discount</strong>
                </div>
                <div>
                  Pay your bill before prompt payment date to avail a prompt payment discount of ₹${displayData.recommendations.penalties.promptDiscount.toFixed(2)}/month
                </div>
              </div>
              
              <div style="display: flex;">
                <div style="width: 180px;">
                  <span style="color: #3AD66C; margin-right: 5px;">●</span>
                  <strong>Principal arrears payment</strong>
                </div>
                <div>
                  ${displayData.recommendations.penalties.arrearsStatus}. Maintain it at zero to avoid incurring 18% interest on arrears.
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #63636B; margin-top: 40px;">
            <div>© NeuTo Technologies Private Limited 2025</div>
            <div style="display: flex; align-items: center;">
              <div style="height: 20px; width: 20px; background-color: #FFC926; margin-right: 5px;"></div>
              <strong style="color: #091F5F; font-size: 14px;">Neufin Energy</strong>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(pdfReport);
      
      // Set up PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Convert the div to canvas and then to PDF
      const canvas = await html2canvas(pdfReport, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      // Remove the temporary element
      document.body.removeChild(pdfReport);
      
      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`${displayData.customerName.replace(/\s+/g, '_')}_Bill_Analysis.pdf`);
      
      toast({
        title: "Download Complete",
        description: "Your PDF report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate the PDF report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-10">
      <Header onUploadClick={handleUploadClick} />
      <main className="container max-w-5xl mx-auto py-8 px-4 md:px-8 pt-24">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8" ref={reportRef}>
          <h1 className="text-3xl font-bold mb-2 text-neutral-90">{displayData.customerName}</h1>
          <p className="text-neutral-60 mb-6">Bill Analysis for {displayData.billMonth}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-success-10 to-success-20 border-success-20">
              <h3 className="text-lg font-medium mb-2 text-neutral-90">Annual Savings</h3>
              <p className="text-3xl font-bold text-success-30">₹{displayData.savingsPerYear}K</p>
              <p className="text-sm text-neutral-60 mt-1">Potential savings per year</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-2 text-neutral-90">Current Bill</h3>
              <p className="text-3xl font-bold text-neutral-90">₹{displayData.currentBill.toFixed(2)}K</p>
              <p className="text-sm text-neutral-60 mt-1">With {displayData.currentDemand}kVA demand</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary-10 to-primary-20 border-primary-20">
              <h3 className="text-lg font-medium mb-2 text-neutral-90">Optimized Bill</h3>
              <p className="text-3xl font-bold text-primary-60">₹{displayData.optimizedBill.toFixed(2)}K</p>
              <p className="text-sm text-neutral-60 mt-1">With {displayData.optimizedDemand}kVA demand</p>
            </Card>
          </div>

          <h2 className="text-xl font-bold mb-4 text-neutral-90">Detailed Recommendations</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-90">Load Management</h3>
              <div className="bg-neutral-10 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-60">Load Factor</p>
                    <p className="font-medium text-neutral-80">Current: {displayData.recommendations.loadManagement.loadFactor.current}</p>
                    <p className="font-medium text-primary-60">Target: {displayData.recommendations.loadManagement.loadFactor.target}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-60">Power Factor</p>
                    <p className="font-medium text-neutral-80">Current: {displayData.recommendations.loadManagement.powerFactor.current}</p>
                    <p className="font-medium text-success-30">Status: {displayData.recommendations.loadManagement.powerFactor.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-60">Billed Demand</p>
                    <p className="font-medium text-neutral-80">Current: {displayData.recommendations.loadManagement.billedDemand.current}kVA</p>
                    <p className="font-medium text-primary-60">Max Recorded: {displayData.recommendations.loadManagement.billedDemand.max}kVA</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-90">Time of Day (TOD) Optimization</h3>
              <div className="bg-neutral-10 p-4 rounded-lg">
                <p className="mb-2">Potential savings from peak hour optimization: ₹{displayData.recommendations.todOptimization.peakHourSavings}K per month</p>
                <p className="text-sm text-neutral-60">
                  {displayData.recommendations.todOptimization.isHigher 
                    ? "Your peak hour consumption is higher than optimal. Consider shifting loads to off-peak hours."
                    : "Your peak hour consumption is well managed."}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-90">Penalties & Discounts</h3>
              <div className="bg-neutral-10 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-60">Delayed Payment</p>
                    <p className="font-medium text-error-30">₹{displayData.recommendations.penalties.delayedPayment.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-60">Prompt Payment Discount</p>
                    <p className="font-medium text-success-30">₹{displayData.recommendations.penalties.promptDiscount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-60">Arrears Status</p>
                    <p className="font-medium text-neutral-80">{displayData.recommendations.penalties.arrearsStatus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary-10 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-neutral-90">Next Steps</h2>
          <p className="mb-4 text-neutral-70">Based on our analysis, we recommend scheduling a consultation with our experts to implement these optimization strategies.</p>
          <div className="flex flex-wrap gap-3">
            <Button 
              className="gap-2 bg-primary-60 hover:bg-primary-70"
              onClick={downloadPDF}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4" /> 
              {isDownloading ? "Preparing..." : "Download Full Report"}
            </Button>
            <Button variant="outline" className="gap-2 border-primary-60 text-primary-60 hover:bg-primary-10">
              <Share2 className="h-4 w-4" /> Share Results
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex gap-4">
            <Button variant="outline" size="icon" title="Share via Email" className="border-primary-60 text-primary-60 hover:bg-primary-10">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Share on LinkedIn" className="border-primary-60 text-primary-60 hover:bg-primary-10">
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
