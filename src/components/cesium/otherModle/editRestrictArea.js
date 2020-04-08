/* eslint-disable */
/**
 * Created by pengYX on 2018/8/27.
 */

import Color from 'cesium/Core/Color';
import Cartesian3 from 'cesium/Core/Cartesian3';
import CesiumMath from 'cesium/Core/Math';
import CustomDataSource from 'cesium/DataSources/CustomDataSource';
import HeightReference from 'cesium/Scene/HeightReference';
import  defined from 'cesium/Core/defined';
import Resource from 'cesium/Core/Resource';
import WebMapServiceImageryProvider from 'cesium/Scene/WebMapServiceImageryProvider';

import DrawPrimitiveHelper from './drawEditHelper/drawPrimitiveHelper';
import EditEntityHelper from './drawEditHelper/editEntityHelper';
import {IsURL} from "../subMoudle/utilGISFunc";

/**
 * 绘制和编辑限制区
 */
class EditRestrictArea{

    constructor(viewer){
        this.viewer=viewer;
        let dataSource = new CustomDataSource('restrict');
        this.redLineEntity=undefined;
        this.entities=dataSource.entities;
        viewer.dataSources.add(dataSource);
        this.restrictDs=dataSource;
        this.drawPrimitiveHepler=new DrawPrimitiveHelper(viewer);

        this.initGeoJsonRestrictObj();
        this.currentRestrictEntity=undefined;
    };

    initGeoJsonRestrictObj(){
        this.geoJsonRestrictObj={
            "type": "FeatureCollection",
            "features": []
        };
    };

    /**
     * 获取限制区GeoJSON数据，并展示且返回限制区对象数组
     * @param url                   限制区
     * @returns {Promise<any>}
     * @example
     * var p=disPlayRestrictArea(url);
     * p.then((restricts)=>{
     *      restricts.forEach((restrict)=>{
     *            restrict.index;               //[index:编号 从1开始]
     *            restrict.gis_type;            //[gis_type:地物类别(1:居民 2： 湖泊 3：其他)]
     *            restrict.forbiddentype;       //[forbiddentype:限制性因素的类型 (1：禁止跨越和立塔 2 ：可跨越)]
     *      });
     * });
     * [{"index":1, "gis_type":1,"forbiddentype":1},{"index":2, "gis_type":1,"forbiddentype":1}]
     */
    disPlayRestrictArea(url){
        this.editHelper=new EditEntityHelper(this.viewer);
        let restrictList=[];
        return new Promise((resove, reject) => {
            Resource.fetchJson({url:url}).then((data)=>{
                data.features.forEach((feature)=>{
                    if(feature.geometry.type==='Polygon'){
                        this._addPolygonEntity(feature.geometry.coordinates[0],feature.properties);
                    }
                    if(feature.geometry.type==='LineString'){
                        this._addPolyLineEntity(feature.geometry.coordinates,feature.properties)
                    }
                });
                restrictList=this.getRestrictList();
                resove(restrictList);
            },(error)=>{
                console.log("读取限制区数据失败，请确保文件存在："+ url.toString());
                reject({"code":404,"url":url});
            });
        });
    };

    /**
     * 获取限制区列表
     * @return {Array}
     */
    getRestrictList(){
        let restricts=[];
        let entities = this.restrictDs.entities.values;
        entities.forEach((entity) => {
            let pros=this.getEntityProperties(entity);
            restricts.push(pros);
        });
        return restricts;
    };

    /**
     * 绘制面状限制区（贴地）
     * "index":restrictID,              限制区编号（不可重复）
     * "forbiddentype":restrictType,    限制性因素的类型[1：禁止跨越和立塔 2 ：可跨越]
     * "gis_type":geoType               地物类别[1:居民 2： 湖泊 3：其他]
     * @param options
     */
    drawPolygon(options){
        let self=this;
        this.drawPrimitiveHepler.startDrawingPolygon({
            isClapOnTerrian:true,
            callback:function (positions) {
                self.entities.add({
                    polygon:{
                        hierarchy :positions,
                        heightReference:HeightReference.CLAMP_TO_GROUND,
                        outline:true,
                        outlineColor:Color.BLACK.withAlpha(0.5),
                        material : Color.AQUA.withAlpha(0.5),
                        outlineWidth:5
                    },
                    properties:options
                });
            }
        });
    };

