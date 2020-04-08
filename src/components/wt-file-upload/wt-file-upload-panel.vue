<template>
    <div class="cacl_dialg scroll">
        <div class="wt-upload-btn content1" style="z-index:99;position: relative;" :class="terrainValid? 'terrainValidSuccess': ''">
            <wt-upload-file ref="wtUploadFile" :project_id="projectId" @fileNameShow="onFileNameShow" @checkFile="onCheckFile" @fileChange="wtFileChange" @uploadCompleted="uploadCompletedHandle">
                <div v-if="!fileName" class="wt-btn-font">
                    <icon name="zengjia" style="margin-top:-2px;"></icon> &nbsp;添加.dat文件压缩包(.rar/.zip)</div>
                <div v-else class="wt-btn-font wt-btn-font-active">{{ fileName }}</div>
            </wt-upload-file>
            
          <!-- <div class="WT_percentage" v-if="WT_percentage!=0">
            <div class="WT_percentage_line" :style="{width: WT_percentage + '%'}"></div>
            <div class="span"><span>{{fileNameShow}}</span><span>{{WT_percentage}}%</span></div>
          </div>  -->
        </div>
        <wt-progress-bar ref="myWtProcessBar"></wt-progress-bar>
    </div>
</template>

<script>
import wtUploadFile from './wt-upload-s3file';  //新需求换回以前这个要签名的
// import wtUploadFile from './wt-upload-file';
import wtProgressBar from './wt-progress-bar';
import util from '@/libs/util';
export default {
    name: 'wt-file-upload-panel',
    components: {
        wtUploadFile,
        wtProgressBar

    },
    props: {projectId:null},
    computer: {

    },
    data () {
        return {
          fileNameShow:"",
          WT_percentage: 0,
            uploadedFolder: [],
            toolTipShow: false,
            // filePath: null,
            fileName: null,
            shuomingTip: true,
            imgDetail: true,
            terrainValid: false
        };
    },
    watch: {
        projectId () {
            this.getFile();
        },
        // filePath () {
        //     this.fileName = '';
        //     if (!this.filePath) return;
        //     this.fileName = this.filePath.substring(this.filePath.lastIndexOf('/') + 1);
        // },
        fileName(val){
            if(val){
               this.terrainValid = true;
               this.$parent.terrain_WT_Valid = true;
            }else{
              this.terrainValid = false;
              this.$parent.terrain_WT_Valid = false;
            }
        },
        "$store.state.app.WT_percentage":function(val){
          // console.log(val)
          this.WT_percentage = val;
        }
    },
    computed: {
    },
    mounted () {
        this.getFile();
    },
    methods: {
      onCheckFile(){
        this.getFile(null, null, true);
      },
      onFileNameShow(name, width){
        this.fileNameShow = name;
        this.WT_percentage = width;
      },
      //上传之前查有就删
        // s3查询上传文件,查询上传到s3上的无人机影像文件，100个文件为一页
        getFile (path, page, isTrue=false) {
            this.wtFileChange(null);
            util.ajax.post('/s3_filename', {
                project_id: this.projectId,
                path: '/Scheme_WT/' + this.projectId + '/cfd/mesh-and-simulate',
                page: page || 1
            })
                .then(res => {
                    if (res.data.data.filename_list.length === 0) {
                        return;
                    }
                    let fileData = res.data.data.filename_list[0];
                    if (fileData.name.lastIndexOf('/') !== fileData.name.length - 1) {
                        this.fileName = fileData.name.substring(fileData.name.lastIndexOf('/') + 1);
                    }
                    
                    if (isTrue && res.data.data.filename_list.length >0 ) {
                      for (let i = 0; i < res.data.data.filename_list.length; i++) {
                        this.deleteFile(this.projectId, res.data.data.filename_list[i].name);
                      }
                    }
                })
                .catch(err => {
                    console.log('s3_filename:' + err);
                });
        },
        // s3删除文件
        deleteFile (projectId, filePath) {
            if (!projectId || !filePath) return;
            util.ajax.post('/s3_file_delete', {
                project_id: projectId,
                path: filePath.substring(String(projectId).length)
            })
                .then(res => {
                    console.log(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 数据上传完成监听事件
        uploadCompletedHandle (status) {
            // if (status) {
            //     this.getFile();
            // }
            this.$refs['myWtProcessBar'].updateUploadStatus(status);
        },
        wtFileChange (wtFileName) {
          console.log(wtFileName)
            // this.fileName = wtFileName || this.fileName;
            this.fileName = wtFileName;
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../styles/common.less";
.WT_percentage{
  .WT_percentage_line{
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 5px;
    z-index: 1;
    width: 0;
    background: #33c86f;
  }
  .span{
    display: flex;
    justify-content: space-between;
    color: rgba(244,244,244,0.7);
    font-size: 11px;
  }
}

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

.v-modal {
  display: none !important;
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
.content1 {
  position: relative;
  .iconBox{
    width: 25px;
    height:25px;
    position: absolute;
    right: -30px;
    top: 5px;
}
  .dialog-footer {
    display: flex;
  }
  .cancelBtn {
    border: 1px solid rgba(51, 200, 111, 0.5);
    color: #fff;
  }
  .confirmBtn {
    background-color: rgba(51, 200, 111, 0.5);
    border: 1px solid rgba(51, 200, 111, 0.5);
    color: #fff;
  }
  .confirmBtn:hover {
    background-color: #33c86f;
  }
  .dialog-body-content {
    color: #d4eff6;
    text-align: center;
    margin-top: 43px;
    font-size: 16px;
  }
}
.wt-upload-btn {
  width: 283px;
  height: 30px;
  border: 1px dashed rgba(212, 239, 246, 1);
  opacity: 0.8;
  border-radius: 4px;
  text-align: center;
  margin: 0 auto;
  margin-top: 15px;
  cursor: pointer;
  .wt-btn-font {
    margin: 0 auto;
    text-align: center;
    // width: 175px;
    width: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin-top: 5px;
    height: 25px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(212, 239, 246, 1);
    line-height: 20px;
    opacity: 0.7;
  }
  .wt-btn-font-active{
    color: rgba(51, 200, 111, 1);
  }
}

.wt-title-help {
  text-align: center;
  margin: 0 auto;
  margin-top: 40px;
  display: block;
  .title {
    width: 50%;
    height: 15px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: bold;
    color: rgba(212, 239, 246, 1);
    line-height: 20px;
    float: left;
    text-align: left;
  }

  .help {
    width: 50%;
    height: 13px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(51, 200, 111, 1);
    line-height: 20px;
    opacity: 0.9;
    float: right;
    text-align: right;
    cursor: pointer;
  }

  .links-group {
    /*width: 514px;*/
    /*margin: 20px auto;*/
    /*display: flex;*/
    justify-content: flex-end;
    cursor: pointer;
  }
  .links-group .link {
    font-size: 12px;
    color: RGBA(51, 200, 111, 1);
    a {
      color: #33c86f;
      text-decoration: #33c86f;
    }
  }
  .links-group .link.check {
    position: relative;
    margin-right: 15px;
  }

  .tooltip {
    position: absolute;
    /* top: 210px;
    left: 30px; */
    border-radius: 20px;
    /* width: 700px;
    height: 85px; */
    padding: 10px 20px;
    color: #33c86f;
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
  /* .tooltip:before {
    box-sizing: content-box;
    width: 0;
    height: 0;
    position: absolute;
    top: -16px;
    right: 213px;
    padding: 0;
    border-bottom: 8px solid rgba(0, 24, 49, 0.7);
    border-top: 8px solid transparent;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    display: block;
    content: "";
    z-index: 12;
  } */
  /* .tooltip:after {
    box-sizing: content-box;
    width: 0;
    height: 0;
    position: absolute;
    top: -18px;
    right: 212px;
    padding: 0;
    border-bottom: 9px solid #d4eff659;
    border-top: 9px solid transparent;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    display: block;
    content: "";
    z-index: 10;
  } */

  .wt-file-list {
    top: 11px;
  }
}

.steps {
  /*margin: 50px 210px 0 210px;*/
  width: 90%;
  display: flex;
  justify-content: space-around;
  .step-item {
    cursor: pointer;
  }
  .step-prev {
    width: 144px;
    height: 40px;
    .gf-button {
      background: rgba(220, 241, 247, 0.4);
      /*border: 1px solid rgba(220, 241, 247, 0.5);*/
      border: none !important;
    }
  }
  .step-next {
    width: 144px;
    height: 40px;
    .el-button {
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