
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, X, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onFileAccepted: (file: File) => void;
}

export const FileUpload = ({ isOpen, onClose, onFileAccepted }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file type
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file less than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Generate a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `bill_uploads/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('bill_uploads')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Add path to the file object
      const fileWithPath = Object.assign(selectedFile, { path: filePath });
      
      // Call onFileAccepted with the file object
      onFileAccepted(fileWithPath);
      
      toast({
        title: "Success!",
        description: "Your bill has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload your bill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Your Bill</DialogTitle>
          <DialogDescription>
            Upload your PDF electricity bill to analyze potential savings.
          </DialogDescription>
        </DialogHeader>
        
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200 ease-in-out
              ${isDragActive ? 'border-primary bg-primary-10' : 'border-neutral-30 hover:border-primary-50'}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-8 w-8 text-neutral-50" />
              <div>
                <p className="text-sm text-neutral-70 mb-1">
                  <span className="font-semibold text-primary-60">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-neutral-60">
                  PDF files only (max 5MB)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-10 p-2 rounded">
                  <FileText className="h-5 w-5 text-primary-60" />
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[180px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-neutral-60">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetSelection}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="relative"
          >
            {isUploading ? 'Uploading...' : 'Upload Bill'}
            {isUploading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
