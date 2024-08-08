import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from '@/router/index.js'
import '@mdi/font/css/materialdesignicons.css'
import router from '@/router/index.js'
// import axios from 'axios';


const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(router);
app.mount('#app');