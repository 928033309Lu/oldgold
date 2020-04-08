<template>
    <div class="drawBox" v-show="activeCeliang" id="draw-timing">
        <div class="drawtop">
               <h2 @click="toggleMeasuring" >
                    <icon name="celiang"></icon>
                </h2>
            
           
            <!--点-->
            <h2 class="measuring-kongjianjuliceliang" v-bind:class="{active: isActiveArr[0]}" @click="onMeasuringClick('dian', 0)">
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="点" placement="top" :hide-after="3000" :enterable="false" :visible-arrow="false">
                    <i class="iconfont icon-dingwei"></i>
                </el-tooltip>
            </h2>
            <!--折线-->
            <h2 class="measuring-changduceliang" v-bind:class="{active: isActiveArr[1]}" @click="onMeasuringClick('zhexian', 1)">
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="折线" placement="top" :hide-after="3000" :enterable="false" :visible-arrow="false">
                    <i class="iconfont icon-weibiaoti2" ></i>
                </el-tooltip>
            </h2>
            <!--方形-->
            <h2 class="measuring-gaodu" v-bind:class="{active: isActiveArr[2]}" @click="onMeasuringClick('fangxing', 2)">
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="方形" placement="top" :hide-after="3000" :enterable="false" :visible-arrow="false">
                    <i class="iconfont icon-duobianxing"></i>
                </el-tooltip>
            </h2>
            <!--箭头-->
            <h2 class="measuring-jiantou" style="font-size: 28px;" v-bind:class="{active: isActiveArr[3]}" @click="onMeasuringClick('jiantou', 3)">
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="箭头" placement="top" :hide-after="3000" :enterable="false" :visible-arrow="false">
                    <i class="iconfont icon-arrow-down-thick"></i>
                </el-tooltip>
            </h2>
            <!--橡皮擦-->
            <h2 class="measuring-xiangpica" v-bind:class="{active: isActiveArr[4]}" @click="onMeasuringClick('clearMeasure', 4)">
                <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="清除" placement="top" :hide-after="3000" :enterable="false" :visible-arrow="false">
                    <icon class="xiangpica" name="xiangpica"></icon>
                </el-tooltip>
            </h2>
            <!--右上角关闭-->
            <div class="measuring-close" @click="toggleMeasuring">
                <icon name="guanbi"></icon>
            </div>
        </div>
        <div class="dianbox-bottom" v-show="visiblebottom">
            <div> 图片</div>
            <div @click="onChangeTupian('dian1.png',0)" :class="{active3: isActiveTuArr[0]}">
                <img src="../../../static/schemecompare/dian1.png" alt="" />
            </div>
            <div @click="onChangeTupian('dian2.png',1)" :class="{active3: isActiveTuArr[1]}">
                <img src="../../../static/schemecompare/dian2.png" alt="" />
            </div>
            <div @click="onChangeTupian('dian3.png',2)" :class="{active3: isActiveTuArr[2]}">
                <img src="../../../static/schemecompare/dian3.png" alt="" />
            </div>
            <div @click="onChangeTupian('dian4.png',3)" :class="{active3: isActiveTuArr[3]}">
                <img src="../../../static/schemecompare/dian4.png" alt="" />
            </div>
        </div>
        <div class="drawbottom" v-show="!visiblebottom">
            <div> 颜色</div>
            <div @click="onChangeColor('#FF0000' ,0)" class="red" :class="{active2: isColActiveArr[0]}"></div>
            <div @click="onChangeColor('#FF00FF' ,1)" class="purpel" :class="{active2: isColActiveArr[1]}"></div>
            <div @click="onChangeColor('#FFFF00' ,2)" class="yellow" :class="{active2: isColActiveArr[2]}"></div>
            <div @click="onChangeColor('#00FFFF' ,3)" class="blue" :class="{active2: isColActiveArr[3]}"></div>
            <div @click="onChangeColor('#00FF00' ,4)" class="green" :class="{active2: isColActiveArr[4]}"></div>
        </div>
        <div class="bottom" v-show="!visiblebottom">
            <span class="bottom-name">透明度</span>
            <el-slider
            @change="sliderChange"
                v-model="value"
                :show-input-controls="false"
                input-size="mini"
                show-input>
            </el-slider>
            <span class="bottom-danwei">%</span>
        </div>
    </div>
