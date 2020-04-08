<template>
    <el-dialog 
        :close-on-click-modal="true"
        custom-class="input-tempalte"
        width="740px"
        :center="true"
        @close="close"
        :visible.sync="inputTemplateVisible">
		<div class="content">
			<p class="title">
                风资源总结  
                <el-tooltip class="item" 
                effect="light" 
                popper-class="onmytooltip"
                content="编辑"
                :visible-arrow="false"
                placement="top">
                <span @click="onBianji" v-show="!readonlyActive" style="cursor: pointer;"><icon name="bianji"></icon></span>
                </el-tooltip>
            </p>
			<div v-for="(item,index) of data">
				<div class="title_bg">
                    <div>
                        <el-tooltip class="item" 
                        effect="light" 
                        popper-class="onmytooltip"
                        content="选择图标"
                        :disabled="!readonlyActive"
                        :visible-arrow="false"
                        placement="top">
                        <span @click="iconChange(item,index)"><i class="iconfont" :class="item.icon"></i></span>
                        </el-tooltip>
                        <el-input v-model="item.title" :readonly="!readonlyActive"></el-input>
                    </div>
                    <span></span>
                    <el-tooltip class="item" 
                    effect="light" 
                    popper-class="onmytooltip"
                    content="添加方形字符"
                    :visible-arrow="false"
                    placement="top">
                    <span class="fuhao" v-show="readonlyActive" @click="addfuhao(item,index)">
                        <i class="iconfont icon-duanlayangshi-dian--"></i>
                    </span>
                    </el-tooltip>
                    <ul class="selectBox" v-show="item.iconActive">
                        <li @click="iconClick('feng',item,index)"><i class="iconfont icon-feng"></i></li>
                        <li @click="iconClick('fengxiang',item,index)"><i class="iconfont icon-fengxiang"></i></li>
                        <li @click="iconClick('fenbu',item,index)"><i class="iconfont icon-fenbu"></i></li>
                        <li @click="iconClick('tubiaozhexiantu',item,index)"><i class="iconfont icon-tubiaozhexiantu"></i></li>
                        <li @click="iconClick('water',item,index)"><i class="iconfont icon-water"></i></li>
                        <li @click="iconClick('jinggao',item,index)"><i class="iconfont icon-jinggao"></i></li>
                    </ul>
                </div>
                
                <div class="input_content">
                    <el-input
                      type="textarea"
                      autosize
                      :readonly="!readonlyActive"
                      show-word-limit
                      
                      v-model="item.textarea">
                    </el-input>
                </div>
				
			</div>
			
        </div>
        <div class="btn-bottom">
            <el-button class="baocunbtn" @click="onBaocun" v-show="readonlyActive">保存</el-button>
        </div>

	</el-dialog>
</template>
<script>
    import util from '../../libs/util';
    export default{
        name:"input-templte",
        data() {
			return {
                readonlyActive:false,
                inputTemplateVisible: false,
				data:[
					{
						title:"风速",
                        textarea:"",
                        icon: "icon-feng",
                        iconActive: false
					},{
						title:"风向",
                        textarea:"",
                        icon: "icon-fengxiang",
                        iconActive: false
					},{
						title:"威布尔分布",
                        textarea:"",
                        icon: "icon-fenbu",
                        iconActive: false
					},{
						title:"切变",
                        textarea:"",
                        icon: "icon-tubiaozhexiantu",
                        iconActive: false
					},{
						title:"湍流",
                        textarea:"",
                        icon: "icon-water",
                        iconActive: false
					},{
						title:"50年一遇风速",
                        textarea:"",
                        icon: "icon-jinggao",
                        iconActive: false
					}
				]
				
				
			}
        },
        watch: {
            "inputTemplateVisible":function(val){
                if(val){
                    this.getDataList();
                }
            }
        },
        computed:{
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role === 10){
                    return true;
                }else{
                    return false;
                }
            }
        },
        methods: {
            onBianji(){
                if(this.enManager){
                    this.$message('您没有权限执行此操作！');
                    return;
                }

                this.readonlyActive = !this.readonlyActive;
            },
            defaultInfo(){
                this.data = [
					{
						title:"风速",
                        textarea:"",
                        icon: "icon-feng",
                        iconActive: false
					},{
						title:"风向",
                        textarea:"",
                        icon: "icon-fengxiang",
                        iconActive: false
					},{
						title:"威布尔分布",
                        textarea:"",
                        icon: "icon-fenbu",
                        iconActive: false
					},{
						title:"切变",
                        textarea:"",
                        icon: "icon-tubiaozhexiantu",
                        iconActive: false
					},{
						title:"湍流",
                        textarea:"",
                        icon: "icon-water",
                        iconActive: false
					},{
						title:"50年一遇风速",
                        textarea:"",
                        icon: "icon-jinggao",
                        iconActive: false
					}
				]
            },
			close() {
                this.inputTemplateVisible = true;
                if(this.readonlyActive){
                    this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
                        distinguishCancelAndClose: true,
                        showCancelButton: false,
                        confirmButtonText: '保存'
                    })
                    .then(()=>{
                        this.setDataList();
                        this.inputTemplateVisible = false;
                        this.readonlyActive = false;
                        this.$emit("inputTemplate", false);
                        this.defaultInfo();
                    }).catch(()=>{

                       
                    })
                }else{
                    this.inputTemplateVisible = false;
                    this.readonlyActive = false;
                    this.$emit("inputTemplate", false);
                    this.defaultInfo();
                }
                // console.log(this.readonlyActive)
            },
            //获取数据
            getDataList(){
                let project_id = this.$store.state.app.projectInfo.project_id;
                util.ajax.get("/user_remarks/"+ project_id)
                .then((res)=>{
                    // console.log(res)
                    if(res.data.code == 200){
                        if(res.data.data.length > 0){
                            this.data = res.data.data
                        }else{
                            this.defaultInfo();
                        }
                    }
                })
            },
            //保存数据
            setDataList(){
                let project_id = this.$store.state.app.projectInfo.project_id;
                let obj={};
                obj.data=this.data;
                let config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                util.ajax.post("/user_remarks/"+ project_id, obj,config)
                .then((res)=>{
                    // console.log(res)
                    if(res.data.code == 200){
                        this.data = res.data.data
                    }
                })
                this.$message.success("数据保存成功！");  
            },
            //保存事件
            onBaocun(){
                this.readonlyActive = !this.readonlyActive;
                this.setDataList();
            },
            //开启字体图标列表
            iconChange(item,index){
                // console.log(item,index)
                if(this.readonlyActive){
                    item.iconActive = true;
                }
            },
            //改变字体图标
            iconClick(type, item,index){
                switch (type) {
                    case 'feng':
                        item.icon = "icon-feng";
                        item.iconActive = false;
                    break;
                    case 'fengxiang':
                        item.icon = "icon-fengxiang";
                        item.iconActive = false;
                    break;
                    case 'fenbu':
                        item.icon = "icon-fenbu";
                        item.iconActive = false;
                    break;
                    case 'tubiaozhexiantu':
                        item.icon = "icon-tubiaozhexiantu";
                        item.iconActive = false;
                    break;
                    case 'water':
                        item.icon = "icon-water";
                        item.iconActive = false;
                    break;
                    case 'jinggao':
                        item.icon = "icon-jinggao";
                        item.iconActive = false;
                    break;
                }
            },
            //添加字符
			addfuhao(item){
				console.log(item)
				item.textarea = item.textarea+"■";
			}
		}
    }
