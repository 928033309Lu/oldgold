<style lang="less" scoped>
    @import '../../styles/common.less';
    @import "./line-steps.less";
</style>
<template>
    <div class="steps-container">
        <div class="step-item" v-for="(item, index) in steps" :class="{active:item.isActive}" :key="5333+index">
            <div class="flag">
                <div class="circle">{{index+1}}</div>
                <div class="tooltip" @click="goHandle(item)">{{item.label}}</div>
            </div>
            <div class="line" v-if="item.index!==3"></div>
            <!--设置风机分支-->
            <div :class="item.contentClass" class="step4" v-if="item.index === 1 && item.isActive"
                            >
                <el-table
                        :data="turbineGroup"
                        style="width: 100%"
                        min-height='180'
                        max-height='150'
                        class="step-table-expand"
                        @row-click="onRowClick"
                        ref="fanGroup"
                        :show-header="false">
                      <el-table-column label="分组编号"
                            prop="groupID"
                            align="left">
                              <template slot-scope="scope">
                            <div :style="getTurbinRowStyle(scope.$index)">{{scope.row.groupID}}
                            </div>
                        </template>
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
                                <div v-for="(fan, index) in scope.row.turbineID" :key="4333+index" class="fan-item">
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
                <el-table
                        :data="tableDataNot"
                        style="width: 100%"
                        class="step-table-expand"
                        @row-click="onNotRowClick"
                        ref="tableDataNot"
                        :show-header="false">
                    <el-table-column
                            label="描述"
                            prop="desc"
                            align="left">
                            <template slot-scope="scope">
                            <div :style="getTurbinRowStyle()">{{scope.row.desc}}
                            </div>
                        </template>
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
                                <div v-for="(fan, index) in scope.row.turbineID" :key="2333+index" class="fan-item">
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
                <div class="forSure" style="margin-top: 20px; margin-bottom: 0px;">
                    <el-button class="gf-button" type="primary" @click="forSureHandle(item)">确定</el-button>
                </div>
            </div>

            <!--设置限制性因素-->
            <div :class="item.contentClass" class="step3" v-if="item.index === 2 && item.isActive">
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
                        <div class="switch-button"  :style="SecondTurnOff?'background-color: rgba(51,200,111,0.6);':'background-color:rgba(51,59,76,1);'" @click="turn('SecondTurnOff')">
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
                        <el-table
                                :data="restrictAreasList"
                                style="width: 100%;min-height:15px;max-height:120px;overflow-y:scroll;"
                                class="step-table step-table-res"
                                row-class-name="step-row"
                                header-row-class-name="step-header-row"
                                @row-click="locationSelectRestarictAera">
                            <el-table-column label="编号" width="40px" header-align="center" style="font-weight: lighter;" label-class-name="short-label-step-column">
                                <template slot-scope="scope">
                                    {{scope.row.index}}
                                </template>
                            </el-table-column>
                            <el-table-column label="类别" width="70px" header-align="center" class-name="step-column short-step-column" label-class-name="label-step-column" style="font-weight: lighter;">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.gis_type" placeholder="请选择" popper-class="step3-popper">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                        >
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="类型" width="105px" header-align="center" class-name="step-column" style="font-weight: lighter;">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.forbiddentype" placeholder="请选择" popper-class="step3-popper">
                                        <el-option
                                                v-for="item in forbiddenList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                        >
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column width="25px">
                                <template slot-scope="scope">
                                    <div @click="startEitRestrictArea(scope.row.index)">
                                        <icon name="bianji" class="step-edit-icon"></icon>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="25px">
                                <template slot-scope="scope">
                                    <div @click="deleteRestrictArea(scope.$index, scope.row.index)">
                                        <icon name="wechaticon13" class="step-plus-icon"></icon>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="addRow" @click="addRestrictiveRow">
                    <div class="icon">
                        <icon name="zengjia"></icon>
                    </div>
                    <div>
                        增加限制性因素
                    </div>
                </div>
                <div class="forSure" style="margin-bottom: 0px;">
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
        <el-dialog
                title="增加限制性因素"
                :visible.sync="dialogVisible"
                width="30%"
                :modal="false"
                custom-class="restrictAreaDialog"
                :before-close="handleClose">
            <div>
                <el-form :model="restrictAreasForm" :rules="rules" ref="restrictAreasForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="编号" prop="name">
                        <el-input v-model="restrictAreasForm.name" style="width: 195px"></el-input>
                    </el-form-item>
                    <el-form-item label="类别" prop="gis_type">
                        <el-select v-model="restrictAreasForm.gis_type" placeholder="请选择限制类别"  popper-class="step3-popper">
                            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value*Math.random()"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型" prop="forbiddentype">
                        <el-select v-model="restrictAreasForm.forbiddentype" placeholder="请选择限制类型"  popper-class="step3-popper">
                            <el-option
                                    v-for="item in forbiddenList"
                                    :key="1000+item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <div style="display: flex">
                    <el-button class="gf-button" @click="cancel" style="padding-bottom: 10px;padding-top: 10px">取 消</el-button>
                    <el-button class="gf-button" type="primary" @click="addRestrictiveRow">确 定</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash';
    import axios from 'axios';
    import util from '../../libs/util';
    import qs from 'qs';
    import {updateTurbinGroupColor,updateDefaultTurbinGroup ,updateTurbinsColor,getTurbinColor} from './TurbinsGroupManager'

    export default {
        name: 'line-steps',
        data () {
            return {
                restrictAreasForm: {
                    name: null,
                    gis_type: null,
                    forbiddentype: null
                },
                steps: [
                    {
                        index: 1,
                        label: '设置风机分组',
                        isActive: true,
                        contentClass: 'wid340'
                    },
                    // {
                    //     index: 2,
                    //     label: '设置限制性因素',
                    //     isActive: false,
                    //     contentClass: 'wid320'
                    // },
                    {
                        index: 3,
                        label: '重新生成',
                        isActive: false,
                        contentClass: 'none'
                    }
                ],
                currentStep: {},
                tableData: [],
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
                forbiddenList: [
                    {
                        value: 1,
                        label: '禁止跨越和立塔'
                    },
                    {
                        value: 2,
                        label: '可跨越'
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
                    gis_type: [
                        { required: true, message: '请选择类别', trigger: 'change,blur' }
                    ],
                    forbiddentype: [
                        { required: true, message: '请选择类型', trigger: 'change,blur' }
                    ]
                },
                lastIndex: null,
                FirstTurnOff: false,
                SecondTurnOff: false,
            };
        },
        mounted(){
        },
        methods: {
            getTurbinRowStyle (rowIndex) {
                return {color:getTurbinColor(rowIndex)};
            },
            turn (type) {
                this[type] = !this[type];
                if (type === 'FirstTurnOff') this.$emit('methodClick', 'lakeRestrict', this[type]);
                if (type === 'SecondTurnOff') this.$emit('methodClick', 'houseRestrict', this[type]);
            },
            onRowClick (row) {
                this.$refs['fanGroup'][0].toggleRowExpansion(row);
                this.stopSelectFanByRectangle();
            },
            onNotRowClick (row) {
                this.$refs['tableDataNot'][0].toggleRowExpansion(row);
                this.stopSelectFanByRectangle();
            },
            // 获取初始化数据
            init (restrictAreasList, turbineGroupInfo) {
                this.$emit('methodClick', 'fanNameLabel', true);
                restrictAreasList.then(data => {
                    //  [gis_type:地物类别(1:居民 2: 湖泊 3:其他)]
                    // forbiddentype:限制性因素的类型 (1:禁止跨越和立塔 2:可跨越)
                    this.restrictAreasList = data;
                }).catch(err => {
                    const h = this.$createElement;
                    if (err.code === 403) {
                        this.$notify.error({
                            title: '解析限制区域数据失败',
                            message: h('i', { style: 'color: teal;word-wrap:break-all;'}, err.url)
                        });
                    }
                });
                turbineGroupInfo.then(data => {
                    let parseData = JSON.parse(data);
                    parseData = JSON.parse(parseData);
                    this.turbineGroup = parseData.turbineGroup;
                    console.log(this.turbineGroup);
                    // 获取未分组风机
                    let originFans = this.$store.state.scheme.originFans.slice();
                    // 把已分组的风机从未分组中摘出去
                    this.turbineGroup.forEach(v => {
                        v.turbineID.forEach(vv => {
                            let index = _.findIndex(originFans, {turbine_name: vv.turbine_name});
                            if (index !== -1) {
                                originFans.splice(index, 1);
                            }
                        });
                        this.addFanStatus.push(false)
                    });
                    originFans.forEach(value => {
                        this.tableDataNot[0].turbineID.push({
                            turbine_id: value.turbine_id,
                            turbine_name: value.turbine_name
                        });
                    });

                    updateTurbinGroupColor(this.turbineGroup);
                }).catch((err) => {
                    const h = this.$createElement;
                    if (err.code === 403) {
                        this.$notify.error({
                            title: '解析分组信息解析失败',
                            message: h('i', { style: 'color: teal;word-break:break-all;'}, err.url)
                        });
                    }
                    console.error(err)
                })
                ;
            },
            setParams (projectId, planId) {
                this.projectId = projectId;
                this.planId = planId;
            },
            getParams () {
                return { projectId: this.projectId, planId: this.planId };
            },
            checkTurbineGroup () {
                if(!this.turbineGroup||this.turbineGroup.length===0) {
                   this.$message.warning('请设置风机分组！');
                   return false;
                }

                let emptyGroup=[];
                this.turbineGroup.forEach((item,index) => {
                if(!item||!item.turbineID||item.turbineID.length===0)
                    emptyGroup.push(item.groupID);
                });

                if(emptyGroup.length!==0){
                    this.$message.warning( '分组'+emptyGroup+'中没有风机，请添加风机或删除分组！');
                    return false;
                }
                return true;
            },
            forSureHandle (step) {
                this.stopSelectFanByRectangle();

                if(step.index === 1 && !this.checkTurbineGroup()){
                    return;
                }
                this.$emit('restrictAreasFunction', 'stopEditRestrictArea');
                this.currentStep = step;
                step.isActive = false;
                this.steps[step.index].isActive = true;
            },
            goHandle (step) {
                this.stopSelectFanByRectangle();
                if(!this.checkTurbineGroup())
                    return;
                this.$emit('restrictAreasFunction', 'stopEditRestrictArea');
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
                if (step.index === 1) this.$emit('methodClick', 'fanNameLabel', true);
                if (step.index === 3) this.reCalculating();
            },
            methodClick () {
                this.$emit('methodClick');
            },
            // 接收风机点击后的回调信息
            fanClick (fanId, fanInfo, clientX, clientY) {
                let flag = false;
                this.addFanStatus.forEach(v => {
                    if(v) flag = v;
                });
                if (flag) {
                    let fanInformation = _.find(this.tableDataNot[0].turbineID, {turbine_id: fanId});
                    if (fanInformation) {
                        let index = _.findIndex(this.turbineGroup, ['groupID', this.currentGroup.groupID]);
                        this.turbineGroup[index].turbineID.push({
                            turbine_id: fanInformation.turbine_id,
                            turbine_name: fanInformation.turbine_name
                        });
                        updateTurbinsColor([fanInformation.turbine_id],index);
                        let i = _.findIndex(this.tableDataNot[0].turbineID, {turbine_id: fanId});
                        if (i === -1) return;
                        this.tableDataNot[0].turbineID.splice(i, 1);
                    } else {
                        this.$message.warning('该风机已在分组当中');
                    }
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
                                    console.log(fan);
                                    console.log(this.tableDataNot[0].turbineID);
                                    let fanInformation = _.find(this.tableDataNot[0].turbineID, {turbine_name: fan.turbine_name});
                                    console.log(fanInformation);
                                    if (fanInformation) {
                                        let index = _.findIndex(this.turbineGroup, ['groupID', this.currentGroup.groupID]);
                                        this.turbineGroup[index].turbineID.push({
                                            turbine_id: fan.turbine_id,
                                            turbine_name: fan.turbine_name
                                        });
                                        updateTurbinsColor([fanInformation.turbine_id],index);
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
                updateTurbinsColor([fan.turbine_id]);
            },
            // 增加分组
            addBranch () {
                this.stopSelectFanByRectangle();

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
                    this.addFanStatus.push(false)
                }).catch(() => {
                });
            },
            // 删除分组
            removeGroup (row, index) {
                row.turbineID.forEach(value => {
                    this.tableDataNot[0].turbineID.push(value);
                });
                console.log(this.tableDataNot[0].turbineID);
                this.turbineGroup.splice(index, 1);
                this.addFanStatus.splice(index, 1);
                updateDefaultTurbinGroup(this.tableDataNot[0].turbineID);
                updateTurbinGroupColor(this.turbineGroup);
            },
            // 增加限制性因素
            addRestrictiveRow () {
                if (this.restrictAreasList.length > 0) {
                    let index = parseInt(this.restrictAreasList[this.restrictAreasList.length - 1].index);
                    this.restrictAreasList.push({
                        index: index + 1,
                        gis_type: 1,
                        forbiddentype: 1
                    });
                    this.$emit('restrictAreasFunction', 'addNewRestrictArea', null,
                        {index: index + 1, gis_type: 1, forbiddentype: 1}
                    );
                } else {
                    this.restrictAreasList.push({
                        index: 1,
                        gis_type: 1,
                        forbiddentype: 1
                    });
                    this.$emit('restrictAreasFunction', 'addNewRestrictArea', null,
                        {index: 1, gis_type: 1, forbiddentype: 1}
                    );
                }
            },
            // 增加限制区域dialog关闭前回调
            handleClose () {
                this.restrictAreasForm.name = null;
                this.restrictAreasForm.gis_type = null;
                this.restrictAreasForm.forbiddentype = null;
                this.dialogVisible = false;
            },
            reCalculating () {
                // 根据用户调整的参数，进行道路重新计算
                this.$confirm('重新计算将覆盖现有方案成果，无法回退，确认发起重新计算？', '重新计算', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'road-detail-quit-message'
                })
                    .then(() => {
                        this.$message.success('重新计算中，预计用时1分钟。');
                        this.reCalculate()
                            .then(() => {
                               this.$emit('lineRecalculating');
                                this.$emit('methodClick', 'fanNameLabel', false);
                            })
                            .catch(err => {
                                this.$message.error(err)
                            });

                        // this.exitRe();
                    })
                    .catch(action => {});
            },

            async reCalculate () {
                let a = await this.road_redesign();
                console.log(a);
                let b = await this.submitEditRestrictArea();
                console.log(b);
                let c = await this.reCalculatingLineFile();
                console.log(c);
                let d = await this.changePlanStatus();
                console.log(d);
                return true
            },
            // 提交编辑后的分组信息
            road_redesign () {
                if(! this.projectId||!this.planId)
                return null;
                let data = [];
                this.turbineGroup.forEach(value=>{
                    const turbine = value.turbineID.map(v=>{
                        v.turbine_id =v.turbine_id.toString();
                        return v
                    });
                    data.push({
                        groupID: value.groupID.toString(),
                        turbineID: turbine
                    })
                });
                return new Promise((resolve, reject) => {
                    let postData = {
                        project_id: this.projectId.toString(),
                        scheme_id: this.planId.toString(),
                        groupinfo: {
                            turbineGroup: data
                        }
                    };
                    let config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    util.Xianluajax.post('/setwindturbineclass', postData, config).then(res => {
                        if (res.data.code === 0) {
                            resolve('提交编辑后的分组信息成功');
                        } else {
                            console.error(`提交编辑后的分组信息失败:${res.data.data}`);
                            reject(res.data.data);
                        }
                    }).catch((err) => {
                        console.error(`提交编辑后的分组信息失败:${err}`);
                        // this.$message.error('提交编辑后的分组信息失败');
                        reject(err);
                    });
                });
            },
            // 提交编辑后的限制区域
            submitEditRestrictArea () {
                  if(! this.projectId||!this.planId)
                return null;
                return new Promise((resolve, reject) => {
                    this.$emit('restrictAreasFunction', 'submitEditRestrictArea', null, null, (restrictAreas) => {
                        let data = {
                            project_id: this.projectId.toString(),
                            scheme_id: this.planId.toString(),
                            forbiddenarea: restrictAreas
                        };
                        let config = {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        };
                        util.Xianluajax.post('/forbiddenarea', data, config).then(res => {
                            if (res.data.code === 0) {
                                resolve('提交编辑后的限制区域成功');
                            } else {
                                console.error(`提交编辑后的限制区域保存失败:${res.data.data}`);
                                reject();
                            }
                        }).catch((err) => {
                            console.error(`获取保存后的限制区域失败${err}`);
                            this.$message.error('提交编辑后的限制区域保存失败');
                            reject(err);
                        });
                    });
                });
            },
            // 重新生成路径信息（无排塔）
            reCalculatingLineFile () {
                return new Promise((resolve, reject) => {
                    util.Xianluajax.get('/calculatepath', {
                        params: {
                            project_id: this.projectId,
                            scheme_id: this.planId
                        }
                    }).then(res => {
                        if (res.data.code === 0) {
                            resolve('重新生成路径信息（无排塔）成功');
                        } else {
                            console.error(`重新生成路径信息（无排塔）失败:${res.data.data}`);
                            reject(res.data.data);
                        }
                    }).catch((err) => {
                        console.error(`重新生成路径信息（无排塔）失败${err}`);
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
                        if(res.data.code === 201){
                            console.log(res.data.message)
                        }
                        resolve('修改方案状态成功')
                    }).catch((err ) => {
                        console.error('修改计算状态失败');
                        this.$message.error('修改计算状态失败');
                        reject(err);
                    });
                });
            },
            
            // 根据风机编号定位风机
            locationFan (fan) {
                this.$emit('methodClick', 'locationFan', parseInt(fan.turbine_id));
            },
            // 退出重新设计
            exitRe () {
                this.stopSelectFanByRectangle();

                this.tableDataNot[0].turbineID = [];
                this.$emit('lineReCalculatingClose');
                this.$emit('methodClick', 'fanNameLabel', false);
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
            // 取消提交表单
            cancel () {
                this.dialogVisible = false;
                this.$refs.restrictAreasForm.resetFields()
            },
            validator (value) {
                if (value === null) return false;
                if (this.turbineGroup.length > 0) {
                    let index = _.findIndex(this.turbineGroup, ['groupID', parseInt(value)]);
                    console.log(this.turbineGroup);
                    return (index === -1);
                }
            },
            stopSelectFanByRectangle(){
                // 停止框选风机
                this.$emit('stopSelectFanByRectangle');
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

        },
        created () {
            this.projectId = this.$store.state.app.projectId;
            this.planId = this.$store.state.app.planId;
            const {restrictAreasList, turbineGroupInfo} = this.$parent.onLineReCalculatingShow(null, this.projectId, this.planId);
            this.init(restrictAreasList, turbineGroupInfo);
        }
    };
</script>
