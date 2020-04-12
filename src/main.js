import Vue from 'vue'
import App from './App.vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
Vue.use(Vuesax)


// axios
import axios from "@/axios.js"
Vue.prototype.$http = axios


// Theme Configurations
import '../themeConfig.js'


// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css'


// Vue Router
import router from './router'


// Vuex Store
import store from './store/store'

// i18n
import i18n from './i18n/i18n'


// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)


// VeeValidate
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)


// VueDebounce
import vueDebounce from 'vue-debounce'
Vue.use(vueDebounce)


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'


// import VueTidio from 'vue-tidio';
// Vue.use(VueTidio, { appKey: '77fscjhhflm0kexipxspnyfeyulm4pz9' });

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import VueSocketIO from 'vue-socket.io'
import SocketIO from "socket.io-client"

Vue.use(new VueSocketIO({
  debug: false,
  connection: SocketIO(process.env.VUE_APP_VIDEO_API_URL),
}))

// Feather font icon
require('./assets/css/iconfont.css')

// adding moment globally
Vue.use(require('vue-moment'))

// Business Hours
import BusinessHours from 'vue-business-hours';
Vue.use(BusinessHours);

// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css';

Vue.config.productionTip = false

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
