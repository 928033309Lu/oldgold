<style lang="less" scoped>
    @import "err-tip-msg.less";
</style>
<template>
    <!--  :class="classObject"  -->
    <div ref="tooltip" class="tooltip"  :style="styleObject"  :hidden="!tipVisible">
        {{ errMsg }}
    </div>
</template>

<script>
    export default {
        name: "err-tip-msg",
        props: {
        },
        data () {
            return {
                tipVisible: false,
                position: {
                    x: 0,
                    y: 0
                },
                errMsg: '',
            }
        },
        methods: {
            calcPositionClass () {
                const positionClass = [];
                if (this.visible) {
                    const windowWidth = document.body.clientWidth;
                    const windowHeight = document.body.clientHeight;
                    const tooltipWidth = 295;
                    const tooltipHeight = this.$refs['tooltip'].offsetHeight || 28;
                    if (this.position.x + tooltipWidth + 16 > windowWidth) {
                        positionClass.push('right');
                    } else {
                        positionClass.push('left');
                    }
                    if (this.position.y + tooltipHeight - 30 > windowHeight) {
                        positionClass.push('bottom');
                    } else {
                        positionClass.push('top');
                    }
                }
                return positionClass;
            }
        },
        computed: {
            classObject: function () {
                return this.calcPositionClass();
            },
            styleObject: function () {
                const positionStyle = {};
                if (this.tipVisible) {
                    const positionClass = this.calcPositionClass();
                    if (positionClass.indexOf('left') > -1) {
                        positionStyle.left = (this.position.x + 20) + 'px';
                    } else {
                        positionStyle.left = (this.position.x - 270 - 20) + 'px';
                    }
                    if (positionClass.indexOf('top') > -1) {
                        positionStyle.top = (this.position.y - 30) + 'px';
                    } else {
                        const tooltipHeight = this.$refs['tooltip'].offsetHeight || 28;
                        positionStyle.top = (this.position.y - tooltipHeight-40) + 'px';
                    }
                }
                return positionStyle;
            },
            hoverTip () {
                return this.$store.state.app.hoverErrorTip;
            }
        },
        watch: {
            hoverTip: function (newVal) {
                this.tipVisible = newVal.bool;
                // this.tipVisible = true;
                if (newVal.bool) {
                    this.position.x = newVal.clientX;
                    this.position.y = newVal.clientY;
                    this.errMsg = newVal.errMsg;
                }
            },
        }
    }
</script>
