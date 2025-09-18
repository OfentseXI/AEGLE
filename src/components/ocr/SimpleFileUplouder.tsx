import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUp, X } from "lucide-react";

interface SimpleFileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
}

export function SimpleFileUploader({
  onFilesSelected,
  selectedFiles,
}: SimpleFileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected([...selectedFiles, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload">Upload Documents</Label>
        <div
          className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium">Click to upload or drag and drop</p>
            <p className="text-xs">PDF, PNG, JPG, or JPEG up to 50MB</p>
          </div>
          <Input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,application/pdf"
            onChange={handleFileChange}
            multiple
          />
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files ({selectedFiles.length})</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded"
              >
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
