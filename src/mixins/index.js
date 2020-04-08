import util from '@/libs/util';

export default {
    methods: {

        doAddFans (projectId, planId, doIndex, callback) {
            const addFans = this.$store.state.scheme.addFans;
            // 添加风机
            if (addFans.length === 0) {
                this.doDeleteFans(projectId, planId, 0, callback);
            } else {
                let item = addFans[doIndex];
                util.ajax.post('/input_turbine/' + projectId + '/' + planId, {
                    turbine_name: item.turbine_name,
                    turbine_type: item.turbine_type,
                    height: item.height,
                    coordinate_x: item.coordinate_x,
                    coordinate_y: item.coordinate_y,
                    power_curve_filename: item.power_curve_filename
                    // latitude: item.latitude,
                    // longitude: item.longitude
                }).then((res) => {
                    let retData = res.data;
                    if (retData.code !== 201) {
                        this.$message.error('风机增加:' + retData.message);
                        return;
                    }
                    ++doIndex;
                    if (doIndex >= addFans.length) {
                        this.doDeleteFans(projectId, planId, 0, callback);
                    } else {
                        this.doAddFans(projectId, planId, doIndex, callback);
                    }
                }).catch((err) => {
                    console.error(err);
                    if (callback) {
                        callback({calcuate:false, saved:false,err:err });
                    }
                    this.$message.error('风机增加保存失败！');
                });
            }
        },

        doDeleteFans (projectId, planId, doIndex, callback) {
            const delFans = this.$store.state.scheme.delFans;
            if (delFans.length === 0) {
                this.doMoveFans(projectId, planId, 0, callback);
            } else {
                let item = delFans[doIndex];
                util.ajax.delete('/input_turbine/' + projectId + '/' + planId + '/' + item, {}).then((res) => {
                    let retData = res.data;
                    if (retData.code !== 204) {
                        this.$message.error('风机删除:' + retData.message);
                        return;
                    }
                    ++doIndex;
                    if (doIndex >= delFans.length) {
                        this.doMoveFans(projectId, planId, 0, callback);
                    } else {
                        this.doDeleteFans(projectId, planId, doIndex, callback);
                    }
                }).catch((err) => {
                    console.error(err);
                    if (callback) {
                        callback({calcuate:false, saved:false,err:err });
                    }
                    this.$message.error('风机删除保存失败！');
                });
            }
        },

        doMoveFans (projectId, planId, doIndex, callback) {
            const moveFans = this.$store.state.scheme.moveFans;
            if (moveFans.length === 0) {
                this.doChangeTypeFans(projectId, planId, 0, callback);
            } else {
                let item = moveFans[doIndex];
                util.ajax.put('/input_turbine/' + projectId + '/' + planId + '/' + item.turbine_id, {
                    // turbine_name: item.turbine_name,
                    // turbine_type: item.turbine_type,
                    // height: item.height,
                    coordinate_x: item.coordinate_x,
                    coordinate_y: item.coordinate_y
                    // latitude: item.latitude,
                    // longitude: item.longitude
                }).then(res => {
                    let retData = res.data;
                    if (retData.code !== 201) {
                        this.$message.error('位置变更:' + retData.message);
                        return;
                    }
                    ++doIndex;
                    if (doIndex >= moveFans.length) {
                        this.doChangeTypeFans(projectId, planId, 0, callback);
                    } else {
                        this.doMoveFans(projectId, planId, doIndex, callback);
                    }
                }).catch((err) => {
                    if (callback) {
                        callback({calcuate:false, saved:false,err:err });
                    }
                    this.$message.error('风机位置变更失败！');
                });
            }
        },

        doChangeTypeFans (projectId, planId, doIndex, callback) {
            const changFans = this.$store.state.scheme.typeChanges;
            if (changFans.length === 0) {
                this.doPlanPrice(projectId, planId, callback);
            } else {
                let item = changFans[doIndex];
                util.ajax.put('/input_turbine/' + projectId + '/' + planId + '/' + item.turbine_id, {
                    turbine_name: item.turbine_name,
                    turbine_type: item.turbine_type,
                    height: item.height,
                    // coordinate_x: item.coordinate_x,
                    // coordinate_y: item.coordinate_y,
                    power_curve_filename: item.power_curve_filename
                }).then(res => {
                    let retData = res.data;
                    if (retData.code !== 201) {
                        this.$message.error('改变机型:' + retData.message);
                        return;
                    }
                    ++doIndex;
                    if (doIndex >= changFans.length) {
                        this.doPlanPrice(projectId, planId, callback);
                    } else {
                        this.doChangeTypeFans(projectId, planId, doIndex, callback);
                    }
                }).catch((err) => {
                    if (callback) {
                        callback({calcuate:false, saved:false,err:err });
                    }
                    this.$message.error('风机改变机型失败！');
                });
            }
        },
        savePriceEle (projectId, planId) {
            const item = this.$store.state.scheme.fanPrice;
            let data = {args:'electric_price',tag:'',price:item.electric_price};
            return util.ajax.put('/scheme_price/' + projectId + '/' + planId, data ).then(res => {
                if (res.data.code !== 201) {
                    throw res.data.message;
                }
            }).catch((err) => {
                throw err;
            });
        },
        savePriceSte (projectId, planId) {
            const item = this.$store.state.scheme.fanPrice;
            let data = {args:'steel_price',tag:'',price:item.rebar_price};
            return util.ajax.put('/scheme_price/' + projectId + '/' + planId, data ).then(res => {
                if (res.data.code !== 201) {
                    throw res.data.message;
                }
            }).catch((err) => {
                throw err;
            });
        },
        savePriceTow (projectId, planId) {
            const item = this.$store.state.scheme.fanPrice;
            let data = {args:'tower_price',tag:'0',price:item.tower_price};
            return util.ajax.put('/scheme_price/' + projectId + '/' + planId, data ).then(res => {
                if (res.data.code !== 201) {
                    throw res.data.message;
                }
            }).catch((err) => {
                throw err;
            });
        },
        savePriceTowW (projectId, planId) {
            const item = this.$store.state.scheme.fanPrice;
            let data = {args:'tower_weight',tag:'0',weight:item.tower_weight};
            return util.ajax.put('/scheme_price/' + projectId + '/' + planId, data ).then(res => {
                if (res.data.code !== 201) {
                    throw res.data.message;
                }
            }).catch((err) => {
                throw err;
            });
        },
        savePriceTur (projectId, planId, tag, price) {
            let data = {args:'turbine_type', tag:tag, price:price};
            return util.ajax.put('/scheme_price/' + projectId + '/' + planId, data ).then(res => {
                if (res.data.code !== 201) {
                    throw res.data.message;
                }
            }).catch((err) => {
                throw err;
            });
        },
        savePriceTurs (projectId, planId) {
            let p = [];
            const item = this.$store.state.scheme.fanPrice;
            for (let k of item.extraMap.keys()) {
                const price = item.extraMap.get(k);
                const pt = this.savePriceTur(projectId, planId, k, price);
                p.push(pt);
            }

            Promise.all(p).then(() => {

            }).catch((err) => {
                this.mastUploading = false;
                throw err;
            });
        },
        doPlanPrice (projectId, planId, callback) {
            const priceModify = this.$store.state.scheme.priceModify;
            if (priceModify) {
                // // ---------以下为新接口---------------
                // const p1 = this.savePriceEle(projectId, planId);
                // const p2 = this.savePriceSte(projectId, planId);
                // const p3 = this.savePriceTow(projectId, planId);
                // const p4 = this.savePriceTowW(projectId, planId);
                // const p5 = this.savePriceTurs(projectId, planId);
                // Promise.all([p1, p2, p3, p4, p5]).then(() => {
                //     this.doCalculate(projectId, planId);
                // }).catch((/* err */) => {
                //     this.$message.error('保存电价失败！');
                // });

                //---------以下为一次性提交逻辑---------------
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const item = this.$store.state.scheme.fanPrice;
                let extra = {};
                for (let k of item.extraMap.keys()) {
                    extra[k] = item.extraMap.get(k);
                }

                let saveData = {
                    'price_data': {
                        anchor_price: item.anchor_price,
                        lifting_price: item.lifting_price,
                        electric_price: item.electric_price,
                        tower_weight: item.tower_weight,
                        steel_price: item.rebar_price,
                        turbine_price: extra,
                        tower_price: {0: item.tower_price}
                    }
                };
                console.log(saveData);
                // let saveData={
                //     "price_data": {
                //         "turbine_price": {
                //             "GW-131/2200": 3350,
                //             "GW-140/2500": 3350
                //         },
                //         "tower_price": {
                //             "0": 8000,
                //             "1": 8000,
                //             "2": 8000
                //         },
                //         "electric_price": 0.57,
                //         "steel_price": 6500,
                //         "tower_weight": 8000
                //     }
                // };
                util.ajax.put('/scheme_price/' + projectId + '/' + planId, saveData, config).then(res => {
                    let retData = res.data;
                    if (retData.code !== 201) {
                        this.$message.error('保存电价:' + retData.message);
                        return;
                    }
                    // this.waitingOneMinute = true;
                    this.doCalculate(projectId, planId, callback);
                }).catch(err => {
                    this.$message.error('保存电价失败！');
                    console.log(err);
                });

                //---------以下为原逻辑---------------
                // const item = this.$store.state.scheme.fanPrice;
                // let extra = '{';
                // for (let k of item.extraMap.keys()) {
                //     extra = extra + '"' + k + '":' + item.extraMap.get(k) + ',';
                // }
                // if (extra.length > 1) {
                //     extra = extra.substring(0, extra.length - 1) + '}';
                // }
                //
                // util.ajax.put('/scheme/' + projectId + '/' + planId, {
                //     electric_price: item.electric_price,
                //     tower_price: item.tower_price,
                //     tower_weight: item.tower_weight,
                //     rebar_price: item.rebar_price,
                //     extra: extra
                // }).then(res => {
                //     let retData = res.data;
                //     if (retData.code !== 201) {
                //         this.$message.error('保存电价:' + retData.message);
                //         return;
                //     }
                //     this.doCalculate(projectId, planId);
                // }).catch((/* err */) => {
                //     this.$message.error('保存电价失败！');
                // });
                //---------原逻辑到此为止---------------------
            } else {
                this.doCalculate(projectId, planId, callback);
            }
        },
        doCalculate (projectId, planId, callback) {
            const addFans = this.$store.state.scheme.addFans;
            const delFans = this.$store.state.scheme.delFans;
            const moveFans = this.$store.state.scheme.moveFans;
            const typeChanges = this.$store.state.scheme.typeChanges;

            let refresh = 'evaluation'; // 只修改了价格
            if (addFans.length > 0 || delFans.length > 0 || moveFans.length > 0) {
                // 机位点变更-重新计算所有信息-包括收益率
                refresh = 'afresh_scheme';
            } else if (typeChanges.length > 0) {
                // 没有机位点变更，但有类型修改，重新计算不走工程
                refresh = 'afresh_scheme_1';
            }

            util.ajax.post(`/calculate/${projectId}/${planId}`, {
                args: refresh
            }).then(res => {
                let retData = res.data;
                if (retData.code !== 200) {
                    this.$message.error('重新计算:' + retData.message);
                } else {
                    this.$message.success('正在重新计算...');
                    this.reloadPlan(projectId, planId, refresh, callback);
                    if (refresh === 'evaluation') {
                        this.planListShowing = false;
                    }
                    if (callback) {
                        callback({calcuate:true, saved:true });
                    }
                }
            }).catch((err) => {
                console.error('重新计算失败！');
                if (callback) {
                    callback({calcuate:false, saved:true,err:err });
                }
                // this.$message.error('重新计算失败！');
            });
        },
        reloadPlan (projectId, planId, refresh, callback) {
            // 方案一览
            util.ajax.get('/scheme_list/' + projectId, {
            }).then(res => {
                if (res.data.code !== 200) {
                    this.$message.error(res.data.message);
                } else {
                    let plans = res.data.data;
                    this.$store.commit('currentProjectPlans', plans);
                    let calculating = false;
                    for (let i = 0; i < plans.length; i++) {
                        let plan = plans[i];
                        if (plan.scheme_id === planId) {
                            this.$refs['planList'].setNewData(plan);
                            calculating = (plan.status_id === 1); // 1:计算中
                            this.$refs['functionBar'].setCalculating(calculating);
                            this.$store.commit('calculateStatus', plan.status_id);
                            break;
                        }
                    }

                    if (calculating) {
                        this.saveCheckTimer = setInterval(() => {
                            this.checkCalculatingOriginal(projectId, planId);
                        }, 10000);
                    } else {
                        
                    }
                }
            }).catch(err => {
                 // this.$message.error('获取方案数据失败！');
            });
            if (refresh) return null;
            /*
            From 杜：2018/10/10 14:18
            新版渲染地图时点位获取的接口是接口是http://10.32.23.122/api/output_pg_list/<pr/<project_id>/<scheme_id>，
                但是方案优化的点位数据提交的是input_turbine，这样会导致点击重新计算后点位会刷回原来的位置，
            所以需要点位还是像上一版一样通过样通过http://10.32.23.80/api/input_turbine/<pr/<project_id>/<scheme_id>这个接口获取
                */
            // 风机列表
            util.ajax.get('/input_turbine/' + projectId + '/' + planId, {
            // util.ajax.get('/output_pg_list/' + projectId + '/' + planId, {
            }).then(res => {
                let retData = res.data;
                if (retData.code !== 200) {
                    this.$message.error(retData.message);
                } else {
                    this.fans = res.data.data;
                    // 初期化风机
                    this.$refs['cesiumContainer'].initFanPositions(this.fans);
                    // 设置默认风图谱高度(取轮毂高度最多的那个高度)
                    this.turbineHeight = this.calculateFanHeight(this.fans);
                    this.$refs['functionBar'].resetWrgWeight(this.turbineHeight);
                }
            }).catch((err) => {
                // console.error(err);
                console.error('取得风机信息失败！');
                // this.$message.error('取得风机信息失败！');
            });

            // 机型价格
            util.ajax.get('/scheme_price/' + projectId + '/' + planId, {}).then((res) => {
                let retData = res.data;
                if (retData.code !== 200) {
                    this.$message.error(retData.message);
                } else {

                    let priceData = {
                        electric_price: retData.data.electric_price,
                        tower_price: retData.data.tower_type['钢塔'], // 钢塔价格
                        rebar_price: retData.data.steel_price,
                        tower_weight: retData.data.tower_weight,
                        anchor_price: retData.data.anchor_price,
                        lifting_price: retData.data.lifting_price,
                    };

                    // 机型价格解析
                    let extraMap = new Map();
                    let extraObj = retData.data.turbine_type;
                    for (let k of Object.keys(extraObj)) {
                        extraMap.set(k, extraObj[k]);
                    }
                    // let extraStr = retData.data.extra;
                    // // extraStr = '{"GW-66/1500": 1650, "GW-70/1500": 2650, "GW-77/1500": 3650}';
                    // let extra = extraStr ? extraStr.replace(/u/g, '').replace(/\'/g, '"') : null;
                    // let extraMap = new Map();
                    // if (extra) {
                    //     let extraObj = JSON.parse(extra);
                    //     for (let k of Object.keys(extraObj)) {
                    //         extraMap.set(k, extraObj[k]);
                    //     }
                    // }
                    priceData.extraMap = extraMap;

                    this.priceData = priceData;
                    this.$store.commit('resetPrice', priceData);
                }
            }).catch((err) => {
                console.error(err);
                console.error('取得机型价格数据失败！');
                // this.$message.error('取得机型价格数据失败！');
            });
        },

        checkCalculatingOriginal (projectId, planId, callback) {
            console.log(projectId, planId);
            // 方案一览
            util.ajax.get('/scheme_list/' + projectId, {}).then(res => {
                if (res.data.code !== 200) {
                    this.$message.error(res.data.message);
                } else {
                    let plans = res.data.data;
                    this.$store.commit('currentProjectPlans', plans);
                    let calculating = false;
                    for (let i = 0; i < plans.length; i++) {
                        let plan = plans[i];
                        if (plan.scheme_id === planId) {
                            calculating = (plan.status_id === 1); // 1:计算中
                            this.$store.commit('calculateStatus', plan.status_id);
                            if (!calculating) {
                                this.$refs['planList'].setNewData(plan);
                                this.$refs['functionBar'].setCalculating(calculating);
                            }
                            break;
                        }
                    }
                    if (!calculating) {
                        console.log('计算结束');
                        this.closeCheckTimer();
                        this.reloadPlan(projectId, planId, null, callback);
                        // 计算过程中阻止点击风机弹出详情
                        this.evaluationCalculating = false;
                        this.waitingOneMinute = false;
                    }
                }
            }).catch((err) => {
                console.error('获取方案数据失败！');
                if (callback) {
                    callback({calcuate_over:false, calcuate:true, saved:true,err:err });
                }
                // this.$message.error('获取方案数据失败！');
            });
        },

        closeCheckTimer () {
            if (!this.saveCheckTimer) {
                return;
            }
            clearInterval(this.saveCheckTimer);
            this.saveCheckTimer = null;
        }
    },
    data () {
        return {
            saveCheckTimer: null,
            calculatTimer: null
        };
    },
    beforeDestroy () {
        this.closeCheckTimer();
    }
};
