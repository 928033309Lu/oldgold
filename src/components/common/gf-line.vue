<template>
    <div class="gf-line" :style="[colorStyles, positionStyles]"></div>
</template>

<script>
    export default {
        name: 'gf-line',
        props: {
            fromSelector: {
                type: String,
                required: true
            },
            toSelector: {
                type: String,
                required: true
            },
            fromPositionX: { // left, center, right
                type: String,
                default: 'center'
            },
            fromPositionY: { // top, middle, bottom
                type: String,
                default: 'middle'
            },
            toPositionX: { // left, center, right
                type: String,
                default: 'center'
            },
            toPositionY: { // top, middle, bottom
                type: String,
                default: 'middle'
            },
            fromOffsetX: {
                type: Number,
                default: 0
            },
            fromOffsetY: {
                type: Number,
                default: 0
            },
            toOffsetX: {
                type: Number,
                default: 0
            },
            toOffsetY: {
                type: Number,
                default: 0
            },
            orientation: { // horizontal, vertical, any
                type: String,
                default: 'any'
            },
            color: {
                type: String,
                default: '#fff'
            },
            opacity: {
                type: Number,
                default: 1
            }
        },
        data () {
            return {
                positionStyles: {
                    width: '0px',
                    height: '0px',
                    top: '0px',
                    left: '0px'
                }
            };
        },
        computed: {
            colorStyles: function () {
                return {
                    backgroundColor: this.color,
                    opacity: this.opacity
                };
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.refresh();
            });
        },
        methods: {
            refresh () {
                const fromElement = document.querySelector(this.fromSelector);
                const toElement = document.querySelector(this.toSelector);
                if (!fromElement || !toElement) return;
                let x1, y1, x2, y2;

                // 计算起点X轴坐标
                if (this.fromPositionX === 'left') {
                    x1 = fromElement.offsetLeft;
                } else if (this.fromPositionX === 'right') {
                    x1 = fromElement.offsetLeft + fromElement.offsetWidth;
                } else {
                    x1 = fromElement.offsetLeft + fromElement.offsetWidth / 2;
                }
                // 计算起点Y轴坐标
                if (this.fromPositionY === 'top') {
                    y1 = fromElement.offsetTop;
                } else if (this.fromPositionY === 'bottom') {
                    y1 = fromElement.offsetTop + fromElement.offsetHeight;
                } else {
                    y1 = fromElement.offsetTop + fromElement.offsetHeight / 2;
                }
                // 计算终点X轴坐标
                if (this.toPositionX === 'left') {
                    x2 = toElement.offsetLeft;
                } else if (this.toPositionX === 'right') {
                    x2 = toElement.offsetLeft + toElement.offsetWidth;
                } else {
                    x2 = toElement.offsetLeft + toElement.offsetWidth / 2;
                }
                // 计算终点Y轴坐标
                if (this.toPositionY === 'top') {
                    y2 = toElement.offsetTop;
                } else if (this.toPositionY === 'bottom') {
                    y2 = toElement.offsetTop + toElement.offsetHeight;
                } else {
                    y2 = toElement.offsetTop + toElement.offsetHeight / 2;
                }

                // 加上偏移量
                x1 += this.fromOffsetX;
                y1 += this.fromOffsetY;
                x2 += this.toOffsetX;
                y2 += this.toOffsetY;

                // 处理线的位置、方向
                if (this.orientation === 'horizontal') {
                    this.positionStyles.left = (x1 < x2 ? x1 : x2) + 'px';
                    this.positionStyles.top = y1 + 'px';
                    this.positionStyles.height = '1px';
                    this.positionStyles.width = Math.abs(x2 - x1) + 'px';
                } else if (this.orientation === 'vertical') {
                    this.positionStyles.left = x1 + 'px';
                    this.positionStyles.top = (y1 < y2 ? y1 : y2) + 'px';
                    this.positionStyles.width = '1px';
                    this.positionStyles.height = Math.abs(y2 - y1) + 'px';
                } else {
                    this.positionStyles.left = x1 + 'px';
                    this.positionStyles.top = y1 + 'px';
                    this.positionStyles.height = '1px';
                    let deg = 360 * Math.atan((y2 - y1) / (x2 - x1)) / (2 * Math.PI);
                    if (y2 < y1) {
                        deg += 360;
                    }
                    if (x2 < x1) {
                        deg += 180;
                    }
                    deg = deg % 360;
                    const len = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    this.positionStyles.width = len + 'px';
                    this.positionStyles.transform = 'rotate(' + deg + 'deg)';
                    this.positionStyles.transformOrigin = '0px 0px';
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.gf-line {
    position: absolute;
}
</style>
