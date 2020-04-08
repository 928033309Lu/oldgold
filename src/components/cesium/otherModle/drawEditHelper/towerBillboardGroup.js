/* eslint-disable */
/**
 * Created by pengYX on 2018/7/19.
 */

import Cartesian3 from 'cesium/Core/Cartesian3';
import Cartesian2 from 'cesium/Core/Cartesian2';
import Color from 'cesium/Core/Color';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import VerticalOrigin from 'cesium/Scene/VerticalOrigin';
import HeightReference from 'cesium/Scene/HeightReference';
import HorizontalOrigin from 'cesium/Scene/HorizontalOrigin';
import LabelStyle from 'cesium/Scene/LabelStyle';

import CustomDataSource from 'cesium/DataSources/CustomDataSource';
import {copyOptions,setListener} from './primitive/utilFunc';
import BillboardType from "./primitive/BillboardType";

class TowerBillboardGroup{
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

        this.angleOptions={
            color:new Color(0.5, 0.6, 0.8, 1.0),
            pixelSize:10
        };
        this.towerOptions={
            color:new Color(1.0, 1.0, 1, 1.0),
            pixelSize:8
        };

        let b=new CustomDataSource('temp');
        this.viewer.dataSources.add(b);
        this._billboards = b.entities;
        this._orderedBillboards = [];
    };

    /*****************************塔信息用******************************/
    createLineTower(towerInfo,callbacks){
        let billboard=null;
        if(towerInfo.attachMode==='2'){//转角塔
            billboard= this._billboards.add({
                position:Cartesian3.fromDegrees(towerInfo.coords[0],towerInfo.coords[1],towerInfo.coords[2]),
                point:{
                    color:this.angleOptions.color,
                    outlineColor: new Color(1.0, 0, 0, 1.0),
                    outlineWidth: 1,
                    pixelSize: this.angleOptions.pixelSize,
                    disableDepthTestDistance:Number.POSITIVE_INFINITY,
                    heightReference:HeightReference.CLAMP_TO_GROUND
                },
                label:{
                    text:towerInfo.name,
                    font: '14px sans-serif',//Philadelphia
                    outlineWidth:2.0,
                    outlineColor:Color.BLACK,
                    horizontalOrigin: HorizontalOrigin.RIGHT,
                    verticalOrigin:VerticalOrigin.BOTTOM ,
                    style : LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cartesian2(0.0,-20),
                    heightReference:HeightReference.CLAMP_TO_GROUND,
                    disableDepthTestDistance:Number.POSITIVE_INFINITY
                }
            });
            billboard.towerType="2";
        }else {//直线塔  //if(towerInfo.attachMode==='1')
            billboard= this._billboards.add({
                position:Cartesian3.fromDegrees(towerInfo.coords[0],towerInfo.coords[1],0),
                point:{
                    color:this.towerOptions.color,
                    outlineColor: new Color(1.0, 0, 0, 1.0),
                    outlineWidth: 1,
                    pixelSize: this.towerOptions.pixelSize,
                    disableDepthTestDistance:Number.POSITIVE_INFINITY,
                    heightReference:HeightReference.CLAMP_TO_GROUND
                },
                label:{
                    text:towerInfo.name,
                    font: '14px sans-serif',//Philadelphia
                    outlineWidth:2.0,
                    outlineColor:Color.BLACK,
                    horizontalOrigin: HorizontalOrigin.RIGHT,
                    verticalOrigin:VerticalOrigin.BOTTOM ,
                    style : LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cartesian2(0.0,-20),
                    heightReference:HeightReference.CLAMP_TO_GROUND,
                    disableDepthTestDistance:Number.POSITIVE_INFINITY
                }
            });
            billboard.towerType="1";
        }
        billboard.towerInfo=towerInfo;
        if(callbacks&&towerInfo.attachMode==='1'){
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
                if(!billboard['leftDown']){
                    setListener(billboard, 'leftDown', function(position) {
                        // TODO - start the drag handlers here
                        // create handlers for mouseOut and leftUp for the billboard and a mouseMove
                        function onDrag(position) {
                            billboard.position = position;
                            // find index
                            /*for (var i = 0, I = _self._orderedBillboards.length; i < I && _self._orderedBillboards[i] != billboard; ++i);*/
                            callbacks.dragHandlers.onDrag && callbacks.dragHandlers.onDrag(getIndex(), position,billboard);
                        }
                        function onDragEnd(position) {
                            handler&&handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
                            handler&&handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
                            //handler&&handler.destroy();
                            enableRotation(true);
                            callbacks.dragHandlers.onDragEnd && callbacks.dragHandlers.onDragEnd(getIndex(), position,billboard);
                        }

                        let handler = new ScreenSpaceEventHandler(_self._scene.canvas);

                        handler.setInputAction(function(movement) {
                            let cartesian =_self.getCarterByWinPos(movement.endPosition);//_self._scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            if (cartesian) {
                                onDrag(cartesian);
                            } else {
                                handler.destroy();
                                enableRotation(true);
                                //onDragEnd(cartesian);
                            }
                        }, ScreenSpaceEventType.MOUSE_MOVE);

                        handler.setInputAction(function(movement) {
                            let cartesian=_self.getCarterByWinPos(movement.position);//_self._scene.camera.pickEllipsoid(movement.position, ellipsoid)
                            onDragEnd(cartesian);
                        }, ScreenSpaceEventType.LEFT_UP);

                        enableRotation(false);

                        callbacks.dragHandlers.onDragStart && callbacks.dragHandlers.onDragStart(getIndex(),_self.getCarterByWinPos(position),billboard);// _self._scene.camera.pickEllipsoid(position, ellipsoid)
                    });
                }
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

    addLineTower(towerInfo,callbacks){
        this._orderedBillboards.push(this.createLineTower(towerInfo,callbacks));
    };

    addLineTowers(towerInfos,callbacks){
        let index =  0;
        for(; index < towerInfos.length; index++) {
            this.addLineTower(towerInfos[index],callbacks);
        }
    };

    insertLineTower(index,towerInfo,callbacks){
        this._orderedBillboards.splice(index, 0, this.createLineTower(towerInfo,callbacks));
    };

    /*****************************桩位用**********************************/

    addStakes(surveyDatas,callbacks){
        surveyDatas.forEach((survey)=> {
                let coord = survey.stakeCoordinate;
                let position=Cartesian3.fromDegrees(parseFloat(coord.longitude), parseFloat(coord.latitude), parseFloat(coord.altitude));
                let billboard=this.createBillboard(position,survey.stakeName,BillboardType.POINTWITHLABEL,callbacks);//BILLBOARDWITHLABLE
                this._orderedBillboards.push(billboard);
            }
        );
    };

    insertStake(index,stakeInfo,callbacks){
        let coord = stakeInfo.stakeCoordinate;
        let position=Cartesian3.fromDegrees(parseFloat(coord.longitude), parseFloat(coord.latitude), parseFloat(coord.altitude));
        let billboard=this.createBillboard(position,stakeInfo.stakeName,BillboardType.POINTWITHLABEL,callbacks);//BILLBOARDWITHLABLE
        this._orderedBillboards.splice(index, 0,billboard);
    };

    /*****************************编辑辅助点用**********************************/

    /**
     * 创建一个entity对象（点，文字，点带文字）
     * @param position  {Cartesian3}        位置
     * @param text      {String}            文本
     * @param type      {BillboardType}     类型(0--点；1--文本；2--点带文字)
     */
    createBillboard(position,text,type,callbacks){
        let point = {
            color: this._options.color,//new Color(1.0, 1.0, 1.0, 1.0),
            outlineColor: new Color(1.0, 0, 0, 1.0),
            outlineWidth: 1,
            pixelSize: this._options.pixelSize,
            disableDepthTestDistance:Number.POSITIVE_INFINITY,
            heightReference:HeightReference.CLAMP_TO_GROUND
        };
        let label={
            text: text,
            font: '14px sans-serif',//Philadelphia
            outlineWidth:2.0,
            outlineColor:Color.BLACK,
            horizontalOrigin: HorizontalOrigin.RIGHT,
            verticalOrigin:VerticalOrigin.BOTTOM ,
            style : LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cartesian2(0.0,-20),
            heightReference:HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance:Number.POSITIVE_INFINITY
        };
        let billImage={
            image:this._options.image,
            scale : this._options.pixelSize,
            rotation : 0,
            horizontalOrigin:HorizontalOrigin.CENTER,
            verticalOrigin:VerticalOrigin.CENTER,
            heightReference:HeightReference.CLAMP_TO_GROUND
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
            case BillboardType.BILLBOARDWITHLABLE:
                billboard= this._billboards.add({
                    position:position,
                    billboard:billImage,
                    label:label
                });
                break;
            case BillboardType.BILLBOARD:
                billboard= this._billboards.add({
                    position:position,
                    billboard:billImage
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
                if (!billboard['leftDown']) {
                    setListener(billboard, 'leftDown', function (position) {
                        // TODO - start the drag handlers here
                        // create handlers for mouseOut and leftUp for the billboard and a mouseMove
                        function onDrag(position) {
                            billboard.position = position;
                            // find index
                            //for (var i = 0, I = _self._orderedBillboards.length; i < I && _self._orderedBillboards[i] != billboard; ++i);
                            callbacks.dragHandlers.onDrag && callbacks.dragHandlers.onDrag(getIndex(), position,billboard);
                        }

                        function onDragEnd(position) {
                            handler && handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
                            handler && handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
                            //handler && handler.destroy();
                            enableRotation(true);
                            callbacks.dragHandlers.onDragEnd && callbacks.dragHandlers.onDragEnd(getIndex(), position,billboard);
                        }

                        let handler = new ScreenSpaceEventHandler(_self._scene.canvas);

                        handler.setInputAction(function (movement) {
                            let cartesian = _self.getCarterByWinPos(movement.endPosition);//_self._scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            if (cartesian) {
                                onDrag(cartesian);
                            } else {
                                onDragEnd(cartesian);
                            }
                        }, ScreenSpaceEventType.MOUSE_MOVE);

                        handler.setInputAction(function (movement) {
                            let cartesian = _self.getCarterByWinPos(movement.position);//_self._scene.camera.pickEllipsoid(movement.position, ellipsoid)
                            onDragEnd(cartesian);
                        }, ScreenSpaceEventType.LEFT_UP);

                        enableRotation(false);

                        callbacks.dragHandlers.onDragStart && callbacks.dragHandlers.onDragStart(getIndex(), _self.getCarterByWinPos(position),billboard);// _self._scene.camera.pickEllipsoid(position, ellipsoid)
                    });
                }
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
        /*this._billboards.remove(this.getBillboard(index));*/
        this._orderedBillboards.splice(index+1);
    };

    remove () {
        this._billboards = this._billboards && this._billboards.removeAll() && this._billboards.destroy();
    };

    getCarterByWinPos(position){
        let ray=this.camera.getPickRay(position);
        return this._scene.globe.pick(ray,this._scene);
    };

    /**
     * 获取entity的属性信息
     * @param entity        要获取属性的entity
     * @return {{}}
     */
    getEntityProperties(entity){
        let pros={};
        entity.properties.propertyNames.forEach((proName)=>{
            pros[proName]=entity.properties[proName]._value;
        });
        return pros;
    };

}

export default TowerBillboardGroup;
