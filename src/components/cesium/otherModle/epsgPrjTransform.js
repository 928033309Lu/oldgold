/* eslint-disable */
/**
 * Created by pengYX on 2018/11/5.
 */
let proj4= require('../../../../static/thirdParty/proj4');

import {crsdef} from './epsg';

class EpsgPrjTransfrom{

    constructor(farmEpsgid){
        this._epsgid=farmEpsgid;
    };

    /**
     * WGS84经纬度坐标转换为风场的投影坐标
     * @param point  {Object}   {x:25564866.23,y:152648}
     * @return       {Array}    [110.23,25.3654454]
     */
    lonLatToCoords(point){
        return EpsgPrjTransfrom.transForm(4326,this._epsgid,[point.x,point.y]);
    };

    /**
     * 将当前风场的投影坐标转换为WGS84经纬度坐标
     * @param point  {Object}   {x:25564866.23,y:152648}
     * @return       {Array}    [110.23,25.3654454]
     */
    coordsToLonlat(point){
        return EpsgPrjTransfrom.transForm(this._epsgid,4326,[point.x,point.y]);
    };

    /*/!**
     * 将点从原始坐标系转换为目标坐标系
     * @param fromEpsgid                点原始的坐标系对应的EPSG号
     * @param toEpsgid                  目标坐标系对应的EPSG号
     * @param point       {Object}      {x:25564866.23,y:152648}
     *!/
    transForm(fromEpsgid,toEpsgid,point){
       return  proj4(crsdef['EPSG:'+fromEpsgid],crsdef['EPSG:'+toEpsgid]).forward([point.x,point.y]);
    };*/

}
EpsgPrjTransfrom.transForm=function (fromEpsgid,toEpsgid,point) {
    if (fromEpsgid && toEpsgid){
        return  proj4(crsdef['EPSG:'+fromEpsgid],crsdef['EPSG:'+toEpsgid]).forward(point);
    } else {
        return {x:0,y:0};
    }
    
};
export default EpsgPrjTransfrom;
