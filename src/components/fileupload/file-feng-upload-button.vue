<style lang="less" scoped>
    .file-upload-button {
        display: inline-block;
        .trigger {
            box-sizing: border-box;
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
            input{
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
     <el-upload
        class="upload-feng file-upload-button"
        :action="action"
        :before-upload="beforeUpload"
        :http-request="httpRequestFeng"
        :show-file-list="false" 
        accept=".txt">
            <!-- <div class="trigger trigger-readonly" v-bind:class="{selectedFile: uploadFilename || filename}"> {{ displayLabel }}</div> -->
            <el-input class="trigger triggerBox" v-bind:class="{selectedFile: uploadFilename || filename}"
             v-model="filename" placeholder="选择风数据文件" readonly></el-input>
    </el-upload>
</template>

<script>
    import util from '../../libs/util';
    export default {
        name: 'file-feng-upload-button',
        props: {
            project:{

            },
            action: {
                type: String,
                default: '/gallery'
            },
            
            filename: {
                type: String,
                default: null
            },
            
        },
        data () {
            return {
                uploadFilename : null,
                fengList:{
                    data:[]
                },
                waitingLoading: false
            };
        },
        watch: {
            waitingLoading () {
                this.$store.commit('globeLoading', {loading: this.waitingLoading, text: '正在上传数据文件，请稍后...'});
            },
        },
        computed: {
            // displayLabel: function () {
            //     if (this.filename) {
            //         return this.filename;
            //     } else if (this.uploadFilename) {
            //         return this.uploadFilename;
            //     } else {
            //         // return "选择风数据文件";
            //         return "";
            //     }
            // }
        },
        methods: {
            beforeUpload(file){
                let fileName = file.name;
                let arr = fileName.split(".");
                let str = arr[arr.length-1];
                if(str != "txt" && str != "TXT"){
                    this.$message.error("请选择后缀为.txt的文件！");
                    return false;
                }
                // check  中文及空格
                if (/^.*[\u4e00-\u9fa5]+.*$/.test(file.name) || /^.*[\s]+.*$/.test(file.name)) {
                    this.$message.error('文件名中不能含有中文或空格。');
                    return false;
                }
                let idx = fileName.lastIndexOf('.');
                let ext = '';
                if (idx > -1) {
                    ext = fileName.substring(idx + 1, fileName.length);
                }
                if ((file.name.length - ext.length - 1) > 50) {
                    this.$message.error('文件名除去扩展名不得超过50个字符');
                    return false;
                }
            },
             //上传风数据
            httpRequestFeng(option){
                const formData = new FormData();
                const file = option.file;
                this.waitingLoading = true;
                formData.append("filename_txt", file);
                
                option.headers['Content-Type'] = 'multipart/form-data';
                option.headers['Accept'] = '*/*';
                const config = {
                    headers: option.headers,
                    timeout: 3600000
                   
                };
                util.ajax.post("/gallery/"+ this.project, formData, config).then((res) => {
                    // console.log(res.data.data);
                    if(res.data.code == 200){
                        
                        this.fengList.data = res.data.data;
                        // this.uploadFilename = file.name;
                        let obj = {};
                        // obj.name = this.uploadFilename;
                        obj.name = file.name;
                        obj.data = this.fengList.data;
                        obj.file_txt = file;
                        this.$emit('file-selected', obj);
                        this.waitingLoading = false;
                    }else{
                        this.waitingLoading = false;
                        this.$message.error(res.data.message);
                    }
                   
                }).catch(err => {
                    console.log(err);
                    this.$message.error("上传风数据文件失败！");
                    this.waitingLoading = false;
                });
            }
           
        }
    };
</script>
