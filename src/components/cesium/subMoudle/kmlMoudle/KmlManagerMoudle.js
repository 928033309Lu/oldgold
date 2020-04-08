import Cesium from 'cesium/Cesium';
import KmlLayer from './KmlLayer';
import {KmlFeatureType} from "./KmlFeatureType";

class KmlManagerMoudle {
    constructor (viewer) {
        this.viewer = viewer;
        this.KmlLayers = {};//图层管理
        this.handle = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    };

    /**
     * 进入KML模块，预先设置KML弹窗的回调函数
     * @param {Object}options
     * @param {Function}[options.clickCallBack]       点击弹出窗口的回调  【feature: picked.id, info: picked.id.description】
     * @param {Function}[options.moveCallBack]        改变弹窗位置的回调 【position: position】
     */
    enterKmlMoudle (options) {
        this.addMouseEvent();
        options = Cesium.defaultValue(options,{});
        this.popuWindowCallBack = options.clickCallBack;
        this.popuWindSetPosCallBack = options.moveCallBack;
    };

    /**
     * 加载Kml图层
     * @param {Object}   options
     * @param {String}  [options.id]                     KML图层的唯一ID
     * @param {String}  [options.url]                    KML的路径
     * @param {Boolean}  [options.visible]               KML的可见性
     * @param {Boolean} [options.clampToGround=true]     要素是否贴地--默认贴地
     * @return {Promise<KmlLayer>}                       KML图层
     */
    loadKmlLayer (options) {
        options = Cesium.defaultValue(options,{});
        if(!Cesium.defined(options.id)){
            return ;
        }
        let layer = new KmlLayer(this.viewer,options.id);
        if(this.KmlLayers.hasOwnProperty(options.id)) {
            return null;
        }
        this.KmlLayers[layer.id]=layer;
        return layer.loadKmlFile(options);
    };

    /**
     * 移除一个Kml
     * @param {String}id     kml图层id
     */
    removeKmlLayer (id) {
        if(this.KmlLayers.hasOwnProperty(id)){
            this.viewer.dataSources.remove(this.KmlLayers[id]._ds);
            delete this.KmlLayers[id];
        }
    };

    /**
     * 控制树节点的可见性
     *@param {Object}nodeInfo               树节点信息
     *@param {String}[nodeInfo.layerId]     kml图层id
     *@param {String}[nodeInfo.id]          树节点ID
     *@param {Number}[nodeInfo.type]        树节点类型
     *@param {Boolean}isVisible             节点的可见性
     */
    NodeVisible (nodeInfo, isVisible) {
        nodeInfo = Cesium.defaultValue(nodeInfo,{});
        if(!Cesium.defined(nodeInfo.layerId)|| !Cesium.defined(nodeInfo.type)|| !Cesium.defined(nodeInfo.id)){
            return
        }
        let layer = this.KmlLayers[nodeInfo.layerId];
        if(layer){
            layer.nodeVisible(nodeInfo,isVisible);
        }
    };

    /**
     * 树节点定位
     *@param {Object}nodeInfo               树节点信息
     *@param {String}[nodeInfo.layerId]     kml图层id
     *@param {String}[nodeInfo.id]          树节点ID
     *@param {Number}[nodeInfo.type]        树节点类型
     *@param {Boolean}isVisible             节点的可见性
     */
    NodeLocation (nodeInfo) {
        nodeInfo = Cesium.defaultValue(nodeInfo,{});
        if(!Cesium.defined(nodeInfo.layerId)|| !Cesium.defined(nodeInfo.type)|| !Cesium.defined(nodeInfo.id)){
            return
        }
        let layer = this.KmlLayers[nodeInfo.layerId];
        if(layer){
            layer.nodeLocation(nodeInfo);
        }
    };

    /**
     * 移除树节点
     *@param {Object}nodeInfo               树节点信息
     *@param {String}[nodeInfo.layerId]     kml图层id
     *@param {String}[nodeInfo.id]          树节点ID
     *@param {Number}[nodeInfo.type]        树节点类型
     */
    NodeRemove (nodeInfo) {
        nodeInfo = Cesium.defaultValue(nodeInfo,{});
        if(!Cesium.defined(nodeInfo.layerId)|| !Cesium.defined(nodeInfo.type)|| !Cesium.defined(nodeInfo.id)){
            return
        }
        let layer = this.KmlLayers[nodeInfo.layerId];
        if(layer){
            layer.nodeRemove(nodeInfo);
        }
    };

    /**
     * 修改要素的属性
     * @param {Object}nodeInfo              要修改属性的树节点信息
     * @param {String}[nodeInfo.layerId]    树节点所属图层的ID
     * @param {String}[nodeInfo.id]         树节点的编号
     * @param {Object}options               树节点修改后的属性
     * @param {Number}[options.opacity]     透明度
     * @param {String}[options.color]       颜色
     * @param {String}[options.name]        名称
     */
    changeFeatureProperty (nodeInfo, options) {
       // let resInfo = Cesium.clone(nodeInfo);
        if(!this.KmlLayers.hasOwnProperty(nodeInfo.layerId)){
            return;
        }
        let layer = this.KmlLayers[nodeInfo.layerId];
        let feature = layer._ds.entities.getById(nodeInfo.id);
        if (feature) {
            let type = feature.type;
            switch (type) {
                case KmlFeatureType.POINT :
                    feature.billboard.color = Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(options.color),options.opacity);
                    if(feature.label){
                        feature.label.text = options.name;
                    }
                    feature.name = options.name;
                    break;
                case KmlFeatureType.POLYLINE :
                    feature.polyline.material =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(options.color),options.opacity);
                    feature.name = options.name;
                    break;
                case KmlFeatureType.POLYGON :
                    feature.polygon.material =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(options.color),options.opacity);
                    feature.name = options.name;
                    break;
                case KmlFeatureType.RECTANGLE :
                    feature.rectangle.material =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(options.color),options.opacity);
                    feature.name = options.name;
                    break;
                case KmlFeatureType.FLODER :
                    feature.name = options.name;
                    break;
            }
        }
