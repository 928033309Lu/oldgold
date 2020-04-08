import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import lodash from 'lodash';
import VueLodash from 'vue-lodash';
import 'cesium/Widgets/widgets.css';
import VueIconFont from 'vue-icon-font';
import '@/assets/iconfont/iconfont.js';
import byteman from './libs/byteman';
import loading from './components/loading';
let Bus = new Vue();
Vue.prototype.Bus = Bus;
Vue.use(ElementUI);
Vue.use(VueLodash, lodash);
Vue.use(VueIconFont);
Vue.filter('byteman', function (value) {
    return byteman(value, 3, 'kb');
});

Vue.use(loading);

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
    }
});
