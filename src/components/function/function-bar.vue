<template>
    <div  v-show="barVisible">
        <!-- //正常 -->
        <div class="bar-container" v-if="!enManager">
                <legend-noise :isSelect="noiseShow"></legend-noise>
                <div class="all-function-panel-legend" v-bind:class="{legendBorder: legendBorder}">
                    <legend-button ref="legendButton" @border="setBorder"></legend-button>
                </div>
                <div class="all-function-panel" style="margin-left: 8px">
                    <function-button ref="fun3" desc="参考因素" icon="flow" :fun-id="3" :sep="goldfoamMode?1:null"
                        :left="true"
                        :right="true"   
                        :projectId="projectId"
                        
                        @funSelectChange="onFunChange"
                        @lakeRestrict="onLakeRestrict"
                        @roadRestrict="onRoadRestrict"
                        @houseRestrict="onHouseRestrict"
                        @zaoyinRestrict="onZaoyinRestrict"
                        @redLineRestrict="onRedLineRestrict"
                        @denggaoxian="onDenggaoxian"
                        @dataChange2="onDataChange2"
                        @closeCesiumContainer="onCloseCesiumContainer"
                        :newdistributeVisible="distributeVisible"
                    ></function-button>
                </div>
                <div class="all-function-panel" style="margin-left: 8px">
                    <div class="bottomLineBox"><div class="line"></div><div class="name name1">风资源及排布</div><div class="line"></div></div>
                    <function-button ref="fun1" desc="综合风图谱" icon="map" :fun-id="1" :left="true" :sep="1" :width="80"
                                    @closeCesiumContainer="onCloseCesiumContainer"
                                     :projectId="projectId" @funSelectChange="onFunChange"></function-button>
                                     
                    <!-- <function-button ref="fun3" desc="限制因素" icon="flow" :fun-id="3" :sep="goldfoamMode?1:null"
                                     @funSelectChange="onFunChange"
                                     @lakeRestrict="onLakeRestrict"
                                     @roadRestrict="onRoadRestrict"
                                     @houseRestrict="onHouseRestrict"
                                     @zaoyinRestrict="onZaoyinRestrict"
                                     @redLineRestrict="onRedLineRestrict"
                                     @closeCesiumContainer="onCloseCesiumContainer"
                                     :newdistributeVisible="distributeVisible"
                    ></function-button> -->
                    <function-button ref="fun2" desc="扇区" v-show="goldfoamMode" icon="sector" :fun-id="2" :right="true" @funSelectChange="onFunChange"
                                     :projectId="projectId" :sep="2" :sep-on-select="true" :sectionNum="sectionNum"
                                     @changeFanRotaAngle="onChangeFanRotaAngle"
                                     @closeCesiumContainer="onCloseCesiumContainer"
                    ></function-button>
                    <!-- v-t-role="this.$store.state.user.loginUserInfo.role"  -->
                    <function-button 
                    ref="fun21" desc="排布方案" icon="array" :isDisable="calculating" :fun-id="21"
                    :right="true" :sep="2"
                    v-show="distributeVisible"
                    @funSelectChange="onFunChange" @showWindGauge="showWindGauge"></function-button>
                    <!-- <function-button ref="fun31" desc="方案比选" icon2="duibi" icon="duibi"  :fun-id="31"
                        :projectId="projectId"
                        :planId="planId"
                        :left="true"
                        :right="true"
                        v-show="!distributeVisible"
                        @funSelectChange="onFunChange"
                    ></function-button> -->
                    <transition name="slide-bar">
                        <div v-show="sectionVisible" class="button-panel" :style="{overflow: this.layerShow ? 'unset' : 'hidden'}">
                            <function-button ref="fun11" desc="风图谱" icon="atlas" :fun-id="11" :left="true"
                                             @funSelectChange="onFunChange"></function-button>
                            <function-button ref="fun12" desc="尾流" icon="wake" :fun-id="12"
                                             @funSelectChange="onFunChange"></function-button>
                            <function-button ref="fun13" desc="风能切片" icon="section" :fun-id="13"
                                             :projectId="projectId" :planId="planId"
                                             @funSelectChange="onFunChange"></function-button>
                            <function-button ref="fun14" desc="大湍流区" icon="wind" :fun-id="14"
                                             @funSelectChange="onFunChange"></function-button>
                            <function-button ref="fun15" desc="机组震动区" icon="shock" :fun-id="15" :right="true"
                                             @funSelectChange="onFunChange"></function-button>
                        </div>
                    </transition>
                </div>
                <div class="all-function-panel"
                     :style="{marginLeft: '8px', background: calculating ? 'rgba(3, 32, 62, 0.4)' : 'rgba(3, 32, 62, 0.6)'}">
                     <div class="bottomLineBox" v-if="distributeVisible"><div class="line"></div><div class="name">工程设计</div><div class="line"></div></div>
                    <!-- <function-button v-t-role="this.$store.state.user.loginUserInfo.role" ref="fun21" desc="排布方案" icon="array" :isDisable="calculating" :fun-id="21"
                                     v-if="distributeVisible" :left="true" :sep="2"
                                     @funSelectChange="onFunChange" @showWindGauge="showWindGauge"></function-button> -->
                    <!-- <function-button ref="fun25" desc="查看报告" icon="baogaoxiawu" :isDisable="calculating" :fun-id="25"
                                     v-if="distributeVisible"  :sep="2"
                                     @funSelectChange="onFunChange"></function-button> -->
                    <!--<function-button ref="fun22" desc="场内道路" icon="road" :isDisable="calculating" :fun-id="22"-->
                                     <!--:projectId="projectId" :planId="planId"-->
                                     <!--v-if="distributeVisible" @funSelectChange="onFunChange"-->
                                     <!--@roadReCalculatingShow="roadReCalculatingShow"></function-button>-->
                    <function-button ref="fun26" desc="场内道路" icon="road" :isDisable="calculating" :fun-id="26"
                                     :projectId="projectId" :planId="planId"
                                     :left="true"
                                     v-if="distributeVisible && checked_road" @funSelectChange="onFunChange"
                                     @closeCesiumContainer="onCloseCesiumContainer"
                                     @roadReCalculatingShow="onRoadReCalculatingShow"
                                     @roadshoudongyouhuShow="roadshoudongyouhuShow"></function-button>
                    <function-button ref="fun23" desc="升压站" icon="boost" :isDisable="calculating" :fun-id="23"
                                     v-if="distributeVisible && checked_station"
                                     :projectId="projectId"
                                     :planId="planId"
                                     @closeCesiumContainer="onCloseCesiumContainer"
                                     @funSelectChange="onFunChange"
                                     @stationDaochuShow="stationDaochuShow"
                                     @stationYouhuaShow="stationYouhuaShow"
                                     @mouseover="onStationMouseOver"
                                     @stationImport="onStationImport"
                    ></function-button>
                    <function-button ref="fun24" desc="集电线路" icon="line" :isDisable="calculating" :fun-id="24"
                                     :projectId="projectId"
                                     :planId="planId"
                                     @jidianshoudongyouhuShow="jidianshoudongyouhuShow"
                                     v-if="distributeVisible && checked_line"
                                     :right="true"
                                     @closeCesiumContainer="onCloseCesiumContainer"
                                     @funSelectChange="onFunChange"
                                     @autoOptimizationShow="autoOptimizationShow"
                    @lineReCalculatingShow="onLineReCalculatingShow"></function-button>
                </div>
                <div class="all-function-panel" style="margin-left: 8px">
                        <div class="bottomLineBox" v-if="distributeVisible"><div class="line"></div><div class="name">经评</div><div class="line"></div></div>
                    <function-button ref="fun30" desc="经评" icon="baogaoxiawu" :fun-id="30"
                                    :projectId="projectId"
                                    :planId="planId"
                                    :left="true"
                                    :right="true"
                                    :isDisable="calculating"
                                    v-if="distributeVisible"
                                    
                                    @closeCesiumContainer="onCloseCesiumContainer"
                                    @showPlanDetail="onShowPlanDetail"
                                    @funSelectChange="onFunChange"
                                    ></function-button>
                </div>
                <div class="all-function-panel" style="margin-left: 8px">
                    <function-button ref="fun30" desc="初设报告" :icon="iconReport" :fun-id="50"
                                    :projectId="projectId"
                                    :planId="planId"
                                    :left="true"
                                    :right="true"
                                    :top="true"
                                    :bottom="true"
                                    :isDisable="calculating || iconReport == 'loading'"
                                    v-if="distributeVisible && report"
                                    @closeCesiumContainer="onCloseCesiumContainer"
                                    @onXinjiangReprot="onXinjiangReprot" 
                                    ></function-button>
                </div>
        </div>

        <!-- //游客 -->
        <div class="bar-container" v-if="enManager">
                <legend-noise :isSelect="noiseShow"></legend-noise>
                <div class="all-function-panel-legend" v-bind:class="{legendBorder: legendBorder}">
                    <legend-button ref="legendButton" @border="setBorder"></legend-button>
                </div>

                <div class="all-function-panel" style="margin-left: 8px">
                    <function-button ref="fun3" desc="参考因素" icon="flow" :fun-id="3" :sep="goldfoamMode?1:null"
                        :left="true"
                        :right="true"   
                        :projectId="projectId"
                        
                        @funSelectChange="onFunChange"
                        @lakeRestrict="onLakeRestrict"
                        @roadRestrict="onRoadRestrict"
                        @houseRestrict="onHouseRestrict"
                        @zaoyinRestrict="onZaoyinRestrict"
                        @redLineRestrict="onRedLineRestrict"
                        @denggaoxian="onDenggaoxian"
                        @dataChange2="onDataChange2"
                        @closeCesiumContainer="onCloseCesiumContainer"
                        :newdistributeVisible="distributeVisible"
                    ></function-button>
                </div>

                <div class="all-function-panel" style="margin-left: 8px">
                    <div class="bottomLineBox"><div class="line"></div><div class="name name1">风资源及排布</div><div class="line"></div></div>
                    
                    <function-button ref="fun1" desc="综合风图谱" icon="map" :fun-id="1" :left="true" :sep="1" :width="80"
                                    @closeCesiumContainer="onCloseCesiumContainer"
                                    v-show="isShowZhonehe"
                                        :projectId="projectId" @funSelectChange="onFunChange"></function-button>
                    
                    <function-button 
                    ref="fun21" desc="排布方案" icon="array" :isDisable="calculating" :fun-id="21"
                    :right="true" :sep="2"
                    v-show="distributeVisible"
                    @funSelectChange="onFunChange" @showWindGauge="showWindGauge"></function-button>
                   
                   
                </div>
                <div class="all-function-panel"
                     :style="{marginLeft: '8px', background: calculating ? 'rgba(3, 32, 62, 0.4)' : 'rgba(3, 32, 62, 0.6)'}">
                     <div class="bottomLineBox" v-if="road_check || xianlu_check || shengya_check"><div class="line"></div><div class="name">工程设计</div><div class="line"></div></div>
                    <!-- {{road_check}}---{{xianlu_check}}---{{shengya_check}} -->
                    <function-button ref="fun26" desc="场内道路" icon="road" :isDisable="calculating" :fun-id="26"
                                     :projectId="projectId" :planId="planId"
                                     :left="true"
                                     v-show="road_check"
                                     v-if="distributeVisible" @funSelectChange="onFunChange"
                                     @closeCesiumContainer="onCloseCesiumContainer"
                                     @roadReCalculatingShow="onRoadReCalculatingShow"
                                     @roadshoudongyouhuShow="roadshoudongyouhuShow"></function-button>
                    <function-button ref="fun23" desc="升压站" icon="boost" :isDisable="calculating" :fun-id="23"
                                     v-if="distributeVisible"
                                     v-show="shengya_check"
                                     :projectId="projectId"
                                     :planId="planId"
                                     @closeCesiumContainer="onCloseCesiumContainer"
                                     @funSelectChange="onFunChange"
                                     @stationDaochuShow="stationDaochuShow"
                                     @stationYouhuaShow="stationYouhuaShow"
                                     @mouseover="onStationMouseOver"
                                     @stationImport="onStationImport"
                    ></function-button>
                    <function-button ref="fun24" desc="集电线路" icon="line" :isDisable="calculating" :fun-id="24"
                                     :projectId="projectId"
                                     :planId="planId"
                                     @jidianshoudongyouhuShow="jidianshoudongyouhuShow"
                                     v-if="distributeVisible"
                                     v-show="xianlu_check"
                                     :right="true"
                                     @closeCesiumContainer="onCloseCesiumContainer"
                                     @funSelectChange="onFunChange"
                                     @autoOptimizationShow="autoOptimizationShow"
                    @lineReCalculatingShow="onLineReCalculatingShow"></function-button>
                </div>
               
        </div>
        
    </div>
