
import { ArrowLeft, Download, Share2, Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Results = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onUploadClick={() => {}} />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title Bar */}
          <div className="bg-yellow-400 -mx-4 px-4 py-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Electricity Bill Analysis Report
            </h1>
          </div>

          {/* Summary Section */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Consumer name</p>
                <p className="font-medium">{mockData.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bill month</p>
                <p className="font-medium">{mockData.billMonth}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">CURRENT BILL</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Current billed demand</p>
                    <p className="text-xl font-bold">{mockData.currentDemand} kW</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly bill</p>
                    <p className="text-xl font-bold">₹{mockData.currentBill.toFixed(3)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">BILL AFTER RECOMMENDATIONS</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">New billed demand</p>
                    <p className="text-xl font-bold text-green-600">
                      {mockData.optimizedDemand} kW
                      <span className="text-sm ml-2 text-green-500">-28.5%</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">New monthly bill</p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{mockData.optimizedBill.toFixed(3)}
                      <span className="text-sm ml-2 text-green-500">-12.2%</span>
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-center text-lg">
                <span className="font-semibold">POTENTIAL SAVINGS:</span>
                <span className="text-green-600 font-bold ml-2">₹{mockData.savingsPerYear} lakhs/year</span>
              </p>
            </div>
          </section>

          {/* Recommendations Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Neufin's recommendations</h2>
            
            {/* Load Management */}
            <Card className="p-6">
              <h3 className="font-semibold mb-6">Consumption and load management</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-red-500">●</span>
                  <div>
                    <p className="font-medium">Load factor = ~30%</p>
                    <p className="text-sm text-gray-600">
                      Reduce your contract demand as per your consumed units to achieve a load factor >75% and get
                      load factor incentives on your monthly bill
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-green-500">●</span>
                  <div>
                    <p className="font-medium">Power factor = 0.991</p>
                    <p className="text-sm text-gray-600">
                      Power factor is excellent. Maintain it at the same level to use minimum units for your operations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-red-500">●</span>
                  <div>
                    <p className="font-medium">Billed demand = 975 kW</p>
                    <p className="text-sm text-gray-600">
                      Your billed demand is higher than your maximum demand of 933 kW leading to extra demand
                      charges of ₹1,93,006/month. Reduce your contract demand as per your maximum demand.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* TOD Optimization */}
            <Card className="p-6">
              <h3 className="font-semibold mb-6">Time of day (TOD) optimisation</h3>
              <div className="flex items-start gap-4">
                <span className="text-red-500">●</span>
                <div>
                  <p className="font-medium">TOD rebate</p>
                  <p className="text-sm text-gray-600">
                    Your peak hour (zone D & C) consumption is higher than non-peak hour (zone A). Get a TOD
                    rebate of ₹2,34,949 by shifting more consumption to non peak hours.
                  </p>
                </div>
              </div>
            </Card>

            {/* Penalties and Charges */}
            <Card className="p-6">
              <h3 className="font-semibold mb-6">Penalties and charges</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-red-500">●</span>
                  <div>
                    <p className="font-medium">Delayed payment charges</p>
                    <p className="text-sm text-gray-600">
                      Pay your bill before due date every month to avoid delayed payment charge of ₹44,250/month
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-green-500">●</span>
                  <div>
                    <p className="font-medium">Prompt payment discount</p>
                    <p className="text-sm text-gray-600">
                      Pay your bill before prompt payment date to avail a prompt payment discount of ₹32,337/month
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-green-500">●</span>
                  <div>
                    <p className="font-medium">Principal arrears payment</p>
                    <p className="text-sm text-gray-600">
                      No major arrears found in your bill. Maintain it at zero to avoid incurring 18% interest on arrears
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Report
            </Button>
          </div>

          {/* Logo and Copyright */}
          <div className="flex justify-between items-center pt-8 border-t">
            <p className="text-sm text-gray-600">
              © NeuTo Technologies Private Limited 2025
            </p>
            <img src="/lovable-uploads/73429c11-5b4e-4a37-a2ed-c5598c035cef.png" 
                 alt="Neufin Energy Logo" 
                 className="h-8" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