/*  resInfo.name = options.name;
        resInfo.kmlData.style.color = feature
        return {};*/
    };

    /**
     * 退出KML收藏夹模块
     */
    exitKmlMoudle () {
        this.removeMouseEvent();
        this.popuWindowCallBack = undefined;
        this.popuWindSetPosCallBack = undefined;
        for(let key in this.KmlLayers){
            this.viewer.dataSources.remove(this.KmlLayers[key]._ds);
            delete this.KmlLayers[key];
        }
    };

    /***************************新建相关*********************************/
    /**
     * 新建图层
     * @param {Object}options            图层基本属性
     * @param {String}[options.id]       图层唯一编号
     */
    createNewLayer (options) {
        let layer = new KmlLayer(this.viewer,options.id);
        this.KmlLayers[options.id]=layer;
    };

    /**
     * @typedef  pointOptions              点要素的属性
     * @property {String}[imgUrl]          图标路径
     * @property {String}[name]            文本标注信息
     * @property {String}[color='#FFF']    颜色
     * @property {Number}[opacity=1]       透明度
     * @property {Number}[scale=1]         图标缩放比例
     */
    /**
     * @typedef  polylineOptions              线要素的属性
     * @property {String}[color]              折线的颜色'#FFF'
     * @property {Number}[opacity]            折线的颜色透明度
     * @property {Number}[width]              折线的线宽
     */
    /**
     * @typedef  polygonOptions               多边形要素的属性
     * @property {String}[color]              多边形的颜色'#FFF'
     * @property {Number}[opacity]            多边形的颜色透明度
     */
    /**
     * 新建要素
     * @param {String}layerId                      要新增要素的图层编号
     * @param {String}pid                           要素的父节点编号
     * @param {Number}type                          要素的类型（1--点，2--线，3--面）
     * @param {Object}options                       要素的属性
     * 点：pointOptions
     * 线：polylineOptions
     * 面：polygonOptions
     * @param {Function}callback                    新增要素后的回调函数，传入参数如下
     * callback({  id: newEntity.id,
     *             name: newEntity.name,
     *             type: newEntity.type,
     *             visible: true,
     *             pid: pid,
     *             feature: newEntity
     * })
     */
    createNewFeature(layerId, pid, type, options, callback) {
        if (this.KmlLayers.hasOwnProperty(layerId)) {
            let kmlLayer = this.KmlLayers[layerId];
            switch (type) {
                case KmlFeatureType.POINT:
                    kmlLayer.addKmlIconPoint(pid, options, callback);
                    break;
                case KmlFeatureType.POLYLINE:
                    kmlLayer.addKmlPolyline(pid, options, callback);
                    break;
                case KmlFeatureType.POLYGON:
                    kmlLayer.addKmlPolygon(pid, options, callback);
                    break;
                case KmlFeatureType.FLODER:
                    kmlLayer.addKmlFloder(pid, options, callback);
                    break;
            }
        }
    };

    /*******************************************************************/

    addMouseEvent () {
        this.handle.setInputAction((click) => {
            let picked = this.viewer.scene.pick(click.position);
            let cartesian = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(click.position), this.viewer.scene);
            if (Cesium.defined(picked) && Cesium.defined(picked.id)&& Cesium.defined(picked.id.dsName) && picked.id.dsName === 'KML') {
                this.popuWindowCallBack && this.popuWindowCallBack({id: picked.id.id, info: picked.id.des});
                this.selectCartesian = cartesian;
                this.entity = picked.id;
            } else {
                this.selectCartesian = undefined;
                this.popuWindowCallBack && this.popuWindowCallBack(null);
                this.entity = undefined;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    /*    this.handle.setInputAction((click) =>{
            let picked = this.viewer.scene.pick(click.endPosition);
            if (this.entity && Cesium.defined(this.entity.dsName)&& Cesium.defined(this.entity.billboard)&&(this.entity.dsName === 'KML')) {
                this.entity.billboard.scale = this.entity.billboard.scale._value/1.1;
            }
            if (Cesium.defined(picked) && Cesium.defined(picked.id)&& Cesium.defined(picked.id.dsName)&& Cesium.defined(picked.id.billboard) && picked.id.dsName === 'KML') {
                picked.id.billboard.scale =  picked.id.billboard.scale._value*1.1;
                this.entity = picked.id;
            }else{
                this.entity = undefined;
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);*/
        this.viewer.scene.preUpdate && this.viewer.scene.preUpdate.addEventListener(this._addPerUpdate, this);
    };

    removeMouseEvent () {
        this.handle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
       // this.handle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.viewer.scene.preUpdate && this.viewer.scene.preUpdate.removeEventListener(this._addPerUpdate, this);
    };

    _addPerUpdate (scene, time) {
        let position = {x: undefined, y: undefined};
        if (Cesium.defined(this.selectCartesian)) {
            position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.selectCartesian);
            this.popuWindSetPosCallBack && this.popuWindSetPosCallBack({position: position});
        }
    };

}

export default KmlManagerMoudle;
