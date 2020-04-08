/* eslint-disable */
/**
 * Created by pengYX on 2018/9/5.
 */

import CustomDataSource from 'cesium/DataSources/CustomDataSource';
import Resource from 'cesium/Core/Resource';
import CesiumMath from 'cesium/Core/Math';
import Transforms from  'cesium/Core/Transforms';
import Cartesian3 from 'cesium/Core/Cartesian3';
import HeightReference from  'cesium/Scene/HeightReference';
import DistanceDisplayCondition from  'cesium/Core/DistanceDisplayCondition';
import defined from 'cesium/Core/defined';
import defaultValue from 'cesium/Core/defaultValue';
import Color from 'cesium/Core/Color';
import Matrix4 from 'cesium/Core/Matrix4';
import Matrix3 from 'cesium/Core/Matrix3';
import Cartographic from 'cesium/Core/Cartographic';
import sampleTerrainMostDetailed from 'cesium/Core/sampleTerrainMostDetailed';

import Cesium3DTileset from 'cesium/Scene/Cesium3DTileset';
import HeadingPitchRange from 'cesium/Core/HeadingPitchRange';
import EditNodeHelper from './drawEditHelper/editNodeHelper';
import {baseS3Path, fanVisibleHeightRange, farmhpr, stationURL} from "../subMoudle/constants";
import {clone} from './drawEditHelper/primitive/utilFunc';
window.Turf = require('../../../../static/thirdParty/turf');

class StationEdit{
    constructor(viewer){
        this.viewer=viewer;
        this.stationDS=new CustomDataSource('stationDS');//存升压站面积
        this.viewer.dataSources.add(this.stationDS);
        this.stationModelDS=new CustomDataSource('stationModelDS');//存升压站模型
        this.viewer.dataSources.add(this.stationModelDS);
    };

    loadStationOld(url) {
        this.removeStation();
        return new Promise((resove, reject) => {
            Resource.fetchJson({url: url}).then((data) => {
                this.originRoadGeoJSON = data;
                let points = data.features[0].geometry.coordinates;
                let properties = data.properties;
                properties.points=points;
                this._addPolygon(points, properties);
                points.push(points[0]);
                let polygon = Turf.polygon([points]);
                let centroid = Turf.centroid(polygon);//升压站中心点
                this.displayStationModle(centroid.geometry.coordinates);
                this.viewer.flyTo(this.stationModelDS.entities, {
                    offset : {
                        heading : CesiumMath.toRadians(0.0),
                        pitch : CesiumMath.toRadians(-25),
                        range : 1000
                    }
                });
                resove(properties);
            },(error)=>{
                console.log("S3上文件不存在或者格式不正确,文件路径：",+ url);
                reject({"code":404,"url":url});
            });
        });
    };

    loadStation(url, isModel) {
        isModel = defaultValue(isModel, true);
        this.removeStation();
        return new Promise((resove, reject) => {
            Resource.fetchJson({url: url}).then((data) => {
                this.originRoadGeoJSON = data;
                let properties = data.properties;
                data.features.forEach((feature) => {
                    let points = feature.geometry.coordinates;
                    if (defined(feature.properties)) {
                        properties = feature.properties;
                    }
                    properties.points = points;
                    this._addPolygon(points, properties);
                    points.push(points[0]);
                    let polygon = Turf.polygon([points]);
                    let centroid = Turf.centroid(polygon);//升压站中心点
                    let pp = centroid.geometry.coordinates;
                    if(!isModel){
                        this._addBIMStation({
                            x: pp[0],
                            y: pp[1],
                            z: 0,
                            url: baseS3Path+'models/station-bim/data/tileset.json',
                            name: 'station',
                            id: 'station'
                        },0);
                    }else{
                        this.createStations({
                            x: pp[0],
                            y: pp[1],
                            z: 0,
                            url: stationURL,
                            name: 'station',
                            id: 'station',
                            scale: 0.8,
                            near: fanVisibleHeightRange[0],
                            far: fanVisibleHeightRange[1]
                        });
                    }

                });
                this.showPolygonEntity(false, this.stationDS);
                this.viewer.flyTo(this.stationModelDS.entities, {
                    offset: {
                        heading: CesiumMath.toRadians(0.0),
                        pitch: CesiumMath.toRadians(-25),
                        range: 1000
                    }
                });
                resove(properties);
            }, (error) => {
                console.log("S3上文件不存在或者格式不正确,文件路径：", +url);
                reject({"code": 404, "url": url});
            });
        });

    };

