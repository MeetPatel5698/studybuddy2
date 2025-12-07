import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import BootstrapVue3 from 'bootstrap-vue-3';

import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(router);
app.use(BootstrapVue3);
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
});

app.mount('#app');
