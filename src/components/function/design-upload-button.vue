<style lang="less" scoped>
.file-upload-button {
  display: inline-block;
  .trigger {
    height: 50px;
    border-radius: 4px;
    border: solid 1px #33c86f;
    text-align: center;
    line-height: 50px;
    padding: 0 15px;
    color: #33c86f;
    font-size: 14px;
    opacity: 0.7;
    /*&:hover {*/
    /*opacity: 1;*/
    /*}*/
  }
}
.button-container {
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  background: rgba(3, 32, 62, 0.6);
  color: #d3dbe4;
  cursor: pointer;
  /*border-top-right-radius: 4px;*/
  /*border-bottom-right-radius: 4px;*/
}
.button-container :hover {
  background: rgba(3, 32, 62, 0.3) !important;
  color: #33c86f;
}
.icon-panel {
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 4px;
}
.button-container-none{
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    position: relative;
    background: rgba(3, 32, 62, 0.6);
    color: #d3dbe4;
    cursor: not-allowed;
}
</style>

<template>
    <el-upload ref="upload" class="file-upload-button" :disabled="disable" :accept="accept" :action="action" :show-file-list="false" :http-request="httpRequest" :on-success="onSuccess" :on-error="onError" :on-change="onChange">
        <div :class="disable?'button-container-none':'button-container'" slot="trigger" :style="disableStyle?'background: rgba(225,225,225,0.2)':''">
            <div class="icon-panel">
                <div class="spIcon">
                    <icon name="daoru"></icon>
                </div>
            </div>
        </div>
    </el-upload>
</template>

<script>
import util from '../../libs/util';
export default {
    name: 'design-upload-button',
    props: {
        action: {
            type: String,
            default: '/input_rsl_line'
        },
        filename: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'road'
        },
        projectId: {
            type: Number,
            default: 0
        },
        planId: {
            type: Number,
            default: 0
        },
        accept: {
            type: String,
            default: ''
        },
        disable: {
            type: Boolean,
            default: false
        },
        disableStyle: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            uploadFilename: ''
        };
    },
    computed: {
        acceptTypes () {
            if (!this.accept) return [];
            let acceptstr = this.accept.toLowerCase();
            return acceptstr.split(',');
        }
    },
    methods: {
        uploadFile () {
            this.$refs.upload.submit();
        },
        httpRequest (option) {
            if (!option.file || option.file.size === 0 || !this.checkFileType(option.file.name)) {
                return;
            }
            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            data.append('project_id', this.projectId);
            data.append('scheme_id', this.planId);
            if (this.type === 'station') data.append('station_excel', option.file);
            if (this.type === 'road') data.append('file_obj', option.file);
            util.DaoluUrl.post(`${this.action}`, data, config)
                .then((res) => {
                    if (res.data.code === 1) {
                        // this.$message.success('上传成功');
                        if (this.type === 'station') {
                            this.$emit('stationImport');
                        }
                        if (this.type === 'road') {
                            this.$emit('roadImport');
                        }
                    } else {
                        this.$message.error('文件上传失败。');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        onChange (file, fileList) {
            if (fileList.length > 1) {
                fileList.splice(0, fileList.length - 1);
            }
            if (!this.checkFileType(file.name)) {
                this.$message({
                    message: '请选择' + this.accept + '格式的文件。',
                    type: 'warning'
                });
                return;
            }
            if (file.size === 0) {
                this.$message({
                    message: '不能上传空文件。',
                    type: 'warning'
                });
                return;
            }
            this.uploadFilename = file.name;
            this.$emit('file-selected', file.raw);
            console.log(file);
        },
        onSuccess (response, file, fileList) {
            console.log('onSuccess', response, file, fileList);
        },
        onError (err, file, fileList) {
            console.error('onError', err, file, fileList);
        },
        checkFileType (fileName) {
            if (!this.acceptTypes || this.acceptTypes.length === 0) return true;
            for (let i = 0; i < this.acceptTypes.length; i++) {
                if (fileName.toLowerCase().indexOf(this.acceptTypes[i]) === fileName.length - this.acceptTypes[i].length) {
                    return true;
                }
            }
            return false;
        }
    }
};
</script>
