/* eslint-disable */
/**
 * Created by pengYX on 2018/5/9.
 */

import Cesium from 'cesium/Cesium';
//let Cesium =require('../../../../static/thirdParty/Cesium/Cesium');
import BaseGloble from './baseGloble';
import {
    noiseFiledUrl, fanCenterHight, fanEntities, fanVisibleHeightRange, farmhpr,farmhprWT, roadPathUrl, towerPathUrl, syzPathUrl,
    ACTIONTYPE,
    baseS3Path, fanScale, DxfServerIp, highModelColor, lineRestrict, terrianLevel, restrictUrl, redlineUrl,
    chinaRoadInfo, farmEntities, farmVisibleHeightRange
} from './constants';
import StreamLine from '../otherModle/streamLine';
import ThreeLoad from '../otherModle/threeLoad';
import CollectLineEdit from '../otherModle/collectLineEdit';
import DxfCollectline from '../otherModle/dxfCollectLine';
import FlypathMoudle from './flypathMoudle';
import StationEdit from '../otherModle/stationEdit';
import InsideRoadEdit from '../otherModle/insideRoadEdit';
import EditRestrictArea from  '../otherModle/editRestrictArea';
import DrawPrimitiveHelper from '../otherModle/drawEditHelper/drawPrimitiveHelper';

import TerrianTool from '../otherModle/terrianTool';

import store from '../../../store/index';
import PNGBuilder from '../otherModle/pngBuilder';
const turf = require('../../../../static/thirdParty/turf');
import RectLabelBuilder from "../otherModle/rectLabelBuilder";

import {vertifyLonLat} from "./utilGISFunc";

