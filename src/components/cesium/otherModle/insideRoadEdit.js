/* eslint-disable */
/**
 * Created by pengYX on 2018/8/29.
 */
import Color from 'cesium/Core/Color';
import Cartesian3 from 'cesium/Core/Cartesian3';
import CesiumMath from 'cesium/Core/Math';
import GeoJsonDataSource from 'cesium/DataSources/GeoJsonDataSource';
import HeightReference from 'cesium/Scene/HeightReference';
import  defined from 'cesium/Core/defined';
import Resource from 'cesium/Core/Resource';
import HeadingPitchRange from 'cesium/Core/HeadingPitchRange'

import TerrianTool from './terrianTool'
import EditRoadHelper from './drawEditHelper/EditRoadHelper'
import {terrianLevel} from  '../subMoudle/constants';
import {clone, enhanceWithListeners} from "./drawEditHelper/primitive/utilFunc";
import EditStakeLineHelper from "./drawEditHelper/editStakeLineHelper";
import store from "../../../store";
window.Turf = require('../../../../static/thirdParty/turf');

/**
 * 场内道路相关功能类
 */
class InsideRoadEdit{

    constructor(viewer){
        this.viewer=viewer;
        this.roadDS= new GeoJsonDataSource('InsideRoadDS');//存储线道路
        this.roadBufferDS= new GeoJsonDataSource('InsideRoadBufferDS');//存储面道路
        this.terrianTool=new TerrianTool(viewer);
        this.viewer.dataSources.add(this.roadDS);
        this.viewer.dataSources.add(this.roadBufferDS);

        this.originRoadGeoJSON=undefined;//存储原始的道路数据
        this.roadStartPointEntity=undefined;//存储道路起点Entity

    }

    /**
     * 加载道路(经纬度)
     * @param url      S3中道路文件路径
     * @return {Promise<any>}
     */
    loadLineRoad(url){
        this.removeRoad();//清空线路集合
        return new Promise((resove, reject) => {
            Resource.fetchJson({url:url}).then((data)=>{
                this.originRoadGeoJSON=data;
                let loadPromise= this.roadDS.load(data,{
                    clampToGround:true,
                    strokeWidth:3,
                    stroke:new Color(1,0.9,0.78,1)////Color.YELLOW.withAlpha(0.6)(0.2,0.78,0.44,0.5)
                });
                let properties=data.properties;
                this.properties=properties;
                loadPromise.then((ds)=>{
                    this.dispaly3DInsideRoad(data.properties.roadWidth);
                    ds.entities.values.forEach((entity,index)=>{
                        entity.polyline.propertyPositions=data.features[index].geometry.coordinates;
                        entity.polyline.roadInfo=data.properties;
                    });
                   // this.showHideDataS(this.roadDS,false);
                    properties.branchNum=data.features.length;
                    resove(properties);
                },(error)=>{
                    console.log("解析数据失败，请检查数据格式,文件路径："+url);
                    reject({"code":403,"url":url});
                });
            },(error)=>{
                console.log("S3上文件不存在",+ url);
                reject({"code":404,"url":url});
            });
        });
    };

    /***************************道路编辑---开始*************************/

    /**
     * 开始编辑道路
     */
    startEditInsideRoad(){
        this.showHideDataS(this.roadDS,true);
        this.showHideDataS(this.roadBufferDS,false);
        if(!defined(this.editRoadHelper)){
            this.editRoadHelper=new EditRoadHelper(this.viewer);
        }
        this.editRoadHelper.enhancePrimitives();
        this.roadDS.entities.values.forEach((entity)=>{
            if(defined(entity)&&defined(entity.polyline)){
                this.editRoadHelper.registerEditableShape(entity.polyline);
                entity.polyline.setEditable(true);//参数为是否添加文本
            }
        });
        this.editRoadHelper.initHandles();
    };

    /**
     * 停止编辑状态
     */
    stopEditInsideRoad(){
        this.editRoadHelper&&this.editRoadHelper._editedSurface&&this.editRoadHelper._editedSurface.setEditMode(false);
        this.roadDS.entities.values.forEach((entity)=>{
            if(defined(entity)&&defined(entity.polyline)&&defined(entity.polyline.setEditMode)){
                entity.polyline.setEditMode(false);
            }
            if(defined(entity)&&defined(entity.polyline)&&defined(entity.polyline.setSplitMode)){
                entity.polyline.setSplitMode(false);
            }
        });
        this.editRoadHelper&& this.editRoadHelper.removeHandles();
    };

