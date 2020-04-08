
<template>
    <div>
        <div class="plan-full-details-new-details">
            <div class="left">
                <div class="parameter">
                    <p class="header">项目参数</p>
                    <el-form label-position="left"
                        label-width="220px"
                        

                        class="title-name-self title-name-self1">
                        <el-form-item label="总容量 :">
                            <div>{{detailsData.project_capacity}}</div>
                            <div class="unit">MW</div>
                        </el-form-item>
                        <el-form-item label="所在区域 :">
                            <div>{{detailsData.province}}</div>
                        </el-form-item>
                        <el-form-item label="地形 :">
                            <el-select v-model="detailsData.terrain"
                                placeholder="请选择"
                                class="selectpopper"
                                popper-class="gf-popper">
                                <el-option
                                    v-for="(item, index) in list.terrain"
                                    :key="60+index"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="投资基准 :" style="height:50px;">
                            <el-radio v-model="detailsData.irrType" label="全投资IRR" class="irrType">全投资IRR</el-radio>
                            <el-radio v-model="detailsData.irrType" label="资本金IRR" class="irrType">资本金IRR  </el-radio>
                            <el-input v-model="detailsData.irrValue" type="number" class="irrValue" :class="{irrValueActive: detailsData.irrType=='资本金IRR'}"/>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="parameter parameterTop">
                    <p class="header">市场信息</p>
                    <el-form label-position="left"
                        label-width="220px"
                        ref="ruleFrom2"
                        :model="detailsData"
                        :rules="myrules"
                        class="title-name-self title-name-self1">
                        <el-form-item label="电价参数" class="greenLabel">
                        </el-form-item>
                        <el-form-item prop="feedinTariffs" label="常规模式上网电价(含税) :" class="itemLabel">
                            <el-input v-model="detailsData.feedinTariffs" type="number"/>
                            <div class="unit">元/KWH</div>
                        </el-form-item>
                        <el-form-item prop="power_limiting_rate" label="限电率 :" class="itemLabel">
                            <el-input v-model="detailsData.power_limiting_rate" type="number"/>
                            <div class="unit">%</div>
                        </el-form-item>
                        <el-form-item prop="power_limiting_year" label="限电年数 :" class="itemLabel">
                            <el-input v-model="detailsData.power_limiting_year" type="number"/>
                            <div class="unit">年</div>
                        </el-form-item>
                        <el-form-item prop="market_year" label="市场交易年数 :" class="itemLabel">
                            <el-input v-model="detailsData.market_year" type="number"/>
                            <div class="unit">年</div>
                        </el-form-item>
                        <el-form-item prop="market_power_ratio" label="市场交易比例 :" class="itemLabel">
                            <el-input v-model="detailsData.market_power_ratio" type="number"/>
                            <div class="unit">%</div>
                        </el-form-item>
                        <el-form-item prop="tradingPrice" label="市场交易电价 :" class="itemLabel">
                            <el-input v-model="detailsData.tradingPrice" type="number"/>
                            <div class="unit">元/KWH</div>
                        </el-form-item>

                        <el-form-item label="融资参数" class="greenLabel">
                        </el-form-item>
                        <el-form-item label="融资方式 :" class="itemLabel">
                            <el-select v-model="detailsData.financing_way"
                                placeholder="请选择"
                                class="selectpopper"
                                popper-class="gf-popper">
                                <el-option v-for="item in ['银行长期借款', '融资租赁']"
                                    :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="deadline" label="融资期限 :" class="itemLabel">
                            <el-input v-model="detailsData.deadline" type="number"/>
                            <div class="unit">年</div>
                        </el-form-item>
                        <el-form-item prop="longtermFinancingGraceYears" label="宽限期限 :" class="itemLabel">
                            <el-input v-model="detailsData.longtermFinancingGraceYears" type="number"/>
                            <div class="unit">年</div>
                        </el-form-item>
                        <el-form-item prop="graceInterestRateWithTax" label="宽限期利率 :" class="itemLabel">
                            <el-input v-model="detailsData.graceInterestRateWithTax" type="number"/>
                            <div class="unit">%</div>
                        </el-form-item>
                        <el-form-item label="贷款期利率(含税) :" class="itemLabel">
                            <el-input v-model="detailsData.loanInterestRateWithTax" type="number"/>
                            <div class="unit">%</div>
                        </el-form-item>
                        <el-form-item label="还款方式 :" class="itemLabel">
                            <el-select v-model="detailsData.mode_repayment"
                                placeholder="请选择"
                                class="selectpopper"
                                popper-class="gf-popper">
                                <el-option v-for="item in ['等额本金', '等额本息']"
                                    :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="利息税可抵扣 :" class="itemLabel">
                            <el-radio v-model="detailsData.interestTaxDeduction" label="1">是</el-radio>
                            <el-radio v-model="detailsData.interestTaxDeduction" label="0">否  </el-radio>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="center">
                <div class="parameter" style="position: relative;">
                    <p class="header">方案参数</p>
                    <div class="scroll">
                        <table class="mytable" border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr v-for="(item,index) of gridData" :key="index">
                                <td v-for="(item2,index2) in item" :key="index2" :class="{tdWidth: index2>0}">
                                    <span v-if="index!=0 && index!=1 && index!=2 && index2!=0" style="position: relative;">
                                        <input type="number" v-model="item[index2]"  
                                            @input="onInput(index,index2,item[index2],$event)"></input>
                                        <span class="tip3">正浮点数，>0</span>	
                                    </span>
                                    <span v-else>{{item[index2]}}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="unitCenter">
                        <div></div>
                        <div></div>
                        <div>MW</div>
                        <div>台</div>
                        <div>元/千瓦</div>
                        <div>t</div>
                        <div>t</div>
                        <div>t</div>
                        <div>M<sup>3</sup></div>
                        <div>t</div>
                    </div>
                    <el-form label-position="left"
                        label-width="220px"
                        
                        class="title-name-self title-name-self1">
                        <el-form-item label="等效小时数 :">
                            <el-input v-model="detailsData.cut_hour" type="number"/>
                            <div class="unit">h</div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="parameter parameterTop">
                    <p class="header">运维参数</p>
                    <el-form label-position="left"
                        label-width="220px"
                        ref="ruleFrom3"
                        :model="detailsData"
                        :rules="myrules"
                        class="title-name-self title-name-self1">
                        <el-form-item label="是否代运维 :">
                            <el-radio v-model="detailsData.operation" label="1">是</el-radio>
                            <el-radio v-model="detailsData.operation" label="0">否  </el-radio>
                        </el-form-item>
                        <el-form-item prop="warrantyPeriod" label="保质期限 :" v-if="detailsData.operation == 1">
                            <el-input v-model="detailsData.warrantyPeriod" type="number"/>
                            <div class="unit">年</div>
                        </el-form-item>
                        <el-form-item prop="warrantyFee" label="保质期费用 :" v-if="detailsData.operation == 1">
                            <el-input v-model="detailsData.warrantyFee" type="number"/>
                            <div class="unit">元/KW</div>
                        </el-form-item>
                        <el-form-item prop="outWarrantyFee" label="保质外费用 :" v-if="detailsData.operation == 1">
                            <el-input v-model="detailsData.outWarrantyFee" type="number"/>
                            <div class="unit">元/KW</div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="right">
                <div class="parameter parameterRight">
                    <p class="header">概算参数</p>
                    <el-form label-position="left"
                        label-width="220px"
                        ref="ruleFrom1"
                        :model="detailsData"
                        :rules="myrules"
                        class="title-name-self title-name-self1">
                        <div class="border">
                            <el-form-item label="工程信息 " class="greenLabel">
                            </el-form-item>
                            <el-form-item label="是否新建升压站 :">
                                <el-radio v-model="detailsData.nbooster" label="1">是</el-radio>
                                <el-radio v-model="detailsData.nbooster" label="0">否  </el-radio>
                            </el-form-item>
                            <el-form-item label="是否分散式项目 :">
                                <el-radio v-model="detailsData.distribut" label="1">是</el-radio>
                                <el-radio v-model="detailsData.distribut" label="0">否  </el-radio>
                            </el-form-item>
                            <el-form-item prop="ten_switching" label="10KV开关站 :" v-if="detailsData.distribut == 1">
                                <el-input v-model="detailsData.ten_switching" type="number"/>
                                <div class="unit">座</div>
                            </el-form-item>
                            <el-form-item prop="thirtyfive_switching" label="35KV开关站 :" v-if="detailsData.distribut == 1">
                                <el-input v-model="detailsData.thirtyfive_switching" type="number"/>
                                <div class="unit">座</div>
                            </el-form-item>
                            <el-form-item prop="construction_time" label="工期 :">
                                <el-input v-model="detailsData.construction_time" type="number"/>
                                <div class="unit">月</div>
                            </el-form-item>
                        </div>
                        <div class="border2">
                            <el-form-item label="价格信息 " class="greenLabel">
                            </el-form-item>
                            <el-form-item prop="towerUnitPrice" label="塔筒单价 :">
                                <el-input v-model="detailsData.towerUnitPrice" type="number"/>
                                <div class="unit">元/t</div>
                            </el-form-item>
                            <el-form-item prop="tower_price" label="钢塔单价 :">
                                <el-input v-model="detailsData.tower_price" type="number"/>
                                <div class="unit">元/t</div>
                            </el-form-item>
                            <el-form-item prop="anchor_price" label="锚栓单价 :">
                                <el-input v-model="detailsData.anchor_price" type="number"/>
                                <div class="unit">元/t</div>
                            </el-form-item>
                            <el-form-item prop="concreteCushionUnitPrice" label="垫层混凝土 :">
                                <el-input v-model="detailsData.concreteCushionUnitPrice" type="number"/>
                                <div class="unit">元/m<sup>3</sup></div>
                            </el-form-item>
                            <el-form-item prop="base_reinforcement" label="基础混凝土 :">
                                <el-input v-model="detailsData.base_reinforcement" type="number"/>
                                <div class="unit">元/m<sup>3</sup></div>
                            </el-form-item>
                            <el-form-item prop="foundation_concrete1" label="基础钢筋 :">
                                <el-input v-model="detailsData.foundation_concrete1" type="number"/>
                                <div class="unit">元/t</div>
                            </el-form-item>
                        </div>
                        <div class="border2">
                            <el-form-item label="基础工程 " class="greenLabel">
                            </el-form-item>
                            <el-form-item prop="pit_road" label="场内道路长度 :">
                                <el-input v-model="detailsData.pit_road" type="number"/>
                                <div class="unit">km</div>
                            </el-form-item>
                            <el-form-item prop="innerRoadWidth" label="场内道路宽度 :">
                                <el-input v-model="detailsData.innerRoadWidth" type="number"/>
                                <div class="unit">km</div>
                            </el-form-item>
                            <el-form-item prop="innerRoadPrice" label="场内道路单价 :">
                                <el-input v-model="detailsData.innerRoadPrice"/>
                                <div class="unit">万元/km</div>
                            </el-form-item>
                            <el-form-item prop="setline_len" label="集电线路长度 :">
                                <el-input v-model="detailsData.setline_len" type="number"/>
                                <div class="unit">km</div>
                            </el-form-item>
                            <el-form-item prop="boosterArea" label="升压站占地 :">
                                <el-input v-model="detailsData.boosterArea" type="number"/>
                                <div class="unit">m<sup>3</sup></div>
                            </el-form-item>
                        </div>
                        <div class="border2">
                            <el-form-item label="其他费用 " class="greenLabel">
                            </el-form-item>
                            <el-form-item prop="basicReserveFundsRatio" label="基本预备费 :">
                                <el-input v-model="detailsData.basicReserveFundsRatio" type="number"/>
                                <div class="unit">%</div>
                            </el-form-item>
                            <el-form-item prop="projectPreConstructionRate" label="工程前期费 :">
                                <el-input v-model="detailsData.projectPreConstructionRate" type="number"/>
                                <div class="unit">%</div>
                            </el-form-item>
                            <el-form-item prop="specialReportPreparationRate" label="专题报告编制费 :">
                                <el-input v-model="detailsData.specialReportPreparationRate" type="number"/>
                                <div class="unit">%</div>
                            </el-form-item>
                            <el-form-item prop="projectInsuranceRate" label="工程保险费 :">
                                <el-input v-model="detailsData.projectInsuranceRate" type="number"/>
                                <div class="unit">%</div>
                            </el-form-item>
                            <el-form-item prop="sparePartsFeeRate" label="备品备件购置费 :">
                                <el-input v-model="detailsData.sparePartsFeeRate" type="number"/>
                                <div class="unit">%</div>
                            </el-form-item>
                            <el-form-item prop="combinedRunningCostRate" label="联合试运转费 :">
                                <el-input v-model="detailsData.combinedRunningCostRate" type="number"/>
                                <div class="unit">%</div>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="saveButton"> <div @click="onSave">保存并刷新经评结果</div> </div>
    </div>
