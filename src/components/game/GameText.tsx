import type { HTMLAttributes } from "react";

interface GameTextProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string;
  noShadow?: boolean;
  notFullLine?: boolean;
  fontStyle?: string;
  fontWeight?: string | number;
}

function getMcShadow(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    return "rgba(0, 0, 0, 0.35)";
  }

  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const factor = 0.25;

  return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
}

export function GameText({
  color = "#FCFCFC",
  noShadow = false,
  notFullLine = false,
  fontStyle = "normal",
  fontWeight = "normal",
  style,
  className,
  ...rest
}: GameTextProps) {
  return (
    <span
      className={["game-text", className].filter(Boolean).join(" ")}
      style={{
        display: notFullLine ? "inline" : "block",
        width: notFullLine ? "fit-content" : "auto",
        color,
        fontStyle,
        fontWeight,
        textShadow: noShadow ? "none" : `var(--vp-unit-size) var(--vp-unit-size) 0 ${getMcShadow(color)}`,
        ...style,
      }}
      {...rest}
    />
  );
}
