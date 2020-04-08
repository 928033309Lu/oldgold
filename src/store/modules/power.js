const power = {
    state: {
        // 线路编辑状态
        editedPower: false
    },
    mutations: {
        editedPower (state, status) {
            state.editedPower = status;
        }
    }
};

export default power;