function contains(arr, obj) {
    let i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

class fanMoudle extends BaseGloble{

    constructor (viewer,modelUrl,threecontainer){
        super(viewer);

        this.PRJID=0, this._schemeMode=true;
        this.redLineArea=null;
        this.turbineURL=modelUrl;
        this.action=ACTIONTYPE.PICK;
        this.threeContainer=threecontainer;
        this._scene=viewer.scene;

        this.selectFanTopCenterCartesian=undefined;//存储被选中的风机模型的轮毂顶部中心点位置，用于信息弹窗位置计算
        this.fanHeight=100;

        this.fanGroupLabelDS=new Cesium.CustomDataSource('fanGroupLabel');
        this.fanLabelDS=new Cesium.CustomDataSource('fanLabel');
        this.fanCustomLabelDS=new Cesium.CustomDataSource('fanCustomLabel');//等效小时数标签
        this.viewer.dataSources.add(this.fanLabelDS);
        this.viewer.dataSources.add(this.fanGroupLabelDS);
        this.viewer.dataSources.add(this.fanCustomLabelDS);

        this.selectEntity=undefined;//优化排布用，当前被选中的风机Entity
        this.restrictEntity={"lake":[],"house":[],"road":[]};//自定义限制区Entity(图谱同级别使用)
        this.tmpEntity=undefined;   //优化排布用，移动风机过程中的临时风机Entity
        this.tmpLine=undefined;     //优化排布用，移动风机过程中的线型箭头
        this.tmpLinePositions=[];    //优化排布用，移动风机过程中的线型箭头的点坐标



        this.fanHandle= new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);//正常状态下使用
        this.moveHandle=new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);//编辑过程中使用
        this.fanEditHandle=new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        this.tmpDS=new Cesium.CustomDataSource('tmp');
        this.viewer.dataSources.add(this.tmpDS);
        let point=[[37584842.0,2978418.0],[37592257.0,2984193.0]];
        let minPoint=this.xiAnCoordTo84BL({x:point[0][0],y:point[0][1]});
        let maxPoint=this.xiAnCoordTo84BL({x:point[1][0],y:point[1][1]});
        this.extentPos=[[minPoint.x,minPoint.y],[maxPoint.x,maxPoint.y]];
        this.terrianTool=new TerrianTool(viewer);

        Cesium.GeoJsonDataSource.fill=Cesium.Color.HOTPINK.withAlpha(0.6);
        this.restrictDS= new Cesium.GeoJsonDataSource('restrict');
        viewer.dataSources.add(this.restrictDS);

        this.editRestrictArea=new EditRestrictArea(this.viewer);
    };

    /**********************************************    风机添加删除功能    ********************************************/
    /**
     * 方案模式切换
     * @param {Boolean}isgoldForm    是否为form模式  true--goldform模式，false--wt模式
     */
    setSchemeMode(isgoldForm){
        this._schemeMode=isgoldForm;
    };

    createFans(url,fansInfo){
        this.clearFans();
        if(fansInfo.length<1){
            return;
        }
        if(Cesium.defined(this.viewer.terrainProvider)){
            let positionHegihts=[],fanmodel=undefined;
            fansInfo.forEach((model)=>{
                positionHegihts.push(Cesium.Cartographic.fromDegrees(model.x, model.y));
            });
            let hpr = this._schemeMode?farmhpr:farmhprWT;
            Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider,positionHegihts).then((updateHeights)=>{
                updateHeights.forEach((modelCoord,index)=>{
                    if(!Cesium.defined(modelCoord.height)||modelCoord.height<0)
                        modelCoord.height=0;
                    let id=Cesium.defaultValue(fansInfo[index].turbineId,index);
                    let modelInfo={'fanName':fansInfo[index].name?fansInfo[index].name:id,name:"fan",x:Cesium.Math.toDegrees(modelCoord.longitude),y:Cesium.Math.toDegrees(modelCoord.latitude),z:modelCoord.height,id:id,url:url,near:fanVisibleHeightRange[0],far:fanVisibleHeightRange[1],scale:fanScale};
                    //fanmodel=this.addModel(modelInfo,fanCenterHight,farmhpr);
                    fanmodel=this._createFanWithLabel(modelInfo,fanCenterHight,hpr);
                    fanmodel.fanInfo={'fanName':fansInfo[index].name?fansInfo[index].name:id,'fanId':id,'coords':[modelInfo.x,modelInfo.y,modelInfo.z]};
                    fanEntities.push(fanmodel);
                });
                //this.showOrHideFanNameLabel(true);
                this.addFanEventHandle();
            },(error)=>{
                fansInfo.forEach((model,index)=>{
                    let id=Cesium.defaultValue(model.turbineId,index);
                    let modelInfo={fanName:model.name,name:"fan",x:model.x,y: model.y,z:0,id:id,url:url,near:fanVisibleHeightRange[0],far:fanVisibleHeightRange[1],scale:fanScale};
                    fanmodel=this._createFanWithLabel(modelInfo,fanCenterHight,hpr);
                    fanmodel.fanInfo={'fanName':model.name?model.name:id,'fanId':id,'coords':[model.x,model.y,modelInfo.z]};
                    fanEntities.push(fanmodel);
                });
                //this.showOrHideFanNameLabel(true);
                this.addFanEventHandle();
            });
        }
    };

    _createFanWithLabel (fanInfo,offsetHigh,hpr) {
        let color=undefined,isCusColor=false,yellowArry=['SJ29','SJ31','SJ32'],blueArry=['SJ13', 'SJ27'],orangeArry=['B01'];
        if(this.PRJID===55883&&!this._schemeMode){
            isCusColor=true;
            color=undefined;
            if(isCusColor&&contains(yellowArry,fanInfo.fanName)){
                color='#eb2867';
            }
            if(isCusColor&&contains(blueArry,fanInfo.fanName)){
                color='#8c49fb';
            }
            if(isCusColor&&contains(orangeArry,fanInfo.fanName)){
                color='#12cfbd';
            }
        }
        let pinBuilder = new PNGBuilder({
            text:fanInfo.fanName.toString(),
            width:39,
            height:42,
            color:color,
            offset:[0,3]});
        offsetHigh=Cesium.defaultValue(offsetHigh ,0);
        let position = Cesium.Cartesian3.fromDegrees(fanInfo.x, fanInfo.y, fanInfo.z+ fanInfo.scale*offsetHigh);
        const FanOrientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        let entity = this.entities.add({
            id: fanInfo.id.toString(),
            name:'fan',
            position:position,
            orientation: FanOrientation,
            model:{
                uri: fanInfo.url,
                allowPicking: true,
                show: true,
                incrementallyLoadTextures: false,
                scale:fanInfo.scale,
                minimumPixelSize:7,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(fanInfo.near,fanInfo.far)
            },
            billboard:{
                image : pinBuilder.drawFanLabel().toDataURL(),
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(15, -1),
                disableDepthTestDistance:farmVisibleHeightRange[0],
                scaleByDistance : new Cesium.NearFarScalar(3.0e3, 1.0, 7.5e3, 0.9)
            }
        });
        entity.pngBuilder=pinBuilder;
        entity.entityID=fanInfo.id;
        return entity;
    };

    clearFans(){
        this.selectEntity = undefined;
        this.clearModels(fanEntities);
        this.showOrHideFanNameLabel(false);
        this.removeFanEventHandle();
    };

    hideFans(isVisible){
        this.hideVisibleModel(fanEntities,isVisible);
        this.hideVisibleModel( this.fanLabelDS.entities.values,isVisible);
    };

    /**
     * 更改风机的颜色
     * @param fanID         需要更改的风机的编号
     * @param color         需要更改的颜色值
     */
    changeFanColor(fanID,color){
        fanEntities.forEach((fanEntity)=>{
            if(fanEntity.entityID===fanID){
                this.changeModelEntityColor(fanEntity,color);
            }
        });
    };

    locationFanModle(fanID){
        fanEntities.forEach((fanEntity)=>{
            if(fanEntity.entityID===fanID){
                this.viewer.flyTo(fanEntity, {
                    offset : {
                        heading : Cesium.Math.toRadians(0.0),
                        pitch : Cesium.Math.toRadians(-25),
                        range : 500
                    }
                });
            }
        });
    };

    //框选风机
    selectFanByRectangle(){
        if(!Cesium.defined(this.drawPrimitiveHepler)){
            this.drawPrimitiveHepler=new DrawPrimitiveHelper(this.viewer);
        }
        let inRectFanInfo=[],_self=this;
        return new Promise((resolve)=>{
            this.drawPrimitiveHepler.startDrawingPolygon({//startDrawingRectangle
                isClapOnTerrian:true,
                appearance:new Cesium.ColorGeometryInstanceAttribute(1.0, 1.0, 1.0, 0.5),
                callback:function (positions) {
                    let entityID=undefined,latLons=[],point=undefined,isWithIn=false;
                    positions.forEach((position)=>{
                        latLons.push(_self.cartesianToDegrees(position));
                    });
                    latLons.push(_self.cartesianToDegrees(positions[0]));
                    let rect=turf.polygon([latLons]);

                    fanEntities.forEach((fanEntity)=>{
                        entityID=fanEntity.entityID;
                        point=turf.point(fanEntity.fanInfo.coords);
                        isWithIn=turf.booleanWithin(point, rect);
                        if(isWithIn) {
                            inRectFanInfo.push({'turbine_id':entityID,'turbine_name':fanEntity.fanInfo.fanName});
                        }
                    });
                    resolve(inRectFanInfo);
                }
            });
        });
    };

    stopSelectFanByRectangle(){
        if(Cesium.defined(this.drawPrimitiveHepler)){
            this.drawPrimitiveHepler.stopDrawing();
            this.drawPrimitiveHepler._tooltip&&this.drawPrimitiveHepler._tooltip.setVisible(false);
        }
    };

    /**
     * 批量定位风机
     * @param fansID          [7562,4578,4564]   要定位的风机id数组
     * @param isHighLight     true/false         是否高亮显示
     * @param color           [1,1,1,1]          高亮显示的颜色  r,g,b,a风量值（0-1之间）
     */
    locationFans(fansID,isHighLight,color){
        let locatFans=[];
        let fancolor=Cesium.defined(color)?new Cesium.Color(color[0],color[1],color[2],color[3]):Cesium.Color.RED.withAlpha(0.8);
        fansID.forEach((fanID)=>{
            fanEntities.find((value)=> {
                if(value.entityID === fanID) {
                    locatFans.push(value);
                    if(isHighLight){
                        this.changeModelEntityColor(value,fancolor);
                    }
                    return true;
                }
                return false;
            });
        });
        this.viewer.flyTo(locatFans, {
            offset : {
                heading : Cesium.Math.toRadians(0.0),
                pitch : Cesium.Math.toRadians(-25)
            }
        });
    };

    /**
     * 展示/隐藏风机名称标签
     * @param isShow
     */
    showOrHideFanNameLabel(isShow) {
        fanEntities.forEach((fanEntity) => {
            if(fanEntity.billboard){
                fanEntity.billboard.show = isShow;
            }
        });
    };

    /**
     * 展示/隐藏风机名称标签
     * @param isShow
     */
   /* showOrHideFanNameLabelOld(isShow){
        this.fanLabelDS.entities.removeAll();
        if(isShow) {
            let color=undefined,isCusColor=false,yellowArry=['SJ29','SJ31','SJ32'],blueArry=['SJ13', 'SJ27'],orangeArry=['B01'];
            if(this.PRJID===55883&&!this._schemeMode){
                isCusColor=true;
            }
            fanEntities.forEach((fanEntity) => {
                let fanInfo = fanEntity.fanInfo;
                color=undefined;
                if(isCusColor&&contains(yellowArry,fanInfo.fanName)){
                    color='#eb2867';
                }
                if(isCusColor&&contains(blueArry,fanInfo.fanName)){
                    color='#8c49fb';
                }
                if(isCusColor&&contains(orangeArry,fanInfo.fanName)){
                    color='#12cfbd';
                }
                if(Cesium.defined(fanInfo.fanName)){
                    this._addFanLableNew(fanInfo,new PNGBuilder({
                        text:fanInfo.fanName.toString(),
                        width:39,
                        height:42,
                        color:color,
                        offset:[0,3]}),this.fanLabelDS.entities,5,0.0,-0.0);
                }

            });
        }
    };*/

    /**
     * 根据指定的颜色进行风机标签的渲染
     * @param {Object[]}fanIDS          风机编号ID
     * @param {String}color             标签颜色
     */
    showGroupFanLabel(fanIDS,color){
        this.showOrHideFanNameLabel(false);
        let entities=this.fanGroupLabelDS.entities;
        fanIDS.forEach((fanID)=>{
            let fanLabel=entities.getById(fanID+'LABEL');
            if(Cesium.defined(fanLabel)){
                fanLabel.pngBuilder.waterColor=color;
                fanLabel.billboard.image=fanLabel.pngBuilder.reDrawCanvas().toDataURL();
            }else{
                let fanEntity= this.getFanEntityByID(fanID);
                if(!Cesium.defined(fanEntity)){return;}
                let fanInfo = fanEntity.fanInfo;
                this._addFanLableNew(fanInfo,new PNGBuilder({
                    text:fanInfo.fanName.toString(),
                    width:39,
                    height:41,
                    color:color,
                    offset:[0,3]}),this.fanGroupLabelDS.entities,5,0.0,-0.0);//-0.0002
            }
        });
    };

    /**
     * 移除风机分组标签
     */
    removeGroupFanLabel(){
        this.fanGroupLabelDS.entities.removeAll();
        this.showOrHideFanNameLabel(true);
    };

    _addFanLableNew(fanInfo,pngBuilder,entities,height,offsetx,offsety){
        let image=pngBuilder.drawFanLabel().toDataURL();
        let entity=entities.add({
            id:fanInfo.fanId+'LABEL',
            position: Cesium.Cartesian3.fromDegrees(fanInfo.coords[0]+offsetx, fanInfo.coords[1]+offsety, fanInfo.coords[2]),
            name: 'fanLabel',
            billboard: {
                image :image,
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(0.0, height),
                /*pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.0e3, 1.0, 1.5e6, 0.0),
                translucencyByDistance : new Cesium.NearFarScalar(1.0e3, 1.0, 1.5e6, 0.1),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(fanVisibleHeightRange[0],fanVisibleHeightRange[1]),*/
                disableDepthTestDistance:Number.POSITIVE_INFINITY,
                scaleByDistance : new Cesium.NearFarScalar(3.0e3, 1.0, 7.5e3, 0.9)
            }
        });
        entity.entityID=fanInfo.fanId;
        entity.pngBuilder=pngBuilder;
    };


    /**
     * 根据扇区方向旋转风机模型角度
     * @param angle
     */
    changeFanRotaAngle(angle){
        let hpr=new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(angle+180),  Cesium.Math.toRadians(0), Cesium.Math.toRadians(0));
        fanEntities.forEach((entity)=>{
            let position = entity.position._value;
            entity.orientation=Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        });
    };

    _addPerUpdate(scene,time){
        let entityID='',position={x:undefined,y:undefined};
        if(Cesium.defined(this.selectEntity)&&(this.selectEntity.name==='fan'||this.selectEntity.name==='fanLabel' && this.selectFanTopCenterCartesian)){
            position=this.getWinPosByCartesian(this.selectFanTopCenterCartesian);
            entityID=this.selectEntity.entityID;
        }
        store.commit('getHubCenterByClickFan', {
            'fanId': entityID,
            'clientX':Cesium.defined(position)?position.x:undefined,
            'clientY':Cesium.defined(position)?position.y:undefined
        });
        let height = Math.ceil(this.viewer.camera.positionCartographic.height);
        if(height>farmVisibleHeightRange[0]) {
            this.hideVisibleModel(fanEntities,false);
            this.hideVisibleModel(this.fanLabelDS.entities.values,false);
            this.hideVisibleModel(this.fanGroupLabelDS.entities.values,false);
        } else{
            this.hideVisibleModel(fanEntities,true);
            this.hideVisibleModel(this.fanLabelDS.entities.values,true);
            this.hideVisibleModel(this.fanGroupLabelDS.entities.values,true);
        }
    };

    _getFanTopCarcesian(entity){
        let modelMatrix = new Cesium.Matrix4();
        Cesium.Transforms.eastNorthUpToFixedFrame(entity.position._value, this._scene.globe.ellipsoid, modelMatrix);
        //将风机的底部中心点上移一个风机轮毂的高度
        let martrix = Cesium.Matrix4.multiplyByTranslation(modelMatrix, new Cesium.Cartesian3(0, 0,this.fanHeight), new Cesium.Matrix4());
        return new Cesium.Cartesian3(martrix[12],martrix[13],martrix[14]);
    }

    /*************************加载方案（创建风机createFans调用）后（优化排布未启动）球体交互***************************/

    addFanEventHandle(){
        let topPosition={x:undefined,y:undefined};
        this.fanHandle.setInputAction((click)=>{
            let selEntity = this.getPickEntity(click.position);
            if(this.selectEntity===selEntity){
                return ;
            }
            //先清除之前的高亮效果
            this.highLightFanEntity(this.selectEntity,false);
            //获取当前选中的模型，name区分风场，风机，测风塔，升压塔；entityID为数据库中编号
            let entityID=Cesium.defined(selEntity)&&(selEntity.name==='fan'||selEntity.name==='fanLabel')?selEntity.entityID:'';
            if(Cesium.defined(selEntity)&&(selEntity.name==='fan'||selEntity.name==='fanLabel')){
                this.selectFanTopCenterCartesian=this._getFanTopCarcesian(selEntity);//获取被选中的风机的顶部中心点的世界坐标
                topPosition=this._getFanTopCarcesian(selEntity);
            }
            store.commit('clickFanInfo', {
                'fanId': entityID,
                'bool':!!(Cesium.defined(selEntity)&&(selEntity.name==='fan'||selEntity.name==='fanLabel')),
                'clientX': Cesium.defined(topPosition)?topPosition.x:null,
                'clientY': Cesium.defined(topPosition)?topPosition.y:null
            });
            this.highLightFanEntity(selEntity,true);
            let position=this.getLatLngByWinPos(click.position);
            if(Cesium.defined(selEntity)&&((selEntity.name==='fan'||selEntity.name==='fanLabel')&&this.action===ACTIONTYPE.PICK)){
                this.fanClickListener && this.fanClickListener(entityID, Cesium.defined(topPosition)?topPosition.x:null, Cesium.defined(topPosition)?topPosition.y:null,Cesium.defined(position)?position.x:null, Cesium.defined(position)?position.y:null);
            }else{
                this.fanClickListener && this.fanClickListener(null, Cesium.defined(topPosition)?topPosition.x:null, Cesium.defined(topPosition)?topPosition.y:null,Cesium.defined(position)?position.x:null, Cesium.defined(position)?position.y:null);
            }
            this.selectEntity = selEntity;
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.viewer.scene.preUpdate && this.viewer.scene.preUpdate.addEventListener(this._addPerUpdate, this);
    };

    changeModelEntityColor(entity,color){
        if(Cesium.defined(entity)){
             if(Cesium.defined(entity.model)){
                 entity.model.color=Cesium.Color.fromCssColorString(color);
             }
            /* if(Cesium.defined(entity.billboard)&&entity.pngBuilder){
                 entity.pngBuilder.waterColor='#ff282c';
                 entity.billboard.image=entity.pngBuilder.reDrawCanvas();
             }*/
        }

    };

    highLightFanEntity(entity,isHigh){
        if (Cesium.defined(entity)) {
            if (entity.name === 'fan' || entity.name === 'fanLabel') {
                if (Cesium.defined(entity.model)) {
                    entity.model.color = isHigh ? Cesium.Color.fromCssColorString('#00B851') : Cesium.Color.fromCssColorString('#FFF');
                }
                if (Cesium.defined(entity.billboard) && entity.pngBuilder) {
                    entity.pngBuilder.waterColor = isHigh ? '#ff282c' : '#00B851';
                    entity.billboard.image = entity.pngBuilder.reDrawCanvas().toDataURL();
                }
            }
        }
    };

    clearHighLightFan(){
        this.highLightFanEntity(this.selectEntity,false);
        this.selectEntity=null;
    };

    removeFanEventHandle(){
        this.fanHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.viewer.scene.preUpdate&&this.viewer.scene.preUpdate.removeEventListener(this._addPerUpdate,this);
    };

    getLatLngByWinPos(posWin) {
        //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
        let ray = this.viewer.camera.getPickRay(posWin);
        let cartesian = this.viewer.scene.globe.pick(ray,this.viewer.scene);
        return this.changeCoordToLatLon(cartesian);
    };
    /***********************************优化排布启动（starrtEdit(true)）后球体交互*************************************/

    addEditFanEventHandle(){
        this.fanEditHandle.setInputAction((click)=>{
            //先清除之前的高亮效果
            this.changeModelEntityColor(this.selectEntity,'#FFF');
            //获取当前选中的模型，name区分风场，风机，测风塔，升压塔；entityID为数据库中编号
            this.selectEntity=this.getPickEntity(click.position);
            this.changeModelEntityColor(this.selectEntity,'#00B851');
            let entityID=Cesium.defined(this.selectEntity)&&(this.selectEntity.name==='fan')?this.selectEntity.entityID:'';
            store.commit('clickFanInfo', {
                'fanId': entityID,
                'bool':!!(Cesium.defined(this.selectEntity)&&(this.selectEntity.name==='fan')),
                'clientX': click.position.x,
                'clientY': click.position.y
            });
            let position=this.getLatLngByWinPos(click.position);
            if(Cesium.defined(this.selectEntity)&&(this.selectEntity.name==='fan')&&this.action===ACTIONTYPE.EDIT){
                this.fanClickListener && this.fanClickListener(entityID, click.position.x, click.position.y, Cesium.defined(position)?position.x:null, Cesium.defined(position)?position.y:null);
            }else{
                this.fanClickListener && this.fanClickListener(null, click.position.x, click.position.y,Cesium.defined(position)? position.x:null,Cesium.defined(position)? position.y:null);
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    removeEditFanEventHandle(){
        this.fanEditHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    /******************************************移动按钮启动(moveFan())球体交互*****************************************/

    addFanMoveEventHandle(){

        //左键按下取消移动并结束移动动作
        this.moveHandle.setInputAction((click)=>{
            this.changeModelEntityColor(this.selectEntity,"#FFF");
            this._removeTmpFanAndLine(this.tmpEntity,this.tmpLine);
            this.tmpLinePositions=[];
            this.selectEntity=undefined;
            this.removeFanMoveEventHandle();
            this.action=ACTIONTYPE.EDIT;
            // 修改取消移动风机后鼠标依旧为十字的问题
            this.fanMoveEndListener && this.fanMoveEndListener('', null,null,null,null);
            store.commit('moveFanInfo', {
                'fanId': Cesium.defined(this.selectEntity)?this.selectEntity.entityID:'',
                'bool':false,
                'clientX': click.position.x,
                'clientY': click.position.y
            });
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.moveHandle.setInputAction((movement)=>{
            let coord=this._scene.globe.pick(this.viewer.camera.getPickRay(movement.endPosition),this._scene);//this.getCoordByWinPos(movement.endPosition);
            let position=this.changeCoordToLatLon(coord);
            let isContain=true;
            if(Cesium.defined(position)){
                let point = turf.point([position.x,position.y]);
                //2.判断点是否在面里
                if(Cesium.defined(this.redLineArea)){
                    isContain=turf.booleanContains(this.redLineArea, point);
                }
            }
            if(!isContain||!Cesium.defined(position)){
                return;
            }
            Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider,[Cesium.Cartographic.fromDegrees(position.x, position.y)]).then((updateHeights)=>{
                if(!Cesium.defined(updateHeights[0].height)||updateHeights[0].height<=0){
                    updateHeights[0].height=0;
                    return;
                }
                let cartesian =  Cesium.Cartesian3.fromDegrees(position.x, position.y,updateHeights[0].height, this.viewer.scene.globe.ellipsoid);
                if(Cesium.defined(this.tmpEntity)){
                    this.tmpEntity.position=Cesium.Cartesian3.fromDegrees(position.x, position.y,updateHeights[0].height);//fromDegrees
                }else{
                    this.tmpEntity=this._addTmpModelEntity(this.turbineURL,{x:position.x,y:position.y,z:updateHeights[0].height});
                    this.tmpEntity.model.color=Cesium.Color.YELLOW;
                }
                if(this.tmpLinePositions.length>1){
                    this.tmpLinePositions.pop();
                }
                this.tmpLinePositions.push({x:coord.x,y:coord.y,z:coord.z});
                if(Cesium.defined(this.tmpLine)){
                    this.tmpLine.polyline.positions=this.tmpLinePositions;//new Cesium.CallbackProperty(positionArray,false);
                }else{
                    this.tmpLine=this._addTmpline(this.tmpLinePositions);
                }
            });
            store.commit('moveFanInfo', {
                'fanId': Cesium.defined(this.selectEntity)?this.selectEntity.entityID:'',
                'bool':true,
                'clientX': movement.endPosition.x,
                'clientY': movement.endPosition.y
            });

        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        //右键按下结束移动
        this.moveHandle.setInputAction((click)=>{
            if(Cesium.defined(this.selectEntity)){
                let carces=this._scene.globe.pick(this.viewer.camera.getPickRay(click.position),this._scene);this.getLatLngByWinPos(click.position);
                let coordN= Cesium.Cartographic.fromCartesian(carces);
                let position={x:Cesium.Math.toDegrees(coordN.longitude),y:Cesium.Math.toDegrees(coordN.latitude),z:coordN.height};

                let isContain=true;
                //风机ID，经度，纬度，大地坐标x,大地坐标y
                this.fanMoveEndListener && this.fanMoveEndListener(this.selectEntity.entityID, Cesium.defined(position)?position.x:null, Cesium.defined(position)?position.y:null, Cesium.defined(coord)?coord.x:null, Cesium.defined(coord)?coord.y:null);

                if(Cesium.defined(position)){
                    let point = turf.point([position.x,position.y]);
                    //2.判断点是否在面里
                    if(Cesium.defined(this.redLineArea)){
                        isContain=turf.booleanContains(this.redLineArea, point);
                    }
                }
                if(!isContain){
                    return;
                }

                let coord=this.BLH2xyz(position);//经纬度转米
             if(Cesium.defined(position)){
                    Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider,[Cesium.Cartographic.fromDegrees(position.x, position.y)]).then((updateHeights)=>{
                        if(Cesium.defined(updateHeights[0].height)&&updateHeights[0].height>0){
                            this.selectEntity.position=Cesium.Cartesian3.fromDegrees(position.x, position.y,updateHeights[0].height);
                        }
                        this.changeModelEntityColor(this.selectEntity,'#FFF');
                        this._removeTmpFanAndLine(this.tmpEntity,this.tmpLine);
                        this.selectEntity=undefined;
                    });
                }
            }else{
                this.fanMoveEndListener && this.fanMoveEndListener('', null,null,null,null);
            }
            store.commit('moveFanInfo', {
                'fanId': Cesium.defined(this.selectEntity)?this.selectEntity.entityID:'',
                'bool':false,
                'clientX': click.position.x,
                'clientY': click.position.y
            });
            this.action=ACTIONTYPE.EDIT;
            this.removeFanMoveEventHandle();
            this.addEditFanEventHandle();
        },Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    };

    removeFanMoveEventHandle(){
        this.moveHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.moveHandle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.moveHandle.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    /******************************************---移动风机过程中临时对象绘制---****************************************/

    //移动风机过程中使用的线
    _addTmpline(positions){
        this.tmpDS.entities.remove(this.tmpLabelEntity);
        return this.tmpDS.entities.add({
            name:'tmpLine',
            id:'tmpLine',
            polyline: {
                positions :positions,// Cesium.Cartesian3.fromDegreesArrayHeights(positions),
                width : 10,
                material : new Cesium.PolylineArrowMaterialProperty(new Cesium.Color(0.2, 0.784, 0.435, 1))//Cesium.Color.RED
            }
        });
    };

    //移动风机结束后清除线和虚拟风机
    _removeTmpFanAndLine(entity,lineEntity){
        this.tmpDS.entities.removeAll();
        this.tmpEntity=undefined;
        this.tmpLine=undefined;
        this.tmpLabelEntity=undefined;
    };

    //添加移动用临时风机
    _addTmpModelEntity(url,model){
        let id=Cesium.defaultValue(model.id,this.tmpDS.entities.values.length);
        let modelInfo={name:"fan",x:model.x,y:model.y,z:model.z,id:id,url:url,near:fanVisibleHeightRange[0],far:fanVisibleHeightRange[1],scale:fanScale};
        let position = Cesium.Cartesian3.fromDegrees(modelInfo.x, modelInfo.y, (modelInfo.z + modelInfo.scale*fanCenterHight));
        const FanOrientation = Cesium.Transforms.headingPitchRollQuaternion(position, farmhpr);
        return this.tmpDS.entities.add({
            name: modelInfo.name,
            entityID:modelInfo.id,
            position: position,
            orientation: FanOrientation,
            model: {
                uri: modelInfo.url,
                allowPicking: true,
                color: Cesium.Color.WHITE,
                show: true,
                shadows: Cesium.ShadowMode.ENABLED,
                incrementallyLoadTextures: true,
                colorBlendMode: Cesium.ColorBlendMode.MIX,
                heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                colorBlendAmount: 0.2,
                //scale:modelInfo.scale,
               // minimumPixelSize:128,
               // maximumScale:modelInfo.scale,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(modelInfo.near,modelInfo.far)
            }
        });

    };

    /**
     * 添加等效小时数标签
     * @param {String}id            风机编号
     * @param {String}text          等效小时数   换行使用/n
     * @param {Object}[style]         标签样式
     * @return {*||Entity}
     */
    addCustomLabel (id, text, style) {
        let modelEntity = this.entities.getById(id);
        if(!modelEntity){
            console.log('未找到指定id的风机.');
            return ;
        }
        let position = modelEntity.fanInfo.coords;
        let builder = new RectLabelBuilder({
            text: text,
            width: style.width,
            height: style.height,
            color: style.color,
            font: style.font
        });
        let billboard = {
            image: builder.drawLabel().toDataURL('image/png',1.0),
            heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
        };
        let entity = this.fanCustomLabelDS.entities.add({
            position: Cesium.Cartesian3.fromDegrees(position[0],position[1],110),
            id: id,
            billboard: billboard
        });
        entity.pngBuilder = builder;
        return entity;
    };

    /**
     * 修改等效小时数变化值
     * @param {String}id             风机编号
     * @param {Array}position        坐标位置,经纬度坐标  [110.23,35.26]
     * @param {String}text          等效小时数变化值   换行使用/n
     * @param {Object}[style]       标签样式
     */
    changeCustomLabel (id,position,text,style) {
        let entity = this.fanCustomLabelDS.entities.getById(id);
        if(!entity){
            console.log('未找到指定编号的等效小时数标签.');
            return ;
        }
        let builder = entity.pngBuilder;
        builder.text = text;
        builder.width = style.width;
        builder.height = style.height;
        builder.backColor = style.color;
        builder.fontSise = style.font;
        entity.position = Cesium.Cartesian3.fromDegrees(position[0],position[1],110);
        if(entity.billboard) {
            entity.billboard.image =  builder.drawLabel().toDataURL('image/png',1.0);
        }
    };

    /**
     * 移除所有的等效小时数标签
     */
    removeCustomLabels () {
        this.fanCustomLabelDS.entities.removeAll();
    };

    /**
     * 移除指定风机编号的等效小时数标签
     * @param {String} id           要移除标签的风机编号
     */
    removeCustomLabel (id) {
        return this.fanCustomLabelDS.entities.removeById(id);
    };

    /**********************************************优化排布相关界面按钮功能********************************************/

    //优化排布
    startEdit(isOpen){
        if(isOpen){
            this.action=ACTIONTYPE.EDIT;
            this.removeEditFanEventHandle();
            this.removeFanEventHandle();
            this.addEditFanEventHandle();
        }else{
            this.action=ACTIONTYPE.PICK;
            this.removeFanEventHandle();
            this.removeEditFanEventHandle();
            this.addFanEventHandle();
        }
    };

    //移动
    moveFan () {
        this.action=ACTIONTYPE.MOVE;
        this.addFanMoveEventHandle();
        this.tmpLinePositions = [];//存储移动的线的顶点
        const pos = this.selectEntity.position._value;
        this.tmpLinePositions.push({x:pos.x,y:pos.y,z:pos.z});
    };

    //添加
    addOneFan(url,model){
        let id=Cesium.defaultValue(model.id,fanEntities.length),coords=[];
        Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider,[Cesium.Cartographic.fromDegrees(model.x, model.y)]).then((updateHeights)=>{
            if(updateHeights[0].height<0){
                updateHeights[0].height=0;
            }
            let modelInfo={name:"fan",x:model.x,y:model.y,z: updateHeights[0].height,id:id,url:url,near:fanVisibleHeightRange[0],far:fanVisibleHeightRange[1],scale:fanScale};
            let entity=this.addModel(modelInfo,fanCenterHight,farmhpr);
            entity.model.color=Cesium.Color.YELLOW;
            entity.fanInfo={'fanName':model.name,'fanId':id,'coords':[modelInfo.x,modelInfo.y,modelInfo.z]};
            fanEntities.push(entity);
        });
       // return entity;
    };

    //删除
    deleteOneFan (fanID) {
        fanEntities.forEach((entity, index) => {
            if (entity.entityID === fanID) {
                this.removeModel(entity);
                fanEntities.splice(index, 1);
            }
        });

    };

    //更换类型
    changeFanType(type,fanID){
        fanEntities.forEach((entity,index)=>{
            if(entity.entityID===fanID){
                //更换模型文件
                // entity.model.url=this.turbineURL;
            }
        });
    };

    /**
     * 风机编辑过程（添加和移动）是否超出风场范围
     * @param lon                   风机位置的经度
     * @param lat                   风机位置的纬度
     * @return {Promise}
     */
    fanIsOutOfTerrian(lon,lat){
       if(vertifyLonLat(lon,lat)){
           return this.terrianTool.sampleTerrianHight([{lon:lon,lat:lat}],terrianLevel);
       } else{
         return new Promise((resolve)=>{
             resolve(true);
         });
       }
    };

    /**
     * 根据红线区域判断是否超过风场范围
     * @param prjID         风场ID
     * @param lon           经度
     * @param lat           纬度
     */
    fanIsOutOfTerrianNew(prjID,lon,lat){
        //1.获取红线区域
        let url=baseS3Path+ prjID+'/UAV/output/'+ redlineUrl+'?t='+Date.parse(new Date());
        return new Promise((resolve)=>{
            Cesium.Resource.fetchJson({url:url}).then((data)=>{
                let polygon = turf.polygon(data.inner);
                let point = turf.point([lon,lat]);
                //2.判断点是否在面里
                let isContain=turf.booleanContains(polygon, point);
                //3.返回值
                resolve(!isContain);
            },()=>{
                resolve(false);
            });
        });
    };

    /**********************************************  加载VTK文件相关功能   ********************************************/

    createVTK(urls,name,positions){

    };

    /*--------------------综合---------------------*/
    //综合风图谱
    createIntegrateWindMap(prjID,positions,fanHeight,isOpen){
        if(!this.threeLoad){
            this.threeLoad=new ThreeLoad(this.threeContainer,this.viewer);
        }
        this.threeLoad.cleanThreeVTK('integrateWindMap');
        this.threeLoad.cleanThreeVTK('windMap');//与风图谱互斥
        if(isOpen){
           let index=(fanHeight-85)/5+1;
            let cfdFloder=this._schemeMode?'publicCFD':'public_wt_CFD';
            let commonPath=baseS3Path + prjID + '/Scheme/'+cfdFloder+'/MAP'+fanHeight;
            // let commonPath=baseS3Path + prjID + '/Scheme/'+cfdFloder+'/MAP'+index+'_'+fanHeight;
            return this.threeLoad.createIntegrateWindMap(commonPath,'integrateWindMap',positions,fanHeight);
        }
        return undefined;
    };

    //限制因素
    createRestrictOld(prjID,isOpen){
        if(isOpen===true){
            let url=baseS3Path+ prjID+'/Scheme/publicCFD/'+ restrictUrl;
            this.restrictDS.entities.removeAll();
            Cesium.Resource.fetchJson({url:url}).then((data)=>{
                for(let i=0;i<data.features.length;i++){
                    let feature=data.features[i];
                    if(feature.geometry.type==='Polygon'){
                        this._addPolygonEntity(feature.geometry.coordinates[0],feature.properties);
                    }
                    if(feature.geometry.type==='LineString'){
                        this._addPolyLineEntity(feature.geometry.coordinates,feature.properties)
                    }
                    if(i>900){
                        console.log(feature.properties.FID);
                        break;
                    }
                }
                //this.viewer.zoomTo(this.restrictDS.entities);
            });
        }else{
            this.restrictDS.entities.removeAll();
        }
    };

    //限制因素
    createRestrictBak(prjID,isOpen){
        this.restrictDS.entities.removeAll();
        if(isOpen){
            let url=baseS3Path+ prjID+'/Scheme/publicCFD/'+ restrictUrl+'?t='+Date.parse(new Date());
            this.restrictDS.load(url,{
                clampToGround:true
            }).then((ds)=>{
                ds.entities.values.forEach((entity)=>{
                    if(Cesium.defined(entity.polygon)&&Cesium.defined(entity.properties.gis_type)&&entity.properties.gis_type._value===2){
                        entity.polygon.material =  Cesium.Color.BLUE.withAlpha(0.5);
                    }
                });
            });
        }
    };

    createRestrict1(prjID,isOpen){
        if(!Cesium.defined(prjID)){
            return ;
        }
        this.restrictDS.entities.removeAll();
        this.restrictEntity={"lake":[],"house":[],"road":[]};
        this.editRestrictArea.removeDisplayServerRestrict();
        if(isOpen){
            let url=baseS3Path+ prjID+'/Scheme/publicCFD/'+ restrictUrl+'?t='+Date.parse(new Date());
            this.restrictDS.load(url,{
                clampToGround:true,
                show:false
            }).then((ds)=>{
                this.restrictEntity={"lake":[],"house":[],"road":[]};
                ds.entities.values.forEach((entity)=>{
                    if(Cesium.defined(entity.polygon)&&Cesium.defined(entity.properties.gis_type)&&entity.properties.gis_type._value===2){
                        this.restrictEntity.lake.push(entity);
                        entity.polygon.material =  Cesium.Color.BLUE.withAlpha(0.5);
                    }
                    if(entity.properties.gis_type._value===3){
                        this.restrictEntity.road.push(entity);
                    }
                    if(entity.properties.gis_type._value===1){
                        this.restrictEntity.house.push(entity);
                    }
                });
            });
        }
    };

    createRestrict(prjID,isOpen){
        if(!Cesium.defined(prjID)){
            return ;
        }
        this.restrictDS.entities.removeAll();
        this.restrictEntity={"lake":[],"house":[],"road":[]};
        this.editRestrictArea&&this.editRestrictArea.removeDisplayServerRestrict();
        if(isOpen) {
            let url = baseS3Path + prjID + '/Scheme/publicCFD/' + restrictUrl + '?t=' + Date.parse(new Date());
            Cesium.Resource.fetchJson({url: url}).then((data) => {
                this.restrictEntity = {"lake": [], "house": [], "road": []};
                for (let i = 0; i < data.features.length; i++) {
                    let feature = data.features[i];
                    if (feature.geometry.type === 'Polygon') {
                        if (feature.properties.gis_type === 2)
                            this.restrictEntity.lake.push(this._addPolygonEntity(feature.geometry.coordinates[0], feature.properties));
                        else if (feature.properties.gis_type === 1) {
                            this.restrictEntity.house.push(this._addPolygonEntity(feature.geometry.coordinates[0], feature.properties));
                        }
                    }
                    if (feature.geometry.type === 'LineString') {
                        this.restrictEntity.road.push(this._addPolyLineEntity(feature.geometry.coordinates, feature.properties));
                    }
                }
            });
        }
    };

    _showHideEntities(entityArr,isShow){
        entityArr.forEach((entity)=>{

            if(Cesium.defined(entity.polygon)) {
                entity.polygon.show=isShow;
                entity.polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
            }
        });
    }

    createLakeRestrict(url,prjID,isOpen){
        this.editRestrictArea&&this.editRestrictArea.displaySeversRestrict(url,"water",isOpen);
        this._showHideEntities(this.restrictEntity.lake,isOpen);
    };
    createHouseRestrict(url,prjID,isOpen){
        this.editRestrictArea&&this.editRestrictArea.displaySeversRestrict(url,"building",isOpen);
        this._showHideEntities(this.restrictEntity.house,isOpen);
    };
    createRoadRestrict(url,prjID,isOpen){
        this.editRestrictArea&&this.editRestrictArea.displaySeversRestrict(url,"road",isOpen);
        this._showHideEntities(this.restrictEntity.road,isOpen);
    };
    createRedLineArea(PrjID,isOpen){
        let url=baseS3Path+ PrjID+'/UAV/output/'+ redlineUrl+'?t='+Date.parse(new Date());
        this.editRestrictArea&&this.editRestrictArea.disPlayRedLineArea(url,isOpen);
    };

    /**
     * 渲染噪声图层
     * @param {Number}prjID             项目编号
     * @param {Number}schemeID          方案编号
     * @param {String}epsg              项目的EPSG号
     */
    createNoiseFiledold(prjID,schemeID,epsg){
    /*    let url=baseS3Path+ prjID+'/Scheme/'+schemeID+'/'+noiseFiledUrl;
        if(!Cesium.defined(this.noiseRenderHelper)){
            this.noiseRenderHelper=new NoiseRenderHelper(this.viewer,{});
        }
        return this.noiseRenderHelper.loadCSVNoiseFiled(url,epsg);*/
    };

    /**
     * 移除噪声图层
     */
    removeNoiseFiled(){
        if(Cesium.defined(this.noseEntity)){
            this.viewer.entities.remove( this.noseEntity);
        }
    };

    createNoiseFiled(prjID, schemeID, extent) {
        if(extent.length<4){
            console.log("噪声数据范围有误");
            return;
        }
        if(!vertifyLonLat(extent[0],extent[2])){
            console.log("噪声数据范围坐标有误");
            return;
        }
        let url = baseS3Path + prjID + '/Scheme/' + schemeID + '/' + noiseFiledUrl;
        this.noseEntity= this.viewer.entities.add({
            name: 'csv',
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(extent[0], extent[2], extent[1], extent[3]),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                material: new Cesium.ImageMaterialProperty({
                    image: url,
                    color: Cesium.Color.WHITE.withAlpha(0.3),
                    transparent: true,
                }),
                classificationType : Cesium.ClassificationType.TERRAIN
            }
        });
    };
    /*--------------------扇区---------------------*/

    createVTKLod(basePath,name,posCenter,isOpen){
        if(!this.threeLoad){
            this.threeLoad=new ThreeLoad(this.threeContainer,this.viewer);
        }
        this.threeLoad.cleanThreeVTK(name);
        if(isOpen){
            return new Promise((resolve,reject)=>{
                Cesium.Resource.fetchJson({url: basePath+'/sectorindex.json'}).then((data) => {
                    switch (name){
                        case 'windMap':
                            if(data.windMap.length>0){
                                data.windMap.reverse();
                                let floderName=data.windMap[0];
                                let p=  this.threeLoad.createWindMap( basePath +'/'+floderName,name,posCenter);
                                p.then((res)=>{
                                    resolve(res);
                                });
                            }
                            break;
                        case 'turbulenceArea':
                            if(data.Uk.length>0){
                                data.Uk.reverse();
                                let floderName=data.Uk[0];
                                let p=this.threeLoad.createTubulenceArea( basePath +'/'+floderName,name,posCenter);
                                p.then((res)=>{
                                    resolve({max:3,min:1});
                                });
                            }
                            break;
                        case 'shakeArea':
                            if(data.Uu.length>0){
                                data.Uu.reverse();
                                let floderName=data.Uu[0];
                                let p= this.threeLoad.createShakeArea( basePath +'/'+floderName,name,posCenter);
                                p.then((res)=>{
                                    resolve({max:5,min:1});
                                });
                            }
                            break;
                    }
                },(error)=>{
                    console.log('S3上文件不存在或者格式不正确,文件路径：',+basePath+'/sectorindex.json');
                    reject({"code":404,"url":basePath+'/sectorindex.json'});
                });
            });
        }
        return undefined;
    };

    //风图谱
    createWindMap(prjID,sectorID,positions, isOpen){
        let commonPath=baseS3Path + prjID + '/Scheme/publicCFD/' + sectorID;
        this.threeLoad.cleanThreeVTK('integrateWindMap');//与综合风图谱互斥
        return this.createVTKLod(commonPath,'windMap',positions,isOpen);
    };

    //风能切片
    createWindSplit(prjID,sectorID,vtkName, positions,isOpen){
        if(!this.threeLoad){
            this.threeLoad=new ThreeLoad(this.threeContainer,this.viewer);
        }
        this.threeLoad.cleanThreeVTK('windSplit');
        if(isOpen){
            let url= baseS3Path + prjID + '/Scheme/publicCFD/' + sectorID + '/windslice/'+vtkName;//构建S3路径
            this.threeLoad.cleanThreeVTK('windSplit');//如果已经加载的有风能切片则，把之前的风能切片移除
            return this.threeLoad.createWindSplit(url,'windSplit',positions);
        }
        return undefined;
    };

    //大湍流区
    createTurbulenceArea(prjID,sectorID, positions,isOpen){
        let commonPath=baseS3Path + prjID + '/Scheme/publicCFD/' + sectorID;
        return  this.createVTKLod(commonPath,'turbulenceArea',positions,isOpen);
    };

    //机组震动区
    createShakeArea(prjID,sectorID,positions, isOpen){
        let commonPath=baseS3Path + prjID + '/Scheme/publicCFD/' + sectorID;
        return  this.createVTKLod(commonPath,'shakeArea',positions,isOpen);
    };


    /************************************************     加载尾流功能     ********************************************/
    createWake(isOpen){
    };

	createStreamLine(prjID,sectionId,schemeId,isOpen){
		if(!Cesium.defined(this.streamLine)){
			this.streamLine=new StreamLine(this.viewer);
		}
		if(isOpen){
            let url=baseS3Path + prjID + '/Scheme/' + schemeId + '/'+ sectionId +'/streamLines.json';
			Cesium.Resource.fetchText({url:url}).then((data)=>{
               let daJson= JSON.parse(data.replace(/'/g, '"'));
				this.streamLine.createStreamLine(daJson);
			});
		}else{
			this.streamLine.removeStreamLine();
		}
	};

    /**************************************     线路（集电线路，道路，升压站）  ***************************************/
   /*******************道路**************************/
    loadDxfRoad(prjId,schemeId,fileInfo){
       let serverUrl='http://'+DxfServerIp+'/dxf_road';
       if(!Cesium.defined(this.flypathMoudle)){
           this.flypathMoudle=new FlypathMoudle(this.viewer);
       }
       return this.flypathMoudle.loadDxfRoad(prjId,schemeId,fileInfo,serverUrl);
   };

    createRoad (prjId, schemeId, isOpen) {
       let roadURL = baseS3Path + prjId + '/Scheme/' + schemeId + '/engineering/'+ roadPathUrl+'?t='+Date.parse(new Date());
        if (!Cesium.defined(this.flypathMoudle)) {
           this.flypathMoudle = new FlypathMoudle(this.viewer);
        }
        if (isOpen) {
            return this.flypathMoudle.loadRoad(roadURL);
        } else {
            this.flypathMoudle.removeRoad();
            return null;
        }
    };

    /**
     * 全新的道路加载方案
     * @param prjId         工程编号
     * @param schemeId      方案编号
     * @param isOpen        是否显示
     * @returns {*}
     */
    createInsideRoad (prjId, schemeId, isOpen) {
        let roadURL = baseS3Path + prjId + '/Scheme/' + schemeId + '/engineering/'+ roadPathUrl+'?t='+Date.parse(new Date());
        if (!Cesium.defined(this.insideRoadEdit)) {
            this.insideRoadEdit = new InsideRoadEdit(this.viewer);
        }
        if (isOpen) {
            //this.addChinaRoadLayer();
            return this.insideRoadEdit.loadLineRoad(roadURL);
        } else {
            //this.removeChinaRoadLayer();
            this.insideRoadEdit.removeRoad();
            return null;
        }
    };

    //获取道路各支线信息
    getInsideRoadsInfo(){
        return this.insideRoadEdit.getInsideRoadsInfo();
    };

    /**
     * 高亮显示当前选中的支线
     * @param insideRoadEntityID
     */
    highLightSelectBranchRoad(insideRoadEntityID){
        this.insideRoadEdit.highLightSelectBranchRoad(insideRoadEntityID);
    };

    /**
     * 获取道路支线的横断面数据
     * @param insideRoadEntityID        支线所在实体的entityID,
     *                                   值来自getInsideRoadsInfo方法中返回的entityId
     * @returns {*}
     */
    getInsideRoadCrossSection(insideRoadEntityID){
        return this.insideRoadEdit.getInsideRoadCrossSection(insideRoadEntityID);
    };

    /**
     * 开始编辑道路
     */
    startEditInsideRoad(){
        this.insideRoadEdit.initSubmitGeoJSON();
        this.insideRoadEdit.startEditInsideRoad();
    };

    /**
     * 停止场内道路的编辑状态
     */
    stopEditInsideRoad(){
        this.insideRoadEdit&&this.insideRoadEdit.stopEditInsideRoad();
    };

    startDeleteRoadLine(options){
        this.insideRoadEdit&&this.insideRoadEdit.startDeleteRoadLine(options);
    };

    stopDeleteRoadLine(){
        this.insideRoadEdit&&this.insideRoadEdit.stopDeleteRoadLine();
    };

    deleteRoadLineByEntity(entity){
        this.insideRoadEdit&&this.insideRoadEdit.deleteRoadByEntity(entity);
    };

    startSplitRoadLine(){
        this.insideRoadEdit&&this.insideRoadEdit.startSplitRoadLine();
    };

    stopSplitRoadLine(){
        this.insideRoadEdit&&this.insideRoadEdit.stopSplitRoadLine();
    };

    /**
     * 返回要上传至S3中的geoJSON对象
     * @returns {{type: string, features: Array}}
     */
    submitEditInsideRoad(){
        return this.insideRoadEdit.submitEditInsideRoad();
    };

    /**
     *定位起始点（包含移动和实时回传点位坐标）
     * @param lon
     * @param lat
     */
    locationStartPoint(lon,lat){
        let startEntity = this.insideRoadEdit.locationStartPoint(Cesium.Cartesian3.fromDegrees(lon, lat));
        startEntity.setEditable();//启动移动
        let point=undefined;
        let self=this;
        startEntity.addListener('drag', function (event) {
            //实时回传移动的点位坐标，需进行世界坐标转经纬度坐标，接口规则待约束  store.commit
            point=self.cartesianToDegrees(event.positions);
           // console.log(point);
            store.commit('roadStartPoint', {
                'lon': Cesium.defined(point)?point[0]:undefined,
                'lat': Cesium.defined(point)?point[1]:undefined,
            });
        });
    };

    /**
     * 移除道路起点
     */
    removeRoadStartPoint(){
        this.insideRoadEdit&&this.insideRoadEdit.removeRoadStartLoation();
    };

    //获取重新设计的默认参数
    getDesiginDefaultPara(){
        return this.insideRoadEdit.getDesiginDefaultPara();
    };

    /**
     * 加载全国道路服务图层
     */
    addChinaRoadLayer(){
        this.removeWMSLayerServer(this.chinaRoad);
        this.chinaRoad=this.createWMSImagery(chinaRoadInfo.url,chinaRoadInfo.layers);
    };

    /**
     * 移除全国道路服务图层
     */
    removeChinaRoadLayer(){
        this.removeWMSLayerServer(this.chinaRoad);
        this.chinaRoad=null;
    };

    /*******************限制区**************************/
    /**
     * 展示现有自动提取的限制区
     * @param prjId         工程ID
     * @param schemeId      方案ID
     * @param isOpen        是否开启
     * @param type          道路还是线路用限制区
     */
    displayReatrict(prjId,schemeId,isOpen,type){
        if(isOpen){
           // let url=baseS3Path + prjId +'/Scheme/' + schemeId + '/engineering/';
            //https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/123/Scheme/GisData/custom_restrict.json
            let url=baseS3Path + prjId +'/Scheme/GisData/'+restrictUrl;
           /* if(type===0){
                url+=roadRestrict;//道路限制区
            }
            if(type===1){
                url+=lineRestrict;//线路限制区
            }*/
            return this.editRestrictArea.disPlayRestrictArea(url+'?t='+Date.parse(new Date()));
        }else {
            this.editRestrictArea.stopEditEntity();
            this.editRestrictArea.removeAllRestrict();
            return undefined;
        }
    }

    //获取限制区列表
    getrestrictList(){
       return this.editRestrictArea.getRestrictList();
    };

    //添加限制区
    addRestrict(options){
        this.editRestrictArea.drawPolygon(options)
    };

    //定位限制区
    locationRestrict(restrictID){
        let entity=this.editRestrictArea.getRestrictEntity(restrictID);
        if(Cesium.defined(entity)){
            this.viewer.zoomTo(entity);
        }
    };

    //开始编辑限制区
    startEditRestrict(restrictId){
        this.editRestrictArea.startEditEntity(restrictId);
    };

    stopEditCurrentEntity(){
        this.editRestrictArea.stopEditEntity();
    };

    //删除限制区
    deleteRestrict(restrictId){
        this.editRestrictArea.removeOneRestrictArea(restrictId);
    };

    //保存限制区
    submitEditRestrict(){
        return this.editRestrictArea.submitEditRestrictArea();
    };

    /*******************线路**************************/
    dxfCollectline (prjId, schemeId, isOpen) {
        let url = baseS3Path + + prjId +'/Scheme/' + schemeId + '/line_dxf.json'+'?t='+Date.parse(new Date());

        if (!Cesium.defined(this.dxfC)) {
            this.dxfC = new DxfCollectline(this.viewer);
        }
        if (isOpen) {
            let promise = Cesium.Resource.fetchJson({url :url});
            promise.then((data) => {
                this.dxfC.loadDxfCollectLine(data);
            });
        }else{
            this.dxfC && this.dxfC.removeDxfCollectLine();
        }
    };

    createCollectLine(prjId,schemeId,isOpen){
        let lineURL=baseS3Path + prjId +'/Scheme/' + schemeId + '/engineering/'+ towerPathUrl+'?t='+Date.parse(new Date());
        if(!Cesium.defined(this.collectLineEdit)){
            this.collectLineEdit= new CollectLineEdit(this.viewer);
        }
        if(isOpen){
            return this.collectLineEdit.loadCollectLine(lineURL);
        }else{
            this.collectLineEdit.removeCollectLine();
            return null;
        }
    };

    clearHighTowerLabel(){
        this.collectLineEdit&&this.collectLineEdit.clearHighTowerLabel();
    };

    loadCollectLine(prjId,schemeId,isOpen){
        let lineURL=baseS3Path + prjId +'/Scheme/' + schemeId + '/windturbine_coordinate.jf'+'?t='+Date.parse(new Date());
        if(!Cesium.defined(this.collectLineEdit)){
            this.collectLineEdit= new CollectLineEdit(this.viewer);
        }
        if(isOpen){
            //this.collectLineEdit.loadStakeLine(lineURL);
            return this.collectLineEdit.displayCollectLine(lineURL);//autoLoadCollectLine
        }else{
            this.collectLineEdit.removeCollectLine();
            return null;
        }
    };

    display3DTower(){
        this.collectLineEdit&&this.collectLineEdit.display3DTower();
    };

    /**
     * 控制三维排塔线路的显示与移除
     * @param {Boolean}isOpen            true--加载，false--移除
     */
    dispalyTowerLine(isOpen){
        isOpen=Cesium.defaultValue(isOpen,true);
        if(isOpen) {
            if (!Cesium.defined(this.collectLineEdit)) {
                this.collectLineEdit = new CollectLineEdit(this.viewer);
            }
            this.collectLineEdit.displayTowerLines();
        }
    };

    /**
     * 控制未排塔线路的显示与移除
     * @param {Boolean}isOpen            true--加载，false--移除
     */
    displayStakeLine(isOpen){
        isOpen=Cesium.defaultValue(isOpen,true);
        if(isOpen){
            if(!Cesium.defined(this.collectLineEdit)){
                this.collectLineEdit= new CollectLineEdit(this.viewer);
            }
            this.collectLineEdit.displayStakeLines();
        }
    };

    /**
     * 重新设计---自动选线
     * @param prjId             工程编号
     * @param schemeId          方案编号
     * @param isOpen            是否开启
     * @return {*}
     */
    loadStakeLine(prjId,schemeId,isOpen){
        let lineURL=baseS3Path + prjId +'/Scheme/' + schemeId + '/windturbine_coordinate.jf'+'?t='+Date.parse(new Date());
        if(!Cesium.defined(this.collectLineEdit)){
            this.collectLineEdit= new CollectLineEdit(this.viewer);
        }
        if(isOpen){
            return this.collectLineEdit.loadStakeLine(lineURL);
        }else{
            this.collectLineEdit.removeCollectLine();
            return null;
        }
    };

    /**
     * 获取集电线路分支路线列表
     * @return {Array}
     * [{
     *      entityID:'',                    //标识线路的唯一值,用于线路定位传入的ID值
     *      lineInfo:{
     *           'lineLength':lineLength,  //线路总长
     *           'level':'35KV',           //电压等级
     *           'lineMun':lineNum,        //直线塔个数
     *           'angleNum':angleNum       //转角塔个数
     *      }
     * }]
     */
    getCollectLineListInfo(){
        return this.collectLineEdit.getCollectLineListInfo();
    };

    /**
     * 定位到指定的线路分支并高亮显示
     * @param lineEntityID              分支线路的entityID,来自getCollectLineListInfo中返回的entitID值
     */
    highLightSelectBranchRoute(lineEntityID){
        this.collectLineEdit.highLightSelectBranchRoute(lineEntityID);
    };

    /**
     * 获取集电线路支线的横断面数据
     * @param collectLineEntityID        支线所在实体的entityID,
     *                                   值来自getCollectLineListInfo方法中返回的entityId
     * @returns []
     *
     */
    getcolloectLineCrossSection(collectLineEntityID){
        return this.collectLineEdit.getcolloectLineCrossSection(collectLineEntityID);
    };

    /**
     * 获取线路用风机分组信息
     * @param prjId
     * @param schemeId
     * @return {Promise<any>}
     */
    getTurbineGroupInfo(prjId,schemeId){
        let groupURL=baseS3Path + prjId +'/Scheme/' + schemeId + '/windturbine_coordinate.json'+'?t='+Date.parse(new Date());
        if(!Cesium.defined(this.collectLineEdit)){
            this.collectLineEdit= new CollectLineEdit(this.viewer);
        }
        return this.collectLineEdit.getTurbineGroupInfo(groupURL);
    };

    /**
     * 初选线路编辑（只有桩位信息）
     */
    startEditStakeLine(){
        this.collectLineEdit&&this.collectLineEdit.stopTowerModelMouseEvent();//阻止铁塔模型的鼠标事件触发
        this.collectLineEdit&&this.collectLineEdit.startEditStakeLine();
        // this.collectLineEdit&&this.collectLineEdit.startCombineStakeLine();
    };

    /**
     * 线路编辑（自动排塔后--塔位信息）
     */
    startEditTowerLine(){
        this.collectLineEdit&&this.collectLineEdit.startEditTowerLine();
    };

    /**
     * 停止编辑线路(初选线路和排塔后公用)
     */
    stopEditCollectLine(){
        this.collectLineEdit&&this.collectLineEdit.stopEditCollectLine();
    };

    /**
     * 更换塔型
     * @param isOpen        --是否开启（true--点击更换塔型，false--处于编辑状态）
     */
    changeTowerType(isOpen){
        this.collectLineEdit&&this.collectLineEdit.changeTowerType(isOpen);
    };

    /**
     * 保存修改完的塔型信息
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
    saveChangeTowerType(towerInfo){
        this.collectLineEdit&&this.collectLineEdit.saveChangeTower(towerInfo);
    };

    //获塔型库列表
    getDefalutToweriInfo(){
        return this.collectLineEdit&&this.collectLineEdit.getDefalutToweriInfo();
    };

    //获取绝缘子串类型库列表
    getDefaultChuanInfo(){
        return this.collectLineEdit&&this.collectLineEdit.getDefaultChuanInfo();
    };

    /**
     * 提交排塔后编辑完数据
     */
    submitEditTowerLineInfo(){
        if(this.collectLineEdit)
            return this.collectLineEdit.saveEditCollectLine ();//submitEditTowerLineInfo
        else return{};
    };

    /**
     * 提交自动选线编辑后数据
     * （根据修改后的坐标重新计算桩累距）
     */
    submitEditStakeLineInfo(){
        if(this.collectLineEdit)return this.collectLineEdit.submitEditStakeLineInfo();
        else return {};
    };

    loadDxfCollectLine(prjId,schemeId,fileInfo){
    	let serverUrl='http://'+DxfServerIp+'/dxf_line';
        return this.collectLineEdit.loadDxfCollectLine(prjId,schemeId,fileInfo,serverUrl);
    };

    startEditToolMode(){
        this.collectLineEdit&&this.collectLineEdit.startEditToolMode();
    };

    stopEditToolMode(){
        this.collectLineEdit&&this.collectLineEdit.stopEditToolMode();
    };

    stopEditStakeLine(){
        this.collectLineEdit&&this.collectLineEdit.stopEditStakeLine();
    };

    /**
     * 开启删除桩位线路鼠标事件
     * @param {Object}options
     * @param {Function}[options.callBack]  鼠标选中支线的前端回调函数（再次确认弹出框）
     */
    startDeleteStakeLine(options){
        this.collectLineEdit&&this.collectLineEdit.startDeleteStakeLine(options);
    };

    /**
     * 关闭删除桩位线路事件
     */
    stopDeleteStakeLine(){
        this.collectLineEdit&&this.collectLineEdit.stopDeleteStakeLine();
    };

    deleteStakeLine(entity){
        this.collectLineEdit&&this.collectLineEdit.deleteStakeLineByEntity(entity);
    };

    /**
     * 开启绘制新桩位线路事件
     * @param {Function}outRangeCallFunc  超出地形范围的提示
     */
    startDrawStakeLine(outRangeCallFunc){
        this.collectLineEdit&&this.collectLineEdit.startDrawStakeLine(this.redLineArea,outRangeCallFunc);
    };

    stopDrawStakeLine(){
        this.collectLineEdit&&this.collectLineEdit.stopDrawStakeLine();
    };

    startSplitStakeLine(){
        this.collectLineEdit&&this.collectLineEdit.startSplitStakeLine();
    };

    stopSplitStakeLine(){
        this.collectLineEdit&&this.collectLineEdit.stopSplitStakeLine();
    };

    startCombineStakeLine(){
        this.collectLineEdit&&this.collectLineEdit.startCombineStakeLine();
    };

    stopCombineStakeLine(){
        this.collectLineEdit&&this.collectLineEdit.stopCombineStakeLine();
    };

    /*******************升压站**************************/
    createStation(prjId, schemeId, isOpen){
        let roadURL= baseS3Path + prjId + '/Scheme/' + schemeId  + '/engineering/'+ syzPathUrl+'?t='+Date.parse(new Date());
        let isModel = true;
        if (!Cesium.defined(this.stationEdit)) {
            this.stationEdit = new StationEdit(this.viewer);
        }
        if(prjId.toString()==='10000295'&& (schemeId===-1||schemeId===-12)){
            isModel= false;
        }
        if (isOpen) {
            return this.stationEdit.loadStation(roadURL,isModel);
        } else {
            this.stationEdit.removeStation(isModel);
            return null;
        }

    };

    //编辑升压站
    startEditStation(){
        this.stationEdit&&this.stationEdit.startEditStation();
    };

    stopEditStation(){
        this.stationEdit&&this.stationEdit.stopEditStation();
    };

    //获取编辑后的升压站信息
    saveEditStationGeoJSON(){
        return this.stationEdit.saveEditStationGeoJSON();
    }

    /*******************其它**************************/
    flyAction(actionType){
        switch (actionType){
            case 'start':
                this.flypathMoudle.startPathFly();
                break;
            case 'stop':
                this.flypathMoudle.stopPathFly();
                break;
            case 'restart':
                this.flypathMoudle.restartPathFly();
                break;
        }

    };


    /**
     * 在风机模型数组中按照风机编号查找风机
     * @param fanID
     */
    getFanEntityByID(fanID){
        return fanEntities.find(function (fanEntity) {
            return fanEntity.fanInfo.fanId.toString()===fanID.toString();
        });
    }
    /********************************************         内部使用私有方法       **************************************/
    //用于测试风图谱正确性
    _addTmpRect(minMaxWGS,posCenter){//[minPot,maxPot]
        this.rectVTK=new Cesium.Entity({
            name : 'tmpVtkRect',
            position:Cesium.Cartesian3.fromDegrees(posCenter[0], posCenter[1],700),
            point:{
                color:Cesium.Color.PINK,
                pixelSize:10
                //heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
            },
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray([
                    minMaxWGS[0][0], minMaxWGS[0][1],
                    minMaxWGS[1][0], minMaxWGS[0][1],
                    minMaxWGS[1][0], minMaxWGS[1][1],
                    minMaxWGS[0][0], minMaxWGS[1][1]
                ]),
                material: Cesium.Color.RED.withAlpha(0.1),
                height:700
            }
        });
        this.entities.add(this.rectVTK);
    };


    _addPolyLineEntity(geoJsonCoord,properties){
        return this.restrictDS.entities.add({
            name:'restrict',
            polyline:{
                positions:this._geoJsonCoordToCartesian3Array(geoJsonCoord),
                clampToGround:true,
                width:2,
                material:Cesium.Color.YELLOWGREEN.withAlpha(0.6),
                show:false
            },
            properties:properties
        });
    };
    _addPolygonEntity(geoJsonCoord,properties){
        return this.restrictDS.entities.add({
            name:'restrict',
            polygon:{
                hierarchy:this._geoJsonCoordToCartesian3Array(geoJsonCoord),
                heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                material:Cesium.Color.HOTPINK.withAlpha(0.6),
                show:false
            },
            properties:properties
        });
    };

    _geoJsonCoordToCartesian3Array(geoJsonCoord){
        let pos=[];
        geoJsonCoord.forEach((coord)=>{
            pos.push(coord[0],coord[1]);
        });
        return Cesium.Cartesian3.fromDegreesArray(pos);
    };



}

export default fanMoudle;
