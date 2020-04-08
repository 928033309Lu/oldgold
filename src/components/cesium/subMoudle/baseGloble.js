/* eslint-disable */
/**
 * Created by pengYX on 2018/5/9.
 */
import Cesium from 'cesium/Cesium';
//let Cesium =require('../../../../static/thirdParty/Cesium/Cesium');
import CoordTrans from '../otherModle/coordTrans';
import PrjTrans from '../otherModle/epsgPrjTrans';
import EpsgPrjTransfrom from "../otherModle/epsgPrjTransform";


class baseGloble{

    constructor (viewer){
        this.viewer=viewer;
        this.scene=viewer.scene;
        this.entities=this.viewer.entities;
        this.coordTrans=new CoordTrans();
        this.epsgTrans=new PrjTrans();
    };

    /**
     * 添加一个模型entitty
     * @param model             模型信息{x:109.8,y:34.7,z:0,name:'farm',id:'farmID',scale:3,near:1,far:30000}
     * @param offsetHigh        中心点距离地面的高度
     * @param hpr               旋转的角度
     */
    addModel(model,offsetHigh,hpr){
        offsetHigh=Cesium.defaultValue(offsetHigh ,0);
        let position = Cesium.Cartesian3.fromDegrees(model.x, model.y, model.z+ model.scale*offsetHigh);
        const FanOrientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        return this.entities.add({
            name: model.name,
            entityID:model.id,
            position: position,
            id:model.id.toString(),
            orientation: FanOrientation,
            model: {
                uri: model.url,
                allowPicking: true,
               // color: Cesium.Color.WHITE,
                show: true,
                incrementallyLoadTextures: false,
                //colorBlendMode: Cesium.ColorBlendMode.MIX,
                //colorBlendAmount: 0.2,
               // heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                scale:model.scale,
                minimumPixelSize:7,
                // maximumScale:model.scale,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(model.near,model.far)
            }
        });
    };

    addBillboard(url,boardInfo){
       // let height=this.viewer.scene.globe.getHeight(Cesium.Cartographic.fromDegrees(boardInfo.x, boardInfo.y, boardInfo.z));
        let position = Cesium.Cartesian3.fromDegrees(boardInfo.x, boardInfo.y);//,boardInfo.z
        return this.entities.add({
            name: boardInfo.name,
            entityID:boardInfo.id,
            position: position,
            billboard:{
                image : url,
                scale : 0.4,
                rotation : 0,
                horizontalOrigin:Cesium.HorizontalOrigin.CENTER,//LEFT,
                verticalOrigin:Cesium.VerticalOrigin.BOTTOM,//
                // disableDepthTestDistance:boardInfo.far,//Number.POSITIVE_INFINITY,
              //  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(boardInfo.near,boardInfo.far)
            }
        });
    };

    /**
     * 从集合中移除一个entity
     * @param entity        要移除的entity对象
     */
    removeModel(entity){
        if(Cesium.defined(entity)){
            this.entities.remove(entity);
        }
    };

    /**
     * 清空给定的数组，以及球上数据中的entity对象
     * @param models        要清空的entity数组[]
     */
    clearModels(models){
        models.forEach((model) => {
            this.entities.remove(model)
        });
        models.splice(0, models.length);
    };

    /**
     *  隐藏或者显示给定数组中的entity
     * @param models        要隐藏或者显示的entity集合
     * @param isVisible     true--显示；false--隐藏
     */
    hideVisibleModel(models,isVisible){
        models.forEach((model) => {
            model.show=isVisible;
        });
    };

    /**
     * 根据屏幕坐标点获取为model的entity对象
     * @param position          屏幕坐标点
     * @return {undefined}      entity或者undefined
     */
    getPickEntity(position){
        const picked = this.viewer.scene.pick(position);
        //获取选中的模型实体Entity
        if(Cesium.defined(picked)&&Cesium.defined(picked.id)&&(Cesium.defined(picked.id.model)||Cesium.defined(picked.id.billboard))){
            return picked.id;
        }else{
            return undefined;
        }
    };

