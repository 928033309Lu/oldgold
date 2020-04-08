/* eslint-disable */
/**
 * Created by pengYX on 2018/5/29.
 */
import CustomDataSource from 'cesium/DataSources/CustomDataSource';
import JulianDate from 'cesium/Core/JulianDate';
import Cartesian3  from 'cesium/Core/Cartesian3' ;
import Cartesian2  from 'cesium/Core/Cartesian2' ;
import Ellipsoid  from 'cesium/Core/Ellipsoid' ;
import  CallbackProperty from 'cesium/DataSources/CallbackProperty' ;
import  PolylineGlowMaterialProperty from 'cesium/DataSources/PolylineGlowMaterialProperty' ;
import  Color from 'cesium/Core/Color' ;
import HeadingPitchRoll from 'cesium/Core/HeadingPitchRoll';
import TranslationRotationScale  from 'cesium/Core/TranslationRotationScale';
import  Quaternion from 'cesium/Core/Quaternion';
import Matrix4  from 'cesium/Core/Matrix4';
import ParticleSystem  from 'cesium/Scene/ParticleSystem';
import ConeEmitter from 'cesium/Scene/ConeEmitter';
import Transforms from 'cesium/Core/Transforms';

import BaseGloble from '../subMoudle/baseGloble';
/**
 * 一个方案中一个扇区的流线存储在一个dataSource中，一起加入，一起删除
 */
class streamLine extends BaseGloble{

    constructor (viewer){
        super(viewer);
        this.lineDS= new CustomDataSource('streamLine');//只存储流线的dataSource
        this.viewer.dataSources.add(this.lineDS);
        this.entities=this.lineDS.entities;

        this.particleCollection=[];
    };

    /**
     * 绘制一组流动的线
     * @param data      流动线数组
     * [
     *  {'fanID': 1,
     *   'lineData': [{'y': 2982642.0, 'x': 37588666.0, 'z': 589.709, 'v': 12.159464896355892},
     *              {'y': 2982642.24, 'x': 37588666.002, 'z': 589.709, 'v': 12.158080468481497}
     *             ]},
     *  {'fanID': 2,
     *   'lineData': [{'y': 2982642.0, 'x': 37588666.0, 'z': 589.709, 'v': 12.159464896355892},
     *              {'y': 2982642.24, 'x': 37588666.002, 'z': 589.709, 'v': 12.158080468481497}
     *             ]}
     * ]
     */
    createStreamLine(data){
        this.particleCollection=[];
        data.forEach((posInfo)=>{
            //this.createDynamicLine(posInfo.lineData)
           this.particleCollection.push(this.createParticleSystem(posInfo.lineData));
        });
       // this.addPerUpdate();
    };

    /**
     * 绘制一条流动的线
     * @param data      一条流线的坐标点数组
     *  [
     *   {'y': 2982642.0, 'x': 37588666.0, 'z': 589.709, 'v': 12.159464896355892},
     *   {'y': 2982642.24, 'x': 37588666.002, 'z': 589.709, 'v': 12.158080468481497}
     *  ]
     */
    createDynamicLine(data){
        let lastTime=JulianDate.now();
        let points=data;
        let currentNum=0;
        let linePoints=[];
        const initLinePostions=()=>{
            linePoints=[];
            currentNum=0;
            let lonLat=this.xiAnCoordTo84BL({x:points[currentNum].x,y:points[currentNum].y});
            let lonLat1=this.xiAnCoordTo84BL({x:points[currentNum+1].x,y:points[currentNum+1].y});

            linePoints.push(lonLat.x);
            linePoints.push(lonLat.y);
            linePoints.push(points[currentNum].z);
            linePoints.push(lonLat1.x);

            linePoints.push(lonLat1.y);
            linePoints.push(points[currentNum+1].z);
            currentNum+=2;
        };
        const getPositions=(time,result)=>{
            if(currentNum>=points.length){
                initLinePostions();
            }
            let step=(JulianDate.now().secondsOfDay-lastTime.secondsOfDay)*points[currentNum].v;
            if(Math.abs(step)>=0.01){
            	let lonLat=this.xiAnCoordTo84BL({x:points[currentNum].x,y:points[currentNum].y});
                linePoints.push(lonLat.x);
                linePoints.push(lonLat.y);
                linePoints.push(points[currentNum].z);
                currentNum++;
                lastTime=JulianDate.now();
                return Cartesian3.fromDegreesArrayHeights(linePoints,Ellipsoid.WGS84, result);
            }
        };
        return this.entities.add({
            name:"stramLine",
            polyline:{
                positions :  new CallbackProperty(getPositions, false),//Cesium.Cartesian3.fromDegreesArrayHeights(oldpoints,Cesium.Ellipsoid.WGS84),
                width :10,
                material : new PolylineGlowMaterialProperty({
                    glowPower : 0.2,
                    color : Color.BLUE.withAlpha(0.5)
                })
            }
        });
    };

