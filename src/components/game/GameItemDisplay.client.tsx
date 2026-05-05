"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { GameFloatBox } from "@/src/components/game/GameFloatBox";
import { GameText } from "@/src/components/game/GameText";
import { useGameLocale } from "@/src/components/game/use-game-locale";
import type { EntryHooks, ItemData } from "@/src/lib/game/types";

interface GameItemDisplayViewProps extends EntryHooks {
  item: ItemData;
  id: string;
  count?: number;
  link?: string;
  size?: number;
  noFloatBox?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function GameItemDisplayView({
  item,
  id,
  count = 1,
  link,
  size = 16,
  noFloatBox = false,
  children,
  className,
  nameHook,
  idHook,
  categoryHook,
  tagHook,
}: GameItemDisplayViewProps) {
  const locale = useGameLocale();
  const displayRef = useRef<HTMLDivElement | null>(null);
  const floatBoxRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showFloatBox, setShowFloatBox] = useState(false);
  const [floatBoxTop, setFloatBoxTop] = useState(0);
  const [floatBoxLeft, setFloatBoxLeft] = useState(0);

  const hoverBackground = link || !noFloatBox ? "rgba(255, 255, 255, 0.5)" : "transparent";

  const localeName =
    nameHook?.(item.name[locale] || item.name.en || item.registerName, locale) ??
    (item.name[locale] || item.name.en || item.registerName);
  const categoryName =
    categoryHook?.(item.CreativeTabName[locale] || item.CreativeTabName.en || "Unknown", locale) ??
    (item.CreativeTabName[locale] || item.CreativeTabName.en || "Unknown");
  const displayId = idHook?.(id, locale) ?? id;
  const displayTags = tagHook?.(item.OredictList, locale) ?? item.OredictList;

  const cancelFrame = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const updateFloatBoxPosition = useCallback(() => {
    cancelFrame();
    frameRef.current = requestAnimationFrame(() => {
      const display = displayRef.current;
      const floatBox = floatBoxRef.current;
      if (!display || !floatBox) {
        return;
      }

      const displayRect = display.getBoundingClientRect();
      const floatRect = floatBox.getBoundingClientRect();
      const gap = 4;
      const maxLeft = Math.max(gap, window.innerWidth - floatRect.width - gap);
      const maxTop = Math.max(gap, window.innerHeight - floatRect.height - gap);

      setFloatBoxLeft(Math.min(displayRect.left, maxLeft));
      setFloatBoxTop(Math.min(displayRect.bottom + gap, maxTop));
    });
  }, [cancelFrame]);

  useEffect(() => {
    setMounted(true);
    return () => cancelFrame();
  }, [cancelFrame]);

  useEffect(() => {
    if (!showFloatBox) {
      return;
    }

    const handleViewportChange = () => updateFloatBoxPosition();
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);
    updateFloatBoxPosition();

    return () => {
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
      cancelFrame();
    };
  }, [cancelFrame, showFloatBox, updateFloatBoxPosition]);

  const tooltip = useMemo(() => {
    if (!mounted || !showFloatBox || noFloatBox) {
      return null;
    }

    return createPortal(
      <GameFloatBox
        ref={floatBoxRef}
        style={{
          position: "fixed",
          top: `${floatBoxTop}px`,
          left: `${floatBoxLeft}px`,
          zIndex: 999,
          pointerEvents: "none",
        }}
      >
        <GameText className="game-item-display__tooltip-name">{localeName}</GameText>
        <GameText color="#5454FC">{categoryName}</GameText>
        <GameText color="#545454">{displayId}</GameText>
        {children}
        {displayTags.map((tag) => (
          <GameText key={tag} color="#A7A7A7" fontStyle="italic">
            #{tag}
          </GameText>
        ))}
      </GameFloatBox>,
      document.body,
    );
  }, [categoryName, children, displayId, displayTags, floatBoxLeft, floatBoxTop, localeName, mounted, noFloatBox, showFloatBox]);

  return (
    <>
      <div
        ref={displayRef}
        className={["game-item-display", className].filter(Boolean).join(" ")}
        onMouseEnter={() => {
          if (!noFloatBox) {
            setShowFloatBox(true);
          }
        }}
        onMouseLeave={() => setShowFloatBox(false)}
        style={{ ["--game-item-hover-bg" as string]: hoverBackground }}
      >
        <img
          className="game-item-display__icon"
          src={item.largeIconSrc}
          alt={item.registerName}
          style={{
            width: `calc(var(--vp-unit-size) * ${size})`,
            height: `calc(var(--vp-unit-size) * ${size})`,
          }}
        />
        {count !== 1 ? <GameText className="game-item-display__count">{count.toString()}</GameText> : null}
        {link ? <a className="game-item-display__link" href={link} /> : null}
      </div>
      {tooltip}
    </>
  );
}
