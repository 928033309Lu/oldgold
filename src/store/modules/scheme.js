/**
 * 增加风机，删除风机，修改位置，修改电价，修改机型
 */
const scheme = {
    state: {
        yancurrentFans: [],
        originFans: [],
        currentFans: [], // 当前所有风机信息，基于originFans进行了新增、删除、修改等操作
        moveCurrentFans: [], // 移动后
        changeTypeTurbine: [], // 改变机型后
        changeHours: [], // 总变化数---
        addFans: [],
        delFans: [],
        moveFans: [],
        typeChanges: [],
        modified: false,
        lastmodified: null, // 最后修改时间
        originFanPrice: {},
        fanPrice: {},
        priceModify: false,
        haveTowerData: false,
        calculateStatus: null // 方案是否计算中
    },
    mutations: {
        // 当前方案是否有集电线路塔位数据
        haveTowerData (state, haveTowerData) {
            state.haveTowerData = haveTowerData;
        },
        calculateStatus (state, calculateStatus) {
            state.calculateStatus = '';
            state.calculateStatus = calculateStatus;
        },
        clearFans (state, data) {
            state.changeHours = [];
            state.moveCurrentFans = [];
            state.changeTypeTurbine = [];
        },
        changeHours (state, data, close) {
            state.changeHours.push(data);
        },
        moveCurrentFans (state, data, close) {
            state.moveCurrentFans.push(data);
        },
        changeTypeTurbine (state, data, close) {
            state.changeTypeTurbine.push(data);
        },
        updataTurbine (state, changeData) {
            state.currentFans.forEach((item, index) => {
                if (item.turbine_id == changeData.turbine_id) {
                    item.height = changeData.height;
                    item.equivalent_hours = changeData.equivalent_hours;
                    item.waked_speed = changeData.waked_speed;
                }
            })
        },
        resetModify (state, fans) {
            state.modified = false;
            state.originFans = [];
            state.currentFans = [];
            state.yancurrentFans = [];
            fans.forEach(fan => {
                state.originFans.push({...fan});
                state.currentFans.push({...fan});
                state.yancurrentFans.push({...fan});
            });
            state.delFans = [];
            state.addFans = [];
            state.typeChanges = [];
            state.moveFans = [];
            state.lastmodified = new Date();
        },
        // 回滚变更
        rollback (state) {
            state.modified = false;
            state.delFans = [];
            state.addFans = [];
            state.typeChanges = [];
            state.moveFans = [];
            state.currentFans = [];
            state.originFans.forEach(fan => {
                state.currentFans.push({...fan});
            });
            state.lastmodified = new Date();

            state.priceModify = false;
            state.fanPrice = {...state.originFanPrice};
            state.fanPrice.extraMap = new Map();
            for (let k of state.originFanPrice.extraMap.keys()) {
                state.fanPrice.extraMap.set(k, state.originFanPrice.extraMap.get(k));
            };
        },
        // 增加风机
        addTurbine (state, turbine) {
            state.addFans.push(turbine);
            state.currentFans.push(turbine);
            updateModified(state);
            state.lastmodified = new Date();
        },
        changeCurrentFansHours (state, data) {
            // console.log(data);
            for (let i = 0; i < state.currentFans.length; i++) {
                if (state.currentFans[i].turbine_id == data.id) {
                    state.currentFans[i].equivalent_hours = data.hours || 0;
                    break;
                }
            }
            // console.log(state.currentFans)
        },
        // 删除风机
        deleteTurbine (state, turbineId) {
            let newAddData = false;
            // 如果是本次新添加的风机，则从addFans中移除
            for (let index = 0; index < state.addFans.length; index++) {
                if (state.addFans[index].turbine_id === turbineId) {
                    state.addFans.splice(index, 1);
                    newAddData = true;
                    break;
                }
            }
            // 删除的是现有数据
            if (!newAddData) {
                state.delFans.push(turbineId);
            }
            
            // 从当前风机数组中移除
            for (let index = 0; index < state.currentFans.length; index++) {
                if (state.currentFans[index].turbine_id === turbineId) {
                    state.currentFans.splice(index, 1);
                    break;
                }
            }
            updateModified(state);
            state.lastmodified = new Date();
        },
        // 修改机型
        changeTurbineType (state, fanInfo) {

            // 更新现有数据中该风机的位置信息
            for (let i = 0; i < state.currentFans.length; i++) {
                if (state.currentFans[i].turbine_id === fanInfo.turbine_id) {
                    state.currentFans[i].turbine_type = fanInfo.turbine_type;  //机型
                    state.currentFans[i].power_curve_filename = fanInfo.power_curve_filename;  //功率曲线
                    state.currentFans[i].height = fanInfo.height; //轮毂高度
                    break;
                }
            }

            let newAddData = false;
            for (let index = 0; index < state.addFans.length; index++) {
                if (state.addFans[index].turbine_id === fanInfo.turbine_id) {
                    state.addFans[index].turbine_type = fanInfo.turbine_type;  //机型
                    state.addFans[index].power_curve_filename = fanInfo.power_curve_filename;  //功率曲线
                    state.addFans[index].height = fanInfo.height; //轮毂高度
                    newAddData = true;
                    break;
                }
            }
            // 如果移动的是新增的风机
            if (newAddData) {
                state.lastmodified = new Date();
                return;
            }

            let find = false;
            for (let index = 0; index < state.typeChanges.length; index++) {
                let data = state.typeChanges[index];
                if (data.turbine_id === fanInfo.turbine_id) {
                    state.typeChanges[index].turbine_type = fanInfo.turbine_type;  //机型
                    // author by donghong 当调整机型时，下面两个属性也同时修改了 2018/12/20
                    state.typeChanges[index].power_curve_filename = fanInfo.power_curve_filename;  //功率曲线
                    state.typeChanges[index].height = fanInfo.height; //轮毂高度
                    find = true;
                    break;
                }
            }
            if (!find) {
                state.typeChanges.push(fanInfo);
                updateModified(state);
            }
            state.lastmodified = new Date();
        },
        // 移动位置
        moveTurbine (state, fanInfo) {
            let point = window.viewer.BLH2XYZ({ x: fanInfo.longitude, y: fanInfo.latitude });
            fanInfo.coordinate_x = point.x;
            fanInfo.coordinate_y = point.y;
            // 等效小时数，机型用的，
            for (let i = 0; i < state.changeTypeTurbine.length; i++) {
                if (state.changeTypeTurbine[i].turbine_id === fanInfo.turbine_id) {
                    state.changeTypeTurbine[i].longitude = fanInfo.longitude;
                    state.changeTypeTurbine[i].latitude = fanInfo.latitude;
                    state.changeTypeTurbine[i].coordinate_x = point.x;
                    state.changeTypeTurbine[i].coordinate_y = point.y;
                    break;
                }
            }
            // 更新现有数据中该风机的位置信息
            for (let i = 0; i < state.currentFans.length; i++) {
                if (state.currentFans[i].turbine_id === fanInfo.turbine_id) {
                    state.currentFans[i].longitude = fanInfo.longitude;
                    state.currentFans[i].latitude = fanInfo.latitude;
                    state.currentFans[i].coordinate_x = point.x;
                    state.currentFans[i].coordinate_y = point.y;
                    break;
                }
            }

            let newAddData = false;
            for (let index = 0; index < state.addFans.length; index++) {
                if (state.addFans[index].turbine_id === fanInfo.turbine_id) {
                    state.addFans[index].longitude = fanInfo.longitude;
                    state.addFans[index].latitude = fanInfo.latitude;
                    state.addFans[index].coordinate_x = point.x;
                    state.addFans[index].coordinate_y = point.y;
                    newAddData = true;
                    break;
                }
            }
            // 如果移动的是新增的风机
            if (newAddData) {
                state.lastmodified = new Date();
                return;
            }

            let find = false;
            for (let index = 0; index < state.moveFans.length; index++) {
                let data = state.moveFans[index];
                if (data.turbine_id === fanInfo.turbine_id) {
                    // 如果该风机之前移动过，则只更新信息
                    state.moveFans[index] = fanInfo;
                    find = true;
                    break;
                }
            }

            if (!find) {
                // 如果是新移动的风机，则添加到移动风机数组中
                state.moveFans.push(fanInfo);
                updateModified(state);
            }
            state.lastmodified = new Date();
        },
        resetPrice (state, price) {
            state.priceModify = false;
            state.originFanPrice = {...price};
            state.originFanPrice.extraMap = new Map();
            for (let k of price.extraMap.keys()) {
                state.originFanPrice.extraMap.set(k, price.extraMap.get(k));
            };

            state.fanPrice = price;
        },
        // 价格调整 
        priceModify (state, fanInfo) {
            console.log(fanInfo);
            let change = false;
            if (state.fanPrice.electric_price !== fanInfo.electric_price) {
                state.fanPrice.electric_price = fanInfo.electric_price;
                change = true;
            }
            if (state.fanPrice.anchor_price !== fanInfo.anchor_price) {
                state.fanPrice.anchor_price = fanInfo.anchor_price;
                change = true;
            }
            if (state.fanPrice.lifting_price !== fanInfo.lifting_price) {
                state.fanPrice.lifting_price = fanInfo.lifting_price;
                change = true;
            }
            if (state.fanPrice.tower_price !== fanInfo.tower_price) {
                state.fanPrice.tower_price = fanInfo.tower_price;
                change = true;
            }
            if (state.fanPrice.rebar_price !== fanInfo.rebar_price) {
                state.fanPrice.rebar_price = fanInfo.rebar_price;
                change = true;
            }
            if (state.fanPrice.tower_weight !== fanInfo.tower_weight) {
                state.fanPrice.tower_weight = fanInfo.tower_weight;
                change = true;
            }

            if (state.fanPrice.extraMap === null) {
                state.fanPrice.extraMap = new Map();
            }
            for (let k of fanInfo.extraMap.keys()) {
                let value = fanInfo.extraMap.get(k);
                if (state.fanPrice.extraMap.has(k)) {
                    if (state.fanPrice.extraMap.get(k) !== value) {
                        state.fanPrice.extraMap.set(k, value);
                        change = true;
                    }
                } else {
                    state.fanPrice.extraMap.set(k, value);
                    change = true;
                }
            }
            for (let k of state.fanPrice.extraMap.keys()) {
                if (!fanInfo.extraMap.has(k)) {
                    state.fanPrice.extraMap.delete(k);
                    change = true;
                }
            };

            if (change) {
                state.priceModify = change;
            }
        }
    }
};

function updateModified (state) {
    state.modified = state.addFans.length !== 0 || state.delFans.length !== 0 || state.moveFans.length !== 0 || state.typeChanges.length !== 0;
}
export default scheme;
