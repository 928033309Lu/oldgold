<template>
    <div v-if="barVisible" class="container newClass">
        <div class="main-panel">
            <el-tooltip class="item" effect="light" content="查看报告" placement="top" popper-class="onmytooltip">
                <reporter-bar-sub-button desc="add" icon="dizhi" :inloading="inloading" :left="true" :right="true" :selectMode="true" @funSelectChange="onClick()"></reporter-bar-sub-button>
            </el-tooltip>
            <!--<sub-button-fan desc="add"   :right="true" ref="btnAdd" @funSelectChange="onAddClick" :selectMode="true"></sub-button-fan>-->
        </div>
    </div>
</template>

<script>
    import ReporterBarSubButton from './reporter-bar-sub-button';
    import SubButtonFan from './sub-button-fan';
    import util from '@/libs/util';
    import {downloadFile} from '@/libs/function-util';

    export default {
        name: 'reporter-bar',
        components: { ReporterBarSubButton, SubButtonFan },
        data () {
            return {
                barVisible: false,
                leftPosition: 0,
                downloadUrl: null,
                inloading: false
            };
        },
        computed: {
            planModified () {
                return !this.$store.state.scheme.modified && !this.$store.state.scheme.priceModify ;
            }
        },
        methods: {
            show (visible, left) {
                this.barVisible = visible;
                if (left !== null) {
                    this.leftPosition = left - 48; /*** (40*4 - 65)/2 */
                }
            },
            onClick (type) {
                this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('reporter',
                    this.$store.state.app.projectInfo.project_id, this.$store.state.app.planId);

                this.$alert('确认生成微观选址报告?', '生成报告', {
                    confirmButtonText: '确定',
                    center: true,
                    callback: action => {
                        if (action !== 'confirm') {
                            // console.log(111)
                            this.$emit("closeIconActive");
                            return;
                        }
                        this.downFile();
                    }
                });
            },
            downFile () {
                let projectId = this.$store.state.app.projectInfo.project_id;
                let planId = this.$store.state.app.planId;
                this.inloading = true;
                util.ajax.get(`/report/${projectId}/${planId}`).then(res => {
                    if (res.data.code !== 200) {
                        this.inloading = false;
                        this.$message.error('获取报告地址失败，请稍后重试。');
                    } else {
                        // 文件未生成时，轮询状态
                        this.getDownloadStatus(projectId, planId);
                    }
                }).catch((err) => {
                    console.log(err);
                    this.inloading = false;
                    this.$message.error('获取报告地址失败，请稍后重试。');
                });
            },
            // 下载文件未生成时，轮询生成状态，生成后下载
            getDownloadStatus (projectId, planId) {
                util.ajax.get(`/report_poll/${projectId}/${planId}`).then(res => {
                    if (res.data.code === 200) {
                        // 报告已生成
                        this.inloading = false;
                        downloadFile(util.baseUrl + `/report_download/${projectId}/${planId}`);
                    } else if (res.data.code === 300) {
                        setTimeout(() => {
                            this.getDownloadStatus(projectId, planId);
                        }, 15000);
                    } else {
                        this.inloading = false;
                        this.$message.error('生成报告失败，请稍后重试。');
                    }
                }).catch((err) => {
                    console.log(err);
                    this.inloading = false;
                    this.$message.error('生成报告失败，请稍后重试。');
                });
            },
            setUnSelectAdd () {
                this.$refs['btnAdd'].setUnSelect();
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
    }
    .main-panel{
        display: flex;
        flex-direction: row;
        height: 15px;
        width: 15px;
        position: relative;
        top: 20px;
    }
    .newClass >>> .icon-panel-loading{
        width: 15px !important;
        height: 15px !important;
        animation: none !important;
    }
    .calculate-panel{
        margin-left: 1px;
        height: 50px;
        width: 50px;
    }
    .newClass{
        right: 39px !important;
        top: 4px;
        opacity: 0 !important;
    }
    .newClass .button-container{
        background: rgba(0, 0, 0, 0) !important;
    }
    .newClass >>> .button-container ,.newClass >>> .main-panel{
        height: 20px !important;
        width: 20px !important;
        line-height: 20px !important;
        outline: none;
    }
    .newClass >>> .icon-panel{
        height: 20px !important;
        width: 20px !important;
        line-height: 20px !important;
        outline: none;
    }
</style>
