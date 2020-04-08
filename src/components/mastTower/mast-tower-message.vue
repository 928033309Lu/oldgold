<template>
    <div class="towerBox">
        <el-dialog 
        :close-on-click-modal="false"
        custom-class="mast-tower-message"
        :width="styleAutoWid"
        :center="true"
        @close="close"
        :visible.sync="visible1">
            <div class="contentBox">
                <div class="title1">
                    <span style="margin-right: 5px;">[ 测风塔整体信息 ] </span>
                    <el-tooltip  
                    effect="light" 
                    popper-class="onmytooltip"
                    content="编辑"
                    :visible-arrow="false"
                    placement="top">
                    <span v-t-role="this.$store.state.user.loginUserInfo.role" 
                    @click="onBianji" v-show="!readonlyActive" style="cursor: pointer;"><icon name="bianji"></icon></span>
                    </el-tooltip>
                </div>
                <div class="content1">
                    <table class="mytable" border="0" cellspacing="0" cellpadding="0" width="100%">
        
                        <tr v-for="(item,index) of gridData" :key="index" :class="index==0 || index==1?'show':''">
                            <td v-for="(item2,index2) of item" :key="index2" class="paddSizebox">
                                <span :style="readonlyActive && index2>0 && index>=9 && index== 14?'padding: 0;position: relative;':'padding: 0 10px;position: relative;'" 
                                    v-for="(item3,index3) in item2" :key="index3">
                                    <span :style="readonlyActive && index2>0 && index>=5 && index!= 6 && index!= 7 && index!= 8 ?'display:none;': '' ">
                                            {{ index==8 ? endArr(item2[index3]) : startArr(item2[index3]) }}
                                    </span>
                                    <input :style="readonlyActive && index2>0 && index>=5 && index!= 6 && index!= 7 && index!= 8 && index!= 14 ? '' :'display:none;'" type="text"
                                     v-model="item2[index3]" class="binjiActive" @input="onBlur(index,index2,index3,item2[index3],$event)" />
                                     <el-select 
                                         v-if="readonlyActive && index2>0 && index>=9 && index== 14 "
                                     popper-class="gf-popper"
                                     v-model="item2[index3]" placeholder="请选择">
                                        <el-option
                                          v-for="item in options"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                        </el-option>
                                      </el-select>
                                      <span class="tip1">{{tit}}浮点数，可保留三位小数</span>
                                    <span class="tip2">{{tit2}}正数，可保留两位小数</span>	
                                    <span class="tip3">{{tit3}}，可保留两位小数</span>	
                                </span>
                            </td>	
                        </tr>
                            
                    </table>
                   
                   
                </div>
            </div>
            <div class="btn-bottom">
                <el-button class="baocunbtn" @click="onBaocun" v-show="readonlyActive">保存</el-button>
            </div>
            <!-- <div class="contentBox contentBox2">
                <div class="title2">
                    [ 测风塔参数分析 ] 
                </div>
                <div class="content2">
                    <table class="mytable" border="0" cellspacing="0" cellpadding="0" width="100%">

                        <tr v-for="(item,index) of gridData2" :key="index">
                            <td v-for="(item2,index2) of item" :key="index2">
                                <span style="padding: 0 20px;" v-for="(item3,index3) of item2" :key="index3">{{item3}}</span>
                            </td>		
                        </tr>
                            
                    </table>
                </div>
            </div> -->
        </el-dialog>

        <!-- <el-dialog 
        :close-on-click-modal="false"
        custom-class="mast-tower-message-imgbox"
        width="88%"
        height="88%"
        @close="close"
        :visible.sync="visible2">
           
            放大图

        </el-dialog> -->
    </div>
