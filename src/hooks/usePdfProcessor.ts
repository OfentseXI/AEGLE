import { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PDFPageInfo {
  pageNumber: number;
  totalPages: number;
  renderUrl: string;
  selections: Array<{
    id: string;
    rect: { x: number; y: number; width: number; height: number };
    imageData: string;
    processed: boolean;
    result?: any;
  }>;
}

export const usePdfProcessor = () => {
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [pdfPages, setPdfPages] = useState<PDFPageInfo | null>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);

  const renderPdfPage = async (page: any): Promise<string> => {
    if (!pdfCanvasRef.current) return "";

    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = pdfCanvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return "";

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    return canvas.toDataURL("image/jpeg");
  };

  const loadPdfDocument = async (fileUrl: string) => {
    try {
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(fileUrl);
      const pdf = await loadingTask.promise;
      setPdfDocument(pdf);

      // Start with the first page
      const pageNumber = 1;
      const totalPages = pdf.numPages;

      // Render the first page
      const page = await pdf.getPage(pageNumber);
      const renderUrl = await renderPdfPage(page);

      const newPdfPages = {
        pageNumber,
        totalPages,
        renderUrl,
        selections: [],
      };

      setPdfPages(newPdfPages);

      return {
        document: pdf,
        pageInfo: newPdfPages,
      };
    } catch (error) {
      console.error("Error loading PDF:", error);
      throw error;
    }
  };

  const changePdfPage = async (direction: "next" | "prev") => {
    if (!pdfPages || !pdfDocument) return null;

    let newPageNumber = pdfPages.pageNumber;
    if (direction === "next" && newPageNumber < pdfPages.totalPages) {
      newPageNumber += 1;
    } else if (direction === "prev" && newPageNumber > 1) {
      newPageNumber -= 1;
    } else {
      return null; // Don't change if we're at the limits
    }

    try {
      const page = await pdfDocument.getPage(newPageNumber);
      const renderUrl = await renderPdfPage(page);

      const newPdfPages = {
        ...pdfPages,
        pageNumber: newPageNumber,
        renderUrl,
        selections: [], // Reset selections for the new page
      };

      setPdfPages(newPdfPages);
      return {
        pageInfo: newPdfPages,
        renderUrl,
      };
    } catch (error) {
      console.error("Error changing PDF page:", error);
      return null;
    }
  };

  const cleanup = () => {
    if (pdfDocument) {
      pdfDocument.destroy();
      setPdfDocument(null);
      setPdfPages(null);
    }
  };

  return {
    pdfDocument,
    pdfPages,
    pdfCanvasRef,
    loadPdfDocument,
    renderPdfPage,
    changePdfPage,
    setPdfPages,
    cleanup,
  };
};
