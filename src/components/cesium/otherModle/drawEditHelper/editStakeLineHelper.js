/**
 * Created by pengYX on 2019/1/25.
 */
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import PolylineGraphics from 'cesium/DataSources/PolylineGraphics';
import CustomDataSource from 'cesium/DataSources/CustomDataSource';
import Color from 'cesium/Core/Color';
import defined from 'cesium/Core/defined';
import Cartesian3 from 'cesium/Core/Cartesian3';
import HeightReference from 'cesium/Scene/HeightReference';
import EllipsoidGeodesic from 'cesium/Core/EllipsoidGeodesic';
import Cartographic from 'cesium/Core/Cartographic';
import CesiumMath from 'cesium/Core/Math';
//import BillboardGroup from './primitive/BillborardGroup';
import BillboardGroup from './towerBillboardGroup';
import {enhanceWithListeners, createTooltip, setListener} from './primitive/utilFunc';
import store from '../../../../store/index';

window.Turf = require('../../../../../static/thirdParty/turf');

class EditStakeLineHelper {
    constructor(viewer,stakeLineEntities){
        this.viewer=viewer;
        this._scene=viewer.scene;
        this.camera=viewer.camera;
        this.handler=new ScreenSpaceEventHandler(viewer.scene.canvas);
        this._tooltip=new createTooltip(viewer.cesiumWidget.container);
        this.extentPolyLineGraphics();
        this.stakeLineEntities=stakeLineEntities;//存储桩位线路的entities
        this.stakePointDS=new CustomDataSource('stakePoints');//存储用于合并使用的桩位点
        this.viewer.dataSources.add(this.stakePointDS);
    }

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


    disableAllHighlights(){
        this.setHighlighted(undefined);
    };

    setHighlighted(surface) {
        if (this._highlightedSurface && this._highlightedSurface != surface) {//&& !this._highlightedSurface.isDestroyed()
            this._highlightedSurface.setHighlighted&&this._highlightedSurface.setHighlighted(false);
        }
        this._highlightedSurface = surface;
    };

    extentPolyLineGraphics(){
        let _self=this;
        PolylineGraphics.prototype.getPosition=function () {
            return this.positions._value;
        };
        PolylineGraphics.prototype.setPosition=function (value) {
            return this.positions=value;
        };
        PolylineGraphics.prototype.setWidth=function (value) {
            this.width=value;
        };
        PolylineGraphics.prototype.setMaterial=function (value) {
            this.material=value;
        };
        PolylineGraphics.prototype.setHighlighted=function (highlighted) {
            if(highlighted) {
                _self.setHighlighted(PolylineGraphics);
                this.setMaterial(Color.RED.withAlpha(0.7));
            } else {
                this.setMaterial(Color.HOTPINK.withAlpha(0.6));
            }
        };
    };

    setEdited (surface) {
        if(this._editedSurface ) {//&& !this._editedSurface.isDestroyed()
            this._editedSurface.setEditMode(false);
        }
        this._editedSurface = surface;
    };

    setCombined(surface){
        if(this._combinedSurface ) {//&& !this._editedSurface.isDestroyed()
            this._combinedSurface.setCombineMode(false);
        }
        this._combinedSurface = surface;
    };

    setSplited(surface){
        if(this._splitedSurface ) {
            this._splitedSurface.setSplitMode(false);
        }
        this._splitedSurface = surface;
    };

    removeHandles(){
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
    };

    /**
     * 注册删除支线鼠标移动到当前
     * @param surface
     */
    registerDeleteLineShape(surface) {
        let _self = this;
        this.disableAllHighlights();
        setListener(surface.polyline, 'mouseMove', function (position) {
            surface.polyline.setHighlighted(true);
            _self._tooltip.showAt(position, "单击删除支线");
        });
        setListener(surface.polyline, 'mouseOut', function (position) {
            surface.polyline.setHighlighted(false);
            _self._tooltip.setVisible(false);
        });
        setListener(surface.polyline, 'leftClick', function (position) {
            surface.executeListeners({name: 'onDeleted', entity: surface});//删除支线前端回调
        });
    };

    registerCombineLineShape(surface){
        let _self = this;
        this.disableAllHighlights();
        setListener(surface.polyline, 'mouseMove', function (position) {
            surface.polyline.setHighlighted(true);
            _self._tooltip.showAt(position, "单击选中支线");
        });
        setListener(surface.polyline, 'mouseOut', function (position) {
            surface.polyline.setHighlighted(false);
            _self._tooltip.setVisible(false);
        });
        setListener(surface.polyline, 'leftClick', function (position) {
            createStakeEntites();
            surface.polyline.setCombineMode(true);
            //store.commit('editedPower', true);
        });

        function createStakeEntites(){
            _self.stakesPoints=null;
            let pointsC=[],surveyPoint=null;
            _self.stakePointDS.entities.removeAll();
            _self.stakeLineEntities.values.forEach((entity) => {
                if (defined(entity.polyline)) {
                    if(surface.id!==entity.id){
                        entity.polyline.routeInfo.surveyData.forEach((surveyData)=>{
                            let stakeP=_self.drawStakePoint(surveyData);
                            surveyPoint=Turf.point([parseFloat(surveyData.stakeCoordinate.longitude), parseFloat(surveyData.stakeCoordinate.latitude),parseFloat(surveyData.stakeCoordinate.altitude)],{name: surveyData.stakeName,id:stakeP.id});
                            pointsC.push(surveyPoint);//存储关于计算最近点的点集合
                        });
                    }
                }
            });
            _self.stakesPoints=Turf.featureCollection(pointsC);
        }
    };

