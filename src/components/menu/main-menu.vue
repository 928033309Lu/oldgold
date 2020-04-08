<style lang="less" scoped>
    @import '../../styles/common.less';
    @import "./main-menu.less";
</style>

<template>
    <ul class="menu-container">
        <!--搜索-->
        <el-tooltip class="el-tooltip-item"
                    popper-class="menu-tooltip-popper"
                    content="搜索"
                    :open-delay="1000"
                    placement="right"
                    effect="light" :hide-after="3000" :enterable="false" >
            <li class="item search" @click="onClick('search')" v-show="!measuringShow">
                <h2>
                    <icon name="search"></icon>
                </h2>
            </li>
        </el-tooltip>
        <!--添加项目-->
        <!-- <el-tooltip class="el-tooltip-item" :open-delay="1000" popper-class="menu-tooltip-popper" effect="light" content="新增" placement="right" :hide-after="3000" :enterable="false" >
            <li class="item add" @click="onClick('add')" v-show="!measuringShow">
                <h2>
                    <icon name="add"></icon>
                </h2>
            </li>
        </el-tooltip> -->
        <!--项目列表-->
        <!-- <el-tooltip class="el-tooltip-item" :open-delay="1000" popper-class="menu-tooltip-popper" effect="light" content="项目" placement="right" :hide-after="3000" :enterable="false" >
            <li class="item project" @click="onClick('project')" v-show="!measuringShow">
                <h2>
                    <icon name="multilayer"></icon>
                </h2>
            </li>
        </el-tooltip> -->
        <!-- 项目 -->
        <li class="item person xiangmu" id="xiangmu"
            v-show="!measuringShow"
            v-bind:class="{ person_active: xiangmuActive}"
            @mouseenter="onXiangmu(true)"
            @mouseleave="onXiangmu(false)"
                @click="onClick('newxiangmu')">
            <el-tooltip :disabled="xiangmudisabled" class="el-tooltip-item" :open-delay="1000" popper-class="menu-tooltip-popper" effect="light" content="项目" placement="right" :hide-after="3000" :enterable="false" >
                <h2 class="item" v-bind:class="{ p_active: xiangmuActive}">
                    <icon name="multilayer"></icon>
                </h2>
            </el-tooltip>
            <transition name="person-fade">
                <div class="menu_person xiangmu_person" v-show="xiangmuActive">
                    <p class=""  @click="onClick('add')">
                        <el-tooltip class="el-tooltip-item" :visible-arrow="false" effect="light" popper-class="menu-tooltip-popper" content="新增" placement="top" :hide-after="3000" :enterable="false" >
                            <icon name="add"></icon>
                        </el-tooltip>
                    </p>
                    <p class="endicon" @click="onClick('project')">
                        <el-tooltip class="el-tooltip-item" :visible-arrow="false" effect="light" popper-class="menu-tooltip-popper" content="项目总览" placement="top":hide-after="3000" :enterable="false" >
                            <!-- <icon name="xiangmu"></icon> -->
                            <i class="iconfont icon-xiangmu"></i>
                        </el-tooltip>
                    </p>
                </div>
            </transition>
        </li>
        <!--首页-->
        <el-tooltip class="el-tooltip-item" :open-delay="1000" popper-class="menu-tooltip-popper" effect="light" content="主页" placement="right" :hide-after="3000" :enterable="false" >
            <li class="item home" @click="onClick('home')" v-show="!measuringShow">
                <h2>
                    <icon name="home"></icon>
                </h2>
            </li>
        </el-tooltip>
        <!-- 工具 -->       
        <li id="gongju" class="item person gongju"
            v-show="!measuringShow"
            v-bind:class="{ person_active: gongjuActive}"
            @mouseenter="onGongju(true)"
            @mouseleave="onGongju(false)"
               >
            <el-tooltip :disabled="gongjudisabled" class="el-tooltip-item" :open-delay="1000" popper-class="menu-tooltip-popper" effect="light" content="工具" placement="right" :hide-after="3000" :enterable="false" >
                <h2 class="item" v-bind:class="{ p_active: gongjuActive}">
                    <icon name="gongju"></icon>
                </h2>
            </el-tooltip>
            <transition name="person-fade">
                <div class="menu_person gongju_person" v-show="gongjuActive">
                    <p @click="onClick('celiang')">
                        <el-tooltip class="el-tooltip-item" :visible-arrow="false" effect="light" popper-class="menu-tooltip-popper" content="量测" placement="top" :hide-after="3000" :enterable="false" >
                            <icon name="celiang"></icon>
                        </el-tooltip>
                    </p>
                    <p class="" @click="onClick('huizhi')">
                        <el-tooltip class="el-tooltip-item" :visible-arrow="false" effect="light" popper-class="menu-tooltip-popper" content="即时标绘" placement="top":hide-after="3000" :enterable="false" >
                            <icon name="huizhi"></icon>
                        </el-tooltip>
                    </p>
                    <p class="endicon shoucang" @click="onClick('shoucang')">
                        <el-tooltip class="el-tooltip-item" :visible-arrow="false" effect="light" popper-class="menu-tooltip-popper" content="收藏夹" placement="top":hide-after="3000" :enterable="false" >
                            <!-- <icon name="02"></icon> -->
                            <i class="iconfont icon-02"></i>
                        </el-tooltip>
                    </p>
                </div>
            </transition>
        </li>
        <!--定位-->
        <el-tooltip class="el-tooltip-item" :open-delay="1000" popper-class="menu-tooltip-popper" effect="light" content="项目位置快速定位" placement="right" :hide-after="3000" :enterable="false" >
            <li class="locationItem location" @click="onClick('position')" v-show="positionVisible && !measuringShow">
                <h2>
                    <icon name="location"></icon>
                </h2>
            </li>
        </el-tooltip>
        <!--收起-->
        <li class="item collapse" v-if="collapse" @click="collapse = false" v-show="positionVisible && !measuringShow">
            <h2>
                <i class="el-icon-more"></i>
            </h2>
        </li>
        <!--原始数据-->
        <el-tooltip class="el-tooltip-item" popper-class="menu-tooltip-popper" effect="light" content="原始数据" placement="right" :hide-after="3000" :enterable="false" >
            <li v-if="!enManager" class="originalFile" @click="onClick('file')" v-show="positionVisible && !collapse && !measuringShow">
                <h2>
                    <icon name="file"></icon>
                </h2>
            </li>
        </el-tooltip>
        <!--测量工具集成-->
        <li class="item measuring offCeliang" v-show="activeCeliang" id="celiang">
                <!-- <el-tooltip class="el-tooltip-item" popper-class="menu-tooltip-popper" effect="light" content="量测" placement="right" :hide-after="3000" :enterable="false" > -->
                    <h2 @click="toggleMeasuring" style="background:#33c86f;color:#F0FCFF;">
                        <icon name="celiang"></icon>
                    </h2>
                <!-- </el-tooltip> -->

                <transition name="fade" :duration="{ enter: 500, leave: 200 }">
                    <div class="measuring-tool" v-show="measuringShow">
                        <!--反向圆角占位-->
                        <div class="antiCircle"></div>
                        <!--空间距离-->
                        <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="三角测量" placement="top" :hide-after="3000" :enterable="false" >
                            <h2 class="measuring-kongjianjuliceliang" v-bind:class="{active: isActiveArr[0]}" @click="onMeasuringClick('measureHeightComplex', 0)">
                                <icon name="kongjianjuliceliang"></icon>
                            </h2>
                        </el-tooltip>
                        <!--长度-->
                        <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="长度" placement="top" :hide-after="3000" :enterable="false" >

                            <h2 class="measuring-changduceliang" v-bind:class="{active: isActiveArr[1]}" @click="onMeasuringClick('measureLength', 1)">
                                <i class="iconfont icon-icon_changdu_px" style="font-size: 28px;" ></i>
                            </h2>
                        </el-tooltip>

                        <!--高度-->
                        <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="高度" placement="top" :hide-after="3000" :enterable="false" >

                            <h2 class="measuring-gaodu" v-bind:class="{active: isActiveArr[2]}" @click="onMeasuringClick('measureHeightSample', 2)">
                                <icon name="gaodu"></icon>
                            </h2>
                        </el-tooltip>

                        <!--面积测量-->
                        <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="面积" placement="top" :hide-after="3000" :enterable="false" >

                            <h2 class="measuring-xiangpica" style="font-size: 28px;" v-bind:class="{active: isActiveArr[3]}" @click="onMeasuringClick('measureArea', 3)">
                                <icon name="mianjiceliang"></icon>
                            </h2>
                        </el-tooltip>
                        <!--剖面分析-->
                        <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="剖面分析" placement="top" :hide-after="3000" :enterable="false" >

                            <h2 class="measuring-xiangpica" style="font-size: 28px;" v-bind:class="{active: isActiveArr[5]}" @click="onMeasuringClick('poumian', 5)">
                                <span class="poumianicon"><i class="iconfont icon--"></i></span>
                            </h2>
                        </el-tooltip>

                        <!--橡皮擦-->
                        <el-tooltip class="el-tooltip-item" effect="light" popper-class="menu-tooltip-popper" content="清除" placement="top" :hide-after="3000" :enterable="false" >

                            <h2 class="measuring-xiangpica" v-bind:class="{active: isActiveArr[4]}" @click="onMeasuringClick('clearMeasure', 4)">
                                <icon name="xiangpica"></icon>
                            </h2>
                        </el-tooltip>
                        <!--右上角关闭-->
                        <div class="measuring-close" @click="toggleMeasuring">
                            <icon name="guanbi"></icon>
                        </div>

                    </div>
                </transition>
            </li>
        <!--个人中心-->
        <li id="person" class="item person"
                @click="onClick('person')"
                v-bind:class="{ person_active: isActive}"
                v-show="(!collapse || !positionVisible) && !measuringShow">
            <el-tooltip :disabled="persondisabled" class="el-tooltip-item" :open-delay="1000" effect="light" popper-class="menu-tooltip-popper" content="个人信息" placement="right" :hide-after="3000" :enterable="false" >
                <h2 v-bind:class="{ p_active: isActive}">
                    <icon name="person"></icon>
                </h2>
            </el-tooltip>

            <transition name="person-fade">
                <div class="menu_person" v-show="isActive">
                    <p @click="onClick('password')" class="pw">
                        <el-tooltip class="el-tooltip-item" :visible-arrow="false" effect="light" popper-class="menu-tooltip-popper" content="修改密码" placement="top" :hide-after="3000" :enterable="false" >
                            <icon name="mima1"></icon>
                        </el-tooltip>
                    </p>
                    <p @click="onClick('exit')" class="logout">
                        <el-tooltip class="el-tooltip-item" :visible-arrow="false" effect="light" popper-class="menu-tooltip-popper" content="退出" placement="top":hide-after="3000" :enterable="false" >
                            <icon style="margin-left: -10px;" name="exit"></icon>
                        </el-tooltip>
                    </p>
                </div>
            </transition>
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'MainMenu',
        props: {
            positionVisible: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                isActive: false,
                measuringShow: false,
                isActiveArr: [false, false, false, false, false,false],
                collapse: true,
                persondisabled: false,
                gongjuActive: false,
                gongjudisabled: false,
                xiangmuActive: false,
                xiangmudisabled: false,
                activeCeliang: false
            };
        },
        computed:{
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                    return true;
                }else{
                    return false;
                }
            }
        },
        methods: {
            defaultInfoActive(){
                this.isActiveArr = [false, false, false, false, false,false];
            },
            onClick (itemType) {
                this.$emit('menuSelected', itemType);

                if (itemType === 'person') {
                    // this.collapse = true;
                    this.gongjuActive = false;
                    this.xiangmuActive = false;

                    this.isActive = !this.isActive;
                    this.persondisabled = this.isActive;
                }
                if (itemType === 'search') {
                    // alert(111);
                    this.closeActive();
                }
                if (itemType === 'home') {
                    this.collapse = true;
                    this.closeActive();
                }
                if (itemType === 'file') {
                    this.collapse = true;
                }
                if (itemType === 'password') {
                    this.collapse = true;
                }
                if (itemType === 'exit') {
                    this.collapse = true;
                }
                if (itemType === 'gongju') {
                    this.isActive = false;
                    this.xiangmuActive = false;

                    this.gongjuActive = !this.gongjuActive;
                    this.gongjudisabled = this.gongjuActive;
                }
                if (itemType === 'newxiangmu') {
                    this.isActive = false;
                    this.gongjuActive = false;
     
                    this.xiangmuActive = !this.xiangmuActive;
                    this.xiangmudisabled = this.xiangmuActive;
                }
                if (itemType === 'celiang') {
                    this.gongjuActive = true;
                    this.measuringShow = !this.measuringShow;

                    this.activeCeliang = true;
                }
                if (itemType === 'huizhi') {
                    //界面做到显示隐藏工具
                    this.$emit("drawTiming",true);
                }
            },
            onXiangmu(type){
                this.xiangmuActive = type;
                this.xiangmudisabled = this.xiangmuActive;

                this.isActive = false;
                this.gongjuActive = false;
            },
            onGongju(type){
                this.isActive = false;
                this.xiangmuActive = false;

                this.gongjuActive = type;
                this.gongjudisabled = type;
            },
            closeActive(){
                this.isActive = false;
                this.gongjuActive = false;
                this.xiangmuActive = false;
            },
            toggleMeasuring () {
                this.activeCeliang = false;

                this.measuringShow = !this.measuringShow;
                for (let i in this.isActiveArr) {
                    this.isActiveArr[i] = false;
                }
                if (!this.measuringShow) this.collapse = true;

                this.onMeasuringClick('clearMeasure', 4);
            },
            onMeasuringClick (itemType, index) {
                for (let i in this.isActiveArr) {
                    this.isActiveArr[i] = false;
                }
                this.isActiveArr.splice(index, 1, true);
                this.$emit('menuSelected', itemType);
                if (index === 4) this.isActiveArr.splice(index, 1, false);
            },
            hide () {
                this.isActive = false;
            }
        }
    };
