"use client";

import { useState, useEffect, useRef } from "react";
import smartcrop from "smartcrop";
import { Stethoscope } from "lucide-react";

interface SmartDoctorImageProps {
  src: string;
  alt: string;
  className?: string;
  focalPoint?: { x: number; y: number };
}

// In-memory cache across client route transitions
const focalCache: Record<string, string> = {};

export function SmartDoctorImage({
  src,
  alt,
  className = "",
  focalPoint,
}: SmartDoctorImageProps) {
  const [hasError, setHasError] = useState(false);
  const [position, setPosition] = useState<string>(() => {
    if (focalPoint && typeof focalPoint.x === "number" && typeof focalPoint.y === "number") {
      return `${focalPoint.x}% ${focalPoint.y}%`;
    }
    if (focalCache[src]) {
      return focalCache[src];
    }
    // Default 12% from top ensures faces at the top of photos are never cropped off
    return "50% 12%";
  });

  const imgRef = useRef<HTMLImageElement>(null);

  const runDetection = async (img: HTMLImageElement) => {
    if (!img || img.naturalWidth === 0 || img.naturalHeight === 0) return;

    try {
      // 1. Native Chrome / Edge FaceDetector API (hardware accelerated)
      if (typeof window !== "undefined" && "FaceDetector" in window) {
        try {
          const detector = new (window as any).FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
          const faces = await detector.detect(img);
          if (faces && faces.length > 0) {
            const box = faces[0].boundingBox;
            const fx = (((box.x + box.width / 2) / img.naturalWidth) * 100).toFixed(1);
            const rawFy = ((box.y + box.height / 2) / img.naturalHeight) * 100;
            const fy = Math.min(Math.max(rawFy, 0), 32).toFixed(1);
            const pos = `${fx}% ${fy}%`;
            focalCache[src] = pos;
            setPosition(pos);
            return;
          }
        } catch {
          // fallback to smartcrop
        }
      }

      // 2. Smartcrop.js (Entropy, edge & skin-tone based face detection)
      const result = await smartcrop.crop(img, {
        width: 340,
        height: 320,
        minScale: 0.9,
      });

      if (result && result.topCrop) {
        const crop = result.topCrop;
        const fx = (((crop.x + crop.width / 2) / img.naturalWidth) * 100).toFixed(1);
        const rawFy = ((crop.y + crop.height / 2) / img.naturalHeight) * 100;
        // Clamp Y to at most 32% - clothing details or embroidery must never push the face out of frame
        const fy = Math.min(Math.max(rawFy, 0), 32).toFixed(1);
        const pos = `${fx}% ${fy}%`;
        focalCache[src] = pos;
        setPosition(pos);
      }
    } catch {
      // Keep existing position
    }
  };

  useEffect(() => {
    setHasError(false);
    if (focalPoint && typeof focalPoint.x === "number" && typeof focalPoint.y === "number") {
      setPosition(`${focalPoint.x}% ${focalPoint.y}%`);
      return;
    }

    if (focalCache[src]) {
      setPosition(focalCache[src]);
      return;
    }

    if (imgRef.current && imgRef.current.complete) {
      runDetection(imgRef.current);
    }
  }, [src, focalPoint]);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
        <Stethoscope className="w-20 h-20" />
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      onLoad={(e) => {
        if (!focalPoint && !focalCache[src]) {
          runDetection(e.currentTarget);
        }
      }}
      style={{ objectPosition: position }}
      className={`w-full h-full object-cover transition-[object-position] duration-300 ${className}`}
    />
  );
}
