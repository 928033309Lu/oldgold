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
        padding-right: 10px;
    }
    .assessbox .beizhu{
        border:1px solid rgba(7,234,99,0.5);
        background:rgba(0,0,0,0.2);
        width: 100%;
        padding: 8px 10px;
        margin-top: 5px;
    }
</style>

<template>
    <div ref="tooltip" class="tooltip" :class="classObject" :style="styleObject" :hidden="!visible">
        <!-- <div class="box">
            <div class="arrow right"></div>
            <div class="header">
                <icon name="multilayer"></icon>
                {{project.project_name}}
            </div>
            <div class="body">
                <ul>
                    <li>
                        <span class="label">业主单位：</span>
                        <span class="text">{{project.owner_name}}</span>
                    </li>
                    <li>
                        <span class="label">行政划区：</span>
                        <span class="text">{{project.province}}{{project.city}}{{project.county}}</span>
                    </li>
                    <li>
                        <span class="label">创建时间：</span>
                        <span class="text">{{project.create_time}}</span>
                    </li>
                    <li>
                        <span class="label">核准容量：</span>
                        <span class="text">{{project.design_capacity}}MW</span>
                    </li>
                    <li>
                        <span class="label">备注：</span>
                        <span class="text">{{project.description}}</span>
                    </li>
                </ul>
            </div>
        </div> -->

        <!-- <div class="box">
            <div class="header2">
                <div>
                    <icon name="multilayer" class="icon1"></icon>
                    <span v-show="!isTrue">{{selectedArray.length}}</span>
                </div>
                <p class="title" v-show="isTrue">{{detailsValue.project_name}}</p>
                
                <div class="labelTipbox" v-if="isShowTip" :style="strLen(detailsValue.project_name) <26 ? 'display:none' : 'display:block' ">
                    <div class="mytip"  v-show="isTrue">{{detailsValue.project_name}}</div>
                </div>
                <div class="labelTipbox" v-if="isShowTip"  :style="strLen1(label) <26 ? 'display:none' : 'display:block' ">
                    <div class="mytip"  v-show="!isTrue">{{label}}</div>
                </div>
                <div class="labelTipbox1 labelTipbox" @mouseenter="isShowTip=true" @mouseleave="isShowTip=false"></div>
                
                <el-select v-model="value" placeholder="请选择" popper-class="gf-popper gf-popper2"
                ref="mySelect"
                id="selectID"
                v-show="!isTrue"
                @visible-change="visibleChange"
                @change="valueTypeChange">
                    <el-option 
                    v-for="(item,index) of selectedArray"
                    :key="index"
                    :label="item.project_name"
                    :value="item.project_id">
                           
                    </el-option>
                   
                </el-select>
                <el-tooltip popper-class="onmytooltip" :visible-arrow="false" effect="light" content="进入项目" placement="top-start">
                    <p class="btnProject" @click="goProject()">
                        <span>{{'>'}}</span>
                    </p>
                </el-tooltip>
            </div>
            <div class="body">
                <ul>
                    <li>
                        <span class="label">业主单位：</span>
                        <span class="text">{{detailsValue.owner_name}}</span>
                    </li>
                    <li>
                        <span class="label">行政划区：</span>
                        <span class="text">{{detailsValue.province}}{{detailsValue.city}}{{detailsValue.county}}</span>
                    </li>
                    <li>
                        <span class="label">创建时间：</span>
                        <span class="text">{{detailsValue.create_time}}</span>
                    </li>
                    <li>
                        <span class="label">核准容量：</span>
                        <span class="text">{{detailsValue.design_capacity}}MW</span>
                    </li>
                    <li>
                        <span class="label">备注：</span>
                        <span class="text">{{detailsValue.description}}</span>
                    </li>
                </ul>
            </div>
            
        </div> -->
        
        <!-- 第三版 -->
        <!-- 当个项目显示 -->

        <div class="box box3OneWid" v-show="isTrue">
            <div class="header2">
                <div>
                    <icon name="multilayer" class="icon1"></icon>
                </div>
                <p class="title" @click="goProject(detailsValue)" @mouseenter="isShowTip=true" @mouseleave="isShowTip=false">{{detailsValue.project_name}}</p>
                
                <div class="labelTipbox" v-if="isShowTip" :style="strLen(detailsValue.project_name) <26 ? 'display:none' : 'display:block' ">
                    <div class="mytip">{{detailsValue.project_name}}</div>
                </div>
                
                <el-tooltip popper-class="onmytooltip" :visible-arrow="false" effect="light" content="进入项目" placement="top-start">
                    <p class="btnProject" @click="goProject(detailsValue)">
                        <span>{{'>'}}</span>
                    </p>
                </el-tooltip>
            </div>
            <div class="body">
                <ul>
                    <li>
                        <span class="label">业主单位：</span>
                        <span class="text">{{detailsValue.owner_name}}</span>
                    </li>
                    <li>
                        <span class="label">行政划区：</span>
                        <span class="text">{{detailsValue.province}}{{detailsValue.city}}{{detailsValue.county}}</span>
                    </li>
                    <li>
                        <span class="label">创建时间：</span>
                        <span class="text">{{detailsValue.create_time}}</span>
                    </li>
                    <li>
                        <span class="label">核准容量：</span>
                        <span class="text">{{detailsValue.design_capacity}}MW</span>
                    </li>
                    <li>
                        <span class="label">备注：</span>
                        <span class="text">{{detailsValue.description}}</span>
                    </li>
                </ul>
            </div>       
        </div>
        <!-- 当多个项目显示 -->
        <div class="box3" v-show="!isTrue"  @mouseleave="divMouseSeclected(-1,{})">
            <p @click="goProjectXingzhen(item)"
            @mouseenter="divMouseSeclected(index, item)"  
            
            :class="index==value3_id_active?'activeCol':''"
            v-for="(item,index) of selectedArray" 
            :key="index">{{item.project_name}}</p>

            <div class="detailsTip" :style="{left:posiX+'px',top:posiY+'px'}" v-show="detailsTipShow">
                    <div class="header2" @click="goProject(detailsValue)" >
                        <div>
                            <icon name="multilayer" class="icon1"></icon>
                        </div>
                        <p class="title">{{detailsValue.project_name}}</p>
                        
                    </div>
                    <div class="body">
                        <ul>
                            <li>
                                <span class="label">业主单位：</span>
                                <span class="text">{{detailsValue.owner_name}}</span>
                            </li>
                            <li>
                                <span class="label">行政划区：</span>
                                <span class="text">{{detailsValue.province}}{{detailsValue.city}}{{detailsValue.county}}</span>
                            </li>
                            <li>
                                <span class="label">创建时间：</span>
                                <span class="text">{{detailsValue.create_time}}</span>
                            </li>
                            <li>
                                <span class="label">核准容量：</span>
                                <span class="text">{{detailsValue.design_capacity}}MW</span>
                            </li>
                            <li>
                                <span class="label">备注：</span>
                                <span class="text">{{detailsValue.description}}</span>
                            </li>
                        </ul>
                    </div>   
            </div>
        </div>

       

    </div>
