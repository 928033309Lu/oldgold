
export default function (xAxisData, seriesData1, seriesData2,filename) {
    return {
        title:{
            text:filename,
            show:false
        },
        legend: {
            data:['地形高','设计高'],
            top:3,
            right:60,
            textStyle:{
                color:'#d4eff6',
            }
        },
        xAxis: {
            name: '长度（米）',
            nameTextStyle:{
                color: '#D4EFF6'
            },
            type: 'category',
            boundaryGap: false,
            axisLabel: {
                textStyle: {
                    color: '#D4EFF6'
                }
            },
            axisLine:{
                lineStyle:{
                    color:'rgba(159,164,162,0.5)',
                    width:1,
                }
            },
            data: xAxisData,
        },
        toolbox: {
            right: 25,
            itemSize: 17,
            feature: {
                saveAsImage: {
                    icon:'image://data:image/png;base64,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',
                    backgroundColor:'rgba(0, 18, 40, 0.8)'

                }
            }
        },
        yAxis: {
            name: '高（米）',
            nameTextStyle:{
                color: '#D4EFF6'
            },
            type: 'value',
            axisLine:{
                lineStyle:{
                    color:'rgba(159,164,162,0.5)',
                    width:1,
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#D4EFF6'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['rgba(159,164,162,0.5)'],
                    width: 1,
                    type: 'solid'
                }
            },
            min: function (value) {
                return value.min - value.min % 10;
            },
            max: function (value) {
                return value.max - value.max % 10 + 10;
            }
        },
        grid:{
            left: 50,
            right: 70,
            top:60,
            bottom:25
        },
        series: [
            {
                name: '地形高',
                data: seriesData1,
                type: 'line',
                smooth: true,
                itemStyle:{
                    color:'#fefeff'
                }
            },
            {
                name: '设计高',
                data: seriesData2,
                type: 'line',
                smooth: true,
                itemStyle:{
                    color:'#57b649'
                }
            }
        ]
    }
}
