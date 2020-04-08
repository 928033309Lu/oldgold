/* eslint-disable */
/**
 * Created by pengYX on 2018/5/9.
 */

import Cesium from 'cesium/Cesium';
//let Cesium =require('../../../../static/thirdParty/Cesium/Cesium');
import BaseGloble from './baseGloble';
import { fanCenterHight,farmEntities,farmVisibleHeightRange,farmhpr,glowFarmPath} from './constants';
import store from '../../../store/index';
import EPSGPrjTransform from '../otherModle/epsgPrjTransform';
import EPSGPrjTrans from '../otherModle/epsgPrjTrans';
import {vertifyLonLat,vertifyXY} from "./utilGISFunc";

class farmMoudle extends BaseGloble{

    constructor (viewer){
        super(viewer);
        this.handle= new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.selectEntity=undefined;
        this.mouseoverEntity=undefined;
        this.lastTime=Cesium.JulianDate.now();
        this.imgUrl=glowFarmPath+'1.png';//'static/fanRotate/fan001.png';
        this.layers=this.viewer.imageryLayers;
        this.epsgprjTransForm=undefined;
        this.farmLayer=null;
        this.addStatusInfoEvent();
    }

    /**
     * 设置风场使用的投影坐标系的EPSG号
     * @param epsgID            --epsgid
     */
    setProjectEPSG(epsgID){
        this.epsgprjTransForm=new EPSGPrjTransform(epsgID);
    };

    /**
     * 将风场中的投影坐标转换为WGS84经纬度坐标
     * @param point     {x:37234567,y:240987}
     * @return {*}      [110.23,35.21]
     * @constructor
     */
    XYToLatLon(point){
        if(!vertifyXY(point.x,point.y)){
            return {x:0,y:0};
        }
        let p=[];
        if(Cesium.defined(this.epsgprjTransForm)){
            p =this.epsgprjTransForm.coordsToLonlat(point);
        }else{
            if(!this.calEpsgTrans){
                this.calEpsgTrans=new EPSGPrjTrans();
            }
            p=this.calEpsgTrans.coordTOLatLon(point);
        }
        return {x:p[0],y:p[1]};
    };

    /**
     * 将风场中的WGS84经纬度坐标转换为投影坐标
     * @param point     {x:110.24,y:24.355}
     * @return {*}      {x:37234567,y:240987}
     * @constructor
     */
    latlonToXY(point){
        if(!vertifyLonLat(point.x,point.y)){
            return {x:0,y:0};
        }
        if(Cesium.defined(this.epsgprjTransForm)){
            let p=  this.epsgprjTransForm.lonLatToCoords(point);
            return {x:p[0],y:p[1]};
        }else{
            if(!this.calEpsgTrans){
                this.calEpsgTrans=new EPSGPrjTrans();
            }
            let p=this.calEpsgTrans.latLonTOCoord(point);
            console.log(p);
            return {x:p[0],y:p[1]};
        }
    };

    transWithEpsg(point,fromEpsg,toEpsg){
        let p=EPSGPrjTransform.transForm(fromEpsg,toEpsg,point);
        return {x:p.x,y:p.y};
    };

    /**
     * 添加无人机拍摄的指定风场的影像服务（WMS服务）
     * @param url       影像服务路径
     */
    addFarmImagery(url){
       this.removeFarmImagery();
       let imageryProvider= new Cesium.WebMapServiceImageryProvider({
          /* url:"http://10.32.23.252/mapcache",
           layers:"cache_40"*/
           url:url,
           layers:'dom',
           parameters:{
                transparent:true,
                format: 'image/png'
            },
            show:true
        });
        this.layers.addImageryProvider(imageryProvider);
    };

    addFarmImagerySevices(url,name,subdomains){
        let imageryProvider= new Cesium.WebMapServiceImageryProvider({
             url:url,
             enablePickFeatures:false,
             layers:name,
            subdomains:subdomains
        });
        let layer=this.layers.addImageryProvider(imageryProvider);
        //this.layers.lower(layer);
       this.layers.lower(layer);
        this.farmLayer=layer;
    };

    /**
     * 添加无人机拍摄的指定风场的地形服务
     * @param url       地形服务路径
     */
    addFarmTerrian(url){
        let terrianPro = new Cesium.CesiumTerrainProvider({
            url : url
        });
       // viewer.scene.globe.depthTestAgainstTerrain = !(terria instanceof Cesium.EllipsoidTerrainProvider);
        this.viewer.scene.globe.terrainProvider = terrianPro;
    };

