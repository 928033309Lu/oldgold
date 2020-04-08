<template>
    <el-dialog
            title="原始数据"
            :modal="false"
            :visible.sync="calcVisible"
            width="930px"
            top="4%"
            class="jisuan cacl_dialg scroll"
            :before-close="beforeClose">
        <div class="cacl__container">
            <div class="param-calc-container">
                <div style="width: 800px;">
                    <div class="progressDetail" v-show="show2">
                        <div class="status1 clear">
                            <p class="status_p clear">无人机</p>
                            <div class="content1">
                                <calculatingFolder v-on:fileCount="fileCountHandle" :project_id="projectId"></calculatingFolder>
                            </div>
                        </div>
                        <div class="status1 clear">
                            <p class="status_p" v-show="!isChangeGFWT"><span>仿真参数</span></p>
                            <p class="status_p" v-show="isChangeGFWT"><span>WT定向成果</span></p>
                            <div class="content1" style="border-top-width: 0;">
                                <p style="margin-left: 16px">扇区数：<em style="color: #33C86F;font-style: inherit;">{{cfdForm.section_num}}</em></p>
                                <p v-show="!isChangeGFWT" style="margin-left: 95px;">水平网格分辨率：<em style="color: #33C86F;font-style: inherit;">{{cfdForm.horizontal_resolution}}</em></p>
                                <p v-show="!isChangeGFWT" style="margin-left: 95px;">垂直网格分辨率：<em style="color: #33C86F;font-style: inherit;">{{cfdForm.vertical_resolution}}</em></p>
                            </div>
                        </div>
                        <div class="status1 clear">
                            <p class="status_p">测风塔</p>
                            <!-- <windTower-switch style="position: absolute;top: 130px;left: 19px;" class="windTower-switch" @windTowerChange="onWindTowerChange" ></windTower-switch> -->
                            <div class="content2" style="border-top-width: 0;">
                                <el-table class="gf-table" :data="towerList">
                                    <el-table-column prop="code" width="90px" label="测风塔编号" header-align="center" align="center"/>
                                    <el-table-column prop="x" label="投影坐标X" header-align="center" align="center"/>
                                    <el-table-column prop="y" label="投影坐标Y" header-align="center" align="center"/>
                                    <el-table-column prop="height" label="测风塔高度（米）" header-align="center" align="center"/>
                                    <el-table-column prop="filename" label="测风文件" width="170px" align="center" >
                                        <template slot-scope="scope">
                                            <div style="background: rgba(51, 200, 111,0.7);color: rgba(226, 247, 253,0.8);margin: 0 5px 0 0;padding: 5px 0;border-radius: 5px;">
                                                {{ scope.row.filename }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <div class="status1 clear">
                            <p class="status_p">机位点</p>
                            <div class="content2" style="border-top-width: 0;">
                                <el-table class="gf-table" :data="windTurbineList">
                                    <el-table-column prop="code" label="风机编号" width="90px" header-align="center" align="center"/>
                                    <el-table-column prop="type" label="机型" header-align="center" align="center"/>
                                    <el-table-column prop="x" label="投影坐标X" header-align="center" align="center"/>
                                    <el-table-column prop="y" label="投影坐标Y" header-align="center" align="center"/>
                                    <el-table-column prop="height" label="轮毂高度（米）" header-align="center" align="center"/>
                                    <el-table-column prop="powerCurveFile" label="功率曲线文件" width="175px" header-align="center" align="center" />
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>

</template>

<script>
    import calculatingFolder from '../project/calculatingFolder';
    // import windTowerSwitch from '../../components/windTower-switch';
    import UploadStatusIndicator from '../parameter-upload/upload-status-indicator';
    import FileUploader from '../fileupload/file-uploader';
    import GfLine from '../common/gf-line';
    import util from '../../libs/util';
    export default {
        name: 'oldData',
        components: {
            UploadStatusIndicator,
            FileUploader,
            GfLine,
            calculatingFolder
        },
        data () {
            return {
                resultData: {},
                operationRole: false,
                pricking_point_href: '',
                calcVisible: false,
                title: '数据计算中，已完成0/10，预计剩余0h，请等待......',
                titleData1: 1,
                titleData2: 0,
                show1: true,
                show2: true,
                projectId: 0,
                calcStatus: {
                    terrainImage_generation: "none", // 地形影像生成
                    sample_dict: "none", // 流体仿真图谱提取
                    scheme_cost: "none", // 收益率最优排布
                    pricking_point: "none", // 内业刺点
                    UAV_data: "none", // 无人机数据处理
                    cfd_orientation: "none", // CFD定向计算
                    cfd_comprehensive: "none", // CFD综合计算
                    load_calculation: "none", // 载荷计算
                    gis_road: "none", // 道路\升压站设计
                    gis_power_line: "none", // 输电线路设计
                    p_i_r_r: "none", // 经济性评估
                    gis_restrict: "none" // 环境限制因素提取
                },
                towerList: [],
                windTurbineList: [],
                cfdForm: {
                    // section_num: '',
                    // grid_resolution: ''
                },
                // terrain_filename: '',
                // rough_filename: '',
                isChangeGFWT:false,
                isCheckGFWT: 0,     //0 GF   1 WT    2 GF&WT
                isPrickItem: 0,     //0  来自无人机  1  已有地形
            };
        },
        watch:{
            '$store.state.app.projectDataSet': function (val) {
                // console.log(val,"模式")
                // 是否显示内业刺点项
                let projectDataSet = val;
                //0 GF   1 WT    2 GF&WT
                this.isCheckGFWT = projectDataSet.mesh_type;
                this.isChangeGFWT = this.isCheckGFWT==1?true:false
                //0:来自无人机数据；1：上传的已有地形
                this.isPrickItem = projectDataSet.uav_type;
                console.log("原始页面:",this.isCheckGFWT,"0GF/1WT" , this.isPrickItem,"0无人/1已有")  
            }
        },
        methods: {
            CheckGFWT(){
                if(this.isCheckGFWT == 1){
                    return true;
                }else{
                    return false;
                }
            },
            // onWindTowerChange (data) {
            //     this.$emit('windTowerChange', data);
            // },
            // 关闭前回调
            beforeClose (done) {
                // this.$store.commit('inProject', false);
                this.$emit('closeOleData');
                done();
            },
            fileCountHandle (count) {
                let resData = this.resultData;
                if (count > 5250) {
                    this.titleData2 = (1-resData.sample_dict)*1+(1-resData.scheme_optimization)*1+(1-resData.sting_point)*0.5+(1-resData.gis_uav_splice)*10+(1-resData.cfd_orientation)*0.42+(1-resData.cfd_comprehensive)*0.02+(1-resData.load)*0.1;
                    this.titleData2 = this.titleData2.toFixed(2);
                } else {
                    this.titleData2 = (1-resData.sample_dict)*0.5+(1-resData.scheme_optimization)*0.1+(1-resData.sting_point)*0.5+(1-resData.gis_uav_splice)*4+(1-resData.cfd_orientation)*0.17+(1-resData.cfd_comprehensive)*0.02+(1-resData.load)*0.1;
                    this.titleData2 = this.titleData2.toFixed(2);
                }
            },
            open (projectInfo) {
                this.calcVisible = true;
                this.projectId = projectInfo.project_id.toString();
                this.loadCfdParameter(); // CFD参数查询
                this.loadTowerInfo(); // 测风塔信息查询
                this.loadTurbineInfo(); // 方案风机信息查询
            },
            loadStatus () {
                // 状态查询
                util.ajax.get('/status/' + this.projectId).then(res => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    this.resultData = res.data.data;
                    let resData = res.data.data;
                    this.calcStatus.terrainImage_generation = resData.gis_dsm_dom_server == 1 ? "uploading" : "none";
                    this.calcStatus.sample_dict = resData.sample_dict == 1 ? "uploading" : "none";
                    this.calcStatus.scheme_cost = resData.scheme_optimization == 1 ? "uploading" : "none";
                    this.calcStatus.pricking_point = resData.sting_point == 1 ? "uploading" : "none";
                    this.calcStatus.UAV_data = resData.gis_uav_splice == 1 ? "uploading" : "none";
                    this.calcStatus.cfd_orientation = resData.cfd_orientation == 1 ? "uploading" : "none";
                    this.calcStatus.cfd_comprehensive = resData.cfd_comprehensive == 1 ? "uploading" : "none";
                    this.calcStatus.load_calculation = resData.load == 1 ? "uploading" : "none";
                    this.calcStatus.gis_road = resData.gis_road_station == 1 ? "uploading" : "none";
                    this.calcStatus.gis_power_line = resData.gis_power_line == 1 ? "uploading" : "none";
                    this.calcStatus.p_i_r_r = resData.p_i_r_r == 1 ? "uploading" : "none";
                    this.calcStatus.gis_restrict = resData.gis_restrict == 1 ? "uploading" : "none";
                    let resResult = resData.gis_dsm_dom_server + resData.sample_dict + resData.scheme_optimization + resData.sting_point + resData.gis_uav_splice + resData.cfd_orientation + resData.cfd_comprehensive + resData.load + resData.gis_road_station + resData.gis_power_line+ resData.p_i_r_r + resData.gis_restrict;
                    this.titleData1 =  resResult;

                }).catch(() => {
                    this.$message.error('获取项目数据失败！');
                });
            },
            loadCfdParameter () {
                this.cfdForm = {};
                // this.cfdForm.section_num = '';
                // this.cfdForm.grid_resolution = '';
                // this.rough_filename = '';
                // this.terrain_filename = '';
                util.ajax.get('/input_cfd/' + this.projectId).then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }

                    this.cfdForm.section_num = res.data.data.section_num;
                    this.cfdForm.horizontal_resolution = res.data.data.horizontal_resolution;
                    this.cfdForm.vertical_resolution = res.data.data.vertical_resolution;
                    // this.cfdForm.grid_resolution = res.data.data.grid_resolution;
                    // this.rough_filename = res.data.data.rough_filename;
                    // this.terrain_filename = res.data.data.terrain_filename;
                }).catch(() => {
                    this.$message.error('获取CFD参数失败！');
                });
            },
            loadTowerInfo () {
                this.towerList = [{
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                    filename: ''
                }];
                util.ajax.get('/input_mast/' + this.projectId).then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    if (res.data.data && res.data.data.length > 0) {
                        this.towerList = [];
                        res.data.data.forEach((item) => {
                            this.towerList.push({
                                code: item.mast_name,
                                x: item.coordinate_x,
                                y: item.coordinate_y,
                                height: item.height,
                                filename: item.filename
                            });
                        });
                        this.towerList.sort(function(a, b) {
                            return a.code.toUpperCase() - b.code.toUpperCase();
                        });
                        this.$nextTick(function () {
                            // this.$refs['line8'].refresh();
                            // this.$refs['line4'].refresh();
                        });
                    }
                }).catch(() => {
                    this.$message.error('获取测风塔信息失败！');
                });
            },
            loadTurbineInfo () {
                this.windTurbineList = [{
                    code: '',
                    type: '',
                    x: '',
                    y: '',
                    height: '',
                    powerCurveFile: ''
                }];
                util.ajax.get('/input_turbine/' + this.projectId + '/1').then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    if (res.data.data && res.data.data.length > 0) {
                        this.windTurbineList = [];
                        res.data.data.forEach((item) => {
                            this.windTurbineList.push({
                                code: item.turbine_name,
                                type: item.turbine_type,
                                x: item.coordinate_x,
                                y: item.coordinate_y,
                                height: item.height,
                                powerCurveFile: item.power_curve_filename
                                // powerCurveFile: this.getCurveFilename(item.turbine_type)
                            });
                        });
                        this.$nextTick(function () {
                            // this.$refs['line8'].refresh();
                            // this.$refs['line4'].refresh();
                        });
                    }
                }).catch(() => {
                    this.$message.error('获取风机信息失败！');
                });
            },
            getCurveFilename (turbineType) {
                if (!turbineType) {
                    return '';
                } else {
                    return turbineType.replace(/[^a-zA-Z0-9_]/g, '_') + '.gfwtg';
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    @import '../../styles/common.less';
    .v-modal{
        display: none!important;
    }
    .clear{
        zoom:1;
    }
    .clear::after{
        clear:both;
        content:'';
        display:block;
        width:0;
        height:0;
        visibility:hidden; 
    }
    .title-button{
        float: right;
        width: 124px;
        height: 40px;
        background: rgba(51,200,111,0.5);
        border-radius: 4px;
        border: none;
        margin-top: -27px;
        margin-right: -1px;
        .title-button-p{
            width:57px;
            height:14px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,255,255,1);
            margin: auto;
            line-height: 14px;
        }
    }
    .cacl__container{
        position: relative;
        .cacl-state{
            text-align: center;
            height: 220px;
            width: 760px;
            padding-top: 29px;
            margin: 0 auto;
            span{
                color: #D4EFF6;
                font-size: 14px;
                line-height: 20px;
                opacity: 0.9;
                position: absolute;
            }
            .terrainImage_generation{
                position: absolute;
                top: 79px;
                left: 185px;
            }
            .sample_dict{
                position: absolute;
                top: 79px;
                left: 279px;
            }
            .scheme_cost{
                position: absolute;
                top: 79px;
                left: 405px;
            }

            .pricking_point{
                position: absolute;
                top: 123px;
                left: 65px;
            }
            .UAV_data{
                position: absolute;
                top: 123px;
                left: 150px;
            }
            .cfd_orientation{
                position: absolute;
                top: 123px;
                left: 245px;
            }
            .cfd_comprehensive{
                position: absolute;
                top: 123px;
                left: 340px;
            }
            .load_calculation{
                position: absolute;
                top: 123px;
                left: 435px;
            }
            .gis_road{
                position: absolute;
                top: 123px;
                left: 530px;
            }
            .gis_power_line{
                position: absolute;
                top: 123px;
                left: 627px;
            }
            .p_i_r_r{
                position: absolute;
                top: 123px;
                left: 725px;
            }
            .gis_restrict{
                position: absolute;
                top: 215px;
                left: 185px;
            }
        }
        .cacl-title{
            width: 570px;
            font-family: MicrosoftYaHei-Bold;
            font-size: 20px;
            height: 21px;
            line-height: 20px;
            color: #33C86F;
            margin-left: 154px;
            margin-top: 15px;
            font-weight: bold;
            span{
                color: #B4FF00;
            }
        }
        .param-calc-container {
            margin-left: 49px;
            .showTitle1{
                height:14px;
                font-size:14px;
                font-family:MicrosoftYaHei;
                line-height: 14px;
                margin: 0;
                color: #D4EFF6;
                float: left;
            }
            .showTitle1_icon{
                transform: rotate(90deg);
                margin:0 0 2px 5px;
                color: #D4EFF6;
                height: 14px;
                width: 14px;
                line-height: 14px;
            }
            .showTitleActive_icon{
                transform: rotate(-90deg) !important;
                color: #33C86F;
            }
            .showTitleActive{
                color: #33C86F;
            }
            .progressDetail p{
                height: 12px;
                font-size: 12px;
                line-height: 12px;
                color:#D4EFF6;

            }
            .status_p{
                margin: 0 !important;
                width: 83px !important;
                height: 33px !important;
                font-size: 14px !important;
                line-height: 33px !important;
                float: left;
                font-family:MicrosoftYaHei;
                overflow: hidden;
            }
            .status1{
                /* height: 33px; */
                width: 100%;
                .content1{
                    width: 699px;
                    float: left;
                    /* float: right; */
                    border-style: solid;
                    border-width: 1px;
                    border-color: rgba(159,164,162,0.5);
                    font-family:MicrosoftYaHei;
                    p{
                        height: 32px;
                        float: left;
                        font-size: 14px;
                        margin-bottom: 0;
                        margin-top: 0;
                        line-height: 32px;
                        opacity: 0.9;
                    }
                }
                .content2{
                    width: 699px;
                    float: left;
                    /* float: right; */
                    border-style: solid;
                    border-width: 1px;
                    border-color: rgba(159,164,162,0.5);
                    font-family:MicrosoftYaHei;
                    .cell{

                    }
                }
            }
        }
    }

</style>
