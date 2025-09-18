interface GoogleVisionResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      boundingPoly?: {
        vertices: Array<{ x: number; y: number }>;
      };
    }>;
    fullTextAnnotation?: {
      text: string;
      pages?: Array<{
        property?: {
          detectedLanguages?: Array<{
            languageCode: string;
            confidence: number;
          }>;
        };
        width: number;
        height: number;
        blocks: Array<{
          boundingBox: {
            vertices: Array<{ x: number; y: number }>;
          };
          paragraphs: Array<{
            boundingBox: {
              vertices: Array<{ x: number; y: number }>;
            };
            words: Array<{
              boundingBox: {
                vertices: Array<{ x: number; y: number }>;
              };
              symbols: Array<{
                text: string;
                boundingBox: {
                  vertices: Array<{ x: number; y: number }>;
                };
              }>;
            }>;
          }>;
        }>;
      }>;
    };
    error?: {
      code: number;
      message: string;
    };
  }>;
}

export class GoogleVisionService {
  private apiKey: string;
  private apiUrl = "https://vision.googleapis.com/v1/images:annotate";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async processImage(file: File): Promise<{
    text: string;
    confidence: number;
    vendor?: string;
    total?: number;
    date?: string;
    extractedNumbers: number[];
  }> {
    try {
      console.log(`Processing ${file.type} file: ${file.name}`);

      let requestBody;

      if (file.type === "application/pdf") {
        // Handle PDF files using Google Vision's PDF processing
        requestBody = await this.createPDFRequest(file);
      } else {
        // Handle image files
        requestBody = await this.createImageRequest(file);
      }

      console.log("Sending request to Google Vision API...");
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `Google Vision API error: ${response.status} ${response.statusText}`
        );
      }

      const data: GoogleVisionResponse = await response.json();
      console.log("Google Vision API response:", data);

      return this.processResponse(data, file);
    } catch (error) {
      console.error("Google Vision API processing failed:", error);
      throw error;
    }
  }

  private async createImageRequest(file: File) {
    const base64Image = await this.fileToBase64(file);

    return {
      requests: [
        {
          image: {
            content: base64Image.split(",")[1], // Remove data:image/jpeg;base64, prefix
          },
          features: [
            {
              type: "DOCUMENT_TEXT_DETECTION", // Better for receipts and documents
              maxResults: 1,
            },
          ],
        },
      ],
    };
  }

  private async createPDFRequest(file: File) {
    const base64PDF = await this.fileToBase64(file);

    return {
      requests: [
        {
          image: {
            content: base64PDF.split(",")[1], // Remove data:application/pdf;base64, prefix
          },
          features: [
            {
              type: "DOCUMENT_TEXT_DETECTION",
              maxResults: 1,
            },
          ],
        },
      ],
    };
  }

  private processResponse(data: GoogleVisionResponse, file: File) {
    const result = data.responses[0];

    if (result.error) {
      throw new Error(`Google Vision API error: ${result.error.message}`);
    }

    let extractedText = "";
    let confidence = 95; // Default high confidence for Google Vision

    // Try to get text from document text detection first (better for PDFs and structured documents)
    if (result.fullTextAnnotation?.text) {
      extractedText = result.fullTextAnnotation.text;

      // Calculate confidence based on page structure if available
      if (result.fullTextAnnotation.pages) {
        const pages = result.fullTextAnnotation.pages;
        confidence = this.calculateDocumentConfidence(pages);
      }
    }
    // Fallback to basic text annotations
    else if (result.textAnnotations?.[0]?.description) {
      extractedText = result.textAnnotations[0].description;
    }

    if (!extractedText) {
      throw new Error("No text detected in document");
    }

    console.log(
      `Google Vision API successful (${file.type}), processing text...`
    );

    // Process the extracted text
    const extractedNumbers = this.extractNumbers(extractedText);
    const vendor = this.extractVendor(extractedText);
    const total = this.extractTotal(extractedText, extractedNumbers);
    const date = this.extractDate(extractedText);

    return {
      text: extractedText,
      confidence,
      vendor,
      total,
      date,
      extractedNumbers,
    };
  }

  private calculateDocumentConfidence(pages: any[]): number {
    // Calculate confidence based on document structure
    let totalWords = 0;
    let detectedWords = 0;

    pages.forEach((page) => {
      page.blocks?.forEach((block: any) => {
        block.paragraphs?.forEach((paragraph: any) => {
          paragraph.words?.forEach((word: any) => {
            totalWords++;
            if (word.symbols && word.symbols.length > 0) {
              detectedWords++;
            }
          });
        });
      });
    });

    if (totalWords === 0) return 85; // Default if no structure available
    return Math.min(95, Math.max(60, (detectedWords / totalWords) * 100));
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
