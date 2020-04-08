/* eslint-disable */
/**
 * Created by pengYX on 2018/7/19.
 */
import  Material from 'cesium/Scene/Material';
import Color from 'cesium/Core/Color';
import destroyObject from 'cesium/Core/destroyObject';
import ColorGeometryInstanceAttribute from 'cesium/Core/ColorGeometryInstanceAttribute';
import defined from 'cesium/Core/defined';
import DeveloperError from 'cesium/Core/DeveloperError';
import Primitive from 'cesium/Scene/Primitive';
import GeometryInstance from 'cesium/Core/GeometryInstance';
import PerInstanceColorAppearance from 'cesium/Scene/PerInstanceColorAppearance';
import GroundPolylinePrimitive from 'cesium/Scene/GroundPolylinePrimitive';
import GroundPrimitive from 'cesium/Scene/GroundPrimitive';
import {fillOptions} from './utilFunc';

class BasePrimitive{
    constructor(ellipsoid){
        this.defaultShapeOptions = {
            ellipsoid: ellipsoid,
            textureRotationAngle: 0.0,
            height: 0.0,
            asynchronous: true,
            show: true,
            debugShowBoundingVolume: false
        };
        this.material = Material.fromType(Material.ColorType);
        this.material.uniforms.color = new Color(0.937,0.7059,0,1);//Color.DARKORANGE.withAlpha(0.6);
    };

    initialiseOptions (options) {
        fillOptions(this, options);
        this._ellipsoid = undefined;
        this._granularity = undefined;
        this._height = undefined;
        this._textureRotationAngle = undefined;
        this._id = undefined;
        // set the flags to initiate a first drawing
        this._createPrimitive = true;
        this._primitive = undefined;
        this._outlinePolygon = undefined;
        this._isClapOnTerrian=undefined;
        this._groundPolyline=undefined;
    };

    setAttribute (name, value) {
        this[name] = value;
        this._createPrimitive = true;
    };

    getAttribute (name) {
        return this[name];
    };

    isDestroyed () {
        return false;
    };

    destroy () {
        this._primitive = this._primitive && this._primitive.destroy();
        return destroyObject(this);
    };

    update(context, frameState, commandList) {
        if (!defined(this.ellipsoid)) {
            throw new DeveloperError('this.ellipsoid must be defined.');
        }
        if (!defined(this.appearance)) {
            throw new DeveloperError('this.material must be defined.');
        }
        if (this.granularity < 0.0) {
            throw new DeveloperError('this.granularity and scene2D/scene3D overrides must be greater than zero.');
        }
        if (!this.show) {
            return;
        }
        if (!this._createPrimitive && (!defined(this._primitive))) {
            // No positions/hierarchy to draw
            return;
        }

        if (this._createPrimitive || (this._ellipsoid !== this.ellipsoid) || (this._granularity !== this.granularity) || (this._height !== this.height) || (this._textureRotationAngle !== this.textureRotationAngle) || (this._id !== this.id)) {
            let geometry = this.getGeometry();
            if (!geometry) {
                return;
            }
            this._createPrimitive = false;
            this._ellipsoid = this.ellipsoid;
            this._granularity = this.granularity;
            this._height = this.height;
            this._isClapOnTerrian=this.isClapOnTerrian;
            this._groundPolyline=this.groundPolyline;
            this._textureRotationAngle = this.textureRotationAngle;
            this._id = this.id;
            this._primitive = this._primitive && this._primitive.destroy();

            if(this._isClapOnTerrian){
                if(this._groundPolyline){//贴地线
                    this._primitive =new GroundPolylinePrimitive({
                        geometryInstances : new GeometryInstance({
                            geometry : geometry,
                            id : this.id
                        }),
                        appearance : this.appearance,
                        asynchronous : this.asynchronous
                    });
                }else{//非贴地线外的其它贴地对象
                    this._primitive = new GroundPrimitive({
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
             }else{
                this._primitive = new Primitive({
                    geometryInstances : new GeometryInstance({
                        geometry : geometry,
                        id : this.id,
                        pickPrimitive : this
                    }),
                    appearance : this.appearance,
                    asynchronous : this.asynchronous
                });
            }

            this._outlinePolygon = this._outlinePolygon && this._outlinePolygon.destroy();
            if (this.strokeColor && this.getOutlineGeometry) {
                // create the highlighting frame
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
        if(!this._isClapOnTerrian||this._groundPolyline){
            primitive.appearance.material = this.material;
        }
        primitive.debugShowBoundingVolume = this.debugShowBoundingVolume;
        primitive.update(context, frameState, commandList);
        this._outlinePolygon && this._outlinePolygon.update(context, frameState, commandList);

    };

    setStrokeStyle (strokeColor, strokeWidth) {
        if(!this.strokeColor || !this.strokeColor.equals(strokeColor) || this.strokeWidth != strokeWidth) {
            this._createPrimitive = true;
            this.strokeColor = strokeColor;
            this.strokeWidth = strokeWidth;
        }
    };


    _judgAttri(){
        if (!defined(this.ellipsoid)) {
            throw new DeveloperError('this.ellipsoid must be defined.');
        }
        if (!defined(this.appearance)) {
            throw new DeveloperError('this.material must be defined.');
        }
        if (this.granularity < 0.0) {
            throw new DeveloperError('this.granularity and scene2D/scene3D overrides must be greater than zero.');
        }
        if (!this.show) {
            return;
        }
        if (!this._createPrimitive && (!defined(this._primitive))) {
            // No positions/hierarchy to draw
            return;
        }
    };

    _setAttriValue(){
        this._createPrimitive = false;
        this._ellipsoid = this.ellipsoid;
        this._granularity = this.granularity;
        this._height = this.height;
        this._isClapOnTerrian=this.isClapOnTerrian;
        this._textureRotationAngle = this.textureRotationAngle;
        this._id = this.id;
        this._primitive = this._primitive && this._primitive.destroy();
    };
}

export default BasePrimitive;

