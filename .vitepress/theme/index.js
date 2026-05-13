import DefaultTheme from 'vitepress/theme-without-fonts'
import { h } from 'vue'
import ChatWidget from './components/ChatWidget.vue'
import './custom.css'

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            'layout-bottom': () => h(ChatWidget)
        })
    },
}