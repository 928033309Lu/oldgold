<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        mounted () {
            window.onresize = () => {
                this.$store.commit('screenWidth', document.documentElement.clientWidth);
                this.$store.commit('screenHeight', document.documentElement.clientHeight);
            };
        },
        watch: {
          $route(to,form){
              // console.log(to,form);
              console.log("当前路由:"+to.path);
              this.$store.commit('routerPath', to.path); 
          }
        },
    };
</script>

<style lang="less">
    @import "./styles/common";
    @import "./styles/element-ui-custom";
    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: #f0f0f0;
        overflow: hidden;
    }
    .app-main {
        width: 100%;
        height: 100%;
    }
.onmytooltip,.offmytooltip{
    height:18px !important;
    line-height:18px;
    font-size:12px;
    padding: 2px 5px !important;
    margin: 0 !important;
}
.mySwitchTooltip{
    height:20px !important;
    line-height: 20px;
    font-size:12px;
    padding: 2px 5px !important;
}
/* //开关tooltip样式 */
.mySwitchTooltip[x-placement^=right]{
  background-color: rgba(220,241,247,0.6) !important;
  border: none!important;
  .popper__arrow{
    top: 4px !important;
    border-right:none !important;
  }
  .popper__arrow:after{
    bottom: -7px;
    left: 1px;
    border-left-width: 0;
    border-right-color:rgba(220,241,247,0.6) !important;
  }
}
.mySwitchTooltip[x-placement^=left]{
  background-color: rgba(220,241,247,0.6) !important;
  border: none!important;
  .popper__arrow{
    top: 4px !important;
    border-left:none !important;
  }
  .popper__arrow:after{
    bottom: -7px;
    right: 1px;
    border-right-width: 0;
    border-left-color:rgba(220,241,247,0.6) !important;
  }
}
.mySwitchTooltip[x-placement^=top]{
  background-color: rgba(220,241,247,0.6) !important;
  border: none!important;
}
.mySwitchTooltip[x-placement^=bottom]{
  background-color: rgba(220,241,247,0.6) !important;
  border: none!important;
  .popper__arrow{
    top: 3px !important;
    border-bottom:none !important;
  }
  .popper__arrow:after{
    top: -7px;
    left: 0;
    border-top-width: 0;
    border-bottom-color:rgba(220,241,247,0.6) !important;
  }
}
/* 全局弹出框背景不要 */
.v-modal{
    opacity: 0 !important;
}
/* 全局提示样式 */
.el-tooltip__popper.is-light{
    background:rgba(220,241,247,0.6) !important;
    color:#000 !important;
    border: none !important;
    border-radius:1px !important;
}
 .tooltipName{
    background: rgba(3,32,62,0.6) !important;
}
.tower-details{
    margin-top: 4% !important;
}
.gf-popper2 /deep/ .el-scrollbar__wrap{
        width:265px !important;
        height: 100%;
    }
// 单选框全局样式
.el-radio{
    color: #d4eff6 !important;
}
.el-radio__inner{
    border-radius: 2px !important;
    border: 1px solid rgba(159, 164, 162, 0.5) !important;
}
.el-radio__inner:after{
    width: 8px !important;
    height: 8px !important;
    border-radius: 0 !important;
}


 /* 部分环境界面不能往下增加高度bug修复,一些环境没事 */
    /* 添加风机-按指定坐标 */
    .coordinate-body  /deep/ .is-scrolling-none{
      max-height: 216px !important;
    }
    /* 桩位设计 */
    .steps-container  /deep/ .is-scrolling-none{
      max-height: 100px !important;
    }
    /* 上传参数第三步 */
    .param-container  /deep/ .is-scrolling-none{
      max-height: 180px !important;
      overflow-y: auto;
    }
    
     // 上传参数机位点
    .tabJiweidian /deep/ .el-table__body-wrapper{
        max-height: 205px !important;
    }
    .parameterBox  /deep/ .el-dialog__body{
      overflow-y: initial !important;
    }
</style>