</template>
<script>
    import util from '@/libs/util';
    export default {
        data() {
            return{
                tit:"",
                tit2:"",
                tit3:"",
                nextTab: true,
                newvalue: "",
                readonlyActive:false,
                visible1: false,
                visible2: false,
                waitingData: false,
                styleAutoWid: document.documentElement.clientWidth*0.8 +"px",
                gridData : [
                [["abc"]],
                [["id"]],
                    [["测风塔号"]],
                    [["经度"]],
                    [["纬度"]],
                    [["海拔(m)"]],
                    [["通道高度(m)"]],
                    [["参考年选取开始"]],
                    [["参考年选取结束"]],

                    [["实测平均风速"]],
                    [["平均风切变"]],
                    [["A(m/s)"]],
                    [["K"]],
                    [["15m/s代表瑞流强度值"]],
                    [["主风能方向"]],
                    [["50年一遇最大风速(10min)(m/s)"]],
                    [["50年一遇极大风速(3s)(m/s)"]],
                    
                ],
                // gridData2 : [
                //     [["测风塔号"]],
                //     [["高度(m)"]],
                //     [["实测平均风速"]],
                //     [["平均风切变"]],
                //     [["A(m/s)"]],
                //     [["K"]],
                //     [["15m/s代表瑞流强度值"]],
                //     [["主风能方向"]],
                //     [["50年一遇最大风速(10min)(m/s)"]],
                //     [["50年一遇极大风速(3s)(m/s)"]]
                // ]
                options: [
                    {
                        value: 'N',
                        label: 'N'
                    }, 
                    {
                        value: 'NNE',
                        label: 'NNE'
                    }, 
                    {
                        value: 'NE',
                        label: 'NE'
                    }, 
                    {
                        value: 'ENE',
                        label: 'ENE'
                    }, 
                    {
                        value: 'E',
                        label: 'E'
                    },
                    {
                        value: 'ESE',
                        label: 'ESE'
                    },
                    {
                        value: 'SE',
                        label: 'SE'
                    },
                    {
                        value: 'SSE',
                        label: 'SSE'
                    },
                    {
                        value: 'S',
                        label: 'S'
                    },
                    {
                        value: 'SSW',
                        label: 'SSW'
                    },
                    {
                        value: 'SW',
                        label: 'SW'
                    },
                    {
                        value: 'WSW',
                        label: 'WSW'
                    },
                    {
                        value: 'W',
                        label: 'W'
                    },
                    {
                        value: 'WNW',
                        label: 'WNW'
                    },
                    {
                        value: 'NW',
                        label: 'NW'
                    },
                    {
                        value: 'NNW',
                        label: 'NNW'
                    }
                ]
            }
        },
        props:{
            mastInfoData:{
                type: Array,
                default:[]
            }
        },
        watch: {
            "mastInfoData":function(val){       
                // console.log(val);
                if(val){
                    this.transformData(val);
                }
            },
            "gridData":function(val){
                if(val[0].length>1){
                    this.waitingData = false;
                }  
            },
            waitingData () {
                this.$store.commit('globeLoading', {loading: this.waitingData, text: '正在获取数据...'});
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
        updated(){
            //屏幕变化触发
            let that = this
            window.onresize = function temp() {
				that.styleAutoWid = (document.documentElement.clientWidth*0.8)+"px";
				
            };
        },
        methods: {
            onBianji(){
                if(this.enManager){
                    this.$message('您没有权限执行此操作！');
                    return;
                }

                this.readonlyActive = true;
            },
            onBlur(index,index2,index3,val,ev){
                // console.log(index,index2,index3,val);
                var num = Number(val);
                // console.log(num);
                let yan = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/.test(num);
                // console.log(yan);
                if(!yan && index == 5){
                    this.tit3 = "大于等于0";
                    ev.target.parentNode.classList.add("redborder3");
                    this.nextTab = false;
                }else{
                    ev.target.parentNode.classList.remove("redborder3");
                    this.nextTab = true;
                }
                if(index==9 || index==11 || index==15 || index==16){
                    this.tit2 = "0~60";
                    // console.log(index,num);
                    //两位小数
                    let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(num);
                    // console.log(yan);
                    // console.log(num>60);
                    if( num>60){
                        ev.target.parentNode.classList.add("redborder2");
                        this.nextTab = false; 
                    }
                    else if(num<=0){
                        ev.target.parentNode.classList.add("redborder2");
                        this.nextTab = false;     
                    }
                    else if(!yan){
                        ev.target.parentNode.classList.add("redborder2");
                        this.nextTab = false;     
                    }
                    else{
                        ev.target.parentNode.classList.remove("redborder2");
                        this.nextTab = true;
                        
                    }
                }
                if(index==12){
                    this.tit2 = "0~10";
                    //两位小数
                    let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(num);
                    // console.log(yan);
                    if( num>10){
                        ev.target.parentNode.classList.add("redborder2");
                        this.nextTab = false; 
                    }
                    else if( num<0 ){
                        ev.target.parentNode.classList.add("redborder2");
                        this.nextTab = false; 
                    }
                    else if(!yan){
                        ev.target.parentNode.classList.add("redborder2");
                        this.nextTab = false; 
                    }else{
                        ev.target.parentNode.classList.remove("redborder2");
                        this.nextTab = true;
                        
                    }
                }
                if(index==10){
                    this.tit = "0~1";
                    let yan = /^(0(\.\d{1,3})?|1(\.0{1,3})?)$/.test(num);
                    // console.log(yan,val);
                    if(yan && val !=""){
                        
                        ev.target.parentNode.classList.remove("redborder1");
                        this.nextTab = true;
                    }else{
                        ev.target.parentNode.classList.add("redborder1");
                        this.nextTab = false;
                    }
                }
                if(index==13){
                    this.tit = "0~1.2";
                    let yan = /^[0-2]\.?[1-9]{0,3}$/.test(num);
                    // console.log(yan,val);
                    if(yan && num<= 1.2 && val!=""){
                        
                        ev.target.parentNode.classList.remove("redborder1");
                        this.nextTab = true;
                    }else{
                        ev.target.parentNode.classList.add("redborder1");
                        this.nextTab = false;
                    }
                }
                ///^(0(\.\d{1,2})?|1(\.0{1,3})?)$/   0-1之间
                //^[0-2]\.?[1-9]{0,3}$  
                // if(index==13 || index==10){
                //     //三位小数
                //     // let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,3})))$/.test(num);
                //     // // console.log("三位小数"+yan)
                //     // if(yan){
                //     //     ev.target.parentNode.classList.remove("redborder1");
                //     //     this.nextTab = true;
                //     // }else{
                //     //     ev.target.parentNode.classList.add("redborder1");
                //     //     this.nextTab = false;
                //     // }
                // }else{
                //     //两位小数
                //     let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(num);
                //     // console.log("两位小数"+yan)
                //     if(yan){
                //         ev.target.parentNode.classList.remove("redborder2");
                //         this.nextTab = true;
                //     }else{
                //         ev.target.parentNode.classList.add("redborder2");
                //         this.nextTab = false;
                //     }
                // }
            },
            onBaocun(){
                if(!this.nextTab){
                    this.$message.error("请正确输入数据！");
                    return;
                }
                this.readonlyActive = false;
                this.setDataList();
            },
            //测风塔数据
            getInputMast(){
                this.$emit("loadMastData",this.$store.state.app.projectId , true);
            },
            startArr(val){				
				if(val instanceof Array){
					val = val[0];
				}	
				return val;
			},
			endArr(val){				
				if(val instanceof Array){
					val = val[1];
				}		
				return val;
			},
            getMastInfo(){
                this.init();
                let project_id = this.$store.state.app.projectInfo.project_id;
                util.ajax.get('/mast_info', {
                    params:{
                        project_id: project_id
                    }
                }).then(res =>{
                    // console.log(res.data.data);
                    this.waitingData = false;
                    if(res.data.code == 200){
                        let mastData = res.data.data;  
                        this.transformData(mastData);
                    }else{
                        this.$message.error("测风塔整体信息获取失败！");
                        console.error(res.data.message)
                        return;
                    }
                }).catch(()=>{
                    this.$message.error("测风塔整体信息获取失败！");
                    this.waitingData = false;       
                })
            },
            transformData(val){
                
                val.forEach((item,index)=>{
                    this.gridData[0].push(item.mast_id);
                    this.gridData[1].push(item.mast_id);
                    this.gridData[2].push(item.mast_name);
					this.gridData[3].push(item.longitude);
					this.gridData[4].push(item.latitude);
					this.gridData[5].push(item.elevation);
					this.gridData[6].push(item.height);
					this.gridData[7].push(item.start_end_time);
                    this.gridData[8].push(item.start_end_time);
                    
                    this.gridData[9].push(item.avg_speed);
					this.gridData[10].push(item.wind_shear);
					this.gridData[11].push(item.a);
					this.gridData[12].push(item.k);
					this.gridData[13].push(item.turbulence15_avg);
					this.gridData[14].push(item.direction);
					this.gridData[15].push(item.max50_speed);
					this.gridData[16].push(item.extreme50_speed);
					
					// --------
					// this.gridData2[0].push(item.mast_name);
					// this.gridData2[1].push(item.height);
					// this.gridData2[2].push(item.avg_speed);
					// this.gridData2[3].push(item.wind_shear);
					// this.gridData2[4].push(item.a);
					// this.gridData2[5].push(item.k);
					// this.gridData2[6].push(item.turbulence15_avg);
					// this.gridData2[7].push(item.direction);
					// this.gridData2[8].push(item.max50_speed);
					// this.gridData2[9].push(item.extreme50_speed);
                })
                // console.log(this.gridData)
                // console.log(this.gridData2)
			},
            open(isOpen , val){
                console.log("项目ID："+this.$store.state.app.projectInfo.project_id);
                this.getMastInfo();
                if(val == "data"){
                    this.visible1 = isOpen;
                    this.waitingData = true;
                    if(this.gridData[0].length>1){
                        this.waitingData = false;
                    }
                    setTimeout(()=>{
                        this.waitingData = false;
                    },10000)
                }else{
                    this.visible2 = isOpen;
                }
            },
            close(){
                this.visible1 = true;
                if(this.readonlyActive){
                    this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
                        distinguishCancelAndClose: true,
                        // showCancelButton: false,
                        confirmButtonText: '保存',
                        cancelButtonText: '取消'
                    })
                    .then(()=>{
                        if(!this.nextTab){
                            this.$message.error("请正确输入数据！");
                            return;
                        }
                        //保存接口
                        this.setDataList();
                        this.visible1 = false;
                        this.$emit("closeTowerMessActive",false);
                    }).catch(()=>{
                        //获取接口
                        this.getDataList();
                    })

                }else{
                    this.readonlyActive = false;
                    this.visible1 = false;
                    this.$emit("closeTowerMessActive",false);
                }
            },
            getDataList(){
                // console.log("get");
                this.getMastInfo();
                this.readonlyActive = false;
            },
            setDataList(){
                // console.log(this.gridData);
                let arr = [...this.gridData]
                var keys = arr.shift();
                const result = keys.reduce((obj, key, i) => {
                    // console.log(obj,key);
                    obj[key] = arr.map((a,b) => a[i]);
                    return obj;
                }, {});
                delete result.abc
                // console.log(result);
                let obj={};
                obj.data=result;
                let projectId = this.$store.state.app.projectInfo.project_id;
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                util.ajax.put('/input_mast/'+projectId, obj ,config).then(res=>{
                    // console.log(res)
                    if(res.status == 200){
                        this.$message.success(res.data.data); 
                        //重新获取数据
                        this.getInputMast();
                    }
                })
                this.readonlyActive = false;
                
            },
            init(){
                this.gridData = [
                [["abc"]],
                [["id"]],
                    [["测风塔号"]],
                    [["经度"]],
                    [["纬度"]],
                    [["海拔(m)"]],
                    [["通道高度(m)"]],
                    [["参考年选取开始"]],
                    [["参考年选取结束"]],

                    [["实测平均风速"]],
                    [["平均风切变"]],
                    [["A(m/s)"]],
                    [["K"]],
                    [["15m/s代表瑞流强度值"]],
                    [["主风能方向"]],
                    [["50年一遇最大风速(10min)(m/s)"]],
                    [["50年一遇极大风速(3s)(m/s)"]],
                    
                ]
                // this.gridData2 = [
                //     [["测风塔号"]],
                //     [["高度(m)"]],
                //     [["实测平均风速"]],
                //     [["平均风切变"]],
                //     [["A(m/s)"]],
                //     [["K"]],
                //     [["15m/s代表瑞流强度值"]],
                //     [["主风能方向"]],
                //     [["50年一遇最大风速(10min)(m/s)"]],
                //     [["50年一遇极大风速(3s)(m/s)"]]
                // ]
            }  
        }
    }
