"use client";
import type React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type GradientBackgroundProps = React.ComponentProps<"div"> & {
  // Animation customization
  bgGradients?: string[];
  animationDuration?: number;
  animationDelay?: number;

  // Layout customization
  enableCenterContent?: boolean;

  // Visual customization
  overlay?: boolean;
  overlayOpacity?: number;
};

export const Default_Gradients = [
  "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
  "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",
  "linear-gradient(135deg, #0f3460 0%, #e94560 100%)",
  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
  "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
];

export const Light_Gradients = [
  "linear-gradient(135deg, #95DAF5 0%, #C4FFDD 100%)",
  "linear-gradient(135deg, #C4FFDD 0%, #FAC8F4 100%)",
  "linear-gradient(135deg, #FAC8F4 0%, #FFF8B5 100%)",
  "linear-gradient(135deg, #FFF8B5 0%, #FFE1B5 100%)",
  "linear-gradient(135deg, #95DAF5 0%, #C4FFDD 100%)",
];

export function GradientBackground({
  children,
  className = "",
  bgGradients = Default_Gradients,
  animationDuration = 8,
  animationDelay = 0.5,
  overlay = false,
  overlayOpacity = 0.3,
}: GradientBackgroundProps) {
  const [gradients, setGradients] = useState(bgGradients);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (mediaQuery.matches) {
        setGradients(Default_Gradients);
      } else {
        setGradients(Light_Gradients);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    handleChange(); // Initial check
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className={cn("w-full relative min-h-2/3 overflow-hidden", className)}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{ background: gradients[0] }}
        animate={{ background: gradients }}
        transition={{
          delay: animationDelay,
          duration: animationDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Optional overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content wrapper */}
      {children && (
        <div
          className={cn(
            "relative z-10 flex min-h-2/3 items-center justify-center"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
