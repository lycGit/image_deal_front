import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import config from './lib/config/config.js';

const app = createApp(App)
app.use(router)
app.config.productionTip = false
app.use(config);

app.mount('#app')
