<template>

  <div class="label-switcher" @mouseenter="iconDuibiActive = true" @mouseleave="iconDuibiActive = false" :style="labelVisible?'background: rgba(51, 200, 111, 0.6);':'background: rgba(51, 200, 111, 0);'">
    <span class="switcher-text" v-if="!labelVisible" style="left: 11px;">OFF</span>
    <span class="switcher-text" v-if="labelVisible" style="left: 35px;">ON</span>

    <div class="switcher-btn" @click="change" :class="labelVisible ? '' : 'labelActive'">
      <icon name="fengji" style="width:18px;height:18px;"/>
    </div>
    <div class="switchmyTip2" v-show="iconDuibiActive">{{labelVisible ? "隐藏风机标签" : "显示风机标签"}}</div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      labelVisible: false,
      iconDuibiActive: false
    }
  },
  watch: {
  },
  mounted () {

  },
  methods: {

    change () {
      this.labelVisible = !this.labelVisible
      this.$emit('methodClick', 'fanNameLabel2', this.labelVisible);
    }
  }
}
</script>
<style lang="less" scoped>
.switchmyTip2{
  width: 80px;
  right: 0;
}
.label-switcher {
  width: 65px;
  height: 30px;
  border: 1px solid rgba(214, 215, 220, 1);
  border-radius: 15px;
  margin-left: 10px;
  color: rgba(51, 59, 76, 0.5);
}
.switcher-btn {
  position: relative;
  top: -22px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: rgba(249, 250, 253, 1);
  box-shadow: 0px 4px 10px 0px rgba(99, 91, 85, 0.32);
  border-radius: 15px;
  cursor: pointer;
  left: 0;
  transition: all 0.3s;
}
.switcher-text {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(249, 250, 253, 1);
  line-height: 20px;
  position: relative;
  top: 3px;
  left: 9px;
}
.switcher-icon {
  font-size: 16px;
  position: relative;
  padding: 5px 7px;
  color: rgba(25, 33, 46, 1);
}
.labelActive{
  left: 40px;
  transition: all 0.3s;
}
</style>