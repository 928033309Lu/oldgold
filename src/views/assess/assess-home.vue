<style lang="less">
@import "../../styles/common.less";
@import "../home/home.less";
</style>
<template>
    <div class="home-container" :style="{cursor:canAddFan?'crosshair':''}" 
    v-loading="$store.state.client.globeLoading||this.waitingOneMinute" 
    :element-loading-text="$store.state.client.globeLoadingText" 
    @click="onClickAll"
    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" 
    element-loading-color="#D4EFF6" element-loading-custom-class="waitingOneMinute">
        <div class="logo"></div>

        <!-- 三维地球 -->
        <cesium-container ref="cesiumContainer" 
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-color="#D4EFF6" element-loading-custom-class="waitingOneMinute"></cesium-container>
        <!-- 收藏夹--后评估模式 -->
        <favorites-assess ref="favoritesAssess" :projects="projects" 
        @flyHome="onFlyHome"
        @cloceAssess="onCloceAssess"
        @projectClicked="onProjectClick"></favorites-assess> 

        <!-- 风机详情框 -->
        <assess-mast-tooltip ref="assessMastTooltip" :planPos="planPos" :planSelect1="planSelect1" :planSelect2="planSelect2"></assess-mast-tooltip>
        <assess-project-tip ref="assessProjectTip" :pos="pos" :projectsTip="projectsTip"
        @projectTipClick="onProjectTipClick" ></assess-project-tip>
    </div>