    /**
     *  移除已添加的无人机拍摄的影像服务
     */
    removeFarmImagery(){
       if(Cesium.defined(this.farmLayer)){
           this.layers.remove(this.farmLayer);
           this.farmLayer=null;
       }
    };

    /**
     * 加载风场模型
     * @param url           风场模型路径
     * @param farmInfos     风场信息数组
     * {x:107.6,y:35.2,z:33}
     */
    createFarm(url,farmInfos){
        farmInfos.forEach((model,index)=>{
            let id=Cesium.defaultValue(model.id,index);
            let modelInfo={name:"farm",x:model.x,y:model.y,z:model.z,id:id,url:url,near:farmVisibleHeightRange[0],far:farmVisibleHeightRange[1],scale:1500};
            farmEntities.push(this.addModel(modelInfo,fanCenterHight,farmhpr));
        });
        this.addFarmEventHandles();
    };

    /**
     * 添加风场动画图标
     * @param url           动画图标路径
     * @param farmInfos     风场图标相关信息
     * {x:103.4,y:25.3,z:0,id:33(风场编号)}
     */
    createFarms(url,farmInfos){
        farmInfos.forEach((model,index)=>{
            let id=Cesium.defaultValue(model.id,index);
            let modelInfo={name:"farm",x:model.x,y:model.y,z:model.z,id:id,near:farmVisibleHeightRange[0],far:farmVisibleHeightRange[1]};
            let entity = this.addBillboard(this.imgUrl,modelInfo);
            //entity.entityID = id;
            farmEntities.push(entity);
            //console.log(id +',');
        });
        this.lastTime=Cesium.JulianDate.now();
        this.imgNum=0;
        this.addFarmEventHandles();
    };

    /**
     * 通过项目编号获取对应的Entity
     * @param {String/Number}prjId        项目编号
     * @return {*}                        返回的项目Entity,如果没有查到则为NULL
     */
    getFarmEntityByPrjID (prjId) {
        let res = null;
        for (let i = 0; i < farmEntities.length; i++) {
            if (farmEntities[i].entityID.toString() === prjId.toString()) {
                res = farmEntities[i];
                break;
            }
        }
        return res;
    };

    flyToPrjByCity (prjId, height) {
        let entity = this.getFarmEntityByPrjID(prjId);
        if (entity) {
           entity.show = true;
           this.viewer.flyTo(entity, {
               offset : {
                   heading : Cesium.Math.toRadians(0.0),
                   pitch : Cesium.Math.toRadians(-90),
                   range : height
               }
           });
        }
    };

    clearFarms(){
        this.clearModels(farmEntities);
        this.removeFarmEventHandle();
        //this.viewer.scene.preUpdate&&this.viewer.scene.preUpdate.removeEventListener(this._addPerUpdate,this);
    };

    /**
     * 加载等高线图层服务
     * @param {String}url                   服务路径
     * @param {String}layerName             图层名称
     */
    addContourSevices (url,layerName) {
        let imageryProvider= new Cesium.WebMapServiceImageryProvider({
            url:url,
            enablePickFeatures:false,
            layers:layerName,
            parameters:{
                transparent:true,
                format: 'image/png'
            }
        });
        let layer=this.layers.addImageryProvider(imageryProvider);
        this.contourLayer = layer;
    };

    /**
     * 移除等高线图层
     */
    removeContourSevices () {
        if(Cesium.defined(this.contourLayer)){
            this.layers.remove(this.contourLayer);
            this.contourLayer=null;
        }
    };

