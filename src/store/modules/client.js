
const client = {
    state: {
        screenWidth: document.documentElement.clientWidth,
        screenHeight: document.documentElement.clientHeight,
        globeLoading: false,
        globeLoadingText: ''
    },
    mutations: {
        screenWidth (state, screenWidth) {
            state.screenWidth = screenWidth;
        },
        screenHeight (state, screenHeight) {
            state.screenHeight = screenHeight;
        },
        /**
         * 全局loading状态
         */
        globeLoading (state, {loading = false, text = ''}) {
            state.globeLoading = loading;
            state.globeLoadingText = text;
        }
        
    },
    actions: {
    },
    getters: {}
};

export default client;
