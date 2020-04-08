<template>
    <div class="assess-container" :class="minActive?'minActive':''">
        <!-- //测量工具 -->
        <div class="celiangBox">
            <p>
                <el-tooltip class="el-tooltip-item"  effect="light" popper-class="menu-tooltip-popper" content="量测" placement="top" :hide-after="3000" :enterable="false" >
                    <span :class="numberShow == 1? 'celiangActive' : '' " @click="onClick('celiang')"><icon name="celiang" style="width:17px;height:17px;"></icon></span>
                </el-tooltip>
                <el-tooltip class="el-tooltip-item"  effect="light" popper-class="menu-tooltip-popper" content="即时标绘" placement="top":hide-after="3000" :enterable="false" >
                    <span :class="numberShow == 2? 'celiangActive' : '' " @click="onClick('huizhi')"><icon name="huizhi" style="width:17px;height:17px;"></icon></span>
                </el-tooltip>
            </p>
            <!-- 测量 -->
            <div v-show="numberShow == 1 && celiangShow" class="measuring-tool" >
                <!--空间距离-->
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="三角测量" placement="top" :hide-after="3000" :enterable="false" >
                    <span  v-bind:class="{active: isActiveArr[0]}" @click="onMeasuringClick('measureHeightComplex', 0)">
                        <icon name="kongjianjuliceliang"></icon>
                    </span>
                </el-tooltip>
                <!--长度-->
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="长度" placement="top" :hide-after="3000" :enterable="false" >
                    <span style="position: relative;top:2px;" v-bind:class="{active: isActiveArr[1]}" @click="onMeasuringClick('measureLength', 1)">
                        <i class="iconfont icon-icon_changdu_px" style="font-size: 28px;" ></i>
                    </span>
                </el-tooltip>
                <!--高度-->
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="高度" placement="top" :hide-after="3000" :enterable="false" >
                    <span  v-bind:class="{active: isActiveArr[2]}" @click="onMeasuringClick('measureHeightSample', 2)">
                        <icon name="gaodu"></icon>
                    </span>
                </el-tooltip>
                <!--面积测量-->
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="面积" placement="top" :hide-after="3000" :enterable="false" >
                    <span style="font-size: 28px;" v-bind:class="{active: isActiveArr[3]}" @click="onMeasuringClick('measureArea', 3)">
                        <icon name="mianjiceliang"></icon>
                    </span>
                </el-tooltip>
                <!--剖面分析-->
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="剖面分析" placement="top" :hide-after="3000" :enterable="false" >
                    <span  style="position: relative;top:-2px;font-size: 28px;" v-bind:class="{active: isActiveArr[5]}" @click="onMeasuringClick('poumian', 5)">
                        <i class="iconfont icon--"></i>
                    </span>
                </el-tooltip>
                <!--橡皮擦-->
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="清除" placement="top" :hide-after="3000" :enterable="false" >
                    <span  v-bind:class="{active: isActiveArr[4]}" @click="onMeasuringClick('clearMeasure', 4)">
                        <icon name="xiangpica"></icon>
                    </span>
                </el-tooltip>
            
            </div>
            <!-- 即时绘制 -->
            <draw-timing v-show="numberShow == 2 && huizhiShow" ref="drawTimingFav"
            @clearDrawPlot="onClearDrawPlot" @drawSelected="onDrawSelected"
            ></draw-timing>
        </div>

        <ul class="tabBox">
            <!-- <router-link :to="{name:'home',params:{goto:'home'}}" tag="li">
                <i class="iconfont icon-02"></i>热点收藏</router-link> -->
            <li @click.stop="onGohome"><i class="iconfont icon-02"></i>热点收藏</li>
            <li @click.stop="flyHome"><icon name="tubiaozhexiantu" style="width: 16px;height:16px;"></icon>后评估案例</li>
            <li @click.stop="openLayer"><img src="../../images/layer.png" alt="" style="width: 20px;vertical-align: middle;position: relative;top:-2px;"/>图层</li>
        </ul>
        <div style="display: flex;" class="right-top-box">
            <div class="minIcon" @click="onMin(true)">——</div>
            <div @click="closeAllTab" style="height: 30px;width: 30px;z-index: 3">
                <icon class="header-icon" name="close"></icon>
            </div>
        </div>
        <div v-show="minActive" class="minIconBox" @click="onMin(false)"><icon name="arrow-right-copy"></icon></div>

        <div class="content">
            <p class="header-title">
                <span @click.stop="onOpenAssess" class="sanjiao" :class="isUploaded?'sanjiaoActive':''"><icon name="zuosanjiao-copy" ></icon></span>
                <span @click.stop="flyHome" style="margin-left: 25px;"><i class="iconfont icon-diqiu"></i> 项目列表</span>
            </p>

            <!-- <ul class="listBox" :class="isUploaded?'listBoxActive':''">
                <li @click="onClickPlan(item)" 
                v-for="(item,index) of projects" :key="index"
                :class="bgActive_id == item.properties.MAPKEY ? 'bgActive':''"
                > 
                    <icon name="dizhi" />
                    <span> {{item.properties.NAME}} </span> 
                    <span @click.stop="ondownload(item.properties)" class="xiazai" :style="bgActive_id == item.properties.NAME ?'display:inline-block !important;':''"><i class="iconfont icon-wenjianxiazai"></i></span>
                </li>
            </ul> -->
            <el-tree :data="projects" 
            :class="!isUploaded ? 'tree' : ''"
            :check-strictiy="true"
            :expand-on-click-node="false"
            :check-on-click-node="false"
            :render-after-expand="false"
            @check="onCheck"
            @check-change="treeChange"
            show-checkbox 
            node-key="id" 
            default-expand-all
            accordion
            ref="tree"
            :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data ,store }">
                    <span @click.stop="() => onDingwei(node , data)" class="title">
                        {{node.label}}
                    </span> 
                    <span class="show">
                        <span @click.stop="() => onDingwei(node , data)">
                            <icon name="dizhi" style="width: 17px;height:17px;"/>
                        </span>
                        <span @click.stop="() => onXiazai(node , data)">
                            <i class="iconfont icon-wenjianxiazai" style="font-size: 14px;"></i>
                        </span>
                    </span>
                </span>
            </el-tree>

        </div>


    </div>
