import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SimpleCameraCapture } from "./SimpleCameraCapture";
import { SimpleResultDisplay } from "./SimpleResultDisplay";
import { SimpleManualEntry } from "./SimpleManualEntry";
import { SimpleOCRSettings } from "./SimpleOCRSettings";
import { GoogleVisionOCR } from "./GoogleVisionOCR";
import { OCRResult } from "@/lib/enhanced-ocr-utils";
import { Camera, Upload, FileText, Settings } from "lucide-react";

export function OCRProcessor() {
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("upload");

  const handleOCRResults = useCallback((results: OCRResult[]) => {
    setOcrResults((prev) => [...prev, ...results]);
    setError(null);
    if (results.length > 0) {
      setCurrentTab("results");
    }
  }, []);

  const handleCameraCapture = useCallback(
    (file: File) => {
      // Convert camera capture to OCR result format
      const processFile = async () => {
        try {
          const { createWorker } = await import("tesseract.js");
          const worker = await createWorker();

          await worker.loadLanguage("eng");
          await worker.initialize("eng");

          const imageUrl = URL.createObjectURL(file);
          const { data } = await worker.recognize(imageUrl);

          const result: OCRResult = {
            text: data.text,
            confidence: data.confidence,
            total: 0,
            vendor: "Camera Capture",
            processedText: data.text,
            fileName: file.name,
            fileSize: file.size,
            lastModified: file.lastModified,
          };

          handleOCRResults([result]);

          await worker.terminate();
          URL.revokeObjectURL(imageUrl);
        } catch (err) {
          console.error("Camera OCR processing failed:", err);
          setError("Failed to process camera image");
        }
      };

      processFile();
    },
    [handleOCRResults]
  );

  const clearResults = () => {
    setOcrResults([]);
    setError(null);
  };

  const hasResults = ocrResults.length > 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Enhanced OCR Document Processor
          </h1>
          <p className="text-gray-600 mt-2">
            Upload receipts and invoices to extract data automatically with
            improved accuracy
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Results ({ocrResults.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <GoogleVisionOCR onResults={handleOCRResults} />
        </TabsContent>

        <TabsContent value="camera" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Camera Capture</CardTitle>
              <CardDescription>
                Take a photo of your receipt or document directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleCameraCapture
                onCapture={handleCameraCapture}
                isProcessing={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
              <CardDescription>
                Enter receipt details manually when OCR is not suitable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleManualEntry
                onSubmit={(data) => {
                  const manualResult: OCRResult = {
                    text: `Manual Entry: ${data.storeName}`,
                    confidence: 100,
                    total: parseFloat(data.total),
                    vendor: data.storeName,
                    date: data.date,
                    processedText: `Manual entry for ${data.storeName}: ${data.description}`,
                    fileName: "Manual Entry",
                    fileSize: 0,
                    lastModified: Date.now(),
                  };
                  handleOCRResults([manualResult]);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {hasResults ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Processing Results ({ocrResults.length})
                </h2>
                <Button variant="outline" onClick={clearResults}>
                  Clear All Results
                </Button>
              </div>
              <SimpleResultDisplay results={ocrResults} />
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-gray-500">
                  No results to display. Process some documents first.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OCR Settings</CardTitle>
              <CardDescription>
                Configure OCR processing options and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleOCRSettings />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">
                  OCR Implementation Notes:
                </h4>
                <ul className="text-sm space-y-1 text-blue-700">
                  <li>
                    • Currently using Tesseract.js for basic OCR functionality
                  </li>
                  <li>• Works best with clear, high-contrast images</li>
                  <li>
                    • For production use, Google Vision API integration would
                    provide better accuracy
                  </li>
                  <li>• PDF processing requires additional configuration</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
