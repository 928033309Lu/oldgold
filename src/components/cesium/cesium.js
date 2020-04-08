/* eslint-disable */
/**
 * Created by pengYX on 2018/4/25.
 */
import Cesium from 'cesium/Cesium';

import BaseGloble from './subMoudle/baseGloble';
import FanMoudle from './subMoudle/fanMoudle';
import FarmMoudle from './subMoudle/farmMoudle';
import OtherMoudle from './subMoudle/otherMoudle';
import MeasureHelper from './otherModle/drawEditHelper/measureHelper';
import {baseS3Path, redlineUrl, boundryUrl,aninationUrl, fanEntities} from "./subMoudle/constants";
const turf=require('../../../static/thirdParty/turf');
import KmlManagerMoudle from './subMoudle/kmlMoudle/KmlManagerMoudle';
import SchemeCompMoudle from './subMoudle/SchemeCompMoudle';
import PlotMoudle from './subMoudle/PlotMoudle';
import ReEavlueMoudle from './subMoudle/ReEavlueMoudle/reEvalueMoudle';
import ProfileAnalysis from './otherModle/ProfileAnalysis';
/**
 * 对外提供接口类
 */
class viewer {

    /**
     * 构造函数
     * @param {String}cesiumcontainer      -cesiumJS地球用div控件ID
     * @param {String}threecontainer       -threeJS地球用div控件ID
     */
    constructor(cesiumcontainer, threecontainer) {
        document.oncontextmenu = function (ev) {
            return false;    //屏蔽右键菜单
        };
        // this.farmURL = 'https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/1.5-03.gltf';//风机turbine
        this.farmURL = 'static/turbine25.glb';// 2.5风机7.gltf 'https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/2.5%E9%A3%8E%E6%9C%BA7.gltf';//风机turbine
        this.mastURL = 'static/mast-120.glb';// 'https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/mast.glb';//测风塔
        this.cesiumContainer = document.querySelector(cesiumcontainer);
        this.threeContainer = document.querySelector(threecontainer);

        console.log('VERSION:' + Cesium.VERSION);
        let url = "http://52.82.2.121/gmap/vt/lyrs=s&x={x}&y={y}&z={z}";
        this.viewer = new Cesium.Viewer(this.cesiumContainer, {
            infoBox: false,
            selectionIndicator: false,
            shadows: false,
            shouldAnimate: true,
            animation: false, //动画控制不显示
            baseLayerPicker: false, //图层控制显示
            geocoder: false, //地名查找不显示
            timeline: false, //时间线不显示
            sceneModePicker: false, //投影方式显示
            sceen3DOnly: true,
            fullscreenButton: false,
            homeButton: false,
            navigationHelpButton: false,
           // requestRenderMode : true,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({url: url})
            /* new Cesium.ArcGisMapServerImageryProvider({
             url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
         })*/
        });
       // this.viewer.extend(Cesium.viewerCesiumInspectorMixin);
        this.viewer.scene.depthTestAgainstTerrain=true;
        this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
        this.viewer.scene.fxaa = false;//抗锯齿
        this.baseGloble = new BaseGloble(this.viewer);//基础球模块
        //this.viewer.scene.debugShowFramesPerSecond = true;
        this._init();//初始化球面信息
        this.fanMoudle = new FanMoudle(this.viewer, this.farmURL, this.threeContainer);//小风机模块
        this.farmMoudle = new FarmMoudle(this.viewer);//风场模块
        this.otherMoudle = new OtherMoudle(this.viewer, this.stationURL);//其它子模块（测风塔，升压站）
        this.measureHelper = new MeasureHelper(this.viewer);
        this.test();
    };

