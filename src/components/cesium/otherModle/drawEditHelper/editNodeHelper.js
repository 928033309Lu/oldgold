/* eslint-disable */
/**
 * Created by pengYX on 2018/9/5.
 */
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import CesiumMath from 'cesium/Core/Math';
import Cartesian3 from 'cesium/Core/Cartesian3';
import Color from 'cesium/Core/Color';
import PolygonGraphics from 'cesium/DataSources/PolygonGraphics';

import BillboardGroup from './primitive/BillborardGroup';
import BillboardType from './primitive/BillboardType';
import {enhanceWithListeners,createTooltip,setListener} from './primitive/utilFunc';
import store from "../../../../store";
window.Turf = require('../../../../../static/thirdParty/turf');
/**
 * 升压站编辑使用
 */
class EditNodeHelper{
        constructor(viewer){
            this.viewer=viewer;
            this._scene=viewer.scene;
            this.camera=viewer.camera;
            this.handler=new ScreenSpaceEventHandler(viewer.scene.canvas);
            this._tooltip=new createTooltip(viewer.cesiumWidget.container);
            this.enhanceGeoGraphics();
            this.enhancePrimitives();
        };

    /**
     * 扩展PolylineGraphics和PolygonGraphics的prototype属性
     */
    enhanceGeoGraphics(){
        PolygonGraphics.prototype.getPosition=function () {
            return this.hierarchy._value;
        };
        PolygonGraphics.prototype.setPosition=function (value) {
            return this.hierarchy=value;
        };
        PolygonGraphics.prototype.getCoords=function () {
            return this.coords;
        };
/*        PolygonGraphics.prototype.getBillbordPosition=function () {
            let pps= this.hierarchy._value;
            return [pps[0],pps[2]];
        };*/

    };

