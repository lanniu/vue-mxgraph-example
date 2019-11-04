import 'element-ui/lib/theme-chalk/index.css';
import '@/style/mxgraph.css';
import '@/style/style.css';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 引入组件库及其组件库样式
import ElementUI from 'element-ui';

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
