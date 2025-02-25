
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-xl font-semibold text-gray-900">
            BillSmart
          </a>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
            How It Works
          </a>
          <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">
            Benefits
          </a>
          <Button variant="default" size="sm">
            Upload Bill
          </Button>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};