    /**
     * 更改指定的模型entity为指定的颜色
     * @param entity        要改变颜色的模型对象
     * @param color         要更改成的颜色     Cesium.Color.RED
     */
    changeModelEntityColor(entity,color){
        if(Cesium.defined(entity)&&entity.model){
            entity.model.color=color;
        }
    };


    /**
     * 根据屏幕坐标获取84大地坐标
     * @param posWin        屏幕坐标
     * @return {*}          大地坐标值{x:2222222,y:88888,z:2232}或者null
     */
    getLatLngByWinPos(posWin) {
        //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
        let cartesian = this.getCoordByWinPos(posWin);
       return this.changeCoordToLatLon(cartesian);
    };

    /**
     * 将投影坐标转为经纬度坐标
     * @param cartesian
     * @returns {*}
     */
    changeCoordToLatLon(cartesian){
        if (cartesian) {
            //将笛卡尔三维坐标转为地图坐标（弧度）
            let cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            //将地图坐标（弧度）转为十进制的度数
            let lat = Cesium.Math.toDegrees(cartographic.latitude);//.toFixed(4)
            let lng = Cesium.Math.toDegrees(cartographic.longitude);//.toFixed(4)
            let alti = (this.viewer.camera.positionCartographic.height / 1000);
            return {x: lng, y: lat, z: alti};
        }
        return null;
    };

