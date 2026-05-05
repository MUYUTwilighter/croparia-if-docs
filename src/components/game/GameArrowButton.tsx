"use client";

type Direction = "up" | "down" | "left" | "right";

interface GameArrowButtonProps {
  direction?: Direction;
  size?: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseOver?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export function GameArrowButton({
  direction = "up",
  size = 12,
  onClick,
  onMouseOver,
  disabled = false,
}: GameArrowButtonProps) {
  return (
    <button
      type="button"
      className="game-arrow-button"
      disabled={disabled}
      onClick={onClick}
      onMouseOver={onMouseOver}
      style={{
        width: `calc(var(--vp-unit-size) * ${size})`,
        height: `calc(var(--vp-unit-size) * ${size})`,
        backgroundImage: `url(/assets/gui/arrow-button/${direction}-dark.webp)`,
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundImage = `url(/assets/gui/arrow-button/${direction}-white.webp)`;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundImage = `url(/assets/gui/arrow-button/${direction}-dark.webp)`;
      }}
    />
  );
}
