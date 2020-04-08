<template>
    <!--<div v-if="barVisible" class="container" :style="{left:leftPosition+'px'}">-->
    <div v-if="barVisible" class="container" v-bind:class="{ active: isShan }">
        <div class="main-panel">
            <el-tooltip class="item" effect="light" content="桩位设计" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop" icon="sheji1" :disable="enManager || enManagerBtn" :disableStyle="enManagerBtn" :left="true" @funSelectChange="onClick('reCalculating')"></sub-button>
            </el-tooltip>
            <el-tooltip v-if="haveData" class="item" effect="light" content="自动排塔" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop" fontSize="27px" :disable="enManager || enManagerBtn" :disableStyle="enManagerBtn" icon="dianta" @funSelectChange="onClick('autoOptimization')"></sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="手动优化" placement="top" popper-class="custom-tooltip">
                <sub-button style="font-size: 20px" desc="stop" :disable="enManager || enManagerBtn" :disableStyle="enManagerBtn" icon="shoudonghuanjie" @funSelectChange="onClick('youhua')"></sub-button>
            </el-tooltip>
            <el-tooltip v-if="haveData&&haveTowerData" class="item" effect="light" content="下载平断面图" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop" fontSize="25px"  :disable="downloadConfig.pingduan.downloading  || enManagerBtn" :disableStyle="enManagerBtn" :inloading="downloadConfig.pingduan.downloading" icon="tubiaoxiazai" @funSelectChange="onClick('pingduanUrl')"></sub-button>
            </el-tooltip>
            <el-tooltip v-if="haveData&&haveTowerData" class="item" effect="light" content="下载桩位成果表" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop" :disable="downloadConfig.zhuangwei.downloading  || enManagerBtn" :disableStyle="enManagerBtn" :inloading="downloadConfig.zhuangwei.downloading"  icon="biaogexiazai" @funSelectChange="onClick('zhuangweiUrl')"></sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="成果导入" placement="top" popper-class="custom-tooltip">
                <design-upload-button1 :disable="enManager  || enManagerBtn" :disableStyle="enManagerBtn" :action="action" :filename="filename" @file-selected="onFileSelected"></design-upload-button1>
                <!--<sub-button desc="stop"   icon="daoru"  @funSelectChange="onClick()"></sub-button>-->
            </el-tooltip>
            <el-tooltip v-if="haveData" class="item" effect="light" content="成果导出" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop" :disable="downloadConfig.chengguo.downloading  || enManagerBtn" :disableStyle="enManagerBtn" :inloading="downloadConfig.chengguo.downloading" icon="Export" :right="true" @funSelectChange="onClick('daochuUrl')"></sub-button>
            </el-tooltip>
            <!--<el-tooltip class="item" effect="light" content="成果导入" placement="top" popper-class="custom-tooltip">-->
            <!--<design-upload-button :action="action" :filename="filename" @file-selected="onFileSelected"></design-upload-button>-->
            <!--</el-tooltip>-->

        </div>
    </div>
</template>

