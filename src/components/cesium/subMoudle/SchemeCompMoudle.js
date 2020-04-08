import Cesium from 'cesium/Cesium';
import store from '../../../store';
/**
 * 删除数组中的某一个对象
 *   _arr:数组
 *  _obj:需删除的对象
*/
function removeAaary (_arr, _obj) {
    var length = _arr.length;
    for (var i = 0; i < length; i++) {
        if (_arr[i] === _obj) {
            if (i === 0) {
                _arr.shift(); //    删除并返回数组的第一个元素
                return _arr;
            } else if (i === length - 1) {
                _arr.pop();//     删除并返回数组的最后一个元素
                return _arr;
            } else {
                _arr.splice(i, 1); //   删除下标为i的元素
                return _arr;
            }
        }
    }
}
class SchemeCompMoudle {
    constructor (viewer) {
        this.viewer = viewer;
        this._ds = new Cesium.CustomDataSource('TurbineScheme');
        this.viewer.dataSources.add(this._ds);
        this.handle = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    };

    /**
     * 进入方案比选模块
     */
    enterSchemeCompare () {
        this.schemes = {};
        this.addClickMouseEvent();
    };

    /**
     * 构建对比用的风机点位图标
     * @param {Object}schemeOptions                         方案属性
     * @param {String}[schemeOptions.schemeID]              方案编号
     * @param {String}[schemeOptions.imgUrl]                图标路径
     * @param {String}[schemeOptions.color]              标签颜色
     * @param {Object}options                               风机属性
     * @param {Number[]}[options.point]                     风机坐标
     * @param {String}[options.name]                        风机名称
     * @param {Number}[options.id]                          风机编号
     *
     */
    _createCompareTurbine (schemeOptions, options) {
        let entity = new Cesium.Entity({
            position: Cesium.Cartesian3.fromDegrees(options.point[0], options.point[1], options.point[2]),
            name: 'CompTurbine',
            billboard: {
                position: Cesium.Cartesian3.fromDegrees(options.point[0], options.point[1], options.point[2]),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.8),
                image: schemeOptions.imgUrl,
                horizontalOrigin: Cesium.HorizontalOrigin.Center,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
            label: {
                show: false,
                fillColor: Cesium.Color.fromCssColorString(schemeOptions.color),
                outlineColor: Cesium.Color.fromCssColorString(schemeOptions.color),
                outlineWidth: 1,
                text: options.name,
                font: '14px MicrosoftYaHei',
                backgroundColor: Cesium.Color.fromCssColorString('#333B4C'),
                backgroundPadding: new Cesium.Cartesian2(6, 4),
                showBackground: false,
                horizontalOrigin: Cesium.HorizontalOrigin.Center,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0.0, -39),
                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.8)
            }
        });
        entity.entityID = options.id;
        entity.txtColor = schemeOptions.color;
        entity.turbineName = options.name;
        entity.pointCoord = options.point;
        entity.schemeID = schemeOptions.schemeID;
        return entity;
    };

    /**
     * 创建重复的点
     * @param {Entity}entity
     * @return {*}
     */
    createSamplePosition (entity) {
        let sampleEntities = this._getSamplePositionEntity(entity.pointCoord);
        if (sampleEntities.length < 1) {
            this._ds.entities.add(entity);
            return entity;
        } else {
            if (sampleEntities[0].name === 'SampleTurbine') {
                sampleEntities[0].sampleEntities.push(entity);
                let imgUrl = this.getSampleIconUrl(sampleEntities[0].sampleEntities);
                sampleEntities[0].billboard.image = imgUrl;
                return sampleEntities[0];
            } else {
                sampleEntities.push(entity);
                let imgUrl = this.getSampleIconUrl(sampleEntities);
                console.log(imgUrl + ' /n  ' + entity.pointCoord[2] + '   ' + sampleEntities[0].pointCoord[2]);
                let sampleScheme = sampleEntities[0].schemeID;
                this._ds.entities.remove(sampleEntities[0]);
                let sampleEntity = this._ds.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(entity.pointCoord[0], entity.pointCoord[1], entity.pointCoord[2]),
                    name: 'SampleTurbine',
                    billboard: {
                        //  position: Cesium.Cartesian3.fromDegrees(entity.pointCoord[0], entity.pointCoord[1], entity.pointCoord[2]),
                        //  scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.8),
                        image: imgUrl,
                        horizontalOrigin: Cesium.HorizontalOrigin.Center,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM/* ,
                        heightReference:Cesium.HeightReference.CLAMP_TO_GROUND */
                    }
                });
                sampleEntity.pointCoord = entity.pointCoord;
                sampleEntity.sampleEntities = sampleEntities;
                //  将已加入的方案的比较用图标从方案中移除
                removeAaary(this.schemes[sampleScheme], sampleEntities[0]);
                //  将重复点用图标添加到对应的方案中
                this.schemes[sampleScheme].push(sampleEntity);
                return sampleEntity;
            }
        }
    };

    /**
     * 获取重叠标签的图标
     * @param sampleEntities
     * @return {string}
     */
    getSampleIconUrl (sampleEntities) {
        let length = 1;
        if (sampleEntities instanceof Array) {
            length = sampleEntities.length;
        }
        if (length > 7) {
            length = 7;
        }
        let url = 'static/schemecompare/white' + length + '.png';
        return url;
    };

    /**
     * 加载一个方案的风机图标
     * @param {String/Number}scheme                    方案的唯一标识
     * @param {Object}schemeOptions                    方案通用属性
     * @param {String}[schemeOptions.imgUrl]           该方案使用的风机图标
     * @param {String}[schemeOptions.color]            该方案使用的风机标签颜色
     * @param {Object[]}turbineOptions                 风机信息
     * @param {Number[]}[turbineOptions.point]         风机坐标
     * @param {String}[turbineOptions.name]            风机名称
     * @param {Number}[turbineOptions.id]              风机编号
     */
    createSchemeTurbines (scheme, schemeOptions, turbineOptions) {
        schemeOptions.schemeID = scheme;
        let turbinEntities = [];
        let positions = [];
        turbineOptions.forEach((options) => {
            positions.push(Cesium.Cartographic.fromDegrees(options.point[0], options.point[1]));
        });
        let promise = Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, positions);
        return Cesium.when(promise, (updatedPositions) => {
            updatedPositions.forEach((updatedPosition, index) => {
                turbineOptions[index].point = [Cesium.Math.toDegrees(updatedPosition.longitude), Cesium.Math.toDegrees(updatedPosition.latitude), updatedPosition.height];
                let entity = this.createSamplePosition(this._createCompareTurbine(schemeOptions, turbineOptions[index]));
                turbinEntities.push(entity);
            });
            this.schemes[scheme] = turbinEntities;
            return true;
        }).otherwise((error) => {
            return Cesium.when.reject(error);
        });
    };

    /**
     * 设置风机标签的可见性
     * @param {String/Number}scheme         方案的唯一识别
     * @param {Boolean}isVisible            是否可见
     */
    setSchemeTurbineNameVisible (scheme, isVisible) {
        let entities = this.schemes[scheme];
        if (entities instanceof Array) {
            entities.forEach((entity) => {
                if (Cesium.defined(entity.label)) {
                    entity.label.show._value = isVisible;
                }
            });
        }
    };

    /**
     * 设置风机标签的可见性
     * @param {String/Number}scheme         方案的唯一识别
     * @param {Boolean}isVisible            是否可见
     */
    setSchemeTurbineIconVisible (scheme, isVisible) {
        let entities = this.schemes[scheme];
        if (entities instanceof Array) {
            entities.forEach((entity) => {
                if (Cesium.defined(entity.billboard)) {
                    entity.billboard.show = isVisible;
                }
            });
        }
    };

    /**
     * 移除单个方案中的风机图标（含文本）
     * @param {String/Number}scheme
     */
    removeSchemeTurbines (scheme) {
        let entities = this.schemes[scheme];
        if (entities instanceof Array) {
            entities.forEach((entity) => {
                if (entity.name === 'SampleTurbine') {
                    this.removeEntityFromArrByScheme(entity.sampleEntities, scheme);
                    if (entity.sampleEntities.length < 2) {
                        this._ds.entities.remove(entity);
                        this._ds.entities.add(entity.sampleEntities[0]);
                        this.schemes[entity.sampleEntities[0].schemeID].push(entity.sampleEntities[0]);
                        this.schemes[entity.sampleEntities[0].schemeID] = removeAaary(this.schemes[entity.sampleEntities[0].schemeID], entity);
                    } else {
                        entity.billboard.image = this.getSampleIconUrl(entity.sampleEntities);
                    }
                } else {
                    this._ds.entities.remove(entity);
                }
            });
        }
        if (this.schemes.hasOwnProperty(scheme)) {
            delete this.schemes[scheme];
        }
    };

    removeEntityFromArrByScheme (_arr, scheme) {
        let length = _arr.length;
        for (let i = 0; i < length; i++) {
            if (_arr[i].schemeID === scheme) {
                if (i === 0) {
                    _arr.shift(); //    删除并返回数组的第一个元素
                    return _arr;
                } else if (i === length - 1) {
                    _arr.pop();//     删除并返回数组的最后一个元素
                    return _arr;
                } else {
                    _arr.splice(i, 1); //   删除下标为i的元素
                    return _arr;
                }
            }
        }
    };

    /**
     * 退出方案比较
     */
    exitSchemeCpmpare () {
        this.handle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.viewer.scene.preUpdate && this.viewer.scene.preUpdate.removeEventListener(this._addPerUpdate, this);
        this._ds.entities.removeAll();
        this.schemes = {};
    };

    addClickMouseEvent () {
        this.handle.setInputAction((click) => {
            let pos = click.position;
            this.selectEntity = this.getPickEntity(pos);
            let entityID = Cesium.defined(this.selectEntity) && (this.selectEntity.name === 'CompTurbine') ? this.selectEntity.entityID : '';
            if (Cesium.defined(this.selectEntity) && (this.selectEntity.name === 'CompTurbine')) {
                this.selectFanCenterCartesian = this.selectEntity.position._value;//   获取被选中的风机的顶部中心点的世界坐标
            }
            store.commit('clickFanInfo', {
                'fanId': entityID,
                'bool': !!(Cesium.defined(this.selectEntity) && (this.selectEntity.name === 'CompTurbine')),
                'clientX': Cesium.defined(pos) ? pos.x : null,
                'clientY': Cesium.defined(pos) ? pos.y : null
            });
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.handle.setInputAction((movement) => {
            let pos = movement.endPosition;
            let mouseInfo = [];
            if (this.entity && (this.entity.name === 'CompTurbine' || this.entity.name === 'SampleTurbine')) {
                this.entity.billboard.scale = 1.0;
            }
            this.entity = this.getPickEntity(pos);
            if (this.entity && this.entity.billboard && (this.entity.name === 'CompTurbine' || this.entity.name === 'SampleTurbine')) {
                this.entity.billboard.scale = 1.1;
                if (this.entity.name === 'SampleTurbine') {
                    this.entity.sampleEntities.forEach((entity) => {
                        mouseInfo.push({id: entity.entityID, name: entity.turbineName, scheme: entity.schemeID, color: entity.txtColor});
                    });
                }
            }
            this.mouseMoveCallBack && this.mouseMoveCallBack({pos: pos, turbineInfo: mouseInfo});
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        this.viewer.scene.preUpdate && this.viewer.scene.preUpdate.addEventListener(this._addPerUpdate, this);
    };

    /**
     * 设置重复点位鼠标滑过的回调函数
     * @param {Function}mouseMoveCallBack
     * [{id:1111,name:'t12'},{id:1111,name:'t12'}]
     */
    setMouseEventCallBack (mouseMoveCallBack) {
        this.mouseMoveCallBack = mouseMoveCallBack;
    };

    _addPerUpdate (scene, time) {
        let entityID = '';
        let position = {x: undefined, y: undefined};
        if (Cesium.defined(this.selectEntity) && (this.selectEntity.name === 'CompTurbine')) {
            position = this.getWinPosByCartesian(this.selectFanCenterCartesian);
            entityID = this.selectEntity.entityID;
        }
        store.commit('getHubCenterByClickFan', {
            'fanId': entityID,
            'clientX': Cesium.defined(position) ? position.x : undefined,
            'clientY': Cesium.defined(position) ? position.y : undefined
        });
    };

    /**
     * 从风机图标集合中获取相同位置风机点位
     * @private
     */
    _getSamplePositionEntity (point) {
        let sampleEntities = [];
        let entities = this._ds.entities.values;
        entities.forEach((entity) => {
            if (JSON.stringify(entity.pointCoord) === JSON.stringify(point)) {
                sampleEntities.push(entity);
            }
        });
        return sampleEntities;
    };

    /**
     * 将WGS84的世界坐标转换为屏幕坐标位置
     * @param cartesian                 要转换的世界坐标
     * @returns {Cesium.Cartesian2}     转换后的结果
     */
    getWinPosByCartesian (cartesian) {
        let winPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, cartesian);
        return winPos;
    };

    /**
     * 根据屏幕坐标点获取为model的entity对象
     * @param position          屏幕坐标点
     * @return {undefined}      entity或者undefined
     */
    getPickEntity (position) {
        const picked = this.viewer.scene.pick(position);
        //  获取选中的模型实体Entity
        if (Cesium.defined(picked) && Cesium.defined(picked.id) && (Cesium.defined(picked.id.label) || Cesium.defined(picked.id.billboard))) {
            return picked.id;
        } else {
            return undefined;
        }
    };

    getLatLngByWinPos (posWin) {
        //  捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
        let ray = this.viewer.camera.getPickRay(posWin);
        let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return this.changeCoordToLatLon(cartesian);
    };

    /**
     * 将投影坐标转为经纬度坐标
     * @param cartesian
     * @returns {*}
     */
    changeCoordToLatLon (cartesian) {
        if (cartesian) {
            //  将笛卡尔三维坐标转为地图坐标（弧度）
            let cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            //  将地图坐标（弧度）转为十进制的度数
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let alti = (this.viewer.camera.positionCartographic.height / 1000);
            return {x: lng, y: lat, z: alti};
        }
        return null;
    };
}
export default SchemeCompMoudle;
