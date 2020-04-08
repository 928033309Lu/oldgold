import DrawPrimitiveHelper from '../otherModle/drawEditHelper/drawPrimitiveHelper';
import Cesium from 'cesium/Cesium';
import  {KmlFeatureType} from './kmlMoudle/KmlFeatureType';

/**
 * 即时标绘模块
 */
class PlotMoudle {
    constructor (viewer) {
        this.viewer = viewer;
        this.drawHelper = new DrawPrimitiveHelper(viewer);
        this.plotDS = new Cesium.CustomDataSource('PlotLayer');
        this.viewer.dataSources.add(this.plotDS);
    };

    /**
     * 绘制图标点
     * @param {Object}options                   绘制图标所需样式信息
     * @param {String}[options.imgUrl]          图标路径
     * @param {String}[options.text]            文本标注信息
     * @param {Number}[options.fontSize]        文本标注字体大小
     * @param {String}[options.fontColor]       文本标注颜色
     * @param {Number}[options.scale]           图标缩放倍数
     */
    drawIconPoint (options) {
        let _self=this;
        options = Cesium.defaultValue(options, {});
        if (!Cesium.defined(options.imgUrl)) {
            throw new Cesium.DeveloperError('imgUrl is required.' );
        }
        let color =Cesium.defined(options.fontColor) ? Cesium.Color.fromCssColorString(options.fontColor): Cesium.Color.WHITE;
        let size = Cesium.defaultValue(options.fontSize, 20);
        let scale = Cesium.defaultValue(options.scale, 1.0);
        let text = Cesium.defaultValue(options.text, ' ');
        this.drawHelper.startDrawIconPoint({
            callback: function (positions) {
                _self.plotDS.entities.add({
                    name:'Plot',
                    type: KmlFeatureType.POINT,
                    position: positions[0],
                    billboard: {
                        image: options.imgUrl,
                        scale: scale,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
                    },
                    label: {
                        text: text,
                        font: size + 'px sans-serif',
                        fillColor:color,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                        pixelOffset : new Cesium.Cartesian2(20.0, -35)
                    }
                });
            }
        });
    };

    /**
     * 绘制多边形
     * @param {Object}options                      多边形的样式
     * @param {String}[options.color]              多边形的填充颜色'#FFF'
     * @param {Number}[options.opacity]            多边形填充色的透明度
     */
    drawPolygon (options) {
        let _self=this;
        let color =Cesium.defined(options.color) ? Cesium.Color.fromCssColorString(options.color): Cesium.Color.GREEN.withAlpha(0.6);
        let opacity = Cesium.defaultValue(options.opacity, 0.6);
        this.drawHelper.startDrawingPolygon({
            isClapOnTerrian:true,
            callback: function (positions) {
                _self.plotDS.entities.add({
                    name:'Plot',
                    type: KmlFeatureType.POLYGON,
                    polygon:{
                        hierarchy:positions,
                        material:Cesium.Color.fromAlpha(color, opacity),
                        heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                    }
                });
            }
        });
    };

    /**
     * 绘制折现
     * @param {Object}options                   折线的样式
     * @param {String}[options.color]           折线的颜色'#FFF'
     * @param {Number}[options.opacity]         折线的颜色透明度
     * @param {Number}[options.width]           折线的线宽
     */
    drawPolyline (options) {
        let _self=this;
        let color = Cesium.defined(options.color) ? Cesium.Color.fromCssColorString(options.color): Cesium.Color.GREEN.withAlpha(0.6);
        let opacity = Cesium.defaultValue(options.opacity, 0.6);
        let width = Cesium.defaultValue(options.width, 3);
        this.drawHelper.startDrawingPolyline({
            isClapOnTerrian:true,
            callback:function (positions) {
                _self.plotDS.entities.add({
                    name:'Plot',
                    type: KmlFeatureType.POLYLINE,
                    polyline:{
                        positions:positions,
                        width:width,
                        clampToGround:true,
                        material:Cesium.Color.fromAlpha(color, opacity)
                    }
                });
            }
        },true);
    };

    /**
     * 绘制圆形
     * @param {Object}options                      圆形的样式
     * @param {String}[options.color]              圆形的填充颜色'#FFF'
     * @param {Number}[options.opacity]            圆形填充色的透明度
     */
    drawCircle (options) {
        let _self=this;
        let color =Cesium.defined(options.color) ? Cesium.Color.fromCssColorString(options.color): Cesium.Color.GREEN.withAlpha(0.6);
        let opacity = Cesium.defaultValue(options.opacity, 0.6);
        this.drawHelper.startDrawingCircle({
            isClapOnTerrian:true,
            callback:function (positions,radius) {
                _self.plotDS.entities.add({
                    name:'Plot',
                    type: KmlFeatureType.CIRCLE,
                    position:positions,
                    ellipse:{
                        semiMinorAxis:radius,
                        heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                        semiMajorAxis:radius,
                        material:Cesium.Color.fromAlpha(color, opacity)
                    }
                });
            }
        });
    };

    /**
     * 绘制直线箭头（贴地）
     * @param {Object}options                      多边形的样式
     * @param {String}[options.color]              多边形的填充颜色'#FFF'
     * @param {Number}[options.opacity]            多边形填充色的透明度
     */
    drawArrowStright (options) {
        let _self=this;
        let color =Cesium.defined(options.color) ? Cesium.Color.fromCssColorString(options.color): Cesium.Color.GREEN.withAlpha(0.6);
        let opacity = Cesium.defaultValue(options.opacity, 0.6);
        this.drawHelper.startDrawArrowStright({
            isClapOnTerrian:true,
            callback:function (positions) {
                _self.plotDS.entities.add({
                    name:'Plot',
                    type: KmlFeatureType.ARROWSTRAIGHT,
                    polygon:{
                        hierarchy:positions,
                        heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                        material:Cesium.Color.fromAlpha(color, opacity)
                    }
                });
            }
        });
    };

    clearPlots () {
        this.plotDS.entities.removeAll();
        this.stopDrawPlots();
    };

    stopDrawPlots () {
        this.drawHelper&&this.drawHelper.stopDrawing();
    };
}

export default PlotMoudle;