</script>
<style lang="less" scoped>
.contentBox .Ayewu{
  display: none !important;
}
.towerBox /deep/ .el-dialog__headerbtn{
    top: 1px !important;
}
.towerBox /deep/  .el-dialog__header{
  background: rgba(212,239,246,0) !important;
}
.towerBox /deep/ .el-dialog__body{
	margin-top: 0 !important;
}
.gf-table.el-table{
    color: rgba(211,219,228,0.8) !important;
}
.towerBox /deep/ .has-gutter{
    color: rgba(211,219,228,0.8) !important;
}
.towerBox /deep/ .el-table__row>td:nth-of-type(1){
    background: rgba(51,200,111,0.2) !important;
}
/deep/ .el-input__icon{
    line-height: 2 !important;
}
/deep/ .el-input__suffix{
    right: -1px !important;
}
/deep/ .el-select{
    position: relative;
    left: -11px;
    width: 65px;
}
/deep/ .el-input--suffix .el-input__inner{
    padding-right: 13px !important;
    padding-left: 5px !important;
}
/* .el-table__row.hover-row{
    background: rgba(0, 0, 0, 0);
} */
input{
    width: 65px !important;
    border: 1px solid rgba(235,241,251,0.4) !important;
}
.paddSizebox{
    display: flex;
    justify-content: center;
}
.paddSize>span{
    flex: 1;
}
.towerBox /deep/ .cell{
    text-align: left !important;
    padding-left: 10px;
}
.towerBox /deep/ .el-dialog{
    margin-top: 8vh !important;
}
.contentBox2{
    position: relative;
}
.contentBox{
    width: 100%;
    height: 100%;
    color: rgba(211,219,228,0.8);
    .title2{
        font-size: 16px;
        height: 30px;
        line-height: 30px;  
        position: absolute;
        top: 5px;
        z-index: 100;
    }
    .title1{
        font-size: 16px;
        height: 30px;
        line-height: 30px; 
        position: absolute;
        top: 5px;
        z-index: 100;
    }
    .content1{
        padding-top: 10px;
    }
    .content2{
        padding-top: 40px;
    }
}
.mytable{
    border: 1px solid rgba(211, 219, 228, 0.6);
	
}
.mytable tr{
    border-bottom: 1px solid rgba(211, 219, 228, 0.6);
    display: flex;
    td{
        flex: 1;
        
        height: 31px;
	    line-height: 31px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 240px;
    }
}
.mytable tr:last-child{
    border-bottom: none ;
}
.mytable tr td:nth-of-type(1){
    flex: none !important;
	background: rgba(51,200,111,0.2);
	display: inline-block;
	width: 220px !important;	
    text-align: left;
    padding-left: 10px;
}
.mytable tr td:nth-of-type(1)>span{
    padding: 0 !important;
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
.mytable .binjiActive{
    height: 25px !important;
    text-align: center;
    color: rgba(211, 219, 228, 0.8) !important;
    margin-left: -20px;
    font-size: 14px;
    opacity: 0.7 !important;
    border: none;
    left: 0px;
    top: -7px;
}
.show{
    display: none !important;
}
.towerBox td{
    overflow: inherit !important;
}
.towerBox input{
 outline:  none;
}
.tip1,.tip2,.tip3{
display: none;
}
.towerBox .redborder1{
    position: relative;
    .tip2,.tip3{
        display: none;
    }
    .tip1{
        display: block;
        position: absolute;
        top: -13px;
        left: -10px;
        font-size: 8px;
        height: 13px;
        line-height: 13px;
        color: red;
    }
    input{
        border: 1px solid red !important;
    }
}
.towerBox .redborder2{
    position: relative;
    .tip1,.tip3{
        display: none;
    }
    .tip2{
        display: block;
        position: absolute;
        top: -13px;
        left: -10px;
        font-size: 8px;
        height: 13px;
        line-height: 13px;
        color: red;
    }
    input{
        border: 1px solid red !important;
    }
}
.towerBox .redborder3{
    position: relative;
    .tip1,.tip2{
        display: none;
    }
    .tip3{
        display: block;
        position: absolute;
        top: -13px;
        left: -10px;
        font-size: 8px;
        height: 13px;
        line-height: 13px;
        color: red;
    }
    input{
        border: 1px solid red !important;
    }
}
/* 大于1650。。。小于1700。。。 */
@media screen and (min-width:1650px) and (max-width:1700px){
   
    .mytable tr td{
        height: 36px !important;
	    line-height: 36px !important;
    }
}
/* 大于1390。。。小于1500。。。 */
@media screen and (min-width:1390px) and (max-width:1500px){
   
    .mytable tr td{
        height: 35px !important;
	    line-height: 35px !important;
    }
}
/* 大于1300。。。小于1390。。。 */
@media screen and (min-width:1300px) and (max-width:1390px){
    /* .towerBox /deep/ .el-dialog{
        margin-top: 7vh !important;
    } */
    .mytable tr td{
        height: 26px !important;
	    line-height: 26px !important;
    }
}
/*分辨率低于1390---900....，采用下面的样式*/
@media screen and (max-device-width:1390px) and (max-device-height:900px){	
    .mytable tr td{
        height: 27px !important;
	    line-height: 27px !important;
    }
}
/*分辨率低于1390....，采用下面的样式*/
@media screen and (max-device-width:1390px) and (max-device-height:750px){	
    .mytable tr td{
        height: 25px !important;
	    line-height: 25px !important;
    }
}
/*分辨率低于1390....，采用下面的样式*/
@media screen and (max-device-width:1390px) and (max-device-height:700px){	
    .towerBox .title1,.towerBox .title2{
        font-size: 15px;
    }
    .mytable tr td{
        height: 20px !important;
        line-height: 20px !important;
        font-size: 13px;
    }
}
/*分辨率低于1200....，采用下面的样式*/
@media screen and (max-device-width:1200px) {	
    .towerBox .title1,.towerBox .title2{
        font-size: 16px;
    }
    .mytable tr td{
        height: 30px !important;
        line-height: 30px !important;
        font-size: 14px;
    }
}
/*分辨率低于1100....，采用下面的样式*/
@media screen and (max-device-width:1100px) {	
    .towerBox .title1,.towerBox .title2{
        font-size: 16px;
    }
    .mytable tr td{
        height: 27px !important;
        line-height: 27px !important;
        font-size: 14px;
    }
}
/*分辨率低于900....，采用下面的样式*/
@media screen and (max-device-width:900px) {	
    .towerBox .title1,.towerBox .title2{
        font-size: 13px;
    }
    .mytable tr td{
        height: 18px !important;
        line-height: 18px !important;
        font-size: 12px;
    }
}
</style>