import Box from "@mui/material/Box";
import React from "react";

export interface Props {
  src: string;
  color: string;
  size?: number;
  title?: string;
  border?: boolean;
}

export default function TintPic({src, color, size = 48, title, border = true}: Props) {
  return (
    <Box aria-label={title}
         sx={{
           position: 'relative',
           width: size,
           height: size,
           backgroundImage: `url(${src}), linear-gradient(${color}, ${color})`,
           backgroundBlendMode: 'multiply',
           backgroundSize: 'contain, contain',
           backgroundRepeat: 'no-repeat, no-repeat',
           backgroundPosition: 'center, center',
           imageRendering: 'pixelated',

           WebkitMaskImage: `url(${src})`,
           WebkitMaskRepeat: 'no-repeat',
           WebkitMaskSize: 'contain',
           WebkitMaskPosition: 'center',
           maskImage: `url(${src})`,
           maskRepeat: 'no-repeat',
           maskSize: 'contain',
           maskPosition: 'center',

           ['maskMode' as any]: 'alpha',
           border: border ? '1px solid' : 'none',
           borderColor: 'divider',
           borderRadius: 0.5,
         }}
    />
  );
}