</script>
<style lang="less" scoped>
    .person-fade-enter-active {
        transition: all 1s ease;
    }
    .person-fade-leave-active {
        transition: all 0s ease;
    }
    .person_active{
        border-bottom-right-radius: 0!important;
        border-top-right-radius: 0!important;
    }
    .p_active{
        background-color: #33C86F!important;
        color: #F0FCFF!important;
    }
    .menu_person{
        width: 90px;
        height: 45px;
        margin-top: -45px;
        margin-left: 45px;
        background-color: rgba(25, 28, 54, 0.6);
        border-bottom-right-radius: 30px;
        border-top-right-radius: 30px;
        p{
            width: 45px;
            height: 45px;
            float: left;
            line-height: 45px;
            text-align: center;
            font-size: 17px;
            color: #F0FCFF;
            cursor: pointer;
            &:hover{
                color: #33C86F;
            }
        }
    }
    .poumianicon .iconfont{
        font-size: 15px;
        position: relative;
        top: -3px;
        font-weight: 100;
    }
    .gongju_person{
        width: 135px;
        position: relative;
        top: -3.5px;
    }
    .xiangmu_person{
        position: relative;
        top: -3.5px;
    }
    .shoucang{
        color: #F0FCFF;
    }
    .endicon{
        margin-left: -4px;
    }
    .offCeliang{
        
    }
    .home-container .main-menu .item{
        width: 45px;
    }
</style>
