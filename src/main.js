import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueClipboard from "vue-clipboard2";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueConfetti from "vue-confetti";

Vue.config.productionTip = false;
Vue.use(VueClipboard);
Vue.use(Vuetify, {
  theme: {
    background: "#F0F6FB"
  }
});
Vue.use(VueConfetti);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