</template>
<script>
    import {downloadFile} from '@/libs/function-util';
    import DrawTiming from '../menu/draw-timing-fav.vue';
    export default{
        name:"favorites-assess",
        components: {
            DrawTiming
        },
        props:{
            projects:{
                type: Array,
                default: []
            }
        },
        data () {
            return{
                celiangShow: false,
                huizhiShow: false,
                numberShow: 0,
                isActiveArr: [false, false, false, false, false,false],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                minActive: false,
                isUploaded: false,
                bgActive_id: null
            }
        },
        watch: {
            projects:function(val){
                console.log(val);
                if(val.length>0){
                    this.isUploaded = true;
                    this.$parent.waitingTwoMinute = false;
                }else{
                    this.isUploaded = false;
                }
            }
        },
        methods: {
            //新增测量工具
            onClick(type){
                if(type == "celiang"){
                    this.huizhiShow = false;
                    this.numberShow = 1;
                    this.celiangShow = !this.celiangShow;
                    if(!this.celiangShow){
                        this.numberShow = 0;
                    }
                    this.onClearDrawPlot();
                }else{
                    this.celiangShow = false;
                    this.numberShow = 2;
                    this.huizhiShow = !this.huizhiShow;
                    if(!this.huizhiShow){
                        this.numberShow = 0;
                    }
                    this.onMeasuringClick('clearMeasure', 4);
                }
                this.$refs['drawTimingFav'].activeCeliang = this.huizhiShow;
            },
            onMeasuringClick (itemType, index) {
                for (let i in this.isActiveArr) {
                    this.isActiveArr[i] = false;
                }
                this.isActiveArr.splice(index, 1, true);
                this.$emit('menuSelected', itemType);
                if (index === 4) this.isActiveArr.splice(index, 1, false);
            },
            //绘制
            onClearDrawPlot(){
                this.$emit("clearDrawPlot");
                this.$refs['drawTimingFav'].defaultInfo();
            },
            onDrawSelected(type , options){
                this.$emit('drawSelected', type , options);
            },


            onXiazai(node , data){
                // console.log(node , data);
                console.log(data.properties);
                if(data.properties.PINID){
                    let fileUrl = "http://www.windtrump.com/bgal/"+data.properties.PINID+"/"+data.properties.PINID+".pdf";
                    downloadFile(fileUrl);
                    return;
                }
                if(data.properties.TID){
                    let fileUrl = "http://www.windtrump.com/bgal/"+data.properties.PINID+"/"+data.properties.PINID+".pdf";
                    downloadFile(fileUrl);
                    return;
                }
            },
            ondownload(item){
                // console.log(item.PINID);
                // console.log(item.TID);
                if(item.PINID){
                    let fileUrl = "http://www.windtrump.com/bgal/"+item.PINID+"/"+item.PINID+".pdf";
                    downloadFile(fileUrl);
                    return;
                }
                if(item.TID){
                    let fileUrl = "http://www.windtrump.com/bgal/"+item.PINID+"/"+item.PINID+".pdf";
                    downloadFile(fileUrl);
                    return;
                }
            },
            onMin(isTrue){
                this.minActive = isTrue;
            },
            onGohome(){
                this.$emit("cloceAssess");
                // this.$router.push({name: "home",params:{goto:'home'}});
                 //清空绘制
                this.onMeasuringClick('clearMeasure', 4);
                this.onClearDrawPlot();
            },
            flyHome(){
                this.$emit("flyHome");
                this.bgActive_id = null;
                 //清空绘制
                this.onMeasuringClick('clearMeasure', 4);
                this.onClearDrawPlot();
            },
            openLayer (){
                this.$emit("cloceAssess");
                //清空绘制
                this.onMeasuringClick('clearMeasure', 4);
                this.onClearDrawPlot();

                this.$emit('openLayer')
            },
            closeAllTab (){
                this.onMeasuringClick('clearMeasure', 4);
                this.onClearDrawPlot();
                this.$emit('closeAllTab')
            },
            onOpenAssess () {
                this.isUploaded = !this.isUploaded;
            },
            onClickPlan(item){
                // console.log(item);
                // let id = item.properties.PINID ? item.properties.PINID : item.properties.TID;
                this.bgActive_id = item.properties.MAPKEY;   //用路由方式做的时候用来联动列表变色用的
                //进入项目
                this.$emit('projectClicked',item);
            },
            onDingwei(node , data){
                // console.log(node , data);
                 //进入项目
                 if(data.isSelected){
                    this.$emit('projectClicked',data);
                 }
            },
            onCheck(data , node){
                // console.log(data , node);
                
            },
            treeChange(obj, isSelected, self){
                obj.isSelected = isSelected;
                // console.log(obj, obj.isSelected, self);
                this.$emit("setWindFiledVisible", obj ,obj.isSelected);
                this.onDingwei(null , obj);  
                if(!obj.isSelected){
                    this.$emit("clearReEvalueTurbine");
                }       
            }
        }
    }
