<style lang="less" scoped>
    .file-uploader__container {
        display: inline-flex;
        flex-direction: column;
        align-items: stretch;

        .cell-upload {
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
        .trigger {
            height: 40px;
            border-radius: 4px;
            border: solid 1px #33C86F;
            opacity: 0.7;
            text-align: left;
            &:hover {
                opacity: 1;
            }
        }
        .trigger-readonly {
            height: 40px;
            border-radius: 4px;
            border: solid 1px #33C86F;
            opacity: 0.7;
            text-align: left;
        }
        .tip {
            padding-left: 12px;
            line-height: 40px;
            color: #D4EFF6;
            font-size: 14px;
        }
        .tip.complete {
            color: #33C86F;
        }
        .file-bar {
            display: flex;
            flex-direction: row;
            line-height: 26px;

            .filename {
                flex: auto;
                font-size: 14px;
                color: #D4EFF6;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .progress-text {
                font-size: 14px;
                color: #32BF6B;
                padding-right: 6px;
            }
        }
        .progress {
            margin-top: -5px;
        }
        div {
            margin-bottom: 0 !important;
        }
    }
</style>
<style lang="less">
    .file-uploader__container {
        .el-progress-bar__outer {
            background: transparent;
        }
        .el-progress-bar__inner {
            background: #33C86F;
            opacity: 0.8;
        }
    }
</style>

<template>
    <div class="file-uploader__container">
        <el-upload ref="upload"
                   v-if="!readonly"
                   class="cell-upload"
                   :action="action"
                   :show-file-list="false"
                   :auto-upload="false"
                   :http-request="httpRequest"
                   :on-progress="onProgress"
                   :on-success="onSuccess"
                   :on-error="onError"
                   :on-change="onChange"
                   :limit="2"
                   :accept="accept"
                   :name="name"
        >
            <div slot="trigger" class="trigger">
                <span class="tip" :class="{complete: progress >= 100}">{{tip}}</span>
                <el-progress class="progress" :percentage="progress" :stroke-width="5" :show-text="false"/>
            </div>
        </el-upload>
        <div v-else class="trigger-readonly">
            <span class="tip" :class="{complete: progress >= 100}">{{tip}}</span>
            <el-progress class="progress" :percentage="progress" :stroke-width="5" :show-text="false"/>
        </div>
        <div class="file-bar">
            <div class="filename" :title="displayFilename">{{displayFilename}}</div>
            <div class="progress-text">{{displayFilename ? progress + '%' : ''}}</div>
        </div>
    </div>
</template>

<script>
    import util from '../../libs/util';
    export default {
        name: 'file-uploader',
        props: {
            action: {
                type: String,
                require: true
            },
            tip: {
                type: String,
                default: ''
            },
            status: { // complete, uploading, unset
                type: String,
                default: 'unset'
            },
            readonly: {
                type: Boolean,
                default: false
            },
            filename: {
                type: String,
                default: ''
            },
            accept: String,
            name: {
                type: String,
                default: 'file'
            }
        },
        data () {
            return {
                progress: 0,
                uploadFilename: '',
                uploadPromiseResolve: null,
                uploadPromiseReject: null
            };
        },
        computed: {
            displayFilename: function () {
                return (this.uploadFilename ? this.uploadFilename : this.filename);
            }
        },
        watch: {
            status: function (val) {
                if (val === 'complete') {
                    this.progress = 100;
                } else if (val === 'unset') {
                    this.progress = 0;
                }
            },
            filename: function (val) {
                this.uploadFilename = null;
            }
        },
        mounted () {
            if (this.status === 'complete') {
                this.progress = 100;
            }
        },
        methods: {
            uploadFile () {
                return new Promise((resolve, reject) => {
                    this.uploadPromiseResolve = resolve;
                    this.uploadPromiseReject = reject;
                    if (this.uploadFilename) {
                        this.$refs.upload.submit();
                    } else {
                        resolve();
                    }
                });
            },
            httpRequest (option) {
                const formData = new FormData();
                const file = option.file;
                formData.append(option.filename, file, file.name);
                option.headers['Content-Type'] = 'multipart/form-data';
                option.headers['Accept'] = '*/*';
                const config = {
                    headers: option.headers,
                    timeout: 3600000,
                    onUploadProgress: function (e) {
                        if (e.total > 0) {
                            e.percent = e.loaded / e.total * 100;
                        }
                        option.onProgress(e);
                    }
                };
                util.ajax.post(option.action, formData, config).then((res) => {
                    option.onSuccess(res);
                }).catch(err => {
                    option.onError(err);
                });
            },
            onChange (file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, fileList.length - 1);
                }
                if (file.status !== 'success') {
                    this.uploadFilename = file.name;
                    if (file.percentage) {
                        this.progress = parseInt(file.percentage.toFixed(0));
                    } else {
                        this.progress = 0;
                    }
                }
            },
            onProgress (event, file, fileList) {
                this.$emit('update:status', 'uploading');
                if (event.percent || event.percent === 0) {
                    this.progress = parseInt(event.percent.toFixed(0));
                }
            },
            onSuccess (response, file, fileList) {
                this.$emit('update:status', 'complete');
                this.$emit('update:filename', this.uploadFilename);
                this.uploadFilename = '';
                this.uploadPromiseResolve(response, file, fileList);
            },
            onError (err, file, fileList) {
                this.uploadPromiseReject(err, file, fileList);
            }
        }
    };
</script>
