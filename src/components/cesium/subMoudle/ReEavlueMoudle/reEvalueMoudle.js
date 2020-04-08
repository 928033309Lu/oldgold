import Cesium from 'cesium/Cesium';
import {fanVisibleHeightRange, farmVisibleHeightRange, turbineUrl} from '../constants';
import RectLabelBuilder from '../../otherModle/rectLabelBuilder';

class ReEvalueMoudle {
    constructor (viewer) {
        this.viewer = viewer;
        this.geoPrjDs = new Cesium.GeoJsonDataSource('ReEvalue');//存储
        this.geoTurbineDs = new Cesium.CustomDataSource();//存储项目风机
        viewer.dataSources.add(this.geoPrjDs);
        viewer.dataSources.add(this.geoTurbineDs);
        this.handle = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.viewer.scene.preUpdate && this.viewer.scene.preUpdate.addEventListener(this._preUpdte, this);
    };

    /**
     * 加载后评估项目
     * @param {Object}data          风巽接口返回的geoJson数据
     */
    createWindFileds (data,imgUrl) {
        let promise = this.geoPrjDs.load(data,{});
        this._addWindFiledEvents();
        return Cesium.when(promise,(ds) => {
            ds.entities.values.forEach((entity) => {
                let info = {};
                entity.name = 'geoWindFiled';
                entity.billboard.image = imgUrl;
                entity.entityID = entity.properties.MAPKEY._value;
                entity.properties.propertyNames.forEach((name)=>{
                    info[name]=entity.properties[name]._value;
                });
                info.coord = this._cartesianToDegree(entity.position._value);
                entity.info =info;
                entity.show= false;
            });
            return true;
        }).otherwise((error) => {
            return Cesium.when.reject(false);
        });
       /* promise.then((ds) => {
            ds.entities.values.forEach((entity) => {
                let info = {};
                entity.name = 'geoWindFiled';
                entity.billboard.image = imgUrl;
                entity.entityID = entity.properties.MAPKEY._value;
                entity.properties.propertyNames.forEach((name)=>{
                    info[name]=entity.properties[name]._value;
                });
                info.coord = this._cartesianToDegree(entity.position._value);
                entity.info =info;
                entity.show= false;
            });

        });*/
    };

    /**
     * 设置风场对象的可见性
     * @param {Number}mapKey                  风场对象的唯一识别（MAPKEY）
     * @param {Boolean}isVisible              可见性
     */
    setWindFiledVisible (mapKey, isVisible) {
        let resEntity = null;
        this.geoPrjDs.entities.values.forEach((entity) => {
            if(entity.entityID === mapKey){
                resEntity = entity;
            }
        });
        if(resEntity){
            resEntity.show = isVisible;
        }
    };

    /**
     * 加载标杆案例中的风机信息
     * @param datas
     */
    createTurbines (datas) {
        this.geoTurbineDs.entities.removeAll();
        datas.forEach ((data) => {
            this._createTurbine(data);
        });
        this.viewer.flyTo(this.geoTurbineDs.entities,{
            offset : {
                heading : Cesium.Math.toRadians(0.0),
                pitch : Cesium.Math.toRadians(-25)
            }
        });
        this._addTurbineMouseEvnets();
    };

    /**
     * 设置后评估项目的鼠标事件回调函数
     * @param {Object}callBacks
     * @param {Function}[callBacks.infoCallBack]            鼠标点击显示项目详情的回调函数
     * @param {Function}[callBacks.infoMoveCallBack]        项目详情信息框随球转动
     */
    setPrjMouseEvents (callBacks) {
        this.prjInfoPopuCallBack = callBacks.infoCallBack;
        this.prjInfoPopuMoveCallBack = callBacks.infoMoveCallBack;
    };

