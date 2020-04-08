<template>
    <el-dialog 
        :close-on-click-modal="false"
        custom-class="addElement"
        width="330px"
        :center="true"
        @close="close"
        :visible.sync="visible">
        <div class="content">
            <div class="title" v-show="eleName != '重命名'">{{eleName}}属性设计{{shezhiOpen?'修改':''}}</div>
            <div class="title" v-show="eleName == '重命名'">文件{{eleName}}</div>
            <ul>
                <li class="nameli">
                    <span class="name">名称:</span>
                    <el-input v-model="newName" :placeholder="eleName+'名称'" autofocus></el-input>
                </li>
                <li class="lineli" v-show="eleName != '文件夹' && eleName != '多边形' && eleName != '图标' && eleName != '重命名'">
                    <span class="name">线宽:</span>
                    <el-select v-model="lineWidth"
                    @change="widthChange"
                    popper-class="gf-popper"
                     placeholder="线宽">
                        <el-option
                          v-for="item in lineWidthOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li class="colorli" v-show="eleName != '文件夹' && eleName != '重命名'  ">
                    <div class="name">颜色:</div>
                    <div class="divcol">
                        <span class="color1" :class="colorArr[0]?'borderSelect':''" @click="changeColor('#00FF00',0)"></span>
                        <span class="color2" :class="colorArr[1]?'borderSelect':''" @click="changeColor('#FFEF00',1)"></span>
                        <span class="color3" :class="colorArr[2]?'borderSelect':''" @click="changeColor('#00FFFF',2)"></span>
                        <span class="color4" :class="colorArr[3]?'borderSelect':''" @click="changeColor('#FF00FF',3)"></span>
                        <span class="color5" :class="colorArr[4]?'borderSelect':''" @click="changeColor('#FF0000',4)"></span>
                        <span class="color6" :class="colorArr[5]?'borderSelect':''" @click="changeColor('#D4EFF6',5)"></span>
                    </div>
                </li>
                <!-- <li class="colorli" v-show="eleName != '文件夹' && eleName != '重命名' && eleName == '图标' ">
                    <div class="name">图片:</div>
                    <div class="divimg">
                        <img :src="imgUrl1" alt="" :class="imgUrlArr[0]?'bigimg':''" @click="changeImg(imgUrl1,0)" />
                        <img :src="imgUrl2" alt="" :class="imgUrlArr[1]?'bigimg':''" @click="changeImg(imgUrl2,1)" />
                        <img :src="imgUrl3" alt="" :class="imgUrlArr[2]?'bigimg':''" @click="changeImg(imgUrl3,2)" />
                        <img :src="imgUrl4" alt="" :class="imgUrlArr[3]?'bigimg':''" @click="changeImg(imgUrl4,3)" />
                    </div>
                </li> -->
                <li class="sliderli" v-show="eleName != '文件夹' && eleName != '重命名' ">
                    <span class="name">透明度:</span>
                    <el-slider
                    @change="sliderChange"
                        v-model="value"
                        :show-input-controls="false"
                        input-size="mini"
                        show-input>
                    </el-slider>
                    <span class="bottom-danwei">%</span>
                </li>
            </ul>
            
            <div class="btnBox">
                <el-button v-if="!shezhiOpen" class="gf-button addBtn" @click="onFavoritesBtn">确定</el-button>
                <el-button v-if="shezhiOpen" class="gf-button addBtn" @click="onGaiBtn">确定修改</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>