</script>
<style lang="less" scoped>
    /deep/ .input-tempalte{
        margin-top: 8vh !important;
    }
    /deep/ .el-dialog__headerbtn{
        top: 0 !important;
        outline: none;
    }
    /deep/ .el-dialog__header{
        /* background: rgba(0, 0, 0, 0) !important; */
        height: 35px;
        padding: 0 !important;
        color: #D4EFF6;
    }
    /deep/ .el-dialog__body{
        margin-top: 0 !important;
        padding-left: 18px !important;
        padding-bottom: 20px !important;
    }
    /deep/ .el-input__inner{
        border: none !important;
        padding: 0 8px !important;
        opacity:1 !important;
        color:rgba(212,239,246,1) !important;
    }
    /deep/ .el-textarea__inner{
       height: 190px !important;
       border: none !important;
       opacity: 1 !important;
       padding: 0 10px !important;
    }
    /deep/ .el-input__count{
       opacity: 0 !important;
       color:rgba(212,239,246,0.9) !important;
    }
    .content{

		display: flex;
		flex-wrap: wrap;
        box-sizing: border-box;
        color:rgba(212,239,246,1);
		.title{
			position: absolute;
			top: 7px;
			left: 15px;
            margin: 0;
            &>span{
                padding: 0 10px;
            }
		}
		.title_bg{
            height:30px;
            line-height: 30px;
            background:rgba(51,200,111,0.4);
            position: relative;
            display: flex;
            justify-content: space-between;
            span:nth-of-type(1){
                cursor: pointer;
                padding-left: 10px;
            }
            div:nth-of-type(1){
                display: flex;
            }
            .fuhao{
                padding-right: 7px;
                cursor: pointer;
                i{
                    font-size: 24px;
                }
            }
            .selectBox{
                padding: 0 4px;
                margin: 0;
                position: absolute;
                top: 26px;
                left: 5px;
                z-index: 233;
                background:rgba(3,32,62,8);
                border-radius:2px;
                height: 130px;
                /* display: none; */
                &>li{
                    cursor: pointer;
                    height: 21px;
                    line-height: 21px;
                }
            }
            /* .iconActive{
                display: block;
            } */
        }
		&>div{
            margin-top: 10px;
            margin-left: 10px;
			width: 220px;
			position: relative;
			
        }
        .input_content{
            border:1px solid rgba(211,219,228,0.4);
            border-top: none;
            height: 200px;
            overflow: hidden;
            font-size: 14px;
        }
    }
    .btn-bottom{
        width: 100%;
        margin: 10px 0 0 0;
        display: flex;
        justify-content: center;
        .baocunbtn{
            width:100px;
            height:40px;
            background:rgba(51,200,111,0.6);
            border-radius:4px;
            border: none;
            color:rgba(212,239,246,1);
        }
    }
    .icon-water{
        font-size:10px;
    }
</style>