    /**
     * 设置后评估项目中风机鼠标事件回调函数
     * @param {Object}callBacks
     * @param {Function}[callBacks.infoCallBack]        鼠标点击显示风机的回调函数
     * @param {Function}[callBacks.infoMoveCallBack]        风机信息框随球转动
     */
    setTurbineMouseEvents (callBacks) {
        this.turbineInfoPopuCallBack = callBacks.infoCallBack;
        this.turbineInfoWinMoveCallBack = callBacks.infoMoveCallBack;
    };

    /**
     * 退出后评估案例模式
     */
    exitReEvakueMoudle () {
        this.viewer.dataSources.remove(this.geoPrjDs);
        this.viewer.dataSources.remove(this.geoTurbineDs);
        this.selectTurbineEntity = undefined;
        this.turbineInfoPopuCallBack && this.turbineInfoPopuCallBack(null);
        this.prjInfoPopuCallBack && this.prjInfoPopuCallBack(null);
        this.handle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.viewer.scene.preUpdate&&this.viewer.scene.preUpdate.removeEventListener(this._preUpdte,this);
    };

    /**
     * 清空后评估风场中风机
     */
    clearReEvalueTurbine () {
        this.turbineInfoPopuCallBack && this.turbineInfoPopuCallBack(null);
        this.selectTurbineEntity = undefined;
        this.geoTurbineDs.entities.removeAll();
    };

    /**
     * 加载单个风机
     * @param {Object}info
     * @private
     */
    _createTurbine (info) {
        let position=Cesium.Cartesian3.fromDegrees(parseFloat(info.lng),parseFloat(info.lat));
        let pinBuilder = new RectLabelBuilder({
            text:info.fid,
            width:39,
            height:28,
            color:'#3CC772',
            outline:true,
            outlinecolor:[255,255,255,0.2],
            offset:[0,6]});
        let entity = this.geoTurbineDs.entities.add({
            position:position,
            id: info.fid,
            name:'geoTurbine',
            model:{
                uri:turbineUrl,
                minimumPixelSize:7,
                colorBlendMode:Cesium.ColorBlendMode.MIX,
                color:Cesium.Color.WHITE,
                colorBlendAmount:0.2,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(fanVisibleHeightRange[0],fanVisibleHeightRange[1]/2)
            },
            billboard:{
               /* position: Cesium.Cartesian3.fromDegrees(parseFloat(info.lng),parseFloat(info.lat),100),*/
                image :pinBuilder.drawLabel().toDataURL(),
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(0.0,-30/2),
                eyeOffset:new Cesium.Cartesian2(0.0,100),
                scaleByDistance : new Cesium.NearFarScalar(3.0e3, 1.0, 5.0e3, 0.8),
            }
        });
        entity.pinBuilder = pinBuilder;
        entity.entityID = info.ffid;
        entity.info = info;
    };