    /**
     * 显示升压站模型
     */
    displayStationModle(points){
        this.showPolygonEntity(false,this.stationDS);
        this.clearStations();
        this.createStations({x:points[0],y:points[1],z:0,url:stationURL,name:'station',id:'station',scale:0.8,near:fanVisibleHeightRange[0],far:fanVisibleHeightRange[1]});
    };

    clearStations(isModel){
        if(isModel){
            this.stationModelDS.entities.removeAll();
        }else{
            if(this.BIM){
                this.viewer.scene.primitives.remove(this.BIM);
            }
        }
    };

    createStations(model) {
        let position = Cartesian3.fromDegrees(model.x, model.y, model.z);
        const FanOrientation = Transforms.headingPitchRollQuaternion(position, farmhpr);
        return this.stationModelDS.entities.add({
            name: model.name,
            entityID:model.id,
            position: position,
            orientation: FanOrientation,
            model: {
                uri: model.url,
                allowPicking: true,
                show: true,
                incrementallyLoadTextures: false,
                heightReference:HeightReference.CLAMP_TO_GROUND,
                scale:model.scale,
                minimumPixelSize:128,
                maximumScale:model.scale,
                distanceDisplayCondition: new DistanceDisplayCondition(model.near,model.far)
            }
        });
    };