import util from '@/libs/util';
    export default{
        name:"addkmz-element",
        props:{
            elementName:{
                type: String
            },
            shezhiOpen:{
                type: Boolean,
                default: false
            }
        },
        data (){
            return{
                imgUrl1: util.S3Path + 'kmz&kml/images/dian1.png',
                imgUrl2: util.S3Path + 'kmz&kml/images/dian2.png',
                imgUrl3: util.S3Path + 'kmz&kml/images/dian3.png',
                imgUrl4: util.S3Path + 'kmz&kml/images/dian4.png',
                imgUrlArr:[false,false,false,false],
                checkUrl:"",
                colorArr:[false,false,false,false,false,false],
                visible: false,
                eleName: null,
                eleType: null,
                eleIcon: null,
                newName: null,
                lineWidth: 1,
                lineWidthOptions: [
                    {
                    value: 1,
                    label: '1像素'
                    }, {
                    value: 2,
                    label: '2像素'
                    }, {
                    value: 3,
                    label: '3像素'
                    }
                ],
                value: 100,
                treeData:[], //tree数组
                objData:null,  //当前元素
                shezhiData:null,  //当前元素修改
                obj: {
                    opacity: 1
                }  //新增元素
            }
        },
        watch: {
            elementName:function(val){
                switch (val) {
                    //文件夹0
                    case 'genwenjianjia':
                        this.eleName = "文件夹";
                        this.eleType = 0;
                        this.eleIcon = null;
                    break;
                    case 'wenjianjia':
                        this.eleName = "文件夹";
                        this.eleType = 0;
                        this.eleIcon = "iconfont icon-wenjianjia1";
                    break;
                    //图标1
                    case 'tubiao':
                        this.eleName = "图标";
                        this.eleType = 1;
                        this.eleIcon = "iconfont icon-dingwei";
                    break;
                    //折线2
                    case 'zhexian':
                        this.eleName = "折线";
                        this.eleType = 2;
                        this.eleIcon = "iconfont icon-weibiaoti2";
                    break;
                    //多边形3
                    case 'duobianxing':
                        this.eleName = "多边形";
                        this.eleType = 3;
                        this.eleIcon = "iconfont icon-duobianxing";
                    break;
                    //重命名
                    case 'checkName':
                        this.eleName = "重命名";
                    break;
                }
            }
        },
        mounted() {
            
        },
        methods: {
            show(){
                this.visible = true;
                // console.log(this.$store.state.favorites.treeData);
                // console.log(this.$store.state.favorites.objData,"add获取");
                // console.log(this.$store.state.favorites.shezhiData,"设置获取");
                this.treeData = this.$store.state.favorites.treeData;
                this.objData = this.$store.state.favorites.objData;
                this.shezhiData = this.$store.state.favorites.shezhiData;
                //点线面要素预设值
                if(this.objData && this.objData.layerId ){
                    this.obj.pid = this.objData.id;
                    this.obj.layerId = this.objData.layerId;
                }
                if(this.treeData && this.treeData.layerId){
                    this.obj.layerId = this.treeData.layerId;
                }
                this.obj.opacity = 1;
                this.obj.width = 1;
                this.obj.children = null;
                this.obj.kmlData = null;
                
                // console.log(this.obj,"000000",this.objData);
            },
            close(){
                this.visible = false;
                this.init();
                this.initColorArr();
            },
            init(){
                this.objData = {};
                this.$store.commit('objData',null); //当前元素
                this.$store.commit('shezhiData',null); //当前元素修改
                this.$parent.elementName = null;
                this.eleName = null;
                this.eleType = null;
                this.eleIcon = null;
                this.newName = null;
                this.lineWidth = 1;
                this.checkUrl = "";
                
                setTimeout(()=>{
                    
                    this.$store.commit('addObjData',null);
                    this.$store.commit('addYaosuDataWenjian',null);
                },1000)
            },
            initColorArr(){
                this.colorArr = [false,false,false,false,false,false];
                this.imgUrlArr = [false,false,false,false];
            },
            // #00FF00 #FFEF00 #00FFFF #FF00FF #FF0000 #D4EFF6
            //图片
            changeImg(imgUrl,num){
                
                this.imgUrlArr[num] = true;
                this.checkUrl = imgUrl;
            },
            //线宽
            widthChange(){
                // console.log(this.lineWidth);
                this.obj.width = this.lineWidth;
            },
            //选择颜色
            changeColor(type,num){
                this.obj.color = type;
                this.initColorArr();
                this.colorArr[num] = true;
            },
            //选择透明度
            sliderChange(){
                // console.log(this.value);
                this.obj.opacity = this.value/100;
            },
            //确定修改
            onGaiBtn(){
                if(!this.newName){
                    this.$message.error("请输入名称！");
                    return;
                }
                if(this.colorArr.indexOf(true)==-1  && this.elementName !="genwenjianjia" && this.elementName !="wenjianjia" && this.elementName !="checkName"){
                    this.$message.error("请选择颜色！");
                    return;
                }

                // console.log(this.shezhiData,"00000");
                switch (this.elementName){
                    
                    case "tubiao":
                        this.obj.name = this.newName;
                        // this.obj.color
                        // this.obj.opacity    
                        this.$emit("shezhiKmlLayer","tubiao",this.shezhiData,this.obj);
                    break;
                    case "zhexian":
                        this.obj.name = this.newName;
                        // this.obj.color
                        // this.obj.opacity   
                        this.$emit("shezhiKmlLayer","zhexian",this.shezhiData,this.obj);
                    break;
                    case "duobianxing":                    
                        this.obj.name = this.newName;
                        // this.obj.color
                        // this.obj.opacity           
                        this.$emit("shezhiKmlLayer","duobianxing",this.shezhiData,this.obj);
                    break;
                }
                this.close();
            },
            //确定
            onFavoritesBtn(){
                if(!this.newName){
                    this.$message.error("请输入名称！");
                    return;
                }
                if(this.colorArr.indexOf(true)==-1  && this.elementName !="genwenjianjia" && this.elementName !="wenjianjia" && this.elementName !="checkName"){
                    this.$message.error("请选择颜色！");
                    return;
                }
                // if(this.elementName =="tubiao" && !this.checkUrl){
                //     this.$message.error("请选择图片！");
                //     return;
                // }
                
                // console.log(this.elementName);
                switch (this.elementName){
                    case "genwenjianjia":
                        this.obj.type = -1;
                        this.obj.children = [];
                        this.obj.fileOnly = true;
                        this.obj.isfile = true;
                        this.obj.name = this.newName;
                        this.obj.name2 = this.newName +".kmz";
                        this.obj.only = true;
                        // console.log(this.obj);
                        this.$emit("addNewKmlLayer","genwenjianjia",this.obj);

                    break;
                    case "wenjianjia":
                        this.obj.children = [];
                        this.obj.type = this.eleType;
                        this.obj.name = this.newName;
                        this.obj.icon = this.eleIcon;                  
                        // console.log(this.obj);
                        this.$emit("addNewKmlLayer","wenjianjia",this.obj);

                    break;
                    case "tubiao":
                        this.obj.type = this.eleType;
                        this.obj.name = this.newName;
                        this.obj.icon = this.eleIcon;
                        this.obj.id = Math.floor(Math.random()*10000000000);
                        // this.obj.imgUrl = this.checkUrl;
                        this.obj.imgUrl = util.S3Path + 'kmz&kml/images/kml/shapes/flag.png';
                        this.obj.scale = 0.5;
                        // this.obj.color
                        // this.obj.opacity
                        this.$emit("addNewKmlLayer","tubiao",this.obj);

                    break;
                    case "zhexian":

                        this.obj.type = this.eleType;
                        this.obj.name = this.newName;
                        this.obj.icon = this.eleIcon;
                        this.obj.id = Math.floor(Math.random()*10000000000);
                        // this.obj.opacity
                        // this.obj.color             
                        this.$emit("addNewKmlLayer","zhexian",this.obj);

                    break;
                    case "duobianxing":                    
                       
                        this.obj.type = this.eleType;
                        this.obj.name = this.newName;
                        this.obj.icon = this.eleIcon;
                        this.obj.id = Math.floor(Math.random()*10000000000);
                        // this.obj.color             
                        // this.obj.opacity             
                        this.$emit("addNewKmlLayer","duobianxing",this.obj);
                        
                    break;
                    case "checkName": 
                        this.$store.commit("checkName", this.newName);
                    break;
                }
                // console.log('确定', this.obj);
                this.close();
            },
            traverse(data) {
                for (var i in data) {
                    if(data[i].id == this.objData.id){
                        data[i].children.push(this.obj);  //成功push
                        // console.log(data[i]);
                        // console.log(this.treeData);
                        this.$store.commit('treeData',this.treeData);
                        this.$emit("setTreeData");
                   }
                   if(data[i].children){
                        this.traverse(data[i].children);
                   }
                }
            }

        }
    }
