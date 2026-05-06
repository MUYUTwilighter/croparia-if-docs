import { createElement } from "react";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import type { MDXComponents } from "mdx/types";
import type { JSX, ComponentPropsWithoutRef } from "react";
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

export const mdxComponents: MDXComponents = {
  div: passthrough("div"),
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
  a: DocLink,
  code: passthrough("code"),
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
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  GameArrowButton,
  GameBlockEntry,
  GameFloatBox,
  GameGuiFrame,
  GameItemCard,
  GameItemDisplay,
  GameItemEntry,
  GameSlot,
  GameText,
  RowGallery,
  CraftingRecipeDisplay,
  InfusorRecipeDisplay,
  RecipeDisplay,
  RitualRecipeDisplay,
  RitualStructureDisplay,
  SoakRecipeDisplay,
};

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
