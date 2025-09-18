import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface OCRSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OCRSettings({ isOpen, onClose }: OCRSettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            OCR Settings
          </CardTitle>
          <CardDescription>Basic OCR configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">Basic OCR Features:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Image upload and processing</li>
              <li>• Camera capture support</li>
              <li>• Manual entry option</li>
              <li>• Basic text extraction</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