    /**
     * 开启删除道路支线鼠标事件
     * @param {Object}options
     * @param {Function}[options.callBack]  鼠标选中支线的前端回调函数（再次确认弹出框）
     */
    startDeleteRoadLine(options){
        this.showHideDataS(this.roadDS,true);
        this.showHideDataS(this.roadBufferDS,false);
        if (!defined(this.editRoadHelper)) {
            this.editRoadHelper = new EditRoadHelper(this.viewer);
        }
        this.editRoadHelper.initHandles();
        this.roadDS.entities.values.forEach((entity) => {
            if (defined(entity.polyline)) {
                enhanceWithListeners(entity);
                this.editRoadHelper.startDeleteRoadLine(entity);
                entity.removeListener('onDeleted');
                entity.addListener('onDeleted', function(event) {
                    options.callBack(event);
                });
            }
        });
    };

    /**
     * 移除删除道路支线鼠标事件
     */
    stopDeleteRoadLine(){
        this.editRoadHelper&&this.editRoadHelper.removeHandles();
        this.editRoadHelper&&this.editRoadHelper._tooltip.setVisible(false);
    };

    /**
     * 删除指定的道路支线
     * @param {Entity}entity        鼠标点击选中的道路Entity
     */
    deleteRoadByEntity(entity){
        this.roadDS.entities.remove(entity);
        store.commit('editedRoad', true);
    };

    /**
     * 开启打断道路支线
     */
    startSplitRoadLine(){
        let that=this;
        function onSplit(event) {//{positions:positions,roadInfo:roadInfo}打断后添加一根新线
            let newRoadLine=that._addRoadLine({positions: event.roadInfo.positions,roadInfo:event.roadInfo.roadInfo,coors:event.roadInfo.coors}, that.roadDS.entities);
            store.commit('editedRoad', true);
            that.editRoadHelper.startSplitRoadLine(newRoadLine);
            newRoadLine.polyline.removeListener('onEdited');
            newRoadLine.polyline.addListener('onEdited',onSplit);
        }

        this.showHideDataS(this.roadDS,true);
        this.showHideDataS(this.roadBufferDS,false);
        if (!defined(this.editRoadHelper)) {
            this.editRoadHelper = new EditRoadHelper(this.viewer);
        }
        this.editRoadHelper.initHandles();

        this.editRoadHelper.enhanceSplitRoadLineEntity();
        this.roadDS.entities.values.forEach((entity) => {
            if (defined(entity.polyline)) {
                this.editRoadHelper.startSplitRoadLine(entity);
                entity.polyline.removeListener('onEdited');
                entity.polyline.addListener('onEdited', onSplit);
            }
        });
    };

    /**
     * 关闭打断道路支线
     */
    stopSplitRoadLine(){
        this.roadDS.entities.values.forEach((entity) => {
            if (defined(entity.polyline)) {
                entity.polyline.removeListener('onEdited');
            }
        });
        this.editRoadHelper&&this.editRoadHelper.stopSplitRoadLine();
        this.editRoadHelper&&this.editRoadHelper.disableAllHighlights();
        this.editRoadHelper&&this.editRoadHelper.removeHandles();
    };

    /***************************道路编辑---结束*************************/

    /**
     *获取加载的道路信息（用于展示横断面选择面板）
     */
    getInsideRoadsInfo(){
        let roadInfos=[],roadInfo=undefined;
        this.showHideDataS(this.roadDS,true);
        this.showHideDataS(this.roadBufferDS,false);
        this.roadDS.entities.values.forEach((roadEntity)=>{
            let info = {};
            roadEntity.properties.propertyNames.forEach((name)=>{
                info[name]=roadEntity.properties[name]._value;
            });
            if(defined(roadEntity.polyline)){
                roadInfo={
                    roadEntityId:roadEntity.id,//存储Entity的id,方便定位
                    properties:info,
                    positions:roadEntity.polyline.positions._value
                };
                roadInfos.push(roadInfo);
            }
        });
        return roadInfos;
    };

    /**
     * 高亮显示当前选中的支线（横断面展示之图属性联动）
     * @param insideRoadEntityID      支线所在实体的entityID,
     *                  值来自getInsideRoadsInfo方法中返回的entityId
     */
    highLightSelectBranchRoad(insideRoadEntityID){
        let currentRoad=this.roadDS.entities.getById(insideRoadEntityID);
        this.cancleHighLight();
        if(defined(currentRoad)&&defined(currentRoad.polyline)){
            currentRoad.polyline.material=Color.RED;
           // currentRoad.polyline.width=currentRoad.polyline.width._value*2;
            this.currentBranchRoad=currentRoad;
            this.viewer.zoomTo(currentRoad);
        }
    };

    /**
     * 取消当前支线的高亮
     */
    cancleHighLight(){
        if(defined(this.currentBranchRoad)){
            this.currentBranchRoad.polyline.material=new Color(1,0.92,0.78,1);
            //this.currentBranchRoad.polyline.width=this.currentBranchRoad.polyline.width._value/2;
        }
    };

