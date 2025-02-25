
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface HeroProps {
  onUploadClick: () => void;
}

export const Hero = ({ onUploadClick }: HeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-secondary/30 pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                <Zap className="w-4 h-4 mr-1" />
                Smart Bill Analysis
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Discover Hidden Savings on Your Electricity Bill
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your electricity bill and get instant insights on potential savings. Our AI-powered analysis helps you reduce costs and optimize usage.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Button size="lg" className="rounded-full text-lg px-8 py-6" onClick={onUploadClick}>
              Upload Your Bill
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <ul className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Instant Analysis
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Detailed Recommendations
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Expert Support
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
