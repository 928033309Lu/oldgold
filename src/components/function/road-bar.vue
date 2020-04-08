<template>
    <!--<div v-if="barVisible" class="container" :style="{left:leftPosition+'px'}">-->
    <div v-if="barVisible" class="container">
        <div class="main-panel">
            <el-tooltip class="item" effect="light" content="手动优化" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop" :disable="enManager || enManagerBtn" :disableStyle="enManagerBtn" icon="shoudonghuanjie" :left="true" @funSelectChange="onClick('youhua')"></sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="重新设计" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop" :disable="enManager || enManagerBtn" :disableStyle="enManagerBtn" icon="sheji1" @funSelectChange="onClick('reCalculating')"></sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="成果导入" placement="top" popper-class="custom-tooltip">
                <design-upload-button :disable="enManager || enManagerBtn" :disableStyle="enManagerBtn" :projectId="projectId" :planId="planId" type="road" :action="action" :filename="filename" @roadImport="onRoadImport" accept=".dxf" />
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="成果导出" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop" :disable="enManagerBtn" :disableStyle="enManagerBtn" icon="Export" :right="true" @funSelectChange="onClick('export')"></sub-button>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
import SubButton from './sub-button';
import DesignUploadButton from './design-upload-button';
import util from '../../libs/util';
import {downloadFile} from '@/libs/function-util';

export default {
    name: 'road-bar',
    components: {
        DesignUploadButton,
        SubButton
    },
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
            barVisible: false,
            leftPosition: 0,
            isPlayDisable: false,
            isPauseDisable: true,
            isStopDisable: true
        };
    },
    computed: {
        action: function () {
            if (this.funId === 23) {
                return '/import_station_excel';
            } else if (this.funId === 24) {
                return '/input_rsl_line/' + this.projectId + '/' + this.planId;
            } else if (this.funId === 26) {
                return '/design_road_in_dxf';
            }
        },
        filename: function () {
            if (this.funId === 22) {
                return 'rsl_road';
            } else if (this.funId === 24) {
                return 'rsl_line';
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
        enManagerBtn: function () {
            if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                return true;
            }else{
                return false;
            }
        },
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
                        this.$emit('roadReCalculatingShow');
                    }
                    break;
                case 'youhua':
                    if (this.$store.state.user.loginUserInfo.role === 3) {
                        this.$message('企业管理员没有权限执行此操作！');
                    } else {
                        this.$emit('roadshoudongyouhuShow');
                    }
                    break;
                case 'export':
                    this.exportDXF();
                    break;
            }
            // this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('playClick', type, this.funId);
        },
        onRoadImport () {
            this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('dxfFileSelected', this.funId, this.projectId, this.planId);
        },
        exportDXF () {
            util.DaoluUrl.get(`/exist_dxf/${this.projectId}/${this.planId}`).then(res => {
                if (res.data && res.data.code === 1) {
                    downloadFile(util.daoluUrl + `/export_dxf/${this.projectId}/${this.planId}`);
                } else {
                    this.$message('当前没有可供导出的成果。');
                }
            }).catch((err) => {
                console.log(err);
            });
        }
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
.main-panel {
  display: flex;
  flex-direction: row;
  height: 50px;
  /* width: 100px; */
}
</style>