    /**
     * 获取道路支线的横断面数据
     * @param insideRoadEntityID        支线所在实体的entityID,
     *                                   值来自getInsideRoadsInfo方法中返回的entityId
     * @returns {*}
     */
    getInsideRoadCrossSection(insideRoadEntityID){
        let currentRoad=this.roadDS.entities.getById(insideRoadEntityID);
        if(defined(currentRoad)&&defined(currentRoad.polyline)) {
            let positions=currentRoad.polyline.positions._value;
            //let latlons=this.cartesianArrayToDegrees(positions);
            let latlons=currentRoad.polyline.propertyPositions;
            let promise = this.terrianTool.sampleCartesianArrayTerrianHeight(positions, terrianLevel);
            let crossSectionData=[];
            return new Promise((resolve, reject)=>{
                promise.then((updatePositions) => {
                    let outPointObj={},disttan=0;
                    for(let i=0;i<positions.length;i++){
                        if(i!==0){
                            disttan+=Cartesian3.distance(positions[i-1],positions[i]);
                        }
                        outPointObj={
                            index:i,                        //点索引号
                            lon:latlons[i][0],              //经度坐标
                            lat:latlons[i][1],              //纬度坐标
                            x:disttan,                      //长度
                            y:latlons[i][2],                //点规划高度
                            ty:updatePositions[i].height    //点地形高度
                        };
                        crossSectionData.push(outPointObj);
                    }
                    resolve(crossSectionData);
                },(error)=>{
                    console.log("获取地形高度失败!");
                    reject(error);
                });
            });
        }else{
            console.log("未找到给定的道路支线！");
            return undefined;
        }
    };

/*
    /!**
     * 保存设计参数
     * @param options
     * {
     *      "turningRadius":15,       //转弯半径
     *      "maxSlope":15,            //最大坡度
     *      "pileSpacing":100,        //桩点间距
     *      "roadWidth":4              //道路宽度
     * }
     *!/
    saveRoadProperties(options){
        this.submitRoadGeoJSON.designParameters.turningRadius=options.turningRadius;
        this.submitRoadGeoJSON.designParameters.maxSlope=options.maxSlope;
        this.submitRoadGeoJSON.designParameters.pileSpacing=options.pileSpacing;
        this.submitRoadGeoJSON.designParameters.roadWidth=options.roadWidth;
    };

    /!**
     *保存道路起点
     * @param lon       经度
     * @param lat       纬度
     *!/
    saveStartPoint(lon,lat){
        this.submitRoadGeoJSON.designParameters.startPoint=[lon,lat];
    };*/

    /**
     * 提交编辑后的道路数据
     * @returns {{type: string, features: Array}}
     */
    submitEditInsideRoad(){
        this.initSubmitGeoJSON();
        let cartesians=[],geoType="",properties={},positions=[];//,distance=0,allDis=0;
        this.roadDS.entities.values.forEach((entity)=>{
            if(defined(entity.polyline)){
                cartesians=entity.polyline.getPosition();
                geoType="LineString";
                positions=this.cartesianArrayToDegrees(cartesians);
               // distance=this.calLineDistance(positions);
                properties=entity.polyline.roadInfo;//this.getEntityProperties(entity);
                this.addFeatureToGeoJson(positions,geoType,properties)
               // allDis+=distance;
            }
        });
       /* if(this.properties){
            this.properties.roadLength=allDis;
        }*/
        this.submitRoadGeoJSON.properties=this.properties? this.properties:{};
        this.submitRoadGeoJSON.designParameters=this.originRoadGeoJSON.designParameters;
        return this.submitRoadGeoJSON;
    };

    calLineDistance(positions){
        let dis=0,from,to;
        let options = {units: 'kilometers'};
        for(let i=0;i<positions.length-1;i++){
             from = Turf.point(positions[i]);
             to = Turf.point(positions[i+1]);
            dis += Turf.rhumbDistance(from, to, options);
        }
        return dis*1000;
    };

    /**
     *定位起始点
     * @param positions
     */
    locationStartPoint(positions){
        if(defined(this.roadStartPointEntity)){
            this.viewer.entities.remove(this.roadStartPointEntity);
        }
        this.roadStartPointEntity=this.viewer.entities.add({
            position:positions,
            point:{
                color:Color.YELLOW.withAlpha(0.8),
                pixelSize:10,
                outlineColor:Color.RED.withAlpha(0.8),
                outlineWidth:2,
                disableDepthTestDistance:Number.POSITIVE_INFINITY,
                heightReference:HeightReference.CLAMP_TO_GROUND
            }
        });
        this.viewer.zoomTo( this.roadStartPointEntity,new HeadingPitchRange(0.0,CesiumMath.toRadians(-20.0),800));
        return this.roadStartPointEntity;

    };

    /**
     * 删除道路起点
     */
    removeRoadStartLoation(){
        if(defined(this.roadStartPointEntity)){
            this.viewer.entities.remove(this.roadStartPointEntity);
        }
    };

