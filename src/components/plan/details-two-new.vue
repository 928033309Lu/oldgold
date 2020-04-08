
<template>
    <div class="detail2 bottombox" v-bind:style="{height:detailOneHeight+'px'}">
        
                <div class="box leftBox">
                    <div class="title">项目参数</div>
                    <el-form label-position="left"
                             label-width="140px"
                             :model="project_params"
                             :rules="myrules"
                             ref="paramForm"
                             class="title-name-self title-name-self1"
                             :style="openActive1 ? 'height:590px;':''"
                    >
                        <el-form-item label="区域/省/自治区：">
                            <div class="input-custom2">{{project_params.province}}</div>
                        </el-form-item>
                        <el-form-item label="项目类型：">
                            <div class="input-custom2" style="color:white !important;">{{project_params.project_type}}</div>
                        </el-form-item>
                        <el-form-item label="总容量：">
                            <div class="input-custom2">{{project_params.project_capacity}}</div>
                            <div class="unit2 unit">MW</div>
                        </el-form-item>
                        <el-form-item label="参数规则：">
                            <el-select v-model="project_params.company"
                                       placeholder="请选择"
                                       popper-class="step3-popper details-popper" >
                                <el-option
                                        v-for="(item, index) in list.company"
                                        :key="50+index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="外送线路长度：" prop="out_line_len">
                                <el-tooltip class="item" 
                                effect="light" 
                                :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                content="正浮点数,可保留两位小数"
                                :disabled="/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(project_params.out_line_len) ? true : false"
                                :visible-arrow="false"
                                placement="top">
                            <el-input v-model="project_params.out_line_len" @blur="offBlur" :readonly="enManager"></el-input>
                                </el-tooltip>
                            
                            <div class="unit2 unit">千米</div>
                        </el-form-item>
                        <el-form-item label="风机保质期：">
                            <div class="input-custom2">{{project_params.fan_warranty_period}}</div>
                            <div class="unit2 unit">年</div>
                        </el-form-item>
                        <el-form-item label="场内道路：">
                            <div class="input-custom2">{{project_params.pit_road}}</div>
                            <div class="unit2 unit">千米</div>
                        </el-form-item>
                        <el-form-item label="集电线路长度：">
                            <div class="input-custom2">{{project_params.setline_len}}</div>
                            <div class="unit2 unit">千米</div>
                        </el-form-item>
                        <el-form-item label="集电线路架设方式：">
                            <div class="input-custom2">{{project_params.setline_method}}</div>
                        </el-form-item>
                        <el-form-item label="核准日期：">
                            <el-input v-model="project_params.date_approval" @input="validateDateApproval" :readonly="enManager"/>
                            <err-tip ref="dateApprovalErrTip" err-msg="请输入正确的日期格式：YYYY-MM-DD" style="margin-top:-25px"/>
                        </el-form-item>
                        <el-form-item label="开工日期：">
                            <el-input v-model="project_params.date_commencement" @input="validateDateCommencement" :readonly="enManager"/>
                            <err-tip ref="dateCommencementErrTip" err-msg="请输入正确的日期格式：YYYY-MM-DD"
                                     style="margin-top:-25px"/>
                        </el-form-item>
                        <el-form-item label="市场交易电量比例：">
                            <div class="input-custom2">{{project_params.market_power_ratio}}</div>
                            <div class="unit2 unit">%</div>
                        </el-form-item>
                        <el-form-item label="市场交易损失电价：">
                            <div class="input-custom2">{{project_params.market_power_loss}}</div>
                            <div class="unit2 unit">元/kWh</div>
                        </el-form-item>
                        <el-form-item label="市场交易年数：">
                            <div class="input-custom2">{{project_params.market_year}}</div>
                            <div class="unit2 unit">年</div>
                        </el-form-item>
                        <el-form-item label="集电线路电压等级：">
                            <div class="input-custom2">{{project_params.voltage_level}}</div>
                            <div class="unit2 unit">kV</div>
                        </el-form-item>
                        <el-form-item label="限电率：">
                            <div class="input-custom2">{{project_params.power_limiting_rate}}</div>
                            <div class="unit2 unit">%</div>
                        </el-form-item>
                        <el-form-item label="限电年数：">
                            <div class="input-custom2">{{project_params.power_limiting_year}}</div>
                            <div class="unit2 unit">年</div>
                        </el-form-item>
                        <el-form-item label="资金成本：" prop="capital">
                                <el-tooltip class="item" 
                                effect="light" 
                                :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                content="范围：0～100%"
                                :disabled="/([1-9]?\d|100)$/.test(project_params.capital) ? true : false"
                                :visible-arrow="false"
                                placement="top">
                            <el-input v-model="project_params.capital" @input="validateCapital" @blur="offBlur" :readonly="enManager"/>
                                </el-tooltip>
                            <div class="unit2 unit">%
                                <err-tip ref="capitalErrTip" err-msg="资金成本输入范围：0～100%" style="margin-top:-25px"/>
                            </div>
                        </el-form-item>
                        <el-form-item label="资本金比例：" prop="capital_ratio">
                                <el-tooltip class="item" 
                                effect="light" 
                                :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                content="范围：0～100%"
                                :disabled="/([1-9]?\d|100)$/.test(project_params.capital_ratio) ? true : false"
                                :visible-arrow="false"
                                placement="top">
                            <el-input v-model="project_params.capital_ratio" @input="validateCapitalRatio" @blur="offBlur" :readonly="enManager"/>
                                </el-tooltip>
                            <div class="unit2 unit">%
                                <err-tip ref="capitalRatioErrTip" err-msg="资本金比例输入范围：0～100%" style="margin-top:-25px"/>
                            </div>
                        </el-form-item>
                        <el-form-item label="融资方式：">
                            <el-select v-model="project_params.financing_way"
                                       placeholder="请选择"
                                       popper-class="step3-popper details-popper">
                                <el-option v-for="item in ['银行长期借款', '融资租赁']"
                                           :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="长期融资利率：" prop="long_term_financingrate">
                                <el-tooltip class="item" 
                                effect="light" 
                                :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                content="范围：0～100%"
                                :disabled="/([1-9]?\d|100)$/.test(project_params.long_term_financingrate) ? true : false"
                                :visible-arrow="false"
                                placement="top">
                            <el-input v-model="project_params.long_term_financingrate"
                                      @input="validateLongTermFinancingrate" @blur="offBlur" :readonly="enManager"/>
                                      </el-tooltip>
                            <div class="unit2 unit">%
                                <err-tip ref="longTermFinancingrateErrTip" err-msg="长期融资利率输入范围：0～100%"
                                         style="margin-top:-25px"/>
                            </div>
                        </el-form-item>
                        <el-form-item label="融资期限：" prop="deadline">
                                <el-tooltip class="item" 
                                effect="light" 
                                :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                content="正整数，1～30"
                                :disabled="/([1-9]?\d|100)$/.test(project_params.deadline) ? true : false"
                                :visible-arrow="false"
                                placement="top">
                            <el-input v-model="project_params.deadline" @input="validateDeadline" @blur="offBlur" :readonly="enManager"/>
                                </el-tooltip>
                            <div class="unit2 unit">年
                                <err-tip ref="deadlineErrTip" err-msg="融资期限输入：正整数，1～30" style="margin-top:-25px"/>
                            </div>
                        </el-form-item>
                        <el-form-item label="还款方式：">
                            <el-select v-model="project_params.mode_repayment"
                                       placeholder="请选择"
                                       popper-class="step3-popper details-popper">
                                <el-option v-for="item in ['等额本金', '等额本息']"
                                           :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                    </el-form>

                    <div class="openBtn" @click="openActive1 = !openActive1"><span>{{openActive1?'收起':'展开...'}}</span></div>
                </div>
                <div class="left-relative centerBox">
                    <div class="box">
                        <el-form label-position="left" label-width="170px" :model="engineering_params" :rules="myrules3" class="title-name-self title-name-self2">
                                <div class="title">工程量概算参数</div>
                            <el-form-item label="地形：">
                                <el-select v-model="engineering_params.terrain" :disabled="enManager"
                                            placeholder="请选择"
                                            popper-class="step3-popper details-popper">
                                    <el-option
                                            v-for="(item, index) in list.terrain"
                                            :key="60+index"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="建设工期：" prop="construction_time">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正整数，>0"
                                    :disabled="/^[1-9]\d*$/.test(engineering_params.construction_time) ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.construction_time"
                                            @input="validateConstructionTime"  @blur="offBlur" :readonly="enManager"></el-input>
                                    </el-tooltip>
                                <div class="unit2 unit">月
                                    <err-tip ref="constructionTimeErrTip" errMsg="请输入大于或等于0的正整数"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="钢塔单价：" prop="tower_price">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正整数，>0"
                                    :disabled="/^[1-9]\d*$/.test(engineering_params.tower_price) ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.tower_price" @input="validateTowerPrice" @blur="offBlur" :readonly="enManager"></el-input>
                                    </el-tooltip>
                                <div class="unit2 unit">元/吨
                                    <err-tip ref="towerPriceErrTip" errMsg="请输入大于或等于0的正整数"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="锚栓单价（仅瞄栓）：" prop="anchor_price">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正整数，>0"
                                    :disabled="/^[1-9]\d*$/.test(engineering_params.anchor_price) ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.anchor_price" @input="validateAnchorPrice" @blur="offBlur" :readonly="enManager"></el-input>
                                    </el-tooltip>
                                <div class="unit2 unit">元/吨
                                    <err-tip ref="anchorPriceErrTip" errMsg="请输入大于或等于0的正整数"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="混凝土段总价：" prop="total_concreteprice">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正整数，>0"
                                    :disabled="/^[1-9]\d*$/.test(engineering_params.total_concreteprice) ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.total_concreteprice"
                                            @input="validateTotalConcreteprice"  @blur="offBlur" :readonly="enManager"></el-input>
                                            </el-tooltip>
                                <div class="unit2 unit">万元
                                    <err-tip ref="totalConcretepriceErrTip" errMsg="请输入大于或等于0的正整数"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="送出工程：" prop="send_project">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正整数，>0"
                                    :disabled="/^[1-9]\d*$/.test(engineering_params.send_project) ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.send_project" @input="validateSendProject" @blur="offBlur" :readonly="enManager"></el-input>
                                    </el-tooltip>
                                <div class="unit2 unit">万元
                                    <err-tip ref="sendProjectErrTip" errMsg="请输入大于或等于0的正整数"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="新建升压站：">
                                <div style="height: 40px;width: 1px"></div>
                                <el-radio v-model="engineering_params.nbooster" label="1">是</el-radio>
                                <el-radio v-model="engineering_params.nbooster" label="0">否</el-radio>
                            </el-form-item>
                            <el-form-item label="10KV开关站：" prop="ten_switching">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正整数，>0"
                                    :disabled="/^[1-9]\d*$/.test(engineering_params.ten_switching) ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.ten_switching"
                                            @input="validateTenSwitching" @blur="offBlur" :readonly="enManager"></el-input>
                                            </el-tooltip>
                                <div class="unit2 unit">座
                                    <err-tip ref="tenSwitchingErrTip" errMsg="请输入大于或等于0的正整数"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="35KV开关站：" prop="thirtyfive_switching">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正整数，>0"
                                    :disabled="/^[1-9]\d*$/.test(engineering_params.thirtyfive_switching) ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.thirtyfive_switching"
                                            @input="validateThirtyfiveSwitching" @blur="offBlur" :readonly="enManager"></el-input>
                                            </el-tooltip>
                                <div class="unit2 unit">座
                                    <err-tip ref="thirtyfiveSwitchingErrTip" errMsg="请输入大于或等于0的正整数"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="钢塔重量（选填）：" prop="tower_weight">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正浮点数，可保留四位小数"
                                    :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.tower_weight)&&engineering_params.tower_weight!=0 ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.tower_weight" @input="validateTowerWeight" @blur="offBlur" :readonly="enManager"></el-input>
                                </el-tooltip>
                                <div class="unit2 unit">t
                                    <err-tip ref="towerWeightErrTip" errMsg="请输入正浮点型，>0"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="锚栓重量（选填）：" prop="anchor_weight">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正浮点数，可保留四位小数"
                                    :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.anchor_weight)&&engineering_params.anchor_weight!=0 ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.anchor_weight"
                                            @input="validateAnchorWeight" @blur="offBlur" :readonly="enManager"></el-input>
                                        </el-tooltip>
                                <div class="unit2 unit">t
                                    <err-tip ref="anchorWeightErrTip" errMsg="请输入正浮点型，>0"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="基础混凝土（选填）：" prop="base_reinforcement">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正浮点数，可保留四位小数"
                                    :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.base_reinforcement)&&engineering_params.base_reinforcement!=0 ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.base_reinforcement"
                                            @input="validateBaseReinforcement" @blur="offBlur" :readonly="enManager"></el-input>
                                            </el-tooltip>
                                <div class="unit2 unit">m^3
                                    <err-tip ref="baseReinforcementErrTip" errMsg="请输入正浮点型，>0"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="基础钢筋（选填）：" prop="foundation_concrete1">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正浮点数，可保留四位小数"
                                    :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.foundation_concrete1)&&engineering_params.foundation_concrete1!=0 ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.foundation_concrete1"
                                            @input="validateFoundationConcrete1" @blur="offBlur" :readonly="enManager"></el-input>
                                            </el-tooltip>
                                <div class="unit2 unit">t
                                    <err-tip ref="foundationConcrete1ErrTip" errMsg="请输入正浮点型，>0"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="单台吊装费用（选填）：" prop="single_hoistingcost">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正浮点数，可保留四位小数"
                                    :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.single_hoistingcost)&&engineering_params.single_hoistingcost!=0 ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.single_hoistingcost"
                                            @input="validateSingleHoistingcost" @blur="offBlur" :readonly="enManager"></el-input>
                                            </el-tooltip>
                                <div class="unit2 unit">万元
                                    <err-tip ref="singleHoistingcostErrTip" errMsg="请输入正浮点型，>0"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="线路导线截面：" prop="conductor_cross">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                    content="正整数"
                                    :disabled="/^[1-9]\d*$/.test(engineering_params.conductor_cross) ? true : false"
                                    :visible-arrow="false"
                                    placement="top">
                                <el-input v-model="engineering_params.conductor_cross" 
                                            @input="validateConductorCross"  @blur="offBlur" :readonly="enManager"></el-input>
                                            </el-tooltip>
                                <div class="unit2 unit">平方毫米
                                    <err-tip ref="conductorCrossErrTip" errMsg="请输入大于或等于0的正整数"
                                                style="margin-top:-25px;margin-left: 10px;"/>
                                </div>
                            </el-form-item>
                            <!-- <el-table
                                    :data="engineering_params.wires"
                                    style="width: 100%"
                                    class="gf-table  need-border details-two-table"
                                    header-row-class-name="details-two-table-header"
                                    cell-class-name="details-two-cell-class"
                            >
                                <el-table-column
                                        prop="type"
                                        label="铁塔塔型"
                                        align="center"
                                        header-align="center"
                                />
                                <el-table-column
                                        prop="number"
                                        label="数量"
                                        align="center"
                                        header-align="center"
                                />
                            </el-table> -->
                            <div class="custom-table-header2">
                                <div class="custom-table-header">
                                    <div></div>
                                    <div style="position: relative;left:-30px;">土方开挖<span>m<sup>3</sup></span></div>
                                    <!-- <div class="minbox minbox1">石方开挖<span>m<sup>3</sup></span></div> -->
                                    <div style="position: relative;left:20px;">回填<span>m<sup>3</sup></span></div>
                                    <!-- <div class="minbox">外运距离<span>km</span></div> -->
                                </div>
                                <div class="custom-table-row">
                                    <div >风机基础</div>
                                    <div v-for="(item, index) in engineering_params.fanbase" :key="510+index" class="input-con">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            popper-class="offmytooltip"
                                            content="正数，可保留四位小数"
                                            :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.fanbase[index]) ? true : false"
                                            :visible-arrow="false"
                                            placement="top">
                                        <el-input type="number" v-show="index==0 || index==2" style="text-align: center;" v-model="engineering_params.fanbase[index]" 
                                        :style="!/^\d+(\.\d{1,4})?$/.test(engineering_params.fanbase[index])? redBorder:''"
                                            v-bind:class="{exWidth: index === 0 || index === 2,minWidth: index !== 0 && index !== 2}" :readonly="enManager"></el-input>
                                            </el-tooltip>
                                    </div>
                                </div>
                                <div class="custom-table-row">
                                    <div >风机平台</div>
                                    <div v-for="(item, index) in engineering_params.fanplatform" :key="520+index">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            popper-class="offmytooltip"
                                            content="正数，可保留四位小数"
                                            :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.fanplatform[index]) ? true : false"
                                            :visible-arrow="false"
                                            placement="top">
                                        <el-input type="number" v-show="index==0 || index==2" style="text-align: center;" v-model="engineering_params.fanplatform[index]"
                                        :style="!/^\d+(\.\d{1,4})?$/.test(engineering_params.fanplatform[index])? redBorder:''"
                                                    v-bind:class="{exWidth: index === 0 || index === 2,minWidth: index !== 0 && index !== 2}" :readonly="enManager"></el-input>
                                                    </el-tooltip>
                                    </div>
                                </div>
                                <div class="custom-table-row">
                                    <div >升压站</div>
                                    <div v-for="(item, index) in engineering_params.boosterstation" :key="530+index">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            popper-class="offmytooltip"
                                            content="正数，可保留四位小数"
                                            :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.boosterstation[index]) ? true : false"
                                            :visible-arrow="false"
                                            placement="top">
                                        <el-input type="number" v-show="index==0 || index==2" style="text-align: center;" v-model="engineering_params.boosterstation[index]"
                                        :style="!/^\d+(\.\d{1,4})?$/.test(engineering_params.boosterstation[index])? redBorder:''"
                                                    v-bind:class="{exWidth: index === 0 || index === 2,minWidth: index !== 0 && index !== 2}" :readonly="enManager"></el-input>
                                                    </el-tooltip>
                                    </div>
                                </div>
                                <div class="custom-table-row">
                                    <div >进场道路</div>
                                    <div v-for="(item, index) in engineering_params.stationroad" :key="540+index">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            popper-class="offmytooltip"
                                            content="正数，可保留四位小数"
                                            :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.stationroad[index]) ? true : false"
                                            :visible-arrow="false"
                                            placement="top">
                                        <el-input type="number" v-show="index==0 || index==2" style="text-align: center;" v-model="engineering_params.stationroad[index]"
                                        :style="!/^\d+(\.\d{1,4})?$/.test(engineering_params.stationroad[index])? redBorder:''"
                                                    v-bind:class="{exWidth: index === 0 || index === 2,minWidth: index !== 0 && index !== 2}" :readonly="enManager"></el-input>
                                                    </el-tooltip>
                                    </div>
                                </div>
                                <div class="custom-table-row">
                                    <div >场内道路</div>
                                    <div v-for="(item, index) in engineering_params.baseroad" :key="550+index">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            popper-class="offmytooltip"
                                            content="正数，可保留四位小数"
                                            :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.baseroad[index]) ? true : false"
                                            :visible-arrow="false"
                                            placement="top">
                                        <el-input type="number" v-show="index==0 || index==2" style="text-align: center;" v-model="engineering_params.baseroad[index]"
                                        :style="!/^\d+(\.\d{1,4})?$/.test(engineering_params.baseroad[index])? redBorder:''"
                                                    v-bind:class="{exWidth: index === 0 || index === 2,minWidth: index !== 0 && index !== 2}" :readonly="enManager"></el-input>
                                                    </el-tooltip>
                                    </div>
                                </div>
                                <div class="custom-table-row">
                                    <div >改建道路</div>
                                    <div v-for="(item, index) in engineering_params.redevelopmentroad" :key="560+index">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            popper-class="offmytooltip"
                                            content="正数，可保留四位小数"
                                            :disabled="/^\d+(\.\d{1,4})?$/.test(engineering_params.redevelopmentroad[index]) ? true : false"
                                            :visible-arrow="false"
                                            placement="top">
                                        <el-input type="number" v-show="index==0 || index==2" style="text-align: center;"
                                        :style="!/^\d+(\.\d{1,4})?$/.test(engineering_params.redevelopmentroad[index])? redBorder:''"
                                                    v-model="engineering_params.redevelopmentroad[index]"
                                                    v-bind:class="{exWidth: index === 0 || index === 2,minWidth: index !== 0 && index !== 2}" :readonly="enManager"></el-input>
                                                    </el-tooltip>
                                    </div>
                                </div>
                              
                            </div>
                        </el-form>
                    
                        
                    </div>
                </div>
           
                <div class="box rightBox">
                    <div class="box box2">
                        <table class="mytable" border="0" cellspacing="0" cellpadding="0" width="100%">
                            <div class="title">机组参数</div>
                            <tr v-for="(item,index) of gridData" :key="index">
                                <td v-for="(item2,index2) in item" :key="index2">
                                    <span v-show="index!=3">{{item[index2]}}</span>
                                    <span v-show="index2==0 && index==3">{{item[0]}}</span>
                                    <el-input v-show="index2!=0 && index==3" v-model="item[index2]" style="width:60px;" 
                                        @input="onInput(index,index2,item[index2])"></el-input>
                                </td>
                            </tr>
                        </table>
                        <!-- <el-table
                        :data="turbine_params"
                        style="width: 100%"
                        class="gf-table  need-border"
                        id="errBox"
                        >
                        <div class="title">机组参数</div>
                            <el-table-column
                                    prop="pool"
                                    label="机型"
                                    align="center"
                                    header-align="center"
                            >
                            </el-table-column>
                            </el-table-column>
                            <el-table-column prop="single_capacity" label="单机容量">
                                <template slot-scope="scope">
                                    <span>{{scope.row.single_capacity}}MW</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="fannum"
                                    label="风机台数"
                                    align="center"
                                    header-align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                    label="机组单价"
                                    align="center"
                                    header-align="center"
                                    width="130px"
                            >
                                <template slot-scope="scope">
                                        <el-tooltip class="item" 
                                        effect="light" 
                                        :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                        content="正整数，>0"
                                        :disabled="scope.row.unit_price>0 ? true : false"
                                        :visible-arrow="false"
                                        placement="top">
                                    <el-input v-model="scope.row.unit_price" @input="vUnitPrice(scope.$index,scope ,$event)" 
                                    @blur="offBlur"
                                    :class="isErr?'errBorder':''"
                                    style="margin-left:-30px;"></el-input>
                                        </el-tooltip>
                                    <div class="unit2 unit" style="margin-left: -30px;display: inline-block;">元/kW
                                        <err-tip :ref="'unitPrice' + scope.$index"   errMsg="请输入正整数"  style="margin-top:-25px;margin-left: 10px;"></err-tip>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table> -->
                    </div>

                    <el-form label-position="left" label-width="140px" 
                    :model="wind_params" ref="windParams" :rules="myrules2" 
                    :style="openActive2 ? 'height:450px;':''"
                    class="title-name-self title-name-self3">
                            <div class="title">风资源参数</div>
                        <el-form-item label="等效小时数：">
                            <div class="input-custom2">{{wind_params.generating_hours}}</div>
                            <div class="unit2 unit">h</div>
                        </el-form-item>
                        <el-form-item label="折减系数：" prop="reduction_factor">
                                <el-tooltip class="item" 
                                effect="light" 
                                :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                content="范围：0～1"
                                :disabled="/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(wind_params.reduction_factor)&&wind_params.reduction_factor<=1 ? true : false"
                                :visible-arrow="false"
                                placement="top">
                            <el-input v-model="wind_params.reduction_factor"
                                      @input="validateReductionFactor" @blur="offBlur"></el-input>
                                      </el-tooltip>
                            <err-tip ref="reductionFactorErrTip" errMsg="折减系数输入范围：0～1"
                                     style="margin-top:-25px"></err-tip>
                        </el-form-item>
                        <el-form-item label="折减后等效小时数：">
                            <div class="input-custom2">{{wind_params.cut_hour}}</div>
                            <!--<el-input v-model="wind_params.cut_hour" @input="validateCutHour"></el-input>-->
                            <div class="unit2 unit">h
                                <!--<err-tip ref="cutHourErrTip" errMsg="请输入正浮点型，四位小数"-->
                                         <!--style="margin-top:-25px;margin-left: 10px;"></err-tip>-->
                            </div>

                        </el-form-item>
                        <el-form-item label="测风仪质量：">
                            <el-select v-model="wind_params.photoptometer_quality"
                                       placeholder="请选择"
                                       popper-class="step3-popper details-popper">
                                <el-option
                                        v-for="(item, index) in list.photoptometer_quality"
                                        :key="10+index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="测风塔质量：">
                            <el-select v-model="wind_params.airtower_mass"
                                       placeholder="请选择"
                                       popper-class="step3-popper details-popper">
                                <el-option
                                        v-for="(item, index) in list.airtower_mass"
                                        :key="20+index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="测风塔维护：">
                            <el-select v-model="wind_params.windtower_maintenance"
                                       placeholder="请选择"
                                       popper-class="step3-popper details-popper">
                                <el-option
                                        v-for="(item, index) in list.windtower_maintenance"
                                        :key="30+index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="测风周期：" prop="wind_cycle">
                                <el-tooltip class="item" 
                                effect="light" 
                                :popper-class="isTrue ?'offmytooltip':'onmytooltip'"
                                content="正整数，>0"
                                :disabled="wind_params.wind_cycle>0 ? true : false"
                                :visible-arrow="false"
                                placement="top">
                            <el-input v-model="wind_params.wind_cycle" @input="vWindCycle" @blur="offBlur"></el-input>
                                </el-tooltip>
                            <div class="unit2 unit">月
                                <err-tip ref="windCycleErrTip" errMsg="请输入正整数"
                                         style="margin-top:-25px;margin-left: 10px;"></err-tip>
                            </div>
                        </el-form-item>
                        <el-form-item label="海拔高差：">
                            <div class="input-custom2">{{wind_params.altitude}}</div>
                            <div class="unit2 unit">米</div>
                        </el-form-item>
                        <el-form-item label="水平距离差：">
                            <div class="input-custom2">{{wind_params.horizontal_distance}}</div>
                            <div class="unit2 unit">千米</div>
                        </el-form-item>
                        <el-form-item label="地表形态相似度：">
                            <el-select v-model="wind_params.surface_similarity"
                                       placeholder="请选择"
                                       popper-class="step3-popper details-popper">
                                <el-option
                                        v-for="(item, index) in list.surface_similarity"
                                        :key="40+index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="森林类型：">
                            <el-select v-model="wind_params.forest_types"
                                       placeholder="请选择"
                                       popper-class="step3-popper details-popper">
                                <el-option
                                        v-for="(item, index) in list.forest_types"
                                        :key="50+index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="尾流影响：">
                            <div style="height: 40px;width: 1px"></div>
                            <el-radio v-model="wind_params.wake_effect" label="1">是</el-radio>
                            <el-radio v-model="wind_params.wake_effect" label="0">否</el-radio>
                        </el-form-item>
                        <el-form-item label="风机可利用率：">
                            <div style="height: 40px;width: 1px"></div>
                            <el-radio v-model="wind_params.fan_availability" label="1">是</el-radio>
                            <el-radio v-model="wind_params.fan_availability" label="0">否</el-radio>
                        </el-form-item>
                        <el-form-item label="电器及设备损耗：">
                            <div style="height: 40px;width: 1px"></div>
                            <el-radio v-model="wind_params.equipment_losses" label="1">是</el-radio>
                            <el-radio v-model="wind_params.equipment_losses" label="0">否</el-radio>
                        </el-form-item>
                        <el-form-item label="功率曲线：">
                            <div style="height: 40px;width: 1px"></div>
                            <el-radio v-model="wind_params.power_curve" label="1">是</el-radio>
                            <el-radio v-model="wind_params.power_curve" label="0">否</el-radio>
                        </el-form-item>
                        <el-form-item label="环境损耗：">
                            <div style="height: 40px;width: 1px"></div>
                            <el-radio v-model="wind_params.environmental_loss" label="1">是</el-radio>
                            <el-radio v-model="wind_params.environmental_loss" label="0">否</el-radio>
                        </el-form-item>
                    </el-form>

                    <div class="openBtn" @click="openActive2 = !openActive2"><span>{{openActive2?'收起':'展开...'}}</span></div>
                </div>
                
            
                
           

    </div>

