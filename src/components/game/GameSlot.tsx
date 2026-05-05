export function GameSlot({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={["game-slot", className].filter(Boolean).join(" ")}>{children}</div>;
}
