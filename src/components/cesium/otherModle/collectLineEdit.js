/* eslint-disable */
/**
 * Created by pengYX on 2018/9/3.
 */

import CustomDataSource from 'cesium/DataSources/CustomDataSource';
import Resource from 'cesium/Core/Resource';
import Color from 'cesium/Core/Color';
import defined from 'cesium/Core/defined';
import Entity from 'cesium/DataSources/Entity';
import Cartesian3 from 'cesium/Core/Cartesian3';
import Cartesian2 from 'cesium/Core/Cartesian2';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import VerticalOrigin from 'cesium/Scene/VerticalOrigin';
import HorizontalOrigin from 'cesium/Scene/HorizontalOrigin';
import HeightReference from 'cesium/Scene/HeightReference';
import LabelStyle from 'cesium/Scene/LabelStyle';
import DistanceDisplayCondition from 'cesium/Core/DistanceDisplayCondition';
import SceneTransforms from 'cesium/Scene/SceneTransforms';
import TowerLine from "./towerLine";
import TowerLineEditHelper from './drawEditHelper/towerLineEditHelper';
import EditStakeLineHelper from './drawEditHelper/editStakeLineHelper';
import TowerLineChangeTypeHelper from './drawEditHelper/towerLineChangeTypeHelper';
import DrawStakeLineHelper from './drawEditHelper/drawStakeLineHelper';
import CesiumMath from 'cesium/Core/Math';

import {setListener, clone, enhanceWithListeners} from './drawEditHelper/primitive/utilFunc';
import store from '../../../store/index';
import TerrianTool from "./terrianTool";
import {terrianLevel} from '../subMoudle/constants';

window.Turf = require('../../../../static/thirdParty/turf');

let towerLineColor=new Color(0.051,1,0.1176,1);//Color.HOTPINK.withAlpha(0.6)
let towerLabelHight=new Color(0.2,0.78,0.43,1),towerLabelColor=new Color(0.94, 0.94, 0.94, 1);

/**
 * 根据桩名获取塔坐标和塔累距
 * @param stakeName         桩名
 * @param offsetDist        相对桩的偏移量
 * @param surveyDatas       桩信息列表
 * @return {{stakeDist: string, coords: number[], stakeCoord: number[]}}
 * stakeDist        --桩累距
 * coords           --塔坐标
 * stakeCoord       --桩坐标
 */
function getTowerStakeDistAndCoords(stakeName, offsetDist, surveyDatas) {
    let stakeDist = '0.00', coords = [0, 0, 0], stakeCoord = [0, 0, 0];
    for (let i = 0; i < surveyDatas.length; i++) {
        if (surveyDatas[i].stakeName === stakeName) {
            stakeDist = surveyDatas[i].stakeDist;
            let curentPoint = [parseFloat(surveyDatas[i].stakeCoordinate.longitude), parseFloat(surveyDatas[i].stakeCoordinate.latitude), 0];//角度
            stakeCoord = curentPoint;
            let nextPoint = [0, 0, 0], nextIndex = 0,line=null;
            if (offsetDist >= 0) {
                nextIndex = i + 1 <=surveyDatas.length-1 ? i + 1 : 0;
                nextPoint = [parseFloat(surveyDatas[nextIndex].stakeCoordinate.longitude), parseFloat(surveyDatas[nextIndex].stakeCoordinate.latitude), 0];//角度
                line=Turf.lineString([curentPoint,nextPoint]);
            }
            if (offsetDist < 0) {
                nextIndex = i - 1<0 ? surveyDatas.length - 1 : i - 1;
                nextPoint = [parseFloat(surveyDatas[nextIndex].stakeCoordinate.longitude), parseFloat(surveyDatas[nextIndex].stakeCoordinate.latitude), 0];//角度
                line=Turf.lineString([curentPoint,nextPoint]);
            }
            //let options = {units: 'miles'};
            //let cartog = new Cesium.EllipsoidGeodesic(Cesium.Cartographic.fromDegrees(curentPoint[0], curentPoint[1]), Cesium.Cartographic.fromDegrees(nextPoint[0], nextPoint[1])).interpolateUsingSurfaceDistance(Math.abs(offsetDist));
            // coords = [Cesium.Math.toDegrees(cartog.longitude), Cesium.Math.toDegrees(cartog.latitude), 0];
            coords=Turf.along(line, Math.abs(offsetDist/1000));
            break;
        }
    }
    return {stakeDist: stakeDist, coords: coords.geometry.coordinates, stakeCoord: stakeCoord};
}

/**数组根据数组对象中的某个属性值进行排序的方法
 * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性 如number属性
 * @param rev true表示升序排列，false降序排序
 * */
function sortBy(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = (rev) ? 1 : -1;
    }
    return function (a, b) {
        a = parseFloat(a[attr]);
        b = parseFloat(b[attr]);
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}

/**
 * 通过塔获取回路信息（含绝缘子串）
 * @param towerName
 */
function getChuanInfo(towerName, loopLineData) {
    let loopData = {},index=0;
    for (let i = 0; i < loopLineData.length; i++) {
        if (loopLineData[i].towerName === towerName) {
            loopData = loopLineData[i];
            index=i;
            break;
        }
    }
    return {loopData:loopData,index:index};
}

/**
 * 集电线路相关
 */
class CollectLineEdit {
    constructor(viewer) {
        this.viewer = viewer;
        this.lineDS = new CustomDataSource('LineDS');//存储集电线路--编辑用二维辅助线
        this.modelLineDS = new CustomDataSource('modelLineDS');//存储立塔用线路数据,弧线和标签
        this.entities = this.lineDS.entities;
        this.terrianTool=new TerrianTool(viewer);
        this.viewer.dataSources.add(this.lineDS);
        this.viewer.dataSources.add(this.modelLineDS);
        this.towerLine = new TowerLine(viewer);

        this.towerLineEntities = [];//存储包含转角塔和支线塔的线路Entity(手动编辑使用)
        this.towerLabelEntities=[];//三维立塔用标签集合

        this.lineEntity=[];//存储二维编辑用线集合

        this.handle = new ScreenSpaceEventHandler(viewer.scene.canvas);

        this.originJson = {
            "coordinateType": "1",
            "fileVer": "1.0",
            "middleLongitude": "115.89630809",
            "routeData":[]
        };
        this.isTower=false;//是否已经排塔，默认为已排塔状态

        this.stakeLineDeleteListener=null;

    };

