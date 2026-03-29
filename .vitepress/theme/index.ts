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

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GameArrowButton', GameArrowButton);
    app.component('GameFloatBox', GameFloatBox);
    app.component('GameGuiFrame', GameGuiFrame);
    app.component('GameItemCard', GameItemCard);
    app.component('GameItemDisplay', GameItemDisplay);
    app.component('GameSlot', GameSlot);
    app.component('GameText', GameText);
    app.component('HomeLanding', HomeLanding);
  }
}

export default theme