</template>

<script>
    import util from '@/libs/util';
    export default {
        name: 'plan-full-details-new-details',
        props:["projectId","planId"],
        data () {
            const verify100 = (rule, value, callback) => {
                // console.log(value)
                if (value == ""||value == null) {
                    callback(new Error('请输入内容'));
                }
                else if(value < 0){
                    callback(new Error('0~100%'));
                } 
                else if(value > 100){
                    callback(new Error('0~100%'));
                }
                else {
                    callback();
                }
            };
            const regexFloat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/u;
            const validateFloat = (rule, value, callback) => {
                if (value == ""||value == null) {
                    callback(new Error('请输入内容'));
                }
                else if (!regexFloat.test(value)) {
                    callback(new Error('请输入正浮点数'));
                } 
                else {
                    callback();
                }
            };
            const validateFloatnew = (rule, value, callback) => {
                if (value == ""||value == null) {
                    callback(new Error('请输入内容'));
                }
                else if (value < 0 ) {
                    callback(new Error('请输入正数'));
                } 
                else {
                    callback();
                }
            };
            const integer =  /^(0|\+?[1-9][0-9]*)$/;
            const integerValid = (rule, value, callback) => {
                if (value == ""||value == null) {
                    callback(new Error('请输入内容'));
                }
                else if (!integer.test(value)) {
                    callback(new Error('请输入正整数'));
                } 
                else {
                    callback();
                }
            };
            return {
                myrules:{
                    power_limiting_rate:[
                        { validator: verify100, trigger: 'change' }
                    ],
                    market_power_ratio:[
                        { validator: verify100, trigger: 'change' }
                    ],
                    graceInterestRateWithTax:[
                        { validator: verify100, trigger: 'change' }
                    ],
                    loanInterestRateWithTax:[
                        { validator: verify100, trigger: 'change' }
                    ],
                    basicReserveFundsRatio:[
                        { validator: verify100, trigger: 'change' }
                    ],
                    projectPreConstructionRate:[
                        { validator: verify100, trigger: 'change' }
                    ],
                    specialReportPreparationRate:[
                        { validator: validateFloatnew, trigger: 'change' }
                    ],
                    projectInsuranceRate:[
                        { validator: verify100, trigger: 'change' }
                    ],
                    sparePartsFeeRate:[
                        { validator: verify100, trigger: 'change' }
                    ],
                    combinedRunningCostRate:[
                        { validator: verify100, trigger: 'change' }
                    ],
                    feedinTariffs:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    tradingPrice:[
                        { validator: validateFloatnew, trigger: 'change' }
                    ],
                    warrantyFee:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    outWarrantyFee:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    towerUnitPrice:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    tower_price:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    anchor_price:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    concreteCushionUnitPrice:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    base_reinforcement:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    foundation_concrete1:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    pit_road:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    innerRoadWidth:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    innerRoadPrice:[
                        { validator: validateFloatnew, trigger: 'change' }
                    ],
                    setline_len:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    boosterArea:[
                        { validator: validateFloat, trigger: 'change' }
                    ],
                    power_limiting_year:[
                        { validator: integerValid, trigger: 'change' }
                    ],
                    market_year:[
                        { validator: integerValid, trigger: 'change' }
                    ],
                    deadline:[
                        { validator: integerValid, trigger: 'change' }
                    ],
                    longtermFinancingGraceYears:[
                        { validator: integerValid, trigger: 'change' }
                    ],
                    warrantyPeriod:[
                        { validator: integerValid, trigger: 'change' }
                    ],
                    ten_switching:[
                        { validator: integerValid, trigger: 'change' }
                    ],
                    thirtyfive_switching:[
                        { validator: integerValid, trigger: 'change' }
                    ],
                    construction_time:[
                        { validator: integerValid, trigger: 'change' }
                    ]
                },
                gridData:[
                    ["机型"],
                    ["单机容量 :"],
                    ["风机台数 :"],
                    ["机组单价 :"],
                    ["塔架重量 :"],
                    ["锚栓重量 :"],
                    ["基础垫层 :"],
                    ["基础混凝土 :"],
                    ["基础钢筋 :"]
                ],
                list:{},
                detailsData:{
                    terrain: " ",
                    foundation_concrete1: 0,
                    base_reinforcement: 0,
                    anchor_price: 0,
                    tower_price: 0,
                    construction_time: 0,
                    thirtyfive_switching: 0,
                    ten_switching: 0,
                    nbooster: 0,

                    loanInterestRateWithTax: 0,
                    concreteCushionUnitPrice: 0,
                    irrType: " ",
                    irrValue: 0,
                    feedinTariffs: 0,
                    tradingPrice: 0,
                    longtermFinancingGraceYears: 0,
                    graceInterestRateWithTax: 0,
                    interestTaxDeduction: 0,
                    operation: 0,
                    warrantyPeriod: 0,
                    warrantyFee: 0,
                    outWarrantyFee: 0,
                    distribut: 0,
                    towerUnitPrice:0,
                    innerRoadPrice:0,
                    basicReserveFundsRatio:0,
                    boosterArea:0,
                    projectPreConstructionRate:0,
                    specialReportPreparationRate:0,
                    projectInsuranceRate:0,
                    sparePartsFeeRate:0,
                    combinedRunningCostRate:0,
                    innerRoadWidth:0,

                    province:" ",
                    project_capacity: 0,
                    power_limiting_rate: 0,
                    power_limiting_year: 0,
                    market_year: 0,
                    market_power_ratio: 0,
                    financing_way: " ",
                    deadline: 0,
                    mode_repayment: " ",
                    pit_road: 0,
                    setline_len: 0,

                    cut_hour: 0
                },
                turbine_params: {},
                //转格式赋值
                unit_price_new: [],
                tower_weight_new: [],
                anchor_weight_new: [],
                concreteCushionAmountNew: [],
                concreteAmountNew: [],
                steelBarAmountNew: [],

                waitingOneMinute: false
            };
        },
        watch:{
            waitingOneMinute () {
                this.$store.commit('globeLoading', {loading: this.waitingOneMinute, text: '重新计算中，预计用时1分钟...'});
            },
        },
        methods: {
            initgridData(){
                this.unit_price_new = [];
                this.tower_weight_new = [];
                this.anchor_weight_new = [];
                this.concreteCushionAmountNew = [];
                this.concreteAmountNew = [];
                this.steelBarAmountNew = [];
                this.gridData = [
                    ["机型"],
                    ["单机容量 :"],
                    ["风机台数 :"],
                    ["机组单价 :"],
                    ["塔架重量 :"],
                    ["锚栓重量 :"],
                    ["基础垫层 :"],
                    ["基础混凝土 :"],
                    ["基础钢筋 :"]
                ]
            },
            transformData(data){
                // console.log(data);
                this.initgridData();
                data.forEach((item,index)=>{
                    this.gridData[0].push(item.pool);
                    this.gridData[1].push(item.single_capacity);
                    this.gridData[2].push(item.fannum);
					this.gridData[3].push(item.unit_price);
					this.gridData[4].push(item.tower_weight);
					this.gridData[5].push(item.anchor_weight);
					this.gridData[6].push(item.concreteCushionAmount);
					this.gridData[7].push(item.concreteAmount);
					this.gridData[8].push(item.steelBarAmount);
                    this.unit_price_new.push(item.unit_price);
                    this.tower_weight_new.push(item.tower_weight);
                    this.anchor_weight_new.push(item.anchor_weight);
                    this.concreteCushionAmountNew.push(item.concreteCushionAmount);
                    this.concreteAmountNew.push(item.concreteAmount);
                    this.steelBarAmountNew.push(item.steelBarAmount);
                })
            },
            refreshData () {
                this.getParameterData();
                this.gettList();
            },
            gettList() {
                util.ajax.get('/evaluation_params', {}).then((res) => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }

                    this.list = retData.data;
                }).catch((/* err */) => {
                    this.$message.error('取得经评下拉列表框内容失败！');
                });
            },
            getParameterData(){
                util.ajax.get('/evaluation_output_params', {
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
                   
                    this.turbine_params = res.data.data.turbine_params;
                    this.getDetailsData(res.data.data);
                    this.transformData(this.turbine_params);

                }).catch((err) => {
                    console.log(err);
                    this.$message.error("获取参数设置数据失败！");
                });
            },
            getDetailsData(data){
                this.detailsData.terrain = data.engineering_params.terrain;
                this.detailsData.foundation_concrete1 = data.engineering_params.foundation_concrete1;
                this.detailsData.base_reinforcement = data.engineering_params.base_reinforcement;
                this.detailsData.anchor_price = data.engineering_params.anchor_price;
                this.detailsData.tower_price = data.engineering_params.tower_price;
                this.detailsData.construction_time = data.engineering_params.construction_time;
                this.detailsData.thirtyfive_switching = data.engineering_params.thirtyfive_switching;
                this.detailsData.ten_switching = data.engineering_params.ten_switching;
                this.detailsData.nbooster = String(data.engineering_params.nbooster);
                
                this.detailsData.loanInterestRateWithTax = data.new_param.loanInterestRateWithTax;
                this.detailsData.concreteCushionUnitPrice = data.new_param.concreteCushionUnitPrice;
                this.detailsData.irrType = data.new_param.irrType;
                this.detailsData.irrValue = data.new_param.irrValue;
                this.detailsData.feedinTariffs = data.new_param.feedinTariffs;
                this.detailsData.tradingPrice = data.new_param.tradingPrice;
                this.detailsData.longtermFinancingGraceYears = data.new_param.longtermFinancingGraceYears;
                this.detailsData.graceInterestRateWithTax = data.new_param.graceInterestRateWithTax;
                this.detailsData.interestTaxDeduction = String(data.new_param.interestTaxDeduction);
                this.detailsData.operation = String(data.new_param.operation);
                this.detailsData.warrantyPeriod = data.new_param.warrantyPeriod;
                this.detailsData.warrantyFee = data.new_param.warrantyFee;
                this.detailsData.outWarrantyFee = data.new_param.outWarrantyFee;
                this.detailsData.distribut = String(data.new_param.distribut)
                this.detailsData.towerUnitPrice = data.new_param.towerUnitPrice;
                this.detailsData.innerRoadPrice = data.new_param.innerRoadPrice;
                this.detailsData.basicReserveFundsRatio = data.new_param.basicReserveFundsRatio;
                this.detailsData.boosterArea = data.new_param.boosterArea;
                this.detailsData.projectPreConstructionRate = data.new_param.projectPreConstructionRate;
                this.detailsData.specialReportPreparationRate = data.new_param.specialReportPreparationRate;
                this.detailsData.projectInsuranceRate = data.new_param.projectInsuranceRate;
                this.detailsData.sparePartsFeeRate = data.new_param.sparePartsFeeRate;
                this.detailsData.combinedRunningCostRate = data.new_param.combinedRunningCostRate;
                this.detailsData.innerRoadWidth = data.new_param.innerRoadWidth;
                    
                this.detailsData.province = data.project_params.province;
                this.detailsData.project_capacity = data.project_params.project_capacity;
                this.detailsData.power_limiting_rate = data.project_params.power_limiting_rate;
                this.detailsData.power_limiting_year = data.project_params.power_limiting_year;
                this.detailsData.market_year = data.project_params.market_year;
                this.detailsData.market_power_ratio = data.project_params.market_power_ratio;
                this.detailsData.financing_way = data.project_params.financing_way;
                this.detailsData.deadline = data.project_params.deadline;
                this.detailsData.mode_repayment = data.project_params.mode_repayment;
                this.detailsData.pit_road = data.project_params.pit_road;
                this.detailsData.setline_len = data.project_params.setline_len;
                  
                this.detailsData.cut_hour = data.wind_params.cut_hour;
            },
            onInput(ind, ind2, value, ev){
                // console.log(ind, ind2)
                var num = Number(value);
                const regexFloat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/u;
                if(!regexFloat.test(num)){
                    ev.target.parentNode.classList.add("redborder3");
                }else{
                    ev.target.parentNode.classList.remove("redborder3");
                }
                var arr = [];
                this.gridData.map((item,index)=>{
                    item.map((item2,index2)=>{
                        if(index == ind && index2 != 0){
                            // console.log(item2)
                            arr.push(Number(item2));
                        }
                    })
                })
                // console.log(arr)
                if(ind == 3){  //机组单价
                    this.unit_price_new = arr;
                }
                else if(ind == 4){  //塔架重量 
                    this.tower_weight_new = arr;
                }
                else if(ind == 5){ //锚栓重量 
                    this.anchor_weight_new = arr;
                }
                else if(ind == 6){ //基础垫层
                    this.concreteCushionAmountNew = arr;
                }
                else if(ind == 7){ //基础混凝土
                    this.concreteAmountNew = arr;
                }
                else if(ind == 8){ //基础钢筋
                    this.steelBarAmountNew = arr;
                }
            },
            onSave(){
                let isNext1 = false;
                let isNext2 = false;
                let isNext3 = false;
                this.$refs.ruleFrom1.validate(valid => {
                    console.log("表单验证1："+ valid);
                    isNext1 = valid;
                    return valid;
                });
                this.$refs.ruleFrom2.validate(valid => {
                    console.log("表单验证2："+ valid);
                    isNext2 = valid;
                    return valid;
                });
                this.$refs.ruleFrom3.validate(valid => {
                    console.log("表单验证3："+ valid);
                    isNext3 = valid;
                    return valid;
                });
                if(!isNext1 || !isNext2 || !isNext3){
                    this.$message.error("存在验证未通过项，请修改后重试！");
                    return;
                }

                //
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                this.waitingOneMinute = true;
                util.ajax.post('/evaluation_output_params', {
                    project_id: this.projectId,
                    scheme_id: this.planId,
                    pool: "", 
                    fannum: "", 
                    single_capacity: "", 
                    unit_price: JSON.stringify(this.unit_price_new) || " ",   //机组单价
                    tower_weight: JSON.stringify(this.tower_weight_new) || " ", //塔架重量
                    anchor_weight: JSON.stringify(this.anchor_weight_new) || " ", //锚栓重量
                    concreteCushionAmount: JSON.stringify(this.concreteCushionAmountNew) || " ", //基础垫层 
                    concreteAmount: JSON.stringify(this.concreteAmountNew) || " ",  //基础混凝土
                    steelBarAmount: JSON.stringify(this.steelBarAmountNew) || " ", //基础钢筋
                    id: "",
                    wind_cycle: "",
                    pit_road: Number(this.detailsData.pit_road) || 0,
                    power_limiting_rate: Number(this.detailsData.power_limiting_rate) || 0,
                    redevelopmentroad: "",
                    deadline: Number(this.detailsData.deadline) || 0,
                    project_type: "",
                    environmental_loss: "",
                    interestTaxDeduction: Number(this.detailsData.interestTaxDeduction) || 0,
                    generating_hours: "",
                    feedinTariffs: Number(this.detailsData.feedinTariffs) || 0,
                    innerRoadPrice: Number(this.detailsData.innerRoadPrice) || 0,
                    basicReserveFundsRatio: Number(this.detailsData.basicReserveFundsRatio) || 0,
                    boosterArea: Number(this.detailsData.boosterArea) || 0,
                    projectPreConstructionRate: Number(this.detailsData.projectPreConstructionRate) || 0,
                    specialReportPreparationRate: Number(this.detailsData.specialReportPreparationRate) || 0,
                    projectInsuranceRate: Number(this.detailsData.projectInsuranceRate) || 0,
                    sparePartsFeeRate: Number(this.detailsData.sparePartsFeeRate) || 0,
                    combinedRunningCostRate: Number(this.detailsData.combinedRunningCostRate) || 0,
                    innerRoadWidth: Number(this.detailsData.innerRoadWidth) || 0,
                    apportioningInvestment: "",
                    yieldrate: "",
                    fan_warranty_period: "",
                    power_curve: "",
                    boosterstation: "",
                    fanplatform: "",
                    loanInterestRateWithTax: Number(this.detailsData.loanInterestRateWithTax),
                    mode_repayment: this.detailsData.mode_repayment,
                    setline_method: "",
                    power_limiting_year: Number(this.detailsData.power_limiting_year) || 0,
                    stationroad: "",
                    terrain: this.detailsData.terrain,
                    total_concreteprice: "",
                    operation: Number(this.detailsData.operation) || 0,
                    conductor_cross: "",
                    foundation_concrete1: Number(this.detailsData.foundation_concrete1) || 0,
                    tradingPrice: Number(this.detailsData.tradingPrice) || 0,
                    capital: "",
                    reduction_factor: "",
                    setline_len: Number(this.detailsData.setline_len) || 0,
                    construction_time: Number(this.detailsData.construction_time) || 0,
                    surface_similarity: "",
                    baseroad: "",
                    market_power_loss: "",
                    towerUnitPrice: Number(this.detailsData.towerUnitPrice) || 0,
                    irrValue: Number(this.detailsData.irrValue) || 0,
                    irrType: this.detailsData.irrType,
                    nbooster: Number(this.detailsData.nbooster) || 0,
                    tower_price: Number(this.detailsData.tower_price) || 0,
                    forest_types: "",
                    ten_switching: Number(this.detailsData.ten_switching) || 0,
                    wake_effect: "",
                    altitude: "",
                    company: "",
                    windtower_maintenance: "",
                    airtower_mass: "",
                    send_project: "",
                    concreteCushionUnitPrice: Number(this.detailsData.concreteCushionUnitPrice) || 0,
                    fan_availability: "",
                    base_reinforcement: Number(this.detailsData.base_reinforcement) || 0,
                    cut_hour: Number(this.detailsData.cut_hour) || 0,
                    thirtyfive_switching: Number(this.detailsData.thirtyfive_switching) || 0,
                    warrantyPeriod: Number(this.detailsData.warrantyPeriod) || 0,
                    longtermFinancingGraceYears: Number(this.detailsData.longtermFinancingGraceYears) || 0,
                    fanbase: "",
                    outWarrantyFee: Number(this.detailsData.outWarrantyFee) || 0,
                    voltage_level: "",
                    anchor_price: Number(this.detailsData.anchor_price) || 0,
                    graceInterestRateWithTax: Number(this.detailsData.graceInterestRateWithTax) || 0,
                    market_power_ratio: Number(this.detailsData.market_power_ratio) || 0,
                    equipment_losses: "",
                    province: this.detailsData.province,
                    wires: "",
                    distribut: Number(this.detailsData.distribut) || 0,
                    financing_way: this.detailsData.financing_way,
                    out_line_len: "",
                    market_year: Number(this.detailsData.market_year) || 0,
                    photoptometer_quality: "",
                    warrantyFee: Number(this.detailsData.warrantyFee) || 0,
                    single_hoistingcost: "",
                    date_commencement: "",
                    long_term_financingrate: "",
                    capital_ratio: "",
                    horizontal_distance: "",
                    date_approval: "",
                    project_capacity: Number(this.detailsData.project_capacity) || 0,
                    
                },config).then(res => {
                    // console.log(res);
                    this.waitingOneMinute = false;
                    //新经评不需要调经评计算,post保存即可
                    if(res.data.code == 200){
                        this.$message.success("保存经评结果成果！");
                        this.getParameterData();
                    }else{
                        this.$message.error(res.data.message);
                    }
                   
                }).catch((err) => {
                    console.log(err);
                    this.waitingOneMinute = false;
                    this.$message.error("保存经评结果失败！");
                });
            }
        }
    };
