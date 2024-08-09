import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from '@/router/index.js'
import axios from 'axios';
import '@mdi/font/css/materialdesignicons.css';


const app = createApp(App);

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

axios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                localStorage.removeItem('token');
                const response = await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/refresh-token`, { refreshToken });
                localStorage.setItem('token', response.data.result.token);
                window.location.reload();
            } catch (e) {
                console.log(e);
                localStorage.clear();
                window.location.href = "/login";

            }

        }
        return Promise.reject(error)
    }
)


app.use(router);
app.use(vuetify);
app.mount('#app');