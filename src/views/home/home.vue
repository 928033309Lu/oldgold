<style lang="less">
@import "../../styles/common.less";
@import "./home.less";
.loading-panel{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    color: #fff;
    z-index: 999999;
    &>div{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 300px;
        height: 300px;
        text-align: center;
        p{
            margin-top: 30px;
        }
    }
}
.loading{
    width: 80px;
    height: 50px;
    margin: 0 auto;
}
.loading span{
    display: inline-block;
    width: 8px;
    height: 100%;
    border-radius: 4px;
    background: #2cd0b9;;
    animation: load 1s ease infinite;
}
@keyframes load{
    0%,100%{
        height: 40px;
        background: #2cd0b9;;
    }
    50%{
        height: 70px;
        margin: -14px 0;
        background: #2cd0b9;;
    }
}
.loading span:nth-child(2){
    -webkit-animation-delay:0.2s;
}
.loading span:nth-child(3){
    -webkit-animation-delay:0.4s;
}
.loading span:nth-child(4){
    -webkit-animation-delay:0.6s;
}
.loading span:nth-child(5){
    -webkit-animation-delay:0.8s;
}
.openHours{
    width:160px;
    height:70px;
    background:rgba(255,255,255, 0.7);
    color: #33404E;
    border-radius:7px;
    position: fixed;
    top: 130px;
    right: 15px;
    z-index: 111;
    padding: 0 0 0 15px;
    font-size: 14px;
    p{
        margin: 0;
        padding: 10px 0;
    }
    .icon{
        display: inline-block;
    }
    .up{
        transform: rotate(180deg);
        color: #00A640;
    }
    .down{
        color: #D83154;
    }
}
</style>
<template>
    <div @click="onClickAll" @dblclick="ondblclickAll" class="home-container" :style="{cursor:canAddFan?'crosshair':''}" v-loading="$store.state.client.globeLoading||this.waitingOneMinute" :element-loading-text="$store.state.client.globeLoadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-color="#D4EFF6" element-loading-custom-class="waitingOneMinute">
        <div class="loading-panel" v-if="waitingShare">
            <div>
                <div class="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p>正在通过链接获取数据，请稍候...</p>
            </div>
        </div>
        <div class="logo"></div>
        <div class="nameAndSwitch"  >
            <div  v-show="currentProjectName && inProject"><span class="currentProjectName">{{currentProjectName}}</span></div>

            <transition name="plan-fade2">
                <switch-mode ref="switchModeBtn"  @switchModeStatus="onSwitchModeStatus"></switch-mode>
            </transition>
            
            <div v-if="isShowMastlist && enManager">
                <windTower-switch :inProject="inProject" ref="windTowerSwitch" class="windTower-switch"  @towerMessageClick="onTowerMessageClick"  @windTowerChange="onWindTowerChange" v-if="positionVisible"></windTower-switch>
            </div>
            <div v-if="!enManager">
                <windTower-switch :inProject="inProject" ref="windTowerSwitch" class="windTower-switch"  @towerMessageClick="onTowerMessageClick"  @windTowerChange="onWindTowerChange" v-if="positionVisible"></windTower-switch>
            </div>
            <div  v-show="currentProjectName" v-if="!enManager">
                <div class="duibiBox"
                v-show="!duibiActive" @click="onInfoContrastBar(true)" @mouseenter="iconSwitchChange('duibi',true)" @mouseleave="iconSwitchChange('duibi',false)" v-if="positionVisible">
                    <div class="switchmyTip2" v-show="iconDuibiActive">方案对比</div>
                    <icon name="duibi1" />
                </div>
                <div class="duibiBox"
                v-show="duibiActive"
                :style="duibiActive?'border:1px solid rgba(51,200,111,1);color:rgba(51,200,111,1);':''"
                @click="onTopContrastClose" @mouseenter="iconSwitchChange('duibi',true)" @mouseleave="iconSwitchChange('duibi',false)" v-if="positionVisible">
                    <div class="switchmyTip2" v-show="iconDuibiActive">方案对比</div>
                    <icon name="duibi1" />
                </div>
            </div>
            <div v-t-role="this.$store.state.user.loginUserInfo.role" v-if="!enManager" v-show="currentProjectName">
                <div class="templateBox"
                :style="zongjieActive?'border:1px solid rgba(51,200,111,1);color:rgba(51,200,111,1);':''" @click="onInputTemplate(true)"  @mouseenter="iconSwitchChange('zongjie',true)" @mouseleave="iconSwitchChange('zongjie',false)" v-if="positionVisible">
                    <div class="switchmyTip2" v-show="iconZongjieActive">小结</div>
                    <icon name="shu" />
                </div>
            </div>
            <!-- 风机标签开关 -->
            <!-- <label-switcher v-show="currentProjectName && inProject" ref="labelSwitcher" @methodClick="onMethodClick"></label-switcher> -->
        </div>
        <div class="bootLayer" v-if="guidanceShow" @click="onGuidanceClick">
            <div class="imageLayer">
                <img src="../../images/bootImg.png" :style="{left:this.borderLayerLeft+'px'}">
            </div>
            <div class="bordrLayer" :style="{left:this.borderLayerLeft+'px'}">
                <img src="../../images/bootIco.png">
            </div>
        </div>
        <!-- <map-menu ref="mapMenu"></map-menu> -->

        <cesium-container ref="cesiumContainer" :projects="projects" :canAddFan="canAddFan" :evaluationCalculating="evaluationCalculating" @initHoursData="initHoursData" @addCustomLabel="addCustomLabel" @projectClicked="onProjectClick" @fanClick="onFanClick" @showAddFan="onShowAddFan" @closeFanDetails="onCloseFanDetails" @showTowerChange="showTowerChange"  element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-color="#D4EFF6" element-loading-custom-class="waitingOneMinute"></cesium-container>
        <!--重新计算步骤条-->
        <road-steps ref="roadReCalculating" v-if="displayReCalculating" @roadReCalculatingClose="roadReCalculatingClose" @methodClick="onMethodClick" @restrictAreasFunction="onRestrictAreasFunction" @checklatlng="onRoadChecklatlng"></road-steps>
        <line-steps ref="roadLineReCalculating" v-if="displayLineReCalculating" @stopSelectFanByRectangle="onStopSelectFanByRectangle" @lineReCalculatingClose="lineReCalculatingClose" @methodClick="onMethodClick" @lineRecalculating="onLineRecalculating" @restrictAreasFunction="onRestrictAreasFunction"></line-steps>
        <input-template ref="inputTemplate" @inputTemplate="onInputTemplate"></input-template>

        <!-- <transition name="menu-fade"> -->
            <main-menu ref="mainMenu" v-show="menuVisible" class="main-menu" :positionVisible="positionVisible" @menuSelected="onMenuSelected" @drawTiming="onDrawTiming"></main-menu>
        <!-- </transition> -->
        <!-- 即时绘制 -->
        <draw-timing ref="drawTiming" @clearDrawPlot="onClearDrawPlot" @drawSelected="onDrawSelected" @drawTiming="onDrawTiming"></draw-timing>
        <favorites-panel ref="favorites-panel" v-if="showFavorites" @closeAllTab="closeAllTab" @openLayer="onOpenLayer" @menuSelected="onMenuSelected" @clearDrawPlot="onClearDrawPlot" @drawSelected="onDrawSelected" @newAddNewKmlLayer="newAddNewKmlLayer" @enterKmlMoudle="enterKmlMoudle" @closeAddkmz="onCloseAddkmzElement" @imgValue="onImgValue"  @openAssess="onOpenAssess" @flyHome="onFlyHome" @addElement="onAddElement" @featureLoaction="onFeatureLoaction" @featureLoaction2="onFeatureLoaction2" @removeKmlLayer="onRemoveKmlLayer" @openfeatureVisible="onfeatureVisible" @openLoadKmlLayer="onLoadKmlLayer"  @close="closeFavorites"></favorites-panel>
        <addkmz-element ref="addkmzElement" :elementName="elementName" :shezhiOpen="shezhiOpen" @shezhiKmlLayer="onShezhiKmlLayer" @addNewKmlLayer="onAddNewKmlLayer" @setTreeData="onSetTreeData"></addkmz-element>

        <seach-bar ref="searchBar" @searchClose="onSearchClose" @projectSelected="onSearchProjectClick"></seach-bar>
        <project-add ref="projectAddDialog" @close="onProjectAddClose" @newProject="onNewProject">
        </project-add>
        <project-filter ref="projectFilter" @clearProject="onMenuSelected" @projectClicked="onProjectClick" @projectEdit="onProjectEdit" @close="onFilterClose" @projectChange="onProjectChange"></project-filter>

        <password-change ref="passwordChangeDialog" @close="onPasswordChangeClose"></password-change>

        <parameter-upload-dialog v-if="ParameterUploadDialog && !enManager" ref="ParameterUploadDialog" @BLH2XYZ="BLH2XYZ" @openLoadKmlLayer="onLoadKmlLayer" @enterKmlMoudle="enterKmlMoudle" @onCloseKml="onCloseKml" @projectOverCal="projectOverCal" @calculateStarted="onCalculateStarted" @close="onParameterClose"></parameter-upload-dialog>
        <parameter-upload-dialog-youke v-if="ParameterUploadDialog && enManager" ref="ParameterUploadDialogYouke" @projectOverCal="projectOverCal" @calculateStarted="onCalculateStarted" @close="onParameterClose" @projectClicked="onProjectClick"></parameter-upload-dialog-youke>

        <project-calculating :projects="projects" @close="projectCalculatingClose" @getProject="getProjects" @projectClicked="onProjectClick" @projectOverCal="projectOverCal" ref="projCalc"></project-calculating>
        <old-data ref="openOldData" @windTowerChange="onWindTowerChange" @closeOleData="closeOleData"></old-data>
        <auto-optimization ref="autoOptimization" @autoOptimizationClose="autoOptimizationClose" @methodClick="onMethodClick" @reCalculating="onReCalculating"></auto-optimization>
        <!-- <transition name="plan-fade">
            <switch-mode ref="switchModeBtn" v-show="!switchModeBtnVisible" @switchModeStatus="onSwitchModeStatus"></switch-mode>
        </transition> -->
        <wt-file-upload ref="wtFileUpload" v-show="wtTipVisible" @wfFileUploadClose="onWfFileUploadClose"> </wt-file-upload>
        <!-- <transition name="plan-fade">
            <wt-tip ref="wtTip" v-show="planListShowing && !switchModeBtnVisible"></wt-tip>
        </transition> -->
        <transition name="plan-fade">
            <plan-list ref="planList" v-show="!switchModeBtnVisible" @selectedProject="selectedProject" @getSchemeId="onGetSchemeId" @closeFanDetail="onCloseFanDetail" @planSelected="onPlanSelected" @showDetailClick="onShowPlanDetail" @windTowerChange="onWindTowerChange" @copy="onCopyPlan" @report="onReportPlan" @remove="onRemovePlan"></plan-list>
        </transition>
        <plan-master-project v-if="!enManager" ref="masterProject" @closeMasterProject="closeMasterProject"></plan-master-project>
        <plan-master-project-youke v-if="enManager" ref="masterProjectYouke" ></plan-master-project-youke>

        <mast-tooltip ref="mastTooltip" :visible="mastInfo.visible" :towerInfo="mastInfo.project" :position="mastInfo.position" @show-detail="showMastDetail"></mast-tooltip>
        <mast-detail ref="mastDetail" @close="closeMastDetail"></mast-detail>
        <mast-tower-message ref="mastTowerMessage" :mastInfoData="mastTowerMessageData" @loadMastData="loadMastData" @closeTowerMessActive="closeTowerMessActive"></mast-tower-message>
        <plan-full-details ref="planFullDetails" v-show="planDetailShowing" @closeFanOptimize="onCloseFanOptimize" @planDetailCalculating="onPlanDetailCalculating" @close="onPlanDetailClose"></plan-full-details>
        <plan-detail ref="planDetail"></plan-detail>
        <plan-copy ref="planCopy" @planCopyCompleted="onPlanCopyCompleted"></plan-copy>
        <function-bar ref="functionBar" :road_check="road_check" :xianlu_check="xianlu_check" :shengya_check="shengya_check" :isShowZhonehe="isShowZhonehe" :sectionNum="sectionNum" @onXinjiangReprot="onXinjiangReprot" @infoContrastBar="onInfoContrastBar" @minPlanMasterProject="onMinPlanMasterProject" @closeFanOptimize="onCloseFanOptimize" @closeCesiumContainer="onCloseCesiumContainer" @showPlanDetail="onShowPlanDetail" @closeFanDetail="onCloseFanDetail" @integrateWindMap="onIntegrateWindMap" @restrict="onRestrict" @setFalseDistributeBar="onSetFalseDistributeBar" @distributeClick="onDistribute" @sectionVisible="onSectionVisible" @playClick="onPlay" @dataChange="onDataChange" @dataChange2="onDataChange2" @distributeActived="onDistributeActived" @playFunChange="onPlayFunChange" @roadBarSelected="onRoadBarSelected" @diarefChange="onDiarefChange" @dxfFileSelected="onDxfFileSelected" @sectionChange="onSectionChange" @windGaugeShow="windGaugeShow" @roadReCalculatingShow="roadReCalculatingShow" @lineReCalculatingShow="lineReCalculatingShow" @jidianshoudongyouhuShow="jidianshoudongyouhuShow" @roadshoudongyouhuShow="roadshoudongyouhuShow" @autoOptimizationShow="autoOptimizationShow" @stationDaochuShow="stationDaochuShow" @stationYouhuaShow="stationYouhuaShow" @reporter="onReportPlan" @changeFanRotaAngle="onChangeFanRotaAngle" @stationBarSelected="onStationBarSelected" @lineBarSelected="onLineBarSelected" @distributeBarSelected="onDistributeBarSelected" @reportBarSelected="onReportBarSelected" @lakeRestrict="onLakeRestrict" @roadRestrict="onRoadRestrict" @houseRestrict="onHouseRestrict" @denggaoxian="onDenggaoxian" @zaoyinRestrict="onZaoyinRestrict" @redLineRestrict="onRedLineRestrict" @stationImport="onStationImport" @tempDistributeBar="onTempDistributeBar"></function-bar>
        <contrast-bar ref="contrastBar" :infoActive="infoContrastActive" @clearContrastData="onClearContrastData" @openPlanContrast="onOpenPlanContrast" @infoContrastBar="onInfoContrastBar" @exitSchemeCpmpare="onExitSchemeCpmpare"></contrast-bar>
        <plan-contrast ref="planContrast" @collectLineListInfo="onCollectLineListInfo" @closeActive="onCloseActive"></plan-contrast>
        <plan-contrast-list ref="planContrastList" :contrastProjectCanClick="contrastProjectCanClick" @createSchemeTurbines="onCreateSchemeTurbines" @setSchemeTurbineNameVisible="onSetSchemeTurbineNameVisible" @setSchemeTurbineIconVisible="onSetSchemeTurbineIconVisible" @removeSchemeTurbines="onRemoveSchemeTurbines" @exitSchemeCpmpare="onExitSchemeCpmpare"></plan-contrast-list>
        <contrast-move-list  ref="contrastMoveList" :contrastMoveList="contrastMoveList" ></contrast-move-list>
        <fan-add ref="fanAddDialog" @fanAdded="onFanAdded" @closeFanAdd="onCloseFanAdd"></fan-add>
        <fan-add-coordinate ref="fanAddCoordinateDialog" :projectIds="project_id" @fanAdded="onFanAdded" @closeFanAdd="onCloseFanAdd" @isOutOfFarm="onIsOutOfFarm"></fan-add-coordinate>
        <fan-price ref="fanPriceDialog"></fan-price>
        <fan-detail ref="fanDetailDialog" @clearHighLightFan="onClearHighLightFan" @fanDetailHasShow="onFanDetailHasShow"></fan-detail>
        <fan-change ref="fanChangeDialog" @changeTurbineType="onChangeTurbineType" @changeTurbineListType="onChangeTurbineListType"></fan-change>
        <wind-gauge ref="windGauge" v-if="displayWindGauge" @addCustomLabel="addCustomLabel" @daoruData="onDaoruData" @daoruGetList="daoruGetList" @windGaugeClose="windGaugeClose" @windClickFan="windClickFan" @changeTurbineType="onChangeTurbineType" @changeTurbineListType="onShowChangeTurbineTypeDialog" @editModeChange="editModeChange" @delTurbines="delTurbines"></wind-gauge>
        <station-detail ref="stationDetail" v-show="displayStationDtail" @stationDetailClose="stationDetailClose"></station-detail>
        <power-detail ref="powerDetail" v-show="displayPowerDetail" :haveTowerData="haveTowerData" @wpowerDetailClose="powerDetailClose" @wpowerDetailClose2="powerDetailClose2" @collectLineFunction="collectLineFunction" @stopEditCollectLine="onStopEditCollectLine" @requestRecalculat="onRequestRecalculat"></power-detail>
        <tower-change ref="towerChange" @collectLineFunction="collectLineFunction"></tower-change>
        <road-detail ref="roadDetail" v-if="displayRoadDetail" @gisClose="gisClose" @roadDetailClose="roadDetailClose" @roadDetailsFunction="onRoadDetailsFunction" @roadsFunction="onRoadsFunction" @stopEditInsideRoad="onStopEditInsideRoad">
        </road-detail>
        <road-optimization ref="roadshoudongyouhu" v-show="roadshoudongyouhu" @roadshoudongyouhuClose="roadshoudongyouhuClose" @roadsFunction="onRoadsFunction" @roadDetailsFunction="onRoadDetailsFunction"></road-optimization>
        <!--升压站编辑工具条-->
        <station-buttons ref="stationButtons" @stationButtonsFunction="onStationButtonsFunction" v-if="stationButtonsShow"></station-buttons>
        <!--道路/线路/升压站 简介-->
        <fan-optimize ref="fanOptimize" :stationAndLineClass="stationAndLine" @showLineDetail="onShowLineDetail" @showRoadDetail="onShowRoadDetail"></fan-optimize>
        <fan-optimize-youke ref="fanOptimizeYouke" :stationAndLineClass="stationAndLine" @showLineDetail="onShowLineDetail" @showRoadDetail="onShowRoadDetail"></fan-optimize-youke>
        <div v-show="imgValueActive" class="imgValueKmzBox" :style="{top:imgPosition.y+'px',left:imgPosition.x+'px'}">
            <span @click="imgValueActive=false"><icon class="header-icon" name="close"></icon></span>
            <div v-html="imgValue"></div>
        </div>
        <!--错误提示框-->
        <err-tip-msg errMsg=''> </err-tip-msg>
        <!-- 表格导入确定框 -->
        <daoru-details ref="daoruDetails" :daoruCommitVisible="daoruCommitVisible" :daoruDataList="daoruDataList" @closeDaoruDetails="onCloseDaoruDetails" @uploadDaoruList="uploadDaoruList"></daoru-details>
        <!-- 收藏夹--后评估模式 -->
        <favorites-assess v-show="assessHomeAcctive" ref="favoritesAssess" :projects="assprojects" 
        @menuSelected="onMenuSelected" @clearDrawPlot="onClearDrawPlot" @drawSelected="onDrawSelected"
        @flyHome="onFlyHome"
        @closeAllTab="closeAllTab"
        @cloceAssess="onCloseAssess"
        @openLayer="onOpenLayer"
        @clearReEvalueTurbine="onClearReEvalueTurbine"
        @setWindFiledVisible="onSetWindFiledVisible"
        @projectClicked="onAssessProjectClicked"></favorites-assess>
        <!-- 收藏夹--图层 -->
        <favorites-layer v-show="layerAcctive" ref="favoritesLayer" :layerAcctive="layerAcctive"
        @menuSelected="onMenuSelected" @clearDrawPlot="onClearDrawPlot" @drawSelected="onDrawSelected"
        @addCesiumLayer="addCesiumLayer"
        @removeCesiumLayer="removeCesiumLayer"
        @flyHome="onFlyHome"
        @closeAllTab="closeAllTab"
        @openAssess="onOpenAssess"
        @cloceLayer="cloceLayer"
        @openLayer="onOpenLayer"></favorites-layer>
        <!-- 地球项目详情框 -->
        <assess-project-tip ref="assessProjectTip" :pos="asspos" :projectsTip="assprojectsTip"
        @projectTipClick="onAssessProjectClicked"></assess-project-tip>
        <!-- 风机详情框 -->
        <assess-mast-tooltip ref="assessMastTooltip" :planPos="planPos" :planSelect1="planSelect1" :planSelect2="planSelect2"></assess-mast-tooltip>
        <!-- 剖面分析 -->
        <poumian-details ref="poumianDetails" v-show="poumianVisble" 
        :poumianData="poumianData" :pouxAxis="pouxAxis" :pouyAxis="pouyAxis"
        @closePoumianDetails="onClosePoumianDetails"></poumian-details>

        <!-- //等效小时数 总数 -->
        <div class="openHours" v-show="openHours">
            <p>等效小时数约 {{allHours}}h</p>
            <span v-show="changeHours>=0"><icon name="xianshi-" class="up" style="width: 18px;height:18px;"/><b>{{changeHours}}h</b></span>
            <span v-show="changeHours<0"><icon name="xianshi-" class="down" style="width: 18px;height:18px;"/><b>{{changeHours}}h</b></span>
        </div>
    </div>
</template>

<script>
import favoritesAssess from '../../components/favorites/favorites-assess';
import favoritesLayer from '../../components/favorites/favorites-layer';
import assessProjectTip from '../../components/cesium/assess-project-tip.vue';
import assessMastTooltip from '../../components/cesium/assess-mast-tooltip.vue';

