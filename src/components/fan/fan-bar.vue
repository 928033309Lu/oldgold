<template>
    <div v-if="visible" class="container" :style="{left:position.x+'px',top:position.y+'px'}">
        <div class="main-panel">
            <el-tooltip class="item" effect="light" content="移动" placement="top" popper-class="custom-tooltip">
                <sub-button desc="move" icon="move" :left="true" @funSelectChange="onClick('move')"></sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="删除" placement="top" popper-class="custom-tooltip">
                <sub-button desc="remove" icon="remove"  @funSelectChange="onClick('remove')"></sub-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="更换机型" placement="top" popper-class="custom-tooltip">
                <sub-button desc="fan" icon="fan" :right="true" @funSelectChange="onClick('fan')"></sub-button>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
    import SubButton from '../function/sub-button';

    export default {
        name: 'fan-bar',
        components: {SubButton},
        props: {
            // visible: {
            //     type: Boolean,
            //     default: false
            // },
            // position: {
            //     type: Object,
            //     default: {
            //         x: 0,
            //         y: 0
            //     }
            // },
            // fanInfo: {
            //     type: Object,
            //     default: {}
            // }
        },
        data () {
            return {
                visible: false,
                position: {
                    x: 0,
                    y: 0
                },
                fanInfo: {}
            };
        },
        methods: {
            show (visible, x, y, fanInfo) {
                if (visible) {
                    this.position.x = x;
                    this.position.y = y;
                    this.fanInfo = fanInfo;
                }
                this.visible = visible;
            },
            onClick (type, selected) {
                this.$parent && this.$parent.$emit('fanClick', type, this.fanInfo.turbine_id, this.fanInfo, selected);
                if (type === 'fan') {
                    this.visible = false;
                }
            }
        }
    };
</script>

<style scoped>
    .container{
        display: flex;
        flex-direction: row;
        position: absolute;
        height: 50px;
        width: 190px;
        z-index: 1000;
    }
    .main-panel{
        display: flex;
        flex-direction: row;
        height: 50px;
        width: 150px;
    }
    .electric-panel{
        margin-left: 30px;
        height: 50px;
        width: 50px;
    }
</style>