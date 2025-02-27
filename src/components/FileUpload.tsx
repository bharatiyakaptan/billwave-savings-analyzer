
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onFileAccepted: (file: File, path: string) => void;
}

export const FileUpload = ({ isOpen, onClose, onFileAccepted }: FileUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("File size must be less than 25MB");
      return;
    }
    
    setError(null);
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = fileName;
      
      // Upload to Supabase Storage
      setUploadProgress(30);
      const { data, error: uploadError } = await supabase.storage
        .from('bill_uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        setError('Failed to upload file. Please try again.');
        setIsUploading(false);
        return;
      }
      
      setUploadProgress(90);
      
      // Call the callback with the uploaded file and path
      onFileAccepted(file, filePath);
      setUploadProgress(100);
      
      // Reset after a short delay
      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsUploading(false);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 25 * 1024 * 1024,
    multiple: false,
    disabled: isUploading
  });

  return (
    <Dialog open={isOpen} onOpenChange={() => !isUploading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Your Electricity Bill</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div
            {...getRootProps()}
            className={`
              relative rounded-lg border-2 border-dashed p-8 text-center hover:border-gray-400 transition-colors
              ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300"}
              ${error ? "border-red-500" : ""}
              ${isUploading ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className={`h-12 w-12 ${error ? "text-red-500" : "text-gray-400"}`} />
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium text-gray-900">
                  Drag and drop your electricity bill PDF
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
              <div className="text-xs text-gray-500">
                PDF format only, maximum 25MB
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-error">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-gray-500 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
