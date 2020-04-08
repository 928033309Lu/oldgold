<template>
    <div class="load_detail" :style="loadDetailStyle" >
        <div class="buttons-group" v-show="isActive">
            <div style="font-size: 24px;cursor: pointer; border-top-left-radius: 4px;border-bottom-left-radius: 4px;" @click="editMode=0" v-bind:class="{ active: editMode===0 }">
                <el-tooltip class="item" effect="light" content="节点编辑" placement="top" popper-class="custom-tooltip">
                    <i class="el-icon-edit"></i>>
                </el-tooltip>
            </div>
             <div style="font-size: 24px;cursor: pointer;" @click="editMode=4" v-bind:class="{ active: editMode===4 }">
                <el-tooltip class="item" effect="light" content="打断支线" placement="top" popper-class="custom-tooltip">
                    <i class="iconfont icon-daduan"></i>
                </el-tooltip>
            </div>
             <div style="font-size: 24px;cursor: pointer;" @click="editMode=2" v-bind:class="{ active: editMode===2 }">
                <el-tooltip class="item" effect="light" content="删除支线" placement="top" popper-class="custom-tooltip">
                    <icon name="remove" />
                </el-tooltip>
            </div>
            <!--回滚-->
            <div @click="rollBack" class="rollBack" v-bind:class="{disabled: !editedRoad}">
                <el-tooltip class="item" effect="light" content="回滚" placement="top" popper-class="custom-tooltip">
                    <icon name="refresh1" />
                </el-tooltip>
            </div>
            <!--保存-->
            <div @click="submitEditInsideRoad" v-bind:class="{disabled: !editedRoad}">
                <el-tooltip class="item" effect="light" content="保存编辑" placement="top" popper-class="custom-tooltip">
                    <icon name="baocun" />
                </el-tooltip>
            </div>
            <!--关闭-->
            <div @click="closeToolBar" class="closeToolBar">
                <el-tooltip class="item" effect="light" content="退出" placement="top" popper-class="custom-tooltip">
                    <icon name="exit" />
                </el-tooltip>
            </div>
        </div>
        <div class="gauge_header" v-show="!isActive">
            <div class="edit" @click="editToolBar" v-bind:class="{ active: isActive }">
                <el-tooltip class="item" effect="light" :content="isActive?'关闭编辑工具栏':'打开编辑工具栏'" placement="top" popper-class="custom-tooltip">
                    <icon name="bianji1" v-if="!enManager"></icon>
                </el-tooltip>
            </div>
            <div class="close" @click="close">
                <el-tooltip class="item" effect="light" content="关闭" placement="top" popper-class="custom-tooltip">
                    <icon name="guanbi" />
                </el-tooltip>
            </div>
        </div>
        <div class="sanjiao"  v-show="!isActive"></div>
        <div class="gauge_table"  v-show="!isActive">
            <div class="left">
                <p>道路信息</p>
                <a v-show='downloadUrl' target="_blank" :href="downloadUrl" style="position: absolute;left: 440px;top: 3px;color: #33C86F;" download>
                    <el-tooltip class="item" effect="light" content="导出道路信息" placement="top" popper-class="custom-tooltip">
                        <icon name="xiazai" />
                    </el-tooltip>
                </a>
                <el-table class="table" :data="tableData" @row-click="onRowClick" :row-class-name="tableRowClassName" :highlight-current-row="true" ref="table">
                    <el-table-column label="道路编号" header-align="center" align="center">
                        <template slot-scope="scope">
                            {{scope.row.properties.roadID}}
                        </template>
                    </el-table-column>
                    <el-table-column label="长度（米）" min-width="90" header-align="center" align="center">
                        <template slot-scope="scope">
                            <!--{{scope.row.properties.roadLength}}-->
                            {{parseFloat(scope.row.properties.roadLength) | toFixed}}
                        </template>
                    </el-table-column>
                    <el-table-column label="挖方量（立方米）" header-align="center" align="center">
                        <template slot-scope="scope">
                            {{scope.row.properties.digAmount}}
                        </template>
                    </el-table-column>
                    <el-table-column label="填方量（立方量）" header-align="center" align="center">
                        <template slot-scope="scope">
                            {{scope.row.properties.fillAmount}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="right">
                <p>纵断面图</p>
                <!--<a target="_blank" href="" style="position: absolute;right: 40px;top: 3px;color: #33C86F;"><icon name="xiazai"/></a>-->
                <div v-bind:style="chartStyleContainer">
                    <e-charts :repaint="true" :options="chart" v-bind:style="chartStyle"></e-charts>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
// import qs from 'qs';
// import axios from 'axios';
// import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legendScroll';
import _ from 'lodash';
import ECharts from '../../echarts/ECharts';
import chart from './chart2';
import util from '../../libs/util';
export default {
    name: 'roadDetail',
    components: { ECharts },
    props: {
        className: {
            type: String,
            default: 'echarts'
        },
        id: {
            type: String,
            default: 'yourID'
        },
        width: {
            type: String,
            default: '1400px'
        },
        height: {
            type: String,
            default: '310px'
        }
    },
    data () {
        return {
            tableData: [],
            productId: null,
            planId: null,
            turbinesList: [],
            wrgHeightsList: [],
            downLoadTable: null,
            chartDate: {},
            isActive: false,
            editMode: -1,
            currentRow: null,
            chart: null,
            downloadUrl: null,
            chartStyle: {
                width: '',
                height: '258px'
            },
            chartStyleContainer: {
                width: '',
                height: '258px',
                overflow: 'hidden',
                position: 'absolute',
                top: '0'
            },
            loading: false
        };
    },
    filters: {
        toFixed: function (str) {
            return str.toFixed(2);
        }
    },
    watch: {
        isActive: function () {
            if (this.$store.state.user.loginUserInfo.role === 3) {
                this.isActive = false;
            }
            if (this.isActive) {
                // 开始手工编辑场内道路节点
                this.editMode = 0;
            } else {
                if (this.editedRoad) {
                    this.closeToolBar();
                }
                // 停止手工编辑场内道路节点
                this.editMode = -1;
            }
            // this.openOptimization();
        },
        '$store.state.client.screenWidth': function (val) {
            this.initWidth();
        },
        loading () {
            this.$store.commit('globeLoading', {loading: this.loading, text: '重新计算中，预计用时1分钟...'});
        },
        editMode (newVal, oldVal) {
            // 0: 节点编辑；2：删除支线；4：打断支线；-1：非编辑状态
            switch (oldVal) {
                case 0:
                    this.$emit('roadsFunction', 'stopEditInsideRoad');
                    break;
                case 2:
                    this.$emit('roadsFunction', 'stopDeleteRoadLine');
                    break;
                case 4:
                    this.$emit('roadsFunction', 'stopSplitRoadLine');
                    break;
                default:
                    break;
            }

            switch (newVal) {
                case 0:
                    this.$emit('roadsFunction', 'startEditInsideRoad');
                    break;
                case 2:
                    this.$emit('roadsFunction', 'startDeleteRoadLine');
                    break;
                case 4:
                    this.$emit('roadsFunction', 'startSplitRoadLine');
                    break;
                default:
                    break;
            }
        }
    },
    mounted () {
        this.getInsideRoadsInfo();
    },
    computed: {
        editedRoad () {
            return this.$store.state.road.editedRoad;
        },
        loadDetailStyle () {
            return this.isActive ? 'height:0px;' : 'height:288px;';
        },
        enManager: function () {
            if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                return true;
            }else{
                return false;
            }
        }
    },
    methods: {
        open (type, productId, planId) {
            this.productId = productId;
            this.planId = planId;
            this.exportDXF(productId, planId);
        },
        loadTable (productId) {
            // alert(productId);
        },
        close () {
            this.$emit('roadDetailClose');
            this.editMode = -1;
            // this.$emit('stopEditInsideRoad');
        },
        onRowClick (row) {
            this.$refs.table.setCurrentRow(row);
            this.locationSelectInsideRoad(row.roadEntityId);
            this.illustrationInsideRoad(row.roadEntityId);
        },
        // 加载场内道路信息
        getInsideRoadsInfo () {
            this.$emit('roadDetailsFunction', 'getInsideRoadsInfo', null, (data) => {
                console.log('从gis加载道路支路信息');
                let arr = [];
                for (let i = 0; i < data.length; i++) {
                    arr.push({
                        roadEntityId: data[i].roadEntityId,
                        properties: {
                            roadID: data[i].properties.roadID,
                            roadLength: data[i].properties.roadLength,
                            digAmount: data[i].properties.digAmount,
                            fillAmount: data[i].properties.fillAmount
                        }
                    });
                }
                arr = _.orderBy(arr, ['properties.roadID'], ['asc']);
                this.tableData = arr;
                this.exportDXF(this.productId, this.planId);
                this.illustrationInsideRoad(arr[0].roadEntityId);
                this.locationSelectInsideRoad(arr[0].roadEntityId);
                this.$refs.table.setCurrentRow(arr[0]);
            });
        },
        // 获取场内道路支线的剖面图（横断面图）数据
        illustrationInsideRoad (roadEntityId) {
            //     * index        点号索引
            //     * lon          经度
            //     * lat          纬度
            //     * x            支线长度
            //     * y            线路上节点高度
            //     * ty           线路节点所在地高程
            this.$emit('roadDetailsFunction', 'illustrationInsideRoad', roadEntityId, (data) => {
                data.then((result) => {
                    this.setChart(result);
                });
            });
        },
        // 定位支线道路
        locationSelectInsideRoad (roadEntityId) {
            this.$emit('roadDetailsFunction', 'locationSelectInsideRoad', roadEntityId, null);
        },
        setChart (data) {
            let xAxisData = [];
            let seriesData1 = [];
            let seriesData2 = [];
            for (let i in data) {
                xAxisData.push(_.round(data[i].x));
                seriesData1.push(data[i].ty);
                seriesData2.push(data[i].y);
            }
            this.chart = chart(xAxisData, seriesData1, seriesData2, this.$store.getters.currentProjectPlanName + '方案场内道路纵断面图');
        },
        // 显隐编辑工具条
        editToolBar () {
            this.isActive = !this.isActive;
        },
        // 回滚提示
        rollBack () {
            if (!this.editedRoad) return;
            this.$confirm('回滚后无法返回，确认返回到上一次保存状态？', '回滚', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'road-detail-quit-message'
            })
                .then(() => {
                    this.rollbackFun().then(() => { }).catch(() => { });
                })
                .catch(action => { });
        },
        // 确认回滚
        rollbackFun () {
            return new Promise((resolve, reject) => {
                this.editMode = -1;
                // this.$emit('roadsFunction', 'stopEditInsideRoad');
                this.$emit('roadsFunction', 'rollBack', null, (data) => {
                    data.then(() => {
                        this.getInsideRoadsInfo();
                        this.editMode = 0;
                        // this.$emit('roadsFunction', 'startEditInsideRoad');
                        this.$store.commit('editedRoad', false);
                        resolve();
                    }).catch(e => {
                        reject(e);
                        console.error(e);
                    });
                });
            });
        },
        // 提交编辑后的场内道路信息至S3
        submitEditInsideRoad () {
            if (!this.editedRoad) return;
            this.loading = true;
            this.$emit('roadsFunction', 'submitEditInsideRoad', null, (data, productId, planId) => {
                let postData = {
                    project_id: productId,
                    scheme_id: planId,
                    edit_road_json: data
                };
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 60000
                };
                util.DaoluUrl.post('/edit_road?', postData, config).then(res => {
                    this.loading = false;
                    if (res.data.code === 1) {
                        this.$store.commit('editedRoad', false);
                        this.editMode = -1;
                        this.$emit('roadsFunction', 'stopEditInsideRoad');
                        this.$emit('roadsFunction', 'loadPlanData');
                        this.$emit('roadDetailClose' , true);
                        this.$emit("gisClose"); //关闭图谱，工程设计
                    } else {
                        this.$message.error('保存遇到问题请稍后重试');
                    }
                }).catch(err => {
                    this.loading = false;
                    console.error(err);
                    this.$message.error('保存失败');
                });
            });
        },
        // // 修改方案状态
        // changePlanStatus (productId, planId) {
        //     return new Promise((resolve, reject) => {
        //         util.ajax.put(`/scheme/${productId}/${planId}`, {
        //             status: 1
        //         }).then(res => {
        //             if (res.data.code === 201) {
        //                 resolve('修改方案状态成功');
        //             } else {
        //                 this.$message.error('更新项目状态遇到问题请稍后重试');
        //             }
        //         }).catch(err => {
        //             console.error('修改计算状态失败');
        //             this.$message.error('修改计算状态失败');
        //             reject(err);
        //         });
        //     });
        // },
        // 退出编辑，关闭编辑条
        closeToolBar () {
            if (this.editedRoad) {
                this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '保存',
                    cancelButtonText: '放弃修改',
                    customClass: 'road-detail-quit-message'
                })
                    .then(() => {
                        // 保存并提交
                        this.submitEditInsideRoad();
                    })
                    .catch(action => {
                        if (action === 'cancel') {
                            // 回滚并离开页面
                            this.rollbackFun().then(() => {
                                this.editMode = -1;
                                // this.$emit('roadsFunction', 'stopEditInsideRoad');
                                this.$emit('roadDetailClose');
                                this.isActive = false;
                            }).catch(() => { });
                        }
                    });
            } else {
                // 停止手动编辑场内道路节点
                this.editMode = -1;
                // this.$emit('roadsFunction', 'stopEditInsideRoad');
                this.$emit('roadDetailClose');
            }
        },
        tableRowClassName ({ row, rowIndex }) {
            if (row.active) {
                return 'roadDetailRowClass roadDetailRowActive';
            } else {
                return 'roadDetailRowClass';
            }
        },
        exportDXF (productId, planId) {
            if (!productId || !planId) return;
            this.downloadUrl = util.daoluUrl + '/export_piles_excel/' + productId + '/' + planId;
            // let data = new FormData();
            // let config = {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // };
            // data.append('project_id', productId);
            // data.append('scheme_id', planId);
            // util.DaoluUrl.post('/export_piles_excel?', data, config).then(res => {
                // this.downloadUrl = res.data.data;
            // }).catch((err) => {
            //     console.log(err);
            // });
        },
       initWidth(){
            let w = (document.documentElement.offsetWidth || document.body.offsetWidth) - 490;
            this.chartStyle.width = `${w}px`;
            this.chartStyleContainer.width = `${w}px`;
        }

    },
    created () {
        this.initWidth();
    }
};
</script>

