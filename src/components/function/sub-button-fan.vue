<template>
    <div class="button-container"
         :style="{
         borderTopLeftRadius: left ? '4px' : '',
         borderBottomLeftRadius: left ? '4px' : '',
         borderTopRightRadius: right ? '4px' : '',
         borderBottomRightRadius: right? '4px' : '',
         opacity: this.disable ? '0.4' : '1',
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
             borderBottomRightRadius: right? '4px' : ''}">
            <img style="width: 16px" :src="url" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        name: "sub-button-fan",
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
                hover: false,
                url: require('../../images/fanWithWind.png')
            };
        },
        methods: {
            onClick () {
                if (this.selectMode) {
                    this.selected = !this.selected;
                }
                this.$emit('funSelectChange', this.funId, this.selected);
            },
            onMouseEnter () {
                this.hover = true;
                this.url = require('../../images/fanWithWindActive.png');
            },
            onMouseLeave () {
                this.url = require('../../images/fanWithWind.png');
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
        cursor: pointer;
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
    }
    .sep-panel{
        position: absolute;
        right: 0px;
        top: 0px;
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
</style>