    _addBIMStation (model,rotation) {
        sampleTerrainMostDetailed(this.viewer.terrainProvider,[Cartographic.fromDegrees(model.x, model.y)]).then((pos)=>{
            let he = pos.length>0&&pos[0].height&&pos[0].height<0?0:pos[0].height;
            let modelMatrix = Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(model.x, model.y, he+3));
            Matrix4.multiplyByMatrix3(modelMatrix, Matrix3.fromRotationZ(CesiumMath.toRadians(rotation)), modelMatrix);
            this.BIM = this.viewer.scene.primitives.add(new Cesium3DTileset({
                url: model.url,
                modelMatrix: modelMatrix,
                luminanceAtZenith: 0.2,
                lightColor: new Cartesian3(0.3, 0.3, 0.3),
            }));
            this.BIM.readyPromise.then((tileset) => {
                this.viewer.zoomTo(tileset, new HeadingPitchRange(0, -0.5,this.BIM.boundingSphere.radius * 4.0));
            }).otherwise(function(error) {
                console.log(error);
            });
        },()=>{
            let modelMatrix = Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(model.x, model.y, model.z));
            Matrix4.multiplyByMatrix3(modelMatrix, Matrix3.fromRotationZ(CesiumMath.toRadians(rotation)), modelMatrix);
            this.BIM = this.viewer.scene.primitives.add(new Cesium3DTileset({
                url: model.url,
                modelMatrix: modelMatrix,
                luminanceAtZenith: 0.2,
                lightColor: new Cartesian3(0.3, 0.3, 0.3),
            }));
            this.BIM.readyPromise.then((tileset) => {
                this.viewer.zoomTo(tileset, new HeadingPitchRange(0, -0.5,this.BIM.boundingSphere.radius * 4.0 ));//this.BIM.boundingSphere.radius * 4.0
            }).otherwise(function(error) {
                console.log(error);
            });
        });
    }

    removeStation(){
        if(this.BIM){
            this.viewer.scene.primitives.remove(this.BIM);
        }
       this.stationDS.entities.removeAll();
       this.stationModelDS.entities.removeAll();
    };

    startEditStation(){
        this.showPolygonEntity(true,this.stationDS);
        this._hideShowDS(false,this.stationModelDS);
        //if(!defined(this.editNodeHelper)){
        this.editNodeHelper=new EditNodeHelper(this.viewer);
        this.stationDS.entities.values.forEach((stationEntity)=>{
            stationEntity.polygon&&stationEntity.polygon.setEditable();
        });
        this.editNodeHelper.initHandles();
        //this.stationDS.entities.values[0].polygon.setEditable();
        //this.stationDS.entities.values[0].polygon.setEditMode(true);
    };

    /**
     * 停止升压站的编辑模式
     */
    stopEditStation(){
        this.showPolygonEntity(false,this.stationDS);
        this._hideShowDS(true,this.stationModelDS);
        if(this.editNodeHelper){
            this.stationDS.entities.values.forEach((stationEntity)=>{
                stationEntity.polygon&&stationEntity.polygon.setEditMode&&stationEntity.polygon.setEditMode(false);
            });
            this.editNodeHelper.removeHandles();
        }
    };

    saveEditStationGeoJSONOld(){
        this.initSubmitGeoJSON();
        let cartesians=[],geoType="",properties={},positions=[];
        let entity=this.stationDS.entities.values[0];
        if(defined(entity)&&defined(entity.polygon)){
            cartesians=entity.polygon.hierarchy._value;
            geoType="Polygon";
            positions=this.cartesianArrayToDegrees(cartesians);
            this.addFeatureToGeoJson(positions,geoType);
            if(entity.polygon.setEditMode){
                entity.polygon.setEditMode(false);
            }
        }
        this.editNodeHelper&&this.editNodeHelper.removeHandles();
        return this.submitGeoJSON;
    };

    saveEditStationGeoJSON(){
        this.initSubmitGeoJSON();
        let cartesians=[], geoType="Polygon",properties={},positions=[];
        this.stationDS.entities.values.forEach((stationEntity,index)=>{
            if(defined(stationEntity.polygon)){
                positions=this.cartesianArrayToDegrees(stationEntity.polygon.hierarchy.getValue());
                properties=clone(stationEntity.polygon.properties);
                if (properties.hasOwnProperty('points')) delete properties.points;
                this.addFeatureToGeoJson(positions,geoType,properties,index+1);
                stationEntity.polygon.setEditMode&&stationEntity.polygon.setEditMode(false);
            }
        });
        this.editNodeHelper&&this.editNodeHelper.removeHandles();
        return this.submitGeoJSON;
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
            coordinates.push([CesiumMath.toDegrees(cartographic.longitude ),CesiumMath.toDegrees(cartographic.latitude),cartographic.height]);
        });
        return coordinates;
    };

    /**
     * 构建GeoJSON中的单个feature对象
     * @param positions         geometry.coordinates
     * @param geoType           geometry.type
     * @param properties        properties
     */
    addFeatureToGeoJson(positions, geoType,properties,id) {
        this.submitGeoJSON.features.push({
            "id":"station"+id,
            "type": "Feature",
            "geometry": {
                "type": geoType,
                "coordinates": positions
            },
            "properties":properties
        });
    };

    /**
     * 初始化要提交的JSON对象（开始编辑时候调用）
     */
    initSubmitGeoJSON(){
        this.submitGeoJSON={
            "type": "FeatureCollection",
            "features": []
        };//存储编辑完成后要提交的升压站数据
    };

    _addPolygon(points,options){
        let pos=[];
        points.forEach((point)=>{
            pos.push(point[0],point[1],point[2]);
        });
        let cars=Cartesian3.fromDegreesArrayHeights(pos);
        let rect= this.stationDS.entities.add({
            polygon:{
                hierarchy :cars,
                heightReference:HeightReference.CLAMP_TO_GROUND,
                material : Color.AQUA.withAlpha(0.0)
            }
        });
        rect.polygon.properties=options;
        rect.polygon.coords=points;
    };

    _hideShowDS(isShow, ds) {
        ds.entities.values.forEach((entity) => {
            entity.show = isShow;
        })
    };

    showPolygonEntity(isShow,ds){
        let color= Color.AQUA;
        if(isShow){
            color=Color.AQUA.withAlpha(0.5);
        }else{
            color=Color.AQUA.withAlpha(0.0);
        }
        ds.entities.values.forEach((entity) => {
            entity.polygon.material = color;
        })
    };

}

export default StationEdit
