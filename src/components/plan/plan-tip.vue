<template>
<div  class="tip-container">
    <div>
        <!-- {{planData.scheme_id}} -->
        <transition name="simple-fade">
            <div v-if="simpleShow" class="simple-panel"
                 
                 @mouseenter="onMouseOver"
                 @mouseleave="onMouseOut1"
                 @click="onPlanClick">
                 <!-- 去掉选中:style="styleObject" -->
                <div class="head-panel">
                    <span class="plan-name">{{planData.scheme_name ? planData.scheme_name : ' '}}</span>
                </div>
                <div class="data-panel">
                    <icon name="clock2" class="clock2" v-if="planData.status_id === 1"></icon>
                    <span class="data-value" v-else-if="planData.status_id === 3 && checkValue(planData.vat_cit)" style="color: rgba(245,22,58,1);"> {{ planData.vat_cit.toFixed(2) }} </span>
                    <span class="data-value" v-else-if="checkValue(planData.vat_cit)"> {{ planData.vat_cit.toFixed(2) }} </span>
                    <span class="data-value" style="color: rgba(245,22,58,1);" v-else>--</span>

                </div>
                <div class="desc-panel">
                    <span class="data-desc" v-if="planData.status_id === 1">计算中…</span>
                    <span class="data-desc" v-else>度电成本</span>
                </div>
                <div class="jinduShow" v-if="jinduShow && selectedPlanId === mouserOverPlanId">
                    <p v-show="jinduListshow" v-for="item in jinduList" v-bind:class="{ active_err: item[0]==='ERROR'}">{{item[1]}}</p>
                    <p v-show="!jinduListshow">暂无数据</p>
                </div>
            </div>
        </transition>
        <transition name="search-fade" @after-enter="transitionComplete" @after-leave="onDetailLeave" @before-enter="beforeEnter">
            <div v-if="!simpleShow" class="detail-panel" @mouseleave="onMouseOut" @click="onPlanClick"
                 > 
                 <!-- 去掉选中:style="styleObject" -->
                <div class="head-panel">
                    <div>
                        <span class="plan-name">{{planData.scheme_name ? planData.scheme_name : ' '}}</span>
                        <!-- <span class="plan-detail" @click.stop="onDetailButtonClick">详情</span> -->
                        <icon name="yichang2" style="padding-left: 10px;font-size: 13px;color: #f5163a;"  v-if="planData.status_id === 3"></icon>
                        <!-- <span class="plan-errmsg"  v-if="planData.status_id === 3" >{{planData.error_msg}}</span> -->
                        <ul class="plan-errmsglist"  v-if="planData.status_id === 3">
                            <li  v-for="(errorMsg, index) in errorMsgList" :key="999+index" :class="'errorMsgLi'+errorMsgList.length">{{errorMsg}}</li>
                        </ul>
                    </div>
                    <div class="button-panel">
                        <div @click.prevent.stop="onEmit('copy')"><icon class="del-button" name="copy" ></icon></div>
                        <!--<div @click.prevent.stop="onEmit('report')"><icon class="del-button" name="report" ></icon></div>-->
                        <div @click.prevent.stop="onEmit('remove')" v-if="(Math.abs(planData.scheme_id) > 1)"><icon class="del-button" name="remove"></icon></div>
                    </div>
                </div>
                <div class="detail-list">
                    <div class="item-panel">
                        <div class="data-panel">
                            <span class="data-value" v-if="planData.status_id === 3 && checkValue(planData.vat_cit)" style="color: rgba(245,22,58,1);"> {{ planData.vat_cit.toFixed(2) }} </span>
                            <span class="data-value" v-else-if="checkValue(planData.vat_cit)"> {{ planData.vat_cit.toFixed(2) }} </span>
                            <span class="data-value" style="color: rgba(245,22,58,1);" v-else>--</span>
                        </div>
                        <div class="desc-panel">
                            <span class="data-desc">度电成本</span>
                        </div>
                        <div class="unit-panel">
                            <span class="data-unit">(元/千瓦时)</span>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="data-panel">
                            <!--<span class="data-value">{{checkValue(planData.p_i_r_r)}}</span>-->
                            <span class="data-value" v-if="planData.status_id === 3 && checkValue(planData.p_i_r_r)" style="color: rgba(245,22,58,1);"> {{ planData.p_i_r_r.toFixed(2) }} </span>
                            <span class="data-value" v-else-if="checkValue(planData.p_i_r_r)"> {{ planData.p_i_r_r.toFixed(2) }} </span>
                            <span class="data-value" style="color: rgba(245,22,58,1);" v-else>--</span>
                        </div>
                        <div class="desc-panel">
                            <span class="data-desc">全投资内部收益率</span>
                        </div>
                        <div class="unit-panel">
                            <span class="data-unit">(PIRR)</span>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="data-panel">
                            <!--<span class="data-value">{{checkValue(planData.equivalent_hours)}}</span>-->
                            <span class="data-value" v-if="planData.status_id === 3 && checkValue(planData.equivalent_hours)" style="color: rgba(245,22,58,1);"> {{ planData.equivalent_hours.toFixed(2) }} </span>
                            <span class="data-value" v-else-if="checkValue(planData.equivalent_hours)"> {{ planData.equivalent_hours.toFixed(2) }} </span>
                            <span class="data-value" style="color: rgba(245,22,58,1);" v-else>--</span>
                        </div>
                        <div class="desc-panel">
                            <span class="data-desc">等效小时数</span>
                        </div>
                        <div class="unit-panel">
                            <span class="data-unit">(小时)</span>
                        </div>
                    </div>

                </div>
            </div>
        </transition>
    </div>
    
