<template>
    <transition name="search-fade">

        <div class="container filterBox" v-if="dialogVisible">
            <div class="filterBoxMask" @click="onClose">

            </div>
            <div class="header-panel">
                <span class="header-text">查看项目</span>
                <div @click="onClose" style="height: 30px;width: 30px;z-index: 3">
                    <icon class="header-icon" name="close"></icon>
                </div>
            </div>

            <div class="condition-panel condition-main-panel">
                <span class="condition-text">项目所属：</span>
                <el-checkbox label="所有项目" v-model="checkedAll" @change="onChangeAll" @checked="true"></el-checkbox>
                <el-checkbox label="我的项目" v-model="checkedMy" @change="onChangeMy" style="margin-left: 20px !important;"></el-checkbox>
            </div>

            <div class="condition-panel">
                <span class="condition-text">项目容量：</span>
                <el-checkbox label="<50MW" v-model="checkedCapacity1" @change="onChange"></el-checkbox>
                <el-checkbox label="50~100MW" v-model="checkedCapacity2" @change="onChange" style="margin-left: 20px !important;"></el-checkbox>
                <el-checkbox label=">100MW" v-model="checkedCapacity4" @change="onChange" style="margin-left: 27px !important;"></el-checkbox>
            </div>

            <div class="condition-panel">
                <span class="condition-text">项目状态：</span>
                <el-checkbox label="缺乏数据" v-model="checkedStatus1" @change="onChange"></el-checkbox>
                <el-checkbox label="计算中" v-model="checkedStatus2" @change="onChange" style="margin-left: 20px !important;"></el-checkbox>
                <el-checkbox label="计算完毕" v-model="checkedStatus4" @change="onChange" style="margin-left: 27px !important;"></el-checkbox>
            </div>

            <div class="list-panel">
                <project-filter-info v-for="item in projects" :key="item.project_id" :item="item" @click="onClick(item)" @delete="onDelete(item)" @edit="onEdit(item)"></project-filter-info>
            </div>
        </div>
    </transition>
</template>

<script>
import ProjectFilterInfo from './project-filter-info';
import util from '@/libs/util';
import MyDialog from '../common/my-dialog';

