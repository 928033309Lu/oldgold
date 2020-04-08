<template>
    <div class="plan-gongcheng-tip">
        <div class="title">
            <span class="titleName"> {{gongData.scheme_name}} </span> 
            <span class="titleRight"> 
                <span class="line"></span><b>·</b>  
            </span>
        </div>
        <div class="plan-gongcheng-content">
            <span class="tab">道路</span>
            <ul>
                <li>长度：<span class="col"> {{fixedNumber(gongData.roaLength)}} </span> 米</li>
                <li>挖方量：<span class="col"> {{fixedNumber(gongData.wa)}} </span> 立方米</li>
                <li>填方量：<span class="col"> {{fixedNumber(gongData.tian)}} </span> 立方米</li>
            </ul>
            <span class="tab">线路</span>
            <ul>
                <li>线路总长度：<span class="col"> {{fixedNumber(gongData.collectorLength)}} </span> 米</li>
                <li>转角塔个数：<span class="col"> {{fixedNumber(gongData.broken_line)}} </span> 个</li>
                <li>直线塔个数：<span class="col"> {{fixedNumber(gongData.straight_line)}} </span> 个</li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        name:"plan-gongcheng-tip",
        props:{
            gongData:{}
        },
        data (){
            return{

            }
        },
        methods: {
            fixedNumber (number, fixed = 2) {
                if (!number || isNaN(Number(number))) return number;
                return Number(number).toFixed(fixed);
            }
        }
    }
</script>
<style lang="less" scoped>
    .plan-gongcheng-tip{
        color:rgba(212,239,246,1);
        margin-top: 20px;
        /* margin-right: 8px; */
    }
    .plan-gongcheng-content{
        border:1px solid rgba(212,239,246,0.5);
        font-size: 12px;
        padding: 0;
        margin: 5px 0 0 0;
        width: 244px;
        height: 260px;
        ul{
            margin: 0;
            li{
                padding : 5px 0 5px 10px;
                
            }
        }
        .tab{
            background: rgba(211, 219, 228, 0.2);
            border-radius: 2px;
            margin: 10px 30px;
            padding: 3px 4px;
            display: inline-block;
        }
        .col{
            color:rgba(51,200,111,1);
        }
    }
    .titleName{
        display: inline-block;
        /* width: 110px; */
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding-left: 5px;
    }
    .titleRight{
        display: inline-block;
        position: absolute;
        
    }
    .line{
        border-top: 1px solid rgba(51,200,111,1);
        width: 40px;
        display: inline-block;
        position: relative;
        top: -4px;
        right: -3px;
        margin-left: 5px;
    }  
</style>