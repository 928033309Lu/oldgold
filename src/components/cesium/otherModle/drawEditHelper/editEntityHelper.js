/* eslint-disable */
/**
 * Created by pengYX on 2018/8/27.
 */

import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import PolylineGraphics from 'cesium/DataSources/PolylineGraphics';
import Entity from 'cesium/DataSources/Entity';
import Color from 'cesium/Core/Color';
import PolygonGraphics from 'cesium/DataSources/PolygonGraphics';
import EllipsoidGeodesic from 'cesium/Core/EllipsoidGeodesic';
import Cartographic from 'cesium/Core/Cartographic';

import BillboardGroup from './primitive/BillborardGroup';
import BillboardType from './primitive/BillboardType';
import {enhanceWithListeners,createTooltip,setListener} from './primitive/utilFunc';


class EditEntityHelper{
    constructor(viewer){
        this.viewer=viewer;
        this._scene=viewer.scene;
        this.camera=viewer.camera;
        this.handler=new ScreenSpaceEventHandler(viewer.scene.canvas);
        this._tooltip=new createTooltip(viewer.cesiumWidget.container);
        this.initHandles();
        this.enhanceGeoGraphics();
        this.enhancePrimitives();
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
            if(pickedObject && pickedObject.id &&pickedObject.id.polyline&& pickedObject.id.polyline[name]) {
                pickedObject.id.polyline[name](position);
            }
          /*  if(pickedObject && pickedObject.id &&pickedObject.id.polygon&& pickedObject.id.polygon[name]){
                pickedObject.id.polygon[name](position);
            }*/
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
                if(pickedObject && pickedObject.id&&pickedObject.id.polyline) {
                    pickObj = pickedObject.id.polyline;
                }
               /* if(pickedObject && pickedObject.id&&pickedObject.id.polygon) {
                    pickObj = pickedObject.id.polygon;
                }*/
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

    removeHandles(){
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
    };

    /**
     * 扩展PolylineGraphics和PolygonGraphics的prototype属性
     */
    enhanceGeoGraphics(){
        PolylineGraphics.prototype.getPosition=function () {
            return this.positions._value;
        };
        PolylineGraphics.prototype.setPosition=function (value) {
            return this.positions=value;
        };
        PolylineGraphics.prototype.setWidth=function (value) {
            this.width=value;
        };

        PolygonGraphics.prototype.getPosition=function () {
            return this.hierarchy._value;
        };
        PolygonGraphics.prototype.setPosition=function (value) {
            return this.hierarchy=value;
        };
    };

    enhancePrimitives(){
        let _self=this;
        let dragBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:8
        };
        let dragHalfBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:4
        };

        Entity.prototype.setEditable=function () {
            if(this._editable) {
                return;
            }
            this._editable = true;
            let billboard = this;
            function enableRotation(enable) {
                _self._scene.screenSpaceCameraController.enableRotate = enable;
            }

            setListener(billboard, 'leftDown', function(position) {
                // TODO - start the drag handlers here
                // create handlers for mouseOut and leftUp for the billboard and a mouseMove
                function onDrag(position) {
                    billboard.position = position;
                    billboard.executeListeners({name: 'drag', positions: position});
                }
                function onDragEnd(position) {
                    handler.destroy();
                    enableRotation(true);
                    billboard.executeListeners({name: 'dragEnd', positions: position});
                }
                let handler = new ScreenSpaceEventHandler(_self._scene.canvas);
                handler.setInputAction(function(movement) {
                    let cartesian = _self.getCarterByWinPos(movement.endPosition);//_self._scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                    if (cartesian) {
                        onDrag(cartesian);
                    } else {
                        onDragEnd(cartesian);
                    }
                }, ScreenSpaceEventType.MOUSE_MOVE);

                handler.setInputAction(function(movement) {
                    let cartesian = _self.getCarterByWinPos(movement.position);//_self._scene.camera.pickEllipsoid(movement.position, ellipsoid)
                    onDragEnd(cartesian);
                }, ScreenSpaceEventType.LEFT_UP);

                enableRotation(false);

            });

