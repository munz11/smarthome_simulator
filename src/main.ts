import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue } from 'bootstrap-vue'
Vue.use(BootstrapVue);

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

//backend service

import smartHomeBackend from "./services/smartHomeBackend";
Vue.prototype.$smartHomeBackend = new smartHomeBackend();




Vue.config.productionTip = false;



new Vue({
  router,
  render: (h: any) => h(App),
}).$mount("#app");

document.title = "Smarthome Simulator";
