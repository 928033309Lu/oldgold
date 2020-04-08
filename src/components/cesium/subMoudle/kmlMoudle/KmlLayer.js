import Cesium from 'cesium/Cesium';
import {KmlFeatureType} from './KmlFeatureType';
import DrawPrimitiveHelper from '../../otherModle/drawEditHelper/drawPrimitiveHelper';
import KmlDataSource from './KmlReader';
import {baseS3Path} from '../constants';
const pinImageBasePath = baseS3Path + 'kmz&kml/images';
class KmlLayer {
    /**
     * Kml图层
     * @param {Cesium.viewer}viewer
     * @param {Object}options
     * @param {String}[options.url]                     KML的路径
     * @param {Boolean}[options.clampToGround=true]     要素是否贴地--默认贴地
     */
    constructor (viewer, id) {
        this.viewer = viewer;
        this._ds = new KmlDataSource({
            camera: viewer.scene.camera,
            canvas: viewer.scene.canvas
        });//   存储要素的DataSource对象
        this.viewer.dataSources.add(this._ds);
        this.tree = []; //  方便控制要素的显隐属性 （由于entity的bug,改变了show属性会导致编辑节点报错，故选用移除添加的方式）
        this.id = id;
        this.entitiesID = [];
    };

    /**
     * 加载KML文件
     * @para {Object}options                           kml图层属性
     * @para {String}[options.url]                     路径
     * @para {Boolean}[options.clampToGround=true]     是否贴地
     * @para {Boolean}[options.visible]                默认是否显示
     * @return {KmlLayer}
     */
    loadKmlFile (options) {
        this.options = Cesium.defaultValue(options, {});
        if (!Cesium.defined(options.url)) {
            throw new Cesium.DeveloperError('url 为必须属性.');
        }
        let clampToGround = Cesium.defaultValue(options.clampToGround, true);
        let visible = Cesium.defaultValue(options.visible, false);
        let promise = this._ds.load(this.options.url + '?t=' + Date.parse(new Date()), {
            sourceUri: this.options.url,
            clampToGround: clampToGround,
            ellipsoid: this.viewer.scene.ellipsoid
        });
        return Cesium.when(promise, (ds) => {
            this._buildTree(ds, visible);
            if (visible) {
                this.viewer.flyTo(ds.entities, {
                    duration: 3.0,
                    offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-80))
                });
            }
            return this.tree;
        }).otherwise((error) => {
            return Cesium.when.reject(error);
        });
    };

    /**
     * 节点定位
     * @param {Object}nodeInfo                     节点信息
     * @param {String}[nodeInfo.id]                节点唯一编号
     * @param {Number}[nodeInfo.type]              节点类型
     */
    nodeLocation (nodeInfo) {
        nodeInfo = Cesium.defaultValue(nodeInfo, {});
        if (!Cesium.defined(nodeInfo.id)) {
            return ;
        }
        let locationFeature = [];
        if (nodeInfo.type === -1) {
            locationFeature = this._ds.entities;
        }
        let entity = this._ds.entities.getById(nodeInfo.id);
        if (entity) {
            if (entity.type === KmlFeatureType.FLODER) {
                locationFeature = this._getChildEntity(entity);
            } else {
                locationFeature = [entity];
            }
        }
        this.viewer.flyTo(locationFeature, {
            duration: 3.0,
            offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-80))
        });
    };

    /**
     * 设置树节点的可见性
     * @param {Object}nodeInfo                     节点信息
     * @param {String}[nodeInfo.id]                节点唯一编号
     * @param {Number}[nodeInfo.type]              节点类型
     * @param {Boolean}isVisble                    节点的可见性
     */
    nodeVisible (nodeInfo,isVisble){
        nodeInfo = Cesium.defaultValue(nodeInfo, {});
        if(!Cesium.defined(nodeInfo.id)){
            return
        }
        let entity = this._ds.entities.getById(nodeInfo.id);
        if (entity && entity.type !== KmlFeatureType.FLODER && entity.type !== -1) {
            entity.show = isVisble;
        }
    };

    /**
     * 移除树节点
     * @param {Object}nodeInfo                     节点信息
     * @param {String}[nodeInfo.id]                节点唯一编号
     * @param {Number}[nodeInfo.type]              节点类型
     * @param {Boolean}isVisble                    节点的可见性
     */
    nodeRemove (nodeInfo) {
        nodeInfo = Cesium.defaultValue(nodeInfo, {});
        if (!Cesium.defined(nodeInfo.id)) {
            return;
        }
        if (nodeInfo.type === -1) {
            this.viewer.dataSources.remove(this._ds);
        } else {
            let entity = this._ds.entities.getById(nodeInfo.id);
            if (entity) {
                this._featureRemove(entity);
                this._ds.entities.remove(entity);
            }
        }
    };

    /**
     * 控制要素的可见性(循环遍历设置子节点)
     * @param {Entity}entity           控制显隐的要素
     * @param {Boolean}isVisble         显示与隐藏
     */
    _featureRemove (entity) {
       if(entity) {
           if (entity.type === KmlFeatureType.FLODER) {
               entity._children.forEach((entity) => {
                   if(entity.type !== KmlFeatureType.FLODER) {
                       this._ds.entities.remove(entity);
                   }else{
                       this._featureRemove(entity);
                   }
               });
           }
       }
    };

    _getChildEntity (entity) {
        let entities = [];
        if (entity) {
            if (entity.type === KmlFeatureType.FLODER) {
                entity._children.forEach((entity) => {
                    if (entity.type !== KmlFeatureType.FLODER) {
                        entities.push(entity);
                    }else {
                        entities = entities.concat(this._getChildEntity(entity));
                    }
                });
            }
        }
        return entities;
    };

    /**
     * 新建图标点
     * @param {String}pid                       父节点ID
     * @param {Object}options                   样式信息
     * @param {String}[options.imgUrl]          图标路径
     * @param {String}[options.name]            文本标注信息
     * @param {String}[options.color='#FFF']    颜色
     * @param {Number}[options.opacity=1]       透明度
     * @param {Number}[options.scale=1]         图标缩放比例
     * @param {Function}callback                新建三维对象后回调函数
     * callback({  id: newEntity.id,
     *               name: newEntity.name,
     *               type: newEntity.type,
     *               visible: true,
     *               pid: pid,
     *               feature: newEntity
     *               })
     */
    addKmlIconPoint (pid, options, callbacks) {
        let _self = this;
        options = Cesium.defaultValue(options, {});
        if (!Cesium.defined(options.imgUrl)) {
            throw new Cesium.DeveloperError('imgUrl is required.' );
        }
        //options.imgUrl=baseS3Path+'kmz%26kml/images/dian4.png';
        let color = Cesium.defined(options.color) ? Cesium.Color.fromCssColorString(options.color) : Cesium.Color.WHITE;
        let size = Cesium.defaultValue(options.fontSize, 20);
        let scale = Cesium.defaultValue(options.scale, 1.0);
        let text = Cesium.defaultValue(options.name, ' ');
        let opacity = Cesium.defaultValue(options.opacity, 1.0);
        if (!this.drawHelper)
            this.drawHelper = new DrawPrimitiveHelper(this.viewer);
        this.drawHelper.startDrawIconPoint({
            callback: function (positions) {
                let newEntity = _self._ds.entities.add({
                    name: options.name,
                    type: KmlFeatureType.POINT,
                    position: positions[0],
                    billboard: {
                        image: options.imgUrl,
                        scale: scale,
                        color: Cesium.Color.fromAlpha(color,opacity),
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    },
                    label: {
                        text: text,
                        font: size + 'px sans-serif',
                        fillColor: Cesium.Color.fromAlpha(color,opacity),
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        pixelOffset: new Cesium.Cartesian2(20.0, -35)
                    }
                });
                newEntity.kmlData=_self._getFeatureInfo(newEntity);
                _self._addToParent(pid,newEntity);
                let treeNode = {
                    layerId: _self.id,
                    id: newEntity.id,
                    name: newEntity.name,
                    type: newEntity.type,
                    visible: true,
                    pid: pid,
                    isChecked:true,
                    kmlData: newEntity.kmlData,
                    icon: _self._getIcon(KmlFeatureType.POINT)
                };
                callbacks && callbacks(treeNode);
            }
        });
    };

    /**
     * 新建线
     * @param {String}pid                          父节点ID
     * @param {Object}options                      折线的样式
     * @param {String}[options.color]              折线的颜色'#FFF'
     * @param {Number}[options.opacity]            折线的颜色透明度
     * @param {Number}[options.width]              折线的线宽
     * @param callbacks                             新建三维对象后回调函数
     */
    addKmlPolyline (pid, options, callbacks) {
        let _self = this;
        options = Cesium.defaultValue(options, {});
        let color = Cesium.defined(options.color) ? Cesium.Color.fromCssColorString(options.color): Cesium.Color.GREEN.withAlpha(0.6);
        let opacity = Cesium.defaultValue(options.opacity, 1.0);
        let width = Cesium.defaultValue(options.width, 2.0);
        if (!this.drawHelper)
            this.drawHelper = new DrawPrimitiveHelper(this.viewer);
        this.drawHelper.startDrawingPolyline({
            isClapOnTerrian: true,
            callback: function (positions) {
                let newEntity = _self._ds.entities.add({
                    name: options.name,
                    type: KmlFeatureType.POLYLINE,
                    polyline: {
                        positions: positions,
                        width: width,
                        clampToGround: true,
                        material: Cesium.Color.fromAlpha(color, opacity)
                    }
                });
                newEntity.kmlData = _self._getFeatureInfo(newEntity);
                _self._addToParent(pid, newEntity);
                let treeNode = {
                    layerId: _self.id,
                    id: newEntity.id,
                    name: newEntity.name,
                    type: newEntity.type,
                    pid: pid,
                    isChecked:true,
                    kmlData: newEntity.kmlData,
                    icon: _self._getIcon(KmlFeatureType.POLYLINE)
                };
                callbacks && callbacks(treeNode);
            }
        },true);
    };

    /**
     * 新建线
     * @param {String}pid                          父节点ID
     * @param {Object}options                      多边形的样式
     * @param {String}[options.color]              多边形的填充颜色'#FFF'
     * @param {Number}[options.opacity]            多边形填充色的透明度
     * @param callbacks                            新建三维对象后回调函数
     */
    addKmlPolygon (pid, options, callbacks) {
        let _self = this;
        options = Cesium.defaultValue(options, {});
        let color = Cesium.defined(options.color) ? Cesium.Color.fromCssColorString(options.color): Cesium.Color.GREEN.withAlpha(0.6);
        let opacity = Cesium.defaultValue(options.opacity, 1.0);
        if (!this.drawHelper)
            this.drawHelper = new DrawPrimitiveHelper(this.viewer);
        this.drawHelper.startDrawingPolygon({
            isClapOnTerrian: true,
            callback: function (positions) {
                let newEntity = _self._ds.entities.add({
                    name: options.name,
                    type: KmlFeatureType.POLYGON,
                    polygon:{
                        hierarchy: positions,
                        material: Cesium.Color.fromAlpha(color, opacity),
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    }
                });
                newEntity.kmlData = _self._getFeatureInfo(newEntity);
                _self._addToParent(pid, newEntity);
                let treeNode = {
                    layerId: _self.id,
                    id: newEntity.id,
                    name: newEntity.name,
                    type: newEntity.type,
                    pid: pid,
                    isChecked: true,
                    kmlData: newEntity.kmlData,
                    icon: _self._getIcon(KmlFeatureType.POLYGON)
                };
                callbacks && callbacks(treeNode);
            }
        });
    };

    /**
     * 新建文件夹
     * @param pid
     * @param {Object}options
     * @param {String}[options.name]
     * @param callbacks
     */
    addKmlFloder (pid, options, callbacks) {
        let newEntity = this._ds.entities.add({
            name: options.name,
            type: KmlFeatureType.FLODER,
            _children: []
        });
        this._addToParent(pid, newEntity);
        let treeNode = {
            layerId: this.id,
            id: newEntity.id,
            name: newEntity.name,
            type: newEntity.type,
            pid: pid,
            isChecked: true,
            kmlData: newEntity.kmlData,
            icon: this._getIcon(KmlFeatureType.FLODER)
        };
        callbacks && callbacks(treeNode);
    };

    _addToParent (pid, childEntity) {
        let entity = this._ds.entities.getById(pid);
        if (entity) {
            if(entity.type === KmlFeatureType.type) {
                entity._children.push(childEntity);
            }
        }
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

    /**
     * 构建前端用的tree结构
     * @param ds
     * @private
     */
    _buildTree (ds, isVisble) {
        this.tree = [];
        this.entitiesID = [];
        for (let i = 0; i < ds.entities.values.length; i++) {
            let entity = ds.entities.values[i];
            entity.dsName = 'KML';
            if (this.entitiesID.indexOf(entity.id) < 0) {
                let parentNode = this._getEntityBaseInfo(entity);
                this.tree .push(this._getChildBaseInfo(entity, parentNode));
            }
            if (!isVisble) {
                this.nodeVisible({id: entity.id,type: entity.type}, isVisble);
            }
        }
    };

    _getChildBaseInfo (entity, parentNode) {
        if (entity) {
            if (entity.type === KmlFeatureType.FLODER) {
                parentNode.children = [];
                entity._children.forEach((entity) => {
                    let pInfo = this._getEntityBaseInfo(entity);
                    if (entity.type === KmlFeatureType.FLODER) {
                        this._getChildBaseInfo(entity, pInfo);
                    }
                    parentNode.children.push(pInfo);
                });
            }
        }
        return parentNode;
    };

    /**
     * 获取要素的类型
     * @param {Entity}entity
     * @return {number}
     * @private
     */
    _getEntityBaseInfo(entity) {
        this.entitiesID.push(entity.id);
        let type = KmlFeatureType.FLODER;
        let icon = "iconfont icon-wenjianjia1";
        let info = {}, coors = [];
        if (Cesium.defined(entity.label)) {
            entity.label.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
        }
        if (Cesium.defined(entity._children) && entity._children.length > 0) {
            type = KmlFeatureType.FLODER;
        }
        if (Cesium.defined(entity.billboard)) {
            type = KmlFeatureType.POINT;
            icon =  "iconfont icon-dingwei";
            info.style = {
                iconUrl: entity.billboard.image._value.url ? entity.billboard.image._value.url : entity.billboard.image._value,
                color: entity.billboard.color ? entity.billboard.color._value.toRgba() : Cesium.Color.WHITE.toRgba()
            };
            info.coord = this._cartesianToDegree(entity.position._value);

            entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
            let imgUrl = entity.billboard.image.getValue().url;
            if (imgUrl.indexOf('http://maps.google.com/mapfiles') > -1) {
                entity.billboard.image = imgUrl.replace('http://maps.google.com/mapfiles', pinImageBasePath);
            }
        }
        if (Cesium.defined(entity.polyline)) {
            icon =   "iconfont icon-weibiaoti2";
            type = KmlFeatureType.POLYLINE;
            entity.polyline.clampToGround = true;
            info.style = {
                width: entity.polyline.width ? entity.polyline.width._value : 1.0,
                color: entity.polyline.material && entity.polyline.material.color ? entity.polyline.material.color._value.toRgba() : Cesium.Color.WHITE.toRgba()
            };
            coors = [];
            entity.polyline.positions._value.forEach((cartesian) => {
                coors.push(this._cartesianToDegree(cartesian));
            });
            info.coord = coors;
        }
        if (Cesium.defined(entity.polygon)) {
            icon =  "iconfont icon-duobianxing";
            type = KmlFeatureType.POLYGON;
            entity.polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
            info.style = {
                color: entity.polygon.material && entity.polygon.material.color ? entity.polygon.material.color._value.toRgba() : Cesium.Color.WHITE.toRgba()
            };
            coors = [];
            let cars = entity.polygon.hierarchy._value.positions ? entity.polygon.hierarchy._value.positions : entity.polygon.hierarchy._value;
            cars.forEach((cartesian) => {
                coors.push(this._cartesianToDegree(cartesian));
            });
            info.coord = coors;
        }
        if(Cesium.defined(entity.rectangle)){
            icon =  "iconfont icon-duobianxing";
            type = KmlFeatureType.RECTANGLE;
            entity.rectangle.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
            info.style = {
                color: entity.rectangle.material && entity.rectangle.material.color ? entity.rectangle.material.color._value.toRgba() : Cesium.Color.WHITE.toRgba()
            };
            coors = [];
            let cars = entity.rectangle.coordinates._value ? entity.rectangle.coordinates._value : entity.rectangle.coordinates._value;
           /* cars.forEach((cartesian) => {
                coors.push(this._cartesianToDegree(cartesian));
            });*/
            info.coord = [Cesium.Math.toDegrees(cars.west),Cesium.Math.toDegrees(cars.south),Cesium.Math.toDegrees(cars.east),Cesium.Math.toDegrees(cars.north)];
        }
        entity.type = type;
        info.description = entity.des ? entity.des : '';
        entity.kmlData = info;
        return {
            layerId:this.id,
            name: entity.name,
            id: entity.id,
            type: entity.type,
            pid: entity.parent ? entity.parent.id : this.id,
            isChecked: entity.show ? entity.show : false,
            kmlData: entity.kmlData,
            icon:icon
        };
    };

    /**
     * 获取要素的基本信息
     * @param {Entity}entity
     * @private
     */
    _getFeatureInfo (entity) {
        let descr = entity.des?entity.des:'';
        let info = {
            description: descr
        };
        let coors=[];
        switch (entity.type) {
            case KmlFeatureType.POINT :
                info.style = {
                    iconUrl : entity.billboard.image._value.url?entity.billboard.image._value.url:entity.billboard.image._value,
                    color: entity.billboard.color ? entity.billboard.color._value.toRgba():Cesium.Color.WHITE.toRgba()
                };
                info.coord = this._cartesianToDegree(entity.position._value);
                break;
            case KmlFeatureType.POLYLINE:
                info.style = {
                    width : entity.polyline.width ? entity.polyline.width._value:1.0,
                    color : entity.polyline.material&&entity.polyline.material.color?entity.polyline.material.color._value.toRgba():Cesium.Color.WHITE.toRgba()
                };
                coors=[];
                entity.polyline.positions._value.forEach((cartesian)=>{
                    coors.push(this._cartesianToDegree(cartesian));
                });
                info.coord = coors;
                break;
            case KmlFeatureType.POLYGON:
                info.style = {
                    color: entity.polygon.material&&entity.polygon.material.color?entity.polygon.material.color._value.toRgba():Cesium.Color.WHITE.toRgba()
                };
                coors=[];
                let cars = entity.polygon.hierarchy._value.positions?entity.polygon.hierarchy._value.positions:entity.polygon.hierarchy._value;
                cars.forEach((cartesian)=>{
                    coors.push(this._cartesianToDegree(cartesian));
                });
                info.coord = coors;
                break;
        }
        return info;
    };

    _getIcon(type){
        let icon = "iconfont icon-wenjianjia1";
        switch (type){
            case KmlFeatureType.POLYGON:
                icon = "iconfont icon-duobianxing";
                break;
            case KmlFeatureType.POLYLINE:
                icon = "iconfont icon-weibiaoti2";
                break;
            case KmlFeatureType.POINT:
                icon = "iconfont icon-dingwei";
                break;
        }
        return icon;
    };
}
export default KmlLayer;
