<style lang="less" scoped>
    @import "project-tooltip.less";
    .header2 /deep/ .el-select{
        width: 100%;
        height: 30px;
        background: rgba(255,255,255,0);
        color: #000;
    }
    .header2 /deep/ .el-input__inner{
        height: 30px;
        border: none;
        background: rgba(255,255,255,0);
    }
    .box /deep/ .el-input__inner,.box /deep/ .el-dialog__wrapper .el-textarea__inner,.el-input__inner, .el-dialog__wrapper .el-textarea__inner{
        color: #000 !important;
        padding-left: 42px;
    }
    /deep/ .el-input__icon{
        line-height: 0px !important;
    }
    .box /deep/ .el-input__inner{
        width: 225px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .gf-popper2{
        width: 270px;
        background: rgba(3,32,62,0.5);
        .popper__arrow {
            opacity: 0;
        }
        .el-select-dropdown__item.hover{
            background: rgba(51,200,111,0.3);
            color: #fff;
        }
        .el-select-dropdown__item:hover {
            background: rgba(51,200,111,0.3);
            color: #fff;
        }
        .el-select-dropdown__item.selected {
            background: rgba(51,200,111,0.3);
        }
        .el-select-dropdown__item {
            font-size: 14px;
            padding: 0 40px;
            color: #D4EFF6;
            height: 20px;
            line-height: 20px;
        }
    }
    .tooltip /deep/ .el-input__suffix{
        right: 50px;
        margin-top: 2px;
    }
    .tooltip /deep/ .el-select__caret{
        color: #000 !important;
    }
    /* 第三版 project-tooltip.less的.tooltip的height没高度 */
    .box3{
        width: 180px;
        box-sizing: border-box;
        background: rgba(51, 200, 111, 0.6);
        border-radius: 4px;
        /* border: 1px solid #D4EFF6; */
        color: #D4EFF6;
        &>p{
            width: 180px;
            box-sizing: border-box;
            padding: 0 20px;
            margin: 0;
            width: 100%;
            height: 30px;
            line-height:30px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            position: relative;
            cursor: pointer;
            font-size: 14px;
        }
        /* &>p:nth-of-type(1){
            background: rgba(0,0,0,0.2);
            color: #fff;
            font-weight: 600;
        } */
    }
    .activeCol{
        background: rgba(0,0,0,0.2);
        color: #fff;
        font-weight: 600;
    }
    .detailsTip{
        position: absolute;
        top: 0;
        /* left: 165px; */
        /* left: -275px; */
        z-index: 1;
        width: 270px;
    }
    .assessbox .asslabel{
        /* padding-right: 10px; */
        width: 73px;
    }
    .assessbox .asslabel2{
        /* padding-right: 10px; */
        width: 125px;
    }
    .assessbox .beizhu{
        border:1px solid rgba(7,234,99,0.5);
        background:rgba(0,0,0,0.2);
        width: 100%;
        padding: 8px 10px;
        margin-top: 5px;
    }
    .tooltip{
        position: absolute;
        z-index: 9999;
        /* left: 50%;
        top: 50%; */
    }
    .body2{
        padding: 8px 10px !important;
    }
    
    .text-jx{
        display: inline-block;
    }
    .text-list{
        display: block;
    }
</style>
<template>
    <!-- 后评估模式 -->
    <div v-show="visbile" class="tooltip" :style="{left:pos.x+10+'px',top:pos.y-25+'px'}">
        <div class="box assessbox" v-for="(item,index) of projectsTip" :key="index">
            <div class="header2" @click="goProject(item)">
                <div>
                    <icon name="multilayer" class="icon1"></icon>
                </div>
                <p class="title title2" 
                @mouseenter="isShowTip=true" @mouseleave="isShowTip=false">
                    {{item.name}}
                </p>
                
                <div class="labelTipbox" v-if="isShowTip" >
                    <div class="mytip">{{item.name}}</div>
                </div>
                
            </div>
            <div class="body body2">
                <ul>
                    <li>
                        <span class="asslabel">地点：</span>
                        <span class="text">{{item.address}}</span>
                    </li>
                    <li>
                        <span class="asslabel">并网时间：</span>
                        <span class="text">{{item.time1}}</span>
                    </li>
                    <li>
                        <span class="asslabel">容量：</span>
                        <span class="text">{{item.cp}}</span>
                    </li>
                    <li>
                        <span class="asslabel">机型：</span>
                        <span class="text text-jx">
                            <span class="text-list" v-for="(item1,index1) of item.jx" :key="index1">{{item1}}</span>
                        </span>
                    </li>
                    <li>
                        <span class="asslabel">塔架高度：</span>
                        <span class="text">{{item.height}}</span>
                    </li>
                    <li>
                        <span class="asslabel">地形地貌：</span>
                        <span class="text">{{item.terrain}}</span>
                    </li>
                    <li>
                        <span class="asslabel">代表年风速：</span>
                        <span class="text">{{item.speed}}</span>
                    </li>
                    <li>
                        <span class="asslabel">空气密度：</span>
                        <span class="text">{{item.air}}</span>
                    </li>
                    <li>
                        <span class="asslabel">湍流：</span>
                        <span class="text">{{item.i15}}</span>
                    </li>
                    <li>
                        <span class="asslabel">切变：</span>
                        <span class="text">{{item.shear}}</span>
                    </li>
                    <li>
                        <span class="asslabel asslabel2">五十年一遇最大风速：</span>
                        <span class="text">{{item.v50max}}</span>
                    </li>
                    
                </ul>
            </div>
        </div>
    </div>
        <!-- 后评估以上 -->
</template>
<script>
    export default{
        name:"assessProjectTip",
        props:{
            pos:{
                type:Object,
                default:{
                    x:0,
                    y:0
                }
            },
            projectsTip:{
                default:[]
            }
        },
        watch: {
            projectsTip:function(val){
                if(val.length>0){
                    this.visbile = true;
                }else{
                    this.visbile = false;
                }
            }
        },
        data(){
            return{
                isShowTip:false,
                visbile: false
            }
        },
        methods: {
            goProject(item){
                this.$emit("projectTipClick",item ,"earth");
            }
        },
    }
</script>
