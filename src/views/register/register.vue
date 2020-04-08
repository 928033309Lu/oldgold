<style lang="less">
    @import '../../styles/common.less';
    @import './register.less';
</style>
<template>
    <div class="register" >
        <div class="register-head" >
            <a href="#" class="logo"></a>
            <div class="headTxt">
                <img src="../../images/loginTxt.png"/>
                <div class="logTitle">三维数字化风电场规划设计一体化平台</div>
            </div>
            <div class="loginDiv">

                <div onclick="location.href = '#registerTag'" class="loginBtn" id="registerBtn">
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
                <el-card header="注册">
                    <div class="form-con regBox">
                        <el-form ref="reg" :model="reg" :rules="regRules">
                            <el-form-item prop="phone">
                                <icon name="shoujihao" style="font-size: 30px;"></icon>
                                <el-input v-model.trim="reg.phone" ref="phone" placeholder="手机号"></el-input>
                                <a href="javascript:" @click="sendVerify" class="getCode">
                                    <div style='font-family: "PingFang SC",STHeitiSC-Light,"Microsoft YaHei",sans-serif;font-weight: lighter;'>
                                        获取验证码
                                    </div>
                                </a>
                            </el-form-item>
                            <el-form-item prop="verifyCode">
                                <icon name="yanzhengma" style="font-size: 30px;"></icon>
                                <el-input v-model="reg.verifyCode" placeholder="验证码"></el-input>
                            </el-form-item>
                            <el-form-item prop="userName">
                                <icon name="user"></icon>
                                <el-input v-model="reg.userName" placeholder="用户名"></el-input>
                            </el-form-item>
                            <el-form-item prop="mail">
                                <icon name="youxiang"></icon>
                                <el-input v-model="reg.mail" placeholder="常用邮箱"></el-input>
                            </el-form-item>
                            <el-form-item  prop="ownerMame">
                                <icon name="qiye" style="font-size: 30px;"></icon>
                                <el-select v-model="reg.ownerMame" placeholder="请选择">
                                    <el-option
                                            v-for="item in reg.owners"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="password">
                                <icon name="password"></icon>
                                <el-input v-model="reg.password"  auto-complete="new-password" :type='inputType' placeholder="登录密码"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="registerUser"><div style='font-family: "PingFang SC",STHeitiSC-Light,"Microsoft YaHei",sans-serif;font-weight: lighter;'>立即注册</div></el-button>
                            </el-form-item>
                            <p class="text">点击[立即注册]按钮将视为您同意GOLDFARM&nbsp;<a href="javascript:;" style="color: #495253" >使用条款</a></p>
                        </el-form>
                    </div>
                </el-card>
            </div>
            <div class="regTxt" >已有帐号，<a href="javascript:;" @click="login()" class="cGreen" name="registerTag" style="z-index:9999">登录</a></div>
        </div>
    </div>

</template>

<script>
    import util from '@/libs/util';
    import VueParticles from '../../components/vue-particles/vue-particles';
    export default {
        name: 'register',
        components: {
            VueParticles,
        },
        data() {
            // const telRegex = /^1[3|4|5|7|8][0-9]\d{8}$/u;
            const telRegex = /^1\d{10}$/
            var validateTel = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号'));
                } else if (!telRegex.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                } else {
                    callback();
                }
            };
            var validateVerifyCode = (rule, value, callback) => {
                const regex = /^\d{6}$/
                if (value === '') {
                    callback(new Error('验证码不能为空'));
                } else if (!regex.test(value)) {
                    callback(new Error('验证码应为6位数字'));
                } else {
                    callback();
                }
            }
            var validateUsername = (rule, value, callback) => {
                const regex = /^[a-zA-Z0-9]{4,20}$/
                if (value === '') {
                    callback(new Error('用户名不能为空'));
                } else if (!regex.test(value)) {
                    callback(new Error('用户名应为英文、数字组合，长度4-20之间'));
                } else {
                    callback();
                }
            }
            var validatePassword = (rule, value, callback) => {
                // const regex = /^[a-zA-Z0-9]{6,20}$/
                const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/u;
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else if (!regex.test(value)) {
                    callback(new Error('密码应为英文、数字组合，长度6-20之间'));
                } else {
                    callback();
                }
            }
            var validateEmail = (rule, value, callback) => {
                // const regex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
                const regex = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\.[a-zA-Z0-9]{2,6}$/
                if(!regex.test(value)) {
                    callback(new Error('邮箱的名称/域名只允许有英文数字下划线组成'));
                } else {
                    callback();
                }
            }
            return {
                reg: {
                    phone: '',
                    verifyCode: '',
                    userName: '',
                    mail: '',
                    ownerMame: '',
                    password: '',
                    owners: []
                },
                inputType: 'password',
                regRules: {
                    phone: [
                        {validator: validateTel, trigger: 'blur'}
                    ],
                    verifyCode: [
                        {validator: validateVerifyCode, trigger: 'blur'}
                    ],
                    userName: [
                        {validator: validateUsername, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ],
                    mail: [
                        {required: true, message: '邮箱不能为空', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
                        {validator: validateEmail, trigger: ['blur', 'change']}
                    ],
                    ownerMame: [
                        {required: true, message: '业主名称不能为空', trigger: ['blur','change']}
                    ]
                }
            }
        },
        methods: {
            login() {
                this.$router.push({
                    name: 'login',
                    query: {
                        p: 'login'
                    }
                });
            },
            sendVerify () {
                this.$refs.reg.validateField('phone', (errMsg) => {
                    if (errMsg) { //  失败信息
                        this.$message.error(errMsg);
                    } else {
                        this.loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        util.ajax.post('/verify_send?tag=register', {
                            phone: this.reg.phone
                        }).then(res => {
                            if (res.data.code !== 200) {
                                this.$message.error(res.data.message);
                                this.loading.close();
                            } else {
                                // 验证码发送成功
                                setTimeout(() => {
                                    this.loading.close();
                                }, 1000);
                                this.$message.success('验证码获取成功!');
                            }
                        }).catch((err) => {

                            console.error(err);
                            this.$message.error('验证码获取失败！');

                            this.loading.close();
                        });
                    }
                });
            },
            registerUser () {
                this.$refs.reg.validate((valid) => {
                    if (valid) {
                        this.loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        util.ajax.post('/register', {
                            phone: this.reg.phone,
                            verify_code: this.reg.verifyCode,
                            username: this.reg.userName,
                            password: this.reg.password,
                            email: this.reg.mail,
                            owner_name: this.reg.ownerMame
                        }).then(res => {
                            if (res.data.code !== 201) {
                                this.$message.error(res.data.message);
                                this.loading.close();
                            } else {
                                // 跳转修改密码成功画面
                                this.loading.close();
                                this.$message.success('注册成功');
                                this.login();
                            }
                        }).catch((err) => {
                            this.$message.error('注册失败！');
                            this.loading.close();
                        });
                    }
                });
            },
            getOwners () {
                util.ajax.get('/owners?tag=register', {}).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }
                    this.reg.owners = retData.data.map((ele, index, arr) => {
                        return {value: ele.owner_id, label: ele.owner_name};
                    });
                }).catch((/* err */) => {
                    this.$message.error('取得业主清单数据失败！');
                });
            }
        },
        mounted () {
            this.getOwners();
            location.href = '#registerTag';
        },
    }
</script>
