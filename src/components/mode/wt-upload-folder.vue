<template>
    <div class="container">
        <slot></slot>
        <form id="wtUploadForm">
            <input type="file" title=" " name="file" webkitdirectory directory ref="file" v-on:change="getFile"/>
        </form>

        <el-dialog
                title="提示"
                :visible.sync="ConfirmDialogVisible"
                width="470px"
                :modal="false"
                :close-on-click-modal="false"
                custom-class="upload-for-confirm" style="height:400px;" :append-to-body="appendToBody">
            <div class="dialog-body-content">确认将{{totalDat}}个DAT文件上传？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="WtCancelUpload" class="cancelBtn">取 消</el-button>
                <el-button @click="ConfirmUpload" class="confirmBtn">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="提示"
                :visible.sync="lostFileVisible"
                width="470px"
                :modal="false"
                :close-on-click-modal="false"
                custom-class="upload-for-confirm" style="height:400px;"  :append-to-body="appendToBody">
            <div class="dialog-body-content">缺少DAT文件</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="lostFileVisible = false" class="confirmBtn">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import util from '@/libs/util';
    import axios from 'axios';
    import Bus from './bus';

    export default {
        name: 'wt-upload-folder',
        props: ['project_id'],
        data () {
            return {
                fileForm: [],
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
                uploadFolderProgressingCount: 0,
                successCount: 0,
                errorCount: 0,
                totalCount: 1,
                loaded: [],
                beginTime: 0,
                // source : axios.CancelToken,
                ConfirmDialogVisible: false,
                lostFileVisible: false,
                // cancelFun: null,
                source:null,
                appendToBody:true,
            };
        },
        computed: {
            // source () {
            //     return this.CancelToken.source();
            // },
            totalDat () {
                // TODO 需要计划出DAT文件数量。其他文件不处理
                let counter = 0;
                let size = [];
                for (let i = 0; i < this.fileList.length; i++) {
                    if (this.fileList[i].type === 'text/plain') counter++;
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
                return Math.round((this.loadedCount / this.sizeCounter) * 100);
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
                return (this.loadedCount/(new Date().getTime() - this.beginTime))
            },
            uploadFileCount(){
                return this.uploadFolderProgressingCount;
            }
        },
        watch: {
            percentage () {
                Bus.$emit('percentage', this.percentage)
            },
            uploadFileCount () {
                Bus.$emit('progressingCount', this.uploadFolderProgressingCount)
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
        },
        methods: {
            // 循环总函数
            async uploadCycle () {
                try {
                    this.beginTime = new Date().getTime();
                    this.uploadFolderProgressingCount = this.fileList.length;
                    this.totalCount = this.fileList.length;
                    let result;
                    Bus.$emit('progressingCount', this.uploadFolderProgressingCount);
                    for (let [index, file] of this.fileList.entries()) {
                        let fileName = file.name;
                        Bus.$emit('progressingFile',fileName);
                        result = await this.uploadFolder(file, (loaded, total)=>{
                            this.loaded.splice(index, 1, loaded);
                            this.size.splice(index, 1, total);
                        });

                        if(result === 204){
                            ++this.successCount;
                        }else{
                            ++this.errorCount;
                        }
                        --this.uploadFolderProgressingCount;
                    }
                    return true
                }
                catch(err){
                    console.log(err)
                }

            },

            getFile () {
                this.fileList = [];
                for (let i in this.$refs.file.files) {
                    // console.log("扩展名："+this.$refs.file.files[i].name.split('.').splice(-1));
                    if(this.$refs.file.files[i].name){
                        var fileExt = this.$refs.file.files[i].name.split('.').splice(-1);
                        if(fileExt == 'dat'){
                            this.fileList.push(this.$refs.file.files[i])
                        }
                    }
                }

                if(this.totalDat<1){
                    this.lostFileVisible = true;
                }else{
                    this.ConfirmDialogVisible = true;
                }

                this.$refs.file.value = null;
            },
            fillPath (path) {
                if(path && path.length !== 0){
                    return '/' + path;
                }
                return path;
            },
            // 获取签名
            getSignature (path, file) {
                path = this.fillPath(path); 
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_signature', {
                        project_id: this.project_id,
                        path: '/Scheme_WT/'+this.project_id+'/cfd/mesh-and-simulate' + path + '/RUN/C1'+path,
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
                path = this.fillPath(path); 
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
                                this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                callback(progressEvent.loaded, progressEvent.total)
                            }
                        },
                        cancelToken: this.source.token
                        // cancelToken: new CancelToken(function executor(c){
                        //     //这个executor 函数接受一个cancel function作为参数
                        //     this.cancelFun = c;
                        // })
                    };
                    data.append('key', this.project_id + '/Scheme_WT/'+this.project_id+'/cfd/mesh-and-simulate'+path+'/RUN/C1' + path + '/FINE/' + file.name);
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


                    axios.post(util.S3Path, data, config).then((response)=>{
                        resolve(response.status);
                    }).catch((err) => {
                        if (axios.isCancel(err)) {
                            console.log('Request canceled', err.message);
                            // this.source.token = null;
                            // this.CancelToken = axios.CancelToken;
                        } else {
                            reject(err)
                        }
                    });


                });

            },

            // 获取签名+上传文件
            async uploadFolder (file, callback) {
                let path = file.webkitRelativePath.split('/');
                let pathStr = "";
                   for (let i = 1; i < path.length-1; i++) {
                       pathStr += path[i] + "/";
                   }
                pathStr = pathStr.substring(0, pathStr.length-1);
                let  signature =  await this.getSignature(pathStr, file);
                return await this.uploadFile(file, pathStr, callback, signature);
            },
            // 取消上传
            cancelAxios () {
                if(!this.source) return;
                this.source.cancel('取消上传');
            },
            WtCancelUpload () {
                this.ConfirmDialogVisible = false;
                document.getElementById("wtUploadForm")&&document.getElementById("wtUploadForm").reset();
            },
            // 确认上传
            ConfirmUpload () {
                this.successCount = 0;
                this.uploadFolderProgressingCount = 0;
                //Bus.$emit('uploadBegin', true);
                this.$emit('uploadCompleted', false);
                this.uploadCycle().then(result=>{
                    if (result) {
                        this.fileList = [];
                        // this.project_id= 95;
                        this.size= ['1'];
                        this.tmpPath= '';
                        this.progress= 0;
                        this.uploadFolderProgressingCount= 0;
                        // this.successCount= 0;
                        this.errorCount= 0;
                        this.totalCount= 1;
                        this.loaded= [];
                        this.beginTime= 0;
                        Bus.$emit('uploadCompleted', true);
                        this.$emit('uploadCompleted', true);
                    }
                }).catch(err=>{
                    console.log(err)
                });
                this.ConfirmDialogVisible = false;
            }
        },
        created () {
            console.log(this.project_id);
            Bus.$on('cancelAxios', (cancel1) => {
                this.cancelAxios();

                // this.cancelFun ();
            });
            Bus.$on('uploadClose', (status) => {
                if(status) this.$emit('uploadCompleted', true)
            })
            // Bus.$on('uploadCompleted', (status)=>{
            //     this.uploadFolderProgressingCount = 0;
            // })
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

    .jisuan .el-dialog {
        height: 90%!important;
    }
</style>
