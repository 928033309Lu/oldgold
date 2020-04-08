const LOGIN_USER_KEY = 'goldfarm.loginUser';
const loginUserInfo = 'loginUserInfo';

const user = {
    state: {
        waitingShareClose: false,
        shareOpenScheme: false,
        loginUserInfo:{
            create_time: '' ,
            email: '' ,
            is_deleted: 0 ,
            is_new: 0 ,
            nickname: '' ,
            owner_id: 0 ,
            password: '',
            phone: '',
            role: 0 ,
            token: 0 ,
            update_time: '' ,
            user_id: null,
            username: ''
        },
        routerPath: null
    },
    mutations: {
        waitingShareClose (state, data) {
            state.waitingShareClose = true;
        },
        shareOpenScheme (state, data) {
            state.shareOpenScheme = true;
        },
        loginUserInfo (state, loginUser) {
            sessionStorage.setItem(LOGIN_USER_KEY, JSON.stringify(loginUser));
            state.loginUserInfo = loginUser;
            // console.log('loginUser',loginUser);
        },
        logout (state) {
            localStorage.removeItem('shareQuery');
            sessionStorage.removeItem(LOGIN_USER_KEY);
            sessionStorage.removeItem(loginUserInfo);
            // 目前仅一处使用 ，所以清险此会话OK.
            // sessionStorage.clear();
            state.loginUserInfo = {
                create_time: '' ,
                email: '' ,
                is_deleted: 0 ,
                is_new: 0 ,
                nickname: '' ,
                owner_id: 0 ,
                password: '',
                phone: '',
                role: 0 ,
                token: 0 ,
                update_time: '' ,
                user_id: null ,
                username: ''
            };
        },
        routerPath (state, routerPath) {
            state.routerPath = routerPath;
        }
    }
    // getters: {
    //     loginUser: state => {
    //         const loginUser = sessionStorage.getItem(LOGIN_USER_KEY);
    //         console.log(loginUser);
    //         return (loginUser ? JSON.parse(loginUser) : null);
    //     }
    // }
};

export default user;