</template>

<script>
    import util from '@/libs/util';
    import errTip from '../../components/cesium/err-tip';

    export default {
        name: 'details-two',
        components: {
            errTip
        },
        props: ['projectId', 'planId'],
        data () {
            const regexPlus = /^[1-9]\d*$/u;
            const validatePlus = (rule, value, callback) => {
                // this.$refs['constructionTimeErrTip'].show();
                if (!regexPlus.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            const regex1Plus = /^([1-9]\d+)|([2-9])$/u;
            const validate1Plus = (rule, value, callback) => {
                if (!regex1Plus.test(value)) {
                    callback(new Error('请输入大于1的正整数'));
                } else {
                    callback();
                }
            };
            const regexFloat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/u;
            const validateFloat = (rule, value, callback) => {
                if (!regexFloat.test(value)) {
                    callback(new Error('请输入正浮点数'));
                } else {
                    callback();
                }
            };
            ////////我新增-------------------------
            const out_line_len_Check = (rule, value, callback) => {
                if (value === "") {
                    // callback(new Error('请输入长度'));
                    callback(new Error(" "));
                } 
                // else if(!/^\+?(\d*\.\d{2})$/.test(value)){
                //     callback(new Error('请输入正浮点数，必须保留两位小数'));
                // }
                else if(!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)){
                    // callback(new Error('正数,可保留两位小数'));
                    callback(new Error(" "));
                }
                else if(value == "0.00"||value == "0.0"){
                    // callback(new Error('正数,可保留两位小数'));
                    callback(new Error(" "));
                }
                else {
                    callback();
                }
            };
            const capital_Check = (rule, value, callback) => {
                if (value === "") {
                    // callback(new Error('请输入内容'));
                    callback(new Error(" "));
                } 
                else if(!/([1-9]?\d|100)$/.test(value)){
                    // callback(new Error('0~100%'));
                    callback(new Error(" "));
                }
                else {
                    callback();
                }
            };
            const deadline_Check = (rule, value, callback) => {
                if (value === "") {
                    // callback(new Error('请输入期限'));
                    callback(new Error(" "));
                } 
                else if(!/^([12][0-9]|30|[1-9])$/.test(value)){
                    // callback(new Error('1~30之间'));
                    callback(new Error(" "));
                }
                else {
                    callback();
                }
            };
            //////
            const reduction_factor_Check = (rule, value, callback) => {
                if (value === "") {
                    // callback(new Error('请输入系数'));
                    callback(new Error(" "));
                } 
                else if(!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)){
                    // callback(new Error('0-1之间'));
                    callback(new Error(" "));
                }
                else if(value>1){
                    // callback(new Error('0-1之间'));
                    callback(new Error(" "));
                }
                else {
                    callback();
                }
            };
            const wind_cycle_Check = (rule, value, callback) => {
                if (value === "") {
                    // callback(new Error('请输入内容'));
                    callback(new Error(" "));
                } 
                else if(value<=0){
                    // callback(new Error('大于0'));
                    callback(new Error(" "));
                }
                else {
                    callback();
                }
            };
            //////
            const construction_time_Check = (rule, value, callback) => {
                if (value === "") {
                    // callback(new Error('请输入内容'));
                    callback(new Error(" "));
                } 
                // /^[0-9]+.?[0-9]*$/
                else if(!/^[1-9]\d*$/.test(value)){
                    // callback(new Error('正整数'));
                    callback(new Error(" "));
                }
                else {
                    callback();
                }
            };
            const tower_weight_Check = (rule, value, callback) => {
                if (value === "") {
                    // callback(new Error('请输入内容'));
                    callback(new Error(" "));
                }
                else if(value == 0){
                    // callback(new Error('正整数,可保留四位小数'));
                    callback(new Error(" "));
                } 
                else if(!/^\d+(\.\d{1,4})?$/.test(value)){
                    // callback(new Error('正整数,可保留四位小数'));
                    callback(new Error(" "));
                }
                else {
                    callback();
                }
            };

            return {
                redBorder:{
                   "box-sizing": "border-box",
                   "border": "1px solid red !important",
                    "border-radius": "3px"
                },
                overFlow: true,
                loadMoreWidth: 0,
                formLabelAlign: {
                    name: '',
                    region: '',
                    type: ''
                },
                partOne: {},
                partTwo: {},
                list: {},
                engineering_params: {
                    terrain: null,
                    construction_time: null,
                    tower_price: null,
                    anchor_price: null,
                    total_concreteprice: null,
                    send_project: null,
                    nbooster: null,
                    ten_switching: null,
                    thirtyfive_switching: null,
                    tower_weight: null,
                    anchor_weight: null,
                    base_reinforcement: null,
                    foundation_concrete1: null,
                    single_hoistingcost: null,
                    conductor_cross: null,
                    wires: null,
                    fanbase: null,
                    fanplatform: null,
                    boosterstation: null,
                    stationroad: null,
                    baseroad: null,
                    redevelopmentroad: null
                },
                isErr:false,
                isTrue:true,
                //验证与名字对应上
                myrules:{
                    out_line_len:[
                        { validator: out_line_len_Check, trigger: 'blur' }
                    ],
                    capital:[
                        { validator: capital_Check, trigger: 'blur' }
                    ],
                    capital_ratio:[
                        { validator: capital_Check, trigger: 'blur' }
                    ],
                    long_term_financingrate:[
                        { validator: capital_Check, trigger: 'blur' }
                    ],
                    deadline:[
                        { validator: deadline_Check, trigger: 'blur' }
                    ]
                },
                myrules2:{
                    reduction_factor:[
                        { validator: reduction_factor_Check, trigger: 'blur' }
                    ],
                    wind_cycle:[
                        { validator: wind_cycle_Check, trigger: 'blur' }
                    ],
                    
                },
                myrules3:{
                    construction_time:[
                        { validator: construction_time_Check, trigger: 'blur' }
                    ],
                    tower_price:[
                        { validator: construction_time_Check, trigger: 'blur' }
                    ],
                    anchor_price:[
                        { validator: construction_time_Check, trigger: 'blur' }
                    ],
                    total_concreteprice:[
                        { validator: construction_time_Check, trigger: 'blur' }
                    ],
                    send_project:[
                        { validator: construction_time_Check, trigger: 'blur' }
                    ],
                    ten_switching:[
                        { validator: construction_time_Check, trigger: 'blur' }
                    ],
                    thirtyfive_switching:[
                        { validator: construction_time_Check, trigger: 'blur' }
                    ],
                    tower_weight:[
                        { validator: tower_weight_Check, trigger: 'blur' }
                    ],
                    anchor_weight:[
                        { validator: tower_weight_Check, trigger: 'blur' }
                    ],
                    base_reinforcement:[
                        { validator: tower_weight_Check, trigger: 'blur' }
                    ],
                    foundation_concrete1:[
                        { validator: tower_weight_Check, trigger: 'blur' }
                    ],
                    single_hoistingcost:[
                        { validator: tower_weight_Check, trigger: 'blur' }
                    ],
                    conductor_cross:[
                        { validator: construction_time_Check, trigger: 'blur' }
                    ],
                   
                    
                },
                project_params: {
                    province: null,
                    project_type: null,
                    project_capacity: null,
                    out_line_len: null,
                    company: null,
                    pit_road: null,
                    setline_method: null,
                    setline_len: null,
                    date_approval: null,
                    date_commencement: null,
                    capital: null,
                    capital_ratio: null,
                    financing_way: null,
                    long_term_financingrate: null,
                    deadline: null,
                    mode_repayment: null,
                    yieldrate: null,
                    fan_warranty_period: null,
                    market_power_ratio: null,
                    market_power_loss: null,
                    market_year: null,
                    voltage_level: null,
                    power_limiting_rate: null,
                    power_limiting_year: null
                },
                turbine_params: [],
                turbine_params_new: [],
                gridData:[
                    ["机型"],
                    ["单机容量(MW)"],
                    ["风机台数(台)"],
                    ["机组单价(元/MW)"]
                ],
                arr_unit_price:[],
                wind_params: {
                    generating_hours: null,
                    cut_hour: null,
                    photoptometer_quality: null,
                    airtower_mass: null,
                    windtower_maintenance: null,
                    wind_cycle: null,
                    altitude: null,
                    horizontal_distance: null,
                    surface_similarity: null,
                    forest_types: null,
                    wake_effect: null,
                    fan_availability: null,
                    equipment_losses: null,
                    power_curve: null,
                    environmental_loss: null
                },
                project_id: null,
                scheme_id: null,
                table: [],
                rules: {},
                errMsg: '',
                detailOneHeight: document.documentElement.clientHeight-400,
                openActive1: false,
                openActive2: false,
                openActive3: false
            };
        },
        computed: {
            // detailOneHeight() {
            //     return `${document.body.clientHeight - 100 - 74}px`;
            // },
            enManager: function () {
                if (this.$store.state.user.loginUserInfo.role === 3) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        watch: {
            'wind_params.reduction_factor' () {
                this.wind_params.cut_hour = (this.wind_params.generating_hours * this.wind_params.reduction_factor).toFixed(4);
            },
            '$store.state.client.screenWidth': function (val) {
                window.screenWidth = document.body.clientWidth;
                this.screenWidth = window.screenWidth;
                this.loadMoreWidth = `${(document.documentElement.offsetWidth || document.body.offsetWidth) * 0.9 / 3 - 73}px`;
            },
            // '$store.state.client.screenHeight': function (val) {
            //     this.detailOneHeight = document.body.clientHeight - 100 - 74;
            // },
           
            planId: function (val) {
                if(val){
                    // this.refreshData();
                }
            }
        },
        updated(){
            let that = this;
            window.onresize = function temp() {
                that.detailOneHeight = document.body.clientHeight - 400;
                console.log(document.documentElement.clientHeight,document.body.clientHeight,that.detailOneHeight);
            }
        },
        methods: {
            onInput(index=3,index2=1){
                // console.log(index,index2);
                var arr = [];
                this.gridData.map((item,index)=>{
                    item.map((item2,index2)=>{
                        if(index==3 && index2 != 0){
                            // console.log(item2)
                            arr.push(Number(item2));
                        }
                    })
                })
                // console.log(arr);
                this.arr_unit_price = arr;
                // console.log(this.turbine_params.map(value => value.unit_price));
            },
            offBlur(){
                this.isTrue = false
            },

            refreshData () {
                this.request();
                this.requestList();
                setTimeout(()=>{
                    this.onInput();
                },800)
            },
            vUnitPrice (index, unitPrice ,value) {
                console.log(value)
               if(value == ""){
                    this.isErr = true
               }
               else if(value<=0){
                    this.isErr = true
               }
               else{
                    this.isErr = false
               }
                // if(unitPrice.row.unit_price<=0) {
                //     this.$message.warning("机组单价请输入大于0的值");
                // }else {
                //     if (isNaN(this.turbine_params[index].unit_price)) {
                //         this.$refs['unitPrice' + index].show();
                //         return false;
                //     } else if (this.wind_params.wind_cycle <= 0) {
                //         this.$refs['unitPrice' + index].show();
                //         return false;
                //     }
                //     this.$refs['unitPrice' + index].hidden();
                //     return true;
                // }
                if (isNaN(this.turbine_params[index].unit_price)) {
                    
                    this.$refs['unitPrice' + index].show();
                    return false;
                } else if (this.wind_params.wind_cycle <= 0) {
                    
                    this.$refs['unitPrice' + index].show();
                    return false;
                }
                this.$refs['unitPrice' + index].hidden();
                return true;
            },
            vUnitPriceAll () {
                for (var index = 0; index < this.turbine_params.length; index++) {
                    return this.vUnitPrice(index);
                }
                return false;
            },
            // 建设工期
            validateConstructionTime () {
                const regexPlus = /^[1-9]\d*$/u;
                const val = this.engineering_params.construction_time;
                if (val && (isNaN(val) || !regexPlus.test(val))) {
                    this.$refs['constructionTimeErrTip'].show();
                    return false;
                } else {
                    this.$refs['constructionTimeErrTip'].hidden();
                    return true;
                }
            },
            // 钢塔单价
            validateTowerPrice () {
                const regexPlus = /^[1-9]\d*$/u;
                const val = this.engineering_params.tower_price;
                if (val && (isNaN(val) || !regexPlus.test(val))) {
                    this.$refs['towerPriceErrTip'].show();
                    return false;
                } else {
                    this.$refs['towerPriceErrTip'].hidden();
                    return true;
                }
            },
            // 锚栓单价（仅瞄栓）
            validateAnchorPrice () {
                const regexPlus = /^[1-9]\d*$/u;
                const val = this.engineering_params.anchor_price;
                if (val && (isNaN(val) || !regexPlus.test(val))) {
                    this.$refs['anchorPriceErrTip'].show();
                    return false;
                } else {
                    this.$refs['anchorPriceErrTip'].hidden();
                    return true;
                }
            },
            // 混凝土段总价
            validateTotalConcreteprice () {
                const regexPlus = /^[1-9]\d*$/u;
                const val = this.engineering_params.total_concreteprice;
                if (val && (isNaN(val) || !regexPlus.test(val))) {
                    this.$refs['totalConcretepriceErrTip'].show();
                    return false;
                } else {
                    this.$refs['totalConcretepriceErrTip'].hidden();
                    return true;
                }
            },
            // 送出工程
            validateSendProject () {
                const regex1Plus = /^[1-9]\d*$/;
                const val = this.engineering_params.send_project;
                if (val && (isNaN(val) || !regex1Plus.test(val))) {
                    this.$refs['sendProjectErrTip'].show();
                    return false;
                } else {
                    this.$refs['sendProjectErrTip'].hidden();
                    return true;
                }
            },
            // 10KV开关站
            validateTenSwitching() {
                const regexPlus = /^[1-9]\d*$/u;
                const val = this.engineering_params.ten_switching;
                if (val && (isNaN(val) || !regexPlus.test(val))) {
                    this.$refs['tenSwitchingErrTip'].show();
                    return false;
                } else {
                    this.$refs['tenSwitchingErrTip'].hidden();
                    return true;
                }
            },
            // 35KV开关站
            validateThirtyfiveSwitching() {
                const regexPlus = /^[1-9]\d*$/u;
                const val = this.engineering_params.thirtyfive_switching;
                if (val && (isNaN(val) || !regexPlus.test(val))) {
                    this.$refs['thirtyfiveSwitchingErrTip'].show();
                    return false;
                } else {
                    this.$refs['thirtyfiveSwitchingErrTip'].hidden();
                    return true;
                }
            },
            // 钢塔重量（选填）
            validateTowerWeight() {
                const regexFloat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/u;
                const val = this.engineering_params.tower_weight;
                if (val && (isNaN(val) || !regexFloat.test(val))) {
                    this.$refs['towerWeightErrTip'].show();
                    return false;
                } else {
                    this.$refs['towerWeightErrTip'].hidden();
                    return true;
                }
            },
            // 锚栓重量（选填）
            validateAnchorWeight() {
                const regexFloat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/u;
                const val = this.engineering_params.anchor_weight;
                if (val && (isNaN(val) || !regexFloat.test(val))) {
                    this.$refs['anchorWeightErrTip'].show();
                    return false;
                } else {
                    this.$refs['anchorWeightErrTip'].hidden();
                    return true;
                }
            },
            // 基础混凝土（选填）
            validateBaseReinforcement() {
                const regexFloat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/u;
                const val = this.engineering_params.base_reinforcement;
                if (val && (isNaN(val) || !regexFloat.test(val))) {
                    this.$refs['baseReinforcementErrTip'].show();
                    return false;
                } else {
                    this.$refs['baseReinforcementErrTip'].hidden();
                    return true;
                }
            },
            // 基础钢筋（选填）
            validateFoundationConcrete1() {
                const regexFloat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/u;
                const val = this.engineering_params.foundation_concrete1;
                if (val && (isNaN(val) || !regexFloat.test(val))) {
                    this.$refs['foundationConcrete1ErrTip'].show();
                    return false;
                } else {
                    this.$refs['foundationConcrete1ErrTip'].hidden();
                    return true;
                }
            },
            // 单台吊装费用（选填）
            validateSingleHoistingcost() {
                const regexFloat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/u;
                const val = this.engineering_params.single_hoistingcost;
                if (val && (isNaN(val) || !regexFloat.test(val))) {
                    this.$refs['singleHoistingcostErrTip'].show();
                    return false;
                } else {
                    this.$refs['singleHoistingcostErrTip'].hidden();
                    return true;
                }
            },
            // 线路导线截面
            validateConductorCross() {
                const regexPlus = /^[1-9]\d*$/u;
                const val = this.engineering_params.conductor_cross;
                if (val && (isNaN(val) || !regexPlus.test(val))) {
                    debugger
                    this.$refs['conductorCrossErrTip'].show();
                    return false;
                } else {
                    this.$refs['conductorCrossErrTip'].hidden();
                    return true;
                }
            },
            // 核准日期
            validateDateApproval() {
                const val = this.project_params.date_approval;
                console.log(util.validateDate(val),"日期格式")

                if (val && !util.validateDate(val)) {
                    this.$refs['dateApprovalErrTip'].show();
                    return false;
                } else {
                    this.$refs['dateApprovalErrTip'].hidden();
                    return true;
                }
            },
            // 开工日期
            validateDateCommencement() {
                const val = this.project_params.date_commencement;
                if (val && !util.validateDate(val)) {
                    this.$refs['dateCommencementErrTip'].show();
                    return false;
                } else {
                    this.$refs['dateCommencementErrTip'].hidden();
                    return true;
                }
            },
            // 资金成本
            validateCapital() {
                const val = this.project_params.capital;
                if (val && (isNaN(val) || val < 0 || val > 100)) {
                    this.$refs['capitalErrTip'].show();
                    return false;
                } else {
                    this.$refs['capitalErrTip'].hidden();
                    return true;
                }
            },
            // 资本金比例
            validateCapitalRatio() {
                const val = this.project_params.capital_ratio;
                if (val && (isNaN(val) || val < 0 || val > 100)) {
                    this.$refs['capitalRatioErrTip'].show();
                    return false;
                } else {
                    this.$refs['capitalRatioErrTip'].hidden();
                    return true;
                }
            },
            // 长期融资利率
            validateLongTermFinancingrate() {
                const val = this.project_params.long_term_financingrate;
                if (val && (isNaN(val) || val < 0 || val > 100)) {
                    this.$refs['longTermFinancingrateErrTip'].show();
                    return false;
                } else {
                    this.$refs['longTermFinancingrateErrTip'].hidden();
                    return true;
                }
            },
            // 融资期限
            validateDeadline() {
                const val = this.project_params.deadline;
                if (val && (isNaN(val) || !/^\d+$/.test(val) || val < 1 || val > 30)) {
                    this.$refs['deadlineErrTip'].show();
                    return false;
                } else {
                    this.$refs['deadlineErrTip'].hidden();
                    return true;
                }
            },
            // 折减系数
            validateReductionFactor() {
                if (isNaN(this.wind_params.reduction_factor)) {
                    this.$refs['reductionFactorErrTip'].show();
                    return false;
                }
                if (this.wind_params.reduction_factor === '') {
                    this.$refs['reductionFactorErrTip'].show();
                    return false;
                } else if (this.wind_params.reduction_factor > 1 || this.wind_params.reduction_factor < 0) {
                    this.$refs['reductionFactorErrTip'].show();
                    return false;
                } else {
                    this.$refs['reductionFactorErrTip'].hidden();
                    return true;
                }
            },
            //折减后等效小时数
            // validateCutHour() {
            //     var regex4Point = /^\d+(\.\d{1,4})?$/u;
            //     if (!regex4Point.test(this.wind_params.cut_hour)) {
            //         this.$refs['cutHourErrTip'].show();
            //         return false;
            //     }
            //     this.$refs['cutHourErrTip'].hidden();
            //     return true;
            // },
            // 测风周期
            vWindCycle() {
                if (isNaN(this.wind_params.wind_cycle)) {
                    this.$refs['windCycleErrTip'].show();
                    return false;
                } else if (this.wind_params.wind_cycle <= 0) {
                    this.$refs['windCycleErrTip'].show();
                    return false;
                }

                this.$refs['windCycleErrTip'].hidden();
                return true;
            },
            requestList() {
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
            request() {
                console.log(this.projectId,"projectId",this.$store.state.app.projectId);
                console.log(this.planId,"planId",this.$store.state.app.planId);
                util.ajax.get('/evaluation_output_params', {
                    params: {
                        project_id: this.$store.state.app.projectId,
                        scheme_id: this.$store.state.app.planId
                    }
                }).then((res) => {
                    console.log(res);
                    this.engineering_params = res.data.data.engineering_params;
                    this.project_params = res.data.data.project_params;
                    if(this.project_params.capital==0) {
                        this.project_params.capital = 6.1;
                    }
                    if(this.project_params.power_limiting_year==0) {
                        this.project_params.power_limiting_year = 20;
                    }
                    this.turbine_params = res.data.data.turbine_params;
                    this.wind_params = res.data.data.wind_params;
                    this.project_id = res.data.data.project_id;
                    this.scheme_id = res.data.data.scheme_id;
                    //竖表
                    this.turbine_params_new = res.data.data.turbine_params;
                    this.transformData(this.turbine_params_new);

                }).catch((err) => {
                    console.log(err);
                    // this.$message.error('取得经评参数失败！');
                });
            },
            transformData(data){
                console.log(data);
                this.initgridData();
                data.forEach((item,index)=>{
                    this.gridData[0].push(item.pool);
                    this.gridData[1].push(item.single_capacity);
                    this.gridData[2].push(item.fannum);
					this.gridData[3].push(item.unit_price);
                })
            },
            initgridData(){
                this.turbine_params_new = [];
                this.gridData = [
                    ["机型"],
                    ["单机容量(MW)"],
                    ["风机台数(台)"],
                    ["机组单价(元/MW)"]
                ]
            },
            post() {
                if (!this.validateReductionFactor()) {
                    this.$message.error('请确认您的数据格式!');
                    return;
                }
                // if (!this.validateCutHour()) {
                //     this.$message.error('数据格式不正确，请确认!');
                //     return;
                // }
                if (!this.vWindCycle()) {
                    this.$message.error('请确认您的数据格式!');
                    return;
                }

                // 工程量概算参数保存校验
                if (!this.validateConstructionTime() || !this.validateTowerPrice() || !this.validateAnchorPrice() ||
                    !this.validateTotalConcreteprice() || !this.validateSendProject() || !this.validateTenSwitching() ||
                    !this.validateThirtyfiveSwitching() || !this.validateTowerWeight() || !this.validateAnchorWeight() ||
                    !this.validateBaseReinforcement() || !this.validateFoundationConcrete1() || !this.validateSingleHoistingcost() ||
                    !this.validateConductorCross() ) {
                    this.$message.error('请确认您的数据格式!');
                    return;
                }

                console.log('validate success~!');
                util.ajax.post('/evaluation_output_params',
                    {
                        project_id: this.projectId,
                        scheme_id: this.planId,
                        company: this.project_params.company,
                        out_line_len: this.project_params.out_line_len,
                        date_approval: this.project_params.date_approval,
                        date_commencement: this.project_params.date_commencement,
                        capital: this.project_params.capital,
                        capital_ratio: this.project_params.capital_ratio,
                        financing_way: this.project_params.financing_way,
                        long_term_financingrate: this.project_params.long_term_financingrate,
                        deadline: this.project_params.deadline,
                        mode_repayment: this.project_params.mode_repayment,
                        // unit_price: this.turbine_params.map(value => value.unit_price),
                        unit_price: this.arr_unit_price, //竖表数据
                        reduction_factor: this.wind_params.reduction_factor,
                        photoptometer_quality: this.wind_params.photoptometer_quality,
                        airtower_mass: this.wind_params.airtower_mass,
                        windtower_maintenance: this.wind_params.windtower_maintenance,
                        wind_cycle: this.wind_params.wind_cycle,
                        surface_similarity: this.wind_params.surface_similarity,
                        forest_types: this.wind_params.forest_types,
                        wake_effect: this.wind_params.wake_effect,
                        fan_availability: this.wind_params.fan_availability,
                        equipment_losses: this.wind_params.equipment_losses,
                        power_curve: this.wind_params.power_curve,
                        environmental_loss: this.wind_params.environmental_loss,
                        construction_time: this.engineering_params.construction_time,
                        tower_price: this.engineering_params.tower_price,
                        anchor_price: this.engineering_params.anchor_price,
                        total_concreteprice: this.engineering_params.total_concreteprice,
                        send_project: this.engineering_params.send_project,
                        nbooster: this.engineering_params.nbooster,
                        ten_switching: this.engineering_params.ten_switching,
                        thirtyfive_switching: this.engineering_params.thirtyfive_switching,
                        tower_weight: this.engineering_params.tower_weight,
                        anchor_weight: this.engineering_params.anchor_weight,
                        base_reinforcement: this.engineering_params.base_reinforcement,
                        foundation_concrete1: this.engineering_params.foundation_concrete1,
                        single_hoistingcost: this.engineering_params.single_hoistingcost,
                        conductor_cross: this.engineering_params.conductor_cross,
                        fanbase: this.engineering_params.fanbase.map(Number),  //
                        fanplatform: this.engineering_params.fanplatform.map(Number),//
                        // boosterstation: this.engineering_params.boosterstation,
                        boosterstation: this.engineering_params.boosterstation.map(Number),          
                        stationroad: this.engineering_params.stationroad.map(Number),//
                        // baseroad: this.engineering_params.baseroad,
                        baseroad: this.engineering_params.baseroad.map(Number),                      
                        redevelopmentroad: this.engineering_params.redevelopmentroad.map(Number),//
                        cut_hour: this.wind_params.cut_hour,   //新增的参数
                        terrain: this.engineering_params.terrain  //补上地形也post
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then((res) => {
                        this.$emit('save');
                    })
                    .catch((/* err */) => {
                        this.$message.error('保存经评参数失败！');
                    });
            },
            loadMore () {
                this.overFlow = false ;
            },
            hiddenMore () {
                this.overFlow = true ;
            }
        },
        created () {
            this.loadMoreWidth = `${(document.documentElement.offsetWidth || document.body.offsetWidth) * 0.9 / 3 - 73}px`;
            // this.refreshData();
        }
    };
</script>
<style lang="less" scoped>
    @import "./details-two";
    .minbox{
        position: relative;
        left:-10px;
        &>span{
          position: absolute;
          right: -13px;
          top:0;
          font-size:14px;
        }
    }
    .minbox2{
        position: relative;
        left:-10px;
        &>span{
          position: absolute;
          right: 0px;
          top:0;
          font-size:14px;
        }
    }
    .minbox1{
        left:-7px;
    }
    .detail2{
        margin-bottom: 0 !important;
    }
    .detail2 .offmytooltip{
        display: none !important;
        opacity: 0;
    }
    .errBorder{
        border: 1px solid red !important;
    }
    
    .el-form-item__label{
        color: RGBA(211, 219, 228, 0.6) ;
        opacity: 1!important;
    }
    .box {
        border: none !important;
        
        /deep/ .el-input--suffix{
            width: 160px;
        }
        .custom-table-row{
            /deep/ .el-input__inner{
                padding: 0!important;
                text-align: center;
            }
        }
    }
    .conductorCross {
        margin-left: -30px;
    }
/* /////////////////////// */
.title-name-self1{
    height: 206px;
    overflow: hidden;
}
.title-name-self3{
    height: 118px;
    overflow: hidden;
}
.custom-table-header2{
    border-top:1px solid rgba(211,219,228,0.6);
}
.bottombox{
    width: 100%;
    font-size: 13px;
    display: flex;
    .leftBox,.centerBox,.rightBox{
        width: 28%;
        padding-bottom: 40px;
        
        .openBtn{
            width: 100%;
            height: 20px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            padding:  0 20px;
            box-sizing: border-box;
            &>span{
                width: 100%;
                display: inline-block;
                border:1px solid rgba(211,219,228,0.6);
            }
        }
        .title{
            padding: 10px 20px;
            font-weight: bold;
        }
        .unit2{
            width: 60px !important;
            position: absolute;
            right: 0;
        }
        /deep/ .el-form-item{
            padding: 0 !important;
            height: 25px !important;
            border: none !important;
        }
        /deep/ .el-form-item__label{
            height: 25px !important;
            line-height: 25px !important;
            margin-left: 20px !important;
            font-size: 13px !important;
        }
        /deep/ .el-form-item__content{
            height: 25px !important;
            padding-left: 50px !important;
            font-size: 13px !important;
        }
        /deep/ .el-input__inner{
            padding: 0 !important;
        }
        /deep/ .el-input{
            width: 120px !important;
            min-width: 0 !important;
        }
    }
    .centerBox{
        width: 36%;
        .title-name-self2{
            border:1px solid rgba(211,219,228,0.6);
            border-top: none;
            border-bottom: none;
            /deep/ .el-input{
                width: 130px !important;
            }
            /deep/ .el-form-item__content{
                padding-left: 70px !important;
            }
        }
        .custom-table-header{
            justify-content: initial !important;
            &>div{
                flex:1;
                text-align: left;
            }
        }
       
        
    }
    .rightBox /deep/ .el-input__inner{
        text-align: center !important;
    }
    .rightBox{
        width: 36%;
        border:1px solid rgba(211,219,228,0.6);
        .box2{
            overflow-x: auto;
        }
        /deep/ .el-input{
            width: 170px !important;
        }
        /deep/ .el-form-item__content{
            padding-left: 100px !important;
        }
        .mytable{
            width: 100%;
            padding-bottom: 20px;
            border-bottom:1px solid rgba(211,219,228,0.6);
            tr{
                display: flex;
                td{
                    /* flex: 1; */
                    height: 31px;
                    padding-top: 5px;
                    /* line-height: 31px; */
                    text-align: center;
                    /* overflow: hidden; */
                    /* white-space: nowrap; */
                    /* text-overflow: ellipsis; */
                    width: 93px;
                    padding-left: 20px;
                }
                td:nth-of-type(1){
                    flex: none !important;
                    display: inline-block;
                    width: 60px !important;	
                    text-align: left;
                    
                }
            }
        }
    }
}

</style>
