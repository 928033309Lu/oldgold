import Cesium from 'cesium/Cesium';
import DrawPrimitiveHelper from './drawEditHelper/drawPrimitiveHelper';
import {KmlFeatureType} from "../subMoudle/kmlMoudle/KmlFeatureType";
import TerrianTool from "./terrianTool";
import {terrianLevel} from "../subMoudle/constants";
let Turf = require('../../../../static/thirdParty/turf');

/**
 * 剖面分析
 */
class ProfileAnalysis {
    constructor(viewer){
        this.viewer = viewer;
        this.drawHelper = new DrawPrimitiveHelper(viewer);
        this.analysisDS = new Cesium.CustomDataSource('analysis');
        this.viewer.dataSources.add(this.analysisDS);
        this.terrianTool=new TerrianTool(viewer);
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
    analysis (callBack) {
        let _self = this;
        this.drawHelper.startDrawingPolyline({
            isClapOnTerrian:true,
            callback:function (positions){
                if(positions&&positions.length>2){
                    positions.splice(positions.length-2,2);
                }
                let polyline = _self.analysisDS.entities.add({
                    name:'analysis',
                    type: KmlFeatureType.POLYLINE,
                    polyline:{
                        positions:positions,
                        width:3.0,
                        clampToGround:true,
                        material:Cesium.Color.fromAlpha(Cesium.Color.YELLOW,0.6)
                    }
                });
                let promise = _self._getProfiles(positions);
                promise.then((data)=>{
                    callBack&&callBack(data);
                });
            }
        },true);
    };

    exitAnalysis () {
        this.analysisDS.entities.removeAll();
    };

    /**
     * 获取
     * @param positions
     * @returns {*}
     * @private
     */
    _getProfiles(positions) {
        let crossSectionData = [];
        let promise = this.terrianTool.sampleCartesianArrayTerrianHeight(positions, terrianLevel);
        return Cesium.when(promise, (updatePositions) => {
            if(updatePositions&&updatePositions.length>1){
                let lng = Cesium.Math.toDegrees(updatePositions[0].longitude);
                let lat = Cesium.Math.toDegrees(updatePositions[0].latitude);
                let from = Turf.point([lng, lat]);
                let options = {units: 'kilometers'};
                let distance = 0;
                crossSectionData.push({
                    id: 0,
                    x: distance,
                    lng: lng,
                    lat: lat,
                    y: updatePositions[0].height
                });
                for (let indx =1;indx<updatePositions.length;indx++) {
                    lng = Cesium.Math.toDegrees(updatePositions[indx].longitude);
                    lat = Cesium.Math.toDegrees(updatePositions[indx].latitude);
                    let to = Turf.point([lng, lat]);
                    distance += Turf.distance(from, to, options)*1000;
                    crossSectionData.push({
                        id: indx,
                        x:distance,
                        lng: lng,
                        lat: lat,
                        y: updatePositions[indx].height
                    });
                    from = to;
                }
            }
            return crossSectionData;
        }).otherwise(() => {
            if(positions&&positions.length>1){
                let degs = this._cartesianToDegree (positions[0]);
                let from = Turf.point([degs[0],degs[1]]),dis = 0;
                let options = {units: 'kilometers'};
                crossSectionData.push({
                    id: 0,
                    x: dis,
                    lng: degs[0],
                    lat: degs[1],
                    y: 0
                });
                for(let i= 1;i<positions.length;i++){
                    degs = this._cartesianToDegree (positions[i]);
                    let to =  Turf.point([degs[0],degs[1]]);
                    dis += Turf.distance(from, to, options)*1000;
                    crossSectionData.push({
                        id: i,
                        x:dis,
                        lng: degs[0],
                        lat: degs[1],
                        y: 0
                    });
                    from = to;
                }
            }
            return crossSectionData;
        });
    };

    /**
     * 世界坐标转经纬度坐标
     * @param {Cartesian3}cartesian
     * @return {Number[]}       坐标数组[经度，纬度，高度]
     * @private
     */
    _cartesianToDegree (cartesian) {
        let cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        return [lng, lat, 0];
    };
}

export default ProfileAnalysis;
