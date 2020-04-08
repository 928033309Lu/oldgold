/* eslint-disable */
/**
 * Created by pengYX on 2018/8/27.
 */
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import defined from 'cesium/Core/defined';
import Cartesian3 from 'cesium/Core/Cartesian3';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import PrimitiveCollection from 'cesium/Scene/PrimitiveCollection';

import BillboardGroup from './primitive/BillborardGroup';
import PolygonPrimitive from './primitive/polygonPrimitive';
import PolylinePrimitive from './primitive/polylinePrimitive';
import GroundPolylinePrimitive from './primitive/groundPolylinePrimitive';
import CirclePrimitive from './primitive/circlePrimitive';
import ArrowStrightPrimitive  from './primitive/ArrowStrightPrimitive';

import {createTooltip} from './primitive/utilFunc';

class DrawPrimitiveHelper{
    constructor(viewer){
        this.viewer=viewer;
        this.camera=viewer.camera;
        this._scene=viewer.scene;
        this.handler=new ScreenSpaceEventHandler(viewer.scene.canvas);
        this._tooltip=new createTooltip(viewer.cesiumWidget.container);
        this.primitives = new PrimitiveCollection();
        this.viewer.scene.primitives.add(this.primitives);
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
            this.editCleanUp = null;
        }
        this.muteHandlers(false);
        this._tooltip.setVisible(false);
    };

    startDrawIconPoint (options) {
        this.startDrawing(
            function() {
                markers.remove();
                mouseHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                mouseHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
                tooltip.setVisible(false);
            }
        );
        let _self = this;
        let tooltip = this._tooltip;
        let positions = [];
        let scene = this._scene;
        let mouseHandler = new ScreenSpaceEventHandler(scene.canvas);
        let markers = new BillboardGroup(this, {});
        mouseHandler.setInputAction(function(movement) {
            if(movement.position != null) {
                let cartesian = _self.getCarterByWinPos(movement.position);//scene.camera.pickEllipsoid(movement.position, ellipsoid);
                if (cartesian) {
                    if(positions.length == 0) {
                        positions.push(cartesian.clone());
                        markers.addBillboard(positions[0]);
                        if(typeof options.callback == 'function') {
                            options.callback(positions);
                        }
                        _self.stopDrawing();
                    }
                }
            }
        }, ScreenSpaceEventType.LEFT_CLICK);

        mouseHandler.setInputAction(function(movement) {
            let position = movement.endPosition;
            if(position != null) {
                if(positions.length == 0) {
                    tooltip.showAt(position, "<p>单击添加节点</p>");
                }
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);
    };

    /**
     * 绘制折线
     * @param options       线的样式
     * @param isGrounLine   是否为贴地线 [true--贴地线；false--非贴地线]
     */
    startDrawingPolyline (options,isGrounLine) {
        this.startDrawingPolyshape(false, options,isGrounLine);
    };

    startDrawingPolyshape (isPolygon, options,isGroundLine) {
        let ellipsoid=this._scene.globe.ellipsoid;
        this.startDrawing(
            function() {
                primitives.remove(poly);
                markers.remove();
                mouseHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                mouseHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
                mouseHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                tooltip.setVisible(false);
            }
        );
        let _self = this;
        let scene = this._scene;
        let primitives = this.primitives;
        let tooltip = this._tooltip;
        let minPoints = isPolygon ? 3 : 2;
        let poly;
        if(isPolygon) {
            poly = new PolygonPrimitive(ellipsoid,options);
        } else if(!isGroundLine){
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
                    // first click
                    if(positions.length == 0) {
                        positions.push(cartesian.clone());
                        markers.addBillboard(positions[0]);
                    }
                    if(positions.length >= minPoints) {
                        poly.positions = positions;
                        poly._createPrimitive = true;
                    }
                    // add new point to polygon
                    // this one will move with the mouse
                    positions.push(cartesian);
                    // add marker at the new position
                    markers.addBillboard(cartesian);
                }
            }
        }, ScreenSpaceEventType.LEFT_CLICK);

        mouseHandler.setInputAction(function(movement) {
            let position = movement.endPosition;
            if(position != null) {
                if(positions.length == 0) {
                    tooltip.showAt(position, "<p>单击添加节点</p>");
                } else {
                    let cartesian = _self.getCarterByWinPos(position);//scene.camera.pickEllipsoid(position, ellipsoid);
                    if (cartesian) {
                        positions.pop();
                        // make sure it is slightly different
                        cartesian.y += (1 + Math.random());
                        positions.push(cartesian);
                        if(positions.length >= minPoints) {
                            poly.positions = positions;
                            poly._createPrimitive = true;
                        }
                        // update marker
                        markers.getBillboard(positions.length - 1).position = cartesian;
                        // show tooltip
                        // tooltip.showAt(position, "<p>Click to add new point (" + positions.length + ")</p>" + (positions.length > minPoints ? "<p>Double click to finish drawing</p>" : ""));
                        tooltip.showAt(position, "<p>点击添加一个新点(" + positions.length + ")</p>" + (positions.length > minPoints ? "<p>双击结束绘制</p>" : ""));
                    }
                }
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);

        mouseHandler.setInputAction(function(movement) {
            let position = movement.position;
            if(position != null) {
                if(positions.length < minPoints + 2) {
                    return;
                } else {
                    let cartesian =_self.getCarterByWinPos(position);//scene.camera.pickEllipsoid(position, ellipsoid);
                    if (cartesian) {
                        if(typeof options.callback == 'function') {
                            // remove overlapping ones
                            let index = positions.length - 1;
                            options.callback(positions);
                        }
                        _self.stopDrawing();
                    }
                }
            }
        }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    };

    /**
     * 绘制多边形
     * @param options
     * 其中{options.isClapOnTerrian控制是否为贴地面} [true--贴地面；false--非贴地面]
     */
    startDrawingPolygon (options) {
        this.startDrawingPolyshape(true, options);
    };

    /**
     * 开始绘制圆
     * @param {Object}options                           绘制圆形的样式信息
     * @param {Boolean}[options.isClapOnTerrian=false]  是否贴地
     * @param {Function}[options.callback]              绘制后的回调函数
     */
    startDrawingCircle (options) {
        let ellipsoid=this._scene.globe.ellipsoid;
        this.startDrawing(
            function() {
                primitives.remove(circle);
                markers.remove();
                mouseHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                mouseHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
                circle=null;
                tooltip.setVisible(false);
            }
        );
        let markers = new BillboardGroup(this, {}), scene = this._scene;;
        let primitives = this.primitives, mouseHandler = new ScreenSpaceEventHandler(scene.canvas), tooltip = this._tooltip;
        let circle = null;
        mouseHandler.setInputAction((movement)=>{
            let position=movement.position;
            if(defined(position)){
                let cartesian = this.getCarterByWinPos(position);
                if(cartesian){
                    if(circle == null) {
                        options.center=cartesian;
                        options.radius=0;
                        options.asynchronous=false;
                        circle = new CirclePrimitive(ellipsoid,options);
                        circle._createPrimitive = true;
                        primitives.add(circle);
                        markers.addBillboards([cartesian]);
                    }else {
                        if(typeof options.callback == 'function') {
                            options.callback(circle.getCenter(), circle.getRadius());
                        }
                        this.stopDrawing();
                    }
                }
            }
        },ScreenSpaceEventType.LEFT_CLICK);
        mouseHandler.setInputAction((movement)=>{
            let position=movement.endPosition;
            if(defined(position)){
                if(circle == null) {
                    tooltip.showAt(position, "<p>点击开始绘制圆</p>");
                } else {
                    let cartesian = this.getCarterByWinPos(position);
                    if(cartesian){
                        circle.setRadius(Cartesian3.distance(circle.getCenter(), cartesian));
                        markers.updateBillboardsPositions(cartesian);
                        tooltip.showAt(position, "<p>移动改变圆半径</p><p>再次点击结束绘制</p>");
                    }
                }
            }
        },ScreenSpaceEventType.MOUSE_MOVE);
    };

    /**
     * 绘制矩形
     * @param options
     */
    startDrawingRectangle(options){
        let ellipsoid=this._scene.globe.ellipsoid;
        this.startDrawing(
            function() {
                primitives.remove(poly);
                markers.remove();
                mouseHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                mouseHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
                tooltip.setVisible(false);
            }
        );
        let _self = this;
        let scene = this._scene;
        let primitives = this.primitives;
        let tooltip = this._tooltip;
        let minPoints =4;
        let poly= new PolygonPrimitive(ellipsoid,options);
        poly.asynchronous = false;
        primitives.add(poly);
        let positions = [];
        let markers = new BillboardGroup(this, {});
        let mouseHandler = new ScreenSpaceEventHandler(scene.canvas);

        mouseHandler.setInputAction(function(movement) {
            if(movement.position != null) {
                let cartesian = _self.getCarterByWinPos(movement.position);//scene.camera.pickEllipsoid(movement.position, ellipsoid);
                if (cartesian) {
                    // first click
                    if(positions.length == 0) {
                        positions.push(cartesian.clone());
                        markers.addBillboard(positions[0]);
                    }
                    if(positions.length >= minPoints) {
                        poly.positions = positions;
                        poly._createPrimitive = true;
                        _self.stopDrawing();
                        if(typeof options.callback == 'function') {
                            options.callback(positions);
                        }
                        return;
                    }
                    // add new point to polygon
                    // this one will move with the mouse
                    positions.push(cartesian);
                    // add marker at the new position
                    markers.addBillboard(cartesian);
                }
            }
        }, ScreenSpaceEventType.LEFT_CLICK);

        mouseHandler.setInputAction(function(movement) {
            let position = movement.endPosition;
            if(position != null) {
                if(positions.length == 0) {
                    tooltip.showAt(position, "<p>单击开始框选</p>");
                } else {
                    let cartesian = _self.getCarterByWinPos(position);//scene.camera.pickEllipsoid(position, ellipsoid);
                    if (cartesian) {
                        positions.splice(1,positions.length-1);
                        // make sure it is slightly different
                        cartesian.y += (1 + Math.random());
                        positions.push(new Cartesian3(cartesian.x,positions[0].y,positions[0].z));
                        positions.push(cartesian);
                        positions.push(new Cartesian3(positions[0].x,cartesian.y,cartesian.z));
                        if(positions.length >= minPoints) {
                            poly.positions = positions;
                            poly._createPrimitive = true;
                        }
                        // update marker
                        markers.getBillboard(1).position = cartesian;
                        // show tooltip
                        // tooltip.showAt(position, "<p>Click to add new point (" + positions.length + ")</p>" + (positions.length > minPoints ? "<p>Double click to finish drawing</p>" : ""));
                        tooltip.showAt(position, "<p>单击结束框选</p>" );
                    }
                }
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);

    };

    /**
     * 开始绘制直线箭头
     * @param {Object}options                           绘制箭头形的样式信息
     * @param {Boolean}[options.isClapOnTerrian=false]  是否贴地
     * @param {Function}[options.callback]              绘制后的回调函数
     */
    startDrawArrowStright (options) {
        this.startDrawControlArrow(options,false);
    };

    startDrawControlArrow (options,isPincer) {
        let ellipsoid=this._scene.globe.ellipsoid;
        let markers = new BillboardGroup(this, {});
        let primitives = this.primitives, mouseHandler = new ScreenSpaceEventHandler(this._scene.canvas), tooltip = this._tooltip;
        let minPoints =isPincer?3:2;
        let maxPoints=isPincer?4:2;
        this.startDrawing(
            function () {
                primitives.remove(poly);
                markers.remove();
                mouseHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                mouseHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
                positions = [];
                tooltip.setVisible(false);
            }
        );
        let poly=new ArrowStrightPrimitive(ellipsoid,options);
        poly.asynchronous = false;
        primitives.add(poly);
        let positions = [];
        mouseHandler.setInputAction((movement) => {
            let position = movement.position;
            if (defined(position)) {
                let cartesian = this.getCarterByWinPos(position);
                if (cartesian) {
                    //第一次点击
                    if (positions.length < 1) {
                        positions.push(cartesian.clone());
                        markers.addBillboard(positions[0]);
                    }
                    if (positions.length >= minPoints) {
                        poly.setPositions(positions);
                        poly._createPrimitive = true;
                    }
                    if(positions.length >= maxPoints){
                        if (typeof options.callback == 'function') {
                            options.callback(poly.getPositions(),poly.getControlPoint());
                        }
                        this.stopDrawing();
                        return ;
                    }
                    positions.push(cartesian);
                    markers.addBillboard(cartesian);
                }
            }
        }, ScreenSpaceEventType.LEFT_CLICK);

        mouseHandler.setInputAction((movement) => {
            let position = movement.endPosition;
            if (defined(position)) {
                if (positions.length < 1) {
                    tooltip.showAt(position, "<p>单击添加节点</p>");
                } else {
                    let cartesian = this.getCarterByWinPos(position);
                    if (cartesian) {
                        positions.pop();
                        //确保不同
                        cartesian.y += (1 + Math.random());
                        positions.push(cartesian);
                        if (positions.length >= minPoints) {
                            poly.setPositions(positions);
                            poly._createPrimitive = true;
                        }
                        markers.getBillboard(positions.length - 1).position = cartesian;
                        if (isPincer&&positions.length < maxPoints) {
                            tooltip.showAt(position, "<p>单击添加节点</p>");
                        }else {
                            tooltip.showAt(position, "<p>点击结束绘制</p>");
                        }
                    }
                }
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);
    };

    getCarterByWinPos(position){
        let ray=this.camera.getPickRay(position);
        return this._scene.globe.pick(ray,this._scene);
    };

}

export default DrawPrimitiveHelper;