    /**
     * @typedef lineInfo
     * @property {Boolean}isTower         排塔后路径--true;桩位路径--false
     * @property {Number}lineLength      线长
     * @property {String}level           电压等级
     * @property {Number}lineMun         直线塔个数
     * @property {Number}angleNum        转角塔个数
     */
    /**
     * 显示线路（桩和塔两种线路入口）
     * @param {String}url               jf文件路径
     * @return {Promise<lineInfo>}      线路信息
     */
    displayCollectLine(url){
        this.line2DInfo=[];
        this.removeCollectLine();
        //this.lineDS.entities.removeAll();
        let loadPromise = Resource.fetch({url: url,overrideMimeType:'text/html;charset=utf-8'});//gb2312
        return new Promise((resolve, reject)=>{
            loadPromise.then((data) =>{
                let dataJ = JSON.parse(data);
                if(defined(dataJ)){
                    this.originJson = clone(dataJ);
                }
                let lineLength=0,angleNum=0,lineNum=0;
                dataJ&&dataJ.routeData&&dataJ.routeData.forEach((route) =>{
                    route.surveyData.sort(sortBy('stakeDist', true));//将转角桩按照桩累距进行排序（即找出转角桩顺序）
                    if( defined(route.towerData)&&route.towerData.length>0){//排塔后线路
                        [lineLength,angleNum,lineNum]=this.displayTowerLine(route,lineLength,angleNum,lineNum);
                        this.isTower=true;
                    }else{//未排塔线路
                        this.isTower=false;
                        [lineLength,angleNum,lineNum]=this.displayStakeLine(route,lineLength,angleNum,lineNum);
                    }
                });
                if(this.isTower){
                    resolve({
                        'isTower':true,           //是否排塔
                        'lineLength':lineLength,  //线路总长
                        'level':'35KV',           //电压等级
                        'lineMun':lineNum,        //直线塔个数
                        'angleNum':angleNum       //转角塔个数
                    });
                    this.display3DTower();
                }else{
                    resolve({
                        'isTower':false,          //是否排塔
                        'lineLength':lineLength,        //线路总长
                        'level':'35KV',             //电压等级
                        'lineMun':0,           //直线塔个数
                        'angleNum':0           //转角塔个数
                    });
                }
            },(error)=>{
                this.isTower=false;
                console.log('S3上文件读取失败，请确认文件是否存在，文件路径：' + url);
                reject({"code":404,"url":url});
            });
        });
    };

    /**
     * 显示排塔后3D线路
     * @return {{isTower: boolean, lineLength: number, level: string, lineMun: number, angleNum: number}}
     */
    displayTowerLines(){
        this.modelLineDS.entities.removeAll();
        this.lineDS.entities.removeAll();
        let lineLength=0,angleNum=0,lineNum=0;
        let dataJ=this.originJson;
        dataJ&&dataJ.routeData&&dataJ.routeData.forEach((route) =>{
            route.surveyData.sort(sortBy('stakeDist', true));//将转角桩按照桩累距进行排序（即找出转角桩顺序）
            if(defined(route.towerData)&&route.towerData.length>0){//排塔后线路
                [lineLength,angleNum,lineNum]=this.displayTowerLine(route,lineLength,angleNum,lineNum);
                this.isTower=true;
            }
        });
        return {
            'isTower':true,           //是否排塔
            'lineLength':lineLength,  //线路总长
            'level':'35KV',           //电压等级
            'lineMun':lineNum,        //直线塔个数
            'angleNum':angleNum       //转角塔个数
        }
    };

    /**
     * 显示未排塔桩位线路
     * @return {{isTower: boolean, lineLength: number, level: string, lineMun: number, angleNum: number}}
     */
    displayStakeLines(){
        this.modelLineDS.entities.removeAll();
        this.entities.removeAll();
        let lineLength=0,angleNum=0,lineNum=0;
        let dataJ=this.originJson;
        dataJ&&dataJ.routeData&&dataJ.routeData.forEach((route) =>{
            route.surveyData.sort(sortBy('stakeDist', true));//将转角桩按照桩累距进行排序（即找出转角桩顺序）
            this.isTower=false;
            [lineLength,angleNum,lineNum]=this.displayStakeLine(route,lineLength,angleNum,lineNum);
        });
        return {
            'isTower':false,           //是否排塔
            'lineLength':lineLength,   //线路总长
            'level':'35KV',           //电压等级
            'lineMun':lineNum,        //直线塔个数
            'angleNum':angleNum       //转角塔个数
        }
    };

    /**
     * 排塔后路径绘制
     * @param route             单条线路信息
     * @param lineLength        路径长度
     * @param angleNum          转角塔个数
     * @param lineNum           直线塔个数
     * @return {*[]}
     */
    displayTowerLine(route,lineLength,angleNum,lineNum){
        let towers = [], points = [],angleTowerCount=0,lineTowerCount=0;//塔
        if(route.towerData.length<2){
            console.log(route,'塔小于两个，无法渲染');
            return [lineLength,angleNum,lineNum];
        }
        route.towerData.forEach((tower) => {
            let res = getTowerStakeDistAndCoords(tower.stakeName, parseFloat(tower.offsetDist), route.surveyData);
            if(tower.attachMode==='1'){
                lineTowerCount++;
            }
            if(tower.attachMode==='2'){//转角
                angleTowerCount++;
            }
            let chuanInfo= getChuanInfo(tower.name, defined(route.loopLine)?route.loopLine[0].data:{});
            tower.loopLineData =chuanInfo.loopData;
            tower.kValue=chuanInfo.loopData.wire.kValue;
            tower.loopLineIndex =chuanInfo.index;
            tower.stakeDist = res.stakeDist;
            tower.towerDist = (parseFloat(tower.stakeDist) + parseFloat(tower.offsetDist)).toString();//计算塔累距（用于排序）
            tower.stakeCoords = res.stakeCoord;
            tower.coords = [res.coords[0], res.coords[1], parseFloat(tower.altitude)];
            towers.push(tower);
        });
        route.towers = towers.sort(sortBy('towerDist', true));
        route.lineInfo={
            routeName:route.routeName,
            routeLength:towers[towers.length-1].towerDist,
            angleTowerNum:angleTowerCount,
            lineTowerNum:lineTowerCount
        };
        lineLength+=parseFloat(towers[towers.length-1].towerDist);
        angleNum+=angleTowerCount;
        lineNum+=lineTowerCount;
        route.towers.forEach((tower)=>{
            points= points.concat(tower.coords);
        });
        let lineInfo = {points: points, routeInfo: route};
        this.line2DInfo.push(lineInfo);
        this._addLine(lineInfo, this.entities);
        return [lineLength,angleNum,lineNum];
    };

    /**
     * 初选桩位路径
     * @param route         单条线路信息
     */
    displayStakeLine(route,lineLength,angleNum,lineNum){
        let points = [];//桩
        let surveyRoute=clone(route);
        surveyRoute.towers=[];
        let preCoors=[0,0];
        let length=0;
        route.surveyData.forEach((survey,index) => {
            let coors = survey.stakeCoordinate;
            points = points.concat([parseFloat(coors.longitude), parseFloat(coors.latitude), parseFloat(coors.altitude)]);
            this._addStakeLabel([parseFloat(coors.longitude), parseFloat(coors.latitude), parseFloat(coors.altitude)],survey.stakeName,this.modelLineDS.entities);
            if(index!==0){
                preCoors=route.surveyData[index-1].stakeCoordinate;
                length+=Turf.distance(Turf.point([parseFloat(preCoors.longitude), parseFloat(preCoors.latitude)]), Turf.point([parseFloat(coors.longitude), parseFloat(coors.latitude)]), {units: 'kilometers'})*1000;
            }
            surveyRoute.towers.push({
                coords:[parseFloat(coors.longitude), parseFloat(coors.latitude), parseFloat(coors.altitude)],
                towerDist:parseFloat(survey.stakeDist)
            });
        });
        surveyRoute.lineInfo={
            routeName:route.routeName,
            routeLength:length,
            angleTowerNum:0,
            lineTowerNum:0
        };
        lineLength+=length;
        let lineInfo = {points: points, routeInfo: surveyRoute};
        this._addLine(lineInfo,this.modelLineDS.entities);//
        this._addLine(lineInfo,this.entities);
        this._hideShowDS(false,this.lineDS);
        return [lineLength,angleNum,lineNum];
    };

