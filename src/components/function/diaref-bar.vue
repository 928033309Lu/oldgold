<template>
    <div v-show="barVisible" class="diaref-container" :style="{left:leftPosition+'px'}">
        <div class="radio-panel">
            <el-radio v-model="radio" label="1" class="radio">X方向</el-radio>
            <el-radio v-model="radio" label="2" class="radio">Y方向</el-radio>
        </div>
        <div class="slider-panel">
            <div class="value-text">{{this.minValue}}</div>
            <el-slider v-model="valuePos"
                       :min="minPos"
                       :max="maxPos"
                       :format-tooltip="formatTooltip"
                       tooltip-class="tooltipName"
                       class="slider" ></el-slider>
            <div class="value-text">{{this.maxValue}}</div>
        </div>
    </div>
</template>

<script>
    import util from '@/libs/util';

    export default {
        name: 'diaref-bar',
        props: {
            projectId: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                barVisible: false,
                leftPosition: 0,
                valuePos: 0,
                minPos: 0,
                radio: '1',
                angle: '0.0',
                windSlice: {},
                currentProjectId: 0,
                currentSectionId: ''
            };
        },
        computed: {
            maxPos: function () {
                if (this.radio === '1' && this.windSlice.x) {
                    return this.windSlice.x.length - 1;
                } else if (this.windSlice.y) {
                    return this.windSlice.y.length - 1;
                }
                return 0;
            },
            minValue: function () {
                if (this.radio === '1' && this.windSlice.x && this.windSlice.x.length > 0) {
                    return this.windSlice.x[0];
                } else if (this.windSlice.y && this.windSlice.y.length > 0) {
                    return this.windSlice.y[0];
                }
                return 0;
            },
            maxValue: function () {
                if (this.radio === '1' && this.windSlice.x && this.windSlice.x.length > 0) {
                    return this.windSlice.x[this.windSlice.x.length - 1];
                } else if (this.windSlice.y && this.windSlice.y.length > 0) {
                    return this.windSlice.y[this.windSlice.y.length - 1];
                }
                return 0;
            }
        },
        watch: {
            valuePos: function (newQuestion, oldQuestion) {
                this.onChange();
            },
            radio: function (newQuestion, oldQuestion) {
                this.onChange();
            }
        },
        methods: {
            formatTooltip (val) {
                if (this.radio === '1' && this.windSlice.x && this.windSlice.x.length > 0) {
                    return this.windSlice.x[val];
                } else if (this.windSlice.y && this.windSlice.y.length > 0) {
                    return this.windSlice.y[val];
                }
                return '';
            },
            show (visible) {
                this.barVisible = visible;
                if (!this.barVisible) {
                    return;
                }
                this.leftPosition = -(260 - 65) / 2; /* (本控件宽度-functionButton宽度 )/2*/
                this.emitChangeEvent();

                // // 风电场半径接口
                // util.ajax.get('/layer/' + this.projectId + '/diaref', {}).then(res => {
                //     let retData = res.data;
                //     if (retData.code !== 200) {
                //         this.$message.error(retData.message);
                //         return;
                //     }
                //     // retData.data = "4123.1";
                //     let data = parseFloat(retData.data);
                //     let radios = parseInt((data / 2).toFixed(0));
                //     if (radios % 50 > 0) {
                //         radios = parseInt(radios / 50) * 50 + 50;
                //     }
                //     this.minValue = -radios;
                //     this.maxValue = radios;
                // }).catch((err) => {
                //     console.error(err);
                //     this.$message.error('取得风电场半径失败！');
                // });
            },
            onChange:_.debounce(
                function () {
                    this.emitChangeEvent();
                },
                500
            ),
            emitChangeEvent () {
                if (this.radio === '1') {
                    this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('diarefChange', this.currentProjectId, this.currentSectionId, 'x', this.windSlice.x[this.valuePos]);
                } else {
                    this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('diarefChange', this.currentProjectId, this.currentSectionId, 'y', this.windSlice.y[this.valuePos]);
                }
            },
            setSection (angle, projectId) {
                this.angle = angle;
                this.currentProjectId = projectId;
                this.currentSectionId = angle;

                // 风电场半径接口
                util.ajax.get('/wind_slice/' + (!projectId ? this.projectId : projectId) + '/' + this.angle, {}).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        console.error('获取风电场半径失败:' + retData.message);
                        // this.$message.error('获取风电场半径失败！');
                        return;
                    }

                    this.windSlice = retData.data;

                    // 如果风能切片显示中，就根据实际数据切换一下
                    if (this.barVisible) {
                        this.emitChangeEvent();
                    }
                }).catch((err) => {
                    console.error('获取风电场半径失败:' + err);
                    // this.$message.error('获取风电场半径失败！');
                });
            }
        }
    };
</script>

<style scoped>
    
    .diaref-container{
        height: 64px;
        width: 260px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: -71px;
        z-index:222;
    }
    .radio-panel{
        height: 24px;
        width: 260px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .slider-panel{
        margin-top: 10px;
        height: 32px;
        width: 260px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-radius: 4px;
        background-color: rgba(3,32,62,0.6);
    }
    .value-text{
        padding-right: 10px;
        padding-left: 10px;
        font-size:13px;

        font-family:MicrosoftYaHei;
        color:rgba(211,219,228,1);
        line-height:32px;
        height: 32px;
    }
    .slider{
        height: 32px;
        width: 100%;
        font-size: 12px;
    }
    .radio{
        border-radius: 4px;
        background-color: rgba(3,32,62,0.6);
        height: 24px;
        align-items: center;
        line-height: 24px;
        padding-right: 10px;
        padding-left: 10px;
    }
    .radio+.radio {
        margin-left: 10px;
    }
    .el-radio {
        color: #ccc;
    }
    .diaref-container>>>.el-radio__inner {
        background: none;
        border: 1px solid #ccc;
    } 
    .diaref-container>>>.el-radio__input.is-checked .el-radio__inner {
        border-color: #33c86f;
        background: none;
    }
</style>
