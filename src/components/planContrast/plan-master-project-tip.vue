<template>
    <div class="plan-master" >
        <div class="title">
            <span class="titleName">{{planData.scheme_name}}</span> 
            <span class="titleRight"> 
                <span class="line"></span><b>·</b>  
            </span>
            <!-- <span ref="clickIcon" class="clickIcon" 
                :class="clickSelected?'clickIconActive':''" 
                style="cursor: pointer;" 
                @click="onClick">
                <icon name="xiazaijiangyiicon"></icon>
            </span>  -->
        </div>
        <ul class="plan-master-content"> 
            <li> <span><b>{{planData.total_hours}}</b> <span class="col"> h</span></span> 全场等效上网小时数</li>
            <li> 机型方案：
                <span class="turbine_type" v-for="(item,index) of planData.turbine_type" :key="index">{{item}}</span> 
            </li>
            <li> 轮毂高度：
                <!-- <span class="" v-for="(item,index) of planData.height" :key="index"><span>{{item}}</span><span class="col">m</span> </span> -->
                <span class=""><span>{{planData.height.join('/')}}</span><span class="col">m</span> </span>
            </li>
            <li> 项目总容量：<span>{{planData.total_capacity}}</span> <span class="col"> MW</span></li>
            <li> 全场平均风速：<span>{{planData.average_speed}}</span> <span class="col"> m/s</span></li>
            <li> 全场理论发电量：<span>{{planData.total_generation_capacity}}</span> <span class="col"> MWh/y</span></li>
            <li> 综合折减系数(不含尾流)：<span>{{planData.reduction_factor}}</span> </li>
            <li> 全场等效上网电量：<span>{{planData.total_energy}}</span> <span class="col"> MWh/y</span></li>
        </ul>
    </div>
</template>
<script>
    export default{
        name:"plan-master-project-tip",
        props:{
            planData:{}
        },
        data () {
            return{
                clickSelected: false
            }
        },
        watch: {
            planData:function(val){
                console.log(val)
            }
        },
        methods: {
            onClick () {
                
                this.clickSelected = !this.clickSelected;
            }
        }
    }
</script>
<style lang="less" scoped>
    .turbine_type{
        display: block;
        padding-left: 58px;
    }
    .turbine_type:nth-of-type(1){
        display: inline-block;
        padding-left: 0;
    }
    .plan-master{
        transition: 0.5s;
        width: 246px;
        background:rgba(3,32,62,0);
        border-radius:6px 0px 0px 6px;
        box-sizing: border-box;
        color:rgba(212,239,246,1);
        padding: 0px;
        margin-top: 20px;
    }
    .plan-master-content{
        border:1px solid rgba(212,239,246,0.5);
        font-size: 11px;
        padding: 0 0 10px 10px;
        margin: 0;
        height: 260px;
        overflow: auto;
        li{
            padding-top: 10px;
        }
        span{
            color:rgba(51,200,111,1);
        }
        b{
            font-size: 20px;
        }
        li:last-child{
            border: none;
        }
    }
    .closebtn{
        position: absolute;
        top: 1px;
        right: 14px;
        width: 15px;
        height: 15px;
        line-height: 15px;
        font-size: 12px;
        cursor: pointer;
    }
    .title{
        font-size: 16px;
        position: relative;
    }
    .title span{
        color: #D4EFF6;
    }
    .title .line{
        border-top: 1px solid rgba(51,200,111,1);
        width: 40px;
        display: inline-block;
        position: relative;
        top: -4px;
        right: -3px;
        margin-left: 5px;
    }  
    .title b{
        font-size: 16px;
        color:rgba(51,200,111,1);
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
    .col{
        color:rgba(51,200,111,1);
        padding-left: 3px;
    }
    .title .clickIconActive{
        color:rgba(51,200,111,1);
    }
    .clickIcon{
        position: absolute;
        right: 5px;
        top: 0;
    }
</style>