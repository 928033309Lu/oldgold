<template>
    <el-dialog title="数据计算中" :modal="false" :close-on-click-modal="false" :visible.sync="calcVisible"  width="900px" :top="topValue" class="jisuan cacl_dialg scroll" :before-close="beforeClose">
        <div class="cacl__container">
            <div class="cacl-title">
                <!-- 数据计算中，已完成 <span>{{titleData1}}</span>/{{total}} ，预计剩余<span>{{titleData2}}</span>，请等待... -->
                数据计算中，已完成 <span>{{titleData1}}</span>/{{total}} ，请等待...
            </div>
            <button v-show="canStopCalculation" class="title-button" @click="stopCalculation">
                <p class="title-button-p">中止计算</p>
            </button>
            <button style="margin-right: 10px" v-show="canConnection" class="title-button" @click="connection">
                <p class="title-button-p">联系运维管理员</p>
            </button>
            <button style="margin-right: 10px" v-show="canConnectionUser" class="title-button" @click="connectionUser">
                <p class="title-button-p">联系用户</p>
            </button>
            <!-- <button v-show="changeGFWT" class="change-button" @click="openGFWT">
                <span>切换</span>
            </button> -->

            <div class="cacl-state">
                <span style="top: 45px;left: 166px;">地形<br>影像发布</span>
                <upload-status-indicator style="padding-top: 10px" label="" :status="calcStatus.terrainImage_generation" class="terrainImage_generation"/>
                <span style="top: 45px;left: 260px;">流体仿真<br>图谱提取</span>
                <upload-status-indicator style="padding-top: 10px" label="" :status="calcStatus.sample_dict" class="sample_dict"/>
                <span style="top: 45px;left: 386px;">自动<br>优化排布</span>
                <upload-status-indicator style="padding-top: 10px" label="" :status="calcStatus.scheme_cost" class="scheme_cost"/>

                <a v-if="operationRole&&shwoPrickItem" target="_blank" v-bind:href="pricking_point_href">
                    <upload-status-indicator v-if="operationRole&&shwoPrickItem" style="padding-top: 10px" label="内业刺点" :status="calcStatus.pricking_point" class="pricking_point"/>
                </a>
                
                <upload-status-indicator style="padding-top: 10px" label="无人机<br>数据处理" :status="calcStatus.UAV_data" class="UAV_data"/>
                <upload-status-indicator style="padding-top: 10px" label="CFD<br>定向计算" :status="calcStatus.cfd_orientation" class="cfd_orientation"/>

                <upload-status-indicator style="padding-top: 10px" label="CFD<br>综合计算" :status="calcStatus.cfd_comprehensive" class="cfd_comprehensive"/>
                <upload-status-indicator style="padding-top: 10px" label="载荷计算" :status="calcStatus.load_calculation" class="load_calculation"/>
                <upload-status-indicator style="padding-top: 10px" label="道路\升压<br>站设计" :status="calcStatus.gis_road" class="gis_road"/>
                <upload-status-indicator style="padding-top: 10px" label="输电线路<br>设计" :status="calcStatus.gis_power_line" class="gis_power_line"/>
                <upload-status-indicator style="padding-top: 10px" label="经济性评价" :status="calcStatus.p_i_r_r"  class="p_i_r_r"/>

                <span style="top: 215px;left: 212px;">限制<br>因素提取</span>
                <upload-status-indicator style="padding-top: 10px" label="" :status="calcStatus.gis_restrict" class="gis_restrict"/>

            </div>

            <div class="param-calc-container">
                <div @click="show1 = !show1" style="cursor: pointer;width: 110px;margin-top:10px;margin-bottom: 10px">
                    <p class="showTitle1"  v-bind:class="{ showTitleActive: show1}">进度详情</p>
                    <icon class="showTitle1_icon" v-bind:class="{ showTitleActive_icon: show1}" name="arrow-right-copy"></icon>
                </div>
                <div >
                    <el-collapse-transition>
                        <div class="progressDetail" v-show="show1">
                            <p v-show="jinduListshow" v-for="item in jinduList" v-bind:class="{ active_err: item[0]==='ERROR'}">{{item[1]}}</p>
                            <p v-show="!jinduListshow">暂无数据</p>
                        </div>
                    </el-collapse-transition>
                </div>
                <div @click="show2 = !show2" style="cursor: pointer;width: 110px;margin-top:30px;margin-bottom: 10px">

                    <p style="" class="showTitle1"  v-bind:class="{ showTitleActive: show2}">原始计算数据</p>
                    <icon class="showTitle1_icon" v-bind:class="{ showTitleActive_icon: show2}" name="arrow-right-copy"></icon>
                </div>
                <calculatingFolder style="display:none;" v-on:fileCount="fileCountHandle" :project_id="projectId"></calculatingFolder>
                <div style="width: 800px;">
                    <el-collapse-transition>
                        <div class="progressDetail" v-show="show2">
                            <!--<div class="status1">-->
                                <!--<p class="status_p">无人机</p>-->
                                <!--<div class="content1">-->
                                    <!---->
                                <!--</div>-->
                            <!--</div>-->
                            <div class="status1 clear">
                                <p class="status_p" v-show="isCheckGFWT!='1'">仿真参数</p>
                                <p class="status_p" v-show="isCheckGFWT=='1'">WT定向成果</p>
                                <div class="content1">
                                    <p style="margin-left: 16px">扇区数：<em style="color: #33C86F;font-style: inherit;">{{cfdForm.section_num}}</em></p>
                                    <p v-show="isCheckGFWT!='1'" style="margin-left: 95px;">水平网格分辨率：<em style="color: #33C86F;font-style: inherit;">{{cfdForm.horizontal_resolution}}</em></p>
                                    <p v-show="isCheckGFWT!='1'" style="margin-left: 95px;">垂直网格分辨率：<em style="color: #33C86F;font-style: inherit;">{{cfdForm.vertical_resolution}}</em></p>
                                </div>
                            </div>
                            <div class="status1 clear">
                                <p class="status_p">测风塔</p>
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
                    </el-collapse-transition>
                </div>
            </div>
            <!-- 画线 -->
            <gf-line v-if="operationRole&&shwoPrickItem" from-selector=".cacl__container .pricking_point"
                     to-selector=".cacl__container .UAV_data"
                     from-position-y="top"
                     to-position-y="top"
                     :from-offset-y="20"
                     :from-offset-x="15"
                     :to-offset-y="20"
                     :to-offset-x="-15"
                     orientation="horizontal"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .UAV_data"
                     to-selector=".cacl__container .cfd_orientation"
                     from-position-y="top"
                     to-position-y="top"
                     :from-offset-y="20"
                     :from-offset-x="15"
                     :to-offset-y="20"
                     :to-offset-x="-15"
                     orientation="horizontal"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .cfd_orientation"
                     to-selector=".cacl__container .cfd_comprehensive"
                     from-position-y="top"
                     to-position-y="top"
                     :from-offset-y="20"
                     :from-offset-x="15"
                     :to-offset-y="20"
                     :to-offset-x="-15"
                     orientation="horizontal"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .cfd_comprehensive"
                     to-selector=".cacl__container .load_calculation"
                     from-position-y="top"
                     to-position-y="top"
                     :from-offset-y="20"
                     :from-offset-x="15"
                     :to-offset-y="20"
                     :to-offset-x="-15"
                     orientation="horizontal"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .load_calculation"
                     to-selector=".cacl__container .gis_road"
                     from-position-y="top"
                     to-position-y="top"
                     :from-offset-y="20"
                     :from-offset-x="15"
                     :to-offset-y="20"
                     :to-offset-x="-15"
                     orientation="horizontal"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .gis_road"
                     to-selector=".cacl__container .gis_power_line"
                     from-position-y="top"
                     to-position-y="top"
                     :from-offset-y="20"
                     :from-offset-x="15"
                     :to-offset-y="20"
                     :to-offset-x="-15"
                     orientation="horizontal"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .gis_power_line"
                     to-selector=".cacl__container .p_i_r_r"
                     from-position-y="top"
                     to-position-y="top"
                     :from-offset-y="20"
                     :from-offset-x="15"
                     :to-offset-y="20"
                     :to-offset-x="-15"
                     orientation="horizontal"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .terrainImage_generation"
                     to-selector=".cacl__container .UAV_data"
                     from-position-x="center"
                     from-position-y="bottom"
                     to-position-x="center"
                     to-position-y="top"
                     :from-offset-y="0"
                     :from-offset-x="-2"
                     :to-offset-y="7"
                     :to-offset-x="0"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .sample_dict"
                     to-selector=".cacl__container .cfd_orientation"
                     from-position-x="center"
                     from-position-y="bottom"
                     to-position-x="center"
                     to-position-y="top"
                     :from-offset-y="0"
                     :from-offset-x="-2"
                     :to-offset-y="7"
                     :to-offset-x="0"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .scheme_cost"
                     to-selector=".cacl__container .cfd_comprehensive"
                     from-position-x="center"
                     from-position-y="bottom"
                     to-position-x="center"
                     to-position-y="top"
                     :from-offset-y="0"
                     :from-offset-x="-20"
                     :to-offset-y="7"
                     :to-offset-x="10"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .UAV_data"
                     to-selector=".cacl__container .gis_restrict"
                     from-position-x="center"
                     from-position-y="bottom"
                     to-position-x="center"
                     to-position-y="top"
                     :from-offset-y="0"
                     :from-offset-x="0"
                     :to-offset-y="0"
                     :to-offset-x="0"
                     color="#33C86F"
                     :opacity="0.5"/>
            <gf-line from-selector=".cacl__container .scheme_cost"
                     to-selector=".cacl__container .load_calculation"
                     from-position-x="center"
                     from-position-y="bottom"
                     to-position-x="center"
                     to-position-y="top"
                     :from-offset-y="0"
                     :from-offset-x="20"
                     :to-offset-y="5"
                     :to-offset-x="-15"
                     color="#33C86F"
                     :opacity="0.5"/>
        </div>
    </el-dialog>

