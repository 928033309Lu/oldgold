/* eslint-disable */
/**
 * Created by pengYX on 2018/4/26.
 */

import Cartesian3 from 'cesium/Core/Cartesian3';
import Resource from 'cesium/Core/Resource';
import CesiumMath from 'cesium/Core/Math';

window.THREE = require('../../../../static/thirdParty/three.min');
import LOD from '../../../../static/thirdParty/LOD';
require('../../../../static/VTKloader/VTKCFDLoader');//综合风图谱，风图谱，风能切片
require('../../../../static/VTKloader/VTKSHALoader');//机组震动区(5-1)
require('../../../../static/VTKloader/VTKVISLoader');//危险区（大湍流区）(3-1)

class threeLoad {
    constructor (container,viewer){
        this.viewer=viewer;
        this.threeContainer=container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 100000000);
        this.renderer = new THREE.WebGLRenderer({
            alpha: true/*,
            canvas: viewer.scene.canvas*/
        });
        this.renderer.autoClear = true;

        container.appendChild(this.renderer.domElement);
        this._3Dobjects=[];//存储各种VTK（风图谱，风能切片，大湍流区，机组震动区，综合风图谱，一种类型一个Group对象）

        this.vtkCFDLoader=new THREE.VTKCFDLoader();
        this.vtkVISLoader=new THREE.VTKVISLoader();
        this.vtkSHALoader=new THREE.VTKSHALoader();
        this.vtkLodObj=[];//分级分块加载的VTK数组（风图谱，大湍流区，机组震动区，综合风图谱，一种类型一个LOD对象）
        this.VTKmaterial=new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            side: THREE.DoubleSide,
            transparent: true,
            opacity:0.5
        });
        this._addPerUpdateEvent();

        let extenPos=[[115.23, 39.55],[116.23, 41.55]];
        const bottomLeft = this._cartToVec(Cartesian3.fromDegrees(extenPos[0][0], extenPos[0][1]));
        const topLeft =  this._cartToVec(Cartesian3.fromDegrees(extenPos[0][0], extenPos[1][1]));
        this.latDir = new THREE.Vector3().subVectors(topLeft, bottomLeft).normalize();

    };

    loadVTK(url,loader,group,centerPos){
        group.position.copy(Cartesian3.fromDegrees( centerPos[0],centerPos[1]));
        group.up.copy(this.latDir);
       return new Promise((resolve, reject)=>{
           loader.load(url,null,(geometry,speed)=>{
               geometry.computeVertexNormals();
               let mesh = new THREE.Mesh(geometry,this.VTKmaterial);
               mesh.scale.set(1, 1, 1);
               mesh.position.y = 0;
               mesh.rotation.x = Math.PI / 2;
               group.add(mesh);

               this._3Dobjects.push({'threeMesh': group ,'centerPos': centerPos,'name':group.name,});
               resolve(speed);//返回最大最小值
               console.log('load VTK success: '+group.name+';');
           });
       });
    };

    loadVTKLOD(basePath,loader,name,centerPos){
      return new Promise((resolve, reject)=>{
          Resource.fetchJson({url:basePath+'/index.json'}).then((data)=>{
              let speed=data.speed?data.speed:{max:7,min:3};
              resolve(speed);
              let lodGroup= new THREE.Group();
              lodGroup.name = name;
              let lod= new LOD();
              lod.name=name;
              lodGroup.add(lod);
              if(data.root.length>0){
                  let  levelInfo=data.root[0];
                  let levelGroup=new THREE.Group();
                  levelGroup.rotation.x = Math.PI / 2;
                  levelInfo.data.forEach((urlName)=>{
                      let vtkPath=basePath+urlName;
                      loader.load(vtkPath,speed,(geometry,maxSpeed, minSpeed)=>{
                          geometry.computeVertexNormals();
                          let mesh = new THREE.Mesh(geometry, this.VTKmaterial);
                          mesh.scale.set(1, 1, 1);
                          mesh.position.y=0;
                          levelGroup.add(mesh);
                        //  resolve([maxSpeed, minSpeed]);
                      });
                  });
                  lod.addLevel( levelGroup,(1000-levelInfo.SSE*10));
                  levelGroup.loaded=true;
                      console.log('load speedVTK success: '+ name+';');
                      this._3Dobjects.push({'threeMesh': lodGroup ,'centerPos': centerPos,'name':name});
                      this.scene.add(lodGroup);
              }
              this.vtkLodObj.push(lod);
          });
      });
    };

    loadVTKLODWithHeight(basePath,loader,name,centerPos,height){
        return new Promise((resolve, reject)=>{
            Resource.fetchJson({url:basePath+'/index.json'}).then((data)=>{
                let speed=data.speed?data.speed:{max:7,min:3};
                resolve(speed);
                let lodGroup= new THREE.Group();
                lodGroup.name = name;
                let lod= new LOD();
                lod.name=name;
                lodGroup.add(lod);
                if(data.root.length>0){
                    let  levelInfo=data.root[0];
                    let levelGroup=new THREE.Group();
                    levelGroup.rotation.x = Math.PI / 2;
                    levelInfo.data.forEach((urlName)=>{
                        let vtkPath=basePath+urlName;
                        loader.load(vtkPath,speed,(geometry,speedOut)=>{
                            geometry.computeVertexNormals();
                            let mesh = new THREE.Mesh(geometry, this.VTKmaterial);
                            mesh.scale.set(1, 1, 1);
                            mesh.position.z =height;
                            levelGroup.add(mesh);
                        });
                    });
                    lod.addLevel( levelGroup,(1000-levelInfo.SSE*10));
                    levelGroup.loaded=true;
                    console.log('load speedVTK success: '+ name +';');
                    this._3Dobjects.push({'threeMesh': lodGroup ,'centerPos': centerPos,'name':name});
                    this.scene.add(lodGroup);
                }
                this.vtkLodObj.push(lod);
            });
        });
    };

    createWindSplit(url,name,posCenter,extenPos,angle){
        this.cleanThreeVTK(name);
        let group=new THREE.Group();
        group.name=name;
        group.rotation.x = Math.PI / 2;
        //group.rotation.y = angle * Math.PI / 180;
        this.scene.add(group);
       return  this.loadVTK(url,this.vtkCFDLoader,group,posCenter,angle);
    };

    createWindMap(basePath,name,posCenter,angle){
        return this.loadVTKLOD(basePath,this.vtkCFDLoader,name,posCenter,angle);
    };

    createShakeArea(basePath,name,posCenter,angle){
        return this.loadVTKLOD(basePath,this.vtkSHALoader,name,posCenter,angle);
    };

    createTubulenceArea(basePath,name,posCenter,angle){

        return this.loadVTKLOD(basePath,this.vtkVISLoader,name,posCenter,angle);
    };

    createIntegrateWindMap(basePath,name,posCenter,height){
        this.cleanThreeVTK(name);
        return this.loadVTKLODWithHeight(basePath,this.vtkCFDLoader,name,posCenter,height);
    };

    /**
     * 通过VTK的名称清除掉
     * @param name   渲染VTK的名称
     */
    cleanThreeVTK(name){
        let removeObjs=[];
        this._3Dobjects.forEach((_3dobject,index)=>{
            if(_3dobject.name===name){
                removeObjs.push(_3dobject);
                this.scene.remove(_3dobject.threeMesh);//this.scene.children[index]
            }
        });
        removeObjs.forEach((objs)=>{
            let index=this._3Dobjects.indexOf(objs);
            if(index>-1){
                this._3Dobjects.splice(index,1);
            }
        });
        this.vtkLodObj.forEach((lod,index)=>{
           if(lod.name===name){
               this.vtkLodObj.splice(index,1);
           }
        });
    };

    /**
     * 渲染VTK
     * @param viewrCamera
     */
    _renderVTK () {
        if(this._3Dobjects.length>0){
            this.camera.fov = CesiumMath.toDegrees(this.viewer.camera.frustum.fovy);
            this.camera.updateProjectionMatrix();
            this._3Dobjects.forEach((_3dObject) => {
                let centerPos=_3dObject.centerPos;
                // convert lat/long center position to Cartesian3
                _3dObject.threeMesh.position.copy(Cartesian3.fromDegrees( centerPos[0],centerPos[1]));//Cesium.Cartesian3.fromDegrees( centerPos[0],centerPos[1])
                // get forward direction for orienting model
                _3dObject.threeMesh.lookAt(Cartesian3.fromDegrees(centerPos[0], centerPos[1], 1));
                _3dObject.threeMesh.up.copy(this.latDir);
                //_3dObject.threeMesh.rotation.z=_3dObject.angle * Math.PI / 180;
            });
            this.camera.matrixAutoUpdate = false;
            let cvm = this.viewer.camera.viewMatrix;
            let civm = this.viewer.camera.inverseViewMatrix;
            this.camera.matrixWorld.set(
                civm[0], civm[4], civm[8], civm[12],
                civm[1], civm[5], civm[9], civm[13],
                civm[2], civm[6], civm[10], civm[14],
                civm[3], civm[7], civm[11], civm[15]
            );
            this.camera.matrixWorldInverse.set(
                cvm[0], cvm[4], cvm[8], cvm[12],
                cvm[1], cvm[5], cvm[9], cvm[13],
                cvm[2], cvm[6], cvm[10], cvm[14],
                cvm[3], cvm[7], cvm[11], cvm[15]
            );

            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.camera.aspect = this.threeContainer.clientWidth / this.threeContainer.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.threeContainer.clientWidth, this.threeContainer.clientHeight);
        }
        this.renderer.render(this.scene, this.camera);
        this. _updateLods();
    };

    _updateLods(){
        this.vtkLodObj.forEach((lod) => {
            lod.cesiumUpdate(this.viewer.camera);
        });
    };

    _addPerUpdateEvent(){
        //this.viewer.clock.onTick.addEventListener(this._renderVTK,this);
        this.viewer.scene.preUpdate.addEventListener(this._renderVTK,this);
    };

    clearAllVtk(){
        this._3Dobjects.forEach((_3dObject)=>{
            this.scene.remove(_3dObject);
        });
        this._3Dobjects=[];

    };

    _cartToVec(cart){
        return new THREE.Vector3(cart.x, cart.y, cart.z);
    };

}

export default threeLoad;
