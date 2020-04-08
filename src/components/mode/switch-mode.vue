<template>
    <div class="switch-mode-container"  v-if="modeVisible" :class="isCheckGFWT != 2 ?'new-switch-mode-container':''">

        <div  v-if="isCheckGFWT == 2">
            <div v-if="modeStatus" class="switch-mode-btn" @click.stop="onSwitchModeClick" >
                <img src="../../images/switch-goldfarm.png"/>
                <div class="switchModeBtn speed"><span>GOLDFOAM</span><span>WT&nbsp;</span></div>
            </div>
            <div v-else class="switch-mode-btn" @click.stop="onSwitchModeClick">
                <img src="../../images/switch-wt.png"/>
                <div class="switchModeBtn speed"><span>GOLDFOAM</span><span>WT&nbsp;</span></div>
            </div>
        </div>

        <div v-if="isCheckGFWT == 0" class="switch-mode-btn new-switch-mode-btn">

            <div class="switchModeBtn">
                <div class="GFclass">Foam</div>
            </div>
        </div>

        <div v-if="isCheckGFWT == 1" class="switch-mode-btn new-switch-mode-btn">

            <div class="switchModeBtn switchModeBtnwt">
                <div class="WTclass">WT</div>
            </div>
        </div>

    </div>
</template>

<script>
    // import Bus from './bus';
    export default {
        name: "switch-mode",
        props: {

        },
        data () {
            return {
                modeStatus: true,
                modeVisible: false,
                isCheckGFWT: 0   //   0 GF   1 WT    2 GF&WT
            };
        },
        watch:{
            '$store.state.app.projectDataSet': function (val) {
                let projectDataSet = val;
                // projectDataSet.mesh_type
                //   0 GF   1 WT    
                this.isCheckGFWT = projectDataSet.mesh_type;
                // this.isCheckGFWT =2
                console.log("右侧方案:",this.isCheckGFWT,"0GF/1WT")
                this.isCheckGFWT == 0 || this.isCheckGFWT == 2 ? this.modeStatus = true : this.modeStatus = false ;
                
                this.$store.commit('currentCalMode', this.modeStatus);
                this.$emit('switchModeStatus', this.modeStatus);
            }
        },
        methods: {
            hidden () {
                this.modeVisible = false;
            },
            show () {
                this.modeVisible = true;
                this.goldFarm();
            },
            onSwitchModeClick (val) {
                this.modeStatus = !this.modeStatus;
                
                this.$store.commit('currentCalMode', this.modeStatus);
                this.$emit('switchModeStatus', this.modeStatus);

                // this.Bus.$emit("isGFWT",false)
                 //切换GF-WT--传参关闭噪音图片
                //  this.Bus.$emit('zaoyinPhoto', false);
                
                // console.log(this.modeStatus)
                // if(!this.modeStatus){
                //     Bus.$emit('uploadClose', true);
                // }
            },
            goldFarm () {
                // this.modeStatus = true;
                // this.$store.commit('currentCalMode', this.modeStatus);
                this.modeStatus = false
                this.onSwitchModeClick()
            }
        }
    }
</script>

<style  lang="less" scoped>
    .switch-mode-container{
        /* position: absolute;
        right: 20px;
        top: 2px; */
        flex-direction: column;
        padding: 0 5px;
        position: relative;
        top: 1px;
        .switch-mode-btn{
            /* position: absolute;
            top: 0;
            right: 0; */
            user-select: none;
            /*padding-right: 20px;*/
            /* img{
                transform:scale(.8);//设置缩放比例
                -ms-transform:scale(.8);
                -webkit-transform:scale(.8);
                -o-transform:scale(.8);
                -moz-transform:scale(.8);
            } */
            img{
                width: 100px;
                position: absolute;
            }
           
            .switchModeBtn{
                /* cursor: pointer; */
                color: #FFFFFF;
                text-align:center;
                text-decoration:none;
                /* position:absolute;
                top: 0px;
                right: 0px; */

                width:80px;
                margin: 0 auto;
                font-size:9pt;
                font-family:MicrosoftYaHei;
                /*font-weight:bold;*/
                color:rgba(255,255,255,1);
                line-height:20px;
            }
            .GFclass, .WTclass{
                margin: 0 auto;
                text-align: center;
                background: #33C86F;
                /* border: 1px solid #EAF9F0; */
                border-radius: 15px;
                width: 100%;
                line-height:20px;
            }
            .speed{
                display: flex;
                justify-content: space-between;
                position: relative;
                z-index: 11;
                width:100px;
            }
        }
    }

    .new-switch-mode-container {
        top:-9px;
        left: -13px;
        padding: 0;
        margin: 0 -15px 0 5px;
        .new-switch-mode-btn .switchModeBtn{
            width:43px;
            .GFclass, .WTclass{
                background: rgba(51,200,111,0.7);
            }
        }
        .new-switch-mode-btn .switchModeBtnwt{
            width:34px;  
        }
    }


</style>