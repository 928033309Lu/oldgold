<template>
    <transition name="fade">
        <div class="buttons-group">
            <!--回滚-->
            <div @click="rollBack" class="rollBack" style="cursor: pointer;" v-bind:class="{disabled: !editedStation}">
                <el-tooltip class="item" effect="light" content="回滚" placement="top" popper-class="custom-tooltip">
                    <icon name="refresh1"/>
                </el-tooltip>
            </div>
            <!--保存-->
            <div @click="saveData" style="cursor: pointer;" v-bind:class="{disabled: !editedStation}">
                <el-tooltip class="item" effect="light" content="保存" placement="top" popper-class="custom-tooltip">
                    <icon name="baocun"/>
                </el-tooltip>
            </div>
            <!--关闭-->
            <div @click="closeToolBar" style="cursor: pointer;">
                <el-tooltip class="item" effect="light" content="退出" placement="top" popper-class="custom-tooltip">
                    <icon name="exit"/>
                </el-tooltip>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'stationButtons',
        data () {
            return {
                isActive: true
            };
        },
        computed: {
            editedStation () {
                return this.$store.state.station.editedStation;
            }
        },
        methods: {
            // 回滚编辑
            rollBack () {
                if (!this.editedStation) return;
                this.$confirm('回滚后无法返回，确认返回到上一次保存状态？', '回滚', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'road-detail-quit-message'
                })
                    .then(() => {
                        this.$emit('stationButtonsFunction', 'rollBack');
                    })
                    .catch(action => {});
            },
            // 保存数据
            saveData () {
                if (!this.editedStation) return;
                this.$emit('stationButtonsFunction', 'saveData');
            },
            // 关闭
            closeToolBar () {
                if (this.editedStation) {
                    this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '保存',
                        cancelButtonText: '放弃修改',
                        customClass: 'road-detail-quit-message'
                    })
                        .then(() => {
                            // 保存并提交
                            this.$emit('stationButtonsFunction', 'saveData');
                        })
                        .catch(action => {
                            if (action === 'cancel') {
                                // 回滚并离开页面
                                this.$emit('stationButtonsFunction', 'closeToolBar');
                            }
                        });
                } else {
                    // 停止手动编辑场内道路节点
                    this.$emit('stationButtonsFunction', 'closeToolBar');
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .buttons-group{
        position: absolute;
        right: 10px;
        bottom: 40px;
        // width: 148px;
        height: 50px;
        // margin-right: 10px;
        font-size: 22px;
        line-height: 50px;
        div{
            color: #A3B6C3;
            width: 45px;
            height: 50px;
            float: left;
            text-align: center;
            background-color: rgba(3, 28, 53, 0.6);
            &:hover {
                 color: #33C86F;
             }
        }
        div.disabled{
            opacity: 0.6;
            color: rgb(211, 219, 228);
        }
        .rollBack {
            line-height: 54px;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            .icon{
                width: 26px;
                height: 26px;
            }
        }
        .closeToolBar{
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>