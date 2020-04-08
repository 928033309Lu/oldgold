<template>
    <div class="power_line" :style="powerLineStyle">
        <div v-show="buttonShow" class="button">
            <!-- <div v-if="realHaveTowerData" id="switchdiv" @click="switchModel">{{currentModel?'桩':'塔'}}</div> -->
            <div id="modeldiv">{{currentModel?'塔位':'桩位'}}<br/>优化</div>
            <span class="spacespan"></span>
            <div v-if="currentModel" @click="changeActive" v-bind:class="{ active: isActive }" style="border-top-left-radius: 5px;border-bottom-left-radius: 5px;cursor: pointer;">
                <el-tooltip class="item" effect="light" content="更换塔型" placement="top" popper-class="custom-tooltip">
                    <icon name="jiaohuan" />
                </el-tooltip>
            </div>
            <div style="font-size: 24px;cursor: pointer;" v-if="!currentModel"  @click="editMode=0" v-bind:class="{ active: editMode===0 }">
                <el-tooltip class="item" effect="light" content="节点编辑" placement="top" popper-class="custom-tooltip">
                    <i class="el-icon-edit"></i>>
                </el-tooltip>
            </div>
              <div style="font-size: 24px;cursor: pointer;" v-if="!currentModel" @click="editMode=1" v-bind:class="{ active: editMode===1 }">
                <el-tooltip class="item" effect="light" content="新增支线" placement="top" popper-class="custom-tooltip">
                    <icon name="zengjia1" />
                </el-tooltip>
            </div>
            <div style="font-size: 24px;cursor: pointer;" v-if="!currentModel" @click="editMode=3" v-bind:class="{ active: editMode===3 }">
                <el-tooltip class="item" effect="light" content="合并桩位" placement="top" popper-class="custom-tooltip">
                    <i class="iconfont icon-hebing"></i>
                </el-tooltip>
            </div>
            <div style="font-size: 24px;cursor: pointer;" v-if="!currentModel" @click="editMode=4" v-bind:class="{ active: editMode===4 }">
                <el-tooltip class="item" effect="light" content="打断支线" placement="top" popper-class="custom-tooltip">
                    <i class="iconfont icon-daduan"></i>
                </el-tooltip>
            </div>
             <div style="font-size: 24px;cursor: pointer;" v-if="!currentModel" @click="editMode=2" v-bind:class="{ active: editMode===2 }">
                <el-tooltip class="item" effect="light" content="删除支线" placement="top" popper-class="custom-tooltip">
                    <icon name="remove" />
                </el-tooltip>
            </div>
            <div style="font-size: 24px;cursor: pointer;" @click="powerBack" v-bind:class="{disabled: !editedPower}">
                <el-tooltip class="item" effect="light" content="回滚" placement="top" popper-class="custom-tooltip">
                    <icon name="refresh1" />
                </el-tooltip>
            </div>
            <div style="font-size: 24px;cursor: pointer;" @click="submitEditTowerLineInfo('save')" v-bind:class="{disabled: !editedPower}">
                <el-tooltip class="item" effect="light" content="保存编辑" placement="top" popper-class="custom-tooltip">
                    <icon name="tijiao" />
                </el-tooltip>
            </div>
            <!-- <div @click="submitEditTowerLineInfo('update')">
                <el-tooltip class="item" effect="light" content="提交校验" placement="top" popper-class="custom-tooltip">
                    <icon name="baocun"/>
                </el-tooltip>
            </div> -->
            <div @click="closeButton" style="border-top-right-radius: 5px;border-bottom-right-radius: 5px;cursor: pointer;">
                <el-tooltip class="item" effect="light" content="退出" placement="top" popper-class="custom-tooltip">
                    <icon name="exit" />
                </el-tooltip>
            </div>
        </div>
        <div class="gauge_header" v-show="!buttonShow">
            <div v-bind:class="{ active: buttonShow }" @click="displayButton" style="cursor: pointer;">
                <el-tooltip class="item" effect="light" :content="buttonShow?'关闭编辑工具栏':'打开编辑工具栏'" placement="top" popper-class="custom-tooltip">
                    <icon name="bianji1" v-if="!enManager" />
                </el-tooltip>
            </div>
            <div @click="close" style="cursor: pointer;">
                <el-tooltip class="item" effect="light" content="关闭" placement="top" popper-class="custom-tooltip">
                    <icon name="guanbi" />
                </el-tooltip>
            </div>
        </div>
        <div class="sanjiao"  v-show="!buttonShow"></div>
        <div class="gauge_table"  v-show="!buttonShow">
            <div class="left">
                <p>线路信息</p>
                <!-- <a v-show="enableDownExcel" :href="downloadUrl" target="_blank" style="position: absolute;left: 440px;top: 3px;color: #33C86F;" download>
                    <el-tooltip class="item" effect="light" content="导出线路信息" placement="top" popper-class="custom-tooltip">
                        <icon name="xiazai" />
                    </el-tooltip>
                </a> -->
                <el-table @row-click="onRowClick" :row-class-name="tableRowClassName" :highlight-current-row="true" class="table" :data="tableData" ref="table">
                    <el-table-column prop="a" label="线路编号" header-align="center" align="center">
                        <template slot-scope="scope">
                            {{scope.row.lineInfo.routeName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="b" label="长度（米）" min-width="90" header-align="center" align="center">
                        <template slot-scope="scope">
                            {{parseFloat(scope.row.lineInfo.routeLength) | toFixed}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="c" label="转角塔（个）" header-align="center" align="center">
                        <template slot-scope="scope">
                            {{scope.row.lineInfo.angleTowerNum}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="d" label="直线塔（个）" header-align="center" align="center">
                        <template slot-scope="scope">
                            {{scope.row.lineInfo.lineTowerNum}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="right">
                <p>纵断面图</p>
                <div v-bind:style="chartStyleContainer">
                    <e-charts :repaint="true" :options="chart" v-bind:style="chartStyle"></e-charts>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import util from '@/libs/util';
import ECharts from '../../echarts/ECharts';
import chart from './chart1';
export default {
    name: 'powerDetail',
    components: { ECharts },
    props: ['haveTowerData'],
    data () {
        return {
            down: null,
            isActive: false,
            editMode: -1, // 0: 节点编辑；1：新增支线；2：删除支线；3：合并桩位；4：打断支线；-1：非桩位编辑状态
            isDetail: true,
            buttonShow: true,
            tableData: [],
            productId: null,
            planId: null,
            turbinesList: [],
            wrgHeightsList: [],
            downLoadTable: null,
            chart: null,
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
            // downloadUrl: null,
            currentModel: false, // T:塔位优化；F：桩位优化
            loading: false,
            realHaveTowerData: false,
            // enableDownExcel: false // 是否可以下载桩位成果表
        };
    },
    filters: {
        toFixed: function (str) {
            return str.toFixed(2);
        }
    },
    watch: {
        haveTowerData (val) {
            this.currentModel = val;
            this.realHaveTowerData = val;
        },
        buttonShow (val) {
            if (this.$store.state.user.loginUserInfo.role === 3) {
                this.buttonShow = false;
            } else {
                this.swtichEditorStatus();
            }
        },
        '$store.state.client.screenWidth': function (val) {
            this.initWidth();
        },
        loading () {
            this.$store.commit('globeLoading', {loading: this.loading, text: '正在保存...'});
        },
        editMode (newVal, oldVal) {
            switch (oldVal) {
                case 0:
                    this.$emit('collectLineFunction', 'stopEditStakeLine');
                    break;
                case 1:
                    this.$emit('collectLineFunction', 'stopDrawStakeLine');
                    break;
                case 2:
                    this.$emit('collectLineFunction', 'stopDeleteStakeLine');
                    break;
                case 3:
                    this.$emit('collectLineFunction', 'stopCombineStakeLine');
                    break;
                case 4:
                    this.$emit('collectLineFunction', 'stopSplitStakeLine');
                    break;
                default:
                    break;
            }

            switch (newVal) {
                case 0:
                    this.$emit('collectLineFunction', 'startEditStakeLine');
                    break;
                case 1:
                    this.$emit('collectLineFunction', 'startDrawStakeLine');
                    break;
                case 2:
                    this.$emit('collectLineFunction', 'startDeleteStakeLine');
                    break;
                case 3:
                    this.$emit('collectLineFunction', 'startCombineStakeLine');
                    break;
                case 4:
                    this.$emit('collectLineFunction', 'startSplitStakeLine');
                    break;
                default:
                    break;
            }
        }
    },
    computed: {
        editedPower () {
            return this.$store.state.power.editedPower;
        },
        powerLineStyle () {
            return this.buttonShow ? 'height:0px;' : 'height:288px;';
        },
        enManager: function () {
            if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                return true;
            }else{
                return false;
            }
        }
    },
    mounted () {
        this.fetchData();
        this.currentModel = this.haveTowerData;
    },
    methods: {
        changeActive () {
            this.isActive = !this.isActive;
            if (this.isActive) {
                this.$emit('collectLineFunction', 'stopEditCollectLine');
                this.$emit('collectLineFunction', 'changeTowerType', null, null, true);
            } else {
                this.$emit('collectLineFunction', 'changeTowerType', null, null, false);
                this.$emit('collectLineFunction', 'startEditTowerLine');
            }
        },
        // switchModel () {
        //     this.currentModel = !this.currentModel;
        //     this.swtichEditorStatus();
        // },
        swtichEditorStatus () {
            this.isActive = false;
            this.editMode = -1;
            this.$emit('collectLineFunction', 'stopEditToolMode');
            this.$emit('collectLineFunction', 'stopEditCollectLine');
            this.$emit('collectLineFunction', 'changeTowerType', null, null, false);
            if (!this.buttonShow) {
                // 禁用编辑工具
                return;
            }
            if (this.currentModel) {
                // 塔位优化
                this.$emit('collectLineFunction', 'startEditTowerLine');
            } else {
                // 桩位优化
                this.$emit('collectLineFunction', 'startEditToolMode');
                this.editMode = 0;
            }
            this.loadTable(this.productId, this.planId);
            this.onRowClick(this.tableData[0]);
        },
        // downUrl () {
        //     this.enableDownExcel = false;
        //     this.downloadUrl = null;
        //     util.Xianluajax.get(`/downloadexcel?project_id=${this.productId}&scheme_id=${this.planId}`).then(res => {
        //         if (res.data.code < 0) {
        //             this.$message.error('获取桩位成果表地址失败，请稍后重试。');
        //         } else if (res.data.code === 0) {
        //             // 文件已生成时，可以直接下载
        //             this.downloadUrl = res.data.data[0];
        //             this.enableDownExcel = true;
        //         } else {
        //             // 文件未生成时，轮询状态
        //             this.downloadUrl = res.data.data[0];
        //             this.getDownloadStatus();
        //         }
        //     }).catch((err) => {
        //         console.log(err);
        //         this.$message.error('获取桩位成果表地址失败，请稍后重试。');
        //     });
        // },
        // 下载文件未生成时，轮询生成状态，生成后下载
        // getDownloadStatus () {
        //     util.Xianluajax.get('/getstatus_download', {
        //         params: {
        //             project_id: this.productId,
        //             scheme_id: this.planId
        //         }
        //     }).then(res => {
        //         if (res.data.code === 0) {
        //             this.enableDownExcel = true;
        //         } else {
        //             setTimeout(() => {
        //                 this.getDownloadStatus();
        //             }, 15000);
        //         }
        //     }).catch((err) => {
        //         console.log(err);
        //         this.$message.error('获取桩位成果表地址失败，请稍后重试。');
        //     });
        // },
        open (type, productId, planId) {
            this.buttonShow = type;
            // this.downloadUrl = null;
            this.tableData = null;
            this.chart = chart(null, null, null, this.$store.getters.currentProjectPlanName + '方案集电线路纵断面图');
            // if (type) {
            //     this.isActive = true;
            // }
            this.productId = productId;
            this.planId = planId;
            this.swtichEditorStatus();
            this.loadTable(productId, planId);
            this.onRowClick(this.tableData[0]);
            // this.downUrl();
        },
        fetchData () {
           
            this.chart = chart(null, null, null, this.$store.getters.currentProjectPlanName + '方案集电线路纵断面图');
        },
        displayButton () {
            if (this.buttonShow) {
                this.buttonShow = false;
                this.editMode = -1;
                this.$emit('collectLineFunction', 'stopEditToolMode');
                this.$emit('stopEditCollectLine');

                if (this.editedPower) {
                    this.closeButton();
                }
            } else {
                this.isActive = false;
                this.buttonShow = true;
            }
        },
        onRowClick (row) {
            if (!row) return;
            this.$refs.table.setCurrentRow(row);
            this.$emit('collectLineFunction', 'highLightSelectBranchRoute', null, null, null, row.entitID);
            this.$emit('collectLineFunction', 'getcolloectLineCrossSection', null, null, null, row.entitID, (data) => {
                data.then((result) => {
                    this.setChart(result);
                });
            });
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
            this.chart = chart(xAxisData, seriesData1, seriesData2, this.$store.getters.currentProjectPlanName + '方案集电线路纵断面图');
        },
        tableRowClassName ({ row, rowIndex }) {
            if (row.active) {
                return 'roadDetailRowClass roadDetailRowActive';
            } else {
                return 'roadDetailRowClass';
            }
        },
        loadTable (productId, planId) {
            this.$emit('collectLineFunction', 'getCollectLineListInfo', null, null, null, null, (data) => {
                // let arr = [];
                // for (let i = 0; i < data.length; i++) {
                //     arr.push({
                //         roadEntityId: data[i].roadEntityId,
                //         properties: {
                //             roadID: data[i].properties.roadID,
                //             roadLength: data[i].properties.roadLength,
                //             digAmount: data[i].properties.digAmount,
                //             fillAmount: data[i].properties.fillAmount
                //         }
                //     });
                // }
                this.tableData = data;
                // this.illustrationInsideRoad(arr[0].roadEntityId);
                // this.locationSelectInsideRoad(arr[0].roadEntityId);
                // this.$refs.table.setCurrentRow(arr[0]);
            });
        },
        close () {
            // this.buttonShow = false;
            this.editMode = -1;
            this.$emit('wpowerDetailClose');
            this.$emit('collectLineFunction', 'stopEditCollectLine');
            this.$emit('collectLineFunction', 'changeTowerType', null, null, false);
            this.$emit('collectLineFunction', 'stopEditToolMode');
        },
        close2 () {
            // this.buttonShow = false;
            this.editMode = -1;
            this.$emit('wpowerDetailClose2');
            this.$emit('collectLineFunction', 'stopEditCollectLine');
            this.$emit('collectLineFunction', 'changeTowerType', null, null, false);
            this.$emit('collectLineFunction', 'stopEditToolMode');
        },
        closeButton () {
            if (this.editedPower) {
                this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '保存',
                    cancelButtonText: '放弃修改',
                    customClass: 'road-detail-quit-message'
                })
                    .then(() => {
                        // 保存并提交
                        this.submitEditTowerLineInfo();
                        // this.buttonShow = false;
                        this.close();
                    })
                    .catch(action => {
                        if (action === 'cancel') {
                            // 回滚并离开页面
                            // this.$emit('stopEditCollectLine');
                            this.$emit('collectLineFunction', 'rollBack');
                            this.loadTable(this.productId, this.planId);
                            this.onRowClick(this.tableData[0]);
                            this.$store.state.power.editedPower = false;
                            // this.buttonShow = false;
                            this.close();
                        }
                    });
            } else {
                // this.buttonShow = false;
                this.close();
                // this.$emit('stopEditCollectLine');
            }
        },
        // 回滚编辑
        powerBack () {
            if (this.editedPower) {
                this.$confirm('回滚后无法返回，确认返回到上一次保存状态？', '回滚', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'road-detail-quit-message'
                }).then(() => {
                    this.reloadData();
                }).catch(action => {
                    // this.$message.error('回滚失败');
                });
            }
        },
        submitEditTowerLineInfo (type) {
            if (!this.editedPower) {
                return;
            }
            // this.loading = true;
            this.$emit('collectLineFunction', 'submitEditTowerLineInfo', null, null, null, null, (result, project_id, scheme_id) => {
                //桩位优化等待页
                if(!this.currentModel){
                    let busloading = {};
                    busloading.loading=true;
                    busloading.scheme_id= scheme_id;
                    this.$store.commit("busloading",busloading);
                }
                // 提交线路数据
                let data = {
                    project_id: project_id.toString(),
                    scheme_id: scheme_id.toString(),
                    jfinfo: result,
                    isstake: this.currentModel?0:1 // 0: 塔位；1：桩位
                };
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                util.Xianluajax.post('/changesetting', data, config).then(res => {
                    // this.loading = false;
                    if (res.data.code !== 0) {
                        return this.$message.error('保存线路信息失败');
                    }
                    this.$message.success('保存线路信息成功');
                    // 保存成功后退出
                    // this.$emit('stopEditCollectLine');
                    // this.$emit('collectLineFunction', 'changeTowerType', null, null, false);
                    // this.buttonShow = false;
                    this.close2();
                    setTimeout(()=>{
                        this.$emit('requestRecalculat');
                    },200)
                    // this.reloadData();
                }).catch(err => {
                    this.loading = false;
                    let busloading2={};
                    busloading2.loading=false;
                    busloading2.scheme_id= null;
                    this.$store.commit("busloading",busloading2);
                    this.$message.error('保存线路信息失败。' + err);
                });
            });
        },
        initWidth () {
            let w = (document.documentElement.offsetWidth || document.body.offsetWidth) - 490;
            this.chartStyle.width = `${w}px`;
            this.chartStyleContainer.width = `${w}px`;
        },
        reloadData () {
            // 先结束编辑，隐藏线路
            this.editMode = -1;
            this.$emit('collectLineFunction', 'stopEditToolMode');
            this.$emit('stopEditCollectLine');
            this.$emit('collectLineFunction', 'changeTowerType', null, null, false);
            this.$emit('collectLineFunction', 'collectLine', this.productId, this.planId, true, null, (data) => {
                if (data) {
                    // 此处data是重新加载线路后的promise
                    data.then((res) => {
                        this.realHaveTowerData = res.isTower;
                        this.swtichEditorStatus();
                        this.loadTable(this.productId, this.planId);
                        this.onRowClick(this.tableData[0]);
                        this.$store.state.power.editedPower = false;
                    }).catch(err => {
                        if (err.code === 404) {
                            // this.$message.error('S3上文件不存在。');
                        } else if (err.code === 403) {
                            this.$message.error('S3上文件格式错误。');
                        } else {
                            this.$message.error('获取集电线路信息失败');
                        }
                    });
                }
            });
        }
    },
    created () {
        this.initWidth();
    }
};
</script>

<style lang="less" scoped>
.power_line {
  width: 100%;
  height: 288px;
  position: absolute;
  bottom: 0;
  left: 0;
  .button {
    // width: 240px;
    height: 50px;
    border-radius: 4px;
    font-size: 22px;
    line-height: 50px;
    position: absolute;
    right: 10px;
    // top: -40px;
    bottom: 10px;
    .active {
      color: #33c86f !important;
    }
    .disabled {
      opacity: 0.6;
      color: rgb(211, 219, 228) !important;
    }
    div {
      background-color: rgba(3, 28, 53, 0.6);
      color: #a3b6c3;
      width: 45px;
      height: 50px;
      float: left;
      text-align: center;
      &:hover {
        color: #33c86f;
      }
    }
  }
  .gauge_header {
    float: right;
    width: 60px;
    height: 30px;
    background-color: rgba(3, 28, 53, 0.5);
    font-size: 20px;
    line-height: 30px;
    .active {
      color: rgba(51, 200, 111, 1) !important;
    }
    div {
      color: #a3b6c3;
      width: 50%;
      height: 100%;
      float: left;
      text-align: center;
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
#switchdiv {
  width: 20px;
  margin-right: 3px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}
#modeldiv {
  width: 45px;
  border-radius: 5px 0px 0px 5px;
  font-size: 14px;
  color: #33c86f;
  line-height: 14px;
  padding: 10px 0px;
  height: 30px;
}
.spacespan {
  border-right-color: #ffffff;
  border-right-width: 1px;
  border-right-style: solid;
  opacity: 0.3;
  height: 50px;
  position: absolute;
  left: 45px;
}
.icon-add{

}
</style>
