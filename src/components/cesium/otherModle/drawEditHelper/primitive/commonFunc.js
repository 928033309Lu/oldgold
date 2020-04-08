/* eslint-disable */
/**
 * Created by pengYX on 2018/7/19.
 */
import Cartographic from 'cesium/Core/Cartographic';
import CesiumMath from  'cesium/Core/Math';
/**
 * 包含常规计算，平面面积，球面面积，距离等
 */
class CommonFunc{
    constructor(radius){
        this.earthRadiusMeters=radius;
        this.metersPerDegree = 2.0 * Math.PI * this.earthRadiusMeters / 360.0;
    };

    /**
     * 球面多边形面积计算
     * https://blog.csdn.net/neil89/article/details/49331641
     * @param positions     [[110,23],[110,24],[111,26],[110,26]]
     * @returns {number}    多边形面积（平方米）
     */
    SphericalPolygonAreaMeters(points){
        let totalAngle = 0;
        for (let i = 0; i < points.length; i++) {
            let j = (i + 1) % points.length;
            let k = (i + 2) % points.length;
            totalAngle += this.Angle(points[i], points[j], points[k]);
        }
        let planarTotalAngle = (points.length - 2) * 180.0;
        let sphericalExcess = totalAngle - planarTotalAngle;
        if (sphericalExcess > 420.0) {
            totalAngle = points.length * 360.0 - totalAngle;
            sphericalExcess = totalAngle - planarTotalAngle;
        } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
            sphericalExcess = Math.abs(360.0 - sphericalExcess);
        }
        return sphericalExcess * (Math.PI / 180.0) * this.earthRadiusMeters * this.earthRadiusMeters;
    };

    /**
     * 平面多边形面积计算
     * https://blog.csdn.net/neil89/article/details/49331641
     * @param positions      [[110,23],[110,24],[111,26],[110,26]]
     * @returns {number}     多边形面积（平方米）
     * @constructor
     */
    PlanarPolygonAreaMeters(points){
        let a = 0;
        for (let i = 0; i < points.length; ++i) {
            let j = (i + 1) % points.length;
            let xi = points[i][0] * this.metersPerDegree * Math.cos(points[i][1] * (Math.PI / 180.0));
            let yi = points[i][1] * this.metersPerDegree;
            let xj = points[j][0] * this.metersPerDegree * Math.cos(points[j][1] * (Math.PI / 180.0));
            let yj = points[j][1] * this.metersPerDegree;
            a += xi * yj - xj * yi;
        }
        return Math.abs(a / 2);
    };

    /**
     * 角度
     * https://blog.csdn.net/neil89/article/details/49331641
     * @param p1            [lon,lat]经纬度
     * @param p2            [lon,lat]经纬度
     * @param p3            [lon,lat]经纬度
     * @returns {number}    角度
     * @constructor
     */
    Angle(p1, p2, p3){
        var bearing21 = this.Bearing(p2, p1);
        var bearing23 = this.Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    };

    /**
     * 方向
     * https://blog.csdn.net/neil89/article/details/49331641
     * @param from            [lon,lat]经纬度
     * @param to              [lon,lat]经纬度
     * @returns {number}      方向
     * @constructor
     */
    Bearing(from,to){
        let lat1 = this.degToRad(from[1]) ;
        let lon1 = this.degToRad(from[0]);
        let lat2 = this.degToRad(to[1]);
        let lon2 = this.degToRad(to[0]);
        let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        return this.radToDeg(angle);
    };

    Distance(){};

    /**
     * 弧度转角度
     * @param rad
     * @returns {number}
     */
    radToDeg(rad){
        return rad*180.0 / Math.PI;
    };

    /**
     * 角度转弧度
     * @param deg
     * @returns {number}
     */
    degToRad(deg){
        return deg*Math.PI / 180.0;
    };

    /**
     * 将Cesium.Cartesian3组成的数组转换成经纬度数组
     * @param positions       [Cesium.Cartesian3,Cesium.Cartesian3,Cesium.Cartesian3]
     * @returns {Array}       [[110,25],[112,35],[117,36]]
     */
    cartesianToDegrees(positions){
        let points=[];
        positions.forEach((position)=>{
            let car=Cartographic.fromCartesian(position);
            points.push([CesiumMath.toDegrees(car.longitude),CesiumMath.toDegrees (car.latitude)]);
        });
        return points;
    };
}

export default CommonFunc;
