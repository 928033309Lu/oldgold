/* eslint-disable */
/**
 * Created by pengYX on 2018/9/17.
 */
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import PolylineGraphics from 'cesium/DataSources/PolylineGraphics';
import Color from 'cesium/Core/Color';
import Entity from 'cesium/DataSources/Entity';

import BillboardGroup from './towerBillboardGroup';
import {enhanceWithListeners,createTooltip,setListener} from './primitive/utilFunc';

import store from "../../../../store";

/**
 * 集电线路用更换塔型
 */
class TowerLineChangeTypeHelper{
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
            if(!pickedObject&&name==='leftDown'){
                store.commit('changeTowerType', {
                    towerInfo:null,      //塔信息
                    isShow:false,
                    winPos: position                     //屏幕坐标{x:441,y:521}
                });
            }
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

    /**
     * 开启塔型编辑
     */
    startChangeTower() {
        this.initHandles();
        this.enhanceTowerChangePrimitives();
    };

    /***
     * 保存设置塔型后修改的绝缘子信息
     * @param towerInfo
     * {
     *      type:'',
     *      callHeight:'',
     *      chuanModel:{
     *          leftBack: '',
     *          leftFore: '',
     *          middleBack:	'',
     *          middleFore:	'',
     *          rightBack: '',
     *          rightFore:'',
     *      }
     * }
     */
    saveTowerChangeType(towerInfo){
       let towerBillBoard=this.changeTower,towerLineInfo=this.changeTowerLine;
       for(let i=0;i<towerLineInfo.routeInfo.towers.length;i++){
           let tower=towerLineInfo.routeInfo.towers[i];
           if(tower.name===towerBillBoard.towerInfo.name){
               if(towerLineInfo.routeInfo.towers[i].loopLineData&&towerLineInfo.routeInfo.towers[i].loopLineData.jumper&&towerLineInfo.routeInfo.towers[i].loopLineData.chuanModel){
                   towerLineInfo.routeInfo.towers[i].loopLineData.jumper.chuanModel=towerInfo.chuanModel;
               }
               towerLineInfo.routeInfo.towers[i].callHeight=towerInfo.callHeight;
               towerLineInfo.routeInfo.towers[i].type=towerInfo.type;
               towerLineInfo.routeInfo.towerData[i].callHeight=towerInfo.callHeight;
               towerLineInfo.routeInfo.towerData[i].type=towerInfo.type;
               break;
           }
       }
       store.commit('editedPower', true);
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

        Entity.prototype.setPixsize=function (value) {
            this.point.pixelSize=value;
        };
    };