    /**
     * 绘制线状限制区（贴地）
     * @param restrictID            限制区编号（不可重复）
     * @param restrictType          限制性因素的类型[1：禁止跨越和立塔 2 ：可跨越]
     * @param geoType               地物类别[1:居民 2： 湖泊 3：其他]
     */
    drawPolyLine(restrictID,restrictType,geoType) {
        let self=this;
        this.drawPrimitiveHepler.startDrawingPolyline({
            width : 4,
            callback:function (positions) {
                self.entities.add({
                    polyline:{
                        positions :positions,
                        width : 4,
                        clampToGround:true,
                        material : Color.AQUA.withAlpha(0.5)
                    },
                    properties:{
                        "index":restrictID,
                        "forbiddentype":restrictType,
                        "gis_type":geoType
                    }
                });
            }
        },true);
    };

    /**
     * 根据限制区的编号开启限制区编辑功能
     * @param restrictId         限制区的编号
     */
    startEditEntity(restrictId){
        let resentity=defined(this.currentRestrictEntity)?this.currentRestrictEntity:this.getRestrictEntity(restrictId);//获取要编辑的限制区对象Entity
        this.editHelper.initHandles();
        if(defined(resentity)&&defined(resentity.polyline)){
            resentity.polyline.setEditable(false);//参数为是否添加文本
            resentity.polyline.setEditMode(true);
        }
        if(defined(resentity)&&defined(resentity.polygon)){
            resentity.polygon.setEditable(false);//参数为是否添加文本
            resentity.polygon.setEditMode(true);
        }
    };

    /**
     * 停止限制区的编辑状态
     */
    stopEditEntity(){
       this.editHelper&& this.editHelper.removeHandles();
       if(defined(this.currentRestrictEntity)){
           let resentity=this.currentRestrictEntity;
           if(defined(resentity.polygon)){
                 resentity.polygon.setEditMode(false);
           } else if(defined(resentity.polyline)){
               resentity.polyline.setEditMode(false);
           }
       }
        this.drawPrimitiveHepler&&this.drawPrimitiveHepler.stopDrawing();
    };

    /**
     * 删除指定编号的限制区
     * @param restrictId
     */
    removeOneRestrictArea(restrictId){
       let entity=this.getRestrictEntity(restrictId);//defined(this.currentRestrictEntity)?this.currentRestrictEntity:
       if(defined(entity)){
           this.entities.remove(entity);
       }
    };

