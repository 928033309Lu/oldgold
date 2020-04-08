import util from '@/libs/util';

// 风机类型库
const turbineBase = {
    state: {
        turbinesList: [], // 机型列表
        turbinesWrgHeights: null, // 轮毂高度列表
        turbinesPowerCurves: {} // 功率曲线库
    },
    actions: {
        /**
         * 获取机型列表
         */
        getTurbinesList ({
            state,
            rootState
        }) {
            return new Promise((resolve, reject) => {
                if (state.turbinesList.length !== 0) {
                    console.log('getTurbinesList:cache');
                    resolve(state.turbinesList);
                    return;
                }

                console.log('getTurbinesList:request');
                let user_id = rootState.user.loginUserInfo.user_id;
                util.ajax.get('/properties/'+ user_id +'?key=turbines', {}).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        reject(retData);
                        return;
                    }
                    state.turbinesList = retData.data.items.map((ele, index, arr) => {
                        return {value: ele, label: ele};
                    });
                    resolve(state.turbinesList);
                }).catch((err) => {
                    reject(err);
                });
            });
        },
        /**
         * 轮毂高度列表
         */
        getTurbinesWrgHeights ({
            state,
            rootState
        }) {
            return new Promise((resolve, reject) => {
                if (state.turbinesWrgHeights) {
                    console.log('getTurbinesWrgHeights:cache');
                    resolve(state.turbinesWrgHeights);
                    return;
                }

                console.log('getTurbinesWrgHeights:request');
                let user_id = rootState.user.loginUserInfo.user_id;
                util.ajax.get('/properties/'+ user_id +'?key=turbine_height', {}).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        reject(retData);
                        return;
                    }
                    state.turbinesWrgHeights = retData.data.items;
                    resolve(state.turbinesWrgHeights);
                }).catch((err) => {
                    reject(err);
                });
            });
        },
        /**
         * 功率曲线库
         */
        getTurbinesPowerCurves ({
            state
        }, {turbineType, userId}) {
            return new Promise((resolve, reject) => {
                if (state.turbinesPowerCurves.hasOwnProperty(turbineType) && state.turbinesPowerCurves[turbineType].length > 0) {
                    // console.log('getTurbinesPowerCurves:cache');
                    resolve(state.turbinesPowerCurves[turbineType]);
                    return;
                }

                // console.log('getTurbinesPowerCurves:request');

                util.ajax.get('/input_power_curve?turbine_type=' + turbineType + '&user_id=' + userId).then((res) => {
                    if (res.data.code !== 200) {
                        reject(res.data);
                        return;
                    }
                    let arr = [];
                    if (res.data.data && res.data.data.length > 0) {
                        res.data.data.forEach((item) => {
                            arr.push({
                                value: item.file_name,
                                label: item.file_name
                            });
                        });
                    }
                    state.turbinesPowerCurves[turbineType] = arr;
                    resolve(arr);
                }).catch((err) => {
                    reject(err);
                });
            });
        }
    },
    mutations: {
        pushCurveList (state, data) {
            let arr = [];
            if (!state.turbinesPowerCurves.hasOwnProperty(data.turbine_type)) {
                arr.push({
                    label: data.power_curve_filename,
                    value: data.power_curve_filename
                });
                state.turbinesPowerCurves[data.turbine_type] = arr;
            } else {
                state.turbinesPowerCurves[data.turbine_type].push({
                    label: data.power_curve_filename,
                    value: data.power_curve_filename
                });
            }
        }
    }
};

export default turbineBase;