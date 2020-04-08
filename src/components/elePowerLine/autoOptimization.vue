<template>
    <el-dialog
            title="自动优化排塔"
            :visible.sync="calcVisible"
            width="340px"
            class="autoOptimization"
            :before-close="beforeClose"
            :modal="false"
    >
        <div class="tab">
            <p v-bind:class="{ active: isdf === 1 }" @click="isdf=1">等距排塔</p>
            <p v-bind:class="{ active: isdf === 0 }" @click="isdf=0">精细排塔</p>
        </div>
        <el-form label-width="130px">
            <el-form-item label="耐张塔杆塔型号：" style="margin-bottom: 10px !important;">
                <el-select popper-class="gf-popper" v-model="valueType1" placeholder="请选择杆塔型号" style="width:100%;" @change="valueType2Change" >
                    <el-option v-for="(item, index) in towerTypeList"
                               :key="3100+index"
                               :label="item"
                               :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="垂悬塔杆塔型号：">
                <el-select popper-class="gf-popper" v-model="valueType2" placeholder="请选择杆塔型号" style="width:100%;" @change="valueType2Change" >
                    <el-option v-for="(item, index) in towerTypeList"
                               :key="3600+index"
                               :label="item"
                               :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <div style="text-align: center;margin-top: 30px">
                <el-button style="width: 120px;height: 34px;line-height: 2px;" class="gf-button" type="primary" @click="submitData">确定</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
    import axios from 'axios';
    import util from '@/libs/util';

    export default {
        name: 'autoOptimization',
        data () {
            return {
                defalutToweriInfo: null,
                defaultChuanInfo: null,
                valueType1: '',
                valueType2: '',
                checkList: [],
                isdf: 0,
                calcVisible: false,
                projectId: null,
                planId: null,
                data: [],
                towerTypeList: [],
                originalType1: null,
                originalType2: null
            };
        },
        methods: {
            open (productId, planId) {
                this.calcVisible = true;
                this.projectId = productId;
                this.planId = planId;
                this.defaultChuanInfo = window.viewer.getDefaultChuanInfo();
                this.initData();
            },
            beforeClose (done) {
                this.$emit('autoOptimizationClose');
                done();
            },
            valueType1Change (value) {
                this.data.map((item) => {
                    item.towerData && item.towerData.map((item1) => {
                        if (item1.attachMode === '2') {
                            item1.type = value;
                        }
                    });
                });
            },
            valueType2Change (value) {
                this.data.map((item) => {
                    item.towerData && item.towerData.map((item1) => {
                        if (item1.attachMode === '1') {
                            item1.type = value;
                        }
                    });
                });
            },
            initData () {
                // 获取塔型列表
                util.Xianluajax.get('/getalltowertype').then(res => {
                    if (res.data.code !== 0) return this.$message.error('获取塔型失败');
                    this.towerTypeList = res.data.data.tower;
                }).catch(err => {
                    this.$message.error('获取塔型失败');
                    console.error(`获取塔型失败${err}`);
                });
                // 获取默认塔型
                util.Xianluajax.get('/getdefaulttowertype', {
                    params: {
                        project_id: this.projectId,
                        scheme_id: this.planId
                    }
                }).then(res => {
                    if (res.data.code !== 0) return this.$message.error(res.data.data);
                    if (res.data.data.default === {}) return this.$message.error('默认塔型数据为空');
                    this.valueType1 = res.data.data.default['1'][0];
                    this.valueType2 = res.data.data.default['2'][0];
                }).catch(err => {
                    this.$message.error('获取默认塔型失败');
                    console.error(`获取默认塔型失败${err}`);
                });
            },
            // 修改方案状态
            changePlanStatus () {
                return new Promise((resolve, reject) => {
                    let data = new FormData();
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    };
                    data.append('status_id', '1');
                    util.ajax.put(`/scheme/${this.projectId}/${this.planId}`, data, config).then(res => {
                        if (res.data.code === 201) {
                            console.log(res.data.message);
                        }
                        resolve('修改方案状态成功');
                    }).catch((err) => {
                        console.error('修改计算状态失败');
                        this.$message.error('修改计算状态失败');
                        reject(err);
                    });
                });
            },
            calculateTower () {
                util.Xianluajax.get('/calculatetowerWithType', {
                    params: {
                        project_id: this.projectId,
                        scheme_id: this.planId,
                        linetype: this.valueType2,
                        straintype: this.valueType1,
                        isdf: this.isdf
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.calcVisible = false;
                        this.changePlanStatus()
                            .then(res => {
                                console.log(res);
                                this.$message.success('开始计算...');
                                this.$emit('reCalculating');
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    } else {
                        this.$message.error('计算失败');
                    }
                }).catch(err => {
                    console.error(err);
                    this.$message.error('计算失败');
                });
            },
            submitData () {
                this.$confirm('重新计算将覆盖现有方案成果，无法回退，确认发起重新计算？', '重新计算', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'road-detail-quit-message'
                })
                    .then(() => {
                        this.calculateTower();
                    })
                    .catch(action => {});
            }
        }
    };
</script>

<style lang="less" scoped>
    .tab{
        height: 59px;
        text-align: center;
        line-height: 24px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        margin-top: -27px;

        .active{
            background-color: rgba(51,200,111,0.6);
        }
        p{
            color: #D4EFF6;
            width: 80px;
            height: 24px;
            font-size: 14px;
            border-radius: 10px;
            cursor:pointer;
        }
    }
    .unit{
        display: inline-block;
        color: RGBA(212, 239, 246, 1);
    }
    .autoOptimization{
        .form-item {
            color: #33C86F !important;
            padding: 8px 0px;
        }

        /deep/ .el-input__inner {
            color: #33C86F !important;
        }

        /deep/ .el-checkbox {
            color: #ffffff;
        }

        /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #ffffff;
        }
    }
</style>
