<template>
    <transition name="search-fade" @after-enter="onAfterEnter">
        <div class="container" v-if="searchBarVisible">
            <div class="background" @click="onClickBackground"></div>
            <div class="search-panel" @mouseleave.stop="onMouseLeave" @mouseenter="onMouseEnterMew">
                <el-input ref="keywordInput" class="search-input" v-model="searchKeyword"
                        type="text" maxlength="20"  @keyup.native="keywordKeyUp()" placeholder="请输入项目名称关键字"></el-input>
                <el-button class="search-button" type="primary"><icon name="search"></icon></el-button>
            </div>
            <div class="project-panel" v-if="!showEdit">
                <div :ref="'pro_' + project.project_id" class="project-text" v-for="(project,index) in searchProjects" :key="project.project_id"
                     @mouseleave="onMouseOutPro(project.project_id)" @mouseenter="onMouseEnterPro(project.project_id)"
                     @click="onSearchProjectClick(project)"
                     :style="{background : project.project_id === selectProjectId?'rgb(01, 09, 21)' : ''}">
                    <span class="project-name" :style="{color : project.project_id === selectProjectId?'white' : ''}" v-html="project.showName"></span>
                </div>
            </div>
            <div class="project-panel" v-show='showEdit'>
                <div class="project-text">
                    <span class="project-name">未找到匹配项目</span>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import util from '../../libs/util';
    export default {
        name: 'seach-bar',
        data () {
            return {
                searchBarVisible: false,
                searchKeyword: '',
                searchProjects: [],
                selectProjectId: null,
                selectIndex: null,
                showEdit: false,
                myVar:null
            };
        },
        watch: {
            // 如果 `searchKeyword` 发生改变，这个函数就会运行
            searchKeyword: function (newQuestion, oldQuestion) {
                this.onSearch();
            }
        },
        methods: {
            keywordKeyUp () {
                if (this.searchProjects.length === 0) {
                    return;
                }
                // if (event.keyCode === 38 || event.keyCode === 40) {
                //     this.$refs['keywordInput'].blur();
                // }
                console.log(event.keyCode );
                if (event.keyCode === 13 && this.selectIndex !== null) {
                    //this.selectProjectId = this.searchProjects[this.selectIndex].project_id;
                    this.searchBarVisible = false;
                    this.$emit('projectSelected', this.searchProjects[this.selectIndex]);
                } else if (event.keyCode === 38) {
                    if (this.selectIndex === null) {
                        this.selectIndex = this.searchProjects.length - 1;
                    } else {
                        this.selectIndex = this.selectIndex - 1;
                        if (this.selectIndex < 0) {
                            this.selectIndex = this.searchProjects.length - 1;
                        }
                    }
                    this.selectProjectId = this.searchProjects[this.selectIndex].project_id;
                } else if (event.keyCode === 40) {
                    if (this.selectIndex === null) {
                        this.selectIndex = 0;
                    } else {
                        this.selectIndex = this.selectIndex + 1;
                        if (this.selectIndex > this.searchProjects.length - 1) {
                            this.selectIndex = 0;
                        }
                    }
                    this.selectProjectId = this.searchProjects[this.selectIndex].project_id;
                }
            },
            keywordKeyUpPro (index) {
                this.selectIndex = index;
                if (event.keyCode === 38) {
                    if (this.selectIndex === null) {
                        this.selectIndex = this.searchProjects.length - 1;
                    } else {
                        this.selectIndex = this.selectIndex - 1;
                    }
                } else if (event.keyCode === 40) {
                    if (this.selectIndex === null) {
                        this.selectIndex = 0;
                    } else {
                        this.selectIndex = this.selectIndex + 1;
                    }
                }
                if (this.selectIndex > this.searchProjects.length - 1) {
                    this.selectIndex = 0;
                }
                this.selectProjectId = this.searchProjects[this.selectIndex].project_id;
                this.$refs['pro_' + this.selectProjectId].focus();
            },
            show () {
                this.searchBarVisible = true;
                this.searchKeyword = '';
                this.searchProjects = [];
                this.selectProjectId = null;
                this.selectIndex = null;
                if(this.searchKeyword='') {
                    this.showEdit = false;
                }
                this.myVarTime();
                
            },
            onClickBackground () {
                this.searchBarVisible = false;
                this.$emit('searchClose');
            },
            onSearch: _.debounce(
                function () {
                    util.ajax.get('/projects/search?keyword=' + this.searchKeyword, {
                        keyword: this.searchKeyword
                    }).then(res => {
                        let retData = res.data;
                        // if (retData.code !== 200) {
                        //     this.$message.error(retData.message);
                        //     return;
                        // }
                        if(JSON.stringify(retData.data)=='{}') {
                            this.showEdit = true;
                        }else {
                            this.searchProjects = retData.data.map((ele, index, arr) => {
                                return {...ele, showName: ele.project_name.replace(this.searchKeyword, '<b style="font-weight: 900; color: RGBA(212, 239, 246, 1);">' + this.searchKeyword + '</b>') };
                            });
                            this.selectProjectId = null;
                            this.selectIndex = null;  
                            this.showEdit = false; 
                        }
                    }).catch((err) => {
                        console.error(err);
                        // this.$message.error('搜索失败！');
                    });
                },
                500
            ),
            onSearchProjectClick (project) {
                this.searchBarVisible = false;
                this.$emit('projectSelected', project);
                this.$store.commit('oldprojectId',project.project_id);
                this.$store.commit('nowprojectId',project.project_id);
            },
            onMouseLeave () {
                if (this.searchKeyword === ''&&this.searchProjects.length==0) {
                    clearTimeout(this.myVar);
                    this.myVarTime();
                }
            },
            onMouseEnterMew() {
                clearTimeout(this.myVar);
            },
            onAfterEnter () {
                this.$refs['keywordInput'].focus();
            },
            onMouseOutPro () {

            },
            onMouseEnterPro (projectId) {
                this.selectProjectId = projectId;
            },
            myVarTime() {
                let _that = this;
                _that.myVar = setTimeout(function(){ 
                    _that.searchBarVisible = false;
                _that.$emit('searchClose');
                }, 1000);
            }
        }
    };
