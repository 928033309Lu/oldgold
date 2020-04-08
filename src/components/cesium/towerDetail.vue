<style lang="less" scoped>
    @import "mast-tooltip.less";
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
        <div class="contentBox2" :style="{left:x+'px',top:y+'px'}">
            <!-- <div class="triangle ">
            </div> -->
            <div class="border-left-empty">
                <span></span>
            </div>
            <div class="hang" style="margin-top: 16px;">
                <em class="key" :span="14">左转：</em>
                <em class="value" :span="10">{{ project.angle }}</em>
                <!-- {{this.$store.state.app.hoverProjectInfo.clientX}} -->
            </div>
            <div class="hang">
                <em class="key" :span="14">塔型：</em>
                <em class="value" :span="10">{{ project.type }}　</em>
            </div>
            <div class="hang" >
                <em class="key" :span="14">塔基降：</em>
                <em class="value" :span="10">{{ project.baseLower }}　</em>
            </div>
            <div class="hang" >
                <em class="key" :span="14">呼高：</em>
                <em class="value" :span="10">{{ project.callHeight }}　</em>
            </div>
            <div class="hang" >
                <em class="key" :span="14">中心桩位移：</em>
                <em class="value" :span="10">{{ project.midstakeOffset }}　</em>
            </div>
            <div class="hang" >
                <em class="key" :span="14">塔名：</em>
                <em class="value" :span="10">{{ project.name }}　</em>
            </div>
            <div class="hang" >
                <em class="key" :span="14">偏差距离：</em>
                <em class="value" :span="10">{{ project.offsetDist }}　</em>
            </div>
            <div class="hang" >
                <em class="key" :span="14">定位桩名：</em>
                <em class="value" :span="10">{{ project.stakeName }}　</em>
            </div>
            <div class="hang" style="margin-bottom: 16px;">
                <em class="key" :span="14">电压等级：</em>
                <em class="value" :span="10">{{ project.voltage }}　</em>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'towerDetail',
        // data (){
        //     return{
        //     }
        // },
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
            project: {
                type: Object,
                default: {
                    project_name: '',
                    owner_name: '',
                    location_province: '',
                    location_city: '',
                    location_county: '',
                    create_time: '',
                    design_capacity: '',
                    description: ''
                }
            }
        },
        watch: {
            visible:function(val){
                if(!val){
                    // this.$emit("clearHighTowerLabel");
                }
            }
        },
        computed: {
            // classObject: function () {
            //     return this.calcPositionClass();
            // },
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
            //             const tooltipHeight = this.$refs['tooltip'].offsetHeight || 175;
            //             positionStyle.top = (this.position.y - tooltipHeight + 30) + 'px';
            //         }
            //     }
            //     return positionStyle;
            // },
            x: function () {
                let XY = this.$store.state.hubCenter.towerHubCenter;
                return XY.clientX + 55;
            },
            y: function () {
                let XY = this.$store.state.hubCenter.towerHubCenter;
                return XY.clientY - 40;
            }
        },
        methods: {
            // calcPositionClass () {
            //     const positionClass = [];
            //     if (this.visible) {
            //         const windowWidth = document.body.clientWidth;
            //         const windowHeight = document.body.clientHeight;
            //         const tooltipWidth = 270;
            //         const tooltipHeight = this.$refs['tooltip'].offsetHeight || 175;
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
<style scoped >

.contentBox2{
    position: absolute;
    background: rgba(3,32,62,0.6);
    border-radius: 10px;
    border: 2px solid #33C86F;
    box-sizing: border-box;
    padding: 0 16px;
    font-size: 12px;
    font-family: none !important;
}
.contentBox2 .value {
    color: #33C86F;
    margin: 0;
    font-style: inherit;
}
.contentBox2 .hang{
    margin-top: 5px;
}
.contentBox2 .key {
    color: #EFEFEF;
    margin: 0;
    font-style: inherit;
}
.border-left-empty{
    width: 0;
    height: 0;
    border-bottom: 15px solid transparent;
    border-right: 15px solid #33C86F;
    border-top: 15px solid transparent;
    position: absolute;
    left: -15px;
    top: 0;
    margin: 15px auto;
}
.border-left-empty span{
    display: block;
    width: 0;
    height: 0;
    border-bottom: 13px solid transparent;
    border-right: 13px solid rgba(3,32,62,0.8);
    border-top: 13px solid transparent;
    position: absolute;
    left: 2px;
    top: -13px;
}

</style>