<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./cesium-container.less";
</style>

<template>
    <div class="container" :style="{cursor:startMoving?'move':''}">
        <div id="cesiumContainer"></div>
        <div id="threeContainer"></div>
        <project-tooltip ref="tooltip2" @closeVisible="closeVisible" @projectClicked="projectClicked1" :visible="projectInfo.visible" :selectedArray="selectedArray" :project="projectInfo.project" :position="projectInfo.position"></project-tooltip>
        <tower-detail :visible="towerInfo.show" :project="towerInfo.towerInfo" :position="towerInfo.position" ></tower-detail>
        <fan-bar ref="fanBar"></fan-bar>
        <img src="../../images/moveTip.png" v-show="moveInfo.visible" :style="{left:(moveInfo.position.x - 230)+'px',top:(moveInfo.position.y - 135)+'px', position: 'absolute'}">
        <status-bar v-show="displayStatusBar"></status-bar>
        <compass @auto-north="autoNorth"></compass>
    </div>
</template>

<script>
import Viewer from './cesium';
import cesiumLayer from './cesiumLayer/cesiumLayer.js';
import ProjectTooltip from './project-tooltip.vue';
import FanBar from '../fan/fan-bar';
import towerDetail from './towerDetail';
import StatusBar from './status-bar';
import Compass from './compass';
import util from '@/libs/util';

