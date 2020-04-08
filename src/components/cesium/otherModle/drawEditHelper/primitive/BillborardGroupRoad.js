/* eslint-disable */
/**
 * Created by pengYX on 2018/7/19.
 */
import Cartesian2 from 'cesium/Core/Cartesian2';
import Color from 'cesium/Core/Color';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import VerticalOrigin from 'cesium/Scene/VerticalOrigin';
import HeightReference from 'cesium/Scene/HeightReference';
import HorizontalOrigin from 'cesium/Scene/HorizontalOrigin';
import LabelStyle from 'cesium/Scene/LabelStyle';

import CustomDataSource from 'cesium/DataSources/CustomDataSource';
import BillboardType from './BillboardType';
import {copyOptions,setListener} from './utilFunc';

class BillboardGroup{
    constructor(drawHelper,options){
        this.viewer=drawHelper.viewer;
        let defaultBillboard= {
            color:new Color(1.0, 1.0, 1.0, 1.0),
            pixelSize:5
        };
        this.camera=this.viewer.camera;
        this._scene =this.viewer.scene;
        this._tooltip=drawHelper._tooltip;

        this._options = copyOptions(options,defaultBillboard);
        let b=new CustomDataSource('temp');
        this.viewer.dataSources.add(b);
        this._billboards = b.entities;
        this._orderedBillboards = [];
    };

    /**
     * 创建一个entity对象（点，文字，点带文字）
     * @param position  {Cartesian3}        位置
     * @param text      {String}            文本
     * @param type      {BillboardType}     类型(0--点；1--文本；2--点带文字)
     */
    createBillboard(position,text,type,callbacks){
        let point = {
            color: this._options.color,//new Cesium.Color(1.0, 1.0, 1.0, 1.0),
            outlineColor: new Color(1.0, 0, 0, 1.0),
            outlineWidth: 1,
            pixelSize: this._options.pixelSize,
            disableDepthTestDistance:Number.POSITIVE_INFINITY,
            heightReference:HeightReference.CLAMP_TO_GROUND
        };
        let label={
            text: text,
            font: '24px Philadelphia',//Philadelphia    sans-serif
            scale:0.5,
            fillColor:new Color(0,0, 0, 1),//Color.BLACK,
            outlineWidth:0.5,
            outlineColor:new Color(0,0, 0, 1),//Color.BLACK,
            showBackground:true,
            backgroundColor:new Color(1,1, 1, 0.6),
            backgroundPadding:new Cartesian2(7, 5),
            horizontalOrigin: HorizontalOrigin.CENTER,
            verticalOrigin:VerticalOrigin.CENTER ,
            style : LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cartesian2(0.0,0.0),
           // heightReference:HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance:Number.POSITIVE_INFINITY
        };
        let billboard=null;
       switch (type){
           case BillboardType.LABEL:
               billboard= this._billboards.add({
                   position:position,
                   label:label
               });
               break;
           case BillboardType.POINTWITHLABEL:
               billboard= this._billboards.add({
                   position:position,
                   point:point,
                   label:label
               });
               break;
           case BillboardType.POINT:
           default:
               billboard= this._billboards.add({
                   position:position,
                   point:point
               });
               break;
       }
        //let ellipsoid=this._scene.globe.ellipsoid;
        if(callbacks){
            let _self = this;
            let screenSpaceCameraController = this._scene.screenSpaceCameraController;
            function enableRotation(enable) {
                screenSpaceCameraController.enableRotate = enable;
            }
            function getIndex() {
                // find index
                let i = 0, I = _self._orderedBillboards.length;
                for (i=0;i < I && _self._orderedBillboards[i] != billboard; ++i);
                return i;
            }
            if(callbacks.dragHandlers) {
                setListener(billboard, 'leftDown', function(position) {
                    // TODO - start the drag handlers here
                    // create handlers for mouseOut and leftUp for the billboard and a mouseMove
                    function onDrag(position) {
                        billboard.position = position;
                        // find index
                        for (var i = 0, I = _self._orderedBillboards.length; i < I && _self._orderedBillboards[i] != billboard; ++i);
                        callbacks.dragHandlers.onDrag && callbacks.dragHandlers.onDrag(getIndex(), position);
                    }
                    function onDragEnd(position) {
                        handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
                        handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
                        handler && handler.destroy();
                       //handler.destroy();
                        enableRotation(true);
                        callbacks.dragHandlers.onDragEnd && callbacks.dragHandlers.onDragEnd(getIndex(), position);
                    }

                    let handler = new ScreenSpaceEventHandler(_self._scene.canvas);

                    handler.setInputAction(function(movement) {
                        let cartesian =_self.getCarterByWinPos(movement.endPosition);//_self._scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        if (cartesian) {
                            onDrag(cartesian);
                        } else {
                            onDragEnd(cartesian);
                        }
                    }, ScreenSpaceEventType.MOUSE_MOVE);

                    handler.setInputAction(function(movement) {
                        let cartesian=_self.getCarterByWinPos(movement.position);//_self._scene.camera.pickEllipsoid(movement.position, ellipsoid)
                        onDragEnd(cartesian);
                    }, ScreenSpaceEventType.LEFT_UP);

                    enableRotation(false);

                    callbacks.dragHandlers.onDragStart && callbacks.dragHandlers.onDragStart(getIndex(),_self.getCarterByWinPos(position));// _self._scene.camera.pickEllipsoid(position, ellipsoid)
                });
            }
            if(callbacks.onDoubleClick) {
                setListener(billboard, 'leftDoubleClick', function(position) {
                    callbacks.onDoubleClick(getIndex());
                });
            }
            if(callbacks.onClick) {
                setListener(billboard, 'leftClick', function(position) {
                    callbacks.onClick(getIndex());
                });
            }
            if(callbacks.tooltip) {
                setListener(billboard, 'mouseMove', function(position) {
                    _self._tooltip.showAt(position, callbacks.tooltip());
                });
                setListener(billboard, 'mouseOut', function(position) {
                    _self._tooltip.setVisible(false);
                });
            }
        }

        return billboard;
    };

    addBillboard(position,text,type,callbacks){
        this._orderedBillboards.push(this.createBillboard(position,text,type,callbacks));
    };

    addBillboards(positions,text,type,callbacks){
        let index =  0;
        for(; index < positions.length; index++) {
            this.addBillboard(positions[index], text,type,callbacks);
        }
    };

    insertBillboard(index,position,text,type,callbacks){
        this._orderedBillboards.splice(index, 0, this.createBillboard(position,text,type,callbacks));
    };

    countBillboards () {
        return this._orderedBillboards.length;
    };

    getBillboard(index){
        return this._orderedBillboards[index];
    };

    removeBillboard(index){
        this._billboards.remove(this.getBillboard(index));
        this._orderedBillboards.splice(index,1);
    };

    removeBillboardFrom(index){
        this._orderedBillboards.forEach((billBoard,num)=>{
            if(num>index){
                this._billboards.remove(billBoard);
            }
        });
        this._orderedBillboards.splice(index+1);
    };


    remove () {
        this._billboards && this._billboards.removeAll();
        // && this._billboards.destroy()
    };

    getCarterByWinPos(position){
        let ray=this.camera.getPickRay(position);
        return this._scene.globe.pick(ray,this._scene);
    };

}

export default BillboardGroup;
