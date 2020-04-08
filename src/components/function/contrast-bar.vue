<template>
    <div class="contrastBar" :class="isActive?'showContrastBar':''">
        <!-- <div class="contrast-btn" @click="clickPlanContrast('project')" :class="activeClass==1?'activeClass':''"> 方案总览对比 </div> -->
        <!-- <div class="contrast-btn" @click="clickPlanContrast('jingping')" :class="activeClass==2?'activeClass':''"> 主要经济指标对比 </div> -->
        <div class="contrast-btn" @click="clickPlanContrast('zhibiao')" :class="activeClass==3?'activeClass':''"> 指标比选页 </div>
        <div class="contrast-btn btn-close" @click="close"> 退出 </div>
    </div>
</template>
<script>
    export default{
        name: "contrast-bar",
        props: {
            infoActive: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            infoActive:function(val){
                this.isActive = val;
            }
        },
        data () {
            return{
                isActive: false,
                activeClass: null
            }
        },
        methods: {
            close(){
                this.isActive = false;
                this.activeClass = null;
                this.$emit("infoContrastBar",false,"closeContrast");
                //退出清空数据
                this.$emit("clearContrastData");
                this.$emit("exitSchemeCpmpare");
            },
            clickPlanContrast(type){
                // console.log(this.$store.state.app.contrastData)
                if(this.$store.state.app.contrastData.length>0){
                    switch (type){
                        case "zhibiao":
                            this.activeClass = 3;
                        break;
                        case "project":
                            this.activeClass = 1;
                        break;
                        case "jingping":
                            this.activeClass = 2;
                        break;
                    }
                   
                    this.$emit("openPlanContrast", type ,true);
                }else{
                    this.activeClass = null;
                    this.$message.warning("请选择方案!");
                }
            
            } 
        }
    }
</script>
<style lang="less" scoped>
    .contrastBar{
        height: 40px;
        /* width: 380px; */
        /* margin-left: -190px; */
        margin-left: -110px;
        position: absolute;
        bottom: -40px;
        left: 50%;
        transition: all 0.5s;
        display: flex;
        justify-content: space-between;
        .contrast-btn{
            cursor: pointer;
            background:rgba(21,38,79,0.6);
            border:1px solid rgba(20,226,103,0.6);
            border-radius:4px;
            font-size:14px;
            color:rgba(20,226,103,1);
            line-height:40px;
            text-align: center;
            width: 145px;
            margin-left: 10px;
        }
        .btn-close{
            width:75px;
            color: #fff;
            background:rgba(51,200,111,0.6);
        }
    }
    .showContrastBar{
        bottom: 60px;
    }
    .activeClass{
        background:rgba(21, 38, 79, 1) !important;
    }
</style>