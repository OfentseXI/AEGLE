/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileUp,
  UploadCloud,
  Receipt,
  FileSpreadsheet,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CombinedOCRService } from "@/lib/combined-ocr-service";
import { addToLedger } from "@/lib/ledger-operations";
import { toast } from "sonner";

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  category?: string;
  preview?: string;
  file?: File;
}

export function UploadDocuments({
  currentUserCompany,
}: {
  currentUserCompany: string;
}) {
  const [activeTab, setActiveTab] = useState("receipts");
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const ocrService = new CombinedOCRService();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading" as const,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((docFile) => {
      const progressInterval = setInterval(() => {
        setFiles((prevFiles) =>
          prevFiles.map((f) => {
            if (f.id === docFile.id) {
              const newProgress = Math.min(f.progress + 20, 100);
              const newStatus = newProgress === 100 ? "complete" : "uploading";
              if (newProgress === 100) clearInterval(progressInterval);
              return { ...f, progress: newProgress, status: newStatus };
            }
            return f;
          })
        );
      }, 500);
    });
  };

  const handleCategoryChange = (fileId: string, category: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, category } : f))
    );
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleCancelAll = () => {
    setFiles([]);
    setIsProcessing(false);
    setIsComplete(false);
  };

  const handleProcessDocuments = async () => {
    const completedFiles = files.filter(
      (f) => f.status === "complete" && f.file
    );
    if (completedFiles.length === 0) {
      toast.error("No files ready for processing");
      return;
    }

    setIsProcessing(true);

    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "complete" ? { ...f, status: "processing" } : f
        )
      );

      for (const docFile of completedFiles) {
        if (!docFile.file) continue;

        try {
          const ocrResult = await ocrService.processFile(docFile.file);

          const ledgerEntry = {
            companyName: currentUserCompany,
            date: ocrResult.date || new Date().toISOString().split("T")[0],
            storeName: ocrResult.vendor || "Unknown Vendor",
            total: ocrResult.total || 0,
            items: ocrResult.lineItems?.length
              ? ocrResult.lineItems.map((item) => ({
                  name: item.description,
                  price: `$${item.amount.toFixed(2)}`,
                  category: docFile.category || "other",
                }))
              : [
                  {
                    name: ocrResult.processedText || "OCR Extracted Item",
                    price: `$${ocrResult.total || 0}`,
                    category: docFile.category || "other",
                  },
                ],
          };

          await addToLedger(ledgerEntry);
        } catch (error) {
          console.error(`Error processing ${docFile.name}:`, error);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === docFile.id ? { ...f, status: "error" } : f
            )
          );
        }
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.status === "processing" ? { ...f, status: "complete" } : f
        )
      );

      setIsComplete(true);
      toast.success(
        `Processed ${completedFiles.length} document(s) successfully!`
      );
    } catch (error) {
      console.error("Error processing documents:", error);
      toast.error("Failed to process documents");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderFileItem = (file: DocumentFile, isReceipt: boolean) => (
    <div key={file.id} className="flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          {isReceipt && file.preview ? (
            <div className="h-12 w-12 rounded-md overflow-hidden border">
              <img
                src={file.preview}
                alt={file.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted">
              {isReceipt ? (
                <Receipt className="h-6 w-6 text-muted-foreground" />
              ) : (
                <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          )}
          <div className="grid gap-1">
            <div className="font-medium">{file.name}</div>
            <div className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleDeleteFile(file.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Progress value={file.progress} className="h-1" />
      <div className="flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          {file.status === "complete" && (
            <span className="flex items-center text-green-600">
              <Check className="mr-1 h-3 w-3" />
              {isReceipt ? "Ready for Processing" : "Uploaded"}
            </span>
          )}
          {file.status === "uploading" && (
            <span>Uploading... {file.progress}%</span>
          )}
          {file.status === "processing" && (
            <span className="flex items-center text-blue-600">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Processing...
            </span>
          )}
          {file.status === "error" && (
            <span className="flex items-center text-red-600">
              <X className="mr-1 h-3 w-3" /> Processing Failed
            </span>
          )}
        </div>
        {isReceipt && file.status === "complete" && !isProcessing && (
          <Select
            value={file.category}
            onValueChange={(val) => handleCategoryChange(file.id, val)}
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Food/Catering</SelectItem>
              <SelectItem value="transport">Transportation</SelectItem>
              <SelectItem value="asset">Assets/Equipment</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload receipts and bank statements for automatic OCR processing and
            ledger entry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="receipts">Receipts</TabsTrigger>
              <TabsTrigger value="statements">Bank Statements</TabsTrigger>
            </TabsList>

            <TabsContent value="receipts" className="pt-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50"
                onClick={() => fileInputRefs.current["receipts"]?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    const event = {
                      target: { files: e.dataTransfer.files },
                    } as any;
                    handleFileChange(event);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Click to upload or drag and drop PNG, JPG, or PDF up to 10MB
                  each
                </p>
                <Input
                  ref={(el) => (fileInputRefs.current["receipts"] = el)}
                  type="file"
                  className="hidden"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
              </div>

              {files.filter((f) => activeTab === "receipts").length > 0 && (
                <ScrollArea className="h-72 rounded-md border mt-4">
                  <div className="p-4 space-y-4">
                    {files
                      .filter((f) => activeTab === "receipts")
                      .map((f) => renderFileItem(f, true))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="statements" className="pt-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50"
                onClick={() => fileInputRefs.current["statements"]?.click()}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Click to upload PDF, CSV or XLS up to 10MB each
                </p>
                <Input
                  ref={(el) => (fileInputRefs.current["statements"] = el)}
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.csv,.xls,.xlsx"
                  onChange={handleFileChange}
                />
              </div>

              {files.filter((f) => activeTab === "statements").length > 0 && (
                <ScrollArea className="h-72 rounded-md border mt-4">
                  <div className="p-4 space-y-4">
                    {files
                      .filter((f) => activeTab === "statements")
                      .map((f) => renderFileItem(f, false))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancelAll}>
            Cancel
          </Button>
          <Button
            className="bg-purple hover:bg-purple-dark"
            onClick={handleProcessDocuments}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                Documents...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" /> Process Documents with OCR
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {isComplete && (
        <Alert className="mt-4 border-green-600/20 bg-green-50 text-green-800">
          <AlertTitle>Documents Processed Successfully!</AlertTitle>
          <AlertDescription>
            Your documents have been processed with OCR and added to the ledger.
            You can view them in the ledger or navigate to reports.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
