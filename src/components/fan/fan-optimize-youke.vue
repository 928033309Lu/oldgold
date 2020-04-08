<template>
    <div v-show="!isDisableShow">
        
        <transition-group name="fade" tag="div"  class="combine-container">
                <div class="combine-item" key="99">
                    <div class="action" v-show="newShowingArr[0]" v-bind:class="{active: !lineShowing && !stationShowing && newDaoluShowing}" @click="activeDaolu" style="font-size: 14px;"><span style="width:5px;height:5px;border-radius:5px;display: inline-block;background: #33c86f;margin-right: 5px;"></span>
                        场内道路
                        <span class="titleRight" v-if="enManager">
                            <span v-show="readonlyActive1" class="bianjiicon" @click.stop="onBianjiYouke('daolu')">
                                <icon name="bianji" style="width: 15px;height: 15px;"></icon>
                            </span>
                            <span v-show="!readonlyActive1" class="bianjiicon" @click.stop="onBaocunYouke('daolu')">
                                <icon name="baocun" style="width: 15px;height: 15px;"></icon>
                            </span>
                        </span>
                    </div>
                    <div class="station" v-if="!lineShowing && !stationShowing && newDaoluShowing">
                        <div class="box" v-show="isOpen">
                                <el-row :gutter="10">
                                    <el-col :span="12" class="label">道路总长度：</el-col>
                                    <el-col v-show="readonlyActive1" :span="12">{{ road.roadLength }}米</el-col>
                                    <el-col v-show="!readonlyActive1" :span="12"> <el-input type="number" v-model="road.roadLength" /> 米</el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12" class="label">路面宽度：</el-col>
                                    <el-col v-show="readonlyActive1" :span="12">{{ road.roadWidth  }}米</el-col>
                                    <el-col v-show="!readonlyActive1" :span="12"> <el-input type="number" v-model="road.roadWidth" /> 米</el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12" class="label">总填方量：</el-col>
                                    <el-col v-show="readonlyActive1" :span="12">{{ road.fillAmount ? newtoFixed(road.fillAmount) : '0' }}立方米</el-col>
                                    <el-col v-show="!readonlyActive1" :span="12"> <el-input type="number" v-model="road.fillAmount" /> 立方米</el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12" class="label">总挖方量：</el-col>
                                    <el-col v-show="readonlyActive1" :span="12">{{ road.digAmount ? newtoFixed(road.digAmount) : '0' }}立方米</el-col>
                                    <el-col v-show="!readonlyActive1" :span="12"> <el-input type="number" v-model="road.digAmount" /> 立方米</el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12" class="label">道路数量：</el-col>
                                    <el-col v-show="readonlyActive1" :span="12">{{ road.branchNum }}条</el-col>
                                    <el-col v-show="!readonlyActive1" :span="12"> <el-input type="number" v-model="road.branchNum" /> 条</el-col>
                                </el-row>
            
                                <el-row :gutter="10">
                                    <el-col :span="12">
                                        <!-- <span @click="showRoadDetail" class="detail">查看详情</span> -->
                                    </el-col>
                                    <el-col :span="12"></el-col>
                                </el-row>
                            </div>
                    </div>
                </div>
            <div class="combine-item" key="101">
                <div class="action" v-show="newShowingArr[1]" v-bind:class="{active: stationShowing && !newDaoluShowing && !lineShowing}" @click="activeStation" style="font-size: 14px;"><span style="width:5px;height:5px;border-radius:5px;display: inline-block;background: #33c86f;margin-right: 5px;"></span>
                    升压站
                    <span class="titleRight" v-if="enManager">
                        <span v-show="readonlyActive2" class="bianjiicon" @click.stop="onBianjiYouke('shengya')">
                            <icon name="bianji" style="width: 15px;height: 15px;"></icon>
                        </span>
                        <span v-show="!readonlyActive2" class="bianjiicon" @click.stop="onBaocunYouke('shengya')">
                            <icon name="baocun" style="width: 15px;height: 15px;"></icon>
                        </span>
                    </span>
                </div>
                <div class="station" v-if="!lineShowing && stationShowing && !newDaoluShowing">
                    <div class="box" v-show="isOpen">
                        <el-row :gutter="10">
                            <el-col :span="10" class="label">占地面积：</el-col>
                            <el-col v-show="readonlyActive2" :span="14">{{ station.stationArea}}平方米</el-col>
                            <el-col v-show="!readonlyActive2" :span="14"> <el-input type="number" v-model="station.stationArea" /> 平方米</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10" class="label">基准高程：</el-col>
                            <el-col v-show="readonlyActive2" :span="14">{{ station.baseHeight}}米</el-col>
                            <el-col v-show="!readonlyActive2" :span="14"> <el-input type="number" v-model="station.baseHeight" /> 米</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10" class="label">总填方量：</el-col>
                            <el-col v-show="readonlyActive2" :span="14">{{ station.fillAmount}}立方米</el-col>
                            <el-col v-show="!readonlyActive2" :span="14"> <el-input type="number" v-model="station.fillAmount" /> 立方米</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10" class="label">总挖方量：</el-col>
                            <el-col v-show="readonlyActive2" :span="14">{{ station.digAmount}}立方米</el-col>
                            <el-col v-show="!readonlyActive2" :span="14"> <el-input type="number" v-model="station.digAmount" /> 立方米</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <!-- <span @click="showStationDetail" class="detail">查看详情</span> -->
                            </el-col>
                            <el-col :span="12"></el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="combine-item" key="100">
                <div class="action" v-show="newShowingArr[2]" v-bind:class="{active: lineShowing && !newDaoluShowing && !stationShowing}" @click="activeLine" style="font-size: 14px;"><span style="width:5px;height:5px;border-radius:5px;display: inline-block;background: #33c86f;margin-right: 5px;"></span>
                    集电线路
                    <span class="titleRight" v-if="enManager">
                        <span v-show="readonlyActive3" class="bianjiicon" @click.stop="onBianjiYouke('xianlu')">
                            <icon name="bianji" style="width: 15px;height: 15px;"></icon>
                        </span>
                        <span v-show="!readonlyActive3" class="bianjiicon" @click.stop="onBaocunYouke('xianlu')">
                            <icon name="baocun" style="width: 15px;height: 15px;"></icon>
                        </span>
                    </span>
                </div>
                <div class="line" v-if="lineShowing && !newDaoluShowing && !stationShowing">
                    <div class="box" v-show="isOpen">
                        <el-row :gutter="10">
                            <el-col :span="12" class="label">电压等级：</el-col>
                            <el-col v-show="readonlyActive3" :span="12">{{ line.level }}</el-col>
                            <el-col v-show="!readonlyActive3" :span="12"><div ref="level"> <el-input type="text"  v-model="line.level" 
                            
                            /> 
                            <!-- <span class="errorTip">请输入单位KV</span>  -->
                            </div></el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12" class="label">线路总长度：</el-col>
                            <el-col v-show="readonlyActive3" :span="12">{{ line.lineLength ? newtoFixed(line.lineLength) : '0'}}米</el-col>
                            <el-col v-show="!readonlyActive3" :span="12"> <el-input type="number" v-model="line.lineLength" /> 米</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12" class="label">转角塔个数：</el-col>
                            <el-col v-show="readonlyActive3" :span="12">{{ line.angleNum }}个</el-col>
                            <el-col v-show="!readonlyActive3" :span="12"> <el-input type="number" v-model="line.angleNum" /> 个</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12" class="label">直线塔个数：</el-col>
                            <el-col v-show="readonlyActive3" :span="12">{{ line.lineMun }}个</el-col>
                            <el-col v-show="!readonlyActive3" :span="12"> <el-input type="number" v-model="line.lineMun" /> 个</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <!-- <span @click="showLineDetail('combine')" class="detail">查看详情</span> -->
                            </el-col>
                            <el-col :span="12"></el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="combine-item" key="102">
                <!--升压站详情-->
                <div class="station-table stationAndLine" v-show="stationDetailShowing">
                    <div class="box">
                        <el-row :gutter="10">
                            <el-col :span="10" class="label">占地面积：</el-col>
                            <el-col :span="14">{{ station.stationArea}}平方米</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10" class="label">基准高程：</el-col>
                            <el-col :span="14">{{ station.baseHeight}}米</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10" class="label">总填方量：</el-col>
                            <el-col :span="14">{{ station.fillAmount}}立方米</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10" class="label">总挖方量：</el-col>
                            <el-col :span="14">{{ station.digAmount}}立方米</el-col>
                        </el-row>
                    </div>
                    <div class="table">
                        <el-row :gutter="10">
                            <el-col :span="6" class="header">点位</el-col>
                            <el-col :span="6" class="header">经度</el-col>
                            <el-col :span="6" class="header">纬度</el-col>
                            <el-col :span="6" class="header">高程</el-col>
                        </el-row>
                        <el-row :gutter="10" class="body">
                            <el-col :span="6">点位1</el-col>
                            <el-col :span="6">{{station.points && station.points[0][0].toFixed(6) }}</el-col>
                            <el-col :span="6">{{station.points && station.points[0][1].toFixed(6) }}</el-col>
                            <el-col :span="6">{{station.points && station.points[0][2].toFixed(2) }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="body">
                            <el-col :span="6">点位2</el-col>
                            <el-col :span="6">{{station.points && station.points[1][0].toFixed(6) }}</el-col>
                            <el-col :span="6">{{station.points && station.points[1][1].toFixed(6) }}</el-col>
                            <el-col :span="6">{{station.points && station.points[1][2].toFixed(2) }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="body">
                            <el-col :span="6">点位3</el-col>
                            <el-col :span="6">{{station.points && station.points[2][0].toFixed(6) }}</el-col>
                            <el-col :span="6">{{station.points && station.points[2][1].toFixed(6) }}</el-col>
                            <el-col :span="6">{{station.points && station.points[2][2].toFixed(2) }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="body">
                            <el-col :span="6">点位4</el-col>
                            <el-col :span="6">{{station.points && station.points[3][0].toFixed(6) }}</el-col>
                            <el-col :span="6">{{station.points && station.points[3][1].toFixed(6) }}</el-col>
                            <el-col :span="6">{{station.points && station.points[3][2].toFixed(2) }}</el-col>
                        </el-row>
                    </div>

                    <div class="bottom-icon" @click="hideStationDetail">
                        <icon name="guanbi"></icon>
                    </div>
                </div>
            </div>

        </transition-group>

    </div>
</template>

<script>
import util from '@/libs/util';

export default {
    name: 'fan-optimize',
    props: ['stationAndLineClass'],
    data () {
        return {
            showDetails: true,
            isOpen: false,
            readonlyActive1: true,
            readonlyActive2: true,
            readonlyActive3: true,
            optimizeType: 0,
            showDetail: false,
            optimize: {
                height: 0,
                wight: 0,
                area: 0
            },
            showStationAndLine: false,   //控制叠加box
            alone: true,   //控制单个box
            stationShowing: false,  //叠加升压站
            lineShowing: false,   //叠加集电线路
            newDaoluShowing: false,   //叠加道路
            newShowingArr:[false,false,false],  //叠加title显影
            road: {
                roadLength : null,
                roadWidth : null,
                fillAmount : null,
                digAmount : null,
                branchNum : null
            },
            station: {
                stationArea : null,
                baseHeight : null,
                fillAmount : null,
                digAmount : null
            },
            line: {
                level: null,
                lineLength: null,
                angleNum: null,
                lineMun: null
            },
            stationDetailShowing: false,   //叠加升压站查看详情
            isDisableShow: false,    //整个组件的显影
            haveData: true, // 存在桩位或塔位数据
            nextKeep: true
        };
    },
    computed:{
        haveTowerData: function () {
            
            return this.$store.state.scheme.haveTowerData;
        },
        enManager: function () {
            if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                return true;
            }else{
                return false;
            }
        },
    },
    watch: {
        '$store.state.app.currentPlanData' (currentPlanData) {
            // currentPlanData.step_status.jdxl.status === 4 表示当前方案的集电线路无桩位无塔位数据
            this.haveData = !(currentPlanData && currentPlanData.step_status && currentPlanData.step_status.jdxl && currentPlanData.step_status.jdxl.status === 4);
            // console.log(this.haveData , currentPlanData);
            // console.log(this.$store.state.scheme.haveTowerData);
        }
    },
    methods: {
        //游客模式
        checkInput(value=""){
            if(value != ""){
                // console.log(value);
                // if( value.search("KV") == -1){
                //     this.$refs['level'].classList.add("borderRed");
                //     this.nextKeep = false;
                // }
                // else if( value.search("kv") == -1){
                //     this.$refs['level'].classList.add("borderRed");
                //     this.nextKeep = false;
                // }
                // else{
                    // this.$refs['level'].className = "";
                    // this.nextKeep = true;
                // }
            }
        },
        //
        onBianjiYouke(type){
            switch (type){
                case "daolu":
                this.readonlyActive1 = false;
                this.activeDaolu();
                break;
                case "shengya":
                this.readonlyActive2 = false;
                this.activeStation();
                break;
                case "xianlu":
                this.readonlyActive3 = false;
                this.activeLine();
                break;
            }

        },
        onBaocunYouke(type){

            switch (type){
                case "daolu":
                
                this.postDetailHttp(type);

                break;
                case "shengya":
                
                this.postDetailHttp(type);

                break;
                case "xianlu":

                    if(this.nextKeep){
                        this.postDetailHttp(type);
                    }

                break;
            }
            
        },
        postDetailHttp(type){
            var data = {};
            var oldData = {};
            if(type == "daolu"){
                data.road_length_total = this.road.roadLength;
                data.road_width = this.road.roadWidth;
                data.road_total_fill_amount = this.road.fillAmount;
                data.road_total_excavation = this.road.digAmount;
                data.road_number = this.road.branchNum;

                oldData = {...this.road};
            }
            if(type == "shengya"){
                data.station_floor_area = this.station.stationArea;
                data.station_base_elevation = this.station.baseHeight;
                data.station_fill_amount = this.station.fillAmount;
                data.station_excavation = this.station.digAmount;
                
                oldData = {...this.station};
            }
            if(type == "xianlu"){
                data.line_voltage_level = this.line.level;
                data.line_length_total = this.line.lineLength;
                data.line_corner_towers_number = this.line.angleNum;
                data.line_straight_towers_number = this.line.lineMun;
                
                oldData = {...this.line};
            }

            if(data){
                util.ajax.put("/reveal_engineering_param/" + this.$store.state.app.projectInfo.project_id , data )
                .then(res=>{
                    console.log(res)
                    if(res.data.code == 201){
                        this.$message.success("数据保存成功");
                        if(type == "daolu"){
                            this.$nextTick(() => {
                                this.readonlyActive1 = true;
                            })
                        }
                        if(type == "shengya"){
                            this.$nextTick(() => {
                                this.readonlyActive2 = true;
                            })
                        }
                        if(type == "xianlu"){
                            this.$nextTick(() => {
                                this.readonlyActive3 = true;
                            })
                        }
                    }else{
                        this.$message.error("数据保存失败"); 
                    }
                }).catch((err) => {
                    console.log(err);
                    this.$message.error("数据保存失败");
                    if(type == "daolu"){
                        this.road = oldData;
                    }
                    if(type == "shengya"){
                        this.station = oldData;
                    }
                    if(type == "xianlu"){
                        this.line = oldData;
                    }
                });
            }
        },
       
        open (optimizeType, dataInfo, onlyPoints, alone ,isOpen) {
            // console.log(optimizeType, dataInfo, onlyPoints, alone ,"111111111111111111");
            this.alone = alone;
            this.isOpen = isOpen;
            this.isDisableShow = false;
            this.optimizeType = optimizeType;
            this.readonlyActive1 = true;
            this.readonlyActive2 = true;
            this.readonlyActive3 = true;
            if (optimizeType === 1) {
                // this.road = dataInfo;
                
                this.road =  {
                    roadLength : dataInfo.roadLength,
                    roadWidth : dataInfo.roadWidth,
                    fillAmount : dataInfo.fillAmount,
                    digAmount : dataInfo.digAmount,
                    branchNum : dataInfo.branchNum
                }
                this.newShowingArr[0]=true;
               
            }
            if (optimizeType === 2 && dataInfo) {
                // this.station = dataInfo;
                
                this.station = {
                    stationArea : dataInfo.stationArea,
                    baseHeight : dataInfo.baseHeight,
                    fillAmount : dataInfo.fillAmount,
                    digAmount : dataInfo.digAmount
                }
                this.newShowingArr[1]=true;
               
            }
            if (optimizeType === 2 && onlyPoints) {
                this.station.points = dataInfo;
            }
            if (optimizeType === 3) {
                // this.line = dataInfo;
                // this.line.lineLength = 0;
                
                this.line = {
                    level: dataInfo.level,
                    lineLength: dataInfo.lineLength,
                    angleNum: dataInfo.angleNum,
                    lineMun: dataInfo.lineMun,
                }
                this.newShowingArr[2]=true;
                
                setTimeout(()=>{
                    if(this.haveTowerData&&this.haveData){
                        // 获取线路总长度
                        util.Xianluajax.get(`/gettowerlength?project_id=${this.$store.state.app.projectInfo.project_id}&scheme_id=${this.$store.state.app.planId}`).then(res => {
                            if (res.data.code !== 0) {
                                console.error('获取线路总长度失败1');
                                // this.$message.error('获取线路总长度失败111:'+res.data.data);
                                return;
                            }
                            if( !this.line.lineLength){
                                this.line.lineLength = res.data.data.all;
                            }
        
                        }).catch(err => {
                            console.error(`获取线路总长度失败111${err}`);
                        });
                    }else{
                        util.Xianluajax.get(`/getstakelength?project_id=${this.$store.state.app.projectInfo.project_id}&scheme_id=${this.$store.state.app.planId}`).then(res => {
                            // console.log(res);
                            if (res.data.code !== 0) {
                                console.error('获取线路总长度失败222');
                                // this.$message.error('获取线路总长度失败');
                                return;
                            }
                            if( !this.line.lineLength){
                                this.line.lineLength = res.data.data;
                            }
        
                        }).catch(err => {
                            console.error(`获取线路总长度失败222${err}`);
                        });
                    }
                },2000)
               
            }
           
            // console.log(this.newShowingArr);
        },
        initArr(val){       
            this.newShowingArr[val] = false;
        },
        initArr2(val1,val2,val3){       
            this.newShowingArr = [val1,val2,val3];
        },
        initArrAll(val){       
            this.newShowingArr = [true,true,true];
        },
        init(){
            this.newShowingArr = [false,false,false];
        },
        showStation () {
            this.stationDetailShowing = false; //叠加升压站查看详情关闭
            this.showStationAndLine = false; //控制叠加box
            this.optimizeType = 2;
            this.alone = true;
        },
        showLine () {
            this.stationDetailShowing = false; //叠加升压站查看详情关闭
            this.showStationAndLine = false; //控制叠加box
            this.optimizeType = 3;
            this.alone = true;
        },
        showRoad () {
            this.stationDetailShowing = false; //叠加升压站查看详情关闭
            this.showStationAndLine = false; //控制叠加box
            this.optimizeType = 1;
            this.alone = true;
        },
        showStationAndLineBox () {
            this.showStationAndLine = true; //控制叠加box
        },
        stationAndLine () {
            this.showStationAndLine = false; //控制叠加box
        },
        showStationDetail () {
            this.stationDetailShowing = true; //叠加升压站查看详情打开
        },
        hideStationDetail () {
            this.stationDetailShowing = false; //叠加升压站查看详情关闭
        },
        
        ////
        //关闭详情框
        closeShowBox(){
            // this.showDetails = false;
            this.isDisableShow = true;
        },
        //切换集电框事件
        activeLine () {
            
            this.isOpen = true;
            // this.alone = false;
            // this.showStationAndLine = true; //控制叠加box
            this.lineShowing = true;
            this.stationShowing = false;
            this.newDaoluShowing = false;   //叠加道路
            this.newShowingArr[2] = true;
            // console.log(this.newShowingArr);
        },
        activeLineTou(){
            this.lineShowing = true;
            this.stationShowing = false;
            this.newDaoluShowing = false;   //叠加道路
            this.newShowingArr[2] = true;
        },
        //切换电压
        activeStation () {
            
            this.isOpen = true;
            // this.alone = false;
            // this.showStationAndLine = true; //控制叠加box
            this.stationShowing = true;
            this.lineShowing = false;
            this.newDaoluShowing = false;   //叠加道路
            this.newShowingArr[1] = true;
            // console.log(this.newShowingArr);
        },
        activeStationTou(){
            this.stationShowing = true;
            this.lineShowing = false;
            this.newDaoluShowing = false;   //叠加道路
            this.newShowingArr[1] = true;
        },
        //切换道路
        activeDaolu () {
            
            this.isOpen = true;
            // this.alone = false;  //控制单个box
            // this.showStationAndLine = true;  //控制叠加box
            this.stationShowing = false;   //叠加升压站
            this.lineShowing = false;  //叠加集电线路
            this.newDaoluShowing = true;   //叠加道路
            this.newShowingArr[0] = true;
            // console.log(this.newShowingArr);
        },
        activeDaoluTou(){
            this.stationShowing = false;   //叠加升压站
            this.lineShowing = false;  //叠加集电线路
            this.newDaoluShowing = true;   //叠加道路
            this.newShowingArr[0] = true;
        },
        showRoadDetail () {
            this.$emit('showRoadDetail');
        },
        showLineDetail (type) {
            this.$emit('showLineDetail', type);
        },
        newtoFixed(value){
            var value = Math.floor(Number(value) * 100) / 100;
            if(value == 0){
                return 0;
            }
            
            return value;
        }
    },
    filters: {
        toFixed: function (str) {
            if (!str) return null;
            return str.toFixed(2);
        }
    }
};
</script>

<style lang="less" scoped>
/*道路*/
.container {
  width: 280px;
  overflow: hidden;
  position: fixed;
  right: 20px;
  bottom: 33px;
  background: rgba(3, 32, 62, 0.6);
  font-size: 12px;
  color: #33c86f;
  border-radius: 6px;
  .box {
    margin: 20px 30px;
    .el-col {
      line-height: 30px;
      .detail {
        width: 78px;
        height: 23px;
        background-color: rgba(212, 239, 246, 0.3);
        color: #ffffff;
        padding: 3px 12px;
        border-radius: 12px;
        cursor: pointer;
      }
    }
    .label {
      color: #d4eff6;
    }
  }
}
.titleRight{
    display: inline-block;
    position: absolute;
    top: 0;
    right: 10px;
    cursor: pointer;
    color: #d4eff6;
}
/deep/ .el-input{
    width: 60px !important;
    height: 15px !important;
    line-height: 15px !important;
}
/deep/ .el-input__inner{
    height: 15px !important;
    line-height: 15px !important;
    padding: 0;
    background: none;
    text-align: center;
    font-size: 10px;
    border: 1px solid rgba(255,255,255,0.4);
}

/*升压站*/
.container-station {
  width: 280px;
  overflow: hidden;
  position: fixed;
  right: 20px;
  bottom: 33px;
  background: rgba(3, 32, 62, 0.6);
  font-size: 12px;
  color: #33c86f;
  border-radius: 6px;
  .box {
    margin: 20px 30px;
    .el-col {
      line-height: 30px;
      .detail {
        width: 78px;
        height: 23px;
        background-color: rgba(212, 239, 246, 0.3);
        color: #ffffff;
        padding: 3px 12px;
        border-radius: 12px;
        cursor: pointer;
      }
    }
    .label {
      color: #d4eff6;
    }
  }
}
.station-table {
  width: 280px;
  overflow: hidden;
  position: fixed;
  right: 20px;
  bottom: 33px;
  background: rgba(3, 32, 62, 0.6);
  font-size: 12px;
  color: #33c86f;
  border-radius: 6px;
  .box {
    margin: 20px 30px;
    .el-col {
      line-height: 30px;
      .detail {
        width: 78px;
        height: 23px;
        background-color: rgba(212, 239, 246, 0.3);
        color: #ffffff;
        padding: 3px 12px;
        border-radius: 12px;
        cursor: pointer;
      }
    }
    .label {
      color: #d4eff6;
    }
  }
  .table {
    margin-left: 11px;
    margin-right: 11px;
    border-radius: 4px;
    border: 1px solid rgba(220, 241, 247, 0.26);
    margin-bottom: 10px;
    .el-col {
      text-align: center;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(212, 239, 246, 1);
      line-height: 28px;
      .header {
        font-size: 14px;
      }
    }
    .body {
      border-top: 1px solid rgba(220, 241, 247, 0.26);
    }
  }
  .bottom-icon {
    position: absolute;
    right: 5px;
    top: 0px;
    font-size: 25px;
    color: rgba(212, 239, 246, 1);
    cursor: pointer;
  }
}
.station-table.stationAndLine {
  bottom: 300px;
}
/*线路*/
.container-power {
  width: 250px;
  overflow: hidden;
  position: fixed;
  right: 10px;
  bottom: 33px;
  background: rgba(3, 32, 62, 0.6);
  font-size: 12px;
  color: #33c86f;
  border-radius: 6px;
  .box {
    margin: 20px 30px;
    .el-col {
      line-height: 30px;
      .detail {
        width: 78px;
        height: 23px;
        background-color: rgba(212, 239, 246, 0.3);
        color: #ffffff;
        padding: 3px 12px;
        border-radius: 12px;
      }
    }
    .label {
      color: #d4eff6;
    }
  }
}
/*升压站和集电线路*/
.combine-container {
  width: 280px;
  overflow: hidden;
  position: fixed;
  right: 20px;
  bottom: 33px;
  .action {
    margin-top: 2px;
    padding-left: 20px;
    width: 260px;
    height: 35px;
    color: #ffffff;
    font-size: 12px;
    line-height: 35px;
    background: rgba(3, 32, 62, 0.6);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }
  .action.active {
    color: #33c86f;
    border-bottom: 1px solid RGBA(212, 239, 246, 0.25);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .station {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    width: 100%;
    background: rgba(3, 32, 62, 0.6);
    /*opacity:0.6;*/
    font-size: 12px;
    color: #33c86f;
    .box {
      padding: 20px 30px;  
      .el-col {
        line-height: 30px;
        .detail {
          width: 78px;
          height: 23px;
          background-color: rgba(212, 239, 246, 0.3);
          color: #ffffff;
          padding: 3px 12px;
          border-radius: 12px;
          cursor: pointer;
        }
      }
      .label {
        color: #d4eff6;
      }
    }
  }
  .line {
    width: 100%;
    background: rgba(3, 32, 62, 0.6);
    /*opacity:0.6;*/
    font-size: 12px;
    color: #33c86f;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    .box {
      padding: 20px 30px;
      /*padding: 10px 50px;*/
      .el-col {
        line-height: 30px;
        .detail {
          width: 78px;
          height: 23px;
          background-color: rgba(212, 239, 246, 0.3);
          color: #ffffff;
          padding: 3px 12px;
          border-radius: 12px;
        }
      }
      .label {
        color: #d4eff6;
      }
    }
  }
}
.errorTip{
    font-size: 9px;
    position: absolute;
    top: -6px;
    left: 120px;
    height: 15px;
    line-height: 15px;
    z-index: 111;
    color: red;
    display: none;
}
.borderRed /deep/ .el-input__inner{
    border: 1px solid red !important;
    position: relative;
}
.borderRed .errorTip{
    display: block;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.detail {
  cursor: pointer;
}

.col1 {
  padding-left: 5px !important;
  padding-right: 0px !important;
}
.col2 {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.col3 {
  padding-left: 10px !important;
  padding-right: 0px !important;
}
.col4 {
  padding-left: 15px !important;
  padding-right: 5px !important;
}
</style>
