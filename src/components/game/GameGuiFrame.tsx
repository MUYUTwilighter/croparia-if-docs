export function GameGuiFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const frameClassName = ["game-gui-frame", className].filter(Boolean).join(" ");

  return (
    <div className={frameClassName}>
      <div
        className="game-gui-frame__border game-gui-frame__corner"
        style={{ backgroundImage: "url(/assets/gui/left-top.webp)" }}
      />
      <div
        className="game-gui-frame__border game-gui-frame__horizontal"
        style={{ backgroundImage: "url(/assets/gui/border-top.webp)" }}
      />
      <div
        className="game-gui-frame__border game-gui-frame__corner"
        style={{ backgroundImage: "url(/assets/gui/right-top.webp)" }}
      />

      <div
        className="game-gui-frame__border game-gui-frame__vertical"
        style={{ backgroundImage: "url(/assets/gui/border-left.webp)" }}
      />
      <div className="game-gui-frame__content">{children}</div>
      <div
        className="game-gui-frame__border game-gui-frame__vertical"
        style={{ backgroundImage: "url(/assets/gui/border-right.webp)" }}
      />

      <div
        className="game-gui-frame__border game-gui-frame__corner"
        style={{ backgroundImage: "url(/assets/gui/left-bottom.webp)" }}
      />
      <div
        className="game-gui-frame__border game-gui-frame__horizontal"
        style={{ backgroundImage: "url(/assets/gui/border-bottom.webp)" }}
      />
      <div
        className="game-gui-frame__border game-gui-frame__corner"
        style={{ backgroundImage: "url(/assets/gui/right-bottom.webp)" }}
      />
    </div>
  );
}