    /**
     * 桩位信息展示
     * @param {Number[]}coors                   桩位坐标点
     * @param {String}stakeName                 桩名
     * @param {EntityCollection}entities        对象集合
     * @private
     */
    _addStakeLabel(coors,stakeName,entities){
        entities.add({
            position: Cartesian3.fromDegrees(coors[0], coors[1], coors[2] + 8),
            name: 'stake',
            billboard:{
                image:'static/stakeSolid.png',
                scale : 1,
                rotation : 0,
                horizontalOrigin:HorizontalOrigin.CENTER,
                verticalOrigin:VerticalOrigin.CENTER,
                heightReference:HeightReference.CLAMP_TO_GROUND
               // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(boardInfo.near,boardInfo.far)
            },
            label: {
                text: stakeName,
                font: '14px sans-serif',//Philadelphia
                outlineWidth:2.0,
                outlineColor:Color.BLACK,
                horizontalOrigin: HorizontalOrigin.RIGHT,
                verticalOrigin:VerticalOrigin.BOTTOM ,
                style : LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cartesian2(0.0,-20),
                heightReference:HeightReference.CLAMP_TO_GROUND,
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 5000.0),
                disableDepthTestDistance:Number.POSITIVE_INFINITY
             /*   text: stakeName,
                font: '12px sans-serif',//Philadelphia
                fillColor: Color.BLACK,//new Color(0.012, 0.13, 0.24,1),
                outlineWidth: 1.0,
                outlineColor: new Color(0.012, 0.13, 0.24, 0.0),
                showBackground: true,
                backgroundColor: new Color(0.94, 0.94, 0.94, 1),
                backgroundPadding: new Cartesian2(7, 5),
                horizontalOrigin: HorizontalOrigin.RIGHT,
                verticalOrigin: VerticalOrigin.BOTTOM,
                style: LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cartesian2(0.0, 0.0),

                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 5000.0)*/
            }
        });
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
    getCollectLineListInfo(){
       // this.hideShow2DLine(true);
        let infoList=[];
        this.lineDS.entities.values.forEach((entity)=>{
            if(defined(entity.polyline)){
                infoList.push({entitID:entity.id,lineInfo:entity.polyline.routeInfo.lineInfo});
            }
        });
        return infoList;
    };

    /**
     * 定位到指定的线路分支并高亮显示
     * @param lineEntityID              分支线路的entityID,来自getCollectLineListInfo中返回的entitID值
     */
    highLightSelectBranchRoute(lineEntityID){
        let currentRoute=this.lineDS.entities.getById(lineEntityID);
        this.cancleHighLight();
        if(defined(currentRoute)&&defined(currentRoute.polyline)){
            currentRoute.polyline.material=Color.RED;
            this.currentBranchRoute=currentRoute;
            this.viewer.zoomTo(currentRoute);
        }
    };

    /**
     * 取消当前支线的高亮
     */
    cancleHighLight(){
        if(defined(this.currentBranchRoute)){
            this.currentBranchRoute.polyline.material=towerLineColor;//Color.HOTPINK.withAlpha(0.6);//new Cesium.Color(1,0.92,0.78,1);
        }
    };

    /**
     * 获取集电线路支线的横断面数据
     * @param collectLineEntityID        支线所在实体的entityID,
     *                                   值来自getCollectLineListInfo方法中返回的entityId
     * @returns {*}
     */
    getcolloectLineCrossSection(collectLineEntityID){
        let currentLine=this.lineDS.entities.getById(collectLineEntityID);
        let crossSectionData=[];
        if(defined(currentLine)&&defined(currentLine.polyline)) {
            let positions=currentLine.polyline.positions._value;
            let promise = this.terrianTool.sampleCartesianArrayTerrianHeight(positions, terrianLevel);
            let outPointObj={},towers=currentLine.polyline.routeInfo.towers;
            return new Promise((resolve, reject)=>{
                promise.then((updatePositions) => {
                    towers.forEach((tower,index)=>{
                        outPointObj={
                            index:index,                        //点索引
                            lon:tower.coords[0],                //经度坐标
                            lat:tower.coords[1],                //纬度坐标
                            x:parseFloat(tower.towerDist),      //长度
                            y:tower.coords[2],                  //高度
                            ty:updatePositions[index].height    //地形高度
                        };
                        crossSectionData.push(outPointObj);
                    });
                    resolve(crossSectionData);
                },(error)=>{
                    console.log("获取地形高度失败!");
                    reject(error);
                });
            });
        }else{
            console.log("未找到给定的线路支线！");
            return undefined;
        }
    }

    /**
     * 重新设计-获取集电线路风机分组信息
     * @param url
     * @return {Promise<any>}
     * "turbineGroup": [
     *    {
     *   "groupID": 1,          --分组编号
     *   "turbineID": [ 1,2,3]  --风机编号
     *   },
     *    {
     *     "groupID": 2,
     *    "turbineID": [4,5,6]
     *    }
     * ]
     */
    getTurbineGroupInfo(url) {
        let loadPromise = Resource.fetch({url: url});
        let res={};
        return new Promise((resole, reject) => {
            loadPromise.then((data) => {
                 res = JSON.stringify(data);
                resole(res);
            }, () => {
                reject({"code":404,"url":url});
            });
        });
    };


/********************************桩信息***********************************/
    /**
     * 重新设计--自动选线（加载只有转角桩的线路）
     * @param url               只有转角塔的集电线路
     * @return {Promise<any>}   集电线路概况信息
     */
    loadStakeLine(url) {
        this.lineDS.entities.removeAll();

        /**数组根据数组对象中的某个属性值进行排序的方法
         * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
         * @param attr 排序的属性 如number属性
         * @param rev true表示升序排列，false降序排序
         * */
        function sortBy(attr, rev) {
            //第二个参数没有传递 默认升序排列
            if (rev == undefined) {
                rev = 1;
            } else {
                rev = (rev) ? 1 : -1;
            }
            return function (a, b) {
                a = parseFloat(a[attr]);
                b = parseFloat(b[attr]);
                if (a < b) {
                    return rev * -1;
                }
                if (a > b) {
                    return rev * 1;
                }
                return 0;
            }
        }

        return new Promise((resolve, reject) => {
            Resource.fetch({url: url}).then((data) => {
                let dataJ = JSON.parse(data);
                this.originJson = clone(dataJ);
                dataJ.routeData.forEach((route) => {//支线
                    route.surveyData.sort(sortBy('stakeDist', true));//将转角桩按照桩累距进行排序（即找出转角桩顺序）
                    let points = [];//桩
                    route.surveyData.forEach((survey) => {
                        let coors = survey.stakeCoordinate;
                        points = points.concat([parseFloat(coors.longitude), parseFloat(coors.latitude), parseFloat(coors.altitude)]);
                    });
                    let lineInfo = {points: points, routeInfo: route};
                    this._addLine(lineInfo, this.entities);
                });
                resolve(true);
            }, (error) => {
                console.log("解析数据失败，请检查文件是否存在且格式正确,文件路径："+url);
                reject({"code":404,"url":url});
            });
        });
    };

