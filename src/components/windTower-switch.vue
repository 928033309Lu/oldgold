<template>
    <!-- <el-tooltip class="item" effect="light" popper-class="mySwitchTooltip" :content="isActive?'点击隐藏测风塔':'点击显示测风塔'" placement="right">
      <div class="switchBox" :class={active:isActive} @click=openFun()>
          <span class="on">OFF</span>
          <span class="off">ON</span>
          <span class="button"><icon name="switch"></icon></span>
      </div>
   </el-tooltip> -->
    <!-- <el-tooltip :disabled="closetooltip" class="item" effect="light" popper-class="mySwitchTooltip" :content="isActive?'点击隐藏测风塔':'点击显示测风塔'" placement="right"> -->
        <!-- @mouseenter="closetooltip = false" 
        @mouseLeave="closetooltip = true" 
      </el-tooltip> -->
      <div v-show="inProject" class="switchBox" :class={active2:isActive}>
          <div class="switchmyTip switchWid" v-show="isSwitchTip">{{switchTitle}}</div>
          <span 
          @mouseenter="switchChange('icon_a',true)" 
          @mouseleave="switchChange('icon_a',false)" 
          @click="openFun()"
          
          class="button button2">
            <icon name="switch"></icon>
          </span>
            <div class="switchmyTip zhengti" v-show="isShowTip">测风整体信息</div>
            <span ref="icon_b"  
            @mouseenter="switchChange('icon_b',true)" 
            @mouseleave="switchChange('icon_b',false)" 
            :class="isActive?'icon1 icon1Open':'icon1'" 
            @click="openTowerMessage('data',true)" 
            :style="iconActive1?'color:#fff;font-weight: bold;':''">
              <icon v-show="isActive" name="dianta1" style="width:18px;height:18px;position:relative;top:1px;"></icon>
            </span>
            <!-- <div class="switchmyTip" v-show="isShowTip2">测风代表性</div>
            <span ref="icon_c" @mouseenter="switchChange('icon_c',true)" @mouseleave="switchChange('icon_c',false)" :class="isActive?'icon2 icon2Open':'icon2'" @click="openTowerMessage('img',true)" :style="iconActive2?'color:#fff;font-weight: bold;':''">
              <icon name="qujidangdaibiao"></icon>
            </span> -->
      </div>
   
</template>

<script>
export default {
    props:{
      inProject:{
        type: Boolean
      }
    },
    data () {
        return {
            isActive: false,
            iconActive1: false,
            iconActive2: false,
            closetooltip: false,
            isSwitchTip: false,
            switchTitle: "点击显示测风塔",
            isShowTip: false,
            isShowTip2: false,
            index: 0
        };
    },
    methods: {
        switchChange(type , isTrue){
          switch (type){
            case "icon_a": 
            this.isSwitchTip = isTrue;
            !isTrue ? this.switchTitle = "显示/隐藏测风塔" : this.switchTitle = "显示/隐藏测风塔" ;
            break;

            case "icon_b":
            this.isShowTip = isTrue;
            isTrue ? this.$refs['icon_b'].classList.add("activeHover") : this.$refs['icon_b'].classList.remove("activeHover") ;
            break;

            case "icon_c":
            this.isShowTip2 = isTrue;
            isTrue ? this.$refs['icon_c'].classList.add("activeHover") : this.$refs['icon_c'].classList.remove("activeHover") ;
            break;
          }
        },
        openTowerMessage(type,isTrue){
          switch (type) {
            case 'data':
              this.iconActive1 = isTrue;
              this.iconActive2 = false;
              
              this.$emit("towerMessageClick", this.isActive ,"data");

            break;

            case 'img':
              this.iconActive1 = false;
              this.iconActive2 = isTrue;
              ++this.index;
              if(this.index>=2){
                this.iconActive2 = false;
                this.index = 0;
              }
              this.$emit("towerMessageClick", this.isActive ,"img");
              
            break;
          }
        },
        close(type){
          this.iconActive1 = type;
          this.iconActive2 = type;
        },
        openFun () {
            this.iconActive1 = false;
            this.iconActive2 = false;
            this.isActive = !this.isActive;
            this.$emit('windTowerChange', this.isActive);
            this.closetooltip = true;
        }
    }
};
</script>

<style lang="less" scoped>
  .switchBox{
    margin-left: 10px;
    /* width:65px; */
    width:30px;
    height:30px;
    border: 1px solid rgba(220,241,247,0.6);
    /* background:rgba(51,59,76,.4); */
    background:rgba(51,200,111,.6);
    border-radius:20px;
    cursor:pointer;
    position:relative;
    box-sizing: border-box;
    border-width: 1px;
    border-color:RGBA(214, 215, 220, 1) ;
    transition:.5s;
    span{
      /* font-size:15px; */
      position:absolute;
      width:20px;
      height:30px;
        line-height: 30px;
      top:0px;
      /* color:#fff; */
    }
    span.on{
      left:8px;
    }
    span.off{
      right:8px;
    }
    .button{
      width:30px;
      height:30px;
      background:#fff;
      border-radius:50%;
      position:absolute;
      display:block;
      top:0px;
      /* right:-2px; */
      font-size:16px;
      text-align:center;
      line-height:27px;
      color:rgba(51,59,76,.5);
      /* transition:.5s; */
    }
    .button2{
      left: 0;
      z-index: 11111;
    }
  }
  .switchBox.active{
    background:rgba(51,200,111,.6);
    .button{
      right:34px !important;
      color:#33C86F;
    }
  }
  .switchBox.active2{
    /* width: 100px; */
    width: 70px;
    background:rgba(51,200,111,.6);
    .button{
      color:#33C86F;
    }
  }
  .icon1{
    position: relative;
    left: 0;
    opacity: 0;
    text-align: center;
    cursor: pointer;
    transition:.5s;
    color: rgba(220,241,247,0.6);
    font-size:15px;
    z-index: -1;
  }
  .icon2{
    position: relative;
    left: 0;
    opacity: 0;
    z-index: -1;
    text-align: center;
    cursor: pointer;
    transition:.5s;
    color: rgba(220,241,247,0.6);
    font-size:15px;
  }
  .icon1Open{
    opacity: 1;
    left: 39px;
    z-index: 1;
  }
  .icon2Open{
    opacity: 1;
    left: 67px;
    z-index: 1;
  }
  .switchmyTip{
    position: absolute;
    right: 0;
    top: -19px;
    height: 15px;
    text-align: center;
    line-height: 15px;
    font-size: 12px;
    color: #000;
    padding: 2px 5px !important;
    margin: 0 !important;
    background: rgba(220, 241, 247, 0.6);
    border-radius: 1px;
    z-index: 99999;
  }
  .zhengti{
    width: 75px;
  }
  .switchWid{
    width: 90px;
    left: 0 !important;
  }
  .activeHover{
    color: #fff !important;
    font-weight: bold;
  }
</style>
