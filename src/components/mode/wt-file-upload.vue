<template>
    <el-dialog title="上传WT文件" :modal="false" :visible.sync="wtFileUploadVisible"  width="820px" top="5%" class="cacl_dialg scroll" style="height:700px;" :before-close="beforeClose">
        <div class="wt-upload-btn content1" style="z-index:99">
            <wt-upload-folder ref="wtUploadFolder" :project_id="projectId" @uploadCompleted="uploadCompletedHandle">
                <div class="wt-btn-font"><icon name="zengjia" style="margin-top:-2px;"></icon> &nbsp;添加分扇区.dat定向文件</div>
            </wt-upload-folder>
        </div>

        <div style="width:90%;text-align:center;margin:0 auto;min-height:150px">
            <div class="wt-title-help">
                <div class="title">上传文件列表</div>
                <div class="links-group help">
                    <div class="link check"
                         @mouseenter="toolTipShow = true"
                         @mouseleave="toolTipShow = false">
                        <a href="javascript:void (0)" style="text-decoration:underline">查看说明</a>
                    </div>
                </div>

                <transition name="fade">
                    <div v-show="toolTipShow" class="tooltip" style="z-index: 9999;">
                        请上传该项目WindUnified定向结果文件数据，组织形式如下，选择“根目录文件夹” 即可上传：
                        根目录文件夹
                        ——扇区名称1 文件夹
                        ——***.dat定向文件
                        ——扇区名称2 文件夹
                        ——***.dat定向文件
                        ……
                    </div>
                </transition>
                <div class="wt-file-list" >
                    <wt-folder-table  :project_id="projectId" ref="wtFolderTableRef" @wtFileFormChange="wtFileFormChangeHandle"></wt-folder-table>
                </div>
            </div>


            <div class="steps" style="position:absolute;bottom:20px;">
                <div class="step-item step-next" >
                    <el-button ref="wtCalcBtn" class="gf-button" :disabled="wtUploadCalcBtn"
                               @click="wtUploadCalc" style="width: 100%" type="primary" :loading="uploadLoading">
                        开始计算
                    </el-button>
                </div>
            </div>
        </div>
        <div class="upload-success"  v-if="uploadSuccess">
            <div class="container">
                <img src="../../images/success-transparent.png" alt="">
                <div class="notice">提交计算成功</div>
                <div class="check" @click="goCheck">查看</div>
            </div>
        </div>
        <wt-progress-bar ref="myWtProcessBar"></wt-progress-bar>
    </el-dialog>
</template>

<script>
    import wtUploadFolder from './wt-upload-folder';
    import wtFolderTable from './wt-folder-table';
    import wtProgressBar from './wt-progress-bar';
    import util from '@/libs/util';
    export default {
        name: 'wt-file-upload',
        components: {
            wtUploadFolder,
            wtFolderTable,
            wtProgressBar
        },
        props: {

        },
        computer: {

        },
        data () {
            return {
                wtFileUploadVisible: false,
                dataList: [],
                uploadedFolder: [],
                uploadLoading: false,
                projectId: '',
                uploadSuccess: false,
                toolTipShow: false,
                wtUploadCalcBtn: true
            };
        },
        methods: {
            // 关闭前回调
            beforeClose () {
                this.wtFileUploadVisible = false;
                // this.$emit('wfFileUploadClose');
                // if (this.$refs['myWtProcessBar'].visibility) {
                //     this.$refs['myWtProcessBar'].ConfirmCancelUpload();
                //     this.$refs['myWtProcessBar'].closeProgressBar();
                //
                //     // this.$refs['wtUploadFolder'].CancelToken = null;
                // }
            },
            wfFileUploadOpen (projectId) {
                this.wtFileUploadVisible = true;
                this.projectId = projectId;
            },
            wfFileUploadClose () {
                this.wtFileUploadVisible = false;
            },
            // 数据上传完成监听事件
            uploadCompletedHandle (status) {
                this.$refs['myWtProcessBar'].updateUploadStatus(status);
                this.wtUploadCalcBtn = !status;
            },
            // 获取upload组件返回的fileList
            wtFileFormChangeHandle (fileForm) {
                this.uploadedFolder = fileForm;
                if (this.uploadedFolder.length > 0) {
                    this.wtUploadCalcBtn = false;
                } else {
                    this.wtUploadCalcBtn = true;
                }
            },
            wtUploadCalc () {
                util.ajax.post('/calculate/' + this.projectId + '/1', {
                    args: 'wt'
                }).then(res => {
                    if (res.data.code !== 200) {
                        this.$message.error('开始计算失败！');
                        return;
                    }
                    this.$message.success('已开始计算...');
                }).catch(() => {
                    this.$message.error('开始计算失败！');
                });
            }
        },
        mounted () {
        }
    }
