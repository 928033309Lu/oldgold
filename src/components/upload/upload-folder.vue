<template>
    <div class="container">
        <slot></slot>
        <form id="UploadForm">
            <input type="file" name="file" style="cursor:pointer;" webkitdirectory directory ref="file" v-on:change="getFile"/>
        </form>
        <el-dialog
                title="提示"
                :visible.sync="ConfirmDialogVisible"
                width="470px"
                :modal="false"
                :close-on-click-modal="false"
                custom-class="upload-for-confirm">
            <div class="dialog-body-content">确认将{{totalPictures}}个JPG文件，以及{{totalText}}个Pos文件上传？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ConfirmUploadCancel" class="cancelBtn" style="width: 34%;">取 消</el-button>
                <el-button @click="ConfirmUpload" class="confirmBtn" style="width: 34%;">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="提示"
                :visible.sync="lostFileVisible"
                width="470px"
                :modal="false"
                :close-on-click-modal="false"
                custom-class="upload-for-confirm">
            <div class="dialog-body-content">缺少POS文件</div>
            <span slot="footer" class="dialog-footer" style="text-align: center">
                <el-button @click="lostConfirm" class="confirmBtn" style="width: 34%;">确 定</el-button>
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
        name: 'upload-folder',
        props: ['project_id'],
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
                loaded: [],
                beginTime: 0,
                CancelToken : axios.CancelToken,
                ConfirmDialogVisible: false,
                lostFileVisible: false
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
                let size = [];
                for (let i = 0; i < this.fileList.length; i++) {
                    if (this.fileList[i].type === 'text/plain') counter++;
                    if (this.fileList[i].type === 'text/csv') counter++;
                    if (this.fileList[i].type === '') counter++;
                    size.push(this.fileList[i].size);
                }
                this.size = size;
                return counter;
            },
            sizeCounter () {
                return eval(this.size.join("+"))
            },
            percentage () {
                return Math.round(((this.successCount + this.errorCount) / (this.totalText + this.totalPictures)) * 100);
            },
            // 已上传字节数
            loadedCount () {
                let counter= 0;
                  this.loaded.forEach(value => {
                      counter += value
                  });
                return counter
            },
            speed () {
                return (this.loadedCount/((new Date().getTime() - this.beginTime)/1000))
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
            loadedCount (value) {
                Bus.$emit('speed', (value/((new Date().getTime() - this.beginTime)/1000)));
            },
            // speed () {
            //     console.log(this.loadedCount);
            //     Bus.$emit('speed', (this.loadedCount/(new Date().getTime() - this.beginTime)))
            // }
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
                    for (let [index, file] of this.fileList.entries()) {
                        result = await this.uploadFolder(file, (loaded, total)=>{
                            this.loaded.splice(index, 1, loaded);
                            this.size.splice(index, 1, total);
                        });
                        Bus.$emit('progressingFile',file.name);
                        if(result === 204){
                            ++this.successCount;
                        }else{
                            ++this.errorCount;
                        }
                        --this.progressingCount;
                    }
                    return true
                }
                catch(err){
                    console.error('文件夹循环总函数错误信息：');
                    console.error(err)
                }

            },
            getFile () {
                this.fileList = [];
                for (let i in this.$refs.file.files) {
                    this.fileList.push(this.$refs.file.files[i])
                }
                this.fileList.pop();
                this.fileList.pop();
                if(this.totalText<1){
                    this.lostFileVisible = true;
                }else{
                    this.ConfirmDialogVisible = true;
                }
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
                                console.error(`获取签名出错${file}`);
                                resolve(false);
                            }

                        })
                        .catch(err=>{
                            console.error('发送签名请求出错：');
                            console.error(err);
                            resolve(false);
                        });
                });

            },
            // 上传文件
            uploadFile (file, path, callback, signature) {
                return new Promise ((resolve,reject)=>{
                    if(!signature) resolve(500);
                    let data = new FormData();

                    let cancelToken = axios.CancelToken;//Axios使我修改axios原型链了。
                    this.source = cancelToken.source();


                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.lengthComputable) {
                                this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                callback(progressEvent.loaded, progressEvent.total)
                            }
                        },
                        cancelToken: this.source.token
                    };
                    data.append('key', this.project_id + '/UAV/input/' + path + '/' + file.name);
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
                                console.log('取消上传，原因：', err.message);
                                this.resetInput()
                            } else {
                                console.error('上传文件请求出错');
                                console.error(err);
                                resolve(500)
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
                return await this.uploadFile(file, pathStr, callback, signature);
            },
            // 取消上传
            cancelAxios () {
                if (this.source&&this.source.token) this.source.cancel('在上传过程中取消上传')
            },
            // 确认上传
            ConfirmUpload () {
                this.successCount = 0;
                Bus.$emit('uploadBegin', true);
                this.$emit('uploadCompleted', false);
                this.uploadCycle().then(result=>{
                    if (result) {
                        this.fileList = [];
                        // this.project_id= 95;
                        this.size= ['1'];
                        this.tmpPath= '';
                        this.progress= 0;
                        this.progressingCount= 0;
                        // this.successCount= 0;
                        // this.errorCount= 0;
                        this.totalCount= 1;
                        this.loaded= [];
                        this.beginTime= 0;
                        Bus.$emit('uploadCompleted', true);
                        this.$emit('uploadCompleted', true);
                        this.resetInput();
                    }
                }).catch(err=>{
                    console.log(err)
                });
                this.ConfirmDialogVisible = false;
            },
            ConfirmUploadCancel () {
                this.ConfirmDialogVisible = false;
                this.resetInput();
            },
            resetInput () {
                document.getElementById("UploadForm")&&document.getElementById("UploadForm").reset();
            },
            lostConfirm () {
                this.lostFileVisible = false;
                this.resetInput();
            }
        },
        created () {
            Bus.$on('cancelAxios', (cancel) => {
                this.cancelAxios()
            });
            Bus.$on('uploadClose', (status) => {
                if(status) this.$emit('uploadCompleted', true)
            })

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
