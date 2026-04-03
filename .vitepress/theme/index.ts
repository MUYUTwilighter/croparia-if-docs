import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import GameFloatBox from './components/GameFloatBox.vue'
import GameText from './components/GameText.vue'
import HomeLanding from './components/HomeLanding.vue'
import './custom.css'
import GameGuiFrame from "./components/GameGuiFrame.vue";
import GameSlot from "./components/GameSlot.vue";
import GameArrowButton from "./components/GameArrowButton.vue";
import GameItemDisplay from "./components/GameItemDisplay.vue";
import GameItemCard from "./components/GameItemCard.vue";
import GameItemEntry from "./components/GameItemEntry.vue";
import RecipeDisplay from "./components/recipe/RecipeDisplay.vue";
import CraftingRecipeDisplay from "./components/recipe/CraftingRecipeDisplay.vue";
import InfusorRecipeDisplayDisplay from "./components/recipe/InfusorRecipeDisplay.vue";
import RitualRecipeDisplay from "./components/recipe/RitualRecipeDisplay.vue";
import GameBlockEntry from "./components/GameBlockEntry.vue";
import SoakRecipeDisplay from "./components/recipe/SoakRecipeDisplay.vue";
import RowGallery from "./components/RowGallery.vue";

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GameArrowButton', GameArrowButton);
    app.component('GameFloatBox', GameFloatBox);
    app.component('GameGuiFrame', GameGuiFrame);
    app.component('GameItemCard', GameItemCard);
    app.component('GameItemDisplay', GameItemDisplay);
    app.component('GameBlockEntry', GameBlockEntry);
    app.component('GameItemEntry', GameItemEntry);
    app.component('GameSlot', GameSlot);
    app.component('GameText', GameText);
    app.component('RowGallery', RowGallery);
    app.component('CraftingRecipeDisplay', CraftingRecipeDisplay);
    app.component('InfusorRecipeDisplayDisplay', InfusorRecipeDisplayDisplay);
    app.component('RitualRecipeDisplay', RitualRecipeDisplay);
    app.component('SoakRecipeDisplay', SoakRecipeDisplay);
    app.component('RecipeDisplay', RecipeDisplay);
    app.component('HomeLanding', HomeLanding);
  }
}

export default theme
