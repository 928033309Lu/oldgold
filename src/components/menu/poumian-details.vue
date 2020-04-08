<template>
    <div class="poumianDetails">
        <span @click="close" class="closeIcon"><icon name="close"></icon></span>
        <p class="title">剖面分析  <span v-show="!ishaibaVisible" style="margin-left: 50px;font-size: 13px;">未进入项目，海拔为 0 !</span></p>
        <div class="content">
            <span class="gao">高度 ( m ) </span>
            <span class="chang">长度 ( km ) </span>
            <e-charts class="echart"  :options="chart" :autoResize="true"></e-charts>
        </div>
    </div>
</template>
<script>
    import ECharts from '../../echarts/ECharts';
    export default{
        name:"poumian-details",
        components: {ECharts},
        props:{
            poumianData:{
                type:Array,
                default:[]
            },
            pouxAxis:{
                type:Array,
                default:[]
            },
            pouyAxis:{
                type:Array,
                default:[]
            }
        },
        data () {
            return{
                chart:null,
                ishaibaVisible: false
            }
        },
        watch: {
            poumianData:function(val){
                if(val){
                    console.log(this.pouyAxis);
                    this.chart = this.getChartDefaultValue(this.pouxAxis,this.pouyAxis);
                    console.log(this.$store.state.app.projectId);
                    if(this.$store.state.app.projectId){
                        this.ishaibaVisible = true;
                    }else{
                        this.ishaibaVisible = false;
                    }
                }
            }
        },
        methods: {
            close(){
                this.chart = this.getChartDefaultValue();
                this.$emit("closePoumianDetails");
            },
            getChartDefaultValue(pouxAxis,pouyAxis){
                return {	
                    tooltip:{
                        trigger:"axis"
                    },
                    xAxis: {
                        type: 'category',
                        // name: '长度 ( km ) ',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color:"rgba(212,239,246,0.9)"
                            }
                        },
                        data: pouxAxis
                    },
                    yAxis: {
                        type: 'value',
                        // name: '高度 ( m ) ',
                        axisLine: {
                            lineStyle: {
                                color:"rgba(212,239,246,0.9)"
                            }
                        },
                        splitLine:{
                            show:true,
                            lineStyle:{
                                color:"rgba(255,255,255,0.3)"
                            }
                        },//网格线
                        fontSize: "13px",
                        min: function(value) {
                            return value.min;
                        },
                        max: function(value) {
                            return value.max+50;
                        },
                    },
                    series: [{
                        data: pouyAxis,
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(27,182,86,0.9)' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgba(27,182,86,0.1)' // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            }
                        },
                        lineStyle: {
                            color:"rgba(27,182,86,0.7)"
                        }
                    }]
                
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .poumianDetails{
        position: absolute;
        top: 12%;
        left: 50%;
        width: 800px;
        margin-left: -400px;
        z-index: 999;
        background:rgba(3,32,62,0.6);
        color:rgba(212,239,246,1);
        border-radius: 4px;
    }
    .title{
        padding: 0 0 0 20px;
        margin: 0;
        width: 100%;
        height: 40px;
        line-height: 40px;
        background:rgba(3,32,62,0.8);
        border-radius: 4px 4px 0 0 ;
        box-sizing: border-box;
    }
    .content{
        width: 800px;
        position: relative;
        .gao{
            position: absolute;
            top: 15px;
            left: 30px;
            font-size: 10px;
        }
        .chang{
            position: absolute;
            right: 55px;
            bottom: 15px;
            font-size: 10px;
        }
        .echart{
            width: 800px;
            height: 400px;
        }
    }
    .closeIcon{
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 999;
        cursor: pointer;
        font-weight: bold;
    }
    .closeIcon:hover{
        color: #fff;
    }
</style>