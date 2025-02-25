
import { ArrowLeft, Download, Share2, Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Results = () => {
  const mockData = {
    customerName: "John Doe",
    billMonth: "March 2024",
    currentBill: 250.00,
    optimizedBill: 212.50,
    savings: 15,
    annualSavings: 450,
    recommendations: {
      loadManagement: [
        "Shift heavy machinery usage to off-peak hours",
        "Implement automated load scheduling",
        "Install power factor correction equipment"
      ],
      timeOfDay: [
        "Reduce consumption during peak hours (2 PM - 6 PM)",
        "Schedule energy-intensive tasks for early morning",
        "Consider time-of-use rate plans"
      ],
      penalties: [
        "Set up auto-pay to avoid late payment charges",
        "Maintain minimum power factor to avoid penalties",
        "Monitor maximum demand regularly"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Electricity Bill Analysis Report
            </h1>
            <p className="text-gray-600">
              For {mockData.customerName} - {mockData.billMonth}
            </p>
          </div>

          {/* Summary Card */}
          <Card className="p-6 bg-white shadow-sm">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Summary</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Current Bill</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${mockData.currentBill.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Optimized Bill</p>
                  <p className="text-2xl font-semibold text-success">
                    ${mockData.optimizedBill.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-center text-lg">
                  Potential Annual Savings: <span className="font-bold text-success">${mockData.annualSavings}</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Recommendations</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Load Management</h3>
                <ul className="space-y-3">
                  {mockData.recommendations.loadManagement.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-sm text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Time of Day Usage</h3>
                <ul className="space-y-3">
                  {mockData.recommendations.timeOfDay.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-sm text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Penalties & Charges</h3>
                <ul className="space-y-3">
                  {mockData.recommendations.penalties.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-sm text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share via Message
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Share via Email
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              Share on LinkedIn
            </Button>
          </div>

          {/* Expert Consultation */}
          <Card className="p-6 bg-primary/5 border-primary">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Maximize Your Savings with Expert Guidance</h3>
              <p className="text-gray-600">
                Get personalized support to implement these recommendations and unlock even more savings.
              </p>
              <Button className="w-full md:w-auto">
                Schedule a Free Consultation
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Results;