    /**
     * 移除所有的流线
     */
    removeStreamLine(){
        this.lineDS.entities.removeAll();
        this.particleCollection.forEach((particle)=>{
            let par=particle.particle;
           this.viewer.scene.primitives.remove(par);
        });
    };

    createParticleSystem(data){
        let lastTime=JulianDate.now();
        let hpr=new HeadingPitchRoll(0, 0, 0);
        let points=data;
        let currentNum=1;
        let linePoints=[];
        const initPosition=()=>{};
        const computeModelMatrix=()=>{
            let lonLat=this.xiAnCoordTo84BL({x:points[0].x,y:points[0].y});
           return this.calModelMartrix(lonLat.x,lonLat.y,points[0].z,hpr);
        };
        let trs = new TranslationRotationScale(),rotation = new Quaternion();
        let translation = new Cartesian3(0,0,0),emitterModelMatrix = new Matrix4();
        const computeEmitterModelMatrix=()=>{
            hpr = HeadingPitchRoll.fromDegrees(0,0, 0, hpr);
            trs.translation = Cartesian3.fromElements(0, 0, 0, translation);
            trs.rotation = Quaternion.fromHeadingPitchRoll(hpr, rotation);
            return Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
        };

        let gravityScratch = new Cartesian3(0,0,0);
        const applyGravity=(p, dt)=>{
          /*  let position = p.position;
            Cesium.Cartesian3.normalize(position, gravityScratch);
            Cesium.Cartesian3.multiplyByScalar(gravityScratch, 0.0 * dt, gravityScratch);*/
             //p.velocity = points[currentNum].v;//Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);
            let step=(JulianDate.now().secondsOfDay-lastTime.secondsOfDay)*points[currentNum].v;
            if(Math.abs(step)>=0.0001){
                let lonLat = this.xiAnCoordTo84BL({x: points[currentNum].x, y: points[currentNum].y});
                p.position = Cartesian3.fromDegrees(lonLat.x, lonLat.y, points[currentNum].z);
                let opa=(1/points.length)*(points.length-currentNum);
                p.startColor=Color.GHOSTWHITE.withAlpha(opa);
                p.endColor=Color.GHOSTWHITE.withAlpha(opa);
                currentNum++;
                if (currentNum > points.length - 1) {
                    currentNum = 0;
                }
                lastTime = JulianDate.now();
            }
        };

       let particle= this.viewer.scene.primitives.add(new ParticleSystem({
            image : 'static/smoke.png',
            startColor : Color.GHOSTWHITE.withAlpha(0.9),
            endColor : Color.GHOSTWHITE.withAlpha(0.9),
            startScale : 3.0,
            endScale :1.0,
            minimumParticleLife : 10.0,
            maximumParticleLife :22.0,
           // particleLife:20.0,
            minimumSpeed : 1.0,
            maximumSpeed : 3.0,
            imageSize : new Cartesian2(32.0, 32.0),
            // Particles per second.
            emissionRate : 50.0,
            bursts : [
            ],
            lifetime : 0.05,
            emitter : new ConeEmitter(0.9),
            emitterModelMatrix : computeEmitterModelMatrix(),
            updateCallback : applyGravity
        }));
       return {'particle':particle,'modleMotrix':computeModelMatrix(),'emiterMatrix':computeEmitterModelMatrix};

    };

    calModelMartrix(longitude, latitude, altitude,headingPitchRoll){
        let targetPosition = Cartesian3.fromDegrees(longitude, latitude, altitude);
        let modelMatrix = new Matrix4();
        Transforms.headingPitchRollToFixedFrame(targetPosition, headingPitchRoll, Ellipsoid.WGS84, Transforms.eastNorthUpToFixedFrame, modelMatrix);
        return modelMatrix;
    };

    addPerUpdate(){
        this.viewer.scene.preUpdate.addEventListener((scene, time)=>{
            this.particleCollection.forEach((particle)=>{
                particle.particle.modelMatrix=particle.modleMotrix;
                particle.particle.emitterModelMatrix = particle.emiterMatrix();
            });
        });
    };

}

export default streamLine;
