
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "./ui/progress";

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: "Uploading",
    description: "Securely uploading your bill",
  },
  {
    title: "Processing",
    description: "Extracting bill information",
  },
  {
    title: "Analyzing",
    description: "Identifying savings opportunities",
  },
  {
    title: "Finalizing",
    description: "Preparing your report",
  },
];

interface AnalysisProgressProps {
  currentStep: number;
  progress: number;
}

export const AnalysisProgress = ({ currentStep, progress }: AnalysisProgressProps) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900"
          >
            Analyzing Your Bill
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            Please wait while we analyze your electricity bill to find potential savings
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Progress value={progress} className="h-2" />
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`flex items-start gap-4 transition-opacity duration-300
                  ${index > currentStep ? "opacity-50" : "opacity-100"}
                `}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                ) : index === currentStep ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Circle className="h-6 w-6 text-primary flex-shrink-0" />
                  </motion.div>
                ) : (
                  <Circle className="h-6 w-6 text-gray-300 flex-shrink-0" />
                )}
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
