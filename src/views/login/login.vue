<style lang="less">
    @import '../../styles/common.less';
    @import './login.less';
</style>

<template>
    <div class="login"  >
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">

                    <div class="login-head" >
                        <a href="#" class="logo"></a>

                        <div class="headTxt">
                            <img src="../../images/loginTxt.png"/>
                            <div class="logTitle">三维数字化风电场规划设计一体化平台</div>
                        </div>
                        <div class="loginDiv">
                            <div class="loginBtn" @click="loginFun">
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

                </div>
                <div class="swiper-slide">
                    <div class="box">
                        <div class="login-con">
                            <el-card header="登录">
                                <div class="form-con">
                                    <el-form ref="loginForm" :model="form" :rules="rules">
                                        <el-form-item prop="userName" >
                                            <icon name="user"></icon>
                                            <el-input type="text" maxlength="20" v-model="form.userName" placeholder="用户名" id='mInput' @keydown.enter.native="nextInputFocus"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="password">
                                            <icon name="password"></icon>
                                            <el-input :type='inputType' auto-complete="new-password" ref="pwdInput" v-model="form.password" placeholder="密码" @keydown.enter.native="handleSubmit"></el-input>
                                        </el-form-item>
                                        <div class="oBox">
                                            <el-checkbox v-model="rememberKey">记住密码</el-checkbox>
                                            <a href="javascript:;" @click="changePassword">忘记密码?</a>
                                        </div>
                                        <el-form-item>
                                            <el-button @click="handleSubmit"><div style='font-family: "PingFang SC",STHeitiSC-Light,"Microsoft YaHei",sans-serif;font-weight: lighter;'>登录</div></el-button>
                                        </el-form-item>
                                    </el-form>
                                    <p class="login-tip">输入任意用户名和密码即可</p>
                                </div>
                            </el-card>
                        </div>
                        <!-- <div class="regTxt">没有帐号？<a href="javascript:;" @click="open" class="cGreen">去注册</a></div> -->
                    </div>
                </div>
            </div>
            <!-- 如果需要滚动条
            <div class="swiper-scrollbar"></div>-->
        </div>


        <share v-if="$route.query.type == 'share'"></share>
    </div>
</template>

<script>
import util from '@/libs/util';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
import VueParticles from '../../components/vue-particles/vue-particles';
import loginVue from './login-component.vue';
import registerVue from './register-component.vue';
import passwordVue from './password-component.vue';
import share from '../share.vue';

export default {
    components: {
        VueParticles,
        loginVue,
        registerVue,
        passwordVue,
        share
    },
    data () {
        return {
            currentView: 'loginVue',
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
        this.$store.commit('logout')
        this.swiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            mousewheel: true,
            spaceBetween: 50
        });
        if (this.$route.query.p) {
            this.swiper.slideTo(1, 0, false);
        }
        if (localStorage.getItem('userName')) {
            this.form.userName = localStorage.getItem('userName');
            this.form.password = localStorage.getItem('pwd');
        }
        // this.inputType = 'password';
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
                    // if (this.form.userName === '') {
                    //     this.$message.error('请输入用户名');
                    // } else if (this.form.password === '') {
                    //     this.$message.error('请输入密码');
                    // }

                }
            });
        },
        loginFun () {
            this.swiper.slideTo(1, 1000, false);
        },
        open () {
            this.$router.push({
                name: 'register'
            });
        },
        changePassword () {
            this.$router.push({
                name: 'password'
            });
        },
        changeViewFun(val){
            this.currentView = val;
        }
    }
};
</script>

<style lang="less" scoped>

</style>