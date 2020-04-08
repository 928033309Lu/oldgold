<template>
  <transition name="el-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="el-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="el-loading-spinner">
        <!-- <svg v-if="!spinner" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <i v-else :class="spinner"></i> -->
        <div class="myloading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
         <p v-if="text" class="el-loading-text" v-bind:style="{color: color}">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<style lang="less">
@green: #33c86f;
@blue: #038ae2;

.el-loading-mask.is-fullscreen .el-loading-spinner {
    margin-top: -35px;
}

.myloading{
    width: 80px;
    height: 70px;
    margin: 0 auto;
    user-select: none;
    // margin-top:100px;

    span {
      display: inline-block;
      width: 8px;
      // height: 100%;
      height: 40px;
      border-radius: 4px;
      background: @green;
      animation: myloading 1s ease infinite;

      &:nth-child(2){
          animation-delay:0.2s;
      }
      &:nth-child(3){
          animation-delay:0.4s;
      }
      &:nth-child(4){
          animation-delay:0.6s;
      }
      &:nth-child(5){
          animation-delay:0.8s;
      }
    }
}
@keyframes myloading{
    0%,100%{
        height: 40px;
        background: @green;
    }
    50%{
        height: 70px;
        margin: -15px 0;
        background: @blue;
    }
}
</style>


<script>
  export default {
      data () {
          return {
              text: null,
              spinner: null,
              background: null,
              fullscreen: true,
              visible: false,
              customClass: '',
              color: 'transparent'
          };
      },

      methods: {
          handleAfterLeave () {
              this.$emit('after-leave');
          },
          setText (text) {
              this.text = text;
          },
          setColor (color) {
              this.color = color;
          }
      }
  };
</script>