</template>

<script>
    import calculatingFolder from '../project/calculatingFolder';
    import UploadStatusIndicator from '../parameter-upload/upload-status-indicator';
    import FileUploader from '../fileupload/file-uploader';
    import GfLine from '../common/gf-line';
    import util from '../../libs/util';
    export default {
        name: 'project-calculating',
        components: {
            UploadStatusIndicator,
            FileUploader,
            GfLine,
            calculatingFolder
        },
        props:{
            projects:{
                type: Array,
                default: []
            }
        },
        data () {
            return {
                clientHeight: 1080,
                topValue: "5%",
                resultData: {},
                operationRole: false,
                pricking_point_href: '',
                calcVisible: false,
                title: '数据计算中，已完成0/10，请等待......',
                titleData2: 0,
                show1: true,
                show2: false,
                projectId: 0,
                canStopCalculation: true,
                canConnection: false,
                canConnectionUser: false,
                jinduListshow: false,
                jinduList: [],
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
                    section_num: '',
                    grid_resolution: '',
                    vertical_resolution: '',
                    horizontal_resolution: ''
                },
                terrain_filename: '',
                rough_filename: '',
                statusData: null,
                shwoPrickItem: false,
                isCheckGFWT: 0,     //0 GF   1 WT    
                isPrickItem: 0,     //0  来自无人机  1  已有地形
                num : 0 ,           //要减多少的总数 
                isTip : true
            };
        },
        created () {
            this.clientHeight = `${document.documentElement.clientWidth}`;
            if (this.clientHeight > 1400) {
                this.topValue = '4%';
            } else {
                this.topValue = '4%';
            }
        },
        watch:{
            '$store.state.app.projectDataSet': function (val) {
                // console.log(val,"模式")
                // 是否显示内业刺点项
                let projectDataSet = val;
                if (projectDataSet && String(projectDataSet.project_id) === this.projectId) {
                    // uav_type 0:来自无人机数据；1：上传的已有地形；null：新建项目的或者没有上传数据的或无此项目
                    // projectDataSet.mesh_type==0 GF /  ==1  WT
                //    this.shwoPrickItem = projectDataSet.uav_type === 0; // 只有当地形来自无人机数据时才显示内业刺点步骤 
            }    
                //0 GF   1 WT    
                this.isCheckGFWT = projectDataSet.mesh_type;
                //0:来自无人机数据；1：上传的已有地形
                this.isPrickItem = projectDataSet.uav_type;  
                // this.isCheckGFWT = 1;
                // this.isPrickItem = 1;
                // this.getGrey();
                // console.log("进度页:",this.operationRole)
            }
        },
        computed: {
            total () {
                let userInfo = this.$store.state.user.loginUserInfo;
                // console.log(userInfo,"userInfo")
                if ((userInfo.role=='1')||(userInfo.role=='8')) {
                    // return this.shwoPrickItem?'12':"11";
                    return "12"-this.num
                } else {
                    // return this.shwoPrickItem?'11':"10";
                    return "12"-this.num
                }

               
            },
            titleData1 (){
                if(!this.statusData) return 1;
                return (this.statusData.gis_dsm_dom_server <= 0 || this.statusData.gis_dsm_dom_server == 2 ? 0 : 1) 
                + (this.statusData.sample_dict <= 0 || this.statusData.sample_dict == 2? 0 : 1) 
                + (this.statusData.scheme_optimization <= 0 || this.statusData.scheme_optimization == 2 ? 0 : 1) 
                + (this.statusData.sting_point <= 0 || !this.shwoPrickItem || this.statusData.sting_point == 2? 0 : 1) 
                + (this.statusData.gis_uav_splice <= 0 || this.statusData.gis_uav_splice == 2 ? 0 : 1) 
                + (this.statusData.cfd_orientation <= 0 || this.statusData.cfd_orientation == 2 ? 0 : 1) 
                + (this.statusData.cfd_comprehensive <= 0 || this.statusData.cfd_comprehensive == 2 ? 0 : 1) 
                + (this.statusData.load <= 0 || this.statusData.load == 2? 0 : 1) 
                + (this.statusData.gis_road_station <= 0 || this.statusData.gis_road_station == 2 ? 0 : 1) 
                + (this.statusData.gis_power_line <= 0 || this.statusData.gis_power_line == 2 ? 0 : 1)
                + (this.statusData.p_i_r_r <= 0 || this.statusData.p_i_r_r == 2? 0 : 1) 
                + (this.statusData.gis_restrict <= 0 || this.statusData.gis_restrict == 2 ? 0 : 1);
            },
        },
        methods: {
            getGrey(arr,n){
                
                var numArr = arr.filter((item,index)=>{
                    return item == 2
                })
                
                this.num = numArr.length ;
                console.log(numArr,"length",this.num)
                // console.log(numArr,"Arr")
                // console.log(arrb,"Arr")
            },
            //进入项目
            openPreject(p_i_r_r , a){
                // console.log(a)
                // p_i_r_r = 1        //===========记得注释，测试用
                if( a == -1 && p_i_r_r == 1){
                    //重新获取项目列表--home--getProjects()--断点看刷新两次了
                    this.$emit('getProject');
                    if(this.isTip){

                        this.$confirm('是否进入项目?', '数据计算完成', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(() => {
                            //进入对应项目
                            //筛选
                            this.projects.forEach((item,index)=>{
                                if(item.project_id == this.projectId){
                                    // console.log(item,"item")
                                    this.isTip = false;
                                    //进入项目
                                    this.$emit('projectClicked', item ,1);
                                    setTimeout(()=>{
                                        this.isTip = true;
                                    },1000)
                                }
                            })
                            
                        }).catch(() => {
                        
                        });
                    }
                }
            },
            // 停止计算
            stopCalculation () {
                this.$confirm('点击[确定]按钮将中止计算，并删除所有中间过程数据，项目回滚到上传数据状态，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('projectOverCal', true);
                    this.$store.commit('globeLoading', {loading: true, text: '正在中止计算...'});
                    util.ajax.post('/stop_calculation/' + this.projectId).then(res => {
                        this.$store.commit('globeLoading', {loading: false, text: ''});
                        // if (res.data.code === 404) {
                        //     return;
                        // }
                        // 【中止计算】-已有地形中止计算，在发起计算；计算中一直有等待图标。 2018/12/21 阿汤哥
                        if (res.data.code !== 200) {
                            this.$message.error(res.data.message);
                            this.$emit('projectOverCal', false);
                            return;
                        }
                        if (res.data.data === 'success') {
                            this.$emit('projectOverCal', false, true);
                            this.$message.success('中止计算成功！');
                            this.calcVisible = false;
                        }
                    }).catch((/* err */) => {
                        this.$store.commit('globeLoading', {loading: false, text: ''});
                        this.$emit('projectOverCal', false);
                        this.$message.error('中止计算失败！');
                    });


                }).catch(() => {});
            },
            // 联系用户
            connectionUser () {
                let userInfo = this.$store.state.user.loginUserInfo;
                this.$prompt('', '联系用户', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCancelButton: false
                }).then(({ value }) => {
                    let data = {
                        args: value
                    };
                    util.ajax.post('/read_log/' + this.projectId, data).then(res => {
                        if (res.data.code === 404) {
                            return;
                        }
                        if (res.data.code !== 200) {
                            this.$message.error(res.data.message);
                            return;
                        }
                        this.$message('提交成功！');
                    });
                }).catch(() => {

                });
            },
            // 联系运维管理员
            connection () {
                let userInfo = this.$store.state.user.loginUserInfo;
                this.$prompt('项目计算状态已通知运维管理员，请留下您的附言：', '联系运维管理员', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCancelButton: false
                }).then(({ value }) => {
                    let data = {
                        msg: value
                    };
                    util.ajax.post('/Contact_admin/' + userInfo.user_id + '/' + this.projectId, data).then(res => {
                        if (res.data.code === 404) {
                            return;
                        }
                        if (res.data.code !== 200) {
                            this.$message.error(res.data.message);
                            return;
                        }
                        this.$message('提交成功！');
                    });
                }).catch(() => {

                });
            },
            // 关闭前回调
            beforeClose (done) {
                this.show2 = false;
                this.$store.commit('inProject', false);
                done();
                this.$emit("close");
            },
            fileCountHandle (count) {
                let resData = this.resultData;
                this.getRootFolderFull('').then(data=>{
                    let counter = 0;
                    for (let item in data) {
                        counter += data[item].number;
                    }
                    if (counter > 5250) {
                        this.titleData2 = ((1-resData.sample_dict)*1+(1-resData.scheme_optimization)*1+(1-resData.sting_point)*0.5+(1-resData.gis_uav_splice)*10+(1-resData.cfd_orientation)*0.42+(1-resData.load)*0.1).toFixed(0)+'天'+(parseInt(((1-resData.sample_dict)*1+(1-resData.scheme_optimization)*1+(1-resData.sting_point)*0.5+(1-resData.gis_uav_splice)*10+(1-resData.cfd_orientation)*0.42+(1-resData.load)*0.1).toString().split(".")[1].slice(0,2))*0.24+(1-resData.cfd_comprehensive)*0.02).toFixed(2)+'小时';
                    } else {
                        this.titleData2 = ((1-resData.sample_dict)*0.5+(1-resData.scheme_optimization)*0.1+(1-resData.sting_point)*0.5+(1-resData.gis_uav_splice)*4+(1-resData.cfd_orientation)*0.17+(1-resData.load)*0.1).toFixed(0)+'天'+(parseInt(((1-resData.sample_dict)*0.5+(1-resData.scheme_optimization)*0.1+(1-resData.sting_point)*0.5+(1-resData.gis_uav_splice)*4+(1-resData.cfd_orientation)*0.17+(1-resData.load)*0.1).toString().split(".")[1].slice(0,2))*0.24+(1-resData.cfd_comprehensive)*0.02).toFixed(2)+'小时';
                    }
                }).catch(err=>console.log(err))
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
            // s3查询根目录文件夹
            getRootFolder ( path ) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_folder', {
                        project_id: this.projectId,
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
            // s3统计文件大小
            getFolderSize (folderPath) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_size', {
                        project_id: this.projectId,
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
            // s3显示文件数量
            getFolderCount (folderPath) {
                return new Promise((resolve, reject)=>{
                    util.ajax.post('/s3_filecount', {
                        project_id: this.projectId,
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
            // 获取路径
            getPath(str) {
                return str.substring(str.indexOf('/')+4,str.length-1)
            },
            open (projectInfo) {
                this.calcVisible = true;
                this.projectId = projectInfo.project_id.toString();
                // let userInfo = JSON.parse(window.sessionStorage.getItem('goldfarm.loginUser'));
                let userInfo = this.$store.state.user.loginUserInfo;
                if (userInfo.role=='3') {
                    this.canStopCalculation = false;
                    this.canConnection = false;
                    this.canConnectionUser = false;
                    this.operationRole = false;
                } else if (userInfo.role=='1') {
                    this.pricking_point_href = util.prickPageUrl+'?name=' + projectInfo.project_name + '&id=' + projectInfo.project_id;
                    this.operationRole = true;
                    this.canStopCalculation = true;
                } else if (userInfo.role=='8') {
                    this.operationRole = true;
                    this.pricking_point_href = util.prickPageUrl+'?name=' + projectInfo.project_name + '&id=' + projectInfo.project_id;
                    this.canStopCalculation = false;
                    this.canConnection = false;
                    this.canConnectionUser = false;
                }else if ((userInfo.role=='2')||(userInfo.role=='4')) {
                    this.operationRole = false;
                    this.canStopCalculation = true;
                    this.canConnection = true;
                    this.canConnectionUser = false;
                } else if (userInfo.role=='7') {
                    this.operationRole = false;
                    this.canStopCalculation = true;
                    this.canConnection = false;
                    this.canConnectionUser = true;
                }
                // this.projectId = 1;
                this.loadStatus(); // 状态查询
                this.loadjindu(); // 状态详细进度
                this.loadCfdParameter(); // CFD参数查询
                this.loadTowerInfo(); // 测风塔信息查询
                this.loadTurbineInfo(); // 方案风机信息查询
            },
            loadjindu () {
                util.ajax.get('/read_log/' + this.projectId).then(res => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    this.checkJinduList(res.data.data);
                });
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
                    this.statusData = resData;
                    //内业刺点项-隐藏
                this.shwoPrickItem = resData.sting_point != 2; 
                    //测试
                    // this.statusData.gis_dsm_dom_server = 0;
                    // this.statusData.sample_dict = 0;
                    // this.statusData.scheme_optimization = 0;
                    // this.statusData.sting_point = 2;
                    // this.statusData.gis_uav_splice = 2;
                    // this.statusData.cfd_orientation = 2;
                    // this.statusData.cfd_comprehensive = 1;
                    // this.statusData.load = 1;
                    // this.statusData.gis_road_station = 1;
                    // this.statusData.gis_power_line = 1;
                    // this.statusData.p_i_r_r = 1;
                    // this.statusData.gis_restrict = 1;
                    // resData.gis_uav_splice = 2
                    // resData.cfd_orientation = 2

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

                    this.calcStatus.terrainImage_generation = resData.gis_dsm_dom_server == -2 ? "mistake" : this.calcStatus.terrainImage_generation;
                    this.calcStatus.sample_dict = resData.sample_dict == -2 ? "mistake" : this.calcStatus.sample_dict;
                    this.calcStatus.scheme_cost = resData.scheme_optimization == -2 ? "mistake" : this.calcStatus.scheme_cost;
                    this.calcStatus.pricking_point = resData.sting_point == -2 ? "mistake" : this.calcStatus.pricking_point;
                    this.calcStatus.UAV_data = resData.gis_uav_splice == -2 ? "mistake" : this.calcStatus.UAV_data;
                    this.calcStatus.cfd_orientation = resData.cfd_orientation == -2 ? "mistake" : this.calcStatus.cfd_orientation;
                    this.calcStatus.cfd_comprehensive = resData.cfd_comprehensive == -2 ? "mistake" : this.calcStatus.cfd_comprehensive;
                    this.calcStatus.load_calculation = resData.load == -2 ? "mistake" : this.calcStatus.load_calculation;
                    this.calcStatus.gis_road = resData.gis_road_station == -2 ? "mistake" : this.calcStatus.gis_road;
                    this.calcStatus.gis_power_line = resData.gis_power_line == -2 ? "mistake" : this.calcStatus.gis_power_line;
                    this.calcStatus.p_i_r_r = resData.p_i_r_r == -2 ? "mistake" : this.calcStatus.p_i_r_r;
                    this.calcStatus.gis_restrict = resData.gis_restrict == -2 ? "mistake" : this.calcStatus.gis_restrict;

                    //2置灰
                    this.calcStatus.terrainImage_generation = resData.gis_dsm_dom_server == 2 ? "grey" : this.calcStatus.terrainImage_generation;
                    this.calcStatus.sample_dict = resData.sample_dict == 2 ? "grey" : this.calcStatus.sample_dict;
                    this.calcStatus.scheme_cost = resData.scheme_optimization == 2 ? "grey" : this.calcStatus.scheme_cost;
                    this.calcStatus.pricking_point = resData.sting_point == 2 ? "grey" : this.calcStatus.pricking_point;
                    this.calcStatus.UAV_data = resData.gis_uav_splice == 2 ? "grey" : this.calcStatus.UAV_data;
                    this.calcStatus.cfd_orientation = resData.cfd_orientation == 2 ? "grey" : this.calcStatus.cfd_orientation;
                    this.calcStatus.cfd_comprehensive = resData.cfd_comprehensive == 2 ? "grey" : this.calcStatus.cfd_comprehensive;
                    this.calcStatus.load_calculation = resData.load == 2 ? "grey" : this.calcStatus.load_calculation;
                    this.calcStatus.gis_road = resData.gis_road_station == 2 ? "grey" : this.calcStatus.gis_road;
                    this.calcStatus.gis_power_line = resData.gis_power_line == 2 ? "grey" : this.calcStatus.gis_power_line;
                    this.calcStatus.p_i_r_r = resData.p_i_r_r == 2 ? "grey" : this.calcStatus.p_i_r_r;
                    this.calcStatus.gis_restrict = resData.gis_restrict == 2 ? "grey" : this.calcStatus.gis_restrict;

                    let a = [resData.gis_dsm_dom_server, resData.sample_dict, resData.scheme_optimization, resData.sting_point, resData.gis_uav_splice, resData.cfd_orientation, resData.cfd_comprehensive, resData.load, resData.gis_road_station, resData.gis_power_line, resData.p_i_r_r, resData.gis_restrict].indexOf(-2);
                    if (a > -1) {
                        let userInfo = this.$store.state.user.loginUserInfo;
                        if ((userInfo.role=='1')||(userInfo.role=='2')||(userInfo.role=='4')) {
                            this.canConnection = true;
                        }
                        if ((userInfo.role=='1')||(userInfo.role=='7')) {
                            this.canConnectionUser = true;
                        }
                    }else {
                        this.canConnection = false;
                        this.canConnectionUser = false;
                    }
                    let arr = [resData.gis_dsm_dom_server, 
                    resData.sample_dict, 
                    resData.scheme_optimization, 
                    resData.sting_point, 
                    resData.gis_uav_splice, 
                    resData.cfd_orientation, 
                    resData.cfd_comprehensive, 
                    resData.load, 
                    resData.gis_road_station, 
                    resData.gis_power_line, 
                    resData.p_i_r_r, 
                    resData.gis_restrict]
                    if(resData.sting_point == 2){

                        this.getGrey(arr,1)
                    }
                    this.getGrey(arr,0)

                     //判断无异常而且经评也完成了，进入项目
                     this.openPreject( resData.p_i_r_r , a );
                }).catch(() => {
                    this.$message.error('获取项目数据失败！');
                });
            },
            loadCfdParameter () {
                this.cfdForm.section_num = '';
                this.cfdForm.grid_resolution = '';
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
                    this.cfdForm.grid_resolution = res.data.data.grid_resolution;
                    this.rough_filename = res.data.data.rough_filename;
                    this.terrain_filename = res.data.data.terrain_filename;
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
                            return parseInt(a.code) - parseInt(b.code) || a.code.toUpperCase() - b.code.toUpperCase() ;
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
                        this.windTurbineList.sort(function(a, b) {
                            return parseInt(a.code) - parseInt(b.code) || a.code.toUpperCase() - b.code.toUpperCase() ;
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
            },
            checkJinduList (data) {
                data = data || [];
                if (data.length > 0) {
                    // 日志信息倒序排列
                    this.jinduList = data.reverse();
                    this.jinduListshow = true;
                } else {
                    this.jinduList = data;
                    this.jinduListshow = false;
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
    .title-button , .change-button{
        float: right;
        width: 110px;
        height: 30px;
        background: rgba(51, 200, 111, 0.5);
        border-radius: 4px;
        border: none;
        margin-top: -27px;
        .title-button-p{
            width:98px;
            height:12px;
            font-size:12px;
            font-family:MicrosoftYaHei;
            color:rgba(255,255,255,1);
            margin: auto;
            line-height: 12px;
            cursor:pointer;
        }
    }
    .change-button{
        width: 80px !important; 
        margin-right: 5px;
        span{
            display: block;
            font-size:12px;
            font-family:MicrosoftYaHei;
            color:rgba(255,255,255,1);
            margin: auto;
            line-height: 12px;
            cursor:pointer;
        }
    }
    .cacl__container{
        position: relative;
        width: 860px;
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
            font-size: 18px;
            height: 21px;
            line-height: 18px;
            color: #33C86F;
            margin-left: 50px;
            margin-top: 15px;
            font-weight: bold;
            span{
                color: #B4FF00;
            }
        }
        .param-calc-container {
            /* margin-left: 49px; */
            margin-left: 35px;
            .active_err{
                color: red!important;
            }
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
                width: 85px !important;
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
                    /* float: left; */
                    float: right;
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
                    /* float: left; */
                    float: right;
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
