<style lang="less" scoped>
@import "../../styles/common.less";
@import "./road-steps.less";

.unit{
      display: inline-block;
}
</style>
<template>
    <div class="steps-container">
        <div class="step-item" v-for="(item, index) in steps" :class="{active:item.isActive}" :key="999+index">
            <div class="flag">
                <div class="circle">{{index+1}}</div>
                <div class="tooltip" @click="goHandle(item)">{{item.label}}</div>
            </div>
            <div class="line" v-if="item.index!==5"></div>
            <!--设计参数-->
            <div :class="item.contentClass" v-if="item.index === 1 && item.isActive">
                <el-form ref="designPara" :model="designPara" label-width="85px">
                    <el-form-item label="道路宽度：">
                        <el-input class="gf-input short-input" v-model="designPara.roadWidth"  @input="validateRoadWidth" @blur="tofixed('roadWidth')"></el-input>
                        <div style="color: #D4EFF6; opacity: 0.5" class="unit" >米
                            <err-tip ref="roadWidthErrTip" errMsg="请输入4至100之间的数值"
                                 style="margin-top:-25px;margin-left: 10px;"/>
                        </div>
                    </el-form-item>
                    <el-form-item label="最大坡度：">
                        <el-input class="gf-input short-input" v-model="designPara.maxSlope" @input="validateMaxSlope" @blur="tofixed('maxSlope')"></el-input>
                        <div style="color: #D4EFF6; opacity: 0.5" class="unit" >度
                            <err-tip ref="maxSlopeErrTip" errMsg="请输入5至30之间的数值"
                                 style="margin-top:-25px;margin-left: 10px;"/>
                        </div>
                    </el-form-item>
                    <el-form-item label="桩点间距：">
                        <span style="color: #D4EFF6; opacity: 0.5" >{{designPara.pileSpacing}}</span>
                        <!-- <el-input class="gf-input short-input" v-model="designPara.pileSpacing" @input="validatePileSpacing" @blur="tofixed('pileSpacing')"></el-input> -->
                        <div style="color: #D4EFF6; opacity: 0.5" class="unit" >米
                            <err-tip ref="pileSpacingErrTip" errMsg="请输入20至50之间的数值"
                                 style="margin-top:-25px;margin-left: 10px;"/>
                        </div>
                    </el-form-item>
                    <el-form-item label="转弯半径：">
                        <span style="color: #D4EFF6; opacity: 0.5" >{{designPara.turningRadius}}</span>
                        <!-- <el-input class="gf-input short-input" v-model="designPara.turningRadius" @input="validateTurningRadius" @blur="tofixed('turningRadius')"></el-input> -->
                        <div style="color: #D4EFF6; opacity: 0.5" class="unit" >米
                            <err-tip ref="turningRadiusErrTip" errMsg="请输入20至1000之间的数值"
                                 style="margin-top:-25px;margin-left: 10px;"/>
                        </div>
                    </el-form-item>
                    <div class="forSure" style="margin-bottom: 20px;">
                        <el-button class="gf-button" type="primary" @click="forSureHandle(item)">确定</el-button>
                    </div>
                </el-form>
            </div>
            <!--道路起点-->
            <div :class="item.contentClass" v-if="item.index === 2 && item.isActive">
                <el-form ref="startPoint" label-width="75px">
                    <el-form-item label="经度：">
                        <el-input class="gf-input short-input" v-model="startPoint[0]" @input="validateLatlng" @blur="tofixedLatlng"></el-input>
                        <div style="color: #D4EFF6; opacity: 0.5" class="unit" >
                            <err-tip ref="lngErrTip" errMsg="请输入0至180之间的数值"
                                 style="margin-top:-25px;margin-left: 10px;"/>
                        </div>
                    </el-form-item>
                    <el-form-item label="纬度：">
                        <el-input class="gf-input short-input" v-model="startPoint[1]" @input="validateLatlng" @blur="tofixedLatlng"></el-input>
                        <div style="color: #D4EFF6; opacity: 0.5" class="unit" >
                            <err-tip ref="latErrTip" errMsg="请输入0至90之间的数值"
                                 style="margin-top:-25px;margin-left: 10px;"/>
                        </div>
                    </el-form-item>
                    <div class="location" @click="roadStartLocation">
                        <div class="icon">
                            <icon name="weizhi"></icon>
                        </div>
                        <div>
                            去当前位置
                        </div>
                    </div>
                    <div class="forSure" style="margin-bottom: 20px;">
                        <el-button class="gf-button" type="primary" @click="forSureHandle(item)">确定</el-button>
                    </div>
                </el-form>
            </div>
            <!--设置限制性因素-->
            <div :class="item.contentClass" class="step3" v-if="item.index === 3 && item.isActive">
                <div class="part-auto">
                    <div class="left">自动识别</div>
                    <div class="right">
                        <div class="switch-button" :style="FirstTurnOff?'background-color: rgba(51,200,111,0.6);':'background-color:rgba(51,59,76,1);'" @click="turn('FirstTurnOff')">
                            <div class="text">OFF</div>
                            <div class="text">ON</div>
                            <div class="icon-button" v-bind:class="{turnOff:FirstTurnOff}">
                                <icon name="hehu"></icon>
                            </div>
                        </div>
                        <div class="switch-button" :style="SecondTurnOff?'background-color: rgba(51,200,111,0.6);':'background-color:rgba(51,59,76,1);'" @click="turn('SecondTurnOff')">
                            <div class="text">OFF</div>
                            <div class="text">ON</div>
                            <div class="icon-button" v-bind:class="{turnOff:SecondTurnOff}">
                                <icon name="zhufangguihua"></icon>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="part-custom">
                    <div class="left">自定义</div>
                    <div class="right">
                        <el-table :data="restrictAreasList" class="step-table" row-class-name="step-row" header-row-class-name="step-header-row" @row-click="locationSelectRestarictAera">
                            <el-table-column label="编号" header-align="center" width="55px" style="font-weight: lighter;">
                                <template slot-scope="scope">
                                    <div>{{scope.row.index}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="类别" header-align="center" class-name="step-column" style="font-weight: lighter;">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.gis_type" placeholder="请选择" popper-class="step3-popper">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column width="28px">
                                <template slot-scope="scope">
                                    <div @click="startEitRestrictArea(scope.row.index)">
                                        <icon name="bianji" class="step-edit-icon"></icon>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="28px">
                                <template slot-scope="scope">
                                    <div @click="deleteRestrictArea(scope.$index, scope.row.index)">
                                        <icon name="wechaticon13" class="step-plus-icon"></icon>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="addRow" @click="addRestrictiveRow">
                            <div class="icon">
                                <icon name="zengjia"></icon>
                            </div>
                            <div>
                                增加限制性因素
                            </div>
                        </div>
                    </div>
                </div>

                <div class="forSure" style="margin-bottom: 0px;">
                    <el-button class="gf-button" type="primary" @click="forSureHandle(item)">确定</el-button>
                </div>
            </div>
            <!--设置风机分组-->
            <div :class="item.contentClass" class="step4" v-if="item.index === 4 && item.isActive">
                <el-table :data="turbineGroup" style="width: 100%" class="step-table-expand" @row-click="onRowClick" ref="fanGroupaaa" :show-header="false">
                    <el-table-column label="分组编号" prop="groupID" align="left">
                    </el-table-column>
                    <el-table-column width="30px">
                        <template slot-scope="scope">
                            <div class="delete" @click="removeGroup(scope.row, scope.$index)">
                                <icon name="wechaticon13"></icon>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <div class="fans-group">
                                <div v-for="(fan, index) in scope.row.turbineID" :key="111+index" class="fan-item">
                                    <div class="icon-fan2">
                                        <icon name="fengji"></icon>
                                    </div>
                                    <div class="fanName" @click="locationFan(fan)">
                                        {{fan.turbine_name}}
                                    </div>
                                    <div class="fanDelete" @click="removeFanFormGroup(scope.row.turbineID, fan, index)">
                                        <icon name="wechaticon13"></icon>
                                    </div>
                                </div>
                                <div class="fan-item">
                                    <el-tooltip class="item" effect="light" content="框选风机添加到组" placement="top" popper-class="custom-tooltip">
                                        <div class="addFan" @click="addFan(scope.row, scope.$index)" v-bind:class="{addFanActive: addFanStatus[scope.$index]}">
                                            <icon name="zengjia"></icon>
                                        </div>
                                    </el-tooltip>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table :data="tableDataNot" style="width: 100%" class="step-table-expand" @row-click="onNotRowClick" ref="tableDataNot" :show-header="false">
                    <el-table-column label="描述" prop="desc" align="left">
                    </el-table-column>
                    <el-table-column width="30px">
                        <template slot-scope="scope">
                            <!--<div class="delete">-->
                            <!--<icon name="wechaticon13"></icon>-->
                            <!--</div>-->
                        </template>
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <div class="fans-group">
                                <div v-for="(fan, index) in scope.row.turbineID" :key="222+index" class="fan-item">
                                    <div class="icon-fan2">
                                        <icon name="fengji"></icon>
                                    </div>
                                    <div class="fanName" @click="locationFan(fan)">
                                        {{fan.turbine_name}}
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="addRowTable" @click="addBranch">
                    <div class="icon">
                        <icon name="zengjia"></icon>
                    </div>
                    <div>
                        增加分组
                    </div>
                </div>
                <div class="forSure" style="margin-bottom: 0px">
                    <el-button class="gf-button" type="primary" @click="forSureHandle(item)">确定</el-button>
                </div>
            </div>
        </div>
        <div class="step-item">
            <div class="flag">
                <div class="circle" style="line-height: 41px;cursor: pointer" @click="exitRe">
                    <icon name="exit"></icon>
                </div>
            </div>
        </div>
        <el-dialog :modal="false" title="增加限制性因素" :visible.sync="dialogVisible" width="30%" custom-class="restrictAreaDialog" :before-close="handleClose">
            <div>
                <el-form :model="restrictAreasForm" :rules="rules" ref="restrictAreasForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="编号" prop="name">
                        <el-input v-model="restrictAreasForm.name" style="width: 195px"></el-input>
                    </el-form-item>
                    <el-form-item label="类别" prop="type">
                        <el-select v-model="restrictAreasForm.type" placeholder="请选择限制类别" popper-class="step3-popper">
                            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value*Math.random()"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <div style="display: flex">
                    <el-button class="gf-button" @click="dialogVisible = false" style="padding-bottom: 10px;padding-top: 10px">取 消</el-button>
                    <el-button class="gf-button" type="primary" @click="addRestrictiveRow">确 定</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import qs from 'qs';
import _ from 'lodash';
import util from '../../libs/util';
import errTip from '@/components/cesium/err-tip';

export default {
    name: 'road-steps',
    components: {
        errTip
    },
    data () {
        return {
            restrictAreasForm: {
                name: null,
                type: null
            },
            steps: [
                {
                    index: 1,
                    label: '设置设计参数',
                    isActive: true,
                    contentClass: 'wid240'
                },
                {
                    index: 2,
                    label: '设置道路起点',
                    isActive: false,
                    contentClass: 'wid240'
                },
                // {
                //     index: 3,
                //     label: '设置限制性因素',
                //     isActive: false,
                //     contentClass: 'wid240'
                // },
                // {
                //     index: 4,
                //     label: '设置风机分组',
                //     isActive: false,
                //     contentClass: 'wid340'
                // },
                {
                    index: 5,
                    label: '重新生成',
                    isActive: false,
                    contentClass: 'none'
                }
            ],
            currentStep: {},
            startPoint: [], // 道路起点
            designPara: {
                turningRadius: null, // 转弯半径
                maxSlope: null, // 最大坡度
                pileSpacing: null, // 桩点间距
                roadWidth: null // 道路宽度
            },
            restrictAreasList: [],
            options: [// 限制性因素列表
                {
                    value: 1,
                    label: '居民区'
                }, {
                    value: 2,
                    label: '湖泊'
                }, {
                    value: 3,
                    label: '其他'
                }
            ],
            value: '',
            turbineGroup: [],
            tableDataNot: [// 风机未分组列表
                {
                    desc: '未分组',
                    turbineID: []
                }
            ],
            addFanStatus: [],
            currentGroup: [],
            projectId: null,
            planId: null,
            dialogVisible: false,
            rules: {
                name: [
                    { required: true, message: '请输入编号', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择类别', trigger: 'change' }
                ]
            },
            lastIndex: 0,
            FirstTurnOff: false,
            SecondTurnOff: false
        };
    },
    methods: {
        turn (type) {
            this[type] = !this[type];
            if (type === 'FirstTurnOff') this.$emit('methodClick', 'lakeRestrict', this[type]);
            if (type === 'SecondTurnOff') this.$emit('methodClick', 'houseRestrict', this[type]);
        },
        onRowClick (row) {
            this.$refs['fanGroupaaa'][0].toggleRowExpansion(row);
        },
        onNotRowClick (row) {
            this.$refs['tableDataNot'][0].toggleRowExpansion(row);
        },
        forSureHandle (step) {
            if (step.index === 1 && (!this.validateRoadWidth() || !this.validateMaxSlope() || !this.validatePileSpacing() || !this.validateTurningRadius())) {
                return;
            }
            if (step.index === 2) {
                this.tofixedLatlng();
                if (this.validateLatlng()) {
                    this.$emit('checklatlng', step, this.startPoint[0], this.startPoint[1]);
                }
                return;
            }
            this.switchStep(step);
        },
        setLatlngInFarmResult (step, isout) {
            if (isout) {
                this.$message.warning('道路起点须在风场范围内。');
                return;
            }
            this.switchStep(step);
        },
        switchStep (step) {
            this.$emit('restrictAreasFunction', 'stopEditRestrictArea');
            this.currentStep = step;
            step.isActive = false;
            this.steps[step.index].isActive = true;
        },
        goHandle (step) {
            this.$emit('restrictAreasFunction', 'stopEditRestrictArea');
            // 风机标签关闭
            this.$emit('methodClick', 'fanNameLabel', false);
            // 湖泊房屋不显示
            this.FirstTurnOff = false;
            this.SecondTurnOff = false;
            this.$emit('methodClick', 'lakeRestrict', false);
            this.$emit('methodClick', 'houseRestrict', false);
            // 如果已经展开就收起
            if (step.isActive) {
                step.isActive = false;
            } else {
                this.steps.forEach(value => {
                    value.isActive = false;
                });
                step.isActive = true;
            }
            if (step.index === 4) this.$emit('methodClick', 'fanNameLabel', true);
            if (step.index === 5) this.reCalculating();
        },
        // 重新计算
        reCalculating () {
            // 根据用户调整的参数，进行道路重新计算
            this.$confirm('重新计算将覆盖现有方案成果，无法回退，确认发起重新计算？', '重新计算', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'road-detail-quit-message'
            })
                .then(() => {
                    this.$store.commit('globeLoading', {loading: true, text: '正在重新生成...'});
                    const all = [this.submitEditRestrictArea(), this.road_redesign()];
                    Promise.all(all)
                        .then(() => {
                            this.changePlanStatus(this.projectId, this.planId)
                                .then(res => {
                                    this.$store.commit('globeLoading', {loading: false, text: ''});
                                    console.log(res);
                                    this.startPoint = [];
                                    this.designPara = {};
                                    this.restrictAreasList = [];
                                    this.turbineGroup = [];
                                    this.tableDataNot[0].turbineID = [];
                                    this.currentStep = {};
                                    this.currentGroup = [];
                                    this.$emit('methodClick', 'fanNameLabel', false);
                                    this.$emit('methodClick', 'reCalculate');
                                    this.$message.success('已重新生成，正在计算经评...');
                                })
                                .catch(err => {
                                    this.$store.commit('globeLoading', {loading: false, text: ''});
                                    console.error(err);
                                });
                        })
                        .catch(err => {
                            console.error(err);
                            this.$store.commit('globeLoading', {loading: false, text: ''});
                            this.$message.error('提交重新计算失败');
                        });
                })
                .catch(action => { });
        },
        // 提交编辑后的限制区域
        submitEditRestrictArea () {
            return new Promise((resolve, reject) => {
                this.$emit('restrictAreasFunction', 'submitEditRestrictArea', null, null, (data) => {
                    data = qs.stringify(data);
                    let postData = {
                        project_id: this.projectId,
                        scheme_id: this.planId,
                        limited_area_json: qs.parse(data)
                    };
                    let config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    util.DaoluUrl.post('/save_limited_area', postData, config).then(res => {
                        if (res.data.code === 1) {
                            resolve();
                        } else {
                            this.$message.error('提交编辑后的限制区域保存失败');
                        }
                    }).catch((err) => {
                        this.$message.error('提交编辑后的限制区域保存失败');
                        reject(err);
                    });
                });
            });
        },
        // 根据用户调整的参数，进行道路重新计算
        road_redesign () {
            return new Promise((resolve, reject) => {
                // 过滤风机编号
                let filterTurbineGroup = [];
                this.turbineGroup.forEach(v => {
                    let filterTurbineID = [];
                    v.turbineID.forEach(value => {
                        filterTurbineID.push(value.turbine_id);
                    });
                    filterTurbineGroup.push({
                        groupID: v.groupID,
                        turbineID: filterTurbineID
                    });
                });
                let designParameters = {
                    designParameters: {
                        startPoint: this.startPoint,
                        designPara: this.designPara,
                        turbineGroup: filterTurbineGroup
                    }
                };
                let postData = {
                    project_id: this.projectId,
                    scheme_id: this.planId,
                    design_param_json: designParameters
                };
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 60000
                };
                util.DaoluUrl.post('/redesign_road', postData, config).then(res => {
                    if (res.data.code === 1) {
                        resolve();
                    } else {
                        this.$message.error('重新计算失败');
                    }
                }).catch((err) => {
                    this.$message.error('重新计算失败');
                    reject(err);
                });
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
        // 定位道路起点
        roadStartLocation () {
            this.tofixedLatlng();
            if (!this.validateLatlng()) {
                return;
            }
            this.$emit('methodClick', 'roadStartLocation', this.startPoint);
        },
        // 接收风机点击后的回调信息
        fanClick (fanId, fanInfo, clientX, clientY) {
            this.addFanStatus.forEach(v => {
                if (!v) return false;
            });
            // 通过筛选在风机原始数据，获取风机编号
            let fanInformation = _.find(this.tableDataNot[0].turbineID, { turbine_id: fanId });
            if (fanInformation) {
                let index = _.findIndex(this.turbineGroup, ['groupID', this.currentGroup.groupID]);
                this.turbineGroup[index].turbineID.push({
                    turbine_id: fanInformation.turbine_id,
                    turbine_name: fanInformation.turbine_name
                });
                let i = _.findIndex(this.tableDataNot[0].turbineID, { turbine_id: parseInt(fanInformation.turbine_id) });
                if (i === -1) return;
                this.tableDataNot[0].turbineID.splice(i, 1);
            } else {
                this.$message.warning('该风机已在分组当中');
            }
        },
        // 向分组中增加风机
        addFan (row, index) {
            if (this.lastIndex !== index && this.lastIndex !== null) this.addFanStatus.splice(this.lastIndex, 1, false);
            this.addFanStatus.splice(index, 1, !this.addFanStatus[index]);
            this.lastIndex = index;
            this.currentGroup = row;
            if (this.addFanStatus[index]) {
                this.$emit('methodClick', 'selectFanByRectangle', null, (data) => {
                    data.then(fans => {
                        this.addFanStatus.forEach(v => {
                            if (!v) return false;
                        });
                        console.log(fans);
                        if (fans.length > 0) {
                            let alreadyIn = [];
                            fans.forEach(fan => {
                                let fanInformation = _.find(this.tableDataNot[0].turbineID, { turbine_name: fan.turbine_name });
                                console.log(fanInformation);
                                if (fanInformation) {
                                    let index = _.findIndex(this.turbineGroup, { groupID: this.currentGroup.groupID });
                                    this.turbineGroup[index].turbineID.push({
                                        turbine_id: fan.turbine_id,
                                        turbine_name: fan.turbine_name
                                    });
                                    let i = _.findIndex(this.tableDataNot[0].turbineID, ['turbine_name', fan.turbine_name]);
                                    if (i === -1) return;
                                    this.tableDataNot[0].turbineID.splice(i, 1);
                                } else {
                                    alreadyIn.push(fan.turbine_name);
                                }
                            });
                            if (alreadyIn.length > 0) {
                                let str = alreadyIn.join(' ');
                                this.$message.warning(`${str}该风机已在分组当中`);
                            }
                        }
                        this.addFanStatus.splice(index, 1, !this.addFanStatus[index]);
                    });
                });
            }
        },
        // 移除分组中的分机并添加至未分组中
        removeFanFormGroup (row, fan, index) {
            row.splice(index, 1);
            this.tableDataNot[0].turbineID.push(fan);
        },
        // 增加分组
        addBranch () {
            this.$prompt('请输入分组编号', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'road-step-message',
                showCancelButton: false,
                inputValidator: value => this.validator(value),
                inputErrorMessage: '请输入分组编号,不可重复'
            }).then(({ value }) => {
                this.turbineGroup.push(
                    {
                        groupID: value,
                        turbineID: []
                    }
                );
                this.addFanStatus.push(false);
            }).catch(() => {
            });
        },
        // 删除分组
        removeGroup (row, index) {
            row.turbineID.forEach(value => {
                this.tableDataNot[0].turbineID.push(value);
            });
            this.turbineGroup.splice(index, 1);
            this.addFanStatus.splice(index, 1);
        },
        // 根据风机编号定位风机
        locationFan (fan) {
            this.$emit('methodClick', 'locationFan', parseInt(fan.turbine_id));
        },
        // 高亮显示指定限制区域+编辑指定限制区域
        startEitRestrictArea (restrictAreaID) {
            this.$emit('restrictAreasFunction', 'locationSelectRestarictAera', restrictAreaID);
            this.$emit('restrictAreasFunction', 'startEitRestrictArea', parseInt(restrictAreaID));
        },
        // 高亮显示指定限制区域
        locationSelectRestarictAera (row) {
            this.$emit('restrictAreasFunction', 'locationSelectRestarictAera', row.index);
        },
        // 删除指定限制区域
        deleteRestrictArea (index, restrictAreaID) {
            this.$emit('restrictAreasFunction', 'stopEditRestrictArea');
            this.restrictAreasList.splice(index, 1);
            this.$emit('restrictAreasFunction', 'deleteRestrictArea', parseInt(restrictAreaID));
        },
        // 增加限制性因素
        addRestrictiveRow () {
            if (this.restrictAreasList.length > 0) {
                let index = parseInt(this.restrictAreasList[this.restrictAreasList.length - 1].index);
                this.restrictAreasList.push({
                    index: index + 1,
                    gis_type: 1
                });
                this.$emit('restrictAreasFunction', 'addNewRestrictArea', null,
                    { index: index + 1, gis_type: 1 }
                );
            } else {
                this.restrictAreasList.push({
                    index: 1,
                    gis_type: 1
                });
                this.$emit('restrictAreasFunction', 'addNewRestrictArea', null,
                    { index: 1, gis_type: 1 }
                );
            }
        },
        // 增加限制区域dialog关闭前回调
        handleClose () {
            this.restrictAreasForm.name = null;
            this.restrictAreasForm.type = null;
            this.dialogVisible = false;
        },
        // 获取初始化数据
        init (getDesiginDefaultPara, restrictAreasList) {
            restrictAreasList.then(data => {
                this.restrictAreasList = data;
            }).catch((err) => {
                if (err.code === 403) this.$message.error('解析限制区域数据失败，请检查数据格式。');
                // if (err.code === 404) this.$message.error(`S3上不存在限制区域数据，文件路径${err.url}`);
                // this.$message.error('获取道路限制性因素列表失败');
            });
            this.startPoint = getDesiginDefaultPara.startPoint;
            this.designPara = getDesiginDefaultPara.designPara;
            this.turbineGroup = getDesiginDefaultPara.turbineGroup;
            // 获取未分组风机
            let originFans = this.$store.state.scheme.originFans.slice();
            this.turbineGroup.forEach(v => {
                v.turbineID.forEach(value => {
                    let index = _.findIndex(originFans, { turbine_name: value.turbine_name });
                    if (index !== -1) {
                        originFans.splice(index, 1);
                    }
                });
                this.addFanStatus.push(false);
            });
            originFans.forEach(value => {
                this.tableDataNot[0].turbineID.push({
                    turbine_id: value.turbine_id,
                    turbine_name: value.turbine_name
                });
            });
            // forbiddentype:限制性因素的类型 (1:禁止跨越和立塔 2:可跨越)
        },
        setParams (projectId, planId) {
            this.projectId = projectId;
            this.planId = planId;
        },
        getParams () {
            return { projectId: this.projectId, planId: this.planId };
        },
        exitRe () {
            // 清除所有改动
            this.startPoint = [];
            this.designPara = {};
            this.restrictAreasList = [];
            this.turbineGroup = [];
            this.tableDataNot[0].turbineID = [];
            this.currentStep = {};
            this.currentGroup = [];
            this.$emit('roadReCalculatingClose');
            this.$emit('methodClick', 'fanNameLabel', false);
        },
        validator (value) {
            if (value === null) return false;
            if (this.turbineGroup.length > 0) {
                let index = _.findIndex(this.turbineGroup, ['groupID', parseInt(value)]);
                console.log(this.turbineGroup);
                return (index === -1);
            }
        },
        // 校验道路宽度
        validateRoadWidth () {
            const val = this.designPara.roadWidth;
            if (!val || isNaN(val) || val < 4 || val > 100) {
                this.$refs['roadWidthErrTip'][0].show();
                return false;
            } else {
                this.$refs['roadWidthErrTip'][0].hidden();
                return true;
            }
        },
        // 校验最大坡度
        validateMaxSlope () {
            const val = this.designPara.maxSlope;
            if (!val || isNaN(val) || val < 5 || val > 30) {
                this.$refs['maxSlopeErrTip'][0].show();
                return false;
            } else {
                this.$refs['maxSlopeErrTip'][0].hidden();
                return true;
            }
        },
        // 校验桩点间距
        validatePileSpacing () {
            const val = this.designPara.pileSpacing;
            if (!val || isNaN(val) || val < 20 || val > 50) {
                this.$refs['pileSpacingErrTip'][0].show();
                return false;
            } else {
                this.$refs['pileSpacingErrTip'][0].hidden();
                return true;
            }
        },
        // 校验转弯半径
        validateTurningRadius () {
            const val = this.designPara.turningRadius;
            if (!val || isNaN(val) || val < 20 || val > 1000) {
                this.$refs['turningRadiusErrTip'][0].show();
                return false;
            } else {
                this.$refs['turningRadiusErrTip'][0].hidden();
                return true;
            }
        },
        // 校验经纬度
        validateLatlng () {
            let lngCheck = this.startPoint[0] && !isNaN(this.startPoint[0]) && this.startPoint[0] >= 0 && this.startPoint[0] <= 180;
            let latCheck = this.startPoint[1] && !isNaN(this.startPoint[1]) && this.startPoint[1] >= 0 && this.startPoint[1] <= 90;
            if (!lngCheck) {
                this.$refs['lngErrTip'][0].show();
            } else {
                this.$refs['lngErrTip'][0].hidden();
            }
            if (!latCheck) {
                this.$refs['latErrTip'][0].show();
            } else {
                this.$refs['latErrTip'][0].hidden();
            }
            return lngCheck && latCheck;
        },
        tofixed (propName, fixed = 2) {
            if (!propName || !this.designPara.hasOwnProperty(propName) || isNaN(this.designPara[propName])) return;
            this.designPara[propName] = Number(this.designPara[propName]).toFixed(fixed);
        },
        tofixedLatlng () {
            if (!this.startPoint || isNaN(this.startPoint[0]) || isNaN(this.startPoint[1])) return;
            this.startPoint[0] = Number(this.startPoint[0]).toFixed(4);
            this.startPoint[1] = Number(this.startPoint[1]).toFixed(4);
        }
    },
    computed: {
        storeStartPoint () {
            return this.$store.state.road.roadStartPoint;
        }
    },
    watch: {
        storeStartPoint () {
            this.startPoint = [this.storeStartPoint.lon, this.storeStartPoint.lat];
        },
        startPoint (newVal, oldVal) {
            if (newVal[0] !== oldVal[0] && newVal[1] !== oldVal[1]) {
                this.tofixedLatlng();
            }
        }
    },
    created () {
        this.projectId = this.$store.state.app.projectId;
        this.planId = this.$store.state.app.planId;
        const { getDesignDefaultPara, restrictAreasList } = this.$parent.onRoadReCalculatingShow(this.projectId, this.planId);
        this.init(getDesignDefaultPara, restrictAreasList);
    }
};
</script>
