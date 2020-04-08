<template>
    <div class="plan-contrast">
        <!-- <el-dialog 
                custom-class="plan-contrast-project"
                width="696px"
                @close="close('project')"
                :visible.sync="visible"
                >
            </el-dialog> -->
        <!-- <el-dialog 
            custom-class="plan-contrast-project contrast-jingping"
            width="784px"
            @close="close('jingping')"
            :visible.sync="visible2"
            ></el-dialog> -->
        <el-dialog 
            custom-class="plan-contrast-project"
            width="784px"
            @close="close('zhibiao')"
            :visible.sync="visible3"
            >
            <div class="title">
                指标比选
            </div>
            <div class="content-box">
                <div class="header-tab">
                    <span class="line line-left"><span></span></span>
                    <ul class="tab-center">
                        <li @click="tabIndex = 1">发电量对比</li>
                        <li @click="tabIndex = 2">工程设计</li>
                        <li @click="tabIndex = 3">经济指标</li>
                        <div class="bgBox">
                            <span :class="tabIndex != 1 ? tabIndex == 2 ? 'bgBoxActive2' : 'bgBoxActive3' : 'bgBoxActive1' "></span>
                        </div>
                    </ul>
                    <span class="line line-right"><span></span></span>
                </div>
                <!-- <div class="title1">
                    方案总览对比
                </div> -->
                <div class="content">
                    <plan-master-project-tip
                    v-show="tabIndex == 1"
                    v-for="(item,index) of contrastList" 
                    :key="index"
                    :planData="item"
                    ></plan-master-project-tip>
            
                    
                    <plan-gongcheng-tip
                    v-show="tabIndex == 2"
                    v-for="(item,index) of gongchengList" 
                    :key="index"
                    :gongData="item"
                    ></plan-gongcheng-tip>
            <!-- <div class="content"> -->
                <!-- <div class="title1">
                    方案主要经济指标对比
                </div> -->
                    <plan-jingping-tip
                    v-show="tabIndex == 3"
                    v-for="(item,index) of JingpingList" 
                    :key="index"
                    :box1="item"
                    ></plan-jingping-tip>
            <!-- </div> -->
                </div>
           
            </div>
        </el-dialog>
</div>
</template>
<script>
    import util from '../../libs/util';
    import PlanMasterProjectTip from "./plan-master-project-tip.vue";
    import PlanJingpingTip from "./plan-jingping-tip.vue";
    import PlanGongchengTip from "./plan-gongcheng-tip.vue";
    export default{
        name:"plan-contrast",
        components: { PlanMasterProjectTip ,PlanJingpingTip ,PlanGongchengTip},
        data () {
            return{
                visible:false,
                visible2:false,
                visible3:false,
                contrastList:[],
                planData:[],
                JingpingList:[],
                gongchengList:[],
                yieldrate: 0.06, // 全投资内部收益率
                clickSelected: false,
                tabIndex: 1 
            }
        },
        watch: {
            "$store.state.app.contrastData":function(val){
                this.planData = val;
                // console.log(val)
            },
            // visible:function(val){
            //     // console.log(val)
            //     if(val){
            //         this.getContrastData();
            //     }else{
            //         this.$emit("closeActive");
            //         this.contrastList = [];
            //     }
            // },
            // visible2:function(val){
            //     // console.log(val)
            //     if(val){
            //         this.getJingpingData();
            //     }else{
            //         this.$emit("closeActive");
            //         this.JingpingList = [];
            //     }
            // },
            visible3:function(val){
                // console.log(val)
                if(val){
                    this.getContrastData();
                    this.getJingpingData();
                    this.getGongchengData();
                }else{
                    this.$emit("closeActive");
                    this.contrastList = [];
                    this.JingpingList = [];
                    this.gongchengList = [];
                }
            }
        },
        methods: {
            //工程设计
            getGongchengData(){
                this.planData.map((item,index) => {
                    util.ajax.get('/road_result', {
                        params: {
                            scheme_id: item.scheme_id,
                            project_id: item.project_id
                        }
                    })
                    .then((res)=>{
                        // console.log(res)
                        var data = res.data.data;
                        data.project_id = item.project_id;
                        data.scheme_id = item.scheme_id;
                        data.scheme_name = item.scheme_name;

                        this.gongchengList.push(data);
                        this.gongchengList.sort(function(a, b) {
                            return a.scheme_id - b.scheme_id
                        });
                    })
                })  
            },
            //方案总览
            getContrastData(){
                // console.log(this.planData);
                this.planData.map((item,index) => {

                    util.ajax.get('/scheme_total/'+item.project_id+"/"+item.scheme_id)
                    .then((res)=>{
                        if(res.data.code == 200){
                            // console.log(res.data.data);
                            var data = res.data.data;
                            data.project_id = item.project_id;
                            data.scheme_id = item.scheme_id;
                            data.scheme_name = item.scheme_name;

                            this.contrastList.push(data);
                            this.contrastList.sort(function(a, b) {
                                return a.scheme_id - b.scheme_id
                            });
                        }    
                    }).catch((err)=>{
                        console.error(err);
                    })

                    // console.log(this.contrastList);
                });
            },
            //主要经济指标
            getJingpingData(){
                this.planData.map((item,index) => {
                    util.ajax.get('/evaluation_result', {
                        params: {
                            scheme_id: item.scheme_id,
                            project_id: item.project_id
                        }
                    }).then(res => {
                        // console.log(res);
                        var data = res.data.data || {};
                        data.project_id = item.project_id;
                        data.scheme_id = item.scheme_id;
                        data.scheme_name = item.scheme_name;

                        this.JingpingList.push(data);
                        this.JingpingList.sort(function(a, b) {
                            return a.scheme_id - b.scheme_id
                        });
                    }).catch((err)=>{
                        console.error(err);
                    })
                });
            },
            close(type){
                // if(type == "project"){
                //     this.visible = false;
                // }else{
                //     this.visible2 = false;
                // }
                switch (type){
                    case "zhibiao":
                        this.visible3 = false;
                    break;
                }
                
            },
            onClick () {
                
                this.clickSelected = !this.clickSelected;
            }
        }
    }