</script>
<style lang="less" scoped>
/deep/ .el-tree-node__content:hover{
    background-color: rgba(19, 31, 54,1) !important;
}
/deep/ .el-tree-node:focus>.el-tree-node__content{
    background-color: rgba(10, 10, 10,1) !important;
}
/deep/ .custom-tree-node .show{
    display: none;
}
/deep/ .custom-tree-node:hover .show{
    display: block !important;
}
/deep/ .custom-tree-node{
    width: 100%;
    color: #d4eff6;
    display: flex;
    justify-content: space-between;
    .title{
        padding-left: 10px;
    }
}
/deep/ .tree{
    height: 0 !important;
}
.show{
    position: absolute;
    right: 2px;
    top: 2px;
}
.el-tree{
    height: 75%;
    overflow: auto;
    background:rgba(255, 255, 255,0); 
    color: #d4eff6;
    font-size: 15px; 
    .el-tree-node{
        .el-tree-node__content{
            .el-tree-node__label{
                font-family: MicrosoftYaHei;
                font-weight: 400;
                line-height: 30px;
                font-size: 10px !important;
                color: #d4eff6;
            }
        }
    }
}
.tabBox{
    border: 1px solid rgba(240,252,255,0.3);
    border-left: none;
    border-right: none;
    display: flex;
    color: #d4eff6;
    text-align: center;
    margin: 0;
    padding:  0;
    /* margin-top: 50px; */
    font-size: 15px;
    &>li{
        flex: 1;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
    }
    &>li:nth-of-type(1){
        // border-right: 1px solid rgba(240,252,255,0.3);
        // border-bottom: 1px solid rgba(240,252,255,0.3);     
    }
    &>li:nth-of-type(2){
        color:rgba(51,200,111,1);
        border-left: 1px solid rgba(240,252,255,0.3);
        border-right: 1px solid rgba(240,252,255,0.3);
    }
}
.right-top-box{
    position: absolute;
    right: 0;
    top : 25px;
}
.minIconBox{
    position: relative;
    left: 400px;
    top: 50%;
    width: 30px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 20px;
    margin-top: -50px;
    border-radius: 0 4px 4px 0;
    background: rgba(19, 31, 54, 0.6);
    color: #d4eff6;
    cursor: pointer;
    z-index: 99999;
}
.minIcon{
    width: 25px;
    height: 25px;
    z-index: 99;
    cursor: pointer;
    color: #d4eff6;
    font-size: 11px;
    margin-right: 5px;
}
.header-icon {
  color: rgba(212, 239, 246, 0.8);
  height: 20px;
  line-height: 28px;
  font-size: 28px;
  cursor: pointer;
  font-weight: 900;
}
.header-icon:hover {
  color: #fff;
}
.minIcon:hover{
    color: #fff;
}
.assess-container{
    width: 400px;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    background: rgba(19, 31, 54, 0.6);
    padding: 15px 0;
    color: #d4eff6;
    z-index: 2;
    transition: all 0.5s;
}
.minActive{
    left: -400px !important;
    transition: all 0.5s;
}
.sanjiao{
    color: rgba(255, 255, 255,0.9);
    position: absolute;
    left: 7px;
    transition: all 0.5s;   
}
.sanjiaoActive{
    transform: rotate(90deg);
    transition: all 0.5s;
}
.header-title{
    margin: 15px 0 0 0;
    padding: 0 ;
    cursor: pointer;
}
.xiazai{
    display: none;
    position: absolute;
    right: 30px;
    cursor: pointer;
}
.content{
    color: #d4eff6;
    font-size: 15px;
    height: 100%; 
    .listBox{
        height: 0;
        transition: all 0.5s;
        margin: 0;
        padding: 0;
        overflow: auto;
        li{
            height:30px; 
            line-height: 30px;
            padding-left: 46px;
            position: relative;
            cursor: pointer;
        }
        li:hover{
            background:rgba(25,28,54,1);
        }
        li:hover .xiazai{
            display: inline-block;
        }
    }
    .listBoxActive{
        height: 75%;
        transition: all 0.5s;
    }
    .bgActive{
        color:rgba(51,200,111,1);
        background:rgba(25,28,54,1);
    }
}


.celiangBox{
    margin-top: 50px;
    background:rgba(25,28,54,0.6);
    color: #d4eff6;
    &>p{
        height: 40px;
        line-height: 40px;
        margin: 0;
        padding: 0px 0 0 10px;
        span{
            margin-right: 5px;
            width: 25px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            display: inline-block;
            border:1px solid rgba(199,218,207,1);
            border-radius: 4px;
            cursor: pointer;
            outline: none;
            box-sizing: border-box;
        }
    }
    .measuring-tool{
        height: 40px;
        line-height: 40px;
        padding: 0 0 0 8px;
        span{
            margin-right: 10px;
            width: 25px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            display: inline-block;
            font-size: 22px;
            cursor: pointer;
            outline: none;
        }
    }
}
.celiangActive{
    background:rgba(51,200,111,1) !important;
    border: none !important;
    position: relative;
    top: -1px;
}
.active{
    color:rgba(47,255,47,1) !important;
}
</style>