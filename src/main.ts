import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { installSeo } from './composables/useSeo'
import router from './router'
import './styles/main.css'

installSeo(router)

createApp(App).use(createPinia()).use(router).mount('#app')
