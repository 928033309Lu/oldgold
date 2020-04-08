<style lang="less" scoped>
    .param-container {
        position: relative;
        padding-top: 12px;
        .row {
            display: flex;
            .status {
                flex: none;
                width: 100px;
                text-align: center;
            }
            .content {
                flex: auto;
                padding-left: 26px;
                padding-right: 18px;
            }
            .upload {
                width: 100%;
            }
        }
        .remove-btn {
            font-size: 18px;
            color: #33C86F;
            cursor: pointer;
            opacity: 0.7;
            &:hover {
                opacity: 1;
            }
        }
        .add-btn {
            height: 29px;
            line-height: 29px;
            text-align: center;
            border: 1px solid rgba(159,164,162,0.5);
            border-top: none;
            color: rgba(212,239,246,0.9);
            font-size: 14px;
            cursor: pointer;
            &:hover {
                color: #33C86F;
            }
        }
        .turbine-ops {
            color: #33C86F;
            span {
                font-size: 14px;
                opacity: 0.8;
            }
            a:link {
                color: #33C86F;
            }
        }
        .download-btn, .upload-btn {
            cursor: pointer;
            font-size: 16px;
            opacity: 0.8;
            &:hover {
                opacity: 1;
            }
        }
        .btn-panel {
            padding: 46px 0 21px 0;
            text-align: center;
        }
        .notice-panel {
            padding-left: 31px;
            font-size: 14px;
            .notice-icon {
                font-size: 37px;
                color: #33C86F;
            }
            .notice-success {
                color: #33C86F;
            }
            .notice-warn {
                color: #D4EFF6;
            }
        }
    }
</style>

