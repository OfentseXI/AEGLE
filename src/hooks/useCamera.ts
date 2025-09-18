import { useRef, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  // Initialize camera stream with receipt-optimized settings
  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request camera with receipt-optimized constraints
        const constraints = {
          video: {
            width: { ideal: 1920, max: 3840 },
            height: { ideal: 1080, max: 2160 },
            facingMode: { ideal: "environment" }, // Back camera preferred for documents
            focusMode: { ideal: "continuous" },
            exposureMode: { ideal: "continuous" },
            whiteBalanceMode: { ideal: "continuous" },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }

        return true;
      } else {
        toast({
          title: "Camera Error",
          description: "Camera access is not available in your browser",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description:
          "Could not access camera. Please check permissions and try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
      setIsStreaming(false);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      return true;
    }
    return false;
  }, []);

  // Take high-quality photo optimized for receipt scanning
  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current && isStreaming) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context && video.videoWidth && video.videoHeight) {
        // Set canvas to video dimensions for full quality
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to high-quality JPEG for OCR processing
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.95);
        return imageDataUrl;
      }
    }

    toast({
      title: "Capture Error",
      description: "Unable to capture image. Please ensure camera is active.",
      variant: "destructive",
    });
    return null;
  }, [isStreaming, toast]);

  // Switch camera (front/back) for better receipt scanning
  const switchCamera = useCallback(async () => {
    if (streamRef.current) {
      stopCamera();

      // Try to switch to the other camera
      try {
        const constraints = {
          video: {
            width: { ideal: 1920, max: 3840 },
            height: { ideal: 1080, max: 2160 },
            facingMode: { exact: "user" }, // Switch to front camera
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (error) {
        // If switching fails, restart with default settings
        startCamera();
      }
    }
  }, [startCamera, stopCamera]);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    startCamera,
    stopCamera,
    takePhoto,
    switchCamera,
  };
};
