import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SimpleOCRSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OCR Configuration</CardTitle>
        <CardDescription>Basic OCR settings and information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>
            OCR processing is available for basic text extraction from images.
          </p>
          <p>Upload images or use camera capture to extract text content.</p>
        </div>
      </CardContent>
    </Card>
  );
}
