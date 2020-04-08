/* eslint-disable */
/**
 * Created by pengYX on 2018/8/20.
 */
import defaultValue from 'cesium/Core/defaultValue';
import Cartographic from 'cesium/Core/Cartographic';
import sampleTerrainMostDetailed from 'cesium/Core/sampleTerrainMostDetailed';
import defined from 'cesium/Core/defined';
import when from 'cesium/ThirdParty/when';

/**
 * 获取地形上的高程
 */
class TerrianTool{

    constructor(viewer){
        this.viewer=viewer;
    };

    /**
     * 重采样给定经纬度点的地形高度
     * @param pointsArray           要经纬度点数字[{lon:110.2,lat:25.6},{lon:110.2,lat:25.6},{lon:110.2,lat:25.6}]
     * @param terrainLevel          要采样的地形等级（从给定等级的地形数据中采样）
     * @param callBack              采样结束后要执行的回调函数
     */
    sampleTerrianHightWithCallBack(pointsArray,terrainLevel,callBack){
        this.terrianProvider=defaultValue(this.viewer.terrainProvider,undefined);
        //请求高程
        if(!defined(this.terrianProvider)){return;}

        let pointArrInput = [];
        for (let i = 0; i < pointsArray.length; i++) {
            pointArrInput.push(Cartographic.fromDegrees(pointsArray[i].lon, pointsArray[i].lat));
        }
        let promise = sampleTerrainMostDetailed(this.terrianProvider,  pointArrInput);

        when(promise, function (updatedPositions) {
            callBack(updatedPositions);
        });
    };

    /**
     * 重采样给定经纬度点的地形高度
     * @param pointsArray               要经纬度点数字[{lon:110.2,lat:25.6},{lon:110.2,lat:25.6},{lon:110.2,lat:25.6}]
     * @param terrainLevel              要采样的地形等级（从给定等级的地形数据中采样）
     * @returns {Promise}
     * promise.then((isOutTerrian)=>{
     *
     * })
     */
    sampleTerrianHight(pointsArray, terrainLevel) {
        this.terrianProvider=defaultValue(this.viewer.terrainProvider,undefined);
        //请求高程
        if (!defined(this.terrianProvider)) {
            return;
        }
        let pointArrInput = [];
        for (let i = 0; i < pointsArray.length; i++) {
            pointArrInput.push(Cartographic.fromDegrees(pointsArray[i].lon, pointsArray[i].lat));
        }
        let promise = sampleTerrainMostDetailed(this.terrianProvider, pointArrInput);
        return new Promise((resolve, reject) => {
            promise.then((updatedPositions) => {
                let isOutTerrian = false;
                if (!defined(updatedPositions[0].height) || updatedPositions[0].height === 0) {
                    isOutTerrian = true;
                }
                resolve(isOutTerrian);
            }, (error) => {
                reject(error);
            });
        });
    };

    /**
     * 根据cartesian3数组获取地形高度
     * @param cartesiansArray
     * @param terrainLevel
     * @returns {*}
     */
    sampleCartesianArrayTerrianHeight(cartesiansArray,terrainLevel){
        this.terrianProvider=defaultValue(this.viewer.terrainProvider,undefined);
        let ellipsoid=this.viewer.scene.globe.ellipsoid;
        let coordinates=[];
        cartesiansArray.forEach((cartesian)=>{
            coordinates.push(ellipsoid.cartesianToCartographic(cartesian));
        });
        return sampleTerrainMostDetailed(this.terrianProvider,  coordinates);
    };

    /**
     * 根据degree数组获取地形高度
     * @param degreeArray
     * @param terrainLevel
     * @returns {*}
     */
    sampleDegreeArrayTerrianHeight(degreeArray,terrainLevel){
        this.terrianProvider=defaultValue(this.viewer.terrainProvider,undefined);
        let coordinates=[];
        degreeArray.forEach((degree)=>{
            coordinates.push(Cartographic.fromDegrees(degree[0],degree[1]));
        });
        return sampleTerrainMostDetailed(this.terrianProvider, coordinates);
    };

}

export default TerrianTool;
