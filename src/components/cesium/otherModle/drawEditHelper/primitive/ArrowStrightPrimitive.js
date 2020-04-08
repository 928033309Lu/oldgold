/**
 * Created by pengYX on 2019/5/27.
 */
/**
 * 直线箭头
 */
import Ellipsoid from 'cesium/Core/Ellipsoid';
import CesiumMath from 'cesium/Core/Math';
import PolygonPrimitive from './polygonPrimitive';
import xp from './algorithm';

class ArrowStraightPrimitive extends  PolygonPrimitive{
    constructor(ellipsoid, options){
        super(ellipsoid, options);
    };

    _getLonLat(cartesian) {
        let cartographic =Ellipsoid.WGS84.cartesianToCartographic(cartesian);
        let pos = {
            lon: cartographic.longitude,
            lat: cartographic.latitude,
            alt: cartographic.height
        };
        pos.lon = CesiumMath.toDegrees(pos.lon);
        pos.lat = CesiumMath.toDegrees(pos.lat);
        return pos;
    };

    _isSimpleXYZ(p1, p2){
        if (p1.x == p2.x && p1.y == p2.y && p1.z == p2.z) {
            return true;
        }
        return false;
    };

    setPositions (positions) {
        if (positions.length < 2) {
            return null;
        }
        if (this._isSimpleXYZ(positions[0], positions[1])) {
            return null;
        }
        let firstPoint = this._getLonLat(positions[0]);
        let endPoints = this._getLonLat(positions[1]);
        let arrow = xp.algorithm.fineArrow([firstPoint.lon, firstPoint.lat], [endPoints.lon, endPoints.lat]);
        this.setAttribute('controlPoint', positions);
        this.setAttribute('positions', arrow);
    };

    getPositions () {
        return this.getAttribute('positions');
    };

    getControlPoint(){
        return this.getAttribute('controlPoint');
    };

}

export default ArrowStraightPrimitive;