</template>

<script>
    import util from '../../libs/util';
    export default {
        name: 'project-tooltip',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            position: {
                type: Object,
                default: {
                    x: 0,
                    y: 0
                }
            },
            project: {
                type: Object,
                default: {
                    project_name: '',
                    owner_name: '',
                    location_province: '',
                    location_city: '',
                    location_county: '',
                    create_time: '',
                    design_capacity: '',
                    description: ''
                }
            },
            selectedArray: {
                type : Array,
                default : []
            }
        },
        data(){
            return {
                value:"",
                label:"",
                value3_id_active:0,
                posiX:"",
                posiY:"",
                isShowTip:false,
                detailsValue:{},
                isTrue: false,
                detailsTipShow:false,
                routerPathActive: false
            }
        },
        watch: {
            "selectedArray":function (val){
                this.isShow()
                if(val[0]){
                    this.label = val[0].project_name;
                    this.value = val[0].project_id;
                }
            },
            "project":function (val){
                this.detailsValue =val;
            },
            // "$store.state.user.routerPath":function(val){
            //     console.log(val);
            //     if(val == "/assess"){
            //         this.routerPathActive = true;
            //     }else{
            //         this.routerPathActive = false;
            //     }
            // }
        },
        computed: {
            classObject: function () {
                return this.calcPositionClass();
            },
            styleObject: function () {
                const positionStyle = {};
                if (this.visible) {
                    const positionClass = this.calcPositionClass();
                    if (positionClass.indexOf('left') > -1) {
                        positionStyle.left = (this.position.x + 2) + 'px';
                        this.posiX = "180";
                    } else {
                        positionStyle.left = (this.position.x - 270 - 0) + 'px';
                        if(this.selectedArray.length>0){
                            positionStyle.left = (this.position.x - 180 - 0) + 'px';
                        }
                        this.posiX = "-270";
                    }
                    if (positionClass.indexOf('top') > -1) {
                        positionStyle.top = (this.position.y - 20) + 'px';
                    } else {
                        const tooltipHeight = this.$refs['tooltip'].offsetHeight || 175;
                        positionStyle.top = (this.position.y - tooltipHeight + 20) + 'px';
                    }
                }
                return positionStyle;
            }
        },
        methods: {
           
            touchmove(e){
                console.log(e.targetTouches[0].clientX )
            },
            divMouseSeclected(index , obj){
                this.value3_id_active = index;
                this.posiY = index*30;
                this.detailsValue = obj;
                if(index>=0){
                    this.detailsTipShow = true;
                }else{
                    this.detailsTipShow = false;
                }
            },
            strLen(str){
                if(str){
                    if (str == null) return 0;
                    if (typeof str != "string"){
                        str += "";
                    }
                    return str.replace(/[^\x00-\xff]/g,"01").length;
                    }
			},
            strLen1(str){
                if(str){
                    if (str == null) return 0;
                    if (typeof str != "string"){
                        str += "";
                    }
                    return str.replace(/[^\x00-\xff]/g,"01").length;
                    }
			},
            handleClose(){
                // this.$refs.mySelect.handleClose()
            },
            visibleChange(val){
               this.label = this.$refs.mySelect.selectedLabel;
            },
            valueTypeChange(value){
               this.value = value;
               this.selectedArray.forEach((item,index) => {
                   if(item.project_id == value){
                        
                        this.detailsValue = item;
                   }
               });
            },
            isShow(){
                if(this.selectedArray.length<=1){
                    this.isTrue =true;
                }else{
                    this.isTrue =false;
                }
            },
            //行政高度
            goProjectXingzhen(data){
                // console.log(data.project_id);
                this.$store.commit('oldprojectId',data.project_id);
                this.$store.commit('nowprojectId',data.project_id);
                this.$emit("closeVisible",false);
                if(this.detailsValue){

                    this.$emit('projectClicked', this.detailsValue ,1 )
                }
            },
            //进入项目
            goProject(data){
                // console.log(data.project_id);
                this.$store.commit('oldprojectId',data.project_id);
                this.$store.commit('nowprojectId',data.project_id);
                // this.visible = false;
                this.$emit("closeVisible",false);
                if(this.detailsValue){
                    //true是后评估列表联动用的
                    this.$emit('projectClicked', this.detailsValue ,1 , "earth" , true);
                }
            },
            calcPositionClass () {
                const positionClass = [];
                if (this.visible) {
                    const windowWidth = document.body.clientWidth;
                    const windowHeight = document.body.clientHeight;
                    const tooltipWidth = 270;
                    const tooltipHeight = this.$refs['tooltip'].offsetHeight || 175;
                    if (this.position.x + tooltipWidth + 6 > windowWidth) {
                        positionClass.push('right');
                    } else {
                        positionClass.push('left');
                    }
                    if (this.position.y + tooltipHeight - 30 > windowHeight) {
                        positionClass.push('bottom');
                    } else {
                        positionClass.push('top');
                    }
                }
                return positionClass;
            }
        }
    };
</script>
