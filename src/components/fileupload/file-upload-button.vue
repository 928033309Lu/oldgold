<style lang="less" scoped>
    .file-upload-button {
        display: inline-block;
        .trigger {
            height: 30px;
            border-radius: 4px;
            // border: solid 1px rgba(51,200,111,0.7);
            text-align: center;
            line-height: 30px;
            padding: 0;
            color: rgba(51,200,111,0.7);
            font-size: 14px;
            &:hover {
                color: rgba(51,200,111,1);
                // border: solid 1px rgba(51,200,111,1);
            }
        }
        .selectedFile{
            background:rgba(51,200,111,0.7);
            // border: 1px solid rgba(51, 200, 111, 0.5);
            color: #FFF;
            &:hover {
                color: rgba(255,255,2555,1);
                // border: solid 1px rgba(51,200,111,0.5);
            }
            /deep/ input{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .trigger{
            width: 140px;
        }
    }
    .trigger-readonly {
        border-radius: 4px;
        width: 120px;
        height: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 30px;
    }
    .triggerBox{
        padding: 0;
        /deep/ .el-input__inner{
            padding: 0 7px !important;
            border: 1px solid  rgba(51,200,111,0.7);
            color: rgba(51,200,111,0.7) !important;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: center;
            cursor: pointer !important;
        }
        /deep/ .el-input__inner::placeholder{
            color: rgba(51,200,111,0.7) !important;
        }
    }
</style>

<template>
    <el-upload  ref="upload"
               class="file-upload-button"
               :action="action"
               :show-file-list="false"
               :auto-upload="false"
               :http-request="httpRequest"
               :on-success="onSuccess"
               :on-error="onError"
               :on-change="onChange"
               accept=".tim"
               
    >
        <!-- <div slot="trigger" class="trigger" v-bind:class="{selectedFile: uploadFilename || filename}" style="overflow: hidden">{{displayLabel}}</div> -->
        <el-input class="trigger triggerBox" v-bind:class="{selectedFile: uploadFilename || filename}"
             v-model="displayLabel" placeholder="选择测风文件" readonly></el-input>
    </el-upload>
    <!--<el-button class="gf-button selectedFile" type="primary" v-else>-->
    <!--{{displayLabel}}-->
    <!--</el-button>-->
    <!-- <div v-else class="trigger-readonly">{{displayLabel}}</div> -->
</template>

<script>
    import util from '../../libs/util';
    export default {
        name: 'file-upload-button',
        props: {
            action: {
                type: String,
                default: '/upload'
            },
            label: {
                type: String,
                default: '选择测风文件'
            },
            selectedLabel: {
                type: String,
                default: '已选择测风文件'
            },
            filename: {
                type: String,
                default: null
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                uploadFilename: null
            };
        },
        watch: {
            filename () {
                this.uploadFilename = '';
            }
        },
        computed: {
            displayLabel: function () {
                if (this.filename) {
                    return this.filename;
                } else if (this.uploadFilename) {
                    return this.uploadFilename;
                } else {
                    // return this.label;
                    return "";
                }
            }
        },
        methods: {
            uploadFile () {
                this.$refs.upload.submit();
            },
            httpRequest (option) {
                console.log(option)
                const formData = new FormData();
                const file = option[option.filename];
                // console.log(file)
                //？？？
                // const fileList = option[option.fileList];
                // console.log(fileList)
                // fileList.forEach(function (file) {
                //     formData.append(option.filename, file, file.name);
                // })
                formData.append(option.filename, file, file.name);
                option.headers['Content-Type'] = 'multipart/form-data';
                const config = {
                    headers: option.headers,
                    onUploadProgress: function (e) {
                        if (e.total > 0) {
                            e.percent = e.loaded / e.total * 100;
                        }
                        option.onProgress(e);
                    }
                }
                util.ajax.post(option.action, formData, config).then((res) => {
                    option.onSuccess(res);
                }).catch(err => {
                    option.onError(err);
                });
            },
            onChange (file, fileList) {
                console.log(file, fileList)
                // check 文件名称
                if (/^.*[\u4e00-\u9fa5]+.*$/.test(file.name) || /^.*[\s]+.*$/.test(file.name)) {
                    this.$message.error('文件名中不能含有中文或空格。');
                    return;
                }
                // if (/^[^\s\u4e00-\u9fa5]{1,20}$/.test(file.name)) {
                //     this.$message.error('文件名中不能含有中文或空格，字符长度小于20');
                //     return;
                // }
                if (file.name.length <= 4 || String(file.name.substring(file.name.length - 4)).toLowerCase() !== '.tim') {
                    this.$message.error('只能上传.tim类型文件');
                    return;
                }
                const filename = file.name;
                const idx = filename.lastIndexOf('.');
                let ext = '';
                if (idx > -1) {
                    ext = filename.substring(idx + 1, filename.length);
                }
                if ((file.name.length - ext.length - 1) > 50) {
                    this.$message.error('文件名除去扩展名不得超过50个字符');
                    return;
                }

                if (fileList.length > 1) {
                    fileList.splice(0, fileList.length - 1);
                }
                this.uploadFilename = file.name;
                console.log(file,fileList)
                this.$emit('file-selected', file.raw);
                //传整个数组
                // this.$emit('file-selected', fileList);
            },
            onSuccess (response, file, fileList) {
                console.log('onSuccess', response, file, fileList);
            },
            onError (err, file, fileList) {
                console.log('onError', err, file, fileList);
            }
        }
    };
</script>
