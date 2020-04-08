<style lang="less" scoped>
    @import "mast-tooltip.less";
    /* 第三版样式 */
    .contentBox3{
        border:1px solid rgba(51,200,111,0.5);
        width: 270px; 
        height: 180px;
        .content3{
            background: rgba(21,38,79,0.5);
            height: 100%;
            /* padding-top: 5px; */
            .hang{
                margin: 0 !important;
            }
            .godetail{
                text-decoration-line: none !important;
            }
        }
    }
</style>

<template>
    <!-- <div ref="tooltip" class="tooltip" :class="classObject" :style="styleObject" :hidden="!visible">
        <div class="box">
            <div class="arrow right"></div>
            <div class="body">
                <ul>
                    <li>
                        <span class="label">测风塔名称：</span>
                        <span style="color:#33C86F;">{{project.name}}</span>
                    </li>
                    <li>
                        <span class="label">大地坐标 X：</span>
                        <span style="color:#33C86F;">{{project.x}}</span>
                    </li>
                    <li>
                        <span class="label">大地坐标 Y：</span>
                        <span style="color:#33C86F;">{{project.y}}</span>
                    </li>
                    <li>
                        <span class="label">通道高度：</span>
                        <span style="color:#33C86F;">{{project.height}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div> -->
    <div ref="tooltip" v-if="visible">
        <!-- <div class="contentBox" :style="{left:x+'px',top:y+'px'}">
            <div class="horn">
                <div class="outer">
                    <div class="cirtle">
                    <div class="inner"> </div> 
                    </div>
                    <span :style="'font-size:'+mastNameFontSize+'px;'">{{ towerInfo.name }}</span>
                </div>
                <div class="content">
                    <div>
                        <div class="hang" style="margin-top: 5px;">
                            <em class="key" :span="14">经度：</em>
                            <em class="value" :span="10">{{ fixedNumber(towerInfo.longitude) }}　</em>
                        </div>
                        <div class="hang" >
                            <em class="key" :span="14">纬度：</em>
                            <em class="value" :span="10">{{ fixedNumber(towerInfo.latitude) }}　</em>
                        </div>
                        <div class="hang">
                            <em class="key" :span="14">通道高度：</em>
                            <em class="value" :span="10" >{{ String(towerInfo.all_height)}} m</em>
                        </div>
                        <div class="hang" >
                            <em class="key" :span="14">实测年平均风速：</em>
                            <em class="value" :span="10">{{ String(towerInfo.all_avg_speed) }} m/s　</em>
                        </div>
                        <span class="godetail"
                        @click="goDetail()">更多...</span>

                    </div>
                </div>
                
                <div class="lt"></div>
                <div class="rt"></div>
                <div class="rb"></div>
                <div class="lb"></div>
            </div>
        </div> -->

        <!-- 第三版 -->
        <div class="contentBox contentBox3" :style="{left:x+'px',top:y+'px'}">
            <div class="horn">
                <div class="content3">
                        <div>
                            <div class="hang" style="margin-top: 5px;">
                                <em class="key" :span="14">经度：</em>
                                <em class="value" :span="10">{{ fixedNumber(towerInfo.longitude) }}</em>
                            </div>
                            <div class="hang" >
                                <em class="key" :span="14">纬度：</em>
                                <em class="value" :span="10">{{ fixedNumber(towerInfo.latitude) }}</em>
                            </div>
                            <div class="hang" >
                                <em class="key" :span="14">海拔：</em>
                                <em class="value" :span="10"> {{towerInfo.elevation}} m</em>
                            </div>
                            <div class="hang">
                                <em class="key" :span="14">通道高度：</em>
                                <em class="value" :span="10">{{ String(towerInfo.all_height)}} m</em>
                            </div>
                            <div class="hang" >
                                <em class="key" :span="14">实测年平均风速：</em>
                                <em class="value" :span="10">{{ String(towerInfo.all_avg_speed) }} m/s</em>
                            </div>
                            <div class="hang" >
                                <em class="key" :span="14">年参考选取：</em>
                                <em class="value" :span="10"> {{towerInfo.all_cycle? towerInfo.all_cycle[0].join("—"):""}} </em>
                            </div>
                            <span class="godetail"
                            @click="goDetail()">更多...</span>
    
                        </div>
                </div>
                
                <div class="lt"></div>
                <div class="rt"></div>
                <div class="rb"></div>
                <div class="lb"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'mast-tooltip',
        data () {
            return {
                // isShow: false
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            position: {
                type: Object,
                default: {
                    x: 0,
                    y: 0
                }
            },
            towerInfo: {
                type: Object,
                default: {
                    project_name: '',
                    owner_name: '',
                    location_province: '',
                    location_city: '',
                    location_county: '',
                    create_time: '',
                    design_capacity: '',
                    description: '',
                    longitude: null,
                    latitude: null,
                    all_height: [],
                    all_avg_speed: [],
                    all_cycle: null,
                    // altitude: '',
                    avg_speed: '',
                    start_date: '',
                    end_date: '',
                    elevation: ""
                }
            }
        },
        computed: {
            // classObject: function () {
            //     return this.calcPositionClass();
            // },
            mastNameFontSize () {
                if (!this.towerInfo || !this.towerInfo.name) return '24';
                let length = this.towerInfo.name.length;
                if (length >= 11) return '14';
                return ['24', '24', '24', '24', '24', '24', '24', '22', '19', '18', '16'][length];
            },
            // startEndDate () {
            //     if (!this.towerInfo || !this.towerInfo.start_date || !this.towerInfo.end_date) {
            //         return '';
            //     }
            //     return this.towerInfo.start_date + '至' + this.towerInfo.end_date;
            // },
            // altitude () {
            //     if (!this.towerInfo || !this.towerInfo.altitude) {
            //         return '';
            //     }
            //     return this.towerInfo.altitude + ' m';
            // },
            avgspeed () {
                if (!this.towerInfo || !this.towerInfo.avg_speed) {
                    return '';
                }
                return this.towerInfo.avg_speed + ' m/s';
            },

            // styleObject: function () {
            //     const positionStyle = {};
            //     if (this.visible) {
            //         const positionClass = this.calcPositionClass();
            //         if (positionClass.indexOf('left') > -1) {
            //             positionStyle.left = (this.position.x + 20) + 'px';
            //         } else {
            //             positionStyle.left = (this.position.x - 270 - 20) + 'px';
            //         }
            //         if (positionClass.indexOf('top') > -1) {
            //             positionStyle.top = (this.position.y - 30) + 'px';
            //         } else {
            //             const tooltipHeight = this.$refs['tooltip'] ? this.$refs['tooltip'].offsetHeight : 175;
            //             positionStyle.top = (this.position.y - tooltipHeight + 30) + 'px';
            //         }
            //     }
            //     return positionStyle;
            // },
            x: function () {
                let XY = this.$store.state.hubCenter.mastHubCenter;
                return XY.clientX + 55;
            },
            y: function () {
                let XY = this.$store.state.hubCenter.mastHubCenter;
                return XY.clientY - 40;
            }

        },
        methods: {
            fixedNumber (number) {
                if (isNaN(number)) return number;
                return number.toFixed(6);
            },
            goDetail () {
                this.$emit('show-detail', this.towerInfo);
            },
            fomateTowerAllHeight (heights) {
                if (!heights) return '';
                let heightStr = '';
                heights.forEach(height => {
                    heightStr += height + 'm ';
                });
                return heightStr;
            },
            // calcPositionClass () {
            //     const positionClass = [];
            //     if (this.visible) {
            //         const windowWidth = document.body.clientWidth;
            //         const windowHeight = document.body.clientHeight;
            //         const tooltipWidth = 270;
            //         const tooltipHeight = this.$refs['tooltip'] ? this.$refs['tooltip'].offsetHeight : 175;
            //         if (this.position.x + tooltipWidth + 16 > windowWidth) {
            //             positionClass.push('right');
            //         } else {
            //             positionClass.push('left');
            //         }
            //         if (this.position.y + tooltipHeight - 30 > windowHeight) {
            //             positionClass.push('bottom');
            //         } else {
            //             positionClass.push('top');
            //         }
            //     }
            //     return positionClass;
            // }
        }
    };
</script>
