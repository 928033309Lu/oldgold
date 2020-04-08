<template>
    <div class="button-container"
         :style="{
         opacity: this.disable ? '0.4' : '1',
         background: this.disable? '': this.hover? 'rgba(3,32,62,0.8)' : 'rgba(3,32,62,0.6)',
         color: this.disable ? '#D3DBE4' : this.hover? '#33C86F' :'#D3DBE4'}"
         @mouseleave="onMouseLeave"
         @mouseenter="onMouseEnter">
        <div class="content-panel">
            <div class="below" v-bind:class="{currentOver:isOverFlow}">{{currentPower}}</div>
            <div class="approve">/{{originPower}}</div>
            <div class="power">MW</div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    export default {
        name: 'capacitance',
        props: {
            desc: {
                type: String,
                default: ''
            },
            funId: {
                type: Number,
                default: 0
            },
            left: {
                type: Boolean,
                default: false
            },
            right: {
                type: Boolean,
                default: false
            },
            disable: {
                type: Boolean,
                default: false
            },
            sep: {
                type: Boolean,
                default: false
            },
            selectMode: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                selected: false,
                hover: false
            };
        },
        methods: {
            onMouseEnter () {
                this.hover = true;
            },
            onMouseLeave () {
                this.hover = false;
            }
        },
        computed: {
            // 经过替换后的风机组容量
            approvePower () {
                let diffArr = _.differenceBy(this.scheme.originFans, this.scheme.typeChanges, 'turbine_name');
                let contactArr = _.concat(diffArr, this.scheme.typeChanges);
                let arr = [];
                for (let fan in contactArr) {
                    let turbineType = contactArr[fan].turbine_type.split('/');
                    arr.push(parseInt(turbineType[1]));
                }
                return _.sum(arr);
            },
            // 原始风机组容量
            originPower () {
                let arr = [];
                for (let fan in this.scheme.originFans) {
                    let turbineType = this.scheme.originFans[fan].turbine_type.split('/');
                    arr.push(parseInt(turbineType[1]));
                }
                // return _.sum(arr) / 1000;
                return this.$store.state.app.projectInfo.design_capacity;
            },
            scheme () {
                return this.$store.state.scheme;
            },
            // 增加的风机组容量
            addFansPower () {
                let arr = [];
                for (let fan in this.scheme.addFans) {
                    let turbineType = this.scheme.addFans[fan].turbine_type.split('/');
                    arr.push(parseInt(turbineType[1]));
                }
                return _.sum(arr);
            },
            // 删除的风机组容量
            delFansPower () {
                let arr = [];
                for (let fan in this.scheme.delFans) {
                    let fanItem = _.find(this.scheme.originFans, ['turbine_id', this.scheme.delFans[fan]]);
                    if (fanItem === undefined) {
                        fanItem = _.find(this.scheme.addFans, ['turbine_id', this.scheme.delFans[fan]]);
                    }
                    arr.push(parseInt(fanItem.turbine_type.split('/')[1]));
                }
                return _.sum(arr);
            },
            // 实时风机组容量=经过替换后的风机组容量+增加的风机组容量-删除的风机组容量
            currentPower () {
                let current = this.approvePower + this.addFansPower - this.delFansPower;
                return _.divide(current, 1000);
            },
            isOverFlow () {
                return this.originPower < this.currentPower;
            }
        },
        created () {
            // console.log(this.scheme);
        }
    };
</script>

<style scoped>
    .button-container{
        width: 130px;
        height: 50px;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        position: relative;
        background: rgba(3,32,62,0.6);
        color:  #D3DBE4;
        cursor: pointer;
    }
    .content-panel{
        width: 120px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        display: flex;
        justify-content:center;
        align-items: baseline;
    }
    .currentOver{
        font-size: 20px;
        color: RGBA(255, 73, 103, 1) !important;
    }
    .below{
        font-size: 20px;
        color: RGBA(51, 200, 111, 1);
    }
    .approve{
        font-size: 20px;
        color: RGBA(211, 219, 228, 1);
    }
    .power{
        font-size: 13px;
        color: RGBA(211, 219, 228, 1);
    }
</style>
