<template>
    <div class="button-container"
         :style="{
         width: width + 'px',
         color: selected ? '#33C86F' : '#D3DBE4',
         background: selected ? 'rgba(3,32,62,0.8)' : '',
         opacity: isDisable ? '0.4' : '1',
         borderTopLeftRadius: left ? '5px' : '',
         borderBottomLeftRadius: left ? '5px' : '',
         borderTopRightRadius: right ? '5px' : '',
         borderBottomRightRadius: right? '5px' : ''}"
         @click.self="onClick"
         @mouseenter.self="onEnter($event)"
         @mouseleave.self="onLeave($event)"
    @mouseover="onStationMouseOver"
    @mouseleave="onMouseLeave">
        <div class="icon-panel" @click="onClick">
            <i v-show="icon2 == 'duibi'" class="iconfont icon-duibi" style="font-size: 20px;"></i>
            <icon v-show="icon2 != 'duibi'" :name="icon" :class="icon=='flow'||icon=='sector'?'sizeIcon':''"></icon>
        </div>
        <div class="desc-panel" :style="{color:selected?'#33C86F':'#D3DBE4'}" @click="onClick">{{desc}}</div>
        <div class="sep-panel" v-if="sep">
            <div class="long-sep" v-if="sep === 1"></div>
            <div class="short-sep" v-if="sepOnSelect ? (selected && sep === 2): (sep === 2)"></div>
        </div>

        <!--限制区域-->
        <restrict-area-bar ref="restrictAreaBar"
                           :funId="funId"
                           :projectId="projectId"
                           :planId="planId"
                           @lakeRestrict="onLakeRestrict"
                           @roadRestrict="onRoadRestrict"
                           @houseRestrict="onHouseRestrict"
                           @zaoyinRestrict="onZaoyinRestrict"
                           @redLineRestrict="onRedLineRestrict"
                           @denggaoxian="onDenggaoxian"
                           @dataChange2="onDataChange2"
                           :barnewdistributeVisible="newdistributeVisible"
        ></restrict-area-bar>

        <slide-bar ref="slideBar"
                   :unit="sliderUnit"
                   :function-id="funId"
                   :projectId="projectId"
                   @changeFanRotaAngle="onChangeFanRotaAngle"
        ></slide-bar>
             
        <!--方案优化-->
        <!-- <distribute-bar @showWindGauge="showWindGauge" @planModified="planModified" ref="distributeBar"></distribute-bar> -->
        <!--查看报告-->
        <reporter-bar ref="ReporterBar"></reporter-bar>
        <!--场内道路-->
        <road-bar ref="roadBar" :funId="funId" :projectId="projectId" :planId="planId"
                  @roadReCalculatingShow="roadReCalculatingShow"
                  @roadshoudongyouhuShow="roadshoudongyouhuShow"></road-bar>
        <!--升压站-->
        <station-bar ref="stationBar" :funId="funId" :projectId="projectId" :planId="planId"
                     @stationDaochu="stationDaochuShow"
                     @stationYouhua="stationYouhuaShow"
                     @stationImport="onStationImport"
        ></station-bar>
        <!--<play-bar ref="roadBar" :funId="funId" :projectId="projectId" :planId="planId"></play-bar>-->
        <!--集电线路-->
        <jidian-bar ref="jidianBar"
                    @autoOptimizationShow="autoOptimizationShow"
                    @lineReCalculatingShow="lineReCalculatingShow"
                    @jidianshoudongyouhuShow="jidianshoudongyouhuShow"
                    :funId="funId" :projectId="projectId"
                    :planId="planId"
                    @closeCesiumContainer="onCloseCesiumContainer"
        ></jidian-bar>
        <diaref-bar ref="diarefBar" :projectId="projectId" ></diaref-bar>
    </div>
</template>

