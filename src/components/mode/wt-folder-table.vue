<template>
    <div>
        <el-table class="gf-table expand-table need-border" :data="fileForm"
                              :show-header="false"
                              @cell-mouse-enter="cellMouseEnterHandle"
                              @cell-mouse-leave="cellMouseLeaveHandle"
                              ref="innerTabler"
                              style="top:11px"
                              height="150"
                              v-loading="rootLoading"
                              v-if="fileForm.length>0">
            <el-table-column width="50px">
                <template slot-scope="scope">
                    <div class="green" style="text-align: center;">
                                    <span class="icon icon-plus">
                                        <icon name="wenjianjia"></icon>
                                    </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="80px">
                <template slot-scope="scope">
                    <div class="green">{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="size" width="80px"></el-table-column>
            <el-table-column prop="fileName" minWidth="200px"></el-table-column>
            <el-table-column min-width="35px">
                <template slot-scope="scope">
                    <div v-if="scope.row.delete"  @click="deleteFileHandle(scope.row)" class="green" style="cursor: pointer">
                        <icon name="wechaticon13"></icon>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!--删除根文件夹-->
        <el-dialog
                title="提示"
                :visible.sync="deleteFolderVisible"
                width="470px"
                :modal="false"
                :close-on-click-modal="false"
                custom-class="upload-for-confirm" style="height:350px;"  :append-to-body="appendToBody">
            <div class="dialog-body-content">确认删除--{{deleteFolderRow.name}}？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteFolderVisible = false" class="gf-button cancelBtn">取 消</el-button>
                <el-button @click="ConfirmDeleteFolder" class="confirmBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import Bus from './bus'
    export default {
        name: "wt-folder-table" ,
        props: ['project_id'],
        data () {
            return {
                fileForm: [],
                deleteFolderVisible: false,
                rootLoading: true,
                deleteFolderRow: {},
                appendToBody: true,
            }
        },
        methods: {


            cellMouseEnterHandle (row) {
                row["delete"] = true;
            },
            cellMouseLeaveHandle (row) {
                row["delete"] = false;
            },
            deleteFileHandle (row) {
                //TODO 删除操作
                this.deleteFolderVisible = true;
                this.deleteFolderRow = row;
            },
            ConfirmDeleteFolder () {
                this.deleteFolderVisible = false;
                util.ajax.post('/s3_folder_delete', {
                    project_id: this.project_id,
                    path: '/Scheme_WT/'+this.project_id+'/cfd/mesh-and-simulate/'+this.deleteFolderRow.name
                })
                    .then(res => {
                        if(res.data.message === 'ok') this.request();
                        this.deleteFolderRow = {};
                    })
                    .catch(err => console.log(err));
            },

            // 获取文件夹列表，输入路径，返回包括size和number的folder_list
            async getRootFolderFull (path) {
                // let sectionPath = await this.getSectionPath();
                let folderForm = await this.getRootFolder();


                if(folderForm.length === 0) return folderForm;
                for(let i in folderForm){
                    // let subFolderForm = await this.getSubFolder(folderForm[i].name);
                    // console.log(subFolderForm.length);

                    // folderForm[i].number = await this.getFolderCount(folderForm[i].name);
                    folderForm[i].subfolder = await this.getFile(folderForm[i].name,1);
                    if(folderForm[i].subfolder && folderForm[i].subfolder.length > 0){
                        folderForm[i].size = folderForm[i].subfolder[0].size;
                        folderForm[i].fileName = folderForm[i].subfolder[0].name;
                    }
                }
                return folderForm
            },

            // s3查询根目录文件夹
            getRootFolder ( path ) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_folder', {
                        project_id: this.project_id,
                        path: '/Scheme_WT/'+this.project_id +'/cfd/mesh-and-simulate' //+path+'/RUN/C1/' + path
                    })
                        .then(res => {
                            let arr = [];
                            if(res.data.data.folder_list === null) resolve([]);
                            res.data.data.folder_list.forEach((value, index) => {
                                let name = value.Prefix.split('/');
                                arr.push({
                                    name: name[name.length-2],
                                    Prefix: value.Prefix,
                                    index: index,
                                    delete: false,
                                    expand: {
                                        folder: [],
                                        txt: []
                                    },
                                    loading: true
                                });
                            });
                            // this.fileForm = arr;
                            resolve(arr);
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            },

            // s3查询子目录文件夹
            getSubFolder ( path ) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_folder', {
                        project_id: this.project_id,
                        path: '/Scheme_WT/'+this.project_id+'/cfd/mesh-and-simulate/'+path+'/RUN/C1/' + path+'/FINE'
                    })
                        .then(res => {
                            let arr = [];
                            res.data.data.folder_list.forEach((value, index) => {
                                let name = value.Prefix.split('/');
                                arr.push({
                                    name: name[name.length-2],
                                    Prefix: value.Prefix,
                                    index: index,
                                    expand: [],
                                    currentPage: 1,
                                    loading: true
                                });
                            });
                            // this.fileForm = arr;
                            resolve(arr);
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            },
            // s3显示文件数量
            getFolderCount (folderPath) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_filecount', {
                        project_id: this.project_id,
                        path: '/Scheme_WT/'+this.project_id+'/cfd/mesh-and-simulate/'+folderPath+'/RUN/C1/' + folderPath+'/FINE'
                    })
                        .then(res => {
                            resolve(res.data.data.file_count);
                        })
                        .catch(err => {
                            reject(err);
                        });
                });

            },
            // s3统计文件大小
            getFolderSize (folderPath) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_size', {
                        project_id: this.project_id,
                        path: '/Scheme_WT/'+this.project_id+'/cfd/mesh-and-simulate/'+folderPath+'/RUN/C1/' + folderPath+'/FINE'
                    })
                        .then(res => {
                            resolve(res.data.data.file_size);
                        })
                        .catch(err => {
                            reject(err);
                        });
                });

            },
            // s3查询上传文件,查询上传到s3上的无人机影像文件，100个文件为一页
            getFile ( path, page ) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_filename', {
                        project_id: this.project_id,
                        path: '/Scheme_WT/'+this.project_id+'/cfd/mesh-and-simulate/'+path+'/RUN/C1/' + path+'/FINE',
                        page: page
                    })
                        .then(res => {
                            let arr = [];
                            res.data.data.filename_list.forEach((value, index) => {
                                let name = value.name.split('/');
                                if(name[name.length-1] != ''){
                                    arr.push({
                                        name: name[name.length-1],
                                        size: value.size,
                                        Prefix: value.name,
                                        delete: false,
                                        index: index,
                                        number: 1
                                    });
                                }
                            });
                            resolve(arr)
                        })
                        .catch(err => {
                            reject(err);
                        });
                })

            },
            // 初始化
            request () {
                this.getRootFolderFull('').then(data=>{
                    this.fileForm = data;
                    this.$emit('wtFileFormChange', data);
                    this.$emit('Expand', false);
                    this.rootLoading = false;
                }).catch(err=>console.log(err))
            },
            // 获取文件夹路径
            getPath(str) {
                return str.substring(str.indexOf('/')+20,str.length-1)
            },
            // 获取文件路径
            getFilePath (str) {
                return str.substring(str.indexOf('/')+20,str.length)
            },
        },
        created () {
            console.log(this.project_id);
            this.request();
            Bus.$on('uploadCompleted', (status)=>{
                if(status) this.request();
            })
        }
    }
</script>

<style scoped>
    .el-table{
        z-index: 1
    }
    .el-table:before {
        height:0px;
    }
</style>