    /**
     * 根据限制区编号获取对应的限制区对象Entity
     * @param restrictId        限制区的编号
     */
    getRestrictEntity(restrictId){
        let resentity=undefined;
        for(let i=0;i<this.entities.values.length;i++){
            if(this.entities.values[i].properties.index._value===restrictId){
                resentity=this.entities.values[i];
                break;
            }
        }
        this.currentRestrictEntity=resentity;
        return resentity;
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
     * 保存编辑后的限制区域
     */
    submitEditRestrictArea(){
        this.initGeoJsonRestrictObj();
        let cartesians=[],geoType="",properties={},positions=[];
        this.entities.values.forEach((entity)=>{
            positions=[]
            if(defined(entity.polyline)){
                cartesians=entity.polyline.getPosition();
                geoType="LineString";
                positions=this.cartesianArrayToDegrees(cartesians);
            }
            if(defined(entity.polygon)){
                cartesians=entity.polygon.getPosition();
                geoType="Polygon";
                positions.push(this.cartesianArrayToDegrees(cartesians));
            }
            properties=this.getEntityProperties(entity);
            this.addFeatureToGeoJson(positions,geoType,properties)
        });
        return this.geoJsonRestrictObj;
    };

    /**
     * 构建GeoJSON中的单个feature对象
     * @param positions         geometry.coordinates
     * @param geoType           geometry.type
     * @param properties        properties
     */
    addFeatureToGeoJson(positions, geoType, properties) {
        this.geoJsonRestrictObj.features.push({
            "type": "Feature",
            "properties": properties,
            "geometry": {
                "type": geoType,
                "coordinates": positions
            }
        });
    };

    /**
     * 删除整个限制区域
     */
    removeAllRestrict(){
        this.entities.removeAll();
    };

    _addPolyLineEntity(geoJsonCoord,properties){
        this.entities.add({
            name:'restrict',
            polyline:{
                positions:this._geoJsonCoordToCartesian3Array(geoJsonCoord),
                clampToGround:true,
                width:2,
                material:Color.HOTPINK.withAlpha(0.6)
            },
            properties:properties
        });
    };
    _addPolygonEntity(geoJsonCoord,properties){
        this.entities.add({
            name:'restrict',
            polygon:{
                hierarchy:this._geoJsonCoordToCartesian3Array(geoJsonCoord),
                heightReference:HeightReference.CLAMP_TO_GROUND,
                material:Color.HOTPINK.withAlpha(0.6)
            },
            properties:properties
        });
    };
    _geoJsonCoordToCartesian3Array(geoJsonCoord){
        let pos=[];
        geoJsonCoord.forEach((coord)=>{
            pos.push(coord[0],coord[1],coord[2]);
        });
        return Cartesian3.fromDegreesArrayHeights(pos);
    };

    /**
     * 获取entity的属性信息
     * @param entity        要获取属性的entity
     * @return {{}}
     */
    getEntityProperties(entity){
        let pros={};
        entity.properties.propertyNames.forEach((proName)=>{
            pros[proName]=entity.properties[proName]._value;
        });
        if(!defined(pros.forbiddentype)){
            pros.forbiddentype=2;
        }
        return pros;
    };

    /**
     * 创建一个WMS服务的Provider
     * @param {String}url           服务路径
     * @param {String}layers        加载图层名称
     * @return {ImageryLayer}
     */
    createWMSImagery (url, layers) {
        if (url) {
            url += '?t=' + Date.parse(new Date());
            this.removeDisplayServerRestrict();
            let layerProvider = new WebMapServiceImageryProvider({
                url: url,
                parameters: {
                    transparent: true,
                    format: 'image/png'
                },
                layers: layers,
                subdomains: ['gs2', 'gs3', 'gs4', 'gs5']
            });
            return this.viewer.scene.imageryLayers.addImageryProvider(layerProvider);
        }else{
            return null;
        }
    };

    /**
     * 控制影像服务的限制区域显示隐藏
     * @param {String}url           影像服务路径
     * @param {String}name          要控制的图层名
     * @param {Boolean}isShow       是否显示
     */
    displaySeversRestrict(url,name,isShow){
        let layers='';
        if(defined(this.restrctLayer)){
            layers=this._getLayers(this.restrctLayer.imageryProvider.layers,name,isShow);
            this.restrctLayer=this.createWMSImagery(url,layers);
        }else{
            layers=name;
            if(isShow) {
                this.restrctLayer = this.createWMSImagery(url, layers);
            }
        }
    };

    removeDisplayServerRestrict(){
        this.restrctLayer&&this.viewer.scene.imageryLayers.remove(this.restrctLayer);
        this.restrctLayer=undefined;
    };

    disPlayRedLineArea(url,isShow){
        this.viewer.entities.remove(this.redLineEntity);
        this.redLineEntity=null;
      /*  if(defined(this.redLineEntity)){
            this.redLineEntity.show=isShow;
        }else */if(isShow){
            Resource.fetchJson({url:url}).then((data)=>{
                let points= data.inner;
                let maxPnts=[];
                points.forEach((pnts)=>{
                    let ps=[];
                    pnts.forEach((pnt)=>{
                        if(pnt.length===2){
                            pnt.push(0);
                        }
                        ps=ps.concat(pnt);
                    });
                    if(ps.length>maxPnts.length){
                        maxPnts=ps;
                    }
                });
                this.redLineEntity=this.viewer.entities.add({
                    polyline: {
                        positions: Cartesian3.fromDegreesArrayHeights(maxPnts),
                        clampToGround:true,
                        width: 3,
                        show:true,
                        material: Color.RED.withAlpha(0.6)
                    }
                });
            })
        }
    };

    /**
     * WMS影像服务图层显示控制
     * @param {String}layerstr          WMS服务中layers
     * @param {String}name              需要控制的图层名称
     * @param {Boolean}isShow           是否显示
     * @private
     */
    _getLayers(layerstr,name,isShow){
        let layers=[];
        if(layerstr.indexOf(',')<0&&layerstr!==''){
            layers.push(layerstr)
        }else{
            layers =layerstr.split(',');
        }
        let index = layers.indexOf(name);
        if(!isShow){//隐藏,图层中若有则移除
            if (index >= 0) {
                layers.splice(index, 1);
            }
        }else{
            if (index<0){
                layers.push(name);
            }
        }
        layers=layers.filter(function (s) {
            return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
        });
        return layers.join(",");
    };

}

export default EditRestrictArea;
