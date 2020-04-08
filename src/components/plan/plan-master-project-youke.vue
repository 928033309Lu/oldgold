<template>
    <div class="plan-master plan-master-show" :class="miniSizeActive ? 'plan-master-show-mini' : '' " v-show="newOpenShow">
        <div class="minIconBox" v-if="miniSizeActive" @click="minviewMasterProject(false)">
            <icon class="rightIcon" name="arrow-right-copy"></icon>
        </div>
        <div class="minviewbtn" @click="minviewMasterProject(true)" style="margin-right: -25px;">
            <span>——</span>
        </div>
        
        <div class="title titleyouke">
            <span v-if="readonlyActive" ref="titleName" class="titleName"> {{mastData.scheme_name}} </span> 
            <span v-if="!readonlyActive" ref="titleName" class="titleName"> <el-input type="text" v-model="mastData.scheme_name"  /> </span> 
            <span class="titleRight">
                <span v-if="readonlyActive" class="bianjiicon" @click="onBianjiYouke">
                    <icon name="bianji" style="width: 15px;height: 15px;"></icon>
                </span>
                <span v-if="!readonlyActive" class="bianjiicon" @click="onBaocunYouke">
                    <icon name="baocun" style="width: 15px;height: 15px;"></icon>
                </span>
            </span>
        </div>
        
        <ul class="plan-master-content" v-if="isShowChengguo"> 
            <li v-if="readonlyActive"> <span class="total_hours"><b> {{mastData.equivalent_hours}} </b> <span class="col"> h</span></span> 全场等效上网小时数</li>
            <li  v-if="!readonlyActive" ref="equivalent_hours" class="titleyouke"> <span> <el-input type="text" v-model="mastData.equivalent_hours" @blur="inputCheck(mastData.equivalent_hours ,'equivalent_hours')" @input="inputCheck(mastData.equivalent_hours ,'equivalent_hours')"  /> <span class="col"> h</span></span> 全场等效上网小时数  <span class="errorTip">正数，可保留三位小数</span></li>
            <li> 机型方案：
                <span class="turbine_type" v-for="(item,index) of mastData.turbine_type" :key="index">{{item}}</span> 
            </li>
            <li> 轮毂高度：
                <span class="turbine_type" v-for="(item,index) of mastData.height" :key="index"> <span>{{item}}</span> <span class="col"> m</span> </span>
            </li>
            <li> 项目总容量：<span> {{mastData.total_capacity}} </span> <span class="col"> MW</span></li>
            <li> 全场平均风速：<span>{{mastData.average_speed}}</span> <span class="col"> m/s</span></li>
            <li> 全场理论发电量：<span>{{mastData.total_generation_capacity}}</span> <span class="col"> MWh/y</span></li>
            <li v-if="readonlyActive"> 综合折减系数(不含尾流)：<span>{{mastData.reduction_factor}}</span> </li>
            <li v-if="!readonlyActive" ref="reduction_factor"> 综合折减系数(不含尾流)：<span> <el-input type="text" v-model="mastData.reduction_factor" @blur="inputCheck(mastData.reduction_factor ,'reduction_factor')" @input="inputCheck(mastData.reduction_factor ,'reduction_factor')" /> </span>  <span class="errorTip">正数，可保留三位小数</span></li>
            <li> 全场等效上网电量：<span>{{mastData.total_energy}}</span> <span class="col"> MWh/y</span></li>

            <li v-if="readonlyActive"> 动态总投资：<span>{{mastData.total_invested}}</span> <span class="col"> 万元</span></li>
            <li v-if="!readonlyActive" ref="total_invested"> 动态总投资：<span> <el-input type="text" v-model="mastData.total_invested" @blur="inputCheck(mastData.total_invested ,'total_invested')" @input="inputCheck(mastData.total_invested ,'total_invested')" /> </span> <span class="col"> 万元</span>  <span class="errorTip">正数，可保留三位小数</span></li>
            <li v-if="readonlyActive"> 度电成本(VAT&CIT)：<span>{{mastData.vat_cit}}</span> <span class="col"> 元/KW</span></li>
            <li v-if="!readonlyActive" ref="vat_cit"> 度电成本(VAT&CIT)：<span> <el-input type="text" v-model="mastData.vat_cit" @blur="inputCheck(mastData.vat_cit ,'vat_cit')" @input="inputCheck(mastData.vat_cit ,'vat_cit')" /> </span> <span class="col"> 元/KW</span>   <span class="errorTip">正数，可保留三位小数</span></li>
            <li v-if="readonlyActive"> Pt(投资回收期)：<span>{{mastData.pt}}</span> <span class="col"> 年</span></li>
            <li v-if="!readonlyActive" ref="pt"> Pt(投资回收期)：<span> <el-input type="text" v-model="mastData.pt" @blur="inputCheck(mastData.pt ,'pt')" @input="inputCheck(mastData.pt ,'pt')" /> </span> <span class="col"> 年</span>  <span class="errorTip">正数，可保留三位小数</span></li>
            <li v-if="readonlyActive"> 投资净现值：<span>{{mastData.n_p_v}}</span> <span class="col"> 万元</span></li>
            <li v-if="!readonlyActive" ref="n_p_v"> 投资净现值：<span> <el-input type="text" v-model="mastData.n_p_v" @blur="inputCheck(mastData.n_p_v ,'n_p_v')" @input="inputCheck(mastData.n_p_v ,'n_p_v')" /> </span> <span class="col"> 万元</span>  <span class="errorTip">正数，可保留三位小数</span></li>
            <li v-if="readonlyActive"> 单位千瓦造价：<span>{{mastData.cost_per_kilowatt}}</span> <span class="col"> 元/KW</span></li>
            <li v-if="!readonlyActive" ref="cost_per_kilowatt"> 单位千瓦造价：<span> <el-input type="text" v-model="mastData.cost_per_kilowatt" @blur="inputCheck(mastData.cost_per_kilowatt ,'cost_per_kilowatt')" @input="inputCheck(mastData.cost_per_kilowatt ,'cost_per_kilowatt')"  /> </span> <span class="col"> 元/KW</span>  <span class="errorTip">正数，可保留三位小数</span></li>
        </ul>
        <ul class="plan-master-content" v-if="!isShowChengguo"> 
            <li v-if="readonlyActive" class="titleyouke"> <span class="total_hours"><b>{{mastData.equivalent_hours}}</b> <span class="col"> h</span></span> 全场等效上网小时数</li>
            <li  v-if="!readonlyActive" ref="equivalent_hours" class="titleyouke"> <span> <el-input type="text" v-model="mastData.equivalent_hours" @blur="inputCheck(mastData.equivalent_hours ,'equivalent_hours')" @input="inputCheck(mastData.equivalent_hours ,'equivalent_hours')"  /> <span class="col"> h</span></span> 全场等效上网小时数  <span class="errorTip">正数，可保留三位小数</span></li>
            <li> 机型方案：
                <span class="turbine_type" v-for="(item,index) of mastData.turbine_type" :key="index">{{item}}</span> 
            </li>
            <li> 轮毂高度：
                <span class="turbine_type" v-for="(item,index) of mastData.height" :key="index"> <span>{{item}}</span> <span class="col"> m</span> </span>
            </li>
            <li> 项目总容量：<span>{{mastData.total_capacity}}</span> <span class="col"> MW</span></li>

            <li v-if="readonlyActive"> 动态总投资：<span>{{mastData.total_invested}}</span> <span class="col"> 万元</span></li>
            <li v-if="!readonlyActive" ref="total_invested"> 动态总投资：<span> <el-input type="text" v-model="mastData.total_invested" @blur="inputCheck(mastData.total_invested ,'total_invested')" @input="inputCheck(mastData.total_invested ,'total_invested')" /> </span> <span class="col"> 万元</span>  <span class="errorTip">正数，可保留三位小数</span></li>
            <li v-if="readonlyActive"> 度电成本(VAT&CIT)：<span>{{mastData.vat_cit}}</span> <span class="col"> 元/KW</span></li>
            <li v-if="!readonlyActive" ref="vat_cit"> 度电成本(VAT&CIT)：<span> <el-input type="text" v-model="mastData.vat_cit" @blur="inputCheck(mastData.vat_cit ,'vat_cit')" @input="inputCheck(mastData.vat_cit ,'vat_cit')" /> </span> <span class="col"> 元/KW</span>   <span class="errorTip">正数，可保留三位小数</span></li>
            <li v-if="readonlyActive"> Pt(投资回收期)：<span>{{mastData.pt}}</span> <span class="col"> 年</span></li>
            <li v-if="!readonlyActive" ref="pt"> Pt(投资回收期)：<span> <el-input type="text" v-model="mastData.pt" @blur="inputCheck(mastData.pt ,'pt')" @input="inputCheck(mastData.pt ,'pt')" /> </span> <span class="col"> 年</span>  <span class="errorTip">正数，可保留三位小数</span></li>
            <li v-if="readonlyActive"> 投资净现值：<span>{{mastData.n_p_v}}</span> <span class="col"> 万元</span></li>
            <li v-if="!readonlyActive" ref="n_p_v"> 投资净现值：<span> <el-input type="text" v-model="mastData.n_p_v" @blur="inputCheck(mastData.n_p_v ,'n_p_v')" @input="inputCheck(mastData.n_p_v ,'n_p_v')" /> </span> <span class="col"> 万元</span>  <span class="errorTip">正数，可保留三位小数</span></li>
            <li v-if="readonlyActive"> 单位千瓦造价：<span>{{mastData.cost_per_kilowatt}}</span> <span class="col"> 元/KW</span></li>
            <li v-if="!readonlyActive" ref="cost_per_kilowatt"> 单位千瓦造价：<span> <el-input type="text" v-model="mastData.cost_per_kilowatt" @blur="inputCheck(mastData.cost_per_kilowatt ,'cost_per_kilowatt')" @input="inputCheck(mastData.cost_per_kilowatt ,'cost_per_kilowatt')"  /> </span> <span class="col"> 元/KW</span>  <span class="errorTip">正数，可保留三位小数</span></li>
        </ul>
        
    </div>