            enhanceWithListeners(billboard);
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
                let ellipsoid=scene.globe.ellipsoid;
                let that=this;
                let orginPositions=that.getPosition();
                // create the markers and handlers for the editing
                if(this._markers == null) {
                    let markers = new BillboardGroup(_self, dragBillboard);
                    let editMarkers = new BillboardGroup(_self, dragHalfBillboard);
                    // function for updating the edit markers around a certain point
                    function updateHalfMarkers(index, positions) {
                        // update the half markers before and after the index
                        let editIndex = index - 1 < 0 ? positions.length - 1 : index - 1;
                        if(editIndex < editMarkers.countBillboards()) {
                            editMarkers.getBillboard(editIndex).position = calculateHalfMarkerPosition(editIndex);
                            if(that._isWithLable){
                                editMarkers.getBillboard(editIndex).label.text='sss';
                            }

                        }
                        editIndex = index;
                        if(editIndex < editMarkers.countBillboards()) {
                            editMarkers.getBillboard(editIndex).position = calculateHalfMarkerPosition(editIndex);
                            if(that._isWithLable){
                                editMarkers.getBillboard(editIndex).label.text='bbb';
                            }
                        }
                    }

                    function clearHalfMarkersLableInfo(index, positions) {
                        let editIndex = index - 1 < 0 ? positions.length - 1 : index - 1;
                        if(editIndex < editMarkers.countBillboards()) {
                            editMarkers.getBillboard(editIndex).label.text='';
                        }
                        editIndex = index;
                        if(editIndex < editMarkers.countBillboards()) {
                            editMarkers.getBillboard(editIndex).label.text='';
                        }
                    }

                    function onEdited() {
                        that.executeListeners({name: 'onEdited', positions: that.positions});
                    }
                    let handleMarkerChanges = {
                        dragHandlers: {
                            onDrag: function(index, position) {
                                orginPositions[index]= position;
                                that.setPosition(orginPositions);
                                updateHalfMarkers(index, that.getPosition());
                            },
                            onDragEnd: function(index, position) {
                                onEdited();
                                if(that._isWithLable){
                                    clearHalfMarkersLableInfo(index, position);
                                }

                            }
                        },
                        onDoubleClick: function(index) {
                            if(that.getPosition().length < 4) {
                                return;
                            }
                            // remove the point and the corresponding markers
                            orginPositions.splice(index, 1);
                            that.setPosition(orginPositions);
                            markers.removeBillboard(index);
                            editMarkers.removeBillboard(index);
                            updateHalfMarkers(index, that.getPosition());
                            onEdited();
                        },
                        tooltip: function() {
                            if(that.getPosition().length > 3) {
                                return "双击删除节点，按下左键拖动移动节点";//"Double click to remove this point";
                            }
                        }
                    };
                    // add billboards and keep an ordered list of them for the polygon edges
                    markers.addBillboards(that.getPosition(),'',BillboardType.POINT, handleMarkerChanges);
                    this._markers = markers;
                    function calculateHalfMarkerPosition(index) {
                        let positions = that.getPosition();
                        let cartog= new EllipsoidGeodesic(ellipsoid.cartesianToCartographic(positions[index]),
                            ellipsoid.cartesianToCartographic(positions[index < positions.length - 1 ? index + 1 : 0])).
                        interpolateUsingFraction(0.5);
                        let height=_self._scene.globe.getHeight(cartog);
                        return ellipsoid.cartographicToCartesian(new Cartographic(cartog.longitude, cartog.latitude, height));
                    }
                    let halfPositions = [];
                    let index = 0;
                    let length = that.getPosition().length + (this.isPolygon ? 0 : -1);
                    for(; index < length; index++) {
                        halfPositions.push(calculateHalfMarkerPosition(index));
                    }
                    let handleEditMarkerChanges = {
                        dragHandlers: {
                            onDragStart: function(index, position) {
                                console.log('start');
                                // add a new position to the polygon but not a new marker yet
                                this.index = index + 1;
                                orginPositions.splice(this.index, 0, position);
                                that.setPosition(orginPositions) ;
                                //that.positions.splice(this.index, 0, position);
                            },
                            onDrag: function(index, position) {
                                orginPositions[this.index] = position;
                                that.setPosition(orginPositions) ;
                            },
                            onDragEnd: function(index, position) {
                                // create new sets of makers for editing
                                markers.insertBillboard(this.index, position,'',BillboardType.POINTWITHLABEL, handleMarkerChanges);
                                editMarkers.getBillboard(this.index - 1).position = calculateHalfMarkerPosition(this.index - 1);
                                editMarkers.insertBillboard(this.index, calculateHalfMarkerPosition(this.index),'',BillboardType.POINTWITHLABEL, handleEditMarkerChanges);
                                onEdited();
                            }
                        },
                        tooltip: function() {
                            return "拖动增加新节点";//"Drag to create a new point";
                        }
                    };
                    editMarkers.addBillboards(halfPositions,'',BillboardType.POINTWITHLABEL, handleEditMarkerChanges);
                    this._editMarkers = editMarkers;
                    // add a handler for clicking in the globe
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
                    this._editMarkers.remove();
                    this._markers = null;
                    this._editMarkers = null;
                    this._globeClickhandler.destroy();
                }
                this._editMode = false;
            }

        }

        PolylineGraphics.prototype.setEditable=function (isWithLable) {
            if(this.setEditMode) {
                return;
            }
            this._isWithLable=isWithLable;
            let polyline = this;
            polyline.asynchronous = false;
            _self.registerEditableShape(polyline);
            polyline.setEditMode = setEditMode;
            let originalWidth = this.width;
            polyline.setHighlighted = function(highlighted) {
                if(this._editMode === true) {
                    return;
                }
                if(highlighted) {
                    _self.setHighlighted(this);
                    this.setWidth(originalWidth * 2);
                } else {
                    this.setWidth(originalWidth);
                }
            };
            polyline.getExtent = function() {
                //return Cesium.Extent.fromCartographicArray(ellipsoid.cartesianArrayToCartographicArray(this.positions));
            };
            enhanceWithListeners(polyline);
            polyline.setEditMode(false);
        };

        PolygonGraphics.prototype.setEditable=function () {
            let polygon = this;
            polygon.asynchronous = false;
            _self.registerEditableShape(polygon);
            polygon.setEditMode = setEditMode;
            let originMaterial=this.material;
            polygon.setHighlighted = function(highlighted){
                // disable if already in edit mode
                if(this._editMode === true) {
                    return;
                }
                if(highlighted) {
                    _self.setHighlighted(this);
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

}

export default EditEntityHelper;
