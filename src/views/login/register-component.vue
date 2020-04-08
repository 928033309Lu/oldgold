<style lang="less">
    @import '../../styles/common.less';
    @import './register.less';
</style>
<template>
    <div class="login" >
        <div class="box">
            <div class="login-con">
                <el-card header="注册">
                    <div class="form-con regBox">
                        <el-form ref="reg" :model="reg" :rules="regRules">
                            <el-form-item prop="phone">
                                <icon name="shoujihao"></icon>
                                <el-input v-model.trim="reg.phone" ref="phone" placeholder="手机号"></el-input>
                                <a href="javascript:" @click="sendVerify" class="getCode">获取验证码</a>
                            </el-form-item>
                            <el-form-item prop="verifyCode">
                                <icon name="yanzhengma"></icon>
                                <el-input v-model="reg.verifyCode" placeholder="验证码" ></el-input>
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
                                <icon name="qiye"></icon>
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
                                <el-input v-model="reg.password" placeholder="登录密码"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="registerUser">立即注册</el-button>
                            </el-form-item>
                            <p class="text">点击[立即注册]按钮将视为您同意GOLDFARM&nbsp;<a href="javascript:;" style="color: #495253" >使用条款</a></p>
                        </el-form>
                    </div>
                </el-card>
            </div>
            <div class="regTxt">已有帐号，<a href="javascript:;" @click="login()" class="cGreen">登录</a></div>
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
                regRules: {
                    phone: [
                        {validator: validateTel, trigger: 'blur'}
                    ],
                    verifyCode: [
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
                    ],
                    userName: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ],
                    mail: [
                        {required: true, message: '邮箱不能为空', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    ownerMame: [
                        {required: true, message: '业主名称不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            login() {
                this.$emit('changeview','loginVue');
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
                            if (res.data.code !== 200 ) {
                                this.$message.error(res.data.message);
                                this.loading.close();
                            } else {
                                // 验证码发送成功
                                setTimeout(() => {
                                    this.loading.close();
                                }, 1000);
                                this.$message.success('获取成功!');
                            }
                        }).catch((err) => {
                            console.error(err);
                            this.$message.error('验证码获取！');
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
                            if (res.data.code !== 200 || res.data.code !== 201) {
                                this.$message.error(res.data.message);
                                this.loading.close();
                            } else {
                                this.$message.success('注册成功');
                                // 跳转至登录
                                this.login();
                                setTimeout(() => {
                                    this.loading.close();
                                }, 1000);
                            }
                        }).catch((err) => {
                            console.error(err);
                            this.$message.error('登录失败！');
                            this.loading.close();
                        });

                    } else {
                        this.$message.error('注册失败，参数不全');
                    }
                });
            },
            getOwners () {
                util.ajax.get('/owners', {}).then(res => {
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
        },
    }
</script>
