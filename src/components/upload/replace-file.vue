<template>
    <div class="container" style="cursor: pointer">
        <slot></slot>
        <form id="replaceFile">
            <input type="file" name="file" accept="text/plain, .csv" ref="replaceFile" v-on:change="getFile"/>
        </form>
        <el-dialog
                title="提示"
                :visible.sync="ConfirmDialogVisible"
                width="470px"
                :modal="false"
                :close-on-click-modal="false"
                custom-class="upload-for-confirm">
            <div class="dialog-body-content">确认将{{totalText}}个POS文件上传？</div>
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
        name: 'replace-file',
        props: ['project_id', 'path' , 'name'],
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
            totalText () {
                let counter = 0;
                for (let i = 0; i < this.fileList.length; i++) {
                    if (this.fileList[i].type === 'text/plain') counter++;
                    if (this.fileList[i].type === '') counter++;
                }
                return counter;
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
            loaded () {
                Bus.$emit('speed', this.loaded/(new Date().getTime() - this.beginTime))
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
                    let result = await this.uploadFolder(this.fileList[0], (loaded)=>{
                        this.loaded = loaded
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
                for (let i in this.$refs.replaceFile.files) {
                    this.fileList.push(this.$refs.replaceFile.files[i])
                }
                this.fileList.pop();
                this.fileList.pop();
                // this.ConfirmDialogVisible = true;
                this.ConfirmUpload()
            },
            // 获取签名
            getSignature (path, file) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_signature', {
                        project_id: this.project_id,
                        path: '/UAV/input/'+path,
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
            uploadFile (file, path,callback, signature) {
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
                    data.append('key', this.project_id + '/UAV/input/' +path +'/'  + file.name);
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
                let message = await this.deleteFile(this.path, this.name);
                if(message==='ok'){
                    let  signature =  await this.getSignature(this.path, file);
                    return await this.uploadFile(file, this.path,callback, signature);
                }
                return {message: '删除错误'}
            },
            // 取消上传
            cancelAxios () {
                if(!this.source) return;
                this.source.cancel('这里你可以输出一些信息，可以在catch中拿到')
            },
            // 确认上传
            ConfirmUpload () {
                this.successCount = 0;
                Bus.$emit('uploadBegin',true);
                this.uploadCycle().then(result=>{
                    if (result) {
                        this.fileList = [];
                        // this.project_id= 95;
                        this.size= 1 ;
                        this.tmpPath= '';
                        this.progress= 0;
                        this.progressingCount= 0;
                        this.percentage= 100;
                        this.errorCount= 0;
                        this.totalCount= 1;
                        this.loaded= 0;
                        this.beginTime= 0;
                        Bus.$emit('uploadCompleted', true);
                    }
                }).catch(err=>{
                    console.log(err)
                });
                this.ConfirmDialogVisible = false;
            },
            ConfirmUploadCancel () {
                // this.ConfirmDialogVisible = false;
                // this.resetInput();
            },
            getPath(str) {
                return str.substring(str.indexOf('/')+4,str.length-1)
            },
            deleteFile (path, name) {
                return new Promise((resolve,reject)=>{
                    util.ajax.post('/s3_file_delete', {
                        project_id: this.project_id,
                        path: '/UAV/input/' + path + '/' + name
                    })
                        .then(res => {
                            resolve(res.data.message);
                        })
                        .catch(err => {
                            reject(err)
                        });
                });

            },
            resetInput () {
                document.getElementById("replaceFile")&&document.getElementById("replaceFile").reset();
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
    }
</style>