</template>
<script>
    import util from '@/libs/util';
    import ReporterBar from '../function/reporter-bar';
    export default {
        name:"plan-master-project-youke",
        components: { ReporterBar },
        data() {
            return{
                nowProjectId : 0,
                newOpenShow : false,

                isShowChengguo: false,
                visible:false,
                newName: "",
                miniSizeActive: false,
                styleShow:false,
                offShow: false,
                mastData:{
                    cost_per_kilowatt: "",
                    equivalent_hours: "",
                    id: "",
                    n_p_v: "",
                    project_id: "",
                    pt: "",
                    total_invested: "",
                    vat_cit: "",

                    name: "",
                    // total_hours: "",
                    turbine_type: [],
                    height: [],
                    total_capacity: "",
                    average_speed: "",
                    total_generation_capacity: "",
                    reduction_factor: "",
                    total_energy: ""
                },
                baocunData:{},
                projectName:null,
                selected: false,
                clickSelected: false,
                readonlyActive: true,
                rulesActive1: true,
                rulesActive2: true,
                rulesActive3: true,
                rulesActive4: true,
                rulesActive5: true,
                rulesActive6: true,
                rulesActive7: true
            }
        },
        computed:{
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                    return true;
                }
            }
        },
        watch: {
            "$store.state.app.planMastProjectData":function(val){
                // this.mastData = val;
                this.mastData = {
                    cost_per_kilowatt: "",
                    equivalent_hours: "",
                    id: "",
                    n_p_v: "",
                    project_id: "",
                    pt: "",
                    total_invested: "",
                    vat_cit: "",

                    scheme_name: "",
                    // total_hours: val.total_hours,
                    turbine_type: val.turbine_type,
                    height: val.height,
                    total_capacity: val.total_capacity,
                    average_speed: val.average_speed,
                    total_generation_capacity: val.total_generation_capacity,
                    reduction_factor: val.reduction_factor,
                    total_energy: val.total_energy
                }
                this.getJingpingProjectData();
            },
            "$store.state.app.currentPlanData.scheme_name":function(val){
                this.projectName = val;
            },
           
            "$store.state.app.noneChengguo":function(val){
                console.log(val);
                //不选择上传“发电量成果”，则方案概览中只显示名称、等效小时数；
                // 且 点击单个风机不显示发电量成果窗口；
                this.isShowChengguo = false;
                if(val){
                    this.isShowChengguo = true;
                }
            }
        },
        mounted() {
           
        },
        methods: {
            //游客模式
            // 编辑验证
            inputCheck(val , type ){
                // console.log(val, type );
                //尾流
                if(type == "reduction_factor"){
                    if(isNaN(val)){
                        //请输入数字
                        this.$refs['reduction_factor'].classList.add("borderRed7");
                        this.rulesActive7 = false;
                    }else{
                        this.$refs['reduction_factor'].className = "";
                        this.rulesActive7 = true;
                        let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(Number(val));
                        if(!yan){
                            //正数保留3位小数
                            this.$refs['reduction_factor'].classList.add("borderRed7");
                            this.rulesActive7 = false;
                        }else{
                            this.$refs['reduction_factor'].className = "";
                            this.rulesActive7 = true;
                        }
                    }
                }
                //等效小时数
                if(type == "equivalent_hours"){
                    if(isNaN(val)){
                        //请输入数字
                        this.$refs['equivalent_hours'].classList.add("borderRed");
                        this.rulesActive1 = false;
                    }else{
                        this.$refs['equivalent_hours'].className = "titleyouke";
                        this.rulesActive1 = true;
                        let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(Number(val));
                        if(!yan){
                            //正数保留3位小数
                            this.$refs['equivalent_hours'].classList.add("borderRed");
                            this.rulesActive1 = false;
                        }else{
                            this.$refs['equivalent_hours'].className = "titleyouke";
                            this.rulesActive1 = true;
                        }
                    }
                }
                // 动态总投资  
                if(type == "total_invested"){
                    if(isNaN(val)){
                        //请输入数字
                        this.$refs['total_invested'].classList.add("borderRed2");
                        this.rulesActive2 = false;
                    }else{
                        this.$refs['total_invested'].className = "";
                        this.rulesActive2 = true;
                        let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(Number(val));
                        if(!yan){
                            //正数保留3位小数
                            this.$refs['total_invested'].classList.add("borderRed2");
                            this.rulesActive2 = false;
                        }else{
                            this.$refs['total_invested'].className = "";
                            this.rulesActive2 = true;
                        }
                    }
                }
                // 投资净现值
                if(type == "n_p_v"){
                    if(isNaN(val)){
                        //请输入数字
                        this.$refs['n_p_v'].classList.add("borderRed2");
                        this.rulesActive3 = false;
                    }else{
                        this.$refs['n_p_v'].className = "";
                        this.rulesActive3 = true;
                        let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(Number(val));
                        if(!yan){
                            //正数保留3位小数
                            this.$refs['n_p_v'].classList.add("borderRed2");
                            this.rulesActive3 = false;
                        }else{
                            this.$refs['n_p_v'].className = "";
                            this.rulesActive3 = true;
                        }
                    }
                }
                // 度电成本
                if(type == "vat_cit"){
                    if(isNaN(val)){
                        //请输入数字
                        this.$refs['vat_cit'].classList.add("borderRed3");
                        this.rulesActive4 = false;
                    }else{
                        this.$refs['vat_cit'].className = "";
                        this.rulesActive4 = true;
                        let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(Number(val));
                        if(!yan){
                            //正数保留3位小数
                            this.$refs['vat_cit'].classList.add("borderRed3");
                            this.rulesActive4 = false;
                        }else{
                            this.$refs['vat_cit'].className = "";
                            this.rulesActive4 = true;
                        }
                    }
                }
                // pt
                if(type == "pt"){
                    if(isNaN(val)){
                        //请输入数字
                        this.$refs['pt'].classList.add("borderRed4");
                        this.rulesActive5 = false;
                    }else{
                        this.$refs['pt'].className = "";
                        this.rulesActive5 = true;
                        let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(Number(val));
                        if(!yan){
                            //正数保留3位小数
                            this.$refs['pt'].classList.add("borderRed4");
                            this.rulesActive5 = false;
                        }else{
                            this.$refs['pt'].className = "";
                            this.rulesActive5 = true;
                        }
                    }
                }
                // 单位千瓦造价
                if(type == "cost_per_kilowatt"){
                    if(isNaN(val)){
                        //请输入数字
                        this.$refs['cost_per_kilowatt'].classList.add("borderRed5");
                        this.rulesActive6 = false;
                    }else{
                        this.$refs['cost_per_kilowatt'].className = "";
                        this.rulesActive6 = true;
                        let yan = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(Number(val));
                        if(!yan){
                            //正数保留3位小数
                            this.$refs['cost_per_kilowatt'].classList.add("borderRed5");
                            this.rulesActive6 = false;
                        }else{
                            this.$refs['cost_per_kilowatt'].className = "";
                            this.rulesActive6 = true;
                        }
                    }
                }
            },
            //
            show(projectId){
                this.nowProjectId = projectId;
                this.newOpenShow = true;
            },
            onBianjiYouke(){
                this.readonlyActive = false;
            },
            //保存
            onBaocunYouke(){
                if(!this.rulesActive7 || !this.rulesActive1 || !this.rulesActive2 || !this.rulesActive3 || !this.rulesActive4 || !this.rulesActive5 || !this.rulesActive6){
                    return;
                }
                this.readonlyActive = true;
                this.baocunData = {...this.mastData};
                util.ajax.put('/reveal_scheme_supplement/'+this.$store.state.app.projectId,{
                    equivalent_hours : this.mastData.equivalent_hours,
                    vat_cit : this.mastData.vat_cit,
                    n_p_v : this.mastData.n_p_v,
                    pt : this.mastData.pt,
                    total_invested : this.mastData.total_invested,
                    cost_per_kilowatt : this.mastData.cost_per_kilowatt,
                    reduction_factor : this.mastData.reduction_factor,
                    scheme_name : this.mastData.scheme_name
                })
                .then((res)=>{
                    console.log(res);
                    if(res.data.code == 201){
                        this.$message.success("数据更新成功！");
                    }else{
                        this.$message.error("数据更新失败！");
                        this.mastData = this.baocunData;
                    }
                })
                .catch((err)=>{
                    console.error(err);
                })
            },
            //新增渲染经评数据
            getJingpingProjectData(){
                util.ajax.get('/reveal_scheme_supplement/'+this.$store.state.app.projectId)
                .then((res)=>{
                    if(res.data.code == 200){
                        // console.log(res);
                        
                        this.mastData.cost_per_kilowatt = res.data.data.cost_per_kilowatt;
                        this.mastData.equivalent_hours = res.data.data.equivalent_hours;
                        this.mastData.id = res.data.data.id;
                        this.mastData.n_p_v = res.data.data.n_p_v;
                        this.mastData.project_id = res.data.data.project_id;
                        this.mastData.pt = res.data.data.pt;
                        this.mastData.total_invested = res.data.data.total_invested;
                        this.mastData.vat_cit = res.data.data.vat_cit;
                            
                        this.mastData.scheme_name = res.data.data.scheme_name || "默认方案";
                        // console.log(this.mastData);
                    }
        
                }).catch((err)=>{
                    console.error(err);
                })
            },
            //////
            open(type){
                this.styleShow = type;
                console.log("总览："+this.styleShow);
            },
            closeMasterProject(){
                this.newOpenShow = false;
                
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
        padding: 20px 0 20px 25px;
        box-sizing: border-box;
        color:rgba(212,239,246,1);
    }
    .plan-master-content{
        font-size: 10px;
        padding: 0;
        margin: 0;
        li{
            padding-top: 10px;
            position: relative;
        }
        span{
            color:rgba(51,200,111,1);
        }
        b{
            font-size: 20px;
        }
        .errorTip{
            position: absolute;
            top:-2px;
            left:0 ;
            font-size: 9px;
            z-index: 111;
            color: red;
            display: none;
        }
    }
    .borderRed /deep/ .el-input__inner , .borderRed2 /deep/ .el-input__inner , .borderRed3 /deep/ .el-input__inner ,.borderRed4 /deep/ .el-input__inner ,.borderRed5 /deep/ .el-input__inner ,.borderRed7 /deep/ .el-input__inner{
        border: 1px solid red !important;
    }
    .borderRed .errorTip , .borderRed2 .errorTip , .borderRed3 .errorTip , .borderRed4 .errorTip , .borderRed5 .errorTip , .borderRed7 .errorTip{
        display: block !important;
    }
    .borderRed2 .errorTip{
        left: 60px !important;
    }
    .borderRed3 .errorTip{
        left: 100px !important;
    }
    .borderRed4 .errorTip{
        left: 75px !important;
    }
    .borderRed5 .errorTip{
        left: 68px !important;
    }
    .borderRed7 .errorTip{
        left: 117px !important;
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
        color: #d4eff6;
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
        top: 1px;
        right: 45px;
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
    .total_hours{
        max-width: 110px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
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
    /deep/ .el-input{
        width: 60px !important;
        height: 13px !important;
        line-height: 13px !important;
    }
    /deep/ .el-input__inner{
        height: 13px !important;
        line-height: 13px !important;
        padding: 0;
        background: none;
        text-align: center;
        font-size: 10px;
        border: 1px solid rgba(255,255,255,0.4);
    }
    .titleyouke /deep/ .el-input{
        width: 110px !important;
    }
    .titleyouke /deep/ .el-input__inner{
        height: 25px !important;
        line-height: 25px !important;
        font-size: 19px;
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