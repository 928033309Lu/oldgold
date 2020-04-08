/* eslint-disable */
/**
 * Created by pengYX on 2018/5/10.
 */
import Cesium from 'cesium/Cesium';
import OtherModle from './otherMoudle';
import epsgPrjTrans from '../otherModle/epsgPrjTrans';
import TowerLine from '../otherModle/towerLine';


class flypathMoudle extends OtherModle{

    constructor (viewer){
        super(viewer);
        this.lineDS= new Cesium.GeoJsonDataSource('lineDS');//集电线路
        this.roadDS= new Cesium.GeoJsonDataSource('roadDS');//存储道路

        this.flypathDS= new Cesium.CzmlDataSource('flypathDS');//存储飞行路径
        this.viewer.dataSources.add(this.flypathDS);

        this.viewer.dataSources.add(this.lineDS);
        this.viewer.dataSources.add(this.roadDS);

        this.towerLine=new TowerLine(viewer);

        this.prjsTrans=new epsgPrjTrans();
        this.pathID=['roadLine','collectLine'];//道路，集电线路
    };

    /*************************************    加载和移除集电线路，道路，升压站   ***************************************/
    /**
     * 加载道路(经纬度)
     * @param url      S3中道路文件路径
     * @return {Promise<any>}
     */
    loadRoad (url) {
        this.removeRoad();//清空线路集合
        return new Promise((resove, reject) => {
            Cesium.Resource.fetchJson({url:url}).then((data)=>{
                if(data.features.length>=1){
                    let features=data.features[0].geometry.coordinates;
                    features.forEach((feature)=>{
                        let points=[];
                        feature.forEach((point)=>{
                            //let res= this.prjsTrans.coordTOLatLon({x:point[0],y:point[1]});
                            points.push(point[0],point[1],point[2]);
                        });
                        this._addCorrider({points:points,name:'roadLine',width:5.0,color:new Cesium.Color(0.8,0.6,0.2,0.9)},this.roadDS.entities);
                        //this._addLine({points:points,name:'roadLine',width:2,color:Cesium.Color.YELLOW.withAlpha(0.6)},this.roadDS.entities);
                    });
                    let properties=data.features[0].properties;
                    let res = {
                        roadLength: properties.roadlength,
                        roadWidth: properties.roadwidth,
                        maxSlope: properties.maxslope,
                        maxSlopeLength: properties.maxslopelength
                    };
                    resove(res);
                }else{
                    reject(url+'data error!');
                }
            });
        });
    };

    /**
     * 加载集电线路(经纬度)
     * @param url       S3中集电线路文件路径
     * @return {Promise<any>}
     */
    loadCollectLine (url) {
        this.removeCollectLine();//清空线路集合
        return new Promise((resove, reject) => {
            Cesium.Resource.fetchJson({url:url}).then((data)=>{
                let features=data.data;
                if(features.length>=1){
                   // let lines=[];
                    features.forEach((feature)=>{
                        let gorundPos=[],topPos=[],btmLPos=[],btmRPos=[];
                        feature.points.forEach((point)=>{
                            //let res= this.prjsTrans.coordTOLatLon({x:point.x,y:point.y});
                            let pos=null;
                            if(point.type==='angle'){
                               pos=this.towerLine.addModelB07_J1_Simple(point.x,point.y,point.z);
                            }else {
                               pos=this.towerLine.addModelB07_Z1(point.x,point.y,point.z);
                            }
                            gorundPos.push(pos.groundPos[0],pos.groundPos[1],pos.groundPos[2]);
                            topPos.push(pos.topPos[0],pos.topPos[1],pos.topPos[2]);
                            btmLPos.push(pos.btmLPos[0],pos.btmLPos[1],pos.btmLPos[2]);
                            btmRPos.push(pos.btmRPos[0],pos.btmRPos[1],pos.btmRPos[2]);
                        });
                        this._addLine({points:gorundPos,name:'coolectLine',width:1,color:Cesium.Color.BLACK.withAlpha(0.6)},this.lineDS.entities);
                        this. _addLine({points:topPos,name:'coolectLine',width:1,color:Cesium.Color.RED.withAlpha(0.6)},this.lineDS.entities);
                        this._addLine({points:btmLPos,name:'coolectLine',width:1,color:Cesium.Color.YELLOW.withAlpha(0.6)},this.lineDS.entities);
                        this._addLine({points:btmRPos,name:'coolectLine',width:1,color:Cesium.Color.GREEN.withAlpha(0.6)},this.lineDS.entities);
                        //this._addLine({points:points,name:'coolectLine',width:2,color:Cesium.Color.YELLOW.withAlpha(0.6)},this.lineDS.entities);
                    });

                    let res = {
                        voltageLevel: data.voltageLevel,//电压等级
                        towerNum: data.towerNum,//杆塔数量
                        cornerNum: data.cornerNum,//转角塔数量
                        straightNum: data.straightNum//直线塔数量
                    };
                    resove(res);
                }else{
                    reject(url+'data error!');
                }
            });
        });
    };

