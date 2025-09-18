import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  Zap,
  File,
  AlertTriangle,
} from "lucide-react";
import { OCRResult } from "@/lib/enhanced-ocr-utils";
import { CombinedOCRService } from "@/lib/combined-ocr-service";

interface GoogleVisionOCRProps {
  onResults: (results: OCRResult[]) => void;
}

export function GoogleVisionOCR({ onResults }: GoogleVisionOCRProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [apiQuotaWarning, setApiQuotaWarning] = useState<boolean>(false);

  const ocrService = new CombinedOCRService();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const supportedFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isPDF = file.type === "application/pdf";
      return isImage || isPDF;
    });

    if (supportedFiles.length !== files.length) {
      setError(
        "Some files were skipped. Only image files (JPG, PNG, etc.) and PDFs are supported."
      );
    } else {
      setError(null);
    }

    setSelectedFiles(supportedFiles);
    setApiQuotaWarning(false);
  };

  const getOptimalOCRStrategy = (file: File): string => {
    const fileSize = file.size / (1024 * 1024); // MB

    if (file.type === "application/pdf") {
      return apiQuotaWarning
        ? "⚠️ PDF Processing with Tesseract.js (Google Vision unavailable)"
        : "🚀 PDF Native Processing with Google Vision API (Multi-page support)";
    }

    if (fileSize > 5) {
      return apiQuotaWarning
        ? "Large image - Tesseract.js processing"
        : "Large image - Google Vision API with Tesseract fallback";
    }

    return apiQuotaWarning
      ? "Tesseract.js processing (offline OCR)"
      : "Google Vision API (High Accuracy) with Tesseract fallback";
  };

  const processFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setApiQuotaWarning(false);
    setProcessingStatus("Initializing enhanced OCR processing...");
    const results: OCRResult[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileType = file.type === "application/pdf" ? "PDF" : "Image";
        setProcessingStatus(
          `Processing ${fileType} ${i + 1}/${selectedFiles.length}: ${
            file.name
          }`
        );

        console.log(`Processing file: ${file.name} (${file.type})`);

        try {
          const result = await ocrService.processFile(file);

          results.push({
            ...result,
            fileName: file.name,
            fileSize: file.size,
            lastModified: file.lastModified,
          });

          console.log(`Successfully processed: ${file.name}`);
          setProcessingStatus(
            `✓ Successfully processed: ${file.name} (${fileType})`
          );
        } catch (fileError) {
          console.error(`Error processing ${file.name}:`, fileError);

          // Check if it's a Google Vision API quota error
          if (fileError instanceof Error && fileError.message.includes("403")) {
            setApiQuotaWarning(true);
            setError(
              `Google Vision API quota exceeded. File "${file.name}" was processed with Tesseract.js (lower accuracy). Consider upgrading your Google Cloud billing plan for better results.`
            );
          } else if (
            fileError instanceof Error &&
            fileError.message.includes("429")
          ) {
            setApiQuotaWarning(true);
            setError(
              `Google Vision API rate limit reached. File "${file.name}" was processed with Tesseract.js. Please try again later.`
            );
          } else {
            setError(
              `Failed to process ${file.name}: ${
                fileError instanceof Error ? fileError.message : "Unknown error"
              }`
            );
          }
        }
      }

      if (results.length > 0) {
        setProcessingStatus(
          `✓ Successfully processed ${results.length} file${
            results.length > 1 ? "s" : ""
          }`
        );
        onResults(results);
      } else {
        setProcessingStatus("No files were successfully processed");
      }
    } catch (err) {
      console.error("OCR processing failed:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setProcessingStatus("Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Enhanced OCR with Google Vision API
        </CardTitle>
        <CardDescription>
          🚀 Now with PDF support! Google Cloud Vision API for superior accuracy
          with automatic fallback to Tesseract.js.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {apiQuotaWarning && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Google Vision API quota exceeded. Processing will continue with
              Tesseract.js (offline OCR) which may have lower accuracy for
              complex documents.
            </AlertDescription>
          </Alert>
        )}

        {processingStatus && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{processingStatus}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span>{" "}
                  receipts & PDFs
                </p>
                <p className="text-xs text-gray-500">
                  Images (PNG, JPG, GIF) & PDF files up to 10MB each
                </p>
              </div>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Selected Files & Processing Strategy:
              </h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1 p-2 bg-gray-50 rounded text-sm"
                  >
                    <div className="flex items-center gap-2 text-gray-800">
                      {file.type === "application/pdf" ? (
                        <File className="h-4 w-4 text-red-500" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span className="font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      {file.type === "application/pdf" && (
                        <span className="text-xs bg-red-100 text-red-700 px-1 rounded">
                          PDF
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-xs ml-6 flex items-center gap-1 ${
                        apiQuotaWarning ? "text-orange-600" : "text-green-600"
                      }`}
                    >
                      {apiQuotaWarning ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : (
                        <Zap className="h-3 w-3" />
                      )}
                      {getOptimalOCRStrategy(file)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={processFiles}
                  className={
                    apiQuotaWarning
                      ? "flex-1 bg-orange-600 hover:bg-orange-700"
                      : "flex-1 bg-green-600 hover:bg-green-700"
                  }
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {apiQuotaWarning ? (
                        <AlertTriangle className="mr-2 h-4 w-4" />
                      ) : (
                        <Zap className="mr-2 h-4 w-4" />
                      )}
                      {apiQuotaWarning
                        ? "Process with Tesseract.js"
                        : "Process with Google Vision API"}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFiles([]);
                    setError(null);
                    setProcessingStatus("");
                    setApiQuotaWarning(false);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <div
            className={`text-xs p-3 rounded border-l-4 ${
              apiQuotaWarning
                ? "text-gray-500 bg-orange-50 border-orange-400"
                : "text-gray-500 bg-green-50 border-green-400"
            }`}
          >
            {apiQuotaWarning ? (
              <>
                <p>
                  <strong>⚠️ Using Tesseract.js Fallback:</strong>
                </p>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Offline OCR processing (no API calls)</li>
                  <li>
                    Works with images only (PDFs may have limited support)
                  </li>
                  <li>Lower accuracy for complex documents</li>
                  <li>Best for clear, high-contrast images</li>
                </ul>
              </>
            ) : (
              <>
                <p>
                  <strong>🚀 Google Vision API Active with PDF Support:</strong>
                </p>
                <ul className="mt-1 ml-4 list-disc">
                  <li>✅ Native PDF processing (multi-page documents)</li>
                  <li>
                    Superior accuracy for receipt and invoice text recognition
                  </li>
                  <li>Enhanced number and currency detection</li>
                  <li>
                    Better handling of poor quality images and scanned documents
                  </li>
                  <li>Automatic fallback to Tesseract.js if needed</li>
                  <li>Optimized for long receipts and complex layouts</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