    registerSplitLineShape(surface){
        let _self = this;
        this.disableAllHighlights();
        setListener(surface.polyline, 'mouseMove', function (position) {
            surface.polyline.setHighlighted(true);
            _self._tooltip.showAt(position, "单击选中支线");
        });
        setListener(surface.polyline, 'mouseOut', function (position) {
            surface.polyline.setHighlighted(false);
            _self._tooltip.setVisible(false);
        });
        setListener(surface.polyline, 'leftClick', function (position) {
           // store.commit('editedPower', true);
            surface.polyline.setSplitMode(true);
        });
    };

    startDeleteStakeLine(entity){
        this. registerDeleteLineShape(entity);
    };

    startCombineStakeLine(entity){
        this. registerCombineLineShape(entity);
        entity.polyline.setCombineable();
    };

    stopCombineStakeLine(){
        this.stakePointDS.entities.removeAll();
        if(this._combinedSurface) {
            this._combinedSurface.setCombineMode(false);
        }
    };

    startSplitStakeLine(entity){
        this. registerSplitLineShape(entity);
        entity.polyline.setSplitable();
    };

    stopSplitStakeLine(){
        if(this._splitedSurface) {
            this._splitedSurface.setSplitMode(false);
        }
    };

    enhanceCombineStakeLineEntity(){
        let _self=this;
        let dragBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:8
        };
        function setCombineMode(editMode) {
            // if no change
            if(this._combineMode == editMode) {return;}
            // make sure all other shapes are not in edit mode before starting the editing of this shape
            _self.disableAllHighlights();
            // display markers
            if(editMode) {
                _self.setCombined(this);
                let scene = _self._scene;
                let ellipsoid=scene.globe.ellipsoid;
                let that=this;
                let orginPositions=that.getPosition();
                // create the markers and handlers for the editing
                if(this._markers == null) {
                    let point=null,bufferdPolygon=null;
                    let markers = new BillboardGroup(_self, dragBillboard);
                    function cartesianToDegree(cartesian) {
                        let ellipsoid=_self.viewer.scene.globe.ellipsoid;
                        let cartographic=ellipsoid.cartesianToCartographic(cartesian);
                        let height=_self.viewer.scene.globe.getHeight(cartographic);
                        return[CesiumMath.toDegrees(cartographic.longitude),CesiumMath.toDegrees(cartographic.latitude),height];
                    }

                    function onEdited() {
                        that.executeListeners({name: 'onEdited', positions: that.positions});
                    }

                    //移动过程中更新塔位信息
                    function updataTowers(index, position,billboard) {
                        if (defined(_self.combineStakeentity)) {
                             position=_self.combineStakeentity.position._value;
                            that.routeInfo.surveyData[index].stakeName=_self.combineStakeentity.name;
                            if(defined(billboard.label))billboard.label.text=_self.combineStakeentity.name;
                            _self.combineStakeentity.point.pixelSize=5;
                        }
                        billboard.position = position;
                        orginPositions[index]= position;
                        that.setPosition(orginPositions);
                        let coords=cartesianToDegree(position);
                        that.routeInfo.surveyData[index].stakeCoordinate.altitude=coords[2].toString();
                        that.routeInfo.surveyData[index].stakeCoordinate.latitude=coords[1].toString();
                        that.routeInfo.surveyData[index].stakeCoordinate.longitude=coords[0].toString();
                        _self.combineStakeentity=null;
                    }

                    function findNearestPoint(position) {
                        point=Turf.point(cartesianToDegree(position));
                        let near=Turf.nearestPoint(point, _self.stakesPoints);
                        let dis=Turf.distance(point, near);
                        if(defined(_self.combineStakeentity)){
                            _self.combineStakeentity.point.pixelSize=5;
                            _self.combineStakeentity=null;
                        }
                        if(dis*1000<=10){
                            _self.combineStakeentity=_self.stakePointDS.entities.getById(near.properties.id);
                            _self.combineStakeentity.point.pixelSize=10;
                        }
                    }

                    let handleMarkerChanges = {
                        dragHandlers: {
                            onDrag: function(index, position,billboard) {
                                billboard.position = position;
                                findNearestPoint(position);
                                orginPositions[index]= position;
                                that.setPosition(orginPositions);
                                store.commit('editedPower', true);
                            },
                            onDragEnd: function(index, position,billboard) {
                                updataTowers(index, position,billboard);//更新线路数组
                                //store.commit('editedPower', true);
                                onEdited();
                            }
                        },
                        tooltip: function() {
                            if(that.getPosition().length >= 3) {
                                return "左键拖动节点至待合并节点";
                            }
                        }
                    };
                    // add billboards and keep an ordered list of them for the polygon edges
                    markers.addStakes(that.routeInfo.surveyData, handleMarkerChanges);
                    this._markers = markers;

                    // add a handler for clicking in the globe
                    this._globeClickhandler = new ScreenSpaceEventHandler(scene.canvas);
                    this._globeClickhandler.setInputAction(
                        function (movement) {
                            let pickedObject = scene.pick(movement.position);
                            if(!((pickedObject && pickedObject.primitive)||(pickedObject&&pickedObject.id))) {
                                that.setCombineMode(false);
                            }
                        }, ScreenSpaceEventType.LEFT_CLICK);
                }
                this._combineMode = true;
            } else {
                if(this._markers != null) {
                    this._markers.remove();
                    this._markers = null;
                    this._globeClickhandler.destroy();
                }
                this._combineMode = false;
            }

        }
        PolylineGraphics.prototype.setCombineable=function () {
            let polyline = this;
            polyline.asynchronous = false;
            if(this.setCombineMode) {
                return;
            }
            polyline.setCombineMode = setCombineMode;
            let originalWidth = this.width._value;
            polyline.setHighlighted = function(highlighted) {
                if(this._combineMode === true) {
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
            polyline.setCombineMode(false);
        };
    };

    enhanceSplitStakeLineEntity(){
        let _self=this;
        let dragBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:8
        };
        function setSplitMode(editMode) {
            // if no change
            if(this._splitMode == editMode) {return;}
            // make sure all other shapes are not in edit mode before starting the editing of this shape
            _self.disableAllHighlights();
            // display markers
            if(editMode) {
                _self.setSplited(this);
                let scene = _self._scene;
                let ellipsoid=scene.globe.ellipsoid;
                let that=this;
                let orginPositions=that.getPosition();
                // create the markers and handlers for the editing
                if (this._markers == null) {
                    let markers = new BillboardGroup(_self, dragBillboard);
                    function onEdited(surveyData) {
                        that.executeListeners({name: 'onEdited', surveyData: surveyData});
                    }
                    function updateStakeLine(index, position) {
                        that.setPosition(orginPositions.slice(0, index + 1));
                        that._markers.removeBillboardFrom(index);
                        that.routeInfo.surveyData.splice(index+1);//that.routeInfo.surveyData=
                    }
                    let handleMarkerChanges = {
                        onClick: function (index, position, billboard) {
                            let newStakeLineInfo=that.routeInfo.surveyData.slice(index);
                            if(index>0&&newStakeLineInfo.length>=2){
                                onEdited(newStakeLineInfo);//打断后，绘制从打断节点到最后的线
                                updateStakeLine(index, position);
                            }
                        },
                        tooltip: function () {
                            if (that.getPosition().length >= 3) {
                                return "单击节点打断支线";
                            }
                        }
                    };
                    markers.addStakes(that.routeInfo.surveyData, handleMarkerChanges);
                    this._markers = markers;
                    // add a handler for clicking in the globe
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
            } else {
                if(this._markers != null) {
                    this._markers.remove();
                    this._markers = null;
                    this._globeClickhandler.destroy();
                }
                this._splitMode = false;
            }
        }

        PolylineGraphics.prototype.setSplitable=function () {
            let polyline = this;
            polyline.asynchronous = false;
           // _self.registerSplitLineShape(polyline);
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
            polyline.getExtent = function() {
                //return Cesium.Extent.fromCartographicArray(ellipsoid.cartesianArrayToCartographicArray(this.positions));
            };
            enhanceWithListeners(polyline);
            polyline.setSplitMode(false);
        };
    };

    drawStakePoint(surveyData){
         let entity=this.stakePointDS.entities.add({
            name:surveyData.stakeName,
            position:new Cartesian3.fromDegrees(parseFloat(surveyData.stakeCoordinate.longitude), parseFloat(surveyData.stakeCoordinate.latitude)),
            point:{
                color: new Color(0, 0.47, 0.76, 1.0),////(0.2, 0.78, 0.435, 1.0)
                outlineColor: new Color(1.0, 1.0, 1.0, 1.0),
                outlineWidth: 1,
                pixelSize: 5,
                disableDepthTestDistance:Number.POSITIVE_INFINITY,
                heightReference:HeightReference.CLAMP_TO_GROUND
            }
        });
         entity.surveyData=surveyData;
         return entity;
    };

}

export default EditStakeLineHelper;
