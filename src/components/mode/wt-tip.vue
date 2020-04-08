<template>
    <div class="tip-container">
        <div class="list-panel" :style="'width:'+ planTipWdith +'px;'">
            <div v-for="plan in this.plans" :key="plan" :ref="plan" class="tip-item">
                <div  class="simple-panel" :style="styleObject">
                    <div class="head-panel">
                        <span class="plan-name">{{plan}}</span>
                    </div>
                    <div class="desc-panel">
                        <span class="data-desc"><img src="../../images/loading.gif" style="width:70px"/></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'wt-tip',
        data () {
            return {
                planTipWdith: 150,
                plans: ['默认方案' , '收益率最优' , '发电量最优']
            };
        },
        computed: {
            styleObject: function () {
                const positionStyle = {};
                if (this.selectedPlanId && this.selectedPlanId === this.planData.scheme_id) {
                    positionStyle.opacity = 1;
                }
                return positionStyle;
            }
        },
        methods: {

        }
    };
</script>

<style lang="less" scoped>
    .tip-container{
        position: absolute;
        right: 0px;
        top: 150px;
        bottom: 146px;
        flex-direction: column;

    }
    .tip-item{
        height: 132px;
        /*width: 420px;*/
        margin-bottom: 10px; /** 18->10*/
        position: relative;
        display: flex;
        justify-content: flex-end;
    }
    .simple-panel{
        position: relative;
        height: 132px;
        width: 140px;
        right: 0px;
        box-sizing: border-box;
        background:rgba(3,32,62,1);
        opacity:0.6;
        justify-content: center;
        align-items: center;
        cursor:pointer;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .detail-panel{
        position: absolute;
        height: 132px;
        /*width: 420px;*/
        box-sizing: border-box;
        right: 0px;
        top: 0px;
        background:rgba(3,32,62,1);
        opacity:0.6;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        cursor:pointer;
        overflow: hidden;
    }
    .detail-list{
        flex-direction: row;
        /*width: 420px;*/
        display: flex;
    }
    .item-panel{
        width: 140px;
    }
    .button-panel{
        display: flex;
        flex-direction: row;
    }
    .head-panel{
        flex-direction: row;
        justify-content: space-between;
        display: flex;
        align-items: center;
        height: 33px;
    }
    .data-panel{
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding-top: 5px;
        svg{
            padding-left: 50px;
            display: block;
            width: 42px;
            height: 42px;
        }
        svg.clock2{
            color:#FFC25D;
        }
    }
    .desc-panel{
        margin-top: 2px;
        flex-direction: row;
    }
    .unit-panel{
        margin-top: 2px;
        flex-direction: row;
    }
    .plan-name{
        padding-left: 30px;
        padding-right: 6px;
        padding-top: 2px;
        font-size:13px;
        font-family:MicrosoftYaHei;
        color:rgba(255,255,255,1);
        line-height:26px;
        height: 26px;
        display: inline-block;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .del-button{
        color: rgba(255,255,255,1);
        margin-right: 10px;
        cursor:pointer;
    }
    .plan-detail{
        width:26px;
        height:14px;
        font-size:12px;
        font-family:MicrosoftYaHei;
        color:#FFC25D;
        line-height:20px;
        text-decoration: underline;
        cursor:pointer;
    }
    .data-value{
        height: 40px;
        color: #33C86F;
        font-size: 32px;
        font-weight: bold;
        line-height: 45px;
        text-align: center;
        display: block;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .data-desc{
        margin-top: 10px;
        height: 14px;
        color: #D4EFF6;
        font-size: 12px;
        text-align: center;
        line-height: 12px;
        display: block;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .data-unit{
        height: 12px;
        color: #D4EFF6;
        font-size: 12px;
        text-align: center;
        line-height: 15px;
        display: block;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .list-panel{
        overflow-y: auto;
        overflow-x: hidden;
        position: absolute;
        top: 0;
        min-height: 416px; /** 142*3 -18 xueyb:150->142*/
        max-height: 558px; /** 142*4 -18 xueyb:150->142*/
        right: 0;
        /*padding-right: 20px;*/
    }
</style>
