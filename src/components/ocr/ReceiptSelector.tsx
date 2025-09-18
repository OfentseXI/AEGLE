import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ReceiptSelectorProps {
  imageUrl: string;
  onAddSelection: (selection: {
    id: string;
    rect: any;
    imageData: string;
  }) => void;
}

export function ReceiptSelector({
  imageUrl,
  onAddSelection,
}: ReceiptSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const [selectionRect, setSelectionRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle mouse events for selection
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPoint({ x, y });
    setEndPoint({ x, y });
    setIsSelecting(true);
    setSelectionRect(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setEndPoint({ x, y });
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;

    // Calculate selection rectangle
    const x = Math.min(startPoint.x, endPoint.x);
    const y = Math.min(startPoint.y, endPoint.y);
    const width = Math.abs(endPoint.x - startPoint.x);
    const height = Math.abs(endPoint.y - startPoint.y);

    // Minimum size check to avoid accidental clicks
    if (width > 20 && height > 20) {
      setSelectionRect({ x, y, width, height });
    }

    setIsSelecting(false);
  };

  const confirmSelection = () => {
    if (!selectionRect || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Get the scale factor between the displayed image and the original image
    const image = imageRef.current;
    const displayedWidth = image.clientWidth;
    const displayedHeight = image.clientHeight;
    const originalWidth = image.naturalWidth;
    const originalHeight = image.naturalHeight;

    const scaleX = originalWidth / displayedWidth;
    const scaleY = originalHeight / displayedHeight;

    // Set the canvas size to the selection size
    canvas.width = selectionRect.width * scaleX;
    canvas.height = selectionRect.height * scaleY;

    // Draw the selection on the canvas
    context.drawImage(
      image,
      selectionRect.x * scaleX,
      selectionRect.y * scaleY,
      selectionRect.width * scaleX,
      selectionRect.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Get the data URL of the selection
    const imageData = canvas.toDataURL("image/jpeg");

    // Add the selection with a unique ID
    onAddSelection({
      id: `selection-${Date.now()}`,
      rect: selectionRect,
      imageData,
    });

    // Reset the selection
    setSelectionRect(null);
  };

  // Cleanup selection when unmounting
  useEffect(() => {
    const handleMouseUpOnWindow = () => {
      if (isSelecting) {
        setIsSelecting(false);
      }
    };

    window.addEventListener("mouseup", handleMouseUpOnWindow);

    return () => {
      window.removeEventListener("mouseup", handleMouseUpOnWindow);
    };
  }, [isSelecting]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Document for selection"
        className="w-full h-full object-contain"
        draggable="false"
      />

      {isSelecting && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
          style={{
            left: Math.min(startPoint.x, endPoint.x),
            top: Math.min(startPoint.y, endPoint.y),
            width: Math.abs(endPoint.x - startPoint.x),
            height: Math.abs(endPoint.y - startPoint.y),
          }}
        />
      )}

      {selectionRect && (
        <div
          className="absolute border-2 border-green-500 bg-green-500/20"
          style={{
            left: selectionRect.x,
            top: selectionRect.y,
            width: selectionRect.width,
            height: selectionRect.height,
          }}
        >
          <div className="absolute -bottom-10 -right-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmSelection}
            >
              <Check className="h-3 w-3 mr-1" />
              Confirm
            </Button>
          </div>
        </div>
      )}

      {/* Hidden canvas for image data extraction */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute top-2 left-2 right-2 bg-black/40 text-white py-2 px-4 rounded-md text-sm text-center">
        Click and drag to select receipt areas from the document
      </div>
    </div>
  );
}