</script>

<style lang="less" scoped>
/deep/ .el-input__inner{
    padding: 0 0 0 0 !important;
}
.mytable{
    position: relative;
    tr{
        padding: 0 20px;
        border: none !important;
        display: flex;
        min-height: 30px;
        border-bottom: 1px solid rgba(211,219,228,0.6) !important;
        .tdWidth{
            text-align: center;
        }
        td{
            width: 95px;
            height: 30px;
            padding-right: 8px;
        }
       
    }
    tr:nth-of-type(1)>td:nth-of-type(1){
        line-height: 50px;
    }
    tr:nth-of-type(1)>td{
        height: 50px;
    }
}
.unitCenter{
    width: 20%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    &>div{
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid rgba(211,219,228,0.6);
    }
    &>div:nth-of-type(1){
        height: 35px;
        border: none;
    }
    &>div:nth-of-type(2){
        height: 50px;
    }
}
.scroll{
    width: 80%;
    overflow-x: auto;
}
.header{
    height:35px;
    line-height: 35px;
    background:rgba(51,200,111,0.2);
    color: #fff;
    padding: 0 20px;
    margin: 0;
}
.parameter{
    border: 1px solid rgba(211,219,228,0.6);
}
.parameterTop{
    margin: 5px 0 0 0;
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
    }
    .el-input__inner{
        opacity: 1 !important;
        border: none !important;
    }
    .el-input__inner:focus{
        border: 1px solid rgba(211,219,228,0.7) !important;
    }
}
/deep/ .el-form .el-form-item:last-child{
    border: none !important;
}
/deep/ .el-form-item.greenLabel .el-form-item__label{
    color: #33C86F !important;
    padding: 0 0 0 20px !important;
}
/deep/ .el-form-item.itemLabel .el-form-item__label{
    padding: 0 0 0 45px !important;
}