<template>
<div>
    <el-dialog
            title="上传参数"
            class="scroll"
            :visible.sync="dialogVisible"
            width="920px"
            top="50px"
            :modal="false">
        <div class="param-container">
            <div class="row">
                <div class="status status1" style="padding-top: 7px;">
                    <upload-status-indicator label="地形及<br>粗糙度数据" :status="terrainAndRoughnessStatus" font-weight="bold"/>
                </div>
                <div class="content content1">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <file-uploader ref="terrainDataUpload"
                                           class="upload"
                                           :action="'/terrain/' + projectId"
                                           name="terrain_filename"
                                           :filename.sync="prevUploadInfo.cfdInfo.terrain_filename"
                                           :status.sync="terrainDataStatus"
                                           :readonly="uploadLoading"
                                           tip="实测地形数据上传(.map,.xyz)"
                                           accept=".map,.xyz"/>
                        </el-col>
                        <el-col :span="12">
                            <file-uploader ref="roughnessDataUpload"
                                           class="upload"
                                           :action="'/rough/' + projectId"
                                           name="rough_filename"
                                           :filename.sync="prevUploadInfo.cfdInfo.rough_filename"
                                           :status.sync="roughnessDataStatus"
                                           :readonly="uploadLoading"
                                           tip="粗糙度数据(.map,.xyz)"
                                           accept=".map,.xyz"/>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="row" style="padding-top: 26px;">
                <div class="status status2" style="padding-top: 11px;">
                    <upload-status-indicator label="仿真参数设置" :status="cfdParamStatus" font-weight="bold"/>
                </div>
                <div class="content content2">
                    <el-form :model="cfdForm" :rules="cfdRules" :inline="true">
                        <el-form-item prop="section_num">
                            <el-input v-model="cfdForm.section_num" placeholder="请填写扇区数（1～360）"
                                      :disabled="uploadLoading" class="gf-input" style="width: 220px;"/>
                        </el-form-item>
                        <el-form-item prop="grid_resolution">
                            <el-input v-model="cfdForm.grid_resolution" placeholder="请填写水平网格分辨率"
                                      :disabled="uploadLoading" class="gf-input" style="width: 220px;"/>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="row" style="padding-bottom: 33px;">
                <div class="status status3" style="padding-top: 50px;">
                    <upload-status-indicator label="测风塔信息" :status="mastDataStatus" font-weight="bold"/>
                </div>
                <div class="content content3">
                    <el-table class="gf-table" :data="mastList">
                        <el-table-column width="90px" label="测风塔编号" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.code" :disabled="uploadLoading" class="gf-table-input"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="大地坐标x" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.x" :disabled="uploadLoading" class="gf-table-input"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="大地坐标y" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.y" :disabled="uploadLoading" class="gf-table-input"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="测风塔高度(米)" width="110px" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.height" :disabled="uploadLoading" class="gf-table-input"/>
                            </template>
                        </el-table-column>
                        <el-table-column width="150px" align="center">
                            <template slot-scope="scope">
                                <file-upload-button v-if="!scope.row.filename" :filename="scope.row.filename" :readonly="uploadLoading" @file-selected="setMastFile(scope.row, $event)"/>
                                <span v-else>{{scope.row.filename}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="40px" align="center">
                            <template slot-scope="scope">
                                <span v-if="mastList.length > 1" @click="delRow(scope.$index, mastList)">
                                    <icon name="remove" class="remove-btn"/>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="add-btn" @click="addMast">+ 新增</div>
                </div>
            </div>
            <div class="row">
                <div class="status status4" style="padding-top: 50px;">
                    <upload-status-indicator label="风机信息" :status="turbineDataStatus" font-weight="bold"/>
                    <div class="turbine-ops">
                        <span>（</span>
                        <a target="_blank" :href="turbineFileTempUrl"><icon name="download" class="download-btn"/></a>&nbsp;&nbsp;
                        <icon v-if="uploadLoading" name="load" class="upload-btn"/>
                        <el-upload ref="upload"
                                   v-else
                                   style="display: inline"
                                   action="/input_turbine_file"
                                   :show-file-list="false"
                                   :http-request="parseTurbineFile"
                                   :on-change="onFileUploadChange">
                            <icon slot="trigger" name="load" class="upload-btn"/>
                        </el-upload>
                        <span>）</span>
                    </div>
                </div>
                <div class="content content4">
                    <el-table class="gf-table" :data="turbineList">
                        <el-table-column label="风机编号" width="80px" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.code" :disabled="uploadLoading" class="gf-table-input"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="机型" width="140px" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.type" :disabled="uploadLoading" popper-class="gf-popper" placeholder="请选择" @change="handleTurboTypeChange(scope.$index)">
                                    <el-option v-for="item in turbineOptions" :key="item.value" :label="item.label" :value="item.value"/>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="大地坐标x" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.x" :disabled="uploadLoading" class="gf-table-input"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="大地坐标y" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.y" :disabled="uploadLoading" class="gf-table-input"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="轮毂高度(米)" width="95px" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.height" :disabled="uploadLoading" class="gf-table-input"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="功率曲线文件" min-width="140px" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.power_curve_filename}}</span>
                                <!-- <span>{{getCurveFilename(scope.row.type)}}</span> -->
                            </template>
                        </el-table-column>
                        <el-table-column width="40px" align="center">
                            <template slot-scope="scope">
                                <span v-if="turbineList.length > 1" @click="delRow(scope.$index, turbineList)">
                                    <icon name="remove" class="remove-btn"/>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="add-btn" @click="addTurbine">+ 新增</div>
                </div>
            </div>

            <!-- 画线 -->
            <gf-line ref="line1"
                     from-selector=".param-container .status1"
                     to-selector=".param-container .content1"
                     from-position-x="right"
                     from-position-y="top"
                     :from-offset-x="-32"
                     :from-offset-y="17"
                     to-position-x="left"
                     to-position-y="top"
                     :to-offset-x="18"
                     orientation="horizontal"
                     color="#9FA4A2"
                     :opacity="0.5"/>
            <gf-line ref="line2"
                     from-selector=".param-container .status2"
                     to-selector=".param-container .content2"
                     from-position-x="right"
                     from-position-y="top"
                     :from-offset-x="-32"
                     :from-offset-y="21"
                     to-position-x="left"
                     to-position-y="top"
                     :to-offset-x="18"
                     orientation="horizontal"
                     color="#9FA4A2"
                     :opacity="0.5"/>
            <gf-line ref="line3"
                     from-selector=".param-container .status3"
                     to-selector=".param-container .content3"
                     from-position-x="right"
                     from-position-y="top"
                     :from-offset-x="-32"
                     :from-offset-y="60"
                     to-position-x="left"
                     to-position-y="top"
                     :to-offset-x="18"
                     orientation="horizontal"
                     color="#9FA4A2"
                     :opacity="0.5"/>
            <gf-line ref="line4"
                     from-selector=".param-container .status4"
                     to-selector=".param-container .content4"
                     from-position-x="right"
                     from-position-y="top"
                     :from-offset-x="-32"
                     :from-offset-y="60"
                     to-position-x="left"
                     to-position-y="top"
                     :to-offset-x="18"
                     orientation="horizontal"
                     color="#9FA4A2"
                     :opacity="0.5"/>

            <gf-line ref="line5"
                     from-selector=".param-container .status1>div"
                     to-selector=".param-container .status2>div"
                     from-position-x="center"
                     from-position-y="bottom"
                     to-position-x="center"
                     to-position-y="top"
                     :from-offset-y="0"
                     :to-offset-y="-5"
                     orientation="vertical"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line ref="line6"
                     from-selector=".param-container .status2>div"
                     to-selector=".param-container .status3>div"
                     from-position-x="center"
                     from-position-y="bottom"
                     to-position-x="center"
                     to-position-y="top"
                     :from-offset-y="0"
                     :to-offset-y="-5"
                     orientation="vertical"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line ref="line7"
                     from-selector=".param-container .status3>div"
                     to-selector=".param-container .status4>div"
                     from-position-x="center"
                     from-position-y="bottom"
                     to-position-x="center"
                     to-position-y="top"
                     :from-offset-y="0"
                     :to-offset-y="-5"
                     orientation="vertical"
                     color="#33C86F"
                     :opacity="0.5"/>

            <div class="btn-panel">
                <el-button class="gf-button" style="width: 208px;" @click="doUpload" type="primary" :loading="uploadLoading">开始上传</el-button>
            </div>
            <div class="notice-panel">
                <span class="notice-icon"><icon name="hint"></icon></span>
                <span v-if="isAerialUploaded" class="notice-success">无人机航拍数据已上传成功</span>
                <span v-else class="notice-warn">无人机航拍数据等待上传</span>
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script>
    import util from '../../libs/util';
    import UploadStatusIndicator from './upload-status-indicator';
    import FileUploader from '../fileupload/file-uploader';
    import FileUploadButton from '../fileupload/file-upload-button';
    import GfLine from '../common/gf-line';
    export default {
        name: 'parameter-upload-dialog',
        components: {
            UploadStatusIndicator,
            FileUploader,
            FileUploadButton,
            GfLine
        },
        data () {
            const validateSectionNum = (rule, value, callback) => {
                if (!value) {
                    return callback();
                }
                if (!/^[\d]*$/.test(value)) {
                    return callback(new Error('请输入数字值'));
                }
                if (parseInt(value) < 1 || parseInt(value) > 360) {
                    callback(new Error('有限范围: 1～360'));
                } else {
                    callback();
                }
            };
            const validateGridResolution = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入水平网格分辨率'));
                }
                if (!/^[\d]+(\.[\d])?$/.test(value)) {
                    return callback(new Error('请输入1位小数的数值'));
                }
                if (parseFloat(value) < 1 || parseFloat(value) > 200) {
                    callback(new Error('有限范围: 1～200'));
                } else {
                    callback();
                }
            };

            return {
                dialogVisible: false,
                projectId: '',
                prevUploadInfo: this.defaultPrevUploadInfo(),
                isAerialUploaded: false,
                terrainDataStatus: 'unset',
                roughnessDataStatus: 'unset',
                mastList: [],
                turbineList: [],
                uploadLoading: false,
                cfdUploading: false,
                mastUploading: false,
                turbineUploading: false,
                cfdForm: {
                    section_num: '',
                    grid_resolution: ''
                },
                cfdRules: {
                    section_num: [
                        { validator: validateSectionNum, trigger: 'blur' }
                    ],
                    grid_resolution: [
                        { validator: validateGridResolution, trigger: 'blur' }
                    ]
                },
                turbineOptions: []
            };
        },
        computed: {
            terrainAndRoughnessStatus: function () {
                if (this.terrainDataStatus === 'complete' && this.roughnessDataStatus === 'complete') {
                    return 'complete';
                }
                if (this.terrainDataStatus === 'unset' && this.roughnessDataStatus === 'unset') {
                    return 'none';
                }
                return 'uploading';
            },
            cfdParamChange: function () {
                const sectionNum1 = this.prevUploadInfo.cfdInfo.section_num;
                const sectionNum2 = this.cfdForm.section_num ? parseFloat(this.cfdForm.section_num) : null;
                const gridResolution1 = this.prevUploadInfo.cfdInfo.grid_resolution;
                const gridResolution2 = this.cfdForm.grid_resolution ? parseFloat(this.cfdForm.grid_resolution) : null;
                if (sectionNum1 !== sectionNum2 || gridResolution1 !== gridResolution2) {
                    return {
                        section_num: sectionNum2,
                        grid_resolution: gridResolution2
                    };
                } else {
                    return null;
                }
            },
            cfdParamStatus: function () {
                if (this.cfdUploading) {
                    return 'uploading';
                }
                if (this.cfdParamChange) {
                    if (this.cfdParamChange.section_num || this.cfdParamChange.grid_resolution) {
                        return 'uploading';
                    } else {
                        return 'none';
                    }
                } else {
                    if (this.prevUploadInfo.cfdInfo.section_num && this.prevUploadInfo.cfdInfo.grid_resolution) {
                        return 'complete';
                    } else if (this.prevUploadInfo.cfdInfo.section_num || this.prevUploadInfo.cfdInfo.grid_resolution) {
                        return 'uploading';
                    } else {
                        return 'none';
                    }
                }
            },
            mastDataChange: function () {
                const opData = [];
                this.prevUploadInfo.mastInfo.forEach((item) => {
                    let mast = this.mastList.find((i) => {
                        return i.id === item.mast_id;
                    });
                    if (!mast) {
                        opData.push({op: 'delete', data: item});
                    }
                });
                this.mastList.forEach((item, index) => {
                    let mast = this.prevUploadInfo.mastInfo.find((prevItem) => {
                        return prevItem.mast_id === item.id;
                    });
                    if (!item.id) {
                        if (item.code || item.x || item.y || item.height || item.file) {
                            opData.push({op: 'insert', data: item});
                        }
                    } else if (item.code != mast.mast_name || item.x != mast.coordinate_x ||
                        item.y != mast.coordinate_y || item.height != mast.height || item.file) {
                        opData.push({op: 'update', data: item});
                    }
                });
                return opData;
            },
            mastDataStatus: function () {
                if (this.mastUploading) {
                    return 'uploading';
                }
                if (this.isMastListEmpty()) {
                    return 'none';
                }
                const mastDataChange = this.mastDataChange;
                if (mastDataChange.length > 0) {
                    return 'uploading';
                }
                let status = this.prevUploadInfo.mastInfo.length > 0 ? 'complete' : 'none';
                this.prevUploadInfo.mastInfo.forEach(item => {
                    if (!item.filename) {
                        status = 'uploading';
                    }
                });
                return status;
            },
            turbineDataChange: function () {
                const opData = [];
                this.prevUploadInfo.turbineInfo.forEach((item) => {
                    let turbine = this.turbineList.find((i) => {
                        return i.turbine_id === item.turbine_id;
                    });
                    if (!turbine) {
                        opData.push({op: 'delete', data: item});
                    }
                });
                this.turbineList.forEach((item, index) => {
                    let turbine = this.prevUploadInfo.turbineInfo.find((prevItem) => {
                        return prevItem.turbine_id === item.turbine_id;
                    });
                    if (!item.turbine_id) {
                        if (item.code || item.type || item.x || item.y || item.height) {
                            opData.push({op: 'insert', data: item});
                        }
                    } else if (item.code != turbine.turbine_name || item.type != turbine.turbine_type
                        || item.x != turbine.coordinate_x || item.y != turbine.coordinate_y || item.height != turbine.height) {
                        opData.push({op: 'update', data: item});
                    }
                });
                return opData;
            },
            turbineDataStatus: function () {
                if (this.turbineUploading) {
                    return 'uploading';
                }
                if (this.isTurbineListEmpty()) {
                    return 'none';
                }
                const turbineDataChange = this.turbineDataChange;
                if (turbineDataChange.length > 0) {
                    return 'uploading';
                }
                return this.prevUploadInfo.turbineInfo.length > 0 ? 'complete' : 'none';
            },
            turbineFileTempUrl: function () {
                return util.baseUrl + '/input_turbine_file';
            },
            loginUserInfo () {
                return this.$store.state.user.loginUserInfo;
            },
        },
        methods: {
            open (projectId) {
                this.projectId = projectId;
                this.dialogVisible = true;
                this.init();
                this.loadData();
            },
            init () {
                this.prevUploadInfo = this.defaultPrevUploadInfo();
                this.terrainDataStatus = 'unset';
                this.roughnessDataStatus = 'unset';
                this.cfdForm.section_num = '';
                this.cfdForm.grid_resolution = '';
                this.isAerialUploaded = false;
                this.mastList = [];
                this.turbineList = [];
                this.uploadLoading = false;
                this.cfdUploading = false;

                // 初始化机型列表
                if (this.turbineOptions.length < 1) {
                    util.ajax.get('/properties/'+ this.loginUserInfo.user_id, {
                        params: {
                            key: 'turbines'
                        }
                    }).then((res) => {
                        if (res.data.code !== 200) {
                            this.$message.error(res.data.message);
                            return;
                        }
                        res.data.data.items.forEach((item) => {
                            this.turbineOptions.push({
                                value: item,
                                label: item
                            });
                        });
                    }).catch(() => {
                        this.$message.error('获取机型列表失败');
                    });
                }
            },
            loadData () {
                this.loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                const p1 = this.loadCfdParameter();
                const p2 = this.loadMastInfo();
                const p3 = this.loadTurbineInfo();
                const p4 = this.loadUavFileStatus();
                Promise.all([p1, p2, p3, p4]).then(() => {
                    this.loading.close();
                    this.$nextTick(function () {
                        this.refreshLines();
                    });
                }).catch(() => {
                    this.loading.close();
                });
            },
            loadCfdParameter () {
                this.cfdForm.section_num = '';
                this.cfdForm.grid_resolution = '';
                return util.ajax.get('/input_cfd/' + this.projectId).then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    this.prevUploadInfo.cfdInfo = res.data.data;
                    this.cfdForm.section_num = res.data.data.section_num;
                    this.cfdForm.grid_resolution = res.data.data.grid_resolution;
                    this.terrainDataStatus = this.prevUploadInfo.cfdInfo.terrain_filename ? 'complete' : 'unset';
                    this.roughnessDataStatus = this.prevUploadInfo.cfdInfo.rough_filename ? 'complete' : 'unset';
                }).catch(() => {
                    this.$message.error('获取CFD参数失败！');
                });
            },
            loadMastInfo () {
                this.mastList = [{
                    id: null,
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                    filename: ''
                }];
                return util.ajax.get('/input_mast/' + this.projectId).then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    this.prevUploadInfo.mastInfo = res.data.data || [];
                    if (res.data.data && res.data.data.length > 0) {
                        this.mastList = [];
                        res.data.data.forEach((item) => {
                            this.mastList.push({
                                id: item.mast_id,
                                code: item.mast_name,
                                x: item.coordinate_x,
                                y: item.coordinate_y,
                                height: item.height,
                                filename: item.filename
                            });
                        });
                    }
                }).catch(() => {
                    this.$message.error('获取测风塔信息失败！');
                });
            },
            loadTurbineInfo () {
                this.turbineList = [{
                    turbine_id: null,
                    code: '',
                    type: '',
                    x: '',
                    y: '',
                    height: ''
                }];
                return util.ajax.get('/input_turbine/' + this.projectId + '/1').then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    this.prevUploadInfo.turbineInfo = res.data.data;
                    if (res.data.data && res.data.data.length > 0) {
                        this.turbineList = [];
                        res.data.data.forEach((item) => {
                            this.turbineList.push({
                                turbine_id: item.turbine_id,
                                code: item.turbine_name,
                                type: item.turbine_type,
                                x: item.coordinate_x,
                                y: item.coordinate_y,
                                height: item.height
                            });
                        });
                    }
                }).catch(() => {
                    this.$message.error('获取风机信息失败！');
                });
            },
            loadUavFileStatus () {
                this.isAerialUploaded = false;
                return util.ajax.get('/status/' + this.projectId).then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    if (res.data.data && res.data.data.uav_file === 1) {
                        this.isAerialUploaded = true;
                    }
                }).catch(() => {
                    this.$message.error('获取无人机航拍数据上传状态失败！');
                });
            },
            defaultPrevUploadInfo () {
                return {
                    cfdInfo: {
                        terrain_filename: '',
                        rough_filename: '',
                        section_num: '',
                        grid_resolution: ''
                    },
                    mastInfo: [],
                    turbineInfo: []
                };
            },
            doUpload () {
                const p1 = this.$refs.terrainDataUpload.uploadFile();
                const p2 = this.$refs.roughnessDataUpload.uploadFile();
                const p3 = this.uploadCfd();
                const p4 = this.uploadMastInfo();
                const p5 = this.uploadTurbineInfo();
                this.uploadLoading = true;
                Promise.all([p1, p2, p3, p4, p5]).then(() => {
                    if (this.terrainAndRoughnessStatus === 'complete' && this.cfdParamStatus === 'complete' &&
                    /* this.isAerialUploaded && */ !this.isMastListEmpty() && !this.isTurbineListEmpty()) {
                        util.ajax.get('/foam/' + this.projectId + '/run').then((res) => {
                            if (res.data.code !== 200) {
                                this.$message.error(res.data.message);
                                return;
                            }
                            this.dialogVisible = false;
                            this.$emit('calculateStarted', this.projectId);
                        }).catch(() => {
                            this.$message.error('启动计算处理失败');
                        });
                    } else {
                        this.uploadLoading = false;
                        this.$message.success('上传成功');
                        // this.init();
                        // this.loadData();
                    }
                }).catch((err) => {
                    this.uploadLoading = false;
                    this.$message.error('上传失败');
                    console.error(err);
                });
            },
            uploadCfd () {
                const cfdData = this.cfdParamChange;
                if (!cfdData) {
                    return new Promise((resolve) => {
                        resolve();
                    });
                }
                this.cfdUploading = true;
                return util.ajax.post('/input_cfd/' + this.projectId, cfdData).then((res) => {
                    this.cfdUploading = false;
                    if (res.data.code !== 201) {
                        throw res.data.message;
                    } else {
                        this.prevUploadInfo.cfdInfo = cfdData;
                    }
                }).catch((err) => {
                    this.cfdUploading = false;
                    throw err;
                });
            },
            uploadMastInfo () {
                const opData = this.mastDataChange;
                this.mastUploading = true;
                const p = opData.map((item) => {
                    const formData = new FormData();
                    formData.append('mast_name', item.data.code);
                    formData.append('coordinate_x', item.data.x);
                    formData.append('coordinate_y', item.data.y);
                    formData.append('height', item.data.height);
                    if (item.data.file) {
                        formData.append('mast_file', item.data.file, item.data.file.name);
                    }
                    const config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    };
                    if (item.op === 'insert') {
                        return util.ajax.post('input_mast/' + this.projectId, formData, config).then(res => {
                            if (res.data.code !== 201) {
                                throw res.data.message;
                            }
                        });
                    } else if (item.op === 'update') {
                        return util.ajax.put('input_mast/' + this.projectId + '/' + item.data.id, formData, config).then(res => {
                            if (res.data.code !== 201) {
                                throw res.data.message;
                            }
                        });
                    } else {
                        return util.ajax.delete('input_mast/' + this.projectId + '/' + item.data.mast_id).then(res => {
                            if (res.data.code !== 204) {
                                throw res.data.message;
                            }
                        });
                    }
                });
                return Promise.all([...p]).then(() => {
                    return this.loadMastInfo().then(() => {
                        this.mastUploading = false;
                    });
                }).catch((err) => {
                    this.mastUploading = false;
                    throw err;
                });
            },
            uploadTurbineInfo () {
                const opData = this.turbineDataChange;
                this.turbineUploading = true;
                const p = opData.map((item) => {
                    const data = {
                        turbine_name: item.data.code,
                        turbine_type: item.data.type,
                        coordinate_x: item.data.x,
                        coordinate_y: item.data.y,
                        height: item.data.height,
                        power_curve_filename: item.data.power_curve_filename
                    };
                    if (item.op === 'insert') {
                        return util.ajax.post('input_turbine/' + this.projectId + '/1', data).then(res => {
                            if (res.data.code !== 201) {
                                throw res.data.message;
                            }
                        });
                    } else if (item.op === 'update') {
                        return util.ajax.put('input_turbine/' + this.projectId + '/1/' + item.data.turbine_id, data).then(res => {
                            if (res.data.code !== 201) {
                                throw res.data.message;
                            }
                        });
                    } else {
                        return util.ajax.delete('input_turbine/' + this.projectId + '/1/' + item.data.turbine_id).then(res => {
                            if (res.data.code !== 204) {
                                throw res.data.message;
                            }
                        });
                    }
                });
                return Promise.all([...p]).then(() => {
                    return this.loadTurbineInfo().then(() => {
                        this.turbineUploading = false;
                    });
                }).catch(err => {
                    this.turbineUploading = false;
                    throw err;
                });
            },
            refreshLines () {
                for (let i = 1; i <= 7; i++) {
                    this.$refs['line' + i].refresh();
                }
            },
            addMast () {
                if (this.uploadLoading) {
                    return;
                }
                this.mastList.push({
                    id: null,
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                    filename: ''
                });
                this.$nextTick(function () {
                    this.refreshLines();
                });
            },
            addTurbine () {
                if (this.uploadLoading) {
                    return;
                }
                this.turbineList.push({
                    code: '',
                    type: '',
                    x: '',
                    y: '',
                    height: ''
                });
                this.$nextTick(function () {
                    this.refreshLines();
                });
            },
            delRow (index, rows) {
                if (this.uploadLoading) {
                    return;
                }
                if (rows.length === 1) {
                    this.$message({
                        message: '不能删除最后一条数据！',
                        type: 'warning'
                    });
                } else {
                    rows.splice(index, 1);
                    this.$nextTick(function () {
                        this.refreshLines();
                    });
                }
            },
            parseTurbineFile (option) {
                const formData = new FormData();
                const file = option.file;
                formData.append('turbine_file', file, file.name);
                option.headers['Content-Type'] = 'multipart/form-data';
                this.loading = this.$loading({
                    lock: true,
                    text: '文件上传中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                util.ajax.post(option.action, formData, {
                    headers: option.headers
                }).then((res) => {
                    this.loading.close();
                    if (res.data.code !== 201) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    this.turbineList.splice(0, this.turbineList.length);
                    res.data.data.forEach((item) => {
                        this.turbineList.push({
                            code: item.turbine_name,
                            type: '',
                            x: item.coordinate_x,
                            y: item.coordinate_y,
                            height: item.height
                        });
                    });
                }).catch(() => {
                    this.loading.close();
                    this.$message.error('文件上传失败');
                });
            },
            onFileUploadChange (file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, fileList.length - 1);
                }
            },
            getCurveFilename (turbineType) {
                if (!turbineType) {
                    return '';
                } else {
                    return turbineType.replace(/[^a-zA-Z0-9_]/g, '_') + '.gfwtg';
                }
            },
            setMastFile (row, event) {
                row.file = event;
            },
            isMastListEmpty () {
                let count = 0;
                this.mastList.forEach((item) => {
                    if (item.code || item.x || item.y || item.height || item.file) {
                        count++;
                    }
                });
                return count === 0;
            },
            isTurbineListEmpty () {
                let count = 0;
                this.turbineList.forEach((item) => {
                    if (item.code || item.type || item.x || item.y || item.height) {
                        count++;
                    }
                });
                return count === 0;
            },
            handleTurboTypeChange (index) {
                if (index === 0) {
                    const hasOtherType = this.turbineList.some((item, index) => {
                        if (index === 0) {
                            return false;
                        }
                        return !!item.type;
                    });
                    if (!hasOtherType) {
                        const type = this.turbineList[0].type;
                        for (let i = 1; i < this.turbineList.length; i++) {
                            this.turbineList[i].type = type;
                        }
                    }
                }
            }
        }
    };
</script>
