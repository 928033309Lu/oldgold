<template>
    <div v-show="isShow" class="contrast-move-tip" :style="{left:clientX+'px',top:clientY+'px'}">
        
        <ul id="ul" @mouseleave="onLeave2">
            <li v-for="(item,index) of contrastList" :key="index">
                <span
                :class="item.colActive?'colActive':''"
                @mouseenter="onEnter(item,index)"
                @mouseleave="onLeave(item,index)"
                 :style="{color:item.color}"> {{item.name}} </span>
                 <div v-show="item.colActive" class="contentBox" :style="{left: tipx +'px',top: tipy +'px'}" v-bind:class="{ active: isActive }">
                         <div class="triangle">
                         </div>
                         <!-- <div @click="close" style="width: 20px;color:white;background-color: rgba(0,0,0,0);position: absolute;right: 0;z-index: 200!important; ">
                             <icon name="guanbi"></icon>
                         </div> -->
                         <div class="div1">
                             <img src="../../images/fengjiback.png"/>
                             <p>{{ ruleForm.turbine_name }}</p>
                         </div>
                         <div class="hang" style="margin-top: 20px;">
                             <em class="key" :span="14">机型：</em>
                             <em class="value" :span="10">{{ ruleForm.turbine_type }}</em>
                         </div>
                         <div class="hang">
                             <em class="key" :span="14">轮毂高度：</em>
                             <em class="value" :span="10">{{ ruleForm.height }}　m</em>
                         </div>
                         <div class="hang" >
                             <em class="key" :span="14">尾流后风速：</em>
                             <em class="value" :span="10">{{ ruleForm.waked_speed }}　m/s</em>
                         </div>
                         <div class="hang">
                             <em class="key" :span="14">尾流后发电量：</em>
                             <em class="value" :span="10">{{ ruleForm.array_yield }}　Mwh/year</em>
                         </div>
                         <div class="hang">
                             <em class="key" :span="14">等效小时数：</em>
                             <em class="value" :span="10">{{ ruleForm.equivalent_hours }}　h</em>
                         </div>
                         <div class="hang">
                             <em class="key" :span="14">尾流折减：</em>
                             <em class="value" :span="10">{{ ruleForm.speed_discount }}　</em>
                         </div>
                         <div class="hang">
                             <em class="key" :span="14">湍流值：</em>
                             <em class="value" :span="10">{{ ruleForm.representative_wake_added }}　</em>
                         </div>
                         <div v-show="!isActive" class="hang">
                             <em class="key" :span="14">投影坐标X：</em>
                             <em class="value" :span="10">{{ ruleForm.coordinate_x}}</em>
                         </div>
                         <div v-show="!isActive" class="hang">
                             <em class="key" :span="14">投影坐标Y：</em>
                             <em class="value" :span="10">{{ ruleForm.coordinate_y}}</em>
                         </div>
                         <div v-show="!isActive" class="hang">
                             <em class="key" :span="14">海拔：</em>
                             <em class="value" :span="10">{{ ruleForm.altitude }}　m</em>
                         </div>
                         <div v-show="!isActive" class="hang">
                             <em class="key" :span="14">风速：</em>
                             <em class="value" :span="10">{{ ruleForm.free_speed }}　m/s</em>
                         </div>
                         <div v-show="!isActive" class="hang">
                             <em class="key" :span="14">最近机组距离：</em>
                             <em class="value" :span="10">{{ ruleForm.distance_to_nearest_turbine }}　m</em>
                         </div>
                         <div v-show="!isActive" class="hang">
                             <em class="key" :span="14">最近机组编号：</em>
                             <em class="value" :span="10">{{ ruleForm.nearest_turbine_name }}</em>
                         </div>
                         <div v-show="!isActive" class="hang">
                             <em class="key" :span="14">最大入流角绝对值：</em>
                             <em class="value" :span="10">{{ ruleForm.max_inc }}　度</em>
                         </div>
                         <div v-show="!isActive" class="hang">
                             <em class="key" :span="14">出现最大入流角的风向：</em>
                             <em class="value" :span="10">{{ ruleForm.max_inclination_sector }}　度</em>
                         </div>
                         <div v-show="!isActive" class="hang">
                             <em class="key" :span="14">优化塔筒重量：</em>
                             <em class="value" :span="10">{{ towerWeight() }}</em>
                         </div>
                         <!--<div class="hang">-->
                             <!--<em class="key" :span="14">全风向15m/s特征湍流强度：</em>-->
                             <!--<em class="value" :span="10">{{ ruleForm.t_i_15 }}</em>-->
                         <!--</div>-->
                         <div @click="isActive = !isActive" class="collapse">{{(isActive)?'更多...':'收起'}}</div>
                 </div>
            </li>
            
  
        </ul>
    </div>
