import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import HomeLanding from './components/HomeLanding.vue'
import './custom.css'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeLanding', HomeLanding)
  }
}

export default theme
