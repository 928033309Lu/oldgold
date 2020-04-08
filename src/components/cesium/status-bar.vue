<template>
    <div class="status-bar">
        <div class="copyright">copyright@2018</div>
        <div class="status" v-if="statusInfo.isShow">
            <span class="txt1">视点高度：{{statusInfo.cameraHeight}}米</span>
            <span class="txt2">经度：{{statusInfo.lon}}</span>
            <span class="txt3">纬度：{{statusInfo.lat}}</span>
            <span class="txt4" v-show="statusInfo.alt != 0">海拔：{{statusInfo.alt}}米</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'status-bar',
        computed: {
            statusInfo () {
                return this.$store.state.app.statusInfo;
            }
        }
    };
</script>

<style lang="less" scoped>
    .status-bar {
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        height: 26px;
        background: rgba(3, 32, 62, 0.3);
        display: flex;
        color: rgba(212, 239, 246, 0.6);
        line-height: 26px;
        font-size: 12px;
    }
    .copyright {
        text-align: left;
        padding-left: 17px;
        flex: auto;
        user-select: none;
    }
    .status {
        text-align: right;
        flex: auto;

        span {
            padding-right: 13px;
            text-align: left;
            display: inline-block;
        }
        /*span.txt1 {*/
            /*width: 150px;*/
        /*}*/
        /*span.txt2,span.txt3,span.txt4 {*/
            /*width: 100px;*/
        /*}*/
    }
</style>