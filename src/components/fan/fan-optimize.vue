<template>
    <div v-show="!isDisableShow">
        <transition-group name="fade" tag="div" v-if="alone">
            <!--道路-->
            <div class="container" v-if="optimizeType === 1" key="200">
                <div class="box">
                    <el-row :gutter="10">
                        <el-col :span="12" class="label">道路总长度：</el-col>
                        <el-col :span="12">{{ road.roadLength }}米</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12" class="label">路面宽度：</el-col>
                        <el-col :span="12">{{ road.roadWidth  }}米</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12" class="label">总填方量：</el-col>
                        <el-col :span="12">{{ road.fillAmount&&road.fillAmount.toFixed(2) }}立方米</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12" class="label">总挖方量：</el-col>
                        <el-col :span="12">{{ road.digAmount&&road.digAmount.toFixed(2) }}立方米</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12" class="label">道路数量：</el-col>
                        <el-col :span="12">{{ road.branchNum }}条</el-col>
                    </el-row>

                    <el-row :gutter="10">
                        <el-col :span="12">
                            <span @click="showRoadDetail" class="detail">查看详情</span>
                        </el-col>
                        <el-col :span="12"></el-col>
                    </el-row>
                </div>
            </div>
            <!--升压站-->
            <div class="container-station" v-if="optimizeType === 2 && !stationDetailShowing" key="201">
                <div class="box">
                    <el-row :gutter="10">
                        <el-col :span="10" class="label">占地面积：</el-col>
                        <el-col :span="14">{{ station.stationArea&&station.stationArea.toFixed(2)}}平方米</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="10" class="label">基准高程：</el-col>
                        <el-col :span="14">{{ station.baseHeight}}米</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="10" class="label">总填方量：</el-col>
                        <el-col :span="14">{{ station.fillAmount&&station.fillAmount.toFixed(2)}}立方米</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="10" class="label">总挖方量：</el-col>
                        <el-col :span="14">{{ station.digAmount&&station.digAmount.toFixed(2)}}立方米</el-col>
                    </el-row>
                    <el-row :gutter="10" v-show="!showDetail">
                        <el-col :span="12">
                            <span @click="showStationDetail" class="detail">查看详情</span>
                        </el-col>
                        <el-col :span="12"></el-col>
                    </el-row>
                </div>
            </div>
            <!--升压站详情-->
            <div class="station-table" v-show="stationDetailShowing" key="202">
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
                        <el-col class="col1" :span="6">点位1</el-col>
                        <el-col class="col2" :span="6">{{station.points && station.points[0][0].toFixed(6)}}</el-col>
                        <el-col class="col3" :span="6">{{station.points && station.points[0][1].toFixed(6)}}</el-col>
                        <el-col class="col4" :span="6">{{station.points && station.points[0][2].toFixed(2)}}</el-col>
                    </el-row>
                    <el-row :gutter="10" class="body">
                        <el-col class="col1" :span="6">点位2</el-col>
                        <el-col class="col2" :span="6">{{station.points && station.points[1][0].toFixed(6)}}</el-col>
                        <el-col class="col3" :span="6">{{station.points && station.points[1][1].toFixed(6)}}</el-col>
                        <el-col class="col4" :span="6">{{station.points && station.points[1][2].toFixed(2)}}</el-col>
                    </el-row>
                    <el-row :gutter="10" class="body">
                        <el-col class="col1" :span="6">点位3</el-col>
                        <el-col class="col2" :span="6">{{station.points && station.points[2][0].toFixed(6)}}</el-col>
                        <el-col class="col3" :span="6">{{station.points && station.points[2][1].toFixed(6)}}</el-col>
                        <el-col class="col4" :span="6">{{station.points && station.points[2][2].toFixed(2)}}</el-col>
                    </el-row>
                    <el-row :gutter="10" class="body">
                        <el-col class="col1" :span="6">点位4</el-col>
                        <el-col class="col2" :span="6">{{station.points && station.points[3][0].toFixed(6)}}</el-col>
                        <el-col class="col3" :span="6">{{station.points && station.points[3][1].toFixed(6)}}</el-col>
                        <el-col class="col4" :span="6">{{station.points && station.points[3][2].toFixed(2)}}</el-col>
                    </el-row>
                </div>

                <div class="bottom-icon" @click="hideStationDetail">
                    <icon name="guanbi"></icon>
                </div>
            </div>
            <!--集电线路-->
            <div class="container-power" v-if="optimizeType === 3" key="203">
                <div class="box">
                    <el-row :gutter="10">
                        <el-col :span="12" class="label">电压等级：</el-col>
                        <el-col :span="12">{{ line.level }}</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12" class="label">线路总长度：</el-col>
                        <el-col :span="12">{{ line.lineLength | toFixed}}米</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12" class="label">转角塔个数：</el-col>
                        <el-col :span="12">{{ line.angleNum }}个</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12" class="label">直线塔个数：</el-col>
                        <el-col :span="12">{{ line.lineMun }}个</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <span @click="showLineDetail('alone')" class="detail">查看详情</span>
                        </el-col>
                        <el-col :span="12"></el-col>
                    </el-row>
                </div>
            </div>
        </transition-group>
        <transition-group name="fade" tag="div" v-if="showStationAndLine" class="combine-container">
                <div class="combine-item" key="99">
                    <div class="action" v-show="newShowingArr[0]" v-bind:class="{active: !lineShowing && !stationShowing && newDaoluShowing}" @click="activeDaolu" style="font-size: 14px;"><span style="width:5px;height:5px;border-radius:5px;display: inline-block;background: #33c86f;margin-right: 5px;"></span>场内道路</div>
                    <div class="station" v-if="!lineShowing && !stationShowing && newDaoluShowing">
                            <div class="box">
                                <el-row :gutter="10">
                                    <el-col :span="12" class="label">道路总长度：</el-col>
                                    <el-col :span="12">{{ road.roadLength }}米</el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12" class="label">路面宽度：</el-col>
                                    <el-col :span="12">{{ road.roadWidth  }}米</el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12" class="label">总填方量：</el-col>
                                    <el-col :span="12">{{ road.fillAmount&&road.fillAmount.toFixed(2) }}立方米</el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12" class="label">总挖方量：</el-col>
                                    <el-col :span="12">{{ road.digAmount&&road.digAmount.toFixed(2) }}立方米</el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12" class="label">道路数量：</el-col>
                                    <el-col :span="12">{{ road.branchNum }}条</el-col>
                                </el-row>
            
                                <el-row :gutter="10">
                                    <el-col :span="12">
                                        <span @click="showRoadDetail" class="detail">查看详情</span>
                                    </el-col>
                                    <el-col :span="12"></el-col>
                                </el-row>
                            </div>
                    </div>
                </div>
            <div class="combine-item" key="101">
                <div class="action" v-show="newShowingArr[1]" v-bind:class="{active: stationShowing && !newDaoluShowing && !lineShowing}" @click="activeStation" style="font-size: 14px;"><span style="width:5px;height:5px;border-radius:5px;display: inline-block;background: #33c86f;margin-right: 5px;"></span>升压站</div>
                <div class="station" v-if="!lineShowing && stationShowing && !newDaoluShowing">
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
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <span @click="showStationDetail" class="detail">查看详情</span>
                            </el-col>
                            <el-col :span="12"></el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="combine-item" key="100">
                <div class="action" v-show="newShowingArr[2]" v-bind:class="{active: lineShowing && !newDaoluShowing && !stationShowing}" @click="activeLine" style="font-size: 14px;"><span style="width:5px;height:5px;border-radius:5px;display: inline-block;background: #33c86f;margin-right: 5px;"></span>集电线路</div>
                <div class="line" v-if="lineShowing && !newDaoluShowing && !stationShowing">
                    <div class="box">
                        <el-row :gutter="10">
                            <el-col :span="12" class="label">电压等级：</el-col>
                            <el-col :span="12">{{ line.level }}</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12" class="label">线路总长度：</el-col>
                            <el-col :span="12">{{ line.lineLength | toFixed}}米</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12" class="label">转角塔个数：</el-col>
                            <el-col :span="12">{{ line.angleNum }}个</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12" class="label">直线塔个数：</el-col>
                            <el-col :span="12">{{ line.lineMun }}个</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <span @click="showLineDetail('combine')" class="detail">查看详情</span>
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
                            <el-col :span="6">{{station.points && station.points[0][0].toFixed(6)}}</el-col>
                            <el-col :span="6">{{station.points && station.points[0][1].toFixed(6)}}</el-col>
                            <el-col :span="6">{{station.points && station.points[0][2].toFixed(2)}}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="body">
                            <el-col :span="6">点位2</el-col>
                            <el-col :span="6">{{station.points && station.points[1][0].toFixed(6)}}</el-col>
                            <el-col :span="6">{{station.points && station.points[1][1].toFixed(6)}}</el-col>
                            <el-col :span="6">{{station.points && station.points[1][2].toFixed(2)}}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="body">
                            <el-col :span="6">点位3</el-col>
                            <el-col :span="6">{{station.points && station.points[2][0].toFixed(6)}}</el-col>
                            <el-col :span="6">{{station.points && station.points[2][1].toFixed(6)}}</el-col>
                            <el-col :span="6">{{station.points && station.points[2][2].toFixed(2)}}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="body">
                            <el-col :span="6">点位4</el-col>
                            <el-col :span="6">{{station.points && station.points[3][0].toFixed(6)}}</el-col>
                            <el-col :span="6">{{station.points && station.points[3][1].toFixed(6)}}</el-col>
                            <el-col :span="6">{{station.points && station.points[3][2].toFixed(2)}}</el-col>
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
            road: {},
            station: {},
            line: {},
            stationDetailShowing: false,   //叠加升压站查看详情
            isDisableShow: false,    //整个组件的显影
            haveData: true // 存在桩位或塔位数据
        };
    },
    computed:{
        haveTowerData: function () {
            
            return this.$store.state.scheme.haveTowerData;
        }
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
        open (optimizeType, dataInfo, onlyPoints, alone) {
            // console.log(optimizeType, dataInfo, onlyPoints, alone ,"111111111111111111");
            this.alone = alone;
            this.optimizeType = optimizeType;
            if (optimizeType === 1) {
                this.road = dataInfo;
                this.newShowingArr[0]=true;
            }
            if (optimizeType === 2 && dataInfo) {
                this.station = dataInfo;
                this.newShowingArr[1]=true;
            }
            if (optimizeType === 2 && onlyPoints) {
                this.station.points = dataInfo;
            }
            if (optimizeType === 3) {
                this.line = dataInfo;
                this.line.lineLength = 0;
                this.newShowingArr[2]=true;
                
                setTimeout(()=>{
                    if(this.haveTowerData&&this.haveData){
                        // 获取线路总长度
                        util.Xianluajax.get(`/gettowerlength?project_id=${this.$store.state.app.projectInfo.project_id}&scheme_id=${this.$store.state.app.planId}`).then(res => {
                            if (res.data.code !== 0) {
                                console.error('获取线路总长度失败1');
                                this.$message.error('获取线路总长度失败:'+res.data.data);
                                return;
                            }
                            this.line.lineLength = res.data.data.all;
        
                        }).catch(err => {
                            console.error(`获取线路总长度失败1${err}`);
                        });
                    }else{
                        util.Xianluajax.get(`/getstakelength?project_id=${this.$store.state.app.projectInfo.project_id}&scheme_id=${this.$store.state.app.planId}`).then(res => {
                            // console.log(res);
                            if (res.data.code !== 0) {
                                console.error('获取线路总长度失败2');
                                this.$message.error('获取线路总长度失败');
                                return;
                            }
                            this.line.lineLength = res.data.data;
        
                        }).catch(err => {
                            console.error(`获取线路总长度失败2${err}`);
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
        //切换集电框事件
        activeLine () {
            this.alone = false;
            this.showStationAndLine = true; //控制叠加box
            this.lineShowing = true;
            this.stationShowing = false;
            this.newDaoluShowing = false;   //叠加道路
            this.newShowingArr[2] = true;
            // console.log(this.newShowingArr);
        },
        //切换电压
        activeStation () {
            this.alone = false;
            this.showStationAndLine = true; //控制叠加box
            this.stationShowing = true;
            this.lineShowing = false;
            this.newDaoluShowing = false;   //叠加道路
            this.newShowingArr[1] = true;
            // console.log(this.newShowingArr);
        },
        //切换道路
        activeDaolu () {
            this.alone = false;  //控制单个box
            this.showStationAndLine = true;  //控制叠加box
            this.stationShowing = false;   //叠加升压站
            this.lineShowing = false;  //叠加集电线路
            this.newDaoluShowing = true;   //叠加道路
            this.newShowingArr[0] = true;
            // console.log(this.newShowingArr);
        },
        showRoadDetail () {
            this.$emit('showRoadDetail');
        },
        showLineDetail (type) {
            this.$emit('showLineDetail', type);
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
