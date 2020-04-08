<template>
    <!--<div v-if="barVisible" class="container" :style="{left:leftPosition+'px'}">-->
    <div v-if="barVisible" class="container">
        <div class="main-panel">
            <!--<sub-button desc="play" icon="play" :left="true" :disable="isPlayDisable" @funSelectChange="onClick('play')"></sub-button>-->
            <!--<sub-button desc="pause" icon="pause" :sep="true" :disable="isPauseDisable" @funSelectChange="onClick('pause')"></sub-button>-->
            <!--<sub-button desc="stop" icon="stop" :sep="true" :disable="isStopDisable" @funSelectChange="onClick('stop')"></sub-button>-->
            <el-tooltip class="item" effect="light" content="手动优化" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop"   icon="shoudonghuanjie" :left="true"  @funSelectChange="onClick()"></sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="重新计算" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop"   icon="refresh1"  @funSelectChange="onClick('reCalculating')"></sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="成果导出" placement="top" popper-class="custom-tooltip">
                <sub-button desc="stop"   icon="Export"  @funSelectChange="onClick()"></sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="成果导入" placement="top" popper-class="custom-tooltip">
                <design-upload-button :action="action" :filename="filename" @file-selected="onFileSelected"></design-upload-button>
            </el-tooltip>

        </div>
    </div>
</template>

<script>
    import SubButton from './sub-button';
    import DesignUploadButton from './design-upload-button';

    export default {
        name: 'play-bar',
        components: {
            DesignUploadButton,
            SubButton},
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
                if (this.funId === 22) {
                    return '/input_rsl_road/' + this.projectId + '/' + this.planId;
                } else if (this.funId === 24) {
                    return '/input_rsl_line/' + this.projectId + '/' + this.planId;
                }
            },
            filename: function () {
                if (this.funId === 22) {
                    return 'rsl_road';
                } else if (this.funId === 24) {
                    return 'rsl_line';
                }
            }
        },
        methods: {
            show (visible, left) {
                this.barVisible = visible;
                this.onClick('stop');
                if (left !== null) {
                    this.leftPosition = left - 48; /* (40*4 - 65)/2 */
                }
            },
            onClick (type) {
                if ((this.isPlayDisable && type === 'play') || (this.isPauseDisable && type === 'pause') ||
                    (this.isStopDisable && type === 'stop')) {
                    return;
                }
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
                        this.$emit('roadReCalculatingShow');
                        break;
                }
                this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('playClick', type, this.funId);
            },
            onFileSelected (fileInfo) {
                this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('dxfFileSelected', this.funId, this.projectId, this.planId, fileInfo);
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
        height: 50px;
        /*width: 162px;*/
        width: 200px;
    }
</style>
