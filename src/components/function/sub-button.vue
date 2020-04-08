<template>
    <!--<div class="button-container"
         :style="{
         borderTopLeftRadius: left ? '4px' : '',
         borderBottomLeftRadius: left ? '4px' : '',
         borderTopRightRadius: right ? '4px' : '',
         borderBottomRightRadius: right? '4px' : '',
         opacity: this.disable ? '0.6' : '1',
         background: this.disable? '': this.hover? 'rgba(3,32,62,0.8)' : this.selected ? 'rgba(3,32,62,0.8)' : 'rgba(3,32,62,0.6)',
         color: this.disable ? '#D3DBE4' : this.hover? '#33C86F' :(this.selected ? '#33C86F' : '#D3DBE4')}"
         @mouseleave="onMouseLeave"
         @mouseenter="onMouseEnter"
         @click.stop.prevent="onClick">
        <div class="sep-panel" v-if="sep">
            <div class="short-sep"></div>
        </div>
        <div class="icon-panel"
             :style="{
             borderTopLeftRadius: left ? '4px' : '',
             borderBottomLeftRadius: left ? '4px' : '',
             borderTopRightRadius: right ? '4px' : '',
             borderBottomRightRadius: right? '4px' : '',
             fontSize: fontSize}">
                <icon :name="icon" ></icon>
        </div>
    </div>-->
    <div class="button-container"
        :class="disableStyle? 'disableStyle' : ''"
         :style="{
         cursor: this.disable?'not-allowed':'pointer',
         borderTopLeftRadius: left ? '4px' : '',
         borderBottomLeftRadius: left ? '4px' : '',
         borderTopRightRadius: right ? '4px' : '',
         borderBottomRightRadius: right? '4px' : '',
         background: this.disable? '': this.hover? 'rgba(3,32,62,0.8)' : this.selected ? 'rgba(3,32,62,0.8)' : 'rgba(3,32,62,0.6)',
         color: this.disable ? '#D3DBE4' : this.hover? '#33C86F' :(this.selected ? '#33C86F' : '#D3DBE4')}"
         @mouseleave="onMouseLeave"
         @mouseenter="onMouseEnter"
         @click.stop.prevent="onClick">
        <div class="sep-panel" v-if="sep">
            <div class="short-sep"></div>
        </div>
        <div :class="inloading?'icon-panel-loading':'icon-panel'"
             :style="{
             borderTopLeftRadius: left ? '4px' : '',
             borderBottomLeftRadius: left ? '4px' : '',
             borderTopRightRadius: right ? '4px' : '',
             borderBottomRightRadius: right? '4px' : '',
             fontSize: fontSize}">
                <icon v-show="icon!='denggaoxian'" :name="inloading?'loading':icon" ></icon>
                <i v-show="icon=='denggaoxian'" class="iconfont icon-denggaoxian" style="font-size: 20px;"></i>
        </div>
        
    </div>
</template>

<script>
    export default {
        name: 'sub-button',
        props: {
            desc: {
                type: String,
                default: ''
            },
            icon: {
                type: String,
                default: 'copy'
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
            fontSize: {
                type: String,
                default: '24px'
            },
            disable: {
                type: Boolean,
                default: false
            },
            inloading: {
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
            },
            disableStyle:{
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
        updated(){
            this.Bus.$on("priceOpen",(val)=>{
                this.selected = val
            })
        },
        methods: {
            onClick () {
                if (this.selectMode) {
                    this.selected = !this.selected;
                }
                //禁用状态不能点击
                if(!this.disable){
                    this.$emit('funSelectChange', this.funId, this.selected);
                }
                console.log(this.disable)
            },
            onMouseEnter () {
                this.hover = true;
            },
            onMouseLeave () {
                this.hover = false;
            },
            setUnSelect () {
                this.selected = false;
            }
        }
    };
</script>

<style scoped>
    .button-container{
        width: 50px;
        height: 50px;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        position: relative;
        background: rgba(3,32,62,0.6);
        color:  #D3DBE4;        
    }
    /*.button-container :hover{*/
        /*background: rgba(3,32,62,0.8);*/
        /*color: #33C86F;*/
    /*}*/
    /*.button-container :disabled{*/
        /*opacity: 0.4;*/
    /*}*/
    .icon-panel{
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        /*font-size: 20px;*/
    }
    .icon-panel-loading{
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        animation: rotating 2s linear infinite;
        /*font-size: 20px;*/
    }
    .sep-panel{
        position: absolute;
        right: 0;
        top: 0;
        width: 1px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .short-sep{
        width: 1px;
        height: 15px;
        background-color: rgba(265,265,265,0.3);
    }
    .disableStyle{
        background: rgba(225,225,225,0.2) !important;
    }
</style>
