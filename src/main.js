import Vue from 'vue'
import App from './App.vue'
import router from './router' // Đảm bảo import router
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

// Thêm interceptor cho axios
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

new Vue({
  router, // Sử dụng router
  vuetify,
  render: h => h(App)
}).$mount('#app') 