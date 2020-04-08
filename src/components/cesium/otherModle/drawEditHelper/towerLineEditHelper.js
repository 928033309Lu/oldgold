/* eslint-disable */
/**
 * Created by pengYX on 2018/8/27.
 */
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import PolylineGraphics from 'cesium/DataSources/PolylineGraphics';
import Color from 'cesium/Core/Color';
import Cartesian3 from 'cesium/Core/Cartesian3';
import EllipsoidGeodesic from 'cesium/Core/EllipsoidGeodesic';
import Cartographic from 'cesium/Core/Cartographic';
import CesiumMath from 'cesium/Core/Math';
import BillboardGroup from './towerBillboardGroup';
import BillboardType from './primitive/BillboardType';
import {enhanceWithListeners,createTooltip,setListener} from './primitive/utilFunc';
import store from '../../../../store';
window.Turf = require('../../../../../static/thirdParty/turf');

/**
 * 集电线路用编辑
 */
class TowerLineEditHelper{
    constructor(viewer){
        this.viewer=viewer;
        this._scene=viewer.scene;
        this.camera=viewer.camera;
        this.handler=new ScreenSpaceEventHandler(viewer.scene.canvas);
        this._tooltip=new createTooltip(viewer.cesiumWidget.container);
        this.enhanceGeoGraphics();
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

    startEditTower(){
        this.enhanceTowerPrimitives();
        this.initHandles();
    };

    startEditStake(){
        this.initHandles();
        this.enhanceStakePrimitives();
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
    };

    /**
     * 排塔后编辑逻辑
     */
    enhanceTowerPrimitives(){
        let _self=this;
        let dragBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:8
        };
        let dragHalfBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:4
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
                        }
                        editIndex = index;
                        if(editIndex < editMarkers.countBillboards()) {
                            editMarkers.getBillboard(editIndex).position = calculateHalfMarkerPosition(editIndex);
                        }
                    }

                    function cartesianToDegree(cartesian) {
                        let ellipsoid=_self.viewer.scene.globe.ellipsoid;
                        let cartographic=ellipsoid.cartesianToCartographic(cartesian);
                        let height=_self.viewer.scene.globe.getHeight(cartographic);
                        return[CesiumMath.toDegrees(cartographic.longitude),CesiumMath.toDegrees(cartographic.latitude),height];
                    }

                    function onEdited() {
                        store.commit('editedPower', true);
                        that.executeListeners({name: 'onEdited', positions: that.positions});
                    }

                    //移动过程中更新塔位信息
                    function updataTowers(index,position) {
                        let coords=cartesianToDegree(position);

                        let stakeCoord=that.routeInfo.towers[index].stakeCoords;
                        let rev=parseFloat(that.routeInfo.towers[index].offsetDist)>=0?1:-1;
                        let dis=Turf.distance(Turf.point([coords[0],coords[1]]),Turf.point([stakeCoord[0],stakeCoord[1]]),{units:'kilometers'})*1000;
                        that.routeInfo.towers[index].coords=coords;
                        that.routeInfo.towers[index].offsetDist=(dis*rev).toString();
                        that.routeInfo.towers[index].towerDist=(dis*rev+parseFloat(that.routeInfo.towers[index].stakeDist)).toString();
                       // that.routeInfo.towerData[index].offsetDist=(dis*rev).toString();
                    }

                    //添加塔位
                    function addDefalutTower(index,degresPoint,name) {
                        let preTower=that.routeInfo.towers[index-1];//获取其前一个塔位
                        let preCoord=preTower.coords;
                        let dis=Cartesian3.distance(Cartesian3.fromDegrees(preCoord[0],preCoord[1],preCoord[2]),Cartesian3.fromDegrees(degresPoint[0],degresPoint[1],degresPoint[2]));
                        let towerInfo={
                            "altitude" : degresPoint[2].toString(),
                            "angle" : "0.000000",
                            "attachMode" : "1",
                            "baseLower" : "0.000000",
                            "callHeight" : "12.000000",
                            "midstakeOffset" : "0.000000",
                            "name" :name,
                            "offsetDist" : (parseFloat(preTower.offsetDist)+dis).toString(),
                            "stakeName" : preTower.stakeName,
                            "type" : "35K-L1A2-J1",
                            "voltage" : "35kV",
                            "stakeDist":preTower.stakeDist,
                            "towerDist":(parseFloat(preTower.stakeDist)+parseFloat(preTower.offsetDist)+dis).toString(),
                            "stakeCoords":preTower.stakeCoords,
                            "coords":degresPoint,
                            "loopLineData":{
                                "jumper" :
                                    {
                                        "chuanModel" :
                                            {
                                                "leftUp" : "",
                                                "middle" : "",
                                                "rightDown" : ""
                                            }
                                    },
                                "towerName" : name,
                                "wire" :
                                    {
                                        "chuanModel" :
                                            {
                                                "leftBack" : "03M11NLL-00-07PZ1A",
                                                "leftFore" : "03M11NLL-00-07PZ1A",
                                                "middleBack" : "03M11NLL-00-07PZ1A",
                                                "middleFore" : "03M11NLL-00-07PZ1A",
                                                "rightBack" : "03M11NLL-00-07PZ1A",
                                                "rightFore" : "03M11NLL-00-07PZ1A"
                                            },
                                        "kValue":"0.000282",
                                        "lineModelBig" : "JKLYJ-120",
                                        "meteorName" : "单一气象",
                                        "newLineValue" : "0.950000",
                                        "safeValue" : "2.500000",
                                        "splitValue" : "1",
                                        "voltageGrade" : "35kV"
                                    }
                            },
                        };
                        that.routeInfo.towers.splice(index,0,towerInfo);
                        that.routeInfo.loopLine[0].data.push({
                            "jumper" :
                                {
                                    "chuanModel" :
                                        {
                                            "leftUp" : "",
                                            "middle" : "",
                                            "rightDown" : ""
                                        }
                                },
                            "towerName" : name,
                            "wire" :
                                {
                                    "chuanModel" :
                                        {
                                            "leftBack" : "03M11NLL-00-07PZ1A",
                                            "leftFore" : "03M11NLL-00-07PZ1A",
                                            "middleBack" : "03M11NLL-00-07PZ1A",
                                            "middleFore" : "03M11NLL-00-07PZ1A",
                                            "rightBack" : "03M11NLL-00-07PZ1A",
                                            "rightFore" : "03M11NLL-00-07PZ1A"
                                        },
                                    "kValue":"0.000282",
                                    "lineModelBig" : "JKLYJ-120",
                                    "meteorName" : "单一气象",
                                    "newLineValue" : "0.950000",
                                    "safeValue" : "2.500000",
                                    "splitValue" : "1",
                                    "voltageGrade" : "35kV"
                                }
                        });
                    }

                    //删除塔位更新

                    function deleteTower(index) {
                        that.routeInfo.towers.splice(index,1);
                        //that.routeInfo.towerData.splice(index,1);
                    }

                    let handleMarkerChanges = {
                        dragHandlers: {
                            onDrag: function(index, position,billboard) {
                                let line = Turf.lineString([cartesianToDegree(orginPositions[index-1]),cartesianToDegree(orginPositions[index+1])]);
                                let pt = Turf.point(cartesianToDegree(position));

                                let isOnLine = Turf.booleanPointOnLine(pt, line);
                                if(!isOnLine){//点不在线上，则获取最近的线上的点
                                    let snapped = Turf.nearestPointOnLine(line, pt, {units: 'degrees'});
                                    let height=_self.viewer.scene.globe.getHeight(Cartographic.fromDegrees(snapped.geometry.coordinates[0], snapped.geometry.coordinates[1]) );
                                    position=Cartesian3.fromDegrees(snapped.geometry.coordinates[0], snapped.geometry.coordinates[1], height,_self.viewer.scene.globe.ellipsoid)
                                }
                                billboard.position = position;
                                orginPositions[index]= position;
                                that.setPosition(orginPositions);
                                updateHalfMarkers(index, that.getPosition());
                                store.commit('editedPower', true);
                            },
                            onDragEnd: function(index, position,billboard) {
                                let line = Turf.lineString([cartesianToDegree(orginPositions[index-1]),cartesianToDegree(orginPositions[index+1])]);
                                let pt = Turf.point(cartesianToDegree(position));

                                let isOnLine = Turf.booleanPointOnLine(pt, line);
                                if(!isOnLine){//点不在线上，则获取最近的线上的点
                                    let snapped = Turf.nearestPointOnLine(line, pt, {units: 'degrees'});
                                    let height=_self.viewer.scene.globe.getHeight(Cartographic.fromDegrees(snapped.geometry.coordinates[0], snapped.geometry.coordinates[1]) );
                                    position=Cartesian3.fromDegrees(snapped.geometry.coordinates[0], snapped.geometry.coordinates[1], height,_self.viewer.scene.globe.ellipsoid)
                                }
                                billboard.position = position;
                                updataTowers(index, position);//更新线路数组
                                onEdited();
                            }
                        },
                        onDoubleClick: function(index) {
                            if(that.getPosition().length < 3) {
                                return;
                            }
                            // remove the point and the corresponding markers
                            orginPositions.splice(index, 1);
                            that.setPosition(orginPositions);
                            markers.removeBillboard(index);
                            editMarkers.removeBillboard(index);
                            updateHalfMarkers(index, that.getPosition());
                            deleteTower(index);//更新线路数组
                            onEdited();
                        },
                        tooltip: function() {
                            if(that.getPosition().length >= 3) {
                                return "左键移动节点，双击删除节点";//"Double click to remove this point";
                            }
                        }
                    };
                    // add billboards and keep an ordered list of them for the polygon edges
                    markers.addLineTowers(that.routeInfo.towers, handleMarkerChanges);

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
                    let index = 0,addcount=0;
                    let length = orginPositions.length + (this.isPolygon ? 0 : -1);
                    for(; index < length; index++) {
                        halfPositions.push(calculateHalfMarkerPosition(index));
                    }

                    let handleEditMarkerChanges = {
                        dragHandlers: {
                            onDragStart: function(index, position,billboard) {
                                // add a new position to the polygon but not a new marker yet

                                this.index = index + 1;
                                let line = Turf.lineString([cartesianToDegree(orginPositions[index]),cartesianToDegree(orginPositions[index+1])]);
                                let pt = Turf.point(cartesianToDegree(position));

                                let isOnLine = Turf.booleanPointOnLine(pt, line);
                                if(!isOnLine){//点不在线上，则获取最近的线上的点
                                    let snapped = Turf.nearestPointOnLine(line, pt, {units: 'degrees'});
                                    let height=_self.viewer.scene.globe.getHeight(Cartographic.fromDegrees(snapped.geometry.coordinates[0], snapped.geometry.coordinates[1]) );
                                    position=Cartesian3.fromDegrees(snapped.geometry.coordinates[0], snapped.geometry.coordinates[1], height,_self.viewer.scene.globe.ellipsoid)
                                }

                                billboard.position = position;
                                orginPositions.splice(this.index, 0, position);
                                that.setPosition(orginPositions) ;
                                store.commit('editedPower', true);
                            },
                            onDrag: function(index, position,billboard) {
                                let line = Turf.lineString([cartesianToDegree(orginPositions[index]),cartesianToDegree(orginPositions[index+1])]);
                                let pt = Turf.point(cartesianToDegree(position));

                                let isOnLine = Turf.booleanPointOnLine(pt, line);
                                if(!isOnLine){//点不在线上，则获取最近的线上的点
                                    let snapped = Turf.nearestPointOnLine(line, pt, {units: 'degrees'});
                                    let height=_self.viewer.scene.globe.getHeight(Cartographic.fromDegrees(snapped.geometry.coordinates[0], snapped.geometry.coordinates[1]) );
                                    position=Cartesian3.fromDegrees(snapped.geometry.coordinates[0], snapped.geometry.coordinates[1], height,_self.viewer.scene.globe.ellipsoid)
                                }
                                billboard.position = position;
                                orginPositions[this.index] = position;
                                that.setPosition(orginPositions) ;
                                store.commit('editedPower', true);
                            },
                            onDragEnd: function(index, position,billboard) {
                                let line = Turf.lineString([cartesianToDegree(orginPositions[index]),cartesianToDegree(orginPositions[index+1])]);
                                let pt = Turf.point(cartesianToDegree(position));

                                let isOnLine = Turf.booleanPointOnLine(pt, line);
                                if(!isOnLine){//点不在线上，则获取最近的线上的点
                                    let snapped = Turf.nearestPointOnLine(line, pt, {units: 'degrees'});
                                    let height=_self.viewer.scene.globe.getHeight(Cartographic.fromDegrees(snapped.geometry.coordinates[0], snapped.geometry.coordinates[1]) );
                                    position=Cartesian3.fromDegrees(snapped.geometry.coordinates[0], snapped.geometry.coordinates[1], height,_self.viewer.scene.globe.ellipsoid)
                                }
                                billboard.position = position;
                                addcount++;
                                // create new sets of makers for editing
                                let degress=cartesianToDegree(position);
                                markers.insertLineTower(this.index,{name:'ADD'+addcount,coords:degress,attachMode:"1"}, handleMarkerChanges);
                               addDefalutTower(this.index,degress,'ADD'+addcount);//将添加的塔位添加到线路列表中
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

        PolylineGraphics.prototype.setEditable=function () {
            let polyline = this;
            polyline.asynchronous = false;
            _self.registerEditableShape(polyline);
            if(this.setEditMode) {
                return;
            }

            polyline.setEditMode = setEditMode;
            let originalWidth = this.width._value;
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

    };

    /**
     * 自动选线后编辑逻辑
     */
    enhanceStakePrimitives(){
        let _self=this;
      /*  let dragBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            image:'static/stakeSolid.png',
            pixelSize:1
        };
        let dragHalfBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            image:'static/stakeDot.png',
            pixelSize:0.6
        };*/
        let dragBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:8
        };
        let dragHalfBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:4
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
                        }
                        editIndex = index;
                        if(editIndex < editMarkers.countBillboards()) {
                            editMarkers.getBillboard(editIndex).position = calculateHalfMarkerPosition(editIndex);
                        }
                    }

                    function cartesianToDegree(cartesian) {
                        let ellipsoid=_self.viewer.scene.globe.ellipsoid;
                        let cartographic=ellipsoid.cartesianToCartographic(cartesian);
                        let height=_self.viewer.scene.globe.getHeight(cartographic);
                        return[CesiumMath.toDegrees(cartographic.longitude),CesiumMath.toDegrees(cartographic.latitude),height];
                    }

                    function onEdited() {
                        store.commit('editedPower', true);
                        that.executeListeners({name: 'onEdited', positions: that.positions});
                    }

                    //移动过程中更新桩位信息
                    function updataStakes(index,position) {
                        let coords=cartesianToDegree(position);
                        that.routeInfo.surveyData[index].stakeCoordinate.altitude=coords[2].toString();
                        that.routeInfo.surveyData[index].stakeCoordinate.latitude=coords[1].toString();
                        that.routeInfo.surveyData[index].stakeCoordinate.longitude=coords[0].toString();
                    }

                    //添加桩位
                    function addDefalutStake(index,degresPoint,name) {
                        let  datas=that.routeInfo.surveyData;
                        let point1=Turf.point([parseFloat(datas[index-1].stakeCoordinate.longitude),parseFloat(datas[index-1].stakeCoordinate.latitude)]);
                        let point2=Turf.point([parseFloat(datas[index].stakeCoordinate.longitude),parseFloat(datas[index].stakeCoordinate.latitude)]);
                        let dis= Turf.distance(point1,point2,{units:'kilometers'})*1000+parseFloat(datas[index-1].stakeDist);
                        let defaultStake={
                            "offsetAngle" : "0.000000",
                            "stakeCoordinate" :
                                {
                                    "altitude" : degresPoint[2].toString(),
                                    "latitude" : degresPoint[1].toString(),
                                    "longitude":degresPoint[0].toString()
                                },
                            "stakeDist" : dis.toString(),
                            "stakeName" : name
                        };
                        that.routeInfo.surveyData.splice(index,0,defaultStake);
                        return defaultStake;
                    }

                    //删除桩位更新
                    function deleteStake(index) {
                        that.routeInfo.surveyData.splice(index,1);
                    }

                    let handleMarkerChanges = {
                        dragHandlers: {
                            onDrag: function(index, position) {
                                orginPositions[index]= position;
                                that.setPosition(orginPositions);
                                updateHalfMarkers(index, that.getPosition());
                                store.commit('editedPower', true);
                            },
                            onDragEnd: function(index, position) {
                                updataStakes(index, position);//更新线路数组
                                onEdited();
                            }
                        },
                        onDoubleClick: function(index) {
                            if(that.getPosition().length < 3) {
                                return;
                            }
                            // remove the point and the corresponding markers
                            orginPositions.splice(index, 1);
                            that.setPosition(orginPositions);
                            markers.removeBillboard(index);
                            editMarkers.removeBillboard(index);
                            updateHalfMarkers(index, that.getPosition());
                            deleteStake(index);//更新线路数组
                            onEdited();
                        },
                        tooltip: function() {
                            if(that.getPosition().length >= 3) {
                                return "左键移动节点，双击删除节点";//"Double click to remove this point";
                            }
                        }
                    };
                    // add billboards and keep an ordered list of them for the polygon edges
                    markers.addStakes(that.routeInfo.surveyData, handleMarkerChanges);

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
                    let length = orginPositions.length + (this.isPolygon ? 0 : -1);
                    for(; index < length; index++) {
                        halfPositions.push(calculateHalfMarkerPosition(index));
                    }

                    let handleEditMarkerChanges = {
                        dragHandlers: {
                            onDragStart: function(index, position) {
                                // add a new position to the polygon but not a new marker yet
                                this.index = index + 1;
                                orginPositions.splice(this.index, 0, position);
                                that.setPosition(orginPositions) ;
                                store.commit('editedPower', true);
                            },
                            onDrag: function(index, position) {
                                store.commit('editedPower', true);
                                orginPositions[this.index] = position;
                                that.setPosition(orginPositions) ;
                            },
                            onDragEnd: function(index, position) {
                                // create new sets of makers for editing
                                let degress=cartesianToDegree(position);
                                let stakeName='A'+Math.floor(Math.random () * 900);//(that.routeInfo.surveyData.length);
                                let stakeInfo=addDefalutStake(this.index,degress,stakeName);//将添加的塔位添加到线路列表中
                                markers.insertStake(this.index,stakeInfo, handleMarkerChanges);
                                editMarkers.getBillboard(this.index - 1).position = calculateHalfMarkerPosition(this.index - 1);
                                editMarkers.insertBillboard(this.index, calculateHalfMarkerPosition(this.index),'',BillboardType.POINTWITHLABEL, handleEditMarkerChanges);
                                onEdited();
                            }
                        },
                        tooltip: function() {
                            return "单击新增节点";//"Drag to create a new point";
                        }
                    };

                    editMarkers.addBillboards(halfPositions,'',BillboardType.POINTWITHLABEL, handleEditMarkerChanges);//BILLBOARDWITHLABLE
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
                    this._editMarkers&&this._editMarkers.remove();
                    this._markers = null;
                    this._editMarkers = null;
                    this._globeClickhandler.destroy();
                }
                this._editMode = false;
            }

        }

        PolylineGraphics.prototype.setEditable=function () {
            if(this.setEditMode) {
                return;
            }
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

    };

    /**
     * 编辑用选择支线
     * @param surface
     */
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
            //store.commit('editedPower', true);
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

    cartesianToDegree(position){
        let ellipsoid=this.viewer.scene.globe.ellipsoid;
        let cartographic=ellipsoid.cartesianToCartographic(position);
        let lat=CesiumMath.toDegrees(cartographic.latitude);
        let lng=CesiumMath.toDegrees(cartographic.longitude);
        let alt=cartographic.height;
        return [lat,lng];
    };

    removeHandles(){
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
    };

}

export default TowerLineEditHelper;
