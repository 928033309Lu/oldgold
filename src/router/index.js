import Vue from 'vue';
import VueRouter from 'vue-router';
import {routers} from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
};
// 在button上增加的权限指令
Vue.directive('t-role', (el,binding)=>{
        // 3 企业管理者
        if (binding.value === 3) {
            el.classList.add("Ash");
        }else{
            el.classList.remove("Ash");
        }
        if (binding.value != 9 && binding.value != 1 && binding.value != 10 ) {
            el.classList.add("Ayewu");
        }else{
            el.classList.remove("Ayewu");
        }
    },
);

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    if (!sessionStorage.getItem('goldfarm.loginUser') && to.name !== 'login' && to.name !== 'password' && to.name !== 'register' && to.name !== 'success') { // 判断是否已经登录且前往的页面不是登录页
        next({
            // name: 'login'
            path: '/login'
        });
        // } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
        //     next({
        //         name: 'home'
        //     });
    } else if (to.path === '/') {
        next({
            // name: 'login'
            path: '/login'
        });
    } else {
        next();
    }
});
