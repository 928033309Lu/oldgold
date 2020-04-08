<style lang="less">
    @import '../../styles/common.less';
    @import './login.less';
</style>

<template>

<div class="box">
    <div class="login-con">
        <el-card header="登录">
            <div class="form-con">
                <el-form ref="loginForm" :model="form" :rules="rules">
                    <el-form-item prop="userName">
                        <icon name="user"></icon>
                        <el-input v-model="form.userName" placeholder="用户名"  @keydown.enter.native="nextInputFocus"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <icon name="password"></icon>
                        <el-input :type='inputType' ref="pwdInput" @focus="changeType" v-model="form.password" placeholder="密码" @keydown.enter.native="handleSubmit"></el-input>
                    </el-form-item>
                    <div class="oBox">
                        <el-checkbox v-model="rememberKey">记住密码</el-checkbox>
                        <a href="javascript:;" @click="changePassword">忘记密码?</a>
                    </div>
                    <el-form-item>
                        <el-button type="primary" @click="handleSubmit">登录</el-button>
                    </el-form-item>
                </el-form>
                <p class="login-tip">输入任意用户名和密码即可</p>
            </div>
        </el-card>
    </div>
    <!-- <div class="regTxt">没有帐号？<a href="javascript:;" @click="open" class="cGreen">去注册</a></div> -->
</div>

</template>

<script>
    import util from '@/libs/util';

    export default {
        data () {
            return {
                rememberKey:true,
                inputFocus: false,
                inputType:'password',
                form: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [
                        { required: true, message: '账号不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ]
                }
            };
        },
        mounted () {
            if (localStorage.getItem('userName')) {
                this.form.userName = localStorage.getItem('userName');
                this.form.password = localStorage.getItem('pwd');
            }
        },
        methods: {
            nextInputFocus () {
                this.$refs.pwdInput.$el.querySelector('input').focus();
            },
            handleSubmit () {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        util.ajax.post('/login', {
                            username: this.form.userName,
                            password: this.form.password
                        }).then(res => {
                            if (res.data.code !== 200) {
                                // 登录失败
                                this.$message.error(res.data.message);
                                this.loading.close();
                            } else {
                                // 登录成功
                                this.$store.commit('loginUserInfo', res.data.data);
                                
                                this.$router.push({
                                    name: 'home'
                                });
                                if (this.rememberKey) {
                                    localStorage.setItem('pwd', this.form.password);
                                    localStorage.setItem('userName', this.form.userName);
                                } else {
                                    localStorage.setItem('pwd', '');
                                    localStorage.setItem('userName', '');
                                }
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
                        if (this.form.userName === '') {
                            this.$message.error('请输入用户名');
                        } else if (this.form.password === '') {
                            this.$message.error('请输入密码');
                        }

                    }
                });
            },
            loginFun () {
                this.swiper.slideTo(1, 1000, false);
            },
            open () {
                // this.$router.push({
                //     name: 'register'
                // });
                this.$emit('changeview' , 'registerVue');
                this.$router.push({
                    name: 'login',
                    query: {
                        p: 'register'
                    }
                });
            },
            changeType () {
                this.inputType = 'password';
            },
            changePassword () {
                this.$emit('changeview' , 'passwordVue');
                this.$router.push({
                    name: 'login',
                    query: {
                        p: 'password'
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

</style>