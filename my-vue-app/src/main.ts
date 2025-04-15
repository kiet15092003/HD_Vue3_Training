import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query';
import directives from './directives'

const pinia = createPinia();

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin);

// Register all custom directives
app.directive('focus', directives.focus);

app.mount('#app')
