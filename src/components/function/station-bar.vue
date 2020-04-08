<template>
    <div v-if="barVisible" class="container">
        <div class="main-panel">
            <el-tooltip class="item" effect="light" content="手动优化" placement="top" popper-class="custom-tooltip">
                <sub-button ref="station-youhua" desc="stop" :disable="enManager || enManagerBtn" :disableStyle="enManagerBtn" :funId="27" icon="shoudonghuanjie" :left="true"  @funSelectChange="onClick"  :selectMode="true"></sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="导入坐标" placement="top" popper-class="custom-tooltip">
                <design-upload-button :disable="enManager  || enManagerBtn" :disableStyle="enManagerBtn" :projectId="projectId" :planId="planId" :action="action" type="station" :filename="filename"
                                      accept=".xls,.xlsx" v-on:click.native="uploadClick" @file-selected="onFileSelected" @stationImport="onStationImport"/>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="成果导出" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop" :disable="enManagerBtn" :disableStyle="enManagerBtn" :funId="28" icon="Export" :right="true" @funSelectChange="onClick"></sub-button>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
    import SubButton from './sub-button';
    import DesignUploadButton from './design-upload-button';

    export default {
        name: 'station-bar',
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
                    return '/import_road_dxf/';
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
            onClick (funId, selected) {
                if (funId === 27) this.$emit('stationYouhua', selected);
                if (funId === 28) this.$emit('stationDaochu', selected);
            },
            uploadClick () {
                this.$refs['station-youhua'].setUnSelect();
                this.$emit('stationYouhua', false);
            },
            onFileSelected (fileInfo) {
                this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('dxfFileSelected', this.funId, this.projectId, this.planId, fileInfo);
            },
            onStationImport () {
                this.$emit('stationImport');
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
        padding-bottom: 10px;
    }
    .main-panel{
        display: flex;
        flex-direction: row;
        height: 50px;
        /*width: 162px;*/
        width: 150px;
    }
</style>
