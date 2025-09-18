import { OCRResult } from "@/lib/enhanced-ocr-utils";
import { GoogleVisionService } from "@/lib/google-vision-service";

interface OCRProvider {
  name: string;
  process: (file: File) => Promise<OCRResult>;
  supportedTypes: string[];
  priority: number;
}

export class CombinedOCRService {
  private providers: OCRProvider[] = [];
  private googleVisionService?: GoogleVisionService;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize Google Vision service if API key is available
    const apiKey = "AIzaSyAhrl4U_H8egMjL8Ry2b8nan7b8OOAaC4g";
    if (apiKey) {
      this.googleVisionService = new GoogleVisionService(apiKey);

      // Google Vision API provider (highest priority) - now supports PDFs!
      this.providers.push({
        name: "Google Vision",
        process: this.processWithGoogleVision.bind(this),
        supportedTypes: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/bmp",
          "image/webp",
          "application/pdf",
        ],
        priority: 15,
      });
    }

    // Tesseract.js provider (fallback for images only)
    this.providers.push({
      name: "Tesseract.js",
      process: this.processWithTesseract.bind(this),
      supportedTypes: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
        "image/tiff",
      ],
      priority: 5,
    });
  }

  async processFile(file: File): Promise<OCRResult> {
    console.log(`Processing file: ${file.name} (${file.type})`);

    // Get suitable providers for this file type
    const suitableProviders = this.providers
      .filter((provider) => provider.supportedTypes.includes(file.type))
      .sort((a, b) => b.priority - a.priority);

    if (suitableProviders.length === 0) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    let lastError: Error | null = null;

    // Try providers in order of priority
    for (const provider of suitableProviders) {
      try {
        console.log(`Attempting OCR with ${provider.name} for ${file.type}`);
        const result = await provider.process(file);

        // If confidence is good enough, return the result
        if (result.confidence > 50) {
          console.log(
            `${provider.name} succeeded with confidence: ${result.confidence}`
          );
          return {
            ...result,
            vendor: result.vendor || `Processed by ${provider.name}`,
          };
        }

        console.log(
          `${provider.name} confidence too low: ${result.confidence}`
        );
      } catch (error) {
        console.error(`${provider.name} failed:`, error);
        lastError = error as Error;

        // For Google Vision API errors, provide specific guidance
        if (provider.name === "Google Vision" && error instanceof Error) {
          if (error.message.includes("403")) {
            console.warn(
              "Google Vision API quota exceeded or API key invalid, falling back to Tesseract.js"
            );
            continue; // Try next provider
          }
          if (error.message.includes("429")) {
            console.warn(
              "Google Vision API rate limit exceeded, falling back to Tesseract.js"
            );
            continue; // Try next provider
          }
        }
        continue;
      }
    }

    // If all providers failed, throw a more helpful error
    if (lastError?.message.includes("403")) {
      throw new Error(
        "Google Vision API access denied (403). This usually means the API key has exceeded its quota or billing is not enabled. The document was processed with Tesseract.js as a fallback, but it may have lower accuracy."
      );
    }

    throw (
      lastError ||
      new Error("All OCR providers failed or returned low confidence results")
    );
  }

  private async processWithGoogleVision(file: File): Promise<OCRResult> {
    if (!this.googleVisionService) {
      throw new Error("Google Vision service not initialized");
    }

    try {
      const result = await this.googleVisionService.processImage(file);

      const fileTypeInfo =
        file.type === "application/pdf" ? "PDF Document" : "Image";

      return {
        text: result.text,
        confidence: result.confidence,
        total: result.total || 0,
        vendor: result.vendor || `${fileTypeInfo} - Google Vision OCR`,
        date: result.date,
        processedText: `Google Vision (${fileTypeInfo}): ${
          result.vendor
        } - Total: $${result.total || 0}`,
        fileName: file.name,
        fileSize: file.size,
        lastModified: file.lastModified,
        extractedNumbers: result.extractedNumbers,
      };
    } catch (error) {
      // Enhanced error handling for Google Vision API
      if (error instanceof Error) {
        if (error.message.includes("403")) {
          throw new Error(
            "Google Vision API quota exceeded or access denied (403). Please check your API key billing status."
          );
        }
        if (error.message.includes("429")) {
          throw new Error(
            "Google Vision API rate limit exceeded (429). Please try again later."
          );
        }
        if (error.message.includes("400")) {
          throw new Error(
            "Invalid request to Google Vision API (400). The file may be corrupted or unsupported."
          );
        }
      }
      throw error;
    }
  }

  private async processWithTesseract(file: File): Promise<OCRResult> {
    const { createWorker } = await import("tesseract.js");

    const worker = await createWorker({
      logger: (m) => console.log("Tesseract Progress:", m),
    });

    try {
      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      const imageUrl = URL.createObjectURL(file);
      const { data } = await worker.recognize(imageUrl);

      // Enhanced text processing for better extraction
      const extractedNumbers = this.extractNumbers(data.text);
      const vendor = this.extractVendor(data.text);
      const total = this.extractTotal(data.text, extractedNumbers);
      const date = this.extractDate(data.text);

      URL.revokeObjectURL(imageUrl);

      return {
        text: data.text,
        confidence: data.confidence,
        total: total,
        vendor: vendor,
        date: date,
        processedText: `Tesseract.js: ${vendor} - Total: $${total}`,
        fileName: file.name,
        fileSize: file.size,
        lastModified: file.lastModified,
        extractedNumbers,
      };
    } finally {
      await worker.terminate();
    }
  }

  private extractNumbers(text: string): number[] {
    const numberPatterns = [
      /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,
      /(\d{1,3}(?:,\d{3})*(?:\.\d{2}))/g,
      /(\d+\.\d{2})/g,
    ];

    const numbers: number[] = [];

    numberPatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const numberStr = match[1] || match[0];
        const cleanNumber = numberStr.replace(/[$,\s]/g, "");
        const parsedNumber = parseFloat(cleanNumber);

        if (!isNaN(parsedNumber) && parsedNumber > 0) {
          numbers.push(parsedNumber);
        }
      }
    });

    return [...new Set(numbers)].sort((a, b) => b - a);
  }

  private extractVendor(text: string): string {
    const lines = text.split("\n").filter((line) => line.trim().length > 2);

    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();

      if (
        /^\d+$/.test(line) ||
        /date|time|receipt|invoice/i.test(line) ||
        line.length < 3
      ) {
        continue;
      }

      if (line.toUpperCase() === line && line.length > 3) {
        return line;
      }

      if (
        !/^\d/.test(line) &&
        !/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(line)
      ) {
        return line;
      }
    }

    return lines[0] || "Unknown Vendor";
  }

  private extractTotal(text: string, extractedNumbers: number[]): number {
    const totalPatterns = [
      /(?:total|grand\s*total|amount\s*due|balance\s*due)[\s:]*\$?\s*(\d+\.?\d*)/gi,
      /\$\s*(\d+\.\d{2})\s*(?:total|amount|due)/gi,
    ];

    for (const pattern of totalPatterns) {
      const match = text.match(pattern);
      if (match) {
        const amountStr = match[1] || match[0];
        const amount = parseFloat(amountStr.replace(/[$,\s]/g, ""));
        if (!isNaN(amount)) {
          return amount;
        }
      }
    }

    return extractedNumbers.length > 0 ? Math.max(...extractedNumbers) : 0;
  }

  private extractDate(text: string): string | undefined {
    const datePatterns = [
      /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g,
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{2,4})\b/gi,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return undefined;
  }
}