    /**
     * 保存修改完的塔型信息
     * @param towerInfo
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
    saveChangeTower(towerInfo) {
        this.towerLineChangeTypeHelper&&this.towerLineChangeTypeHelper.saveTowerChangeType(towerInfo);
    };

    /**
     * 设置默认的塔型和绝缘子信息
     * @param towerInfo
     * {
     *      type:'',
     *      leftBack:'',
     *      leftFore:'',
     *      middleBack:'',
     *      middleFore:'',
     *      rightBack:'',
     *      rightFore:''
     * }
     */
    setDefaultTowerType(towerInfo){
        this.defaultTower={
            'towerType':towerInfo.type,
            'chuanModel':{
                'leftBack':towerInfo.leftBack,
                'leftFore':towerInfo.leftFore,
                'middleBack':towerInfo.middleBack,
                'middleFore':towerInfo.middleFore,
                'rightBack':towerInfo.rightBack,
                'rightFore':towerInfo.rightFore,
            }
        };
    };

    /**
     * 提交自动选线编辑后数据
     * （根据修改后的坐标重新计算桩累距）
     */
    submitEditStakeLineInfo() {
        this.originJson.routeData=[];
        this.entities.values.forEach((entity, index) => {
            if (defined(entity.polyline)) {
                let survey = clone(entity.polyline.routeInfo.surveyData);
                survey[0].stakeDist = '0.0000';
                let dis = 0;
                for (let i = 1; i < survey.length; i++) {
                    let point1 = Turf.point([parseFloat(survey[i - 1].stakeCoordinate.longitude), parseFloat(survey[i - 1].stakeCoordinate.latitude)]);
                    let point2 = Turf.point([parseFloat(survey[i].stakeCoordinate.longitude), parseFloat(survey[i].stakeCoordinate.latitude)]);
                    dis += Turf.distance(point1, point2, {units: 'kilometers'});
                    survey[i].stakeDist = (dis * 1000).toString();
                }
                this.originJson.routeData.push({
                    "earthCount": "0",
                    "earthLine": null,
                    "loopCount": "1",
                    "loopLine": null,
                    "routeName": entity.polyline.routeInfo.routeName,
                    "surveyData":survey,
                    "towerData": null,
                    "wireType": "2"
                });
            }
        });

        return this.originJson;
    };

    submitEditStakeLineInfoOld() {
        this.entities.values.forEach((entity, index) => {
            if (defined(entity.polyline)) {
                let survey = clone(entity.polyline.routeInfo.surveyData);
                this.originJson.routeData[index].surveyData=survey;
                this.originJson.routeData[index].surveyData[0].stakeDist = '0.0000';
                let dis = 0;
                for (let i = 1; i < survey.length; i++) {
                    let point1 = Turf.point([parseFloat(survey[i - 1].stakeCoordinate.longitude), parseFloat(survey[i - 1].stakeCoordinate.latitude)]);
                    let point2 = Turf.point([parseFloat(survey[i].stakeCoordinate.longitude), parseFloat(survey[i].stakeCoordinate.latitude)]);
                    dis += Turf.distance(point1, point2, {units: 'kilometers'});
                    this.originJson.routeData[index].surveyData[i].stakeDist = (dis * 1000).toString();
                }
            }
            if (this.originJson.routeData[index].towerData&&this.originJson.routeData[index].towerData.length>0){
                this.originJson.routeData[index].towerData=null;
            }
            if (this.originJson.routeData[index].loopLine&&this.originJson.routeData[index].loopLine.length>0){
                this.originJson.routeData[index].loopLine=null;
            }
            if(this.originJson.routeData[index].hasOwnProperty('towers'))
                delete this.originJson.routeData[index].towers;
            if(this.originJson.routeData[index].hasOwnProperty('lineInfo'))
                delete this.originJson.routeData[index].lineInfo;
        });

        return this.originJson;
    };

    /**
     * 提交排塔后编辑完数据
     */
    submitEditTowerLineInfo() {
        this.entities.values.forEach((entity, index) => {
                if (defined(entity.polyline)) {
                    let towerData=clone(entity.polyline.routeInfo.towers);
                    if (towerData) {
                        towerData.forEach((tower, i) => {
                            let loopIndex = clone(tower.loopLineIndex);
                            if (this.originJson.routeData[index].loopLine&&this.originJson.routeData[index].loopLine[0]
                                && this.originJson.routeData[index].loopLine[0].data[loopIndex]
                                && this.originJson.routeData[index].loopLine[0].data[loopIndex].wire) {
                                this.originJson.routeData[index].loopLine[0].data[loopIndex].wire = clone(tower.loopLineData.wire);
                            }
                            if (tower.hasOwnProperty('coords')) delete tower.coords;
                            if (tower.hasOwnProperty('loopLineData')) delete tower.loopLineData;
                            if (tower.hasOwnProperty('loopLineIndex')) delete tower.loopLineIndex;
                            if (tower.hasOwnProperty('stakeCoords')) delete tower.stakeCoords;
                            if (tower.hasOwnProperty('stakeDist')) delete tower.stakeDist;
                            if (tower.hasOwnProperty('towerDist')) delete tower.towerDist;
                            if (tower.hasOwnProperty('kValue')) delete tower.kValue;
                        });
                    }
                    this.originJson.routeData[index].towerData = towerData;
                    if(this.originJson.routeData[index].hasOwnProperty('towers'))
                        delete this.originJson.routeData[index].towers;
                    if(this.originJson.routeData[index].hasOwnProperty('lineInfo'))
                        delete this.originJson.routeData[index].lineInfo;
                }
            });
        return this.originJson;
    };