</template>
<script>
    export default{
        name:"draw-timing",
        data (){
            return{
                cunObj:{
                    itemType:null,
                    urlType:null,
                    colorType:null,
                    opacity: 1
                },
                visiblebottom:true,
                defaultOnce1:false,
                defaultOnce2:false,
                activeCeliang: false,
                isActiveArr: [false, false, false, false, false],
                isColActiveArr: [false, false, false, false],
                isActiveTuArr: [true, false, false, false],
                value:100,
                typeObj: {
                    itemType:null,
                    colorType:null,
                    opacity: 1
                }
            }
        },
        watch: {
            typeObj:{
                deep:true,//深度监听
                handler(val){
                    if(this.typeObj.itemType && this.typeObj.colorType && this.typeObj.opacity){
                        switch (this.typeObj.itemType){
                           
                            //折线
                            case "zhexian":
                                this.$emit('drawSelected', this.typeObj.itemType , this.typeObj);
                            break;
                            //方形
                            case "fangxing":
                                this.$emit('drawSelected', this.typeObj.itemType , this.typeObj);
                            break;
                            //箭头
                            case "jiantou":
                                this.$emit('drawSelected', this.typeObj.itemType , this.typeObj);
                            break;
                           
                        }
                    }
                    if(this.typeObj.itemType && this.typeObj.urlType && this.typeObj.opacity){
                        switch (this.typeObj.itemType){
                            //点
                            case "dian":
                                // console.log(this.typeObj)
                                this.$emit('drawSelected', this.typeObj.itemType , this.typeObj);
                            break;
                        }
                    }
                }
            },
            activeCeliang:function(val){
                if(val){
                    this.defaultOnce1 = true;
                    this.defaultOnce2 = true;
                }
            }
        },
        methods: {
            defaultInfo(){
                this.isActiveArr = [false, false, false, false, false];
                // this.isColActiveArr = [false, false, false, false];
                // this.isActiveTuArr = [false, false, false, false];
                this.value = this.cunObj.opacity*100;
                // this.typeObj =  {
                //     itemType:null,
                //     urlType:null,
                //     colorType:null,
                //     opacity: 1
                // }
                this.typeObj =  {
                    itemType:null,
                    urlType:this.cunObj.urlType,
                    colorType: this.cunObj.colorType,
                    opacity: this.cunObj.opacity
                }
            },
            toggleMeasuring () {
                this.activeCeliang = false;

                this.onMeasuringClick('clearMeasure', 4);
                this.$emit("drawTiming",false);
                this.defaultInfo();
                this.$emit("clearDrawPlot");
            },
            onMeasuringClick (itemType, index) {
                if(itemType=="dian" && itemType!=="clearMeasure"){
                    this.visiblebottom = true;
                }else{
                    this.visiblebottom = false;
                }
                for (let i in this.isActiveArr) {
                    this.isActiveArr[i] = false;
                }
                this.isActiveArr.splice(index, 1, true);
                // console.log(this.typeObj)
                this.typeObj.itemType = itemType;
                //设置第一次点击默认
                if(this.defaultOnce1){
                    if(itemType == "dian"){
                        this.defaultOnce1 = false;
                        this.typeObj.urlType = "static/schemecompare/dian1.png";
                        this.isActiveTuArr = [true, false, false, false];
                    }
                }
                if(this.defaultOnce2){
                    if(itemType != "dian"){
                        this.defaultOnce2 = false;
                        this.typeObj.colorType = "#FF0000";
                        this.isColActiveArr = [true, false, false, false];
                    }
                }
                //存储状态
                this.cunObj = this.typeObj;
                //橡皮檫
                if (index === 4){
                    this.defaultInfo();
                    this.$emit("clearDrawPlot");
                }
            },
            //选中点用的//选择图片
            onChangeTupian(typeTupian ,index){
                for (let i in this.isActiveTuArr) {
                    this.isActiveTuArr[i] = false;
                }
                this.isActiveTuArr.splice(index, 1, true);
                this.typeObj.urlType = "static/schemecompare/"+typeTupian;
                 //存储状态
                 this.cunObj.urlType = this.typeObj.urlType;
            },
            //选择颜色
            onChangeColor(typeCol ,index){
                for (let i in this.isColActiveArr) {
                    this.isColActiveArr[i] = false;
                }
                this.isColActiveArr.splice(index, 1, true);
                this.typeObj.colorType = typeCol;
                //存储状态
                this.cunObj = this.typeObj;
            },
            //选择透明度    
            sliderChange(val){
                this.typeObj.opacity = val/100;
                //存储状态
                // this.cunObj = this.typeObj;
                // console.log(val,this.typeObj.opacity)
            } 
        }
    }
