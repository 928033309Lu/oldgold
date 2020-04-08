/* eslint-disable */
/**
 * Created by pengYX on 2018/10/31.
 */

import Resource from 'cesium/Core/Resource';
import defaultValue from 'cesium/Core/defaultValue';
import defined from 'cesium/Core/defined';
import DeveloperError from 'cesium/Core/DeveloperError';
/**
 * 使用三次贝塞尔曲线模拟椭圆2
 * 此方法也会产生当lineWidth较宽，椭圆较扁时，长轴端较尖锐，不平滑的现象,这种方法比前一个贝塞尔方法精确度高，但效率稍差
 * @param ctx   Canvas的2D绘图环境对象
 * @param x     椭圆中心横坐标
 * @param y     椭圆中心纵坐标
 * @param a     椭圆横半轴长
 * @param b     椭圆纵半轴长
 * @constructor
 */
function BezierEllipse2(ctx, x, y, a, b) {
    let k = .5522848,
        ox = a * k, // 水平控制点偏移量
        oy = b * k; // 垂直控制点偏移量

    ctx.beginPath();
    //从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
    ctx.moveTo(x - a, y);
    ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
    ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
    ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
    ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
    ctx.closePath();
    ctx.stroke();
}
class PNGBuilder{
    /**
     * @param options
     *         { options.text}      [optional]      输入的文字
     *         {options.textColor}      [optional]      文字颜色        默认为'#FFFFFF'
     *         {options.font}       [optional]      文字的大小      默认为12
     *         {options.width}      [optional]      图片的宽度      默认为32
     *         {options.height}     [optional]      图片高度        默认与宽度相同
     *         {options.offset}     [optional]      文字的偏移量    默认为[0,0]
     *
     */
    constructor(options){
        this.text=defaultValue(options.text,'    ');
        this.textColor=defaultValue(options.textColor,'#FFFFFF');
        this.fontSise=defaultValue(options.font,14);
        this.width=defaultValue(options.width,32);
        this.height=defaultValue(options.height,options.width);
        this.offset=defaultValue(options.offset,[0,0]);
        this.waterColor=defaultValue(options.color,'#00B851');//#00B851
        let canvas = document.createElement('canvas');
        canvas.width =  this.width;
        canvas.height = this.height;
        this._canvas=canvas;
    };

    /**
     * 绘制风机标签
     * @return {HTMLCanvasElement | *}
     */
    drawFanLabel(){
        this._canvas.getContext('2d').clearRect(0,0,this._canvas.width,this._canvas.height);
        this.drawWaterdroplet();
        this.drawText();
        return this._canvas
    };

    reDrawCanvas(){
        this._canvas.getContext('2d').clearRect(0,0,this._canvas.width,this._canvas.height);
        this.drawWaterdroplet();
        this.drawText();
        return this._canvas
    };

    /**
     *  绘制水滴形状图标
     */
    drawWaterdroplet(){
        let ctx =this._canvas.getContext('2d');
        let circleRadius=(this.width-2)/2;
        let circlePoint=[this.width/2,circleRadius];
        let ellipsePoint=[this.width/2,this.height-7];
        let tranglePoint=[this.width/2,circleRadius*2+3];
        /******绘制椭圆阴影****/
        ctx.fillStyle = "rgba(34, 38, 18,1)";
        ctx.lineWidth=1.5;
        ctx.strokeStyle="rgba(34, 38, 18,1)";

        BezierEllipse2(ctx,tranglePoint[0],tranglePoint[1],10,3);
        ctx.fill();
        /*******绘制水滴******/
        ctx.fillStyle = this.waterColor;
        ctx.strokeStyle=this.waterColor;
        ctx.beginPath();
        ctx.arc(circlePoint[0],circlePoint[1],circleRadius,Math.PI/6,Math.PI*5/6,true);
        ctx.lineTo(tranglePoint[0],tranglePoint[1]);
        ctx.closePath();
        ctx.fill();
    };

    /**
     * 绘制文本
     */
    drawText(){
        let ctx=this._canvas.getContext('2d');
        ctx.font = this.fontSise+"px MicrosoftYaHei bold";
        /*文字颜色*/
        ctx.fillStyle = this.textColor;
        /*文字内容*/
        let label = ctx.measureText(this.text);
        /*插入文字，后面两个参数为文字的位置*/
        /*此处注意：text.width获得文字的宽度，然后就能计算出文字居中需要的x值; 最后一个参数表示的 y的位置*/
        ctx.fillText(this.text, (this.width - label.width) / 2+this.offset[0], this.height/2+this.offset[1]);
    };


}

export default PNGBuilder;
