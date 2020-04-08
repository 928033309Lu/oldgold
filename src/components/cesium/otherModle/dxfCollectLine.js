import CustomDataSource from 'cesium/DataSources/CustomDataSource';
import Resource from 'cesium/Core/Resource';
import Color from 'cesium/Core/Color';
import defined from 'cesium/Core/defined';
import defaultValue from 'cesium/Core/defaultValue';
import Entity from 'cesium/DataSources/Entity';
import Cartesian3 from 'cesium/Core/Cartesian3';
import Cartesian2 from 'cesium/Core/Cartesian2';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import VerticalOrigin from 'cesium/Scene/VerticalOrigin';
import HorizontalOrigin from 'cesium/Scene/HorizontalOrigin';
import HeightReference from 'cesium/Scene/HeightReference';
import LabelStyle from 'cesium/Scene/LabelStyle';
import DistanceDisplayCondition from 'cesium/Core/DistanceDisplayCondition';
import SceneTransforms from 'cesium/Scene/SceneTransforms';
import TowerLine from "./towerLine";
import CesiumMath from 'cesium/Core/Math';

let turf = require('../../../../static/thirdParty/turf');

let towerLineColor = new Color(0.051, 1, 0.1176, 1);//Color.HOTPINK.withAlpha(0.6)
let towerLabelHight = new Color(0.2, 0.78, 0.43, 1), towerLabelColor = new Color(0.94, 0.94, 0.94, 1);

class DxfCollectLine {
    constructor (viewer) {
        this.viewer = viewer;
        this.lineDS = new CustomDataSource('LineDS');// 存储集电线路--编辑用二维辅助线
        this.modelLineDS = new CustomDataSource('modelLineDS');// 存储立塔用线路数据,弧线和标签
        this.entities = this.lineDS.entities;
        this.viewer.dataSources.add(this.lineDS);
        this.viewer.dataSources.add(this.modelLineDS);
        this.towerLine = new TowerLine(viewer);
        this.handle = new ScreenSpaceEventHandler(viewer.scene.canvas);
    };

    /**
     * 解析dxf转换后的集电线路json数据
     * @param {Object}data              集电线路转换后的json数据
     */
    loadDxfCollectLine (data) {
        data = defaultValue(data, {});
        let towers = defaultValue(data.transTower, []);
        let lines = defaultValue(data.transLine, []);
        let towersInfo = this.drawTowers(towers);
        this.drawRouteLines(lines, towersInfo);
    };

    /**
     * 移除塔信息
     */
    removeDxfCollectLine () {
        this.lineDS.entities.removeAll();
        this.modelLineDS.entities.removeAll();
        this.towerLine && this.towerLine.removeAllCollection();
    };

    /**
     * 添加立塔模型的标签信息
     * @private
     */
    _addModelLableInfo (towerInfo) {
        let coord = towerInfo.coordinate, towerName = towerInfo.towerID, offsetHeight = parseFloat(towerInfo.properties.nominalHeight);
        let entity = this.modelLineDS.entities.add({
            position: Cartesian3.fromDegrees(coord[0], coord[1], coord[2] + offsetHeight + 8),
            name: 'tower',
            label: {
                text: towerName,
                font: '12px sans-serif',
                fillColor: Color.BLACK,
                outlineWidth: 1.0,
                outlineColor: new Color(0.012, 0.13, 0.24, 0.0),
                showBackground: true,
                backgroundColor: towerLabelColor,
                backgroundPadding: new Cartesian2(7, 5),
                horizontalOrigin: HorizontalOrigin.RIGHT,
                verticalOrigin: VerticalOrigin.BOTTOM,
                style: LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cartesian2(0.0, 0.0),
                distanceDisplayCondition: new DistanceDisplayCondition(0.0, 1500.0)
            }
        });
        entity.towerInfo = towerInfo;
        entity.towerName = towerInfo.name;
    };