</script>
<style lang="less" scoped>
    .plan-contrast /deep/ .el-dialog__header{
        background: rgba(0, 0, 0, 0) !important;
    }
    .plan-contrast /deep/ .el-dialog__body{
        padding-top: 0 !important;
        margin-top: 20px !important;
    }
    .plan-contrast /deep/ .plan-contrast-project{
        margin-top: 9vh !important;
    }
    /* .plan-contrast /deep/ .el-dialog__body{
        max-height: 450px !important;
        
    } */
    /* .plan-contrast /deep/ .contrast-jingping /deep/ .el-dialog__body{ */
        /* max-height: 523px !important; */
        /* padding-right: 10px !important; */
    /* } */
    .plan-contrast{
        position: relative;
        .title1 , .title{
            height: 30px;
            position: absolute;
            top: 10px;
            left: 20px;
            z-index: 100;
            color: #D4EFF6;
            font-size: 16px
        }
       
    }
    .content-box{
       
       .header-tab{
           height: 50px;
           position: relative;
           .tab-center{
                display: flex;
                margin: 20px auto 0 auto;
                padding: 0;
                color:rgba(212,239,246,1);
                border:1px solid rgba(51,200,111,1);
                width: 360px;
                border-radius: 20px;
                position: relative;
                &>li{
                    flex: 1;
                    height: 27px;
                    line-height: 27px;
                    font-size: 13px;
                    text-align: center;
                    cursor: pointer;
                    position: relative;
                    z-index: 12;
                }
            }
       }
        .content{
            display: flex;
            flex-wrap: wrap;
            max-height: 450px;
            overflow: auto;
        }
    }
    .line{
        border-bottom: 1px solid rgba(51,200,111,1);
        display: inline-block;
        width: 100px;
        position: absolute;
       
        &>span{
            position: absolute;
            
            display: inline-block;
            width: 20px;
            height: 20px;
            border-bottom: 1px solid rgba(51,200,111,1);
            border-right: 1px solid rgba(51,200,111,1);
        }
    }
    .line-left{
        left: 10%;
        top: 15px;
        &>span{
            left: -20px;
            bottom: -21px;
        }
    }
    .line-right{
        transform: rotate(180deg);
        right: 10%;
        top: 15px;
        &>span{
            left: -20px;
            bottom: 0;
            transform: rotate(-90deg);
        }
    }
    
    .bgBox{
        position: absolute;
        width: 99%;
        margin: 0 0 0 0.5%;
    }
    .bgBox>span{
        width: 33%;
        height: 23px;
        display: inline-block;
        background:rgba(51,200,111,0.6);
        border-radius: 20px;
        position: absolute;
        top: 2px;
       
    }
    .bgBox .bgBoxActive2{
        left: 33.5%;
        transition: all 0.5s;
    }
    .bgBox .bgBoxActive3{
        left: 67%;
        transition: all 0.5s;
    }
    .bgBox .bgBoxActive1{
        left: 0;
        transition: all 0.5s;
    }
</style>