import favoritesPanel from '../../components/favorites/favorites-panel';
import addkmzElement from '../../components/favorites/addkmz-element';
import FormData from 'form-data';
import CesiumContainer from '../../components/cesium/cesium-container';
import MainMenu from '../../components/menu/main-menu.vue';
import DrawTiming from '../../components/menu/draw-timing.vue';
import poumianDetails from '../../components/menu/poumian-details.vue';
import MapMenu from '../../components/menu/map-menu.vue';
import Cookies from 'js-cookie';
import util from '../../libs/util';
import ProjectAdd from '../../components/project/project-add';
import ProjectFilter from '../../components/project/project-filter';
import PasswordChange from '../../components/password/password-change';
import windTowerSwitch from '../../components/windTower-switch';
import ParameterUploadDialog from '../../components/new-parameter-upload/parameter-upload-dialog-container-new.vue'; //最新一版
// import ParameterUploadDialog from '../../components/new-parameter-upload/parameter-upload-dialog-container.vue';
// import ParameterUploadDialog from '../../components/new-parameter-upload/parameter-upload-dialog-container-scroll.vue';
import ParameterUploadDialogYouke from '../../components/new-parameter-upload/parameter-upload-dialog-container-youke.vue';
import ProjectCalculating from '../../components/project/project-calculating';
import oldData from '../../components/project/oldData';
import autoOptimization from '../../components/elePowerLine/autoOptimization';
import PlanList from '../../components/plan/plan-list.vue';
import planMasterProject from '../../components/plan/plan-master-project.vue';
import planMasterProjectYouke from '../../components/plan/plan-master-project-youke.vue';
import PlanDetail from '../../components/plan/plan-detail';
import PlanCopy from '../../components/plan/plan-copy';
import FunctionBar from '../../components/function/function-bar';
import ContrastBar from '../../components/function/contrast-bar';
import SeachBar from '../../components/search/seach-bar';
import FanAdd from '../../components/fan/fan-add';
import FanAddCoordinate from '../../components/fan/fan-add-coordinate';
import FanPrice from '../../components/fan/fan-price';
import FanDetail from '../../components/fan/fan-detail';
import FanChange from '../../components/fan/fan-change';
import windGauge from '../../components/loadAccess/windGauge';
import daoruDetails from '../../components/loadAccess/daoru-details';
import powerDetail from '../../components/elePowerLine/powerDetail';
import towerChange from '../../components/elePowerLine/towerChange';
import roadDetail from '../../components/elePowerLine/roadDetail';
import stationDetail from '../../components/elePowerLine/stationDetail';
import roadOptimization from '../../components/elePowerLine/roadOptimization';
import switchMode from '../../components/mode/switch-mode';
import WtTip from '../../components/mode/wt-tip.vue';
import wtFileUpload from '../../components/mode/wt-file-upload.vue';
import mixins from '../../mixins';
import Vue from 'vue';
import PlanDetail2 from '../../components/plan/plan-detail2';
// import PlanFullDetails from '../../components/plan/plan-full-details';
import PlanFullDetails from '../../components/plan/plan-full-details-new';  //最新一版经评
import RoadSteps from '../../components/roadSteps/road-steps';
import lineSteps from '../../components/lineSteps/line-steps';
import stationButtons from '../../components/elePowerLine/stationButtons';
import FanOptimize from '../../components/fan/fan-optimize';
import FanOptimizeYouke from '../../components/fan/fan-optimize-youke';
import errTipMsg from '../../components/cesium/err-tip-msg';
import {downloadFile} from '@/libs/function-util';
import MastTooltip from '../../components/cesium/mast-tooltip';
import mastDetail from '../../components/mastDetail/mast-details';  //最新
// import mastDetail from '../../components/mastDetail/mast-details-old';
import mastTowerMessage from '../../components/mastTower/mast-tower-message';
import planContrast from '../../components/planContrast/plan-contrast';
import planContrastList from '../../components/planContrast/plan-contrast-list';
import contrastMoveList from '../../components/planContrast/contrast-move-list';
import inputTemplate from '../../components/inputTemplate/input-template';
import labelSwitcher from '../../components/label-switcher';
import Config from '../../../build/config';
Vue.mixin(mixins);
export default {
    name: 'home',
    components: {
        poumianDetails,
        assessMastTooltip,
        assessProjectTip,
        favoritesAssess,
        favoritesLayer,
        towerChange,
        stationDetail,
        oldData,
        PlanDetail2,
        PlanFullDetails,
        autoOptimization,
        FanChange,
        FanDetail,
        FanAdd,
        FanAddCoordinate,
        FanPrice,
        SeachBar,
        FunctionBar,
        ContrastBar,
        PlanCopy,
        PlanDetail,
        PlanList,
        planMasterProject,
        planMasterProjectYouke,
        ProjectCalculating,
        ProjectFilter,
        ProjectAdd,
        PasswordChange,
        CesiumContainer,
        ParameterUploadDialog,
        ParameterUploadDialogYouke,
        MainMenu,
        DrawTiming,
        MapMenu,
        windGauge,
        daoruDetails,
        windTowerSwitch,
        switchMode,
        WtTip,
        wtFileUpload,
        powerDetail,
        RoadSteps,
        roadDetail,
        roadOptimization,
        lineSteps,
        stationButtons,
        FanOptimize,
        FanOptimizeYouke,
        MastTooltip,
        mastDetail,
        errTipMsg,
        mastTowerMessage,
        favoritesPanel,
        addkmzElement,
        planContrast,
        planContrastList,
        contrastMoveList,
        inputTemplate,
        labelSwitcher
    },
    data () {
        return {
            showFanNameLabel:false,
            openHours: false,
            changeHours:"0",
            allHours: "0",
            road_check: false,
            xianlu_check: false,
            xianlu_check_zip: false,
            xianlu_check_dxf: false,
            shengya_check: false,
            isShowZhonehe:false,   //是否有综合风图谱按钮
            isShowMastlist: false,
            daoruDataList:[],  //导入返回再次确认数据
            daoruCommitVisible: false,   //再次确认界面
            poumianData:[],
            pouxAxis:[],
            pouyAxis:[],
            poumianVisble: false,
            imgValueActive: false,
            imgPosition:{},
            imgValue:"",
            planyunxingData:[],
            planshezhiData:[],
            planSelect1:[],
            planSelect2:[],
            planPos:{},
            onlyOnce: true,
            assCallback: null, //
            assprojectsTip:[],//项目详情框数据
            assprojectsData:{},//传三维的数据对象
            asspos:{},//后评估坐标
            assessHomeAcctive:false,////后评估开启
            assprojects:[],//后评估项目数据
            layerAcctive:false,//图层开启
            elementName:null,
            shezhiOpen:false,
            opendian: false,
            celiangOpenIndex:0,
            celiangOpen: false,
            iconDuibiActive: false,
            iconZongjieActive: false,
            duibiActive: false,
            zongjieActive: false,
            contrastMoveList:[],  //比选重叠的风机数组
            ParameterUploadDialog: false,
            planListShowing: true,
            waitingOneMinute: false,
            waitingTwoMinute: false,
            evaluationCalculating: false,
            stationShowing: false,
            lineShowing: false,
            stationButtonsShow: false,
            resCollectLine: null,
            roadBarSelected: false,
            displayStationDtail: false,
            projectInfo: null,
            displayReCalculating: false,
            displayLineReCalculating: false,
            roadshoudongyouhu: false,
            displayRoadDetail: false,
            jidianshoudongyouhu: false,
            fanDetailShow: false,
            displayWindGauge: false,
            displayPowerDetail: false,
            menuVisible: true,
            selectMenuType: '',
            paramUploadVisible: false,
            calcVisible: false,
            passwordVisible: false,
            positionVisible: false,
            projects: [],
            fans: [],
            priceData: {},
            selectProject: null,
            guidanceShow: false,
            guidanceShowed: false,
            currentProjectId: '',
            currentProjectName: '',
            currentPlanId: '',
            currentPlanStatus: false,
            distributeActived: false,
            planDetailShowing: false,
            switchModeBtnVisible: true,
            contrastProjectCanClick: true,
            wtTipVisible: false,
            // wtFileUploadVisible: false,
            canAddFan: false,
            sectionNum: 1,
            borderLayerLeft: -300,
            turbineHeight: 90,
            xcentre: 0,
            ycentre: 0,
            currentSectionId: '0.0',
            windMap: false,
            windSplit: false,
            inputCfd: {},
            tempDistributeBar: false,
            haveTowerData: false, // 当前方案是否有塔位
            hupoUrl: null, //存储湖泊url
            daoluUrl: null,
            homeUrl: null,
            mastInfo: {
                visible: false,
                position: {
                    x: 0,
                    y: 0
                },
                project: {}
            },
            fanOptimizeYouhuaSelectedObj:{   //右下角详情框状态
                alone : null,
                showStationAndLine: null
            },
            panelVisibleStore: {
                menuVisible: false,
                functionBarVisible: false,
                switchModeBtnVisible: false,
                fanOptimizeLine: false,
                fanOptimizeAlone: false,
                planMasterProject: false,
                baocunMasterProject: false
            },
            drawVisibleStore: {
                menuVisible: true,
                functionBarVisible: false,
                switchModeBtnVisible: false
            },
            noiseOpen: null ,  //噪音开关
            currentPlanMode: true, // T:GoldFoam模式；F:WT模式
            currentExemptionProjectPlan:null,// 当前免除检查计算状态的项目、方案
            mastTowerMessageData:[],  //测风塔整体信息
            project_id: null,  //项目ID
            showFavorites: false,
            infoContrastActive: false,
            wrgHeights:[],
            turbinesList:[],  //机型
            daoluRes: {},  //游客模式用
            xianluRes: {},
            shengyaRes: {},
            getroad: {
                roadLength : '',
                roadWidth : '',
                fillAmount : '',
                digAmount : '',
                branchNum : ''
            },
            getstation: {
                stationArea : '',
                baseHeight : '',
                fillAmount : '',
                digAmount : ''
            },
            getline: {
                level: '',
                lineLength: '',
                angleNum: '',
                lineMun: ''
            },
            waitingShare: false,
            shareProject: JSON.parse(localStorage.getItem('shareQuery')) || null
        };
    },
    updated() {
        this.Bus.$on("isOpenAddOne",(val)=>{
            //关闭鼠标加号
            this.canAddFan = val
        })
        // this.Bus.$on("noiseOpenSelected",(val)=>{
        //     //切换方案关闭之前噪音层
        //     this.onZaoyinRestrict(val)
        // })
        // this.Bus.$on("redLineOpenSelected",(val)=>{
        //     //切换方案关闭之前红线区
        //     this.onRedLineRestrict(val)
        // })
        // this.Bus.$on("isGFWT",(val)=>{
        //     this.onZaoyinRestrict(val)
        //     this.onRedLineRestrict(val)
        // })

    },
    beforeDestroy() {
        this.$store.commit('logout')
    },
    created() {
        
        if (this.$route.query){
            this.initShare()
        }
    },
    mounted () {
        let that = this;
        window.onload = function (e) {
            e = e || window.event;
            let loginUserInfo = JSON.parse(sessionStorage.getItem("goldfarm.loginUser") );
            // console.log(loginUserInfo);
            that.$store.commit('loginUserInfo', loginUserInfo);
        };
        // console.log("当前路由："+this.$route.path);  //存vuex了routerPath
        //代码优化了，这行不需要了
        // this.$store.state.user.loginUserInfo.role = parseInt(sessionStorage.getItem('goldfarm.loginUser').split('"role":')[1].split(',')[0]);
        const isNew = this.$store.state.user.loginUserInfo.is_new;
        this.guidanceShowed = isNew !== 1;
        this.getProjects(); 
        window.onkeydown = function(e) {
            // console.log(e.keyCode)
            if(e && e.keyCode == 87){
                that.showFanNameLabel = !that.showFanNameLabel;
                that.$refs['cesiumContainer'].showOrHideFanNameLabel2(that.showFanNameLabel);
            }
        };
    },
    methods: {
        // 通过分享链接直接进入项目
        initShare () {
            console.log(this.$route.query)
            console.log(this.shareProject)
            let querys = this.$route.query
            if(!this.shareProject){
                return
            }else{
                if(querys.type != this.shareProject.type || querys.project != this.shareProject.project || querys.scheme != this.shareProject.scheme){
                    this.$message.error('进去项目失败，请通过正常登录进入项目！')
                    this.$router.push('/login')
                    this.waitingShare = false
                    return
                }
            }
            if(this.shareProject && this.shareProject.project){
                this.shareOnProjectClick()
            }
        },
        getShareProjects (callback){
            util.ajax.get('/projects/' + this.shareProject.project, {
            }).then((res)=>{
                callback(res)
            }).catch((err)=>{
                callback(null)
            })
        },
        shareOnProjectClick (){
            this.waitingShare = true
            //获取该项目的详情
            this.getShareProjects((res)=>{
                // console.log(res.data.data)
                if(!res){
                    this.$message.error('获取数据失败，请通过正常登录进入项目！')
                    this.$router.push('/login')
                    this.waitingShare = false
                    return
                }
                this.onProjectClick(res.data.data)
                // 定位
                this.onPosition()
                // 是否能进入方案
                this.$store.commit('shareOpenScheme')
            })

        },
        onPosition (){
            if (!this.projectInfo){
                setTimeout(()=>{
                    this.onPosition()
                }, 1500)
                return
            }
            this.onMenuSelected('position')
        },

        getTimeOut (callback){
            let date=new Date();     //1. js获取当前时间
            let min=date.getMinutes();  //2. 获取当前分钟
            date.setMinutes(min+ 7);  //3. 设置当前时间+  n 分钟：把当前分钟数+  n 后的值重新设置为date对象的分钟数
            let y = date.getFullYear();
            let m = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
            let d = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
            let h = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
            let f = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
            let s = date.getSeconds() < 10 ? ('0' + date.getseconds()) : date.getSeconds()
            let formatdate = y+'-'+m+'-'+d + " " + h + ":" + f + ":" + s;
            // console.log(formatdate) // 获取 n 分钟后的时间，格式为yyyy-mm-dd h:f:s
            callback(formatdate)
        },
        //新疆报告
        onXinjiangReprot(plandata){
            // /design/<project_id>/<scheme_id>
            // /design_poll/<project_id>/<scheme_id>
            // /design_download/<project_id>/<scheme_id>
            this.designReprot(plandata);
        },
        designReprot(plandata){
            util.ajax.get("/design/"+plandata.project_id+"/"+plandata.scheme_id).then((res)=>{
                if(res.data.code != 200){
                    this.$message.error("生成初设报告失败！");
                    return;
                }
                // this.getTimeOut((res)=>{
                //     this.$message({
                //         message: '初设报告预计 ' + res + ' 生成完毕，请勿关闭页面',
                //         type: 'success',
                //         duration: 5000
                //     })
                // })
                this.$message({
                    message: '初设报告生成中，请勿关闭页面...',
                    type: 'success',
                    duration: 5000
                })
                this.designPollReprot(plandata)
            }).catch((err)=>{
                this.$refs.functionBar.initReportIcon()
                 this.$message.error("生成初设报告失败！");
            })
        },
        designPollReprot(plandata){
            util.ajax.get("/design_poll/"+plandata.project_id+"/"+plandata.scheme_id).then((res)=>{
                if(res.data.code == 300){
                    setTimeout(()=>{
                        this.designPollReprot(plandata);
                    },5000)
                }
                else if(res.data.code == 404){
                    this.$refs.functionBar.initReportIcon()
                    this.$message.error("生成初设报告失败！");
                }
                else if(res.data.code == 200){
                    this.$message.success('初设报告生成成功!')
                    this.designDownloadReprot(plandata);
                }
                else{
                    this.$refs.functionBar.initReportIcon()
                    this.$message.error("生成初设报告失败！");
                }
                
            }).catch((err)=>{
                this.$refs.functionBar.initReportIcon()
                 this.$message.error("生成初设报告失败！");
            })
        },
        designDownloadReprot(plandata){
            let url = Config.getApiUrl();
            let link = document.createElement('a');
            link.style.display = 'none';
            link.target = '_blank';
            link.href = url + "/design_download/" +plandata.project_id+"/"+plandata.scheme_id;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.$refs.functionBar.initReportIcon()
        },
        projectCalculatingClose(){
            this.getInfoDefaultState();
        },
        //kmz要素图片界面关闭
        closeImgValueKmzBox(){
            this.imgValueActive = false;
        },
        //kmz要素有图片打开
        onImgValue(val, isTrue , position){
            // console.log(val);
            this.imgValue = val;
            this.imgValueActive = isTrue;
            if(position){
                this.imgPosition = position;
            }
        },
        //新 --- 开启后评估(在用了路由基础上改，不用路由)
        onOpenAssess(){
            //存储当前状态 
            this.drawVisibleStore.menuVisible = this.menuVisible;
            this.drawVisibleStore.functionBarVisible = this.$refs['functionBar'].barVisible;
            this.drawVisibleStore.switchModeBtnVisible = this.switchModeBtnVisible;
            //关闭左，下，右 ,收藏夹
            this.menuVisible = false;  //左
            this.$refs['functionBar'].barVisible = false;
            this.switchModeBtnVisible = true;  
            this.showFavorites = false;        
            //开启后评估，获取后评估数据
            this.assessHomeAcctive = true;
            this.waitingTwoMinute = true;  //等待页获取数据

            //退出KMZ
            this.onCloseKml();
        },
        //新 --- 退出后评估
        onCloseAssess(){
            //有id就进入项目，无就返回地球 
            if(this.$store.state.app.projectId){
                let obj ={};
                obj.project_id = this.$store.state.app.projectId;
                this.onProjectClick(obj ,1 , "earth" , true);
            }else{
                this.onFlyHome();
            }
            //还原状态 //开启 收藏夹
            this.$refs['functionBar'].barVisible = this.drawVisibleStore.functionBarVisible;  //下
            this.switchModeBtnVisible = false;  //右
            this.showFavorites = true;  //收藏
            //退出后评估，清除后评估数据
            this.assessHomeAcctive = false;
            this.$refs['cesiumContainer'].exitReEvalueMoudle();

        },
        // 图层
        onOpenLayer(){
            //存储当前状态 
            this.drawVisibleStore.menuVisible = this.menuVisible;
            this.drawVisibleStore.functionBarVisible = this.$refs['functionBar'].barVisible;
            this.drawVisibleStore.switchModeBtnVisible = this.switchModeBtnVisible;
            //关闭左，下，右 ,收藏夹
            this.menuVisible = false;  //左
            this.$refs['functionBar'].barVisible = false;
            this.switchModeBtnVisible = true;  
            this.showFavorites = false;   
            this.assessHomeAcctive = false;    
            this.onCloseKml(); 
            //开启图层
            this.layerAcctive = true;
            
        },
        addCesiumLayer (item){
            this.$refs['cesiumContainer'].addCesiumLayer(item)
        },
        removeCesiumLayer (item){
            this.$refs['cesiumContainer'].removeCesiumLayer(item)
        },
        cloceLayer(){
            //还原状态 //开启 收藏夹
            this.$refs['functionBar'].barVisible = this.drawVisibleStore.functionBarVisible;  //下
            this.switchModeBtnVisible = false;  //右
            this.showFavorites = true;  //收藏
            //退出图层
            this.layerAcctive = false;
        },
        closeAllTab (){
            //退出后评估，清除后评估数据
            this.assessHomeAcctive = false;
            this.$refs['cesiumContainer'].exitReEvalueMoudle();
            //收藏
            this.showFavorites = false; 
            this.onCloseKml(); 
            // 图层
            this.layerAcctive = false;
            //还原状态 
            this.getInfoDefaultState()
        },
        //获取后评估数据
        getNewProjects(){
            util.assessajax.get("/mapserver2014/rest/data/BGAL/.geojson", {
                   
            },).then(res => {
                if(res.status != 200){
                    this.$message.error('获取项目数据失败！'+res.status);
                }
                // console.log(res.data);
                this.waitingTwoMinute = false;
                this.assprojects = res.data.features;
                this.assprojects.map((item,index)=>{
                    item.isSelected = false;
                    item.name = item.properties.NAME;
                })
                //传三维整个data数据对象
                this.assprojectsData = res.data;
                let imgUrl = "static/schemecompare/assfan.png"
                let assCall = this.$refs['cesiumContainer'].loadWindFileds(this.assprojectsData, imgUrl);
                assCall.then(res=>{
                    // console.log(res);
                    if(res){
                        this.assCallback = res;
                    }
                })
                
                // if( this.assCallback ){
                    window.viewer.setFiledMouseEventCallback && window.viewer.setFiledMouseEventCallback({
                        infoCallBack:(res) => {
                            // console.log(res,"532");
                            
                            if(res!=null){
                                if(this.onlyOnce){
                                    this.onlyOnce = false;
                                    this.getProjectsTip(res);
                                }
                            }else{
                                this.assprojectsTip=[];
                                this.onlyOnce = true;
                            }
                        },
                        infoMoveCallBack:(res) => {
                            // console.log(res.pos);
                            this.asspos = res.pos;
                        }
                    });
                // }
                
            }).catch(() => {
                this.$message.error('获取项目数据失败！');
                this.waitingTwoMinute = false;
            });
        },
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
                this.assprojectsTip = obj.data;
                this.assprojectsTip.map((item,index)=>{
                    item.jx = item.jx.split(/[\s\n]/);
                    item.infos = val.infos;
                })
               
            })
        },
        onAssessProjectClicked(projectInfo, clickType){
            // console.log(projectInfo);
             //清空已有评估风场中风机模型
             this.onClearReEvalueTurbine();
            if(clickType == "earth"){
                this.getPlanData(projectInfo);
                //飞进入项目
                this.$refs['cesiumContainer'].flyToReEvaluePrj(projectInfo.infos.coord[0],projectInfo.infos.coord[1]);
            }else{
                //飞到行政
                this.$refs['cesiumContainer'].flyToProjectToCity(projectInfo.geometry.coordinates[0],projectInfo.geometry.coordinates[1]);
            }
        },
        // 获取所有风机设置和运行数据
        getPlanData(projectInfo){
            // console.log(projectInfo);
            var id = projectInfo.infos.PINID? projectInfo.infos.PINID : projectInfo.infos.TID;
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
                        // console.log(res);
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
        onClearReEvalueTurbine(){
            this.$refs['cesiumContainer'].clearReEvalueTurbine();
        },
        onSetWindFiledVisible(obj , isVisible){
            let mapKey = obj.properties.MAPKEY;
            this.$refs['cesiumContainer'].setWindFiledVisible(mapKey, isVisible);
        },
        onFlyHome(){
            this.$refs['cesiumContainer'].goHome();
        },
        getRouter(){
            // console.log(this.$route);
            //从后评估模式跳转回home,并且展开收藏夹,关闭左边导航
            if(this.$route.params.goto == "home"){
                this.menuVisible = false;   //关闭左边导航
                this.showFavorites = true;  //展开收藏夹
            }
        },
        //固定模版开关
        onInputTemplate(isTrue){
            this.zongjieActive = isTrue;
            this.$refs["inputTemplate"].inputTemplateVisible = isTrue;
        },
        //退出比选
        onClearContrastData(){
            this.$refs['planContrast'].planData = [];
            this.$refs['planContrastList'].defaultInfo();
            this.$refs['planList'].contrastData = [];
            this.switchModeBtnVisible = false;
            this.onCloseActive();
            this.duibiActive = false;
            this.onExitSchemeCpmpare();
            this.$refs['functionBar'].barVisible = true;//打开下面的工具
            this.contrastProjectCanClick = true;//关闭右下角列表
        },
        //关闭选中状态
        onCloseActive(){
            this.$refs['contrastBar'].activeClass=0;
        },
        //比选界面
        onOpenPlanContrast(type ,isTrue){
            // if(type == "project"){
            //     this.$refs['planContrast'].visible = isTrue;
            // }else{
            //     this.$refs['planContrast'].visible2 = isTrue;
            // }
            switch (type){
                case "zhibiao":
                    this.$refs['planContrast'].visible3 = isTrue;
                break;
            }
        },
        //初始比选界面-//影藏下方工具,右边方案，开启比选工具
        onInfoContrastBar(type , click){
            this.duibiActive = type;
            this.infoContrastActive = type;

            this.$refs['cesiumContainer'].enterSchemeCompare();
            this.closeMasterProject();//关闭右边方案
            this.$refs['functionBar'].barVisible = false;  //关下面的工具
            this.switchModeBtnVisible = true;  //关右边方案列表，，
            this.contrastProjectCanClick = false; //开启右下角列表，


            // if(click == "closeContrast"){
            //     this.$refs['functionBar'].barVisible = true;//打开下面的工具
            //     this.contrastProjectCanClick = true;//关闭右下角列表
            //     // this.$refs['functionBar'].$refs["fun31"].setUnselected();
            // }
        },
        //最小化方案总览
        onMinPlanMasterProject(){
            if(this.$refs['masterProjectYouke']){
                this.$refs['masterProjectYouke'].miniSizeActive = true;
            }
            
            if(this.$refs['masterProject']){
                this.$refs['masterProject'].miniSizeActive = true;
            }
        },
        //点击经评后he关闭经评，显示/影藏右下角的详情框界面(集电线路开启的)
        onCloseFanOptimize(type){

            this.$refs['fanOptimize'].isDisableShow = type;
        },
         //点击工具条任何地方二级，关闭塔位信息窗口+关闭风机信息+关闭测风塔信息
        onCloseCesiumContainer(type){
            // this.$refs['cesiumContainer'].towerInfo.show = type;
            this.onCloseFanDetail();
            // this.$refs['cesiumContainer'].clearHighLightFan();
            // this.$refs['cesiumContainer'].clearHighLightMast();
            // this.closeAllDetalis();
        },
        onCloseFanDetail(){
            // //关闭风机信息显示界面
            // this.$refs['fanDetailDialog'].close();
            // //关闭测风塔信息显示界面
            // this.mastInfo.visible = false;
            this.closeAllDetalis();  //整合关闭all详情框
        },
        onGetSchemeId(scheme_id){
            this.$refs['fanAddCoordinateDialog'].scheme_id = scheme_id;
        },
        closeTowerMessActive(type){
            this.$refs['windTowerSwitch'].close(type);
            this.closeMastDetail();
        },
        onTowerMessageClick(isOpen , val){
            this.$refs['mastTowerMessage'].open(isOpen , val);
            if(val == "data"){
                // 存储当前几个界面的状态
                this.panelVisibleStore.menuVisible = this.menuVisible;
                this.panelVisibleStore.functionBarVisible = this.$refs['functionBar'].barVisible;
                this.panelVisibleStore.switchModeBtnVisible = this.switchModeBtnVisible;
                this.panelVisibleStore.fanOptimizeLine = this.$refs['fanOptimize'].showStationAndLine;
                this.panelVisibleStore.fanOptimizeAlone = this.$refs['fanOptimize'].alone;
                
                if(this.$refs['masterProject']){
                    this.panelVisibleStore.baocunMasterProject = this.$refs['masterProject'].styleShow;
                }
                if(this.$refs['masterProjectYouke']){
                    this.panelVisibleStore.baocunMasterProject = this.$refs['masterProjectYouke'].newOpenShow;
                }
                //状态
                //menuVisible左边工具条
                //functionBarVisible下边工具条
                //switchModeBtnVisible右边方案
                this.menuVisible = false;
                this.switchModeBtnVisible = true;
                this.$refs['functionBar'].close();
                this.$refs['fanOptimize'].showStationAndLine = false;
                this.$refs['fanOptimize'].alone = false;
                
                if(this.$refs['masterProject']){
                    this.$refs['masterProject'].styleShow = false;
                }
                if(this.$refs['masterProjectYouke']){
                    this.$refs['masterProjectYouke'].newOpenShow = false;
                }
            }
        },
        //右边新增的方案详情  ----关闭事件
        closeMasterProject(type){
            if(!this.enManager){

                this.onPlanSelected(this.$store.state.app.projectId,null,true);
            }
            this.$refs['planList'].styleOpen(false);
            this.getInfoDefaultState();
            if(this.$refs['masterProject'] && this.$refs['masterProject'].miniSizeActive){
                this.$refs['masterProject'].miniSizeActive = false;
            }
            this.closeAllDetalis();
            this.$refs['fanOptimize'].init();

            //清空等效小时数
            this.$refs['cesiumContainer'].removeAllCustomLabels();
        },
        //整合关闭all详情框
        closeAllDetalis(){
            //判断界面开启了，才关闭颜色和界面
            // console.log(this.$refs['fanDetailDialog'].dialogVisible);
            if(this.$refs['fanDetailDialog'].dialogVisible){
                this.$refs['fanDetailDialog'].dialogVisible = false;
                this.onClearHighLightFan();
            }
            // console.log(this.mastInfo.visible);
            if(this.mastInfo.visible){
                this.mastInfo.visible = false;
                this.onClearHighLightMast();
            }
            // console.log(this.$refs['cesiumContainer'].towerInfo.show);
            if(this.$refs['cesiumContainer'].towerInfo && this.$refs['cesiumContainer'].towerInfo.show){
                this.$refs['cesiumContainer'].towerInfo.show = false;
                this.onClearHighTowerLabel();
            }
        },
        selectedProject(type){
            
            if(this.$refs['masterProject']){
                this.$refs['masterProject'].open(type);
            }
        },
        showMastDetail (towerInfo) {
            this.mastInfo.visible = false;
            this.$refs['mastDetail'].open(towerInfo);

            // 存储当前几个界面的状态
            this.panelVisibleStore.menuVisible = this.menuVisible;
            this.panelVisibleStore.functionBarVisible = this.$refs['functionBar'].barVisible;
            this.panelVisibleStore.switchModeBtnVisible = this.switchModeBtnVisible;
            this.panelVisibleStore.fanOptimizeLine = this.$refs['fanOptimize'].showStationAndLine;
            this.panelVisibleStore.fanOptimizeAlone = this.$refs['fanOptimize'].alone;
            
            if(this.$refs['masterProject']){
                this.panelVisibleStore.baocunMasterProject = this.$refs['masterProject'].styleShow;
            }
            if(this.$refs['masterProjectYouke']){
                this.panelVisibleStore.baocunMasterProject = this.$refs['masterProjectYouke'].newOpenShow;
            }
            // console.log(this.$refs['masterProject'].styleShow,"111");
            this.menuVisible = false;
            this.switchModeBtnVisible = true;
            this.$refs['functionBar'].close();
            this.$refs['fanOptimize'].showStationAndLine = false;
            this.$refs['fanOptimize'].alone = false;
            
            if(this.$refs['masterProject']){
                this.$refs['masterProject'].styleShow = false;
            }
            if(this.$refs['masterProjectYouke']){
                this.$refs['masterProjectYouke'].newOpenShow = false;
            }
        },
        closeMastDetail () {  
            //menuVisible左边工具条
            //functionBarVisible下边工具条
            //switchModeBtnVisible右边方案
            this.menuVisible = this.panelVisibleStore.menuVisible;  //左
            this.switchModeBtnVisible = this.panelVisibleStore.switchModeBtnVisible;  //右
            if (this.panelVisibleStore.functionBarVisible) {
                this.$refs['functionBar'].show1();
            }

            this.$refs['fanOptimize'].showStationAndLine = this.panelVisibleStore.fanOptimizeLine;
            this.$refs['fanOptimize'].alone = this.panelVisibleStore.fanOptimizeAlone;
            
            if(this.$refs['masterProject']){
                this.$refs['masterProject'].styleShow = this.panelVisibleStore.baocunMasterProject;
            }
            if(this.$refs['masterProjectYouke']){
                this.$refs['masterProjectYouke'].newOpenShow = this.panelVisibleStore.baocunMasterProject;
            }
            // console.log(this.$refs['masterProject'].styleShow,"00000");
            this.onClearHighLightMast();
        },
        showTowerChange () {
            this.$refs['towerChange'].open(this.currentProjectId, this.currentPlanId);
        },
        //加载KML
        onLoadKmlLayer(type , options ,callback){
            switch (type) {
                //加载数据
                case 'loadKmlLayer':
                callback( this.$refs['cesiumContainer'].getLoadKmlLayer(options) );
                break;
                //显示图层可见性
                case 'layerVisible':
                this.$refs['cesiumContainer'].getlayerVisible(options.KmlLayerData , options.obj.visible);
                break;
                //显示图层可见性
                case 'layerVisible2':
                this.$refs['cesiumContainer'].getlayerVisible(options.KmlLayerData , options.obj);
                break;
            }
        },
        onfeatureVisible(type , data, isTrue){
            switch (type) {
                //每个要素可见性
                case 'treeNodeVisible':
                this.$refs['cesiumContainer'].treeNodeVisible(data, isTrue);
                break;
            }
        },
        //定位到要素   --新
        onFeatureLoaction(data){
            this.$refs['cesiumContainer'].treeNodeLoaction(data);
        },
        //定位到图层
        onFeatureLoaction2(kmlLayer){
            this.$refs['cesiumContainer'].kmlLayerLocation2(kmlLayer);
        },
        //移出KML
        onRemoveKmlLayer(nodeInfo){
            this.$refs['cesiumContainer'].treeNodeRemove(nodeInfo);
        },
        //退出KMZ
        onCloseKml(){
            this.$refs['cesiumContainer'].exitKmlMoudle();
        },
        //kml新增要素
        onAddElement(type ,isTrue){
            this.shezhiOpen = isTrue;
            switch (type) {
                //gen文件夹
                case 'genwenjianjia':
                // console.log("gen文件夹");
                    this.elementName = type;
                    this.$refs['addkmzElement'].show();
                break;
                //重命名
                case 'checkName':
                    this.elementName = type;
                    this.$refs['addkmzElement'].show();
                break;
                //文件夹
                case 'wenjianjia':
                //图标
                case 'tubiao':
                //折线
                case 'zhexian':
                //多边形
                case 'duobianxing':
                //箭头
                case 'jiantou':
                // console.log("点线面文件要素");
                    this.elementName = type;
                    this.$refs['addkmzElement'].show();
                break;
            }
        },
        enterKmlMoudle(options){
            this.$refs['cesiumContainer'].enterKmlMoudle(options);
        },
        //新建图层，根文件
        newAddNewKmlLayer(data){
            this.$refs['cesiumContainer'].addNewKmlLayer(data);
        },
        //确定新增
        onAddNewKmlLayer(type,data){
            //值传回去收藏夹界面
            
            // console.log(data.KmlLayerData);
            switch (type){
                case "genwenjianjia":
                // console.log(data,"根文件夹新增");
                    this.$store.commit('addObjData',{...data}); //新增元素
                    //用新的--上面事件
                break;
                case "wenjianjia":
                    this.$refs['cesiumContainer'].addNewKmlFeature(data.layerId,data.pid,data.type,data,(res)=>{
                        // console.log(res ,"新增图标返回值");
                        if(res){
                            this.$store.commit('addYaosuDataWenjian',res); //新增文件夹元素
                        }
                    });
                break;
                case "tubiao":
                    
                    this.$refs['cesiumContainer'].addNewKmlFeature(data.layerId,data.pid,data.type,data,(res)=>{
                        // console.log(res ,"新增图标返回值");
                        if(res){
                            this.$store.commit('addYaosuData',res); //新增元素
                        }
                    });

                break;
                case "zhexian":
                    this.$refs['cesiumContainer'].addNewKmlFeature(data.layerId,data.pid,data.type,data,(res)=>{
                        // console.log(res,"新增折线返回值");
                        if(res){
                            this.$store.commit('addYaosuData',res); //新增元素
                        }
                    });

                break;
                case "duobianxing":                    
                    this.$refs['cesiumContainer'].addNewKmlFeature(data.layerId,data.pid,data.type,data,(res)=>{
                        // console.log(res,"新增多边形返回值");
                        if(res){
                            this.$store.commit('addYaosuData',res); //新增元素
                        }
                    });
                    
                break;
            }
           
        },
        //确定修改要素
        onShezhiKmlLayer(type , data ,options){
            console.log(type , data ,options ,"确定修改");
            data.name = options.name;
            this.$store.commit('shezhiData',data); 
            switch (type){
                case "tubiao":
                    
                this.$refs['cesiumContainer'].changeFeatureProperty(data, options);
                break;
                case "zhexian":

                this.$refs['cesiumContainer'].changeFeatureProperty(data, options);
                break;
                case "duobianxing":                    
                            
                this.$refs['cesiumContainer'].changeFeatureProperty(data, options);
                break;
            }
        },
        onSetTreeData(treeData){
            this.$refs['favorites-panel'].onSetTreeData();
        },
        onCloseAddkmzElement(){
            this.$refs['addkmzElement'].close();
        },
        //方案比选
        //加载一个方案的风机图标
        onCreateSchemeTurbines(scheme, schemeOptions, turbineOptions){
            this.$refs['cesiumContainer'].createSchemeTurbines(scheme, schemeOptions, turbineOptions);
        },
        //设置风机标签的可见性--
        onSetSchemeTurbineNameVisible(scheme, isVisible){
            this.$refs['cesiumContainer'].setSchemeTurbineNameVisible(scheme, isVisible);

        },
        //设置风机图标的可见性 --默认可见
        onSetSchemeTurbineIconVisible(scheme, isVisible){
            this.$refs['cesiumContainer'].setSchemeTurbineIconVisible(scheme, isVisible);

        },
        //移除单个方案中的风机图标（含文本）
        onRemoveSchemeTurbines(scheme){
            this.$refs['cesiumContainer'].removeSchemeTurbines(scheme);

        },
        //上面开关再点击关闭退出比选
        onTopContrastClose(){
            this.$refs['contrastBar'].close();
        },
        //退出比选
        onExitSchemeCpmpare(){
            this.$refs['cesiumContainer'].exitSchemeCpmpare();

        },
        //停止工程设计编辑中的状态
        stopEditActive(){
            //停止正在编辑道路
            this.$refs['cesiumContainer'].stopEditInsideRoad();  
            //停止正在编辑线路
            this.$refs['cesiumContainer'].stopEditCollectLine();
            this.$refs['cesiumContainer'].stopEditToolMode();
            //停止正在编辑升压
            this.$refs['cesiumContainer'].stopEditStation(); 
        },
        onMenuSelected (menuType ,isDel=false) {
            this.selectMenuType = menuType;

            // if (!this.$refs['functionBar'].isPlanModified && !(menuType === 'position' || menuType === 'person')) {
            //     this.$refs['functionBar'].isPlanModifiedFun();
            //     return;
            // }

            switch (menuType) {
                case 'search':
                    this.menuVisible = false;
                    this.$refs['searchBar'].show();
                    // this.$store.commit('clickMastInfo', {
                    //     'mastId': 0,
                    //     'bool': true,
                    //     'clientX': 100,
                    //     'clientY': 100
                    // });
                    break;
                case 'add':
                    if (this.$store.state.user.loginUserInfo.role === 3) {
                        this.$message('企业管理员没有权限执行此操作！');
                    }
                    else if(this.$store.state.user.loginUserInfo.role === 10){
                        this.$message('您没有权限执行此操作！');
                    } 
                    else {
                        this.menuVisible = false;
                        this.$refs['projectAddDialog'].open();

                    }

                    // this.$store.commit('clickMastInfo', {
                    //     'mastId': 0,
                    //     'bool': false,
                    //     'clientX': 100,
                    //     'clientY': 100
                    // });
                    break;
                case 'project':
                    this.menuVisible = false;
                    this.$refs['projectFilter'].open();
                    break;
                case 'file':
                    // this.menuVisible = false;
                    this.distributeActived = true;
                    this.switchModeBtnVisible = true;
                    // this.menuVisible = false;
                    this.$refs['functionBar'].close();
                    this.$refs['openOldData'].open(this.projectInfo);
                    break;
                case 'home':
                    this.$store.commit("projectId",0);
                    this.$store.commit("oldprojectId",0);
                    this.$store.commit("nowprojectId",0);
                    if(this.$refs["masterProjectYouke"]){
                        this.$refs["masterProjectYouke"].closeMasterProject();
                    }
                    this.$refs['contrastBar'].close(); //关闭比选
                    this.clearGis(); // 清空已加载数据图谱/工程设计数据。
                    //停止工程设计编辑中的状态
                    this.stopEditActive();
                     // 如果已经打开道路详情，需要关闭
                    if (this.displayRoadDetail) {
                        this.displayRoadDetail = false;
                    }
                    // 如果已经打开线路详情，需要关闭
                    if (this.displayPowerDetail) {
                        // todo 需要增加处于编辑状态的判断
                        this.displayPowerDetail = false;
                    }
                    //清空工程设计详情框的数据
                    this.initDetailsTip();

                    // 禁用升压站-集电线路联合显示
                    this.closeDetailsPanel();
                    this.$store.commit('inProject', false);
                    this.selectProject = null;
                    this.positionVisible = false;
                    this.$refs['functionBar'].close();
                    this.$refs['planList'].close();
                    this.$refs['switchModeBtn'].hidden();
                    this.wtTipVisible = false;
                    this.$refs['cesiumContainer'].goHome();
                    this.closeCheckTimer();

                    if(isDel){
                        this.menuVisible = false;
                    }


                    break;
                case 'password':
                    this.menuVisible = false;
                    this.$refs['passwordChangeDialog'].open();
                    break;
                case 'position':
                    // console.log(this.selectProject);
                    // let projectInfo = this.$store.state.projectInfo;
                    // console.log(this.projectInfo);
                    this.$refs['cesiumContainer'].zoomToExtent([this.projectInfo.xmin, this.projectInfo.ymin, this.projectInfo.xmax, this.projectInfo.ymax]);
                    // this.$refs['cesiumContainer'].flyToProject(this.selectProject.latitude,
                    //     this.selectProject.longitude);
                    // this.$refs['cesiumContainer'].flyToProjectG(this.selectProject.latitude,
                    //     this.selectProject.longitude);
                    break;
                // 长度测量
                case 'measureLength':
                this.celiangOpen = false;
                    this.$refs['cesiumContainer'].measureLength();
                    break;
                // 面积测量
                case 'measureArea':
                this.celiangOpen = false;
                    this.$refs['cesiumContainer'].measureArea();
                    break;
                // 高度测量(简单)
                case 'measureHeightSample':
                    this.celiangOpen = true;
                    this.$refs['cesiumContainer'].measureHeightSample();
                    break;
                // 高度测量(复杂--三角测量)
                case 'measureHeightComplex':
                    this.celiangOpen = true;
                    this.$refs['cesiumContainer'].measureHeightComplex();
                    break;
                // 清空测量
                case 'clearMeasure':
                    this.$refs['cesiumContainer'].clearMeasure();
                    this.$refs['cesiumContainer'].exitProfileAnalysis();
                    break;
                case 'exit':
                    clearTimeout(this.calculatTimer);
                    this.onMenuSelected("home");
                    util.ajax.get('/logout', {}).then(res => {
                        let retData = res.data;
                        if (retData.code !== 200) {
                            this.$message.error(retData.message);
                            return;
                        }
                        this.$router.push({
                            name: 'login'
                        });

                        this.$store.commit('logout');
                        Cookies.remove('user');
                        Cookies.remove('token');
                    }).catch((/* err */) => {
                        this.$message.error('退出失败！');
                    });
                    break;
                case 'poumian':
                this.celiangOpen = false;
                    console.log("剖面分析");
                    window.viewer.enterProfileAnalysis(res=>{
                        console.log(res);
                        this.poumianData = res;
                        //转echarts数据格式
                        this.zhuanEchartsData();
                    });

                    break;
                case 'shoucang':
                    this.showFavorites = true; // todo:dkj测试
                    this.menuVisible = false;
                    // setTimeout(()=>{
                    //     //开启的时候调用获取收藏数据
                    //     this.$refs['favorites-panel'].getFavoriteFiles();
                    // },500)
                    break;
            }
        },
        zhuanEchartsData(){
            var arrx = [];
            var arry = [];
            this.poumianData.map((item,index)=>{
                arrx.push((item.x/1000).toFixed(1));
                arry.push(parseInt(item.y));
            })
            arrx[0]="0";
            // arrx.push((Number(arrx[arrx.length-1])+0.5));
            console.log(arrx,arry);
            // console.log(this.$store.state.app.projectId);
            this.pouxAxis = arrx;
            this.pouyAxis = arry;
            //打开echarts
            this.poumianVisble = true;    
        },
        onClosePoumianDetails(){
            //关闭echarts
            this.poumianVisble = false;  
        },
        //清除即时绘制
        onClearDrawPlot(){
            this.$refs["cesiumContainer"].clearDrawPlot();
        },
        //即时绘制
        onDrawSelected(type , options){
            switch (type){
                //点
                case "dian":
                    // console.log(options)
                    this.opendian = true;
                    let obj1 = {};
                    obj1.imgUrl = options.urlType;
                    this.$refs["cesiumContainer"].drawIconPoint(obj1);
                break;
                //折线
                case "zhexian":
                    this.opendian = false;
                    let obj2 = {};
                    obj2.color = options.colorType;
                    obj2.opacity = options.opacity;
                    this.$refs["cesiumContainer"].drawPolyLine(obj2);
                break;
                //方形
                case "fangxing":
                    this.opendian = false;
                    let obj3 = {};
                    obj3.color = options.colorType;
                    obj3.opacity = options.opacity;
                    this.$refs["cesiumContainer"].drawPolygon(obj3);
                break;
                //箭头
                case "jiantou":
                    this.opendian = false;
                    let obj4 = {};
                    obj4.color = options.colorType;
                    obj4.opacity = options.opacity;
                    this.$refs["cesiumContainer"].drawArrowStright(obj4);
                break;

            }
        },
        onDrawTiming(isTrue){
            //存储当前的状态
            //menuVisible左边工具条
            //functionBarVisible下边工具条
            //switchModeBtnVisible右边方案
            if(isTrue){
                this.drawVisibleStore.menuVisible = this.menuVisible;
                this.drawVisibleStore.functionBarVisible = this.$refs['functionBar'].barVisible;
                this.drawVisibleStore.switchModeBtnVisible = this.switchModeBtnVisible;
                console.log(this.drawVisibleStore)
                this.menuVisible = false;
                this.$refs['functionBar'].barVisible = false;
                this.switchModeBtnVisible = false;
            }else{
                this.menuVisible = this.drawVisibleStore.menuVisible;
                this.$refs['functionBar'].barVisible = this.drawVisibleStore.functionBarVisible;
                this.switchModeBtnVisible = this.drawVisibleStore.switchModeBtnVisible;
                console.log(this.drawVisibleStore)
            }
            //开启绘制界面
            this.$refs['drawTiming'].activeCeliang = isTrue;
        },
      
        closeFavorites () {
            this.showFavorites = false; // todo:dkj测试
            this.menuVisible = true;
            //退出KMZ
            this.onCloseKml();
        },
        closeOleData () {
            this.distributeActived = false;
            this.switchModeBtnVisible = false;
            this.wtTipVisible = false;
            this.$refs['functionBar'].show1();
        },
        onSearchClose () {
            this.menuVisible = true;
        },
        onSearchProjectClick (project) {
            this.menuVisible = true;
            this.onProjectClick(project);
        },
        onProjectAddClose () {
            this.menuVisible = true;
            this.$refs['projectAddDialog'].close();
        },
        onFilterClose () {
            this.menuVisible = true;
            this.$refs['projectFilter'].close();
        },
        onPasswordChangeClose () {
            this.menuVisible = true;
            this.$refs['passwordChangeDialog'].close();
        },
        // 新建项目完成时事件
        onNewProject (lng, lat, projectInfo) {
            this.$refs['cesiumContainer'].flyToProjectG(lat, lng);
            this.getProjects(true, () => {
                this.ParameterUploadDialog = true;
                let newProjectInfo = null;
                for (let i = 0; i < this.projects.length; i++) {
                    if (this.projects[i].project_id === projectInfo.project_id) {
                        newProjectInfo = this.projects[i];
                        this.onProjectClick(this.projects[i]);
                        break;
                    }
                }
                // if(!this.enManager){
                //     this.$nextTick(() => {
                //         this.$refs['ParameterUploadDialog'].open(newProjectInfo.project_id);
                //     });
                // }else{
                //     this.$nextTick(() => {
                //         this.$refs['ParameterUploadDialogYouke'].open(newProjectInfo.project_id);
                //     });
                // }

            });
        },
        // 获取项目数据

        getProjects (showMessage = true, callback = null) {
            if (showMessage) {
                this.waitingTwoMinute = true;
            }
            util.ajax.get('/projects/filter', {
                credentials: true,
                params: {
                    radio_belong: '0',
                    radio_capacity: '0',
                    radio_status: '0'
                }
            }).then(res => {
                if (showMessage) {
                    this.waitingTwoMinute = false;
                }
                if (res.data.code !== 200) {
                    showMessage && this.$message.error('获取项目数据失败！');
                    return;
                }
                this.projects = res.data.data;
                this.$store.commit('projectsData', this.projects);
                if (callback) {
                    callback();
                }
            }).catch(() => {
                if (showMessage) {
                    this.waitingTwoMinute = false;
                }
                showMessage && this.$message.error('获取项目数据失败！');
            });
        },
        // 获取单个项目的详细数据
        getProjectDetail (projectId, callback) {
            this.waitingTwoMinute = true;
            util.ajax.get('/projects/' + projectId).then(res => {
                this.waitingTwoMinute = false;
                if (res.data.code !== 200) {
                    callback(null);
                    return;
                }
                callback(res.data.data);
            }).catch((err) => {
                this.waitingTwoMinute = false;
                // callback(null);
            });
        },
        onProjectEdit (projectInfo) {
            this.$refs['projectFilter'].close();
            this.$refs['projectAddDialog'].open(projectInfo);
        },
        //清空工程设计详情框的数据
        initDetailsTip(){
            this.daoluRes = {};
            this.xianluRes = {};
            this.shengyaRes = {};
            this.getroad = {
                roadLength : '',
                roadWidth : '',
                fillAmount : '',
                digAmount : '',
                branchNum : ''
            }
            this.getstation = {
                stationArea : '',
                baseHeight : '',
                fillAmount : '',
                digAmount : ''
            }
            this.getline = {
                level: '',
                lineLength: '',
                angleNum: '',
                lineMun: ''
            }
        },
        //游客模式---进入项目
        goIntoProjectYouke(projectInfo, from ,clickType){
            this.currentProjectId = projectInfo.project_id;
            this.planDetailShowing = false;
            this.planListShowing = false;
            this.displayWindGauge = false;  //风餐表
            this.$store.commit('projectInfo', projectInfo);
            this.$store.commit('projectDataSet', {}); // 清空设置信息
            //清空工程设计详情框的数据
            this.initDetailsTip();
            //wt  or  from 模式
            this.getMapType(projectInfo.project_id, (projectId, mapInfo) => {
                if (!mapInfo || !mapInfo.mesh_type) {
                    this.$refs['functionBar'].resetSection(projectId, 0);
                    return;
                }
                // 当项目为GoldFoam 或 GF\WT 模式时 才执行重置扇区数据，wt模式下不显示扇区菜单
                if (mapInfo.mesh_type === 0 || mapInfo.mesh_type === 2) {
                    this.$refs['functionBar'].resetSection(projectId, 0);
                }
            });
            this.currentExemptionProjectPlan = null;
            // 如果已经打开道路详情，需要关闭
            if (this.displayRoadDetail) {
                // todo 需要增加处于编辑状态的判断
                // if (this.$refs['roadDetail'].editedRoad) return this.$refs['roadDetail'].closeToolBar();
                this.displayRoadDetail = false;
            }
            // 如果已经打开线路详情，需要关闭
            if (this.displayPowerDetail) {
                // todo 需要增加处于编辑状态的判断
                this.displayPowerDetail = false;
            }
            this.projectInfo = projectInfo;  //项目快速定位用
            // 禁用工程设计的右下角概要--展示框
            this.closeDetailsPanel(); 
            this.$store.commit('inProject', false);  //测风塔开关按钮
            this.selectProject = null;
            this.positionVisible = false;  //快速定位附近按钮
            this.$refs['functionBar'].close();  //下面工具条
            this.$refs['planList'].close();   //右边方案列表
            this.$refs['switchModeBtn'].hidden();   //wt or from名字卡模块
            setTimeout(()=>{
                this.$refs['switchModeBtn'] && this.$refs['switchModeBtn'].hidden();  //有些电脑卡可能没关掉
            },500)
            this.wtTipVisible = false;   //正常模式的wt上传组件
            this.$store.commit('inProject', true);
            this.currentProjectName = projectInfo.project_name;  //详情项目数据名字
            this.$refs['projectFilter'].close();  //左边选择项目模块
            this.menuVisible = true;  //左边工具条
            this.closeCheckTimer();  //未找到

            // 关闭图例
            this.$refs['functionBar'].$refs['legendButton'].close();
            // 隐藏测风塔
            if (this.$refs['windTowerSwitch'] && this.$refs['windTowerSwitch'].isActive) {
                this.$refs['windTowerSwitch'].isActive = false;
                this.$refs['cesiumContainer'].hideMasts(false);
            }
            // 关闭风机弹出框
            if (this.$refs['fanDetailDialog']) {
                this.$refs['fanDetailDialog'].close();
            }
            // 关闭测风塔弹出框
            this.$store.commit('clickMastInfo', {'bool': false});
            //如果收藏夹打开了就关闭左边
            if(this.showFavorites){
                this.menuVisible = false;
            }
            this.isShowMastlist = false; //隐藏测风塔开关
            this.$refs['cesiumContainer'].initFanPositions([]); //清空风机
            // 项目资料不全
            if (projectInfo.status_id === 0) {
                console.log("项目资料不全");
                this.ParameterUploadDialog = true;
                this.$nextTick(() => {
                    this.$refs['ParameterUploadDialogYouke'].open(projectInfo.project_id);
                }); 
            }
            if (projectInfo.status_id === 1) {
                this.ParameterUploadDialog = true;
                this.$nextTick(() => {
                    this.$refs['ParameterUploadDialogYouke'].opentwo(projectInfo.project_id);
                });
                setTimeout(()=>{
                    this.$refs['ParameterUploadDialogYouke'].getProjects();
                },2000)
            }
            // 项目计算完成
            if (projectInfo.status_id === 2) {
                if(this.ParameterUploadDialog){
                    this.ParameterUploadDialog = false;
                }
                console.log("项目计算完成",projectInfo);
                //获取游客模式判断展示用的值
                this.getVisibleHttpYouke(projectInfo);
                //
                this.distributeActived = false;
                this.switchModeBtnVisible = false;
                this.positionVisible = true;
               
                //工具条
                this.$refs['functionBar'].show(projectInfo.project_id);
                this.$refs['functionBar'].distributeVisible = true;

                this.distributeActived = false;
                this.switchModeBtnVisible = false;
                this.wtTipVisible = false;
                //wt  or from 文字组件--游客不显示
                this.$refs['switchModeBtn'].hidden();
                // 取得扇区个数
                util.ajax.get('/input_cfd/' + projectInfo.project_id, {
                }).then(res => {
                    // console.log(res,"input_cfd");
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error("获取CFD失败："+retData.message);
                        return;
                    }
                    // 保存源坐标系参数，在按坐标添加风机时校验使用
                    this.inputCfd = res.data.data;
                    // 扇区个数
                    this.sectionNum = res.data.data.section_num;
                    // 设置目标EPSG坐标系
                    console.log(`源坐标系epsg_id为%c${res.data.data.epsg_src}`, 'color:green');
                    console.log(`目标坐标系epsg_id为${res.data.data.epsg_dst}`);
                    //设置风场的基本信息
                    this.$refs['cesiumContainer'].setFarmBaseInfo({epsg: res.data.data.epsg_dst, prjID: projectInfo.project_id});
                    //游客模式直接项目
                    this.$refs['cesiumContainer'].zoomToExtent([projectInfo.xmin, projectInfo.ymin, projectInfo.xmax, projectInfo.ymax]);

                }).catch((err) => {
                    console.error("input_cfd接口："+err);
                    this.$refs['cesiumContainer'].setFarmBaseInfo({epsg: null, prjID: projectInfo.project_id});
                    this.$message.error('取得CFD信息失败！');
                });
                //点击图标飞进项目，点击其他飞到行政级别
                // 取得VTK中心坐标
                util.ajax.get('/layer/' + projectInfo.project_id + '/info', {
                }).then(res => {
                    let retData = res.data;
                    if (retData.code == 200) {
                        
                        // 扇区个数
                        this.xcentre = res.data.data.xcentre;
                        this.ycentre = res.data.data.ycentre;
                    }
                }).catch((err) => {
                    console.error(err);
                    this.$message.error('取得VTK中心坐标失败！');
                });
              
                this.currentSectionId = '0.0';
                this.clearGis();
                console.log(this.$store.state.app.projectIdActive,"projectIdActive---------------------33333333333333");
                //用来判断前一次项目是否一样，就不加载,存project_id要注意
                if(this.$store.state.app.projectIdActive){
                    // console.log("加载了---影像地形");
                    // 添加对应风场的无人机影像(dom)
                    this.$refs['cesiumContainer'].addFarmImagery(projectInfo.dom_server_path);
                    // 添加对应风场的无人机地形(dem)
                    this.$refs['cesiumContainer'].addFarmTerrian(projectInfo.dem_server_path);
                }else{
                    console.log("没有加载---影像地形");
                }

                
                if( this.inputCfd ){
                    this.onPlanSelectedYouke (projectInfo.project_id, 1 ,true);
                }
            }else{

            }
            

        },
        //获取游客模式判断展示用的值
        getVisibleHttpYouke(projectInfo){
            //是否上传了  测风塔-在那边判断   
            this.loadMastData(projectInfo.project_id);
            //上传了机位点  or  成果
            util.ajax.get("/reveal_deploy/"+ projectInfo.project_id)
            .then((res)=>{
                // console.log(res,"上传了机位点  or  成果");
                if(res.data.code != 200){
                    this.$message.error("获取检测第一步上传的数据文件失败！");
                    return;
                }
                
                if(res.data.data.turbine_from == "turbine"){
                    this.$store.commit("noneChengguo",false);
                    console.log("游客模式：选择上传了--机位点");
                }
                if(res.data.data.turbine_from == "pg"){
                    this.$store.commit("noneChengguo",true);
                    console.log("游客模式：选择上传了--成果发电量");
                }
            })
            //是否上传了综合风图谱
            util.ajax.get('/change_wrg_height/' + projectInfo.project_id +"/1")
            .then(res => {
                // console.log(res,"是否上传了综合风图谱");
                if(res.data.data.length>0){
                    // this.$store.commit("noneZhonehe",true);
                    this.isShowZhonehe = true;
                    let heightData = res.data.data;
                    this.turbineHeight = heightData[0];
                    console.log("游客模式：有综合风图谱="+heightData+"/默认："+this.turbineHeight);
                }
                if(res.data.data.length<=0){
                    this.isShowZhonehe = false;
                    console.log("游客模式：none综合风图谱");
                }
                
            })
            //查询道路
            util.ajax.get("/reveal_road_check/"+ projectInfo.project_id +"/1")
            .then(res => {
            //    console.log(res,"是否上传了道路");
                if(res.data.code == 200){
                    console.log("游客模式：有道路");
                    this.road_check = true;
                }else{
                    this.road_check = false;
                    console.log("游客模式：none道路");
                }
            })
            .catch(err => {
                console.log(err);
            });
            
            //查询线路
            const p1 = this.getXianluZip(projectInfo);
            const p2 = this.getXianluDxf(projectInfo);
            Promise.all([ p1, p2 ]).then((res)=>{
                console.log(res);
                if(this.xianlu_check_zip || this.xianlu_check_dxf){
                    this.xianlu_check = true;
                    console.log("游客模式：有线路");
                }else{
                    this.xianlu_check = false;
                    console.log("游客模式：none线路");
                }
            }).catch((err)=>{
                console.log(err)
            })
            //查询升压
            // shengya_check
            util.ajax.get("/reveal_station_check/"+ projectInfo.project_id +"/1")
            .then(res => {
                if(res.data.code == 200){
                    console.log("游客模式：有升压");
                    this.shengya_check = true;
                }else{
                    this.shengya_check = false;
                    console.log("游客模式：none升压");
                }
            })
            .catch(err => {
                console.log(err);
            });
           
        },
        getXianluZip(projectInfo){
            return util.JdxlUrl.get("/queryscheme" , {
                params:{
                    project_id : projectInfo.project_id,
                    scheme_id : 1
                }
            })
            .then(res => {
                // console.log(res,"是否上传了线路");
                if(res.data.code == 1){
                    this.xianlu_check_zip = true;
                }else{
                    this.xianlu_check_zip = false;
                }
            })
            .catch(err => {
                console.log(err);
            });
        },
        getXianluDxf(projectInfo){
            return util.ajax.get("/reveal_line_convert/"+ projectInfo.project_id +"/1")
            .then((res)=>{
                // console.log(res,"查询线路");
                if(res.data.code == 200){
                    this.xianlu_check_dxf = true;
                }else{
                    this.xianlu_check_dxf = false;
                }
            }).catch(err => {
                console.log(err);
            });
        },
        //进入项目
        onProjectClick (projectInfo, from , clickType) {
            this.project_id = projectInfo.project_id;
            this.$refs['contrastBar'].close(); //关闭比选
            //清空等效小时数
            this.$refs['cesiumContainer'].removeAllCustomLabels();

            this.clearMastInfo();
            //预先加载整体信息数据
            // this.getMasstInfo(projectInfo.project_id);
            //进入项目关闭风机显示界面
            this.$refs['fanDetailDialog'].close();
            if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                this.$refs["masterProjectYouke"].closeMasterProject();
            }else{

                //进入项目关闭右边总览信息
                this.$refs["masterProject"].closeMasterProject();
            }
            // 先获取项目详情详细，再进入项目
            this.getProjectDetail(projectInfo.project_id, (projectDetail) => {
                // console.log(projectDetail);
                if (!projectDetail) {
                    this.$message.error('获取项目详情数据失败，无法进入项目！');
                    return;
                }
                // console.log(this.$store.state.user.loginUserInfo.role);
                if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){

                    this.goIntoProjectYouke(projectDetail, from ,clickType);
                    this.$refs['functionBar'].resetDefault();

                }else{

                    this.goIntoProject(projectDetail, from ,clickType);
                    this.$refs['functionBar'].resetDefault();
                    // 如果该项目的状态已经发生了变化，则重新获取所有项目的数据，更新项目列表
                    if (projectInfo.status_id !== projectDetail.status_id) {
                        this.getProjects(false);
                    }
                }
            });
        },
        goIntoProject (projectInfo, from ,clickType) {
            this.currentProjectId = projectInfo.project_id;
            this.planDetailShowing = false;
            this.planListShowing = false;
            this.displayWindGauge = false;
            this.$store.commit('projectInfo', projectInfo);
            this.$store.commit('projectDataSet', {}); // 清空设置信息
            this.getMapType(projectInfo.project_id, (projectId, mapInfo) => {
                if (!mapInfo || !mapInfo.mesh_type) {
                    this.$refs['functionBar'].resetSection(projectId, 0);
                    return;
                }
                // 当项目为GoldFoam 或 GF\WT 模式时 才执行重置扇区数据，wt模式下不显示扇区菜单
                if (mapInfo.mesh_type === 0 || mapInfo.mesh_type === 2) {
                    this.$refs['functionBar'].resetSection(projectId, 0);
                }
            });
            this.currentExemptionProjectPlan = null;
            // 如果已经打开道路详情，需要关闭
            if (this.displayRoadDetail) {
                // todo 需要增加处于编辑状态的判断
                // if (this.$refs['roadDetail'].editedRoad) return this.$refs['roadDetail'].closeToolBar();
                this.displayRoadDetail = false;
            }
            // 如果已经打开线路详情，需要关闭
            if (this.displayPowerDetail) {
                // todo 需要增加处于编辑状态的判断
                this.displayPowerDetail = false;
            }
            // 禁用工程设计的右下角概要
            this.closeDetailsPanel();
             //停止工程设计编辑中的状态
             this.stopEditActive();
            // todo 增加判断前一个项目是否处于手动优化状态，弹出提示
            this.projectInfo = projectInfo;
            this.$store.commit('inProject', false);
            this.selectProject = null;
            this.positionVisible = false;
            this.$refs['functionBar'].close();
            this.$refs['planList'].close();
            this.$refs['switchModeBtn'].hidden();
            this.wtTipVisible = false;
            // this.$refs['cesiumContainer'].goHome();  //不需要从初始飞
            this.$store.commit('inProject', true);
            this.currentProjectName = projectInfo.project_name;
            this.$refs['projectFilter'].close();
            this.menuVisible = true;
            this.closeCheckTimer();

            // 关闭图例
            this.$refs['functionBar'].$refs['legendButton'].close();
            // 隐藏测风塔
            if (this.$refs['windTowerSwitch'] && this.$refs['windTowerSwitch'].isActive) {
                this.$refs['windTowerSwitch'].isActive = false;
                this.$refs['cesiumContainer'].hideMasts(false);
            }
            // 关闭风机弹出框
            if (this.$refs['fanDetailDialog']) {
                this.$refs['fanDetailDialog'].close();
            }
            // 关闭测风塔弹出框
            this.$store.commit('clickMastInfo', {'bool': false});
            //如果收藏夹打开了就关闭左边
            if(this.showFavorites){
                this.menuVisible = false;
            }
            // 项目资料不全
            if (projectInfo.status_id === 0) {
                this.ParameterUploadDialog = true;
                this.menuVisible = false;
                this.$nextTick(() => {
                    this.$refs['ParameterUploadDialog'].open(projectInfo.project_id, projectInfo.design_capacity);
                });
            }

            // 项目计算中
            if (projectInfo.status_id === 1) {
                this.$refs['projCalc'].open(projectInfo);
            }

            // 项目计算完成
            if (projectInfo.status_id === 2) {
                console.log("项目计算完成admin",projectInfo);
                // 显示项目列表
                this.stationButtonsShow = false;
                this.planDetailShowing = false;
                this.positionVisible = true;
                this.$refs['functionBar'].show(projectInfo.project_id);
                // this.$store.commit('projectInfo', projectInfo);
                this.distributeActived = false;
                this.switchModeBtnVisible = false;
                this.wtTipVisible = false;
                this.$refs['planList'].show(projectInfo);
                this.$refs['switchModeBtn'].show();
                // this.guidanceShowed = false;

                // 点击风场
                // if (from === 1) {
                //this.$refs['cesiumContainer'].zoomToExtent([projectInfo.xmin, projectInfo.ymin, projectInfo.xmax, projectInfo.ymax]);
                // this.$refs['cesiumContainer'].flyToProject(projectInfo.latitude, projectInfo.longitude);
                // } else {
                //     this.$refs['cesiumContainer'].flyToProjectG(projectInfo.latitude, projectInfo.longitude);
                // }

                // 取得扇区个数
                util.ajax.get('/input_cfd/' + projectInfo.project_id, {
                }).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }
                    // 保存源坐标系参数，在按坐标添加风机时校验使用
                    this.inputCfd = res.data.data;
                    // 扇区个数
                    this.sectionNum = res.data.data.section_num;
                    // 设置目标EPSG坐标系
                    console.log(`源坐标系epsg_id为%c${res.data.data.epsg_src}`, 'color:green');
                    console.log(`目标坐标系epsg_id为${res.data.data.epsg_dst}`);
                    this.$store.commit('setformEpsg', res.data.data.epsg_dst)

                    this.$refs['cesiumContainer'].setFarmBaseInfo({epsg: res.data.data.epsg_dst, prjID: projectInfo.project_id});
                    if(clickType == "earth"){

                        this.$refs['cesiumContainer'].zoomToExtent([projectInfo.xmin, projectInfo.ymin, projectInfo.xmax, projectInfo.ymax]);
                    }else{
                        console.log(projectInfo.longitude,projectInfo.latitude);
                        // this.$refs['cesiumContainer'].flyToProjectByCity(projectInfo.project_id);
                        this.$refs['cesiumContainer'].flyToProjectToCity(projectInfo.longitude,projectInfo.latitude);
                    }

                }).catch((err) => {
                    console.error(err);
                    this.$refs['cesiumContainer'].setFarmBaseInfo({epsg: null, prjID: projectInfo.project_id});
                    this.$message.error('取得CFD信息失败！');
                });
                //点击图标飞进项目，点击其他飞到行政级别


                // 取得VTK中心坐标
                util.ajax.get('/layer/' + projectInfo.project_id + '/info', {
                }).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }
                    // 扇区个数
                    this.xcentre = res.data.data.xcentre;
                    this.ycentre = res.data.data.ycentre;
                }).catch((err) => {
                    console.error(err);
                    this.$message.error('取得VTK中心坐标失败！');
                });

                // 默认综合风图谱高度
                this.turbineHeight = 90;
                this.$refs['functionBar'].resetWrgWeight(90);
                // this.$refs['functionBar'].resetSection(projectInfo.project_id, 0);
                this.currentSectionId = '0.0';
                this.clearGis();
                console.log(this.$store.state.app.projectIdActive,"projectIdActive---------------------33333333333333");
                //用来判断前一次项目是否一样，就不加载,存project_id要注意
            if(this.$store.state.app.projectIdActive){
                // console.log("加载了---影像地形");
                // 添加对应风场的无人机影像(dom)
                this.$refs['cesiumContainer'].addFarmImagery(projectInfo.dom_server_path);
                // 添加对应风场的无人机地形(dem)
                this.$refs['cesiumContainer'].addFarmTerrian(projectInfo.dem_server_path);
            }else{
                console.log("没有加载---影像地形");
            }
                
                // 取得测风塔数据
                this.loadMastData(projectInfo.project_id);
            } else {
                this.positionVisible = false;

                this.$refs['functionBar'].close();
                this.$refs['planList'].close();
                this.$refs['switchModeBtn'].hidden();
                this.wtTipVisible = false;
                this.$refs['cesiumContainer'].setFarmBaseInfo({epsg: null, prjID: projectInfo.project_id});

            }

            // Must be last
            // this.$refs['cesiumContainer'].startEdit(false);
            // this.canAddFan = false;
            // this.onSectionVisible('', false); // 清除已加载的风图谱场景
            // this.selectProject = projectInfo;
        },
        //初始进入项目的状态
        getInfoDefaultState(){
           this.menuVisible = true;
           this.$refs['functionBar'].barVisible = true;
           this.switchModeBtnVisible = false;
        },
        // 获取项目上传数据配置信息：包括地形来源类型、仿真模式选择类型
        getMapType (projectId, callback) {
            util.ajax.get('/get_map_type/' + projectId).then(res => {
                // console.log(res,"moshi1111111")
                if (callback) {
                    callback(projectId, res.data.data);
                }

                if (res.data.code !== 200) {
                    console.log('get_map_type:' + JSON.stringify(res.data));
                    return;
                }

                if (res.data.data) {
                    res.data.data.project_id = projectId;
                }

                this.$store.commit('projectDataSet', res.data.data);
            }).catch((err) => {
                console.log('get_map_type:' + err);
                if (callback) {
                    callback(projectId);
                }
            });
        },
        //测风塔信息
        loadMastData (projectId ,isTrue=false) {
            util.ajax.get('/input_mast/' + projectId).then((res) => {
                // console.log(res,"获取测风塔数据接口");
                if(res.data.code == 404){
                    this.isShowMastlist = false;
                    console.log("游客模式：none测风塔--------");
                    return;
                }
                if(res.data.code == 200){
                    this.isShowMastlist = true;
                    console.log("游客模式：有-测风塔--------");
                }
                if (res.data.code !== 200) {
                    this.$message.error("测风塔:"+res.data.message);
                    return;
                }
                let towerList = [];
                if (res.data.data && res.data.data.length > 0) {
                    res.data.data.forEach((item) => {
                        towerList.push({
                            id: item.mast_id,
                            x: item.coordinate_x,
                            y: item.coordinate_y,
                            longitude: item.longitude,
                            latitude: item.latitude,
                            z: 0,
                            height: item.height,
                            all_height: item.all_height,
                            all_avg_speed: item.all_avg_speed,
                            all_cycle: item.all_cycle,
                            // altitude: item.altitude,
                            avg_speed: item.avg_speed,
                            start_date: item.start_date,
                            end_date: item.end_date,
                            name: item.mast_name,
                            elevation: item.elevation
                        });
                    });
                }
                // console.log(res.data.data,towerList) //接口

                this.$refs['cesiumContainer'].initMasts(towerList ,isTrue);
                
                if(!isTrue){
                    setTimeout(() => {
                        this.$refs['cesiumContainer'].hideMasts(false);
                    }, 3000);
                }
            }).catch((err) => {
                console.error("获取测风塔信息失败"+err);
                // this.$message.error('获取测风塔信息失败！');
            });
        },
        // 由缺乏数据页面发起计算
        onCalculateStarted (projectId) {

            // this.$refs['projCalc'].open({ project_id: projectId });
            this.$refs['projCalc'].open({ project_id: projectId });
            this.getProjects(false);
        },
        // 关闭缺乏数据页面
        onParameterClose () {
            this.ParameterUploadDialog = false;
            this.currentProjectName = ''; // 问题: 页面项目图标，关闭项目图标还在
            //非游客模式
            if(!this.enManager){
                this.menuVisible = true;
            }
        },
        //清除历史数据
        clearMastInfo(){
            this.$refs['mastTowerMessage'].gridData = [
            [["abc"]],
            [["id"]],
                    [["测风塔号"]],
                    [["经度"]],
                    [["纬度"]],
                    [["海拔(m)"]],
                    [["通道高度(m)"]],
                    [["参考年选取开始"]],
                    [["参考年选取结束"]],

                    [["实测平均风速"]],
                    [["平均风切变"]],
                    [["A(m/s)"]],
                    [["K"]],
                    [["15m/s代表瑞流强度值"]],
                    [["主风能方向"]],
                    [["50年一遇最大风速(10min)(m/s)"]],
                    [["50年一遇极大风速(3s)(m/s)"]],
                    
                ];
            // this.$refs['mastTowerMessage']. gridData2 = [
            //         [["测风塔号"]],
            //         [["高度(m)"]],
            //         [["实测平均风速"]],
            //         [["平均风切变"]],
            //         [["A(m/s)"]],
            //         [["K"]],
            //         [["15m/s代表瑞流强度值"]],
            //         [["主风能方向"]],
            //         [["50年一遇最大风速(10min)(m/s)"]],
            //         [["50年一遇极大风速(3s)(m/s)"]]
            //     ];
        },
        //测风塔整体信息数据 --
        getMastInfo(projectId){
            this.mastTowerMessageData = [];
            util.ajax.get('/mast_info', {
                params:{
                    project_id: projectId
                }
            }).then(res =>{
                // console.log(res.data)
                if(res.data.code == 200){

                    this.mastTowerMessageData = res.data.data;

                }else{
                    this.$message.error("测风塔整体信息获取失败！");
                    this.$refs['mastTowerMessage'].waitingData = false;
                    console.error(res.data.message)
                    return;
                }
            }).catch(()=>{
                this.$message.error("测风塔整体信息获取失败！");
                this.$refs['mastTowerMessage'].waitingData = false;

            })
        },
        //游客模式
        onPlanSelectedYouke (projectId, planId=1, calculating ) {
            this.closeAllDetalis();  //关闭all详情框
            this.currentProjectId = projectId;
            this.currentPlanId = planId;
            this.currentExemptionProjectPlan = null;
            this.$store.commit('projectId', projectId);
            this.$store.commit('planId', planId);
            this.haveTowerData = false;
            this.displayWindGauge = false;
            // 关闭图例
            this.$refs['functionBar'].$refs['legendButton'].close();
           
            this.closeDetailsPanel();
            if (projectId){
                //calculating  是否置灰工具条用
                this.$refs['functionBar'].showDistribute(planId, false);
                //设置列表选中方案值1
                this.$store.commit('planId', planId);

               
                //获取总览数据
                this.getMastProject();
                //打开右边总览--游客模式
                this.$refs['masterProjectYouke'].show(projectId);          
                //游客模式设置默认高度
                this.$refs['functionBar'].resetWrgWeight(this.turbineHeight);

                this.waitingTwoMinute = true;
                 // 风机列表
                 this.$refs['cesiumContainer'].initFanPositions([]);
                 util.ajax.get('/input_turbine/' + projectId + '/' + planId, {

                }).then(res => {
                    // console.log(res);
                    this.waitingTwoMinute = false;
                    let retData = res.data;
                    if (retData.code !== 200) {
                        // 初期化风机
                        this.$refs['cesiumContainer'].initFanPositions([]);
                        console.error('获取风机信息失败:' + retData.message);
                        this.$message.error('获取风机信息失败!');
                    } else {
                        this.fans = res.data.data;
                        this.fans.forEach((item) => {
                            // console.log(item.turbine_id);
                            if (item.latitude && item.longitude) {
                            } else {
                                let point = this.$refs['cesiumContainer'].XYZ2BLH({ x: parseFloat(item.coordinate_x), y: parseFloat(item.coordinate_y), z: 0 });
                                item.longitude = point.x;
                                item.latitude = point.y;
                            }
                        });
                        // console.log(this.fans, "fans");
                        // 初期化风机
                        this.$refs['cesiumContainer'].initFanPositions(this.fans);
                        // 设置默认风图谱高度(取轮毂高度最多的那个高度)
                        // this.turbineHeight = this.calculateFanHeight(this.fans);
                        this.$refs['functionBar'].resetWrgWeight(this.turbineHeight);
                        
                    }
                }).catch((error) => {
                    this.waitingTwoMinute = false;
                    console.error('获取风机信息失败:' + error);
                    this.$message.error('获取风机信息失败！');
                });

               
              

            }else{
                this.$refs['functionBar'].closeDistribute();
                this.fans = [];
                this.$refs['cesiumContainer'].initFanPositions([]);
                this.turbineHeight = 90;
                this.$refs['functionBar'].resetWrgWeight(this.turbineHeight);
            }
            this.canAddFan = false;
            this.$refs['functionBar'].setUnSelect('21'); // 优化排布不选中
            this.$refs['cesiumContainer'].startEdit(false); // 设置点击风机，不弹出工具条

            // 把工具条服务为默认状态
            this.$refs['functionBar'].resetDefault(); // 清空工具条选项
            // this.$refs['functionBar'].showInfo(false, 0, null);
            this.clearGis(); // 清空已加载数据图谱/工程设计数据。

           

        },
        onPlanSelected (projectId, planId, calculating ,isTrue=false ) {
            this.closeAllDetalis();  //关闭all详情框
            this.currentProjectId = projectId;
            this.currentPlanId = planId;
            this.currentExemptionProjectPlan = null;
            this.$store.commit('projectId', projectId);
            this.$store.commit('planId', planId);
            this.haveTowerData = false;
            this.displayWindGauge = false;
            // 关闭图例
            if(this.$refs['functionBar'].$refs['legendButton']){
                this.$refs['functionBar'].$refs['legendButton'].close();
            }
            this.checkCalculating();
            this.closeDetailsPanel();
            if (planId && isTrue) {
                this.$refs['functionBar'].showDistribute(planId, calculating);
                // if (calculating) {
                //     this.closeDetailsPanel();
                // }
                this.waitingTwoMinute = true;
                this.$refs['planList'].styleOpen(true); //控制右边方案显示隐藏
                /*
                From 杜：2018/10/10 14:18
                新版渲染地图时点位获取的接口是接口是http://10.32.23.122/api/output_pg_list/<pr/<project_id>/<scheme_id>，
                但是方案优化的点位数据提交的是input_turbine，这样会导致点击重新计算后点位会刷回原来的位置，
                所以需要点位还是像上一版一样通过样通过http://10.32.23.80/api/input_turbine/<pr/<project_id>/<scheme_id>这个接口获取
                 */
                // 风机列表
                util.ajax.get('/input_turbine/' + projectId + '/' + planId, {
                    // util.ajax.get('/output_pg_list/' + projectId + '/' + planId, {
                }).then(res => {
                    this.waitingTwoMinute = false;
                    let retData = res.data;
                    if (retData.code !== 200) {
                        // 初期化风机
                        this.$refs['cesiumContainer'].initFanPositions([]);
                        console.error('获取风机信息失败:' + retData.message);
                        this.$message.error('获取风机信息失败!');
                    } else {
                        this.fans = res.data.data;
                        this.fans.forEach((item) => {
                            if (item.latitude && item.longitude) {
                            } else {
                                let point = this.$refs['cesiumContainer'].XYZ2BLH({ x: parseFloat(item.coordinate_x), y: parseFloat(item.coordinate_y), z: 0 });
                                item.longitude = point.x;
                                item.latitude = point.y;
                            }
                        });
                        // console.log(this.fans, "fans");
                        // 初期化风机
                        this.$refs['cesiumContainer'].initFanPositions(this.fans);
                        // 设置默认风图谱高度(取轮毂高度最多的那个高度)
                        this.turbineHeight = this.calculateFanHeight(this.fans);
                        this.$refs['functionBar'].resetWrgWeight(this.turbineHeight);
                    }
                }).catch((error) => {
                    this.waitingTwoMinute = false;
                    console.error('获取风机信息失败:' + error);
                    this.$message.error('获取风机信息失败！');
                });

                // 机型价格
                util.ajax.get('/scheme_price/' + projectId + '/' + planId, {}).then((res) => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                    } else {
                        let priceData = {
                            electric_price: retData.data.electric_price, // 电价
                            tower_price: retData.data.tower_type['钢塔'], // 钢塔价格
                            rebar_price: retData.data.steel_price, // 钢铁价格
                            tower_weight: retData.data.tower_weight,
                            anchor_price: retData.data.anchor_price,
                            lifting_price: retData.data.lifting_price
                        };

                        // 机型价格解析
                        let extraMap = new Map();
                        let extraObj = retData.data.turbine_type;
                        for (let k of Object.keys(extraObj)) {
                            extraMap.set(k, extraObj[k]);
                        }
                        // extraStr = '{"GW-66/1500": 1650, "GW-70/1500": 2650, "GW-77/1500": 3650}';
                        // let extra = extraStr ? extraStr.replace(/u/g, '').replace(/\'/g, '"') : null;
                        // let extraMap = new Map();
                        // if (extra) {
                        //     let extraObj = JSON.parse(extra);
                        //     for (let k of Object.keys(extraObj)) {
                        //         extraMap.set(k, extraObj[k]);
                        //     }
                        // }
                        priceData.extraMap = extraMap;

                        this.priceData = priceData;

                        this.$store.commit('resetPrice', priceData);
                    }
                }).catch((err) => {
                    console.error(err);
                    this.$message.error('取得机型价格数据失败！');
                });
            } else {
                this.$refs['functionBar'].closeDistribute();
                this.fans = [];
                this.$refs['cesiumContainer'].initFanPositions([]);
                this.turbineHeight = 90;
                this.$refs['functionBar'].resetWrgWeight(this.turbineHeight);
            }
            this.canAddFan = false;
            this.$refs['functionBar'].setUnSelect('21'); // 优化排布不选中
            this.$refs['cesiumContainer'].startEdit(false); // 设置点击风机，不弹出工具条

            // 把工具条服务为默认状态
            this.$refs['functionBar'].resetDefault(); // 清空工具条选项
            // this.$refs['functionBar'].showInfo(false, 0, null);
            this.clearGis(); // 清空已加载数据图谱/工程设计数据。

            if (this.guidanceShowed === false) {
                this.guidanceShow = true;

                setTimeout(() => {
                    let left = this.$refs['functionBar'].$el.offsetLeft;
                    let subLeft = this.$refs['functionBar'].getLeft();
                    this.borderLayerLeft = left + subLeft;
                }, 100);
            }
        },
        //等效小时数
        initHoursData(type){
            if(type){
                this.openHours = true;
            }else{
                this.openHours = false;
            }
        },
        //手动优化  -  退出手动优化，等效小时数
        addCustomLabel(type, addID){
            if(type == "open"){
                this.openHours = true;
                this.$refs['cesiumContainer'].showOrHideFanNameLabel2(false);
                //初始化 等效小时数
                let currentFans = this.$store.state.scheme.currentFans;
                var sum = 0;
                currentFans.forEach((item, index)=>{
                    sum += Number(item.equivalent_hours)
                    this.$refs['cesiumContainer'].addCustomLabel(item.turbine_id, JSON.stringify(item.equivalent_hours),{
                        isBold:false,
                        width: 75,
                        height:24,
                        color:'rgba(0, 183, 172, 1)',
                        font:11
                    });
                })
                this.old_equivalent_hours = (sum/currentFans.length);
                // console.log(this.old_equivalent_hours)
                this.changeHours = 0;
            }
            if(type == "close"){
                this.openHours = false;
                this.$refs['cesiumContainer'].showOrHideFanNameLabel2(true);
                //等效小时数
                this.$refs['cesiumContainer'].removeAllCustomLabels();
            }
            if(type == "add"){
                //添加风机后，添加展示 等效小时数 
                let that = this;
                this.$store.state.scheme.currentFans.filter((item,index)=>{
                    if(item.turbine_id == addID){
                        that.getFastSpeedData(item.coordinate_x, item.coordinate_y, item.height, item.power_curve_filename, (callBack)=>{
                            item.waked_speed = callBack.speed || "0";
                            item.equivalent_hours = callBack.ehours_after_loss || "0";
                            that.$refs['cesiumContainer'].addCustomLabel(item.turbine_id, JSON.stringify(item.equivalent_hours), {
                                isBold:false,
                                width: 75,
                                height:24,
                                color:'rgba(228,161,0,1)',
                                font:11
                            })
                            if(item.equivalent_hours){
                                console.log(item.equivalent_hours)
                                that.$store.commit("changeHours", parseInt(item.equivalent_hours));
                                that.$store.commit("changeCurrentFansHours", {id: item.turbine_id, hours: item.equivalent_hours});
                            }
                        })
                    }
                })
            }
        },
        //获取 等效小时数
        getFastSpeedData(x, y, h, power_curve, callBack){
            util.ajax.get("/fastspeed/"+ this.$store.state.app.projectInfo.project_id +"/wind-power",
            {
                params:{
                    x: x,
                    y: y,
                    h: h,
                    power_curve: power_curve
                }
            })
            .then((res)=>{
                // console.log(res)
                if(res.data.code == 200){
                    callBack(res.data.data);
                }else{
                    callBack({});
                    this.$message.warning(res.data.message);
                }
            }).catch((err)=>{
                console.log(err)
                this.$message.error("获取快速发电量数据失败！");
                callBack({});
            })
        },
        //批量 等效小时数
        getFastSpeedDataList(x, y, h, power_curve, project_id, turbine_id, callBack){
            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 60000
            };
            data.append('x', JSON.stringify(x));
            data.append('y', JSON.stringify(y));
            data.append('h', JSON.stringify(h));
            data.append('power_curve', JSON.stringify(power_curve));
            data.append('label', JSON.stringify(turbine_id));
            util.ajax.post("/fastspeed/"+ project_id +"/wind-power-list", data, config).then((res)=>{
                if(res.data.code == 200){
                    callBack(res.data.data);
                }else{
                    callBack([]);
                }
            }).catch((err)=>{
                callBack([]);
                console.log(err);
                this.$message.error("批量获取快速发电量数据失败！");
            })
        },
        //关闭导入确认界面
        onCloseDaoruDetails(){
            this.daoruDataList = [];
            this.daoruCommitVisible = false;
        },
        // 导入风参表 - 保存事件
        //更新数据
        uploadDaoruList(arr){
            // console.log(arr);
            this.$message.success("数据上传中...");
            this.daoruCommitVisible = false;
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            //差保存接口，/save_pg_excel/<int:project_id>/<string:scheme_id>
            util.ajax.post('/save_pg_excel/' + this.$store.state.app.projectId + '/' + this.$store.state.app.planId, {
                pg_data: arr
            },config).then(res=>{
                // console.log(res);
                if(res.data.code != 201){
                    this.$message.error("保存失败");
                    return;
                }
                //在调经评接口
                this.evaluationCalculation((done) => {
                    if (!done) return;
                    console.log("经评："+ done);
                    //刷新数据
                    this.daoruGetList();
                    this.$message.success("方案发电量结果更新成功");
                })

            })
        },
        //导入触发再次确认界面
        onDaoruData(data){
            this.daoruDataList = data;
            this.daoruCommitVisible = true;
            // console.log(this.daoruDataList);
        },
        //导入表格刷新数据
        daoruGetList(){
            // 风机列表
            util.ajax.get('/input_turbine/' + this.$store.state.app.projectId + '/' + this.$store.state.app.planId, {
                // util.ajax.get('/output_pg_list/' + projectId + '/' + planId, {
            }).then(res => {
                // this.waitingTwoMinute = false;
                let retData = res.data;
                if (retData.code !== 200) {
                    // 初期化风机
                    this.$refs['cesiumContainer'].initFanPositions([]);
                    console.error('获取风机信息失败:' + retData.message);
                    this.$message.error('获取风机信息失败!');
                } else {
                    this.fans = res.data.data;
                    this.fans.forEach((item) => {
                        if (item.latitude && item.longitude) {
                        } else {
                            let point = this.$refs['cesiumContainer'].XYZ2BLH({ x: parseFloat(item.coordinate_x), y: parseFloat(item.coordinate_y), z: 0 });
                            item.longitude = point.x;
                            item.latitude = point.y;
                        }
                    });
                    // console.log(this.fans, "fans");
                    // 初期化风机
                    this.$refs['cesiumContainer'].initFanPositions(this.fans);
                }
            }).catch((error) => {
                // this.waitingTwoMinute = false;
                console.error('获取风机信息失败:' + error);
                this.$message.error('获取风机信息失败！');
            });
            //再调一次方案总览接口
            this.getMastProject();
        },
        // 计算默认的轮毂高度
        calculateFanHeight (fans) {
            let fanHeight = '90';
            let count = 0;
            let counts = _.countBy(fans, (fan) => {
                return fan.height;
            });
            _.each(counts, (value, key, list) => {
                if (value > count && key && key !== 'null') {
                    fanHeight = key;
                }
            });
            return parseInt(fanHeight);
        },
        //经评详情
        onShowPlanDetail (plandata) {
            console.log(plandata);
            this.planDetailShowing = true;
            this.planListShowing = true;
            this.$refs['functionBar'].close(); // Add By ZhaiCY
            this.switchModeBtnVisible = true; // 点击详隐藏WT

            this.$refs['planFullDetails'].open(plandata.project_id, plandata.scheme_id, plandata.scheme_name);
        },
        onCopyPlan (projectId, planId) {
            this.$refs['planCopy'].open(projectId, planId);
        },
        onRemovePlan (projectId, planId) {
            this.$alert('确认删除该排布方案？操作将不可回退。', '删除方案', {
                confirmButtonText: '确定',
                center: true,
                callback: action => {
                    if (action !== 'confirm') {
                        return;
                    }
                    this.$store.commit('globeLoading', {loading: true, text: '正在删除方案...'});
                    util.ajax.delete('/scheme_delete/' + projectId + '/' + planId, {
                    }).then(res => {
                        console.log(res,"删除");
                        this.$store.commit('globeLoading', {loading: false, text: ''});
                        let retData = res.data;
                        if (retData.code !== 204) {
                            this.$message.error(retData.message);
                            return;
                        }
                        this.$message.success('已成功删除方案。');
                        this.$refs['planList'].loadPlanData(planId !== this.$refs['planList'].selectedPlanId);
                    }).catch((/* err */) => {
                        this.$store.commit('globeLoading', {loading: false, text: ''});
                        this.$message.error('删除方案失败！');
                    });
                }
            });
        },
        onReportPlan (projectId, planId) {
            this.$refs['cesiumContainer'].locationSelectInsideRoad('roadLine');
            // this.$alert('确认生成微观选址报告?', '生成报告', {
            //     confirmButtonText: '确定',
            //     center: true,
            //     callback: action => {
            //         if (action !== 'confirm') {
            //             return;
            //         }
            //         let url = util.baseUrl + '/report/' + projectId + '/' + planId;
            //         // window.open(url);
            //         window.location.href = url;
            //     }
            // });
        },
        onProjectChange (projects) {
            // console.log(projects);
            this.projects = projects;
            //那边有监听，不需要这里调用
            // this.$refs['cesiumContainer'].initFarmPositions();
        },
        onGuidanceClick () {
            this.guidanceShow = false;
            this.guidanceShowed = true;
            this.borderLayerLeft = -300;
            const userId = this.$store.state.user.loginUserInfo.user_id;
            util.ajax.put('/login_first/' + userId, {}).then(res => {
            }).catch((/* err */) => {
                this.$message.error('首次登录接口错误');
            });
        },
        onPlanDetailClose () {
            this.planDetailShowing = false;
            this.planListShowing = false;
            this.$refs['functionBar'].show1(); // Add By ZhaiCY
            this.switchModeBtnVisible = false;
            //关闭经评工具选中
            this.$refs['functionBar'].$refs['fun30'].setUnselected();
        },
        onPlayFunChange (funId, projectId, planId, selected) {
            this.$store.commit('projectId', projectId);
            this.$store.commit('planId', planId);
            this.$refs['cesiumContainer'].getInsideRoad(projectId, planId, false);
            this.$refs['cesiumContainer'].getStation(projectId, planId, false);
            this.$refs['cesiumContainer'].getCollectLine(projectId, planId, false);
            this.$refs['cesiumContainer'].dxfCollectLine(projectId, planId, false);
        },
        onDxfFileSelected (funId, projectId, planId, fileInfo) {
            if (funId === 26) { // 场内道路
                this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, false);
                this.evaluationCalculation((done) => {
                    let data = this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, true);
                    data.then(res => {
                        this.$store.commit('editedRoad', false);
                    }).catch(err => {
                        console.log('获取场内道路信息失败:' + err);
                        if (err.code === 404) {
                            // this.$message.error('S3上文件不存在。');
                        } else if (err.code === 403) {
                            this.$message.error('S3上文件格式错误。');
                        } else {
                            this.$message.error('获取场内道路信息失败');
                        }
                    });
                });
            } else if (funId === 24) { // 集电线路
                this.uploadFileOfJdxl(projectId, planId, fileInfo);
            }
        },
        gisClose(){
            this.clearGis();
        },
        clearGis () {
            this.$refs['cesiumContainer'].createIntegrateWindMap('', this.xcentre, this.ycentre, 90, false);
            this.$refs['cesiumContainer'].createRestrict('', false);
            this.$refs['cesiumContainer'].getInsideRoad('', '', false);
            this.$refs['cesiumContainer'].getCollectLine('', '', false);
            this.$refs['cesiumContainer'].dxfCollectLine('', '', false);
            this.$refs['cesiumContainer'].getStation('', '', false);
            this.onSectionVisible('', false);
        },
        // 按坐标导入添加风机判断风机是否超出范围
        onIsOutOfFarm (lon, lat, callback) {
            let point = this.$refs['cesiumContainer'].XYZ2BLH({ x: lon, y: lat });
            callback(this.$refs['cesiumContainer'].isOutOfFarm(this.currentProjectId, point.x, point.y), point);
        },
        BLH2XYZ(option, callback){
            callback(this.$refs['cesiumContainer'].BLH2XYZ(option));
        },
        // 限制因素-湖泊
        onLakeRestrict (selected) {
            // console.log(selected);
            if(selected){

            util.ajax.get(`/gis_server/${this.currentProjectId}`).then(res => {
                if (res.data.code !== 200) return this.$message.error('获取gis限制区域url失败');
                this.hupoUrl = res.data.data.restriction_url;
                this.$refs['cesiumContainer'].createLakeRestrict(this.currentProjectId, res.data.data.restriction_url, selected);
            }).catch((/* err */) => {
                this.$message.error('获取gis限制区域url失败');
            });
            }
            else{
                this.$refs['cesiumContainer'].createLakeRestrict(this.currentProjectId, this.hupoUrl, selected);
            }
        },
        // 限制因素-道路
        onRoadRestrict (selected) {
            // console.log(selected);
            if(selected){

            util.ajax.get(`/gis_server/${this.currentProjectId}`).then(res => {
                if (res.data.code !== 200) return this.$message.error('获取gis限制区域url失败');
                this.daoluUrl = res.data.data.restriction_url;
                this.$refs['cesiumContainer'].createRoadRestrict(this.currentProjectId, res.data.data.restriction_url, selected);
            }).catch((/* err */) => {
                this.$message.error('获取gis限制区域url失败');
            });
            }
            else{
                this.$refs['cesiumContainer'].createRoadRestrict(this.currentProjectId, this.daoluUrl, selected);
            }
        },
        // 限制因素-房屋
        onHouseRestrict (selected) {
            // console.log(selected);
            if(selected){

            util.ajax.get(`/gis_server/${this.currentProjectId}`).then(res => {
                if (res.data.code !== 200) return this.$message.error('获取gis限制区域url失败');
                this.homeUrl = res.data.data.restriction_url;
                this.$refs['cesiumContainer'].createHouseRestrict(this.currentProjectId, res.data.data.restriction_url, selected);
            }).catch((/* err */) => {
                this.$message.error('获取gis限制区域url失败');
            });
            }
            else{
                this.$refs['cesiumContainer'].createHouseRestrict(this.currentProjectId, this.homeUrl , selected);
            }

        },
        //等高线事件
        onDenggaoxian(selected){
            // console.log(selected);
            if(selected){
                util.ajax.get(`/gis_server/${this.currentProjectId}`).then(res => {
                    // console.log(res.data.data);
                    if(res.data.code !== 200){
                        return this.$message.error('获取gis限制区域url失败');
                    }
                    if(res.data.data.contour_server_path){
                        let data = res.data.data.contour_server_path;
                        let denggaoObj = JSON.parse(data);
                        this.$store.commit('denggaoData', denggaoObj);
                    }else{
                        this.$message.error('获取等高线失败');
                    }

                });
            }else{
                this.$refs['cesiumContainer'].removeContourSevices();

            }
        },
        // 限制因素-噪音
        onZaoyinRestrict (selected) {
            if (selected) {
                // this.$store.commit('globeLoading', {loading: true, text: '正在加载噪音图层...'});
                // this.$refs['cesiumContainer'].loadCSVNoise(this.currentProjectId, this.currentPlanId)
                //     .then((result) => {
                //         this.$store.commit('globeLoading', {loading: false, text: ''});
                //     })
                //     .catch((result) => {
                //         this.$message.error('加载噪音图层失败。');
                //         this.$store.commit('globeLoading', {loading: false, text: ''});
                //     });
                this.$refs['cesiumContainer'].removeCSVNoise();
                util.ajax.get(`/noise/limit/${this.currentProjectId}/${this.currentPlanId}`).then(res => {
                    if (res.data.code !== 200) return;
                    // this.$message.error('加载噪音图层失败。');
                    this.$refs['cesiumContainer'].loadCSVNoiseWithExtent(this.currentProjectId, this.currentPlanId, res.data.data.bound);
                }).catch((/* err */) => {
                    // this.$message.error('加载噪音图层失败。');
                });
            } else {

                this.$refs['cesiumContainer'].removeCSVNoise();
            }
        },
        // 限制因素-红线区
        onRedLineRestrict (selected) {
            this.$refs['cesiumContainer'].createRedLineArea(this.currentProjectId, selected);
        },
        // 风图谱工具条的显示和关闭
        onSectionVisible (projectId, selected) {
            // 关闭所有的风图谱图像
            if (!selected) {
                // 尾流
                // this.$refs['cesiumContainer'].createWake(projectId, selected);
                this.$refs['cesiumContainer'].createSteamLine(projectId, this.currentSectionId, this.currentPlanId, selected);
                // 风图谱
                this.$refs['cesiumContainer'].createWindMap(projectId, this.currentSectionId, this.xcentre, this.ycentre, selected);
                // 风能切片
                this.$refs['cesiumContainer'].createWindSplit(projectId, this.currentSectionId, this.xcentre, this.ycentre, 'x', 0, selected);
                // 大湍流区
                this.$refs['cesiumContainer'].createTurbulenceArea(projectId, this.currentSectionId, this.xcentre, this.ycentre, selected);
                // 机组震动
                this.$refs['cesiumContainer'].createShakeArea(projectId, this.currentSectionId, this.xcentre, this.ycentre, selected);
                console.log(this.$refs['functionBar'].$refs['legendButton'].one);
                if (!this.$refs['functionBar'].$refs['legendButton'].one) this.$refs['functionBar'].$refs['legendButton'].setStatus('itemOne', selected);
                this.$refs['functionBar'].$refs['legendButton'].setStatus('itemTwo', selected);
                this.$refs['functionBar'].$refs['legendButton'].setStatus('itemThree', selected);
            }
        },
        onDataChange2 (funId, data, projectId , url) {
            // console.log(funId, data, projectId);
            //等高线滑动条选择。开三维
            if(url){
                this.$refs['cesiumContainer'].addContourServices(url , data);
            }
        },
        // 滑动条变化（综合风图谱，扇区）
        onDataChange (funId, data, projectId , url) {
            // console.log(funId, data, projectId);
            if (funId === 1) {
                // 综合风图谱
                this.turbineHeight = data;
                this.$refs['cesiumContainer'].createIntegrateWindMap(projectId, this.xcentre, this.ycentre, data, true).then(data => {
                    this.$refs['functionBar'].$refs['legendButton'].setStatus('itemOne', true, data);
                    this.$refs['functionBar'].$refs['legendButton'].setSubStatus('one', true);
                })
                    .catch(err => console.error(err));
            } else {
                // 扇区
                this.currentSectionId = data.toFixed(1);
                this.$refs['functionBar'].setSection(this.currentSectionId);
            }
        },
        // 滑动条变化（风能切片）
        onDiarefChange (projectId, sectionId, dir, value) {
            this.$refs['cesiumContainer'].createWindSplit(projectId, sectionId, this.xcentre, this.ycentre, dir, value, true).then(data => {
                console.log(data);
                this.$refs['functionBar'].$refs['legendButton'].setStatus('itemOne', true, data);
                this.$refs['functionBar'].$refs['legendButton'].setSubStatus('three', true);
            });
        },
        // 显隐切换(综合风图谱)
        onIntegrateWindMap (projectId, selected, callback) {
            // 如果是在手动优化激活的时候再去触发左侧按键，则关闭时改回原来的状态
            if (!selected && this.distributeActived === true) {
                this.$refs['fanDetailDialog'].close();
                // this.$refs['cesiumContainer'].startEdit(true);
            }
            if (selected) {
                // console.log("11111111111111111111111");
                //点击综合风图谱后，调用风谱图接口
                this.$refs['functionBar'].$refs['fun1'].getwrgHeights();
                // this.getwrgHeights();
                // 关闭普通风图谱
                this.$refs['cesiumContainer'].createWindMap(projectId, this.currentSectionId, this.xcentre, this.ycentre, false);
                this.$refs['functionBar'].$refs['legendButton'].setSubStatus('two', false);
                // 操作综合风图谱
                this.$refs['cesiumContainer'].createIntegrateWindMap(projectId, this.xcentre, this.ycentre, this.turbineHeight, selected)
                    .then(data => {
                        this.$refs['functionBar'].$refs['legendButton'].setStatus('itemOne', selected, data);
                        this.$refs['functionBar'].$refs['legendButton'].setSubStatus('one', selected);
                    })
                    .catch(err => console.error(err));
            } else {
                this.$refs['cesiumContainer'].createIntegrateWindMap(projectId, this.xcentre, this.ycentre, this.turbineHeight, selected);
                this.$refs['functionBar'].$refs['legendButton'].setStatus('itemOne', selected);
                this.$refs['functionBar'].$refs['legendButton'].setSubStatus('one', selected);
            }
        },
        // 显隐切换(限制因素)
        onRestrict (projectId, selected) {
            console.log('限制因素-显隐切换：'+selected);
            if(!this.enManager){
                if (this.distributeActived && selected) {
                    this.planListShowing = false;
                    this.switchModeBtnVisible = false;
                }
                if (selected) this.distributeActived = false;
                this.$refs['cesiumContainer'].createRestrict(projectId, selected);
                if (!selected) {
                    this.onLakeRestrict(false); //湖泊
                    this.onRoadRestrict(false); //道路
                    this.onHouseRestrict(false); //房屋
                    this.onZaoyinRestrict(false);  //噪音
                    this.onRedLineRestrict(false); //红线区

                    this.onDenggaoxian(false); //等高线
                }
            }
            //游客
            else{
                if (this.distributeActived && selected) {
                    this.planListShowing = false;
                    this.switchModeBtnVisible = false;
                }
                if (selected) this.distributeActived = false;
                this.$refs['cesiumContainer'].createRestrict(projectId, selected);
                if (!selected) {
                    this.onLakeRestrict(false); //湖泊
                    this.onRoadRestrict(false); //道路
                    this.onHouseRestrict(false); //房屋
                }
            }
        },
        // getwrgHeights(){
        //     // 新---接口风图谱高度
        //     let project_id = this.$store.state.app.projectInfo.project_id;
        //     let scheme_id = this.$store.state.app.planId || 1;
        //     util.ajax.get('/change_wrg_height/'+project_id+'/'+scheme_id, {}).then(res => {
        //         if ( res.data.code !== 200) {
        //             this.$message.error(res.data.message);
        //             return;
        //         }
        //         // this.wrgHeights = res.data.data;
        //         this.wrgHeights = res.data.data.map((item) => {
        //             return parseInt(item);
        //         });
        //         // console.log(this.wrgHeights,"1111");
        //         console.log("项目:"
        //         +this.$store.state.app.projectInfo.project_id
        //         +"方案："
        //         +this.$store.state.app.planId+"风谱图高度有："+
        //         res.data.data);
                

        //     }).catch((/* err */) => {
        //         this.$message.error('取得风图谱高度失败！');
        //     });
            
        // },
        // 显隐切换(风图谱,尾流,风能切片,大湍流区,机组震动 )
        onSectionChange (funId, projectId, planId, selected) {
            if (funId === 11) { // 风图谱
                this.windMap = selected;
                if (selected) {
                    this.$refs['cesiumContainer'].createIntegrateWindMap(projectId, this.xcentre, this.ycentre, this.turbineHeight, false);
                    this.$refs['functionBar'].$refs['legendButton'].setSubStatus('one', false);
                    this.$refs['cesiumContainer'].createWindMap(projectId, this.currentSectionId, this.xcentre, this.ycentre, selected)
                        .then(data => {
                            this.$refs['functionBar'].$refs['legendButton'].setStatus('itemOne', selected, data);
                            this.$refs['functionBar'].$refs['legendButton'].setSubStatus('two', selected);
                        })
                        .catch(err => console.error(err));
                } else {
                    this.$refs['cesiumContainer'].createWindMap(projectId, this.currentSectionId, this.xcentre, this.ycentre, false);
                    if (!this.windSplit) this.$refs['functionBar'].$refs['legendButton'].setStatus('itemOne', selected);
                    this.$refs['functionBar'].$refs['legendButton'].setSubStatus('two', selected);
                }
            }
            if (funId === 12) { // 尾流
                // this.$refs['cesiumContainer'].createWake(projectId, selected);
                this.$refs['cesiumContainer'].createSteamLine(projectId, this.currentSectionId, this.currentPlanId, selected);
            }
            if (funId === 13) { // 风能切片
                this.windSplit = selected;
                if (selected) {
                    this.$refs['cesiumContainer'].createWindSplit(projectId, this.currentSectionId, this.xcentre, this.ycentre, 'x', 0, selected)
                        .then(data => {
                            this.$refs['functionBar'].$refs['legendButton'].setStatus('itemOne', selected, data);
                            this.$refs['functionBar'].$refs['legendButton'].setSubStatus('three', selected);
                        });
                } else {
                    this.$refs['cesiumContainer'].createWindSplit(projectId, this.currentSectionId, this.xcentre, this.ycentre, 'x', 0, selected);
                    if (!this.windMap) this.$refs['functionBar'].$refs['legendButton'].setStatus('itemOne', selected);
                    this.$refs['functionBar'].$refs['legendButton'].setSubStatus('three', selected);
                }
            }
            if (funId === 14) { // 大湍流区
                if (selected) {
                    this.$refs['cesiumContainer'].createTurbulenceArea(projectId, this.currentSectionId, this.xcentre, this.ycentre, selected)
                        .then(data => {
                            this.$refs['functionBar'].$refs['legendButton'].setStatus('itemTwo', selected, data);
                        });
                } else {
                    this.$refs['cesiumContainer'].createTurbulenceArea(projectId, this.currentSectionId, this.xcentre, this.ycentre, selected);
                    this.$refs['functionBar'].$refs['legendButton'].setStatus('itemTwo', selected);
                }
            }
            if (funId === 15) { // 机组震动
                if (selected) {
                    this.$refs['cesiumContainer'].createShakeArea(projectId, this.currentSectionId, this.xcentre, this.ycentre, selected)
                        .then(data => {
                            this.$refs['functionBar'].$refs['legendButton'].setStatus('itemThree', selected, data);
                        });
                } else {
                    this.$refs['cesiumContainer'].createShakeArea(projectId, this.currentSectionId, this.xcentre, this.ycentre, selected);
                    this.$refs['functionBar'].$refs['legendButton'].setStatus('itemThree', selected);
                }
            }
        },
        onShowAddFan (lan, lat) {
            if (this.canAddFan) {
                // this.canAddFan = false;
                let point = this.$refs['cesiumContainer'].BLH2XYZ({ x: lan, y: lat });
                this.$refs['fanAddDialog'].open(null, lan, lat, point, this.currentProjectId, this.turbineHeight, this.currentPlanMode);
            }
        },
        onTempDistributeBar () {
            this.distributeActived = true;
        },
        // 手动优化点击回调
        onDistributeBarSelected (funId, projectId, planId, selected) {
            // 隐藏方案列表
            this.planListShowing = selected;
            this.distributeActived = selected;
            // 关闭升压站手动优化状态
            this.stopEditStation();
            this.$store.commit('projectId', projectId);
            this.$store.commit('planId', planId);
            this.$refs['cesiumContainer'].getInsideRoad(projectId, planId, false);
            this.$refs['cesiumContainer'].getStation(projectId, planId, false);
            this.$refs['cesiumContainer'].getCollectLine(projectId, planId, false);
            this.$refs['cesiumContainer'].dxfCollectLine(projectId, planId, false);
            this.closeDetailsPanel();
            this.stationShowing = false;
            this.lineShowing = false;
            this.canAddFan = false;
            this.switchModeBtnVisible = selected;
            this.restTip();
            this.$refs['fanDetailDialog'].close();
            this.$refs['cesiumContainer'].startEdit(false);

            if (funId === 21) {
                // 方案优化 选中 和限制互斥
                this.onRestrict(projectId, false);
            }
        },
        editModeChange (editMode) {
            this.closeAllDetalis();
            this.$refs['cesiumContainer'].startEdit(editMode);
            if (!editMode) {
                this.canAddFan = false;
            }
        },
        delTurbines (turbineIds) {
            if (!turbineIds) return;
            let that = this;
            turbineIds.forEach(turbineId => {
                //删除风机  删除等效小时数
                that.$refs['cesiumContainer'].removeCustomLabelById(turbineId);
                let currentFans = that.$store.state.scheme.currentFans;
                let delFans = currentFans.filter((item,index)=>{
                    return item.turbine_id == turbineId
                })
                if(delFans[0].equivalent_hours){
                    let num = "-"+ parseInt(delFans[0].equivalent_hours)
                    that.$store.commit("changeHours", num);
                }
                //

                this.$refs['cesiumContainer'].deleteFan(turbineId);
            });
        },
        onSetFalseDistributeBar () {
            // 隐藏方案列表
            this.planListShowing = false;
            this.distributeActived = false;
            this.canAddFan = false;
            this.switchModeBtnVisible = false;
            this.$refs['fanDetailDialog'].close();
            this.$refs['cesiumContainer'].startEdit(false);
        },
        // 手动优化激活
        onDistributeActived () {
            this.onFanDetailHasShow(false);
            this.$refs['cesiumContainer'].startEdit(false);
            this.onFanDetailHasShow(false);
            this.canAddFan = false;
            this.distributeActived = false;
            this.switchModeBtnVisible = false;
        },
        // 手动优化-添加风机-相关回调
        onCloseFanAdd (type,val) {
            console.log(type,val)
            if (type === 'coordinate') {
                // this.$refs['functionBar'].$refs['fun21'].$refs['distributeBar'].$refs['coordinateAdd'].selected = true;
                // this.$refs['functionBar'].$refs['fun21'].$refs['distributeBar'].$refs['coordinateAdd'].onClick();
                this.$refs['windGauge'].$refs['distributeBar'].$refs['coordinateAdd'].selected = true;
                this.$refs['windGauge'].$refs['distributeBar'].$refs['coordinateAdd'].onClick();
                // this.onDistribute('coordinateAdd', false);
            }
            if (type === 'add') {
                // this.$refs['functionBar'].$refs['fun21'].$refs['distributeBar'].$refs['btnAdd'].selected = true;
                // this.$refs['functionBar'].$refs['fun21'].$refs['distributeBar'].$refs['btnAdd'].onClick();
                this.$refs['windGauge'].$refs['distributeBar'].$refs['btnAdd'].selected = true;
                this.$refs['windGauge'].$refs['distributeBar'].$refs['btnAdd'].onClick();
                this.onDistribute('add', false);
            }
        },
        // 手动排布优化-相关回调
        onDistribute (type, selected, callBack) {
            switch (type) {
                case 'close':
                    this.$refs['functionBar'].$refs['fun21'].setUnselected();
                    break;
                // 显示风参表
                case 'showWindGauge':
                    if (this.canAddFan) {
                        this.onCloseFanAdd('add');
                    }
                    break;
                // 点选地面新增
                case 'add':
                    console.log('点选地面新增');
                    //鼠标变加号
                    this.canAddFan = selected;

                    break;
                // 按坐标新增
                case 'coordinateAdd':
                    if (this.canAddFan) {
                        this.onCloseFanAdd('add');
                    }
                    this.$refs['fanAddCoordinateDialog'].open(this.currentProjectId, this.currentPlanId, this.turbineHeight, this.inputCfd);
                    break;
                // 调整价格
                case 'price':
                    if (this.canAddFan) {
                        this.onCloseFanAdd('add');
                    }
                    this.$refs['fanPriceDialog'].open(this.currentProjectId, this.currentPlanId);
                    break;
                // 操作回滚
                case 'rollback':
                    if (this.canAddFan) {
                        this.onCloseFanAdd('add');
                    }
                    this.$confirm('回滚后无法返回，确认回到初始状态？', '回滚', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        customClass: 'road-detail-quit-message'
                    })
                        .then(() => {

                            this.$store.commit('rollback');
                            // 初期化风机
                            this.$refs['cesiumContainer'].initFanPositions(this.fans ,true);
                            // setTimeout(()=>{
                                // 写到里面初始化风机后面
                            //     //风机图标要关掉
                            //     this.$refs['cesiumContainer'].startEdit(true);
                            // },1000)

                            setTimeout(()=>{
                                //回滚 还原 手动优化初始状态
                                this.$refs['cesiumContainer'].showOrHideFanNameLabel2(false);
                                //回滚还原 等效小时数
                                //清空 等效小时数
                                this.$refs['cesiumContainer'].removeAllCustomLabels(true);
                                let originFans = this.$store.state.scheme.yancurrentFans;
                                let that = this;
    
                                originFans.forEach((item, index)=>{
                                    that.$refs['cesiumContainer'].addCustomLabel(item.turbine_id, JSON.stringify(item.equivalent_hours), {
                                        isBold:false,
                                        width: 75,
                                        height:24,
                                        color:'rgba(0, 183, 172, 1)',
                                        font:11
                                    })
                                })
                            },500)
                            
                        })
                        .catch(action => { });
                    break;
                // 不保存，退出
                case 'cancelled':
                    //清空 等效小时数
                    this.$refs['cesiumContainer'].removeAllCustomLabels();

                    this.$store.commit('rollback');
                    this.$refs['cesiumContainer'].initFanPositions(this.fans);
                    break;
                // 重新计算
                case 'calculate':
                    if (this.canAddFan) {
                        this.onCloseFanAdd('add');
                    }
                    // this.$confirm('重新计算将覆盖现有方案成果，无法回退，确认发起重新计算？', '重新计算', {
                    //     confirmButtonText: '确定',
                    //     cancelButtonText: '取消',
                    //     customClass: 'road-detail-quit-message'
                    // })
                    //     .then(() => {
                            this.doSaveFans(this.currentProjectId, this.currentPlanId, callBack);
                            this.$message.success('正在保存数据...');
                            // 修改修改计划，点击项目列表问题
                            // this.$refs['functionBar'].isPlanModified = true;
                        // })
                        // .catch(action => { });
                        setTimeout(()=>{
                            //再掉一次方案总览接口
                            this.getMastProject();
                        },1500)

                    break;
            }
        },
        //获取方案总览数据
        getMastProject(){

            util.ajax.get('/scheme_total/'+this.$store.state.app.projectId+"/"+this.$store.state.app.planId)
            .then((res)=>{
                if(res.data.code == 200){
                    // console.log(res);
                    this.$store.commit('planMastProjectData', res.data.data);
                    
                }
    
            }).catch((err)=>{
                console.error(err);
            })
        },
        // 关闭详情面板
        closeDetailsPanel () {
            if(this.enManager){
                this.$nextTick(() => {
                    this.$refs['fanOptimizeYouke'].closeShowBox();
                    this.$refs['fanOptimizeYouke'].initArr2(false,false,false);
                    this.$refs['fanOptimizeYouke'].open(0, null, null, null, false);
                })
                this.roadBarSelected = false;
                this.lineShowing = false;
                this.stationShowing = false;
                return;
            }
            this.$refs['fanOptimize'].stationAndLine();
            this.$refs['fanOptimize'].initArr2(false,false,false);
            this.$refs['fanOptimize'].open(0, null, null, false);
            this.roadBarSelected = false;
            this.lineShowing = false;
            this.stationShowing = false;
        },
       
        // 查看报告点击回调
        onReportBarSelected (projectId, planId) {
            this.$store.commit('projectId', projectId);
            this.$store.commit('planId', planId);
            this.$refs['cesiumContainer'].getInsideRoad(projectId, planId, false);
            this.$refs['cesiumContainer'].getStation(projectId, planId, false);
            this.$refs['cesiumContainer'].getCollectLine(projectId, planId, false);
            this.$refs['cesiumContainer'].dxfCollectLine(projectId, planId, false);
            this.closeDetailsPanel();
            this.stationShowing = false;
            this.lineShowing = false;
            this.canAddFan = false;
        },
        doSaveFans (projectId, planId, callback) {
            this.$refs['functionBar'].setCalculating(true);// 这一步把手动优化和工程设计置灰
            this.$refs['cesiumContainer'].startEdit(false);
            this.distributeActived = false;
            // this.switchModeBtnVisible = false;
            this.wtTipVisible = false;
            // 保存风机优化信息(后继连续调用)。
            this.doAddFans(projectId, planId, 0, callback);
            // 测试
            // this.$refs['functionBar'].setCalculating(true);
            // this.distributeActived = false;
        },
        onFanAdded (fanData) {
            this.$refs['cesiumContainer'].addFan(fanData);
        },
        onChangeTurbineType (fanData, modifiedHeight, oldFan) {
            this.$refs['cesiumContainer'].changeTurbineType(fanData);
            
            if(!modifiedHeight) return;  //单个的时候最后改变高度才触发
            //单个
            //机型参数改变，修改 等效小时数
            let that = this;
            let data = {...fanData};
           
            that.getFastSpeedData(data.coordinate_x, data.coordinate_y, data.height, data.power_curve_filename, (callBack)=>{
                data.waked_speed = callBack.speed || "0";
                data.equivalent_hours = callBack.ehours_after_loss || "0";
                this.$store.commit('updataTurbine', data); //跟新currentFans
                this.$store.commit('changeTypeTurbine', data);

                this.onChangeFan(data.turbine_id, data, fanData, oldFan);
            })

        },
        onChangeFan(turbineID, data, olderData, oldFan, isTrue){
            let that = this;
            var changeFans = this.$store.state.scheme.changeTypeTurbine;
            var currentFans = this.$store.state.scheme.currentFans;
            var chHours , chSpeed , oldHours , oldSpeed ;
            var changeData = changeFans.filter((item,index)=>{
                return item.turbine_id == turbineID
            })
            var oldData = currentFans.filter((item,index)=>{
                return item.turbine_id == turbineID
            })
            let position = {}
            position.longitude = oldData[0].longitude;
            position.latitude = oldData[0].latitude;
            //首次改变
            if(changeData.length<=1){
                chHours = changeData[0].equivalent_hours;
                chSpeed = changeData[0].waked_speed;
                oldHours = oldFan.equivalent_hours;
                oldSpeed = oldFan.waked_speed;
            }
            //再次改变
            else{
                chHours = changeData[changeData.length-1].equivalent_hours;
                chSpeed = changeData[changeData.length-1].waked_speed;
                oldHours = changeData[changeData.length-2].equivalent_hours;
                oldSpeed = changeData[changeData.length-2].waked_speed;
            }
            let showHours = chHours - oldHours;
            let showSpeed = chSpeed - oldSpeed;
            let fu = "";
            let sp = "";
            showHours >= 0 ? fu = "+" : fu = "";
            showSpeed >= 0 ? sp = "+" : sp = "";

            let nowSpeed = "";
            nowSpeed = sp +showSpeed.toFixed(2)
            if(oldFan && oldFan.turbine_type == data.turbine_type){
                nowSpeed = 0;
            }
            if(isTrue){
                nowSpeed = 0;
            }

            that.$refs['cesiumContainer'].changeCustomLabel(data.turbine_id, [position.longitude, position.latitude], nowSpeed +"m/s/n"+ fu + parseInt(showHours), {
                isBold:false,
                width: 95,
                height:50,
                color:'rgba(228,161,0, 1)',
                font:11
            })
            this.$store.commit("changeHours", fu + parseInt(showHours));
            setTimeout(()=>{
                that.$refs['cesiumContainer'].changeCustomLabel(data.turbine_id, [position.longitude, position.latitude], chHours, {
                    isBold:false,
                    width: 75,
                    height:25,
                    color:'rgba(228,161,0, 1)',
                    font:11
                })
            },3500)
        },
       
        onShowChangeTurbineTypeDialog (fans) {
            if (!fans || fans.length === 0) return;
            if (fans.length === 1) {
                this.$refs['fanChangeDialog'].open(fans[0]);
            } else {
                this.$refs['fanChangeDialog'].open(fans[0], fans);
            }
        },
        onChangeTurbineListType (fanData, fans, oldcurrentFans) {
            if (!fans || fans.length === 0) return;
            //批量修改//机型参数改变，修改 等效小时数
            var arr = [];
            if(oldcurrentFans.length>0 && fans.length>0){
                for(var i = 0; i < oldcurrentFans.length; i++) {
                    for(var j = i + 1; j < fans.length; j++){
                        if ((fans[j].turbine_type == oldcurrentFans[i].turbine_type)){
                            arr.push(fans[j].turbine_id);
                            i++;
                            j = i;
                        }
                        
                    }
                }  
            }
            let that = this;
            // console.log(arr)
            //
            this.waitingTwoMinute = true;
            var project_id = this.$store.state.app.projectInfo.project_id
            var arrX = []; var arrY = []; var arrH = []; var arrName = []; var arrTurbine = [];
            var oldArr = [];
            fans.map((fan,index) => {
                oldArr.push({...fan});
                fan.turbine_type = fanData.turbine_type;
                fan.height = fanData.height;
                fan.power_curve_filename = fanData.power_curve_filename;
                that.$refs['cesiumContainer'].changeTurbineType(fan);
                //批量修改//机型参数改变，修改 等效小时数
                arrX.push(fan.coordinate_x);
                arrY.push(fan.coordinate_y);
                arrH.push(fan.height);
                arrName.push(fan.power_curve_filename);
                arrTurbine.push(fan.turbine_id);
            });
            this.getFastSpeedDataList(arrX, arrY, arrH, arrName, project_id, arrTurbine, (callBack)=>{
                // console.log(callBack)
                if(callBack.length>0){
                    this.waitingTwoMinute = false;
                    for(var i = 0; i < fans.length; i++) {
                        for(var j = 0; j < callBack.length; j++){
                            if ((callBack[j].label == fans[i].turbine_id)){
                                // console.log(fans[i])
                                fans[i].waked_speed = callBack[j].speed || "0";
                                fans[i].equivalent_hours = callBack[j].ehours || "0";
                               
                            }
                        }
                    }  
                    for(var i = 0; i < oldArr.length; i++){
                        for(var j = 0; j < fans.length; j++) {
                            if ((fans[j].turbine_id == oldArr[i].turbine_id)){
                                this.$store.commit('updataTurbine', fans[j]); //跟新currentFans
                                this.$store.commit('changeTypeTurbine', fans[j]);
                                this.onChangeFan(fans[j].turbine_id, fans[j], oldArr[i], oldArr[i]);
                                
                            }
                       }
                    }  
                }
            })
           
        },
        onPlay (type, funId) {
            if (type === 'play') {
                this.$refs['cesiumContainer'].startFly();
            } else if (type === 'pause') {
                this.$refs['cesiumContainer'].stopFly();
            } else if (type === 'stop') {
                this.$refs['cesiumContainer'].resetFly();
            }
            // else if (type === 'import') {
            // }
        },
        onWindTowerChange (isActive) {
            this.$store.commit('clickMastInfo', {'bool': false});
            this.$refs['cesiumContainer'].hideMasts(isActive);
            if (!isActive) {
                this.$refs['cesiumContainer'].zoomToExtent([this.projectInfo.xmin, this.projectInfo.ymin, this.projectInfo.xmax, this.projectInfo.ymax]);
            }
        },
        // 点击风机后的回调函数
        onFanClick (type, fanId, fanInfo, selected, clientX, clientY) {
            // this.$message.info(type);
            // console.log(type, fanId, fanInfo, selected, clientX, clientY);
            let that = this;
            switch (type) {
                case 'move':
                    this.$refs['cesiumContainer'].startMove(selected);
                    // this.$refs['functionBar'].setUnSelectAdd(false);
                    this.$refs['windGauge'].$refs['distributeBar'].setUnSelectAdd(false);
                    this.canAddFan = false;
                    break;
                case 'remove':
                    this.$alert('您确定要删除此台风机?', '删除', {
                        confirmButtonText: '确定',
                        center: true,
                        callback: action => {
                            if (action === 'confirm') {
                                
                                //删除单个 等效小时数
                                that.$refs['cesiumContainer'].removeCustomLabelById(fanId);
                                var currentFans = that.$store.state.scheme.currentFans;
                                var delFans = currentFans.filter((item,index)=>{
                                    return item.turbine_id == fanId
                                })
                                if(delFans[0].equivalent_hours){
                                    let num = "-"+ parseInt(delFans[0].equivalent_hours)
                                    that.$store.commit("changeHours", num);
                                }
                                //

                                that.$refs['cesiumContainer'].deleteFan(fanId);
                            }
                        }
                    });
                    break;
                case 'fan':
                    console.log('there');
                    this.$refs['fanChangeDialog'].open(fanInfo);
                    break;
                case 'electric':
                    util.ajax.get('/scheme/' + this.currentProjectId + '/' + this.currentPlanId, {}).then(res => {
                        if (res.data.code !== 200) {
                            console.log('获取方案数据失败:' + JSON.stringify(res.data));
                            // this.$message.error('获取方案数据失败！');
                            return;
                        }
                        if (res.data.data.status_id === 1) {
                            this.currentPlanStatus = true;
                        } else {
                            this.currentPlanStatus = false;
                            if (!this.evaluationCalculating && !this.displayRoadDetail && !this.displayLineReCalculating && !this.displayReCalculating && !this.displayPowerDetail && !this.stationButtonsShow) {
                                this.$refs['fanDetailDialog'].open(fanId, fanInfo, clientX, clientY);
                            }
                        }
                    }).catch((err) => {
                        console.log('获取方案数据失败:' + err.message);
                        // this.$message.error('获取方案数据失败！');
                    });
                    // if (this.displayReCalculating) this.$refs['roadReCalculating'].fanClick(fanId, fanInfo, clientX, clientY);
                    // if (this.displayLineReCalculating) this.$refs['roadLineReCalculating'].fanClick(fanId, fanInfo, clientX, clientY);
                    break;
            }
        },
        onPlanCopyCompleted () {
            this.$refs['planList'].loadPlanData(true);
        },
        // 风参表显示
        windGaugeShow (productId, planId) {
            this.distributeActived = true;
            this.switchModeBtnVisible = true;
            this.menuVisible = false;
            this.$refs['functionBar'].close();
            this.displayWindGauge = true;
            this.$nextTick(() => {
                this.$refs['windGauge'].loadTable();
            });

            this.$refs['cesiumContainer'].disStatusBar(false);
        },
        // 风参表关闭
        windGaugeClose () {
            this.displayWindGauge = false;
            this.distributeActived = false;
            // BUG：当关闭风参表的时候，不能打开右则的卡片,2018/12/21 阿汤哥
            // this.switchModeBtnVisible = false;
            // this.wtTipVisible = false;
            this.menuVisible = true;
            this.switchModeBtnVisible = false;
            this.$refs['functionBar'].show1();
            this.$refs['cesiumContainer'].disStatusBar(true);
        },
        ondblclickAll(event){
            // console.log(111);
            // this.opendian  除了点是单机取消选择，其他双击取消
            let draw = document.getElementById('draw-timing');
            let celiang = document.getElementById('celiang');
            if(draw && !this.opendian){
                if (!draw.contains(event.target)) {
                    this.$refs['drawTiming'].defaultInfo();
                }
            }
            if(celiang && !this.celiangOpen){
                if (!celiang.contains(event.target)) {
                    this.celiangOpen = true;
                    this.celiangOpenIndex = 0;
                    //清空选中
                    this.$refs['mainMenu'].defaultInfoActive();
                }
            }
        },
        onClickAll (event) {
            let gj = document.getElementById('gongju');
            let celiang = document.getElementById('celiang');
            let draw = document.getElementById('draw-timing');
            let xm = document.getElementById('xiangmu');
            let sp = document.getElementById('person');
            let clickFan = document.getElementById('fanDetail');
            
            if(draw && this.opendian){
                if (!draw.contains(event.target)) {
                    this.$refs['drawTiming'].defaultInfo();
                }
            }
            if(celiang && this.celiangOpen){
                if (!celiang.contains(event.target)) {
                    this.celiangOpenIndex++;
                    if(this.celiangOpenIndex>=2){
                        this.celiangOpenIndex = 0;
                        this.celiangOpen = false;
                        //清空选中
                        this.$refs['mainMenu'].defaultInfoActive();
                    }
                }
            }
            if (sp) {
                if (!sp.contains(event.target)) {
                    this.$refs['mainMenu'].hide();
                }
                if(!gj.contains(event.target)){
                    this.$refs['mainMenu'].gongjuActive = false;
                }
                if(!xm.contains(event.target)){
                    this.$refs['mainMenu'].xiangmuActive = false;
                }
            }
            if (clickFan) {
                if (this.fanDetailShow) {
                    if (!clickFan.contains(event.target)) {
                        // alert("123");
                        this.$refs['fanDetailDialog'].close();
                        this.$refs['cesiumContainer'].startEdit(false);
                        // this.fanDetailShow = false;
                    }
                }
            }
        },
        //自定义移入移出事件
        iconSwitchChange(type , isTrue){
            switch (type) {
                case 'duibi':
                    this.iconDuibiActive = isTrue;
                break;
                case 'zongjie':
                    this.iconZongjieActive = isTrue;
                break;
            }
        },
        onSwitchModeStatus (status) { // GOLDFARM 与 WT模式转换
            console.log(status,"status")
            this.distributeActived = !status;
            this.planListShowing = !status;
            this.wtTipVisible = false;
            this.currentPlanMode = status;
            this.$refs['planList'].changeMode(status);
            this.$refs['planContrastList'].changeMode(status);
            this.$refs['cesiumContainer'].setSchemeMode(status);
            // todo:禁用wt后置模式
            // if (!status) {
            //     if (this.$refs['planList'].getWTPlans().length === 0) {
            //         this.wtTipVisible = true;
            //         this.$refs['wtFileUpload'].wfFileUploadOpen(this.currentProjectId);
            //     }
            // } else {
            //     this.$refs['wtFileUpload'].wfFileUploadClose();
            // }
        },
        onWfFileUploadClose () {
            this.distributeActived = false;
            this.wtTipVisible = false;
            this.$refs['switchModeBtn'].goldFarm();
        },
        // fanDetailHasShow () {
        //     this.fanDetailShow = true;
        // }
        // 监听关闭风机详情
        onCloseFanDetails () {
            this.$refs['fanDetailDialog'].close();
        },
        // 风机详情监听
        onFanDetailHasShow (status) {
            console.log(`风机详情${status}`);
            this.fanDetailShow = status;
            this.$refs['cesiumContainer'].startEdit(false);
        },
        // 监听风机角度改变
        onChangeFanRotaAngle (angle) {
            this.$refs['cesiumContainer'].changeFanRotaAngle(angle);
        },
        // 打开 道路 线路 升压站 简介
        onFanOptimize (optimizeType, data, onlyPoints) {
            this.$refs['fanOptimize'].open(optimizeType, data, onlyPoints); 
        },
         //游客模式--工程设计获取接口
         getDetailHttp(num){
            util.ajax.get("/reveal_engineering_param/" + this.$store.state.app.projectInfo.project_id )
            .then(res=>{
                console.log(res ,"获取接口")
                if(res.data.code == 200){
                    if(num == 1){
                        this.getroad =  {
                            roadLength : res.data.data.road_length_total,
                            roadWidth : res.data.data.road_width,
                            fillAmount : res.data.data.road_total_fill_amount,
                            digAmount : res.data.data.road_total_excavation,
                            branchNum : res.data.data.road_number
                        }
                        
                        this.daoluRes = this.getroad;
                        this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null, true);
                        
                    }
                    if(num == 2){
                        this.getstation = {
                            stationArea : res.data.data.station_floor_area,
                            baseHeight : res.data.data.station_base_elevation,
                            fillAmount : res.data.data.station_fill_amount,
                            digAmount : res.data.data.station_excavation
                        }
                       
                        this.shengyaRes = this.getstation;
                        this.$refs['fanOptimizeYouke'].open(2, this.shengyaRes, null, null, true);
                        
                    }
                    if(num == 3){
                        this.getline = {
                            level: res.data.data.line_voltage_level,
                            lineLength: res.data.data.line_length_total,
                            angleNum: res.data.data.line_corner_towers_number,
                            lineMun: res.data.data.line_straight_towers_number
                        }
                        
                        this.xianluRes = this.getline;
                        this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null, true);
                        
                    }
                }else{
                   
                }
            }).catch((err) => {
                // this.$message.error("获取工程设计数据失败");
            });
        },
        //////-------
        // 场内道路点击回调
        onRoadBarSelected (projectId, planId, selected) {
            //游客模式 
            if(this.enManager){
                this.$refs['fanOptimizeYouke'].stationDetailShowing = false;
            }
            //非游客模式
            else{
                // 关闭升压站详情
                this.$refs['fanOptimize'].stationDetailShowing = false;
            }
            // 关闭升压站手动优化状态
            this.stopEditStation();
            // 隐藏方案列表
            this.planListShowing = selected;
            this.switchModeBtnVisible = selected;
            this.roadBarSelected = selected;
            // this.stationShowing = false;
            // this.lineShowing = false;
           
            // 禁用升压站-集电线路-道路联合显示
            // this.closeDetailsPanel();
            //工程设计选中和限制互斥
            if(selected){
                this.onRestrict(projectId, false);
                this.onIntegrateWindMap(projectId, false);
            }

            //游客模式  选中道路的时候
            if(this.enManager){
                if (selected) {
                    //没数据显示头部open(,,,,false) 只显示头
                    this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null, false);
                    this.$refs['fanOptimizeYouke'].activeDaoluTou();
                    this.getDetailHttp(1);
                    if(this.stationAndlineAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,true,true);
                    }
                    else if (this.stationAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,true,false);
                    }
                    else if (this.lineAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,false,true);
                    }else{
                        this.$refs['fanOptimizeYouke'].initArr2(true,false,false);
                    }
                    
                    let data = this.$refs['cesiumContainer'].getInsideRoad(projectId, planId, selected);
                    data.then(res => {
                        console.log(res);
                        if( this.getroad.roadLength){
                            this.daoluRes = this.getroad;
                        }else{
                            this.daoluRes = res;
                        }
                        this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null, true);
                        this.$refs['fanOptimizeYouke'].activeDaolu();
                        if(this.stationAndlineAndRoad){
                            this.$refs['fanOptimizeYouke'].initArr2(true,true,true);
                        }
                        else if (this.stationAndRoad){
                            this.$refs['fanOptimizeYouke'].initArr2(true,true,false);
                        }
                        else if (this.lineAndRoad){
                            this.$refs['fanOptimizeYouke'].initArr2(true,false,true);
                        }else{
                            this.$refs['fanOptimizeYouke'].initArr2(true,false,false);
                        }
                       
                    }).catch(err => {
                        console.log('获取场内道路信息失败:' + err);
                        if (err.code === 404) {
                            // this.$message.error('S3上文件不存在。');
                        } else if (err.code === 403) {
                            // this.$message.error('S3上文件格式错误。');
                        } else {
                            // this.$message.error('获取场内道路信息失败');
                        }
                    });
                }
                else{
                    this.$refs['cesiumContainer'].getInsideRoad(projectId, planId, selected);
                    if(this.stationAndLine){
                        this.$refs['fanOptimizeYouke'].initArr2(false,true,true);
                        this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null, false);
                    }else{
                        if (this.stationShowing){
                            this.$refs['fanOptimizeYouke'].initArr2(false,true,false);
                            this.$refs['fanOptimizeYouke'].open(2, this.shengyaRes, null, null, false);
                        }
                        else if (this.lineShowing){
                            this.$refs['fanOptimizeYouke'].initArr2(false,false,true);
                            this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null, false);
                        }else{
                            this.$refs['fanOptimizeYouke'].initArr2(false,false,false);
                            this.$refs['fanOptimizeYouke'].open(0, null, null, null, false);
                        }
                    }
                }
                console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"道路");
                return;
            }
            
            //非游客模式
            if (selected) {
                let data = this.$refs['cesiumContainer'].getInsideRoad(projectId, planId, selected);
                data.then(res => {
                    console.log(res);
                    // this.$refs['fanOptimize'].open(1, res, null, true);

                            if (this.stationShowing || this.lineShowing) {
                                this.$refs['fanOptimize'].open(1, res, null, false);
                                this.$refs['fanOptimize'].activeDaolu();
                            } 
                            else {
                                this.$refs['fanOptimize'].open(1, res, null, true);
                            }
                }).catch(err => {
                    console.log('获取场内道路信息失败:' + err);
                    if (err.code === 404) {
                        // this.$message.error('S3上文件不存在。');
                    } else if (err.code === 403) {
                        this.$message.error('S3上文件格式错误。');
                    } else {
                        this.$message.error('获取场内道路信息失败');
                    }
                });
            } else {
                this.$refs['cesiumContainer'].getInsideRoad(projectId, planId, selected);
                //     // this.$refs['fanOptimize'].activeLine();
                if (this.stationAndLine) {
                    this.$refs['fanOptimize'].showStationAndLineBox();
                    this.$refs['fanOptimize'].initArr2(false,true,true);;
                    this.$refs['fanOptimize'].activeStation();
                }else{
                    if(this.stationShowing){
                        this.$refs['fanOptimize'].stationAndLine();
                        this.$refs['fanOptimize'].initArr2(false,true,false);
                        this.getStation(this.$store.state.app.projectId, this.$store.state.app.planId, true, (data) => {
                            if (data) {
                                data.then((res) => {

                                    this.$refs['fanOptimize'].open(2, res, null, true);
                                });
                            }
                        });
                    }
                    else if(this.lineShowing){
                        this.$refs['fanOptimize'].stationAndLine();
                        this.$refs['fanOptimize'].initArr2(false,false,true);
                        this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
                            if (data) {
                                data.then((res) => {
                                    this.haveTowerData = res.isTower; 
                                    this.$refs['fanOptimize'].open(3, res, null, true);
                                });
                            }
                        });
                    }
                    else{
                        this.$refs['fanOptimize'].stationAndLine();
                        this.$refs['fanOptimize'].initArr2(false,false,false);
                        this.$refs['fanOptimize'].open(0, null, null, false);
                    }
                }
               
                    // this.$refs['fanOptimize'].open(0, null, null, false);
                    
                
                
            }
            console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"道路");
            // console.log(this.$refs['fanOptimize'].newShowingArr,"道路");
            // this.$refs['cesiumContainer'].getInsideRoad(projectId, planId, false);
            // this.$refs['cesiumContainer'].getStation(projectId, planId, false);//升压站
            // this.$refs['cesiumContainer'].getCollectLine(projectId, planId, false);//集电线路
            // this.$refs['roadReCalculating'].setParams(projectId, planId);
        },
        // 场内道路-详情-打开
        onShowRoadDetail () {
            this.distributeActived = true;
            this.menuVisible = true;
            this.$refs['functionBar'].close();
            this.$refs['cesiumContainer'].disStatusBar(false);
            this.displayRoadDetail = true;
            // this.$refs['fanOptimize'].open(0, null, null, false);
            //游客模式
            if(this.enManager){
                this.$refs['fanOptimizeYouke'].initArr2(false,false,false);
                this.$refs['fanOptimizeYouke'].open(0, null, null,  null , false);
                this.$refs['fanOptimizeYouke'].hideStationDetail();
            }
            //非游客模式
            else{
                this.$refs['fanOptimize'].stationAndLine();
                this.$refs['fanOptimize'].open(0, null, null, true);
                this.$refs['fanOptimize'].hideStationDetail();
            }
            setTimeout(() => {
                this.$refs['roadDetail'].open(false, this.currentProjectId, this.currentPlanId);
            }, 2000);
            // 加载支线道路信息
            // this.$refs['roadDetail'].loadTable(productId);
        },
        // 场内道路-详情-关闭 
        roadDetailClose ( isClose=false ) {
            console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"道路优化关闭");
            //游客模式
            if(this.enManager){
                this.getDetailHttp(1);
                this.displayRoadDetail = false;
                //没数据也打开详情框
                if(this.stationAndlineAndRoad){
                    this.$refs['fanOptimizeYouke'].initArrAll();
                    this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null , false);     
                }else{
                    if(this.stationAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,true,false);
                        this.$refs['fanOptimizeYouke'].activeDaolu();
                        this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null , false); 
                    }else if(this.lineAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,false,true);
                        this.$refs['fanOptimizeYouke'].activeDaolu();
                        this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null , false); 
                    }else{
                        this.$refs['fanOptimizeYouke'].initArr2(true,false,false);
                        this.$refs['fanOptimizeYouke'].activeDaolu();
                        this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null , false);
                    }
                }
                // 再次打开道路gis显示
                let data = this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, true);
                data.then(res => {
                    if( this.getroad.roadLength != null){
                        this.daoluRes = this.getroad;
                    }else{
                        this.daoluRes = res;
                    }
                    if(this.stationAndlineAndRoad){
                        this.$refs['fanOptimizeYouke'].initArrAll();
                        this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null , true);     
                    }else{
                        if(this.stationAndRoad){
                            this.$refs['fanOptimizeYouke'].initArr2(true,true,false);
                            this.$refs['fanOptimizeYouke'].activeDaolu();
                            this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null , true); 
                        }else if(this.lineAndRoad){
                            this.$refs['fanOptimizeYouke'].initArr2(true,false,true);
                            this.$refs['fanOptimizeYouke'].activeDaolu();
                            this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null , true); 
                        }else{
                            this.$refs['fanOptimizeYouke'].initArr2(true,false,false);
                            this.$refs['fanOptimizeYouke'].activeDaolu();
                            this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null , true);
                        }
                    }
                });
                this.distributeActived = false;
                this.wtTipVisible = false;
                this.menuVisible = true;
                this.$refs['functionBar'].show1();
                this.$refs['functionBar'].$refs['fun26'].selected = true;
                this.$refs['cesiumContainer'].disStatusBar(true);
                return;
            }

            //非游客模式
            this.displayRoadDetail = false;
            // 再次打开道路gis显示
        if(!isClose){  //保存编辑后就不打开详情框--测试提de需求
            let data = this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, true);
            data.then(res => {
                // this.$refs['fanOptimize'].open(1, res, null, true);
                if(this.stationAndlineAndRoad){
                    this.$refs['fanOptimize'].initArrAll();
                    this.$refs['fanOptimize'].showStationAndLineBox();
                    this.$refs['fanOptimize'].open(1, res, null, false);     
                    this.$refs['functionBar'].$refs['fun26'].showSubMenu(false); 
                }else{
                    if(this.stationAndRoad){
                        this.$refs['fanOptimize'].showStationAndLineBox();
                        this.$refs['fanOptimize'].initArr2(true,true,false);
                        this.$refs['fanOptimize'].activeDaolu();
                        this.$refs['fanOptimize'].open(1, res, null, false); 
                        this.$refs['functionBar'].$refs['fun26'].showSubMenu(false);
                    }else if(this.lineAndRoad){
                        this.$refs['fanOptimize'].showStationAndLineBox();
                        this.$refs['fanOptimize'].initArr2(true,false,true);
                        this.$refs['fanOptimize'].activeDaolu();
                        this.$refs['fanOptimize'].open(1, res, null, false); 
                        this.$refs['functionBar'].$refs['fun26'].showSubMenu(false);
                    }else{
                        this.$refs['fanOptimize'].open(1, res, null, true);
                        this.$refs['functionBar'].$refs['fun26'].showSubMenu(true);
                    }
                }
            });
        }
            this.distributeActived = false;
            this.wtTipVisible = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            // this.$refs['functionBar'].$refs['fun26'].showSubMenu(true);
            this.$refs['functionBar'].$refs['fun26'].selected = true;
            this.$refs['cesiumContainer'].disStatusBar(true);
        },
        // 场内道路-详情-相关回调
        onRoadDetailsFunction (type, insideRoadEntityID, callback) {
            switch (type) {
                // 获取道路各分支信息
                case 'getInsideRoadsInfo':
                    callback(this.$refs['cesiumContainer'].getInsideRoadsInfo());
                    break;
                // 高亮显示指定道路编号的道路支线
                case 'locationSelectInsideRoad':
                    this.$refs['cesiumContainer'].locationSelectInsideRoad(insideRoadEntityID);
                    break;
                // 获取场内道路支线的剖面图（横断面图）数据
                case 'illustrationInsideRoad':
                    callback(this.$refs['cesiumContainer'].illustrationInsideRoad(insideRoadEntityID));
                    break;
            }
        },
        // 场内道路-详情-停止编辑
        onStopEditInsideRoad () {
            console.info('调用了停止道路编辑状态');
            this.$refs['cesiumContainer'].stopEditInsideRoad();
        },
        // 场内道路-手动优化-打开事件
        roadshoudongyouhuShow (productId) {
            this.distributeActived = true;
            this.menuVisible = true;
            this.$refs['functionBar'].close();
            this.$refs['cesiumContainer'].disStatusBar(false);
            this.$refs['cesiumContainer'].startEditInsideRoad();

            //存储右下详情框当前状态
            this.fanOptimizeYouhuaSelectedObj.alone = this.$refs['fanOptimize'].alone;
            this.fanOptimizeYouhuaSelectedObj.showStationAndLine = this.$refs['fanOptimize'].showStationAndLine;
            this.fanOptimizeYouhuaSelectedObj.optimizeType = this.$refs['fanOptimize'].optimizeType;

            // this.$refs['fanOptimize'].open(0, null, null, false);
            this.$refs['fanOptimize'].stationAndLine();
            this.$refs['fanOptimize'].open(0, null, null, true);
            this.$refs['fanOptimize'].hideStationDetail();
           
            this.displayRoadDetail = true;
            this.$nextTick(() => {
                this.$refs['roadDetail'].editToolBar();
                this.$refs['roadDetail'].open(false, this.currentProjectId, this.currentPlanId);
            });
            // this.roadshoudongyouhu = true;
            // this.$refs['shoudongyouhuLoad'].loadTable(productId);
        },
        // 场内道路-手动优化-关闭事件
        roadshoudongyouhuClose () {
            console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"关闭");
            this.displayRoadDetail = false;
            // 再次打开道路gis显示
            let data = this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, true);
            data.then(res => {      
                this.$refs['fanOptimize'].open(1, res, null, true); 
            });

            this.displayRoadDetail = false;
            this.distributeActived = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            this.$refs['cesiumContainer'].disStatusBar(true);
        },
        // 场内道路-手动优化-相关回调
        onRoadsFunction (type, insideRoadEntityID, callback) {
            switch (type) {
                // 获取道路各分支信息
                case 'getInsideRoadsInfo':
                    callback(this.$refs['cesiumContainer'].getInsideRoadsInfo());
                    break;
                // 高亮显示指定道路编号的道路支线
                case 'locationSelectInsideRoad':
                    this.$refs['cesiumContainer'].locationSelectInsideRoad(insideRoadEntityID);
                    break;
                // 获取场内道路支线的剖面图（横断面图）数据
                case 'illustrationInsideRoad':
                    callback(this.$refs['cesiumContainer'].illustrationInsideRoad(insideRoadEntityID));
                    break;
                // 开始手工编辑场内道路节点
                case 'startEditInsideRoad':
                    this.$refs['cesiumContainer'].startEditInsideRoad();
                    break;
                // 停止手工编辑场内道路节点
                case 'stopEditInsideRoad':
                    this.$refs['cesiumContainer'].stopEditInsideRoad();
                    break;
                // 开启删除道路支线
                case 'startDeleteRoadLine':
                    let deleteCallback = ({entity}) => {
                        if (!entity) return;
                        this.$confirm('确定删除所选道路?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$refs['cesiumContainer'].deleteRoadLineByEntity(entity);
                        }).catch(() => {
                        });
                    };
                    this.$refs['cesiumContainer'].startDeleteRoadLine({callBack: deleteCallback});
                    break;
                // 关闭删除道路支线
                case 'stopDeleteRoadLine':
                    this.$refs['cesiumContainer'].stopDeleteRoadLine();
                    break;
                // 开启打断道路支线
                case 'startSplitRoadLine':
                    this.$refs['cesiumContainer'].startSplitRoadLine();
                    break;
                // 关闭打断道路支线
                case 'stopSplitRoadLine':
                    this.$refs['cesiumContainer'].stopSplitRoadLine();
                    break;
                // 回滚编辑
                case 'rollBack':
                    callback(this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, true));
                    break;
                // 提交编辑后的场内道路
                case 'submitEditInsideRoad':
                    callback(this.$refs['cesiumContainer'].submitEditInsideRoad(), this.currentProjectId, this.currentPlanId);
                    break;
                // 刷新方案列表
                case 'loadPlanData':
                    this.waitingOneMinute = true;
                    this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, false);
                    this.evaluationCalculation((done) => {
                        this.waitingOneMinute = false;
                        this.$store.commit('editedRoad', false);
                        //计算完成不显示详情框，就注释下面

                        let data = this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, true);
                        data.then(res => {
                            this.waitingOneMinute = false;
                            this.$refs['cesiumContainer'].getInsideRoadsInfo();
                            // this.$refs['roadDetail'].getInsideRoadsInfo();
                            // this.$refs['cesiumContainer'].startEditInsideRoad();
                            this.$store.commit('editedRoad', false);
                        }).catch(err => {
                            this.waitingOneMinute = false;
                            console.log('获取场内道路信息失败:' + err);
                            if (err.code === 404) {
                                // this.$message.error('S3上文件不存在。');
                            } else if (err.code === 403) {
                                this.$message.error('S3上文件格式错误。');
                            } else {
                                // this.$message.error('获取场内道路信息失败');
                            }
                        });

                        // if (!done) return;
                        // 至此发起经评计算结束
                    });
                    break;
            }
        },
        // 场内道路-重新设计-打开
        roadReCalculatingShow () {
            // 用经评计算中的状态阻止点击风机弹出风机信息
            // this.evaluationCalculating = true;
            this.$store.commit('projectId', this.currentProjectId);
            this.$store.commit('planId', this.currentPlanId);
            // 关闭道路gis显示
            this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, false);
            // this.$refs['fanOptimize'].open(0, null, null, false);
            this.$refs['fanOptimize'].stationAndLine();
            this.$refs['fanOptimize'].open(0, null, null, true);
            this.$refs['fanOptimize'].hideStationDetail();

            this.distributeActived = true;
            this.switchModeBtnVisible = true;
            this.menuVisible = false;
            this.$refs['functionBar'].close();
            this.displayReCalculating = true;
            this.$refs['cesiumContainer'].disStatusBar(false);
        },
        // 场内道路-重新设计-数据加载
        onRoadReCalculatingShow (projectId, planId) {
            let getDesignDefaultPara = this.$refs['cesiumContainer'].getDesiginDefaultPara();
            let restrictAreasList = this.$refs['cesiumContainer'].roadRestrictArea(projectId, planId, true);
            return { getDesignDefaultPara, restrictAreasList };
        },
        // 场内道路-重新设计-关闭
        roadReCalculatingClose () {
            // 用经评计算中的状态阻止点击风机弹出风机信息
            // this.evaluationCalculating = false;
            // 再次打开道路gis显示
            let data = this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, true);
            data.then(res => {
                // this.$refs['fanOptimize'].open(1, res, null, true);
                if(this.stationAndlineAndRoad){
                    this.$refs['fanOptimize'].initArrAll();
                    this.$refs['fanOptimize'].showStationAndLineBox();
                    this.$refs['fanOptimize'].open(1, res, null, false);     
                }else{
                    if(this.stationAndRoad){
                        this.$refs['fanOptimize'].showStationAndLineBox();
                        this.$refs['fanOptimize'].initArr2(true,true,false);
                        this.$refs['fanOptimize'].activeDaolu();
                        this.$refs['fanOptimize'].open(1, res, null, false); 
                    }else if(this.lineAndRoad){
                        this.$refs['fanOptimize'].showStationAndLineBox();
                        this.$refs['fanOptimize'].initArr2(true,false,true);
                        this.$refs['fanOptimize'].activeDaolu();
                        this.$refs['fanOptimize'].open(1, res, null, false); 
                    }else{
                        this.$refs['fanOptimize'].open(1, res, null, true);
                    }
                }
            });
            this.displayReCalculating = false;
            this.distributeActived = false;
            this.switchModeBtnVisible = true;
            this.wtTipVisible = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            this.$refs['cesiumContainer'].disStatusBar(true);
            // 关闭限制区域
            let params = this.$refs['roadReCalculating'].getParams();
            this.$refs['cesiumContainer'].roadRestrictArea(params.projectId, params.planId, false);
            // 取消起点道路定位
            this.$refs['cesiumContainer'].hideRoadStartPoint();
        },
        // 场内道路-重新设计-相关回调
        onMethodClick (type, data, callback) {
            switch (type) {
                case 'roadStartLocation':
                    this.$refs['cesiumContainer'].roadStartLocation(data[0], data[1]);
                    break;
                // 根据风机编号定位风机
                case 'locationFan':
                    this.$refs['cesiumContainer'].locationFanModle(data);
                    break;
                // 框选增加风机
                case 'selectFanByRectangle':
                    callback(this.$refs['cesiumContainer'].selectFanByRectangle());
                    break;
                // 重新计算
                case 'reCalculate':
                    this.planDetailShowing = false;
                    this.roadBarSelected = false;
                    this.displayReCalculating = false;
                    this.displayLineReCalculating = false;
                    // 关闭限制区域
                    this.$refs['cesiumContainer'].roadRestrictArea(this.currentProjectId, this.currentPlanId, false);
                    // 取消起点道路定位
                    this.$refs['cesiumContainer'].hideRoadStartPoint();
                    this.$refs['cesiumContainer'].startEdit(false);
                    this.distributeActived = false;
                    this.switchModeBtnVisible = false;
                    this.wtTipVisible = false;
                    this.menuVisible = true;
                    this.$refs['functionBar'].show1();
                    this.$refs['fanOptimize'].open(0, null, null, false);
                    // this.$refs['functionBar'].show(this.currentProjectId);
                    this.$refs['cesiumContainer'].disStatusBar(true);
                    // 置灰工具栏-查询方案栏
                    this.checkCalculating();
                    break;
                // 风机名称标签显隐
                case 'fanNameLabel':
                    this.$refs['cesiumContainer'].showOrHideFanNameLabel(data);
                    break;
                case 'fanNameLabel2':
                    this.$refs['cesiumContainer'].showOrHideFanNameLabel2(data);
                    break;
                // 限制因素湖泊显隐
                case 'lakeRestrict':
                    this.onLakeRestrict(data);
                    break;
                // 限制因素房屋显隐
                case 'houseRestrict':
                    this.onHouseRestrict(data);
            }
        },
        // 场内道路-重新设计-判断道路起点是否在场区内
        onRoadChecklatlng (step, lng, lat) {
            this.$refs['cesiumContainer'].isOutOfFarm(this.$store.state.app.projectInfo.project_id, lng, lat)
                .then(data => {
                    this.$refs.roadReCalculating.setLatlngInFarmResult(step, data);
                }).catch(err => {
                    console.log(err);
                    this.$refs.roadReCalculating.setLatlngInFarmResult(step, true);
                });
        },
        // 场内道路-重新设计-限制区域相关回调
        onRestrictAreasFunction (type, restrictAreaID, options, callback) {
            switch (type) {
                case 'locationSelectRestarictAera':
                    this.$refs['cesiumContainer'].locationSelectRestarictAera(restrictAreaID);
                    break;
                case 'startEitRestrictArea':
                    this.$refs['cesiumContainer'].startEitRestrictArea(restrictAreaID);
                    break;
                case 'stopEditRestrictArea':
                    this.$refs['cesiumContainer'].stopEditRestrictArea();
                    break;
                case 'deleteRestrictArea':
                    this.$refs['cesiumContainer'].deleteRestrictArea(restrictAreaID);
                    break;
                case 'addNewRestrictArea':
                    this.$refs['cesiumContainer'].addNewRestrictArea(options);
                    break;
                case 'submitEditRestrictArea':
                    callback(this.$refs['cesiumContainer'].submitEditRestrictArea());
                    break;
            }
        },
        // 点击升压站
        onStationBarSelected (projectId, planId, selected) {
            //游客模式 
            if(this.enManager){
                this.$refs['fanOptimizeYouke'].stationDetailShowing = false;
            }
            //非游客模式
            else{
                // 关闭升压站详情
                this.$refs['fanOptimize'].stationDetailShowing = false;
            }
            // 隐藏方案列表
            if (!this.stationAndLine) {
                this.planListShowing = selected;
                this.switchModeBtnVisible = selected;
            }
            // 升压站
            this.stationShowing = selected;
            this.$store.commit('projectId', projectId);
            this.$store.commit('planId', planId);
            // this.roadBarSelected = selected;
            
            !selected && this.stopEditStation();

            //工程设计选中和限制互斥
            if(selected){
                this.onRestrict(projectId, false);
                this.onIntegrateWindMap(projectId, false);
            }
            //游客模式  --选中升压站的时候
            if(this.enManager){
                if (selected) {
                    //没数据显示头部open(,,,,false) 只显示头
                    this.$refs['fanOptimizeYouke'].open(2, this.shengyaRes, null, null, false);
                    this.$refs['fanOptimizeYouke'].activeStationTou();
                    this.getDetailHttp(2);
                    if(this.stationAndlineAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,true,true);
                    }
                    else if (this.stationAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,true,false);
                    }
                    else if (this.stationAndLine){
                        this.$refs['fanOptimizeYouke'].initArr2(false,true,true);
                    }else{
                        this.$refs['fanOptimizeYouke'].initArr2(false,true,false);
                    }

                    this.getStation(projectId, planId, selected, (data) => {
                        if (data) {
                            data.then((res) => {
                                console.log(res);
                                if( this.getstation.stationArea){
                                    this.shengyaRes = this.getstation;
                                }else{
                                    this.shengyaRes = res;
                                }
                                this.$refs['fanOptimizeYouke'].open(2, this.shengyaRes, null, null, true);
                                this.$refs['fanOptimizeYouke'].activeStation();
                                if(this.stationAndlineAndRoad){
                                    this.$refs['fanOptimizeYouke'].initArr2(true,true,true);
                                }
                                else if (this.stationAndRoad){
                                    this.$refs['fanOptimizeYouke'].initArr2(true,true,false);
                                }
                                else if (this.stationAndLine){
                                    this.$refs['fanOptimizeYouke'].initArr2(false,true,true);
                                }else{
                                    this.$refs['fanOptimizeYouke'].initArr2(false,true,false);
                                }
                            }).catch(err => {
                                console.error(err);
                                // this.$message.error('加载升压站信息失败');
                            });
                        }
                    });
                }
                else{
                    this.stationButtonsShow = false;
                    this.getStation(projectId, planId, selected, (data) => { });
                    if(this.lineAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,false,true);
                        this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null, false);
                    }else{
                        if (this.roadBarSelected){
                            this.$refs['fanOptimizeYouke'].initArr2(true,false,false);
                            this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null, false);
                        }
                        else if (this.lineShowing){
                            this.$refs['fanOptimizeYouke'].initArr2(false,false,true);
                            this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null, false);
                        }else{
                            this.$refs['fanOptimizeYouke'].initArr2(false,false,false);
                            this.$refs['fanOptimizeYouke'].open(0, null, null, null, false);
                        }
                    }
                }
                console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"升压站");
                return;
            }
            if (selected) {
                this.getStation(projectId, planId, selected, (data) => {
                    if (data) {
                        data.then((res) => {
                            console.log(res);
                            if (this.lineShowing || this.roadBarSelected) {
                                this.$refs['fanOptimize'].open(2, res, null, false);
                                this.$refs['fanOptimize'].activeStation();
                            } 
                            else {
                                // this.$refs['fanOptimize'].stationAndLine();
                                this.$refs['fanOptimize'].open(2, res, null, true);
                            }
                        }).catch(err => {
                            console.error(err);
                            this.$message.error('加载升压站信息失败');
                        });
                    }
                });
            } else {
                this.stationButtonsShow = false;
                this.getStation(projectId, planId, selected, (data) => { });
                //     // this.$refs['fanOptimize'].activeLine();
                if (this.lineAndRoad) {
                    this.$refs['fanOptimize'].showStationAndLineBox();
                    this.$refs['fanOptimize'].initArr2(true,false,true);
                    this.$refs['fanOptimize'].activeDaolu();
                }else {
                    if(this.roadBarSelected){
                        this.$refs['fanOptimize'].stationAndLine();
                        this.$refs['fanOptimize'].initArr2(true,false,false);
                        let data = this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, true);
                        data.then(res => {
                            this.$refs['fanOptimize'].open(1, res, null, true);
                        });
                    }
                    else if(this.lineShowing){
                        this.$refs['fanOptimize'].stationAndLine();
                        this.$refs['fanOptimize'].initArr2(false,false,true);
                        this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
                            if (data) {
                                data.then((res) => {
                                    this.haveTowerData = res.isTower; 
                                    this.$refs['fanOptimize'].open(3, res, null, true);
                                });
                            }
                        });
                    }else{
                        this.$refs['fanOptimize'].stationAndLine();
                        this.$refs['fanOptimize'].initArr2(false,false,false);
                        this.$refs['fanOptimize'].open(0, null, null, false);
                    }
                }
                    // this.$refs['fanOptimize'].open(0, null, null, false);
                // this.closeDetailsPanel();
            }
            console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"升压站");
            // console.log(this.$refs['fanOptimize'].newShowingArr,"升压站");
            // 隐藏道路gis
            // this.$refs['cesiumContainer'].getInsideRoad(projectId, planId, false); //场内道路
        },
        // 导出升压站excel
        stationDaochuShow () {
            downloadFile(util.daoluUrl + '/export_station_excel/' + this.currentProjectId + '/' + this.currentPlanId);
        },

        // 加载升压站
        getStation (prjId, schemeId, isOpen, callback) {
            callback(this.$refs['cesiumContainer'].getStation(prjId, schemeId, isOpen));
        },
        // 升压站-手动优化-相关回调
        onStationButtonsFunction (value) {
            switch (value) {
                case 'rollBack':
                    // 回滚
                    this.$refs['cesiumContainer'].stopEditStation();
                    this.$store.commit('editedStation', false);
                    this.getStation(this.$store.state.app.projectId, this.$store.state.app.planId, true, (data) => {
                        if (data) {
                            data.then((res) => {
                                // this.$refs['functionBar'].showInfo(true, 2, res);
                                this.$refs['cesiumContainer'].editStation();
                            });
                        }
                    });
                    break;
                case 'saveData':
                    // 获取-保存-获取
                    this.$store.commit('editedStation', false);
                    // this.$refs['cesiumContainer'].stopEditStation();
                    this.getEditStationInfo();
                    
                    break;
                case 'closeToolBar':
                console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"升压站优化关闭");
                    // 回滚并退出
                    this.$store.commit('editedStation', false);
                    this.$refs['cesiumContainer'].stopEditStation();
                    this.distributeActived = false;
                    this.menuVisible = true;
                    this.$refs['functionBar'].show1();
                    this.getStation(this.$store.state.app.projectId, this.$store.state.app.planId, true, (data) => {
                        if (data) {
                            data.then((res) => { 
                                // if (!this.stationAndLine) {
                                //     this.$refs['fanOptimize'].open(2, res, null, true);
                                // } else {
                                //     this.$refs['fanOptimize'].activeStation();
                                // }
                                if(this.stationAndlineAndRoad){
                                    this.$refs['fanOptimize'].initArrAll();
                                    this.$refs['fanOptimize'].showStationAndLineBox();
                                    this.$refs['fanOptimize'].open(2, res, null, false);  
                                    this.$refs['functionBar'].$refs['fun23'].showSubMenu(false);   
                                }else{
                                    if(this.stationAndLine){
                                        this.$refs['fanOptimize'].showStationAndLineBox();
                                        this.$refs['fanOptimize'].initArr2(false,true,true);
                                        this.$refs['fanOptimize'].activeStation();
                                        this.$refs['fanOptimize'].open(2, res, null, false); 
                                        this.$refs['functionBar'].$refs['fun23'].showSubMenu(false);   
                                    }else if(this.stationAndRoad){
                                        this.$refs['fanOptimize'].showStationAndLineBox();
                                        this.$refs['fanOptimize'].initArr2(true,true,false);
                                        this.$refs['fanOptimize'].activeStation();
                                        this.$refs['fanOptimize'].open(2, res, null, false); 
                                        this.$refs['functionBar'].$refs['fun23'].showSubMenu(false);   
                                    }else{
                                        this.$refs['fanOptimize'].open(2, res, null, true);
                                        this.$refs['functionBar'].$refs['fun23'].showSubMenu(true);   
                                    }
                                }


                                
                            });
                        }
                    });
                    // if (!this.stationAndLine) {
                    if (this.$refs['functionBar'].$refs['fun23'].$refs['stationBar'].$refs['station-youhua']) {
                        this.$refs['functionBar'].$refs['fun23'].$refs['stationBar'].$refs['station-youhua'].setUnSelect();
                    }
                    this.stationButtonsShow = false;
                    break;
            }
        },
        // 升压站-手动优化-停止编辑升压站
        stopEditStation () {
            this.$store.commit('editedStation', false);
            this.$refs['cesiumContainer'].stopEditStation();
            this.stationButtonsShow = false;
        },
        // 升压站-手动优化-保存编辑后的升压站
        getEditStationInfo () {
            let dataInfo = this.$refs['cesiumContainer'].getEditStationInfo();
            //配合小郭那边只传  4个拐点坐标
            if(dataInfo.features[0]){
               var dataInfoNew = dataInfo.features[0].geometry.coordinates;
            }
            
            var arr = [];
            for(let i=0; i<dataInfoNew.length; i++){
                var obj = {};
                obj.longitude = dataInfoNew[i][0];
                obj.latitude = dataInfoNew[i][1];
                obj.elevation = dataInfoNew[i][2];
                arr.push(obj);
                // console.log(obj);
            }
            // console.log(dataInfoNew);
            // console.log(arr);
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
             //对应小郭，换游客的保存升压站接口
            this.waitingOneMinute = true;
            util.ajax.post("/reveal_station_save/"+this.currentProjectId+"/"+this.currentPlanId,{
                station_info: arr
            },config)
            .then(res=>{
                // console.log(res)
                this.waitingOneMinute = false;
                if(res.data.code == 201){
                    this.clearGis();  //关闭图谱，工程设计gis
                    // 发起经评计算，然后刷新方案列表，置灰恢复functionBar一系列操作
                    this.evaluationCalculation((done) => {
                        if (!done) return;
                        //计算完不显示详情框就注释下面
                        // 结束编辑后更新数据
                        this.getStation(this.currentProjectId, this.currentPlanId, true, (data) => {
                            if (data) {
                                data.then((res) => {
                                    this.onStationButtonsFunction('closeToolBar');
                                    // this.$refs['fanOptimize'].stationAndLine();
                                    // this.$refs['fanOptimize'].open(2, res, null, true);
                                    // this.$refs['functionBar'].$refs['fun23'].showSubMenu(true);
                                    // this.$refs['functionBar'].$refs['fun23'].selected = true;
                                    // this.$refs['functionBar'].$refs['fun23'].$refs['stationBar'].show(true);
                                });
                            }
                        });
                    });
                }else{
                    this.$message.error('提交编辑升压站数据失败');
                    return false;
                }
                   
            }).catch((err) => {
                this.waitingOneMinute = false;
                console.log(`提交编辑升压站数据失败${err}`);
                this.$message.error('提交编辑升压站数据失败');
                return false;
            });
            ////----------------------------------------------------
            
            // this.$refs['functionBar'].showInfo(true, 2, dataInfo.features[0].geometry.coordinates, true);
            // let postData = {
            //     project_id: this.currentProjectId,
            //     scheme_id: this.currentPlanId,
            //     station_param_json: dataInfo
            // };
            // let config = {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // };
            // this.waitingOneMinute = true;
           
            // util.DaoluUrl.post('/redesign_station?', postData, config)
            // .then(res => {
            //     this.waitingOneMinute = false;
            //     if (res.data.code === 1) {
            //         this.clearGis();  //关闭图谱，工程设计gis
            //         // 发起经评计算，然后刷新方案列表，置灰恢复functionBar一系列操作
            //         this.evaluationCalculation((done) => {
            //             if (!done) return;
            //             //计算完不显示详情框

            //             // 结束编辑后更新数据
            //             // this.getStation(this.currentProjectId, this.currentPlanId, true, (data) => {
            //             //     if (data) {
            //             //         data.then((res) => {
            //             //             this.onStationButtonsFunction('closeToolBar');

            //             //             this.$refs['fanOptimize'].stationAndLine();
            //             //             this.$refs['fanOptimize'].open(2, res, null, true);
            //             //             this.$refs['functionBar'].$refs['fun23'].showSubMenu(true);
            //             //             this.$refs['functionBar'].$refs['fun23'].selected = true;
            //             //             this.$refs['functionBar'].$refs['fun23'].$refs['stationBar'].show(true);
            //             //             // this.$refs['cesiumContainer'].editStation();
            //             //         });
            //             //     }
            //             // });
            //         });
            //     } else {
            //         this.$message.error('提交编辑升压站数据失败');
            //         return false;
            //     }
            // }).catch(err => {
            //     this.waitingOneMinute = false;
            //     console.log(`提交编辑升压站数据失败${err}`);
            //     this.$message.error('提交编辑升压站数据失败');
            //     return false;
            // });
        },
        // 升压站-手动优化
        stationYouhuaShow (selected) {
            this.stationButtonsShow = selected;
            if (selected) {
                this.$refs['cesiumContainer'].editStation();
                this.distributeActived = true;
                this.menuVisible = true;
                this.$refs['functionBar'].close();
                this.displayStationDtail = false;
                this.$refs['fanOptimize'].stationAndLine();
                this.$refs['fanOptimize'].open(0, null, null, true);
                this.$refs['fanOptimize'].hideStationDetail();
                // this.$refs['cesiumContainer'].disStatusBar(false);
            } else {
                this.$refs['cesiumContainer'].stopEditStation();
            }
        },
        // 升压站-详情-关闭
        stationDetailClose () {
            this.displayStationDtail = false;
            this.distributeActived = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            this.$refs['cesiumContainer'].disStatusBar(true);
        },
        // 升压站-成果导入
        onStationImport () {
            this.evaluationCalculation((done) => {
                if (!done) return;
                // 结束编辑后更新数据
                this.getStation(this.currentProjectId, this.currentPlanId, true, (data) => {
                    if (data) {
                        console.log(data,"222222")
                        data.then(() => {
                            this.$refs['functionBar'].$refs['fun23'].showSubMenu(true);
                            this.$refs['functionBar'].$refs['fun23'].selected = true;
                            this.$refs['functionBar'].$refs['fun23'].$refs['stationBar'].show(true);
                        });
                    }
                });
            });
        },
        // 点击集电线路
        onLineBarSelected (projectId, planId, selected) {
            //游客模式 
            if(this.enManager){
                this.$refs['fanOptimizeYouke'].stationDetailShowing = false;
            }
            //非游客模式
            else{
                // 关闭升压站详情
                this.$refs['fanOptimize'].stationDetailShowing = false;
            }
            // 隐藏方案列表
            if (!this.stationAndLine) {
                this.planListShowing = selected;
                this.switchModeBtnVisible = selected;
            }
            // 关闭升压站手动优化状态
            this.stopEditStation();
            // 集电线路
            this.lineShowing = selected;
            this.$store.commit('projectId', projectId);
            this.$store.commit('planId', planId);
            // this.roadBarSelected = selected;

            //工程设计选中 和限制,图谱,互斥
            if(selected){
                this.onRestrict(projectId, false);
                this.onIntegrateWindMap(projectId, false);
            }

            //游客模式  选中线路的时候
            if(this.enManager){
                if (selected) {
                    //没数据显示头部open(,,,,false) 只显示头
                    this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null, false);
                    this.$refs['fanOptimizeYouke'].activeLineTou();
                    this.getDetailHttp(3);
                    if(this.stationAndlineAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,true,true);
                    }
                    else if (this.lineAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,false,true);
                    }
                    else if (this.stationAndLine){
                        this.$refs['fanOptimizeYouke'].initArr2(false,true,true);
                    }else{
                        this.$refs['fanOptimizeYouke'].initArr2(false,false,true);
                    }

                    this.collectLineFunction('collectLine', projectId, planId, selected, null, (data) => {
                        if (data) {
                            data.then((res) => {
                                console.log(res);
                                if( this.getline.level){
                                    this.xianluRes = this.getline;
                                }else{
                                    this.xianluRes = res;
                                }
                                this.haveTowerData = res.isTower;
                                this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null, true);
                                this.$refs['fanOptimizeYouke'].activeLine();
                                if(this.stationAndlineAndRoad){
                                    this.$refs['fanOptimizeYouke'].initArr2(true,true,true);
                                }
                                else if (this.lineAndRoad){
                                    this.$refs['fanOptimizeYouke'].initArr2(true,false,true);
                                }
                                else if (this.stationAndLine){
                                    this.$refs['fanOptimizeYouke'].initArr2(false,true,true);
                                }else{
                                    this.$refs['fanOptimizeYouke'].initArr2(false,false,true);
                                }
                            }).catch(err => {
                                if (err.code === 404) {
                                    // this.$message.error('S3上文件不存在。');
                                } else if (err.code === 403) {
                                    // this.$message.error('S3上文件格式错误。');
                                } else {
                                    // this.$message.error('获取集电线路信息失败');
                                }
                            });
                        }
                    });
                }
                else{
                    this.collectLineFunction('collectLine', projectId, planId, selected, null, (data) => { });
                    if(this.stationAndRoad){
                        this.$refs['fanOptimizeYouke'].initArr2(true,true,false);
                        this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null, false);
                    }else{
                        if (this.stationShowing){
                            this.$refs['fanOptimizeYouke'].initArr2(false,true,false);
                            this.$refs['fanOptimizeYouke'].open(2, this.shengyaRes, null, null, false);
                        }
                        else if (this.roadBarSelected){
                            this.$refs['fanOptimizeYouke'].initArr2(true,false,false);
                            this.$refs['fanOptimizeYouke'].open(1, this.daoluRes, null, null, false);
                        }else{
                            this.$refs['fanOptimizeYouke'].initArr2(false,false,false);
                            this.$refs['fanOptimizeYouke'].open(0, null, null, null, false);
                        }
                    }
                }
                console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"集电");
                return;
            }
            if (selected) {
                this.collectLineFunction('collectLine', projectId, planId, selected, null, (data) => {
                    if (data) {
                        data.then((res) => {
                            console.log(res);
                            this.haveTowerData = res.isTower;
                            if (this.stationShowing || this.roadBarSelected) {
                                this.$refs['fanOptimize'].open(3, res, null, false);
                                this.$refs['fanOptimize'].activeLine();
                            } 
                            else {
                                this.$refs['fanOptimize'].open(3, res, null, true);
                            }
                        }).catch(err => {
                            if (err.code === 404) {
                                // this.$message.error('S3上文件不存在。');
                            } else if (err.code === 403) {
                                this.$message.error('S3上文件格式错误。');
                            } else {
                                this.$message.error('获取集电线路信息失败');
                            }
                        });
                    }
                });
            } else {
                this.collectLineFunction('collectLine', projectId, planId, selected, null, (data) => { });
                if (this.stationAndRoad) {
                    this.$refs['fanOptimize'].showStationAndLineBox();
                    this.$refs['fanOptimize'].initArr2(true,true,false);
                    this.$refs['fanOptimize'].activeDaolu();
                }else {
                    if(this.roadBarSelected){
                        this.$refs['fanOptimize'].stationAndLine();
                        this.$refs['fanOptimize'].initArr2(true,false,false);
                        let data = this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, true);
                        data.then(res => {

                            this.$refs['fanOptimize'].open(1, res, null, true);
                        });
                    }
                    else if(this.stationShowing){
                        this.$refs['fanOptimize'].stationAndLine();
                        this.$refs['fanOptimize'].initArr2(false,true,false);
                        this.getStation(this.$store.state.app.projectId, this.$store.state.app.planId, true, (data) => {
                            if (data) {
                                data.then((res) => {
                                    
                                    this.$refs['fanOptimize'].open(2, res, null, true);
                                });
                            }
                        });
                    }else{
                        this.$refs['fanOptimize'].stationAndLine();
                        this.$refs['fanOptimize'].initArr2(false,false,false);
                        this.$refs['fanOptimize'].open(0, null, null, false);
                    }
                }
                // this.$refs['fanOptimize'].open(0, null, null);
            }
            console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"集电");
            // console.log(this.$refs['fanOptimize'].newShowingArr,"集电");
            // this.$refs['cesiumContainer'].getInsideRoad(projectId, planId, false); //场内道路
        },
        onCollectLineListInfo(type , prjId, schemeId, isOpen, callback){
            switch (type){
                case 'collectLine':
                    if( this.enManager && this.xianlu_check_dxf ){
                        this.$refs['cesiumContainer'].dxfCollectLine(prjId, schemeId, isOpen);
                        return;
                    }
                    callback(this.$refs['cesiumContainer'].getCollectLine(prjId, schemeId, isOpen));
                break;
                case 'getCollectLineListInfo':

                    callback(this.$refs['cesiumContainer'].getCollectLineListInfo());
                break;
            }

        },
        // 集电线路-方法回调
        collectLineFunction (type, prjId, schemeId, isOpen, collectLineEntityID, callback) {
            switch (type) {
                case 'collectLine':
                    //判断游客模式的同时上传是dxf
                    if( this.enManager && this.xianlu_check_dxf ){
                        this.$refs['cesiumContainer'].dxfCollectLine(prjId, schemeId, isOpen);
                        return;
                    }
                    callback(this.$refs['cesiumContainer'].getCollectLine(prjId, schemeId, isOpen));
                    break;
                case 'getCollectLineListInfo':
                    callback(this.$refs['cesiumContainer'].getCollectLineListInfo());
                    break;
                case 'getDefalutToweriInfo':
                    callback(this.$refs['cesiumContainer'].getDefalutToweriInfo());
                    break;
                case 'getcolloectLineCrossSection':
                    callback(this.$refs['cesiumContainer'].getcolloectLineCrossSection(collectLineEntityID));
                    break;
                case 'saveChangeTowerType':
                    this.$refs['cesiumContainer'].saveChangeTowerType(prjId);
                    break;
                case 'startEditTowerLine':
                    this.$refs['cesiumContainer'].displayStakeLine(false);
                    this.$refs['cesiumContainer'].displayTowerLine(true);
                    this.$refs['cesiumContainer'].startEditTowerLine();
                    break;
                case 'stopEditCollectLine':
                    this.$refs['cesiumContainer'].displayStakeLine(false);
                    this.$refs['cesiumContainer'].displayTowerLine(false);
                    this.$refs['cesiumContainer'].stopEditCollectLine();
                    this.$refs['cesiumContainer'].stopEditToolMode();
                    break;
                case 'changeTowerType':
                    this.$refs['cesiumContainer'].changeTowerType(isOpen);
                    break;
                case 'startEditToolMode':
                    this.$refs['cesiumContainer'].displayTowerLine(false);
                    this.$refs['cesiumContainer'].displayStakeLine(true);
                    this.$refs['cesiumContainer'].startEditToolMode();
                    break;
                case 'stopEditToolMode':
                    // this.$refs['cesiumContainer'].displayTowerLine(false);
                    this.$refs['cesiumContainer'].displayStakeLine(false);
                    this.$refs['cesiumContainer'].stopEditToolMode();
                    break;
                case 'startEditStakeLine':
                    this.$refs['cesiumContainer'].startEditStakeLine();
                    break;
                case 'stopEditStakeLine':
                    this.$refs['cesiumContainer'].stopEditStakeLine();
                    break;
                case 'startDrawStakeLine':
                    this.$refs['cesiumContainer'].startDrawStakeLine();
                    break;
                case 'stopDrawStakeLine':
                    this.$refs['cesiumContainer'].stopDrawStakeLine();
                    break;
                case 'startDeleteStakeLine':
                    let deleteCallback = ({entity}) => {
                        if (!entity) return;
                        this.$confirm('确定删除所选线路?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$refs['cesiumContainer'].deleteStakeLine(entity);
                        }).catch(() => {
                        });
                    };
                    this.$refs['cesiumContainer'].startDeleteStakeLine({callBack: deleteCallback});
                    break;
                case 'stopDeleteStakeLine':
                    this.$refs['cesiumContainer'].stopDeleteStakeLine();
                    break;
                case 'startCombineStakeLine':
                    this.$refs['cesiumContainer'].startCombineStakeLine();
                    break;
                case 'stopCombineStakeLine':
                    this.$refs['cesiumContainer'].stopCombineStakeLine();
                    break;
                case 'startSplitStakeLine':
                    this.$refs['cesiumContainer'].startSplitStakeLine();
                    break;
                case 'stopSplitStakeLine':
                    this.$refs['cesiumContainer'].stopSplitStakeLine();
                    break;
                case 'rollBack':
                    // this.$refs['cesiumContainer'].stopEditCollectLine();
                    // this.$refs['cesiumContainer'].getCollectLine(prjId, schemeId, true);

                    // this.$refs['powerDetail'].open(true, prjId, schemeId);
                    break;
                case 'highLightSelectBranchRoute':
                    this.$refs['cesiumContainer'].highLightSelectBranchRoute(collectLineEntityID);
                    break;
                case 'submitEditTowerLineInfo':
                    callback(this.$refs['cesiumContainer'].submitEditTowerLineInfo(), this.currentProjectId, this.currentPlanId);
                    break;
            }
        },
        // 集电线路-详情-停止编辑
        onStopEditCollectLine () {
            this.$refs['cesiumContainer'].stopEditCollectLine();
            this.$refs['cesiumContainer'].stopEditToolMode();
        },
        // 集电线路-手动优化-保存后开始重新计算
        onRequestRecalculat () {
            this.onLineRecalculating({info: '手动优化完成，开始计算经评，预计用时1分钟。'});
        },
        // 集电线路-详情-打开
        onShowLineDetail (type) {
            this.distributeActived = true;
            this.menuVisible = true;
            this.$refs['functionBar'].close();
            this.$refs['cesiumContainer'].disStatusBar(false);
            this.displayPowerDetail = true;
            //游客模式
            if(this.enManager){
                //点击线路的查看详情事件
                if (type === 'combine'){
                    this.$refs['fanOptimizeYouke'].initArr2(false,false,false);
                    this.$refs['fanOptimizeYouke'].open(0, null, null,  null , false);
                }
            }
            //非游客模式
            else{
                if (type === 'alone') this.$refs['fanOptimize'].open(0, null, null, false);
                if (type === 'combine') this.$refs['fanOptimize'].stationAndLine();
            }
            this.$refs['powerDetail'].open(false, this.currentProjectId, this.currentPlanId);
        },
        //保存线路信息成功
        //集电线路保存编辑成功
        powerDetailClose2(){
            // 取消集电线路编辑状态
            this.$refs['cesiumContainer'].stopEditCollectLine();
            this.$refs['cesiumContainer'].stopEditToolMode();

            this.displayPowerDetail = false;
            this.distributeActived = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            this.$refs['cesiumContainer'].disStatusBar(true);
            this.lineShowing = true;
            console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"线路优化关闭2");
            this.clearGis();  //关闭图谱，工程设计
        },
        // 集电线路-详情-关闭
        //集电线路手动优化关闭
        powerDetailClose () {
            // 取消集电线路编辑状态
            this.$refs['cesiumContainer'].stopEditCollectLine();
            this.$refs['cesiumContainer'].stopEditToolMode();

            this.displayPowerDetail = false;
            this.distributeActived = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            this.$refs['cesiumContainer'].disStatusBar(true);
            this.lineShowing = true;
            console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"线路优化关闭");

            //游客模式
            if(this.enManager){
                this.getDetailHttp(3);
                //没数据也显示框先
                if(this.stationAndlineAndRoad){
                    this.$refs['fanOptimizeYouke'].initArrAll();
                    this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null , false);      
                }else{
                    if(this.lineAndRoad){
                        this.$refs['fanOptifanOptimizeYoukemize'].initArr2(true,false,true);
                        this.$refs['fanOptimizeYouke'].activeLine();
                        this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null , false);       
                    }else if(this.stationAndLine){
                        this.$refs['fanOptimizeYouke'].initArr2(false,true,true);
                        this.$refs['fanOptimizeYouke'].activeLine();
                        this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null , false);     
                    }else{
                        this.$refs['fanOptimizeYouke'].initArr2(false,false,true);
                        this.$refs['fanOptimizeYouke'].activeLine();
                        this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null , false);     
                    }
                }

                this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
                    if (data) {
                        data.then((res) => {
                            if( this.getline.level != null){
                                this.xianluRes = this.getline;
                            }else{
                                this.xianluRes = res;
                            }
                            this.haveTowerData = res.isTower;
                            if(this.stationAndlineAndRoad){
                                this.$refs['fanOptimizeYouke'].initArrAll();
                                this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null , true);      
                            }else{
                                if(this.lineAndRoad){
                                    this.$refs['fanOptifanOptimizeYoukemize'].initArr2(true,false,true);
                                    this.$refs['fanOptimizeYouke'].activeLine();
                                    this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null , true);       
                                }else if(this.stationAndLine){
                                    this.$refs['fanOptimizeYouke'].initArr2(false,true,true);
                                    this.$refs['fanOptimizeYouke'].activeLine();
                                    this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null , true);     
                                }else{
                                    this.$refs['fanOptimizeYouke'].initArr2(false,false,true);
                                    this.$refs['fanOptimizeYouke'].activeLine();
                                    this.$refs['fanOptimizeYouke'].open(3, this.xianluRes, null, null , true);     
                                }
                            }
                        });
                    }
                });

                return;
            }
            //非游客模式
            this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
                if (data) {
                    data.then((res) => {
                        this.haveTowerData = res.isTower;
                        if(this.stationAndlineAndRoad){
                            this.$refs['fanOptimize'].initArrAll();
                            this.$refs['fanOptimize'].showStationAndLineBox();
                            this.$refs['fanOptimize'].open(3, res, null, false);     
                            this.$refs['functionBar'].$refs['fun24'].showSubMenu(false);   
                        }else{
                            if(this.lineAndRoad){
                                this.$refs['fanOptimize'].showStationAndLineBox();
                                this.$refs['fanOptimize'].initArr2(true,false,true);
                                this.$refs['fanOptimize'].activeLine();
                                this.$refs['fanOptimize'].open(3, res, null, false); 
                                this.$refs['functionBar'].$refs['fun24'].showSubMenu(false);   
                            }else if(this.stationAndLine){
                                this.$refs['fanOptimize'].showStationAndLineBox();
                                this.$refs['fanOptimize'].initArr2(false,true,true);
                                this.$refs['fanOptimize'].activeLine();
                                this.$refs['fanOptimize'].open(3, res, null, false); 
                                this.$refs['functionBar'].$refs['fun24'].showSubMenu(false);   
                            }else{
                                this.$refs['fanOptimize'].open(3, res, null, true);
                                this.$refs['functionBar'].$refs['fun24'].showSubMenu(true);   
                            }
                        }
                    });
                }
            });

            
            // if (this.stationAndLine) {
            //     this.getStation(this.currentProjectId, this.currentPlanId, true, (data) => {
            //         if (data) {
            //             data.then((res) => {
            //                 this.$refs['fanOptimize'].open(2, res, null, false);
            //                 this.$refs['fanOptimize'].activeLine();
            //             }).catch(err => {
            //                 console.error(err);
            //                 this.$message.error('加载升压站信息失败');
            //             });
            //         }
            //     });
            //     this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
            //         if (data) {
            //             data.then((res) => {
            //                 this.$refs['fanOptimize'].open(3, res, null, false);
            //                 this.haveTowerData = res.isTower;
            //                 this.$refs['fanOptimize'].activeLine();
            //             });
            //         }
            //     });
            // } else {
            //     this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
            //         if (data) {
            //             data.then((res) => {
            //                 this.$refs['fanOptimize'].open(3, res, null, true);
            //                 this.haveTowerData = res.isTower;
            //                 this.$refs['fanOptimize'].stationAndLine();
            //             });
            //         }
            //     });
            // }
            // this.lineShowing = true;
        },
        // 集电线路-手动优化-打开
        jidianshoudongyouhuShow (productId) {
            // 关闭升压站详情
            this.$refs['fanOptimize'].stationDetailShowing = false;
            this.distributeActived = true;
            this.menuVisible = true;
            this.$refs['functionBar'].close();
            this.$refs['cesiumContainer'].disStatusBar(false);
            // if (!this.stationAndLine) this.$refs['fanOptimize'].open(0, null, null, false);
            // if (this.stationAndLine) this.$refs['fanOptimize'].stationAndLine();
            this.$refs['fanOptimize'].stationAndLine();
            this.$refs['fanOptimize'].open(0, null, null, true);
            this.$refs['fanOptimize'].hideStationDetail();
            this.displayPowerDetail = true;
            this.$refs['powerDetail'].open(true, this.currentProjectId, this.currentPlanId);
            // this.$refs['shoudongyouhuLoad'].loadTable(productId);
        },
        // 集电线路-手动优化-关闭事件---没触发这个关闭，另一个
        shoudongyouhuRoadClose () {
            // 取消集电线路编辑状态
            this.$refs['cesiumContainer'].stopEditCollectLine();
            this.$refs['cesiumContainer'].stopEditToolMode();

            this.jidianshoudongyouhu = false;
            this.distributeActived = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            this.$refs['cesiumContainer'].disStatusBar(true);
            if (this.stationAndLine) {
                // this.getStation(this.currentProjectId, this.currentPlanId, true, (data) => {
                //     if (data) {
                //         data.then((res) => {
                //             this.$refs['fanOptimize'].open(2, res, null, false);
                //             this.$refs['fanOptimize'].activeLine();
                //         }).catch(err => {
                //             console.error(err);
                //             this.$message.error('加载升压站信息失败');
                //         });
                //     }
                // });
                // this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
                //     if (data) {
                //         data.then((res) => {
                //             if (this.stationShowing && this.lineShowing) {
                //                 this.$refs['fanOptimize'].open(3, res, null, false);
                //                 this.$refs['fanOptimize'].activeLine();
                //             } else {
                //                 this.$refs['fanOptimize'].open(3, res, null, true);
                //             }
                //         });
                //     }
                // });
            } else {
                this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
                    if (data) {
                        data.then((res) => {
                            this.haveTowerData = res.isTower;
                            // this.$refs['fanOptimize'].open(3, res, null, true);
                            // this.$refs['fanOptimize'].stationAndLine();
                        });
                    }
                });
            }
            this.lineShowing = true;
        },
        // 集电线路-重新设计-打开
        lineReCalculatingShow () {
            // 用经评计算中的状态阻止点击风机弹出风机信息
            // this.evaluationCalculating = true;
            // 关闭线路gis
            this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, false, null, (data) => { });
            this.getStation(this.currentProjectId, this.currentPlanId, false, (data) => { });
            this.$refs['cesiumContainer'].getInsideRoad(this.currentProjectId, this.currentPlanId, false);
            // this.closeDetailsPanel(); 
            this.$refs['fanOptimize'].stationAndLine();
            this.$refs['fanOptimize'].open(0, null, null, true);
            this.$refs['fanOptimize'].hideStationDetail();

            this.distributeActived = true;
            this.switchModeBtnVisible = true;
            this.menuVisible = false;
            this.$refs['functionBar'].close();
            this.displayLineReCalculating = true;
            this.$refs['cesiumContainer'].disStatusBar(false);
            // 展示限制区域
            // let params = this.$refs['roadLineReCalculating'].getParams();
        },
        // 集电线路-重新设计-关闭
        lineReCalculatingClose () {
            // 用经评计算中的状态阻止点击风机弹出风机信息
            // this.evaluationCalculating = false;
            // 打开线路gis
            // this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
            //     if (data) {
            //         data.then((res) => {
            //             this.$refs['fanOptimize'].open(3, res, null);
            //             this.haveTowerData = res.isTower;
            //             // this.$refs['functionBar'].showInfo(selected, 3, res);
            //         });
            //     }
            // });
            this.displayLineReCalculating = false;
            this.distributeActived = false;
            this.switchModeBtnVisible = true;
            this.wtTipVisible = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            this.$refs['cesiumContainer'].disStatusBar(true);
            // 关闭限制区域
            let params = this.$refs['roadLineReCalculating'].getParams();
            this.$refs['cesiumContainer'].lineRestrictArea(params.projectId, params.planId, false);

            this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
                if (data) {
                    data.then((res) => {
                        this.haveTowerData = res.isTower;
                        if(this.stationAndlineAndRoad){
                            this.$refs['fanOptimize'].initArrAll();
                            this.$refs['fanOptimize'].showStationAndLineBox();
                            this.$refs['fanOptimize'].open(3, res, null, false);     
                        }else{
                            if(this.lineAndRoad){
                                this.$refs['fanOptimize'].showStationAndLineBox();
                                this.$refs['fanOptimize'].initArr2(true,false,true);
                                this.$refs['fanOptimize'].activeLine();
                                this.$refs['fanOptimize'].open(3, res, null, false); 
                            }else if(this.stationAndLine){
                                this.$refs['fanOptimize'].showStationAndLineBox();
                                this.$refs['fanOptimize'].initArr2(false,true,true);
                                this.$refs['fanOptimize'].activeLine();
                                this.$refs['fanOptimize'].open(3, res, null, false); 
                            }else{
                                this.$refs['fanOptimize'].open(3, res, null, true);
                            }
                        }
                    });
                }
            });
            // if (this.stationAndLine) {
            //     this.getStation(this.currentProjectId, this.currentPlanId, true, (data) => {
            //         if (data) {
            //             data.then((res) => {
            //                 this.$refs['fanOptimize'].open(2, res, null, false);
            //                 this.$refs['fanOptimize'].activeLine();
            //             }).catch(err => {
            //                 console.error(err);
            //                 this.$message.error('加载升压站信息失败');
            //             });
            //         }
            //     });
            //     this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
            //         if (data) {
            //             data.then((res) => {
            //                 this.$refs['fanOptimize'].open(3, res, null, false);
            //                 this.haveTowerData = res.isTower;
            //                 this.$refs['fanOptimize'].activeLine();
            //             });
            //         }
            //     });
            // } else {
            //     this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
            //         if (data) {
            //             data.then((res) => {
            //                 this.$refs['fanOptimize'].open(3, res, null, true);
            //                 this.haveTowerData = res.isTower;
            //                 this.$refs['fanOptimize'].stationAndLine();
            //             });
            //         }
            //     });
            // }
        },
        // 集电线路-重新设计-停止框选风机
        onStopSelectFanByRectangle () {
            this.$refs['cesiumContainer'].stopSelectFanByRectangle();
        },
        // 集电线路-重新设计-相关回调
        onLineReCalculatingShow (type, projectId, planId) {
            console.log(projectId, planId);
            let restrictAreasList = this.$refs['cesiumContainer'].lineRestrictArea(this.currentProjectId, this.currentPlanId, true);
            let turbineGroupInfo = this.$refs['cesiumContainer'].getTurbineGroupInfo(this.currentProjectId, this.currentPlanId);
            // this.$refs['roadLineReCalculating'].init(restrictAreasList, turbineGroupInfo);
            return { restrictAreasList, turbineGroupInfo };
        },
        // 集电线路-自动排塔-重新计算
        onReCalculating () {
            this.planDetailShowing = false;
            this.planListShowing = false;
            this.switchModeBtnVisible = false;
            this.roadBarSelected = false;
            this.displayLineReCalculating = false;
            this.distributeActived = false;
            this.switchModeBtnVisible = false;
            this.wtTipVisible = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            this.$refs['fanOptimize'].open(0, null, null, false);
            this.$refs['cesiumContainer'].disStatusBar(true);
            // 置灰工具栏-查询方案栏
            this.checkCalculating();
        },
        // 集电线路-重新设计-重新计算
        onLineRecalculating (param = {info: '桩位设计完成，开始计算经评，预计用时1分钟。'}) {
            this.planDetailShowing = false;
            this.planListShowing = false;
            this.switchModeBtnVisible = false;
            this.roadBarSelected = false;
            this.displayLineReCalculating = false;
            this.distributeActived = false;
            this.switchModeBtnVisible = false;
            this.wtTipVisible = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            this.$refs['fanOptimize'].open(0, null, null, false);
            this.$refs['cesiumContainer'].disStatusBar(true);

            this.getCalculatingStatus(param);
            // 置灰工具栏-查询方案栏
            this.checkCalculating();
        },

        // 获取计算状态
        getCalculatingStatus (param) {
            let that = this;
            util.Xianluajax.get('/getstatus', {
                params: {
                    project_id: this.$store.state.app.projectId,
                    scheme_id: this.$store.state.app.planId
                }
            }).then(res => {
                if (res.data.code === 0) {
                    // that.$message.success(param.info);
                    that.checkCalculating();
                } else {
                    setTimeout(function () { that.getCalculatingStatus(param); }, 20000);
                }
            }).catch((err) => {
                that.$message.info('桩位设计出错：' + err);
            });
        },
        // 集电线路成果导入
        uploadFileOfJdxl (projectId, planId, file) {
            let that = this;
            const formData = new FormData();
            formData.append('file', file);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            this.waitingOneMinute = true;
            util.Xianluajax.post('/uploadfile?project_id=' + projectId + '&scheme_id=' + planId, formData, config)
                .then((res) => {
                    this.waitingOneMinute = false;
                    if (res.data.code !== 0) {
                        that.$message.error('集电线路成果导入失败');
                        return;
                    }
                    that.$message.info('集电线路成果导入成功，开始计算...');
                    that.onLineRecalculating({info: '集电线路成果导入完成，开始计算经评，预计用时1分钟。'});
                }).catch((err) => {
                    this.waitingOneMinute = false;
                    if (err.message.indexOf('timeout') >= 0) {
                        that.$message.info('集电线路成果导入成功，开始计算...');
                        that.onLineRecalculating({info: '集电线路成果导入完成，开始计算经评，预计用时1分钟。'});
                        return;
                    }
                    that.$message.error('集电线路成果导入出错。' + err);
                });
        },
        // 集电线路-自动排塔-打开
        autoOptimizationShow (productId, planId) {
            this.distributeActived = true;
            this.menuVisible = true;
            this.$refs['functionBar'].close();
            this.$refs['autoOptimization'].open(productId, planId);
            // 禁用升压站-集电线路联合显示
            // this.closeDetailsPanel();
            this.$refs['fanOptimize'].stationAndLine();
            this.$refs['fanOptimize'].open(0, null, null, true);
            this.$refs['fanOptimize'].hideStationDetail();
        },
        // 集电线路-自动排塔-关闭
        autoOptimizationClose () {
            this.distributeActived = false;
            this.menuVisible = true;
            this.$refs['functionBar'].show1();
            let that = this;
            this.collectLineFunction('collectLine', this.currentProjectId, this.currentPlanId, true, null, (data) => {
                if (data) {
                    data.then((res) => {
                        that.haveTowerData = res.isTower; 
                        if(that.stationAndlineAndRoad){
                            that.$refs['fanOptimize'].initArrAll();
                            that.$refs['fanOptimize'].showStationAndLineBox();
                            that.$refs['fanOptimize'].open(3, res, null, false);     
                        }else{
                            if(that.lineAndRoad){
                                that.$refs['fanOptimize'].showStationAndLineBox();
                                that.$refs['fanOptimize'].initArr2(true,false,true);
                                that.$refs['fanOptimize'].activeLine();
                                that.$refs['fanOptimize'].open(3, res, null, false); 
                            }else if(that.stationAndLine){
                                that.$refs['fanOptimize'].showStationAndLineBox();
                                that.$refs['fanOptimize'].initArr2(false,true,true);
                                that.$refs['fanOptimize'].activeLine();
                                that.$refs['fanOptimize'].open(3, res, null, false); 
                            }else{
                                that.$refs['fanOptimize'].open(3, res, null, true);
                                that.$refs['functionBar'].$refs['fun24'].showSubMenu(true); 
                            }
                        }

                    });
                }
            });
        },
        windClickFan (row) {
            this.$refs['cesiumContainer'].locationFanModle(row);
        },
        projectOverCal (type, go) {
            if (type) {
                // this.waitingTwoMinute = true;
            } else {
                // this.waitingTwoMinute = false;
                if (go) {
                    this.projectInfo.status_id = 0;
                    this.onProjectClick(this.projectInfo);
                    this.getProjects(false);
                }
            }
        },
        // 方案详情调用经评计算后的应对函数
        onPlanDetailCalculating (status) {
            // 开始经评计算显示等待页面
            // this.waitingOneMinute = true;
            if (status) {
                this.evaluationReloadPlan((done) => {
                    console.log(done);
                    if (!done) return null;
                    this.$refs['planFullDetails'].active = true;
                    this.$refs['planFullDetails'].refreshData();
                });
            }
        },
        // 开始经评计算并刷新方案列表展示等待中页面
        evaluationCalculation (callback) {
            // 开始经评计算显示等待页面
            this.waitingOneMinute = true;
            util.ajax.post(`/calculate/${this.currentProjectId}/${this.currentPlanId}`, {
                args: 'evaluation'
            }).then(res => {
                this.waitingOneMinute = false;
                let retData = res.data;
                if (retData.code !== 200) {
                    this.$message.error('重新计算:' + retData.message);
                } else {
                    // this.$message.info('开始重新计算');
                    this.evaluationReloadPlan(callback);
                }
            }).catch((/* err */) => {
                this.waitingOneMinute = false;
                this.$message.error('重新计算失败！');
            });
        },
        checkIfPlanExemption (projectId, planId) {
            return this.currentExemptionProjectPlan && this.currentExemptionProjectPlan.projectId === projectId && this.currentExemptionProjectPlan.planId === planId;
        },
        evaluationReloadPlan (callback) {
            this.waitingOneMinute = true;
            if (!this.currentProjectId || this.currentProjectId.length === 0) return;
            this.currentExemptionProjectPlan = {projectId: this.currentProjectId, planId: this.currentPlanId};
            util.ajax.get(`/scheme_list/${this.currentProjectId}`, {
            }).then(res => {
                this.waitingOneMinute = false;
                if (res.data.code !== 200) {
                    this.$message.error(res.data.message);
                    this.currentExemptionProjectPlan = null;
                } else {
                    let plans = res.data.data;
                    this.$store.commit('currentProjectPlans', plans);
                    
                    let calculating = false;
                    for (let i = 0; i < plans.length; i++) {
                        let plan = plans[i];
                        this.$refs['planList'] && this.$refs['planList'].setNewData(plan);
                        if (plan.scheme_id === this.currentPlanId) {
                            calculating = (plan.status_id === 1); // 1:计算中
                            this.$store.commit('calculateStatus', plan.status_id);
                            if (!this.checkIfPlanExemption(this.currentProjectId, this.currentPlanId)) {
                                this.$refs['functionBar'].setCalculating(calculating);
                                if (calculating) {
                                    this.closeDetailsPanel();
                                }
                            }
                        }
                    }
                    if (calculating) {
                        this.waitingOneMinute = true;
                        this.saveCheckTimer = setInterval(() => {
                            this.checkCalculation(this.currentProjectId, this.currentPlanId, callback);
                        }, 15000);
                    } else {
                        this.currentExemptionProjectPlan = null;
                    }
                }
            }).catch((err) => {
                this.waitingOneMinute = false;
                this.currentExemptionProjectPlan = null;
                console.log('获取方案数据失败:' + err.message);
                // this.$message.error('获取方案数据失败！');
            });
        },
        checkCalculation (projectId, planId, callback) {
            if (!projectId || projectId.length === 0) return;
            // 方案一览
            util.ajax.get('/scheme_list/' + projectId, {}).then(res => {
                if (res.data.code !== 200) {
                    this.$message.error(res.data.message);
                } else {
                    let plans = res.data.data;
                    this.$store.commit('currentProjectPlans', plans);
                    let calculating = false;
                    for (let i = 0; i < plans.length; i++) {
                        let plan = plans[i];
                        this.$refs['planList'] && this.$refs['planList'].setNewData(plan);
                        if (plan.scheme_id === this.currentPlanId) {
                            calculating = (plan.status_id === 1); // 1:计算中
                            this.$store.commit('calculateStatus', plan.status_id);
                            if (!this.checkIfPlanExemption(projectId, planId)) {
                                this.$refs['functionBar'].setCalculating(calculating);
                                if (calculating) {
                                    this.closeDetailsPanel();
                                }
                            }
                        }
                    }
                    if (!calculating) {
                        this.closeCheckTime();
                        // 结束经评计算等待页面
                        this.waitingOneMinute = false;
                        this.currentExemptionProjectPlan = null;
                        callback(true);
                    }
                }
            }).catch((err) => {
                this.closeCheckTime();
                this.waitingOneMinute = false;
                this.currentExemptionProjectPlan = null;
                console.log('获取方案数据失败:' + err.message);
                // this.$message.error('获取方案数据失败！');
            });
        },
        //方案列表
        checkCalculating () {
            if (!this.currentProjectId || this.currentProjectId === '') return;
            clearTimeout(this.calculatTimer);
            util.ajax.get(`/scheme_list/${this.currentProjectId}`, {
            }).then(res => {
                // if (res.data.code !== 200) {
                //     this.$message.error(res.data.message);
                // } else {
                if (res.data.code == 200){
                    let plans = res.data.data;
                    this.$store.commit('currentProjectPlans', plans);
                    let calculating = false;
                    plans.forEach((item,index)=>{
                        if(item.scheme_id == this.$store.state.app.busloading.scheme_id ){
                            calculating = (item.status_id === 1); // 1:计算中
                            this.$store.commit('calculateStatus', item.status_id);
                            if(item.status_id==2){
                                let busloading = {};
                                busloading.loading=false;
                                this.$store.commit("busloading",busloading);
                            }
                        }
                    })
                    let needRequest = false;
                    for (let i = 0; i < plans.length; i++) {
                        let plan = plans[i];
                        needRequest = needRequest || plan.status_id === 1;
                        this.$refs['planList'] && this.$refs['planList'].setNewData(plan);
                        if (plan.scheme_id === this.currentPlanId && !this.checkIfPlanExemption(this.currentProjectId, this.currentPlanId)) {
                            this.$refs['functionBar'].setCalculating(plan.status_id === 1);
                            if (plan.status_id === 1) {
                                this.closeDetailsPanel();
                            }
                        }
                    }

                    // this.calculatTimer = setTimeout(() => {
                    //     this.checkCalculating();
                    // }, needRequest ? 5000 : 15000);
                    var isNeedReq = plans.some((item,index)=>{
                        return item.status_id == 1;
                    })
                    var isNeedReqTotol = plans.some((item,index)=>{
                        return item.status_id == 1 && item.scheme_id == this.$store.state.app.planId;
                    })
                    // console.log(isNeedReq,"isNeedReq");
                    // console.log(isNeedReqTotol,"isNeedReqTotol");
                    if(isNeedReq){
                        this.calculatTimer = setTimeout(() => {
                            this.checkCalculating();
                            // console.log(this.$store.state.app.planId);
                            //选中方案就业轮训方案
                            if(this.$store.state.app.planId && isNeedReqTotol){
                                this.getMastProject();
                            }
                        }, 5000);
                    }
                }
            }).catch((err) => {
                console.error('获取方案数据失败:' + err.message);
                this.$message.error('获取方案数据失败！');
            });
        },
        closeCheckTime () {
            if (!this.saveCheckTimer) {
                return;
            }
            clearInterval(this.saveCheckTimer);
            this.saveCheckTimer = null;
        },
        restTip () {
            if (!this.$refs['switchModeBtn'].modeStatus) {
                // WT模式，隐藏标准卡片，显示WT卡片
                this.planListShowing = true;
            } else {
                this.planListShowing = false;
            }
        },
        //清除风机三维选中颜色
        onClearHighLightFan(){
            this.$refs['cesiumContainer'].clearHighLightFan();
        },
        onClearHighLightMast(){
            this.$refs['cesiumContainer'].clearHighLightMast();
        },
        //清除集电塔颜色高亮
        onClearHighTowerLabel(){
            this.$refs['cesiumContainer'].clearHighTowerLabel();
        }
    },
    computed: {
        inProject () {
            return this.$store.state.app.inProject;
        },
        stationAndLine () {
            return (this.stationShowing && this.lineShowing && !this.roadBarSelected);
        },
        stationAndRoad () {   //修改道路与后两个不互斥
            return (this.stationShowing && this.roadBarSelected && !this.lineShowing);
        },
        lineAndRoad () {    //
            return (this.lineShowing && this.roadBarSelected && !this.stationShowing);
        },
        stationAndlineAndRoad () {   //
            return (this.lineShowing && this.roadBarSelected && this.stationShowing);
        },
        clickMastInfo () {
            return this.$store.state.app.clickMastInfo;
        },
        enManager: function () {
            if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                return true;
            }else{
                return false;
            }
        },
        calculateStatus(){
            return this.$store.state.scheme.calculateStatus;
        }
    },
    watch: {
        "$store.state.user.waitingShareClose" (val) {
            this.waitingShare = false
        },
        // 等效小时数
        "$store.state.scheme.currentFans":{
            deep:true,//深度监听
            handler(val){
                // console.log(val)
                if(val.length>0){
                    var sum = 0;
                    val.forEach((item,index)=>{
                        // console.log(item.equivalent_hours)
                        sum += Number(item.equivalent_hours)
                    })
                    let len = val.length;
                    this.allHours = parseInt(sum/len);

                    this.changeHours = parseInt(this.allHours - this.old_equivalent_hours);
                    // console.log(this.changeHours)
                }else{
                    this.allHours = 0;
                    this.changeHours = 0;
                }
            }
        },
        //
        // "$store.state.scheme.changeHours":function(val){
        //     // console.log(val)
        //     var sum = 0;
        //     val.forEach((item,index)=>{
        //         sum += Number(item);
        //     })
        //     let len = this.$store.state.scheme.currentFans.length;
        //     this.changeHours = parseInt(sum/len);
        // },
       
        "$store.state.app.busloading":function(val){
            if(val.loading){
                this.waitingOneMinute = true;
            }else{
                this.waitingOneMinute = false;
            }
        },
        assessHomeAcctive:function(val){
            if(val){
                this.getNewProjects();
            }
        },
        clickMastInfo: function (newVal) {
            //测风塔信息界面显示影藏
            this.mastInfo.visible = newVal.bool;
            if (newVal.bool) {
                this.mastInfo.position.x = newVal.clientX;
                this.mastInfo.position.y = newVal.clientY;
                // console.log(this.$refs['cesiumContainer'].masts)//到这传数据
                this.mastInfo.project = this.$refs['cesiumContainer'].masts.find(item => {
                    return item.id === newVal.mastId;
                });
            }
        },
        guidanceShowed: function (val) {
            if (val === true) {
                this.guidanceShow = false;
            }
        },
        stationAndLine (stationAndLine) {
            // console.log(stationAndLine,"stationAndLine");
            // console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"000");
            if (stationAndLine) {
                // this.$refs['fanOptimize'].initArr(0);
                this.$refs['functionBar'].$refs['fun23'].stationAndLine(true);
                this.$refs['functionBar'].$refs['fun24'].stationAndLine(true);
                this.$refs['functionBar'].showStationBar(false);
                this.$refs['functionBar'].showJiDianBar(false);
            } 
            else {
                if(this.stationShowing){
                    this.$refs['functionBar'].$refs['fun23'].stationAndLine(false);
                    this.$refs['functionBar'].showStationBar(this.stationShowing);
                }
                else if(this.lineShowing){
                    this.$refs['functionBar'].$refs['fun24'].stationAndLine(false);
                    this.$refs['functionBar'].showJiDianBar(this.lineShowing);
                }
            }
        },
        stationAndRoad(stationAndRoad){
            // console.log(stationAndRoad,"stationAndRoad");
            // console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"111");
            if (stationAndRoad) {
                // this.$refs['fanOptimize'].initArr(2);
                this.$refs['functionBar'].$refs['fun23'].stationAndLine(true);
                this.$refs['functionBar'].$refs['fun26'].stationAndLine(true);
                this.$refs['functionBar'].showStationBar(false);
                this.$refs['functionBar'].showRoadBar(false);
            } 
            else {
                if(this.stationShowing){
                    this.$refs['functionBar'].$refs['fun23'].stationAndLine(false);
                    this.$refs['functionBar'].showStationBar(this.stationShowing);
                }
                else if(this.roadBarSelected){
                    this.$refs['functionBar'].$refs['fun26'].stationAndLine(false);
                    this.$refs['functionBar'].showRoadBar(this.roadBarSelected);
                }
            }
        },
        lineAndRoad(lineAndRoad){
            // console.log(lineAndRoad,"lineAndRoad");
            // console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"222");
            if (lineAndRoad) {
                // this.$refs['fanOptimize'].initArr(1);
                this.$refs['functionBar'].$refs['fun24'].stationAndLine(true);
                this.$refs['functionBar'].$refs['fun26'].stationAndLine(true);
                this.$refs['functionBar'].showJiDianBar(false);
                this.$refs['functionBar'].showRoadBar(false);
            } 
            else {
                if(this.lineShowing){
                    this.$refs['functionBar'].$refs['fun24'].stationAndLine(false);
                    this.$refs['functionBar'].showJiDianBar(this.lineShowing);
                }
                else if(this.roadBarSelected){
                    this.$refs['functionBar'].$refs['fun26'].stationAndLine(false);
                    this.$refs['functionBar'].showRoadBar(this.roadBarSelected);
                }
            }
        },
        stationAndlineAndRoad(stationAndlineAndRoad){
            // console.log(stationAndlineAndRoad,"stationAndlineAndRoad");
            // console.log(this.roadBarSelected,this.stationShowing,this.lineShowing,"333");
            if (stationAndlineAndRoad) {
                this.$refs['functionBar'].$refs['fun23'].stationAndLine(true);
                this.$refs['functionBar'].$refs['fun24'].stationAndLine(true);
                this.$refs['functionBar'].$refs['fun26'].stationAndLine(true);
                this.$refs['functionBar'].showStationBar(false);
                this.$refs['functionBar'].showJiDianBar(false);
                this.$refs['functionBar'].showRoadBar(false);
            } 
            // else {
            //     this.$refs['functionBar'].$refs['fun23'].stationAndLine(false);
            //     this.$refs['functionBar'].$refs['fun24'].stationAndLine(false);
            //     this.$refs['functionBar'].$refs['fun26'].stationAndLine(false);
            //     this.$refs['functionBar'].showStationBar(this.stationShowing);
            //     this.$refs['functionBar'].showJiDianBar(this.lineShowing);
            //     this.$refs['functionBar'].showRoadBar(this.roadBarSelected);
            // }
        },
        //对应游客模式工程设计可选
        roadBarSelected(val){
            // console.log(val,"道路");
            if(val && !this.stationShowing && !this.lineShowing){
                this.$refs['functionBar'].$refs['fun26'].stationAndLine(false);
            }
        },
        stationShowing(val){
            // console.log(val,"升压线路");
            if(val && !this.roadBarSelected && !this.lineShowing){
                this.$refs['functionBar'].$refs['fun23'].stationAndLine(false);
            }
        },
        lineShowing(val){
            // console.log(val,"线路");
            if(val && !this.stationShowing && !this.roadBarSelected){
                this.$refs['functionBar'].$refs['fun24'].stationAndLine(false);
            }
        },
        switchModeBtnVisible: function (val) {
            console.log('switchModeBtnVisible->' + val);
            console.log('this.planListShowing' + this.planListShowing);
            console.log('st' + this.$refs['switchModeBtn'].modeStatus);
            if (!val) {
                // 隐藏卡片后，恢复状态
                this.restTip();
            }
        },
        waitingOneMinute () {
            this.$store.commit('globeLoading', {loading: this.waitingOneMinute, text: '重新计算中，预计用时1分钟...'});
        },
        waitingTwoMinute () {
            this.$store.commit('globeLoading', {loading: this.waitingTwoMinute, text: '正在获取数据...'});
        },
        haveTowerData (newVal) {
            this.$store.commit('haveTowerData', newVal);
        },
        "$store.state.app.contrastMoveList":function(val){
            this.contrastMoveList = val;
            this.contrastMoveList.colActive = false;
            // console.log(this.contrastMoveList)

        }
    }
};
</script>