</script>

<style lang="less" scoped>
    @import '../../styles/common.less';
    .v-modal{
        display: none!important;
    }
    .content1{

        .dialog-footer{
            display: flex;
        }
        .cancelBtn{
            border: 1px solid rgba(51, 200, 111, 0.5);
            color: #FFF;
        }
        .confirmBtn{
            background-color: rgba(51, 200, 111, 0.5);
            border: 1px solid rgba(51, 200, 111, 0.5);
            color: #FFF;
        }
        .confirmBtn:hover{
            background-color: #33C86F;
        }
        .dialog-body-content{
            color: #d4eff6;
            text-align: center;
            margin-top: 43px;
            font-size: 16px;
        }
    }
    .wt-upload-btn {
        width:264px;
        height:30px;
        border:1px dashed rgba(212,239,246,1);
        opacity:0.8;
        border-radius:4px;
        text-align: center;
        margin:0 auto;
        margin-top:31px;
        cursor: pointer;
        .wt-btn-font {
            margin:0 auto;
            text-align: center;
            width:175px;
            margin-top:5px;
            height:14px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(212,239,246,1);
            line-height:20px;
            opacity:0.7;
        }
    }

    .wt-title-help{
        text-align: center;
        margin:0 auto;
        margin-top:40px;
        display: block;
        .title{
            width:50%;
            height:15px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:bold;
            color:rgba(212,239,246,1);
            line-height:20px;
            float: left;
            text-align: left;
        }

        .help{
            width:50%;
            height:13px;
            font-size:12px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(51,200,111,1);
            line-height:20px;
            opacity:0.9;
            float: right;
            text-align: right;
            cursor: pointer;
        }



        .links-group{
            /*width: 514px;*/
            /*margin: 20px auto;*/
            /*display: flex;*/
            justify-content: flex-end;
            cursor:pointer;

        }
        .links-group .link{
            font-size: 12px;
            color: RGBA(51, 200, 111, 1);
            a{
                color: #33c86f;
                text-decoration: #33c86f;
            }
        }
        .links-group .link.check{
            position: relative;
            margin-right: 15px;
        }

        .tooltip{
            position: absolute;
            top: 185px;
            left: 30px;
            border-radius: 20px;
            width: 700px;
            height: 85px;
            padding: 25px;
            color: #33C86F;
            line-height: 30px;
            text-align: justify;
            background: rgba(0, 24, 49, 1);
            border: 1px dashed #D4EFF6;
            opacity: 1;

        }

        .tooltip:before{
            box-sizing: content-box;
            width: 0;
            height: 0;
            position: absolute;
            top: -16px;;
            right:45px;
            padding:0;
            border-bottom:8px solid rgba(0,24,49,0.7);
            border-top:8px solid transparent;
            border-left:8px solid transparent;
            border-right:8px solid transparent;
            display: block;
            content:'';
            z-index: 12;
        }
        .tooltip:after{
            box-sizing: content-box;
            width: 0;
            height: 0;
            position: absolute;
            top: -18px;;
            right:44px;
            padding:0;
            border-bottom:9px solid #d4eff659;
            border-top:9px solid transparent;
            border-left:9px solid transparent;
            border-right:9px solid transparent;
            display: block;
            content:'';
            z-index:10
        }

        .wt-file-list{
            top: 11px;
        }
    }



    .steps {
        /*margin: 50px 210px 0 210px;*/
        width: 90%;
        display: flex;
        justify-content: space-around;
        .step-item{
            cursor:pointer;
        }
        .step-prev{
            width:144px;
            height:40px;
            .gf-button{
                background:rgba(220,241,247,0.4);
                /*border: 1px solid rgba(220, 241, 247, 0.5);*/
                border: none !important;
            }
        }
        .step-next{
            width:144px;
            height:40px;
            .el-button{
                border: none !important;
            }
        }
    }
</style>