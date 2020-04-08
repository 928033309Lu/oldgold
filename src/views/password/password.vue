<style lang="less">
    @import '../../styles/common.less';
    @import 'password.less';
</style>

<template>
    <div class="password">
        <div class="password-head" >
            <a href="#" class="logo"></a>
            <div class="headTxt">
                <img src="../../images/loginTxt.png"/>
                <div class="logTitle">三维数字化风电场规划设计一体化平台</div>
            </div>
            <div class="loginDiv">
                <div  onclick="location.href = '#passTag'" class="loginBtn" id="resetPas">
                    <div class="fontStyle">进入</div>
                    <img src="../../images/login.png"/>
                </div>
            </div>
            <vue-particles
                    color="#ffffff"
                    :particleOpacity="0.3"
                    linesColor="#ffffff"
                    :particlesNumber="60"
                    shapeType="circle"
                    :particleSize="3"
                    :linesWidth="1"
                    :lineLinked="true"
                    :lineOpacity="0.2"
                    :linesDistance="300"
                    :moveSpeed="3"
                    :hoverEffect="true"
                    hoverMode="grab"
                    :clickEffect="true"
                    clickMode="push"
            >
            </vue-particles>
        </div>


        <div class="box">
            <div class="login-con">
                <el-card header="重置密码">
                    <div class="form-con regBox">
                        <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
                            <el-form-item prop="tel">
                                <icon name="shoujihao"  style="font-size: 30px;"></icon>
                                <el-input ref="tel" v-model.trim="ruleForm.tel" placeholder="手机号"></el-input>
                                <a href="javascript:;" class="getCode" @click="codeSend" :disabled="isDisabled"
                                   :style="{'pointer-events':isDisabled?'none':'auto'}">
                                    <div style='font-family: "PingFang SC",STHeitiSC-Light,"Microsoft YaHei",sans-serif;font-weight: lighter;'>
                                        {{buttonName}}
                                    </div>
                                </a>
                            </el-form-item>
                            <el-form-item prop="sendCode">
                                <icon name="yanzhengma"  style="font-size: 30px;"></icon>
                                <el-input v-model.trim="ruleForm.sendCode" placeholder="验证码"></el-input>
                            </el-form-item>
                            <el-form-item prop="pass">
                                <icon name="password"></icon>
                                <el-input type="password" v-model="ruleForm.pass" auto-complete="new-password" placeholder="输入新密码"></el-input>
                            </el-form-item>
                            <el-form-item prop="checkPass">
                                <icon name="mima1"></icon>
                                <el-input type="password" v-model="ruleForm.checkPass" auto-complete="new-password"
                                          placeholder="再次输入新密码" @keydown.enter.native="submitForm('ruleForm')">
                                </el-input>
                            </el-form-item>
                            <el-form-item>

                                <el-button  @click="submitForm('ruleForm')" ><div style='font-family: "PingFang SC",STHeitiSC-Light,"Microsoft YaHei",sans-serif;font-weight: lighter;'>重置密码</div></el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </div>
            <div class="regTxt"><a href="javascript:;" @click="reLogin" class="cGreen" name="passTag" style="z-index:9999">返回登录</a></div>
        </div>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import VueParticles from '../../components/vue-particles/vue-particles';

    export default {
        name: 'password',
        components: {
            VueParticles,
        },
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
            location.href = '#passTag';
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
                this.$router.replace('/login?p=login');
            }
        }
    };
</script>

<style lang="less" scoped>

</style>