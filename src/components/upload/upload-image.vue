<template>
    <div class="container" style="cursor: pointer;overflow: hidden">
        <slot></slot>
        <form id="UploadFile">
            <input type="file" name="file" accept="image/gif, image/jpeg" ref="file" v-on:change="getFile"/>
        </form>
        <el-dialog
                title="提示"
                :visible.sync="ConfirmDialogVisible"
                width="470px"
                :modal="false"
                :close-on-click-modal="false"
                custom-class="upload-for-confirm">
            <div class="dialog-body-content">确认将{{totalPictures}}个JPG文件上传？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ConfirmUploadCancel" class="cancelBtn">取 消</el-button>
                <el-button @click="ConfirmUpload" class="confirmBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import axios from 'axios';
    import Bus from './bus';
    const userUploadAtt = (File, config) => axios.post(util.S3Path, File, config);
    export default {
        name: 'upload-image',
        props: ['project_id', 'path', 'name'],
        data () {
            return {
                formData: {
                    key: '',
                    acl: 'public-read',
                    successActionRedirect: '',
                    ContentType: 'image/jpeg',
                    xAmzMetaUuid: '',
                    XAmzCredential: '',
                    XAmzAlgorithm: '',
                    XAmzDate: '',
                    xAmzMetaTag: '',
                    Policy: '',
                    XAmzSignature: '',
                    action: ''
                },
                fileList: [],
                size: ['1'],
                tmpPath: '',
                progress: 0,
                progressingCount: 0,
                successCount: 0,
                errorCount: 0,
                totalCount: 1,
                loaded: 0,
                beginTime: 0,
                CancelToken : axios.CancelToken,
                ConfirmDialogVisible: false,
                percentage: 0
            };
        },
        computed: {
            // source () {
            //     return this.CancelToken.source();
            // },
            totalPictures () {
                return this.fileList.length - this.totalText;
            },
            totalText () {
                let counter = 0;
                let size = 0;
                for (let i = 0; i < this.fileList.length; i++) {
                    size += this.fileList[i].size;
                }
                this.size = size;
                return counter;
            },
            // sizeCounter () {
            //     return eval(this.size.join("+"))
            // },
            // percentage () {
            //     return Math.round((this.loadedCount / this.sizeCounter) * 100);
            // },
            // 已上传字节数
            // loadedCount () {
            //     let counter= 0;
            //       this.loaded.forEach(value => {
            //           counter += value
            //       });
            //     return counter
            // },
            speed () {
                return (this.loaded/(new Date().getTime() - this.beginTime)*1000)
            }
        },
        watch: {
            percentage () {
                Bus.$emit('percentage', this.percentage)
            },
            progressingCount () {
                Bus.$emit('progressingCount', this.progressingCount)
            },
            successCount () {
                Bus.$emit('successCount', this.successCount)
            },
            errorCount () {
                Bus.$emit('errorCount', this.errorCount)
            },
            speed () {
                Bus.$emit('speed', (this.loaded/(new Date().getTime() - this.beginTime)))
            }
        },
        methods: {
            // todo 错误处理
            // 循环总函数
            async uploadCycle () {
                try {
                    this.beginTime = new Date().getTime();
                    this.progressingCount = this.fileList.length;
                    this.totalCount = this.fileList.length;
                    let result;
                    result = await this.uploadFolder(this.fileList[0],(loaded)=>{
                        this.loaded = loaded;
                    });
                    Bus.$emit('progressingFile',this.fileList[0].name);
                    if(result === 204){
                        ++this.successCount;
                    }else{
                        ++this.errorCount;
                    }
                    --this.progressingCount;
                    return true
                }
                catch(err){
                    console.log(err)
                }

            },
            getFile () {
                this.fileList = [];
                for (let i in this.$refs.file.files) {
                    this.fileList.push(this.$refs.file.files[i])
                }
                this.fileList.pop();
                this.fileList.pop();
                this.ConfirmDialogVisible = true;
            },
            // 获取签名
            getSignature (path, file) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_signature', {
                        project_id: this.project_id,
                        path: '/UAV'+this.getPath(this.path),
                        success_redirect: this.formData.successActionRedirect,
                        content_type: file.type,
                        tag: ''
                    })
                        .then(res => {
                            if (res.data.code === 200) {
                                resolve(res.data.data);
                            }else{
                                reject()
                            }

                        })
                        .catch(err=>{
                            reject(err)
                        });
                });

            },
            // 上传文件
            uploadFile (file, path, callback, signature) {
                return new Promise ((resolve,reject)=>{
                    let data = new FormData();

                    let cancelToken = axios.CancelToken;//Axios使我修改axios原型链了。
                    this.source = cancelToken.source();

                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.lengthComputable) {
                                this.percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                callback(progressEvent.loaded)
                            }
                        },
                        cancelToken: this.source.token
                    };
                    data.append('key', this.project_id + '/UAV' +this.getPath(this.path) +'/'  + file.name);
                    data.append('acl', signature['acl']);
                    data.append('success_action_redirect', '');
                    data.append('Content-Type', signature['Content-Type']);
                    data.append('x-amz-meta-uuid', signature['x-amz-meta-uuid']);
                    data.append('X-Amz-Credential', signature['X-Amz-Credential']);
                    data.append('X-Amz-Algorithm', signature['X-Amz-Algorithm']);
                    data.append('X-Amz-Date', signature['X-Amz-Date']);
                    data.append('x-amz-meta-tag', signature['x-amz-meta-tag']);
                    data.append('Policy', signature['Policy']);
                    data.append('X-Amz-Signature', signature['X-Amz-Signature']);
                    data.append('file', file);
                    userUploadAtt(data, config)
                        .then((response)=>{
                        resolve(response.status);
                    })
                        .catch((err) => {
                            if (axios.isCancel(err)) {
                                console.log('Request canceled', err.message);
                                this.resetInput();
                            } else {
                                reject(err)
                            }
                    })
                });

            },

            // 获取签名+上传文件
            async uploadFolder (file, callback) {
                let path = file.webkitRelativePath.split('/');
                let pathStr = "";
                   for (let i = 0; i < path.length-1; i++) {
                       pathStr += path[i] + "/";
                   }
                pathStr = pathStr.substring(0, pathStr.length-1);
                let  signature =  await this.getSignature(pathStr, file);
                return await this.uploadFile(file, pathStr,callback, signature);
            },
            // 取消上传
            cancelAxios () {
                if(!this.source) return;
                this.source.cancel('这里你可以输出一些信息，可以在catch中拿到')
            },
            // 确认上传
            ConfirmUpload () {
                this.successCount= 0;
                Bus.$emit('uploadBegin',true);
                this.uploadCycle().then(result=>{
                    if (result) {
                        this.fileList = [];
                        // this.project_id= 95;
                        this.size= 1 ;
                        this.tmpPath= '';
                        this.progress= 0;
                        this.progressingCount= 0;
                        // this.successCount= 0;
                        this.errorCount= 0;
                        this.totalCount= 1;
                        this.loaded= 0;
                        this.beginTime= 0;
                        Bus.$emit('uploadCompleted', true);
                        this.resetInput();
                    }
                }).catch(err=>console.log(err));
                this.ConfirmDialogVisible = false;
            },
            ConfirmUploadCancel () {
                this.ConfirmDialogVisible = false;
                this.resetInput();
            },
            getPath(str) {
                return str.substring(str.indexOf('/')+4,str.length-1)
            },
            resetInput () {
                document.getElementById("UploadFile")&&document.getElementById("UploadFile").reset();
            },
        },
        created () {
            Bus.$on('cancelAxios', (cancel) => {
                this.cancelAxios()
            });
        }
    };
</script>

<style scoped>
    .container{
        position: relative;
    }
    input{
        position: absolute !important;
        top: 0!important;
        left: 0!important;
        opacity: 0!important;
        width: 30px !important;
    }
</style>
