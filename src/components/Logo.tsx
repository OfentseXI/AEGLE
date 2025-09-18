import React, { useEffect, useMemo, useRef, useState } from "react";

export type LogoProps = {
  src: string;
  alt: string;
  className?: string;
  // Threshold for what counts as white; lower = more aggressive
  threshold?: number; // 0-255
};

// Simple, fast in-browser white-background removal using canvas thresholding.
// This avoids heavy ML libs and works well for logos on white.
export function Logo({ src, alt, className, threshold = 245 }: LogoProps) {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const t = useMemo(() => Math.min(255, Math.max(0, threshold)), [threshold]);

  useEffect(() => {
    let isMounted = true;

    const img = new Image();
    img.decoding = "async";
    img.loading = "eager"; // we process immediately for the header logo
    img.crossOrigin = "anonymous"; // safeguard if served with proper CORS
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert near-white pixels to transparent with a soft edge
        const softRange = 20; // softness range below threshold
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          const avg = (r + g + b) / 3;

          if (avg >= t) {
            data[i + 3] = 0; // fully transparent
          } else if (avg > t - softRange) {
            // Fade alpha for near-white pixels to avoid halos
            const factor = (t - avg) / softRange; // 0..1
            data[i + 3] = Math.round(a * factor);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob || !isMounted) return;
            const url = URL.createObjectURL(blob);
            objectUrlRef.current = url;
            setProcessedSrc(url);
          },
          "image/png",
          1
        );
      } catch (e) {
        // Fallback to original src
        if (!isMounted) return;
        setProcessedSrc(null);
      }
    };

    img.onerror = () => {
      if (!isMounted) return;
      setProcessedSrc(null);
    };

    return () => {
      isMounted = false;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [src, t]);

  return (
    <img
      src={processedSrc ?? src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
