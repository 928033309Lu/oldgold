/* eslint-disable */
/**
 * Created by pengYX on 2019/1/25.
 */
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import Cartesian3 from 'cesium/Core/Cartesian3';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';

import BillboardGroup from './primitive/BillborardGroup';
import PolylinePrimitive from './primitive/polylinePrimitive';
import GroundPolylinePrimitive from './primitive/groundPolylinePrimitive';
import {createTooltip} from './primitive/utilFunc';

class DrawStakeLineHelper{
    constructor(viewer){
        this.viewer=viewer;
        this.camera=viewer.camera;
        this._scene=viewer.scene;
        this.handler=new ScreenSpaceEventHandler(viewer.scene.canvas);
        this._tooltip=new createTooltip(viewer.cesiumWidget.container);
    };

    muteHandlers (muted) {
        this._handlersMuted = muted;
    };

    startDrawing (cleanUp) {
        if(this.editCleanUp) {
            this.editCleanUp();
        }
        this.editCleanUp = cleanUp;
        this.muteHandlers(true);
    };

    stopDrawing () {
        if(this.editCleanUp) {
            this.editCleanUp();
            //this.editCleanUp = null;
        }
        this.muteHandlers(false);
    };

    /**
     * 绘制折线
     * @param options       线的样式
     * @param isGrounLine   是否为贴地线 [true--贴地线；false--非贴地线]
     */
    startDrawingPolyline (options,isGrounLine) {
        this.startDrawingPolyshape(options,isGrounLine);
    };

    startDrawingPolyshape ( options,isGroundLine) {
        let ellipsoid=this._scene.globe.ellipsoid;
        this.startDrawing(
            function() {
                primitives.remove(poly);
                if(!isGroundLine){
                    poly = new PolylinePrimitive(ellipsoid,options);
                }else {
                    poly = new GroundPolylinePrimitive(ellipsoid,options);
                }
                poly.asynchronous = false;

                primitives.add(poly);
                markers.remove();
                /*  mouseHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                  mouseHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
                  mouseHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                  mouseHandler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK);*/
                //mouseHandler.destroy();
                tooltip.setVisible(false);
                positions = [];
            }
        );
        let _self = this;
        let scene = this._scene;
        let primitives = scene.primitives;
        let tooltip = this._tooltip;
        let minPoints = 2;
        let poly;
        if(!isGroundLine){
            poly = new PolylinePrimitive(ellipsoid,options);
        }else {
            poly = new GroundPolylinePrimitive(ellipsoid,options);
        }
        poly.asynchronous = false;
        primitives.add(poly);
        let positions = [];
        let markers = new BillboardGroup(this, {});
        let mouseHandler = new ScreenSpaceEventHandler(scene.canvas);

        mouseHandler.setInputAction(function(movement) {
            if(movement.position != null) {
                let cartesian = _self.getCarterByWinPos(movement.position);//scene.camera.pickEllipsoid(movement.position, ellipsoid);
                if (cartesian) {
                    if(options.isInRangeCall){
                        if(!options.isInRangeCall(cartesian,true,movement.position)){//超出范围不添加并给出提示
                            return;
                        }
                    }
                    if(positions.length == 0) {
                        positions.push(cartesian.clone());
                        markers.addBillboard(positions[0]);
                    }
                    if(positions.length >= minPoints) {
                        poly.positions = positions;
                        poly._createPrimitive = true;
                    }
                    positions.push(cartesian);
                    markers.addBillboard(cartesian);
                }
            }
        }, ScreenSpaceEventType.LEFT_CLICK);

        mouseHandler.setInputAction(function(movement) {
            let position = movement.endPosition;
            if(position != null) {
                if(positions.length == 0) {
                    let cartesian = _self.getCarterByWinPos(position);
                    if (cartesian) {
                        if (options.isInRangeCall) {//超出范围，不添加点，不弹出提示框
                            if (options.isInRangeCall(cartesian, false,position)) {
                                tooltip.showAt(position, "<p>单击开始绘制</p>");
                            }
                        }
                    }
                } else {
                    let cartesian = _self.getCarterByWinPos(position);//scene.camera.pickEllipsoid(position, ellipsoid);
                    if (cartesian) {
                        if(options.isInRangeCall){//超出范围，不添加点，不弹出提示框
                            if(options.isInRangeCall(cartesian,false,position)){
                                if(positions.length>2){
                                    tooltip.showAt(position, "<p>右键撤销，双击结束绘制</p>");// return;
                                }else{
                                    tooltip.showAt(position, "<p>双击结束绘制</p>");// return;
                                }
                            }
                        }
                        positions.pop();
                        cartesian.y += (1 + Math.random());
                        positions.push(cartesian);
                        if(positions.length >= minPoints) {
                            poly.positions = positions;
                            poly._createPrimitive = true;
                        }
                        markers.getBillboard(positions.length - 1).position = cartesian;
                       // tooltip.changeWarmStyle(false);

                    }
                }
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);

        mouseHandler.setInputAction(function(movement) {
            let position = movement.position;
            if(position != null) {
                if(positions.length < minPoints + 1) {
                    return;
                } else {
                    let cartesian =_self.getCarterByWinPos(position);//scene.camera.pickEllipsoid(position, ellipsoid);
                    if (cartesian) {
                        if (typeof options.callback == 'function') {
                            if(options.isInRangeCall){//超出范围，不添加点，不弹出提示框
                                if(options.isInRangeCall(cartesian,false,position)){
                                    positions.splice(positions.length - 2, 2);
                                }else{
                                    positions.splice(positions.length - 1, 1);
                                }
                            }
                            options.callback(positions);
                        }
                        _self.stopDrawing();
                    }
                }
            }
        }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        mouseHandler.setInputAction(function(movement){
            if(movement.position != null&&positions.length>2) {
                positions.splice(positions.length-1,1);
                markers.removeBillboard(markers._orderedBillboards.length-1);
            }
        },ScreenSpaceEventType.RIGHT_CLICK);
        this.mouseHandler=mouseHandler;
    };


    getCarterByWinPos(position){
        let ray=this.camera.getPickRay(position);
        return this._scene.globe.pick(ray,this._scene);
    };

    removeHandleEvents() {
        this._tooltip.setVisible(false);
        this.muteHandlers(false);//stopDrawing();
        this.mouseHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        this.mouseHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        this.mouseHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.mouseHandler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK);
    };

}

export default DrawStakeLineHelper;
