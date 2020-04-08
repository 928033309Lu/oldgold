<style lang="less" scoped>
    @import "err-tip.less";
</style>
<template>

    <div @mouseenter="showTips"  @mouseleave="hideTips" v-if="visible" style="z-index: 3004;width: 18px;height:18px;display: inline-block">
        <icon name="jingshi" style="color: #FF4967;z-index: 3004"></icon>
    </div>

</template>

<script>
    export default {
        name: "err-tip",
        props: {
            errMsg: {
                type: String,
                default: ''
            },
        },
        data () {
            return {
                visible: false,
                tipVisible: false
            }
        },
        methods: {
            show: function () {
                this.visible = true;
            },
            hidden: function () {
                this.visible = false;
                this.$store.commit('hoverErrorTip', {
                    'bool': false,
                    'clientX': 0,
                    'clientY': 0,
                    'errMsg': ''
                });
            },
            hideTips: function (e) {
                console.log(e.clientX );
                this.$store.commit('hoverErrorTip', {
                    'bool': false,
                    'clientX': e.clientX,
                    'clientY': e.clientY,
                    'errMsg': ''
                });
            },
            showTips: function (e) {
                console.log(e.clientX );
                this.$store.commit('hoverErrorTip', {
                    'bool': true,
                    'clientX': e.clientX,
                    'clientY': e.clientY,
                    'errMsg': this.errMsg
                });
            }
        },
    }
</script>
