import { createElement } from "react";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import type { MDXComponents } from "mdx/types";
import type { JSX, ComponentPropsWithoutRef, ElementType } from "react";
import type { TypographyProps } from "@mui/material/Typography";
import { DocLink } from "@/src/components/docs/doc-link";
import { GameArrowButton } from "@/src/components/game/GameArrowButton";
import { GameBlockEntry } from "@/src/components/game/GameBlockEntry";
import { GameFloatBox } from "@/src/components/game/GameFloatBox";
import { GameGuiFrame } from "@/src/components/game/GameGuiFrame";
import { GameItemCard } from "@/src/components/game/GameItemCard";
import { GameItemDisplay } from "@/src/components/game/GameItemDisplay";
import { GameItemEntry } from "@/src/components/game/GameItemEntry";
import { GameSlot } from "@/src/components/game/GameSlot";
import { GameText } from "@/src/components/game/GameText";
import { RowGallery } from "@/src/components/game/RowGallery";
import { CraftingRecipeDisplay } from "@/src/components/game/recipe/CraftingRecipeDisplay";
import { InfusorRecipeDisplay } from "@/src/components/game/recipe/InfusorRecipeDisplay";
import { RecipeDisplay } from "@/src/components/game/recipe/RecipeDisplay";
import { RitualRecipeDisplay } from "@/src/components/game/recipe/RitualRecipeDisplay";
import { RitualStructureDisplay } from "@/src/components/game/recipe/RitualStructureDisplay";
import { SoakRecipeDisplay } from "@/src/components/game/recipe/SoakRecipeDisplay";

function normalizeMdxHtmlProps<T extends Record<string, unknown>>(props: T): T {
  if (!("class" in props) || "className" in props) {
    return props;
  }

  const { class: classProp, ...rest } = props as T & { class?: unknown; className?: unknown };
  return {
    ...rest,
    className: classProp,
  } as T;
}

function passthrough<T extends keyof JSX.IntrinsicElements>(tag: T) {
  return function Passthrough(props: ComponentPropsWithoutRef<T>) {
    return createElement(tag, normalizeMdxHtmlProps(props));
  };
}

function withNormalizedProps<T extends ElementType>(Component: T) {
  return function NormalizedComponent(props: Record<string, unknown>) {
    return createElement(Component, normalizeMdxHtmlProps(props));
  };
}

function Div(props: ComponentPropsWithoutRef<"div">) {
  const normalized = normalizeMdxHtmlProps(props);
  const className = typeof normalized.className === "string" ? normalized.className : "";

  if (className.split(/\s+/).includes("doc-center")) {
    const { children, className: _className, ...rest } = normalized;

    return (
      <Box sx={{ my: 3, width: "100%", overflowX: "auto", overflowY: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: "center", width: "max-content", minWidth: "100%" }}>
          {createElement("div", rest, children)}
        </Box>
      </Box>
    );
  }

  return createElement("div", normalized);
}

function SafeTypography(props: TypographyProps) {
  const { component, ...rest } = props;
  const resolvedComponent = component === "p" ? "div" : component;

  if (resolvedComponent) {
    return <Typography component={resolvedComponent as ElementType} {...rest} />;
  }

  return <Typography {...rest} />;
}

export const mdxComponents: MDXComponents = {
  div: Div,
  span: passthrough("span"),
  h1: passthrough("h1"),
  h2: passthrough("h2"),
  h3: passthrough("h3"),
  h4: passthrough("h4"),
  h5: passthrough("h5"),
  h6: passthrough("h6"),
  p: passthrough("p"),
  ul: passthrough("ul"),
  ol: passthrough("ol"),
  li: passthrough("li"),
  strong: passthrough("strong"),
  em: passthrough("em"),
  a: withNormalizedProps(DocLink),
  code: passthrough("code"),
  figure: passthrough("figure"),
  figcaption: passthrough("figcaption"),
  hr: passthrough("hr"),
  pre: passthrough("pre"),
  blockquote: passthrough("blockquote"),
  img: passthrough("img"),
  details: passthrough("details"),
  summary: passthrough("summary"),
  table: ({ children, ...props }) => (
    <Box sx={{ my: 3, overflowX: "auto" }}>
      {createElement("table", normalizeMdxHtmlProps(props), children)}
    </Box>
  ),
  thead: passthrough("thead"),
  tbody: passthrough("tbody"),
  tr: passthrough("tr"),
  th: passthrough("th"),
  td: passthrough("td"),
  DocLink: withNormalizedProps(DocLink),
  Box: withNormalizedProps(Box),
  Stack: withNormalizedProps(Stack),
  Typography: withNormalizedProps(SafeTypography),
  Button: withNormalizedProps(Button),
  Card: withNormalizedProps(Card),
  CardContent: withNormalizedProps(CardContent),
  GameArrowButton: withNormalizedProps(GameArrowButton),
  GameBlockEntry: withNormalizedProps(GameBlockEntry),
  GameFloatBox: withNormalizedProps(GameFloatBox),
  GameGuiFrame: withNormalizedProps(GameGuiFrame),
  GameItemCard: withNormalizedProps(GameItemCard),
  GameItemDisplay: withNormalizedProps(GameItemDisplay),
  GameItemEntry: withNormalizedProps(GameItemEntry),
  GameSlot: withNormalizedProps(GameSlot),
  GameText: withNormalizedProps(GameText),
  RowGallery: withNormalizedProps(RowGallery),
  CraftingRecipeDisplay: withNormalizedProps(CraftingRecipeDisplay),
  InfusorRecipeDisplay: withNormalizedProps(InfusorRecipeDisplay),
  RecipeDisplay: withNormalizedProps(RecipeDisplay),
  RitualRecipeDisplay: withNormalizedProps(RitualRecipeDisplay),
  RitualStructureDisplay: withNormalizedProps(RitualStructureDisplay),
  SoakRecipeDisplay: withNormalizedProps(SoakRecipeDisplay),
};

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
