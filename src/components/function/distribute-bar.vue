<template>
    <div v-if="barVisible" class="container" :style="{left:leftPosition+'px'}">
        <div class="main-panel">
            <!-- <el-tooltip class="item" effect="light" content="风参表" placement="top" popper-class="custom-tooltip">
                <sub-button desc="windGauge" icon="biaoge" :left="true" @funSelectChange="showWindGauge"></sub-button>
            </el-tooltip> -->
            <el-tooltip class="item" effect="light" content="点击地面添加风机" placement="top" popper-class="custom-tooltip">
                <add-fan-one desc="add" icon="add" ref="btnAdd" @funSelectChange="onAddClick" :selectMode="true"></add-fan-one>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="指定坐标添加风机" placement="top" popper-class="custom-tooltip">
                <add-fan-two desc="add" icon="add" ref="coordinateAdd" @funSelectChange="onCoordinateAddClick" :selectMode="true"></add-fan-two>
            </el-tooltip>
            <!-- <el-tooltip class="item" effect="light" content="价格调整" placement="top" popper-class="custom-tooltip">
                <sub-button desc="price" icon="price" @funSelectChange="onClick('price')" :selectMode="true"></sub-button>
            </el-tooltip> -->
            <el-tooltip class="item" effect="light" content="设置容量" placement="top" popper-class="custom-tooltip">
                <capacitance desc="add" icon="add"></capacitance>
            </el-tooltip>
            <div class="spacespandiv">
                <span class="spacespan"></span>
            </div>
            <el-tooltip class="item" effect="light" content="回滚" placement="top" popper-class="custom-tooltip">
                <sub-button desc="rollback" icon="refresh" :right="false" :disable="planModified" @funSelectChange="onClick('rollback')"></sub-button>
            </el-tooltip>
        <!-- </div> -->
        <!-- <div class="calculate-panel"> -->
            <el-tooltip class="item" effect="light" content="保存编辑" placement="top" popper-class="custom-tooltip">
                <sub-button desc="calculate" icon="tijiao" :left="false" :right="true" :disable="planModified" @funSelectChange="onClick('calculate')"></sub-button>
            </el-tooltip>
        </div>

    </div>
</template>

<script>
    import SubButton from './sub-button';
    import addFanOne from './add-fan-one';
    import addFanTwo from './add-fan-two';
    import capacitance from './capacitance';

    export default {
        name: 'distribute-bar',
        components: { SubButton, capacitance, addFanOne, addFanTwo },
        data () {
            return {
                barVisible: false,
                leftPosition: 0
            };
        },
        computed: {
            planModified () {
                return !this.$store.state.scheme.modified && !this.$store.state.scheme.priceModify;
            }
        },
        watch: {
            // planModified (val) {
            //     this.$emit('planModified', val);
            // }
        },
        methods: {
            show (visible, left) {
                this.barVisible = visible;
                if (left !== null) {
                    this.leftPosition = left - 130;
                }
            },
            // showWindGauge () {
            //     this.$emit('showWindGauge');
            //     this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('distributeClick', 'showWindGauge');
            // },
            onClick (type) {
                // console.log(type)
                // this.onAddClick();
                // this.$refs.btnAdd.onClick();
                if (type === 'rollback' || type === 'calculate') {
                    !this.planModified && this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('distributeClick', type);
                } else {
                    this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('distributeClick', type);
                }
            },
            onAddClick (funId, selected) {
                this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('distributeClick', 'add', selected);
            },
            onCoordinateAddClick (funId, selected) {
                this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('distributeClick', 'coordinateAdd', selected);
            },
            setUnSelectAdd (value, refs) {
                if (refs) {
                    this.$refs['coordinateAdd'].setUnSelect();
                    this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('distributeClick', 'coordinateAdd', false);
                } else {
                    this.$refs['btnAdd'].setUnSelect();
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
        top: -58px;
    }
    .main-panel{
        display: flex;
        flex-direction: row;
        height: 50px;
        /* width: 380px; */
    }
    .calculate-panel{
        margin-left: 1px;
        height: 50px;
        width: 50px;
    }
    .spacespandiv {
        background-color:rgba(3, 32, 62, 0.6)
    }
    .spacespan {
        border-right-color: #ffffff;
        border-right-width: 1px;
        border-right-style: solid;
        opacity: 0.3;
        height: 20px;
        vertical-align: middle;
        position: relative;
        top: 15px;
    }
</style>
