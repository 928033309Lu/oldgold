/* eslint-disable */
/**
 * Created by pengYX on 2018/7/19.
 */
import Cesium from 'cesium/Cesium';

class MesureEntity{
    constructor(viewer,isPolygon){
        this.minPoints=isPolygon?3:2;
        this.isPolygon=isPolygon;
        this.scene=viewer.scene;
        let b=new Cesium.CustomDataSource('temp');
        viewer.dataSources.add(b);
        this.entitis = b.entities;
    };

    drawShape(positionData){
        if(this.isPolygon){
            return this.entitis.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7))
                }
            });
        }else {
            return this.entitis.add({
                polyline : {
                    positions : positionData,
                    clampToGround : false,
                    width : 2
                }
            });
        }
    }

}

export default MesureEntity;