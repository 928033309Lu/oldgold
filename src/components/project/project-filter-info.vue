<template>
    <div class="listBox" v-on:click="onClick" @mouseenter="onMouseOver" @mouseleave="onMouseOut" v-bind:class="{ active: isActive }">
        <div class="title">
            <span class='nameLine'>{{item.project_name}}</span>
            <span :title="titleIcon" v-show="editable === false"><icon :name="showIcon" :class="showIcon"></icon> </span>
            <div @click.prevent.stop="onEmit('delete')" v-t-role="this.$store.state.user.loginUserInfo.role" v-show="editable" class="delete-div"><icon name="wechaticon13"></icon></div>
            <div @click.prevent.stop="onEmit('edit')" v-t-role="this.$store.state.user.loginUserInfo.role" v-show="editable" class="edit-div"><icon name="bianji"></icon></div>
        </div>
        <el-row class="body">
          <el-col :span="7">{{item.owner_name}}</el-col>
          <el-col :span="5">{{item.design_capacity}}MW</el-col>
          <el-col :span="12" style="text-align: right;padding-right: 20px;">创建时间：{{showDate}}</el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'project-filter-info',
        props: {
            item: {
                type: Object,
                default: {}
            }
        },
        data () {
            return {
                editable: false,
                isActive: false
            };
        },
        computed: {
            titleIcon: function () {
                if (this.item === null) {
                    return '';
                }
                if (this.item.status_id === 2) {
                    return '计算完毕';
                } else if (this.item.status_id === 1) {
                    return '数据计算中';
                } else if (this.item.status_id === 0) {
                    return '缺乏数据';
                }
                return '';
            },
            showIcon: function () {
                if (this.item === null) {
                    return '';
                }
                if (this.item.status_id === 2) {
                    return 'check';
                } else if (this.item.status_id === 1) {
                    return 'clock2';
                } else if (this.item.status_id === 0) {
                    return 'clock3';
                }
                return '';
            },
            showDate: function () {
                let strTime = this.item.create_time;
                if (strTime && strTime.length > 0) {
                    return strTime.substring(0, 10);
                } else {
                    return strTime;
                }
            },
            roleId: function () {
                return this.$store.state.user.loginUserInfo.role;
            },
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role === 3){
                    return true;
                }else if(this.$store.state.user.loginUserInfo.role === 10){
                    return true;
                }else{
                    return false;
                }
            }
        },
        methods: {
            onClick () {
                this.$emit('click');
            },
            onMouseOver () {
                this.editable = true;
                this.isActive = true;
            },
            onMouseOut () {
                this.editable = false;
                this.isActive = false;
            },
            onEmit (action) {
                if(this.enManager){
                    this.$message('您没有权限执行此操作！');
                    return;
                }
                // if (this.roleId === 3) {
                //     this.$message('企业管理员没有权限执行此操作！');
                // } 
                // else {
                    if (action === 'delete') {
                        this.$emit('delete');
                    } else if (action === 'edit') {
                        this.$emit('edit');
                    }
                // }
            }
        }
    };
</script>


<style lang="less" scoped>
    .active{
        background:#0e1a3b !important;
    }
  .listBox{
    overflow:auto;
    margin-top:3px;
    width:100%;
    height:80px;
    background:rgba(25,28,54,0.7);
    opacity: 0.7;
    border-radius:5px;
    font-size:20px;
    overflow: hidden;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
    .title{
      width:100%;
      height:40px;
      position:relative;
      flex-direction: row;
      span{
        font-size:16px;
        color:#33C86F;
        line-height:40px;
        padding:0px 20px;
        font-weight: bold;
      }
       .edit-div{
            font-size:14px;
            color:#7B52C6;
            line-height:40px;
            padding:0px 60px 0px 20px;
            font-weight: bold;
           svg{
               position:absolute;
               right:60px;
               height: 18px;
               width: 18px;
               top: 8px;
           }
        }
        .delete-div{
            font-size:16px;
            color:#7B52C6;
            line-height:40px;
            padding:0px 20px;
            font-weight: bold;
            svg{
                position:absolute;
                right:20px;
                top:5px;
                width: 24px;
                height: 24px;
            }
        }
      svg{
        position:absolute;
        right:20px;
        top:10px;
          width: 20px;
          height: 20px;
      }
      svg.check{
        color:#33C86F;
      }
      svg.clock2{
        color:#FF4967;
      }
      svg.clock3{
        color:#FFC25D;
      }
    }
    .body{
      div{
        padding:5px 0px 10px 20px;
        font-size:12px;
        color:RGBA(212, 239, 246, 1);
      }
    }
  }
  .nameLine {
      display: inline-block;
      width:250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
  }
</style>
