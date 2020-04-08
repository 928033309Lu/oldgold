<template>
    <el-dialog title="风电场收益率评估详情"
               :modal="false"
               :visible.sync="dialogVisible"
               width="32%">
        <div class="contentBox">
            <el-row>
                <el-col class="key" :span="12">项目容量：</el-col>
                <el-col class="value" :span="12">{{ ruleForm.capacity }}　万千瓦</el-col>
            </el-row>
            <el-row>
                <el-col class="key" :span="12">等效小时数：</el-col>
                <el-col class="value" :span="12">{{ ruleForm.equivalent_hours }}　小时</el-col>
            </el-row>
            <el-row>
                <el-col class="key" :span="12">单位总投资：</el-col>
            </el-row>
            <el-row>
                <el-col class="key" :span="12" style="padding-left: 15px;">——风机：</el-col>
                <el-col class="value" :span="12">{{ ruleForm.investments_turbines }}　元/千瓦</el-col>
            </el-row>
            <el-row>
                <el-col class="key" :span="12" style="padding-left: 15px;">——塔筒：</el-col>
                <el-col class="value" :span="12">{{ ruleForm.investments_towers }}　元/千瓦</el-col>
            </el-row>
            <el-row>
                <el-col class="key" :span="12" style="padding-left: 15px;">——基本：</el-col>
                <el-col class="value" :span="12">{{ ruleForm.investments_basics}}　元/千瓦</el-col>
            </el-row>
            <el-row>
                <el-col class="key" :span="12">度电成本：</el-col>
                <el-col class="value" :span="12">{{ ruleForm.vat_cit }}　元/千瓦时</el-col>
            </el-row>
            <el-row>
                <el-col class="key" :span="12">PT（投资回收期）：</el-col>
                <el-col class="value" :span="12">{{ ruleForm.pt }}　年</el-col>
            </el-row>
            <el-row>
                <el-col class="key" :span="12">NPV（净现值）：</el-col>
                <el-col class="value" :span="12">{{ ruleForm.n_p_v }}　万元</el-col>
            </el-row>
            <el-row>
                <el-col class="key" :span="12">PIRR收益率：</el-col>
                <el-col class="value" :span="12">{{ ruleForm.p_i_r_r }}　%</el-col>
            </el-row>
            <el-row>
                <el-col class="key" :span="12">EIRR收益率：</el-col>
                <el-col class="value" :span="12">{{ ruleForm.e_i_r_r }}　%</el-col>
            </el-row>
        </div>
    </el-dialog>
</template>

<script>
    import util from '@/libs/util';

    export default {
        name: 'plan-detail',
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
            }
        }
    };
</script>

<style lang="less" scoped>
    .contentBox {
        width: 80%;
        opacity: 0.6;
        margin: 0px auto;
        .key {
            color: #D4EFF6;
        }
        .value {
            color: #33C86F;
            text-indent: 20px;
        }
    }
</style>
