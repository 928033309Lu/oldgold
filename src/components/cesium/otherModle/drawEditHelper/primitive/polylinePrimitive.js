/* eslint-disable */
/**
 * Created by pengYX on 2018/7/19.
 */
import defined from 'cesium/Core/defined';
import PolylineGeometry from 'cesium/Core/PolylineGeometry';
import PolylineMaterialAppearance from 'cesium/Scene/PolylineMaterialAppearance';
import EllipsoidSurfaceAppearance from 'cesium/Scene/EllipsoidSurfaceAppearance';

import BasePrimitive from './basePrimitive';
import {copyOptions} from './utilFunc'

class PolylinePrimitive extends BasePrimitive{
    constructor(ellipsoid,options){
        super(ellipsoid);
        this.defaultPolylineOptions=copyOptions(this.defaultShapeOptions, {
            width: 5,
            geodesic: true,
            granularity: 10000,
            appearance: new PolylineMaterialAppearance({
                aboveGround : false
            }),
            material : this.material
        });
        options=copyOptions(options, this.defaultPolylineOptions);
        this.initialiseOptions(options);
    };

    setPositions (positions) {
        this.setAttribute('positions', positions);
    };

    setWidth (width) {
        this.setAttribute('width', width);
    };

    setGeodesic (geodesic) {
        this.setAttribute('geodesic', geodesic);
    };

    getPositions () {
        return this.getAttribute('positions');
    };

    getWidth () {
        return this.getAttribute('width');
    };

    getGeodesic (geodesic) {
        return this.getAttribute('geodesic');
    };

    getGeometry () {
        if (!defined(this.positions) || this.positions.length < 2) {
            return;
        }
        return new PolylineGeometry({
            positions: this.positions,
            height : this.height,
            width: this.width < 1 ? 1 : this.width,
            vertexFormat : EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            ellipsoid : this.ellipsoid
        });
    }

}

export default PolylinePrimitive
