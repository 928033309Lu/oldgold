<style lang="less" scoped>
    @import "./plan-full-details";
</style>
<template>
    <el-dialog title="风"
               :modal="false"
               :visible.sync="dialogVisible"
               :close-on-click-modal="true"
               custom-class="plan-full-details"
               width="1315px"
               :center="true">
        <div class="contentBox">
            <div class="planDetailHeader">
                <div class="headerLeft">
                    <div class="title">[ {{planName}} ]</div>
                    <div class="lineAndCycle"></div>
                </div>
                <div class="button" v-if="active" @click="onChange(false)"><icon name="canshupeizhi" class="canshushezhi"></icon>查看参数设置</div>
                <div class="button" v-else @click="onChange(true)" style="width:100px;"><icon name="fanhui" class="fanhui" style="vertical-align: -0.25em;width: 18px; height: 18px;"></icon>返回</div>
                <div class="close" v-if="active" @click="closeDetail"><i class="el-dialog__close el-icon el-icon-close"></i></div>
            </div>
            <div v-show="active" class="detailsOne">
                <div class="left">
                    <p class="header">主要经济指标</p>
                    <el-form label-position="left"
                        label-width="220px"
                        ref="paramForm"
                        :model="ecoData"
                        class="title-name-self title-name-self1">
                        <el-form-item label="项目容量 :">
                            <div>{{ecoData.capacity}}</div>
                            <div class="unit">万KW</div>
                        </el-form-item>
                        <el-form-item label="等效小时数 :">
                            <div>{{ecoData.equivalent_hours}}</div>
                            <div class="unit">H</div>
                        </el-form-item>
                        <el-form-item label="静态总投资 :">
                            <div>{{ecoData.static_total_investment}}</div>
                            <div class="unit">万元</div>
                        </el-form-item>
                        <el-form-item label="单位静态投资 :">
                            <div>{{ecoData.unite_static_total_investment}}</div>
                            <div class="unit">元/KW</div>
                        </el-form-item>
                        <el-form-item label="单位动态总投资 :">
                            <div>{{ecoData.unite_dynamic_total_investment}}</div>
                            <div class="unit">元/KW</div>
                        </el-form-item>
                        <el-form-item label="风机价格 :" class="itemLabel">
                            <div>{{ecoData.fan_price}}</div>
                            <div class="unit">元/KW</div>
                        </el-form-item>
                        <el-form-item label="塔筒价格 :" class="itemLabel">
                            <div>{{ecoData.tower_price}}</div>
                            <div class="unit">元/KW</div>
                        </el-form-item>
                        <el-form-item label="基础价格 :" class="itemLabel">
                            <div>{{ecoData.basic_price}}</div>
                            <div class="unit">元/KW</div>
                        </el-form-item>
                        <el-form-item label="平均含税电价 :">
                            <div>{{ecoData.average_tariff_inclusive}}</div>
                            <div class="unit">元/KWH</div>
                        </el-form-item>
                        <el-form-item label="静态度电成本(含VAT&CIT) :">
                            <div>{{ecoData.static_vat_cit}}</div>
                            <div class="unit">元/KWH</div>
                        </el-form-item>
                        <el-form-item label="LCOE(平准化度电成本) :">
                            <div>{{ecoData.lcoe}}</div>
                            <div class="unit">元/KWH</div>
                        </el-form-item>
                        <el-form-item label="PT(投资回收期) :">
                            <div>{{ecoData.pt}}</div>
                            <div class="unit">年</div>
                        </el-form-item>
                        <el-form-item label="全投资净现值 :">
                            <div>{{ecoData.total_investment_value}}</div>
                            <div class="unit">万元</div>
                        </el-form-item>
                        <el-form-item label="资本金净现值 :">
                            <div>{{ecoData.capital_found_value}}</div>
                            <div class="unit">万元</div>
                        </el-form-item>
                        <el-form-item label="PIRR(全投资内部收益率) :">
                            <div>{{ecoData.p_i_r_r}}</div>
                            <div class="unit">%</div>
                        </el-form-item>
                        <el-form-item label="EIRR(资本金内部收益率) :">
                            <div>{{ecoData.e_i_r_r}}</div>
                            <div class="unit">%</div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="right">
                    <p class="header">工程概算总表</p>
                    <div class="content">
                        <div>
                            <el-form label-position="left"
                                label-width="220px"
                                ref="paramForm"
                                :model="engineerData"
                                class="title-name-self title-name-self1">
                                <el-form-item label="一 : 施工辅助工程 :" class="greenLabel">
                                    <div>{{engineerData.assistanceEquipConstructionOtherFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="1 : 施工交通工程 :" class="itemLabel2">
                                    <div>{{engineerData.assistanceTrafficFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="2 : 施工供电工程 :" class="itemLabel2">
                                    <div>{{engineerData.assistancePowerFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="3 : 施工供水工程 :" class="itemLabel2">
                                    <div>{{engineerData.assistanceWaterFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="4 : 其他施工辅助工程 :" class="itemLabel2">
                                    <div>{{engineerData.assistanceOtherFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                           
                                <el-form-item label="三 : 建筑工程 :" class="greenLabel">
                                    <div>{{engineerData.constructionInstall}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="1 : 发电场工程 :" class="itemLabel2">
                                    <div>{{engineerData.electricEngineering}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="2 : 升压变电站工程 :" class="itemLabel2">
                                    <div>{{engineerData.boosterSubstationProject}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="3 : 房屋建筑工程 :" class="itemLabel2">
                                    <div>{{engineerData.housingConstructionProject}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="4 : 交通工程 :" class="itemLabel2">
                                    <div>{{engineerData.trafficEngineering}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="5 : 其他工程 :" class="itemLabel2">
                                    <div>{{engineerData.otherEngineering}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                            
                                <el-form-item label="五 : 基本预备费 :" class="greenLabel">
                                    <div>{{engineerData.basicReserveFundsFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="1 : 送出工程 :" class="itemLabel2">
                                    <div>{{engineerData.sendPowerProjectFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="2 : 工程静态投资合计 :" class="itemLabel2">
                                    <div>{{engineerData.projectStaticInvestment}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label=" " class="itemLabel2">
                                    <div></div>
                                </el-form-item>
                                <el-form-item label=" " class="itemLabel2">
                                    <div></div>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div>
                            <el-form label-position="left"
                                label-width="230px"
                                ref="paramForm"
                                class="title-name-self title-name-self1">
                                <el-form-item label="二 : 设备及安装工程 :" class="greenLabel paddLabel">
                                    <div>{{engineerData.equipment_install}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="1 : 发电场设备及安装工程 :" class="itemLabel3">
                                    <div>{{engineerData.electricalEquipmentInstall}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="2 : 升压变电站设备及安装工程 :" class="itemLabel3">
                                    <div>{{engineerData.equipmentInstallationBoosterSubstation}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="3 : 控制保护设备及安装工程 :" class="itemLabel3">
                                    <div>{{engineerData.controlProtectionEquipmentInstall}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="4 : 其他设备及安装工程 :" class="itemLabel3">
                                    <div>{{engineerData.otherEquipmentInstall}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                           
                                <el-form-item label="四 : 其他费用 :" class="greenLabel paddLabel">
                                    <div>{{engineerData.otherFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="1 : 项目建设用地费 :" class="itemLabel3">
                                    <div>{{engineerData.projectConstructionLandFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="2 : 项目建设管理费 :" class="itemLabel3">
                                    <div>{{engineerData.projectConstructionManagementFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="3 : 生产准备费 :" class="itemLabel3">
                                    <div>{{engineerData.productionPreparationFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="4 : 勘察设计费 :" class="itemLabel3">
                                    <div>{{engineerData.surveyDesignFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="5 : 其他税费 :" class="itemLabel3">
                                    <div>{{engineerData.otherTax}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="六 : 基本预备费 :" class="greenLabel paddLabel">
                                    <div>{{engineerData.basicReserveFundsFee}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="七 : 建设期利息 :" class="greenLabel paddLabel">
                                    <div>{{engineerData.interestConstruction}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="八 : 工程总投资 :" class="greenLabel paddLabel">
                                    <div>{{engineerData.totalProjectInvestment}}</div>
                                    <div class="unit">万元</div>
                                </el-form-item>
                                <el-form-item label="1 : 单位千瓦静态投资 :" class="itemLabel3">
                                    <div>{{engineerData.staticInvestmentPerkW}}</div>
                                    <div class="unit">元/KW</div>
                                </el-form-item>
                                <el-form-item label="2 : 单位千瓦动态投资 :" class="itemLabel3">
                                    <div>{{engineerData.dymaticInvestmentPerkW}}</div>
                                    <div class="unit">元/KW</div>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="!active" class="detailsTwo">
                <plan-full-details-new-details ref="parameter" :projectId="projectId" :planId="planId"></plan-full-details-new-details>
            </div>

        </div>
    </el-dialog>
</template>

<script>
    import util from '@/libs/util';
    import detailsNew from './details-new';
    import planFullDetailsNewDetails from './plan-full-details-new-details';

    export default {
        name: 'plan-full-details-new',
        components: { 
            detailsNew, 
            planFullDetailsNewDetails
        },
        data () {
            return {
                projectId: null,
                planId: null,
                dialogVisible: false,
                active: true,
                planName: '默认方案',
                ecoData: {  //主要经济数据
                    capacity: "",
                    equivalent_hours: "",
                    static_total_investment: "",
                    unite_static_total_investment: "",
                    unite_dynamic_total_investment: "",
                    fan_price: "",
                    tower_price: "",
                    basic_price: "",
                    average_tariff_inclusive: "",
                    static_vat_cit: "",
                    lcoe: "",
                    pt: "",
                    total_investment_value: "",
                    capital_found__value: "",
                    p_i_r_r: "",
                    e_i_r_r: ""
                },   
                engineerData: { //工程数据
                    assistanceEquipConstructionOtherFee: "",
                    assistanceOtherFee: "",
                    assistancePowerFee: "",
                    assistanceTrafficFee: "",
                    assistanceWaterFee: "",
                    basicReserveFundsFee: "",
                    boosterSubstationProject: "",
                    constructionInstall: "",
                    controlProtectionEquipmentInstall: "",
                    dymaticInvestmentPerkW: "",
                    electricEngineering: "",
                    electricalEquipmentInstall: "",
                    engineAssistance: "",
                    equipmentInstallationBoosterSubstation: "",
                    equipment_install: "",
                    housingConstructionProject: "",
                    interestConstruction: "",
                    otherEngineering: "",
                    otherEquipmentInstall: "",
                    otherFee: "",
                    otherTax: "",
                    productionPreparationFee: "",
                    projectConstructionLandFee: "",
                    projectConstructionManagementFee: "",
                    projectStaticInvestment: "",
                    reservePriceDiff: "",
                    sendPowerProjectFee: "",
                    staticInvestmentPerkW: "",
                    surveyDesignFee: "",
                    totalProjectInvestment: "",
                    trafficEngineering: ""
                }
            };
        },
        watch: {
            dialogVisible(val){
                if(!val){
                    this.closeDetail()
                }
            }
        },
        methods: {
            open (projectId, planId, planName) {
                if (!projectId || !planId) return;
                this.dialogVisible = true;
                this.projectId = projectId;
                this.planId = planId;
                this.planName = planName;
                this.getData();
                this.$refs.parameter && this.$refs.parameter.initgridData();
            },
            onSave () {
                this.$emit('planDetailCalculating', true);
                // this.active = true;
            },
            closeDetail () {
                this.dialogVisible = false;
                this.$emit('close');
                //关闭经评恢复右下角的详情
                this.$emit("closeFanOptimize",false);
                this.projectId = null;
                this.planId = null;
                
            },
            onChange(type){
                this.active = type;
                if(!type){
                    this.$refs.parameter && this.$refs.parameter.refreshData();
                }
            },
            refreshData () {
                this.getData();
                this.$refs.parameter && this.$refs.parameter.refreshData();
            },
            getData(){
                util.ajax.get('/new_evaluation_result', {
                    params: {
                        scheme_id: this.planId,
                        project_id: this.projectId
                    }
                }).then(res => {
                    // console.log(res.data.data);
                    if(res.data.code != 200){
                        this.$message.error(res.data.message);
                        return;
                    }
                    this.ecoData = res.data.data.output_rate_rate;
                    this.engineerData = res.data.data.evaluation_budgetary_estimates;
                    
                }).catch((err) => {
                    console.log(err);
                });
            },
            
        }
    };
</script>

<style lang="less" scoped>
/deep/ .plan-full-details{
    margin-top: 8vh !important;
    height: 625px !important;
}

.planDetailHeader{
    margin: 10px 60px 10px 30px !important;
}
.headerLeft{
    display: flex;
    .lineAndCycle{
        position: relative !important;
        top: 15px !important;
        left: 10px !important;
    }
}
/deep/ .el-form-item{
    border-bottom: 1px solid rgba(211,219,228,0.6) !important;
    margin-bottom: 0px !important;
    .el-form-item__label, .el-form-item__content{
        line-height: 30px !important;
    }
    .el-form-item__label{
        padding: 0 0 0 20px !important;
        height: 30px;
    }
    input{
        width: 100px !important;
        opacity: 1 !important;
    }
    .el-input__inner{
        border: none !important;
    }
    .el-input__inner:focus{
        border: 1px solid rgba(211,219,228,0.7) !important;
    }
}
/deep/ .el-form .el-form-item:last-child{
    border: none !important;
}
/deep/ .el-form-item.itemLabel .el-form-item__label{
    padding: 0 0 0 60px !important;
}
/deep/ .el-form-item.itemLabel2 .el-form-item__label{
    padding: 0 0 0 45px !important;
}
/deep/ .el-form-item.greenLabel .el-form-item__label{
    color: #33C86F !important;
}
/deep/ .el-form-item.itemLabel3 .el-form-item__label{
    padding: 0 0 0 25px !important;
}
/deep/ .el-form-item.paddLabel .el-form-item__label{
    padding: 0 0 0 0 !important;
}
.unit{
    position: absolute;
    right: 0;
    top: 0;
    width: 80px;
}
.header{
    height:35px;
    line-height: 35px;
    background:rgba(51,200,111,0.2);
    color: #fff;
    padding: 0 20px;
}
.detailsOne{
    display: flex;
    justify-content: space-between;
    color: #D3DBE4;
    padding: 0 30px 30px 30px;
    .left{
        width: 33%;
        border: 1px solid rgba(211,219,228,0.6);
    }
    .right{
        width: 66%;
        border: 1px solid rgba(211,219,228,0.6);
    }
    .content{
        display: flex;
        &>div{
            flex: 1;
        }
    }
}
.detailsTwo{
    padding: 0 30px;
    height: 545px;
    overflow: auto;
}
</style>
