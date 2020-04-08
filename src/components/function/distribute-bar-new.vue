<template>
    <div class="main-panel">
        <el-tooltip  v-if="editMode" class="item" effect="light" content="点击地面添加风机" placement="top" popper-class="custom-tooltip">
            <add-fan-one desc="add" icon="add" :left="true" ref="btnAdd" @funSelectChange="onAddClick" :selectMode="true"  style="border-top-left-radius: 4px;border-bottom-left-radius: 4px;"></add-fan-one>
        </el-tooltip>
        <el-tooltip   v-if="editMode" class="item" effect="light" content="指定坐标添加风机" placement="top" popper-class="custom-tooltip">
            <add-fan-two desc="add" icon="add" ref="coordinateAdd" @funSelectChange="onCoordinateAddClick" :selectMode="true"></add-fan-two>
        </el-tooltip>
        <!-- <el-tooltip class="item" effect="light" content="价格调整" placement="top" popper-class="custom-tooltip">
            <sub-button desc="price" icon="price" @funSelectChange="onClick('price')" :selectMode="true"></sub-button>
        </el-tooltip> -->
        <el-tooltip  v-if="editMode" class="item" effect="light" content="修改所选风机的机型参数" placement="top" popper-class="custom-tooltip">
            <sub-button desc="changeType" icon="yingyong" :disable="!enableRemove" :style="!enableRemove?'opacity: 0.6;':'opacity: 1;'"  @funSelectChange="onClick('changeType')"></sub-button>
        </el-tooltip>
        <el-tooltip  v-if="editMode" class="item" effect="light" content="删除所选风机" placement="top" popper-class="custom-tooltip">
            <sub-button desc="del" icon="remove" :disable="!enableRemove" :style="!enableRemove?'opacity: 0.6;':'opacity: 1;'" @funSelectChange="onClick('del')"></sub-button>
        </el-tooltip>
        <el-tooltip   v-if="editMode" class="item" effect="light" content="设置容量" placement="top" popper-class="custom-tooltip">
            <capacitance desc="add" icon="add"></capacitance>
        </el-tooltip>
        <!-- <div   v-if="editMode" class="spacespandiv">
            <span class="spacespan"></span>
        </div> -->
        <el-tooltip    v-if="editMode" class="item" effect="light" content="回滚" placement="top" popper-class="custom-tooltip">
            <sub-button desc="rollback" icon="refresh" :disable="planModified" :style="planModified?'opacity: 0.6;':'opacity: 1;'" @funSelectChange="onClick('rollback')"></sub-button>
        </el-tooltip>
        <el-tooltip   v-if="editMode" class="item" effect="light" content="保存编辑" placement="top" popper-class="custom-tooltip">
            <sub-button desc="calculate" icon="tijiao" :disable="planModified" :style="planModified?'opacity: 0.6;':'opacity: 1;'" @funSelectChange="onClick('calculate')"></sub-button>
        </el-tooltip>
        <el-tooltip v-if="editMode" class="item" effect="light" content="退出手动优化" placement="top" popper-class="custom-tooltip">
            <sub-button desc="exitYouhua" icon="exit" @funSelectChange="onClick('exitYouhua')"></sub-button>
        </el-tooltip>
        <div v-if="editMode" class="spacespandiv">
            <span class="spacespan"></span>
        </div>
      
        <el-tooltip v-if="!editMode && roleVisible" class="item" effect="light" content="导入修改" placement="top" popper-class="custom-tooltip wind-gauge-tooltip">
            <sub-button desc="daoru" :disable="enManagerBtn" :disableStyle="enManagerBtn" :left="true" icon="daoru" @funSelectChange="onClick('daoru')"></sub-button>
        </el-tooltip>
        <el-tooltip v-if="!editMode && roleVisible" class="item" effect="light" content="手动优化" placement="top" popper-class="custom-tooltip wind-gauge-tooltip">
            <sub-button desc="shoudongyouhua" :disable="enManagerBtn" :disableStyle="enManagerBtn" :left="true" icon="shoudonghuanjie" @funSelectChange="onClick('shoudongyouhua')"></sub-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" :content="maxViewMode?'隐藏风参表':'显示风参表'" placement="top" popper-class="custom-tooltip wind-gauge-tooltip">
            <sub-button  v-if="maxViewMode" desc="minview" icon="minview" @funSelectChange="onClick('minview')"></sub-button>
            <sub-button v-else desc="maxview" icon="maxview" @funSelectChange="onClick('maxview')"></sub-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="退出排布方案" placement="top" popper-class="custom-tooltip wind-gauge-tooltip">
            <sub-button desc="close" icon="guanbi" :right="true" @funSelectChange="onClick('close')"></sub-button>
        </el-tooltip>
    </div>
