/* eslint-disable */
/**
 * Created by pengYX on 2018/8/27.
 */
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import PolylineGraphics from 'cesium/DataSources/PolylineGraphics';
import Color from 'cesium/Core/Color';
import EllipsoidGeodesic from 'cesium/Core/EllipsoidGeodesic';
import Cartographic from 'cesium/Core/Cartographic';
import CesiumMath from 'cesium/Core/Math';
import BillboardGroup from './primitive/BillborardGroupRoad';
import BillboardType from './primitive/BillboardType';
import SceneTransforms from 'cesium/Scene/SceneTransforms';
import VerticalOrigin from 'cesium/Scene/VerticalOrigin';
import HorizontalOrigin from 'cesium/Scene/HorizontalOrigin';


import {enhanceWithListeners,createTooltip,setListener} from './primitive/utilFunc';
import store from '../../../../store/index';
window.Turf = require('../../../../../static/thirdParty/turf');


class EditRoadHelper{
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
        this.removeHandles();
        function callPrimitiveCallback(name, position) {
            if(_self._handlersMuted == true) return;
            let pickedObject = scene.pick(position);
            if(pickedObject && pickedObject.id && pickedObject.id[name]) {
                pickedObject.id[name](position);
            }
            if(pickedObject && pickedObject.id &&pickedObject.id.polyline&& pickedObject.id.polyline[name]) {
                pickedObject.id.polyline[name](position);
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
                if(pickedObject && pickedObject.id&&pickedObject.id.polyline) {
                    pickObj = pickedObject.id.polyline;
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

        PolylineGraphics.prototype.getPropertyPositions=function () {
            return this.propertyPositions;
        };
        PolylineGraphics.prototype.modifyPropertyPosition=function (index,value) {
            this.propertyPositions[index][0]=value[0];
            this.propertyPositions[index][1]=value[1];
        };
        PolylineGraphics.prototype.addPropertyPosition=function (index,value) {
            this.propertyPositions.splice(index,0,value);
        };
        PolylineGraphics.prototype.removePropertyPosition=function (index) {
            this.propertyPositions.splice(index,1);
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

        /*Cesium.Entity.prototype.setEditable=function () {
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
                let handler = new Cesium.ScreenSpaceEventHandler(_self._scene.canvas);
                handler.setInputAction(function(movement) {
                    let cartesian = _self.getCarterByWinPos(movement.endPosition);//_self._scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                    if (cartesian) {
                        onDrag(cartesian);
                    } else {
                        onDragEnd(cartesian);
                    }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                handler.setInputAction(function(movement) {
                    let cartesian = _self.getCarterByWinPos(movement.position);//_self._scene.camera.pickEllipsoid(movement.position, ellipsoid)
                    onDragEnd(cartesian);
                }, Cesium.ScreenSpaceEventType.LEFT_UP);

                enableRotation(false);

            });

            enhanceWithListeners(billboard);
        };*/

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
                    let p1={x:0,y:0,z:0},p2={x:0,y:0,z:0},prePoint={x:0,y:0},nexPoint={x:0,y:0};
                    // function for updating the edit markers around a certain point
                    function updateHalfMarkers(index, positions,isLable) {
                        // update the half markers before and after the index
                        let editIndex = index - 1 < 0 ? positions.length - 1 : index - 1;
                        p1=calculateHalfMarkerPosition(editIndex);
                        p2=calculateHalfMarkerPosition(index);
                        prePoint=SceneTransforms.wgs84ToWindowCoordinates(_self._scene,p1);
                        nexPoint=SceneTransforms.wgs84ToWindowCoordinates(_self._scene,p2);

                        if(editIndex < editMarkers.countBillboards()) {
                            editMarkers.getBillboard(editIndex).position = p1;//calculateHalfMarkerPosition(editIndex);
                            if(that._isWithLable&&isLable){
                                editMarkers.getBillboard(editIndex).label.text=' i = '+getSlopeByPer(editIndex).toFixed(0)+'/100 ';
                                editMarkers.getBillboard(editIndex).label.horizontalOrigin=prePoint.x>nexPoint.x? HorizontalOrigin.LEFT:HorizontalOrigin.RIGHT;
                               // editMarkers.getBillboard(editIndex).label.verticalOrigin=VerticalOrigin.CENTER
                            }
                        }
                        editIndex = index;
                        if(editIndex < editMarkers.countBillboards()) {
                            editMarkers.getBillboard(editIndex).position = p2;//calculateHalfMarkerPosition(editIndex);
                            if(that._isWithLable&&isLable){
                                editMarkers.getBillboard(editIndex).label.text=' i = '+getSlopeByPer(editIndex).toFixed(0)+'/100 ';
                                editMarkers.getBillboard(editIndex).label.horizontalOrigin=prePoint.x>nexPoint.x? HorizontalOrigin.RIGHT:HorizontalOrigin.LEFT;
                            }
                        }
                    }

                    function getSlope(index) {
                        let points=that.getPropertyPositions();
                        let left=points[index];
                        let nexIn=index+1>points.length-1?0:index+1;
                        let right=points[nexIn];
                       // let radiu=Cesium.Cartesian3.angleBetween(Cesium.Cartesian3.fromDegrees(left[0],left[1],left[2]),Cesium.Cartesian3.fromDegrees(right[0],right[1],right[2]));
                        let dis=Turf.distance(Turf.point(left),Turf.point(right),{units:'kilometers'})*1000;
                        let h=right[2]-left[2];
                        return CesiumMath.toDegrees(Math.atan(h/dis));
                    }
                    function getSlopeByPer(index) {
                        let points=that.getPropertyPositions();
                        let left=points[index];
                        let nexIn=index+1>points.length-1?0:index+1;
                        let right=points[nexIn];
                        // let radiu=Cesium.Cartesian3.angleBetween(Cesium.Cartesian3.fromDegrees(left[0],left[1],left[2]),Cesium.Cartesian3.fromDegrees(right[0],right[1],right[2]));
                        let dis=Turf.distance(Turf.point(left),Turf.point(right),{units:'kilometers'})*1000;
                        let h=right[2]-left[2];
                        return Math.abs(h/dis*100);
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

                    function cartesianToDegree(cartesian) {
                        let ellipsoid=_self.viewer.scene.globe.ellipsoid;
                        let cartographic=ellipsoid.cartesianToCartographic(cartesian);
                        let height=_self.viewer.scene.globe.getHeight(cartographic);
                        return[CesiumMath.toDegrees(cartographic.longitude),CesiumMath.toDegrees(cartographic.latitude),height];
                    }

                    function onEdited() {
                        that.executeListeners({name: 'onEdited', positions: that.positions});
                    }
                    let handleMarkerChanges = {
                        dragHandlers: {
                            onDragStart:function () {

                            },
                            onDrag: function(index, position) {
                                orginPositions[index]= position;
                                that.setPosition(orginPositions);
                                let degrees=cartesianToDegree(position);
                                that.modifyPropertyPosition(index,degrees);

                                updateHalfMarkers(index, that.getPosition(),true);
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
                            that.removePropertyPosition(index);
                            markers.removeBillboard(index);
                            editMarkers.removeBillboard(index);
                            updateHalfMarkers(index, that.getPosition(),false);
                            onEdited();
                        },
                        tooltip: function() {
                            if(that.getPosition().length > 3) {
                                return "左键移动节点，双击删除节点";//"Double click to remove this point";
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
                                // add a new position to the polygon but not a new marker yet
                                this.index = index + 1;
                                orginPositions.splice(this.index, 0, position);
                                let degrees=cartesianToDegree(position);
                                that.addPropertyPosition(this.index,degrees);
                                that.setPosition(orginPositions) ;
                                //that.positions.splice(this.index, 0, position);
                            },
                            onDrag: function(index, position) {
                                orginPositions[this.index] = position;
                                let degrees=cartesianToDegree(position);
                                that.modifyPropertyPosition(this.index,degrees);
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
                            return "单击新增节点";//"Drag to create a new point";
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
           // _self.registerEditableShape(polyline);
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
               // return Cesium.Extent.fromCartographicArray(ellipsoid.cartesianArrayToCartographicArray(this.positions));
            };
            enhanceWithListeners(polyline);
            polyline.setEditMode(false);
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
            store.commit('editedRoad', true);
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

    registerDeleteShape(surface){
        let _self = this;
        setListener(surface.polyline, 'mouseMove', function(position) {
            surface.polyline.setHighlighted(true);
            _self._tooltip.showAt(position,"单击删除支线" );//"Click to edit this shape"
        });
        setListener(surface.polyline, 'mouseOut', function(position) {
            surface.polyline.setHighlighted(false);
            _self._tooltip.setVisible(false);
        });
        setListener(surface.polyline, 'leftClick', function(position) {
            store.commit('editedRoad', true);
            surface.executeListeners({name: 'onDeleted', entity: surface});//删除支线前端回调
        });
    };

    registerSplitShape(surface){
        let _self = this;
        setListener(surface.polyline, 'mouseMove', function(position) {
            surface.polyline.setHighlighted(true);
            _self._tooltip.showAt(position,"单击选中支线" );//"Click to edit this shape"
        });
        setListener(surface.polyline, 'mouseOut', function(position) {
            surface.polyline.setHighlighted(false);
            _self._tooltip.setVisible(false);
        });
        setListener(surface.polyline, 'leftClick', function(position) {
            surface.polyline.setSplitMode(true);
        });
    };

    setSplited(surface){
        if(this._splitedSurface ) {
            this._splitedSurface.setSplitMode(false);
        }
        this._splitedSurface = surface;
    };

    startDeleteRoadLine(entity){
        this.registerDeleteShape(entity);
    };

    startSplitRoadLine(entity){
        this.registerSplitShape(entity);
        entity.polyline.setSplitable();
    };

    stopSplitRoadLine(){
        if(this._splitedSurface) {
            this._splitedSurface.setSplitMode(false);
        }
    };

    enhanceSplitRoadLineEntity(){
        let _self=this;
        let dragBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:8
        };
        function setSplitMode(editMode){
            if(this._splitMode == editMode) {return;}
            _self.disableAllHighlights();
            if(editMode) {
                _self.setSplited(this);
                let scene = _self._scene;
                let that=this;
                let orginPositions=that.getPosition();
                if (this._markers == null) {
                    let markers = new BillboardGroup(_self, dragBillboard);
                    function onEdited(roadInfo) {
                        that.executeListeners({name: 'onEdited', roadInfo: roadInfo});
                    }
                    function updateRoadLine(index, position) {
                        that.setPosition(orginPositions.slice(0, index + 1));
                        that.propertyPositions.splice(index+1);
                        orginPositions=that.getPosition();
                        that._markers.removeBillboardFrom(index);
                    }
                    let handleMarkerChanges = {
                        onClick: function (index, position, billboard) {
                            let newRoadLineInfo=orginPositions.slice(index);
                            if(index>0&&newRoadLineInfo.length>=2){
                                onEdited({positions:newRoadLineInfo,roadInfo:that.roadInfo,coors:that.propertyPositions.slice(index)});//打断后，绘制从打断节点到最后的线
                                updateRoadLine(index, position);
                            }
                        },
                        tooltip: function () {
                            if (that.getPosition().length >= 3) {
                                return "单击节点打断支线";
                            }
                        }
                    };

                    markers.addBillboards(orginPositions,'',BillboardType.POINT,handleMarkerChanges);
                    this._markers = markers;

                    this._globeClickhandler = new ScreenSpaceEventHandler(scene.canvas);
                    this._globeClickhandler.setInputAction(
                        function (movement) {
                            let pickedObject = scene.pick(movement.position);
                            if (!((pickedObject && pickedObject.primitive) || (pickedObject && pickedObject.id))) {
                                that.setSplitMode(false);
                            }
                        }, ScreenSpaceEventType.LEFT_CLICK);
                }
                this._splitMode = true;
            }else {
                if(this._markers != null) {
                    this._markers.remove();
                    this._markers = null;
                    this._globeClickhandler.destroy();
                }
                this._splitMode = false;
            }

        }
        PolylineGraphics.prototype.setSplitable=function(){
            let polyline = this;
            polyline.asynchronous = false;
            if(this.setSplitMode) {
                return;
            }
            polyline.setSplitMode = setSplitMode;
            let originalWidth = this.width._value;
            polyline.setHighlighted = function(highlighted) {
                if(this._splitMode === true) {
                    return;
                }
                if(highlighted) {
                    _self.setHighlighted(this);
                    this.setWidth(originalWidth * 2);
                } else {
                    this.setWidth(originalWidth);
                }
            };
            polyline.getExtent = function() {};
            enhanceWithListeners(polyline);
            polyline.setSplitMode(false);
        };
    };

}

export default EditRoadHelper;