</script>

<style scoped>
    .container {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
    .background{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        opacity: 0.1;
    }
    .search-panel {
        position: relative;
        top: 110px;
        left: 20px;
        display: flex;
        flex-direction: row;
        width: 300px;
    }
    .search-input {
        width: 270px;
        height: 40px;
        opacity: 0.5;
        border-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        background-color: RGBA(19, 31, 54, 1);
    }
    .search-button{
        width: 40px;
        height: 40px;
        background:#33C86F;
        border:0px;
        font-size:20px;
        padding:0px;
        position: relative;
        top:0px !important;
        left: 0px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .search-button:hover{
        background:rgba(51, 200, 111, 0.8);
    }
    .project-panel{
        position: relative;
        top: 110px;
        left: 20px;
        width: 258px;
        margin-top: 1px;
        background:rgba(19,31,54,0.5);
        max-height: 400px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .project-text{
        height: 40px;
        width: 258px;
        display: block;
    }
    /*.project-text :hover{*/
    /*background:rgba(1, 24, 48, 0.8)!important;*/
    /*}*/
    .project-name{
        width: 258px;
        height: 40px;
        line-height: 40px;
        display: block;
        color: RGBA(212, 239, 246, 0.8);
        padding-left: 15px;
        padding-right: 15px;
        font-size: 14px;
        user-select: none;
        &:hover{
            color: white;
        }
    }

    /* 搜索框动画 */
    .search-fade-enter-active {
        transition: all .3s ease;
    }
    .search-fade-leave-active {
        transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .search-fade-enter, .search-fade-leave-to{
        opacity: 0;
        transform: translateX(-335px);
    }
    .search-fade-leave, .search-fade-enter-to{
        left: 0px;
        opacity: 1;
    }
    /* 动画结束 */
</style>
