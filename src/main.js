import Vue from 'vue';
import { Button, NavBar, Card } from 'vant';
import VueLazyload from 'vue-lazyload';
import beforeEachHandle from '@action/beforeEach';
import { PLATFORM } from '@utils/config';
import App from './App.vue';
import router from './router';

const placeholder = require('@assets/icon/basic/placeholder_big.png');
require('@commoncss');

Vue.use(Button);
Vue.use(NavBar);
Vue.use(Card);
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: placeholder,
  error: placeholder,
});


Vue.config.productionTip = false;
Vue.config.devtools = process.env.VUE_APP_MODE !== 'production';
Vue.prototype.$DataStore = Vue.prototype.$DataStore || new Vue(); // 全局数据存储
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue(); // 事件中心提供全局访问

router.beforeEach((to, from, next) => {
  beforeEachHandle[PLATFORM](Vue, to, from, next);
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
