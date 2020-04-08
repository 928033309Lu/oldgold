const app = {
    state: {
        hoverProjectInfo: {
            projectid: '',
            bool: false,
            clientX: 0,
            clientY: 0
        },
        hoverErrorTip: {
            bool: false,
            clientX: 0,
            clientY: 0,
            errMsg: ''
        },
        sliderShowingFunctionID: null,
        clickFanInfo: {
            fanId: '',
            bool: false,
            clientX: 0,
            clientY: 0
        },
        changeTowerType: {
            towerInfo: {},
            winPos: {},
            isShow: false
        },
        clickMastInfo: {
            mastId: '',
            bool: false,
            clientX: 0,
            clientY: 0
        },
        moveFanInfo: {
            fanId: '',
            bool: false,
            clientX: 0,
            clientY: 0
        },
        // 三维状态栏信息
        statusInfo: {
            lon: '', // 经度
            lat: '', // 纬度
            alt: '', // 地形高度
            cameraHeight: '', // 地形高度
            isShow: false // 是否显示
        },
        // 指北针
        northInfo: {
            angle: 0
        },
        // 是否在项目中的判断
        inProject: false,
        // 当前项目的项目信息
        projectInfo: {
            create_id: 0,
            create_time: '',
            dem_server_path: '',
            description: '',
            design_capacity: 0,
            dom_server_path: '',
            is_deleted: 0,
            latitude: 0,
            location_city: '',
            location_county: '',
            location_province: '',
            longitude: 0,
            owner_id: 0,
            owner_name: '',
            project_id: 0,
            project_name: '',
            status_id: 0,
            update_id: 0,
            update_time: '',
            xmax: '',
            xmin: '',
            ymax: '',
            ymin: ''
        },
        planId: 0,
        currentPlanData: null, // 当前方案信息
        currentProjectPlans: null, // 当前项目的所有方案
        planMastProjectData: null, // 当前项目的所有方案
        contrastData: [],       //比选数据
        contrastMoveList: [],        //移入重复比选数据
        denggaoData: null,  //等高线数据
        projectId: 0,
        oldprojectId: 0,
        nowprojectId: 0,
        projectIdActive: false,
        // 线路塔信息
        getTowerInfo: {
            towerInfo: {
                'angle': '', // 塔身转角
                'type': '', // 塔型
                'baseLower': '', // 塔基降
                'callHeight': '', // 呼高
                'midstakeOffset': '', // 中心桩位移
                'name': '', // 塔名
                'offsetDist': '', // 偏差距离
                'stakeName': '', // 定位桩名
                'voltage': '' // 电压等级
            },
            show: false,
            position: {}
        },
        busloading: {},
        needRefreshProjectList: false, // 是否需要刷新项列表
        projectsData: [], // 项目列表
        currentCalMode: false, // 当前计算模式，T：GoldFoam;F:WT
        projectDataSet: {}, // 项目上传参数设置信息
        assessProjectsTip: false, // 后评估地球分机返回的详情数据
        noneZhonehe: null, // 游客模式不上传综合风图谱
        noneMastlist: null, // none测风塔
        noneJiweidian: null, // none机位点
        noneChengguo: null, // none成果
        WT_percentage: null, // 新版进度条用
        formEpsg: null // 目标源坐标系
    },
    mutations: {
        setformEpsg (state, data) {
            state.formEpsg = data;
        },
        WT_percentage (state, data) {
            state.WT_percentage = data;
        },
        noneZhonehe (state, noneZhonehe) {
            state.noneZhonehe = noneZhonehe;
        },
        noneMastlist (state, noneMastlist) {
            state.noneMastlist = noneMastlist;
        },
        noneJiweidian (state, noneJiweidian) {
            state.noneJiweidian = noneJiweidian;
        },
        noneChengguo (state, noneChengguo) {
            state.noneChengguo = noneChengguo;
        },
        toggleProInfo (state, projectInfo) {
            state.hoverProjectInfo = projectInfo;
        },
        setSliderShowingInfo (state, functionId) {
            state.sliderShowingFunctionID = functionId;
        },
        clickFanInfo (state, towerInfo) {
            state.clickFanInfo = towerInfo;
        },
        changeTowerType (state, fanInfo) {
            state.changeTowerType = fanInfo;
        },
        clickMastInfo (state, mastInfo) {
            state.clickMastInfo = mastInfo;
        },
        getTowerInfo (state, towerInfo) {
            state.getTowerInfo = towerInfo;
        },
        moveFanInfo (state, moveFanInfo) {
            state.moveFanInfo = moveFanInfo;
        },
        statusInfo (state, statusInfo) {
            state.statusInfo = statusInfo;
        },
        northInfo (state, northInfo) {
            state.northInfo = northInfo;
        },
        inProject (state, status) {
            state.inProject = status;
        },
        projectInfo (state, status) {
            state.projectInfo = status;
            state.currentPlanData = null;
        },
        planId (state, status) {
            state.planId = status;
        },
        projectId (state, status) {
            state.projectId = status;
        },
        nowprojectId (state, nowprojectId) {
            state.nowprojectId = nowprojectId;
        },
        oldprojectId (state, oldprojectId) {        
            if (state.oldprojectId !== oldprojectId) {
                console.log(state.oldprojectId, oldprojectId, "-------------true--------------projectId");
                state.oldprojectId = oldprojectId;
                state.projectIdActive = true;
            } else {
                console.log(state.oldprojectId, oldprojectId, "-------------false---------------projectId");
                state.projectIdActive = false;
            }
            // state.oldprojectId = oldprojectId;
        },
        hoverErrorTip (state, hoverErrorTip) {
            state.hoverErrorTip = hoverErrorTip;
        },
        projectsData (state, projectsData) {
            state.projectsData = projectsData;
        },
        currentPlanData (state, currentPlanData) {
            state.currentPlanData = currentPlanData;
        },
        planMastProjectData (state, planMastProjectData) {
            state.planMastProjectData = planMastProjectData;
        },
        contrastData (state, contrastData) {
            state.contrastData = contrastData;
        },
        contrastMoveList (state, contrastMoveList) {
            state.contrastMoveList = contrastMoveList;
        },
        denggaoData (state, denggaoData) {
            state.denggaoData = denggaoData;
        },
        currentProjectPlans (state, currentProjectPlans) {
            state.currentProjectPlans = currentProjectPlans;
            state.currentPlanData = null;
            if (!currentProjectPlans) {
                return;
            }
            state.currentPlanData = state.currentProjectPlans.find(planData => {
                return state.planId === planData.scheme_id;
            });
        },
        currentCalMode (state, currentCalMode) {
            state.currentCalMode = currentCalMode;
        },
        projectDataSet (state, projectDataSet) {
            state.projectDataSet = projectDataSet;
        },
        assessProjectsTip (state, assessProjectsTip) {
            state.assessProjectsTip = assessProjectsTip;
        },
        busloading (state, busloading) {
            state.busloading = busloading;
        }
    },
    getters: {
        /**
         * 当前项目+当前方案名称
         */
        currentProjectPlanName: state => {
            if (!state.projectInfo) return '默认';
            if (!state.currentPlanData) {
                return state.projectInfo.project_name + '默认';
            }
            return state.projectInfo.project_name + state.currentPlanData.scheme_name;
        }
    }
};

export default app;