    /********************************风场相关交互逻辑**********************************/
    addFarmEventHandles() {
        if(!this.eventAdd){
            this.handle.setInputAction((click) => {
                //先清除之前的高亮效果
                // this.changeModelEntityColor(this.selectEntity,Cesium.Color.WHITE);
                //获取当前选中的模型，name区分风场，风机，测风塔，升压塔；entityID为数据库中编号
                this.selectEntity = this._getPickBillborad(click.position);
                // this.changeModelEntityColor(this.selectEntity,Cesium.Color.RED);
                let entityID = Cesium.defined(this.selectEntity) && (this.selectEntity.name === 'farm') ? this.selectEntity.entityID : '';
                if (Cesium.defined(this.selectEntity) && (this.selectEntity.name === 'farm')) {
                    let position = this.getLatLngByWinPos(click.position);
                    this.farmClickListener && this.farmClickListener(entityID, Cesium.defined(position.lng) ? position.lng : null, Cesium.defined(position.lat) ? position.lat : null);
                }

            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handle.setInputAction((movement) => {
                this.mouseoverEntity = this._getPickBillborad(movement.endPosition);
                //let entityID = Cesium.defined(this.mouseoverEntity) && (this.mouseoverEntity.name === 'farm') ? this.mouseoverEntity.entityID : '';
                store.commit('toggleProInfo', {
                    'projectid': Cesium.defined(this.mouseoverEntity) && (this.mouseoverEntity.name === 'farm') ? this.mouseoverEntity.entityID : '',
                    'bool': !!(Cesium.defined(this.mouseoverEntity) && (this.mouseoverEntity.name === 'farm')),
                    'clientX': movement.endPosition.x,
                    'clientY': movement.endPosition.y
                });
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
        this.eventAdd = true;
    };

    removeFarmEventHandle(){
        if(this.eventAdd){
            this.handle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
        this.eventAdd = false;
    };

    addStatusInfoEvent () {
        let handle = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handle.setInputAction((movement) => {
            /*信息框*/
           /* let ray = this.viewer.camera.getPickRay(movement.endPosition);
            let cartesian = this.viewer.scene.globe.pick(ray,this.viewer.scene);
            this.viewer.scene.camera.pickEllipsoid(movement.endPosition,this.viewer.scene.globe.ellipsoid);  */
            let cartesian =this.viewer.scene.pickPosition(movement.endPosition);
            let height = Math.ceil(this.viewer.camera.positionCartographic.height);
            if (cartesian) {
                //将笛卡尔坐标转换为地理坐标
                let cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian),terrianHeght=cartographic.height<0?0:cartographic.height.toFixed(4);
                //将弧度转为度的十进制度表示
                //获取相机高度
                store.commit('statusInfo', {
                    'lon': Cesium.Math.toDegrees(cartographic.longitude).toFixed(4),//经度
                    'lat': Cesium.Math.toDegrees(cartographic.latitude).toFixed(4),//纬度
                    'alt': terrianHeght,                         //地形高度
                    'cameraHeight': height,                                        //相机高度
                    'isShow': true                                                 //是否显示
                });
            } else {
                store.commit('statusInfo', {
                    'lon': null,
                    'lat': null,
                    'alt': null,
                    'cameraHeight': height,
                    'isShow': false
                });
            }
            /*信息框*/
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.viewer.scene.preUpdate && this.viewer.scene.preUpdate.addEventListener(this._addPerUpdate, this);
    };

    /********************其它模型（测风塔，升压站）***********************************/
    /**
     * 获取指定屏幕坐标点的billborad不为空的entity对象
     * @param position          屏幕坐标点{x:300,y:400}
     * @return {Entity}
     * @private
     */
    _getPickBillborad(position){
        const picked = this.viewer.scene.pick(position);
        //获取选中的模型实体Entity
        if(Cesium.defined(picked)&&Cesium.defined(picked.id)&&Cesium.defined(picked.id.billboard)){
            return picked.id;
        }else{
            return undefined;
        }
    };

    /**
     *  添加每一帧的动画，用于模拟gif动画
     * @param scene
     * @param time
     * @private
     */
    _addPerUpdate(scene,time){
        let currentTime=Cesium.JulianDate.now();
        if(currentTime.secondsOfDay - this.lastTime.secondsOfDay>=0.3){
            this.imgNum++;
            if(this.imgNum>=30){
                this.imgNum=1;
            }
            let imagePath=glowFarmPath+ this.imgNum +'.png';
            farmEntities.forEach((farmEntity,index)=>{
                farmEntity.billboard.image= imagePath;
            });
            this.lastTime = Cesium.JulianDate.now();


       // let height = Math.ceil(this.viewer.camera.positionCartographic.height);
        let heading = Cesium.Math.toDegrees(this.viewer.camera.heading);//指南针的角度
        store.commit('northInfo', {
            'angle': heading                 //旋转角度
        });
         if(Math.ceil(this.viewer.camera.positionCartographic.height)>farmVisibleHeightRange[0]) {
             this.hideVisibleModel(farmEntities,true);
             if(!this.eventAdd){
                 this.addFarmEventHandles();
             }

         } else{
             this.hideVisibleModel(farmEntities,false);
             if(this.eventAdd){
                 this.removeFarmEventHandle();
             }
         }
        }
    };
}

export default farmMoudle;
