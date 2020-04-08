<template>
    <div class="planDetailBox">
        <div class="header-panel">
            <span class="header-text"> </span>
            <div @click="onClose" style="height: 30px;width: 30px;z-index: 3">
                <icon class="header-icon" name="close"></icon>
            </div>
        </div>

        <el-row class="detail-row" style="margin-top: 5px;height: 37px;">
            <el-col class="title-value" :span="24">
                <div style="height: 37px;display: flex;flex-direction: row;">
                    <div style="height: 37px;color: white;">{{ ruleForm.scheme_name }}</div>
                    <div style="width:58px;display: flex;flex-direction: row;justify-content: center;align-items: center;margin-left: 10px;">
                        <div style="height: 1px;width:53px;border-top-style:solid;border-top-width:1px;border-top-color: rgba(212,239,246,0.8);"></div>
                        <div style="height: 37px;width:5px;height: 5px;background:rgba(212,239,246,0.8);border-radius:50%;"></div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class="detail-row" style="margin-top: 20px;font-weight: bold;height: 40px;">
            <el-col class="title-key" style="height: 40px;" :span="24">{{ ruleForm.p_i_r_r }}%<span class="irr-key">收益率</span></el-col>
        </el-row>
        <el-row class="detail-row" style="margin-top: 8px;">
            <el-col class="key" :span="12">项目容量：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.capacity }}　万千瓦</el-col>
        </el-row>
        <el-row class="detail-row">
            <el-col class="key" :span="12">等效小时数：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.equivalent_hours }}　小时</el-col>
        </el-row>
        <el-row class="detail-row">
            <el-col class="key" :span="12">单位总投资：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.investments_total }}　万元</el-col>
        </el-row>
        <el-row class="detail-row">
            <el-col class="key" :span="12" >——风机：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.investments_turbines }}　元/千瓦</el-col>
        </el-row>
        <el-row class="detail-row">
            <el-col class="key" :span="12" >——塔筒：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.investments_towers }}　元/千瓦</el-col>
        </el-row>
        <el-row class="detail-row">
            <el-col class="key" :span="12" >——基本：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.investments_basics}}　元/千瓦</el-col>
        </el-row>
        <el-row class="detail-row">
            <el-col class="key" :span="12">度电成本：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.vat_cit }}　元/千瓦时</el-col>
        </el-row>
        <el-row class="detail-row">
            <el-col class="key" :span="12">PT（投资回收期）：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.pt }}　年</el-col>
        </el-row>
        <el-row class="detail-row">
            <el-col class="key" :span="12">NPV（净现值）：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.n_p_v }}　万元</el-col>
        </el-row>
        <el-row class="detail-row">
            <el-col class="key" :span="12">PIRR收益率：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.p_i_r_r }}　%</el-col>
        </el-row>
        <el-row class="detail-row" style="margin-bottom: 10px">
            <el-col class="key" :span="12">EIRR收益率：</el-col>
            <el-col class="value" :span="12">{{ ruleForm.e_i_r_r }}　%</el-col>
        </el-row>
    </div>
</template>

<script>
    import util from '@/libs/util';

    export default {
        name: 'plan-detail2',
        props: {
        },
        data () {
            return {
                ruleForm: {},
                projectId: null,
                planId: null,
                dialogVisible: false
            };
        },
        methods: {
            open (projectId, planId) {
                this.dialogVisible = true;
                this.planId = planId;
                this.projectId = projectId;

                this.ruleForm = {};
                util.ajax.get('/output_ror/' + this.projectId + '/' + this.planId, {}).then((res) => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }

                    this.ruleForm = retData.data;
                }).catch((/* err */) => {
                    this.$message.error('取得风电场收益率评估详情数据失败！');
                });
            },
            onClose () {
                this.$emit('close');
            }
        }
    };
</script>

<style lang="less" scoped>
    .planDetailBox {
        padding-left: 20px;
        padding-bottom: 10px;
        position: absolute;
        right: 0px;
        top: 150px;
        width: 317px;
        height: 405px;
        background:rgba(3,32,62,0.6);
        /*opacity: 0.6;*/
        margin: 0px auto;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        .header-panel{
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
        .header-icon{
            color:rgba(212,239,246,1);
            margin-right: 11px;
            height: 16px;
            line-height: 16px;
            font-size: 16px;
            cursor: pointer;
            font-weight: 900;
            opacity: 0.8;
        }
        .header-icon:hover{
             color:#FFF;
             opacity: 1;
        }
        .detail-row{
            margin-top: 5px;
            height: 18px;
        }
        .key {
            color: #D4EFF6;
            font-size: 14px;
            padding-left: 25px;
        }
        .value {
            color: #33C86F;
            text-indent: 10px;
            font-size: 14px;
        }
        .title-value{
            color: #D4EFF6;
            font-size: 24px;
            padding-left: 25px;
        }
        .title-key{
            color:rgba(51,200,111,1);
            padding-left: 25px;
            line-height:13px;
            height: 13px;
            font-size:30px;
        }
        .irr-key {
            color: #D4EFF6;
            font-size: 14px;
            padding-left: 5px;
            font-weight: normal;
        }
    }
</style>