    /**
     * 绘制铁塔模型
     * @param {Array}towers     铁搭信息
     * @returns {Array}         铁塔对应的绝缘子串坐标数组
     */
    drawTowers (towers) {
        let towersInfo = {};
        towers.forEach((tower) => {
            let coord = tower.coordinate,
                callHeight = tower.properties.nominalHeight,
                angle = tower.properties.angle,
                towerType = tower.properties.towerType;
            let towerChuan = this.towerLine && this.towerLine['addModel' + towerType](coord[0], coord[1], coord[2], callHeight, angle, tower);
            towerChuan.towerInfo = tower;
            towersInfo[tower.uid] = towerChuan;
            this._addModelLableInfo(tower);
        });
        return towersInfo;
    };

    /**
     * 解析绘制弧垂
     * @param {Array}lines                  线路信息数组
     * @param {Object}towersInfo            铁塔信息及绝缘子串坐标信息
     */
    drawRouteLines (lines, towersInfo) {
        lines.forEach((line) => {
            let towerArray = line.towers;
            let preTower = towersInfo[towerArray[0]], nextTower, kValue;
            let positions = preTower.towerInfo.coordinate, coord;
            for (let i = 1; i < towerArray.length; i++) {
                nextTower = towersInfo[towerArray[i]];
                let point1 = preTower.chuanCoord[0];
                let point2 = nextTower.chuanCoord[0];
                kValue = preTower.towerInfo.properties.kValue;
                this._addLine(this.calArcLine(point1.groundPos, point2.groundPos, kValue), new Color(0, 0.776, 1, 1), this.modelLineDS.entities);
                this._addLine(this.calArcLine(point1.topPos, point2.topPos, kValue), new Color(0.988, 0, 0.165, 1), this.modelLineDS.entities);
                this._addLine(this.calArcLine(point1.btmLPos, point2.btmLPos, kValue), new Color(0.965, 1, 0, 1), this.modelLineDS.entities);
                this._addLine(this.calArcLine(point1.btmRPos, point2.btmRPos, kValue), new Color(0.165, 1, 0, 1), this.modelLineDS.entities);
                coord = nextTower.towerInfo.coordinate;
                positions = positions.concat([coord[0], coord[1], coord[2]]);
                preTower = nextTower;
            }
            let lineEntity = this._addLine(positions, new Color(0, 0.776, 1, 1), this.lineDS.entities);
            lineEntity.show = false;
            lineEntity.routeInfo = line;
        });
    };

    /**
     * 计算弧线
     * @param point1        挂点坐标1   [110.2,25.6,325]
     * @param point2        挂点坐标2   [110.2,25.6,325]
     * @return {T[] | string | *}
     */
    calArcLine (point1, point2, K) {
        K = K / 1000;
        let lineCount = 10;
        let p = [];
        p = p.concat(point1);
        let line = turf.lineString([point1, point2]);
        let from = turf.point(point1);
        let to = turf.point(point2);
        let distance = turf.distance(from, to) * 1000, h = point2[2] - point1[2];// 默认单位是米
        if (distance > 1) {
            //  let angle=Math.atan(h/(distance*1000));//线夹角
            let cos = distance / Math.sqrt(Math.pow(h, 2) + Math.pow(distance, 2));
            let stepDis = distance / lineCount;// 内插lineCount个点，默认单位是米
            for (let i = 1; i < lineCount; i++) {
                let cuX = i * stepDis;
                let cuY = h * cuX / (distance) + point1[2];
                let along = turf.along(line, cuX / 1000);// 内插点坐标
                let arcLength = K * cuX * (distance - cuX) / cos;// 弧垂
                let newP = [along.geometry.coordinates[0], along.geometry.coordinates[1], cuY - arcLength];
                p = p.concat(newP);
            }
        }
        p = p.concat(point2);
        return p;
    };

    _addLine (positions, color, entities) {
        if (positions.length % 3 !== 0) {
            return;
        }
        return entities.add({
            polyline: {
                positions: Cartesian3.fromDegreesArrayHeights(positions),
                width: 2,
                material: color
            }
        });
    };
}
export default DxfCollectLine;
