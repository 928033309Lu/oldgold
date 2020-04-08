// 定义路由表
export const routers = [
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/login.vue')
    },

    // 主页
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/home.vue')
    },

    // 后评估模式页面
    {
        path: '/assess',
        name: 'assess',
        component: () => import('@/views/assess/assess-home.vue')
    },

    // 修改密码
    {
        path: '/passTag',
        name: 'passTag',
        component: () => import('@/views/password/password.vue')
    },
    {
        path: '/password',
        name: 'password',
        component: () => import('@/views/password/password.vue')
    },
    // 注册
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/register/register.vue')
    },
    {
        path: '/registerTag',
        name: 'registerTag',
        component: () => import('@/views/register/register.vue')
    },
    // 成功
    {
        path: '/success',
        name: 'success',
        component: () => import('@/views/success/success.vue')
    },
    // upload
    {
        path: '/test',
        name: 'apiTest',
        component: () => import('@/components/upload/folderTable.vue')
    },
];
