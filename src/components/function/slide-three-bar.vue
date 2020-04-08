<template>
    <div class="container"
         v-if="barVisible && ( showFunctionId ===null || functionId === null ||showFunctionId === functionId)"
         :style="{left:leftPosition+'px',zIndex:simpleModel?333:888}" @mouseleave="onMouseLeave" @mouseenter="onMouseEnter">
        <div class="arrow" @click.stop.prevent="onArrowClick('prev')">
            <icon name="left" v-show="(!simpleModel)"></icon>
        </div>

        <div class="main-panel">
            <div class="data-panel-scroll" :style="{width: dataPanelWidth+'px'}">
                <div class="data-panel" :style="{left:simpleModel?'0px':dataPosition+'px',width: dataWidth+'px'}">
                    <div class="data-text" v-for="data in dataList"
                         :key="data"
                         v-show="(!simpleModel || data === selectedData)"
                         @click.stop.prevent="onClick(data)"
                         :style="{
                          background:data === selectedData ? 'rgba(3,32,62,0.8)' : 'rgba(3,32,62,0.6)',
                          color:data === selectedData ? 'RGBA(51, 200, 111, 1)' : 'RGBA(211, 219, 228, 1)'}"><span style="width: 50px;">{{data}}</span>
                    </div>
                </div>
            </div>
            <div class="sep-panel"
                 :style="{
                  background:simpleModel ? 'rgba(3,32,62,0.8)' : 'rgba(3,32,62,0.6)'}">
                <div class="short-sep"></div>
            </div>
            <span class="unit-text"
                  @click.stop.prevent="notAction"
                  :style="{
                  background:simpleModel ? 'rgba(3,32,62,0.8)' : 'rgba(3,32,62,0.6)',
                  color:simpleModel ? 'rgba(211,219,228,1)' : 'rgba(211,219,228,1)'}">{{unit}}</span>
        </div>

        <div class="arrow" @click.stop.prevent="onArrowClick('next')">
            <icon name="right" v-if="(!simpleModel)"></icon>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'slide-three-bar',
        props: {
            unit: {
                type: String,
                default: ''
            },
            functionId: {
                type: Number
            },
            projectId: {
                type: Number,
                default: 0
            },
            denggaoUrl: {
                type: String
            },
            dataList: {
                type: Array
            }
        },
        data () {
            return {
                barVisible: false,
                leftPosition: 0,
                list: [],
                selectedData: 0,   //默认
                simpleModel: true,
                showLeft: 0,
                wrgHeights: Array,
                dataPanelWidth: 50,
                dataWidth: 50,
                dataPosition: 0,
               
            };
        },
        computed: {
            showFunctionId () {
                return this.$store.state.app.sliderShowingFunctionID;
            }
        },
        watch: {
            dataList:function(val){
                if(val){
                    this.selectedData = val[val.length-1];
                    this.onClick(this.selectedData);
                }
            }
           
        },
        methods: {
            show (visible, left, dataList, selectedData ) {
                // this.list = dataList;
                // this.selectedData = this.selectedData ? this.selectedData : selectedData;
                // console.log(111,this.list ,this.selectedData);
                this.barVisible = visible;
                this.showLeft = left;
                let barWidth = 50 + 1 + 21 + 24 * 2;
                this.leftPosition = (520 - barWidth) / 2;
                if(!visible){
                    this.selectedData = 0;
                }
                // this.$store.commit('setSliderShowingInfo', null);
            },
            resetValue (val) {
                this.selectedData = val;
            },
            onMouseLeave () {
                this.simpleModel = true;
                this.dataPanelWidth = 50;
                this.dataWidth = 50;
                let barWidth = this.dataPanelWidth + 21 + 24 * 2 + 1;
                this.leftPosition = (520 - barWidth) / 2;
                // this.$store.commit('setSliderShowingInfo', null);
            },
            onMouseEnter () {
                this.simpleModel = false;
                let maxSize = this.dataList.length;
                this.dataWidth = 50 * maxSize;
                if (maxSize > 6) {
                    maxSize = 6;
                }
                this.dataPanelWidth = 50 * maxSize;

                let barWidth = this.dataPanelWidth + 21 + 24 * 2 + 1;
                this.leftPosition = (520 - barWidth) / 2;
                this.scrollToData();

                // this.$store.commit('setSliderShowingInfo', this.functionId);
            },
            onClick (data) {
                this.selectedData = data;
                this.$emit('dataChange2', this.functionId, this.selectedData, this.projectId , this.denggaoUrl);
            },
            onArrowClick (direction) {
                const dataSize = this.dataList.length;
                if (dataSize < 6) {
                    return;
                }

                if (direction === 'prev') {
                    let nextPosition = this.dataPosition + 150;
                    if (nextPosition > 0) {
                        nextPosition = 0;
                    }
                    this.dataPosition = nextPosition;
                } else if (direction === 'next') {
                    let prePosition = this.dataPosition - 150;
                    const subSize = dataSize > 6 ? 6 : dataSize;
                    const maxLeft = (dataSize - subSize) * -50;
                    if (prePosition < maxLeft) {
                        prePosition = maxLeft;
                    }
                    this.dataPosition = prePosition;
                }
                // this.$parent && this.$parent.$parent && this.$parent.$parent.$emit('dataChange', this.functionId, this.selectedData);
            },
            scrollToData () {
                const dataSize = this.dataList.length;
                let index = 0;
                for (let pair of this.dataList.entries()) {
                    if (pair[1] === this.selectedData) {
                        index = pair[0];
                        break;
                    }
                }

                let dataLeft = -(index * 50 - 250);
                if (this.dataPosition > dataLeft) {
                    this.dataPosition = dataLeft;
                }
            },
            notAction () {
            }
        }
    };
</script>

<style scoped>
    .container{
        height: 24px;
        display: flex;
        flex-direction: row;
        position: absolute;
        top: -36px;
    }
    .main-panel{
        display: flex;
        flex-direction: row;
        border-radius: 2px;
        justify-content: center;
        align-items: center;
    }
    .data-panel-scroll{
        overflow:hidden;
    }
    .data-panel{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .arrow{
        color:#03203E;
        cursor: pointer;
        font-size: 22px;
        height: 24px;
        line-height: 24px;
        width: 24px;
        text-align: center;
    }
    .data-text{
        /*padding-left: 3px;*/
        /*padding-right: 3px;*/
        font-size:14px;
        font-family:MicrosoftYaHei;
        line-height:24px;
        width: 50px;
        min-width: 50px;
        height: 24px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        border-radius: 4px;
    }
    .unit-text{
        padding-left: 3px;
        padding-right: 3px;
        font-size:12px;
        font-family:MicrosoftYaHei;
        line-height:24px;
        height: 24px;
        width: 15px;
        text-align: center;
        cursor: default;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .sep-panel{
        width: 1px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .short-sep{
        width: 1px;
        height: 15px;
        background-color: rgba(265,265,265,0.3);
    }
</style>
