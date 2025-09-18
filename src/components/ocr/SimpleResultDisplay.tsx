import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OCRResult } from "@/lib/enhanced-ocr-utils";
import { FileSpreadsheet, DollarSign, Hash, FileText } from "lucide-react";
import { addToLedger } from "@/lib/ledger-operations";
import { toast } from "sonner";

interface SimpleResultDisplayProps {
  results: OCRResult[];
}

export function SimpleResultDisplay({ results }: SimpleResultDisplayProps) {
  const handleGenerateQuarterlyReport = async () => {
    try {
      // Convert OCR results to ledger entries with real extracted data
      const ledgerEntries = results.map((result) => {
        // Use real line items if available, otherwise create from extracted data
        const items =
          result.lineItems && result.lineItems.length > 0
            ? result.lineItems.map((item) => ({
                name: item.description,
                price: `$${item.amount.toFixed(2)}`,
                category: "other",
              }))
            : result.extractedNumbers && result.extractedNumbers.length > 0
            ? result.extractedNumbers.slice(0, 5).map((num, index) => ({
                name: `Item ${index + 1}`,
                price: `$${num.toFixed(2)}`,
                category: "other",
              }))
            : [
                {
                  name: result.processedText || "OCR Extracted Item",
                  price: `$${result.total || 0}`,
                  category: "other",
                },
              ];

        return {
          companyName: "Johnson Enterprises Ltd",
          date: result.date || new Date().toISOString().split("T")[0],
          storeName: result.vendor || "Unknown Vendor",
          total: result.total || 0,
          items,
        };
      });

      // Add entries to ledger
      for (const entry of ledgerEntries) {
        await addToLedger(entry);
      }

      toast.success(
        `Real OCR results processed! ${ledgerEntries.length} entries added to ledger.`
      );

      // Navigate to reports page to view the quarterly report
      window.location.href = "/business-reports";
    } catch (error) {
      console.error("Error generating quarterly report:", error);
      toast.error("Failed to generate quarterly report");
    }
  };

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">No results to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Real OCR Results</h3>
        <Button
          onClick={handleGenerateQuarterlyReport}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Generate Quarterly Report
        </Button>
      </div>

      {results.map((result, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {result.vendor || `Document ${index + 1}`}
              {result.fileName && (
                <span className="text-sm text-gray-500">
                  ({result.fileName})
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {result.date && `Date: ${result.date}`}
              {result.total && ` • Total: $${result.total.toFixed(2)}`}
              {result.confidence &&
                ` • Confidence: ${result.confidence.toFixed(1)}%`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Real extracted numbers display */}
              {result.extractedNumbers &&
                result.extractedNumbers.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4" />
                      <strong>Extracted Numbers:</strong>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.extractedNumbers.map((num, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <DollarSign className="h-3 w-3" />
                          {num.toFixed(2)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {/* Real line items display */}
              {result.lineItems && result.lineItems.length > 0 && (
                <div>
                  <strong>Line Items:</strong>
                  <div className="mt-2 space-y-2">
                    {result.lineItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">{item.description}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            ${item.amount.toFixed(2)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real OCR text */}
              <div>
                <strong>Extracted Text:</strong>
                <pre className="mt-1 p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {result.text}
                </pre>
              </div>

              {/* Processing metadata */}
              {(result.fileName || result.fileSize) && (
                <div className="text-xs text-gray-500 border-t pt-2">
                  {result.fileName && <div>File: {result.fileName}</div>}
                  {result.fileSize && (
                    <div>Size: {(result.fileSize / 1024).toFixed(1)} KB</div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
