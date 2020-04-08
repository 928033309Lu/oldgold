/* eslint-disable */
/**
 * Created by pengYX on 2018/5/8.
 */
import Cesium from 'cesium/Cesium';
import Config from '../../../../build/config';

//export const aninationUrl='http://t2.tianditu.com/cia_w/wmts?layer=cia&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=2d02a4bf00cfa355abc3f7f7850dfcc7';
export const aninationUrl='http://www.google.cn/maps/vt?lyrs=h@189&gl=cn&x={x}&y={y}&z={z}';
export const boundryUrl= 'http://{s}.tianditu.gov.cn/ibo_w/wmts?layer=ibo&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=2d02a4bf00cfa355abc3f7f7850dfcc7';

export const turbineUrl = 'static/turbine25.glb';

export const fanVisibleHeightRange = [5, 15000];
export const farmVisibleHeightRange = [35000, 10000000000];
export const fanCenterHight = 0;
export const fanScale = 1;//0.0262;
export const farmEntities = [];
export const fanEntities = [];
export const mastEntities = [];
export const stationEntities = [];
export const DxfServerIp = '';
export const ACTIONTYPE = {
    EDIT: 4,
    PICK: 0,
    ADD: 1,
    MOVE: 2,
    DELETE: 3
};
export const baseS3Path = Config.getS3Path();//'https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/';
export const glowFarmPath = 'static/fanGlow/shan00';
export const roadPathUrl = 'road.json';
export const towerPathUrl = 'tower.json';
export const syzPathUrl = 'syz.json';
export const roadRestrict = 'road_restrict.json';
export const lineRestrict = 'line_restrict.json';
export const restrictUrl = 'custom_restrict.json';
export const redlineUrl = 'red_line2.json';
export const noiseFiledUrl='noise/noise.png';

export const chinaRoadInfo={url:'http://52.83.226.193:8080/geoserver/Infrastructure/wms',layers:'Chind_road_line'};

//'static/model/station1.glb'; //
export const stationURL =baseS3Path+"models/file.glb";// "https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/file.glb";//升压站

export const B07_Z1Url =baseS3Path+"models/tower/35B07-Z1-24.gltf";// "https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/tower/35B07-Z1-24.gltf";//铁塔
export const B07_J1Url = baseS3Path+"models/tower/35B07-J1-24.gltf";//"https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/tower/35B07-J1-24.gltf";//铁塔
export const B10_SZ1Url = baseS3Path+"models/tower/35B10-SZ1-24.gltf";//"https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/tower/35B10-SZ1-24.gltf";//铁塔
export const B10_SJ1Url = baseS3Path+"models/tower/35B10-SJ1-24.gltf";//"https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/tower/35B10-SJ1-24.gltf";//铁塔

export const firstUrl =baseS3Path+"models/tower/DN1.gltf";// "https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/tower/DN1.gltf";//绝缘子
export const B08_J3 = baseS3Path+"models/CollectLineTower/35B08/35B08-J3/GLB/35B08-J3-";//'https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/CollectLineTower/35B08/35B08-J3/GLB/35B08-J3-';
export const B08_J4 =baseS3Path+"models/CollectLineTower/35B08/35B08-J4/GLB/35B08-J4-";// 'https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/CollectLineTower/35B08/35B08-J4/GLB/35B08-J4-';
export const B08_Z1 =baseS3Path+"models/CollectLineTower/35B08/35B08-Z1/GLB/35B08-Z1-";// 'https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/CollectLineTower/35B08/35B08-Z1/GLB/35B08-Z1-';
export const B10_SJ3 =baseS3Path+"models/CollectLineTower/35B10/35B10-SJ3/GLB/35B10-SJ3-";// 'https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/CollectLineTower/35B10/35B10-SJ3/GLB/35B10-SJ3-';
export const B10_SJ4 =baseS3Path+"models/CollectLineTower/35B10/35B10-SJ4/GLB/35B10-SJ4-";// 'https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/CollectLineTower/35B10/35B10-SJ4/GLB/35B10-SJ4-';
export const B10_SZ1 = baseS3Path+"models/CollectLineTower/35B10/35B10-SZ1/GLB/35B10-SZ1-";//'https://s3.cn-north-1.amazonaws.com.cn/goldfarm2/models/CollectLineTower/35B10/35B10-SZ1/GLB/35B10-SZ1-';

export const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), 0, -Math.PI / 2);
export const hprmast = new Cesium.HeadingPitchRoll(0, 0, 0);
export const farmhpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(180), 0, 0);
export const farmhprWT = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), 0, 0);
export const terrianLevel = 14;
export const highModelColor=new Cesium.Color(0.2,0.78,0.43,1);//Cesium.Color.RED.withAlpha(0.3)
