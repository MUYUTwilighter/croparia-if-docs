import { createElement } from "react";
import { Box } from "@mui/material";
import type { MDXComponents } from "mdx/types";
import type { JSX, ComponentPropsWithoutRef } from "react";
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

function passthrough<T extends keyof JSX.IntrinsicElements>(tag: T) {
  return function Passthrough(props: ComponentPropsWithoutRef<T>) {
    return createElement(tag, props);
  };
}

export const mdxComponents: MDXComponents = {
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
  a: passthrough("a"),
  code: passthrough("code"),
  hr: passthrough("hr"),
  pre: (props) => <Box component="pre" {...props} />,
  blockquote: (props) => <Box component="blockquote" {...props} />,
  img: (props) => <Box component="img" {...props} />,
  details: (props) => <Box component="details" {...props} />,
  summary: (props) => <Box component="summary" {...props} />,
  table: ({ children, ...props }) => (
    <Box sx={{ my: 3, overflowX: "auto" }}>
      <Box component="table" {...props}>
        {children}
      </Box>
    </Box>
  ),
  thead: (props) => <Box component="thead" {...props} />,
  tbody: (props) => <Box component="tbody" {...props} />,
  tr: (props) => <Box component="tr" {...props} />,
  th: (props) => <Box component="th" {...props} />,
  td: (props) => <Box component="td" {...props} />,
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
