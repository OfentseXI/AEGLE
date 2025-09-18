import { jsPDF } from "jspdf";

interface PDFGeneratorOptions {
  companyName: string;
  receiptData: {
    storeName?: string;
    date?: string;
    total?: string;
    items?: Array<{
      name: string;
      price: string;
      category?: string;
    }>;
  };
  originalText: string;
  imageUrl: string;
}

export async function generatePdf(options: PDFGeneratorOptions): Promise<void> {
  const { companyName, receiptData, originalText, imageUrl } = options;

  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Add title
      doc.setFontSize(16);
      doc.text(`Receipt for ${companyName}`, pageWidth / 2, 20, {
        align: "center",
      });

      // Add receipt image if available
      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          try {
            // Calculate aspect ratio to fit the image properly
            const imgWidth = Math.min(150, pageWidth - 40);
            const imgHeight = img.height * (imgWidth / img.width);

            doc.addImage(
              img,
              "JPEG",
              (pageWidth - imgWidth) / 2, // center horizontally
              30, // y position
              imgWidth,
              imgHeight
            );

            // Continue with receipt details after the image
            addReceiptDetails(doc, receiptData, originalText, imgHeight + 40);

            // Save and download the PDF
            doc.save(`${companyName}-receipt-${Date.now()}.pdf`);
            resolve();
          } catch (err) {
            console.error("Error adding image to PDF:", err);
            // Fall back to generating PDF without the image
            addReceiptDetails(doc, receiptData, originalText, 30);
            doc.save(`${companyName}-receipt-${Date.now()}.pdf`);
            resolve();
          }
        };

        img.onerror = () => {
          // Generate PDF without the image if it fails to load
          addReceiptDetails(doc, receiptData, originalText, 30);
          doc.save(`${companyName}-receipt-${Date.now()}.pdf`);
          resolve();
        };
      } else {
        // Generate PDF without image
        addReceiptDetails(doc, receiptData, originalText, 30);
        doc.save(`${companyName}-receipt-${Date.now()}.pdf`);
        resolve();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
}

function addReceiptDetails(
  doc: jsPDF,
  receiptData: PDFGeneratorOptions["receiptData"],
  originalText: string,
  startY: number
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = startY;

  // Add receipt metadata
  doc.setFontSize(12);
  doc.text(`Vendor: ${receiptData.storeName || "Unknown"}`, 20, yPos);
  yPos += 10;
  doc.text(`Date: ${receiptData.date || "Unknown"}`, 20, yPos);
  yPos += 10;
  doc.text(
    `Total: ${receiptData.total ? `$${receiptData.total}` : "Unknown"}`,
    20,
    yPos
  );
  yPos += 20;

  // Add items table
  if (receiptData.items && receiptData.items.length > 0) {
    doc.setFontSize(13);
    doc.text("Items:", 20, yPos);
    yPos += 10;

    // Create a simple table
    doc.setFontSize(11);
    doc.text("Item", 20, yPos);
    doc.text("Category", 100, yPos);
    doc.text("Price", 160, yPos);
    yPos += 5;

    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 8;

    // Add items
    receiptData.items.forEach((item) => {
      // Check if we need to add a new page
      if (yPos > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(truncateText(item.name, 70), 20, yPos);
      doc.text(item.category || "Other", 100, yPos);
      doc.text(item.price, 160, yPos);
      yPos += 8;
    });

    // Add a line after items
    yPos += 2;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;
  }

  // Add raw OCR text on a new page if it's lengthy
  if (originalText && originalText.length > 0) {
    doc.addPage();
    doc.setFontSize(13);
    doc.text("Raw OCR Text:", 20, 20);

    // Split text to fit page width
    const textLines = doc.splitTextToSize(originalText, pageWidth - 40);
    doc.setFontSize(10);
    doc.text(textLines, 20, 30);
  }
}

// Helper function to truncate text if it's too long
function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}