    saveEditCollectLine(){
        if(this.isTower){
            return this.submitEditTowerLineInfo();
        }else{
            return this.submitEditStakeLineInfo();
        }
    };
    /**
     * 三维方式展示塔
     */
    display3DTower() {
        let k = 0.000783;
        this._hideShowDS(false, this.lineDS);
        //this.hideShow2DLine(false);
        this.towerLabelEntities=[];
        this.entities.values.forEach((entity) => {
            if (defined(entity.polyline)) {
                let towers = entity.polyline.routeInfo.towers;
                let prePoints = this._addTowerModel(towers[0]);
                for (let i = 1; i < towers.length; i++) {
                    let nextLinePoints = this._addTowerModel(towers[i]);
                    let point1 = (parseInt(towers[i - 1].attachMode) === 1) ? prePoints.chuanCoord[0] : prePoints.chuanCoord[1];
                    k=parseFloat(towers[i - 1].kValue);
                    let point2 = nextLinePoints.chuanCoord[0];
                    prePoints = nextLinePoints;
                    this._addArcLine(this.calArcLine(point1.groundPos, point2.groundPos, k), new Color(0, 0.776, 1, 1));//Cesium.Color.RED.withAlpha(0.5)
                    this._addArcLine(this.calArcLine(point1.topPos, point2.topPos, k), new Color(0.988, 0, 0.165, 1));//Cesium.Color.GREEN.withAlpha(0.5)
                    this._addArcLine(this.calArcLine(point1.btmLPos, point2.btmLPos, k), new Color(0.965, 1, 0, 1));//Cesium.Color.YELLOW.withAlpha(0.5)
                    this._addArcLine(this.calArcLine(point1.btmRPos, point2.btmRPos, k), new Color(0.165, 1, 0, 1));//Cesium.Color.BLUE.withAlpha(0.5)
                    this._addModelLableInfo(towers[i]);
                }
            }
        });
        this.enhanceTowerModelLabel();
    };

    //移除集电线路
    removeCollectLine() {
        this.originJson = {
            "coordinateType": "1",
            "fileVer": "1.0",
            "middleLongitude": "115.89630809",
            "routeData":[]
        };
        this.lineDS.entities.removeAll();
        this.modelLineDS.entities.removeAll();
        this.towerLine.removeAllCollection();
    };

    getDefalutToweriInfo() {
        let towerType = ['35K-L1A2-J1', '35K-L1A2-J2', '35K-L1A2-J3', '35K-L1A3-J1', '35K-L1A3-J2', '35K-L1A3-J3', '35K-L1B2-J1', '35K-L1B2-J2', '35K-L1B2-J3', '35K-L1B3-J1', '35K-L1B3-J2', '35K-L1B3-J3', '35K-L1A2-Z1', '35K-L1A2-Z2', '35K-L1A3-Z1', '35K-L1A3-Z2', '35K-L1B2-Z1', '35K-L1B2-Z2', '35K-L1B3-Z1', '35K-L1B3-Z2'];
        return towerType;
    };

    getDefaultChuanInfo() {
        let chuanType = ['03M11NLL-00-07PZ1A', '03M11NLL-00-07PZ2A', '03M11Y-00-07PZ1A', '03M11Y-00-07PZ2A', '03N11NLL-00-07PZ1A', '03N11NLL-00-07PZ2A', '03N11NLL-00-10PZ1A', '03N11NLL-00-10PZ2A', '03N11Y-00-10PZ1A', '03N11Y-00-10PZ2A', '03N11Y-00-12PZ1A', '03N11Y-00-12PZ2A', '03N21NLL-40-07PZ1A', '03N2NLL-40-07PZ2A', '03X21S-40-07P-1E', '03X21S-40-07P-2E', '03X21S-40-07P-3E', '03XC11-00-07P-1A', '03XC11-00-07P-3A', '03XC21S-40-07P-1C', '03XC21S-40-07P-2C', '03XC21S-40-07P-3C', '03XC22-40-07P-1B', '03XC22-40-07P-3B', '03XC22S-40-07P-1D', '03XC22S-40-07P-3D', 'BNX-G-07-1C', 'BX-G-07-1A', 'BX-G-07-2A', 'BX-G-07-3A', 'BXS-G-4010-1B', 'BXS-G-4010-2B', 'BXS-G-4010-3B'];
        return chuanType;
    };


    /**
     * 导入外部dxf集电线路文件
     * @param prjId             工程编号
     * @param schemeId          方案编号
     * @param fileInfo          文件内容
     * @param serverUrl         解析DXF集电线路文件服务路径
     * @return {Promise<any>}   Promise对象，包含道路相关信息
     */
    loadDxfCollectLine(prjId, schemeId, fileInfo, serverUrl) {
        let roadPromise = Resource.fetch({
            url: serverUrl,
            queryParameters: {
                'project_id': prjId,
                'scheme_id': schemeId,
                'path_dxf': fileInfo
            }/*,
            headers:{}*/
        });
        return new Promise((resolve, reject) => {
            roadPromise.then((res) => {

                resolve();
            });
        });
    };
    /**************************桩编辑（删除支线，合并桩位，打断支线）*********************************/
    startEditToolMode(){
        this.towerLine.removeAllCollection();
        this.modelLineDS.entities.removeAll();
        this._hideShowDS(true, this.lineDS);
    };

    stopEditToolMode(){
        this.towerLineEditHelper && this.towerLineEditHelper.removeHandles();
        this.editStakeLineHelper&& this.editStakeLineHelper.removeHandles();
    };

    /**
     * 更换塔型
     * @param isOpen        --是否开启（true--点击更换塔型，false--处于编辑状态）
     */
    changeTowerType(isOpen) {
        if (isOpen) {//更换塔型
            if (!defined(this.towerLineChangeTypeHelper)) {
                this.towerLineChangeTypeHelper = new TowerLineChangeTypeHelper(this.viewer);
            }
            //this.stopEditCollectLine();
            this.towerLineChangeTypeHelper.startChangeTower();
            this.entities.values.forEach((entity) => {
                if (defined(entity.polyline)&&entity.polyline.setChangeType) {
                    entity.polyline.setChangeType();
                }
            });
        } else {//编辑线路
            /* if (!defined(this.towerLineEditHelper)) {
                 this.towerLineEditHelper = new TowerLineEditHelper(this.viewer);
             }*/
            this.towerLineChangeTypeHelper&&this.towerLineChangeTypeHelper.removeHandles();
            // this.startEditTowerLine();
            this.entities.values.forEach((entity) => {
                if (defined(entity.polyline)&&entity.polyline.setChangeMode) {
                    entity.polyline.setChangeMode&&entity.polyline.setChangeMode(false);
                    if(entity.polyline.setEditable)
                        entity.polyline.setEditable(false);//开启编辑模式
                }
            });
        }
    };

    /**
     * 线路编辑（自动排塔后--塔位信息）
     */
    startEditTowerLine() {
        this.towerLine.removeAllCollection();
        this.modelLineDS.entities.removeAll();
        this._hideShowDS(true, this.lineDS);

        if (!defined(this.towerLineEditHelper)) {
            this.towerLineEditHelper = new TowerLineEditHelper(this.viewer);
        }
        this.towerLineEditHelper.startEditTower();
        this.entities.values.forEach((entity) => {
            if (defined(entity.polyline)) {
                entity.polyline.setEditable(false);
            }
        });
    };

    /**
     * 停止编辑线路(塔位线路)
     */
    stopEditCollectLine() {
        this.entities.values.forEach((entity) => {
            if (defined(entity.polyline)&&entity.polyline.setEditMode) {
                entity.polyline.setEditMode(false);
            }
        });
        this.towerLineEditHelper && this.towerLineEditHelper._tooltip.setVisible(false);
        this.towerLineEditHelper && this.towerLineEditHelper.removeHandles();
    };

