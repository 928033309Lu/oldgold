<template>
    <!--<div v-if="barVisible" class="container" :style="{left:leftPosition+'px'}">-->
    <div v-if="barVisible" class="container">
       <!-- 正常 -->
        <div class="main-panel" v-if="!enManager">
            <el-tooltip class="item" effect="light" content="湖泊" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop"   icon="hehu" :left="true"  @funSelectChange="lakeRestrict" :selectMode="true">
                </sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="道路" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop"   icon="jiaotong-daolu"  @funSelectChange="roadRestrict" :selectMode="true">
                </sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="房屋" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop"   icon="zhufangguihua"  @funSelectChange="houseRestrict" :selectMode="true">
                </sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="噪音" placement="top" popper-class="custom-tooltip">
                <sub-button v-show="barnewdistributeVisible" desc="stop"   icon="zaoyin"  @funSelectChange="zaoyinRestrict" :selectMode="true">
                </sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="红线区" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop"  fontSize="16px" icon="caiqie_pinghangsibianxing" 
                            @funSelectChange="redLineRestrict" :selectMode="true">
                </sub-button>
            </el-tooltip>
            <!-- 等高线 -->
            <el-tooltip class="item" effect="light" content="等高线" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop"  icon="denggaoxian"  @funSelectChange="onDenggaoxian" :selectMode="true" :right="true"> 
                </sub-button>
            </el-tooltip>
        </div>
        <!-- 游客 -->
        <div class="main-panel" v-if="enManager">
            <el-tooltip class="item" effect="light" content="湖泊" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop"   icon="hehu" :left="true"  @funSelectChange="lakeRestrict" :selectMode="true">
                </sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="道路" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop"   icon="jiaotong-daolu"  @funSelectChange="roadRestrict" :selectMode="true">
                </sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="房屋" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop" :right="true"  icon="zhufangguihua"  @funSelectChange="houseRestrict" :selectMode="true">
                </sub-button>
            </el-tooltip>
            
        </div>
        
        <slide-three-bar ref="slideThreeBar"
                :unit="sliderUnit3"
                :function-id="funId"
                :projectId="projectId"
                :denggaoUrl="denggaoUrl"
                :dataList="denggaoList"
                @dataChange2="onDataChange2"
        ></slide-three-bar>
    </div>
</template>

<script>
    import SlideThreeBar from './slide-three-bar';//第三级的滑条
    import SubButton from './sub-button';
    import DesignUploadButton from './design-upload-button';
    

    export default {
        name: 'restrictAreaBar',
        components: {
            DesignUploadButton,
            SlideThreeBar,
            SubButton},
        props: {
            funId: {
                type: Number,
                default: 0
            },
            projectId: {
                type: Number,
                default: 0
            },
            planId: {
                type: Number,
                default: 0
            },
            barnewdistributeVisible:{
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                sliderUnit3:"m",
                threeBarVisible:false,
                barVisible: false,
                leftPosition: 0,
                isPlayDisable: false,
                isPauseDisable: true,
                isStopDisable: true,
                noiseOpen: false,   //
                redLineOpen: false,  //
                denggaoUrl: "",
                denggaoList:[]
            };
        },
        watch: {
            "$store.state.app.denggaoData":function(val){
                // console.log(val);
                if(val){
                    this.denggaoUrl = val.contour;
                    this.denggaoList = val.contour_layers.split(",");
                    // console.log(this.denggaoList);
                    // console.log(this.denggaoUrl);
                }
            }
        },
        computed:{
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                    return true;
                }else{
                    return false;
                }
            }
        },
        methods: {
            show (visible, left) {
                this.barVisible = visible;
                // this.onClick('stop');
                if (left !== null) {
                    this.leftPosition = left - 48; /* (40*4 - 65)/2 */
                }
            },
            onClick (type) {
                switch (type) {
                    case 'reCalculating':
                        this.$emit('roadReCalculatingShow');
                        break;
                    case 'youhua':
                        this.$emit('roadshoudongyouhuShow');
                        break;
                    case 'export':
                        this.exportDXF();
                        break;
                }
            },
            lakeRestrict (funId, selected) {
                this.$emit('lakeRestrict', selected);
            },
            roadRestrict (funId, selected) {
                this.$emit('roadRestrict', selected);
            },
            houseRestrict (funId, selected) {
                this.$emit('houseRestrict', selected);
            },
            redLineRestrict (funId, selected) {
                // console.log(funId, selected,"红线状态")
                this.$emit('redLineRestrict', selected);
            },
            zaoyinRestrict (funId, selected) {
                // console.log(funId, selected,"噪音状态")               
                this.$emit('zaoyinRestrict', selected);
                
            },
            onDenggaoxian (funId ,selected) {
                // console.log(selected);
                //后台接口
                this.$emit('denggaoxian', selected);
                //
                this.$refs['slideThreeBar'].show(selected, 100, [], null );
            },
            onDataChange2(functionId, selectedData, projectId ,url){
                // console.log(functionId, selectedData, projectId);
                //开三维接口转到home上写
                this.$emit('dataChange2', functionId, selectedData, projectId , url);
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
        left: 0;
        padding-bottom: 10px;
    }
    .main-panel{
        display: flex;
        flex-direction: row;
        height: 50px;
        /*width: 162px;*/
        width: 250px;
    }
    .threeBar{
        display: flex;
        position: absolute;
        top: -30px;
        left: 70%;
        /* border: 1px solid red; */
    }
</style>
