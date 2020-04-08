<template>
    <div>
        <div style="color: #021325!important;">
            <el-table
                    class="gf-table calculating"
                    :data="fileForm"
                    style="width: 100%"
                    :show-header="false"
                    ref="refFileForm">
                <el-table-column width="65px">
                    <template slot-scope="scope">
                        <div class="green" style="text-align: center;">
                            <span class="icon">
                                <icon style="height: 32px;margin-left: 32px;color: #33C86F;float: left;font-size: 29px;" name="wenjianjia"></icon>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <div style="color: #33C86F;">{{scope.row.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        {{scope.row.number}}个文件
                    </template>
                </el-table-column>
                <el-table-column
                        prop="size">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import util from '@/libs/util';
    export default {
        name: 'calculatingFolder',
        props:{
            project_id:String
        },
        data () {
            return {
                fileForm: [],
                tableData5: [],
                // project_id: 102,
                innerTableStyle: {
                    height: ''
                },
                selection: []
            };
        },
        methods: {
            cellMouseEnterHandle (row) {
                row.delete = true;
            },
            cellMouseLeaveHandle (row) {
                row.delete = false;
            },
            // 获取文件夹列表，输入路径，返回包括size和number的folder_list
            async getRootFolderFull (path) {
                let folderForm = await this.getRootFolder(path);
                for(let i in folderForm){
                    folderForm[i].size = await this.getFolderSize(this.getPath(folderForm[i].Prefix));
                    folderForm[i].number = await this.getFolderCount(this.getPath(folderForm[i].Prefix));
                }
                return folderForm
            },
            async getSubFolderFull (path) {
                let folderForm = await this.getSubFolder(path);
                for(let i in folderForm){
                    folderForm[i].size = await this.getFolderSize(this.getPath(folderForm[i].Prefix));
                    folderForm[i].number = await this.getFolderCount(this.getPath(folderForm[i].Prefix));
                }
                return folderForm
            },
            // s3查询根目录文件夹
            getRootFolder ( path ) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_folder', {
                        project_id: this.project_id,
                        path: '/UAV/input' + path
                    })
                        .then(res => {
                            let arr = [];
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
                                    }
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
                        path: '/UAV' + path
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
                                    currentPage: 1
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
            // s3查询上传文件,查询上传到s3上的无人机影像文件，100个文件为一页
            getFile ( path, page ) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_filename', {
                        project_id: this.project_id,
                        path: '/UAV' + path,
                        page: page
                    })
                        .then(res => {
                            let arr = [];
                            res.data.data.filename_list.forEach((value, index) => {
                                let name = value.name.split('/');
                                arr.push({
                                    name: name[name.length-1],
                                    size: value.size,
                                    Prefix: value.name,
                                    delete: false,
                                    index: index
                                });
                            });
                            resolve(arr)
                        })
                        .catch(err => {
                            reject(err);
                        });
                })

            },
            // s3显示文件数量
            getFolderCount (folderPath) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_filecount', {
                        project_id: this.project_id,
                        path: '/UAV' + folderPath
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
                        path: '/UAV' + folderPath
                    })
                        .then(res => {
                            resolve(res.data.data.file_size);
                        })
                        .catch(err => {
                            reject(err);
                        });
                });

            },
            // s3删除文件夹
            deleteFolder (row) {
                util.ajax.post('/s3_folder_delete', {
                    project_id: this.project_id,
                    path: '/UAV/input/' + row.name
                })
                    .then(res => {
                        console.log(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // s3删除文件
            deleteFile (row) {
                util.ajax.post('/s3_file_delete', {
                    project_id: this.project_id,
                    path: '/UAV/input' + this.getFilePath(row.Prefix)
                })
                    .then(res => {
                        console.log(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // s3删除文件
            deleteFilePromise (row) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_file_delete', {
                        project_id: this.project_id,
                        path: '/UAV/input' + this.getFilePath(row.Prefix)
                    })
                        .then(res => {
                            resolve(res.data);
                        })
                        .catch(err => {
                            reject(err)
                        });
                });

            },
            // 展开文件夹内无人机数据文件夹和POS文件
            onExpandHandle (row) {
                if(row.expand.folder.length < 1) {
                    this.getSubFolderFull(this.getPath(row.Prefix)).then(data => {
                        row.expand.folder = data;
                        // this.fileForm(row.index, 1 ,row);
                        this.$refs.refFileForm.doLayout()
                    }).catch(err => console.log(err));

                    this.getFile(this.getPath(row.Prefix), 1)
                        .then(data => {
                            row.expand.txt = data;
                        })
                        .catch(err => console.log(err))
                }
            },
            // 展开无人机数据文件夹
            onExpandHandleSecond (row) {
                if(row.expand < 1){
                    this.getFile(this.getPath(row.Prefix), 1)
                        .then(data=>{
                            row.expand = data;
                        })
                        .catch(err=>console.log(err));
                    this.innerTableStyle.height = 400
                }

            },
            // 初始化
            request () {
                this.getRootFolderFull('').then(data=>{
                    this.fileForm = data;
                    let counter = 0;
                    for (let item in this.fileForm){
                        counter += this.fileForm[item].number
                    }
                    this.$emit('fileCount', counter)
                }).catch(err=>console.log(err))
            },
            // 获取路径
            getPath(str) {
                return str.substring(str.indexOf('/')+4,str.length-1)
            },
            getFilePath (str) {
                return str.substring(str.indexOf('/')+4,str.length)
            },
            // 页码改动监听参数
            onCurrentChangeHandle (row) {
                console.log(row);
                this.getFile(this.getPath(row.Prefix), row.currentPage)
                    .then(data=>{
                        row.expand = data;
                        // console.log(data)
                    }).catch(err=>{
                    console.log(err)
                })
            },
            // 批量删除
            multipleDelete () {
                const promises = this.selection.map(item=> {
                    return this.deleteFilePromise(item);
                });

                Promise.all(promises).then(results=> {
                    console.log(results)
                }).catch(err=>{
                    console.log(err)
                });
            },
            // 选择处理事件
            selectHandle (selection) {
                this.selection = selection
            }
        },
        created () {
            this.request()
        }
    };


</script>

<style scoped>
    .gf-table.el-table tr:last-child td{
        padding-bottom: 0!important;
    }
    .gf-table.el-table tr:first-child td {
        padding-top: 0!important;
    }
</style>
