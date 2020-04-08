<template>
    <el-dialog title="更换塔型" :visible.sync="calcVisible" width="500px" class="towerChange" :before-close="beforeClose" :modal="false">
        <div class="tab">
            <p v-bind:class="{ active: isdf === 1 }" @click="isdf=1">杆塔</p>
            <p v-bind:class="{ active: isdf === 0 }" @click="isdf=0">绝缘子</p>
        </div>
        <el-form class="changeTowerInfo" v-show="isdf === 1" label-width="130px" :rules="rules" ref="changeTowerInfo" :model="changeTowerInfo">
            <el-form-item label="杆塔编号：">
                <div style="flex-direction: row;">
                    <span style="width:80%;color: #d4eff6;opacity: 0.5;" >{{changeTowerInfo.name}}</span>
                    <span style="color: #D4EFF6; opacity: 0.5"></span>
                </div>
            </el-form-item>
            <el-form-item label="杆塔类型：">
                <el-select popper-class="gf-popper" v-model="changeTowerInfo.attachMode" placeholder="" style="width:80%;">
                    <el-option v-for="(item, index) in attachModeList" :key="3100+index" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="杆塔型号：">
                <el-select popper-class="gf-popper" v-model="changeTowerInfo.type" placeholder="" style="width:80%;">
                    <el-option v-for="(item, index) in towerTypeList" :key="3100+index" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="定位桩名：">
                <div style="flex-direction: row;">
                    <span style="color: #D4EFF6; opacity: 0.5">{{changeTowerInfo.stakeName}}</span>
                </div>
            </el-form-item>
            <el-form-item label="呼高：" prop="callHeight">
                <div style="flex-direction: row;">
                    <!--<el-input style="width:80%" v-model="changeTowerInfo.callHeight" placeholder="" @input="validateCallHeight" @blur="tofixed('callHeight')"></el-input>-->
                    <el-input style="width:80%" v-model="changeTowerInfo.callHeight" @blur="tofixed('callHeight')" placeholder="" ></el-input>
                    <div style="color: #D4EFF6; opacity: 0.5" class="unit" >米
                        <!--<err-tip ref="callHeightErrTip" errMsg="请输入大于或等于0的数值" style="margin-top:-25px;margin-left: 10px;"/>-->
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="偏差高程：" prop="offsetDist">
                <div style="flex-direction: row;">
                    <!--<el-input style="width:80%" v-model="changeTowerInfo.offsetDist" placeholder="" @input="validateOffsetDist" @blur="tofixed('offsetDist')"></el-input>-->
                    <el-input style="width:80%" v-model="changeTowerInfo.offsetDist" placeholder="" @blur="tofixed('offsetDist')"></el-input>
                    
                     <div style="color: #D4EFF6; opacity: 0.5" class="unit" >米
                        <!--<err-tip ref="offsetDistErrTip" errMsg="请输入数值" style="margin-top:-25px;margin-left: 10px;"/>-->
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="塔脚高程：" prop="altitude">
                <div style="flex-direction: row;">
                    <!--<el-input style="width:80%"  v-model="changeTowerInfo.altitude" placeholder="" @input="validateAltitude" @blur="tofixed('altitude')"></el-input>-->
                    <el-input style="width:80%"  v-model="changeTowerInfo.altitude" placeholder="" @blur="tofixed('altitude')"></el-input>                 
                               
                     <div style="color: #D4EFF6; opacity: 0.5" class="unit" >米
                        <!--<err-tip ref="altitudeErrTip" errMsg="请输入大于或等于0的数值" style="margin-top:-25px;margin-left: 10px;"/>-->
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="升降基面：" prop="altitude">
                <div style="flex-direction: row;">
                    <!--<el-input style="width:80%"  v-model="changeTowerInfo.baseLower" @input="validateBaseLower" placeholder="" @blur="tofixed('baseLower')"></el-input>-->
                    <el-input style="width:80%"  v-model="changeTowerInfo.baseLower" placeholder="" @blur="tofixed('baseLower')"></el-input>
                    
                     <div style="color: #D4EFF6; opacity: 0.5" class="unit" >米
                        <!--<err-tip ref="baseLowerErrTip" errMsg="请输入数值" style="margin-top:-25px;margin-left: 10px;"/>-->
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="塔身转角：" prop="angle">
                <div style="flex-direction: row;">
                    <!--<el-input style="width:80%" v-model="changeTowerInfo.angle" placeholder="" @input="validateAngle" @blur="tofixed('angle')"></el-input>-->
                    <el-input style="width:80%" v-model="changeTowerInfo.angle" placeholder="" @blur="tofixed('angle')"></el-input>
                    
                     <div style="color: #D4EFF6; opacity: 0.5" class="unit" >度
                        <!--<err-tip ref="angleErrTip" errMsg="请输入-360至360之间的数值" style="margin-top:-25px;margin-left: 10px;"/>-->
                    </div>
                </div>
            </el-form-item>
        </el-form>
        <el-form v-show="isdf === 0" label-width="90px">
            <el-table class="gf-table" :data="tableData">
                <el-table-column prop="chuanName" label="挂点位置" header-align="center" align="left" />
                <!-- <el-table-column  prop="chuanType" label="绝缘子类型" header-align="center" align="center"/> -->
                <el-table-column min-width="140" label="绝缘子型号" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.chuanModel" @change="onclickChuanModel(scope.row.chuanModel, scope.$index)" popper-class="gf-popper" placeholder="" style="width:100%;float: left">
                            <el-option v-for="item in defaultChuanInfo" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <div style="text-align: center;margin-top: 30px">
            <el-button style="width: 120px;height: 34px;line-height: 2px;" class="gf-button" type="primary" @click="submitData">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import util from '@/libs/util';