</template>

<script>
    import FunctionButton from './function-button';
    import legendButton from './legend-button';
    import LegendNoise from './legend-noise';
    import util from '../../libs/util';
    export default {
        name: 'function-bar',
        components: {FunctionButton, legendButton ,LegendNoise},
        props: {
            sectionNum: {
                type: Number,
                default: 0
            },
            isShowZhonehe:{
               
            },
            road_check:{

            },
            xianlu_check:{

            },
            shengya_check:{

            }
        },
        mounted() {
            // this.Bus.$on("zaoyinPhoto",(val)=>{
            //     this.noiseShow = val
            // })
        },
        data () {
            return {
                iconReport: 'xiazaijiangyiicon',
                checked_station : true,
                checked_line : true,
                checked_road : true,
                noiseShow: false,
                projectId: 0,
                planId: 0,
                barVisible: false,
                sectionVisible: false,
                distributeVisible: false,
                calculating: false,
                distributeLeft: 0,
                layerShow: false,
                projectInfo: {},
                legendBorder: false,
                // isPlanModified: true,
                tempDistributeBar: false,
                goldfoamMode: null // 当前是否是goldfoam模式
            };
        },
        computed: {
            isPlanModified () {
                console.log(this.$store.state.scheme);
                return !this.$store.state.scheme.modified && !this.$store.state.scheme.priceModify;
            },
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                    return true;
                }else{
                    return false;
                }
            },
            report (){
                if(this.$store.state.user.loginUserInfo.user_id == 1 
                    || this.$store.state.user.loginUserInfo.user_id == 20 
                    || this.$store.state.user.loginUserInfo.user_id == 21 
                    || this.$store.state.user.loginUserInfo.user_id == 22){
                    return true
                }else{
                    return false
                }
            }
           
        },
        watch: {
            '$store.state.app.currentCalMode': function (val) {
                this.goldfoamMode = val;
            },
            calculating: function(val){
                if(val){
                    //监听关闭三维集电线路
                    window.viewer.collectLine('', '', false);
                }
            },
            
        },
        methods: {
            //查询是否有升压站那些模块
            getRoadLineData(){
                util.ajax.get("/engineering_choose/"+ this.projectId).then((res)=>{
                    if(res.data.code == 200){
                        this.checked_station = res.data.data.checked_station;
                        this.checked_line = res.data.data.checked_line;
                        this.checked_road = res.data.data.checked_road;
                    }
                }).catch((err)=>{
                    
                    console.log(err)
                })
            },
            // planModified (val) {
            //     console.log(val);
            //     this.isPlanModified = val;
            // },
            onCloseCesiumContainer(type){
                this.$emit("closeCesiumContainer",false);
            },
            onShowPlanDetail(plandata){
                this.$emit("showPlanDetail",plandata);
            },
            show (projectId) {
                this.projectId = projectId;
                this.barVisible = true;
                this.sectionVisible = false;
                this.distributeVisible = false;

                this.checked_station = true;
                this.checked_line = true;
                this.checked_road = true;
                
                if(!this.enManager){
                    this.$refs['fun1'] && this.$refs['fun1'].setUnselected();
                    this.$refs['fun2'] && this.$refs['fun2'].setUnselected();
                    this.$refs['fun3'] && this.$refs['fun3'].setUnselected();
                    this.$refs['fun13'] && this.$refs['fun13'].setUnselected();
                }
                else{
                    this.$refs['fun1'] && this.$refs['fun1'].setUnselected();
                    this.$refs['fun3'] && this.$refs['fun3'].setUnselected();
                }

                // this.$refs['fun21'].style.opacity = 0.1;
                this.getRoadLineData()
            },
            close () {
                this.barVisible = false;
            },
            show1 () {
                this.barVisible = true;
            },
            resetDefault () {
                this.$refs['fun1'] && this.$refs['fun1'].setUnselected();
                if(!this.enManager){
                    this.$refs['fun2'] && this.$refs['fun2'].setUnselected();
                }
                this.$refs['fun3'] && this.$refs['fun3'].setUnselected();
                this.$refs['fun21'] && this.$refs['fun21'].setUnselected();
                // this.$refs['fun22'] && this.$refs['fun22'].setUnselected();
                this.$refs['fun23'] && this.$refs['fun23'].setUnselected();
                this.$refs['fun24'] && this.$refs['fun24'].setUnselected();
                // this.$refs['fun25'] && this.$refs['fun25'].setUnselected();
                this.$refs['fun26'] && this.$refs['fun26'].setUnselected();
                this.sectionVisible = false;
                this.$refs['fun11'] && this.$refs['fun11'].setUnselected();
                this.$refs['fun12'] && this.$refs['fun12'].setUnselected();
                this.$refs['fun13'] && this.$refs['fun13'].setUnselected();
                this.$refs['fun14'] && this.$refs['fun14'].setUnselected();
                this.$refs['fun15'] && this.$refs['fun15'].setUnselected();
            },
            showDistribute (planId, calculating) {
                this.planId = planId;
                this.distributeVisible = true;
                this.calculating = calculating;
            },
            setCalculating (calculating) {
                this.calculating = calculating;
                if (calculating) {
                    this.$refs['fun21'] && this.$refs['fun21'].setUnselected();
                    // this.$refs['fun22'].setUnselected();
                    this.$refs['fun23'] && this.$refs['fun23'].setUnselected();
                    this.$refs['fun24'] && this.$refs['fun24'].setUnselected();
                    // this.$refs['fun25'].setUnselected();
                    this.$refs['fun26'] && this.$refs['fun26'].setUnselected();
                }
            },
            closeDistribute () {
                this.distributeVisible = false;
            },
            setSection (angle) {
                this.$refs['fun11'].setSection(angle, this.projectId, this.planId);
                this.$refs['fun12'].setSection(angle, this.projectId, this.planId);
                this.$refs['fun13'].setSection(angle, this.projectId, this.planId);
                this.$refs['fun14'].setSection(angle, this.projectId, this.planId);
                this.$refs['fun15'].setSection(angle, this.projectId, this.planId);
            },
            onFunChange (funId, selected) {
                 //点击下面工具条任何状态都好，都关闭风机信息界面
                this.$emit("closeFanDetail"); 
                this.$parent.onClearHighLightFan();
                this.$parent.onClearHighLightMast();
                // 开关综合风图谱
                if (funId === 1) {
                    this.noiseShow = false;
                    this.$emit('integrateWindMap', this.projectId, selected);
                }
                // 打开综合风图谱的同时关掉普通风图谱
                if (funId === 1 && selected) { // 综合风图谱
                    // this.$refs['fun11'].setUnselected();

                    this.$refs['fun23'] && this.$refs['fun23'].setUnselected();
                    this.$refs['fun24'] && this.$refs['fun24'].setUnselected();
                    this.$refs['fun26'] && this.$refs['fun26'].setUnselected();
                    this.$emit('distributeBarSelected', funId, this.projectId, this.planId, false || this.tempDistributeBar); // 加入或条件，当方案优化状态下面，点击风机不能看到详情
                    this.$emit('sectionChange', funId, this.projectId, this.planId, false);
                    if (this.tempDistributeBar) this.$emit('tempDistributeBar');

                    // 综合风图谱&限制因素互斥
                    if(!this.enManager){
                        this.$refs['fun11'] && this.$refs['fun11'].setUnselected();
                    }
                    this.$refs['fun3'] && this.$refs['fun3'].setUnselected();
                    this.$emit('restrict', this.projectId, !selected);
                }
                // 开关扇区
                if (funId === 2) {
                    this.noiseShow = false;
                    this.$refs['fun11'].setUnselected();
                    this.$refs['fun12'].setUnselected();
                    this.$refs['fun13'].setUnselected();
                    this.$refs['fun14'].setUnselected();
                    this.$refs['fun15'].setUnselected();

                    this.$refs['fun23'].setUnselected();
                    this.$refs['fun24'].setUnselected();
                    this.$refs['fun26'].setUnselected();
                    this.layerShow = false;
                    this.sectionVisible = selected;
                    this.$refs['fun24'] && this.$refs['fun24'].shan(selected);
                    selected && this.$emit('distributeBarSelected', funId, this.projectId, this.planId, false || this.tempDistributeBar); // 加入或条件，当方案优化状态下面，点击风机不能看到详情
                    this.$emit('sectionVisible', this.projectId, selected);

                    // 扇区&限制因素互斥
                    if (selected) {
                        this.$refs['fun3'] && this.$refs['fun3'].setUnselected();
                        this.$emit('restrict', this.projectId, !selected);
                    }
                }
                //游客
                if (funId === 3 && this.enManager) {
                    this.noiseShow = false;
                    if (this.isPlanModified) {
                        this.$refs['fun21'] && this.$refs['fun21'].setUnselected();
                        //关闭手动优化
                        selected && this.$emit('distributeBarSelected', funId, this.projectId, this.planId, false);

                        this.$emit('restrict', this.projectId, selected);
                        // 综合风图谱&限制因素&扇区互斥
                        if (selected) {
                            // 综合风图谱&限制因素互斥
                            this.$refs['fun1'] && this.$refs['fun1'].setUnselected();

                            if(this.isShowZhonehe){
                                this.$emit('integrateWindMap', this.projectId, !selected);
                            }

                            this.$refs['fun23'] && this.$refs['fun23'].setUnselected();
                            this.$refs['fun24'] && this.$refs['fun24'].setUnselected();
                            this.$refs['fun26'] && this.$refs['fun26'].setUnselected();
                            this.layerShow = false;
                            this.sectionVisible = !selected;

                        }
                    }
                }
                // 开关限制因素--正常
                if (funId === 3 && !this.enManager) {
                    this.noiseShow = false;
                    if (this.isPlanModified) {
                        this.$refs['fun21'] && this.$refs['fun21'].setUnselected();
                        selected && this.$emit('distributeBarSelected', funId, this.projectId, this.planId, false);
                        this.$emit('restrict', this.projectId, selected);

                        // 综合风图谱&限制因素&扇区互斥
                        if (selected) {
                            // 综合风图谱&限制因素互斥
                            this.$refs['fun1'] && this.$refs['fun1'].setUnselected();
                            this.$emit('integrateWindMap', this.projectId, !selected);

                            // 扇区&限制因素互斥
                            this.$refs['fun2'] && this.$refs['fun2'].setUnselected();
                            this.$refs['fun11'] && this.$refs['fun11'].setUnselected();
                            this.$refs['fun12'] && this.$refs['fun12'].setUnselected();
                            this.$refs['fun13'] && this.$refs['fun13'].setUnselected();
                            this.$refs['fun14'] && this.$refs['fun14'].setUnselected();
                            this.$refs['fun15'] && this.$refs['fun15'].setUnselected();

                            this.$refs['fun23'] && this.$refs['fun23'].setUnselected();
                            this.$refs['fun24'] && this.$refs['fun24'].setUnselected();
                            this.$refs['fun26'] && this.$refs['fun26'].setUnselected();
                            this.layerShow = false;
                            this.sectionVisible = !selected;
                            // this.$refs['fun24'].shan(!selected);
                            this.$emit('sectionVisible', this.projectId, !selected);
                        }
                    } else {
                        // this.$confirm('有未保存的方案优化操作，是否保存并提交重新计算？', '提示', {
                        //     confirmButtonText: '确定',
                        //     cancelButtonText: '取消',
                        //     type: 'warning'
                        // }).then(() => {
                        //     this.$emit('distributeClick', 'calculate');
                        // }).catch(() => {
                        //     this.$refs['fun21'].showSubMenu(true);
                        //     this.$emit('distributeClick', 'cancelled');
                        // });
                    }
                }

                // 风图谱大湍流区,机组震动
                if (funId === 11 || funId === 13 || funId === 14 || funId === 15) {
                    this.$emit('sectionChange', funId, this.projectId, this.planId, selected);
                }
                // 打开普通风图谱关闭综合风图谱
                if (funId === 11 && selected) {
                    this.$refs['fun1'] && this.$refs['fun1'].setUnselected();
                    this.$emit('integrateWindMap', this.projectId, false);
                }
                // 尾流
                if (funId === 12) {
                    this.$emit('sectionChange', funId, this.projectId, this.planId, selected);
                }
                // 风能切片
                if (funId === 13) {
                    this.layerShow = selected;
                }
                // 方案优化
                if (funId === 21) {
                    // if (this.$store.state.user.loginUserInfo.role === 3) {
                        // this.$message('企业管理员没有权限执行此操作！');
                        // this.$refs['fun21'].setUnselected();
                        //修改不至灰，能打开，手动优化不显示
                    // } else {
                        if (this.isPlanModified) {
                            //打开后把方案最小化
                            this.$emit("minPlanMasterProject");
                            // this.$refs['fun22'].setUnselected();
                            this.$refs['fun3'] && this.$refs['fun3'].setUnselected();
                            this.$refs['fun23'] && this.$refs['fun23'].setUnselected();
                            this.$refs['fun24'] && this.$refs['fun24'].setUnselected();
                            // this.$refs['fun25'].setUnselected();
                            this.$refs['fun26'] && this.$refs['fun26'].setUnselected();
                            this.$emit('distributeBarSelected', funId, this.projectId, this.planId, selected);
                            // 储存激活手动优化的中间态
                            this.tempDistributeBar = selected;
                        } else {
                            this.$confirm('有未保存的方案优化操作，是否保存并提交重新计算？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.$emit('distributeClick', 'calculate');
                            }).catch(() => {
                                this.$emit('distributeClick', 'cancelled');
                                // this.isPlanModified = true;
                                this.$refs['fun21'] && this.$refs['fun21'].showSubMenu(true);
                                // this.$refs['fun24'].setUnselected();
                                // this.$refs['fun25'].setUnselected();
                                // this.$refs['fun26'].setUnselected();
                                // this.$emit('distributeActived', selected);
                                // if (selected) {
                                //     this.$emit('playFunChange', funId, this.projectId, this.planId, selected);
                                // }
                            });
                        }
                    // }
                }
                // 升压站
                if (funId === 23) {
                    if (this.isPlanModified) {
                        //打开后把方案最小化
                        this.$emit("minPlanMasterProject");
                        //选中工程设计  和排布方案,凤图,限制 互斥
                        this.$refs['fun21'] && this.$refs['fun21'].setUnselected();
                        this.$refs['fun1'] && this.$refs['fun1'].setUnselected();
                        this.$refs['fun3'] && this.$refs['fun3'].setUnselected();
                        // this.$refs['fun25'].setUnselected();
                        // this.$refs['fun26'].setUnselected();
                        selected && this.$emit('setFalseDistributeBar');
                        this.$emit('stationBarSelected', this.projectId, this.planId, selected);
                        // todo 需要同时判断集电线路是不是也被选中从而传递一个新的事件
                    } else {
                        this.$refs['fun23'] && this.$refs['fun23'].setUnselected();
                        this.$refs['fun24'] && this.$refs['fun24'].setUnselected();
                        this.$refs['fun26'] && this.$refs['fun26'].setUnselected();
                        this.$confirm('有未保存的方案优化操作，是否保存并提交重新计算？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$emit('distributeClick', 'calculate');
                        }).catch(() => {
                            this.$emit('distributeClick', 'cancelled');
                            this.$refs['fun23'] && this.$refs['fun23'].setUnselected();
                            // todo 需要同时判断集电线路是不是也被选中从而传递一个新的事件
                        });
                    }
                }
                // 集电线路
                if (funId === 24) {
                    if (this.isPlanModified) {
                        //打开后把方案最小化
                        this.$emit("minPlanMasterProject");
                        //选中工程设计  和排布方案,凤图,限制 互斥
                        this.$refs['fun21'] && this.$refs['fun21'].setUnselected();
                        this.$refs['fun1'] && this.$refs['fun1'].setUnselected();
                        this.$refs['fun3'] && this.$refs['fun3'].setUnselected();
                        // this.$refs['fun25'].setUnselected();
                        // this.$refs['fun26'].setUnselected();
                        selected && this.$emit('setFalseDistributeBar');
                        this.$emit('lineBarSelected', this.projectId, this.planId, selected);
                        // todo 需要同时判断集电线路是不是也被选中从而传递一个新的事件
                        if (selected) {
                            let currentPlanData = this.$store.state.app.currentPlanData;
                            let haveData = !(currentPlanData && currentPlanData.step_status && currentPlanData.step_status.jdxl && currentPlanData.step_status.jdxl.status === 4);
                            if (!haveData) {
                                this.$message({
                                    showClose: true,
                                    message: '线路自动设计失败，建议进行手动设计。'
                                });
                            }
                        }
                    } else {
                        this.$confirm('有未保存的方案优化操作，是否保存并提交重新计算？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$emit('distributeClick', 'calculate');
                        }).catch(() => {
                            
                            this.$refs['fun24'] && this.$refs['fun24'].setUnselected();
                            // todo 需要同时判断升压站是不是也被选中从而传递一个新的事件
                            this.$emit('distributeClick', 'cancelled');
                        });
                    }
                }
                // 场内道路
                if (funId === 26) {
                    if (this.isPlanModified) {
                        //打开后把方案最小化
                        this.$emit("minPlanMasterProject");
                        //选中工程设计  和排布方案,凤图,限制 互斥
                        this.$refs['fun21'] && this.$refs['fun21'].setUnselected();
                        this.$refs['fun1'] && this.$refs['fun1'].setUnselected();
                        this.$refs['fun3'] && this.$refs['fun3'].setUnselected();
                        // this.$refs['fun23'].setUnselected();
                        // this.$refs['fun24'].setUnselected();
                        // this.$refs['fun25'].setUnselected();
                        // donghong
                        // selected && this.$emit('distributeBarSelected', funId, this.projectId, this.planId, false);
                        selected && this.$emit('setFalseDistributeBar');
                        this.$emit('roadBarSelected', this.projectId, this.planId, selected);
                    } else {
                        this.$confirm('有未保存的方案优化操作，是否保存并提交重新计算？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$emit('distributeClick', 'calculate');
                        }).catch(() => {
                            
                            this.$refs['fun26'] && this.$refs['fun26'].setUnselected();
                            this.$emit('distributeClick', 'cancelled');
                        });
                    }
                }
                // 查看报告
                if (funId === 25) {
                    if (this.isPlanModified) {
                        this.$refs['fun21'] && this.$refs['fun21'].setUnselected();
                        // donghong
                        selected && this.$emit('distributeBarSelected', funId, this.projectId, this.planId, false);
                        this.$refs['fun23'] && this.$refs['fun23'].setUnselected();
                        this.$refs['fun24'] && this.$refs['fun24'].setUnselected();
                        this.$refs['fun26'] && this.$refs['fun26'].setUnselected();
                        this.$emit('reportBarSelected', this.projectId, this.planId);
                    } else {
                        this.$confirm('有未保存的方案优化操作，是否保存并提交重新计算？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$emit('distributeClick', 'calculate');
                        }).catch(() => {
                            // this.$refs['fun25'].setUnselected();
                            this.$emit('distributeClick', 'cancelled');
                        });
                    }
                }
                if(funId === 30){
                    //经评
                    this.$emit("closeFanOptimize",true);
                    //打开后把方案最小化
                    this.$emit("minPlanMasterProject");
                }
                //方案比选
                if(funId === 31){
                    
                    this.$emit("infoContrastBar",true);
                }
            },
            resetWrgWeight (val) {
                this.$refs['fun1'] && this.$refs['fun1'].resetValue(val);
            },
            resetSection (projectId, val) {
                if(!this.enManager){

                    this.$refs['fun2'] && this.$refs['fun2'].resetValue(val);
                    this.$refs['fun13'] && this.$refs['fun13'].setSection(parseFloat(val).toFixed(1), projectId);
                }
            },
            getLeft () {
                if (this.$refs['fun26']) {
                    return this.$refs['fun21'].$el.offsetLeft;
                } else {
                    return 0;
                }
            },
            setUnSelectAdd (value, ref) {
                this.$refs['fun21'] && this.$refs['fun21'].setUnSelectAdd(value, ref);
            },
            setUnSelect (funId) {
                this.$refs['fun' + funId] && this.$refs['fun' + funId].setUnselected();
            },
            showWindGauge () {
                this.barVisible = false;
                this.$emit('windGaugeShow', this.projectId, this.planId);
            },
            onRoadReCalculatingShow () {
                this.barVisible = false;
                this.$emit('roadReCalculatingShow');
            },
            onLineReCalculatingShow () {
                this.barVisible = false;
                this.$emit('lineReCalculatingShow');
            },
            jidianshoudongyouhuShow () {
                this.barVisible = false;
                this.$emit('jidianshoudongyouhuShow', this.projectId);
            },
            roadshoudongyouhuShow () {
                this.barVisible = false;
                this.$emit('roadshoudongyouhuShow', this.projectId);
            },
            autoOptimizationShow () {
                this.barVisible = false;
                this.$emit('autoOptimizationShow', this.projectId, this.planId);
            },
            stationDaochuShow () {
                this.$emit('stationDaochuShow');
            },
            stationYouhuaShow (selected) {
                this.$emit('stationYouhuaShow', selected);
            },
            setBorder (status) {
                this.legendBorder = status;
            },
            showStationBar (selected) {
                // if(this.enManager){   //改了显示二级按钮，不能点击
                //     return;
                // }
                this.$refs['fun23'] && this.$refs['fun23'].$refs['stationBar'].show(selected, null);
            },
            showJiDianBar (selected) {
                // if(this.enManager){
                //     return;
                // }
                this.$refs['fun24'] && this.$refs['fun24'].$refs['jidianBar'].show(selected, 0);
            },
            showRoadBar (selected) {
                // if(this.enManager){
                //     return;
                // }
                this.$refs['fun26'] && this.$refs['fun26'].$refs['roadBar'].show(selected, 0);
            },
            // 监听风机角度改变
            onChangeFanRotaAngle (angle) {
                this.$emit('changeFanRotaAngle', angle);
            },
            onStationMouseOver () {
                console.log('onStationMouseOver');
            },
            initReportIcon (){
                this.iconReport = 'xiazaijiangyiicon'
            },
            onXinjiangReprot (plandata) {
                this.iconReport = 'loading'
                this.$emit('onXinjiangReprot', plandata);
            },
            onLakeRestrict (selected) {
                this.$emit('lakeRestrict', selected);
            },
            onRoadRestrict (selected) {
                this.$emit('roadRestrict', selected);
            },
            onHouseRestrict (selected) {
                this.$emit('houseRestrict', selected);
            },
            onDenggaoxian (selected) {
                this.$emit('denggaoxian', selected);
            },
            onZaoyinRestrict (selected) {
                this.$emit('zaoyinRestrict', selected);
                this.noiseShow = selected
            },
            onRedLineRestrict (selected) {
                this.$emit('redLineRestrict', selected);
            },
            isPlanModifiedFun () {
                this.$confirm('有未保存的方案优化操作，是否保存并提交重新计算？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('distributeClick', 'calculate');
                }).catch(() => {
                    this.$refs['fun21'].showSubMenu(true);
                    this.$emit('distributeClick', 'cancelled');
                });
            },
            onStationImport () {
                this.$emit('stationImport');
            },
            onDataChange2(functionId, selectedData, projectId ,url){
                this.$emit('dataChange2', functionId, selectedData, projectId , url);
            }
        }
    };
