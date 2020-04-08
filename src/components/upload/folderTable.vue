<template>
    <div style="width:100%">
        <el-table
                class="gf-table expand-table need-border"
                :data="fileForm"
                style="width: 100%"
                :show-header="false"
                ref="outerTabler"
                @cell-mouse-enter="cellMouseEnterHandle"
                @cell-mouse-leave="cellMouseLeaveHandle"
                @expand-change="onExpandHandle"
                @row-click="onRowClickHandle"
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
            <el-table-column width="250px">
                <template slot-scope="scope">
                    <div class="green">{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="number" width="150px"></el-table-column>
            <el-table-column prop="size" width="170px"></el-table-column>
            <el-table-column min-width="30px">
                <template slot-scope="scope">
                    <div  class="green icon-plus" style="cursor: pointer" v-if="scope.row.delete" @click="deleteFolder(scope.row)">
                        <span class="icon"><icon name="wechaticon13"></icon></span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <!--POS文件-->
                    <el-table
                            class="gf-table expand-inner-table expand-inner-file"
                            :data="props.row.expand.txt"
                            style="width: 100%"
                            :show-header="false"
                            @cell-mouse-enter="cellMouseEnterHandle"
                            @cell-mouse-leave="cellMouseLeaveHandle">
                        <el-table-column width="100px">
                            <template slot-scope="scope">
                                <div style="padding-left: 50px;text-align: center">
                                    <span class="icon">
                                        <icon name="wenben1"></icon>
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name"  width="250px"></el-table-column>
                        <el-table-column width="150px">
                            <template slot-scope="scope">
                                {{scope.row.number}}个文件
                            </template>
                        </el-table-column>
                        <el-table-column prop="size" width="120px"></el-table-column>
                        <el-table-column min-width="35px">
                            <template slot-scope="scope">
                                <replace-file :project_id="project_id"
                                              :path="props.row.name"
                                              :name="scope.row.name"
                                              v-show="scope.row.delete"
                                              @uploadComplated="onReplaceFileCompleted"
                                >
                                    <div class="green" style="cursor: pointer">
                                        <span class="icon"><icon name="tihuan"></icon></span>
                                    </div>
                                </replace-file>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="35px">
                            <template slot-scope="scope">
                                <div class="green" @click="deleteFileHandle(scope.row)"  style="cursor: pointer"  v-if="scope.row.delete">
                                    <span class="icon"><icon name="wechaticon13"></icon></span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--无人机文件夹-->
                    <el-table
                            class="gf-table expand-inner-table expand-inner-folder"
                            :data="props.row.expand.folder"
                            style="width: 100%;"
                            :show-header="false"
                            @expand-change="onExpandHandleSecond"
                            @row-click="onInnerRowClickHandle"
                            ref="innerTabler"
                            v-loading="props.row.loading">
                        <el-table-column width="100px">
                            <template slot-scope="scope">
                                <div style="padding-left: 50px;text-align: center">
                                    <span class="icon icon-plus">
                                        <icon name="wenjianjia"></icon>
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column  width="250px">
                            <template slot-scope="scope">
                                <div style="overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;">
                                    {{scope.row.name}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column width="150px">
                            <template slot-scope="scope">
                                {{scope.row.number}}个文件
                            </template>
                        </el-table-column>
                        <el-table-column prop="size" min-width="100px"></el-table-column>
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <div class="green" style="display: flex;justify-content: flex-end;padding-right: 9px;">
                                    <div style="width: 30px">
                                        <upload-image :project_id="project_id" :path="props.row.Prefix">
                                            <span class="icon">
                                                <icon name="zengjia"></icon>
                                            </span>
                                        </upload-image>
                                    </div>
                                    <div style="width: 30px;cursor: pointer" class="folder-table-delete-sp" @click="multipleDelete">
                                        <span class="icon">
                                            <icon name="wechaticon13"></icon>
                                        </span>
                                    </div>
                                </div>
                                <el-table
                                        class="gf-table  expand-inner-table expand-inner-folder-file"
                                        :data="props.row.expand"
                                        style="width: 100%;overflow-y:scroll"
                                        :show-header="false"
                                        @cell-mouse-enter="cellMouseEnterHandle"
                                        @cell-mouse-leave="cellMouseLeaveHandle"
                                        :height="innerTableStyle.height"
                                        @select="selectHandle">
                                    <el-table-column width="100">
                                        <template slot-scope="scope">
                                            <div style="text-align: center;">
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            type="selection"
                                            width="50px">
                                    </el-table-column>
                                    <el-table-column width="50px">
                                        <template slot-scope="scope">
                                            <div>
                                                <span class="icon">
                                                    <icon name="wenjian"></icon>
                                                </span>
                                            </div>
                                        </template>
                                    </el-table-column>

                                    <el-table-column width="350px">
                                        <template slot-scope="scope">
                                            <div style="overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;width: 349px">
                                                {{scope.row.name}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="size">
                                    </el-table-column>
                                    <el-table-column width="40px">
                                        <template slot-scope="scope">
                                            <div v-if="scope.row.delete"  @click="deletePhotoHandle(scope.row)" class="green" style="cursor: pointer">
                                                <span class="icon"><icon name="wechaticon13"></icon></span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-pagination
                                        background
                                        layout="prev, pager, next"
                                        :total="props.row.number"
                                        :page-size="100"
                                        style="text-align: right;margin-bottom: 10px"
                                        :current-page.sync="props.row.currentPage"
                                        @current-change="onCurrentChangeHandle(props.row)">
                                </el-pagination>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
        </el-table>
        <!--删除根文件夹-->
        <el-dialog
                title="提示"
                :visible.sync="deleteFolderVisible"
                width="470px"
                :modal="false"
                append-to-body
                :close-on-click-modal="false"
                custom-class="upload-for-confirm">
            <div class="dialog-body-content">确认删除--{{deleteFolderRow.name}}？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="deleteFolderVisible = false" class="gf-button cancelBtn">取 消</el-button>
            <el-button @click="ConfirmDeleteFolder" type="primary" class="gf-button confirmBtn">确 定</el-button>
        </span>
        </el-dialog>
        <!--批量删除图片-->
        <el-dialog
                title="提示"
                :visible.sync="multipleDeleteVisible"
                width="470px"
                :modal="false"
                append-to-body
                :close-on-click-modal="false"
                custom-class="upload-for-confirm">
            <div class="dialog-body-content">确认删除{{selection.length}}个图片？</div>
            <span slot="footer" class="dialog-footer custom">
            <el-button @click="multipleDeleteVisible = false" class="gf-button cancelBtn">取 消</el-button>
            <el-button @click="ConfirmMultipleDelete" type="primary" class="gf-button confirmBtn">确 定</el-button>
        </span>
        </el-dialog>
        <!--批量删除图片未选择提示-->
        <el-dialog
                title="提示"
                :visible.sync="multipleDeleteNoSelectVisible"
                width="470px"
                :modal="false"
                append-to-body
                :close-on-click-modal="false"
                custom-class="upload-for-confirm">
            <div class="dialog-body-content">请选择至少一张图片</div>
            <span slot="footer" class="dialog-footer custom">
            <el-button @click="multipleDeleteNoSelectVisible = false" type="primary" class="gf-button confirmBtn">确 定</el-button>
        </span>
        </el-dialog>
        <!--删除POS-->
        <el-dialog
                title="提示"
                :visible.sync="deleteFileVisible"
                width="470px"
                :modal="false"
                :close-on-click-modal="false"
                append-to-body
                custom-class="upload-for-confirm">
            <div class="dialog-body-content">确认删除--{{deleteFileRow.name}}？</div>
            <span slot="footer" class="dialog-footer custom">
            <el-button @click="deleteFileVisible = false" class="gf-button cancelBtn">取 消</el-button>
            <el-button @click="ConfirmDeleteFile" type="primary" class="gf-button confirmBtn">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import util from '@/libs/util';
import uploadImage from './upload-image'
import replaceFile from './replace-file'
import Bus from './bus'
export default {
    name: 'folder-table',
    props: ['project_id'],
    components: {
        uploadImage,
        replaceFile
    },
    data () {
        return {
            fileForm: [],
            // project_id: 102,
            innerTableStyle: {
                height: ''
            },
            selection: [],
            rootLoading: true,
            deleteFolderVisible: false,
            deleteFolderRow: {},
            deleteImageVisible: false,
            deleteImageRow: {},
            deleteFileVisible: false,
            deleteFileRow: {},
            multipleDeleteVisible: false,
            multipleDeleteNoSelectVisible: false,
            expandRow: {},
            expandSecondRow: {},
            expandSecondRows: [],
            deleteFileOrPhoto: true
        };
    },
    watch: {
        fileForm () {
            if (this.fileForm.length>0){
                this.$emit('fileFormChange', this.fileForm)
            }
        }
    },
    methods: {
        // 替换文件完成
        onReplaceFileCompleted () {
            this.$emit('closeProgressBar');
        },
        onRowClickHandle (row, event, column) {
            // console.log(row, event, column)
            this.$refs.outerTabler.toggleRowExpansion(row)
        },
        onInnerRowClickHandle (row) {
            this.$refs.innerTabler.toggleRowExpansion(row)
        },
        cellMouseEnterHandle (row) {
            row.delete = true;
        },
        cellMouseLeaveHandle (row) {
            row.delete = false;
        },
        // 获取文件夹列表，输入路径，返回包括size和number的folder_list
        async getRootFolderFull (path) {
            let folderForm = await this.getRootFolder(path);
            if(folderForm.length === 0) return folderForm;
            for(let i in folderForm){
                folderForm[i].size = await this.getFolderSize(this.getPath(folderForm[i].Prefix));
                folderForm[i].number = await this.getFolderCount(this.getPath(folderForm[i].Prefix));
            }
            return folderForm
        },
        // 获取二级文件夹列表，输入路径，返回包括size和number的folder_list
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
                    path: '/UAV' + path
                })
                    .then(res => {
                        let arr = [];
                        if (!res.data.data.folder_list) reject('没有子文件夹');
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
                                index: index,
                                number: 1
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
            this.deleteFolderVisible = true;
            this.deleteFolderRow = row;
        },
        ConfirmDeleteFolder () {
            this.deleteFolderVisible = false;
            util.ajax.post('/s3_folder_delete', {
                project_id: this.project_id,
                path: '/UAV/input/' + this.deleteFolderRow.name
            })
                .then(res => {
                    if(res.data.message === 'ok') this.request();
                    this.deleteFolderRow = {};
                })
                .catch(err => console.log(err));
        },
        // s3删除文件
        deleteFile (row) {
            util.ajax.post('/s3_file_delete', {
                project_id: this.project_id,
                path: '/UAV' + this.getFilePath(row.Prefix)
            })
                .then(res => {
                    if(res.data.message === 'ok') {
                        (this.deleteFileOrPhoto)?this.onExpandHandle(this.expandRow, true):this.onExpandHandleSecond(this.expandSecondRow,this.expandSecondRows,true)
                    }
                })
                .catch(err => console.log(err));
        },
        deleteFileHandle (row) {
            this.deleteFileOrPhoto = true;
            this.deleteFileVisible = true;
            this.deleteFileRow = row
        },
        deletePhotoHandle (row) {
            this.deleteFileOrPhoto = false;
            this.deleteFileVisible = true;
            this.deleteFileRow = row
        },
        ConfirmDeleteFile() {
            this.deleteFileVisible = false;
            this.deleteFile(this.deleteFileRow);
            this.deleteFileRow = {}
        },
        // s3删除文件Promise封装
        deleteFilePromise (row) {
            return new Promise((resolve, reject)=>{
                util.ajax.post('/s3_file_delete', {
                    project_id: this.project_id,
                    path: '/UAV' + this.getFilePath(row.Prefix)
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
        onExpandHandle (row, refresh) {
            if (refresh.length === 0) return null;
            this.expandRow = row;
            if(row.expand.folder.length < 1 || refresh) {
                this.getSubFolderFull(this.getPath(row.Prefix)).then(data => {
                    row.loading = false;
                    row.expand.folder = data;
                    // this.$refs.refFileForm.doLayout()
                }).catch(err => {
                    this.$message.error(err);
                    row.loading = false;
                });

                this.getFile(this.getPath(row.Prefix), 1)
                    .then(data => {
                        row.expand.txt = data;
                    })
                    .catch(err => console.log(err))
            }
        },
        // 展开无人机数据文件夹
        onExpandHandleSecond (row, expandRows, refresh) {
            this.expandSecondRow = row;
            this.expandSecondRows = expandRows;
            // 触发展开事件，增加外部高度
            (expandRows.length>0)?this.$emit('Expand', true):this.$emit('Expand', false);
            if(row.expand < 1 || refresh){
                this.getFile(this.getPath(row.Prefix), 1)
                    .then(data=>{
                        row.loading = false;
                        row.expand = data;
                    })
                    .catch(err=>console.log(err));
                this.innerTableStyle.height = '400'
            }

        },
        // 初始化
        request () {
            this.getRootFolderFull('').then(data=>{
                this.fileForm = data;
                this.$emit('fileFormChange', data);
                this.$emit('Expand', false);
                this.rootLoading = false;
            }).catch(err=>console.log(err))
        },
        // 获取文件夹路径
        getPath(str) {
            return str.substring(str.indexOf('/')+4,str.length-1)
        },
        // 获取文件路径
        getFilePath (str) {
            return str.substring(str.indexOf('/')+4,str.length)
        },
        // 页码改动监听参数
        onCurrentChangeHandle (row) {
            this.getFile(this.getPath(row.Prefix), row.currentPage)
                .then(data=>{
                    row.expand = data;
                    // console.log(data)
                }).catch(err=>console.log(err))
        },
        // 批量删除
        multipleDelete () {
            (this.selection.length>0)?this.multipleDeleteVisible = true:this.multipleDeleteNoSelectVisible=true;
        },
        // 确认批量删除
        ConfirmMultipleDelete() {
            this.multipleDeleteVisible = false;
            const promises = this.selection.map(item=> {
                return this.deleteFilePromise(item);
            });

            Promise.all(promises).then(results=> {
                if(results) this.onExpandHandleSecond(this.expandSecondRow, this.expandSecondRows, true)
            }).catch(err=>console.log(err));
        },
        // 选择处理事件
        selectHandle (selection) {
            this.selection = selection
        },
        init () {
            return  this.getRootFolderFull('').then(data=>{
                        this.fileForm = data;
                        this.$emit('fileFormChange', data);
                        this.$emit('Expand', false);
                        this.rootLoading = false;
                    }).catch(err=>console.log(err))
            }
    },
    created () {
        this.request();
        Bus.$on('uploadCompleted', (status)=>{
            if(status) this.request();
        })
    }
};
</script>

<style scoped>
.expand-table >>> .el-table__empty-block{
    display: none !important;
}
</style>
