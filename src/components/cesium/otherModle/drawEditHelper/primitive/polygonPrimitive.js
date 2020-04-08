/* eslint-disable */
/**
 * Created by pengYX on 2018/7/19.
 */
import ColorGeometryInstanceAttribute from 'cesium/Core/ColorGeometryInstanceAttribute';
import defined from 'cesium/Core/defined';
import PolygonGeometry from 'cesium/Core/PolygonGeometry';
import PolygonOutlineGeometry from 'cesium/Core/PolygonOutlineGeometry';
import EllipsoidSurfaceAppearance from 'cesium/Scene/EllipsoidSurfaceAppearance';
import BasePrimitive from './basePrimitive';
import {copyOptions} from './utilFunc'

class PolygonPrimitive extends  BasePrimitive{
    constructor(ellipsoid,options){
        super(ellipsoid);
        let appearance=null;
        if(options.isClapOnTerrian){
            appearance=new ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 0.5);//(0.937,0.7059,0,0.6);//
        }else{
            appearance=new EllipsoidSurfaceAppearance({
                aboveGround : true
            });
        }
        this.defaultSurfaceOptions=copyOptions(this.defaultShapeOptions, {
            appearance: appearance,
            material : this.material,
            granularity: Math.PI / 180.0
        });
        options=copyOptions(options, this.defaultSurfaceOptions);
        this.initialiseOptions(options);
    };

    setPositions (positions) {
        this.setAttribute('positions', positions);
    };

    getPositions () {
        return this.getAttribute('positions');
    };

    getGeometry () {
        if (!defined(this.positions) || this.positions.length < 3) {
            return;
        }
        return PolygonGeometry.fromPositions({
            positions : this.positions,
             height : this.height,
            vertexFormat : EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            stRotation : this.textureRotationAngle,
            ellipsoid : this.ellipsoid,
            //perPositionHeight:true,
            granularity : this.granularity
        });
    };

    getOutlineGeometry () {
        return PolygonOutlineGeometry.fromPositions({
            positions : this.getPositions()
        });
    };

}

export default PolygonPrimitive;