    /**
     * 初选线路编辑（只有桩位信息）
     */
    startEditStakeLine() {
        this._hideShowDS(true,this.lineDS);
        this.modelLineDS.entities.removeAll();
        if (!defined(this.towerLineEditHelper)) {
            this.towerLineEditHelper = new TowerLineEditHelper(this.viewer);
        }
        this.towerLineEditHelper.startEditStake();
        this.entities.values.forEach((entity) => {
            if (defined(entity.polyline)) {
                this.towerLineEditHelper.registerEditableShape(entity.polyline);
                entity.polyline.setEditable(false);
            }
        });
    };

    /**
     * 停止编辑线路(桩位线路)
     */
    stopEditStakeLine(){
        this.entities.values.forEach((entity) => {
            if (defined(entity.polyline)&&entity.polyline.setEditMode) {
                entity.polyline.setEditMode(false);
            }
        });
        this.towerLineEditHelper && this.towerLineEditHelper._tooltip.setVisible(false);
        this.towerLineEditHelper && this.towerLineEditHelper.removeHandles();
    };

    /**
     * 开启删除桩位线路鼠标事件
     * @param {Object}options
     * @param {Function}[options.callBack]  鼠标选中支线的前端回调函数（再次确认弹出框）
     */
    startDeleteStakeLine(options){
/*        this._hideShowDS(true,this.lineDS);
        this.modelLineDS.entities.removeAll();*/
        if (!defined(this.editStakeLineHelper)) {
            this.editStakeLineHelper = new EditStakeLineHelper(this.viewer,this.entities);
        }
        this.editStakeLineHelper.initHandles();
        this.entities.values.forEach((entity) => {
            if (defined(entity.polyline)) {
                enhanceWithListeners(entity);
                this.editStakeLineHelper.startDeleteStakeLine(entity);
                entity.removeListener('onDeleted');
                entity.addListener('onDeleted', function(event) {//{entity:Entity}
                    options.callBack(event);
                });
            }
        });
    };

    /**
     * 移除删除桩位线路鼠标事件
     */
    stopDeleteStakeLine(){
        this.editStakeLineHelper&&this.editStakeLineHelper.removeHandles();
        this.editStakeLineHelper&&this.editStakeLineHelper._tooltip.setVisible(false);
    };

    /**
     * 删除指定的桩位线路
     * @param {Entity}entity        鼠标点击选中的线路Entity
     */
    deleteStakeLineByEntity(entity){
        this.entities.remove(entity);
        store.commit('editedPower', true);
    };

    /**
     * 绘制桩位支线开启
     */
    startDrawStakeLine(farmArea,outRangeCallBackFunc){
        let self=this;
        if (!defined(this.drawStakeLineHelper)) {
            this.drawStakeLineHelper = new DrawStakeLineHelper(this.viewer);
        }
        this.drawStakeLineHelper.startDrawingPolyline({
            isClapOnTerrian:true,
            /**
             * 超出地形范围的回调
             * @param {Cartesian3}position      世界坐标
             * @param {Boolean}showInfo         是否调用前端回调函数
             * @param {Number[]}winPos          屏幕坐标，控制提示窗口的位置
             * @return {boolean}                是否在地形范围内
             */
            isInRangeCall:function (position,showInfo,winPos) {
                let isInRange=true;
                let point = Turf.point(self.cartesianToDegree(position));
                //2.判断点是否在面里
                if(defined(farmArea)){
                    isInRange=Turf.booleanContains(farmArea, point);
                }
                if(showInfo&&!isInRange){
                    outRangeCallBackFunc&&outRangeCallBackFunc();
                }
                if(!isInRange){
                    self.drawStakeLineHelper._tooltip.showAt(winPos, "<p>超出地形范围</p>");
                    self.drawStakeLineHelper._tooltip.changeWarmStyle(true);
                }else {
                    self.drawStakeLineHelper._tooltip.changeWarmStyle(false);
                }
                return isInRange;
            },
            callback:function (positions) {
                let coors=[],surveyData=[],towers=[],coord=[],preCoord=[],dis=0.0,name='NewN'+Math.floor(Math.random()*100+1);
                positions.forEach((position,index)=>{
                    coord=self.cartesianToDegree(position);
                    if(index>0){
                        dis+=Turf.distance(Turf.point(preCoord),Turf.point(coord),{units: 'kilometers'})*1000;
                    }
                    towers.push({
                        coords:coord,
                        towerDist:dis
                    });
                    surveyData.push({
                        "offsetAngle" : "0.000000",
                        "stakeCoordinate" :
                            {
                                "altitude" : coord[2].toString(),
                                "latitude" :  coord[1].toString(),
                                "longitude" :  coord[0].toString()
                            },
                        "stakeDist" : dis.toString(),
                        "stakeName" : "N"+Math.floor(Math.random () * 900)
                    });
                    coors=coors.concat(coord);
                    preCoord=coord;
                });
                self._addLine({
                    points: coors,
                    routeInfo: {
                        lineInfo: {
                            routeName: name,
                            routeLength: dis,
                            angleTowerNum: 0,
                            lineTowerNum: 0
                        },
                        earthCount: "0",
                        earthLine: null,
                        loopCount: "1",
                        loopLine: [],
                        routeName: name,
                        surveyData: surveyData,
                        towerData: [],
                        towers: towers,
                        wireType: "2"
                    }
                }, self.entities);
                store.commit('editedPower', true);
            }
        },true)
    };

    /**
     * 绘制桩位支线关闭
     */
    stopDrawStakeLine(){
        if(this.drawStakeLineHelper){
            this.drawStakeLineHelper.removeHandleEvents();
            this.drawStakeLineHelper.stopDrawing();
            this.drawStakeLineHelper._tooltip.setVisible(false);
        }
    };


    /**
     * 开启桩位合并
     */
    startCombineStakeLine(){
        this._hideShowDS(true,this.lineDS);
        this.modelLineDS.entities.removeAll();
        if (!defined(this.editStakeLineHelper)) {
            this.editStakeLineHelper = new EditStakeLineHelper(this.viewer,this.entities);
        }
        this.editStakeLineHelper.initHandles();
        this.editStakeLineHelper.enhanceCombineStakeLineEntity();
       //let surveyPoint;
        this.entities.values.forEach((entity) => {
            if (defined(entity.polyline)) {
                this.editStakeLineHelper.startCombineStakeLine(entity);
            }
        });
    };

    /**
     * 关闭桩位合并
     */
    stopCombineStakeLine(){
        this.editStakeLineHelper&&this.editStakeLineHelper.stopCombineStakeLine();
        this.editStakeLineHelper&&this.editStakeLineHelper.disableAllHighlights();
        this.editStakeLineHelper&&this.editStakeLineHelper.removeHandles();
    };

