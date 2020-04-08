/* eslint-disable */
/**
 * Created by pengYX on 2018/5/9.
 */

import Cesium from 'cesium/Cesium';
import BaseGloble from './baseGloble';
import {
    mastEntities, stationEntities, fanVisibleHeightRange, farmhpr, stationURL, highModelColor, fanEntities,
    farmVisibleHeightRange
} from './constants';
import store from '../../../store/index';
import PNGBuilder from "../otherModle/pngBuilder";
import RectLabelBuilder from "../otherModle/rectLabelBuilder";
class otherMoudle extends BaseGloble{

    constructor (viewer){
        super(viewer);
        this.selectEntity=undefined;
        this.mastHeight=100;
        this._mastTopCenterCarcesian=undefined;
        this.mastLabelDS=new Cesium.CustomDataSource('mastLabel');
        this.mastModelDS=new Cesium.CustomDataSource('mastModel');
        this.viewer.dataSources.add(this.mastModelDS);
        this.viewer.dataSources.add(this.mastLabelDS);
        this.otherHandle= new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    };

    createStations(stationsInfo) {
        this.clearStations();
        stationsInfo.forEach((model, index) => {
            let id = Cesium.defaultValue(model.id, index);
            let modelInfo = {
                name: "station",
                x: model.x,
                y: model.y,
                z: model.z,
                id: id,
                url: stationURL,
                near: fanVisibleHeightRange[0],
                far: fanVisibleHeightRange[1],
                scale: 1
            };

            stationEntities.push(this.addModel(modelInfo, 0, farmhpr));
            this.viewer.zoomTo(stationEntities);
        });
    };

    clearStations(){
        this.clearModels(stationEntities);
    };

    hideStations(isVisible){
        this.hideVisibleModel(stationEntities,isVisible);
    };

