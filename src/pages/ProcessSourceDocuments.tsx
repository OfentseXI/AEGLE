import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OCRProcessor } from "@/components/ocr/OCRProcessor";
import { UploadDocuments } from "@/components/documents/UploadDocuments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, ScanText, Upload } from "lucide-react";

const ProcessSourceDocuments = () => {
  const navigateToLedger = () => {
    window.location.href = "/general-ledger";
  };

  return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Process Source Documents</h1>
            <p className="text-muted-foreground">
              Upload and process your receipts, invoices, and documents with OCR
              technology or traditional file upload.
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={navigateToLedger}
          >
            <FileText className="h-4 w-4" />
            View General Ledger
          </Button>
        </div>

        <Tabs defaultValue="ocr" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ocr" className="flex items-center gap-2">
              <ScanText className="h-4 w-4" />
              OCR Processing
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              File Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ocr" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Document OCR Processing
              </h2>
              <p className="text-muted-foreground mb-4">
                Upload images or PDF documents up to 50MB to extract and process
                receipt information. When using multi-receipt PDFs, you can
                select each receipt individually.
              </p>
            </div>
            <OCRProcessor />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Traditional File Upload
              </h2>
              <p className="text-muted-foreground mb-4">
                Upload your documents directly without OCR processing for manual
                review and processing.
              </p>
            </div>
            <UploadDocuments currentUserCompany={""} />
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default ProcessSourceDocuments;
