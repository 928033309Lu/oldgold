<template>
    <my-dialog title="修改密码"
               :visible.sync="dialogVisible"
               @open="onOpen"
               @close="onClose"
               width="400px"
               top="30vh"
               custom-class="passwordChange" class="myDialog">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
            <el-form-item prop="oldPass" style="margin-top:10px;line-height:0px !important;">
                <el-input type="password" v-model.trim="ruleForm.oldPass" auto-complete="off"
                          placeholder="请输入原密码"></el-input>
            </el-form-item>
            <el-form-item prop="pass">
                <el-input type="password" v-model.trim="ruleForm.pass" auto-complete="off"
                          placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password" v-model.trim="ruleForm.checkPass" auto-complete="off"
                          placeholder="请再次输入新密码"></el-input>
            </el-form-item>
            <el-form-item class="btnBox">
                <el-button class="gf-button" style="width: 208px;" type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </my-dialog>
</template>

<script>
    import util from '@/libs/util';
    import MyDialog from '../common/my-dialog';

    export default {
        name: 'password-change',
        components: {MyDialog},
        data () {
            const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/u;
            var validateOldPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入原密码'));
                } 
                // else if (!regex.test(value)) {
                //     callback(new Error('请输入英文数字组合，长度在6到20个字符'));
                // } 
                else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else if (!regex.test(value)) {
                    callback(new Error('请输入英文数字组合，长度在6到20个字符'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validateCheckPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (!regex.test(value)) {
                    callback(new Error('请输入英文数字组合，长度在6到20个字符'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible: false,
                ruleForm: {
                    oldPass: '',
                    pass: '',
                    checkPass: ''
                },
                rules: {
                    oldPass: [
                        {validator: validateOldPass, trigger: 'blur'}
                    ],
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validateCheckPass, trigger: 'blur'}
                    ]
                },
                // loginUserInfo: JSON.parse(sessionStorage.getItem("goldfarm.loginUser") )
            };
        },
        computed: {
            loginUserInfo () {
                return this.$store.state.user.loginUserInfo;
            }
        },
        methods: {
            open () {
                this.dialogVisible = true;
            },
            close () {
                this.dialogVisible = false;
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const userId = this.$store.state.user.loginUserInfo.user_id || this.loginUserInfo.user_id;
                        util.ajax.post('/update_password/' + userId, {
                            password_old: this.ruleForm.oldPass,
                            password_new1: this.ruleForm.pass,
                            password_new2: this.ruleForm.checkPass
                        }).then(res => {
                            let retData = res.data;
                            if (retData.code !== 201) {
                                this.$message.error(retData.message);
                                return;
                            }
                            this.$message.success(retData.message);
                            this.$emit('close');
                        }).catch((/* err */) => {
                            this.$message.error('修改密码失败！');
                        });
                    } else {
                        return false;
                    }
                });
            },
            onClose () {
                this.$emit('close');
            },
            onOpen () {
                if (this.$refs['ruleForm']) {
                    this.$refs['ruleForm'].resetFields();
                }
            }
        }
    };
</script>

<style lang="less" scoped>

    .btnBox {
        text-align: center;
        margin-top: 20px;
    }

    .el-form {
        width: 70%;
        margin: 0px auto;
    }
    .myDialog{
        /deep/ .el-input__suffix{
            display: none;
        }
        /deep/ .el-form-item__error{
            transform: scale(0.83);
            transform-origin: right center;
        }
    }
    // .myDialog>>>.el-input__suffix{
    //     display: none;
    // }
    // .myDialog>>>.el-form-item__error{
    //     transform: scale(0.83);
    //     transform-origin: right center;
    // }

</style>
