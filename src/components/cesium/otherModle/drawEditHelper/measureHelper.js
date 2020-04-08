/* eslint-disable */
/**
 * Created by pengYX on 2018/7/19.
 */

import Cartesian3 from 'cesium/Core/Cartesian3';
import Cartesian2 from 'cesium/Core/Cartesian2';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import VerticalOrigin from 'cesium/Scene/VerticalOrigin';
import HorizontalOrigin from 'cesium/Scene/HorizontalOrigin';
import CustomDataSource from 'cesium/DataSources/CustomDataSource';
import PrimitiveCollection from 'cesium/Scene/PrimitiveCollection';
import defined from 'cesium/Core/defined';
import Color from 'cesium/Core/Color';
import EllipsoidGeodesic from 'cesium/Core/EllipsoidGeodesic';
import Cartographic from 'cesium/Core/Cartographic';
import LabelStyle from 'cesium/Scene/LabelStyle';
import HeightReference from 'cesium/Scene/HeightReference';

import BillboardGroup from './primitive/BillborardGroup';
import BillboardType from './primitive/BillboardType';
import PolygonPrimitive from './primitive/polygonPrimitive';
import PolylinePrimitive from './primitive/polylinePrimitive';
import GroundPolylinePrimitive from './primitive/groundPolylinePrimitive';
import CommonFunc from './primitive/commonFunc'

class MeasureHelper{
    constructor(viewer){
        this.viewer=viewer;
        this.camera=viewer.camera;
        this._scene =viewer.scene;
        this.handler=new ScreenSpaceEventHandler(viewer.scene.canvas);

        let dsMeasure=new CustomDataSource('measure');
        this.viewer.dataSources.add(dsMeasure);
        this.entities=dsMeasure.entities;
        this.billboardGroups=[];
        this.measurePrimitiveCollection=new PrimitiveCollection();
        this._scene.primitives.add(this.measurePrimitiveCollection)
    };