<script>
    import RoadBar from './road-bar';
    import StationBar from './station-bar';
    import PlayBar from './play-bar';
    import JidianBar from './jidian-bar';
    // import DistributeBar from './distribute-bar';
    import ReporterBar from './reporter-bar';
    import SlideBar from './slide-bar';
    import util from '@/libs/util';
    import DiarefBar from './diaref-bar';
    import RestrictAreaBar from './restrict-area-bar';


    export default {
        name: 'function-button',
        components: {DiarefBar, JidianBar, PlayBar, SlideBar, ReporterBar, RoadBar, StationBar, RestrictAreaBar},
        props: {
            width: {
                type: Number,
                default: 65
            },
            desc: {
                type: String,
                default: ''
            },
            icon: {
                type: String,
                default: 'copy'
            },
            icon2: {
                type: String
            },
            funId: {
                type: Number,
                default: 0
            },
            left: {
                type: Boolean,
                default: false
            },
            isDisable: {
                type: Boolean,
                default: false
            },
            right: {
                type: Boolean,
                default: false
            },
            sep: {
                type: Number,
                default: 0
            },
            sepOnSelect: {
                type: Boolean,
                default: false
            },
            sectionNum: {
                type: Number,
                default: 1
            },
            projectId: {
                type: Number,
                default: 0
            },
            planId: {
                type: Number,
                default: 0
            },
            newdistributeVisible:{
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                selected: false,
                sliderUnit: '',
                wrgHeights: [],
                defaultValue1: 90,
                defaultValue2: 0,
                stationOver: false,
                showStationAndLine: false,
                // isPlanModified: true
            };
        },
        mounted () {

        },
        computed: {
            sections () {
                const sectionStep = 360 / this.sectionNum;
                let sections = [];
                for (let index = 0; index < this.sectionNum; index++) {
                    sections.push(sectionStep * index);
                }
                return sections;
            },
            isPlanModified () {
                return !this.$store.state.scheme.modified && !this.$store.state.scheme.priceModify;
            },
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                    return true;
                }else{
                    return false;
                }
            },
        },
        methods: {
            getwrgHeights(){
                console.log(this.selected)
                if(this.funId == 1){

                    // 新---接口风图谱高度
                    let project_id = this.$store.state.app.projectInfo.project_id;
                    let scheme_id = this.$store.state.app.planId || 1;
                    util.ajax.get('/change_wrg_height/'+project_id+'/'+scheme_id, {}).then(res => {
                        if ( res.data.code !== 200) {
                            this.$message.error(res.data.message);
                            return;
                        }
                        // this.wrgHeights = res.data.data;
                        this.wrgHeights = res.data.data.map((item) => {
                            return parseInt(item);
                        });
                        // console.log(this.wrgHeights,"111111");
                        console.log("项目:"
                        +this.$store.state.app.projectInfo.project_id
                        +"方案："
                        +this.$store.state.app.planId+"风谱图高度有："+
                        res.data.data);
                        this.showSubMenu(this.selected);
    
                    }).catch((/* err */) => {
                        this.$message.error('取得风图谱高度失败！');
                    });
                }
            },
            onEnter(ev){
                // console.log(ev.target)
                ev.target.classList.add("bgColor")
            },
            onLeave(ev){
                // console.log(ev.target)
                ev.target.classList.remove("bgColor")
            },
            onClick () {
                if (!this.isDisable) {
                    if (!this.isPlanModified) {
                        this.selected = !this.selected;
                    }
                    this.selected = !this.selected;
                    this.$emit('funSelectChange', this.funId, this.selected);
                    this.showSubMenu(this.selected);
                    
                    if (this.funId === 21) {
                        this.showWindGauge();
                    }
                    //点击工具条任何地方关闭塔位信息窗口
                    this.$emit("closeCesiumContainer",false);
                    if(this.funId == 30){
                        //要拿到项目ID，方案，方案名
                        let plandata = {
                            project_id : this.$store.state.app.currentPlanData.project_id,
                            scheme_id : this.$store.state.app.currentPlanData.scheme_id,
                            scheme_name : this.$store.state.app.currentPlanData.scheme_name
                        };
                        console.log("经评："+plandata.project_id+"/"+plandata.scheme_id+"/"+plandata.scheme_name);
                        this.$emit("showPlanDetail",plandata);
                        this.$emit('funSelectChange', this.funId, this.selected);
                    }

                    if(this.funId == 50){
                        let plandata = {
                            project_id : this.$store.state.app.currentPlanData.project_id,
                            scheme_id : this.$store.state.app.currentPlanData.scheme_id,
                            scheme_name : this.$store.state.app.currentPlanData.scheme_name
                        };
                        this.selected = false
                        this.$emit("onXinjiangReprot",plandata);
                    }
                }
            },
            // planModified (val) {
                // this.isPlanModified = val;
                // this.$emit('planModified', val);
            // },
            setUnselected () {
                this.selected = false;
                this.showSubMenu(this.selected);
            },
            resetValue (val) {
                if (this.funId === 1) {
                    this.defaultValue1 = val;
                }
                if (this.funId === 2) {
                    this.defaultValue2 = val;
                }
                this.$refs['slideBar'].resetValue(val);
            },
            // setUnSelectAdd (value, refs) {
            //     if (this.funId === 21) {
            //         this.$refs['distributeBar'].setUnSelectAdd(value, refs);
            //     }
            // },
            showSubMenu (selected) {
                // console.log(selected)
                // 综合风图谱
                if (this.funId === 1) {
                    // console.log(this.wrgHeights,"00000");
                    this.$refs['slideBar'].show(selected, 0, this.wrgHeights, this.defaultValue1);
                    this.sliderUnit = 'm';
                }

                // 扇区
                if (this.funId === 2) {
                    this.$refs['slideBar'].show(selected, 0, this.sections, this.defaultValue2);
                    this.sliderUnit = '度';
                }

                // 限制因素
                if (this.funId === 3) {
                    this.$refs['restrictAreaBar'].show(selected, 0);
                    this.sliderUnit = '度';
                    
                }

                // 风能切片
                if (this.funId === 13) {
                    this.$refs['diarefBar'].show(selected);
                }

                // 优化排布
                // if (this.funId === 21) {
                //     if (this.$store.state.user.loginUserInfo.role !== 3) {
                //         this.$refs['distributeBar'].show(selected, 0);
                //     }
                // }
                if (this.funId === 22) {
                    this.$refs['playBar'].show(selected, 0);
                }
                // 升压站
                if (this.funId === 23) {
                    // if(this.enManager){  //改了显示二级按钮，不能点击
                    //     return;
                    // }
                    this.$refs['stationBar'] && this.$refs['stationBar'].show(selected, null);
                }
                // 集电线路
                if (this.funId === 24) {
                    // if(this.enManager){
                    //     return;
                    // }
                    this.$refs['jidianBar'] && this.$refs['jidianBar'].show(selected, 0);
                }
                // 场内道路
                if (this.funId === 26) {
                    // if(this.enManager){
                    //     return;
                    // }
                    this.$refs['roadBar'] && this.$refs['roadBar'].show(selected, 0);
                }
                // 查看报告
                if (this.funId === 25) {
                    this.$refs['ReporterBar'].show(selected, 0);
                }
            },
            setSection (angle, projectId, planId) {
                this.$refs['diarefBar'].setSection(angle, projectId);
                if (this.selected) {
                    this.$parent && this.$parent.$emit('sectionChange', this.funId, projectId, planId, true);
                }
            },
            // 工程设计浮层
            // showInfo (selected, optimizeType, data, onlyPoints) {
            //     if (selected) {
            //         this.$emit('fanOptimize', {optimizeType: optimizeType, data: data, onlyPoints: onlyPoints});
            //         // this.$refs['fanOptimize'].open(optimizeType, data, onlyPoints);
            //     } else {
            //         this.$emit('fanOptimize', {optimizeType: 0, data: null, onlyPoints: null});
            //         // this.$refs['fanOptimize'].open(0);
            //     }
            // },
            showWindGauge () {
                this.$emit('showWindGauge');
                this.$parent && this.$parent.$emit('distributeClick', 'showWindGauge');
            },
            // showPowerDetail (type) {
            //     this.$emit('showPowerDetail', type);
            // },
            roadReCalculatingShow () {
                this.$emit('roadReCalculatingShow');
            },
            lineReCalculatingShow () {
                this.$emit('lineReCalculatingShow');
            },
            autoOptimizationShow () {
                this.$emit('autoOptimizationShow');
            },
            jidianshoudongyouhuShow () {
                this.$emit('jidianshoudongyouhuShow');
            },
            roadshoudongyouhuShow () {
                this.$emit('roadshoudongyouhuShow');
            },
            stationDaochuShow () {
                this.$emit('stationDaochuShow');
            },
            stationYouhuaShow (selected) {
                this.$emit('stationYouhuaShow', selected);
            },
            shan (selected) {
                this.$refs['jidianBar'].shan(selected);
            },
            // 监听风机角度改变
            onChangeFanRotaAngle (angle) {
                this.$emit('changeFanRotaAngle', angle);
            },
            onStationMouseOver () {
                if (this.funId === 23 && this.selected && this.showStationAndLine) {
                    // if(this.enManager){  //改了显示二级按钮，不能点击
                    //     return;
                    // }
                    this.stationOver = true;
                    this.$refs['stationBar'].show(true, null);
                }
                if (this.funId === 24 && this.selected && this.showStationAndLine) {
                    // if(this.enManager){
                    //     return;
                    // }
                    this.stationOver = true;
                    this.$refs['jidianBar'].show(true, null);
                }
                if (this.funId === 26 && this.selected && this.showStationAndLine) {
                    // if(this.enManager){
                    //     return;
                    // }
                    this.stationOver = true;
                    this.$refs['roadBar'].show(true, null);
                }
            },
            onMouseLeave () {
                if (this.funId === 23 && this.selected && this.showStationAndLine) {
                    // if(this.enManager){ //改了显示二级按钮，不能点击
                    //     return;
                    // }
                    this.stationOver = false;
                    // setTimeout(() => {
                    //     if (!this.stationOver) {
                            this.$refs['stationBar'].show(false, null);
                    //     }
                    // }, 800);
                }
                if (this.funId === 24 && this.selected && this.showStationAndLine) {
                    // if(this.enManager){
                    //     return;
                    // }
                    // this.stationOver = false;
                    // setTimeout(() => {
                    //     if (!this.stationOver) {
                            this.$refs['jidianBar'].show(false, null);
                    //     }
                    // }, 800);
                }
                if (this.funId === 26 && this.selected && this.showStationAndLine) {
                    // if(this.enManager){
                    //     return;
                    // }
                    this.$refs['roadBar'].show(false, null);
                   
                }
            },
            stationAndLine (value) {
                this.showStationAndLine = value;
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
            onZaoyinRestrict (selected) {
                this.$emit('zaoyinRestrict', selected);
            },
            onRedLineRestrict (selected) {
                this.$emit('redLineRestrict', selected);
            },
            onDenggaoxian (selected) {
                this.$emit('denggaoxian', selected);
            },
            onStationImport () {
                this.$emit('stationImport');
            },
            onCloseCesiumContainer(){
                this.$emit("closeCesiumContainer");
            },
            onDataChange2(functionId, selectedData, projectId ,url){
                this.$emit('dataChange2', functionId, selectedData, projectId , url);
            }
        }
    };
</script>

<style scoped>
    .sizeIcon{
        font-size: 23px;
    }
    .bgColor{
        background: rgba(3,32,62,0.8) !important;
        color: #33C86F !important;
        border-radius: 5px 5px;
    }
    .bgColor /deep/ .desc-panel{
        color: #33C86F !important;
    }
    .button-container{
        width: 65px;
        height: 65px;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        position: relative;
        cursor: pointer;
    }
    .icon-panel{
        width: 30px;
        height: 30px;
        margin-top: 10px;
        margin-bottom: 0px;
        text-align: center;
        font-size: 20px;
    }
    .desc-panel{
        width: 65px;
        height:16px;
        font-size:12px;
        font-family:MicrosoftYaHei;
        color:rgba(211,219,228,1);
        line-height:16px;
        margin-bottom: 12px;
        text-align: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .sep-panel{
        position: absolute;
        right: 0px;
        top: 0px;
        width: 1px;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    /* .long-sep{
        width: 1px;
        height: 30px;
        background-color: rgba(265,265,265,0.3);
    } */
    /* .short-sep{
        width: 1px;
        height: 20px;
        background-color: rgba(265,265,265,0.3);
    } */

</style>