    /**
     * 加载升压塔(经纬度)
     * @param url       S3中集升压站文件路径
     * @return {Promise<any>}
     */
    loadStation (url){
        this.removeStation();//清空线路集合
        return new Promise((resove, reject) => {
        	Cesium.Resource.fetchJson({url:url}).then((data)=>{
        		if(data.features.length>=1){
        			let feature=data.features[0].geometry.coordinates;
                    this.createStations([{x:parseFloat(feature[0]),y:parseFloat(feature[1]),z:parseFloat(feature[2])}]);
                    let properties=data.features[0].properties;
                    let res = {
	                    stationWidth: properties.staionwidth/10,
	                    stationHeight: properties.stationheight/10,
	                    stationArea: properties.stationarea/100
	                };
	                resove(res);
        		}else{
        			reject(url+'data error!');
        		}
        	});
        });

    };

    /**
     *  移除道路
     */
    removeRoad(){
        this.roadDS.entities.removeAll();
    };

    //移除集电线路
    removeCollectLine(){
        this.lineDS.entities.removeAll();
        this.towerLine.removeAllCollection();
    };

    //移除升压塔
    removeStation(){
        this.clearStations();
    };

    /**
     * 导入外部dxf道路文件
     * @param prjId             工程编号
     * @param schemeId          方案编号
     * @param fileInfo          文件内容
     * @param serverUrl         解析DXF道路文件服务路径
     * @return {Promise<any>}   Promise对象，包含道路相关信息
     */
	loadDxfRoad(prjId,schemeId,fileInfo,serverUrl){
      /* let roadPromise= Cesium.Resource.fetch({
            url:serverUrl,
            queryParameters:{
                'project_id':prjId,
                'scheme_id':schemeId,
                'path_dxf':fileInfo
            }/!*,
            headers:{Origin}*!/
        });
        return new Promise((resolve,reject)=>{
            roadPromise.then((res)=>{

                resolve();
            },(erroe)=>{
                reject(erroe);
            });
        });*/

	};

    /**
     * 导入外部dxf集电线路文件
     * @param prjId             工程编号
     * @param schemeId          方案编号
     * @param fileInfo          文件内容
     * @param serverUrl         解析DXF集电线路文件服务路径
     * @return {Promise<any>}   Promise对象，包含道路相关信息
     */
	loadDxfCollectLine(prjId,schemeId,fileInfo,serverUrl){
       let roadPromise= Cesium.Resource.fetch({
            url:serverUrl,
            queryParameters:{
            	'project_id':prjId,
                'scheme_id':schemeId,
                'path_dxf':fileInfo
            }/*,
            headers:{}*/
        });
       return new Promise((resolve,reject)=>{
           roadPromise.then((res)=>{

               resolve();
           });
       });
	};

    /*****************************************             飞行相关功能              ***********************************/

    //开始飞行
    startPathFly(type){
        if(this.flypathDS.entities.values.length>0){
            this.viewer.trackedEntity=this.flypathDS.entities.values[0];
            this.viewer.clock.shouldAnimate=true;
        }
    };

    //停止飞行
    stopPathFly(){
        this.viewer.clock.shouldAnimate=false;
    };

    //回到初始飞行位置
    restartPathFly(){
        this.viewer.clock.currentTime=this.viewer.clock.startTime;
        this.viewer.clock.shouldAnimate=false;
        this.viewer.trackedEntity=undefined;
    };

    /******************************************            内部使用私有成员           **********************************/

    /**
     * 加载飞行路径
     * @param positionsArray  道路存在多线段的情况，所以需要传入的事多线段的点集合
     * @param pathID  飞行线路的entity所用的ID   this.pathID
     * @private
     */
    _loadFlyPath(positionsArray,pathID){
        this.flypathDS.entities.removeAll();//清空飞行路径集合
        let pointsInfo=[];
        positionsArray.forEach((positions)=>{
            positions.forEach(function(point,index){
                pointsInfo.push(index*100,point.x,point.y,point.z);
            });
        });
        let path= [
            {
                "id":"document" ,
                "version" : "1.0"
            },
            {
                "id" : pathID,
                "availability" : "2012-08-04T10:00:00Z/2012-08-04T15:00:00Z",
                "billboard" : {
                    "image" : "data:image/png;base64,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",
                    "scale" : 1.5,
                    "eyeOffset": {
                        "cartesian": [ 0.0, 0.0, -10.0 ]
                    }
                },
                "orientation" : {
                    "velocityReference": "#position"
                },
                "viewFrom": {
                    "cartesian": [ -100, -100, 100]
                },
                "position" :{
                    "interpolationAlgorithm":"LAGRANGE",
                    "interpolationDegree":1,
                    "epoch" : "2012-08-04T10:00:00Z",
                    "cartesian":pointsInfo

                }
            }
        ];
        this.flypathDS.load(path);
    };

    /**
     * 添加线
     * @param lineInfo  需要添加的线信息
     * {points:[110.3,23.4,0,110.3,23.4,0,110.3,23.4,0],name:'road',width:4,color:Cesium.Color.Red}
     */
    _addLine(lineInfo,entitis){
        return entitis.add({
            name:lineInfo.name,
            polyline: {//corridor
                positions : Cesium.Cartesian3.fromDegreesArrayHeights(lineInfo.points),
                width : lineInfo.width,
                material :lineInfo.color // new Cesium.PolylineArrowMaterialProperty(new Cesium.Color(0.2, 0.784, 0.435, 1))
            }
        });
    };

    //面状线
    _addCorrider(lineInfo,entitis){
        return entitis.add({
            name:lineInfo.name,
            corridor: {//corridor
                positions : Cesium.Cartesian3.fromDegreesArrayHeights(lineInfo.points),
                width : lineInfo.width,
                material :lineInfo.color
            }
        });
    };

}

export default  flypathMoudle;