<style lang="less" scoped>
.load_detail {
  width: 100%;
  height: 288px;
  position: absolute;
  bottom: 0;
  left: 0;
  .buttons-group {
    position: absolute;
    right: 10px;
    bottom: 10px;
    // width: 148px;
    height: 50px;
    // margin-right: 10px;
    font-size: 22px;
    line-height: 50px;
     .active {
      color: #33c86f !important;
    }
    div {
      width: 45px;
      height: 50px;
      float: left;
      text-align: center;
      -ms-flex-pack: center;
      justify-content: center;
      -ms-flex-align: center;
      align-items: center;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      position: relative;
      background: rgba(3, 32, 62, 0.6);
      color: #d3dbe4;
      cursor: pointer;
      &:hover {
        color: #33c86f;
      }
    }
    div.disabled {
      opacity: 0.6;
      color: rgb(211, 219, 228);
    }
    .rollBack {
      line-height: 54px;
      .icon {
        width: 26px;
        height: 26px;
      }

    }
    .closeToolBar {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
  .gauge_header {
    float: right;
    width: 60px;
    height: 30px;
    background-color: rgba(3, 28, 53, 0.5);
    font-size: 18px;
    line-height: 30px;
    display: flex;
    div {
      color: #a3b6c3;
      width: 30px;
      height: 30px;
      float: left;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #33c86f;
      }
    }
    .active {
      color: #33c86f;
    }
    .close {
      &:hover {
        color: #33c86f;
      }
      a {
        color: #a3b6c3;
        &:hover {
          color: #ddeaf3;
        }
      }
    }
  }
  .sanjiao {
    width: 0;
    height: 0;
    border-top: 30px solid rgba(0, 0, 0, 0);
    border-right: 30px solid rgba(3, 28, 53, 0.5);
    float: right;
  }
  .gauge_table {
    overflow: hidden;
    background: rgba(3, 28, 53, 0.5);
    height: 258px;
    width: 100%;
    position: absolute;
    bottom: 0;
    .left {
      float: left;
      width: 459px;
      height: 100%;
      p {
        margin: 0;
        font-size: 13px;
        font-family: MicrosoftYaHei;
        font-weight: bold;
        color: rgba(212, 239, 246, 1);
        padding: 5px 0 0 17px;
      }
      .table {
        background: rgba(0, 0, 0, 0);
        width: 441px;
        height: 215px;
        margin-bottom: 8px;
        margin-left: 17px;
      }
    }
    .right {
      float: left;
      margin-left: 25px;
      height: 100%;
      p {
        margin: 0;
        font-size: 13px;
        font-family: MicrosoftYaHei;
        font-weight: bold;
        color: rgba(212, 239, 246, 1);
        padding: 5px 0 0 17px;
      }
      div {
        .echarts {
        }
      }
    }
  }
}
</style>