</div>
</template>

<script>
    import util from '../../libs/util';
    export default {
        name: 'plan-tip',
        props: {
            planData: {
                type: Object,
                default: {
                    scheme_id: 1,
                    scheme_name: '默认方案',
                    status_id: 2,
                    dataValue: '56.6%',
                    dataValue1: '72.4%',
                    dataValue2: '4888',
                    dataValue3: '0.23'
                }
            },
            selectedPlanId: {
                type: Number
            },
           
            mouserOverPlanId: {
                type: Number
            },
           
            contrastDataArr:{

            }
        },
        data () {
            return {
                simpleShow: true,
                detailShow: false,
                jinduShow: false,
                jinduList: [],
                jinduListshow: false,
                logRequestTimer: null,
                errorMsgList: [],
                mastProjectData:[], //右边方案总览信息
                contrastData:[]   //比选数据
            };
        },
        watch: {
            planData () {
                this.showLog();
                this.updateErrorMsg();
            },
            selectedPlanId: function (newData, oldData) {
                this.showLog();
            },
            mouserOverPlanId (newId, oldId) {
                if (this.planData.scheme_id !== newId) {
                    this.simpleShow = true;
                }
            }
        },
        computed: {
            styleObject: function () {
                const positionStyle = {};
                if (this.selectedPlanId && this.selectedPlanId === this.planData.scheme_id) {
                    // positionStyle.borderTop = '2px solid #33C86F';
                    // positionStyle.borderBottom = '2px solid #33C86F';
                    // positionStyle.borderLeft = '2px solid #33C86F';
                    positionStyle.opacity = 1;
                } else {
                    // positionStyle.borderTop = '2px solid transparent';
                    // positionStyle.borderBottom = '2px solid transparent';
                    // positionStyle.borderLeft = '2px solid transparent';
                }
                return positionStyle;
            },
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role === 3){
                    return true;
                }else if(this.$store.state.user.loginUserInfo.role === 10){
                    return true;
                }else{
                    return false;
                }
            }
        },
        mounted () {
            this.updateErrorMsg();
        },
        methods: {
            updateErrorMsg () {
                this.errorMsgList = [];
                if (!this.planData || !this.planData.step_status) {
                    return;
                }
                let temp = [];
                // status: 0未运行，1运行中，2正常完成，3异常
                // 判断各步骤是否异常，如果异常则将异常信息记录下来
                if (this.planData.step_status.road.status === 3) {
                    temp.push(this.planData.step_status.road.msg);
                }
                if (this.planData.step_status.syz.status === 3) {
                    temp.push(this.planData.step_status.syz.msg);
                }
                if (this.planData.step_status.jdxl.status === 3) {
                    temp.push(this.planData.step_status.jdxl.msg);
                }
                if (this.planData.step_status.evaluation.status === 3) {
                    temp.push(this.planData.step_status.evaluation.msg);
                }

                // 如果方案异常但各步骤没有异常，则记录方案的异常信息
                if (this.planData.status_id === 3 && temp.length === 0) {
                    temp.push(this.planData.error_msg);
                }
                // 如果异常信息大于1条，则将第一条信息在数组末尾追加一遍，用于滚动
                if (temp.length > 1) {
                    temp.push(temp[0]);
                }
                this.errorMsgList = temp;
            },
            showLog () {
                this.jinduShow = false;
                clearInterval(this.logRequestTimer);
                if (this.selectedPlanId === this.planData.scheme_id && this.planData.status_id === 1) {
                    this.jinduShow = true;
                    this.$emit('changeWidth', '420');
                    this.requestLog();
                    this.logRequestTimer = setInterval(() => { if (!this.jinduShow || this.selectedPlanId !== this.mouserOverPlanId) return; this.requestLog(); }, 30000);
                }
            },
            requestLog () {
                util.ajax.get('/read_log/' + this.planData.project_id + '?scheme_id=' + this.planData.scheme_id).then(res => {
                // util.ajax.get('/read_log/12345?scheme_id=3').then(res => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    this.checkJinduList(res.data.data);
                   
                });
            },
            checkValue (val) {
                if (val && parseFloat(val) > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            open () {
                // this.jinduShow = true;
                // this.$emit('changeWidth', '420');
                // util.ajax.get('/read_log/' + this.planData.project_id + '?scheme_id=' + this.planData.scheme_id).then(res => {
                // // util.ajax.get('/read_log/12345?scheme_id=3').then(res => {
                //     if (res.data.code === 404) {
                //         return;
                //     }
                //     if (res.data.code !== 200) {
                //         this.$message.error(res.data.message);
                //         return;
                //     }
                //     this.checkJinduList(res.data.data);
                // });
            },
            onMouseOver () {
                if (this.planData.status_id === 2 || this.planData.status_id === 3) { // 2:计算完成 3:出错
                    this.simpleShow = false;
                    this.detailShow = true;
                } else {
                    this.simpleShow = true;
                    this.detailShow = false;
                }
                this.$emit('planMouseOver', this.planData.scheme_id);
                this.$emit('transitionComplete');
            },
            onMouseOut1 () {
                if (this.planData.status_id === 1) {
                    this.$emit('planMouseOver', null);
                }
            },
            onMouseOut () {
                this.detailShow = false;
                this.simpleShow = true;
                this.$emit('planMouseOver', null);
            },
            transitionComplete () {
                this.$emit('transitionComplete');
            },
            beforeEnter () {
                this.$emit('beforeEnter');
            },
            onDetailLeave () {
                this.simpleShow = true;
                this.detailShow = false;
                this.$emit('transitionComplete');
            },
            onPlanClick () {
                this.getMastProject();
                // //切换方案事件--传参关闭噪音层
                // this.Bus.$emit("noiseOpenSelected",false)
                // //切换方案事件--传参关闭红线区
                // this.Bus.$emit("redLineOpenSelected",false)
                // //切换方案事件--传参关闭噪音图片
                // this.Bus.$emit('zaoyinPhoto', false);

                console.log(this.selectedPlanId,"00");
                if (this.planData.status_id === 1) {
                    this.$emit('changeWidth', '420');
                } else {
                    this.$emit('changeWidth', '150');
                }
                this.$store.commit('currentPlanData', this.planData);
                this.$emit('clickPlan', this.planData.project_id, this.planData.scheme_id, this.planData.status_id === 1 ,true);
                //传点击方案后的值过去到fan-add-coordinate页面
                this.$emit("getSchemeId",this.planData.scheme_id);
            },
            
            //获取右边方案总览数据
            getMastProject(){
                this.mastProjectData = [];
                util.ajax.get('/scheme_total/'+this.planData.project_id+"/"+this.planData.scheme_id)
                .then((res)=>{
                    if(res.data.code == 200){
                        // console.log(res.data.data);
                        this.mastProjectData = res.data.data;

                        this.$store.commit('planMastProjectData', res.data.data);
                    }
     
                }).catch((err)=>{
                    console.error(err);
                })
            },
            onDetailButtonClick () {
                this.$emit('clickShowDetail', this.planData);
            },
            onEmit (action) {
                if(this.enManager){
                    this.$message('您没有权限执行此操作！');
                    return;
                }
                // console.log(action,"123")
                this.$emit('clickButton', action, this.planData.project_id, this.planData.scheme_id);
            },
            checkJinduList (data) {
                data = data || [];
                if (data.length > 0) {
                    // 日志信息倒序排列
                    this.jinduList = data.reverse();
                    this.jinduListshow = true;
                } else {
                    this.jinduList = data;
                    this.jinduListshow = false;
                }
            },

            shareClickPlan(){
                
                this.onPlanClick()
                this.$store.commit('waitingShareClose')
            }
        }
    };
</script>

<style lang="less" scoped>
    .jinduShow{
        position: absolute;
        top: 0;
        height: 100%;
        margin-left: -264px;
        width: 270px;
        overflow: auto;
        p{
            color: white;
            font-size: 10px;
            margin-top: 5px;
            float: left;
            width: 260px;
            margin-right: 10px;
            margin-bottom: 0;
        }
    }
    .active_err{
        color: red!important;
    }
    .tip-container{
        height: 132px;
        /*width: 420px;*/
        margin-bottom: 10px; /** 18->10*/
        position: relative;
        display: flex;
        justify-content: flex-end;
    }
    .tip-container2{
        margin-bottom: 10px;
    }
    .simple-panel{
        position: relative;
        height: 132px;
        width: 140px;
        right: 0px;
        box-sizing: border-box;
        background:rgba(3,32,62,1);
        opacity:0.6;
        justify-content: center;
        align-items: center;
        cursor:pointer;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .detail-panel{
        position: absolute;
        height: 132px;
        /*width: 420px;*/
        box-sizing: border-box;
        right: 0px;
        top: 0px;
        background:rgba(3,32,62,1);
        opacity:0.6;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        cursor:pointer;
        overflow: hidden;
    }
    .detail-list{
        flex-direction: row;
        /*width: 420px;*/
        display: flex;
    }
    .item-panel{
        width: 140px;
    }
    .button-panel{
        display: flex;
        flex-direction: row;
    }
    .head-panel{
        flex-direction: row;
        justify-content: space-between;
        display: flex;
        align-items: center;
        height: 33px;
    }
    .data-panel{
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding-top: 5px;
        svg{
            padding-left: 50px;
            display: block;
            width: 42px;
            height: 42px;
        }
        svg.clock2{
            color:#FFC25D;
        }
    }
    .desc-panel{
        margin-top: 2px;
        flex-direction: row;
    }
    .unit-panel{
        margin-top: 2px;
        flex-direction: row;
    }
    .plan-name{
        padding-left: 15px;
        padding-right: 6px;
        padding-top: 2px;
        font-size:13px;
        font-family:MicrosoftYaHei;
        color:rgba(255,255,255,1);
        line-height:26px;
        height: 26px;
        display: inline-block;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .del-button{
        color: rgba(255,255,255,1);
        margin-right: 10px;
        cursor:pointer;
    }
    .plan-detail{
        width:26px;
        height:14px;
        font-size:12px;
        font-family:MicrosoftYaHei;
        color:#FFC25D;
        line-height:20px;
        text-decoration: underline;
        cursor:pointer;
    }
    .plan-errmsg{
        font-size:12px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(245,22,58,1);
        line-height:13px;
    }
    .plan-errmsglist{
        font-size: 12px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: #f5163a;
        line-height: 13px;
        list-style: none;
        height: 13px;
        overflow: hidden;
        position: relative;
        display: inline-block;
        padding-right: 0px;
        padding-inline-start: 0px;
        top: 1px;
    }
    .plan-errmsglist li {
        position: relative;
    }
    .errorMsgLi3 {
        animation: keyframes2 6s infinite;
    }
    .errorMsgLi4 {
        animation: keyframes3 9s infinite;
    }
    .errorMsgLi5 {
        animation: keyframes4 12s infinite;
    }
    @keyframes keyframes2 {
        33% {
            top: 0px;
        }
        66% {
            top: -13px;
        }
        100% {
            top: -26px;
        }
    }
    @keyframes keyframes3 {
        25% {
            top: 0px;
        }
        50% {
            top: -13px;
        }
        75% {
            top: -26px;
        }
        100% {
            top: -39px;
        }
    }
    @keyframes keyframes4 {
        20% {
            top: 0px;
        }
        40% {
            top: -13px;
        }
        60% {
            top: -26px;
        }
        80% {
            top: -39px;
        }
        100% {
            top: -52px;
        }
    }
    .data-value{
        height: 40px;
        color: #33C86F;
        font-size: 32px;
        font-weight: bold;
        line-height: 45px;
        text-align: center;
        display: block;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .data-desc{
        margin-top: 10px;
        height: 14px;
        color: #D4EFF6;
        font-size: 12px;
        text-align: center;
        line-height: 12px;
        display: block;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .data-unit{
        height: 12px;
        color: #D4EFF6;
        font-size: 12px;
        text-align: center;
        line-height: 15px;
        display: block;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .plan-slide-bar-enter-active {
        transition: width 0.5s;
    }
    .plan-slide-bar-leave-active {
        transition: width 0.5s;
    }
    .plan-slide-bar-enter, .plan-slide-bar-leave-to{
        width: 110px;
    }
    .plan-slide-bar-leave, .plan-slide-bar-enter-to{
        /*width: 420px;*/
    }

    .search-fade-enter-active {
        transition: all .3s;
    }
    .search-fade-leave-active {
        transition: all 0.3s ease-in;
    }
    .search-fade-enter, .search-fade-leave-to{
        opacity: 0;
        transform: translateX(280px);
    }
    .search-fade-leave, .search-fade-enter-to{
        left: 0px;
    }

    .simple-fade-enter-active {
        transition: all .3s ease-in;
    }
    .simple-fade-leave-active {
        transition: all 0s;
    }
    .simple-fade-enter, .simple-fade-leave-to{
        opacity: 0.0;
    }
    .simple-fade-leave, .simple-fade-enter-to{
        opacity: 0.6;
    }
    .isActiveBg{
        background: red !important;
    }
</style>
