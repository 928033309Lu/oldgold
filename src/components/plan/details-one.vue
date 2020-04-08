<style lang="less" scoped>
    @import "./details-one";

    .mylabel1 /deep/ .el-form-item__label{
        width: 180px !important;
    }
</style>
<template>
    <div class="detail1" v-bind:style="{height:detailOneHeight+'px'}">
        <el-row>
            <el-col :span="12">
                <div class="box marL60 marR10 mylabel1">
                    <div class="box-header">主要经济指标</div>
                    <el-form label-position="left" label-width="165px" :model="box1" class="title-name-self-one">
                        <!-- <el-form-item label="项目回收期：">
                            <div class="el-input">{{fixedNumber(box1.c14)}}</div>
                            <div class="unit">年</div>
                        </el-form-item>
                        <el-form-item label="装机容量：">                          
                            <div class="el-input">{{fixedNumber(box1.c4)}}</div>
                            <div class="unit">万千瓦</div>
                        </el-form-item>
                        <el-form-item label="年发电量：">                          
                            <div class="el-input">{{fixedNumber(box1.c5)}}</div>
                            <div class="unit">万度</div>
                        </el-form-item>
                        <el-form-item label="发电销售收入总额：">                           
                            <div class="el-input">{{fixedNumber(box1.c9)}}</div>
                            <div class="unit">万元</div>
                        </el-form-item>
                        <el-form-item label="营业总成本费用：">                           
                            <div class="el-input">{{fixedNumber(box1.c10)}}</div>
                            <div class="unit">万元</div>
                        </el-form-item>
                        <el-form-item label="财务净现值：">                           
                            <div class="el-input">{{fixedNumber(box1.c13)}}</div>
                            <div class="unit">万元</div>
                        </el-form-item>
                        <el-form-item label="偿债备付率：">                            
                            <div class="el-input">{{fixedNumber(box1.c15)}}</div>
                            <div class="unit"></div>
                        </el-form-item>
                        <el-form-item label="PIRR(全投资内部收益率)：" style="border: 0px;">                         
                            <div class="el-input">{{fixedNumber(box1.c11)}}</div>
                            <div class="unit">%</div>
                        </el-form-item> -->
                        <el-form-item label="项目容量：">                        
                            <div class="el-input">{{box1.design_capacity ? fixedNumber(box1.design_capacity) : '-'}}</div>
                            <div class="unit">MW</div>
                        </el-form-item>
                        <el-form-item label="等效小时数：">                          
                            <div class="el-input">{{box1.cut_hour ? fixedNumber(box1.cut_hour) : '-'}}</div>
                            <div class="unit">H</div>
                        </el-form-item>
                        <el-form-item label="单位总投资：">                       
                            <div class="el-input">{{box1.c8 ? fixedNumber(box1.c8) : '-'}}</div>
                            <div class="unit">元/KW</div>
                        </el-form-item>
                        <el-form-item label="度电成本(VAT&CIT)：">                       
                            <div class="el-input">{{box1.c21 ? fixedNumber(box1.c21) : '-'}}</div>
                            <div class="unit">元/KW</div>
                        </el-form-item>
                        <el-form-item label="Pt(投资回收期)：">                     
                            <div class="el-input">{{box1.c14 ? fixedNumber(box1.c14) : '-'}}</div>
                            <div class="unit">年</div>
                        </el-form-item>
                        <el-form-item label="全投资净现值@8.0%：">                          
                            <div class="el-input"> - </div>
                            <div class="unit">万元</div>
                        </el-form-item>
                        <el-form-item label="资本金净现值@10.0%：">                           
                            <div class="el-input"> - </div>
                            <div class="unit">万元</div>
                        </el-form-item>
                        <el-form-item label="PIRR(全投资内部收益率)：">                        
                            <div class="el-input">{{box1.c11 ? fixedNumber(box1.c11) : '-'}}</div>
                            <div class="unit">%</div>
                        </el-form-item>
                        <el-form-item label="EIRR(资本金内部收益率)：" style="border: 0px;">
                            <div class="el-input">{{box1.c12 ? fixedNumber(box1.c12) : '-'}}</div>
                            <div class="unit">%</div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="box marL60 marR10 marT20">
                    <div class="box-header">竞价测算</div>
                    <el-form label-position="left" label-width="165px" :model="box2" class="title-name-self-one">
                        <el-form-item label="全投资内部收益率：">
                            <!--<el-input v-model="formLabelAlign.type"></el-input>-->
                            <el-select v-model="yieldrate"
                                       placeholder="请选择"
                                       popper-class="step3-popper details-popper">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <div class="button" @click="calculate">竞价测算</div>
                        </el-form-item>
                        <el-form-item label="最低竞价电价：">
                            <div class="el-input">{{fixedNumber(box2.lowest_price)}}</div>
                            <div class="unit">元/KW</div>
                        </el-form-item>
                        <el-form-item label="等效发电小时数：">
                            <div class="el-input">{{fixedNumber(box2.equivalent_hours)}}</div>
                            <div class="unit">H</div>
                        </el-form-item>
                        <el-form-item label="平准化度电成本LCOE：">
                            <div class="el-input">{{fixedNumber(box2.lcoe)}}</div>
                            <div class="unit">元/KWH</div>
                        </el-form-item>
                        <el-form-item label="燃煤电价：">
                            <div class="el-input">{{fixedNumber(box2.coal_fired_electricity)}}</div>
                            <div class="unit">元/KWH</div>
                        </el-form-item>
                        <el-form-item label="单位千瓦造价：" style="border: 0px;">
                            <div class="el-input">{{fixedNumber(box2.cost_per_kilowatt)}}</div>
                            <div class="unit">元/KW</div>
                        </el-form-item>

                    </el-form>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="box marR60 marL10">
                    <div class="box-header">竞价测算结果</div>
                    <div class="box-content">
                        <div class="box-content-title">全投资内部收益率</div>
                        <div class="box-chart-container">
                            <div class="box-content-left">
                                <p class="p1">元/KWH</p>
                            </div>
                            <div class="box-content-right">
                                <e-charts :repaint="true" :options="chart1" v-bind:style="chartStyle1"></e-charts>
                            </div>
                        </div>
                    </div>
                    <div class="box-content">
                        <div class="box-content-title" style="margin-top: -35px;">不确定度分析</div>
                        <div class="box-chart-container">
                            <div class="box-content-left">
                                <p class="p2">元/KWH</p>
                            </div>
                            <div class="box-content-right">
                                <e-charts :repaint="true" :options="chart2" v-bind:style="chartStyle2"></e-charts>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    import util from '@/libs/util';
    import ECharts from '../../echarts/ECharts';
    import { fixedNumber } from '@/libs/function-util';
    import { baseTooltipFormatter } from '@/libs/echarts-util';
    export default {
        name: 'details-one',
        components: {ECharts},
        props: ['projectId', 'planId'],
        data () {
            return {
                detailOneHeight: document.body.clientHeight - 100 - 74,
                formLabelAlign: {
                    name: '',
                    region: '',
                    type: ''
                },
                chartStyle1: {
                    width: '400px',
                    height: '282px'
                },
                chartStyle2: {
                    width: '400px',
                    height: '282px'
                },
                options: [
                    {
                        value: 0.06,
                        label: '6%'
                    },
                    {
                        value: 0.08,
                        label: '8%'
                    },
                    {
                        value: 0.1,
                        label: '10%'
                    }
                ],
                chart1: null,
                chart2: null,
                box1: {
                    c4: null,
                    c5: null,
                    c6: null, // 建设期利息
                    c7: null, // 流动资金
                    c8: null, // 动态总投资
                    c9: null,
                    c10: null,
                    c11: null,
                    c13: null,
                    c14: null,
                    c15: null
                },
                box2: {
                    coal_fired_electricity: null,
                    cost_per_kilowatt: null,
                    equivalent_hours: null,
                    lcoe: null,
                    lowest_price: null
                },
                yieldrate: 0.06 // 全投资内部收益率
            };
        },
        watch: {
            '$store.state.client.screenWidth': function (val) {
                this.initWidth();
            },
            '$store.state.client.screenHeight': function (val) {
                this.detailOneHeight = document.body.clientHeight - 100 - 74;
            },
            projectId: function () {
                this.refreshData();
            },
            planId: function () {
                this.refreshData();
            }
        },
        methods: {
            refreshData () {
                this.requestOne();
                this.requestTwo();
                this.requestThree();
            },
            // 全投资收内部收益率图表
            requestOne () {
                this.chart1 = this.getChart1DefaultValue();
                util.ajax.get('/evaluation_jingjia', {
                    params: {
                        scheme_id: this.planId,
                        project_id: this.projectId
                    }
                }).then(res => {
                    this.chart1.legend.data = res.data.data.series.map(value => {
                        return value.name;
                    });
                    // this.chart1.xAxis[0].data = res.data.data.xAxis.data;
                    // this.chart1.yAxis = res.data.data.yAxis.map(value => {
                    //     value.axisLine = {
                    //         lineStyle: {
                    //             color: '#D4EFF6'
                    //         }
                    //     };
                    //     return value;
                    // });
                    this.chart1.series[0].name = res.data.data.series[0].name;
                    this.chart1.series[0].data = res.data.data.series[0].data;
                    this.chart1.series[1].name = res.data.data.series[1].name;
                    this.chart1.series[1].data = res.data.data.series[1].data;
                    this.chart1.series[2].name = res.data.data.series[2].name;
                    this.chart1.series[2].data = res.data.data.series[2].data;
                    // this.chart1.series[2].data = [3200, 2300, 3300];
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 获取测算结果和横着的图表
            requestTwo () {
                this.box2 = {};
                this.chart2 = this.getChart2DefaultValue();
                util.ajax.get('/evaluation_uncertainty', {
                    params: {
                        scheme_id: this.planId,
                        project_id: this.projectId,
                        yieldrate: this.yieldrate
                    }
                }).then((res) => {
                    this.chart2.legend.data = res.data.data.legend.data;
                    this.chart2.xAxis.boundaryGap = res.data.data.xAxis.boundaryGap;
                    this.chart2.yAxis.data = res.data.data.yAxis.data;
                    this.chart2.series[0].name = res.data.data.series[0].name;
                    this.chart2.series[0].data = res.data.data.series[0].data;
                    this.chart2.series[1].name = res.data.data.series[1].name;
                    this.chart2.series[1].data = res.data.data.series[1].data;
                    this.box2 = res.data.data.result || {};
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 主要经济指标
            requestThree () {
                this.box1 = {};
                util.ajax.get('/evaluation_result', {
                    params: {
                        scheme_id: this.planId,
                        project_id: this.projectId
                    }
                }).then(res => {
                    this.box1 = res.data.data || {};
                }).catch((err) => {
                    console.log(err);
                });
            },
            calculate () {
                this.refreshData();
            },
            initWidth () {
                let w = (document.documentElement.offsetWidth || document.body.offsetWidth) * 0.45 - 70 - 70;
                this.chartStyle1.width = `${w}px`;
                this.chartStyle2.width = `${w}px`;
            },
            getChart1DefaultValue () {
                return {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: baseTooltipFormatter
                    },
                    legend: {
                        data: [],
                        textStyle: {
                            color: '#D4EFF6'
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['6%', '8%', '10%'],
                            axisPointer: {
                                type: 'shadow'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#D4EFF6'
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '电价',
                            // min: 0,
                            // max: 1,
                            // interval: 0.2,
                            axisLabel: {
                                formatter: '{value} '
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#D4EFF6'
                                }
                            }
                        },
                        {
                            type: 'value',
                            name: '等效小时数',
                            min: null,
                            max: null,
                            interval: null,
                            axisLabel: {
                                formatter: '{value}'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#D4EFF6'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: null,
                            type: 'bar',
                            itemStyle: {
                                color: '#33C86F'
                            },
                            data: []
                        },
                        {
                            name: null,
                            type: 'bar',
                            itemStyle: {
                                color: '#3380C8'
                            },
                            data: []
                        },
                        {
                            name: null,
                            type: 'scatter',
                            yAxisIndex: 1,
                            itemStyle: {
                                color: '#FFC400'
                            },
                            data: []
                        }
                    ]
                };
            },
            getChart2DefaultValue () {
                return {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: baseTooltipFormatter
                    },
                    legend: {
                        data: [],
                        textStyle: {
                            color: '#D4EFF6'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [],
                        axisLine: {
                            lineStyle: {
                                color: '#D4EFF6'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: [],
                        axisLine: {
                            lineStyle: {
                                color: '#D4EFF6'
                            }
                        }
                    },
                    series: [
                        {
                            name: null,
                            type: 'bar',
                            data: [],
                            itemStyle: {
                                color: '#B5C833'
                            }
                        },
                        {
                            name: null,
                            type: 'bar',
                            data: [],
                            itemStyle: {
                                color: '#33C8C6'
                            }
                        }
                    ]
                };
            }
        },
        mounted () {
            this.refreshData();
        },
        computed: {
            // detailOneHeight () {
            //     return `${document.body.clientHeight - 100 - 54}px`;
            // }
        },
        created () {
            this.initWidth();
            this.fixedNumber = fixedNumber;
            this.chart1 = this.getChart1DefaultValue();
            this.chart2 = this.getChart2DefaultValue();
        }
    };
</script>
