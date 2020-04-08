/* eslint-disable */
/**
 * Created by pengYX on 2018/7/19.
 */

import BasePrimitive from './basePrimitive';
import {copyOptions} from './utilFunc'
import PolylineMaterialAppearance from 'cesium/Scene/PolylineMaterialAppearance';
import GroundPolylineGeometry  from 'cesium/Core/GroundPolylineGeometry';
import defined from  'cesium/Core/defined';
class GroundPolylinePrimitive extends BasePrimitive{

    constructor(ellipsoid,options){
        super(ellipsoid);
        this.defaultPolylineOptions=copyOptions(this.defaultShapeOptions, {
            width: 5,
            appearance: new PolylineMaterialAppearance({
                aboveGround : true
            }),
            material : this.material,
            groundPolyline:true,
            isClapOnTerrian:true
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


    getPositions () {
        return this.getAttribute('positions');
    };

    getWidth () {
        return this.getAttribute('width');
    };


    getGeometry () {
        if (!defined(this.positions) || this.positions.length < 2) {
            return;
        }
        return new GroundPolylineGeometry({
            positions: this.positions,
            width: this.width < 1 ? 1 : this.width
        });
    };


}

export default GroundPolylinePrimitive
