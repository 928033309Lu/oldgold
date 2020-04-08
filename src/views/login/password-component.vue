<style lang="less">
    @import '../../styles/common.less';
    @import 'password.less';
</style>

<template>
    <div class="login">
        <div class="box">
            <div class="login-con">
                <el-card header="重置密码">
                    <div class="form-con regBox">
                        <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
                            <el-form-item prop="tel">
                                <icon name="shoujihao"></icon>
                                <el-input ref="tel" v-model.trim="ruleForm.tel" auto-complete="off"
                                          placeholder="手机号"></el-input>
                                <a href="javascript:;" class="getCode" @click="codeSend" :disabled="isDisabled"
                                   :style="{'pointer-events':isDisabled?'none':'auto'}">{{buttonName}}</a>
                            </el-form-item>
                            <el-form-item prop="sendCode">
                                <icon name="yanzhengma"></icon>
                                <el-input v-model.trim="ruleForm.sendCode" auto-complete="off"
                                          placeholder="验证码"></el-input>
                            </el-form-item>
                            <el-form-item prop="pass">
                                <icon name="password"></icon>
                                <el-input type="password" v-model="ruleForm.pass" auto-complete="off"
                                          placeholder="输入新密码"></el-input>
                            </el-form-item>
                            <el-form-item prop="checkPass">
                                <icon name="mima1"></icon>
                                <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"
                                          placeholder="再次输入新密码" @keydown.enter.native="submitForm('ruleForm')">
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')">重置密码</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </div>
            <div class="regTxt"><a href="javascript:;" @click="reLogin" class="cGreen">返回登录</a></div>
        </div>
    </div>
</template>

<script>
    import util from '@/libs/util';
    export default {
        name: 'password',
        data () {
            const telRegex = /^1[3|4|5|7|8][0-9]\d{8}$/u;
            var validateTel = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号'));
                } else if (!telRegex.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                } else {
                    callback();
                }
            };
            const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/u;
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
                buttonName: '获取验证码',
                isDisabled: false,
                time: 60,
                ruleForm: {
                    tel: '',
                    sendCode: '',
                    pass: '',
                    checkPass: ''
                },
                rules: {
                    tel: [
                        {validator: validateTel, trigger: 'blur'}
                    ],
                    sendCode: [
                        { required: true, message: '请输入手机验证码', trigger: 'blur' }
                    ],
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validateCheckPass, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted () {

        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 忘记密码接口
                        util.ajax.post('/forget', {
                            phone: this.ruleForm.tel,
                            verify_code: this.ruleForm.sendCode,
                            password1: this.ruleForm.pass,
                            password2: this.ruleForm.checkPass
                        }).then(res => {
                            let retData = res.data;
                            if (retData.code !== 201) {
                                this.$message.error(retData.message);
                                return;
                            }
                            // 跳转修改密码成功画面
                            this.$router.push({
                                name: 'success'
                            });
                            setTimeout(() => {
                                this.loading.close();
                            }, 1000);
                        }).catch((/* err */) => {
                            this.$message.error('重置密码失败！');
                        });
                    } else {
                        return false;
                    }
                });
            },
            codeSend () {
                this.$refs.ruleForm.validateField('tel', (valid) => {
                    if (!valid) {
                        // 获取验证码
                        util.ajax.post('/verify_send?tag=forget', {
                            phone: this.ruleForm.tel
                        }).then(res => {
                            let retData = res.data;
                            if (retData.code !== 200) {
                                this.$message.error(retData.message);
                                return;
                            }
                            this.$emit('close');
                            this.$message.success('获取验证码成功!');

                            // 60s倒计时
                            let me = this;
                            me.isDisabled = true;
                            let interval = window.setInterval(function () {
                                me.buttonName = me.time + 's后重新获取';
                                --me.time;
                                if (me.time < 0) {
                                    me.buttonName = '重新获取';
                                    me.time = 60;
                                    me.isDisabled = false;
                                    window.clearInterval(interval);
                                }
                            }, 1000);
                        }).catch((/* err */) => {
                            this.$message.error('获取验证码失败！');
                        });
                    } else {
                        return false;
                    }
                });
            },
            reLogin () {
                this.$emit('changeview','loginVue');
                this.$router.push({
                    name: 'login',
                    query: {
                        p: 'login'
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

</style>