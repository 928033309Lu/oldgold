/* eslint-disable */
/**
 * Created by pengYX on 2018/6/5.
 */
let proj4= require('../../../../static/thirdParty/proj4');
import {crsdef} from './epsg';
/**
 * 通过proj4利用EPSG编号进行西安80(高斯投影，3度分带 25-45带内)大地坐标和WGS84经纬度坐标之间的正反装换
 */
class epsgPrjTrans{

    constructor (){
      /*  proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");
        //45
        proj4.defs("EPSG:2369","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2368","+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2367","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2366","+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2365","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2364","+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2363","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2362","+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2361","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2360","+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2359","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2358","+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2357","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2356","+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2355","+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2354","+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2353","+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2352","+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2351","+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2350","+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        //25
        proj4.defs("EPSG:2349","+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");



        proj4.defs("EPSG:2327","+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=13500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2328","+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=14500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2329","+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=15500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2330","+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=16500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2331","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=17500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2332","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=18500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2333","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=19500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2334","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=20500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2335","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=21500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2336","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=22500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
        proj4.defs("EPSG:2337","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=23500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");*/
        this.zoneEPSG= {
            ZONE13:'EPSG:2327',
            ZONE14:'EPSG:2328',
            ZONE15:'EPSG:2329',
            ZONE16:'EPSG:2330',
            ZONE17:'EPSG:2331',
            ZONE18:'EPSG:2332',
            ZONE19:'EPSG:2333',
            ZONE20:'EPSG:2334',
            ZONE21:'EPSG:2335',
            ZONE22:'EPSG:2336',
            ZONE23:'EPSG:2337',//上面为国内西安80，6度带（含当前）
            ZONE25:'EPSG:2349',//下面为国内西安80，3度带（含当前）
            ZONE26:'EPSG:2350',
            ZONE27:'EPSG:2351',
            ZONE28:'EPSG:2352',
            ZONE29:'EPSG:2353',
            ZONE30:'EPSG:2354',
            ZONE31:'EPSG:2355',
            ZONE32:'EPSG:2356',
            ZONE33:'EPSG:2357',
            ZONE34:'EPSG:2358',
            ZONE35:'EPSG:2359',
            ZONE36:'EPSG:2360',
            ZONE37:'EPSG:2361',
            ZONE38:'EPSG:2362',
            ZONE39:'EPSG:2363',
            ZONE40:'EPSG:2364',
            ZONE41:'EPSG:2365',
            ZONE42:'EPSG:2366',
            ZONE43:'EPSG:2367',
            ZONE44:'EPSG:2368',
            ZONE45:'EPSG:2369'
        };
       // this.crsdef=crsdef;
    };

    /**
     * 80大地坐标（3度分带 高斯投影）转84经纬度坐标
     * @param point         要转换的大地坐标（带代号）
     * @return [lon,lat]    返回的经纬度坐标（数组）
     */
    coordTOLatLon(point){
        let x=point.x.toString(),p=[0,0];
        if(x.length>=8){
            let zone=x.substr(0, 2);
            p= proj4(crsdef[this.zoneEPSG['ZONE'+zone]],crsdef["EPSG:4326"]).forward([point.x,point.y]);
        } else{
            p= [0,0];
        }
        return p;
    };

    /**
     * 84经纬度坐标转80大地坐标（3度分带 高斯投影）
     * @param point     要转换的84经纬度坐标{x:108.2,y:34.2}
     * @return [x,y]    返回的80大地坐标值
     */
    latLonTOCoord(point){
         let zone=Math.round(point.x/3);
        return proj4(crsdef["EPSG:4326"],crsdef[this.zoneEPSG['ZONE'+zone]],[point.x,point.y]);
    };

}

export default epsgPrjTrans;
