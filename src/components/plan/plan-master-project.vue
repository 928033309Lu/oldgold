<template>
    <div class="plan-master" :class="styleShow ? miniSizeActive ? 'plan-master-show-mini' : 'plan-master-show':''">
        <div class="minIconBox" v-show="miniSizeActive" @click="minviewMasterProject(false)">
            <icon class="rightIcon" name="arrow-right-copy"></icon>
        </div>
        <div class="minviewbtn" @click="minviewMasterProject(true)">
            <span>——</span>
        </div>
        <div class="closebtn" @click="closeMasterProject">
            <icon name="guanbi" class="guanbi" style="width:30px;height:30px;"></icon>
        </div>
        <div class="title">
            <span ref="titleName" class="titleName">{{projectName}} </span> 
            <span class="titleRight">
                <span v-if="roleVisible" class="bianjiicon" @click="onBianji"><icon name="bianji" style="width: 15px;height: 15px;"></icon></span>
                <span class="line"></span><b>·</b>  <span ref="clickIcon" class="clickIcon" :class="clickSelected?'clickIconActive':''" style="cursor: pointer;" @click="onClick"><icon name="xiazaijiangyiicon"></icon></span> </span>
        </div>
        <reporter-bar ref="ReporterBar" @closeIconActive="onCloseIconActive"></reporter-bar>
        <ul class="plan-master-content"> 
            <li> <span><b>{{mastData.total_hours}}</b> <span class="col"> h</span></span> 全场等效上网小时数</li>
            <li> 机型方案：
                <span class="turbine_type" v-for="(item,index) of mastData.turbine_type" :key="index">{{item}}</span> 
            </li>
            <li> 轮毂高度：
                <span class="turbine_type" v-for="(item,index) of mastData.height" :key="index"> <span>{{item}}</span> <span class="col"> m</span> </span>
            </li>
            <li> 项目总容量：<span>{{mastData.total_capacity}}</span> <span class="col"> MW</span></li>
            <li> 全场平均风速：<span>{{mastData.average_speed}}</span> <span class="col"> m/s</span></li>
            <li> 全场理论发电量：<span>{{mastData.total_generation_capacity}}</span> <span class="col"> MWh/y</span></li>
            <li> 综合折减系数(不含尾流)：<span>{{mastData.reduction_factor}}</span> </li>
            <li> 全场等效上网电量：<span>{{mastData.total_energy}}</span> <span class="col"> MWh/y</span></li>
        </ul>
        
        <el-dialog 
        :close-on-click-modal="false"
        custom-class="addElement"
        width="330px"
        :center="true"
        @close="closevisible"
        :visible.sync="visible">
            <div class="content">
                <div class="title">重命名属性设置</div>
                <ul>
                    <li class="nameli">
                        <span class="name">名称:</span>
                        <el-input v-model="newName" placeholder="请输入方案名称"></el-input>
                    </li>
                </ul>  
                <div class="btnBox">
                    <el-button class="gf-button addBtn" @click="onpushBtn">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import util from '@/libs/util';
    import ReporterBar from '../function/reporter-bar';
    export default {
        name:"plan-master-project",
        components: { ReporterBar },
        data() {
            return{
                isShowChengguo: false,
                visible:false,
                newName: "",
                miniSizeActive: false,
                styleShow:false,
                offShow: false,
                mastData:{},
                projectName:null,
                selected: false,
                clickSelected: false,
                // roleVisible: true //权限
            }
        },
        computed:{
            // enManager: function () {
            //     if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
            //         return true;
            //     }else{
            //         return false;
            //     }
            // },
            roleVisible: function(){
                if(this.$store.state.user.loginUserInfo.role!=1 && this.$store.state.user.loginUserInfo.role!=9 && this.$store.state.user.loginUserInfo.role!=10 ){
                    return false;
                }else{
                    return true;
                }
            }
        },
        watch: {
            "$store.state.app.planMastProjectData":function(val){
                this.mastData = val;
                // console.log(val);
            },
            "$store.state.app.currentPlanData.scheme_name":function(val){
                this.projectName = val;
            },
           
        },
        mounted() {
            // console.log(this.$store.state.user.loginUserInfo.role);   // 1 ,9 才有,10只能看
            
        },
        methods: {
            open(type){
                this.styleShow = type;
                console.log("总览："+this.styleShow);
            },
            closeMasterProject(){
                this.styleShow = true;
                this.miniSizeActive = false;
                this.$emit("closeMasterProject");
            },
            onClick () {
                this.selected = !this.selected;
                this.$refs['ReporterBar'].show(this.selected, 0);
                this.$refs['ReporterBar'].onClick();
                this.clickSelected = !this.clickSelected;
            },
            onCloseIconActive(){
                this.clickSelected = false;
            },
            minviewMasterProject(type){
                this.miniSizeActive = type;
            },
            closevisible(){
                this.visible = false;
                this.newName = "";
            },
            onBianji(){
                console.log(this.$store.state.user.loginUserInfo.role);
                if(this.$store.state.user.loginUserInfo.role == 10){
                    this.$message('您没有权限执行此操作！');
                    return;
                }

                this.visible = true;
            },
            onpushBtn(){
                let name = this.newName;
                let project_id = this.$store.state.app.projectId;
                let scheme_id = this.$store.state.app.planId;
                if(!name){
                    this.$message.error("请输入方案名称！");
                    return;
                }
                if(name.length>20){
                    this.$message.error("方案名称不超过20个字符");
                    return;
                }

                util.ajax.put("/scheme/"+project_id+"/"+scheme_id,{
                    scheme_name : name
                })
                .then(res=>{
                    // console.log(res);
                    if(res.data.code==201){
                        this.$message.success("方案名称修改成功！");
                        this.closevisible();
                    }else{
                        this.$message.error("方案名称修改失败！");
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .turbine_type{
        display: block;
        padding-left: 53px;
    }
    .turbine_type:nth-of-type(1){
        display: inline-block;
        padding-left: 0;
    }
    .plan-master{
        position: absolute;
        top: 150px;
        right: -270px;
        transition: 0.5s;
        width: 270px;
        /* height: 280px; */
        background:rgba(3,32,62,0.6);
        border-radius:6px 0px 0px 6px;
        padding: 25px 0 25px 25px;
        box-sizing: border-box;
        color:rgba(212,239,246,1);
    }
    .plan-master-content{
        font-size: 10px;
        padding: 0;
        margin: 0;
        li{
            padding-top: 10px;
        }
        span{
            color:rgba(51,200,111,1);
        }
        b{
            font-size: 20px;
        }
    }
    .closebtn{
        position: absolute;
        top: 1px;
        right: 14px;
        width: 15px;
        height: 15px;
        line-height: 15px;
        font-size: 12px;
        cursor: pointer;
    }
    .minviewbtn{
        position: absolute;
        top: 7px;
        right: 38px;
        z-index: 99999;
        line-height: 15px;
        font-size: 12px;
        cursor: pointer;
    }
    .minviewbtn span{
        font-size: 10px;
        font-weight: bold;
    }
    .minviewbtn span:hover{
        color: #fff;
    }
    .minIconBox{
        position: absolute;
        top: 50%;
        left: -25px;
        margin-top: -30px;
        width: 25px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: rgba(3,32,62,0.6);
        border-radius: 3px 0 0 3px;
        font-size: 13px;
        cursor: pointer;
    }
    .rightIcon{
        transform: rotate(180deg);
        font-size: 20px;
    }
    .title{
        font-size: 19px;
    }
    .title span{
        color: #fff;
    }
    .title .line{
        border-top: 1px solid rgba(212,239,246,1);
        width: 40px;
        display: inline-block;
        position: relative;
        top: -4px;
        right: -3px;
        margin-left: 5px;
    }  
    .title b{
        font-size: 16px;
        margin-right: 4px;
    }
    .plan-master-show{
        right: 0 !important;
    }
    .plan-master-show-mini{
        right: -270px !important;
    }
    .titleName{
        display: inline-block;
        width: 110px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .titleRight{
        display: inline-block;
        position: absolute;
        top: 24px;
        right: 40px;
    }
    .col{
        color:rgba(51,200,111,1);
        padding-left: 3px;
    }
    .title .clickIconActive{
        color:rgba(51,200,111,1);
    }
    .clickIcon{
        position: relative;
    }
    .guanbi:hover{
        color: #fff;
    }
    .bianjiicon{
        position: absolute;
        left: -15px;
        cursor: pointer;
    }
    /deep/ .el-dialog__close{
        position: relative;
        top: -1px;
        right: -13px;
    }
    /deep/ .el-dialog__header{
        height: 20px !important;
    }
    /deep/ .el-dialog__body{
        margin-top: 10px !important;
        padding-bottom: 20px !important;
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