    /**
     * 开启打断支线
     */
    startSplitStakeLine(){
        function rnd(n, m){
            let random = Math.floor(Math.random()*(m-n+1)+n);
            return random;
        }
        function onSplit(event) {//{surveyData:surveyData}打断后添加一根新线
            let coors=[],surveyData=[],towers=[],coord=[],preCoord=[],dis=0.0,stakeCoord;
            let rad=rnd(that.entities.values.length,199);
            event.surveyData.forEach((survey,index)=>{
                stakeCoord = clone(survey.stakeCoordinate);
                coord=[parseFloat(stakeCoord.longitude), parseFloat(stakeCoord.latitude), parseFloat(stakeCoord.altitude)];
                if(index>0){
                    dis+=Turf.distance(Turf.point(preCoord),Turf.point(coord),{units: 'kilometers'})*1000;
                }
                towers.push({
                    coords:coord,
                    towerDist:dis
                });
                surveyData.push({
                    "offsetAngle" :survey.offsetAngle,
                    "stakeCoordinate" :stakeCoord,
                    "stakeDist" : dis.toString(),
                    "stakeName" : survey.stakeName
                });
                coors= coors.concat(coord);
                preCoord=coord;
            });
            let newStakeLine=that._addLine({
                points: coors,
                routeInfo: {
                    lineInfo: {
                        routeName: "NAR" + rad,
                        routeLength: dis,
                        angleTowerNum: 0,
                        lineTowerNum: 0
                    },
                    earthCount: "0",
                    earthLine: null,
                    loopCount: "1",
                    loopLine: [],
                    routeName: "NAR" + rad,
                    surveyData: surveyData,
                    towerData: [],
                    towers: towers,
                    wireType: "2"
                }
            }, that.entities);
            store.commit('editedPower', true);
            that.editStakeLineHelper.startSplitStakeLine(newStakeLine);
            newStakeLine.polyline.removeListener('onEdited');
            newStakeLine.polyline.addListener('onEdited',onSplit);
        }
        this._hideShowDS(true,this.lineDS);
        this.modelLineDS.entities.removeAll();
        if (!defined(this.editStakeLineHelper)) {
            this.editStakeLineHelper = new EditStakeLineHelper(this.viewer,this.entities);
        }
        let that=this;
        this.editStakeLineHelper.initHandles();
        this.editStakeLineHelper.enhanceSplitStakeLineEntity();
        this.entities.values.forEach((entity) => {
            if (defined(entity.polyline)) {
                this.editStakeLineHelper.startSplitStakeLine(entity);
                entity.polyline.removeListener('onEdited');
                entity.polyline.addListener('onEdited', onSplit);
            }
        });

    };

    /**
     * 关闭打断支线
     */
    stopSplitStakeLine(){
        this.entities.values.forEach((entity) => {
            if (defined(entity.polyline)) {
                entity.polyline.removeListener('onEdited');
            }
        });
        this.editStakeLineHelper&&this.editStakeLineHelper.stopSplitStakeLine();
        this.editStakeLineHelper&&this.editStakeLineHelper.disableAllHighlights();
        this.editStakeLineHelper&&this.editStakeLineHelper.removeHandles();
    };

    /************************************************************************************************/

    /**
     * 添加二维编辑用的线路
     * @param lineInfo  需要添加的线信息
     * {points:[110.3,23.4,0,110.3,23.4,0,110.3,23.4,0],name:'road',width:4,color:Cesium.Color.Red}
     */
    _addLine(lineInfo, entitis) {
        let entity = new Entity({
            polyline: {//corridor
                positions: Cartesian3.fromDegreesArrayHeights(lineInfo.points),
                width: 3,
                clampToGround: true,
                show:true,
                material: towerLineColor//Color.HOTPINK.withAlpha(0.6)// new Cesium.PolylineArrowMaterialProperty(new Cesium.Color(0.2, 0.784, 0.435, 1))
            }
        });
        entity.polyline.routeInfo = lineInfo.routeInfo;//存储线路的相关全部信息（包含转角桩，直线塔等 已排序）
        entity.name = lineInfo.routeInfo.routeName;
        entitis.add(entity);
        return entity;
    };

    /**
     * 计算弧线
     * @param point1        挂点坐标1   [110.2,25.6,325]
     * @param point2        挂点坐标2   [110.2,25.6,325]
     * @return {T[] | string | *}
     */
    calArcLine(point1, point2, K) {
        let lineCount=10;
        let p = [];
        p = p.concat(point1);
        let line = Turf.lineString([point1, point2]);
         let from = Turf.point(point1);
         let to = Turf.point(point2);
         let distance = Turf.distance(from, to)*1000,h=point2[2]-point1[2];//默认单位是米
        if(distance>1){
            //let angle=Math.atan(h/(distance*1000));//线夹角
            let cos=distance/Math.sqrt(Math.pow(h,2)+Math.pow(distance,2));
            let stepDis=distance/lineCount;//内插50个点，默认单位是米
            for(let i=1;i<lineCount;i++) {
                let cuX=i * stepDis;
                let cuY=h*cuX/(distance)+point1[2];
                let along = Turf.along(line,cuX/1000);//内插点坐标
                let arcLength = K *cuX*(distance-cuX)/cos;//弧垂
                let newP=[along.geometry.coordinates[0],along.geometry.coordinates[1],cuY-arcLength];
                p=p.concat(newP);
            }
        }
        p = p.concat(point2);
        return p;
    };

    /**
     * 绘制线（弧线，跳线）
     * @param positions
     * @param color
     * @private
     */
    _addArcLine(positions, color) {
        if(positions.length%3!==0){
            return;
        }
        this.modelLineDS.entities.add({
            polyline: {
                positions: Cartesian3.fromDegreesArrayHeights(positions),
                width: 2,
                material: color/*,
                depthFailMaterial:color*/
            }
        });
    };

    /**
     * 加载塔模型和绝缘子串
     * @param tower
     * @return {Array}
     * @private
     */
    _addTowerModel(tower) {
        let linePoints = [];
        let coord = tower.coords, callHeight = parseInt(tower.callHeight), angle = parseFloat(tower.angle);
        if (tower.attachMode === '2') {
            linePoints = this.towerLine && this.towerLine.addModelB08_J3(coord[0], coord[1], coord[2], callHeight, angle, tower);
        }
        if (tower.attachMode === '1') {
            linePoints = this.towerLine && this.towerLine.addModelB08_Z1(coord[0], coord[1], coord[2], callHeight, angle, tower);
        }
        return linePoints;
    };

    /**
     * 添加立塔模型的标签信息
     * @private
     */
    _addModelLableInfo(towerInfo) {
        let coord = towerInfo.coords, towerName = towerInfo.name, offsetHeight = parseFloat(towerInfo.callHeight);
        let entity = this.modelLineDS.entities.add({
            position: Cartesian3.fromDegrees(coord[0], coord[1], coord[2] + offsetHeight + 8),
            name: 'tower',
            label: {
                text: towerName,
                font: '12px sans-serif',//Philadelphia
                fillColor: Color.BLACK,//new Color(0.012, 0.13, 0.24,1),
                outlineWidth: 1.0,
                outlineColor: new Color(0.012, 0.13, 0.24, 0.0),
                showBackground: true,
                backgroundColor: towerLabelColor,//new Color(0.94, 0.94, 0.94, 1),
                backgroundPadding: new Cartesian2(7, 5),
                horizontalOrigin: HorizontalOrigin.RIGHT,
                verticalOrigin: VerticalOrigin.BOTTOM,
                style: LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cartesian2(0.0, 0.0),
                //heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 1500.0)
                //disableDepthTestDistance:Number.POSITIVE_INFINITY
            }
        });
        entity.label.towerInfo = towerInfo;
        entity.towerName=towerInfo.name;
        this.towerLabelEntities.push(entity);
    };

