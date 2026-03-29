import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import GameFloatBox from './components/GameFloatBox.vue'
import GameText from './components/GameText.vue'
import HomeLanding from './components/HomeLanding.vue'
import './custom.css'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GameFloatBox', GameFloatBox)
    app.component('GameText', GameText)
    app.component('HomeLanding', HomeLanding)
  }
}

export default theme
