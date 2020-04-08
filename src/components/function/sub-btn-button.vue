<template>
    <div class="button-container"
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
               <icon :name="inloading?'loading':icon" ></icon>
       </div>
   </div>
</template>
<script>
    export default {
        name:"sub-btn-button",
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
                default: '16px'
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
            }
        },
        data () {
            return {
                selected: false,
                hover: false
            };
        },
        methods: {
            onClick () {
                if (this.selectMode) {
                    this.selected = !this.selected;
                }
                this.$emit('funSelectChange', this.funId, this.selected);
                // console.log(this.selected)
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
    }
</script>
<style lang="less" scoped>
.button-container{
        width: 30px;
        height: 20px;
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
        width: 30px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        /*font-size: 20px;*/
    }
    .icon-panel-loading{
        width: 30px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        animation: rotating 2s linear infinite;
        /*font-size: 20px;*/
    }
    .sep-panel{
        position: absolute;
        right: 0;
        top: 0;
        width: 1px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .short-sep{
        width: 1px;
        height: 10px;
        background-color: rgba(265,265,265,0.3);
    }
</style>