// Two-layer preview: base image + optional tinted overlay (uses BlendTintSprite for tint respecting grayscale)
import Box from "@mui/material/Box";
import React from "react";
import TintPic from "@site/src/components/TintPic";

export default function LayeredPic({ baseSrc, overlaySrc, overlayTint, size = 64, title }: { baseSrc: string; overlaySrc?: string; overlayTint?: string; size?: number; title?: string }) {
  return (
    <Box aria-label={title} sx={{ position: 'relative', width: size, height: size }}>
      <img src={baseSrc} alt="base" width={size} height={size} style={{ imageRendering: 'pixelated' }} />
      {overlaySrc && (
        overlayTint ? (
          <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <TintPic src={overlaySrc} color={overlayTint} size={size} border={false} />
          </Box>
        ) : (
          <img src={overlaySrc} alt="overlay" width={size} height={size} style={{ imageRendering: 'pixelated', position: 'absolute', inset: 0 }} />
        )
      )}
    </Box>
  );
}