.unit{
    position: absolute;
    right: 0;
    top: 0;
    width: 80px;
}
.plan-full-details-new-details{
    display: flex;
    justify-content: space-between;
    color: #D3DBE4;
    &>div{
        width: 33%;
    }
}
.saveButton{
    display: flex;
    justify-content: center;
    &>div{
        width: 160px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background: rgba(51,200,111,0.5);
        border-radius: 4px;
        color: #FFFFFF;
        cursor: pointer;
    }
}
/deep/ .el-radio{
    color: rgba(212,239,246,0.7) !important;
}
/deep/ .el-radio__input{
    position: relative;
    top: -2px;
}
/deep/ .el-radio__inner{
    border: 1px solid rgba(159, 164, 162, 0.5) !important;
}
/deep/ .el-radio input{
    opacity: 0 !important;
}
/deep/ .irrType{
    display: block;
    margin: 5px 0 0 0 !important;
}
/deep/ .irrValue{
    position: absolute;
    top: 0;
    right: 15px;
    width: 80px;
    input{
        width: 80px !important;
        height: 25px !important;
    }
}
/deep/ .irrValueActive{
    top: 20px;
}
/deep/ .selectpopper{
    width: 155px !important;
    .el-input__inner:focus{
        border: none !important;
        padding-left: 0 !important;
    }
}
.mytable /deep/ input{
    opacity: 0.9 !important;
    border: none !important;
    text-align: center;
}
.mytable /deep/ .el-input__inner:focus{
    border: 1px solid rgba(211,219,228,0.7) !important;
}
.mytable /deep/ input{
    height: 30px;
    box-sizing: border-box;
}
.mytable /deep/ input:focus{
    border: 1px solid rgba(211,219,228,0.7) !important;
    outline: none;
}
/deep/ .el-form-item.is-error .el-input__inner{
    border: 1px solid #FF4967 !important;
}
/deep/ .el-form-item__error{
    /* opacity: 0; */
    text-align: left !important;
    top: -17px !important;
}
.tip3{
    top: -25px;
    position: absolute;
    color: red;
    left: 0;
    font-size: 9px;
    display: inline-block;
    width: 90px;
    text-align: left;
    display: none;
}
.redborder3 .tip3{
    display: inline-block;
}
.redborder3 input{
    border: 1px solid #FF4967 !important;
}
.redborder3 input:focus{
    border: 1px solid #FF4967 !important;
    outline: none;
}
.parameterRight{
    border: none;
    .header{
        border: 1px solid rgba(211, 219, 228, 0.6);
        border-bottom: none;
    }
    .border{
        border: 1px solid rgba(211, 219, 228, 0.6);
        border-top: none;
        margin-bottom: 5px;
    }
    .border2{
        border: 1px solid rgba(211, 219, 228, 0.6);
        margin-bottom: 5px;
    }
}
</style>