</script>

<style lang="less" scoped>
    
    .bar-container {
        width: 80%;
        height: 65px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
        position: absolute;
        bottom: 33px;
        left: 10%;
    }

    .all-function-panel {
        height: 65px;
        background: rgba(3, 32, 62, 0.6);
        display: flex;
        flex-direction: row;
        border-radius: 5px;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .all-function-panel-legend {
        height: 266px;
        display: flex;
        flex-direction: row;
        border-radius: 5px;
        justify-content: center;
        align-items: flex-end;
    }
    .all-function-panel-legend.legendBorder{
        border: 1px solid rgba(255,255,255,1);
    }

    .button-panel {
        display: flex;
        flex-direction: row;
        width: 325px;
        height: 65px;
        overflow: hidden;
    }

    .slide-bar-enter-active {
        transition: width 0.3s;
    }

    .slide-bar-leave-active {
        transition: width 0.3s;
    }

    .slide-bar-enter, .slide-bar-leave-to {
        width: 0px;
    }

    .slide-bar-leave, .slide-bar-enter-to {
        width: 325px;
    }
    .bottomLineBox{
        position: absolute;
        bottom: -7px;
        width: 100%;
        height: 5px;
        border-left: 1px solid rgba(255,255,255,0.6);
        border-right: 1px solid rgba(255,255,255,0.6);
        color: rgba(255,255,255,0.6);
        display: flex;
        justify-content: space-between;
    }
    .bottomLineBox .line{
       border-bottom: 1px solid rgba(255,255,255,0.6);
       width: 18%
    }
    
    .bottomLineBox .name{
       font-size: 11px;
       width: 62%;
       text-align:center;
       position: relative;
       top: -3px;
    }
    .bottomLineBox .name1{
       /* width: 88px; */
    }
</style>