    _hideShowDS(isShow, ds) {
        if(isShow){
            ds.entities.values.forEach((entity) => {
                entity.show = isShow;
                if(this.currentBranchRoute&&(entity.id===this.currentBranchRoute.id)){
                    entity.polyline.material=Color.RED;
                }else{
                    entity.polyline.material=towerLineColor;//Color.HOTPINK.withAlpha(0.6);
                }
            })
        }else{
            ds.entities.values.forEach((entity) => {
                entity.polyline.material=Color.HOTPINK.withAlpha(0.0);
               // entity.show = isShow;
            })
        }
    };

    hideShow2DLine(isShow) {
        this.lineDS.entities.removeAll();
        if (isShow) {
            this.line2DInfo.forEach((lineInfo) => {
                this._addLine(lineInfo, this.lineDS.entities);
            })
        }
    };

    /**********************模型primitive的鼠标事件*************************/

    /**
     * 给塔模型绑定鼠标点击事件
     */
    enhanceTowerModelPrimitive() {
        this.addTowerModelMouseEvent();
        let primis = this.towerLine.pCollection;
        for (let i = 0; i < primis.length; i++) {
            let primitive = primis.get(i);
            this.registerTowerModelEvent(primitive);
        }
    };

    enhanceTowerModelLabel() {
        this.addTowerModelMouseEvent();
        let entities =this.towerLabelEntities;
        for (let i = 0; i < entities.length; i++) {
            let primitive = entities[i];
            this.registerTowerModelEvent(primitive.label);
        }
    };

    /**
     * 阻止铁塔模型的鼠标事件触发
     */
    stopTowerModelMouseEvent() {
        this.muteHandles(true);
        this.viewer.scene.preUpdate&&this.viewer.scene.preUpdate.removeEventListener(this._addPerUpdate,this);
    };

    registerTowerModelEvent(primitive) {
        let _self=this;
        setListener(primitive, 'mouseMove', function (position) {
        });
        setListener(primitive, 'mouseOut', function (position) {
        });
        setListener(primitive, 'leftClick', function (position) {
            //_self.hightLightLabel(true, _self.seclectLabelEntity);
            store.commit('getTowerInfo', {
                towerInfo: {
                    'angle': primitive.towerInfo.angle,                     //塔身转角
                    'type': primitive.towerInfo.type,                      //塔型
                    'baseLower': primitive.towerInfo.type,                  //塔基降
                    'callHeight': primitive.towerInfo.callHeight,           //呼高
                    'midstakeOffset': primitive.towerInfo.midstakeOffset,   //中心桩位移
                    'name': primitive.towerInfo.name,                       //塔名
                    'offsetDist': primitive.towerInfo.offsetDist,           //偏差距离
                    'stakeName': primitive.towerInfo.stakeName,             //定位桩名
                    'voltage': primitive.towerInfo.voltage                  //电压等级
                },
                show:true,
                position: position                                          //{x:100,y:200}
            })
        });

    };

    hightLightLabel(isHighLight,entity) {
        if(defined(entity)&& entity.name==='tower' && entity.label){
            if(isHighLight){
                entity.label.backgroundColor=towerLabelHight;//Color.RED.withAlpha(0.6);
            }else{
                entity.label.backgroundColor=towerLabelColor;
            }
        }
    };

    addTowerModelMouseEvent() {
        let handle = this.handle;
        let scene = this.viewer.scene;
        let mouseOutObject;
        let _self = this;

        function callPrimitiveCallback(name, position) {
            if (_self._handlersMuted == true) return;
            let pickedObject = scene.pick(position);
            if (pickedObject && pickedObject.primitive && pickedObject.primitive[name]) {
                pickedObject.primitive[name](position);
            }
        }
        function callEntityLableCallback(name, position) {
            if (_self._handlersMuted == true) return;
            let pickedObject = scene.pick(position);
            _self.hightLightLabel(false,_self.seclectLabelEntity);
            if (pickedObject && pickedObject.id && pickedObject.id.label&&pickedObject.id.label[name]) {

                _self.seclectLabelEntity=pickedObject.id;
                _self.hightLightLabel(true,_self.seclectLabelEntity);
                pickedObject.id.label[name](position);
            }else{
                _self.seclectLabelEntity=undefined;
                store.commit('getTowerInfo', {
                    towerInfo: null,
                    show:false,
                    position: position                                          //{x:100,y:200}
                })
            }

        }

        handle.setInputAction(
            function (movement) {
                callEntityLableCallback('leftClick', movement.position);
            }, ScreenSpaceEventType.LEFT_CLICK);
        handle.setInputAction(
            function (movement) {
                if (_self._handlersMuted == true) return;
                let pickedObject = scene.pick(movement.endPosition);
                if (mouseOutObject && (!pickedObject || mouseOutObject != pickedObject.id)) {
                    !(mouseOutObject.isDestroyed && mouseOutObject.isDestroyed()) && mouseOutObject.mouseOut(movement.endPosition);
                    mouseOutObject = null;
                }
                if (pickedObject && pickedObject.id&&pickedObject.id.label) {
                    pickedObject = pickedObject.id.label;
                    if (pickedObject.mouseOut) {
                        mouseOutObject = pickedObject;
                    }
                    if (pickedObject.mouseMove) {
                        pickedObject.mouseMove(movement.endPosition);
                    }
                }
            }, ScreenSpaceEventType.MOUSE_MOVE);

        this.viewer.scene.preUpdate && this.viewer.scene.preUpdate.addEventListener(this._addPerUpdate, this);

    };

    clearHighTowerLabel(){
        this.hightLightLabel(false,this.seclectLabelEntity);
        this.seclectLabelEntity=null;
    };

    muteHandles(muted) {
        this._handlersMuted = muted;
    };


    _addPerUpdate(scene,time){
        let towerName='',position={x:undefined,y:undefined};
        if(defined(this.seclectLabelEntity)){
            position=this.getWinPosByCartesian(this.seclectLabelEntity.position._value);
            towerName=this.seclectLabelEntity.towerName;
        }
        //获取
        store.commit('getTowerInfoWinPos', {
            'towerName': towerName,
            'clientX':defined(position)?position.x:undefined,
            'clientY':defined(position)?position.y:undefined
        });

    };

    /**********************************************************************/
    getWinPosByCartesian(cartesian){
        let winPos=SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene,cartesian);
        return winPos;
    };


    cartesianToDegree(position){
        let ellipsoid=this.viewer.scene.globe.ellipsoid;
        let cartographic=ellipsoid.cartesianToCartographic(position);
        let lat=CesiumMath.toDegrees(cartographic.latitude);
        let lng=CesiumMath.toDegrees(cartographic.longitude);
        let alt=cartographic.height;
        return [lng,lat,alt];
    };

}

export default CollectLineEdit;
