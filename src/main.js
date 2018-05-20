import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import router from './router';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import axios from './axios';
import VueAxios from 'vue-axios';
import store from './store/store';

/*import './js/jquery.js'
import './js/swiper.js'	

import './css/style.css'
import './css/swiper.css'*/

Vue.use(VueAxios,axios);

Vue.use(iView);

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});