import errTip from '@/components/cesium/err-tip';
export default {
    name: 'towerChange',
    components: {
        errTip
    },
    data () {
        // const regex1Plus = /^\d+(\.\d+)?$/u;
        // const val = this.changeTowerInfo.callHeight;
        // if (!val || isNaN(val) || !regex1Plus.test(val)) {
            
        //     return false;
        // } else {
        //     return true;
        // }
        var validatorNumber = (rule, value, callback) => {
            if(value>0) {
                callback();
            }else {
                callback(new Error(rule.message));
            }
        };
        return {
            isdf: 1,
            calcVisible: false,
            projectId: null,
            planId: null,
            data: [],
            towerTypeList: [],
            defaultChuanInfo: null,
            attachModeList: [
                {
                    label: '门架塔',
                    value: '0'
                },
                {
                    label: '悬垂塔',
                    value: '1'
                },
                {
                    label: '耐张塔',
                    value: '2'
                }
            ],
            changeTowerInfo: {},
            tableData: [
                {
                    chuanName: '上左',
                    chuanType: null,
                    chuanModel: null
                },
                {
                    chuanName: '上右',
                    chuanType: null,
                    chuanModel: null
                },
                {
                    chuanName: '中左',
                    chuanType: null,
                    chuanModel: null
                },
                {
                    chuanName: '中左',
                    chuanType: null,
                    chuanModel: null
                },
                {
                    chuanName: '下左',
                    chuanType: null,
                    chuanModel: null
                },
                {
                    chuanName: '下左',
                    chuanType: null,
                    chuanModel: null
                }
            ],
            rules: {
                callHeight: [
                    { required: true, message: '请输入大于或等于0的数值！', trigger: 'blur' },
                    { validator: validatorNumber, trigger: 'keyup', message: '请输入大于或等于0的数值！', }
                ],
                offsetDist: [
                    { required: true, message: '请输入大于或等于0的数值！', trigger: 'blur' },
                    { validator: validatorNumber, trigger: 'keyup', message: '请输入大于或等于0的数值！', }
                ],
                altitude: [
                    { required: true, message: '请输入大于或等于0的数值！', trigger: 'blur' },
                    { validator: validatorNumber, trigger: 'keyup', message: '请输入大于或等于0的数值！', }
                ],
                baseLower: [
                    { required: true, message: '请输入大于或等于0的数值！', trigger: 'blur' },
                    { validator: validatorNumber, trigger: 'keyup', message: '请输入大于或等于0的数值！', }
                ],
                angle: [
                    { required: true, message: '请输入大于或等于0的数值！', trigger: 'blur' },
                    { validator: validatorNumber, trigger: 'keyup', message: '请输入大于或等于0的数值！', }
                ]
            }
        };
    },
    computed: {
        changeTowerType () {
            return this.$store.state.app.changeTowerType; ;
        }
    },
    watch: {
        changeTowerType () {
            if (!this.changeTowerType.towerInfo) return;
            this.changeTowerInfo = this.changeTowerType.towerInfo;
            let chuanType;
            switch (this.changeTowerInfo.attachMode) {
                case '0':
                    chuanType = '门架塔';
                    break;
                case '1':
                    chuanType = '悬垂塔';
                    break;
                case '2':
                    chuanType = '耐张塔';
                    break;
            }
            this.tableData = [
                {
                    chuanName: '上左',
                    chuanType: chuanType,
                    chuanModel: this.changeTowerInfo.loopLineData.wire.chuanModel.leftBack
                },
                {
                    chuanName: '上右',
                    chuanType: chuanType,
                    chuanModel: this.changeTowerInfo.loopLineData.wire.chuanModel.leftFore
                },
                {
                    chuanName: '中左',
                    chuanType: chuanType,
                    chuanModel: this.changeTowerInfo.loopLineData.wire.chuanModel.middleBack
                },
                {
                    chuanName: '中右',
                    chuanType: chuanType,
                    chuanModel: this.changeTowerInfo.loopLineData.wire.chuanModel.middleFore
                },
                {
                    chuanName: '下左',
                    chuanType: chuanType,
                    chuanModel: this.changeTowerInfo.loopLineData.wire.chuanModel.rightBack
                },
                {
                    chuanName: '下右',
                    chuanType: chuanType,
                    chuanModel: this.changeTowerInfo.loopLineData.wire.chuanModel.rightFore
                }
            ];
        }
    },
    mounted () {
        // this.initData();
    },
    methods: {
        onclickChuanModel (chuanModel, index) {
            switch (index) {
                case 0:
                    this.changeTowerInfo.loopLineData.wire.chuanModel.leftBack = chuanModel;
                    break;
                case 1:
                    this.changeTowerInfo.loopLineData.wire.chuanModel.leftFore = chuanModel;
                    break;
                case 2:
                    this.changeTowerInfo.loopLineData.wire.chuanModel.middleBack = chuanModel;
                    break;
                case 3:
                    this.changeTowerInfo.loopLineData.wire.chuanModel.middleFore = chuanModel;
                    break;
                case 4:
                    this.changeTowerInfo.loopLineData.wire.chuanModel.rightBack = chuanModel;
                    break;
                case 5:
                    this.changeTowerInfo.loopLineData.wire.chuanModel.rightFore = chuanModel;
                    break;
            }
        },
        open (productId, planId) {
            this.calcVisible = true;
            this.isdf = 1;
            this.projectId = productId;
            this.planId = planId;
            this.defaultChuanInfo = window.viewer.getDefaultChuanInfo();
            this.initData();
        },
        beforeClose (done) {
            // this.$emit('autoOptimizationClose');
            done();
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
        },
        submitData () {
            // if( !this.validateCallHeight() || !this.validateOffsetDist() || !this.validateAltitude() || !this.validateBaseLower() || !this.validateAngle())
            //     return;
            // this.$emit('collectLineFunction', 'saveChangeTowerType', this.changeTowerInfo);
            // this.calcVisible = false;
            this.$refs['changeTowerInfo'].validate((valid) => {
                if(valid) {
                    this.$emit('collectLineFunction', 'saveChangeTowerType', this.changeTowerInfo);
                    this.calcVisible = false;
                }else {
                    return false;
                }
            });
        },
        // 校验呼高
        validateCallHeight () {
            const regex1Plus = /^\d+(\.\d+)?$/u;
            const val = this.changeTowerInfo.callHeight;
            if (!val || isNaN(val) || !regex1Plus.test(val)) {
                // this.$refs['callHeightErrTip'].show();
                return false;
            } else {
                // this.$refs['callHeightErrTip'].hidden();
                return true;
            }
        }, 
         // 校验偏差高程
        validateOffsetDist () {
            const val = this.changeTowerInfo.offsetDist;
            if (!val || isNaN(val)) {
                this.$refs['offsetDistErrTip'].show();
                return false;
            } else {
                this.$refs['offsetDistErrTip'].hidden();
                return true;
            }
        },  
         // 校验塔脚高程
        validateAltitude () {
            const regex1Plus = /^\d+(\.\d+)?$/u;
            const val = this.changeTowerInfo.altitude;
            if (!val || isNaN(val) || !regex1Plus.test(val)) {
                this.$refs['altitudeErrTip'].show();
                return false;
            } else {
                this.$refs['altitudeErrTip'].hidden();
                return true;
            }
        }, 
         // 校验升降基面
        validateBaseLower () {
            const val = this.changeTowerInfo.baseLower;
            if (!val || isNaN(val)) {
                this.$refs['baseLowerErrTip'].show();
                return false;
            } else {
                this.$refs['baseLowerErrTip'].hidden();
                return true;
            }
        }, 
         // 校验塔身转角
        validateAngle () {
            const val = this.changeTowerInfo.angle;
            if (!val || isNaN(val) || val < -360 || val > 360) {
                this.$refs['angleErrTip'].show();
                return false;
            } else {
                this.$refs['angleErrTip'].hidden();
                return true;
            }
        },  
        tofixed (propName) {
            if (!propName || !this.changeTowerInfo.hasOwnProperty(propName) || isNaN(this.changeTowerInfo[propName])) return;
            this.changeTowerInfo[propName] = Number(this.changeTowerInfo[propName]).toFixed(6);
        }    
    }
};
</script>

<style lang="less" scoped>
.towerChange {
  .tab {
    height: 59px;
    text-align: center;
    line-height: 24px;
    width: 100%;
    display: flex;
    flex-direction: row;
    // justify-content: space-evenly;
    justify-content: space-around;
    align-items: center;
    margin-top: -27px;

    .active {
      background-color: rgba(51, 200, 111, 0.6);
    }
    p {
      color: #d4eff6;
      width: 80px;
      height: 24px;
      font-size: 14px;
      border-radius: 10px;
      cursor: pointer;
    }
  }
}

.unit{
      display: inline-block;
}
.changeTowerInfo .el-form-item__content {
    line-height: 44px;
}
.changeTowerInfo .el-form-item__error {
    width: 80%;
}
</style>