    /**
     * 长度测量
     * @param options
     */
    measureLength(options) {
        function calLengthUnit(distanc) {
            if ((distanc) / 1000 > 1) {
                return (distanc / 1000).toFixed(1)+ '公里';
            }else{
                return distanc.toFixed(0)+'米';
            }
        }

        let minPoints = 2, positions = [], distanc = 0;
        let ellipsoid=this._scene.globe.ellipsoid;
        let marker=new BillboardGroup(this,{});
        this.billboardGroups.push(marker);

        let poly = new GroundPolylinePrimitive(ellipsoid,options);
        poly.asynchronous = false;
        this.measurePrimitiveCollection.add(poly);

        this.handler.setInputAction((movement)=>{
            //this.viewer.scene.camera.pickEllipsoid(movement.position, ellipsoid);
            let cartesian =this._scene.globe.pick(this.viewer.camera.getPickRay(movement.position),this._scene);
            if(defined(cartesian)){
                // first click
                if (positions.length === 0) {
                    positions.push(cartesian.clone());
                    marker.addBillboard(positions[0],'起点',BillboardType.POINTWITHLABEL);
                }
                if (positions.length >= minPoints) {
                    poly.positions = positions;
                    poly._createPrimitive = true;
                    // Cesium.Cartesian3.distance(positions[positions.length-2],positions[positions.length-1]);
                    distanc+=new EllipsoidGeodesic(Cartographic.fromCartesian(positions[positions.length-2]),Cartographic.fromCartesian(positions[positions.length-1])).surfaceDistance;
                    marker.insertBillboard(marker._billboards.values.length-1,cartesian,calLengthUnit(distanc),BillboardType.POINTWITHLABEL);
                }else if(positions.length>0){
                    marker.addBillboard(cartesian,'',BillboardType.POINTWITHLABEL);
                }
                positions.push(cartesian);
            }
        },ScreenSpaceEventType.LEFT_CLICK);

        this.handler.setInputAction((movement)=>{
            if(positions.length===0)return;
            if (movement.endPosition !== null) {
                let cartesian =  this._scene.globe.pick(this.viewer.camera.getPickRay(movement.endPosition),this._scene);//this.viewer.scene.camera.pickEllipsoid(movement.endPosition,ellipsoid);
                if (cartesian) {
                    positions.pop();
                    cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                    if (positions.length >= minPoints) {
                        poly.positions = positions;
                        poly._createPrimitive = true;
                    }
                    let allDis = new EllipsoidGeodesic(Cartographic.fromCartesian(positions[positions.length-2]),Cartographic.fromCartesian(positions[positions.length-1])).surfaceDistance+ distanc;//Cesium.Cartesian3.distance(positions[positions.length - 2], positions[positions.length - 1]) + distanc;
                    // update marker
                    marker.getBillboard(marker._billboards.values.length - 1).position = cartesian;
                    marker.getBillboard(marker._billboards.values.length- 1).label.text = calLengthUnit(allDis);
                }
            }


        },ScreenSpaceEventType.MOUSE_MOVE);

        this.handler.setInputAction((movement)=>{
            if(movement.position != null) {
                if(positions.length < minPoints + 2) {
                    return;
                } else {
                    marker.removeBillboard(marker._billboards.values.length-2);
                    marker.removeBillboard(marker._billboards.values.length-2);
                    let cartesian =this._scene.globe.pick(this.viewer.camera.getPickRay(movement.position),this._scene);// this.viewer.scene.camera.pickEllipsoid(movement.position,ellipsoid);
                    if (cartesian) {
                        this.endMeasure();
                    }
                }
            }
        },ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };

    /**
     * 面积测量
     * @param options
     */
    measureArea(options){
        let markers=new BillboardGroup(this,{});
		this.billboardGroups.push(markers);

        let commFun=new CommonFunc(this._scene.globe.ellipsoid.maximumRadius);
        let positions=[],ellipsoid=this._scene.globe.ellipsoid;
        let areaentity=null;//用于存储label的entity
        let poly=new PolygonPrimitive(this._scene.globe.ellipsoid,options);
        poly.asynchronous = false;
        this.measurePrimitiveCollection.add(poly);
        let minPoints=3, txt='';

        this.handler.setInputAction((movement)=>{
            let cartesian =this._scene.globe.pick(this.viewer.camera.getPickRay(movement.position),this._scene);//this.viewer.scene.camera.pickEllipsoid(movement.position, ellipsoid);
            if (cartesian) {
                // first click
                if (positions.length === 0) {
                    positions.push(cartesian.clone());
                    markers.addBillboard(positions[0],txt,BillboardType.POINT);
                }
                if (positions.length >= minPoints) {

                    let area=commFun.PlanarPolygonAreaMeters(commFun.cartesianToDegrees(positions)) ;
                    if(areaentity){
                        areaentity.position=cartesian;
                        areaentity.label.text=area.toFixed(0)+'平方米';
                    }else {
                        //poly._primitive._boundingSpheres[0].center
                        areaentity=this.addTmpLable( cartesian,area.toFixed(0)+'平方米');//markers.addBillboard(poly._primitive._boundingSpheres[0].center ,area.toFixed(0)+'平方米',BillboardType.LABEL);
                    }

                    poly.positions = positions;
                    poly._createPrimitive = true;
                    markers.insertBillboard(markers._billboards.values.length-1,cartesian,txt);
                }else if(positions.length>0){
                    markers.addBillboard(cartesian,'');
                }
                positions.push(cartesian);
            }
        },ScreenSpaceEventType.LEFT_CLICK);

        this.handler.setInputAction((movement)=>{
            if(positions.length===0)return;
            let position = movement.endPosition;
            if (position !== null) {
                let cartesian = this._scene.globe.pick(this.viewer.camera.getPickRay(position),this._scene);//this.viewer.scene.camera.pickEllipsoid(position, ellipsoid);
                if (cartesian) {
                    positions.pop();
                    cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                    if (positions.length >= minPoints) {
                        poly.positions = positions;
                        poly._createPrimitive = true;
                    }
                    if(areaentity) {
                        let area=commFun.PlanarPolygonAreaMeters(commFun.cartesianToDegrees(positions)) ;
                        areaentity.position=cartesian;
                        areaentity.label.text=area.toFixed(0)+'平方米';
                    }
                    markers.getBillboard(markers._billboards.values.length - 1).position = cartesian;

                }
            }
        },ScreenSpaceEventType.MOUSE_MOVE);

        this.handler.setInputAction((movement)=>{
            let position = movement.position;
            if(position != null) {
                if(positions.length < minPoints + 2) {
                    return;
                } else {
                    markers.removeBillboard(markers._billboards.values.length-2);
                    markers.removeBillboard(markers._billboards.values.length-2);
                    var cartesian =this._scene.globe.pick(this.viewer.camera.getPickRay(position),this._scene);//this.viewer.scene.camera.pickEllipsoid(position, ellipsoid);
                    if (cartesian) {
                        this.endMeasure();
                    }
                }
            }
        },ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };

    /**
     * 高度（简单）测量
     * @param options
     */
    measreHeightSample(options){
        let positions=[],minPoints=2;
        let ellipsoid=this._scene.globe.ellipsoid;
        let poly=new PolylinePrimitive(ellipsoid,options);

        let markers=new BillboardGroup(this,{});
        this.billboardGroups.push(markers);

        poly.asynchronous = false;
        this.measurePrimitiveCollection.add(poly);
        let entityH=null;

        this.handler.setInputAction((movement)=>{
            let cartesian =this._scene.globe.pick(this.viewer.camera.getPickRay(movement.position),this._scene);
            if (cartesian) {
                // first click
                if (positions.length === 0) {
                    positions.push(cartesian.clone());
                    markers.addBillboard(positions[0],'');
                }
                if (positions.length === minPoints) {
                    positions.pop();
                    positions.push(cartesian);
                    poly.positions = positions;
                    poly._createPrimitive = true;
                    markers.getBillboard(markers._billboards.values.length - 1).position = cartesian;
                    this.endMeasure();
                }else if(positions.length>0){
                    markers.addBillboard(cartesian,'');
                    positions.push(cartesian);
                }
            }
        },ScreenSpaceEventType.LEFT_CLICK);

        this.handler.setInputAction((movement)=>{
            if(positions.length===0)return;
            let position = movement.endPosition;
            if (position !== null) {
                let cartesian = this._scene.globe.pick(this.viewer.camera.getPickRay(position),this._scene);//viewer.scene.camera.pickEllipsoid(position, ellipsoid);
                if (cartesian) {
                    positions.pop();
                    cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                    if (positions.length === minPoints) {
                        poly.positions =positions;
                        poly._createPrimitive = true;
                        let camter=Cartesian3.lerp(positions[0],positions[positions.length-1],0.5,new Cartesian3 ());
                        let height=this.calHeight(positions);

                        if(!entityH){
                            entityH=this.addTmpLable(camter,'高度差：'+Math.abs(height).toFixed(2)+'米');
                        }else{
                            entityH.position=camter;
                            entityH.label.text='高度差：'+Math.abs(height).toFixed(2)+'米';
                        }
                    }
                    markers.getBillboard(markers._billboards.values.length - 1).position = cartesian;
                }
            }
        },ScreenSpaceEventType.MOUSE_MOVE);
    };

    /**
     * 高度（复杂）测量
     * @param options
     */
    measureHeightComplex(options){
        let positions=[],minPoints=2;
        let ellipsoid=this._scene.globe.ellipsoid;
        let poly=new PolylinePrimitive(ellipsoid,options);

        let markers=new BillboardGroup(this,{});
        this.billboardGroups.push(markers);

        poly.asynchronous = false;
        this.measurePrimitiveCollection.add(poly);
        let entityH=null;//存储高度
        let entityA=null;//存储长度
        let entityL=null;//存储水平距离

        this.handler.setInputAction((movement)=>{
            let cartesian =this._scene.globe.pick(this.viewer.camera.getPickRay(movement.position),this._scene);
            if (cartesian) {
                // first click
                if (positions.length === 0) {
                    positions.push(cartesian.clone());
                    markers.addBillboard(positions[0],'');
                }
                if (positions.length === minPoints) {
                    positions.pop();
                    positions.push(cartesian);
                    let poss=this.calTrangle(positions);
                    poly.positions =poss;// positions;
                    poly._createPrimitive = true;
                    markers.getBillboard(markers._billboards.values.length - 1).position = cartesian;
                    this.endMeasure();
                }else if(positions.length>0){
                    markers.addBillboard(cartesian,'');
                    positions.push(cartesian);
                }
            }
        },ScreenSpaceEventType.LEFT_CLICK);

        this.handler.setInputAction((movement)=>{
            if(positions.length===0)return;
            let position = movement.endPosition;
            if (position !== null) {
                let cartesian =this._scene.globe.pick(this.viewer.camera.getPickRay(position),this._scene);//viewer.scene.camera.pickEllipsoid(position, ellipsoid);
                if (cartesian) {
                    positions.pop();
                    cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                    if (positions.length === minPoints) {
                        let poss=this.calTrangle(positions);
                        poly.positions =poss;
                        poly._createPrimitive = true;
                        let camterA=Cartesian3.lerp(poss[0],poss[1],0.5,new Cartesian3 ());//计算长度标签的位置
                        let camterH=Cartesian3.lerp(poss[2],poss[0],0.5,new Cartesian3 ());//计算高度标签的位置
                        let camterL=Cartesian3.lerp(poss[1],poss[2],0.5,new Cartesian3 ());//计算水平距离标签的位置

                        let height=this.calHeight([poss[0],poss[1]]);                       //计算高度差
                        let lenghtA=Cartesian3.distance(positions[0],positions[1]);  //计算长度
                        let lenghtL=Cartesian3.distance(poss[1],poss[2]);            //计算水平距离

                        if(!entityH&&!entityL){//!entityA
                            entityH=this.addTmpLable(camterH,'高度差：'+Math.abs(height).toFixed(2)+'米');
                           // entityA=this.addTmpLable(camterA,'长度：'+Math.abs(lenghtA).toFixed(2)+'米');
                            entityL=this.addTmpLable(camterL,'水平距离：'+Math.abs(lenghtL).toFixed(2)+'米');

                        }else{
                            entityH.position=camterH;
                            entityH.label.text='高度差：'+Math.abs(height).toFixed(2)+'米';
                            //entityA.position=camterA;
                            //entityA.label.text='长度：'+Math.abs(lenghtA).toFixed(2)+'米';
                            entityL.position=camterL;
                            entityL.label.text='水平距离：'+Math.abs(lenghtL).toFixed(2)+'米';
                        }
                    }
                    markers.getBillboard(markers._billboards.values.length - 1).position = cartesian;
                }
            }
        },ScreenSpaceEventType.MOUSE_MOVE);
    };

    calHeight(positions) {
        let geoPt1= this._scene.globe.ellipsoid.cartesianToCartographic(positions[0]);
        let geoPt2= this._scene.globe.ellipsoid.cartesianToCartographic(positions[1]);
        return geoPt2.height-geoPt1.height;
    };

    calTrangle(positions){
        let newPosition=[];
        let lon=null,lat=null;
        let geoPt1= this._scene.globe.ellipsoid.cartesianToCartographic(positions[0]);
        let geoPt2= this._scene.globe.ellipsoid.cartesianToCartographic(positions[1]);
        let alt=Math.max(geoPt1.height,geoPt2.height);
        if(geoPt2.height>geoPt1.height){
            lon=geoPt1.longitude;
            lat=geoPt1.latitude;
            newPosition.push(positions[0],positions[1],Cartesian3.fromRadians (lon,lat,alt),positions[0]);
        }else{
            lon=geoPt2.longitude;
            lat=geoPt2.latitude;
            newPosition.push(positions[1],positions[0],Cartesian3.fromRadians (lon,lat,alt),positions[1]);
        }

        return newPosition;
    };

    endMeasure(){
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };

    clearMeasure(){
        this.billboardGroups.forEach((group)=>{
            group.remove();
        });
        this.measurePrimitiveCollection.removeAll();
        this.entities.removeAll();
        //this.entities.remove(this.areaentity);
    };

    addTmpLable(position,txt){
        return  this.entities.add({
                position:position,
                label : {
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
                    //pixelOffset: new Cartesian2(0.0,-20),
                    //heightReference:HeightReference.CLAMP_TO_GROUND,
                    disableDepthTestDistance:Number.POSITIVE_INFINITY
                }
        })
    };

    getCarterByWinPos(position){
        let ray=this.viewer.camera.getPickRay(position);
        return this._scene.globe.pick(ray,this._scene);
    };

}

export default MeasureHelper;