export default {
    name: 'CesiumContainer',
    components: {
        Compass,
        FanBar,
        ProjectTooltip,
        StatusBar,
        towerDetail
    },
    props: {
        projects: Array,
        canAddFan: {
            type: Boolean,
            default: false
        },
        evaluationCalculating: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            displayStatusBar: true,
            fans: Array,
            masts: Array,
            projectInfo: {
                visible: false,
                position: {
                    x: 0,
                    y: 0
                },
                project: {}
            },
            towerInfo: {
                towerInfo: {},
                show: false,
                position: {}
            },
            // changeTowerType: {
            //     towerInfo: {},
            //     winPos: {},
            //     show: false
            // },
            moveInfo: {
                visible: false,
                position: {
                    x: 0,
                    y: 0
                }
            },
            startEdited: false,
            startMoving: false,
            newArr: [],  //渲染地球风机图标
            selectedArr: [],   //二维数组格式
            farmPositions2:[], //一维数组格式
            selectedArray:[] ,  //筛选后的数组
            newArr2:[],
            
        };
    },
    computed: {
        hoverProjectInfo () {
            return this.$store.state.app.hoverProjectInfo;
        },
        moveFanInfo () {
            return this.$store.state.app.moveFanInfo;
        },
        clickTowerInfo () {
            return this.$store.state.app.getTowerInfo;
        },
        clickTowerChange () {
            return this.$store.state.app.changeTowerType;
        },
        isShowChengguo () {
            if(this.$store.state.app.noneChengguo){
                return true;
            }else{
                return false;
            }
        },
        enManager: function () {
            if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                return true;
            }else{
                return false;
            }
        },
        formEpsg (){
            return this.$store.state.app.formEpsg
        }
    },
    watch: {
        
        projects: function (val) {
            // console.log(val);
            if (window.viewer) {
                this.initFarmPositions();
            }
        },
        hoverProjectInfo: function (newVal) {
            this.projectInfo.visible = newVal.bool;
            this.selectedArray = [];
            if (newVal.bool) {
                this.projectInfo.position.x = newVal.clientX;
                this.projectInfo.position.y = newVal.clientY;
                this.filterPositions2(this.projects);
                // this.projectInfo.project = this.newArr2[newVal.projectid];
                //给三维传了ID，返回的就变成ID，遍历就换以下
                this.newArr2.map((item,index)=>{
                   if(item.project_id == newVal.projectid){
                    this.projectInfo.project = item;
                   }
                }) 
                // console.log(this.newArr2)
                // console.log(newVal.projectid,"第几个",this.projects[newVal.projectid],this.newArr2[newVal.projectid])
                //筛选后再传数据
                // this.farmPositions2.forEach((item,index)=>{
                //     if(item.longitude == this.newArr2[newVal.projectid].longitude && item.latitude == this.newArr2[newVal.projectid].latitude){
                //         this.selectedArray.push(item)
                //         // this.projectInfo.project = this.selectedArray[0];
                //     }
                // })
                //给三维传了ID，返回的就变成ID，遍历就换以下
                this.farmPositions2.map((item,index)=>{
                    if(item.longitude == this.projectInfo.project.longitude && item.latitude == this.projectInfo.project.latitude){
                        // console.log(item)
                        this.selectedArray.push(item)
                    }
                })
            }else{
            //    console.log(this.$refs['mySelect'])
               this.selectedClose()
            }
        },
        clickTowerInfo: function (newVal) {
            // console.log( newVal.show)
            this.towerInfo.show = newVal.show;
            if (newVal.show) {
                this.towerInfo.position = newVal.position;
                this.towerInfo.towerInfo = newVal.towerInfo;
            }
        },
        // clickTowerChange: function (newVal) {
        //     this.towerChangeInfo.show = newVal.show;
        //     if (newVal.show) {
        //         this.towerInfo.position = newVal.position;
        //         this.towerInfo.towerInfo = newVal.towerInfo;
        //     }
        // },
        moveFanInfo: function (newVal) {
            console.log( newVal.bool)
            this.moveInfo.visible = newVal.bool;
            if (newVal.bool) {
                this.moveInfo.position.x = newVal.clientX;
                this.moveInfo.position.y = newVal.clientY;
            }
        },
        startEdited: function (val) {
            if (!val) {
                this.$refs['fanBar'].show(false);
            }
        }
    },
    mounted () {
        window.viewer = new Viewer('#cesiumContainer', '#threeContainer');
        const self = this;
        window.viewer.registerFarmClickListener && window.viewer.registerFarmClickListener((id, lng, lat) => {
            console.log(`注册风场点击时间${lng},${lat}`);
            if (!self.projects) {
                return;
            }
            self.projectInfo.visible = false;
            // 原来的进入项目index==>>变id
            // console.log(id)
            // console.log(this.projectInfo.project)
            self.$emit('projectClicked', this.projectInfo.project, 1 );
            // self.$emit('projectClicked', self.projects[index], 1);
            // self.$emit('projectClicked', this.newArr2[index], 1);
        });
        window.viewer.viewer.cesiumWidget.creditContainer.style.display = 'none';
        if (this.projects && this.projects.length > 0) {
            // this.initFarmPositions();
        }

        // 添加点击风机回调函数
        // 其实这个回调函数是监听风场点击事件，只不过带turbineID就是点击到风机了
        window.viewer.registerFanClickListener && window.viewer.registerFanClickListener((turbineID, clientX, clientY, lng, lat) => {
            //不选择上传“发电量成果”，... 且 点击单个风机不显示发电量成果窗口；
            if(!self.isShowChengguo && self.enManager){
                return;
            } 
            if (!self.fans) {
                return;
            }
            if (self.clickTowerChange.isShow) {
                self.$emit('showTowerChange');
            }
            // console.log(self.clickTowerChange);
            // 判断是否处于编辑状态
            if (!self.startEdited) {
                // 判断是否点击到风机
                if (turbineID !== null) {
                    const fanData = self.fans.filter((data) => {
                        return (data.turbine_id === turbineID);
                    });
                    // console.log(fanData);
                    if (fanData.length > 0) {
                        self.$emit('fanClick', 'electric', turbineID, fanData[0], null, clientX, clientY);
                    } else {
                        self.$emit('fanClick', 'electric', turbineID, null);
                    }
                }
                return this.$emit('closeFanDetails');
            }
            console.log('turbineID=' + turbineID + ' clientX=' + clientX + ' clientY=' + clientY);
            if (turbineID !== null) {
                const fanData = self.fans.filter((data) => {
                    // console.log(data.turbine_id);
                    return (data.turbine_id === turbineID);
                });
                console.log("fanData=" + fanData);
                // console.log("length=" + fanData.length);

                if (fanData.length > 0 && !this.evaluationCalculating) {
                    const fanInfo = fanData[0];
                    // console.log("fanInfo=" + fanInfo);
                    this.$refs['fanBar'].show(true, clientX, clientY, fanInfo);
                } else {
                    this.$refs['fanBar'].show(false);
                }
            } else {
                this.$refs['fanBar'].show(false);
                console.log(this.BLH2XYZ({ x: lng, y: lat }));
                // 判断是否处于添加风机状态
                if (lng !== null && lat !== null && this.canAddFan && this.$store.state.app.projectInfo) {
                    // 判断风机是否超出红线范围
                    this.isOutOfFarm(this.$store.state.app.projectInfo.project_id, lng, lat)
                        .then(data => {
                            if (this.$refs['fanBar'].visible) return;
                            if (data) {
                                this.$message.warning('风机已超出规定范围');
                            } else {
                                this.$emit('showAddFan', lng, lat);
                            }
                        }).catch(err => console.log(`风机已超出规定范围${err}`));
                }
            }
        });

        // 移动风机完成回调函数
        window.viewer.registerFanMoveEndListener && window.viewer.registerFanMoveEndListener((turbineID, long, lat, x, y) => {
            this.startMoving = false;
            //window.viewer && window.viewer.startEdit(false);
            if (!self.fans || !self.startEdited) {
                return;
            }
            // console.log("Move to turbineID=" + turbineID + " long=" + long + " lat="+lat);
            if (turbineID !== null) {
                self.fans.forEach((data) => {
                    if (data.turbine_id === turbineID) {
                        console.log('Move to turbineID=' + turbineID + ' long=' + long + ' lat=' + lat);
                        let point = window.viewer.BLH2XYZ({ x: long, y: lat });
                        let fanInfo = {
                            turbine_id: turbineID,
                            turbine_name: data.turbine_name,
                            turbine_type: data.turbine_type,
                            longitude: long,
                            latitude: lat,
                            coordinate_x: point.x,
                            coordinate_y: point.y,
                            height: data.height,
                            power_curve_filename: data.power_curve_filename,
                            waked_speed: data.waked_speed
                        };
                        // 判断风机是否超出红线范围
                        this.isOutOfFarm(this.$store.state.app.projectInfo.project_id, long, lat)
                            .then(data => {
                                if (data) {
                                    this.$message.error('风机已超出规定范围');
                                } else {
                                    //移动 获取 等效小时数
                                    this.getFastSpeedData(fanInfo.coordinate_x, fanInfo.coordinate_y, fanInfo.height, fanInfo.power_curve_filename, (callBack)=>{
                                        // console.log(callBack)
                                        fanInfo.equivalent_hours = callBack.ehours_after_loss || "0";
                                        fanInfo.waked_speed = callBack.speed || "0";

                                        this.$store.commit('moveTurbine', fanInfo);
                                        this.$store.commit('moveCurrentFans', fanInfo);
                                        this.onMoveFan(turbineID, fanInfo);
                                        this.$store.commit('updataTurbine', fanInfo); //跟新currentFans
                                    })
                                    // this.$store.commit('moveTurbine', fanInfo);
                                }
                            }).catch(err => console.log(err));
                    }
                });
            }
        });
        //设置重复点位鼠标滑过的回调函数
        window.viewer.setMouseEventCallBack && window.viewer.setMouseEventCallBack(res=>{
            
                // console.log(res)
                //this.$store.state.app.hoverProjectInfo
            this.$store.commit("contrastMoveList", res);
            
        });
       
    },
    methods: {
        //移动风机  等效小时数
        onMoveFan(turbineID, fanData){
            var moveFans = this.$store.state.scheme.moveCurrentFans;
            var currentFans = this.$store.state.scheme.currentFans;
            var moveHours , moveSpeed , oldHours , oldSpeed ;
            var moveData = moveFans.filter((item,index)=>{
                return item.turbine_id == turbineID
            })
            //首次移动
            if(moveData.length<=1){
                var oldData = currentFans.filter((item,index)=>{
                    return item.turbine_id == turbineID
                })
                moveHours = moveData[0].equivalent_hours;
                moveSpeed = moveData[0].waked_speed;
                oldHours = oldData[0].equivalent_hours;
                oldSpeed = oldData[0].waked_speed;
            }
            //再次移动
            else{
                moveHours = moveData[moveData.length-1].equivalent_hours;
                moveSpeed = moveData[moveData.length-1].waked_speed;
                oldHours = moveData[moveData.length-2].equivalent_hours;
                oldSpeed = moveData[moveData.length-2].waked_speed;
            }
            
            
            let showHours = moveHours - oldHours;
            let showSpeed = moveSpeed - oldSpeed;
            let fu = "";
            let sp = "";
            showHours >= 0 ? fu = "+" : fu = "";
            showSpeed >= 0 ? sp = "+" : sp = "";
            this.changeCustomLabel(fanData.turbine_id, [fanData.longitude, fanData.latitude], sp +showSpeed.toFixed(2)+"m/s/n"+ fu + parseInt(showHours), {
                isBold:false,
                width: 95,
                height:50,
                color:'rgba(228,161,0, 1)',
                font:11
            })
            this.$store.commit("changeHours", fu + parseInt(showHours));
            setTimeout(()=>{
                this.changeCustomLabel(fanData.turbine_id, [fanData.longitude, fanData.latitude], moveHours, {
                    isBold:false,
                    width: 75,
                    height:25,
                    color:'rgba(228,161,0, 1)',
                    font:11
                })
            },3500)
        },
        //获取 等效小时数
        getFastSpeedData(x, y, h, power_curve, callBack){
            util.ajax.get("/fastspeed/"+ this.$store.state.app.projectInfo.project_id +"/wind-power",
            {
                params:{
                    x: x,
                    y: y,
                    h: h,
                    power_curve: power_curve
                }
            })
            .then((res)=>{
                // console.log(res)
                if(res.data.code == 200){
                    callBack(res.data.data);
                }else{
                    callBack({});
                    this.$message.warning(res.data.message);
                }
            }).catch((err)=>{
                console.log(err)
                this.$message.error("获取快速发电量数据失败！");
                callBack({});
            })
        },
        closeVisible(val){
            this.projectInfo.visible = val;
        },
        selectedClose(){
            this.$refs.tooltip2.handleClose()
        },
        projectClicked1(val,n , clickType ,liandong){
            this.$emit('projectClicked', val ,n ,clickType ,liandong);
        },
        filterPositions(oldArr){
            //去重后的提交渲染地球
            // console.log(oldArr,"oldArr")
            var allArr = [];//新数组
            for(var i=0;i<oldArr.length;i++){
                var flag = true;
                for(var j=0;j<allArr.length;j++){
                    if(oldArr[i].x == allArr[j].x && oldArr[i].y == allArr[j].y){
                        flag = false;
                    };
                };
                if(flag){
                    allArr.push(oldArr[i]);
                };
            }
            this.newArr = allArr;
            // console.log(this.newArr,this.newArr.length,"this.newArr")

        },
        filterPositions2(oldArr){
            //去重后的提交渲染地球
            // console.log(oldArr,"oldArr")
            var allArr = [];//新数组
            for(var i=0;i<oldArr.length;i++){
                var flag = true;
                for(var j=0;j<allArr.length;j++){
                    if(oldArr[i].longitude == allArr[j].longitude && oldArr[i].latitude == allArr[j].latitude){
                        flag = false;
                    };
                };
                if(flag){
                    allArr.push(oldArr[i]);
                };
            }
            this.newArr2 = allArr;
            // console.log(this.newArr,"this.newArr")

        },
        filterSelected(farmPositions){
            //把重复的提出来存好--转格式？？？--(前端切换显示)，
            // 转换后的二维数组
            var arrayTwo = Object.values(farmPositions.reduce((res, item) => {
                // res[item.x] ? res[item.x].push(item) : res[item.x] = [item];
                res[item.x] ? res[item.longitude].push(item) : res[item.longitude] = [item];
                return res;
            }, {}));
            this.selectedArr = arrayTwo;

        },
        initFarmPositions () {
            console.log('初始化风场=' + (this.projects ? this.projects.length : 0));
            const farmPositions = [];
            const farmPositions2 = [];
            if (this.projects) {
                this.projects.forEach(function (item) {
                    // console.log(item)
                    farmPositions.push({
                        x: item.longitude,
                        y: item.latitude,
                        z: 0,
                        id: item.project_id  //传了ID
                    });

                    farmPositions2.push(item);
                });
            }
            if (!window.viewer) {
                return;
            }
            this.filterPositions(farmPositions);
            this.filterSelected(farmPositions2);
            this.farmPositions2 = farmPositions2;
            //这里是渲染地球的风机
            window.viewer.clearFarm();
            
            // window.viewer.createFarm(window.viewer.farmURL, farmPositions);
            window.viewer.createFarm(window.viewer.farmURL, this.newArr);
        },
        initFanPositions (fans ,isTrue) {
            console.log('初期化风机=' + (fans ? fans.length : 0));
            let that = this;
            this.fans = [];
            fans.forEach(fan => {
                // console.log(fan.turbine_id);
                this.fans.push({ ...fan });
            });
            this.$store.commit('resetModify', this.fans);

            let fanPositions = [];
            if (this.fans) {
                this.fans.forEach(function (item) {
                    fanPositions.push({
                        // x: 124.881,
                        // y: 45.931,
                        x: item.longitude,
                        y: item.latitude,
                        // x: item.coordinate_x,
                        // y: item.coordinate_y,
                        z: 0,
                        turbineId: item.turbine_id,
                        name: item.turbine_name,
                        equivalent_hours: item.equivalent_hours
                    });
                });
            }
            if (!window.viewer) {
                return;
            }
            // window.viewer.clearFans();
            window.viewer.createFans(window.viewer.farmURL, fanPositions);// turbineURL
            // window.viewer.hideFans(true);
            // this.flyToProject(fanPositions[0].y, fanPositions[0].x);
            if(isTrue){
                this.startEdit(true);
            }
        },
        // 删除风机
        deleteFan (fanId) {
            window.viewer && window.viewer.deleteFan(fanId);
            let findIndex = -1;
            this.fans.forEach(function (item, index) {
                if (item.turbine_id === fanId) {
                    findIndex = index;
                }
            });

            if (findIndex > 0) {
                this.fans.splice(findIndex, 1);
            }
            this.$store.commit('deleteTurbine', fanId);
            this.$refs['fanBar'].show(false);
        },
        // 增加风机
        addFan (fanData) {
            console.log(fanData)
            // console.log(this.fans)
            let maxId = 0;
            this.fans.forEach(function (item) {
                if (item.turbine_id > maxId) {
                    maxId = item.turbine_id;
                }
            });
            fanData.turbine_id = maxId + 1;
            fanData.newFlag = true;
            this.fans.push(fanData);
            let model = { id: fanData.turbine_id, x: parseFloat(fanData.longitude), y: parseFloat(fanData.latitude), z: 0 };
            window.viewer.addOneFan(window.viewer.farmURL, model);
            this.$emit("addCustomLabel","add",fanData.turbine_id);
        },
        // 调整机型
        changeTurbineType (fanData) {
            this.$store.commit('changeTurbineType', fanData);
            this.fans.forEach(function (item) {
                if (item.turbine_id === fanData.turbine_id) {
                    item.turbine_type = fanData.turbine_type;
                    item.power_curve_filename = fanData.power_curve_filename;
                    item.height = fanData.height;
                }
            });
        },
        // 初期化测风塔
        initMasts (masts ,isTrue) {
            // console.log('初期化测风塔=' + (masts ? masts.length : 0));
            this.masts = masts;
            // window.viewer && window.viewer.clearMasts();
            //添加测风塔
            if(!isTrue){
                console.log('初期化测风塔=' + (masts ? masts.length : 0));
                window.viewer && this.masts && window.viewer.createMasts(window.viewer.mastURL, this.masts);
            }
        },
        //清空球上所有测风塔模型
        clearMasts(){
            window.viewer && window.viewer.clearMasts();
        },
        // 显示隐藏测风塔
        hideMasts (visible) {
            console.log('显示隐藏测风塔 -' + visible);
            // window.viewer && window.viewer.hideShowFans(!visible);
            window.viewer && window.viewer.hideMasts(visible);
        },
        startEdit (enable) {
            this.startEdited = enable;
            window.viewer && window.viewer.startEdit(enable);
            if (!enable) {
                this.$refs['fanBar'].show(false);
            } else {
                //window.viewer && window.viewer.startEdit(false);
            }
        },
        // 开始移动风机
        startMove () {
            this.startMoving = true;
            this.$refs['fanBar'].show(false);
            window.viewer && window.viewer.moveFan(true);
        },
        goHome () {
            window.viewer && window.viewer.flyToHome();
        },
        locationFanModle (fanID) {
            window.viewer.locationFanModle(fanID);
        },
        flyToProject (latitude, longitude) {
            window.viewer && window.viewer.flyToProject(longitude, latitude);
        },
        flyToProjectG (latitude, longitude) {
            window.viewer && window.viewer.flyToProjectG(longitude, latitude);
        },
        zoomToExtent (extentArray) {
            window.viewer && window.viewer.zoomToExtent(extentArray);
        },
        //飞到项目所在的行政区划 ,prjId项目编号
        flyToProjectByCity(prjId){
            // console.log(prjId);
            window.viewer && window.viewer.flyToProjectByCity(prjId);
        },
        flyToProjectToCity(lng,lat){
            // console.log(prjId);
            window.viewer && window.viewer.flyToProjectToCity(lng,lat);
        },

        // 开始飞行
        startFly () {
            console.log('开始飞行');
            window.viewer && window.viewer.startFlyPath();
        },
        // 暂停飞行
        stopFly () {
            window.viewer && window.viewer.stopFlyPath();
        },
        // 停止飞行
        resetFly () {
            window.viewer && window.viewer.restartFlyPath();
        },
        //加载kml---新
        getLoadKmlLayer(options){
            // console.log(options);
            return window.viewer.loadKmlLayer(options);
        },
        //显示可见性
        getlayerVisible(kmlLayer, isVisible){
            // console.log(kmlLayer, isVisible);
            return window.viewer.layerVisible(kmlLayer, isVisible);
        },
        // 控制树节点的可见性--新
        treeNodeVisible(nodeInfo, isVisible){
            window.viewer.treeNodeVisible(nodeInfo, isVisible);
        },
        //每个要试试可见性
        getfeatureVisible(kmlLayer, feature, isVisible){
            // console.log(kmlLayer, feature, isVisible);
            window.viewer.featureVisible(kmlLayer, feature, isVisible);
        },
        //定位到要素
        featureLoaction(kmlLayer, feature){
            window.viewer.featureLoaction(kmlLayer, feature);
        },
        //树节点定位---新
        treeNodeLoaction(nodeInfo){
            window.viewer.treeNodeLoaction(nodeInfo);
        },
        //移除树节点---新
        treeNodeRemove(nodeInfo){
            window.viewer.treeNodeRemove(nodeInfo);
        },
        //定位到图层
        kmlLayerLocation2(kmlLayer){
            window.viewer.kmlLayerLocation(kmlLayer);
        },
        // 新建图层
        addNewKmlLayer(options){
            window.viewer.addNewKmlLayer(options);
        },
        //新增要素--新
        addNewKmlFeature(layerId,pid,type,options,callback){
            // console.log(kmlLayer,pid,type,options,callback);
            return window.viewer.addNewKmlFeature(layerId,pid,type,options,callback);
        },
        //修改要素
        // changeFeatureProperty(feature, options){
        //     window.viewer.changeFeatureProperty(feature, options);
        // },
        // 修改树节点的属性 ---新
        changeFeatureProperty(nodeInfo, options){
            window.viewer.changeNodeProperty(nodeInfo, options);
        },
        //移出kml
        removeKmlLayer(KmlLayerData){
            // console.log(KmlLayerData)
            window.viewer.removeKmlLayer(KmlLayerData);
        },
        //退出
        exitKmlMoudle(){
            window.viewer.exitKmlMoudle();
        },
        //kmz优化新接口
        //弹窗回调---新
        enterKmlMoudle(options){
            window.viewer && window.viewer.enterKmlMoudle(options);
        },
        //指北针功能
        autoNorth(angle){
            window.viewer.autoNorth(angle);
        },

        //方案比选
        // 进入方案比选模块
        enterSchemeCompare(){
            window.viewer.enterSchemeCompare();
        },
        //加载一个方案的风机图标
        createSchemeTurbines(scheme, schemeOptions, turbineOptions){
            // console.log(scheme, schemeOptions, turbineOptions);
            window.viewer.createSchemeTurbines(
            scheme,
            schemeOptions,
            turbineOptions);
        },
        // 设置风机标签的可见性
        setSchemeTurbineNameVisible(scheme, isVisible){

            window.viewer.setSchemeTurbineNameVisible(scheme, isVisible);
        },
        //设置风机图标的可见性--默认可见
        setSchemeTurbineIconVisible(scheme, isVisible){

            window.viewer.setSchemeTurbineIconVisible(scheme, isVisible);
        },
        //移除单个方案中的风机图标（含文本）
        removeSchemeTurbines(scheme){
            window.viewer.removeSchemeTurbines(scheme);
        },
        //退出方案比较
        exitSchemeCpmpare(){
            window.viewer.exitSchemeCpmpare();
        },
 
        // 场内道路
        getInsideRoad (prjId, schemeId, isOpen) {
            console.log('场内道路' + prjId + '-' + isOpen);
            return window.viewer.insideRoad(prjId, schemeId, isOpen);
        },
        // 获取道路各分支信息
        getInsideRoadsInfo () {
            return window.viewer.getInsideRoadsInfo();
        },
        // 高亮显示指定道路编号的道路支线
        locationSelectInsideRoad (insideRoadEntityID) {
            window.viewer.loactionSelectInsideRoad(insideRoadEntityID);
        },
        // 获取场内道路支线的剖面图（横断面图）数据
        illustrationInsideRoad (insideRoadEntityID) {
            return window.viewer.illustrationInsideRoad(insideRoadEntityID);
        },
        // 开始手工编辑场内道路节点
        startEditInsideRoad () {
            window.viewer.startEditInsideRoad();
        },
        // 停止道路的编辑状态
        stopEditInsideRoad () {
            window.viewer.stopEditInsideRoad();
        },
        // 提交编辑后的场内道路
        submitEditInsideRoad () {
            return window.viewer.submitEditInsideRoad();
        },
        /**
         * 开启删除道路支线
         * @param {Object}options
         * @param {Function}[options.callBack]  鼠标选中支线的前端回调函数（再次确认弹出框）
         */
        startDeleteRoadLine (options) {
            window.viewer.startDeleteRoadLine(options);
        },
        // 关闭删除道路支线
        stopDeleteRoadLine () {
            window.viewer.stopDeleteRoadLine();
        },
        /**
         * 删除指定的道路支线
         * @param {Cesium.Entity}entity        鼠标点击选中的道路Entity
         */
        deleteRoadLineByEntity (entity) {
            window.viewer.deleteRoadLineByEntity(entity);
        },
        // 开启打断道路支线
        startSplitRoadLine () {
            window.viewer.startSplitRoadLine();
        },
        // 关闭打断道路支线
        stopSplitRoadLine () {
            window.viewer.stopSplitRoadLine();
        },
        // 集电线路 
        getCollectLine (prjId, schemeId, isOpen) {
            // console.log('集电线路' + prjId + '-' + isOpen);
            return window.viewer.collectLine(prjId, schemeId, isOpen);
        },
        // 获取集电线路分支路线列表
        getCollectLineListInfo () {
            return window.viewer.getCollectLineListInfo();
        },
        //  获取集电线路支线的横断面数据
        getcolloectLineCrossSection (collectLineEntityID) {
            return window.viewer.getcolloectLineCrossSection(collectLineEntityID);
        },
        //  开始编辑集电线路 桩位优化
        displayStakeLine (isOpen) {
            return window.viewer.displayStakeLine(isOpen);
        },
        //  开始编辑集电线路 塔位优化
        displayTowerLine (isOpen) {
            return window.viewer.displayTowerLine(isOpen);
        },
        //  显示集电线路 塔位优化
        startEditTowerLine () {
            return window.viewer.startEditTowerLine();
        },
        //  停止编辑线路(塔位线路)
        stopEditCollectLine () {
            window.viewer.stopEditCollectLine();
        },
        //  集电线路更换塔型
        changeTowerType (isOpen) {
            window.viewer.changeTowerType(isOpen);
        },
        //  开启编辑工具条 桩位优化
        startEditToolMode () {
            return window.viewer.startEditToolMode();
        },
        //  关闭编辑工具条 桩位优化
        stopEditToolMode () {
            return window.viewer.stopEditToolMode();
        },
        //  显示编辑集电线路 桩位优化
        startEditStakeLine () {
            return window.viewer.startEditStakeLine();
        },
        //  停止编辑线路 桩位优化
        stopEditStakeLine () {
            return window.viewer.stopEditStakeLine();
        },
        //  开启绘制桩位线路 桩位优化
        startDrawStakeLine () {
            return window.viewer.startDrawStakeLine();
        },
        //  关闭绘制桩位线路 桩位优化
        stopDrawStakeLine () {
            return window.viewer.stopDrawStakeLine();
        },
        /**
        * 开启删除桩位线路 桩位优化
        * @param {Object}options
        * @param {Function}[options.callBack]  鼠标选中支线的前端回调函数（再次确认弹出框）
        */
        startDeleteStakeLine (options) {
            return window.viewer.startDeleteStakeLine(options);
        },
        //  关闭删除桩位线路 桩位优化
        stopDeleteStakeLine () {
            return window.viewer.stopDeleteStakeLine();
        },
        /**
        * 删除指定的桩位线路 桩位优化
        * @param {Cesium.Entity}entity        鼠标点击选中的线路Entity
        */
        deleteStakeLine (entity) {
            return window.viewer.deleteStakeLine(entity);
        },
        //  关闭合并桩位线路 桩位优化
        startCombineStakeLine () {
            return window.viewer.startCombineStakeLine();
        },
        //  关闭合并桩位线路 桩位优化
        stopCombineStakeLine () {
            return window.viewer.stopCombineStakeLine();
        },
        //  开启打段桩位线路 桩位优化
        startSplitStakeLine () {
            return window.viewer.startSplitStakeLine();
        },
        //  关闭打断桩位线路 桩位优化
        stopSplitStakeLine () {
            return window.viewer.stopSplitStakeLine();
        },
        //  获取塔型库
        getDefalutToweriInfo () {
            return window.viewer.getDefalutToweriInfo();
        },
        // 保存修改塔信息
        saveChangeTowerType (towerInfo) {
            window.viewer.saveChangeTowerType(towerInfo);
        },
        //  定位到指定的线路分支并高亮显示
        highLightSelectBranchRoute (isOpen) {
            window.viewer.highLightSelectBranchRoute(isOpen);
        },
        //  提交排塔后编辑完数据
        submitEditTowerLineInfo () {
            return window.viewer.submitEditTowerLineInfo();
        },
        // 升压站
        getStation (prjId, schemeId, isOpen) {
            console.log('升压站' + prjId + '-' + isOpen);
            return window.viewer.stationDisplay(prjId, schemeId, isOpen);
        },
        // 编辑升压站
        editStation () {
            window.viewer.editStation();
        },
        // 获取编辑升压站数据
        getEditStationInfo () {
            return window.viewer.getEditStationInfo();
        },
        // 停止编辑升压站
        stopEditStation () {
            window.viewer.stopEditStation();
        },
        // 尾流
        createWake (prjId, isOpen) {
            console.log('尾流' + prjId + '-' + isOpen);
            window.viewer && window.viewer.createWake(prjId, isOpen);
        },
        // 经纬度转80坐标系下大地坐标
        BLH2XYZ (point) {
            return window.viewer.BLH2XYZ(point);
        },
        // 大地坐标转经纬度坐标
        XYZ2BLH (point) {
            // return window.viewer.XYZ2BLH(point);  // 废弃
            return window.viewer.XYZ2BLHWithEPSG(point, this.formEpsg);
        },
        /**
         * 导入DXF道路文件
         * @param prjId         工程ID
         * @param schemeId      方案ID
         * @param fileInfo      文件内容
         */
        loadDxfRoad (prjId, schemeId, fileInfo) {
            return window.viewer.loadDxfRoad(prjId, schemeId, fileInfo);
        },

        /**
         * 导入DXF集电线路文件
         * @param prjId         工程ID
         * @param schemeId      方案ID
         * @param fileInfo      文件内容
         */
        loadDxfCollectLine (prjId, schemeId, fileInfo) {
            return window.viewer.loadDxfCollectLine(prjId, schemeId, fileInfo);
        },
        //游客线路DXF
        dxfCollectLine(prjId, schemeId, isOpen){
            window.viewer.dxfCollectLine(prjId, schemeId, isOpen);
        },
        // 添加对应风场的无人机影像(dom)
        addFarmImagery (url) {
            console.log('添加风场的无人机影像');
            url && window.viewer.addFarmImagery(url);
        },
        // 添加对应风场的无人机地形(dem)
        addFarmTerrian (url) {
            console.log('添加风场的无人机地形');
            url && window.viewer.addFarmTerrian(url);
        },
        createPostions (xCentre=0, yCentre=0) {
            let positions = [];
            let point = this.XYZ2BLH({ x: parseFloat(xCentre), y: parseFloat(yCentre), z: 0 });
            positions.push(point.x);
            positions.push(point.y);
            return positions;
        },
        //  综合风图谱
        createIntegrateWindMap (prjId, xCentre, yCentre, fanHeight, isOpen) {
            console.log('综合风图谱 prjId=' + prjId + ' fanHeight=' + fanHeight + ' open=' + isOpen);
            let positions = this.createPostions(xCentre, yCentre);
            (isOpen) && window.viewer.createIntegrateWindMap(prjId, positions, fanHeight, false);
            return window.viewer.createIntegrateWindMap(prjId, positions, fanHeight, isOpen);
        },
        //  限制因素
        createRestrict (prjId, isOpen) {
            console.log('限制因素' + prjId + '-' + isOpen);
            // let positions = this.createPostions(xCentre, yCentre);
            // (isOpen) && window.viewer.createRestrict(prjId, positions, false);
            window.viewer.createRestrict(prjId, isOpen);
        },
        createLakeRestrict (prjId, url, isOpen) {
            console.log(`限制因素-湖泊-${prjId}-${isOpen}-${url}`);
            window.viewer.createLakeRestrict(prjId, url, isOpen);
        },
        createRoadRestrict (prjId, url, isOpen) {
            console.log(`限制因素-道路-${prjId}-${isOpen}-${url}`);
            window.viewer.createRoadRestrict(prjId, url, isOpen);
        },
        createHouseRestrict (prjId, url, isOpen) {
            console.log(`限制因素-居民区-${prjId}-${isOpen}-${url}`);
            window.viewer.createHouseRestrict(prjId, url, isOpen);
        },
        createRedLineArea (prjId, isOpen) {
            console.log(`限制因素-红线区-${prjId}-${isOpen}`);
            window.viewer.createRedLineArea(prjId, isOpen);
        },
        //等高线
        addContourServices(url, layerName){
            console.log(url, layerName);
            window.viewer.addContourServices(url, layerName);
        },
        //移出等高线
        removeContourSevices(){
            console.log("限制因素-等高线-false");
            window.viewer.removeContourSevices();
        },
        // 风图谱
        createWindMap (prjId, sectorId, xCentre, yCentre, isOpen) {
            console.log('风图谱 prjId=' + prjId + ' sectorId=' + sectorId + ' open=' + isOpen);
            let positions = this.createPostions(xCentre, yCentre);
            (isOpen) && window.viewer.createWindMap(prjId, sectorId, positions, false);
            return window.viewer.createWindMap(prjId, sectorId, positions, isOpen);
        },
        // 风能切片
        createWindSplit (prjId, sectorId, xCentre, yCentre, dir, value, isOpen) {
            console.log('风能切片 prjId=' + prjId + ' sectorId=' + sectorId + ' xCentre=' + xCentre + ' yCentre=' + yCentre + ' dir=' + dir + ' value=' + value + ' open=' + isOpen);
            let positions = this.createPostions(xCentre, yCentre);
            (isOpen) && window.viewer.createWindSplit(prjId, sectorId, 'U_' + dir + '_' + value + '.vtk', positions, false);
            return window.viewer.createWindSplit(prjId, sectorId, 'U_' + dir + '_' + value + '.vtk', positions, isOpen);
        },
        // 大湍流区
        createTurbulenceArea (prjId, sectorId, xCentre, yCentre, isOpen) {
            console.log('大湍流区' + prjId + ' sectorId=' + sectorId + ' open=' + isOpen);
            let positions = this.createPostions(xCentre, yCentre);
            (isOpen) && window.viewer.createTurbulenceArea(prjId, sectorId, positions, false);
            return window.viewer.createTurbulenceArea(prjId, sectorId, positions, isOpen);
        },
        // 机组震动区
        createShakeArea (prjId, sectorId, xCentre, yCentre, isOpen) {
            console.log('机组震动区' + prjId + ' sectorId=' + sectorId + ' open=' + isOpen);
            let positions = this.createPostions(xCentre, yCentre);
            (isOpen) && window.viewer.createShakeArea(prjId, sectorId, positions, false);
            return window.viewer.createShakeArea(prjId, sectorId, positions, isOpen);
        },
        // 加载流线
        createSteamLine (prjId, sectorId, schemeId, isOpen) {
            console.log('加载流线' + prjId + ' sectorId=' + sectorId + ' schemeId=' + schemeId + ' open=' + isOpen);
            (isOpen) && window.viewer.createSteamLine(prjId, sectorId, schemeId, false);
            window.viewer.createSteamLine(prjId, sectorId, schemeId, isOpen);
        },
        // // 点击指北针，旋转地球指向正北
        // autoNorth () {
        //     window.viewer.autoNorth();
        // },
        // 长度测量
        measureLength () {
            window.viewer.measureLength();
        },
        // 面积测量
        measureArea () {
            window.viewer.measureArea();
        },
        // 高度测量(简单)
        measureHeightSample () {
            window.viewer.measureHeightSample();
        },
        // 高度测量(复杂--三角测量)
        measureHeightComplex () {
            window.viewer.measureHeightComplex();
        },
        // 清空测量
        clearMeasure () {
            window.viewer.clearMeasure();
        },
        //即时绘制
        //绘制图标点
        drawIconPoint(options){
            window.viewer.drawIconPoint(options);
        },
        //折线
        drawPolyLine(options){
            window.viewer.drawPolyLine(options);
        },
        //方形
        drawPolygon(options){
            window.viewer.drawPolygon(options);
        },
        //圆
        drawCircle(options){
            window.viewer.drawCircle(options);
        },
        //箭头
        drawArrowStright(options){
            window.viewer.drawArrowStright(options);
        },
        //清除即时绘制
        clearDrawPlot(){
            window.viewer.clearDrawPlot();
        },
        // 判断经纬度点是否超出地形范围
        isOutOfTerrian (lon, lat) {
            return window.viewer.isOutOfTerrian(lon, lat);
        },
        // 根据红线区域判断是否超过风场范围
        isOutOfFarm (prjID, lon, lat) {
            return window.viewer.isOutOfFarm(prjID, lon, lat);
        },
        // 隐藏底部status
        disStatusBar (data) {
            this.displayStatusBar = data;
        },
        // 场内道路-获取默认参数
        getDesiginDefaultPara () {
            return window.viewer.getDesiginDefaultPara();
        },
        // 场内道路-起点定位
        roadStartLocation (lon, lat) {
            window.viewer.roadStartLocation(lon, lat);
        },
        // 场内道路-移除道路起点
        hideRoadStartPoint () {
            window.viewer.hideRoadStartPoint();
        },
        // 集电线路-获取风机分组信息
        getTurbineGroupInfo (projectId, planId) {
            return window.viewer.getTurbineGroupInfo(projectId, planId);
        },
        // 获取限制性因素列表---道路和线路公用
        getRestrictAreasList () {
            return window.viewer.getRestrictAreasList();
        },
        // 展示限制区域 --道路用
        roadRestrictArea (projectId, planId, selected) {
            return window.viewer.roadRestrictArea(projectId, planId, selected);
        },
        // 展示限制区域 --线路用
        lineRestrictArea (projectId, planId, selected) {
            return window.viewer.lineRestrictArea(projectId, planId, selected);
        },
        // 高亮显示指定的限制区
        locationSelectRestarictAera (restrictAreaID) {
            window.viewer.locationSelectRestarictAera(restrictAreaID);
        },
        // 面状限制性因素编辑
        startEitRestrictArea (restrictAreaID) {
            window.viewer.startEitRestrictArea(restrictAreaID);
        },
        // 删除限制性因素
        deleteRestrictArea (restrictAreaID) {
            window.viewer.deleteRestrictArea(restrictAreaID);
        },
        // 取消当前限制区的编辑状态
        stopEditRestrictArea () {
            window.viewer.stopEditRestrictArea();
        },
        // 新增面状限制因素
        addNewRestrictArea (options) {
            window.viewer.addNewRestrictArea(options);
        },
        // 提交编辑后的限制区域
        submitEditRestrictArea () {
            return window.viewer.submitEditRestrictArea();
        },
        // 根据扇区旋转场内风机模型角度
        changeFanRotaAngle (angle) {
            window.viewer.changeFanRotaAngle(angle);
        },
        // 展示/隐藏风机名称标签
        showOrHideFanNameLabel (isShow) {
            window.viewer.showOrHideFanNameLabel(isShow);
        },
        showOrHideFanNameLabel2 (isShow) {
            window.viewer.showOrHideFanNameLabel2(isShow);
        },
        // 框选风机
        selectFanByRectangle () {
            return window.viewer.selectFanByRectangle();
        },
        /**
         * 设置风场的基本信息
         * @param {Object} options
         * @param {Number}[options.epsg]      风场EPSG号
         * @param {Number}[options.prjID]     风场编号号
         */
        setFarmBaseInfo (options) {
            console.log(options);
            window.viewer.setFarmBaseInfo(options);
        },
        /**
         * 渲染噪声图层
         * @param {Number}prjID             项目编号
         * @param {Number}schemeID          方案编号
         */
        loadCSVNoise (prjID, schemeID) {
            return window.viewer.loadCSVNoise(prjID, schemeID);
        },

        /**
         * 通过范围加载噪声图片
         * @param {Number}prjID             项目编号
         * @param {Number}schemeID          方案编号
         * @param {Number[]}extent          噪声范围[minX,maxX,minY,maxY]
         * */
        loadCSVNoiseWithExtent (prjID, schemeID, extent) {
            window.viewer.loadCSVNoiseWithExtent(prjID, schemeID, extent);
        },

        /**
         * 移除噪声图层
         */
        removeCSVNoise () {
            window.viewer.removeCSVNoise();
        },

        /**
         * 停止框选风机
         */
        stopSelectFanByRectangle () {
            window.viewer.stopSelectFanByRectangle();
        },

        /**
         * 方案模式切换
         * @param {Boolean}isgoldForm    是否为form模式  true--goldform模式，false--wt模式
         */
        setSchemeMode (isgoldForm) {
            window.viewer.setSchemeMode(isgoldForm);
        },
        //清除风机图标高亮
        clearHighLightFan(){
            window.viewer.clearHighLightFan();
        },
        //清除测风塔高亮
        clearHighLightMast(){
            window.viewer.clearHighLightMast();
        },
        //清除集电塔颜色高亮
        clearHighTowerLabel(){
             window.viewer.clearHighTowerLabel();
        },
        //=======================后评估=======================
        // 进入后评估项目
        enterReEvaleMoudle(){
            window.viewer.enterReEvaleMoudle();
        },
        //加载后评估项目----新
        loadWindFileds(data,imgUrl){
            return window.viewer.loadWindFileds(data,imgUrl);
        },
        //退出后评估案例模式
        exitReEvalueMoudle(){
            window.viewer.exitReEvalueMoudle();
        },
        //进入项目
        flyToReEvaluePrj(lon, lat){
            window.viewer.flyToReEvaluePrj(lon, lat);
        },
        //loadTurbines
        loadTurbines(datas){
            window.viewer.loadTurbines(datas);
        },
        // 清空后评估风场中风机模型
        clearReEvalueTurbine(){
            window.viewer.clearReEvalueTurbine();
        },
        //设置风场对象的可见性-风场对象的唯一识别（MAPKEY）--isTrue
        setWindFiledVisible(mapKey, isVisible){
            window.viewer.setWindFiledVisible(mapKey, isVisible);
        },
        //==============================================
        //清除剖面分析
        exitProfileAnalysis(){
            window.viewer.exitProfileAnalysis();
        },
        //===添加等效小时数标签===========
        addCustomLabel(id, text, style){
            window.viewer.addCustomLabel(id, text+"h", style);
        },
        //修改
        changeCustomLabel(id, position, text, style){
            window.viewer.changeCustomLabel(id, position, text+"h", style);
        },
        //移除
        removeAllCustomLabels(type){
            window.viewer.removeAllCustomLabels();
            this.$store.commit('clearFans', []);
            this.$emit("initHoursData", type);
        },
        removeCustomLabelById(id){
            window.viewer.removeCustomLabelById(id);
        },

        // 全国图层
        addCesiumLayer (layerData){
            cesiumLayer.loadServiceLayer(layerData)
        },
        removeCesiumLayer (layerData){
            cesiumLayer.removeServiceLayer(layerData)
        }
    }
};
</script>