</script>
<style lang="less" scoped>
   .drawBox{
       position: absolute;
       top: 70px;
       left: 50px;
       z-index: 1111;
       width:290px;
        height:130px;
        background:rgba(25,28,54,0.5);
        border-radius:28px;
        color: #F0FCFF;
   }
   .drawtop{
       display: flex;
       justify-content: space-between;
       margin: 0 0 25px 0;
       &>h2{
            padding: 0;
            margin: 0;
            width: 45px;
            height: 45px;
            text-align: center;
            line-height: 45px; 
       }
       &>h2:nth-of-type(1){
            width: 50px;
            height: 50px;
            line-height: 50px; 
            background:rgba(51,200,111,1);
            border-radius: 50%;
       }
   }
.drawBox /deep/ .el-slider__input{
    width: 40px !important;  
    right: 25px;
    top: -8px;
}
.drawBox /deep/ .el-input-number.is-without-controls .el-input__inner{
    background: rgba(25,28,54,0.7) !important;
    padding: 0 !important;
    border: none !important;
    height: 20px !important;
    line-height: 20px;
    font-size: 12px;
}
.drawBox /deep/ .el-slider__runway.show-input{
    margin: 0 0 0 80px !important;
    width: 120px !important;
    top: 6px;
}
.dianbox-bottom{
    display: flex;
    justify-content: space-between;
    padding: 0 60px 0 20px;
    font-size: 13px;
    img{
        width:20px;
        height: 20px;      
        cursor: pointer;
    }
}
.measuring-close{
    width: 25px;
    height: 25px;
    background: rgba(21,38,79,0.5);
    border-radius: 50%;
    text-align: center;
    line-height: 25px;
    cursor: pointer;
    position: relative;
    top: -5px;
}
.measuring-jiantou{
    transform: rotate(-140deg);
    position: relative;
    top: 5px;
}
.xiangpica{
    width: 20px;
    height: 20px;
    cursor: pointer;
}
.drawbottom{
    display: flex;
    justify-content: space-between;
    padding: 0 80px 0 0;
    position: relative;
    top: -5px;
    &>div{
        width:12px;
        height:12px;
        border-radius:50%;
        cursor: pointer;
    }
    &>div:first-child{
        width: 64px;
        height: 20px;
        font-size: 13px;
        text-align: center;
        cursor: none;
    }
}
.bottom{
    position: relative;
    font-size: 13px;
    margin-top: 5px;
    .bottom-name{
        position: absolute;
        left: 20px;
        top : 1px;
    }
    .bottom-danwei{
        position: absolute;
        right: 10px;
        top : 1px;
    }
}
.iconfont{
    cursor: pointer;
}
.active{
    color: #00FF00 !important;
}
.active2{
    border: 1px solid #fff;
}
.active3>img{
    transform: scale(1.4);
}
.red{
    width:13px;
    height:13px;
    background: #FF0000;
}
.purpel{
    width:13px;
    height:13px;
    background: #FF00FF;
}
.yellow{
    width:13px;
    height:13px;
    background: #FFFF00;
}
.blue{
    width:13px;
    height:13px;
    background: #00FFFF;
}
.green{
    width:13px;
    height:13px;
    background: #00FF00;
}
</style>