export default {
    components: { MyDialog, ProjectFilterInfo },
    name: 'project-filter',
    data () {
        return {
            dialogVisible: false,
            belong: '',
            capacity: '',
            status: '',
            checkedAll: false,
            checkedMy: false,
            checkedCapacity1: false,
            checkedCapacity2: false,
            checkedCapacity4: false,
            checkedStatus1: false,
            checkedStatus2: false,
            checkedStatus4: false,
            projects: [],
            loading: true,
            flag: false
        };
    },
    watch: {
        // '$store.state.app.projectsData': function () {
        //     this.onChange();
        // },
        loading () {
            this.$store.commit('globeLoading', {loading: this.loading, text: '正在更新项目列表'});
        },
        projects () {
            this.$emit('projectChange', this.projects);
        }
    },
    methods: {
        onChangeAll () {
            this.checkedMy = false;
            this.onChange();
        },
        onChangeMy () {
            this.checkedAll = false;
            this.onChange();
        },
        onChange () {
            let belong = 0;
            let capacity = 0;
            let status = 0;

            if (this.checkedAll === true) {
                belong = belong + 1;
            }
            if (this.checkedMy === true) {
                belong = belong + 2;
            }
            if (this.checkedCapacity1 === true) {
                capacity = capacity + 1;
            }
            if (this.checkedCapacity2 === true) {
                capacity = capacity + 2;
            }
            if (this.checkedCapacity4 === true) {
                capacity = capacity + 4;
            }
            if (this.checkedStatus1 === true) {
                status = status + 1;
            }
            if (this.checkedStatus2 === true) {
                status = status + 2;
            }
            if (this.checkedStatus4 === true) {
                status = status + 4;
            }

            this.filterProject(belong, capacity, status);
        },
        onClick (projectInfo) {
            // projectInfo.project_id
            this.$store.commit('oldprojectId',projectInfo.project_id);
            this.$store.commit('nowprojectId',projectInfo.project_id);
            this.$emit('projectClicked', projectInfo);
            //关闭工具栏所以选中状态
            // this.Bus.$emit("closeFunBtnSelected",false);
        },
        onDelete (projectInfo) {
            this.$alert('确认删除项目' + projectInfo.project_name + '？此操作将不可回退。', '删除项目', {
                confirmButtonText: '确定',
                center: true,
                callback: action => {
                    if (action !== 'confirm') {
                        return;
                    }
                    this.$store.commit('globeLoading', {loading: true, text: '正在删除...'});
                    util.ajax.delete('/projects/' + projectInfo.project_id, {
                    }).then(res => {
                        this.$store.commit('globeLoading', {loading: false, text: ''});
                        let retData = res.data;
                        if (retData.code !== 204) {
                            this.$message.error(retData.message);
                            return;
                        }
                        this.$store.state.app.needRefreshProjectList = true;
                        this.onChange();

                        //删除后清空数据
                        this.$emit('clearProject',"home" ,true);
                    }).catch((/* err */) => {
                        this.$store.commit('globeLoading', {loading: false, text: ''});
                        this.$message.error('删除项目失败！');
                    });
                }
            });
        },
        onEdit (projectInfo) {
            this.$emit('projectEdit', projectInfo);
        },
        loadData (belong, capacity, status) {
            this.loading = true;
            util.ajax.get('/projects/filter?radio_belong=' + belong +
                '&radio_capacity=' + capacity + '&radio_status=' + status, {}
            ).then(res => {
                this.loading = false;
                let retData = res.data;
                if (retData.code !== 200) {
                    this.$message.error(retData.message);
                    return;
                }
                this.projects = retData.data;
                this.$store.commit('projectsData', retData.data);
                this.onChange();
            }).catch((/* err */) => {
                this.loading = false;
                this.$message.error('获取项目列表失败！');
            });
        },
        filterProject (belong, capacity, status) {
            if (!this.$store.state.app.projectsData || this.$store.state.app.needRefreshProjectList) {
                this.loadData(0, 0, 0);
                this.$store.state.app.needRefreshProjectList = false;
                return;
            }

            this.projects = this.$store.state.app.projectsData.filter(item => this.checkBelong(item.owner_id, belong) && this.checkCapacity(item.design_capacity, capacity) && this.checkStatus(item.status_id, status));
            // console.log( this.projects)
        },
        checkStatus (statusid, status) {
            switch (status) {
                case 1:
                    return statusid === 0;
                case 2:
                    return statusid === 1;
                case 3:
                    return statusid === 0 || statusid === 1;
                case 4:
                    return statusid === 2;
                case 5:
                    return statusid === 0 || statusid === 2;
                case 6:
                    return statusid === 1 || statusid === 2;
                default:
                    return true;
            }
        },
        checkBelong (ownerid, belong) {
            if (belong !== 2) return true;
            return ownerid === this.$store.state.user.loginUserInfo.user_id;
        },
        checkCapacity (designCapacity, capacitType) {
            switch (capacitType) {
                case 1:
                    return designCapacity < 50;
                case 2:
                    return designCapacity >= 50 && designCapacity <= 100;
                case 3:
                    return designCapacity <= 100;
                case 4:
                    return designCapacity > 100;
                case 5:
                    return designCapacity < 50 || designCapacity > 100;
                case 6:
                    return designCapacity >= 50;
                default:
                    return true;
            }
        },
        open () {
            // this.projects = [];
            this.belong = '';
            this.capacity = '';
            this.status = '';
            this.checkedAll = false;
            this.checkedMy = false;
            this.checkedCapacity1 = false;
            this.checkedCapacity2 = false;
            this.checkedCapacity4 = false;
            this.checkedStatus1 = false;
            this.checkedStatus2 = false;
            this.checkedStatus4 = false;

            this.dialogVisible = true;
            this.filterProject(0, 0, 0);
        },
        close () {
            this.dialogVisible = false;
        },
        onClose () {
            this.$emit('close');
        }
    }
};
</script>

<style lang="less">
.filterBoxMask {
  position: absolute;
  width: 1920px;
  height: 100%;
  z-index: 0;
}
.filterBox {
  width: 350px;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  background: rgba(19, 31, 54, 0.5);
  padding-left: 20px;
  padding-right: 20px;
  z-index: 2;
}
.filterBox .header-panel {
  margin-top: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.filterBox .header-text {
  color: rgba(212, 239, 246, 1);
  height: 25px;
  line-height: 25px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  opacity: 0.8;
}
.filterBox .header-icon {
  color: rgba(212, 239, 246, 1);
  height: 20px;
  line-height: 28px;
  font-size: 28px;
  cursor: pointer;
  font-weight: 900;
  opacity: 0.8;
}
.filterBox .header-icon:hover {
  color: #fff;
  opacity: 1;
}
.filterBox .condition-main-panel {
  margin-top: 20px !important;
}
.filterBox .condition-panel {
  flex-direction: row;
  margin-top: 7px;
  opacity: 0.7;
}
.filterBox .condition-text {
  font-family: MicrosoftYaHei;
  color: rgba(212, 239, 246, 1);
  font-size: 10px;
}
.filterBox .el-checkbox__label {
  font-size: 10px !important;
  padding-left: 3px !important;
  color: #d4eff6;
}
.filterBox .el-checkbox + .el-checkbox {
  margin-left: 0px !important;
}
.filterBox .el-checkbox__original {
  display: none !important;
}
.filterBox .list-panel {
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  bottom: 20px;
  top: 230px;
  width: 350px;
  padding-right: 20px;
}
.filterBox {
  .el-checkbox {
    width: 75px;
    margin-right: 0px!important;
  }
}

/* 搜索框动画 */
.search-fade-enter-active {
  transition: all 0.3s ease;
}
.search-fade-leave-active {
  transition: all 0.3s ease; //cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.search-fade-enter,
.search-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.search-fade-leave,
.search-fade-enter-to {
  left: 0px;
  opacity: 1;
}
/* 动画结束 */
</style>
