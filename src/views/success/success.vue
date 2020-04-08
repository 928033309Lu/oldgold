<style lang="less">
    @import '../../styles/common.less';
    @import 'success.less';
</style>
<template>
    <div class="login" >

        <!-- 成功 -->
        <div class="box">
            <div class="icoBox">
                <p>修改成功</p>
                <a  href="javascript:;" @click="reLogin" >登录</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'success',
        data () {
            return {
                myTimeout: null
            };
        },
        methods: {
            reLogin () {
                clearTimeout(this.myTimeout);
                this.$router.push({
                    name: 'login',
                    query: {
                        p: 'login'
                    }
                });
            }
        },
        mounted () {
            this.myTimeout = setTimeout(() => {
                this.reLogin();
            }, 5000);
        }
    };
</script>
