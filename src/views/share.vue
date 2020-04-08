<template>
    <div class="share">
            <div class="loading-panel" v-show="waitingTwoMinute">
                <div>
                    <div class="loading">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p>{{text}}</p>
                </div>
            </div>
    </div>
</template>
<script>

import util from '@/libs/util';
export default{
    name: 'share',
    components:{
        
    },
    data (){
        return{
            waitingTwoMinute: false,
            text: '正在通过分享链接登录, 请稍候...'
        }
    },
    watch: {
    },
    mounted() {
        this.init()
    },
    methods: {
        init (){
            this.waitingTwoMinute = true
            this.onLogin()
        },
        onLogin (){
            util.ajax.post('/login', {
                username: 'goldwind_owner', // todo换
                password: 'goldwind_owner'
            }).then(res => {
                if (res.data.code != 200) {
                    this.$message.error(res.data.message)
                    return
                }
                this.goHome(res.data.data)
            }).catch((err)=>{
                this.waitingTwoMinute = false
                this.$message.error('登录失败')
            })
        },
        goHome (data){
            // console.log(this.$route)
            if(this.$route.query && this.$route.query.type && this.$route.query.project && this.$route.query.scheme){
                localStorage.setItem('shareQuery', JSON.stringify(this.$route.query))
                this.$store.commit('loginUserInfo', data)       
                this.$router.push({
                    path: 'home',
                    query:{
                        type: 'share',
                        project: this.$route.query.project,
                        scheme: this.$route.query.scheme
                    }
                })
                setTimeout(()=>{
                    this.waitingTwoMinute = false
                }, 800)
            }else{
                this.waitingTwoMinute = false
                this.$message.error('次链接无效，请通过正常登录进入项目！')
            }
        }
        
    },
}
</script>
<style lang="less">
.share{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color:#fff;
    z-index: 999999;
    
}
.loading-panel{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    color: #fff;
    z-index: 9999;
    &>div{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 300px;
        height: 300px;
        text-align: center;
        p{
            margin-top: 30px;
        }
    }
}
.loading{
    width: 80px;
    height: 50px;
    margin: 0 auto;
}
.loading span{
    display: inline-block;
    width: 8px;
    height: 100%;
    border-radius: 4px;
    background: #2cd0b9;;
    animation: load 1s ease infinite;
}
@keyframes load{
    0%,100%{
        height: 40px;
        background: #2cd0b9;;
    }
    50%{
        height: 70px;
        margin: -14px 0;
        background: #2cd0b9;;
    }
}
.loading span:nth-child(2){
    -webkit-animation-delay:0.2s;
}
.loading span:nth-child(3){
    -webkit-animation-delay:0.4s;
}
.loading span:nth-child(4){
    -webkit-animation-delay:0.6s;
}
.loading span:nth-child(5){
    -webkit-animation-delay:0.8s;
}
</style>