<script>
import SubButton from './sub-button';
import DesignUploadButton1 from './design-upload-button1';
import util from '@/libs/util';
import {downloadFile} from '@/libs/function-util';
export default {
    name: 'jidian-bar',
    components: {
        DesignUploadButton1,
        SubButton },
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
        }
    },
    data () {
        return {
            isShan: false,
            barVisible: false,
            leftPosition: 0,
            isPlayDisable: false,
            isPauseDisable: true,
            isStopDisable: true,
            downloadUrl: null,
            pingduanUrl: null,
            downloadConfigDic: {},
            downloadConfig: {},
            haveData: true // 存在桩位或塔位数据
        };
    },
    watch: {
        '$store.state.app.planId': function (newPlanId, oldPlanId) {
            // 删除原方案的状态数据
            delete this.downloadConfigDic[oldPlanId];
            if (this.downloadConfig.zhuangwei.downloading || this.downloadConfig.pingduan.downloading || this.downloadConfig.chengguo.downloading) {
                // 如果有正在轮询的操作，则记录该方案状态
                this.downloadConfigDic[oldPlanId] = this.downloadConfig;
            }

            // 判断是否需要恢复当前方案状态
            if (this.downloadConfigDic.hasOwnProperty(newPlanId)) {
                this.downloadConfig = this.downloadConfigDic[newPlanId];
                delete this.downloadConfigDic[newPlanId];
            } else {
                this.downloadConfig = this.getDefaultDownloadConfig();
            }
        },
        '$store.state.app.currentPlanData' (currentPlanData) {
            // currentPlanData.step_status.jdxl.status === 4 表示当前方案的集电线路无桩位无塔位数据
            this.haveData = !(currentPlanData && currentPlanData.step_status && currentPlanData.step_status.jdxl && currentPlanData.step_status.jdxl.status === 4);
        }
    },
    computed: {
        action: function () {
            if (this.funId === 22) {
                return '/input_rsl_road/' + this.projectId + '/' + this.planId;
            } else if (this.funId === 24) {
                return '/uploadfile/' + this.projectId + '/' + this.planId;
            }
        },
        filename: function () {
            if (this.funId === 22) {
                return 'rsl_road';
            } else if (this.funId === 24) {
                return 'file';
            }
        },
        enManager: function () {
            if(this.$store.state.user.loginUserInfo.role === 3){
                return true;
            }else if(this.$store.state.user.loginUserInfo.role === 10){
                return true;
            }else{
                return false;
            }
            
        },
        haveTowerData: function () {
            return this.$store.state.scheme.haveTowerData;
        },
        enManagerBtn: function () {
            if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                return true;
            }else{
                return false;
            }
        }
    },
    methods: {
        shan (selected) {
            this.isShan = selected;
        },
        show (visible, left) {
            this.barVisible = visible;
            if (this.barVisible === false) {
                this.isShan = false;
            }
            // this.onClick('stop');
            if (left !== null) {
                this.leftPosition = left - 48; /* (40*4 - 65)/2 */
            }
        },
        onClick (type) {
            //点击二级工具条关闭信息界面
            this.$emit("closeCesiumContainer");
            // if ((this.isPlayDisable && type === 'play') || (this.isPauseDisable && type === 'pause') ||
            //     (this.isStopDisable && type === 'stop')) {
            //     return;
            // }
            switch (type) {
                case 'play':
                    this.isPlayDisable = true;
                    this.isPauseDisable = false;
                    this.isStopDisable = false;
                    break;
                case 'pause':
                    this.isPlayDisable = false;
                    this.isPauseDisable = true;
                    this.isStopDisable = false;
                    break;
                case 'stop':
                    this.isPlayDisable = false;
                    this.isPauseDisable = true;
                    this.isStopDisable = true;
                    break;
                case 'reCalculating':
                    if (this.$store.state.user.loginUserInfo.role === 3) {
                        this.$message('企业管理员没有权限执行此操作！');
                    } else {
                        this.$emit('lineReCalculatingShow');
                    }
                    break;
                case 'youhua':
                    if (this.$store.state.user.loginUserInfo.role === 3) {
                        this.$message('企业管理员没有权限执行此操作！');
                    } else {
                        this.$emit('jidianshoudongyouhuShow');
                    }
                    break;
                case 'autoOptimization':
                    this.$emit('autoOptimizationShow');
                    break;
                case 'zhuangweiUrl':
                    this.downloadFun(this.downloadConfig.zhuangwei);
                    break;
                case 'pingduanUrl':
                    this.downloadFun(this.downloadConfig.pingduan);
                    break;
                case 'daochuUrl':
                    this.downloadFun(this.downloadConfig.chengguo);
                    break;
            }
            this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('playClick', type, this.funId);
        },
        onFileSelected (fileInfo) {
            this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('dxfFileSelected', this.funId, this.projectId, this.planId, fileInfo);
        },
        downloadFun (downloadParam) {
            downloadParam.downloading = true;
            downloadParam.fileUrl = null;
            downloadParam.projectId = this.projectId;
            downloadParam.planId = this.planId;
            util.Xianluajax.get(`/${downloadParam.service}`, {
                params: {
                    project_id: this.projectId,
                    scheme_id: this.planId
                }
            }).then(res => {
                if (res.data.code < 0) {
                    downloadParam.downloading = false;
                    this.$message.error(downloadParam.errMsg);
                } else if (res.data.code === 0) {
                    downloadParam.downloading = false;
                    downloadFile(res.data.data[0]);
                } else {
                    // 文件未生成时，轮询状态
                    downloadParam.fileUrl = res.data.data[0];
                    this.getDownloadStatus(downloadParam);
                }
            }).catch((err) => {
                downloadParam.downloading = false;
                console.log(err);
            });
        },
        // 下载文件未生成时，轮询生成状态，生成后下载
        getDownloadStatus (downloadParam) {
            util.Xianluajax.get('/getstatus_download', {
                params: {
                    project_id: downloadParam.projectId,
                    scheme_id: downloadParam.planId
                }
            }).then(res => {
                if (res.data.code === 0) {
                    downloadFile(downloadParam.fileUrl);
                    downloadParam.fileUrl = null;
                    downloadParam.downloading = false;
                    this.checkIfDeleteConfig(downloadParam);
                } else {
                    setTimeout(() => {
                        this.getDownloadStatus(downloadParam);
                    }, downloadParam.interval || 15000);
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        checkIfDeleteConfig (downloadParam) {
            if (!this.downloadConfigDic.hasOwnProperty(downloadParam.planId)) {
                return;
            }

            this.downloadConfigDic[downloadParam.planId].forEach(param => {
                if (this.downloadConfigDic[downloadParam.planId][param].service === downloadParam.service) {
                    this.downloadConfigDic[downloadParam.planId][param].downloading = downloadParam.downloading;
                }
            });
            // 删除原方案的状态数据
            if (!this.downloadConfigDic[downloadParam.planId].zhuangwei.downloading && !this.downloadConfigDic[downloadParam.planId].pingduan.downloading && !this.downloadConfigDic[downloadParam.planId].chengguo.downloading) {
                delete this.downloadConfigDic[downloadParam.planId];
            }
        },
        getDefaultDownloadConfig () {
            return {
                zhuangwei: {
                    service: 'downloadexcel',
                    downloading: false,
                    fileUrl: null,
                    errMsg: '桩位成果表下载失败，请稍后重试。',
                    interval: 5000,
                    projectId: null,
                    planId: null
                },
                pingduan: {
                    service: 'downloadprofile',
                    downloading: false,
                    fileUrl: null,
                    errMsg: '平断面图下载失败，请稍后重试。',
                    interval: 15000,
                    projectId: null,
                    planId: null
                },
                chengguo: {
                    service: 'exportdesigned',
                    downloading: false,
                    fileUrl: null,
                    errMsg: '成果导出失败，请稍后重试。',
                    interval: 5000,
                    projectId: null,
                    planId: null
                }
            };
        }
    },
    created () {
        this.downloadConfig = this.getDefaultDownloadConfig();
    }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: -58px;
  padding-bottom: 10px;
}
.active {
  left: -285px;
}
.main-panel {
  display: flex;
  flex-direction: row;
  height: 50px;
  /*width: 162px;*/
  /* width: 350px; */
}
</style>
