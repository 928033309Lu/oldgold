/* eslint-disable */
/**
 * Created by pengYX on 2018/10/31.
 */

import Resource from 'cesium/Core/Resource';
import defaultValue from 'cesium/Core/defaultValue';
import Color from 'cesium/Core/Color';
import defined from 'cesium/Core/defined';
import DeveloperError from 'cesium/Core/DeveloperError';

/**
 * 绘制圆角矩形
 * @param cxt           绘制矩形的canvas
 * @param x             矩形的左上角距离canvas的左顶点
 * @param y             矩形的左上角距离canvas的左顶点
 * @param width         绘制的矩形的宽
 * @param height        绘制的矩形的高
 * @param radius        矩形圆角的半径
 */
function drawRoundRect(cxt, x, y, width, height, radius){
    cxt.beginPath();
    cxt.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
    cxt.lineTo(width - radius + x, y);
    cxt.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
    cxt.lineTo(width + x, height + y - radius);
    cxt.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
    cxt.lineTo(radius + x, height +y);
    cxt.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
    cxt.closePath();
}
function isNull( str ){
    if ( str == "" ) return true;
    let regu = "^[ ]+$";
    let re = new RegExp(regu);
    return re.test(str);
}
class RectLabelBuilder{
    /**
     * @param options
     *         { options.text}          [optional]      输入的文字
     *         {options.textColor}      [optional]      文字颜色        默认为'#FFFFFF'
     *         {options.font}           [optional]      文字的大小      默认为12
     *         {options.width}          [optional]      图片的宽度      默认为32
     *         {options.height}         [optional]      图片高度        默认与宽度相同
     *         {options.offset}         [optional]      文字的偏移量    默认为[0,0]
     *         {options.outline}        [optional]      是否有边框线    默认为false
     *         {options.outlinecolor}   [optional]      边框线颜色      默认为'#FFFFFF'
     *         {options.outlineopacity} [optional]      边框线透明度    默认为1.0
     *         {options.outlinewidth} [optional]        边框线宽度    默认为1.0
     */
    constructor(options){
        options=defaultValue(options,{});
        this.isBold = defaultValue(options.isBold, true);
        this.text=defaultValue(options.text,'    ');
        this.textColor=defaultValue(options.textColor,'#FFFFFF');
        this.fontSise=defaultValue(options.font,14);
        this.width=defaultValue(options.width,90);
        this.height=defaultValue(options.height,40);
        this.offset=defaultValue(options.offset,[0,0]);
        this.backColor=defaultValue(options.color,'#f48a0d');
        this.radius=defaultValue(options.radius,this.height/2);
        this.outline = defaultValue(options.outline, false);
        this.outlinecolor = defaultValue(options.outlinecolor,[225,225,225,1.0]);
        this.outlinewidth = defaultValue(options.outlinewidth,2.0);
        let canvas = document.createElement('canvas');
        canvas.width =  this.width;
        canvas.height = this.height;
        this._canvas=canvas;
    };

    /**
     * 绘制风机标签
     * @return {HTMLCanvasElement | *}
     */
    drawLabel(){
        this._canvas.width =  this.width;
        this._canvas.height = this.height;
        this._canvas.getContext('2d').clearRect(0,0,this._canvas.width,this._canvas.height);
        if(!isNull(this.text)){
            this.drawRectBack();
            this.drawText();
        }
        return this._canvas;
    };

    /**
     *  绘制圆角矩形图标
     */
    drawRectBack(){
        let ctx =this._canvas.getContext('2d');
        this.radius = this.height/2;
        //let txtSize=ctx.measureText(this.text);
        //this._canvas.width = txtSize.width*1.5+10;
        drawRoundRect(ctx,2,2,this._canvas.width-4,this._canvas.height-4,this.radius);
        ctx.fillStyle = this.backColor;
        ctx.fill();

        if(this.outline){
            drawRoundRect(ctx,0,0,this._canvas.width,this._canvas.height,this.radius);
            ctx.strokeStyle='rgba('+ this.outlinecolor[0]+','+this.outlinecolor[1]+','+this.outlinecolor[2]+','+this.outlinecolor[3]+')';
            ctx.lineWidth=this.outlinewidth;
            ctx.stroke()
        }

    };

    /**
     * 绘制文本
     */
    drawText(){
        let ctx=this._canvas.getContext('2d');
        ctx.font = this.fontSise+"px MicrosoftYaHei" + (this.isBold? 'bold':'');
        /*文字颜色*/
        ctx.fillStyle = this.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        /*文字内容*/
        let label = ctx.measureText(this.text);
        let txts = this.text.split('/n');
        let h = this.height-10, row = txts.length;
        txts.forEach((txt, index)=>{
            ctx.fillText(txt,this.width/2, 5 + h / (2 * row) + (h / row) * index);
        });


        /*插入文字，后面两个参数为文字的位置*/
        /*此处注意：text.width获得文字的宽度，然后就能计算出文字居中需要的x值; 最后一个参数表示的 y的位置*/
       // ctx.fillText(this.text, (this._canvas.width - label.width) / 2+this.offset[0], this.height/2+this.offset[1]);
    };


}

export default RectLabelBuilder;
