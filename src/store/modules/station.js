const station = {
    state: {
        // 升压站编辑状态
        editedStation: false
    },
    mutations: {
        editedStation (state, status) {
            state.editedStation = status;
        }
    }
};

export default station;
