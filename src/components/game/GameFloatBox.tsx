import { forwardRef, type HTMLAttributes } from "react";

interface GameFloatBoxProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GameFloatBox = forwardRef<HTMLDivElement, GameFloatBoxProps>(function GameFloatBox(
  { children, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={["game-float-box", className].filter(Boolean).join(" ")} {...rest}>
      <div />
      <div className="game-float-box__h-outer" />
      <div className="game-float-box__h-outer" />
      <div className="game-float-box__h-outer" />
      <div />

      <div className="game-float-box__v-outer" />
      <div className="game-float-box__h-inner-top" />
      <div className="game-float-box__h-inner-top" />
      <div className="game-float-box__h-inner-top" />
      <div className="game-float-box__v-outer" />

      <div className="game-float-box__v-outer" />
      <div className="game-float-box__v-inner" />
      <div className="game-float-box__content">{children}</div>
      <div className="game-float-box__v-inner" />
      <div className="game-float-box__v-outer" />

      <div className="game-float-box__v-outer" />
      <div className="game-float-box__h-inner-bottom" />
      <div className="game-float-box__h-inner-bottom" />
      <div className="game-float-box__h-inner-bottom" />
      <div className="game-float-box__v-outer" />

      <div />
      <div className="game-float-box__h-outer" />
      <div className="game-float-box__h-outer" />
      <div className="game-float-box__h-outer" />
      <div />
    </div>
  );
});