    _addTurbineMouseEvnets () {
        this.handle.setInputAction((click)=>{
            let entity =this._getPickEntity(click.position);
            this.hightLightTurbine(this.selectTurbineEntity,false);
            this.hightLightTurbine(entity,true);
            if(Cesium.defined(entity)&&entity.name === 'geoTurbine'){
                   this.turbineInfoPopuCallBack && this.turbineInfoPopuCallBack({id:entity.entityID,infos:entity.info});
                   this._turbineCarcesian = this._getModelTopCarcesian(entity,0);
            }else{
                this.turbineInfoPopuCallBack && this.turbineInfoPopuCallBack(null);
            }
            this.selectTurbineEntity = entity;
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    _removeWindFiledEvents () {
        if(this.addEvent ){
            this.handle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
        this.addEvent = false;
    };
    _addWindFiledEvents () {
        if(!this.addEvent){
            this.handle.setInputAction((click)=>{
                let entity =this._getPickEntity(click.endPosition);
                if(Cesium.defined(entity)&&entity.name === 'geoWindFiled'){
                    this.prjInfoPopuCallBack && this.prjInfoPopuCallBack({id:entity.entityID,infos:entity.info});
                    this._windFiledCarcesian=this._getModelTopCarcesian(entity,0);
                }else{
                    this.prjInfoPopuCallBack && this.prjInfoPopuCallBack(null);
                }
                this.selectEntity = entity;
            },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
        this.addEvent = true;
    };

    hightLightTurbine (entity,isHigh) {
        if (Cesium.defined(entity)) {
            if (entity.name === 'geoTurbine') {
                if (Cesium.defined(entity.model)) {
                    entity.model.color = isHigh ? Cesium.Color.fromCssColorString('#00B851') : Cesium.Color.fromCssColorString('#FFF');
                }
                if (Cesium.defined(entity.billboard) && entity.pinBuilder) {
                    entity.pinBuilder.backColor = isHigh ? '#ff282c' : '#00B851';
                    entity.billboard.image = entity.pinBuilder.drawLabel().toDataURL();
                }
            }
        }
    };

     /**
     * 根据屏幕坐标点获取为model的entity对象
     * @param position          屏幕坐标点
     * @return {undefined}      entity或者undefined
     * @private
     */
    _getPickEntity(position){
        const picked = this.viewer.scene.pick(position);
        //获取选中的模型实体Entity
        if(Cesium.defined(picked)&&Cesium.defined(picked.id)&&(Cesium.defined(picked.id.model)||Cesium.defined(picked.id.billboard))){
            return picked.id;
        }else{
            return undefined;
        }
    };

    _getModelTopCarcesian(entity,height){
        let modelMatrix = new Cesium.Matrix4();
        Cesium.Transforms.eastNorthUpToFixedFrame(entity.position._value, this.viewer.scene.globe.ellipsoid, modelMatrix);
        //将风机的底部中心点上移一个风机轮毂的高度
        let martrix = Cesium.Matrix4.multiplyByTranslation(modelMatrix, new Cesium.Cartesian3(0, 0,height), new Cesium.Matrix4());
        return new Cesium.Cartesian3(martrix[12],martrix[13],martrix[14]);
    }

    _preUpdte (scene,time) {
        let entityID='',position={x:undefined,y:undefined};
        if(Cesium.defined(this.selectTurbineEntity)){
            if(this.selectTurbineEntity.name==='geoTurbine'){
                position=this._getWinPosByCartesian(this._turbineCarcesian);
                entityID=this.selectTurbineEntity.entityID;
                this.turbineInfoWinMoveCallBack && this.turbineInfoWinMoveCallBack({id:entityID,pos: position});
            }
        }
        if(this.selectEntity){
            if(this.selectEntity.name==='geoWindFiled'){
                position=this._getWinPosByCartesian(this._windFiledCarcesian);
                entityID=this.selectEntity.entityID;
                this.prjInfoPopuMoveCallBack && this.prjInfoPopuMoveCallBack({id: entityID,pos:{x:Cesium.defined(position)?position.x:undefined,y:Cesium.defined(position)?position.y:undefined}});
            }
        }
        let height = Math.ceil(this.viewer.camera.positionCartographic.height);
        if(height>farmVisibleHeightRange[0]) {
            this.geoPrjDs.show = true;
            this._addWindFiledEvents();
            this.geoTurbineDs.show = false;
        } else{
            this._removeWindFiledEvents();
            this.geoPrjDs.show = false;
            this.geoTurbineDs.show = true;
        }
    };

    /**
     * 将WGS84的世界坐标转换为屏幕坐标位置
     * @param cartesian                 要转换的世界坐标
     * @returns {Cesium.Cartesian2}     转换后的结果
     */
    _getWinPosByCartesian(cartesian){
        if(cartesian){
            return Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene,cartesian);
        }
        return {x:undefined,y:undefined};
    };

    /**
     * 世界坐标转经纬度坐标
     * @param {Cartesian3}cartesian
     * @return {Number[]}       坐标数组[经度，纬度，高度]
     * @private
     */
    _cartesianToDegree (cartesian) {
        let cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        return [lng, lat, 0];
    };

}

export default ReEvalueMoudle;