</template>

<script>
    import SubButton from './sub-button';
    import addFanOne from './add-fan-one';
    import addFanTwo from './add-fan-two';
    import capacitance from './capacitance';

    export default {
        name: 'distribute-bar',
        components: { SubButton, capacitance, addFanOne, addFanTwo },
        props: ['enableRemove'],
        data () {
            return {
                // roleVisible: true,  //权限
                maxViewMode: true, // 是否处于最大化模式
                editMode: false // 手动优化模式
            };
        },
        computed: {
            planModified () {
                return !this.$store.state.scheme.modified && !this.$store.state.scheme.priceModify;
            },
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role === 3){
                    return true;
                }
                else if(this.$store.state.user.loginUserInfo.role === 10){
                    return true;
                }
                else if(this.$store.state.user.loginUserInfo.role === 11){
                    return true;
                }
                else{
                    return false;
                }
                
            },
            roleVisible: function(){
                if(this.$store.state.user.loginUserInfo.role!=1 
                && this.$store.state.user.loginUserInfo.role!=9 
                && this.$store.state.user.loginUserInfo.role!=10
                && this.$store.state.user.loginUserInfo.role!=11 
                && this.$store.state.user.loginUserInfo.role!=12 ){
                    return false;
                }
                else{
                    return true;
                }
            },
            ///游客模式也显示二级按钮，但至灰色
            enManagerBtn: function () {
                if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                    return true;
                }else{
                    return false;
                }
            }
        },
        watch: {
            // planModified (val) {
            //     this.$emit('planModified', val);
            // },
           
        },
        mounted() {
            // console.log(this.$store.state.user.loginUserInfo.role);   // 1 ,9 才有导入10只能看
           
        },
        methods: {
            // showWindGauge () {
            //     this.$emit('showWindGauge');
            //     this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('distributeClick', 'showWindGauge');
            // },
          

            exitEdit (closeFunction) {
                let callback = () => {
                    this.editMode = false;
                    this.$emit('editModeChange', this.editMode);
                    if (closeFunction) {
                        closeFunction();
                    }
                };
                if (this.planModified) {
                    // 如果没有修改
                    callback();
                } else {
                    this.$confirm('有未保存的方案优化操作，是否保存并提交重新计算？', '提示', {
                        confirmButtonText: '保存',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.invokeParentCalculateMethod();
                    }).catch(() => {
                        callback();
                        this.invokeParentMethod('cancelled');
                    });
                }
                this.$emit("addCustomLabel","close");
            },
            onClick (type) {
                // console.log(type)
                // this.onAddClick();
                // this.$refs.btnAdd.onClick();
                switch (type) {
                    case "daoru" :
                        if(this.enManager){
                            this.$message('您没有权限执行此操作！');
                            return;
                        }
                        // console.log(111);
                        this.$emit('daoruXlxs');
                    break
                    case 'shoudongyouhua':
                        if(this.enManager){
                            this.$message('您没有权限执行此操作！');
                            return;
                        }
                        if (!this.editMode) {
                            this.editMode = true;
                            this.$emit('editModeChange', this.editMode);

                            //等效小时数
                            this.$emit("addCustomLabel","open");
                            return;
                        }
                        this.exitEdit();
                        break;
                    case 'exitYouhua':
                        this.exitEdit();
                        break;
                    case 'minview': 
                    case 'maxview':
                        this.maxViewMode = !this.maxViewMode;
                        this.$emit('viewChange', this.maxViewMode);
                        break;
                    case 'close':
                        this.exitEdit(() => {
                            this.maxViewMode = true;
                            this.$emit('viewChange', this.maxViewMode);
                            this.$emit('close');
                            this.invokeParentMethod('close');
                        });
                        break;
                    case 'changeType':
                        this.$emit('changeType');
                        break;
                    case 'del':
                        this.$emit('delSelectedRows');
                        break;
                    case 'rollback':
                        this.invokeParentMethod(type);
                        
                        break;
                    case 'calculate':
                        if (this.$store.state.scheme.currentFans.length === 0) {
                            this.$message.warning('机位点不能为空!');
                            return;
                        }
                        this.$alert('确定保存修改并重新计算?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            center: true,
                            callback: action => {
                                if (action === 'confirm') {
                                    this.invokeParentCalculateMethod();
                                }
                            }
                        });
                        break;
                    default:
                        this.invokeParentMethod(type);
                        break;
                }
            },
            onAddClick (funId, selected) {
                this.invokeParentMethod('add', selected);
            },
            onCoordinateAddClick (funId, selected) {
                this.maxViewMode =  false;
                this.$emit('viewChange', this.maxViewMode);
                this.invokeParentMethod('coordinateAdd', selected);
            },
            setUnSelectAdd (value, refs) {
                if (refs) {
                    this.$refs['coordinateAdd'].setUnSelect();
                    this.invokeParentMethod('coordinateAdd', false);
                } else {
                    this.$refs['btnAdd'] && this.$refs['btnAdd'].setUnSelect();
                }
            },
            invokeParentMethod (type, selected, callback) {
                if (!this.$parent || !this.$parent.$parent) {
                    return;
                }
                // this.$parent.$parent.$emit('distributeClick', type, selected);
                this.$parent.$parent.onDistribute(type, selected, callback);
            },
            invokeParentCalculateMethod () {
                this.$store.commit('globeLoading', {loading: true, text: '正在保存并进行重新计算...'});
                this.$emit("addCustomLabel","close");
                let callbackFunciton = (res) => {
                    this.$store.commit('globeLoading', {loading: false, text: ''});

                    if (!res.saved) {
                        // 保存失败
                        this.$message.error('保存修改失败，请稍后重试！');
                        return;
                    }
                    // 保存成功
                    this.editMode = false;
                    this.$emit('editModeChange', this.editMode);

                    if (!res.calcuate) {
                        // 计算失败
                        this.$message.error('重新计算失败，请稍后重试！');
                        return;
                    }

                    // if (!res.calcuate_over) {
                    //     // 计算失败
                    //     this.$message.error('获取计算状态失败，建议刷新项目数据！');
                    //     return;
                    // }
                    this.$message.success('保存完成，正在重新计算...');

                    // // 关闭页面
                    this.maxViewMode = true;
                    this.$emit('viewChange', this.maxViewMode);
                    this.$emit('close');
                    this.invokeParentMethod('close');
                    
                };
                this.invokeParentMethod('calculate', false, callbackFunciton);
            }
        }
    };
</script>

<style scoped>
    .container{
        display: flex;
        flex-direction: row;
        position: absolute;
        top: -58px;
    }
    .main-panel{
        border-radius: 5px 5px 5px 5px;
        display: flex;
        flex-direction: row;
        height: 50px;
        /* width: 380px; */
    }
    .calculate-panel{
        margin-left: 1px;
        height: 50px;
        width: 50px;
    }
    .spacespandiv {
        background-color:rgba(3, 32, 62, 0.6)
    }
    .spacespan {
        border-right-color: #ffffff;
        border-right-width: 1px;
        border-right-style: solid;
        opacity: 0.3;
        /* height: 5px; */
        vertical-align: middle;
        position: relative;
        top: 9px;
    }
    .sanjiao{
        width: 0;
        height: 0;
        border-top: 50px solid rgba(0,0,0,0);
        border-right: 50px solid rgba(3, 28, 53, 0.5);
        float: right;
    }
</style>
