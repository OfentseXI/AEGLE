import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RotateCcw, ScanLine, CheckCircle } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/hooks/use-toast";

interface SimpleCameraCaptureProps {
  onCapture: (file: File) => void;
  isProcessing: boolean;
}

export function SimpleCameraCapture({
  onCapture,
  isProcessing,
}: SimpleCameraCaptureProps) {
  const {
    videoRef,
    canvasRef,
    isStreaming,
    startCamera,
    stopCamera,
    takePhoto,
    switchCamera,
  } = useCamera();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = async () => {
    if (!isStreaming) {
      toast({
        title: "Camera Not Ready",
        description: "Please wait for camera to initialize",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    const photoData = takePhoto();

    if (photoData) {
      // Convert data URL to File for OCR processing
      try {
        const response = await fetch(photoData);
        const blob = await response.blob();
        const file = new File([blob], `receipt-scan-${Date.now()}.jpg`, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        // Add to captured images for preview
        setCapturedImages((prev) => [...prev, photoData]);

        // Process the captured image
        onCapture(file);

        toast({
          title: "Receipt Captured",
          description:
            "Image captured successfully and sent for OCR processing",
        });
      } catch (error) {
        console.error("Error processing captured image:", error);
        toast({
          title: "Processing Error",
          description: "Failed to process captured image",
          variant: "destructive",
        });
      }
    }

    setIsScanning(false);
  };

  const clearCapturedImages = () => {
    setCapturedImages([]);
  };

  const restartCamera = () => {
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Camera Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Receipt Scanner
            {isStreaming && (
              <Badge variant="outline" className="text-green-600">
                Live
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Scanning overlay for receipt guidance */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-dashed border-white/60 rounded-lg p-4 bg-black/20">
                <div className="w-80 h-48 border border-white/40 rounded flex items-center justify-center">
                  <ScanLine
                    className={`h-8 w-8 text-white/80 ${
                      isScanning ? "animate-pulse" : ""
                    }`}
                  />
                </div>
                <p className="text-white/80 text-sm mt-2 text-center">
                  Position receipt within frame
                </p>
              </div>
            </div>

            {/* Camera status indicator */}
            <div className="absolute top-2 right-2">
              {isStreaming ? (
                <Badge className="bg-green-500 text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                  Recording
                </Badge>
              ) : (
                <Badge variant="destructive">Camera Off</Badge>
              )}
            </div>
          </div>

          {/* Camera Controls */}
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={restartCamera}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart Camera
            </Button>

            <Button variant="outline" size="sm" onClick={switchCamera}>
              Switch Camera
            </Button>

            <Button
              onClick={handleCapture}
              className="bg-green-500 hover:bg-green-600"
            >
              {isScanning ? (
                <>Scanning...</>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Scan Receipt
                </>
              )}
            </Button>
          </div>

          {/* Receipt scanning tips */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
            <h4 className="font-medium text-blue-900 mb-1">
              Receipt Scanning Tips:
            </h4>
            <ul className="text-blue-700 space-y-1">
              <li>• Ensure good lighting for clear text</li>
              <li>• Keep receipt flat and fully visible in frame</li>
              <li>• For long receipts, capture in sections if needed</li>
              <li>• Hold camera steady when capturing</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Captured Images Preview */}
      {capturedImages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Captured Images ({capturedImages.length})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearCapturedImages}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {capturedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Captured receipt ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <Badge className="absolute top-1 right-1 text-xs">
                    {index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