</script>
<style lang="less" scoped>
    /deep/ .el-dialog__body{
        margin-top: 0 !important;
        padding-bottom: 20px !important;
        padding-right: 45px !important;
    }
    /deep/ .el-input__icon{
        line-height: 0 !important;
    }
    /deep/ .el-dialog__header{
        height: 20px !important;
    }
    /deep/ .el-dialog__close{
        position: relative;
        top: -1px;
        right: -13px;
    }
    /deep/ .el-slider__input{
        width: 30px !important;  
        right: -60px;
        top: -6px;
        background:rgba(25,28,54,1);
    }
    /deep/ .el-slider{
        position: relative;
        top: 6px;
    }
    /deep/ .el-input-number--mini{
        line-height: 20px !important;
    }
    /deep/ .el-input-number.is-without-controls .el-input__inner{
        background: rgba(25,28,54,0.7) !important;
        padding: 0 !important;
        border: none !important;
        height: 20px !important;
        line-height: 20px;
        font-size: 12px;
    }
    /deep/ .el-slider__runway.show-input{
        margin: 0 !important;
        width: 115px !important;
        top: 6px;
    }
    /deep/  input{
        opacity: 1 !important;
        color: #1BB656 !important;
        border:1px solid rgba(159,164,162,0.5) !important;
    }
    /deep/ .el-dialog__wrapper .el-dialog .el-dialog__body input{
        color: #1BB656 !important;
    }
    
    .addElement{
        position: relative;
    }
    .content{
        color:rgba(212,239,246,1);
        ul{
            margin: 0;
            padding: 0;
            li{
                display: flex;
                .name{
                    display: block;
                    width: 60px;
                    height: 30px;
                    line-height:30px;
                    display: flex;
                    justify-content: space-between;
                }
            }
            .lineli{
                display: flex;
                margin-top: 15px;
                /deep/ .el-select{
                    width: 253px !important;
                }
            }
            .colorli{
                display: flex;
                margin-top: 15px;
                span{
                    display: inline-block;
                    width:15px;
                    height:15px;
                    border-radius:2px;
                    cursor: pointer;
                    margin-right: 10px; 
                }
                .divcol{
                    line-height: 32px;
                    
                }
                .divimg{
                    display: flex;
                    align-items: center;
                    &>img{
                        display: block;
                        width: 20px;
                        height: 20px;
                        margin-right: 10px;
                        cursor: pointer;
                    }
                    .bigimg{
                        transform: scale(1.5);
                    }
                }
                .color1{
                    background: #00FF00;
                }
                .color2{
                    background: #FFEF00;
                }
                .color3{
                    background: #00FFFF;
                }
                .color4{
                    background: #FF00FF;
                }
                .color5{
                    background: #FF0000;
                }
                .color6{
                    background: #D4EFF6;
                }
                .borderSelect{
                    border: 1px solid #fff;
                }
            }
            .sliderli{
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
                    top : 6px;
                }
            }
        }
        .title{
            position: absolute;
            top: 10px;
            left: 10px;
            font-size:16px;
        }
    }
    .btnBox{
        display: flex;
        justify-content: center;
        padding-top: 10px;
    }
    .addBtn{
        background: rgba(51, 200, 111, 0.5);
        border: none;
        width: 100px;
        height: 35px;
        line-height: 35px;
        padding: 0;
        position: relative;
        left: 10px;
    }
    .gf-button.el-button--default:hover{
        background: rgba(51, 200, 111, 0.8) !important;
        color: #D4EFF6;
    }
</style>