    /**
     * 将WGS84的世界坐标转换为屏幕坐标位置
     * @param cartesian                 要转换的世界坐标
     * @returns {Cesium.Cartesian2}     转换后的结果
     */
    getWinPosByCartesian(cartesian){
        let winPos=Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.scene,cartesian);
        return winPos;
    };

    /**
     * 根据屏幕坐标获取84经纬度坐标
     * @param posWin        屏幕坐标
     * @return {*}          经纬度坐标值{x:105.8,y:35.78,z:322}或者null
     */
    getCoordByWinPos(posWin) {
        //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
        if (this.viewer.scene.mode !== Cesium.SceneMode.MORPHING) {
            if (this.viewer.scene.pickPositionSupported) {
                return this.viewer.scene.pickPosition(posWin);
            }
        }
        return null;
       // return this.viewer.camera.pickEllipsoid(posWin, this.viewer.scene.globe.ellipsoid);//有地形的时候会出现偏移
    };

    /**
     * 根据屏幕坐标获取西安80坐标系下的经纬度坐标
     * @param posWin
     */
    get80LatLngByWinPos(posWin){};

    /**
     *根据屏幕坐标获取西安80坐标系下的大地坐标
     * @param posWin
     */
    get80CoordByWinPos(posWin){};

    /**
     * 西安80经纬度转米
     * @param point
     */
    BLH2xyz(point){
       /* let poi=this.epsgTrans.latLonTOCoord(point);
        return (poi.length===2)?{x:poi[0],y:poi[1]}:{x:0,y:0};*/
        let poi=this.coordTrans.BLH2xyh(point);
        return {"x": poi.y,"y": poi.x};
    };

    /**
     * 西安80经米转纬度
     * @param point
     */
    xyz2BLH(point){
      /* let poi=this.epsgTrans.coordTOLatLon(point);
       return {"x":poi[0],"y":poi[1]};*/
       return this.coordTrans.xyh2BLH(point);
    };

    /**
     * 84经纬度坐标转西安80,高斯3度分带投影坐标
     * @param point         {x:110,y:26}
     * @return {Object}    返回值
     */
    wgsBLto80coord(point){//
        let pp= this.epsgTrans.latLonTOCoord(point)
        return {"x":pp[0],"y":pp[1]};
    };

    /**
     * 西安80,高斯3度分带 投影坐标转84经纬度坐标
     * @param point             {x:110,y:26}
     * @return {Object}    返回值
     */
    xiAnCoordTo84BL(point){
        let pp= this.epsgTrans.coordTOLatLon(point);
        return {"x":pp[0],"y":pp[1]};
    };

    /**
     * 飞回到初始位置
     */
    flyToHome(){
        this.viewer.camera.setView({
            destination:Cesium.Cartesian3.fromDegrees(108, 25, 23000000.0),//25000000.0
            orientation: {
                heading: 0,
                roll: 0
            }
        });
    };

    flyToLatLng1(lat, lon,alt){
        let center=Cesium.Cartesian3.fromDegrees(lat,lon);
        let transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
        this.viewer.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
        this.viewer.camera.lookAtTransform(transform, new Cesium.Cartesian3(-alt, -alt, alt));//1100000
    };

    /**
     * 飞到指定位置
     * @param lon   经度
     * @param lat   纬度
     * @param alt   高度
     * @param sacle 模型的缩放比例
     */
    flyToLatLng(lon, lat,alt,sacle) {
    	let entity=this.entities.getById('flyTmp');
    	if(Cesium.defined(entity)){
    		this.entities.remove(entity);
        }

     	entity= new Cesium.Entity({
     		id:'flyTmp',
     		position: Cesium.Cartesian3.fromDegrees(Number(lon), Number(lat),85*sacle),
     		point : {
		        pixelSize : 1,
			    color : Cesium.Color.WHITE.withAlpha(0.1),
			    outlineColor : Cesium.Color.WHITE.withAlpha(0.1),
			    outlineWidth : 1
			}
     	});
     	this.entities.add(entity);
     	this.viewer.flyTo(entity,{
	     	offset : {
	                heading : Cesium.Math.toRadians(0.0),
	                pitch : Cesium.Math.toRadians(-90),
	                range : alt
	       }
     	});
    };

    flyToLatLngWithAngle(lon, lat,alt,sacle,angle) {
        let entity=this.entities.getById('flyTmp');
        if(Cesium.defined(entity)){
            this.entities.remove(entity);
        }
        entity= new Cesium.Entity({
            id:'flyTmp',
            position: Cesium.Cartesian3.fromDegrees(Number(lon), Number(lat),85*sacle),
            point : {
                pixelSize : 1,
                color : Cesium.Color.WHITE.withAlpha(0.1),
                outlineColor : Cesium.Color.WHITE.withAlpha(0.1),
                outlineWidth : 1
            }
        });
        this.entities.add(entity);
        this.viewer.flyTo(entity,{
            offset : {
                heading : Cesium.Math.toRadians(0.0),
                pitch : Cesium.Math.toRadians(angle),
                range : alt
            }
        });
    };

    flyToTargetWithRotate(angle){
        this.viewer.camera.setView({
            orientation: {
                heading : Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                pitch : Cesium.Math.toRadians(angle),    // default value (looking down)
                roll : 0.0                             // default value
            }
        });
    };

    /**
     *
     * @param extent        [{x:minX,Y:minY},{x:mnX,y:maxY}]
     */
    zoomToExtent(extent){
      /*  let minP= this.xiAnCoordTo84BL({x:extent[0],y:extent[1]});
        let maxP= this.xiAnCoordTo84BL({x:extent[2],y:extent[3]});*/
        let rect =Cesium.Rectangle.fromDegrees(extent[0].x,extent[0].y, extent[1].x, extent[1].y);

        if(Cesium.defined(this.loactionTectEntity)){
            this.entities.remove(this.loactionTectEntity);
        }
        this.loactionTectEntity=this.entities.add({
            name : 'locationRectangle',
            id:'locationRectangle',
            rectangle : {
                    coordinates: rect,
                    material: Cesium.Color.GREEN.withAlpha(0.0),
                    height: 0.0,
                    outline: false
            }
        });

        let flyPromise= this.viewer.flyTo(this.loactionTectEntity,{
            duration:5,
            offset:new Cesium.HeadingPitchRange(0.0,Cesium.Math.toRadians(-20.0))
        });
        let self=this;
        flyPromise.then((data)=>{
            setPitch();
        });

        function setPitch () {
            let center=Cesium.Rectangle.center(rect);
            let car=Cesium.Cartesian3.fromRadians(center.longitude,center.latitude);
            let range =Cesium.Cartesian3.distance(car, self.viewer.camera.position)*Math.cos(20);
            self.viewer.zoomTo(self.loactionTectEntity,new Cesium.HeadingPitchRange(0.0,Cesium.Math.toRadians(-20.0),range));
        }
    };

    /**
     *
     * @param extent        [109.8,30.6,110.6,40.8][minX,minY,maxX,maxY]
     */
    addZoomToExtent(extent){
        let minP= this.xiAnCoordTo84BL({x:extent[0],y:extent[1]});
        let maxP= this.xiAnCoordTo84BL({x:extent[2],y:extent[3]});
        let rect =Cesium.Rectangle.fromDegrees(minP.x,minP.y, maxP.x, maxP.y);

        if(Cesium.defined(this.loactionTectEntity)){
            this.entities.remove(this.loactionTectEntity);
        }
        this.loactionTectEntity=this.entities.add({
            name : 'locationRectangle',
            id:'locationRectangle',
            rectangle : {
                    coordinates: rect,
                    material: Cesium.Color.GREEN.withAlpha(0.0),
                    height: 0.0,
                    outline: false
            }
        });

        let angle = -90.0
        let flyPromise= this.viewer.flyTo(this.loactionTectEntity,{
            duration:5,
            offset:new Cesium.HeadingPitchRange(0.0,Cesium.Math.toRadians(angle),480000)
        });
        // let self=this;
        flyPromise.then((data)=>{
            setPitch();
        });

        function setPitch () {
            // self.viewer.zoomTo(self.loactionTectEntity,new Cesium.HeadingPitchRange(0.0,Cesium.Math.toRadians(angle),480000));
        }
    };

    /**
     * 用于解决地形下钻问题以及深度监测开启导致的图标遮挡问题
     */
    addCameraControl(){
        this.viewer.clock.onTick.addEventListener(()=>{//viewer.clock.onTick  camera.changed.
            if(this.viewer.camera.pitch > 0){
                console.log(this.viewer.camera.pitch);
                this.viewer.scene.screenSpaceCameraController.enableTilt = false;
            }
            let cameraHeight=this.viewer.camera.positionCartographic.height;

            if(cameraHeight>20000){
                this.viewer.scene.globe.depthTestAgainstTerrain=false;//开启深度检测
            }else{
                this.viewer.scene.globe.depthTestAgainstTerrain=true;//开启深度检测
            }
        });
        let startMousePosition;
        let mousePosition;
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((movement)=>{
            mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
            handler.setInputAction((movement)=>{
                mousePosition = movement.endPosition;
                let y = mousePosition.y - startMousePosition.y;
                if(y>0){
                    this.viewer.scene.screenSpaceCameraController.enableTilt = true;
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
    };

    //指北针
    autoNorth(angle){
        angle = Cesium.defaultValue(angle,0);
        let scene = this.viewer.scene;
        //var extent=scene.camera.computeViewRectangle();
        scene.camera.flyTo({
            destination :scene.camera.position,//extent,
            orientation : {
                pitch:scene.camera.pitch,
                heading : Cesium.Math.toRadians(angle)
            }
        });
    };

    /**
     * 将世界坐标转换为经纬度坐标
     * @param cartesian         世界坐标点
     * @returns {*[]}           经纬度坐标点[lon,lat,height]
     */
    cartesianToDegrees(cartesian){
        let ellipsoid=this.viewer.scene.globe.ellipsoid;
        let cartographic=ellipsoid.cartesianToCartographic(cartesian);
        return [Cesium.Math.toDegrees(cartographic.longitude),Cesium.Math.toDegrees(cartographic.latitude),cartographic.height];
    };

    /**
     * 创建一个WMS服务的Provider
     * @param {String}url           服务路径
     * @param {String}layers        加载图层名称
     * @return {ImageryLayer}
     */
    createWMSImagery(url,layers){
       /* if(!IsURL(url)){
            return undefined;
        }*/
        url+='?t='+Date.parse(new Date());
        let layerProvider=new Cesium.WebMapServiceImageryProvider({
            url: url,
            parameters:{
                transparent:true,
                format: 'image/png'
            },
            layers: layers,
        });
        return this.viewer.scene.imageryLayers.addImageryProvider(layerProvider);
    };

    removeWMSLayerServer(layer){
        layer&&this.viewer.scene.imageryLayers.remove(layer);
    };

}

export default baseGloble;