    /**
     * 展示三维挖地道路面
     */
    dispaly3DInsideRoad(width){
         if(this.roadDS.entities.values.length>0){
             this.roadDS.entities.values.forEach((entity)=>{
                 let lineInfo={positions:entity.polyline.positions._value,width:width};
                 this._addCorrider(lineInfo,this.roadBufferDS.entities);
             });
         }
    };

    /**
     * 移除道路
     */
    removeRoad(){
        this.roadDS.entities.removeAll();       //删除线型道路
        this.roadBufferDS.entities.removeAll(); //删除缓冲区道路
    };

    /**
     * 重新设计---获取默认参数（道路起点，默认设计参数，风机分组）
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
    getDesiginDefaultPara(){
        let res=this.originRoadGeoJSON&&this.originRoadGeoJSON.designParameters;
        if(!defined(res)){
            res = {
                "startPoint": this.originRoadGeoJSON&&this.originRoadGeoJSON.features&&this.originRoadGeoJSON.features[0]?this.originRoadGeoJSON.features[0].geometry.coordinates[0]:[0,0],
                "designPara": {
                    "turningRadius": 15,    //转弯半径
                    "maxSlope": 45,         //最大坡度
                    "pileSpacing": 20,      //桩点间距
                    "roadWidth":this.originRoadGeoJSON&&this.originRoadGeoJSON.properties?this.originRoadGeoJSON.properties.roadWidth:4         //道路宽度
                },
                "turbineGroup": [               //风机分组

                ]
            };
        }
        return res;
    };

    /***************************           内部使用私有成员           ***********************************/

    /**
     * 显示和隐藏指定dataSource中的entities
     * @param isShow        是否显示[true--显示；false--隐藏]
     */
    showHideDataS(ds,isShow){
        ds.entities.values.forEach((entity)=>{
            entity.show=isShow;
        });
    };

    /**
     * 将世界坐标转换数组为经纬度坐标数组
     * @param cartesians       世界坐标转换数组
     *                          [{x:5464645.2,y:1245251.2,z:122},{x:5464645.2,y:1245251.2,z:122}]
     * @returns {Array}        经纬度坐标数据
     * [[110.2,253,256],[110.2,253,256],[110.2,253,256]]
     */
    cartesianArrayToDegrees(cartesians){
        let ellipsoid=this.viewer.scene.globe.ellipsoid;
        let coordinates=[];
        cartesians.forEach((cartesian)=>{
            let cartographic=ellipsoid.cartesianToCartographic(cartesian);
            coordinates.push([CesiumMath.toDegrees(cartographic.longitude),CesiumMath.toDegrees(cartographic.latitude),cartographic.height]);
        });
        return coordinates;
    };

    /**
     * 构建GeoJSON中的单个feature对象
     * @param positions         geometry.coordinates
     * @param geoType           geometry.type
     * @param properties        properties
     */
    addFeatureToGeoJson(positions, geoType, properties) {
        this.submitRoadGeoJSON.features.push({
            "type": "Feature",
            "properties": properties,
            "geometry": {
                "type": geoType,
                "coordinates": positions
            }
        });
    };

    /**
     * 初始化要提交的JSON对象（开始编辑时候调用）
     */
    initSubmitGeoJSON(){
        this.submitRoadGeoJSON={
            "type": "FeatureCollection",
            "features": [],
            "properties":this.properties?this.properties:{}
        };//存储编辑完成后要提交的道路数据
    };

    /**
     * 获取entity的属性信息
     * @param entity        要获取属性的entity
     * @return {{}}
     */
    getEntityProperties(entity){
        let pros={};
        entity.polyline.roadInfo.forEach((proName)=>{
                pros[proName]=entity.polyline.roadInfo[proName];
        });
        return pros;
    };

    //面状线
    _addCorrider(lineInfo,entitis){
        return entitis.add({
            name:'insideRoadBuffer',
            corridor: {
                positions :lineInfo.positions ,//Cartesian3.fromDegreesArrayHeights(lineInfo.points),
                width : lineInfo.width,
                material :new Color(1,0.92,0.78,1)//(1,0.92,0.78,1)(0.2,0.78,0.44,0.5)
                /*,
                outline:true,
                outlineWidth:2,
                outlineColor:new Color(1,1,1,1)*/
            },
            properties:lineInfo.properties
        });
    };

    _addRoadLine(lineInfo,entities){
       let entity= entities.add({
            name:'InsideRoad',
            polyline:{
                positions:lineInfo.positions,
                clampToGround:true,
                width:3.0,
                material:new Color(1,0.9,0.78,1)
            }
        });
        entity.polyline.propertyPositions=lineInfo.coors;
        entity.polyline.roadInfo=lineInfo.roadInfo;
        return entity;
    };


}
export default InsideRoadEdit;
