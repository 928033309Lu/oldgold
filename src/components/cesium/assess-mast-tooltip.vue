<template>
    <div id="assessTooltip" class="assess-project-tooltip" :style="{left:planPos.x+25+'px',top:planPos.y-50+'px'}" v-show="dialogVisible" >
        <div class="horn">
            <div class="content">        
                <div>
                    <p>设计信息</p>
                    <ul v-for="(item,index) of planSelect1" :key="index">
                        <li>
                            <span>机型：</span> <span>{{item.jx}}</span>
                        </li>
                        <li>
                            <span>轮毂高度：</span> <span>{{item.lggd}}　m</span>
                        </li>
                        <li>
                            <span>经度：</span> <span>{{item.lng}}</span>
                        </li>
                        <li>
                            <span>纬度：</span> <span>{{item.lat}}</span>
                        </li>
                        <li>
                            <span>理论小时：</span> <span>{{item.hours}}</span>
                        </li>
                        <li>
                            <span>评估风速：</span> <span>{{item.speed}}</span>
                        </li>
                    </ul>
                </div>
                      
                <div>
                    <p>运行信息</p>
                    <ul v-for="(item,index) of planSelect2" :key="index">
                        <li>
                            <span>开始时间：</span> <span>{{item.eftb}}</span>
                        </li>
                        <li>
                            <span>结束时间：</span> <span>{{item.efte}}</span>
                        </li>
                        <li>
                            <span>可利用率： </span> <span>{{item.ava}}</span>
                        </li>
                        <li>
                            <span> 标准运行小时：</span> <span>{{item.bhours}}</span>
                        </li>
                        <li>
                            <span> 平均风速：</span> <span>{{item.speed}}</span>
                        </li>
                       
                    </ul>
                </div>
            </div>
            
            <div class="lt"></div>
            <div class="rt"></div>
            <div class="rb"></div>
            <div class="lb"></div>
        </div>
    </div>
</template>
<script>
    import util from '../../libs/util';
    export default{
        name:"assess-mast-tooltip",
        props:{
            planSelect1:{
                type: Array,
                default:[]
            },
            planSelect2:{
                type: Array,
                default:[]
            },
            planPos:{
                type:Object,
                default:{
                    x:0,
                    y:0
                }
            }
        },
        data () {
            return{
                ruleForm:{},
                dialogVisible : false
            }
        },
        watch: {
            planSelect1:function(val){
                if(val.length>0){
                    this.dialogVisible = true;
                }
            }
        },
        methods: {
            close(){
                if(this.dialogVisible){
                    this.dialogVisible = false;

                }
            }
        }
    }
</script>
<style lang="less" scoped>
.assess-project-tooltip{
    width: 400px;
    height: 200px;
    position: absolute;
   
    z-index: 99999;
    color: #d4eff6;
}
.content{
    display: flex;
    height:200px;
    &>div{
        flex: 1;
        height:100%;
        border:1px solid rgba(51,200,111,0.4);
        background:rgba(21,38,79,0.4);
        font-size: 12px;
        position: relative;
        &>p{
            font-size: 14px;
            text-align: center;
            padding-top: 5px;
        }
        &>ul{
            margin: 0;
            padding-left: 30px;
            position: absolute;
            bottom: 10px;
            &>li{
                height: 22px;
                line-height: 22px;
                &>span:nth-of-type(2){
                    color: #33c86f;
                }
            }
        }
    }
    &>div:nth-of-type(2){
        background:rgba(4,73,81,0.5);
    }
}

.horn>.lt,.horn>.rt,.horn>.rb,.horn>.lb{
    width: 20px;
    height: 20px;
    position:absolute;
  }
  .horn .lt{
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    left: -2px;
    top: -2px;
  }
  .horn .rt{
    border-top: 2px solid #fff;
    border-right: 2px solid #fff;
    right: -2px;
    top: -2px;
  }
  .horn .rb{
    border-bottom:2px solid #fff;
    border-right: 2px solid #fff;
    right: -2px;
    bottom: -2px;
  }
  .horn .lb{
    border-bottom:2px solid #fff;
    border-left: 2px solid #fff;
    left: -2px;
    bottom: -2px;
  }
</style>