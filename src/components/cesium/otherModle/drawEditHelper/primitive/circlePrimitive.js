/**
 * Created by pengYX on 2019/5/27.
 */
import ColorGeometryInstanceAttribute from 'cesium/Core/ColorGeometryInstanceAttribute';
import defined from 'cesium/Core/defined';
import CircleGeometry from 'cesium/Core/CircleGeometry';
import CircleOutlineGeometry from 'cesium/Core/CircleOutlineGeometry';
import Primitive from 'cesium/Scene/Primitive';
import GeometryInstance from 'cesium/Core/GeometryInstance';
import GroundPrimitive from 'cesium/Scene/GroundPrimitive';
import PerInstanceColorAppearance from 'cesium/Scene/PerInstanceColorAppearance';
import EllipsoidSurfaceAppearance from 'cesium/Scene/EllipsoidSurfaceAppearance';
import BasePrimitive from './basePrimitive';
import {copyOptions} from './utilFunc'

class CirclePrimitive extends BasePrimitive {
    constructor (ellipsoid,options) {
        super(ellipsoid);
        let appearance=null;
        if(options.isClapOnTerrian){
            appearance=new EllipsoidSurfaceAppearance({
                material : this.material
            });
        }else{
            appearance=new EllipsoidSurfaceAppearance({
                material : this.material,
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
        this.setCenter(options.center);
        this.setRadius(options.radius);
    };

    setCenter(center) {
        this.setAttribute('center', center);
    };

    getCenter() {
        return this.getAttribute('center');
    };

    setRadius(radius) {
        this.setAttribute('radius', Math.max(0.1, radius));
    };

    getRadius() {
        return this.getAttribute('radius');
    };

    getGeometry () {
        if (!defined(this.center)&& defined(this.radius)) {
            return;
        }
        return new CircleGeometry({
            center : this.center,
            radius : this.radius,
            height : 0.0,
            vertexFormat : EllipsoidSurfaceAppearance.DEFAULT,
            stRotation : this.textureRotationAngle,
            granularity : this.granularity
        });
    };

    getOutlineGeometry () {
        return CircleOutlineGeometry({
            center: this.getCenter(),
            radius: this.getRadius()
        });
    };



    update (context, frameState, commandList) {
        this._judgAttri();
        if(this._createPrimitive ||(this._ellipsoid !== this.ellipsoid) || (this._granularity !== this.granularity) || (this._height !== this.height) || (this._textureRotationAngle !== this.textureRotationAngle) || (this._id !== this.id)){
            this._setAttriValue();
            let geometry = this.getGeometry();
            if (!geometry) {return;}
            if(this._isClapOnTerrian){
                this._primitive = new GroundPrimitive({
                    geometryInstances : new GeometryInstance({
                        geometry : geometry,
                        id : this.id,
                        pickPrimitive : this
                    }),
                    appearance : this.appearance,
                    asynchronous : this.asynchronous
                });
            }else{
                this._primitive = new Primitive({
                    geometryInstances : new GeometryInstance({
                        geometry : geometry,
                        id : this.id,
                        pickPrimitive : this,
                        attributes : {
                            color : this.appearance
                        }
                    }),
                    asynchronous : this.asynchronous
                });
            }
            this._outlinePolygon = this._outlinePolygon && this._outlinePolygon.destroy();
            if (this.strokeColor && this.getOutlineGeometry) {
                this._outlinePolygon = new Primitive({
                    geometryInstances : new GeometryInstance({
                        geometry : this.getOutlineGeometry(),
                        attributes : {
                            color : ColorGeometryInstanceAttribute.fromColor(this.strokeColor)
                        }
                    }),
                    appearance : new PerInstanceColorAppearance({
                        flat : true,
                        renderState : {
                            depthTest : {
                                enabled : true
                            },
                            lineWidth : Math.min(this.strokeWidth || 4.0, context._aliasedLineWidthRange[1])
                        }
                    })
                });
            }
        }
        let primitive =this._primitive;
        if(!primitive){
            return;
        }
        if(!this._isClapOnTerrian){
            primitive.appearance.material = this.material;
        }
        primitive.debugShowBoundingVolume = this.debugShowBoundingVolume;
        primitive.update(context, frameState, commandList);
        this._outlinePolygon && this._outlinePolygon.update(context, frameState, commandList);
    };

}

export default CirclePrimitive;