</template>
<script>
    import CesiumContainer from '../../components/cesium/cesium-container';
    import favoritesAssess from '../../components/favorites/favorites-assess';
    import util from '../../libs/util';
    import assessMastTooltip from '../../components/cesium/assess-mast-tooltip.vue';
    import assessProjectTip from '../../components/cesium/assess-project-tip.vue';

    export default{
        name:"assess",
        components: {
            CesiumContainer,
            favoritesAssess,
            assessMastTooltip,
            assessProjectTip
        },
        data () {
            return{
                planPos:{},
                pos:{},
                projectsTip: [],
                fanDetailShow: false,
                waitingOneMinute: false,
                canAddFan: false,
                projects: [],  //后评估项目数据
                projectsData:{},  //传三维的数据对象
                plans:[],   //方案列表
                plansChecked:[],  //提取默认方案
                planyunxingData:[],   //风机运行信息
                planshezhiData:[],   //风机设置信息
                planSelect1:[],  //过滤移入显示的设置信息
                planSelect2:[]   //过滤移入显示的运行信息
            }
        },
        watch: {
            waitingOneMinute () {
                this.$store.commit('globeLoading', {loading: this.waitingOneMinute, text: '数据获取中...'});
            },
            "$store.state.app.hoverProjectInfo":function(val){
                console.log(val)
            }
            
        },
        mounted(){
            // console.log("当前路由："+this.$route.path);  //vuex---routerPath存了 
            this.getProjects();  
        },
        methods: {
            //地球风机移入数据
            getProjectsTip(val){
                // console.log(val);
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                let id = val.infos.PINID? val.infos.PINID : val.infos.TID;
                util.assessajax.get("/windtrumpRest/api/BGALinfo/"+id, {
                    
                },config)
                .then(res=>{
                    let obj = JSON.parse(res.data);
                    // console.log(obj.data);
                    this.projectsTip = obj.data;
                    this.projectsTip.map((item,index)=>{
                        item.jx = item.jx.split(/[\s\n]/);
                        item.infos = val.infos;
                    })
                    // console.log(this.projectsTip);
                    // this.projectsTip[0].infos = val.infos;
                })
                
            },
            //收藏夹-后评估关闭按钮
            onCloceAssess(){
                this.$refs['cesiumContainer'].exitReEvalueMoudle();
            },
            onFlyHome(){
                this.$refs['cesiumContainer'].goHome();
                //关闭风机详情框
                this.onCloseAssessMastTooltip();
                //清空已有评估风场中风机模型
                this.$refs['cesiumContainer'].clearReEvalueTurbine();
            },
            //获取项目数据
            getProjects(){
                util.assessajax.get("/mapserver2014/rest/data/BGAL/.geojson", {
                   
                },).then(res => {
                    if(res.status != 200){
                        this.$message.error('获取项目数据失败！'+res.status);
                    }
                    // console.log(res.data);
                    this.projects = res.data.features;
                    
                    //传三维整个data数据对象
                    this.projectsData = res.data;
                    let imgUrl = "static/schemecompare/assfan.png"
                    this.$refs['cesiumContainer'].loadWindFileds(this.projectsData, imgUrl);
                    window.viewer.setFiledMouseEventCallback && window.viewer.setFiledMouseEventCallback({
                        infoCallBack:(res) => {
                            // console.log(res);
                            
                            if(res!=null){
                                this.getProjectsTip(res);
                            }else{
                                this.projectsTip=[];
                            }
                        },
                        infoMoveCallBack:(res) => {
                            // console.log(res.pos);
                            this.pos = res.pos;
                        }
                    });
                    
                }).catch(() => {
                   this.$message.error('获取项目数据失败！');
                });
                
            },
            //点击列表进入项目
            onProjectClick(projectInfo ){
                // console.log(projectInfo,"列表");
                 //关闭风机详情框
                 this.onCloseAssessMastTooltip();
                 //清空已有评估风场中风机模型
                this.$refs['cesiumContainer'].clearReEvalueTurbine();
                //点击项目获取所有风机数据
                this.getPlanData(projectInfo,false);
                //飞进入项目
                this.flyToProject(projectInfo.geometry.coordinates[0],projectInfo.geometry.coordinates[1]);
            },
            // 获取所有风机设置和运行数据
            getPlanData(projectInfo, isTip){
                console.log(projectInfo,"获取所有风机数据用的参数");
                // console.log(isTip);
                if(isTip){
                    var id = projectInfo.infos.PINID? projectInfo.infos.PINID : projectInfo.infos.TID;
                }else{
                    var id = projectInfo.properties.PINID? projectInfo.properties.PINID : projectInfo.properties.TID;
                }
                // console.log(id);
                //运行信息
                util.assessajax.get("/windtrumpRest/api/BGALSCADA/"+id, {
                   
                },).then(res=>{
                    let obj = JSON.parse(res.data);
                    // console.log(obj.data);
                    this.planyunxingData = obj.data;
                })
                //设计信息
                util.assessajax.get("/windtrumpRest/api/BGALDESIGN/"+id, {
                   
                },).then(res=>{
                    let obj = JSON.parse(res.data);
                    // console.log(obj.data);
                    this.planshezhiData = obj.data;
                    this.$refs['cesiumContainer'].loadTurbines(obj.data);
                    //点击风机回调
                    window.viewer.setTurbineMouseEventCallBack && window.viewer.setTurbineMouseEventCallBack({
                        infoCallBack:(res) => {
                            
                            if(res){
                                // console.log(res.infos,"plan");
                                this.planSelect1 = this.planshezhiData.filter((item,index)=>{
                                    return item.ffid == res.infos.ffid
                                })
                                this.planSelect2 = this.planyunxingData.filter((item,index)=>{
                                    return item.ffid == res.infos.ffid
                                })
                                // console.log(this.planSelect1,this.planSelect2);
                            }else{
                                this.$refs['assessMastTooltip'].close();
                            }
                        },
                        infoMoveCallBack:(res) => {
                            // console.log(res.pos,22);
                            this.planPos = res.pos;
                        }
                    });
                })

            },
            //点击详情框进入项目
            onProjectTipClick(projectInfo){
                // console.log(projectInfo,"详情框");
                //点击地球进入项目联动选中后评估案例的列表
                this.$refs['favoritesAssess'].bgActive_id = projectInfo.infos.MAPKEY;
                // //获取风机数据
                this.getPlanData(projectInfo,true);
                
                //飞进入项目
                this.flyToProject(projectInfo.infos.coord[0],projectInfo.infos.coord[1]);
            },
            flyToProject(lon, lat){
                this.$refs['cesiumContainer'].flyToReEvaluePrj(lon, lat);
            },
            XYZ2BLH (point) {
                return window.viewer.XYZ2BLH(point);
            },
            //关闭风机详情框
            onCloseAssessMastTooltip(){
                this.$refs['assessMastTooltip'].close();
            },
            onClickAll(event){
                // let at = document.getElementById('assessTooltip');
                // console.log(at.contains(event.target))
                // console.log(this.fanDetailShow)
                
            }
            
        }
    }

</script>
<style scoped> 

</style>