    createMasts(url,mastsInfo){
        this.clearMasts();

        if(Cesium.defined(this.viewer.terrainProvider)){
            let positionHegihts=[];
            mastsInfo.forEach((model)=>{
                //let lonLat=this.xiAnCoordTo84BL({x:model.longitude,y:model.latitude});
                positionHegihts.push(Cesium.Cartographic.fromDegrees(model.longitude, model.latitude));
            });
            Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider,positionHegihts).then((updateHeights)=>{
                updateHeights.forEach((modelCoord,index)=>{
                    let id=Cesium.defaultValue(mastsInfo[index].id,index),name=mastsInfo[index].name;
                    let modelInfo={name:"mast",x:Cesium.Math.toDegrees(modelCoord.longitude),y:Cesium.Math.toDegrees(modelCoord.latitude),z:modelCoord.height?modelCoord.height:0,id:id,url:url,near:fanVisibleHeightRange[0],far:fanVisibleHeightRange[1],scale:1};
                    let mastModel=this._addMastModel(modelInfo.x,modelInfo.y,modelInfo.z,url,1,2.2);
                    console.log('mast add!');
                    mastModel.entityID=id;
                    modelInfo.mastname=name;
                    mastModel.mastInfo=modelInfo;
                    mastEntities.push(mastModel);
                });
            },()=>{
                mastsInfo.forEach((model,index)=>{
                    let id=Cesium.defaultValue(model.id,index),name=model.name;
                    let modelInfo={name:"mast",x:model.longitude,y:model.latitude,z:0,id:id,url:url,near:fanVisibleHeightRange[0],far:fanVisibleHeightRange[1],scale:1};
                    let mastModel=this._addMastModel(modelInfo.x,modelInfo.y,modelInfo.z,url,1,2.2);
                    console.log('mast add!');
                    mastModel.entityID=id;
                    modelInfo.mastname=name;
                    mastModel.mastInfo=modelInfo;
                    mastEntities.push(mastModel);
                });
            });
            this.addClickEvent();
        }

    };

    clearMasts(){
        this.mastModelDS.entities.removeAll();
        mastEntities.splice(0, mastEntities.length);
        this.showOtHideMastLabel(false);
        this.removeClickEvent();
        console.log('mast clear!');
    };

    hideMasts(isVisible){
        //this.hideVisibleModel(mastEntities,isVisible);
        mastEntities.forEach((mastEntity) => {
            if(this.mastModelDS.entities.contains(mastEntity)){
                this.mastModelDS.entities.remove(mastEntity);
            }
            if(isVisible){
                this.mastModelDS.entities.add(mastEntity);
                mastEntity.show = true;
            }
        });

        this.showOtHideMastLabel(isVisible);
        if(isVisible)
        	this.viewer.zoomTo(mastEntities,new Cesium.HeadingPitchRange(0.0, -0.35,2000));
        console.log('mast show:'+ isVisible);
    };

    showOtHideMastLabel(isshow){
        this.mastLabelDS.entities.removeAll();
        if(isshow){
            mastEntities.forEach((mastEntity)=>{
                let mastInfo = mastEntity.mastInfo;
                this._addMastLable(mastInfo,new RectLabelBuilder({
                    text:mastInfo.mastname.toString(),
                    width:39,
                    height:28,
                    offset:[0,6]}),this.mastLabelDS.entities,100,0,0);
            });
        }
    };

    addClickEvent(){
        this.otherHandle.setInputAction((click)=>{
            //先清除之前的高亮效果
            this.highLightMastEntity(this.selectEntity,false);
            //获取当前选中的模型，name区分风场，风机，测风塔，升压塔；entityID为数据库中编号
            this.selectEntity=this.getPickEntity(click.position);
            if(Cesium.defined(this.selectEntity)){
                let height=(this.selectEntity.name==='mast')?this.mastHeight:0;
                this._mastTopCenterCarcesian=this._getModelTopCarcesian(this.selectEntity,height);
            }
            this.highLightMastEntity(this.selectEntity,true);
            let entityID=Cesium.defined(this.selectEntity)&&(this.selectEntity.name==='mast'||this.selectEntity.name==='mastLabel')?this.selectEntity.entityID:'';
            store.commit('clickMastInfo', {
                'mastId': entityID,
                'bool':!!(Cesium.defined(this.selectEntity)&&(this.selectEntity.name==='mast'||this.selectEntity.name==='mastLabel')),
                'clientX': click.position.x,
                'clientY': click.position.y
            });
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.viewer.scene.preUpdate && this.viewer.scene.preUpdate.addEventListener(this._addPerUpdate, this);
    };

    highLightMastEntity(entity,isHigh){
        if(Cesium.defined(entity)){
            if(entity.name==='mast'||entity.name==='mastLabel'){
                if(Cesium.defined(entity.model)){
                    entity.model.color=isHigh?Cesium.Color.fromCssColorString('#00B851'):Cesium.Color.fromCssColorString('#FFF');
                }
                if(Cesium.defined(entity.billboard)&&entity.pngBuilder){
                    entity.pngBuilder.backColor=isHigh?'#ff282c':'#f48a0d';
                    entity.billboard.image=entity.pngBuilder.drawLabel().toDataURL();
                }
            }

        }
    };

    clearHighMast(){
        this.highLightMastEntity(this.selectEntity,false);
        this.selectEntity=null;
    };

    removeHandleEvent(){
        this.otherHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.viewer.scene.preUpdate&&this.viewer.scene.preUpdate.removeEventListener(this._addPerUpdate,this);
    };

    _addPerUpdate(scene,time){
        let entityID='',position={x:undefined,y:undefined};
        if(Cesium.defined(this.selectEntity)&&(this.selectEntity.name==='mast'||this.selectEntity.name==='mastLabel')){
            position=this.getWinPosByCartesian(this._mastTopCenterCarcesian);
            entityID=this.selectEntity.entityID;
        }
        let height = Math.ceil(this.viewer.camera.positionCartographic.height);
        if(height>farmVisibleHeightRange[0]) {
            this.hideVisibleModel(mastEntities,false);
            this.hideVisibleModel(this.mastLabelDS.entities.values,false);
        } else{
            this.hideVisibleModel(mastEntities,true);
            this.hideVisibleModel(this.mastLabelDS.entities.values,true);
        }
        store.commit('getHubCenterByClickMast', {
            'mastId': entityID,
            'clientX':Cesium.defined(position)?position.x:undefined,
            'clientY':Cesium.defined(position)?position.y:undefined
        });

    };

    removeClickEvent(){
        this.otherHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    _addMastModel(lon,lat,alt,url,scale,offset){
       let position=Cesium.Cartesian3.fromDegrees(lon,lat, alt+scale*offset);
       const FanOrientation = Cesium.Transforms.headingPitchRollQuaternion(position, farmhpr);
       return  this.mastModelDS.entities.add({
           position : position,
           name:'mast',
           orientation : FanOrientation,
           show:false,
           model:{
               uri : url,
               scale:scale,
               minimumPixelSize:100,
               colorBlendMode:Cesium.ColorBlendMode.MIX,
               color:Cesium.Color.WHITE,
               colorBlendAmount:0.8,
               distanceDisplayCondition: new Cesium.DistanceDisplayCondition(fanVisibleHeightRange[0],fanVisibleHeightRange[1])/**/
           }
       });
    }


    _addMastLable(mastInfo,pngBuilder,entities,height,offsetx,offsety){
        let image=pngBuilder.drawLabel().toDataURL();
        let entity=entities.add({
            id:mastInfo.id+'LABEL',
            position: Cesium.Cartesian3.fromDegrees(mastInfo.x+offsetx, mastInfo.y+offsety, mastInfo.z+height),
            name:mastInfo.name+'Label',
            billboard: {
                image :image,
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(0.0,-height/2),
                scaleByDistance : new Cesium.NearFarScalar(3.0e3, 1.0, 5.0e3, 0.8),
               // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(fanVisibleHeightRange[0],fanVisibleHeightRange[1]),
                disableDepthTestDistance:Number.POSITIVE_INFINITY
            }
        });
        entity.entityID=mastInfo.id;
        entity.pngBuilder=pngBuilder;
    };

    _getModelTopCarcesian(entity,height){
        let modelMatrix = new Cesium.Matrix4();
        Cesium.Transforms.eastNorthUpToFixedFrame(entity.position._value, this.viewer.scene.globe.ellipsoid, modelMatrix);
        //将风机的底部中心点上移一个风机轮毂的高度
        let martrix = Cesium.Matrix4.multiplyByTranslation(modelMatrix, new Cesium.Cartesian3(0, 0,height), new Cesium.Matrix4());
        return new Cesium.Cartesian3(martrix[12],martrix[13],martrix[14]);
    }

    _addBIMStation (url,point,rotation) {
        let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(point[0], point[1], point[2]));
        Cesium.Matrix4.multiplyByMatrix3(modelMatrix, Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotation)), modelMatrix);
        let tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: url,
            modelMatrix: modelMatrix,
            luminanceAtZenith: 0.2,
            lightColor: new Cesium.Cartesian3(0.3, 0.3, 0.3),
            // maximumScreenSpaceError: 8,
            // maximumMemoryUsage: 1024,
        }));
        this.viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 0));
        return tileset;
    }

}

export  default otherMoudle;
