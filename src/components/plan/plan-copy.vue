<template>
    <el-dialog title="复制方案"
               :modal="false"
               :visible.sync="dialogVisible"
               width="30%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
            <el-form-item prop="planName">
                <el-input v-model="ruleForm.planName" placeholder="请输入方案名称" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item prop="selectBasePlan">
                <el-select v-model="ruleForm.selectBasePlan" placeholder="请选择基准方案" popper-class="gf-popper" style="width:100%;">
                    <el-option v-for="item in ruleForm.basePlans"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="remark">
                <el-input type="textarea" :rows="4" v-model="ruleForm.remark" placeholder="备注" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item class="btnBox" >
                <el-button class="gf-button" v-show="!loading" style="width: 208px;" type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import util from '@/libs/util';

    export default {
        name: 'plan-copy',
        props: {
        },
        data () {
            return {
                dialogVisible: false,
                ruleForm: {
                    planName: '',
                    remark: '',
                    selectBasePlan: null,
                    basePlans: []
                },
                rules: {
                    planName: [
                        {required: true, message: '请输入方案名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '方案名称不得超过10个字符或汉字', trigger: 'blur'}
                    ],
                    selectBasePlan: [
                        { required: true, message: '请选择基准方案', trigger: 'change' }
                    ],
                    remark: [
                        {min: 0, max: 100, message: '备注不得超过100个字符或汉字', trigger: 'blur'}
                    ]
                },
                projectId: '',
                loading: false
            };
        },
        mounted () {
        },
        watch: {
            loading () {
                this.$store.commit('globeLoading', {loading: this.loading, text: '正在复制方案，请稍等...'});
            }
        },
        methods: {
            submitForm (formName) {
                let args = 'of'; // 默认为复制的GoldFoam方案
                if (Number(this.ruleForm.selectBasePlan) < 0) {
                    // 方案ID小于0表示为WT方案
                    args = 'wt';
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        const config = {
                            timeout: 180000
                        };
                        util.ajax.post('/scheme_copy/' + this.projectId + '/' + this.ruleForm.selectBasePlan, {
                            scheme_name: this.ruleForm.planName,
                            remark: this.ruleForm.remark,
                            args: args
                        }, config).then(res => {
                            this.loading = false;
                            let retData = res.data;
                            if (retData.code !== 200 && retData.code !== 201) {
                                // console.log(retData.message,123)
                                this.$message.error("复制失败，错误码："+retData.message);
                                return;
                            }
                            this.$emit('planCopyCompleted');
                            this.dialogVisible = false;
                            this.$message.success('复制方案成功！');
                        }).catch((/* err */) => {
                            this.loading = false;
                            this.$message.error('复制方案失败！');
                        });
                    } else {
                        return false;
                    }
                });
            },
            open (projectId, planId) {
                this.projectId = projectId;
                this.dialogVisible = true;
                if (this.$refs['ruleForm']) {
                    this.$refs['ruleForm'].resetFields();
                }

                util.ajax.get('/scheme_list/' + projectId, {}).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }

                    this.ruleForm.basePlans = retData.data.map((ele, index, arr) => {
                        return {value: ele.scheme_id, label: ele.scheme_name ? ele.scheme_name : ele.scheme_id};
                    });
                    this.ruleForm.selectBasePlan = planId;
                }).catch((/* err */) => {
                    this.$message.error('取得基准方案数据失败！');
                });
            }
        }
    };
</script>

<style scoped>

    .btnBox {
        text-align: center;
        margin-top: 20px;
    }

    .el-form {
        width: 85%;
        margin: 0px auto;
    }

</style>
