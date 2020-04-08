<template>
    <div class="container">
        <slot></slot>
        <form id="UploadTerrain" >
            <input type="file" style="cursor:pointer;" name="file" ref="file" v-on:change="getFile"/>
        </form>
        <el-dialog
                title="提示"
                :visible.sync="ConfirmDialogVisible"
                width="470px"
                :modal="false"
                :close-on-click-modal="false"
                custom-class="upload-for-confirm">
            <div class="dialog-body-content">确认将{{totalPictures}}个文件上传？</div>
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
    export default {
        name: 'upload-terrain',
        props: ['project_id', 'path', 'name' ,"isdisabled" ,"terrain_id"],
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
            speed () {
                return (this.loaded/(new Date().getTime() - this.beginTime))
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
                Bus.$emit('speed', (this.loaded/(new Date().getTime() - this.beginTime)*1000))
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
                    Bus.$emit('progressingFile',this.fileList[0].name);
                    let result;
                    result = await this.uploadFile(this.fileList[0],(loaded)=>{
                        this.loaded = loaded;
                    });
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
                const file = this.$refs.file.files[0];
                const filename = file.name;
                const idx = filename.lastIndexOf('.');
                let ext = '';
                if (idx > -1) {
                    ext = filename.substring(idx + 1, filename.length);
                }
                if (ext !== 'map' && ext !== 'tif' && ext !== 'MAP' && ext !== 'TIF') {
                    this.resetInput();
                    this.$message.error('请选择扩展名为.map或.tif的文件');
                    return;
                }
                // if (ext !== 'tif') {
                //     this.resetInput();
                //     this.$message.error('请选择扩展名为.tif的文件。');
                //     return;
                // }
                if (/^.*[\u4e00-\u9fa5]+.*$/.test(filename) || /^.*[\s]+.*$/.test(filename)) {
                    this.resetInput();
                    this.$message.error('文件名中不能含有中文或空格。');
                    return;
                }
                if (filename.length > 50) {
                    this.resetInput();
                    this.$message.error('文件名长度不能超过50个字符。');
                    return;
                }

                // this.fileList.push(this.$refs.file.files[0]);
                this.fileList=[this.$refs.file.files[0]];
                this.ConfirmUpload();
            },
            // 上传文件
            uploadFile (file,callback) {
                return new Promise ((resolve,reject)=>{
                    let data = new FormData();

                    let cancelToken = axios.CancelToken;//Axios使我修改axios原型链了。
                    this.source = cancelToken.source();

                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        timeout: 900000000000000,
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.lengthComputable) {
                                this.percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                callback(progressEvent.loaded)
                            }
                        },
                        cancelToken: this.source.token
                    };
                    data.append('terrain_file', file);
                    if(this.terrain_id){
                        data.append('terrain_id', this.terrain_id);
                    }
                    util.ajax.post(`/input_terrain/${this.project_id}`,data, config).then((res) => {
                        console.log(res,"上传地形接口");
                        (res.data.code === 200 || res.data.code === 201)?resolve(res.data.message):reject(res.data.message)
                    }).catch((err) => {
                        if (axios.isCancel(err)) {
                            console.log('Request canceled', err.message);
                            this.resetInput()
                        } else {
                            reject(err);
                            this.$message.error('上传地形文件失败！');
                            this.$emit("uploadErr");
                        }
                    });
                });

            },
            // 取消上传
            cancelAxios () {
                if(this.source) {
                    this.source.cancel('这里你可以输出一些信息，可以在catch中拿到');
                }
                this.$emit("uploadErr");
            },
            // 确认上传
            ConfirmUpload () {
                this.successCount= 0;
                Bus.$emit('uploadBegin',true);
                this.$emit('uploadBegin');
                this.uploadCycle().then(result=>{
                    console.log(result);
                    if (result) {
                        this.$emit('uploadCompleted', this.fileList[0]);
                        this.fileList = [];
                        this.size= 1 ;
                        this.tmpPath= '';
                        this.progress= 0;
                        this.progressingCount= 0;
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
                this.fileList = [];
            },
            resetInput () {
                document.getElementById("UploadTerrain")&&document.getElementById("UploadTerrain").reset();
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
    #UploadTerrain input{
        width: 100%!important;;
    }
</style>
