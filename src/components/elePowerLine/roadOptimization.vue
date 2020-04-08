<template>
    <div class="load_page">

        <div class="button">
            <div style="margin-left: 10px" @click="startEditInsideRoad">
                <el-tooltip class="item" effect="light" content="纵断面图" placement="top" popper-class="custom-tooltip">
                    <icon name="tubiaozhexiantu-copy"/>
                </el-tooltip>
            </div>
            <!--回滚-->
            <div @click="rollBack">
                <el-tooltip class="item" effect="light" content="回滚" placement="top" popper-class="custom-tooltip">
                    <icon name="refresh1"/>
                </el-tooltip>
            </div>
            <div @click="submitEditInsideRoad">
                <el-tooltip class="item" effect="light" content="保存" placement="top" popper-class="custom-tooltip">
                    <icon name="baocun"/>
                </el-tooltip>
            </div>
            <div @click="close">
                <el-tooltip class="item" effect="light" content="退出" placement="top" popper-class="custom-tooltip">
                    <icon name="exit"/>
                </el-tooltip>
            </div>
        </div>
        <div class="gauge_table">
            <p>纵断面图</p>
            <a target="_blank" href="" style="position: absolute;right: 27px;top: 3px;color: #33C86F;"><icon name="xiazai"/></a>
            <div style="width: 1920px;height: 235px;overflow: hidden">
                <div id="charts" :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart"></div>
            </div>

        </div>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import echarts from 'echarts/lib/echarts';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/legendScroll';
    export default {
        name: 'roadOptimization',
        props: {
            className: {
                type: String,
                default: 'echart'
            },
            id: {
                type: String,
                default: 'yourID'
            },
            width: {
                type: String,
                default: '2300px'
            },
            height: {
                type: String,
                default: '320px'
            }
        },
        data () {
            return {
                productId: null,
                planId: null
            };
        },
        watch: {
            '$store.state.client.screenWidth': function (val) {
                this.chart = echarts.init(this.$refs.myEchart);
                this.chart.resize();
            },
            '$store.state.client.screenHeight': function (val) {
                this.chart = echarts.init(this.$refs.myEchart);
                this.chart.resize();
            }
        },
        mounted () {
            
            this.initChart();
        },
        methods: {
            loadTable (productId) {

            },
            close () {
                this.$emit('roadshoudongyouhuClose');
            },
            initChart () {
                this.chart = echarts.init(this.$refs.myEchart);
                this.chart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            textStyle: {
                                color: '#D4EFF6'
                            }
                        },
                        data: ['6/1', '6/4', '6/7', '6/10', '6/13', '6/16', '6/19', '6/21', '6/24', '6/27', '6/30', '7/2', '7/5', '7/8', '7/11'],
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(159,164,162,0.5)',
                                width: 1
                            }
                        }

                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: '#D4EFF6'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(159,164,162,0.5)',
                                width: 1
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['rgba(159,164,162,0.5)'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    series: [
                        {
                            name: '月度解决率',
                            type: 'line',
                            data: [92, 96, 99, 91, 96, 103, 100, 92, 96, 99, 91, 96, 103, 100, 115],
                            lineStyle: {
                                color: '#fefeff'
                            }
                        },
                        {
                            name: '累计解决率',
                            type: 'line',
                            data: [81, 90, 96, 81, 86, 93, 90, 81, 90, 96, 81, 86, 93, 90, 100],
                            lineStyle: {
                                color: '#57b649'
                            }
                        }
                    ]
                });
            },
            
            // 获取道路各分支信息
            getInsideRoadsInfo () {
                this.$emit('roadsFunction', 'getInsideRoadsInfo', null, (data) => {
                    console.log(data);
                });
            },
            // 高亮显示指定道路编号的道路支线
            locationSelectInsideRoad (insideRoadEntityID) {
                this.getInsideRoadsInfo();
                this.$emit('roadsFunction', 'locationSelectInsideRoad', 'roadLine', null);
            },
            // 获取场内道路支线的剖面图（横断面图）数据
            illustrationInsideRoad (insideRoadEntityID) {
                this.$emit('roadsFunction', 'illustrationInsideRoad', 'roadLine', (data) => {
                    data.then(result => {
                        console.log(result);
                    });
                });
            },
            // 开始手工编辑场内道路节点
            startEditInsideRoad () {
                this.$emit('roadsFunction', 'startEditInsideRoad');
            },
            // 回滚编辑
            rollBack () {
                this.$emit('roadsFunction', 'rollBack');
            },
            // 获取编辑后的场内道路geoJSON
            submitEditInsideRoad () {
                this.$emit('roadsFunction', 'submitEditInsideRoad', null, (data) => {
                    console.log(data);
                });
            }

        }
    };
</script>

<style lang="less" scoped>
    .load_page{
        width: 100%;
        height: 318px;
        position: absolute;
        bottom: 0;
        left: 0;
        .button{
            float: right;
            width: 198px;
            height: 50px;
            margin-right: 10px;
            background-color: rgba(3, 28, 53, 0.6);
            border-radius: 4px;
            font-size: 22px;
            line-height: 50px;
            div{
                color: #A3B6C3;
                width: 45px;
                height: 50px;
                float: left;
                text-align: center;
                &:hover {
                    color: #DDEAF3;
                }
            }
        }
        .gauge_table{
            background: rgba(3, 28, 53, 0.5);
            height: 258px;
            width: 100%;
            position: absolute;
            bottom: 0;
            p{
                margin: 0;
                font-size: 13px;
                font-family: MicrosoftYaHei;
                font-weight: bold;
                color: rgba(212,239,246,1);
                padding: 5px 0 0 17px;
            }
            div .echart{
                top: -25px;
                left: -175px;
                position: absolute!important;
            }

        }
    }
</style>