    /**
     * 更换塔型的编辑逻辑
     */
    enhanceTowerChangePrimitives(){
        let _self=this;
        let dragBillboard = {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:8
        };

        function setChangeMode(changeMode) {
            if(this._changeMode == changeMode) {return;}
            _self.disableAllHighlights();
            if(changeMode) {
                _self.setChanged(this);
                let scene = _self._scene;
                let that=this;
                if(this._markers == null) {
                    let markers = new BillboardGroup(_self, dragBillboard);
                    markers.addLineTowers(that.routeInfo.towers);
                    markers._billboards.values.forEach((bill)=>{
                        bill.setChangeType();
                    });
                    this._markers = markers;
                    this._globeClickhandler = new ScreenSpaceEventHandler(scene.canvas);
                    this._globeClickhandler.setInputAction(
                        function (movement) {
                            let pickedObject = scene.pick(movement.position);
                            if(!((pickedObject && pickedObject.primitive)||(pickedObject&&pickedObject.id))) {
                                that.setChangeMode(false);
                                _self.changeTowerLine=null;
                            }
                        }, ScreenSpaceEventType.LEFT_CLICK);
                }
                this._changeMode = true;
            } else {
                if(this._markers != null) {
                    this._markers.remove();
                    this._markers = null;
                    this._globeClickhandler.destroy();
                }
                this._changeMode = false;
            }
        }

        Entity.prototype.setChangeType=function () {
            if(this._editable) {
                return;
            }
            this._editable = true;
            let billboard = this;
            function enableRotation(enable) {
                _self._scene.screenSpaceCameraController.enableRotate = enable;
            }
            let originalPixSize = this.point.pixelSize._value;
            billboard.setHighlighted = function(highlighted) {
                if(highlighted) {
                    _self.setHighlighted(this);
                    this.setPixsize(originalPixSize * 1.5);
                } else {
                    this.setPixsize(originalPixSize);
                }
            };

            _self.registerTowerShape(billboard,'单击更换塔型');

            setListener(billboard, 'leftDown', function(position) {
                function onChangeType(position) {
                    _self.changeTower=billboard;
                    store.commit('changeTowerType', {
                         isShow:true,
                         towerInfo: billboard.towerInfo,      //塔信息
                         winPos: position                     //屏幕坐标{x:441,y:521}
                     });
                    /**
                     * {
                     *       ID: 				塔序号
                     *       name:			塔名
                     *       attachMode:		塔类型（门架0悬垂1耐张2）
                     *       type:			    塔型
                     *       voltage:			电压等级
                     *       callHeight:	    呼高(m)
                     *       stakeName:		定位桩名
                     *       offsetDist:			偏差距离(m,大号+小号-)
                     *       altitude:			塔脚高程(m)
                     *       BaseLower:		塔基降(m,上+下-)
                     *       stakeDist:			桩累距(m)
                     *       midstakeOffset:		中心桩位移(m,左+右-)
                     *       angle:			塔身转角（非线路转角）,
                     *       loopLineData:{
                     *       wire:{
                     *          chuanModel:		    串型号
                     *            {
                     *                  leftBack: 左/上(小号侧)
                     *                  leftFore: 左/上(大号侧，悬垂单挂点为空，悬垂双挂点必填，耐张挂点为空则与小号侧相同)
                     *                  middleBack:	中(小号侧，直流为空)
                     *                  middleFore:	中(大号侧，直流为空，悬垂单挂点为空，悬垂双挂点必填，耐张挂点为空则与小号侧相同)
                     *                  rightBack: 右/下(小号侧)
                     *                  rightFore: 右/下(大号侧，悬垂单挂点为空，悬垂双挂点必填，耐张挂点为空则与小号侧相同)
                     *           }
                     *      }
                     * }
                     */
                    console.log(billboard.towerInfo);
                    //handler.destroy();
                    enableRotation(true);
                }
                let handler =_self.handler;

                handler.setInputAction(function(movement) {
                    // let cartesian = _self.getCarterByWinPos(movement.position);//_self._scene.camera.pickEllipsoid(movement.position, ellipsoid)
                    onChangeType(movement.position);
                }, ScreenSpaceEventType.LEFT_UP);
                enableRotation(false);

            });

            enhanceWithListeners(billboard);
        };

        PolylineGraphics.prototype.setChangeType=function () {
            let polyline = this;
            polyline.asynchronous = false;
            _self.registerChangeTypeShape(polyline,'单击选择支线');
            if(this.setChangeMode) {
                return;
            }

            polyline.setChangeMode = setChangeMode;
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
                //return Extent.fromCartographicArray(ellipsoid.cartesianArrayToCartographicArray(this.positions));
            };
            enhanceWithListeners(polyline);
            polyline.setChangeMode(false);
            _self.changeTowerLine=null;
        };

    };

    /**
     * 更改塔型用选择支线
     * @param surface
     */
    registerChangeTypeShape (surface,tipTxt) {
        let _self = this;
        setListener(surface, 'mouseMove', function(position) {
            surface.setHighlighted(true);
            if(!surface._changeMode) {
                _self._tooltip.showAt(position,tipTxt);//"Click to edit this shape"
            }
        });
        // hide the highlighting when mouse is leaving the polygon
        setListener(surface, 'mouseOut', function(position) {
            surface.setHighlighted(false);
            _self._tooltip.setVisible(false);
        });
        setListener(surface, 'leftClick', function(position) {
            surface.setChangeMode(true);
            _self.changeTowerLine=surface;
        });
    };

    /**
     * 更改塔型用选择支线
     * @param surface
     */
    registerTowerShape (surface,tipTxt) {
        let _self = this;
        setListener(surface, 'mouseMove', function(position) {
            surface.setHighlighted(true);
            if(!surface._changeMode) {
                _self._tooltip.showAt(position,tipTxt);//"Click to edit this shape"
            }
        });
        // hide the highlighting when mouse is leaving the polygon
        setListener(surface, 'mouseOut', function(position) {
            surface.setHighlighted(false);
            _self._tooltip.setVisible(false);
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

    setChanged(surface){
        if(this._changedSurface ) {//&& !this._editedSurface.isDestroyed()
            this._changedSurface.setChangeMode(false);
        }
        this._changedSurface = surface;
    };

    getCarterByWinPos(position){
        let ray=this.camera.getPickRay(position);
        return this._scene.globe.pick(ray,this._scene);
    };

    removeHandles(){
        store.commit('changeTowerType', {
            towerInfo:null,      //塔信息
            isShow:false,
            winPos: {x:0,y:0}                     //屏幕坐标{x:441,y:521}
        });
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
    };

}

export default TowerLineChangeTypeHelper;