</template>
<script>
    import util from '@/libs/util';
    export default{
        name:"contrast-move-tip",
        props:["contrastMoveList"],
        data () {
            return{
                isShow:false,
                clientX:0,
                clientY:0,
                ruleForm:{},
                tipx: 50,
                tipy: -50,
                isActive: true,
                colActive: false,
                contrastList:[]
            }
        },
        watch: {
            contrastMoveList:function(val){
                if(val && val.turbineInfo.length>0){
                    // console.log(val)
                    this.contrastList = val.turbineInfo;
                    this.clientX = val.pos.x + 2.5;
                    this.clientY = val.pos.y - 8;
                    this.isShow = true;
                }else{
                    this.isShow = false;
                }
            },
            // "$store.state.app.hoverProjectInfo":function(val){
            //     // console.log(val.clientX)
            //     this.clientX = val.clientX + 2.5;
            //     this.clientY = val.clientY - 8;
            // }
        },
        methods: {
            onEnter(item ,index){
                item.colActive = true;
                this.tipy = 20*(index)-50;
                util.ajax.get('/output_pg/' + item.id, {}).then((res) => {
                    let retData = res.data;
                    // console.log(retData)
                    this.ruleForm = retData.data;      
                }).catch((/* err */) => {
                    this.$message.error('取得风机发电量详情数据失败！');
                });
            },
            onLeave(item){
                item.colActive = false;
                this.isActive = true;
            },
            onLeave2 () {
                this.isActive = true;
                this.ruleForm = {};
            },
            towerWeight () {
                if ( this.ruleForm.tower_weight ) {
                    return this.ruleForm.tower_weight + '　t';
                } else {
                    return '';
                }
            }
        }
    }
</script>
<style lang="less" scoped>
.contrast-move-tip{
    position: absolute;
    z-index: 9999;
    width: 100px;
    /* background:rgba(21,38,79,0.3); */
    /* border-radius: 4px; */
    &>ul{
        position: relative;
        color: #fff;
        font-size:13px;
        margin: 0;
        padding: 0;
        &>li{
            line-height: 20px;
            cursor: pointer;
        }
    }
}
.colActive{
    font-weight: bold;
}
.collapse{
    position: absolute;
    bottom: 14px;
    right: 14px;
    color: #E1E1E1;
    font-size: 12px;
    cursor: pointer;
}
.active{
    height: 200px!important;
}
.contentBox {
    position: absolute;
    height: 392px;
    width: 340px;
    z-index: 1000;
    background-color: rgba(21,38,79,0.6);
    border:1px solid rgba(51,200,111,1);
    border-radius: 15px;
    .triangle {
        &:before{
            box-sizing: content-box;
            width: 0px;
            height: 0px;
            position: absolute;
            top: 43px;
            left: -24px;
            padding: 0;
            border-bottom: 12px solid transparent;
            border-top: 12px solid transparent;
            border-left: 12px solid transparent;
            border-right: 12px solid rgb(70, 84, 91);
            display: block;
            content: '';
            z-index: 1002;
        }
        &:after{
            box-sizing: content-box;
            width: 0px;
            height: 0px;
            position: absolute;
            top: 42px;
            left: -26px;
            padding: 0;
            border-bottom: 13px solid transparent;
            border-top: 13px solid transparent;
            border-left: 13px solid transparent;
            border-right: 13px solid rgba(51,200,111,0.6);
            display: block;
            content: '';
            z-index: 10;
        }
    }
    .div1{
        width: 174px;
        height: 174px;
        position: absolute;
        right: 0;
        z-index: 1;
        img{
            width: 212px;
            margin-left: 0px;
            margin-top: -38px;
        }
        p{
            margin: 0;
            font-size: 30px;
            color: #FFFFFF;
            width: 100px;
            margin-left: 57px;
            margin-top: -130px;
            text-align: center;
        }
    }
    .hang{
        width: 94%;
        height: 12px;
        line-height: 12px;
        font-size: 12px;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 21px;
        .key {
            color: #E1E1E1;
            margin: 0;
            font-style: inherit;
        }
        .value {
            color: #33C86F;
            margin: 0;
            font-style: inherit;
        }
    }

}
</style>