    /**
     * 初始化三维球（云层，影像，天空盒，大气层，双击事件注销）
     * @private
     */
    _init() {
        this.viewer.scene.skyBox = new Cesium.SkyBox({
            sources: {
                positiveX: '/static/skybox/1.jpg',
                negativeX: '/static/skybox/2.jpg',
                positiveY: '/static/skybox/3.jpg',
                negativeY: '/static/skybox/4.jpg',
                positiveZ: '/static/skybox/5.jpg',
                negativeZ: '/static/skybox/6.jpg'
            }
        });
      /* let cloudLayer = this.viewer.entities.add({
            name: 'cloud',
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
                material: new Cesium.ImageMaterialProperty({
                    image: 'static/cloud.png',
                    color:Cesium.Color.WHITE.withAlpha(0.0),
                    transparent: true,
                }),
                height: 100000.0
            }
        });
        cloudLayer.rectangle.material.color = Cesium.Color.WHITE.withAlpha(1.0);*/
       /* let colorLayer=this.viewer.scene.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
            url: 'http://freemeso-china-map-395039962.cn-northwest-1.elb.amazonaws.com.cn/geoserver/goldFarm/wms',
            layers: 'goldFarm:GoldFarm_earth2'
        }));*/

        let url = 'http://freemeso-china-map-395039962.cn-northwest-1.elb.amazonaws.com.cn/geoserver/gwc/service/wmts?service=WMTS&request=GetTile&version=1.0.0&layer=goldFarm%3AGoldFarm_earth2&style=&tilematrixset=EPSG%3A4326&FORMAT=image%2Fpng&TILEMATRIX=EPSG%3A4326%3A{z}&TILEROW={y}&TILECOL={x}';
        let colorLayer = this.viewer.scene.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: url,
            tilingScheme:new Cesium.GeographicTilingScheme(),
            maximumLevel: 7
        }));
        /* let boundryLayer = this.viewer.scene.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
             url: boundryUrl,
             subdomains: ['t0', "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
             maximumLevel: 15
         }));*/
        let boundryLayer=this.viewer.scene.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({//china_mapservice
             url: 'http://gis-8d01bdc0808640be.elb.cn-northwest-1.amazonaws.com.cn:6080/arcgis/rest/services/Test/china_map_jilin/MapServer',
             minimumLevel:6/*,
             maximumLevel: 11*/
         }));
        colorLayer.brightness = 0.8;
        colorLayer._maximumTerrainLevel = 7;
        //aninotionLayer._maximumTerrainLevel = 11;
        //boundryLayer._maximumTerrainLevel = 11;

      /*  let testLayer=this.viewer.scene.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
            url: 'http://gis-8d01bdc0808640be.elb.cn-northwest-1.amazonaws.com.cn:6080/arcgis/rest/services/Test/taizhou_label/MapServer',
            minimumLevel:11
        }));
*/
        /* this.viewer.scene.skyAtmosphere = new Cesium.SkyAtmosphere();
         this.viewer.scene.skyAtmosphere.brightnessShift = -0.40;
         this.viewer.scene.skyAtmosphere.saturationShift = 1;
         this.viewer.scene.skyAtmosphere.hueShift = -0.91;*/
        //取消鼠标双击事件
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        //渲染出错时禁止弹出报错窗口
        let viewer =this.viewer;
        this.viewer.cesiumWidget.showErrorPanel = function (title, message, error) {
            console.log("三维地图渲染出错。" + title + "||" + message + "||" + error);
            viewer.zoomTo(fanEntities);
            viewer.cesiumWidget.useDefaultRenderLoop = true;
            viewer.cesiumWidget._renderLoopRunning = false;
        };

        this.baseGloble.addCameraControl();
        this.baseGloble.flyToHome();

    };

    test() {
       // this.dxfCollectLine();
    };

    /**
     * 添加风场
     * @param {String}      url              -风场用图标
     * @param {Object[]}    modelsInfo       -风场信息数组
     * @param {Number}      modelsInfo[].x   -风场点位经度
     * @param {Number}      modelsInfo[].y   -风场点位纬度
     * @param {Number}      modelsInfo[].z   -风场点位高度
     * @param {Number/String}      modelsInfo[].id  -风场编号?????
     * @example
     * createFarm(url,[{x:110.0,y:25.0,z:0,id:11111},{x:110.0,y:25.0,z:0,id:11111},{x:110.0,y:25.0,z:0,id:11111}]);
     */
    createFarm(url, modelsInfo) {
        this.farmMoudle.createFarms(url, modelsInfo);
        console.log('createFarm被调用了！'+modelsInfo.length);
    };

    /**
     * 清空球上所有风场模型
     */
    clearFarm() {
        this.farmMoudle.clearFarms();
    };

    /**********************风机模型添加，清空，显隐，定位，变色***********************/
    /**
     * 添加风机(经纬度坐标)
     * @param {String}      url                     -风机模型路径
     * @param {Object[]}    modelsInfo
     * @param {Number}      modelsInfo[].x          -风机点位经度
     * @param {Number}      modelsInfo[].y          -风机点位纬度
     * @param {Number}      modelsInfo[].z          -风机点位高度
     * @param {Number/String}      modelsInfo[].turbineId  -风机编号
     * @param {String}      modelsInfo[].name       -风机编号
     * @example
     * createFans(url,[{x:110.0,y:25.0,z:0,turbineId:5765,name:'S21'},{x:110.0,y:25.0,z:0,turbineId:5765,name:'S21'},{x:110.0,y:25.0,z:0,turbineId:5765,name:'S21'}]);
     */
    createFans(url, modelsInfo) {
        this.clearFans();
        this.fanMoudle.createFans(url, modelsInfo);
    };

    /**
     * 清空球上所有小风机模型
     */
    clearFans() {
        this.fanMoudle.clearFans();
    };

    /**
     *  更改指定编号的风机模型的颜色
     * @param {Number/String}fanID         需要更改颜色的风机的编号
     * @param {Number}r             R分量  取值范围[0---1]
     * @param {Number}g             G分量  取值范围[0---1]
     * @param {Number}b             B分量  取值范围[0---1]
     * @param {Number}a             A分量  取值范围[0---1]
     */
    changeFanColor(fanID, r, g, b, a) {
        let color = new Cesium.Color(r, g, b, a);
        this.fanMoudle.changeFanColor(fanID, color);
    };

    /**
     * 隐藏和显示风机模型（测风塔显示隐藏时候调用）
     * @param {Boolean}isVisible     -true显示风机，false隐藏风机
     */
    hideShowFans(isVisible) {
        this.fanMoudle.hideFans(isVisible);
    };

    /**
     * 风机定位              道路和线路重新规划使用
     * @param {Number/String}fanID         风机编号
     */
    locationFanModle(fanID) {
        this.fanMoudle.locationFanModle(fanID);
    };

    /**
     * 根据扇区的角度旋转当前风场中分机模型的角度
     * @param {Number} angle        扇区角度
     * @example
     * changeFanRotaAngle(180);
     */
    changeFanRotaAngle(angle) {
        this.fanMoudle.changeFanRotaAngle(angle);
    };

    /**
     * @typedef fanGroup
     * @property {String} turbine_id        -风机id
     * @property {String} turbine_name      -风机名称
     */
    /**
     * 框选风机
     * @return  {Promise<fanGroup[]>}       在选择框中的风机基本信息
     * @example
     * let fanInfoPromise=selectFanByRectangle();
     * fanInfoPromise.then((fanInfo)=>{
     *      console.log(fanInfo);//内容如下
     * });
     * [  {
     *         "turbine_id": "4",
     *          "turbine_name": "S4"
     *      },
     *    {
     *        "turbine_id": "5",
     *        "turbine_name": "S5"
     *    }
     *]
     */
    selectFanByRectangle() {
        return this.fanMoudle.selectFanByRectangle();
    };

    /**
     * 停止框选风机
     */
    stopSelectFanByRectangle(){
        this.fanMoudle&&this.fanMoudle.stopSelectFanByRectangle();
    };

    /**
     * 批量定位风机
     * @param {Number[]} fansID             要定位的风机id数组
     * @param {Boolean} isHighLight         是否高亮显示;true高亮，false不高亮
     * @param color    {optional}           可为空，默认为红色，高亮显示的颜色  r,g,b,a风量值（0-1之间）
     * @example
     * locationFans([7562,4578,4564],true,[1,1,1,1]);
     */
    locationFans(fansID, isHighLight, color) {
        this.fanMoudle.locationFans(fansID, isHighLight, color)
    };

    /**
     * 展示/隐藏风机名称标签
     * @param {Boolean}isShow   true显示标签，false隐藏标签
     */
    showOrHideFanNameLabel(isShow) {
        this.fanMoudle.removeGroupFanLabel();
       // this.fanMoudle.showOrHideFanNameLabel(isShow);
    };
    // 前端自加的显影用着先
    showOrHideFanNameLabel2(isShow) {
        this.fanMoudle && this.fanMoudle.showOrHideFanNameLabel(isShow);
    };

    /**
     * 根据指定的颜色进行风机标签的渲染
     * @param {Number[]}fanIDS               风机编号ID
     * @param {String}labelColor             标签颜色
     */
    showGroupFanLabel(fanIDS, labelColor) {
        this.fanMoudle.showGroupFanLabel(fanIDS, labelColor);
    };

    /**
     * 移除风机分组标签
     */
    removeGroupFanLabel() {
        this.fanMoudle.removeGroupFanLabel();
    };

    /**
     * 清空高亮的风机模型或者标签
     */
    clearHighLightFan(){
        this.fanMoudle&&this.fanMoudle.clearHighLightFan();
    };

    /**
     * 添加等效小时数标签
     * @param {String}id            风机编号
     * @param {String}text          等效小时数   换行使用/n
     * @param {Object}[style]         标签样式
     */
    addCustomLabel(id, text, style = {isBold:false,width: 70,height:24,color:'rgba(0, 183, 172, 1)',font:11}){
        this.fanMoudle && this.fanMoudle.addCustomLabel(id, text, style);
    };

    /**
     * 修改等效小时数变化值
     * @param {String}id             风机编号
     * @param {Array}position        坐标位置,经纬度坐标  [110.23,35.26]
     * @param {String}text          等效小时数变化值   换行使用/n
     * @param {Object}[style]       标签样式
     */
    changeCustomLabel(id,position,text,style = {isBold:false, width: 77,height:35,color:'rgba(228, 161, 0, 1)', font:11}){
        this.fanMoudle && this.fanMoudle.changeCustomLabel(id,position, text, style);
    };

    /**
     * 移除所有的等效小时数标签
     */
    removeAllCustomLabels(){
        this.fanMoudle && this.fanMoudle.removeCustomLabels();
    };

    /**
     * 移除指定风机编号的等效小时数标签
     * @param {String} id           要移除标签的风机编号
     */
    removeCustomLabelById(id){
        this.fanMoudle && this.fanMoudle.removeCustomLabel(id);
    };

    /**********************测风塔模型添加，清空，显隐***********************/
    /**
     * 添加测风塔
     * @param {String}url
     * @param {Object[]}modelsInfo
     * @param {Number}modelsInfo[].longitude        测风塔坐标-经度
     * @param {Number}modelsInfo[].latitude        测风塔坐标-纬度
     * @param {Number}modelsInfo[].z        测风塔坐标-高度
     * @param {Number}modelsInfo[].id       测风塔编号
     * @example createMasts('./mast.glb',[{longitude:110.0,latitude:25.0,z:0,id:233},{longitude:110.0,latitude:25.0,z:0,id:233}]);
     */
    createMasts(url, modelsInfo) {
        this.otherMoudle.createMasts(url, modelsInfo);
        console.log('createMasts被调用了！'+modelsInfo.length)
    };

    /**
     *  清空球上所有测风塔模型
     */
    clearMasts() {
        this.otherMoudle.clearMasts();
    };

    /**
     * 显示隐藏测风塔
     * @param {Boolean}isVisible        true显示测风塔模型，false隐藏测风塔模型
     */
    hideMasts(isVisible) {
        this.otherMoudle.hideMasts(isVisible);
    };

    /**
     * 清空高亮的测风塔模型或者标签
     */
    clearHighLightMast(){
        this.otherMoudle&&this.otherMoudle.clearHighMast();
    };

    /***************************风机优化排布**********************************/
    /**
     * 优化排布
     * @param {Boolean}isStart          true启动优化排布,false关闭优化排布
     */
    startEdit(isStart) {
        console.log('startEdit被调用了！'+isStart)
        this.fanMoudle.startEdit(isStart);
        /*if(isStart){
            fanEntities.forEach((info)=>{
                this.addCustomLabel(info.id,'2354h');
            });
            this.changeCustomLabel(fanEntities[0].id,'+12m/s/n+23h');
        }else{
            this.removeAllCustomLabels();
        }*/
        //this.fanMoudle&&this.fanMoudle.showOrHideFanNameLabel(!isStart);//隐藏风机标签
    };

    /**
     * 优化排布--开始移动风机
     */
    moveFan() {
        this.fanMoudle.moveFan();
    };

    /**
     * 优化排布--删除选中的一个风机
     * @param {Number/String}fanID      需要删除的风机的ID
     */
    deleteFan(fanID) {
        this.fanMoudle.deleteOneFan(fanID);
    };

    /**
     * 优化排布--在点击的位置添加一个风机
     * @param {String}url              风机模型文件的路径
     * @param {Object}model            风机模型的基本信息
     * @param {Number} model.x         风机模型的经度坐标
     * @param {Number} model.y         风机模型的维度坐标
     * @param {Number} model.z         风机模型的高度坐标
     * @param {Number} model.id        风机编号
     * @param {String} model.name      风机名称
     */
    addOneFan(url, model) {
        this.fanMoudle.addOneFan(url, model);
    };

    /**
     * 优化排布--更换风机的类型
     * @param {String}type      新更换的类型
     * @param {Number}fanID     需要更换风机类型的ID
     */
    changeFanType(type, fanID) {
        this.fanMoudle.changeFanType(type, fanID);
    };

    /**
     * 判断经纬度点是否超出地形范围
     * @param {Number}lon               经度
     * @param {Number}lat               纬度
     * @returns {Promise<Boolean>}      由于获取地形高度为异步执行，故返回的为Promise对象  [true--超出地形范围，false--地形范围内]
     * @example var p=isOutOfTerrian(110.2,35.8).then((isOutTerrian)=>{
     *          if(isOutTerrian){
     *              console.log('超出地形范围');
     *          }
     * });
     */
    isOutOfTerrian(lon, lat) {
        return this.fanMoudle.fanIsOutOfTerrian(lon, lat);
    };

    /**
     * 根据红线区域判断是否超过风场范围--根据红线区域来判断是否在风场内，若无红线区则始终返回在风场返回中
     * @param prjID         风场ID
     * @param lon           经度
     * @param lat           纬度
     * @return {Promise<Boolean>}      false--没有超出；true--超出范围
     */
    isOutOfFarm(prjID, lon, lat) {
        return this.fanMoudle.fanIsOutOfTerrianNew(prjID, lon, lat);
    };

    /**************************定位（风场）*********************************/
    /**
     * 指北针功能
     * @param {Number}angle               旋转的角度,正北为0度，逆时针增加
     */
    autoNorth(angle) {
        this.baseGloble.autoNorth(angle);
    };

    /**
     * 飞到项目所在的行政区划
     * @param {String/Number}prjId          项目编号?????
     */
    flyToProjectByCity (prjId) {
        this.farmMoudle && this.farmMoudle.flyToPrjByCity(prjId, 1004500);
    };

    /**
     * 飞到项目所在的行政区划（新）
     * @param {Number}lng          项目所在地经度
     * @param {Number}lat          项目所在地纬度
     */
    flyToProjectToCity (lng,lat){
        this.baseGloble && this.baseGloble.flyToLatLng(lng,lat,600000,0);//1000000
    };

    /**
     * 进入到具体风场工程中
     * @param {Number}lat       工程的纬度
     * @param {Number}lon       工程的经度
     */
    flyToProject(lon, lat) {
        //this.baseGloble.flyToProject(lat,lon);
        this.baseGloble.flyToLatLng(lon, lat, 30000, 5);
    };

    /**
     * 点击左侧风场列表定位到球上风场模型
     * @param {Number}lat       风场的经度
     * @param {Number}lon       风场的经度
     */
    flyToProjectG(lon, lat) {
        this.baseGloble.flyToLatLng(lon, lat, 480000, 1500);
    };

    /**
     * 回到初始位置
     */
    flyToHome() {
        this.baseGloble.flyToHome();
    };

    /**
     * 按照风场范围定位风场
     * @param {Number[]}extentArray  风场的最大最小范围顺序为minX,miny,maxX,maxY,经纬度坐标
     * @example zoomToExtent([-180,-90,180,90]);
     */
    zoomToExtent(extentArray) {
        let minP= this.XYZ2BLH({x:extentArray[0],y:extentArray[1]});
        let maxP= this.XYZ2BLH({x:extentArray[2],y:extentArray[3]});
        this.baseGloble.zoomToExtent([minP,maxP]);
    };

    addFarmImageryold(url) {
        this.farmMoudle.removeFarmImagery();
        if (!Cesium.defined(url) || url.replace(/(^s*)|(s*$)/g, "").length === 0) {
            return;
        }
        let ip = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        let text = ip.exec(url);//获取IP地址

        let index = url.lastIndexOf("\/");
        url = url.substring(index + 1, url.length);
        this.farmMoudle.addFarmImagerySevices("http://" + text + "/mapcache", url);

    };
    /**
     * 添加对应风场的无人机影像(dom)
     * @param {String}config       dom服务配置文件
     */
    addFarmImagery(config) {
        console.log("addFarmImagery被调用了.");
        this.farmMoudle.removeFarmImagery();
        if (!Cesium.defined(config) || config.replace(/(^s*)|(s*$)/g, "").length === 0) {
            return;
        }
        let domConfig=JSON.parse(config);

        let layerUrl=domConfig.hasOwnProperty('dom')?domConfig['dom']:undefined;
        let layerName=domConfig.hasOwnProperty('dom_layers')?domConfig['dom_layers']:undefined;
        let subdomins = domConfig.hasOwnProperty('subdomains')? domConfig['subdomains']:["gs2","gs3"];
        if(layerUrl&&layerName){
            this.farmMoudle.addFarmImagerySevices(layerUrl,layerName,subdomins);
        }
    };

    /**
     * 添加对应风场的无人机地形(dem)
     * @param {String}url       dem服务路径
     */
    addFarmTerrian(url) {
        console.log("addFarmTerrian被调用了.");
        let index = url.lastIndexOf("\/");
        let prjID = url.substring(index + 1, url.length);
        this.fanMoudle.PRJID = prjID;
        this.farmMoudle.addFarmTerrian(url);
    };

    /**
     * 方案模式切换
     * @param {Boolean}isgoldForm    是否为form模式  true--goldform模式，false--wt模式
     */
    setSchemeMode(isgoldForm){
        this.fanMoudle&&this.fanMoudle.setSchemeMode(isgoldForm);
    };
    /*************************场内道路****************************/

    /**
     * @typedef roadProperty
     * @property {Number}roadLength        -道路长度
     * @property {Number}roadWidth        -道路宽度
     * @property {Number}digAmount        -总挖方量
     * @property {Number}fillAmount        -总填方量
     * @property {Number}branchNum        -道路条数
     * @property {Number[]}startPoint        -起点坐标 重新设计--起点定位使用
     */
    /**
     * 场内道路
     * @param prjId         工程ID
     * @param schemeId      方案ID
     * @param isOpen        道路按钮是否选中状态
     * @return {Promise<roadProperty>}      isOpen为false的时候返回null,为true的时候返回Promise对象
     * {
     *      "roadLength":300,             //道路长度
     *      "roadWidth":300，             //道路宽度
     *      "digAmount":20，              //总挖方量
     *      "fillAmount":20,              //总填方量
     *      "branchNum":5                 //道路条数
     *      "startPoint":[111.9,26.9]     //起点坐标------重新设计--起点定位使用
     * }
     */
    insideRoad(prjId, schemeId, isOpen) {
        if(!isOpen)
            this.fanMoudle&&this.fanMoudle.showOrHideFanNameLabel(true);//显示风机标签
        return this.fanMoudle.createInsideRoad(prjId, schemeId, isOpen);
    };

    /**
     * 开始手工编辑场内道路节点
     */
    startEditInsideRoad() {
       this.fanMoudle&&this.fanMoudle.showOrHideFanNameLabel(false);//隐藏风机标签
        return this.fanMoudle.startEditInsideRoad();
    };

    /**
     * 停止道路编辑状态
     */
    stopEditInsideRoad() {
        this.fanMoudle && this.fanMoudle.stopEditInsideRoad();
        this.fanMoudle&&this.fanMoudle.showOrHideFanNameLabel(true);//显示风机标签
    };

    /**
     * 开启删除道路支线
     * @param {Object}options
     * @param {Function}[options.callBack]  鼠标选中支线的前端回调函数（再次确认弹出框）
     */
    startDeleteRoadLine(options){
        this.fanMoudle&&this.fanMoudle.startDeleteRoadLine(options);
    };

    /**
     * 关闭删除道路支线
     */
    stopDeleteRoadLine(){
        this.fanMoudle&&this.fanMoudle.stopDeleteRoadLine();
    };

    /**
     * 删除指定的道路支线
     * @param {Cesium.Entity}entity        鼠标点击选中的道路Entity
     */
    deleteRoadLineByEntity(entity){
        this.fanMoudle&&this.fanMoudle.deleteRoadLineByEntity(entity);
    };

    /**
     * 开启打算道路支线
     */
    startSplitRoadLine(){
        this.fanMoudle&&this.fanMoudle.startSplitRoadLine();
    };

    /**
     * 关闭打断道路支线
     */
    stopSplitRoadLine(){
        this.fanMoudle&&this.fanMoudle.stopSplitRoadLine();
    };

    /**
     * 提交编辑后的场内道路
     * @returns {Object}   返回编辑完成后的道路GeoJSON，用于上传服务器
     */
    submitEditInsideRoad() {
        return this.fanMoudle.submitEditInsideRoad();
    };

    /**
     * @typedef roadInfo
     * @property {Number}index      点号索引
     * @property {Number}lon        经度
     * @property {Number}lat        纬度
     * @property {Number}x          支线长度
     * @property {Number}y          线路上节点高度
     * @property {Number}ty         线路节点所在地高程
     */
    /**
     * 获取场内道路支线的剖面图（横断面图）数据
     * @param   {String}insideRoadEntityID      场内道路的支线Entity的ID
     * @returns {Promise<{roadId: number, data: roadInfo[]}>}
     * index        点号索引
     * lon          经度
     * lat          纬度
     * x            支线长度
     * y            线路上节点高度
     * ty           线路节点所在地高程
     */
    illustrationInsideRoad(insideRoadEntityID) {
        return this.fanMoudle.getInsideRoadCrossSection(insideRoadEntityID);
    };

    /**
     * 高亮显示指定道路编号的道路支线
     * @param {String}insideRoadEntityID      场内道路的支线编号
     */
    loactionSelectInsideRoad(insideRoadEntityID) {
        this.fanMoudle.highLightSelectBranchRoad(insideRoadEntityID);
    };

    /**
     * 获取道路各支线信息
     * @returns {Object}
     * {
     *    roadEntityId:12222222222,         //  支线剖面图和支线高亮传参需要使用
     *    properties:{
     *          roadID:"Z0001",             //道路编号
     *          roadLength:200,             //支线长度
     *          digAmount:5000,             //挖方量
     *          fillAmount:2000             //填方量
     *    },
     *    positions:[]                      //支线的点坐标串
     * }
     */
    getInsideRoadsInfo() {
        return this.fanMoudle.getInsideRoadsInfo();
    };

    /**
     * 场内道路重新设计---起点定位
     * @param {Number/String}lon       起点的经度
     * @param {Number/String}lat       起点的纬度
     */
    roadStartLocation(lon, lat) {
        this.fanMoudle.locationStartPoint(parseFloat(lon), parseFloat(lat));
    };

    /**
     * 移除道路起点
     */
    hideRoadStartPoint() {
        this.fanMoudle && this.fanMoudle.removeRoadStartPoint();
    };

    /**
     * 道路重新设计---获取默认参数（道路起点，默认设计参数，风机分组）
     * @return {*}
     *{
     *       "startPoint":[111.9,26.9],     //道路起点
     *       "designPara":{
     *               "turningRadius":15,    //转弯半径
     *               "maxSlope":45,         //最大坡度
     *               "pileSpacing":20,      //桩点间距
     *               "roadWidth":4          //道路宽度
     *       },
     *       "turbineGroup":[               //风机分组
     *               {"groupID":201,"turbineID":[321,365,234]},
     *               {"groupID":202,"turbineID":[321,365,234]}
     *       ]
     *   }
     */
    getDesiginDefaultPara() {
        return this.fanMoudle.getDesiginDefaultPara();
    };

    /**
     * 导入DXF道路文件
     * @private
     * @param {Number}prjId         工程ID
     * @param {Number}schemeId      方案ID
     * @param {File}fileInfo      文件内容
     */
    loadDxfRoad(prjId, schemeId, fileInfo) {
        return this.fanMoudle.loadDxfRoad(prjId, schemeId, fileInfo);
    };

    /***********************限制区域****************************/
    /**
     * 展示限制区域 --道路用
     * @param {Number}prjID             项目ID
     * @param {Number}schemeId          方案ID
     * @param {Boolean}isOpen
     * @return {Promise<{index:{Number},gis_type:{Number}}>}
     * @example
     *   var area=roadRestrictArea(40,1);
     *   area.then((restrictsInfo)=>{
     *      restrictsInfo.forEach((info)=>{
     *          info.index;             //限制区编号，
     *          info.gis_type;          //gis_type:地物类别1:居民 2: 湖泊 3:其他
     *
     *      });
     *   });
     */
    roadRestrictArea(prjID, schemeId, isOpen) {
        return this.fanMoudle.displayReatrict(prjID, schemeId, isOpen, 0);
    };

    /**
     * 展示限制区域 --线路用
     * @param {Number}prjID             项目ID
     * @param {Number}schemeId          方案ID
     * @param {Boolean}isOpen
     * @return {Promise<{index:{Number},gis_type:{Number},forbiddentype:{Number}}>}
     * @example
     *   var area=lineRestrictArea(40,1);
     *   area.then((restrictsInfo)=>{
     *      restrictsInfo.forEach((info)=>{
     *          info.index;             //限制区编号，
     *          info.gis_type;          //[gis_type:地物类别(1:居民 2: 湖泊 3:其他)]
     *          info.forbiddentype; (仅线路使用字段)//[forbiddentype:限制性因素的类型 (1:禁止跨越和立塔 2:可跨越)]
     *      });
     *   });
     */
    lineRestrictArea(prjID, schemeId, isOpen) {
        return this.fanMoudle.displayReatrict(prjID, schemeId, isOpen, 1);
    };

    /**
     * 获取限制性因素列表---道路和线路公用
     * @returns {Promise<{index:{Number},gis_type:{Number},forbiddentype:{Number}}>}
     * @example
     *   var area=restrictArea(40,1);
     *   area.then((restrictsInfo)=>{
     *      restrictsInfo.forEach((info)=>{
     *          info.index;             //限制区编号，
     *          info.gis_type;          //[gis_type:地物类别(1:居民 2: 湖泊 3:其他)]
     *          info.forbiddentype; (仅线路使用字段)//[forbiddentype:限制性因素的类型 (1:禁止跨越和立塔 2:可跨越)]
     *      });
     *   });
     */
    getRestrictAreasList() {
        return this.fanMoudle.getrestrictList();
    };

    /**
     * 增加一个限制区----道路线路公用
     * @param {Object}options
     * @param {String}options.index             限制区编号
     * @param {String}options.gis_type          分类类别1:居民 2: 湖泊 3:其他
     * @param {String}options.forbiddentype     限制类别1:禁止跨越和立塔 2:可跨越
     * @example
     * 1.道路
     *      addNewRestrictArea({"index":"Z003","gis_type":1});//gis_type--[1:居民 2: 湖泊 3:其他]
     * 2.线路
     *      addNewRestrictArea({"index":"Z003","gis_type":1,"forbiddentype":1});//forbiddentype--[1:禁止跨越和立塔 2:可跨越]
     */
    addNewRestrictArea(options) {
        this.fanMoudle.addRestrict(options);
    };

    /**
     * 开始编辑限制区域
     * @param {String}restrictAeraID        限制区编号
     */
    startEitRestrictArea(restrictAeraID) {
        this.fanMoudle.startEditRestrict(restrictAeraID);
    };

    /**
     * 取消当前限制区的编辑状态
     */
    stopEditRestrictArea() {
        this.fanMoudle.stopEditCurrentEntity();
    };

    /**
     * 删除一个指定的限制区
     * @param {String}restrictAeraID        限制区编号
     */
    deleteRestrictArea(restrictAeraID) {
        this.fanMoudle.deleteRestrict(restrictAeraID);
    };

    /**
     * 提交编辑后的限制区域
     * @returns {Object}  需要传递给后台上传到S3中的GeoJSON对象
     */
    submitEditRestrictArea() {
        return this.fanMoudle.submitEditRestrict();
    };

    /**
     * 高亮显示指定的限制区
     * @param {String}restrictAeraID        限制区编号
     */
    locationSelectRestarictAera(restrictAeraID) {
        this.fanMoudle.locationRestrict(restrictAeraID);
    };

    /**
     * 渲染噪声图层(废弃)
     * @param {Number}prjID             项目编号
     * @param {Number}schemeID          方案编号
     * @return {Promise<any>}           返回状态信息
     * {
     *      code:200,           --[200--渲染成功，404--渲染失败]
     *      message:"Success"   --[提示信息]
     * }
     */
    loadCSVNoise(prjID, schemeID){

    };
    /**
     * 通过范围加载噪声图片
     * @param {Number}prjID             项目编号
     * @param {Number}schemeID          方案编号
     * @param {Number[]}extent          噪声范围[minX,maxX,minY,maxY]
     * */
    loadCSVNoiseWithExtent(prjID, schemeID,extent){
        this.fanMoudle.createNoiseFiled(prjID,schemeID,extent);
    };

    /**
     * 移除噪声图层
     */
    removeCSVNoise(){
        this.fanMoudle&&this.fanMoudle.removeNoiseFiled();
    };

    /****************************集电线路*******************************/
    /**
     * 清空高亮显示的集电线路塔对象
     */
    clearHighTowerLabel(){
        this.fanMoudle&&this.fanMoudle.clearHighTowerLabel();
    };

    dxfCollectLine (prjId, schemeId, isOpen) {
        this.fanMoudle && this.fanMoudle.dxfCollectline(prjId, schemeId, isOpen);
     /*  let promise = Cesium.Resource.fetchJson({url:'./static/kml/line.json'});
        let dxfC = new DxfCollectLine(this.viewer);
        promise.then((data) => {
            dxfC.loadDxfCollectLine(data);
            this.flyToProject( 79.77014713874779, 25.375051603333326);
        });*/
    };

    /**
     * @typedef lineInfo
     * @property {Boolean}isTower        排塔后路径--true;桩位路径--false
     * @property {Number}lineLength      线长
     * @property {String}level           电压等级
     * @property {Number}lineMun         直线塔个数
     * @property {Number}angleNum        转角塔个数
     */
    /**
     * 集电线路
     * @param   {Number}prjId         工程ID
     * @param   {Number}schemeId      方案ID
     * @param   {Boolean}isOpen        集电线路按钮是否选中状态
     * @return {Promise<lineInfo>}
     */
    collectLine(prjId, schemeId, isOpen) {
        return this.fanMoudle.loadCollectLine(prjId, schemeId, isOpen);//  //createCollectLine  loadStakeLine  loadCollectLine
    };

    /**
     * 显示排塔后线路
     * @param isOpen
     */
    displayTowerLine(isOpen) {
        this.fanMoudle.dispalyTowerLine(isOpen);
    };

    /**
     * 显示桩位线路
     * @param isOpen
     */
    displayStakeLine(isOpen) {
        this.fanMoudle.displayStakeLine(isOpen);
    };

    /**
     * 显示三维塔模型
     */
    display3DTower() {
        this.fanMoudle && this.fanMoudle.display3DTower();
    };

    /**
     * 获取集电线路分支路线列表
     * @return {Array}
     * [{
     *      entityID:'',                    //标识线路的唯一值,用于线路定位传入的ID值
     *      lineInfo:{
     *           'lineLength':lineLength,  //线路总长
     *           'level':'35KV',           //电压等级
     *           'lineMun':lineNum,        //直线塔个数
     *           'angleNum':angleNum       //转角塔个数
     *      }
     * }]
     */
    getCollectLineListInfo() {
        return this.fanMoudle.getCollectLineListInfo();
    };

    /**
     * 定位到指定的线路分支并高亮显示
     * @param {String}lineEntityID              分支线路的entityID,来自getCollectLineListInfo中返回的entitID值
     */
    highLightSelectBranchRoute(lineEntityID) {
        this.fanMoudle.highLightSelectBranchRoute(lineEntityID)
    };

    /**
     * 获取集电线路支线的横断面数据
     * @param {String}collectLineEntityID        支线所在实体的entityID,值来自getCollectLineListInfo方法中返回的entityId
     * @returns {Promise<Object>}
     * index        点号索引
     * lon          经度
     * lat          纬度
     * x            长度
     * y            高度
     */
    getcolloectLineCrossSection(collectLineEntityID) {
        return this.fanMoudle.getcolloectLineCrossSection(collectLineEntityID);
    };

    /**
     * 重新设计-获取集电线路风机分组信息
     * @param {Number/String}prjId                 工程ID
     * @param {Number}schemeId              方案ID
     * @return {Promise<{groupID:{Number},turbineID:{Number}}[]>}     结构如下
     * "turbineGroup": [
     *    {
     *     "groupID": 1,          --分组编号
     *     "turbineID": [ 1,2,3]  --风机编号
     *   },
     *    {
     *     "groupID": 2,
     *     "turbineID": [4,5,6]
     *    }
     * ]
     */
    getTurbineGroupInfo(prjId, schemeId) {
        return this.fanMoudle.getTurbineGroupInfo(prjId, schemeId);
    };

    /**
     * 重新设计---自动选线
     * @param {Number/String}prjId             工程编号
     * @param {Number}schemeId                 方案编号
     * @param {Boolean}isOpen                  是否开启
     * @return {Promise<Boolean>}
     * true--加载完成
     */
    loadStakeLine(prjId, schemeId, isOpen) {
        this.fanMoudle.loadStakeLine(prjId, schemeId, isOpen);
    };



    /**
     * 保存修改完的塔型信息
     * @param {Object}towerInfo
     * {
     *      type:'',
     *      callHeight:'',
     *      chuanModel:{
     *          leftBack: '',
     *          leftFore: '',
     *          middleBack:	'',
     *          middleFore:	'',
     *          rightBack: '',
     *          rightFore:'',
     *      }
     * }
     */
    saveChangeTowerType(towerInfo) {
        console.log(towerInfo);
        this.fanMoudle && this.fanMoudle.saveChangeTowerType(towerInfo);
    };

    /**
     * 获取塔型库
     * @return {String[]}  ['35K-L1A2-J1', '35K-L1A2-J2']
     */
    getDefalutToweriInfo() {
        return this.fanMoudle.getDefalutToweriInfo();
    };

    /**
     * 获取绝缘子串类型库
     * @return {String[]}   ['03M11NLL-00-07PZ1A', '03M11NLL-00-07PZ2A']
     */
    getDefaultChuanInfo() {
        return this.fanMoudle.getDefaultChuanInfo();
    };

    /**
     * 提交排塔后编辑完数据
     */
    submitEditTowerLineInfo() {
        return this.fanMoudle.submitEditTowerLineInfo();
    };

    /**
     * 提交自动选线编辑后数据
     * （根据修改后的坐标重新计算桩累距）
     */
    submitEditStakeLineInfo() {
        return this.fanMoudle.submitEditStakeLineInfo();
    };

    /**
     * 导入DXF集电线路文件
     * @param {Number}prjId         工程ID
     * @param {Number}schemeId      方案ID
     * @param {File}fileInfo      文件内容
     */
    loadDxfCollectLine(prjId, schemeId, fileInfo) {
        return this.fanMoudle.loadDxfCollectLine(prjId, schemeId, fileInfo);
    };

    /*************************集电线路编辑（桩位线路+塔位线路）*******************************/
    /**
     * 线路编辑（自动排塔后--塔位信息）
     */
    startEditTowerLine() {
        this.fanMoudle.startEditToolMode();
        this.fanMoudle.startEditTowerLine();
        this.fanMoudle&&this.fanMoudle.showOrHideFanNameLabel(false);//隐藏风机标签
    };

    /**
     * 停止编辑线路(塔位线路)
     */
    stopEditCollectLine() {
        this.fanMoudle.stopEditCollectLine();
        this.fanMoudle&&this.fanMoudle.showOrHideFanNameLabel(true);//显示风机标签
    };

    /**
     * 更换塔型
     * @param {Boolean}isOpen        --是否开启（true--点击更换塔型，false--处于编辑状态）
     */
    changeTowerType(isOpen) {
        this.fanMoudle.changeTowerType(isOpen);
    };

    /************************桩位线路（工具条开启）***************************************/
    /**
     * 开启编辑工具条
     */
    startEditToolMode() {
        this.fanMoudle&&this.fanMoudle.startEditToolMode();
        this.fanMoudle&&this.fanMoudle.showOrHideFanNameLabel(false);//隐藏风机标签
    };

    /**
     * 关闭编辑工具条
     */
    stopEditToolMode() {
        this.fanMoudle&&this.fanMoudle.stopEditToolMode();
        this.fanMoudle&&this.fanMoudle.showOrHideFanNameLabel(true);//显示风机标签
    };

    /******************节点编辑******************/
    /**
     * 初选线路编辑（只有桩位信息）
     */
    startEditStakeLine() {
        this.fanMoudle.startEditStakeLine();
    };

    /**
     * 停止编辑线路(桩位线路)
     */
    stopEditStakeLine(){
        this.fanMoudle&&this.fanMoudle.stopEditStakeLine();
    };

    /******************新增******************/
    /**
     * 开启绘制桩位线路
     * @param {Function}outRangeCallFunc  超出地形范围的提示
     */
    startDrawStakeLine() {
        let outRangeCallFunc=function () {

        };
        this.fanMoudle && this.fanMoudle.startDrawStakeLine(outRangeCallFunc);
    };

    /**
     * 关闭绘制桩位线路
     */
    stopDrawStakeLine() {
        this.fanMoudle && this.fanMoudle.stopDrawStakeLine();
    };

    /******************删除******************/
    /**
     * 开启删除桩位线路
     * @param {Object}options
     * @param {Function}[options.callBack]  鼠标选中支线的前端回调函数（再次确认弹出框）
     */
    startDeleteStakeLine(options) {
        this.fanMoudle && this.fanMoudle.startDeleteStakeLine(options);
    };

    /**
     * 关闭删除桩位线路
     */
    stopDeleteStakeLine() {
        this.fanMoudle && this.fanMoudle.stopDeleteStakeLine();
    };

    /**
     * 删除指定的桩位线路
     * @param {Cesium.Entity}entity        鼠标点击选中的线路Entity
     */
    deleteStakeLine(entity) {
        this.fanMoudle && this.fanMoudle.deleteStakeLine(entity);
    };

    /******************打断******************/
    /**
     * 开启打段桩位线路
     */
    startSplitStakeLine() {
        this.fanMoudle && this.fanMoudle.startSplitStakeLine();
    };

    /**
     * 关闭打断桩位线路
     */
    stopSplitStakeLine() {
        this.fanMoudle && this.fanMoudle.stopSplitStakeLine();
    };

    /******************合并******************/
    /**
     * 开启绘制桩位线路
     */
    startCombineStakeLine() {
       this.fanMoudle&&this.fanMoudle.startCombineStakeLine();
    };

    /**
     * 关闭绘制桩位线路
     */
    stopCombineStakeLine() {
        this.fanMoudle&&this.fanMoudle.stopCombineStakeLine();
    };

    /**************************升压站***********************************/
    /**
     * 升压站
     * @param {Number}prjId         工程ID
     * @param {Number}schemeId      方案ID
     * @param {Boolean}isOpen        升压站按钮是否选中状态
     * @return Promise <Object/undefined>     isOpen为false的时候返回null,为true的时候返回Promise
     * {
     *      digAmount:4200,     //挖方量
     *      fillAmount:3500，   //填方量
     *      baseHeight:420,     //基准高程
     *      points:[[110.2,35.2,425],[110.2,35.2,425],[110.2,35.2,425],[110.2,35.2,425]],       //升压站的边界点坐标
     *      stationWidth:444,   //宽度
     *      stationHeight: 22,  //长度
     *      stationArea: 22     //面积
     * }
     */
    stationDisplay(prjId, schemeId, isOpen) {
        return this.fanMoudle.createStation(prjId, schemeId, isOpen);
    };

    /**
     * 开始编辑升压站
     */
    editStation() {
        this.fanMoudle.startEditStation();
    };

    /**
     * 停止编辑升压站
     */
    stopEditStation() {
        this.fanMoudle.stopEditStation();
    };

    /**
     * 获取编辑后的升压站几何信息
     * @return {*}      GeoJSON对象，用于传给后台服务保存到S3上
     */
    getEditStationInfo() {
        return this.fanMoudle.saveEditStationGeoJSON();
    };

    /**************************巡飞***********************************/
    /**
     * 开始飞行（道路和集电线路共用）
     */
    startFlyPath() {
        this.fanMoudle.flyAction('start');
    };

    /**
     * 暂停飞行（道路和集电线路共用）
     */
    stopFlyPath() {
        this.fanMoudle.flyAction('stop');
    };

    /**
     * 停止飞行（道路和集电线路共用）
     */
    restartFlyPath() {
        this.fanMoudle.flyAction('restart');
    };

    /**************************VTK图谱***********************************/
    /**
     * 添加VTK（弃用）
     * @private
     * @param prjId         工程ID
     * @param sectorId      扇区ID
     * @param name          名称
     * @param postions      VTK中心点坐标  [[107.0,38.0]]
     */
    createVTK(prjId, sectorId, name, postions) {

    };

    /**
     * 移除VTK（弃用）
     * @param name
     */
    removeVTK(name) {

    };

    /**
     * 综合风图谱
     * @param prjID         工程编号
     * @param positions     VTK中心点坐标  [[107.0,38.0]]
     * @param fanHeight     风机轮毂高度
     * @param isOpen        是否开启
     * @return {Promise}    返回的最大最小风速
     * {
     *  max:7,
     *  min:4
     * }
     */
    createIntegrateWindMap(prjID, positions, fanHeight, isOpen) {
        return this.fanMoudle.createIntegrateWindMap(prjID, positions, fanHeight, isOpen);
    };

    /**
     * 限制因素(图谱同级别限制因素展示)
     * @param {Number}prjID         工程编号
     * @param {Boolean}isOpen        是否开启
     */
    createRestrict(prjID, isOpen) {
        this.fanMoudle.createRestrict(prjID, isOpen);
    };

    /**
     * 限制因素(图谱同级别限制因素展示)
     * @param {Number}  prjID         工程编号
     * @param {Boolean} isOpen        是否开启
     */
    createRestrictNew(prjID, isOpen) {
        this.fanMoudle.createRestrict(prjID, isOpen);
    };

    /**
     * 限制因素--湖泊
     * @param  {Number} prjID          工程编号
     * @param  {String}  url           限制区服务路径
     * @param  {Boolean} isOpen        true--添加/false--删除
     */
    createLakeRestrict(prjID, url, isOpen) {
        this.fanMoudle.createLakeRestrict(url, prjID, isOpen);
    };

    /**
     * 限制因素--居民地
     * @param  {Number}     prjID         工程编号
     * @param  {String}     url           限制区服务路径
     * @param  {Boolean}   isOpen         true--添加/false--删除
     */
    createHouseRestrict(prjID, url, isOpen) {
        this.fanMoudle.createHouseRestrict(url, prjID, isOpen);
    };

    /**
     * 限制因素--道路
     * @param  {Number} prjID           工程编号
     * @param  {String}  url            限制区服务路径
     * @param  {Boolean} isOpen         true--添加/false--删除
     */
    createRoadRestrict(prjID, url, isOpen) {
        this.fanMoudle.createRoadRestrict(url, prjID, isOpen);
    };

    /**
     * 限制区--红线区
     * @param {Number}prjID         工程编号
     * @param {Boolean}isOpen
     */
    createRedLineArea(prjID, isOpen) {
        this.fanMoudle.createRedLineArea(prjID, isOpen);
    };

    /**
     * 风图谱
     * @param prjID         工程编号
     * @param sectorID      扇区编号
     * @param positions     VTK中心点坐标  [[107.0,38.0]]
     * @param isOpen        是否开启
     * @return {Promise}    返回的最大最小风速
     * {
     *  max:7,
     *  min:4
     * }
     */
    createWindMap(prjID, sectorID, positions, isOpen) {
        return this.fanMoudle.createWindMap(prjID, sectorID, positions, isOpen);
    };

    /**
     * 风能切片
     * @param prjID         工程编号
     * @param sectorID      扇区编号
     * @param vtkName       文件名
     * @param positions     VTK中心点坐标  [[107.0,38.0]]
     * @param isOpen        是否开启
     * {
     *  max:7,
     *  min:4
     * }
     */
    createWindSplit(prjID, sectorID, vtkName, positions, isOpen) {
        return this.fanMoudle.createWindSplit(prjID, sectorID, vtkName, positions, isOpen);
    };

    /**
     * 大湍流区
     * @param prjID         工程编号
     * @param sectorID      扇区编号
     * @param positions     VTK中心点坐标  [[107.0,38.0]]
     * @param isOpen        是否开启
     * {
     *  max:3,
     *  min:1
     * }
     */
    createTurbulenceArea(prjID, sectorID, positions, isOpen) {
        return this.fanMoudle.createTurbulenceArea(prjID, sectorID, positions, isOpen);
    };

    /**
     * 机组震动区
     * @param prjID         工程编号
     * @param sectorID      扇区编号
     * @param positions     VTK中心点坐标  [[107.0,38.0]]
     * @param isOpen        是否开启
     * {
     *  max:3,
     *  min:1
     * }
     */
    createShakeArea(prjID, sectorID, positions, isOpen) {
        return this.fanMoudle.createShakeArea(prjID, sectorID, positions, isOpen);
    };

    /**************************尾流***********************************/
    /**
     * 加载流线
     * @param prjId    工程ID
     * @param sectorId  扇区ID
     * @param schemeId  方案ID
     * @param isOpen    true--开启流线；false--关闭流线
     */
    createSteamLine(prjId, sectorId, schemeId, isOpen) {
        this.fanMoudle.createStreamLine(prjId, sectorId, schemeId, isOpen);
    };

    /**
     * 尾流（弃用）
     * @param prjID   工程ID
     * @param isOpen  true--开启尾流；false--关闭尾流
     */
    createWake(prjID, isOpen) {
        this.fanMoudle.createWake(isOpen);
    };

    /**************************坐标转换***********************************/

    /**
     * 设置风场的EPSG号
     * @param {Number}epsg      风场EPSG号
     */
    setFarmEpsg(epsg) {
        this.farmEpsg=epsg;
        this.farmMoudle.setProjectEPSG(epsg)
    };
    /**
     * 设置风场的基本信息
     * @param {Object} options
     * @param {Number}[options.epsg]      风场数据源坐标系的EPSG号
     * @param {Number}[options.prjID]     风场编号
     */
    setFarmBaseInfo(options) {
        options=Cesium.defaultValue(options,{});
        this.farmEpsg=Cesium.defaultValue(options.epsg,2361);
        this.farmMoudle.setProjectEPSG(this.farmEpsg);
        this.fanMoudle.PRJID=Cesium.defaultValue(options.prjID,0);
        let url=baseS3Path+ this.fanMoudle.PRJID+'/UAV/output/'+ redlineUrl+'?t='+Date.parse(new Date());
        Cesium.Resource.fetchJson({url:url}).then((data)=>{
            this.fanMoudle.redLineArea = turf.polygon(data.inner);//红线区多边形
        });
    };

    /**
     * WGS84坐标转投影坐标
     * @param {Object}point 要转换的坐标点{x:105.0,y:35.9,z:0}
     * @description  默认是按照西安80,3度分带进行转换（自动计算按此分带的相应EPSG），若非此坐标系则请在切换风场时（使用坐标转换前）先设置风场EPSG号，即调用setFarmEpsg
     */
    BLH2XYZ(point) {
        return this.farmMoudle.latlonToXY(point);
        // return this.baseGloble.wgsBLto80coord(point);//BLH2xyz
    };

    /**
     * 投影坐标转WGS84坐标
     * @param {Object}point 要转换的坐标点{x:42414314.20,y:5089023.80,z:0}
     * @description  默认是按照西安80,3度分带进行转换（自动计算按此分带的相应EPSG），若非此坐标系则请在切换风场时（使用坐标转换前）先设置风场EPSG号，即调用setFarmEpsg
     * @return Number[] 返回值  [110.23,35.89]
     */
    XYZ2BLH(point) {
        return this.farmMoudle.XYToLatLon(point);
        //return this.baseGloble.xiAnCoordTo84BL(point);//  //xyz2BLH
    };

    /**
     * WGS84坐标系转指定EPSG号坐标系
     * @param {Object|{x, y}}point         要转换的点坐标
     * @param {Number}toEpsg               投影坐标系EPSG号级（目标坐标系EPSG）
     * @return {{x, y}|*}                  转换后的投影坐标
     */
    BLH2XYZWithEpsg(point, toEpsg) {
        return this.farmMoudle.transWithEpsg(point, 4326, toEpsg);
    };

    /**
     * 指定EPSG号坐标系转WGS84坐标系
     * @param {Object|{x, y}}point          要转换的点坐标
     * @param {Number}fromEpsg              投影坐标系EPSG号（来源坐标系EPSG）
     * @return {{x, y}|*}                   转换后的WGS84坐标
     */
    XYZ2BLHWithEPSG(point, fromEpsg) {
        return this.farmMoudle.transWithEpsg(point, fromEpsg, 4326);
    };

    /**************************KML***********************************/
    /**
     * 进入KML模块，预先设置KML弹窗的回调函数
     * @param {Object}options
     * @param {Function}[options.clickCallBack]       点击弹出窗口的回调  【feature: picked.id, info: picked.id.description】
     * @param {Function}[options.moveCallBack]        改变弹窗位置的回调 【position: position】
     */
    enterKmlMoudle (options) {
        if(!Cesium.defined(this.kmlLayerMana)){
            this.kmlLayerMana= new KmlManagerMoudle(this.viewer);
        }
        this.kmlLayerMana.enterKmlMoudle(options);
    };

    /**
     * 加载Kml图层
     * @param {Object}   options
     * @param {String}  [options.id]                     KML图层的唯一ID
     * @param {String}  [options.url]                    KML的路径
     * @param {Boolean} [options.visible]               KML的可见性
     * @param {Boolean} [options.clampToGround=true]     要素是否贴地--默认贴地
     * @return {Promise<Object>}                       KML图层
     */
    loadKmlLayer(options){
       return  this.kmlLayerMana&&this.kmlLayerMana.loadKmlLayer(options);
    };

    /**
     * 移除一个KmlLayer  xxxx
     * @param {KmlLayer}kmlLayer     kml图层
     */
    removeKmlLayer(kmlLayer){
        this.kmlLayerMana&&this.kmlLayerMana.removeKmlLayer(kmlLayer);
    };

    /**
     * 控制树节点的可见性
     *@param {Object}nodeInfo               树节点信息
     *@param {String}[nodeInfo.layerId]     kml图层id
     *@param {String}[nodeInfo.id]          树节点ID
     *@param {Number}[nodeInfo.type]        树节点类型
     *@param {Boolean}isVisible             节点的可见性
     */
    treeNodeVisible(nodeInfo, isVisible){
        this.kmlLayerMana&&this.kmlLayerMana.NodeVisible(nodeInfo, isVisible);
    };

    /**
     * 树节点定位
     *@param {Object}nodeInfo               树节点信息
     *@param {String}[nodeInfo.layerId]     kml图层id
     *@param {String}[nodeInfo.id]          树节点ID
     *@param {Number}[nodeInfo.type]        树节点类型
     *@param {Boolean}isVisible             节点的可见性
     */
    treeNodeLoaction (nodeInfo) {
        this.kmlLayerMana && this.kmlLayerMana.NodeLocation(nodeInfo);
    };

    /**
     * 移除树节点
     *@param {Object}nodeInfo               树节点信息
     *@param {String}[nodeInfo.layerId]     kml图层id
     *@param {String}[nodeInfo.id]          树节点ID
     *@param {Number}[nodeInfo.type]        树节点类型
     */
    treeNodeRemove (nodeInfo) {
        this.kmlLayerMana&&this.kmlLayerMana.NodeRemove(nodeInfo);
    };

    /**
     * 新建图层
     * @param {Object}options            图层基本属性
     * @param {String}[options.id]       图层唯一编号
     */
    addNewKmlLayer (options) {
         this.kmlLayerMana && this.kmlLayerMana.createNewLayer(options);
    };

    /**
     * @typedef  pointOptions              点要素的属性
     * @property {String}[imgUrl]          图标路径
     * @property {String}[name]            文本标注信息
     * @property {String}[color='#FFF']    颜色
     * @property {Number}[opacity=1]       透明度
     * @property {Number}[scale=1]         图标缩放比例
     */
    /**
     * @typedef  floderOptions              文件夹要素的属性
     * @property {String}[name]             文件夹名称
     */
    /**
     * @typedef  polylineOptions              线要素的属性
     * @property {String}[name]               折线的名称
     * @property {String}[color]              折线的颜色'#FFF'
     * @property {Number}[opacity]            折线的颜色透明度
     * @property {Number}[width]              折线的线宽
     */
    /**
     * @typedef  polygonOptions               多边形要素的属性
     * @property {String}[name]               多边形的名称
     * @property {String}[color]              多边形的颜色'#FFF'
     * @property {Number}[opacity]            多边形的颜色透明度
     */
    /**
     * 新建要素
     * @param {KmlLayer}kmlLayer                    要新增要素的图层
     * @param {String}pid                           要素的父节点编号
     * @param {Number}type                          要素的类型（1--点，2--线，3--面）
     * @param {Object}options                       要素的属性
     * 点：pointOptions
     * 线：polylineOptions
     * 面：polygonOptions
     * @param {Function}callback                    新增要素后的回调函数，传入参数如下
     * callback({  id: newEntity.id,
     *             name: newEntity.name,
     *             type: newEntity.type,
     *             visible: true,
     *             pid: pid,
     *             feature: newEntity
     * })
     */
    addNewKmlFeature (layerId,pid,type,options,callback) {
        this.kmlLayerMana && this.kmlLayerMana.createNewFeature(layerId,pid,type,options,callback);
    };

    /**
     * 修改树节点的属性
     * @param {Object}nodeInfo              要修改属性的树节点信息
     * @param {String}[nodeInfo.layerId]    树节点所属图层的ID
     * @param {String}[nodeInfo.id]         树节点的编号
     * @param {Object}options               要素修改后的属性
     * @param {Number}[options.opacity]     透明度
     * @param {String}[options.color]       颜色
     * @param {String}[options.name]        名称
     */
    changeNodeProperty (nodeInfo, options) {
        this.kmlLayerMana && this.kmlLayerMana.changeFeatureProperty(nodeInfo,options);
    };

    /**
     * 退出KML图层模块
     */
    exitKmlMoudle () {
        this.kmlLayerMana && this.kmlLayerMana.exitKmlMoudle();
    };
    /**************************方案比选***********************************/

    /**
     * 进入方案比选模块
     */
    enterSchemeCompare () {
        if(!Cesium.defined(this.schemCompareMoudle)){
            this.schemCompareMoudle = new SchemeCompMoudle(this.viewer);
        }
        this.schemCompareMoudle.enterSchemeCompare();
    };

    /**
     * 加载一个方案的风机图标
     * @param {String/Number}scheme                    方案的唯一标识
     * @param {Object}schemeOptions                    方案通用属性
     * @param {String}[schemeOptions.imgUrl]           该方案使用的风机图标
     * @param {String}[schemeOptions.color]            该方案使用的风机标签颜色
     * @param {Object[]}turbineOptions                 风机信息
     * @param {Number[]}[turbineOptions.point]         风机坐标
     * @param {String}[turbineOptions.name]            风机名称
     * @param {Number}[turbineOptions.id]              风机编号
     * @return {Promise<Boolean>}                      是否加载完毕
     * @example
     * createSchemeTurbines('1',{imgUrl:'./static/11.png'.color:'#FFF'},[{point:[110.23,35.8],name:'S0001',id:52000}])
     */
    createSchemeTurbines (scheme, schemeOptions, turbineOptions) {
        if(!Cesium.defined(this.schemCompareMoudle)){
            this.schemCompareMoudle = new SchemeCompMoudle(this.viewer);
        }
        return this.schemCompareMoudle.createSchemeTurbines(scheme, schemeOptions, turbineOptions);
    };

    /**
     * 设置风机标签的可见性
     * @param {String/Number}scheme         方案的唯一识别
     * @param {Boolean}isVisible            是否可见
     */
    setSchemeTurbineNameVisible (scheme, isVisible) {
        this.schemCompareMoudle&&this.schemCompareMoudle.setSchemeTurbineNameVisible(scheme, isVisible);
    };

    /**
     * 设置风机标签的可见性
     * @param {String/Number}scheme         方案的唯一识别
     * @param {Boolean}isVisible            是否可见
     */
    setSchemeTurbineIconVisible (scheme, isVisible) {
        this.schemCompareMoudle&&this.schemCompareMoudle.setSchemeTurbineIconVisible(scheme, isVisible);
    };

    /**
     * 移除单个方案中的风机图标（含文本）
     * @param {String/Number}scheme
     */
    removeSchemeTurbines (scheme) {
        this.schemCompareMoudle && this.schemCompareMoudle.removeSchemeTurbines(scheme);
    };

    /**
     * 设置重复点位鼠标滑过的回调函数
     * @param {Function}mouseMoveCallBack
     * [{id:1111,name:'t12'},{id:1111,name:'t12'}]
     */
    setMouseEventCallBack(mouseMoveCallBack) {
        this.schemCompareMoudle && this.schemCompareMoudle.setMouseEventCallBack(mouseMoveCallBack);
    };

    /**
     * 退出方案比较
     */
    exitSchemeCpmpare () {
        this.schemCompareMoudle&&this.schemCompareMoudle.exitSchemeCpmpare();
    };
    /**************************测量***********************************/
    /**
     * 长度测量
     */
    measureLength() {
        this.measureHelper.measureLength({
            width: 3,
            geodesic: true
        });
    };

    /**
     * 面积测量
     */
    measureArea() {
        this.measureHelper.measureArea({isClapOnTerrian: true});
    };

    /**
     * 高度测量(简单)
     */
    measureHeightSample() {
        this.measureHelper.measreHeightSample({
            width: 3,
            geodesic: true
        });
    };

    /**
     * 高度测量(复杂--三角测量)
     */
    measureHeightComplex() {
        this.measureHelper.measureHeightComplex({
            width: 3,
            geodesic: true
        });
    };

    stopMeasure(){
        this.measureHelper.endMeasure();
    };

    /**
     * 清空测量
     */
    clearMeasure() {
        this.stopMeasure();
        this.measureHelper.clearMeasure();
    };

    /**
     * 开始剖面分析
     * @param {Function}callBack            绘制完折线后的回调函数
     * [{
     *               id: 0,             //编号
     *               x: dis,            //距离第一个点的距离
     *              lng: degs[0],       //经度
     *              lat: degs[1],       //纬度
     *              y: 0                //地形高度
     * },.....]
     */
    enterProfileAnalysis (callBack) {
        if(!Cesium.defined(this.profileAnalysis)){
            this.profileAnalysis = new ProfileAnalysis(this.viewer);
        }
        this.profileAnalysis.analysis(callBack);
    };

    /**
     * 退出剖面分析，清空剖面分析用折线
     */
    exitProfileAnalysis (){
        this.profileAnalysis && this.profileAnalysis.exitAnalysis();
    };

    /**************************即时标绘***********************************/
    /**
     * 绘制图标点
     * @param {Object}options                   绘制图标所需样式信息
     * @param {String}[options.imgUrl]          图标路径
     * @param {String}[options.text='']            文本标注信息
     * @param {Number}[options.fontSize=20]        文本标注字体大小
     * @param {String}[options.fontColor='#FFF']       文本标注颜色
     * @param {Number}[options.scale=1.0]           图标缩放倍数
     */
    drawIconPoint (options) {
        if (!Cesium.defined(this.plotMoudle)) {
            this.plotMoudle = new PlotMoudle(this.viewer);
        }
        this.plotMoudle.drawIconPoint(options);
    };

    /**
     * 绘制折线
     * @param {Object}options                   折线的样式
     * @param {String}[options.color='#FFF']           折线的颜色'#FFF'
     * @param {Number}[options.opacity=0.6]         折线的颜色透明度
     * @param {Number}[options.width=3.0]           折线的线宽
     */
    drawPolyLine (options) {
        if (!Cesium.defined(this.plotMoudle)) {
            this.plotMoudle = new PlotMoudle(this.viewer);
        }
        this.plotMoudle.drawPolyline(options);
    };

    /**
     * 绘制多边形
     * @param {Object}options                      多边形的样式
     * @param {String}[options.color='#FFF']              多边形的填充颜色'#FFF'
     * @param {Number}[options.opacity=0.6]            多边形填充色的透明度
     */
    drawPolygon (options) {
        if (!Cesium.defined(this.plotMoudle)) {
            this.plotMoudle = new PlotMoudle(this.viewer);
        }
        this.plotMoudle.drawPolygon(options);
    };

    /**
     * 绘制圆形
     * @param {Object}options                      圆形的样式
     * @param {String}[options.color='#FFF']              圆形的填充颜色'#FFF'
     * @param {Number}[options.opacity=0.6]            圆形填充色的透明度
     */
    drawCircle (options) {
        if (!Cesium.defined(this.plotMoudle)) {
            this.plotMoudle = new PlotMoudle(this.viewer);
        }
        this.plotMoudle.drawCircle(options);
    };

    /**
     * 绘制直线箭头（贴地）
     * @param {Object}options                      多边形的样式
     * @param {String}[options.color='#FFF']              多边形的填充颜色'#FFF'
     * @param {Number}[options.opacity=0.6]            多边形填充色的透明度
     */
    drawArrowStright (options) {
        if (!Cesium.defined(this.plotMoudle)) {
            this.plotMoudle = new PlotMoudle(this.viewer);
        }
        this.plotMoudle.drawArrowStright(options);
    };

    /**
     * 清空即时标绘
     */
    clearDrawPlot () {
        this.plotMoudle &&  this.plotMoudle.clearPlots();
    };

    /**************************等高线***********************************/
    /**
     * 加载等高线图层服务
     * @param {String}url                   服务路径
     * @param {String}layerName             图层名称
     */
    addContourServices (url, layerName) {
        this.removeContourSevices();
        this.farmMoudle && this.farmMoudle.addContourSevices(url,layerName);
    };

    /**
     * 移除等高线图层
     */
    removeContourSevices () {
        this.farmMoudle && this.farmMoudle.removeContourSevices();
    };

    /**************************后评估***********************************/
    /**
     * 进入后评估项目
     */
    enterReEvaleMoudle () {
        this.reEavlueMoudle = new ReEavlueMoudle(this.viewer);
    };

    /**
     * 定位到项目位置
     * @param {Number}lon       经度
     * @param {lon}lat          纬度
     */
    flyToReEvaluePrj(lon, lat){
        this.baseGloble.flyToLatLngWithAngle(lon, lat, 5000, 5,-20);
    };

    /**
     * 加载后评估项目
     * @param {Object}data          风巽接口返回的geoJson数据
     * @param {String}imgUrl        项目图标路径
     * @returns {Promise<Boolean>}  项目是否加载完毕
     */
    loadWindFileds (data,imgUrl) {
        this.reEavlueMoudle = new ReEavlueMoudle(this.viewer);
        return this.reEavlueMoudle.createWindFileds(data,imgUrl);
    };

    /**
     * 设置风场对象的可见性
     * @param {Number}mapKey                  风场对象的唯一识别（MAPKEY）
     * @param {Boolean}isVisible              可见性
     */
    setWindFiledVisible (mapKey, isVisible) {
        this.reEavlueMoudle && this.reEavlueMoudle.setWindFiledVisible(mapKey, isVisible);
    };

    /**
     * 加载标杆案例中的风机信息
     * @param {Array}datas
     *  [{'fid':'A01 ','jx':'GW108/2000 ','lggd':'80','lng':103.151,'lat':28.236,'hours':'2508.46','speed':'8.05'},
     *  {'fid':'A02 ','jx':'GW108/2000 ','lggd':'80','lng':103.154,'lat':28.237,'hours':'2451.44','speed':'7.89'}]
     */
    loadTurbines (datas) {
        this.reEavlueMoudle && this.reEavlueMoudle.createTurbines(datas);
    };

    /**
     * 清空后评估风场中风机模型
     */
    clearReEvalueTurbine() {
        this.reEavlueMoudle && this.reEavlueMoudle.clearReEvalueTurbine();
    };

    /**
     * 设置后评估项目的鼠标事件回调函数
     * @param {Object}callBacks
     * @param {Function}[callBacks.infoCallBack]            鼠标点击显示项目详情的回调函数
     * infoCallBack参数{
     *                      'MAPKEY':1,
     *                      'PINID':'湖北麻城蔡家寨湖北能源风电场',
     *                      'TYPE':'GOLDWIND-2000-2014019'
     *                  }
     * @param {Function}[callBacks.infoMoveCallBack]        项目详情信息框随球转动
     * infoMoveCallBack参数{
     *                          id: 'A01',
     *                          pos:{x:120,y:25}
     *                      }
     */
    setFiledMouseEventCallback (callBacks){
        this.reEavlueMoudle && this.reEavlueMoudle.setPrjMouseEvents(callBacks);
    };

    /**
     * 设置后评估项目中风机鼠标事件回调函数
     * @param {Object}callBacks
     * @param {Function}[callBacks.infoCallBack]            鼠标点击显示风机的回调函数
     * infoCallBack参数{
     *                      id:'A01',
     *                      infos:{'fid':'A01','jx':'GW108/2000','lggd':'80','lng':'103.151','lat':'28.236','hours':'2508.46','speed':'8.05'}
     *                  }
     * @param {Function}[callBacks.infoMoveCallBack]        风机信息框随球转动
     * infoMoveCallBack参数{
     *                          id: 'A01',
     *                          pos:{x:120,y:25}
     *                      }
     */
    setTurbineMouseEventCallBack (callBacks) {
        this.reEavlueMoudle && this.reEavlueMoudle.setTurbineMouseEvents(callBacks);
    };

    /**
     * 退出后评估案例模式
     */
    exitReEvalueMoudle () {
        this.reEavlueMoudle && this.reEavlueMoudle.exitReEvakueMoudle();
    };

    /**************************前端回调***********************************/
    /**
     * 风场点击回调
     * @param farmClickListener
     */
    registerFarmClickListener(farmClickListener) {
        this.farmMoudle.farmClickListener = farmClickListener;
    };

    /**
     * 风机点击回调
     * @param fanClickListener
     */
    registerFanClickListener(fanClickListener) {
        this.fanMoudle.fanClickListener = fanClickListener;
        if(!Cesium.defined(this.schemCompareMoudle)) {
            this.schemCompareMoudle = new SchemeCompMoudle(this.viewer);
        }
        this.schemCompareMoudle.fanClickListener = fanClickListener;
    };

    /**
     * 风机移动结束回调
     * @param fanMoveEndListener
     */
    registerFanMoveEndListener(fanMoveEndListener) {
        this.fanMoudle.fanMoveEndListener = fanMoveEndListener;
    };

    /**确认删除桩位支线**/
    registerStakeLineDeleteListener(stakeLineDeleteListener) {
        if (Cesium.defined(this.fanMoudle.collectLineEdit)) {
            this.fanMoudle.collectLineEdit.stakeLineDeleteListener = stakeLineDeleteListener;
        }
    };

}

export default viewer;