    initHandles(){
        let scene = this._scene;
        let _self = this;
        let handler =this.handler;
        function callPrimitiveCallback(name, position) {
            if(_self._handlersMuted == true) return;
            let pickedObject = scene.pick(position);
            if(pickedObject && pickedObject.id && pickedObject.id[name]) {
                pickedObject.id[name](position);
            }
           if(pickedObject && pickedObject.id &&pickedObject.id.polygon&& pickedObject.id.polygon[name]){
                  pickedObject.id.polygon[name](position);
           }
        }
        handler.setInputAction(
            function (movement) {
                callPrimitiveCallback('leftClick', movement.position);
            }, ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(
            function (movement) {
                callPrimitiveCallback('leftDoubleClick', movement.position);
            }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        let mouseOutObject;
        handler.setInputAction(
            function (movement) {
                if(_self._handlersMuted == true) return;
                let pickedObject = scene.pick(movement.endPosition);
                if(mouseOutObject && (!pickedObject ||mouseOutObject != pickedObject.id)) {
                    mouseOutObject.mouseOut(movement.endPosition);//!(mouseOutObject.isDestroyed && mouseOutObject.isDestroyed()) &&
                    mouseOutObject = null;
                }
                let pickObj=null;
                if(pickedObject && pickedObject.id) {
                    pickObj = pickedObject.id;
                }
                 if(pickedObject && pickedObject.id&&pickedObject.id.polygon) {
                     pickObj = pickedObject.id.polygon;
                 }
                if(pickObj&&pickObj.mouseOut) {
                    mouseOutObject = pickObj;
                }
                if(pickObj&&pickObj.mouseMove) {
                    pickObj.mouseMove(movement.endPosition);
                }
            }, ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction(
            function (movement) {
                callPrimitiveCallback('leftUp', movement.position);
            }, ScreenSpaceEventType.LEFT_UP);
        handler.setInputAction(
            function (movement) {
                callPrimitiveCallback('leftDown', movement.position);
            }, ScreenSpaceEventType.LEFT_DOWN);
    };

    enhancePrimitives(){
        let _self=this;
        let dragBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:8
        };

        function setEditMode(editMode) {
            // if no change
            if(this._editMode == editMode) {return;}

            // make sure all other shapes are not in edit mode before starting the editing of this shape
            _self.disableAllHighlights();
            // display markers
            if(editMode) {
                _self.setEdited(this);
                let scene = _self._scene;
                let that=this;
                let line=Turf.lineString(that.getCoords());
                let isColckWise=Turf.booleanClockwise(line);
                let posi=that.getPosition()
                let twoPositions=[posi[0],posi[2]];

                // create the markers and handlers for the editing
                if(this._markers == null) {
                    let markers = new BillboardGroup(_self, dragBillboard);
                    function onEdited() {
                        that.executeListeners({name: 'onEdited', positions: that.positions});
                    }

                    let handleMarkerChanges = {
                        dragHandlers: {
                            onDrag: function(index, position) {
                                let orginPositions=updatePoints(index, position);
                                that.setPosition(orginPositions);
                                store.commit('editedStation', true);
                            },
                            onDragEnd: function(index, position) {
                                store.commit('editedStation', true);
                                onEdited();
                            }
                        },
                        tooltip: function() {
                                return "左键移动节点";//"Double click to remove this point";
                        }
                    };
                    let preP=twoPositions[0],nextP=twoPositions[1];
                    function updatePoints(index,position) {
                        if(index===0){
                            preP=position;
                            nextP=markers.getBillboard(1).position._value;
                        }else{
                            preP=markers.getBillboard(0).position._value;
                            nextP=position;
                        }
                        let p1=_self.cartesianToDegrees(preP),p2=_self.cartesianToDegrees(nextP);
                        let orginPositions=[];
                        if (isColckWise) {
                            orginPositions.push(preP);
                            orginPositions.push(Cartesian3.fromDegrees(p2[0], p1[1]));
                            orginPositions.push(nextP);
                            orginPositions.push(Cartesian3.fromDegrees(p1[0], p2[1]));
                        }else {
                            orginPositions.push(preP);
                            orginPositions.push(Cartesian3.fromDegrees(p1[0], p2[1]));
                            orginPositions.push(nextP);
                            orginPositions.push(Cartesian3.fromDegrees(p2[0], p1[1]));
                        }
                        return orginPositions;
                    }
                    // add billboards and keep an ordered list of them for the polygon edges
                    markers.addBillboards(twoPositions,'',BillboardType.POINT, handleMarkerChanges);
                    this._markers = markers;

                    this._globeClickhandler = new ScreenSpaceEventHandler(scene.canvas);
                    this._globeClickhandler.setInputAction(
                        function (movement) {
                            let pickedObject = scene.pick(movement.position);
                            if(!((pickedObject && pickedObject.primitive)||(pickedObject&&pickedObject.id))) {
                                that.setEditMode(false);
                            }
                        }, ScreenSpaceEventType.LEFT_CLICK);
                }
                this._editMode = true;
            } else {
                if(this._markers != null) {
                    this._markers.remove();
                  //  this._editMarkers.remove();
                    this._markers = null;
                  //  this._editMarkers = null;
                    this._globeClickhandler.destroy();
                }
                this._editMode = false;
            }

        }

        PolygonGraphics.prototype.setEditable=function () {
            let polygon = this;
            polygon.asynchronous = false;
            _self.registerEditableShape(polygon);
            polygon.setEditMode = setEditMode;
            let originMaterial=this.material;
            polygon.setHighlighted = function(highlighted){
                // disable if already in edit mode
                if(polygon._editMode === true) {
                    return;
                }
                if(highlighted) {
                    _self.setHighlighted(polygon);
                    polygon.material=Color.DARKORANGE.withAlpha(0.5);
                } else {
                    polygon.material=originMaterial;
                }
            };
            enhanceWithListeners(polygon);
            polygon.setEditMode(false);
        };

    };

    registerEditableShape (surface) {
        let _self = this;
        setListener(surface, 'mouseMove', function(position) {
            surface.setHighlighted(true);
            if(!surface._editMode) {
                _self._tooltip.showAt(position,"单击开始编辑" );//"Click to edit this shape"
            }
        });
        // hide the highlighting when mouse is leaving the polygon
        setListener(surface, 'mouseOut', function(position) {
            surface.setHighlighted(false);
            _self._tooltip.setVisible(false);
        });
        setListener(surface, 'leftClick', function(position) {
            store.commit('editedStation', true);
            surface.setEditMode(true);
        });
    };

    disableAllHighlights(){
        this.setHighlighted(undefined);
    };

    setHighlighted(surface){
        if(this._highlightedSurface  && this._highlightedSurface != surface) {//&& !this._highlightedSurface.isDestroyed()
            this._highlightedSurface.setHighlighted(false);
        }
        this._highlightedSurface = surface;
    };

    setEdited (surface) {
        if(this._editedSurface ) {//&& !this._editedSurface.isDestroyed()
            this._editedSurface.setEditMode(false);
        }
        this._editedSurface = surface;
    };

    getCarterByWinPos(position){
        let ray=this.camera.getPickRay(position);
        return this._scene.globe.pick(ray,this._scene);
    };

    removeHandles(){
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
    };

    /**
     * 将世界坐标转换为经纬度坐标
     * @param cartesian         世界坐标点
     * @returns {*[]}           经纬度坐标点[lon,lat,height]
     */
    cartesianToDegrees(cartesian){
        let ellipsoid=this.viewer.scene.globe.ellipsoid;
        let cartographic=ellipsoid.cartesianToCartographic(cartesian);
        return [CesiumMath.toDegrees(cartographic.longitude),CesiumMath.toDegrees(cartographic.latitude),cartographic.height];
    };

}

export default EditNodeHelper;
