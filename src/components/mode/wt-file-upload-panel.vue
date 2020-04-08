<template>
    <div class="cacl_dialg scroll">
        <div class="wt-upload-btn content1" style="z-index:99;position: relative;">
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
                <div class="wt-file-list" >
                    <wt-folder-table   style="height:150px;" :project_id="projectId" ref="wtFolderTableRef" @wtFileFormChange="wtFileFormChangeHandle"></wt-folder-table>
                </div>
            </div>
        </div>
        <wt-progress-bar ref="myWtProcessBar"></wt-progress-bar>
    </div>
</template>

<script>
    import wtUploadFolder from './wt-upload-folder';
    import wtFolderTable from './wt-folder-table';
    import wtProgressBar from './wt-progress-bar';
    export default {
        name: "wt-file-upload-panel",
        components: {
            wtUploadFolder,
            wtFolderTable,
            wtProgressBar

        },
        props: {projectId:null},
        computer: {

        },
        data () {
            return {
                uploadedFolder: [],
                toolTipShow: false,
                wtUploadCalcBtn: true,
                shuomingTip: true,
                imgDetail: true
            };
        },
        methods: {
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
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '../../styles/common.less';
    .bottombox{
  position: absolute;
  left: 50%;
  top: 23px;
  text-align: left;
  margin-left: -157px;
  color: rgba(212, 239, 246, 0.8);
  width: 500px;
  font-size: 9px;
  &>p{
    position: absolute;
    span{
      font-size: 10px;
    }
  }
}
.bottombox /deep/ .el-input__inner{
  border: 1px solid rgba(212, 239, 246, 0.8);
}
    .v-modal{
        display: none!important;
    }
    .imgtip1{
        width: 100%;
        border-radius: 5px;
    }
    .imgtip2{
        width: 780px;
        height: 490px;
        border-radius: 5px;
        position: fixed;
        left: 0;right: 0;
        top: 0;bottom: 0;
        margin: auto;
        z-index: 9999;
    }
    .content1{
        position: relative;
        .iconBox{
            width: 25px;
            height:25px;
            position: absolute;
            right: -30px;
            top: 5px;
        }
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
        // width:264px;
        width:283px;
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
            // width:175px;
            width:100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            margin-top:5px;
            height:25px;
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
            /* top: 210px; */
            /* left: 30px; */
            border-radius: 15px;
            /* width: 700px; */
            /* height: 85px; */
            padding: 10px 20px;
            color: #33C86F;
            line-height: 20px;
            text-align: justify;
            background: rgba(0, 24, 49, 1);
            border: 1px dashed rgba(212,239,246,0.5);
            opacity: 1;

        }
        .tooltipWT{
            left: 19px;
            top: -22px;
            width: 740px;
            .tooltip-arrow{
                position: absolute;
                bottom: -10px;
                right: 233px;
                width: 20px;
                height: 10px;
                overflow: hidden;
                transform: rotate(180deg);
                .arrow-up{
                width: 17px;
                height: 17px;
                background: #001831;
                border: 1px dashed rgba(212,239,246,0.5);
                transform: rotate(45deg) scale(0.8, 0.8);
                display: inline-block;
                }
            }
        }
        /* .tooltip:before{
            box-sizing: content-box;
            width: 0;
            height: 0;
            position: absolute;
            top: -16px;;
            right:213px;
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
            right:212px;
            padding:0;
            border-bottom:9px solid #d4eff659;
            border-top:9px solid transparent;
            border-left:9px solid transparent;
            border-right:9px solid transparent;
            display: block;
            content:'';
            z-index:10
        } */

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

    .mytip{
        height: 18px;
        width: 60px;
        text-align: center;
        line-height: 18px;
        font-size: 12px;
        color: #000;
        padding: 2px 5px;
        margin: 0 !important;
        /* font-weight: bold; */
        background: rgba(220, 241, 247, 0.6);
        border-radius: 1px;
        position: absolute;
        bottom: 35px;
        right: -40px;
        z-index:12345;
    }
    /* .mytip:after{
        display:block;
        content:'';
        border-width:6px 6px 6px 6px;
        border-style:solid;
        border-color:rgba(220, 241, 247, 0.5) transparent transparent transparent;
        position:absolute;
        left:13px;
        top:100%;
    } */
    .closeTip{
        position: absolute;
        top: -5px;
        right: -10px;
        border: 1px solid rgba(220, 241, 247, 0.6);
        color: rgba(212,239,246,0.6);
        background: #001831;
        font-weight: bold;
        border-radius: 50%;
        height:20px;
        width:20px;
        z-index : 5555;
        font-size: 15px;
        display: flex;
        justify-content: center;
        align-content: center;
        cursor: pointer;
    } 
</style>