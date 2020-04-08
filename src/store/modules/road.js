const road = {
    state: {
        // 实时回传移动的点位坐标
        roadStartPoint: {
            lon: '', // 经度
            lat: '' // 纬度
        },
        // 道路编辑状态
        editedRoad: false
    },
    mutations: {
        roadStartPoint (state, roadInfo) {
            console.log(roadInfo);
            state.roadStartPoint = roadInfo;
        },
        editedRoad (state, status) {
            console.log(`道路处于编辑状态了吗？${status}`);
            state.editedRoad = status;
        }
    }
};

export default road;
