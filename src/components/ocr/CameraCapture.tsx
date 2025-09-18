
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RotateCcw, ScanLine, X } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const { videoRef, canvasRef, isStreaming, startCamera, stopCamera, takePhoto, switchCamera } = useCamera();
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (!isStreaming) {
      toast({
        title: "Camera Not Ready",
        description: "Please wait for camera to initialize",
        variant: "destructive"
      });
      return;
    }

    setIsCapturing(true);
    const photoData = takePhoto();
    
    if (photoData) {
      onCapture(photoData);
      toast({
        title: "Receipt Captured",
        description: "Image captured successfully",
      });
    }
    
    setIsCapturing(false);
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  const restartCamera = () => {
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Receipt Camera Scanner
            {isStreaming && <Badge variant="outline" className="text-green-600">Live</Badge>}
          </div>
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Receipt scanning guide overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-dashed border-white/60 rounded-lg p-4 bg-black/20">
              <div className="w-80 h-48 border border-white/40 rounded flex items-center justify-center">
                <ScanLine className={`h-8 w-8 text-white/80 ${isCapturing ? 'animate-pulse' : ''}`} />
              </div>
              <p className="text-white/80 text-sm mt-2 text-center">
                Align receipt within this frame
              </p>
            </div>
          </div>

          {/* Camera status */}
          <div className="absolute top-2 right-2">
            {isStreaming ? (
              <Badge className="bg-green-500 text-white">
                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                Active
              </Badge>
            ) : (
              <Badge variant="destructive">Inactive</Badge>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          
          <Button 
            variant="outline" 
            onClick={restartCamera}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
          
          <Button 
            variant="outline" 
            onClick={switchCamera}
          >
            Switch Camera
          </Button>
          
          <Button 
            onClick={handleCapture}
            
            className="bg-green-500 hover:bg-green-600"
          >
            {isCapturing ? (
              <>Processing...</>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Capture Receipt
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded">
          <p><strong>Pro Tip:</strong> For long receipts, ensure the entire receipt is visible or capture in sections for best OCR results.</p>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}
