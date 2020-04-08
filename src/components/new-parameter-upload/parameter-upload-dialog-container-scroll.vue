<style lang="less" scoped>
    @import "./parameter2.less";
    .mytipBox{
        position: relative;
        margin-left: 15px;
    }
    .mytip{
        height: 18px;
        width: 75px;
        text-align: center;
        line-height: 18px;
        font-size: 12px;
        color: #000;
        padding: 2px 5px;
        margin: 0 !important;
        /* font-weight: bold; */
        background: rgba(220, 241, 247, 0.6);
        border-radius: 1px;
        position: absolute;
        bottom: 35px;
        left: -20px;
    }
    .mytip1{
        width: 60px;
    }
    .mytip3{
        left: 141px;
    }
    .mytip4{
        left: 143px;
    }
    .mytip5{
        left: -68px;
    }
  
   
    .wtDensityParent{
        position: relative;
    }
    .wtDensity{
        position: absolute;
        left: 50%;
        top: 40px;
        width: 290px;
        margin-left: -145px;
    }
    .wtDensity /deep/ .el-input{
        width: 190px !important;
    }
    .wtDensity /deep/ .el-form-item__content{
        display: flex;
        justify-content: space-between;
    }
</style>
<template>
    <div class="parameterBox">
        <el-dialog title="上传参数" 
                   :visible.sync="dialogVisible"
                   custom-class="parameterBox-confirm"
                   :modal="false"
                   :close-on-click-modal="false"
                   :before-close="beforeClose">
            <div v-if="!uploadSuccess" >
                <div class="param-container" >
                    <ul class="leftBox">
                        <li :class="tabIndex1  ? 'leftActive' :'' "><div @click="arrowChange(1)" :class="arrReady1?'readyActive':'disableActive'">1</div> <span class="line line1" :class="uploadedFolder.length>0 && uploadTabActiveFirst ?'line1_left':''"></span></li>
                        <li :class="tabIndex2  ? 'leftActive' :'' "><div @click="arrowChange(2)" :class="arrReady2?'readyActive':'disableActive'">2</div> <span class="line line2"></span></li>
                        <li :class="tabIndex3  ? 'leftActive' :'' "><div @click="arrowChange(3)" :class="arrReady3?'readyActive':'disableActive'">3</div> <span class="line line3"></span></li>
                        <li :class="tabIndex4  ? 'leftActive' :'' "><div @click="arrowChange(4)" :class="arrReady4?'readyActive':'disableActive'">4</div> <span class="line line4"></span></li>
                        <li :class="tabIndex5  ? 'leftActive' :'' "><div @click="arrowChange(5)" :class="gongarrReady5!='0'?gongarrReady5!='2'?'disableActive':'readyActive':'zhihuiActive'">5</div> <span class="line line5"></span></li>
                        <li :class="tabIndex6  ? 'leftActive' :'' "><div @click="arrowChange(6)" :class="gongarrReady6!='0'?gongarrReady6!='2'?'disableActive':'readyActive':'zhihuiActive'">6</div> <span class="line line6"></span></li>
                        <li :class="tabIndex7  ? 'leftActive' :'' "><div @click="arrowChange(7)" :class="gongarrReady7!='0'?gongarrReady7!='2'?'disableActive':'readyActive':'zhihuiActive'">7</div> <span class="line line7"></span></li>
                    </ul>
                    <ul class="rightBox">
                        
                        <div class="tooltipContent" v-if="tooltipShow1 && uploadTabActiveFirst">
                            <div class="closeTip" @click="tooltipShow1 = false"><span>×</span></div>  
                            <div class="tooltip-arrow">
                                <div class="arrow-up"></div>
                            </div>  
                            请分别上传各个架次的航拍数据，包括影像文件和POS信息两部分，具体格式可参见样例数据：其中，航拍影像为JPG格式，一般一个架次不超过1000张；POS信息为txt/csv格式，包括影像文件名、经度、纬度、高程四列/或者影像文件名、平面坐标x、平面坐标y、高程四列，具体格式请参见“样例数据”。
                        </div>
                        <div class="tooltipContent tooltipContent1" v-if="tooltipShow1 && !uploadTabActiveFirst">
                            <div class="closeTip" @click="tooltipShow1 = false"><span>×</span></div>  
                            <div class="tooltip-arrow">
                                <div class="arrow-up"></div>
                            </div>
                            请上传风电场项目兴趣区域地形数据，不包括外扩部分。
                        </div>     
                        <div class="tooltipContent tooltipContent2" v-if="tooltipShow2 && !simulationMode">
                            <div class="closeTip" @click="tooltipShow2 = false"><span>×</span></div>  
                            <div class="tooltip-arrow">
                                <div class="arrow-up"></div>
                            </div>
                            请上传项目的WT定向结果".dat"压缩文件，rar或zip格式。压缩文件内目录结构如图所示，根目录下是各扇区的dat输出结果，每个dat文件名称中包含该扇区名称。<br/>
                            考虑计算资源限制，目前仅支持&lt;2G压缩文件上传， 如果有更大压缩文件上传， 请联系管理员: chenfei28109@goldwind.com.cn
                            <div style="width:120px;height:120px;padding: 15px 0 0 0;">
                                <img src="/static/提示图.png" alt="" 
                                @click="imgDetail = !imgDetail" 
                                title="点击放大/缩小"
                                :class="imgDetail ? 'imgtip1' : 'imgtip2'"/>
                            </div>
                        </div>    
                        <div class="tooltipContent tooltipContent3" v-if="tooltipShow3">
                            <div class="closeTip" @click="tooltipShow3 = false"><span>×</span></div>  
                            <div class="tooltip-arrow">
                                <div class="arrow-up"></div>
                            </div>
                            一条测风塔记录可以对应多个测风高度，一个测风高度对应一个测风文件；测风文件为.tim格式，一般包括风向、风速、标准差、时间，具体格式请参见“样例数据”。
                        </div>  
                        <div class="tooltipContent tooltipContent4" v-if="tooltipShow4">
                            <div class="closeTip" @click="tooltipShow4 = false"><span>×</span></div>  
                            <div class="tooltip-arrow">
                                <div class="arrow-up"></div>
                            </div>
                            应提供初始版本的风机排布方案，包括风机编号、平面坐标x、平面坐标y、轮毂高度四列，具体格式请参见“样例数据”。
                        </div>  


            <!-- 第一步 -->
                        <li :class="tabIndex1 ? 'contentActive' :'' ">
                            <p class="arrowActive"> <span class="titleBox"> <span class="tabIcon"><icon name="jibenxinxi" style="width:16px;height:16px;"/></span> 上传地形数据 
                            <span class="errIcon" v-if="!iconActive1"><icon name="jingshi" style="width:18px;height:18px;"/>您输入的数据有误 !</span> </span>    <span class="arrow" @click="arrowChange(1)" ><icon name="arrow-right-copy"/></span> </p>
                            <div class="contentHeight contentHeight1 content content1" :class="uploadedFolder.length>0 && uploadTabActiveFirst ?'contentHeight1_left':''">
                                <!-- 第一步 -->
                                    <div class="upload-tab">
                                        <div class="bgBox">
                                            <span  :class="{'bgActive':!uploadTabActiveFirst}"></span>
                                        </div>
                                        <div class="upload-tab-tag"
                                            v-bind:class="{'upload-tab-active':uploadTabActiveFirst}"
                                            @click="uploadTabChange(!uploadTabActiveFirst,true)"
                                        >
                                        <span class="spanTip">上传无人机地形</span>
                                        </div>
                                        <div class="upload-tab-tag"
                                            v-bind:class="{'upload-tab-active':!uploadTabActiveFirst}"
                                            @click="uploadTabChange(!uploadTabActiveFirst,false)"
                                        >
                                        <span class="spanTip">上传已有地形</span>
                                        </div>

                                        <div class="tooltipBox">
                                            <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                                content="查看说明" :disabled="tooltipShow1" :visible-arrow="false">
                                                <span style="display: inline-block;" @click="tooltipShow1 = true">
                                                    <icon name="shuoming" style="width:18px;height:18px;color: rgba(212,239,246,0.6);"/>
                                                </span>
                                            </el-tooltip>     
                                            <a target="_blank" :href="terrainUavUrl"  v-if="uploadTabActiveFirst">
                                                <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                                    content="下载模板" :visible-arrow="false">
                                                    <icon name="xiazaijiangyiicon" style="width:23px;height:23px;color: rgba(212,239,246,0.6);"/>
                                                </el-tooltip>      
                                            </a>
                                        </div>
                                    </div>
                                    <div class="upload-form powerCurveBox" :class="!epsg_src_Valid?'redBorderValid':''">
                                        <el-form :inline="true" :model="formInline" class="original-form-inline">
                                            <el-form-item label="源坐标系：">
                                                <el-cascader
                                                        :options="pcsOptions"
                                                        :show-all-levels="false"
                                                        v-model="epsg_id"
                                                        popper-class="powerCurve"
                                                        @active-item-change="handleItemChange"
                                                        @change="onEpsgChange"
                                                        
                                                ></el-cascader>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                    <div class="upload-terrain" :class="!terrainValue_Valid? 'terrainBorderValid' :''">
                                        <span style="color: rgba(211,219,235,0.7)">地形复杂度：</span>
                                        <el-select v-model="terrainValue" popper-class="gf-popper" placeholder="请选择">
                                            <el-option
                                            v-for="(item,index) in terrainList"
                                            :key="index"
                                            :label="item"
                                            :value="item">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div :class="!terrainUpload_Valid? 'terrainUploadBorder':''" >
                                    <div :class="!terrainUpload_Valid2? 'terrainUploadBorder2':''" >
                                        <div class="upload-button terrainBtn" v-if="uploadTabActiveFirst" :class="uploadedFolder.length>0 ? 'uploadActive' : ''">              
                                            <upload-folder :project_id="projectId" @uploadCompleted="uploadCompletedHandle"
                                                        v-if="uploadTabActiveFirst">
                                                <div style="width: 290px;height: 100%">
                                                    <div style="display:flex;align-items:center;justify-content: center;">
                                                        <div style="height: 30px;line-height: 25px;padding-left: 10px" v-if="!uploadedFolder.length>0">
                                                            <span class="icon">
                                                                <icon name="zengjia"></icon>
                                                            </span>
                                                        </div>
                                                        <div style="margin-left: 10px;">
                                                            {{uploadedFolder.length>0 ? uploadedFolder[0].name : '添加无人机影像及POS文件'}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </upload-folder>
                                        </div>
                                        <div class="upload-button terrainBtn2" v-if="!uploadTabActiveFirst" :class="uploadTerrainName? 'uploadActive' : '' ">
                                            <upload-terrain 
                                                    :project_id="projectId"
                                                    :terrain_id="terrainId"
                                                    @uploadBegin="onUploadBegin"
                                                    @uploadCompleted="uploadTerrainCompletedHandle"
                                                    @uploadErr="uploadErrHandle"
                                                    :class="[uploadTerrainBox?'uploadTerrainBox': '']"
                                            >
                                                <div style="width: 290px;height: 100%" >
                                                    <div style="display:flex;align-items:center;justify-content: center;"
                                                        v-if="!uploadTerrainName">
                                                        <div style="height: 30px;line-height: 25px;padding-left: 10px">
                                                            <span class="icon">
                                                                <icon name="zengjia"></icon>
                                                            </span>
                                                        </div>
                                                        <div style="margin-left: 10px;">
                                                            添加地形文件(.map/.tif)                                 
                                                        </div>
                                                    </div>
                                                    <div v-else class='uploadTerrainNameBox'>
                                                        {{uploadTerrainName}}
                                                    </div>
                                                </div>
                                            </upload-terrain>
                                        </div>
                                    </div>
                                    </div>
                                    <folder-table v-if="uploadTabActiveFirst" :project_id="projectId" ref="folderTableRef"
                                                @fileFormChange="fileFormChangeHandle" @Expand="onExpandHandle"
                                                @closeProgressBar="onCloseProgressBar"
                                    ></folder-table>
                                <!-- 第一步结束 -->
                            </div>
                        </li>
            <!-- 第二步 -->
                        <li :class="tabIndex2 ? 'contentActive' :'' ">
                            <p class="arrowActive"> <span class="titleBox"> <span class="tabIcon"><i class="iconfont icon-fangzhenjinhangzhuangtai" style="font-size: 17px;"/></span> 设置仿真参数 
                            <span class="errIcon" v-if="!iconActive2"><icon name="jingshi" style="width:18px;height:18px;"/>您输入的数据有误 !</span> </span>    <span class="arrow" @click="arrowChange(2)" ><icon name="arrow-right-copy"/></span> </p>
                            <div class="contentHeight contentHeight2">
                                <!-- 第二步 -->
                                <div style="position: relative;">
                                    <div class="content simulationDiv" v-if="$store.state.user.loginUserInfo.role==1">
                                        <div class="bgBox"> 
                                            <span :class="{'bgActive':!simulationMode}"></span>
                                        </div>
                                        <div class="mode-div"
                                            v-bind:class="{'mode-tab-active':simulationMode}"        
                                            @click="simulationChange(true)">
                                            <span class="spanTip">GoldFoam模式</span>
                                        </div>
                                        <div class="mode-div"
                                            v-bind:class="{'mode-tab-active':!simulationMode}"
                                            @click="simulationChange(false)">
                                            <span class="spanTip">WT模式</span>
                                        </div>
                                    </div>
                                    <div class="content simulationDiv" v-if="$store.state.user.loginUserInfo.role!=1">
                                        <div class="mode-div" 
                                        v-bind:class="{'mode-tab-active':!simulationMode}"
                                        @click="simulationChange(false)">
                                            <span class="spanTip">WT模式</span>
                                        </div>
                                    </div>

                                    <div class="tooltipBox tooltipBox2" v-if="!simulationMode">
                                        <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                            content="查看说明" :disabled="tooltipShow2" :visible-arrow="false">
                                            <span style="display: inline-block;" @click="tooltipShow2 = true">
                                                <icon name="shuoming" style="width:18px;height:18px;color: rgba(212,239,246,0.6);"/>
                                            </span>
                                        </el-tooltip>     
                                    </div>
                                </div>
                                <!-- 第二步 -->
                                <div class="content content2" v-show="simulationMode">
                                    <el-form ref="cfdForm"
                                            class="content2InputWidth"
                                            :model="cfdForm"
                                            :rules="cfdRules"
                                            label-position="left"
                                            label-width="120px"
                                            style="width: 300px;margin: 0 auto;position: relative;left:6px;">
                                        <el-form-item prop="section_num" label="扇区数:">
                                            <el-input v-model="cfdForm.section_num" placeholder="请填写扇区数（2～50）"
                                                    :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                        </el-form-item>
                                        <el-form-item prop="horizontal_resolution" label="水平网格分辨率:">
                                            <el-input v-model="cfdForm.horizontal_resolution"
                                                    :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                        </el-form-item>
                                        <el-form-item prop="vertical_resolution" label="垂直网格分辨率:">
                                            <el-input v-model="cfdForm.vertical_resolution"
                                                    :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                        </el-form-item>
                                        <el-form-item prop="air_density_input" label="空气密度:">
                                            <el-input v-model="cfdForm.air_density_input"
                                                    :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                        </el-form-item>
                                        <el-form-item prop="temperature_json" label="热力稳定度:">
                                            <el-input v-model="cfdForm.temperature_json"
                                                    :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <div class="content content2 wtDensityParent" v-show="!simulationMode" :class="!terrain_WT_Valid?'terrainWTred':''">
                                    <wt-file-upload-panel id="wtFileUpload" ref="wtFileUpload" :projectId="projectId"></wt-file-upload-panel>
                                    <div class="wtDensity">
                                        <el-form ref="cfdForm2" :model="cfdForm" :rules="cfdRules2">                    
                                            <el-form-item prop="air_density_input" label="空气密度:">
                                                <el-input v-model="cfdForm.air_density_input"
                                                        :disabled="uploadLoading" class="gf-input" style="width: 190px;height: 30px"/>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                            <!-- 第二步结束 -->
                            </div>
                        </li>
            <!-- 第三步 -->
                        <li :class="tabIndex3 ? 'contentActive' :'' ">
                            <p class="arrowActive"> <span class="titleBox"> <span class="tabIcon"><icon name="feng1" style="width:16px;height:16px;"/></span> 上传测风数据 
                            <span class="errIcon" v-if="!iconActive3"><icon name="jingshi" style="width:18px;height:18px;"/>您输入的数据有误 !</span> </span>    <span class="arrow" @click="arrowChange(3)" ><icon name="arrow-right-copy"/></span> </p>
                            <div class="contentHeight contentHeight3 content content3 content4">
                                <el-upload  action="/"    class="jiweidianUpload"
                                    :before-upload="beforeMastlistUpload" :http-request="httpMastlistRequest"><button ref="mastlistUpload"></button></el-upload>

                                <!-- 第三步 -->
                                    <div class="tabHeader" :class="!epsg_dst_Valid?'redBorderValid':''">
                                        <el-form inline class="original-form-inline">
                                            <el-form-item>
                                                <div slot="label">
                                                    <div @mouseenter="epsgTipShow = true"
                                                        @mouseleave="epsgTipShow = false"
                                                    >源坐标系:
                                                    </div>
                                                    <!--tab3-->
                                                </div>
                                                <el-cascader
                                                        :options="pcsOptions"
                                                        :show-all-levels="false"
                                                        v-model="target_epsg_id"
                                                        popper-class="powerCurve"
                                                        @active-item-change="handleItemChange"
                                                        @change="onTargetChange"
                                                ></el-cascader>
                                            </el-form-item>
                                        </el-form>
                                        <div class="tabHeaderRight">
                                            <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                                content="导入文件" :visible-arrow="false">
                                                <span  @click="onClickMastlistUpload" style="display: inline-block;">
                                                    <icon name="daoru" style="width:18px;height:18px;color: rgba(212,239,246,0.6);transform: rotate(90deg);"/>
                                                </span>
                                            </el-tooltip>
                                            <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                                content="下载模板" :visible-arrow="false">
                                                <span style="display: inline-block;" @click="mastmoban">
                                                    <icon name="xiazaijiangyiicon" style="width:23px;height:23px;color: rgba(212,239,246,0.6);"/>
                                                </span>
                                            </el-tooltip>
                                            <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                                content="查看说明" :visible-arrow="false">
                                                <span style="display: inline-block;" @click="tooltipShow3 = true">
                                                    <icon name="shuoming" style="width:18px;height:18px;color: rgba(212,239,246,0.6);"/>
                                                </span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                <!-- 第三步 -->
                                    <el-form :model="mastList"  ref="mastListForm" status-icon :show-message="false">
                                        <el-table class="gf-table need-border mastTable" :data="mastList.data" >
                                            <el-table-column label="序号" width="40px" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item  >
                                                        <span>{{scope.$index+1}}</span>
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="90px" label="测风塔编号" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    
                                                    <el-form-item :prop="'data.'+scope.$index+'.code'" 
                                                    :rules="{validator: validateMastListCodea, trigger: 'blur' }"
                                                                >
                                                                
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue1?'offmytooltip':'onmytooltip'"
                                                    :content="/^[\w.-]{1,10}$/.test(scope.row.code) ? '允许输入数字、字母、中划线、字符不超10':'允许输入数字、字母、中划线、字符不超10'" 
                                                    :disabled="/^[\w.-]{1,10}$/.test(scope.row.code) || isTrue1 ? true : false"
                                                    :visible-arrow="false"
                                                    
                                                    placement="top">
                                                        <el-input v-model="scope.row.code" :disabled="uploadLoading"
                                                                class="gf-table-input"
                                                                v-if="!scope.row.isCopy"
                                                                                    
                                                        />                                          
                                                    </el-tooltip>
                                                        
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="投影坐标X" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item :prop="'data.'+scope.$index+'.x'"
                                                                :rules="{validator: validateX, trigger: 'blur' }">
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue2?'offmytooltip':'onmytooltip'"
                                                    :content="/^\d{8}(\.\d{1,4})?$/.test(scope.row.x) ? '八位正数,可带四位小数':'八位正数,可带四位小数'"
                                                    :disabled="/^\d{8}(\.\d{1,4})?$/.test(scope.row.x) || isTrue2 ? true : false"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==1"
                                                    placement="top">
                                                    
                                                        <el-input v-model="scope.row.x" :disabled="uploadLoading"
                                                                class="gf-table-input"
                                                                v-if="!scope.row.isCopy"
                                                                
                                                                 
                                                        />
                                                    </el-tooltip>
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue22?'offmytooltip':'onmytooltip'"
                                                    :content="scope.row.x>-180&&scope.row.x<180 ? '-180至180,可带四位小数':'-180至180,可带四位小数'"
                                                    :disabled="scope.row.x>-180&&scope.row.x<180&&scope.row.x!=0  || isTrue22 ? true : false"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==2"
                                                    placement="top">
                                                        <el-input v-model="scope.row.x" :disabled="uploadLoading"
                                                                class="gf-table-input"
                                                                v-if="!scope.row.isCopy"
                                                               
                                                        />
                                                    
                                                    </el-tooltip>
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue222?'offmytooltip':'onmytooltip'"
                                                    :content="/^\d{6}(\.\d{1,4})?$/.test(scope.row.x) ? '六位正数,可带四位小数':'六位正数,可带四位小数'"
                                                    :disabled="/^\d{6}(\.\d{1,4})?$/.test(scope.row.x) || isTrue222 ? true : false"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==3"
                                                    placement="top">
                                                    
                                                        <el-input v-model="scope.row.x" :disabled="uploadLoading"
                                                                class="gf-table-input"
                                                                v-if="!scope.row.isCopy"
                                                                
                                                        />
                                                    </el-tooltip>
                                                        
                                                        
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="投影坐标Y" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item :prop="'data.'+scope.$index+'.y'" id="elForm"
                                                                :rules="{validator: validateY, trigger: 'blur'}">
                                                    <el-tooltip class="item"
                                                    effect="light" 
                                                    :popper-class="isTrue3?'offmytooltip':'onmytooltip'"
                                                    :content="/^\d{7}(\.\d{1,4})?$/.test(scope.row.y) ? '七位正数,可带四位小数':'七位正数,可带四位小数'"
                                                    :disabled="/^\d{7}(\.\d{1,4})?$/.test(scope.row.y) || isTrue3 ? true : false"
                                                    v-show="isOpenTip==1 || isOpenTip==3"
                                                    :visible-arrow="false"
                                                    placement="top">
                                                        <el-input v-model="scope.row.y" :disabled="uploadLoading"
                                                                class="gf-table-input"
                                                                v-if="!scope.row.isCopy"
                                                               
                                                        />
                                                    </el-tooltip>
                                                    <el-tooltip class="item"
                                                    effect="light" 
                                                    :popper-class="isTrue33?'offmytooltip':'onmytooltip'"
                                                    :content="scope.row.y>-90&&scope.row.x<90 ? '-90至90,可带四位小数':'-90至90,可带四位小数'"
                                                    :disabled="scope.row.y>-90&&scope.row.y<90&&scope.row.x!=0 || isTrue33 ? true : false"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==2"
                                                    placement="top">
                                                        <el-input v-model="scope.row.y" :disabled="uploadLoading"
                                                                class="gf-table-input"
                                                                v-if="!scope.row.isCopy"
                                                                
                                                        />
                                                    </el-tooltip>
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="风数据文件(.txt)" width="140px" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item :prop="'data.'+scope.$index+'.filename_txt'" :rules="{validator: validateFileName, trigger: 'change'}">
                                                       
                                                        <file-feng-upload-button 
                                                        :project="projectId"
                                                        :filename="scope.row.filename_txt" 
                                                        @file-selected="setFengFile(scope.row, $event)"/>

                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="测风高度(米)" width="90px" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item :prop="'data.'+scope.$index+'.height'"
                                                                :rules="{validator: validateMastListHeighta, trigger: 'blur'}"
                                                                >
                                                                
                                                                <!-- :rules="{validator: validateMastListHeighta, trigger: 'blur'}" -->
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue4?'offmytooltip':'onmytooltip'"
                                                    :content="/^[\+]?\d+(\.\d)?$/.test(scope.row.height) ? '0-300，可保留一位小数':'0-300，可保留一位小数'"
                                                    :disabled="scope.row.height<300&&scope.row.height>0 || isTrue4 ? true : false"
                                                    :visible-arrow="false"
                                                    placement="top">
                                                        <el-input v-model="scope.row.height" :disabled="uploadLoading"
                                                                class="gf-table-input"
                                                                 
                                                                />
                                                    </el-tooltip>
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="30px" align="center">
                                                <template slot-scope="scope">
                                                    <div class="icon-mid zengjia">
                                                        <span class="icon green" style="cursor: pointer"
                                                        
                                                            @click="addRow(scope.$index, mastList.data , scope.row)">
                                                        <icon name="zengjia"></icon>
                                                    </span>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="测风文件(.tim/.tab)" width="140px" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item :prop="'data.'+scope.$index+'.filename'" :rules="{validator: validateFileName, trigger: 'change'}">
                                                        <file-upload-button 
                                                        :filename="scope.row.filename" 
                                                        :readonly="uploadLoading" 
                                                        @file-selected="setMastFile(scope.row, $event)"/>

                                                        
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="40px" align="center">
                                                <template slot-scope="scope">
                                                    <div class="icon-mid">
                                                        <span class="icon" @click="delRow(scope.$index, mastList.data)">
                                                            <icon name="remove" class="remove-btn"/>
                                                        </span>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-form>
                                    <div class="add-btn" @click="addMast">+ 新增</div>

                               <!-- 第三步结束 -->
                            </div>
                        </li>
            <!-- 第四步 -->
                        <!-- <li :class="tabIndex4 ? 'contentActive' :'' ">
                            <p class="arrowActive"> <span class="titleBox"> <span class="tabIcon"><icon name="fengji" style="width:20px;height:20px;position: relative;left: -2px;"/></span> 风机排布方案 
                            <span class="errIcon" v-if="!iconActive4"><icon name="jingshi" style="width:18px;height:18px;"/>您输入的数据有误 !</span> </span>    <span class="arrow" @click="arrowChange(4)" ><icon name="arrow-right-copy"/></span> </p>
                           
                            <div class="contentHeight contentHeight4 content content3 content4"> -->
                                <!-- 选择方案 -->
                                <!-- <div class="planChange">
                                    <div class="planBtn" @click="addPlan(false)"> <span>+</span> 添加已有方案</div>
                                    <div class="scroll">
                                        <span class="leftBtn" @click="changeLine('left',false)"><icon name="arrow-right-copy"/></span>
                                        <span class="rightBtn" @click="changeLine('right',false)"><icon name="arrow-right-copy"/></span>
                                        <div>
                                            <div class="line" id="dataLine" :style="{left: leftX +'px',width: (planArr1.length*150)+'px'}">
                                                <div v-for="(item,index) of planArr1" :key="index" :class="!item.readonly? 'readonly cursorInit' : 'cursorMouse' " >
                                                    <el-input v-model="item.scheme_name" :readonly="item.readonly" @click.native.stop="selectedPlan(item)" :style="item.isOpen?'background:rgba(51,200,111,0.6);border-radius:3px;':''"  class="gf-table-input nameIpt"/>  
                                                    <span class="hoverBtn" v-if="item.readonly"> <span @click.stop="item.readonly=false"><icon name="bianji"/></span>  <span @click.stop="removePlan(item,index)"><icon name="remove" class="removeIcon" /></span> </span>
                                                    <span class="clickBtn" v-if="!item.readonly" @click.stop="item.readonly=true">确认</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> -->
                                <!-- 选择优化排布 -->
                                <!-- <div class="opPlanChange">
                                    <div class="planBtn" @click="addPlan(true)"> <span>+</span> 添加自动化方案</div>
                                    <div class="scroll">
                                        <span class="leftBtn" @click="changeLine('left',true)"><icon name="arrow-right-copy"/></span>
                                        <span class="rightBtn" @click="changeLine('right',true)"><icon name="arrow-right-copy"/></span>
                                        <div>
                                            <div class="line" id="dataLineOp" :style="{left: leftX2 +'px',width: (planArr2.length*150)+'px'}">
                                                <div v-for="(item,index) of planArr2" :key="index" :class="!item.readonly? 'readonly cursorInit' : 'cursorMouse' " >
                                                    <el-input v-model="item.scheme_name" :readonly="item.readonly" @click.native.stop="selectedPlan(item)" :style="item.isOpen?'background:rgba(51,200,111,0.6);border-radius:3px;':''"  class="gf-table-input nameIpt"/>  
                                                    <span class="hoverBtn" v-if="item.readonly"> <span @click.stop="item.readonly=false"><icon name="bianji"/></span>  <span @click.stop="removePlan(item,index)"><icon name="remove" class="removeIcon" /></span> </span>
                                                    <span class="clickBtn" v-if="!item.readonly" @click.stop="item.readonly=true">确认</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> -->

                                <!-- 批量操作 -->
                                <!-- <div class="jiweiBox">
                                    <div class="iconBoxHeader">
                                        <span @click="changeJiwei" :class="isCanClick? 'isCanClick' : '' ">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            popper-class="onmytooltip"
                                            content="修改所选风机的机型参数"
                                            :visible-arrow="false"
                                            placement="top">
                                                <icon name="yingyong" style="width:20px;height:20px;color:#33C86F;"></icon>
                                            </el-tooltip>
                                        </span>
                                        <span @click="delAllJiwei" :class="isCanClick? 'isCanClick' : '' ">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            popper-class="onmytooltip"
                                            content="批量删除"
                                            :visible-arrow="false"
                                            placement="top">
                                                <icon name="remove" style="width:20px;height:20px;color:#33C86F;"></icon>
                                            </el-tooltip>
                                        </span>
                                    </div> -->
                                    <!-- 机位点列表 -->
                                    <!-- <div v-for="(item,index) of planArr1" :key="index" v-show="item.isOpen">
                                        <el-form :model="item" :ref="'turbineListRef'+item.id" status-icon >
                                            <el-table class="gf-table need-border content-table" :data="item.data" min-height= "50" max-height="250" @selection-change="handleSelectionChange">
                                                <el-table-column  type="selection" width="31" align="center">                   
                                                </el-table-column>
                                                <el-table-column label="序号" width="40px" header-align="center" align="center">
                                                    <template slot-scope="scope">
                                                        <el-form-item  >
                                                            <span>{{scope.$index+1}}</span>
                                                        </el-form-item>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column width="80px" label="风机编号" header-align="center" align="center">
                                                    <template slot-scope="scope">
                                                        <el-form-item :prop="'data.'+scope.$index+'.turbine_name'" 
                                                                    :rules="{validator: turbinListCode, trigger: 'blur'}">

                                                        <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue1b?'offmytooltip':'onmytooltip'"
                                                        :content="/^[\w.-]{1,10}$/.test(scope.row.turbine_name) ? '允许输入数字、字母、中划线、字符不超10':'允许输入数字、字母、中划线、字符不超10'" 
                                                        :disabled="/^[\w.-]{1,10}$/.test(scope.row.turbine_name) || isTrue1b ? true : false"
                                                        :visible-arrow="false"                                      
                                                        placement="top">
                                                            <el-input v-model="scope.row.turbine_name" :disabled="uploadLoading"
                                                                    class="gf-table-input"  
                                                            />

                                                        </el-tooltip>

                                                        </el-form-item>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column label="机型" width="131px" header-align="center" align="center">
                                                    <template slot-scope="scope">
                                                            
                                                        <el-form-item :prop="'data.'+scope.$index+'.turbine_type'"
                                                                    >
                                                            <el-select v-model="scope.row.turbine_type" :disabled="uploadLoading"
                                                                    popper-class="gf-popper" placeholder="请选择"
                                                                    @change="handleTurboTypeChangeNew(scope.$index, scope.row ,item)">
                                                                <el-option v-for="item2 of turbineOptions" :key="item2.key"
                                                                        :label="item2.label" :value="item2.value"/>
                                                            </el-select>
                                                        </el-form-item>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column width="109px" label="投影坐标X" header-align="center" align="center">
                                                    <template slot-scope="scope">
                                                        <el-form-item :prop="'data.'+scope.$index+'.x'"
                                                                    :rules="{validator: validateX, trigger: 'blur'}">

                                                        
                                                        <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue2b?'offmytooltip':'onmytooltip'"
                                                        :content="/^\d{8}(\.\d{1,4})?$/.test(scope.row.coordinate_x) ? '八位正数,可带四位小数':'八位正数,可带四位小数'"
                                                        :disabled="/^\d{8}(\.\d{1,4})?$/.test(scope.row.coordinate_x) || isTrue2b ? true : false"
                                                        :visible-arrow="false"
                                                        v-show="isOpenTip==1"
                                                        placement="top">
                                                            <el-input v-model="scope.row.coordinate_x" :disabled="uploadLoading"
                                                                    class="gf-table-input"  
                                                            />
                                                        
                                                        </el-tooltip>
                                                        <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue22b?'offmytooltip':'onmytooltip'"
                                                        :content="scope.row.coordinate_x>-180&&scope.row.coordinate_x<180 ? '-180至180,可带四位小数':'-180至180,可带四位小数'"
                                                        :disabled="scope.row.coordinate_x>-180&&scope.row.coordinate_x<180&&scope.row.coordinate_x!=0  || isTrue22b? true : false"
                                                        :visible-arrow="false"
                                                        v-show="isOpenTip==2"
                                                        placement="top">
                                                            <el-input v-model="scope.row.coordinate_x" :disabled="uploadLoading"
                                                                    class="gf-table-input"  
                                                            />
                                                        
                                                        </el-tooltip>
                                                        <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue222b?'offmytooltip':'onmytooltip'"
                                                        :content="/^\d{6}(\.\d{1,4})?$/.test(scope.row.coordinate_x) ? '六位正数,可带四位小数':'六位正数,可带四位小数'"
                                                        :disabled="/^\d{6}(\.\d{1,4})?$/.test(scope.row.coordinate_x) || isTrue222b ? true : false"
                                                        :visible-arrow="false"
                                                        v-show="isOpenTip==3"
                                                        placement="top">
                                                            <el-input v-model="scope.row.coordinate_x" :disabled="uploadLoading"
                                                                    class="gf-table-input"  
                                                            />
                                                        
                                                        </el-tooltip>
                                                    
                                                        </el-form-item>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column width="109px" label="投影坐标Y" header-align="center" align="center">
                                                    <template slot-scope="scope">
                                                        <el-form-item :prop="'data.'+scope.$index+'.coordinate_y'"
                                                                    :rules="{validator: validateY, trigger: 'blur'}">

                                                        <el-tooltip class="item"
                                                        effect="light" 
                                                        :popper-class="isTrue3b?'offmytooltip':'onmytooltip'"
                                                        :content="/^\d{7}(\.\d{1,4})?$/.test(scope.row.coordinate_y) ? '七位正数,可带四位小数':'七位正数,可带四位小数'"
                                                        :disabled="/^\d{7}(\.\d{1,4})?$/.test(scope.row.coordinate_y) || isTrue3b ? true : false"
                                                        :visible-arrow="false"
                                                        v-show="isOpenTip==1 || isOpenTip==3"
                                                        placement="top">
                                                            <el-input v-model="scope.row.coordinate_y" :disabled="uploadLoading"
                                                                    class="gf-table-input" 
                                                            />
                                                        </el-tooltip>
                                                        <el-tooltip class="item"
                                                        effect="light" 
                                                        :popper-class="isTrue33b?'offmytooltip':'onmytooltip'"
                                                        :content="scope.row.coordinate_y>-90&&scope.row.coordinate_y<90 ? '-90至90,可带四位小数':'-90至90,可带四位小数'"
                                                        :disabled="scope.row.coordinate_y>-90&&scope.row.coordinate_y<90&&scope.row.coordinate_y!=0  || isTrue33b? true : false"
                                                        :visible-arrow="false"
                                                        v-show="isOpenTip==2"
                                                        placement="top">
                                                            <el-input v-model="scope.row.coordinate_y" :disabled="uploadLoading"
                                                                    class="gf-table-input"
                                                                    v-show="!scope.row.isCopy"
                                                                    
                                                            />
                                                        </el-tooltip>
                                                        </el-form-item>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column label="轮毂高度(米)" width="90px" header-align="center" align="center">
                                                    <template slot-scope="scope">
                                                        <el-form-item :prop="'data.'+scope.$index+'.height'"
                                                                    :rules="{validator: validateMastListHeighta, trigger: 'blur'}">
                                                        <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        :content="/^[\+]?\d+(\.\d)?$/.test(scope.row.height) ? '0-300，可保留一位小数':'0-300，可保留一位小数'"
                                                        :disabled="scope.row.height<300&&scope.row.height>0 || isTrue4b? true : false"
                                                        :visible-arrow="false"
                                                        placement="top">
                                                            <el-input v-model="scope.row.height" :disabled="uploadLoading"
                                                                    class="gf-table-input"
                                                                    
                                                                    />
                                                        </el-tooltip>

                                                        </el-form-item>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column label="功率曲线文件" width="176px" header-align="center" align="center">
                                                    <template slot-scope="scope">
                                                        <div style="height: 33px;line-height: 33px">
                                                            
                                                            <el-cascader
                                                                    expand-trigger="hover"
                                                                    :options="scope.row.input_power_curve_list"
                                                                    v-model="scope.row.power_curve_filename"
                                                                    :show-all-levels="false"
                                                                    popper-class="powerCurve"
                                                                    @change="((value)=>{handleChangeNew( value, scope.row, item, scope.$index)})"
                                                            >
                                                            </el-cascader>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column width="52px" align="center">
                                                    <template slot-scope="scope">
                                                        <div class="icon-mid">
                                                        <span 
                                                            @click="delRow(scope.$index, item.data)">
                                                            <icon name="remove" class="remove-btn"/>
                                                        </span>
                                                        </div>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-form>  
                                        <div class="add-btn" @click="addTurbineNew(item)">+ 新增</div>
                                    </div>
                                   
                                </div>
                                    <el-upload
                                            class="upload-demo"
                                            action="/input_power_curve"
                                            :before-upload="beforeUploadNew"
                                            :http-request="httpRequestNew"
                                            :show-file-list="false"
                                            :on-success="onSuccessHandleNew"
                                            :drag="false"
                                            accept=".gfwtg,.wtg"
                                            v-show="false">
                                        <button size="small" type="primary" ref="button">点击上传</button>
                                    </el-upload>
                                    <el-button @click="upload" v-show="false">间接</el-button> -->
                                
                                <!-- 第四步 -->
                                <!-- 第四步结束 -->
                            <!-- </div> -->
                            <!-- 第四步结束 -->
                        <!-- </li> -->
                                <li :class="tabIndex4 ? 'contentActive' :'' ">
                            <p class="arrowActive"> <span class="titleBox"> <span class="tabIcon"><icon name="fengji" style="width:20px;height:20px;position: relative;left: -2px;"/></span> 风机排布方案 
                            <span class="errIcon" v-if="!iconActive4"><icon name="jingshi" style="width:18px;height:18px;"/>您输入的数据有误 !</span> </span>    <span class="arrow" @click="arrowChange(4)" ><icon name="arrow-right-copy"/></span> </p>
                            <div class="contentHeight contentHeight4 content content3 content4">
                                <div class="linshi">
                                    <a target="_blank" :href="turbineFileTempUrl">
                                        <div style="display: flex">
                                            <icon name="download" class="download-btn" style="color:#33C86F"/>
                                            <div class="text">下载模板</div>
                                        </div>
                                    </a>
                                    <el-upload ref="upload"
                                            style="display: inline"
                                            action="/input_turbine_file"
                                            :show-file-list="false"
                                            :http-request="parseTurbineFile"
                                            :on-change="onFileUploadChange">
                                        <div style="display: flex" slot="trigger">
                                            <icon name="load" class="upload-btn"/>
                                            <div class="text">导入文件</div>
                                        </div>
                                    </el-upload>
                                    <div class="shuoming">
                                        <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                            content="查看说明" :visible-arrow="false" :disabled="tooltipShow4">
                                            <span style="display: inline-block;" @click="tooltipShow4 = true">
                                                <icon name="shuoming" style="width:18px;height:18px;color: rgba(212,239,246,0.6);"/>
                                            </span>
                                        </el-tooltip>
                                    </div>
                                </div>
                                <!-- 第四步 -->
                                <div class="jiweiBox">
                                    <!-- <div class="iconBoxHeader">
                                        <span @click="changeJiwei" :class="isCanClick? 'isCanClick' : '' ">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            popper-class="onmytooltip"
                                            content="修改所选风机的机型参数"
                                            :visible-arrow="false"
                                            placement="top">
                                                <icon name="yingyong" style="width:20px;height:20px;color:#33C86F;"></icon>
                                            </el-tooltip>
                                        </span>
                                        <span @click="delAllJiwei" :class="isCanClick? 'isCanClick' : '' ">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            popper-class="onmytooltip"
                                            content="批量删除"
                                            :visible-arrow="false"
                                            placement="top">
                                                <icon name="remove" style="width:20px;height:20px;color:#33C86F;"></icon>
                                            </el-tooltip>
                                        </span>
                                    </div> -->
                                    <el-form :model="turbineList" ref="turbineListRef" status-icon >
                                        <el-table class="gf-table need-border content-table" :data="turbineList.data" min-height= "50" max-height="250" @selection-change="handleSelectionChange">
                                            <!-- <el-table-column  type="selection" width="34" align="center">                   
                                            </el-table-column> -->
                                            <el-table-column label="序号" width="40px" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item  >
                                                        <span>{{scope.$index+1}}</span>
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="80px" label="风机编号" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item :prop="'data.'+scope.$index+'.code'" 
                                                                :rules="{validator: turbinListCode, trigger: 'blur'}">

                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue1b?'offmytooltip':'onmytooltip'"
                                                    :content="/^[\w.-]{1,10}$/.test(scope.row.code) ? '允许输入数字、字母、中划线、字符不超10':'允许输入数字、字母、中划线、字符不超10'" 
                                                    :disabled="/^[\w.-]{1,10}$/.test(scope.row.code) || isTrue1b ? true : false"
                                                    :visible-arrow="false"                                      
                                                    placement="top">
                                                        <el-input v-model="scope.row.code" :disabled="uploadLoading"
                                                                class="gf-table-input"  
                                                        />

                                                    </el-tooltip>

                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="机型" width="130px" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                        <!-- :rules="{validator: validateSelecta, trigger: 'change'}" -->
                                                    <el-form-item :prop="'data.'+scope.$index+'.type'"
                                                    :rules="{validator: validateSelecta, trigger: 'change'}"
                                                                >
                                                        <el-select v-model="scope.row.type" :disabled="uploadLoading"
                                                                popper-class="gf-popper" placeholder="请选择"
                                                                @change="handleTurboTypeChange(scope.$index, scope.row)">
                                                            <el-option v-for="item in turbineOptions" :key="item.key"
                                                                    :label="item.label" :value="item.value"/>
                                                        </el-select>
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="125px" label="投影坐标X" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item :prop="'data.'+scope.$index+'.x'"
                                                                :rules="{validator: validateX, trigger: 'blur'}">

                                                    
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue2b?'offmytooltip':'onmytooltip'"
                                                    :content="/^\d{8}(\.\d{1,4})?$/.test(scope.row.x) ? '八位正数,可带四位小数':'八位正数,可带四位小数'"
                                                    :disabled="/^\d{8}(\.\d{1,4})?$/.test(scope.row.x) || isTrue2b ? true : false"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==1"
                                                    placement="top">
                                                        <el-input v-model="scope.row.x" :disabled="uploadLoading"
                                                                class="gf-table-input"  
                                                        />
                                                    
                                                    </el-tooltip>
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue22b?'offmytooltip':'onmytooltip'"
                                                    :content="scope.row.x>-180&&scope.row.x<180 ? '-180至180,可带四位小数':'-180至180,可带四位小数'"
                                                    :disabled="scope.row.x>-180&&scope.row.x<180&&scope.row.x!=0  || isTrue22b? true : false"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==2"
                                                    placement="top">
                                                        <el-input v-model="scope.row.x" :disabled="uploadLoading"
                                                                class="gf-table-input"  
                                                        />
                                                    
                                                    </el-tooltip>
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue222b?'offmytooltip':'onmytooltip'"
                                                    :content="/^\d{6}(\.\d{1,4})?$/.test(scope.row.x) ? '六位正数,可带四位小数':'六位正数,可带四位小数'"
                                                    :disabled="/^\d{6}(\.\d{1,4})?$/.test(scope.row.x) || isTrue222b ? true : false"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==3"
                                                    placement="top">
                                                        <el-input v-model="scope.row.x" :disabled="uploadLoading"
                                                                class="gf-table-input"  
                                                        />
                                                    
                                                    </el-tooltip>
                                                
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="125px" label="投影坐标Y" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item :prop="'data.'+scope.$index+'.y'"
                                                                :rules="{validator: validateY, trigger: 'blur'}">

                                                    <el-tooltip class="item"
                                                    effect="light" 
                                                    :popper-class="isTrue3b?'offmytooltip':'onmytooltip'"
                                                    :content="/^\d{7}(\.\d{1,4})?$/.test(scope.row.y) ? '七位正数,可带四位小数':'七位正数,可带四位小数'"
                                                    :disabled="/^\d{7}(\.\d{1,4})?$/.test(scope.row.y) || isTrue3b ? true : false"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==1 || isOpenTip==3"
                                                    placement="top">
                                                        <el-input v-model="scope.row.y" :disabled="uploadLoading"
                                                                class="gf-table-input" 
                                                        />
                                                    </el-tooltip>
                                                    <el-tooltip class="item"
                                                    effect="light" 
                                                    :popper-class="isTrue33b?'offmytooltip':'onmytooltip'"
                                                    :content="scope.row.y>-90&&scope.row.x<90 ? '-90至90,可带四位小数':'-90至90,可带四位小数'"
                                                    :disabled="scope.row.y>-90&&scope.row.y<90&&scope.row.x!=0  || isTrue33b? true : false"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==2"
                                                    placement="top">
                                                        <el-input v-model="scope.row.y" :disabled="uploadLoading"
                                                                class="gf-table-input"
                                                                v-show="!scope.row.isCopy"
                                                                
                                                        />
                                                    </el-tooltip>
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="轮毂高度(米)" width="90px" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    <el-form-item :prop="'data.'+scope.$index+'.height'"
                                                                :rules="{validator: validateMastListHeighta, trigger: 'blur'}">
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                    :content="/^[\+]?\d+(\.\d)?$/.test(scope.row.height) ? '0-300，可保留一位小数':'0-300，可保留一位小数'"
                                                    :disabled="scope.row.height<300&&scope.row.height>0 || isTrue4b? true : false"
                                                    :visible-arrow="false"
                                                    placement="top">
                                                        <el-input v-model="scope.row.height" :disabled="uploadLoading"
                                                                class="gf-table-input"
                                                                
                                                                />
                                                    </el-tooltip>

                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="功率曲线文件" width="176px" header-align="center" align="center">
                                                <template slot-scope="scope">
                                                    <div style="height: 33px;line-height: 33px">
                                                        <!--<span>{{getCurveFilename(scope.row.type)}}</span>-->
                                                        <el-cascader
                                                                expand-trigger="hover"
                                                                :options="scope.row.input_power_curve_list"
                                                                v-model="scope.row.power_curve_filename"
                                                                :show-all-levels="false"
                                                                popper-class="powerCurve"
                                                                @change="((value)=>{handleChange(value, scope.row, scope.$index)})"
                                                        >
                                                        </el-cascader>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="52px" align="center">
                                                <template slot-scope="scope">
                                                    <div class="icon-mid">
                                                    <span 
                                                        @click="delRow(scope.$index, turbineList.data)">
                                                        <icon name="remove" class="remove-btn"/>
                                                    </span>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-form>
                                </div>
                                    <div class="add-btn" @click="addTurbine">+ 新增</div>
                                    <el-upload
                                            class="upload-demo"
                                            action="/input_power_curve"
                                            :http-request="httpRequest"
                                            :show-file-list="false"
                                            :on-success="onSuccessHandle"
                                            :drag="false"
                                            accept=".gfwtg,.wtg"
                                            v-show="false">
                                        <button size="small" type="primary" ref="button">点击上传</button>
                                    </el-upload>
                                    <el-button @click="upload" v-show="false">间接</el-button>
                                
                                <!-- 第四步 -->
                                <!-- 第四步结束 -->
                            </div>
                        </li>


                        <li :class="tabIndex5 ? 'contentActive' :'' ">
                            <p class="arrowActive"> <span class="titleBox"> <span class="tabIcon"><icon name="daolu" style="width:15px;height:15px;"/></span> 设计道路参数 
                            <el-checkbox class="checkbox" v-model="jump5">跳过</el-checkbox>
                            <span class="errIcon" v-if="!gongIconActive5"><icon name="jingshi" style="width:18px;height:18px;"/>您输入的数据有误 !</span> </span>    <span class="arrow" @click="arrowChange(5)" ><icon name="arrow-right-copy"/></span> </p>
                            <div class="contentHeight">
                                55
                            </div>
                        </li>
                        <li :class="tabIndex6 ? 'contentActive' :'' ">
                            <p class="arrowActive"> <span class="titleBox"> <span class="tabIcon"><i class="iconfont icon-xianlu" style="font-size: 15px;"/></span> 设计集电线路 
                            <el-checkbox class="checkbox" v-model="jump6">跳过</el-checkbox>
                            <span class="errIcon" v-if="!gongIconActive6"><icon name="jingshi" style="width:18px;height:18px;"/>您输入的数据有误 !</span> </span>    <span class="arrow" @click="arrowChange(6)"  ><icon name="arrow-right-copy"/></span> </p>
                            <div class="contentHeight">
                                66
                            </div>
                        </li>
                        <li :class="tabIndex7 ? 'contentActive' :'' ">
                            <p class="arrowActive"> <span class="titleBox"> <span class="tabIcon"><icon name="shengyazhan" style="width:16px;height:16px;"/></span> 设计升压站 
                            <el-checkbox class="checkbox" v-model="jump7">跳过</el-checkbox>
                            <span class="errIcon" v-if="!gongIconActive7"><icon name="jingshi" style="width:18px;height:18px;"/>您输入的数据有误 !</span> </span>    <span class="arrow" @click="arrowChange(7)"  ><icon name="arrow-right-copy"/></span> </p>
                            <div class="contentHeight">
                                77
                            </div>
                        </li>
                    </ul>

                </div>
                <div class="bottomBtn"> 
                    <el-button class="gf-button" type="primary" @click.native="clickUpload()" >提交计算</el-button> 
                </div>
            </div>
            <div class="upload-success" v-if="uploadSuccess">
                <div class="container">
                    <img src="../../images/success-transparent.png" alt="">
                    <div class="notice">提交计算成功</div>
                    <div class="check" @click="goCheck">查看</div>
                </div>
            </div>
            <progress-bar ref="progressBar" @confirmCancel="onConfirmCancel"></progress-bar>

            <el-dialog title="批量调整机型数据"
                    :modal="false"
                    :visible.sync="dialogVisibleChange" 
                    :close-on-click-modal="false"
                    custom-class="changeDialog"
                    >
                <el-form :model="ruleFormChangeObj" ref="ruleFormChange" label-width="100px" class="demo-ruleForm">
                    <el-form-item  label="选中：">
                        {{ selectedChengguoIds.length }}台
                    </el-form-item>
                    <el-form-item  label="机型：" style="text-align: justify;">
                        <el-input v-model="ruleFormChangeObj.jixing" 
                        class="gf-table-input" />
                    </el-form-item>
                    <el-form-item  label="轮毂高度：">
                        <el-input v-model="ruleFormChangeObj.height" 
                        class="gf-table-input" />
                    </el-form-item>
                </el-form>
                <div class="btnBox">
                    <el-button class="gf-button" style="width: 208px;" type="primary" @click="submitForm">确定</el-button>
                </div>
            </el-dialog>
            <!-- txt确认框 -->
            <el-dialog title="测风通道匹配"
                    :modal="false"
                    :visible.sync="confirmShow" 
                    :close-on-click-modal="false"
                    custom-class="changeFengDialog">
                <div class="content ">
                    <el-form :model="fengList"  ref="fengListForm" status-icon :show-message="false">
                        <el-table class="gf-table need-border" :data="fengList.data" >
                            <el-table-column width="80px" label="通道类型" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-form-item >
                                        <span> {{scope.row.gallery_name}} </span>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column width="60px" label="高度" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-form-item >
                                        <span> {{scope.row.height}} </span>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column width="160px" label="标签" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-form-item >
                                        <span> {{scope.row.avg}} </span>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column width="160px" label="最大值" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-form-item >
                                        <span> {{scope.row.max}} </span> 
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column width="160px" label="最小值" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-form-item >
                                        <span> {{scope.row.min}} </span> 
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column width="160px" label="标准差" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-form-item >
                                        <span> {{scope.row.std}} </span> 
                                    </el-form-item>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </div>
                <div class="btnBox">
                    <el-button class="gf-button" style="width: 208px;" type="primary" @click="submitFengData">确定</el-button>
                </div>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import util from '../../libs/util';
    import UploadStatusIndicator from '../parameter-upload/upload-status-indicator';
    import FileUploader from '../fileupload/file-uploader';
    import FileUploadButton from '../fileupload/file-upload-button';
    import FileFengUploadButton from '../fileupload/file-feng-upload-button';
    import GfLine from '../common/gf-line';
    import progressBar from './progress-bar';
    import uploadFolder from '../upload/upload-folder';
    import uploadTerrain from '../upload/upload-terrain';
    import folderTable from '../upload/folderTable';
    // import wtFileUploadPanel from '../mode/wt-file-upload-panel';// 上传wt文件夹
    import wtFileUploadPanel from '../wt-file-upload/wt-file-upload-panel'; // 上传wt压缩文件
    import _ from 'lodash';
    import errTip from '../../components/cesium/err-tip';


    export default {
        name: 'parameter-upload-dialog-container',
        components: {
            UploadStatusIndicator,
            FileUploader,
            FileUploadButton,
            FileFengUploadButton,
            GfLine,
            progressBar,
            uploadFolder,
            folderTable,
            uploadTerrain,
            wtFileUploadPanel,
            errTip
        },
        data() {
            const validateSectionNum = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入扇区数'));
                }
                if (!/^[\d]*$/.test(value)) {
                    return callback(new Error('请输入整数值'));
                }
                if (parseInt(value) < 2 || parseInt(value) > 50) {
                    callback(new Error('有限范围: 2～50'));
                } else {
                    callback();
                }
            };
            const validateHorizontalResolution = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入水平网格分辨率'));
                }
                if (!/^[\d]+(\.[\d])?$/.test(value)) {
                    return callback(new Error('请输入1位小数的数值'));
                }
                if (parseFloat(value) < 1 || parseFloat(value) > 200) {
                    callback(new Error('有限范围: 1～200'));
                } else {
                    callback();
                }
            };
            const validateVerticalResolution = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入垂直网格分辨率'));
                }
                if (!/^[\d]+(\.[\d]{1,2})?$/.test(value)) {
                    return callback(new Error('请输入2位小数的数值'));
                }
                if (parseFloat(value) < 0.1 || parseFloat(value) > 2) {
                    callback(new Error('有限范围: 0.1～2'));
                } else {
                    callback();
                }
            };
            const validateTemperatureJson = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入热力稳定度'));
                }
                if (!/^[\d]?$/.test(value)) {
                    return callback(new Error('有限范围: 0～9'));
                    // }
                    // if (parseFloat(value) < 0.1 || parseFloat(value) > 2) {
                    //     callback(new Error('有限范围: 0.1～2'));
                } else {
                    callback();
                }
            };
            const validateAirDensity = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入空气密度'));
                }
                if (!/^[\d]+(\.[\d]{1,3})?$/.test(value)) {
                    return callback(new Error('保留3位小数'));
                }
                if (parseFloat(value) < 0 || parseFloat(value) > 1.5) {
                    callback(new Error('有限范围: 0～1.5'));
                } else {
                    callback();
                }
            };
            // 测风塔编号、风机编号、风机型号
            
            const validateMastListCode = (rule, value, callback) => {
                
                if (value === '') {
                    callback(new Error('请输入编号'));
                } 
                else if (!/^[A-Za-z0-9-]{1,10}$/.test(value)) {
                    callback(new Error('请正确输入'));
                } 
                else if (!/^[\w.-]{1,10}$/.test(value)) {
                    callback(new Error('允许输入数字、字母、中划线、字符不超10'));
                } 
                else {

                    callback();
                }
                
            };
            //风机编号
            const turbinListCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入编号'));
                } 
                else if (!/^[A-Za-z0-9-]{1,10}$/.test(value)) {
                    callback(new Error('请正确输入'));
                }
                else if (!/^[\w.-]{1,10}$/.test(value)) {
                    callback(new Error('允许输入数字、字母、中划线、字符不超10'));
                }
                 else {
                    callback();
                }
            };
            // 测风高度、轮毂高度
            const validateMastListHeight = (relu, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入高度'));
                } 
                // else if (!/^\d{1,3}(\.\d{1})?$/.test(value)) {
                //     callback(new Error('请正确输入'));
                // } 
                else if (!/^[\+]?\d+(\.\d)?$/.test(value)) {
                    callback(new Error('请正确输入,1-300,可保留一位小数'));
                } 
                else if (parseFloat(value) < 1 || parseFloat(value) > 300) {
                    callback(new Error('1-300,可保留一位小数'));
                } else {
                    callback();
                }
            };
            // 机型
            const validateSelect = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择参数'));
                } else {
                    callback();
                }
            };
            // 上传的文件名
            const validateFileName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择文件'));
                } else {
                    callback();
                }
            };
            return {
                isTrue1:true,
                isTrue2:true,
                isTrue22:true,
                isTrue222:true,
                isTrue3:true,
                isTrue33:true,
                isTrue4:true,
                isTrue1b:true,
                isTrue2b:true,
                isTrue22b:true,
                isTrue222b:true,
                isTrue3b:true,
                isTrue33b:true,
                isTrue4b:true,
                uploadSuccess: false,
                dialogVisible : false,
                projectId : "",
                tabIndex1 : true,
                tabIndex2 : false,
                tabIndex3 : false,
                tabIndex4 : false,
                tabIndex5 : false,
                tabIndex6 : false,
                tabIndex7 : false,
                validateMastListCodea: validateMastListCode,
                validateMastListHeighta: validateMastListHeight,
                turbinListCode: turbinListCode,
                validateSelecta: validateSelect,
                validateFileName: validateFileName,
                dialogVisibleChange: false,  //批量改删
                ruleFormChangeObj:{      //批量改删
                    jixing: "",
                    height: ""
                },
                isCanClick: true,
                selectedChengguoIds:[],
                iconActive1 : true,  //err图标出现
                iconActive2 : true,
                iconActive3 : true,
                iconActive4 : true,
                arrReady1: false,   //验证通过
                arrReady2: false,
                arrReady3: false,
                arrReady4: false,
                gongIconActive5: false, //工程可选部分---err图标出现
                gongIconActive6: false, 
                gongIconActive7: false, 
                gongarrReady5: '0', //工程可选部分---验证通过  0至灰 1可点击 2完成验证ok
                gongarrReady6: '0', 
                gongarrReady7: '0', 
                jump5: true,  //跳过
                jump6: true,
                jump7: true,
                simulationMode: true, // 流场仿真模式 T：GoldFoam；F：WT
                is_wt: "0",
                prevUploadInfo: this.defaultPrevUploadInfo(),
                isAerialUploaded: false,
                //
                uploadTabActiveFirst: true,
                uploadTerrainName: null,
                uploadTerrainBox: false,
                formInline: {
                    user: '',
                    region: ''
                },
                uploadCompleted: true,
                uploadedFolder: [],
                // expandTableClassName: 'height766',
                pcsOptions: [],
                epsg_src: null, // 源坐标系id
                epsg_dst: null, // 目标坐标系id
                epsg_id: null,
                target_epsg_id: null,
                epsg_src_Valid: true,  //验证出现redBorder
                epsg_dst_Valid: true,
                terrainValue_Valid: true,  //地形类型验证出现redBorder
                terrainUpload_Valid: true,  //地形上传验证出现redBorder
                terrainUpload_Valid2: true,  
                terrain_WT_Valid: true,  //仿真参数上传文件上传验证出现redBorder
                isOpenTip: 1,
                pcs:null,  //上一次的pcs名字
                mastList: {
                    data: []
                },
                turbineList: {
                    data: [
                        {
                            input_power_curve_list: [
                                {
                                    value: 'list',
                                    label: '功率曲线库',
                                    children: []
                                },
                                {
                                    value: 'upload',
                                    label: '自定义'
                                }
                            ],
                            power_curve_filename: []
                        }
                    ]
                },
                //第四步 optimize=>true=>优化
                planNameArr:[
                    
                ],
                planArr1:[],  //方案
                planArr2:[],  //优化
                leftX: 0,
                leftX2: 0,
                tmpRow: '', // 风机曲线暂存

                uploadLoading: false,
                cfdUploading: false,
                mastUploading: false,
                turbineUploading: false,
                cfdForm: {
                    section_num: '16',
                    horizontal_resolution: '25.0',
                    vertical_resolution: '2.00',
                    air_density_input: '1.225',
                    temperature_json: '2'
                },
                cfdRules: {
                    section_num: [
                        {validator: validateSectionNum, trigger: 'blur'}
                    ],
                    horizontal_resolution: [
                        {validator: validateHorizontalResolution, trigger: 'blur'}
                    ],
                    vertical_resolution: [
                        {validator: validateVerticalResolution, trigger: 'blur'}
                    ],
                    air_density_input: [
                        {validator: validateAirDensity, trigger: 'blur'}
                    ],
                    temperature_json: [
                        {validator: validateTemperatureJson, trigger: 'blur'}
                    ]
                },
                cfdRules2: {
                    air_density_input: [
                        {validator: validateAirDensity, trigger: 'blur'}
                    ]
                },
                turbineOptions: [],
                terrainList: [],
                terrainValue : "",  //地形类型
                terrainId: 0,  //// 0-平原、1-山地、2-丘陵、3-复杂山地
                waitingLoading: false,
                waitingUploading: false,
                confirmShow: false,   //txt确认框
                fengList: {
                    data: []
                },
                tooltipShow1: false,  //显示查看说明
                tooltipShow2: false,
                imgDetail: true,
                tooltipShow3: false,
                tooltipShow4: false,
               
            };
        },
        computed: {
           validateX() {
                // console.log(this.epsg_dst ,this.isOpenTip,"ID")
            //    return  (this.epsg_dst === 4326) ? this.validateWGS84X : this.validateCoordinateX;
            //      startsWith(内容)   检查是否以指定字符串 开头 ，返回布尔值 ,优化判断????不生效
                if(this.epsg_dst === 4326 || this.epsg_dst === 4490){
                        return this.validateWGS84X
                }
                else if(
                   this.epsg_dst === 32610  || this.epsg_dst === 32601  || this.epsg_dst === 32623  || this.epsg_dst === 32644  || this.epsg_dst === 32645
                || this.epsg_dst === 32611  || this.epsg_dst === 32602  || this.epsg_dst === 32624  || this.epsg_dst === 32643  || this.epsg_dst === 32646
                || this.epsg_dst === 32612  || this.epsg_dst === 32603  || this.epsg_dst === 32625  || this.epsg_dst === 32642  || this.epsg_dst === 32647
                || this.epsg_dst === 32613  || this.epsg_dst === 32604  || this.epsg_dst === 32626  || this.epsg_dst === 32641  || this.epsg_dst === 32648
                || this.epsg_dst === 32614  || this.epsg_dst === 32605  || this.epsg_dst === 32627  || this.epsg_dst === 32640  || this.epsg_dst === 32649
                || this.epsg_dst === 32615  || this.epsg_dst === 32606  || this.epsg_dst === 32628  || this.epsg_dst === 32639  || this.epsg_dst === 32650
                || this.epsg_dst === 32616  || this.epsg_dst === 32607  || this.epsg_dst === 32629  || this.epsg_dst === 32638  || this.epsg_dst === 32651  || this.epsg_dst === 32660
                || this.epsg_dst === 32617  || this.epsg_dst === 32608  || this.epsg_dst === 32630  || this.epsg_dst === 32637  || this.epsg_dst === 32652  || this.epsg_dst === 32659
                || this.epsg_dst === 32618  || this.epsg_dst === 32609  || this.epsg_dst === 32631  || this.epsg_dst === 32636  || this.epsg_dst === 32653  || this.epsg_dst === 32658
                || this.epsg_dst === 32619  || this.epsg_dst === 32621  || this.epsg_dst === 32632  || this.epsg_dst === 32635  || this.epsg_dst === 32654  || this.epsg_dst === 32657
                || this.epsg_dst === 32620  || this.epsg_dst === 32622  || this.epsg_dst === 32633  || this.epsg_dst === 32634  || this.epsg_dst === 32655  || this.epsg_dst === 32656
                ){
                        return this.valUTMX
                }
                else{
                        return this.validateCoordinateX
                }
            },
            validateY() {
                return (this.epsg_dst === 4326 || this.epsg_dst === 4490) ? this.validateWGS84Y : this.validateCoordinateY;
            },
            cfdParamChange: function () {
                const sectionNum1 = this.prevUploadInfo.cfdInfo.section_num;
                const sectionNum2 = this.cfdForm.section_num ? parseFloat(this.cfdForm.section_num) : null;
                const horizontalResolution1 = this.prevUploadInfo.cfdInfo.horizontal_resolution;
                const horizontalResolution2 = this.cfdForm.horizontal_resolution ? parseFloat(this.cfdForm.horizontal_resolution) : null;
                const verticalResolution1 = this.prevUploadInfo.cfdInfo.vertical_resolution;
                const verticalResolution2 = this.cfdForm.vertical_resolution ? parseFloat(this.cfdForm.vertical_resolution) : null;
                const airDensity1 = this.prevUploadInfo.cfdInfo.air_density_input;
                const airDensity2 = this.cfdForm.air_density_input ? parseFloat(this.cfdForm.air_density_input) : null;
                const temperatureJson1 = this.prevUploadInfo.cfdInfo.temperature_json;
                const temperatureJson2 = this.cfdForm.temperature_json ? parseFloat(this.cfdForm.temperature_json) : null;
                const epsgSrc1 = this.prevUploadInfo.cfdInfo.epsg_src;
                const epsgSrc2 = this.epsg_src ? parseFloat(this.epsg_src) : null;
                const epsgDst1 = this.prevUploadInfo.cfdInfo.epsg_dst;
                const epsgDst2 = this.epsg_dst ? parseFloat(this.epsg_dst) : null;
                if (sectionNum1 !== sectionNum2 || horizontalResolution1 !== horizontalResolution2 || verticalResolution1 !== verticalResolution2 || airDensity1 !== airDensity2 || temperatureJson1 !== temperatureJson2 || epsgSrc1 !== epsgSrc2 || epsgDst1 !== epsgDst2) {
                    return {
                        section_num: sectionNum2,
                        horizontal_resolution: horizontalResolution2,
                        vertical_resolution: verticalResolution2,
                        air_density_input: airDensity2,
                        temperature_json: temperatureJson2,
                        epsg_src: epsgSrc2,
                        epsg_dst: epsgDst2
                    };
                } else {
                    return null;
                }
            },
            cfdParamStatus: function () {
                if (this.cfdUploading) {
                    return 'uploading';
                }
                if (this.cfdParamChange) {
                    if (this.cfdParamChange.section_num || this.cfdParamChange.horizontal_resolution || this.cfdParamChange.vertical_resolution || this.cfdParamChange.air_density_input || this.cfdParamChange.temperature_json) {
                        return 'uploading';
                    } else {
                        return 'none';
                    }
                } else {
                    if (this.prevUploadInfo.cfdInfo.section_num && this.prevUploadInfo.cfdInfo.horizontal_resolution && this.prevUploadInfo.cfdInfo.vertical_resolution && this.prevUploadInfo.cfdInfo.air_density_input && this.prevUploadInfo.cfdInfo.temperature_json) {
                        return 'complete';
                    } else if (this.prevUploadInfo.cfdInfo.section_num || this.prevUploadInfo.cfdInfo.horizontal_resolution || this.prevUploadInfo.cfdInfo.vertical_resolution || this.prevUploadInfo.cfdInfo.air_density_input || this.prevUploadInfo.cfdInfo.temperature_json) {
                        return 'uploading';
                    } else {
                        return 'none';
                    }
                }
            },
            mastDataChange: function () {
                const opData = [];
                this.prevUploadInfo.mastInfo.forEach((item) => {
                    
                    let mast = this.mastList.data.find((i) => {
                        return i.id === item.mast_id;
                    });
                    if (!mast) {
                        opData.push({op: 'delete', data: item});
                    }
                });
               
                this.mastList.data.forEach((item, index) => {
                    //
                    let mast = this.prevUploadInfo.mastInfo.find((prevItem) => {
                        // console.log(prevItem)
                        return prevItem.mast_id === item.id;
                    });
                    //
                    if (!item.id) {
                        if (item.code || item.x || item.y || item.height || item.file) {
                            opData.push({op: 'insert', data: item});
                        }
                    } else if (item.code !== mast.mast_name || item.x !== mast.coordinate_x ||
                        item.y !== mast.coordinate_y || item.height !== mast.height || item.file || item.filename_txt) {
                        opData.push({op: 'update', data: item});
                    }
                });
                // console.log(opData)
                return opData;
            },
            mastDataStatus: function () {
                if (this.mastUploading) {
                    return 'uploading';
                }
                if (this.isMastListEmpty()) {
                    return 'none';
                }
                const mastDataChange = this.mastDataChange;
                if (mastDataChange.length > 0) {
                    return 'uploading';
                }
                let status = this.prevUploadInfo.mastInfo.length > 0 ? 'complete' : 'none';
                this.prevUploadInfo.mastInfo.forEach(item => {
                    if (!item.filename) {
                        status = 'uploading';
                    }
                });
                return status;
            },
            turbineDataChange: function () {
                const opData = [];
                this.prevUploadInfo.turbineInfo.forEach((item) => {
                    let turbine = this.turbineList.data.find((i) => {
                        return i.turbine_id === item.turbine_id;
                    });
                    if (!turbine) {
                        opData.push({op: 'delete', data: item});
                    }
                });
                this.turbineList.data.forEach((item, index) => {
                    let turbine = this.prevUploadInfo.turbineInfo.find((prevItem) => {
                        return prevItem.turbine_id === item.turbine_id;
                    });
                    if (!item.turbine_id) {
                        if (item.code || item.type || item.x || item.y || item.height || item.power_curve_filename) {
                            opData.push({op: 'insert', data: item});
                        }
                    } else if (item.code !== turbine.turbine_name || item.type !== turbine.turbine_type ||
                        item.x !== turbine.coordinate_x || item.y !== turbine.coordinate_y || item.height !== turbine.height ||
                        item.power_curve_filename !== turbine.power_curve_filename) {
                        opData.push({op: 'update', data: item});
                    }
                });
                // console.log(this.prevUploadInfo.turbineInfo,this.turbineList.data,opData)
                return opData;
            },
            turbineDataStatus: function () {
                if (this.turbineUploading) {
                    return 'uploading';
                }
                if (this.isTurbineListEmpty()) {
                    return 'none';
                }
                const turbineDataChange = this.turbineDataChange;
                if (turbineDataChange.length > 0) {
                    return 'uploading';
                }
                return this.prevUploadInfo.turbineInfo.length > 0 ? 'complete' : 'none';
            },
            //模板下载
            //测风塔
            mastFileTempUrl: function () {
                 return util.baseUrl + "/output_template?args=mast_coordinate";   //下载两个模版,改用mastmoban()
            },
             // 下载UAV模板
            terrainUavUrl() {
                return util.baseUrl + '/output_template?args=uav';// 无人机
            },
            // 、、、、、、、、、
            turbineFileTempUrl: function () {
                return util.baseUrl + '/input_turbine_file';
            },
            // 、、----
            loginUserInfo () {
                return this.$store.state.user.loginUserInfo;
            },
        },
        watch: {
            waitingUploading () {
                this.$store.commit('globeLoading', {loading: this.waitingUploading, text: '正在提交请稍后...'});
            },
            waitingLoading () {
                this.$store.commit('globeLoading', {loading: this.waitingLoading, text: '正在上传数据文件，请稍后...'});
            },
            //T：GoldFoam；F：WT
            simulationMode:function(val){
                if(val){
                    //is_wt ==新增区分模式==> 0 GF   1 WT
                    this.is_wt = "0";
                }else{
                    //is_wt ==新增区分模式==> 0 GF   1 WT
                    this.is_wt = "1";
                }
            },
            turbineList() {
                // console.log(this.turbineList.data,"watch")
                for (let item in this.turbineList.data) {
                    if (this.turbineList.data[item].power_curve_filename === 'upload') {
                        this.upload();
                    }
                }
            },
            epsg_id() {
                this.target_epsg_id = this.epsg_id;
            },
            target_epsg_id() {
                this.epsg_id = this.target_epsg_id;
            },
            // epsg_src// 源坐标系
            // epsg_dst // 目标坐标系
            epsg_src (val){
                // console.log("源坐标系=>"+val);
                if(!val){
                    this.epsg_src_Valid = false;
                    this.epsg_dst_Valid = false;
                }else{
                    this.epsg_src_Valid = true;
                    this.epsg_dst_Valid = true;
                }
            },
            epsg_dst (val){
                // console.log("目标坐标系=>"+val);
                if(!val){
                    this.epsg_src_Valid = false;
                    this.epsg_dst_Valid = false;
                }else{
                    this.epsg_src_Valid = true;
                    this.epsg_dst_Valid = true;
                }
            },
            //地形类型
            terrainValue(val){
                if(!val){
                    this.terrainValue_Valid = false;
                }else{
                    this.terrainValue_Valid = true;
                    console.log(val);
                    if(val == "平原"){
                        this.terrainId = 0;
                    }
                    else if(val == "山地"){
                        this.terrainId = 1;
                    }
                    else if(val == "丘陵"){
                        this.terrainId = 2;
                    }
                    else if(val == "复杂山地"){
                        this.terrainId = 3;
                    }
                }
            },
            terrainId (val){
                console.log(val);
                if(val == 0){
                    this.terrainValue = '平原';
                }
                else if(val == 1){
                    this.terrainValue = "山地";
                }
                else if(val == 2){
                    this.terrainValue = "丘陵";
                }
                else if(val == 3){
                    this.terrainValue = "复杂山地";
                }
            },
            //上传地形=>uploadTabActiveFirst=>true
            uploadTerrainName(val){
                // console.log(val)
                if(!val){
                    this.terrainUpload_Valid2 = false;
                }else{
                    this.terrainUpload_Valid2 = true;
                }
            },
            //上传地形=>uploadTabActiveFirst=>false
            // 'uploadedFolder':{
            //     handler:function(newValue,oldValue){
            //         console.log(newValue.length)
            //         if(newValue.length<=0){
            //             this.terrainUpload_Valid = false;
            //         }else{
            //             this.terrainUpload_Valid = true;
            //         }
            //     },
            //     deep:true,
            // },
            'planNameArr':{
                handler:function(newValue,oldValue){
                    console.log(newValue);
                    this.planArr1 = newValue.filter((item,index)=>{
                        return item.optimize == false;
                    })
                    this.planArr2 = newValue.filter((item,index)=>{
                        return item.optimize == true;
                    })
                }
            },


            tooltipShow2(val){
                if(!val){
                    this.imgDetail =true;
                }
            },
            waitingDel () {
                this.$store.commit('globeLoading', {loading: this.waitingDel, text: '正在删除数据...'});
            },
            jump5 (val){
                if(val){
                    this.gongarrReady5 = '0';
                    this.tabIndex5 = false;
                }else{
                    this.gongarrReady5 = '1';
                }
            },
            jump6 (val){
                if(val){
                    this.gongarrReady6 = '0';
                    this.tabIndex6 = false;
                }else{
                    this.gongarrReady6 = '1';
                }
            },
            jump7 (val){
                if(val){
                    this.gongarrReady7 = '0';
                    this.tabIndex7 = false;
                }else{
                    this.gongarrReady7 = '1';
                }
            }
        },
        created(){
            this.userInfo = this.$store.state.user.loginUserInfo;
            this.uploadTabActiveFirst = false;
        },
        mounted() {
            if(this.$store.state.user.loginUserInfo.role != 1){
                this.simulationMode = false;
            }
            // this.getFourList();
        },
        destroyed(){ },
        methods: {
             mergeTurbineList (newlist) {
                if (!newlist) return;

                let templist = this.turbineList.data || this.getDefaulTurbineList();
                for (let i = 0; i < templist.length; i++) {
                    if (!templist[i].code && !templist[i].x && !templist[i].y && !templist[i].height) {
                        templist.splice(i, 1);
                        i--;
                    }
                }

                newlist.forEach((item) => {
                    if (!item || isNaN(item.coordinate_x) || isNaN(item.coordinate_y)) return;
                    templist.push({
                        turbine_id: '',
                        code: item.turbine_name,
                        type: '',
                        x: item.coordinate_x,
                        y: item.coordinate_y,
                        height: item.height,
                        power_curve_filename: [],
                        input_power_curve_list: [
                            {
                                value: 'list',
                                label: '功率曲线库',
                                children: [],
                                disabled: true
                            },
                            {
                                value: 'upload',
                                label: '自定义',
                                disabled: true
                            }
                        ]
                    });
                });
                this.turbineList.data = templist.length === 0 ? this.getDefaulTurbineList() : templist;
            },
              getDefaulTurbineList () {
                return [
                    {
                        input_power_curve_list: [
                            {
                                value: 'list',
                                label: '功率曲线库',
                                children: []
                            },
                            {
                                value: 'upload',
                                label: '自定义'
                            }
                        ],
                        power_curve_filename: []
                    }
                ];
            },
             // 导入风机点位数据模板
            parseTurbineFile(option) {
                const formData = new FormData();
                const file = option.file;
                formData.append('turbine_file', file, file.name);
                option.headers['Content-Type'] = 'multipart/form-data';
                this.loading = this.$loading({
                    lock: true,
                    text: '文件上传中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                util.ajax.post(option.action, formData, {
                    headers: option.headers
                }).then((res) => {
                    this.loading.close();
                    if (res.data.code !== 201) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    // this.turbineList.data.splice(0, this.turbineList.data.length);
                    this.mergeTurbineList(res.data.data);
                }).catch(() => {
                    this.loading.close();
                    this.$message.error('文件上传失败');
                });
            },
             onFileUploadChange(file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, fileList.length - 1);
                }
            },
            // getFourList(){   //模拟获取数据
            //     this.planNameArr = [{
            //             scheme_name: "默认方案",
            //             id: 1,
            //             scheme_id: "",
            //             optimize: false,
            //             data:[],
            //             isOpen: true,
            //             readonly: true
            //         }]
            // },
            mastmoban(){
                let link = document.createElement('a');
                link.style.display = 'none';
                link.target = '_blank';
                link.href = util.baseUrl + "/output_template?args=mast_coordinate";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                let link2 = document.createElement('a');
                link2.style.display = 'none';
                link2.target = '_blank';
                link2.href = util.baseUrl + "/output_template?args=mast";
                document.body.appendChild(link2);
                link2.click();
                document.body.removeChild(link2);
            },
            // WGS84投影坐标X
            validateWGS84X(rule, value, callback) {
                if (value === '') {
                    this.zoneAllTip = true;
                    callback(new Error('X为-180-180，允许输入到小数点后四位'));
                }
                //  else if (!/^(([1-9]?[0-9]|1[0-7][0-9])(\.\d{1,4})?|180)$/.test(value)) {
                //     callback(new Error('X为0-180，允许输入到小数点后四位'));
                // } 
                // /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/
                 else if (!/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(value)) {
                    this.zoneAllTip = true;
                    callback(new Error('X为-180-180，允许输入到小数点后四位'));
                } 
                else {
                   
                    callback();
                }
            },
            // WGS84投影坐标Y
            validateWGS84Y(rule, value, callback) {
                if (value === '') {
                    this.zoneAllTip = true;
                    callback(new Error('Y为-90-90，允许输入到小数点后四位'));
                }
                //  else if (!/^(([1-9]?[0-9]|1[0-7][0-9])(\.\d{1,4})?|180)$/.test(value)) {
                //     callback(new Error('Y为0-180，允许输入到小数点后四位'));
                // }
                         // /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
                 else if (!/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(value)) {
                    this.zoneAllTip = true;
                    callback(new Error('Y为-90-90，允许输入到小数点后四位'));
                }
                 else {
                    
                    callback();
                }
            },
            valUTMX(rule, value, callback) {
                if (value === '') { 
                    callback(new Error('X为6位正数，允许输入到小数点后四位'));
                } else if (!/^[\d]{6}(\.\d{1,4})?$/.test(value)) {                 
                    callback(new Error('X为8位正���，允许输入到小数点后四位'));
                }
               
                else {
                   
                    callback();
                }
            },
            // 其他投影坐标X
            validateCoordinateX(rule, value, callback) {
                if (value === '') { 
                    callback(new Error('X为8位正数，允许输入到小数点后四位'));
                } else if (!/^[\d]{8}(\.\d{1,4})?$/.test(value)) {                   
                    callback(new Error('X为8位正数，允许输入到小数点后四位'));
                } 
                else {
                   
                    callback();
                }
            },
            // 其他投影坐标Y
            validateCoordinateY(rule, value, callback) {
                if (value === '') {
                    callback(new Error('X为7位正数，允许输入到小数点后两四位'));
                } else if (!/^[\d]{7}(\.\d{1,4})?$/.test(value)) {
                    callback(new Error('X为7位正数，允许输入到小数点后四位'));
                } 
                else {
                    
                    callback();
                }
            },
            //第一步
            //切换事件
            uploadTabChange(oldisTrue, isTrue){
                this.uploadTabActiveFirst = oldisTrue;
            },
            //切换事件
            simulationChange(isTrue){
                this.simulationMode = isTrue;
            },
            // 数据上传完成监听事件
            uploadCompletedHandle(status) {
                this.uploadCompleted = status;       
            },
            // 地形文件开始上传
            onUploadBegin() {
                this.uploadTerrainName = null;
                this.uploadTerrainBox = true;
            },
            // 地形文件上传完成
            uploadTerrainCompletedHandle(file) {
                this.uploadTerrainBox = false;  //上传文字显示
                var fileSize = file.size;
                if(fileSize<=0) {
                    this.$message.error('附件大小不能为0kb!');
                    return false;
                    
                }else {
                    this.uploadTerrainName = file.name;
                    this.$refs['progressBar'].closePorgressBar();
                }
            },
            //文件上传仍有问题,且有报错
            uploadErrHandle() {
                this.uploadTerrainBox = false;  //使上传按钮文字显示
            },
            // 获取upload组件返回的fileList
            fileFormChangeHandle(fileForm) {
                this.uploadedFolder = fileForm;
                // console.log(fileForm,"0000000")
            },
            // 内部table展开事件处理--类名是调整高度用的，现设置scroll,不需要了
            onExpandHandle(status) {
                // (status) ? this.expandTableClassName = 'height906' : this.expandTableClassName = 'height766';
            },
            onCloseProgressBar () {
                this.$refs['progressBar'].closePorgressBar();
            },
            //源坐标系事件
            onEpsgChange(value) {
                // console.log(value,"源坐标数据")
                this.loadEpsg_zone({pcs: value[0], latitude_zone: value[1], zone: value[2]})
                    .then(data => {
                        // console.log(data,"源坐标事件获取的数据")
                        this.epsg_src = data.epsg_id;
                        if (value[0] == 'GCS_WGS_1984' || value[0] == 'GCS_CN_2000') {
                            this.epsg_dst = data.epsg_id;
                            this.pcs = value[0]
                            //开启-180-180验证的提示
                            this.isOpenTip = 2
                           
                        }
                        else if(value[0] == "WGS_84_UTM"){
                            this.pcs = value[0]
                            this.epsg_dst = data.epsg_id;
                            //开启6位验证的提示
                            this.isOpenTip = 3   
                           
                        }
                        else{
                            this.pcs = null
                            this.target_epsg_id = this.epsg_id;
                            this.epsg_dst = data.epsg_id;               
                            //开启八位验证的提示
                            this.isOpenTip = 1  
                            
                        }
                        // console.log(this.pcs)
                    })
                    .catch(err => console.error(err));

                this.mastList.data = [{
                    id: null,
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                    filename: '',
                    filename_txt: '',
                }];
            },
            //源坐标系事件
            handleItemChange(val) {
                // console.log(val,"yuan")
                // 选择省
                if (val.length === 1) {
                    this.loadEpsg_zone({pcs: val[0]})
                        .then(data => {
                            if (data.latitude_zone[0] === null && data.latitude_zone.length === 1) return false;
                            let index = _.findIndex(this.pcsOptions, {label: val[0]});
                            this.pcsOptions[index].children = data.latitude_zone.map(value => {
                                return {
                                    label: value,
                                    value: value,
                                    children: []
                                };
                            });
                        })
                        .catch(err => console.error(err));
                    // 选择城市
                }
                if (val.length === 2) {
                    this.loadEpsg_zone({pcs: val[0], latitude_zone: val[1]})
                        .then(data => {
                            if (data.zone[0] === null && data.zone.length === 1) return false;
                            let index = _.findIndex(this.pcsOptions, {label: val[0]});
                            let i = _.findIndex(this.pcsOptions[index].children, {label: val[1]});
                            this.pcsOptions[index].children[i].children = data.zone.map(value => {
                                return {
                                    label: value,
                                    value: value
                                };
                            });
                        })
                        .catch(err => console.error(err));
                }
            },
            //第二步

            //第三步
            //测风塔信息
            onClickMastlistUpload(){
                this.$refs['mastlistUpload'].click();
            },
            //测风塔信息导入前
            beforeMastlistUpload(file){
                // console.log(file);
                if(file.type != "text/plain"){
                    this.$message.error("请选择后缀为.txt的文件！");
                    return false;
                }
            },
            //测风塔信息自定义
            httpMastlistRequest(option){
                
                this.waitingLoading = true;
                // console.log(option);
                let data = new FormData();
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                data.append('mast_coordinate', option.file,option.file.name);
                util.ajax.post("/reveal_mast_read", data, config)
                .then((res) => {
                    this.waitingLoading = false;
                    // console.log(res);
                    if(res.data.code == 201){
                        this.mergeMastList(res.data.data);
                    }
                })
                .catch((err) => {
                    this.waitingLoading = false;
                    console.log(err);
                    
                });
            },
            //导入push进mast原数据
            mergeMastList(newlist){
                let templist = this.mastList.data;   //id,code,x,y,height,filename,filename_txt
                
                for (let i = 0; i < templist.length; i++) {
                    if (!templist[i].code && !templist[i].x && !templist[i].y && !templist[i].height) {
                        templist.splice(i, 1);
                        i--;
                    }
                }
                // console.log(newlist);  //mast_name,coordinate_x,coordinate_y,height
                // console.log(templist);
                if(newlist.length>0){
                    newlist.forEach((item) => {
                        templist.push({
                            id: '',
                            code: item.mast_name,
                            x: item.coordinate_x,
                            y: item.coordinate_y,
                            height: item.height,
                            filename: '',
                            filename_txt: ''
                        });
                    })
                }
                this.mastList.data =  templist;

            },
            // 增加测风塔数据行
            addMast() {
                
                if (this.uploadLoading) {
                    return;
                }
                this.mastList.data.push({
                    id: null,
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                    filename_txt: '',
                    filename: '',
                    hidden: true
                });
                document.querySelector(".el-table__body-wrapper").scrollTop =  document.querySelector(".el-table__body-wrapper").scrollHeight;
            },
            // 获取测风塔文件名称
            setMastFile(row, event) {
                row.filename = event.name;
                row.file = event;
            },
            // 获取风数据
            setFengFile(row, obj){
                // console.log(row, obj);
                row.filename_txt = obj.name;
                row.file_txt = obj.file_txt;
                this.fengList.data = obj.data;
                this.confirmShow = true;
            },
            //确认提交txt
            submitFengData(){


                this.confirmShow = false;
            },
            // 删除风机点位数据行、删除测风塔数据行
            delRow(index, rows) {
                
                if (this.uploadLoading) {
                    return;
                }
                if (rows.length === 1) {
                    this.$message({
                        message: '不能删除最后一条数据！',
                        type: 'warning'
                    });
                } else {
                    
                    rows.splice(index, 1);
                }
            },
            // 复制新一行测风塔数据增加测风塔高度
            addRow(index, rows , obj) {
                // console.log(index,rows,obj)
               
                if(obj.code != "" && obj.x != "" && obj.y != ""){
                
                    if (this.uploadLoading) {
                        return;
                    }
                    rows.splice(index + 1, 0, {
                        id: null,
                        code: rows[index].code,
                        x: rows[index].x,
                        y: rows[index].y,
                        height: '',
                        filename: '',
                        hidden: false,
                        isCopy: true
                    });
                    this.towerList.push(rows[rows.length-1]);

                }else{
                    this.$message({
                        message:"此行数据内容不能为空"
                    })
                }
            },
            // 投影坐标系事件
            onTargetChange(value) {
                
                if(value[0] == "GCS_WGS_1984" || value[0] == "GCS_CN_2000"){
                    this.pcs = value[0]
                    // -180到180
                    this.isOpenTip = 2
                    
                }
                else if(value[0] == "WGS_84_UTM"){
                    this.pcs = value[0]
                    this.isOpenTip = 3
                    
                }else{
                    this.pcs = null
                    this.isOpenTip = 1
                   
                }

                this.loadEpsg_zone({pcs: value[0], latitude_zone: value[1], zone: value[2]})
                    .then(data => {
                        this.epsg_dst = data.epsg_id;
                    })
                    .catch(err => console.error(err));

                
                this.mastList.data = [{
                    id: null,
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                    filename: '',
                    filename_txt: '',
                }];
            },

            //第四步
            //添加方案
            addPlan( type ){
                this.planNameArr.forEach((item,index)=>{
                    item.isOpen = false;
                })
                if(!type){
                    this.planNameArr.push(
                       {
                            scheme_name: "新增方案",
                            id: Math.floor(Math.random()*1000),
                            scheme_id: "",
                            optimize: type,
                            data:[],
                            isOpen: true,
                            readonly: true
                        }
                    )
                }else{
                     this.planNameArr.push(
                       {
                            scheme_name: "新增优化方案",
                            id: Math.floor(Math.random()*1000),
                            scheme_id: "",
                            optimize: type,
                            data:{},
                            isOpen: true,
                            readonly: true
                        }
                    )
                }
            },
            //删除方案
            removePlan(item,index){
                if(this.planNameArr.length<=1){
                    this.$message.warning("至少存在一个方案！");
                    return;
                }
                this.planNameArr.forEach((item2,index2)=>{
                    if(item2.id == item.id){
                        this.planNameArr.splice(index2,1);
                    }
                })
            },
            //选中方案
            selectedPlan(item){
                if(!item.isOpen && item.readonly){
                    // console.log(item);
                    this.planNameArr.forEach((item2,index2)=>{
                        if(item2.id == item.id && item.readonly){
                            item2.isOpen = true;
                        }
                        if(item2.id != item.id){
                            item2.isOpen = false;
                        }
                    })
                }
            },
            //左右移动
            changeLine(type , optimize){
                if(!optimize){
                    var boxWidth = document.querySelector("#dataLine").clientWidth;
                    if(boxWidth <= 607){
                        return;
                    }
                    if(type == 'left'){
                        if( this.leftX <= (607-boxWidth) ){
                            this.leftX = (607-boxWidth);
                        }else{
                            this.leftX -= 150;
                        }
                    }else{
                        if(this.leftX >= 0){
                            this.leftX = 0;
                        }else{
                            this.leftX += 150;
                        }
                    }
                }else{
                    var boxWidth2 = document.querySelector("#dataLineOp").clientWidth;
                    if(boxWidth2 <= 607){
                        return;
                    }
                    if(type == 'left'){
                        if( this.leftX2 <= (607-boxWidth2) ){
                            this.leftX2 = (607-boxWidth2);
                        }else{
                            this.leftX2 -= 150;
                        }
                    }else{
                        if(this.leftX2 >= 0){
                            this.leftX2 = 0;
                        }else{
                            this.leftX2 += 140;
                        }
                    }
                }
            },

            //复选框事件
            handleSelectionChange(val) {
                
                this.selectedTurbineIds = [];
                val.forEach(row => {
                    this.selectedTurbineIds.push(row);
                });
                if(this.selectedTurbineIds.length<=0){
                    this.isCanClick = true;
                }else{
                    this.isCanClick = false;
                }
            },
            //修改所选风机的机型参数
            changeJiwei(){
                if(!this.isCanClick){
                    this.dialogVisibleChange = true;
                    // this.ruleFormChangeObj.jixing = this.turbineList.data[0].type;
                    // this.ruleFormChangeObj.height = this.turbineList.data[0].height;
                }  
            },
            //删除所选
            delAllJiwei(){
                if(!this.isCanClick){
                    // for (let i = 0; i < this.changeJiweiArr.length; i++) {
                    //     for (let j = 0; j < this.turbineListYouke.data.length; j++) {
                    //         if(this.turbineListYouke.data[j].id === this.changeJiweiArr[i].id){
                    //             this.turbineListYouke.data.splice(j,1);
                    //         }
                    //     }
                    // }
                }
            },
             //确定修改
            submitForm(){
                this.ruleFormChangeObj = {
                    jixing: "",
                    height: ""
                }
                this.dialogVisibleChange = false;
            },
            // 增加风机点位数据行
            addTurbine() {
                if (this.uploadLoading) {
                    return;
                }
                this.turbineList.data.push({
                    turbine_id: null,
                    code: '',
                    type: '',
                    x: '',
                    y: '',
                    power_curve_filename: null,
                    height: '',
                    input_power_curve_list: [
                        {
                            value: 'list',
                            label: '功率曲线库',
                            children: [],
                            disabled: true
                        },
                        {
                            value: 'upload',
                            label: '自定义',
                            disabled: true
                        }
                    ]
                });
            },
            addTurbineNew(obj){
                // console.log(obj);
                var newObj = {
                    id:  Math.floor(Math.random()*1000),  
                    turbine_id: "",
                    coordinate_x: "",
                    coordinate_y: "",
                    height: "",
                    power_curve_filename: null,
                    turbine_name: "",
                    turbine_type: "",
                    input_power_curve_list: [
                        {
                            value: 'list',
                            label: '功率曲线库',
                            children: [],
                            disabled: true
                        },
                        {
                            value: 'upload',
                            label: '自定义',
                            disabled: true
                        }
                    ]
                }
                obj.data.push(newObj);
            },
            getDefaultPowerCurveFileName (fileList ,type=false) {
                // console.log(fileList)
                if (!fileList || fileList.length === 0) return null;
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].value && String(fileList[i].value).toLowerCase().lastIndexOf('0.1.gfwtg') === String(fileList[i].value).length - 9) {
                        return fileList[i].value;
                    }
                }
                return fileList[0].value;
            },
            // 机型选择事件 
            handleTurboTypeChange(index, row) {

                let that =this;
                if (index === 0) {
                    const hasOtherType = this.turbineList.data.some((item, index) => {
                        if (index === 0) {
                            return false;
                        }
                        return !!item.type;
                    });

                    if (!hasOtherType) {
                        const type = this.turbineList.data[0].type;
                        this.loadTurbineTypeList(type, (list) => {
                            for (let i = 0; i < this.turbineList.data.length; i++) {
                                this.turbineList.data.splice(i, 1, {
                                    code: this.turbineList.data[i].code,
                                    type: type,
                                    x: this.turbineList.data[i].x,
                                    y: this.turbineList.data[i].y,
                                    turbine_id: this.turbineList.data[i].turbine_id,
                                    height: this.turbineList.data[i].height,
                                    power_curve_filename: ['list', that.getDefaultPowerCurveFileName(list)],
                                    input_power_curve_list: [
                                        {
                                            value: 'list',
                                            label: '功率曲线库',
                                            children: list
                                        },
                                        {
                                            value: 'upload',
                                            label: '自定义'
                                        }
                                    ]
                                });
                                this.deleting = true;
                            }
                        });
                    }
                    else{
                        this.loadTurbineTypeList(this.turbineList.data[0].type, (list) => {
                                this.turbineList.data.splice(0, 1, {
                                    code: this.turbineList.data[0].code,
                                    type: this.turbineList.data[0].type,
                                    x: this.turbineList.data[0].x,
                                    y: this.turbineList.data[0].y,
                                    turbine_id: this.turbineList.data[0].turbine_id,
                                    height: this.turbineList.data[0].height,
                                    power_curve_filename: ['list', that.getDefaultPowerCurveFileName(list)],
                                    input_power_curve_list: [
                                        {
                                            value: 'list',
                                            label: '功率曲线库',
                                            children: list
                                        },
                                        {
                                            value: 'upload',
                                            label: '自定义'
                                        }
                                    ]
                                });
                                this.deleting = true;
                        });
                    }


                } else {
                    this.loadTurbineTypeList(row.type, (list) => {
                        row.input_power_curve_list[0].children = list;
                        row.input_power_curve_list[0].disabled = false;
                        row.input_power_curve_list[1].disabled = false;
                        row.power_curve_filename = ['list', that.getDefaultPowerCurveFileName(row.input_power_curve_list[0].children)];
                    });
                }
            },
            //选择机型事件--新
            handleTurboTypeChangeNew(index,obj,row){
                // console.log(index,obj,row);
                let that =this;
                var hasOtherType = row.data.some((item2, index2) => {
                    if (index2 === 0) {
                        return false;
                    }
                    return !!item2.turbine_type;
                })
                // console.log(hasOtherType);
                //第一个第一次选就联动全部
                if (index == 0 && !hasOtherType) {   

                    const type = obj.turbine_type;
                    this.loadTurbineTypeList(type, (list) => {
                        that.planArr1.forEach((item1,index1)=>{
                            if(item1.id == row.id){
                                item1.data.forEach((item2,index2)=>{
                                    item2.turbine_type = type;
                                    item2.power_curve_filename = ['list', that.getDefaultPowerCurveFileName(list)];
                                    item2.input_power_curve_list = [
                                            {
                                                value: 'list',
                                                label: '功率曲线库',
                                                children: list
                                            },
                                            {
                                                value: 'upload',
                                                label: '自定义'
                                            }
                                        ]
                                })
                            }
                        })
                        
                    });

                }else{
                    const type = obj.turbine_type;
                    this.loadTurbineTypeList(type, (list) => {
                        obj.power_curve_filename = ['list', that.getDefaultPowerCurveFileName(list)];
                        obj.input_power_curve_list = [
                                {
                                    value: 'list',
                                    label: '功率曲线库',
                                    children: list
                                },
                                {
                                    value: 'upload',
                                    label: '自定义'
                                }
                            ]
                        
                    });

                }
            },
            //选择功率曲线事件--新
            handleChangeNew(value, obj, row, index){
                // console.log(value, obj, row, index);
                //如果选择自定义要弹框验证可修改名字
                if( value[0] == 'upload'){
                    this.tmpRow = obj;
                    obj.power_curve_filename = ['list', this.getDefaultPowerCurveFileName(obj.input_power_curve_list[0].children)];
                    this.upload();
                }
            },
            //上传自定义功率曲线 --新
            beforeUploadNew(file){
                // console.log(file);
                let stra = file.name.split(".")
                let strb = stra[stra.length-1]
                // console.log(strb)
                if(strb != 'wtg' && strb != 'gfwtg'){
                    this.$message.warning('请选择文件格式为.gfwtg/.wtg');
                    return false;
                }
                if ((file.name.length ) > 50) {
                    this.$message.error('文件名不得超过50个字符');
                    return false;
                }

            },
            httpRequestNew(option){
                // console.log(option);
                const formData = new FormData();
                var file = option.file;

                var a = file.name.indexOf("-");  
                if(a){
                    var bstr = file.name.charAt(a-1);
                    var cstr = file.name.charAt(a+1);
                    var strdd = file.name.charAt(0);
                    var p = /[a-z]/i; 
                    var pstr = p.test(strdd);
                }
                if(a == -1 || isNaN(bstr) || isNaN(cstr) || !pstr ){          
                    var html = "<p><p style='text-align:center'><i class='el-icon-warning' style='font-size:20px;margin: 0 10px 0 0;color:#D30147;vertical-align: middle;'></i>您输入的文件名格式有误 ！</p><p style='text-align:center'>正确示例 ： <span style='color: rgba(255, 255, 0, 0.6)'>GW140-2500-</span>TL0.1-AD1.225.wtg</p></p>"
                    this.$prompt('您的文件名格式有误', '修改功率曲线文件名称', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        message: html,
                        dangerouslyUseHTMLString: true,
                        inputValue: file.name,
                        inputValidator:function(value){
                            // console.log(value);
                            var isCheck = value.indexOf("-");
                            var strdd = value.charAt(0);
                            var p = /[a-z]/i; 
                            var pstr = p.test(strdd);
                            if( isCheck!= -1 && !isNaN(value.charAt(isCheck-1)) &&  !isNaN(value.charAt(isCheck+1)) && pstr ){
                                return true;
                            }else{
                                return false;
                            }
                        },
                        inputErrorMessage: "请按照示例格式修改文件名！",
                        customClass: "quxianClass"
                    }).then(({value}) => {
                        // console.log(value);
                        // console.log(this.tmpRow);
                        this.tmpRow.fileName = value;
                        formData.append(option.filename, file, value);
                        formData.append('user_id', this.userInfo.user_id);
                        formData.append('turbine_type', this.tmpRow.turbine_type);
                        option.headers['Content-Type'] = 'multipart/form-data';
                        option.headers['Accept'] = '*/*';
                        const config = {
                            headers: option.headers,
                            timeout: 3600000,
                            onUploadProgress: function (e) {
                                if (e.total > 0) {
                                    e.percent = e.loaded / e.total * 100;
                                }
                                option.onProgress(e);
                            }
                        };
                        util.ajax.post(option.action, formData, config).then((res) => {
                            option.onSuccess(res);
                            // console.log(11111111111111111111111)
                        }).catch(err => {
                            option.onError(err);
                        });
                        
                    }).catch((err) => {
                        console.log(err);
                        
                    });
                }else{
                    formData.append(option.filename, file, file.name);
                        formData.append('user_id', this.userInfo.user_id);
                        formData.append('turbine_type', this.tmpRow.turbine_type);
                        option.headers['Content-Type'] = 'multipart/form-data';
                        option.headers['Accept'] = '*/*';
                        const config = {
                            headers: option.headers,
                            timeout: 3600000,
                            onUploadProgress: function (e) {
                                if (e.total > 0) {
                                    e.percent = e.loaded / e.total * 100;
                                }
                                option.onProgress(e);
                            }
                        };
                        util.ajax.post(option.action, formData, config).then((res) => {
                            option.onSuccess(res);
                            this.tmpRow.fileName = file.name;
                            // console.log(11111111111111111111111)
                        }).catch(err => {
                            option.onError(err);
                        });
                }

            },
            onSuccessHandleNew(response, file, fileList){
                // console.log(response, file, fileList)
                console.log(this.tmpRow)
                let that = this;
                // 更新当前列
                this.loadTurbineTypeList(that.tmpRow.turbine_type, (list) => {
                    this.tmpRow.input_power_curve_list[0].children = list;
                    this.tmpRow.power_curve_filename = ['list', file.name==that.tmpRow.fileName?file.name:that.tmpRow.fileName];
                });
            },
            // 功率曲线选择事件
            handleChange(value, row, index) {
                if(value[1]){
                    let stra = value[1].split(".")
                    let strb = stra[stra.length-1]
                    // console.log(strb)
                    if(strb == 'wtg' || strb == 'gfwtg'){
                        if (index === 0 && value[0] !== 'upload') {
                            // for (let i = 0; i < this.turbineList.data.length; i++) {
                                this.turbineList.data.splice(index, 1, {
                                    code: this.turbineList.data[index].code,
                                    type: this.turbineList.data[index].type,
                                    x: this.turbineList.data[index].x,
                                    y: this.turbineList.data[index].y,
                                    turbine_id: this.turbineList.data[index].turbine_id,
                                    height: this.turbineList.data[index].height,
                                    power_curve_filename: row.power_curve_filename,
                                    input_power_curve_list: [
                                        {
                                            value: 'list',
                                            label: '功率曲线库',
                                            children: row.input_power_curve_list[0].children
                                        },
                                        {
                                            value: 'upload',
                                            label: '自定义'
                                        }
                                    ]
                                });
                                this.deleting = true;
                                this.bzbStatus = true;
                            // }
                        }

                    }else{
                        this.$message({
                            message:"文件格式必须为.gfwtg/.wtg"
                        })
                        this.bzbStatus = false
                    }
                }
                if (value[0] === 'upload') {
                    row.power_curve_filename = ['list', this.getDefaultPowerCurveFileName(row.input_power_curve_list[0].children)];
                    this.tmpRow = row;
                    this.upload();
                    
                }
               
            },
            onSuccessHandle(response, file, fileList) {
                // console.log(response, file, fileList)
                if(file.name){
                    let stra = file.name.split(".")
                    let strb = stra[stra.length-1]
                    // console.log(strb)
                    if(strb == 'wtg' || strb == 'gfwtg'){
                        this.$message.success('上传自定义功率曲线成功');
                    }
                }else{
                    this.$message({
                        message:"请修改文件格式为.gfwtg/.wtg"
                    })
                }


                // this.$message.success('上传自定义功率曲线成功');
                // 更新当前列
                this.loadTurbineTypeList(this.tmpRow.type, (list) => {
                    this.tmpRow.input_power_curve_list[0].children = list;
                    this.tmpRow.power_curve_filename = ['list', file.name];
                });
                
            },
            httpRequest(option) {
                const formData = new FormData();
                const file = option.file;

                // check  中文及空格
                if (/^.*[\u4e00-\u9fa5]+.*$/.test(file.name) || /^.*[\s]+.*$/.test(file.name)) {
                    this.$message.error('文件名中不能含有中文或空格。');
                    return;
                }
                const filename = file.name;
                const idx = filename.lastIndexOf('.');
                let ext = '';
                if (idx > -1) {
                    ext = filename.substring(idx + 1, filename.length);
                }
                if ((file.name.length - ext.length - 1) > 50) {
                    this.$message.error('文件名除去扩展名不得超过50个字符');
                    return;
                }

                formData.append(option.filename, file, file.name);
                formData.append('user_id', this.userInfo.user_id);
                formData.append('turbine_type', this.tmpRow.type);
                option.headers['Content-Type'] = 'multipart/form-data';
                option.headers['Accept'] = '*/*';
                const config = {
                    headers: option.headers,
                    timeout: 3600000,
                    onUploadProgress: function (e) {
                        if (e.total > 0) {
                            e.percent = e.loaded / e.total * 100;
                        }
                        option.onProgress(e);
                    }
                };
                util.ajax.post(option.action, formData, config).then((res) => {
                    option.onSuccess(res);
                }).catch(err => {
                    option.onError(err);
                });
            },
            // 间接调用upload
            upload() { 
                this.$refs.button.click();
            },
            //第二步cfd表单验证
            valid2(){
                var isTrue = true;
                if(this.$refs.cfdForm){
                    this.$refs.cfdForm.validate((valid) => {
                        console.log("cfdForm表单验证："+ valid);
                        isTrue = valid;
                        return valid;
                    });
                    return isTrue;
                }
                if(this.$refs.cfdForm2){
                    this.$refs.cfdForm2.validate((valid) => {
                        console.log("cfdForm2表单验证："+ valid);
                        isTrue = valid;
                        return valid;
                    });
                    return isTrue;
                }
            },
            //第三步测风数据表单验证
            valid3(){
                var isTrue3 = true;
                this.$refs.mastListForm.validate(valid => {
                    console.log("mastListForm表单验证："+ valid);
                    isTrue3 = valid;
                    return valid;
                });
                return isTrue3;
            },
            //第四步机位点数据表单验证
            valid4(){
                var isTrue4 = true;
                this.$refs.turbineListRef.validate(valid => {
                    console.log("turbineListRef"+ valid);
                    isTrue4 = valid;
                    return valid;
                });
                return isTrue4;
            },
            //每一步验证
            increase1(){
                //判断源坐标系epsg_src，地形类型terrainValue，地形上传uploadTabActiveFirst=true=>uploadedFolder[0].name / if=false=>uploadTerrainName
                if(this.uploadTabActiveFirst && this.uploadedFolder.length  && this.terrainValue && this.epsg_src){
                    this.iconActive1 = true;
                    this.arrReady1 = true;
                    return true;
                }
                else if(!this.uploadTabActiveFirst && this.uploadTerrainName && this.terrainValue && this.epsg_src){
                    this.iconActive1 = true;
                    this.arrReady1 = true;
                    return true;
                }
                else{
                    this.iconActive1 = false;
                    this.arrReady1 = false;
                    if(!this.epsg_src){
                        this.epsg_src_Valid = false;
                    }
                    if(!this.epsg_dst){
                        this.epsg_dst_Valid = false;
                    }
                    if(!this.terrainValue){
                        this.terrainValue_Valid = false;
                    }
                    if(this.uploadTabActiveFirst && this.uploadedFolder.length<=0){
                        this.terrainUpload_Valid = false;
                    }else{
                        this.terrainUpload_Valid = true;
                    }
                    if(!this.uploadTabActiveFirst && !this.uploadTerrainName){
                        this.terrainUpload_Valid2 = false;
                    }
                    return false;
                }
            },
            increase2(){
                this.valid2();
                if( !this.simulationMode  && this.$refs.wtFileUpload && this.$refs.wtFileUpload.fileName==null){
                    this.terrain_WT_Valid = false;
                }else{
                    this.terrain_WT_Valid = true;
                }
                //判断simulationMode=true=> valid2() , if=false=>cfdForm.air_density_input 、this.$refs.wtFileUpload.fileName!==null,
                if( this.simulationMode && this.valid2() ){
                    this.iconActive2 = true;
                    this.arrReady2 = true;
                    return true;
                }
                else if( !this.simulationMode && this.valid2() && this.$refs.wtFileUpload && this.$refs.wtFileUpload.fileName!==null ){
                    this.iconActive2 = true;
                    this.arrReady2 = true;
                    return true;
                }
                else{
                    this.iconActive2 = false;
                    this.arrReady2 = false;
                    return false;
                }
            },
            increase3(){
                this.valid3();
                //判断目标坐标系epsg_dst，表格验证this.valid3()
                if( this.epsg_dst && this.valid3() ){
                    this.iconActive3 = true;
                    this.arrReady3 = true;
                    return true;
                }else{
                    this.iconActive3 = false;
                    this.arrReady3 = false;
                    return false;
                }
            },
            increase4(){
                // //验证多个方案
                // if( ){

                // }
                this.valid4();
                if( this.valid4() ){
                    this.iconActive4 = true;
                    this.arrReady4 = true;
                    return true;
                }else{
                    this.iconActive4 = false;
                    this.arrReady4 = false;
                    return false;
                }
                
            },
            increase5(){
                
                return true;
            },
            increase6(){
                
                return true;
            },
            increase7(){
                
                return true;
            },
            //总验证
            increaseAll(){
                this.increase1();
                this.increase2();
                this.increase3();
                this.increase4();
                // this.increase5();
                // this.increase6();
                // this.increase7();

            },
            clickUpload(){   
                this.increaseAll();
        
                if(this.arrReady1 && this.arrReady2 && this.arrReady3 && this.arrReady4){
                    this.waitingUploading = true;
                    this.doUpload();
                }else{
                    this.$message.error("数据验证未通过，请修改后再重试！")
                } 
                
            },
            //提交计算  --  计算总进程
            doUpload() {
                // 队列上传成功后会调用开始计算接口
                const p1 = this.uploadCfd();
                const p2 = this.uploadMastInfo();
                const p3 = this.uploadTurbineInfo();
                const p4 = this.uploadTerrainId();
                this.uploadLoading = true;
                Promise.all([p1, p2, p3 ,p4]).then(() => {
                    
                    // console.log(this.cfdParamStatus); 
                    let args = '';
                   
                    if (this.simulationMode) {
                        // 选择了goldfoam模式
                        args = this.uploadTabActiveFirst ? 'main_0' : 'main_1';
                    } else {
                        // 选择了wt模式
                        args = this.uploadTabActiveFirst ? 'wt_main_0' : 'wt_main_1';
                    }
                    let data = {
                        args: args
                    };
                   
                    util.ajax.post(`/calculate/${this.projectId}/1`, data).then((res) => {
                        if (res.data.code !== 200) {
                            this.$message.error(res.data.message);
                            this.uploadLoading = false;
                        } else {
                            this.uploadSuccess = true;  //显示上传页面  或  点击查看按钮
                            this.uploadLoading = false;
                            this.waitingUploading = false;
                        }
                        
                    }).catch(() => {
                        this.$message.error('启动计算处理失败');
                        this.uploadLoading = false;
                        this.waitingUploading = false;
                    });
                }).catch((err) => {
                    this.waitingUploading = false;
                    this.uploadLoading = false;
                    this.$message.error('上传失败');
                    console.error(err);
                });;
            },
            //上传地形类型
            uploadTerrainId(){
                let data = new FormData();
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 90000,
                }
                data.append('terrain_id', this.terrainId);
                return util.ajax.post(`/input_terrain/${this.projectId}`,data, config).then((res) => {
                    // console.log(res,"地形类型接口");
                    if(res.data.code != 201){
                        throw res.data.message;
                    }
                    console.log("上传地形类型接口ok");
                }).catch((err) => {
                    this.$message.error('上传地形类型失败！');
                    throw err;
                });
            },
            // 上传仿真参数
            uploadCfd() {
                const cfdData = this.cfdParamChange;
                cfdData.temperature_json = `[${_.fill(Array(cfdData.section_num), cfdData.temperature_json)}]`;
                cfdData.is_wt = this.is_wt;
                console.log(cfdData);
                if (!cfdData) {
                    return new Promise((resolve) => {
                        resolve();
                    });
                }
                this.cfdUploading = true;
                
                return util.ajax.post('/input_cfd/' + this.projectId, cfdData).then((res) => {
                    this.cfdUploading = false;
                    if (res.data.code !== 201) {
                        throw res.data.message;
                    } else {
                        console.log('input_cfd ok');
                        this.prevUploadInfo.cfdInfo = cfdData;
                    }
                }).catch((err) => {
                    this.cfdUploading = false;
                    throw err;
                });
            },
            // 上传测风塔数据 
            uploadMastInfo() {
                const opData = this.mastDataChange;
                this.mastUploading = true;
                const p = opData.map((item) => {
                    console.log(item)
                    const formData = new FormData();
                    formData.append('mast_name', item.data.code);
                    formData.append('coordinate_x', item.data.x);
                    formData.append('coordinate_y', item.data.y);
                    formData.append('height', item.data.height);
                    
                    // 
                    if (item.data.file) {
                        formData.append('mast_file', item.data.file, item.data.file.name);
                    }
                    if (item.data.file_txt) {
                        formData.append('filename_txt', item.data.file_txt);
                    }
                    const config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    };
                    if (item.op === 'insert') {
                        return util.ajax.post('input_mast/' + this.projectId, formData, config).then(res => {
                            if (res.data.code !== 201) {
                                throw res.data.message;
                            }
                            console.log('input_mast ok');
                        });
                    } else if (item.op === 'update') {
                        // return util.ajax.put('input_mast/' + this.projectId + '/' + item.data.id, formData, config).then(res => {
                            return util.ajax.post('mast_alter/' + this.projectId + '/' + item.data.id, formData, config).then(res => {
                            if (res.data.code !== 201) {
                                throw res.data.message;
                            }
                            console.log('input_mast ok');
                        });
                    } else {
                        return util.ajax.delete('input_mast/' + this.projectId + '/' + item.data.mast_id).then(res => {
                            if (res.data.code !== 204) {
                                throw res.data.message;
                            }
                            console.log('input_mast ok');
                        });
                    }
                });
                return Promise.all([...p]).then(() => {
                    return this.loadMastInfo().then(() => {
                        this.mastUploading = false;
                    });
                }).catch((err) => {
                    this.mastUploading = false;
                    throw err;
                });
            },
             // 上传机位点数据
            uploadTurbineInfo() {
                const opData = this.turbineDataChange;
                this.turbineUploading = true;
                const p = opData.map((item) => {
                    const data = {
                        turbine_name: item.data.code,
                        turbine_type: item.data.type,
                        coordinate_x: item.data.x,
                        coordinate_y: item.data.y,
                        height: item.data.height,
                        power_curve_filename: item.data.power_curve_filename[1]
                    }; 
                    var config = {
                        timeout: 600000
                    };
                    if (item.op === 'insert') {
                        return util.ajax.post('input_turbine/' + this.projectId + '/1', data ,config).then(res => {
                            if (res.data.code !== 201) {
                                throw res.data.message;
                            }
                            console.log('input_turbine ok');
                        });
                    } else if (item.op === 'update') {
                        return util.ajax.put('input_turbine/' + this.projectId + '/1/' + item.data.turbine_id, data ,config).then(res => {
                            if (res.data.code !== 201) {
                                throw res.data.message;
                            }
                            console.log('input_turbine ok');
                        });
                    } else {
                        return util.ajax.delete('input_turbine/' + this.projectId + '/1/' + item.data.turbine_id ,config).then(res => {
                            if (res.data.code !== 204) {
                                throw res.data.message;
                            }
                            console.log('input_turbine ok');
                        });
                    }
                });
                return Promise.all([...p]).then(() => {
                   
                    this.turbineUploading = false;
                }).catch(err => {
                    this.turbineUploading = false;
                    throw err;
                });
            },
            //跳转进度界面
            goCheck() {
                this.dialogVisible = false;
                this.$emit('calculateStarted', this.projectId );
            },
            tooltipShowInit(){
                this.tooltipShow1 = false;
                this.tooltipShow2 = false;
                this.tooltipShow3 = false;
                this.tooltipShow4 = false;
            },
            //展开每一步内容
            arrowChange(num){
                this.tooltipShowInit();
                this.increaseAll(); //验证
                switch (num) {
                    case 1:
                        this.arrowInit(1);
                        
                    break;
                    case 2:
                        this.arrowInit(2);
                        
                    break;
                    case 3:
                        this.arrowInit(3);
                        
                    break;
                    case 4:
                        this.arrowInit(4);
                        
                    break;
                    case 5:
                        if(this.gongarrReady5 != '0'){
                            this.arrowInit(5);
                            
                        }
                    break;
                    case 6:
                        if(this.gongarrReady6 != '0'){
                            this.arrowInit(6);
                            
                        }
                    break;
                    case 7:
                        if(this.gongarrReady7 != '0'){
                            this.arrowInit(7);
                            
                        }
                    break;
                }
            },
            arrowInit(num){
                for(let i=1; i<=7; i++){
                    if(i != num){
                        this['tabIndex'+i] = false;
                    }
                }
                this['tabIndex'+num] = !this['tabIndex'+num];
            },
            jumpInit(){
                this.jump5 = true;
                this.jump6 = true;
                this.jump7 = true;
            },
            init(){
                this.arrowInit();
                this.jumpInit();
                this.tabIndex1 = true;
                this.iconActive1 = true;
                this.iconActive2 = true;
                this.iconActive3 = true;
                this.iconActive4 = true;
                this.arrReady1 = false;
                this.arrReady2 = false;
                this.arrReady3 = false;
                this.arrReady4 = false;
                this.gongarrReady5 = '0';
                this.gongarrReady6 = '0';
                this.gongarrReady7 = '0';
                this.gongIconActive5 = true;
                this.gongIconActive6 = true;
                this.gongIconActive7 = true;

                this.prevUploadInfo = this.defaultPrevUploadInfo();
                this.isAerialUploaded = false;
                this.mastList.data = [];
                this.turbineList.data = [];
                this.uploadLoading = false;
                this.cfdUploading = false;
                this.uploadSuccess = false;
                //获取地形数据
                util.ajax.get('/evaluation_params', {}).then((res) => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }

                    this.terrainList = retData.data.terrain;
                }).catch((/* err */) => {
                    this.$message.error('取得下拉列表框内容失败！');
                });
                //初始化机型列表
                if (this.turbineOptions.length < 1) {
                    util.ajax.get('/properties/'+ this.loginUserInfo.user_id, {
                        params: {
                            key: 'turbines'
                        }
                    }).then((res) => {
                        if (res.data.code !== 200) {
                            this.$message.error(res.data.message);
                            return;
                        }
                        let temp=[];
                        res.data.data.items.forEach((item,index) => {
                            temp.push({
                                key:'T'+index,
                                value: item,
                                label: item
                            });
                        });
                        this.turbineOptions=temp;
                    }).catch(() => {
                        this.$message.error('获取机型列表失败');
                    });
                }
                this.loadEpsg_zone({}).then(data => {
                    this.pcsOptions = data.map(value => {
                        if (value.children === 'true') {
                            return {
                                label: value.pcs,
                                value: value.pcs,
                                children: []
                            };
                        } else {
                            return {
                                label: value.pcs,
                                value: value.pcs
                            };
                        }
                    });
                    this.loadEpsg();
                    this.loadTerrainFile();
                }).catch(err => console.error(err));
            },
            //查询地形
            loadTerrainFile() {
                util.ajax.get('/terrain_check/' + this.projectId)
                .then(res => {
                    if (res.data.code === 201) {
                        this.uploadTerrainName = res.data.data.filename;
                        this.terrainId = res.data.data.terrain_id;
                    }
                })
                .catch(err => {
                    this.$message.error(err);
                });
            },
            // 获取已经上传的目标坐标系和源坐标系数值
            loadEpsg() {
                util.ajax.get('/project_epsg/' + this.projectId)
                    .then(res => {

                        // console.log(res,"end")
                        if (res.data.code === 404) return console.error(res.data.message);
                        this.epsg_src = res.data.data.epsg_src_info.epsg_id;
                        this.epsg_dst = res.data.data.epsg_dst_info.epsg_id;

                        this.pcs = res.data.data.epsg_dst_info.pcs

                        // console.log(this.epsg_src,this.epsg_dst,"获取已经上传后的数据",res.data.data.epsg_dst_info.pcs)
                        if(this.pcs == "WGS_84_UTM"){
                            this.isOpenTip = 3
                        }else if(this.pcs == "GCS_WGS_1984" || this.pcs == "GCS_CN_2000"){
                            this.isOpenTip = 2
                        }else{
                            this.isOpenTip = 1
                        }
                        
                        // 判断是仅选择一级，还是三级全选
                        if (res.data.data.epsg_src_info.latitude_zone) {
                            this.loadEpsg_zone({pcs: res.data.data.epsg_src_info.pcs})
                                .then(data => {
                                    if (data.latitude_zone[0] === null && data.latitude_zone.length === 1) return false;
                                    let index = _.findIndex(this.pcsOptions, {label: res.data.data.epsg_src_info.pcs});
                                    this.pcsOptions[index].children = data.latitude_zone.map(value => {
                                        return {
                                            label: value,
                                            value: value,
                                            children: []
                                        };
                                    });
                                    this.loadEpsg_zone({
                                        pcs: res.data.data.epsg_src_info.pcs,
                                        latitude_zone: res.data.data.epsg_src_info.latitude_zone
                                    })
                                        .then(data => {
                                            if (data.zone[0] === null && data.zone.length === 1) return false;
                                            let index = _.findIndex(this.pcsOptions, {label: res.data.data.epsg_src_info.pcs});
                                            let i = _.findIndex(this.pcsOptions[index].children, {label: res.data.data.epsg_src_info.latitude_zone});
                                            this.pcsOptions[index].children[i].children = data.zone.map(value => {
                                                return {
                                                    label: value,
                                                    value: value
                                                };
                                            });
                                            this.epsg_id = [res.data.data.epsg_dst_info.pcs, res.data.data.epsg_dst_info.latitude_zone, res.data.data.epsg_dst_info.zone];
                                            // console.log(this.epsg_id,"改动后")
                                            // this.epsg_id = [res.data.data.epsg_src_info.pcs, res.data.data.epsg_src_info.latitude_zone, res.data.data.epsg_src_info.zone];
                                        })
                                        .catch(err => console.error(err));
                                })
                                .catch(err => console.error(err));
                        } else {
                            this.epsg_id = [res.data.data.epsg_src_info.pcs];
                        }
                        if (res.data.data.epsg_dst_info.latitude_zone) {
                            this.loadEpsg_zone({pcs: res.data.data.epsg_dst_info.pcs})
                                .then(data => {
                                    if (data.latitude_zone[0] === null && data.latitude_zone.length === 1) return false;
                                    let index = _.findIndex(this.pcsOptions, {label: res.data.data.epsg_dst_info.pcs});
                                    this.pcsOptions[index].children = data.latitude_zone.map(value => {
                                        return {
                                            label: value,
                                            value: value,
                                            children: []
                                        };
                                    });
                                    this.loadEpsg_zone({
                                        pcs: res.data.data.epsg_dst_info.pcs,
                                        latitude_zone: res.data.data.epsg_dst_info.latitude_zone
                                    })
                                        .then(data => {
                                            if (data.zone[0] === null && data.zone.length === 1) return false;
                                            let index = _.findIndex(this.pcsOptions, {label: res.data.data.epsg_dst_info.pcs});
                                            let i = _.findIndex(this.pcsOptions[index].children, {label: res.data.data.epsg_dst_info.latitude_zone});
                                            this.pcsOptions[index].children[i].children = data.zone.map(value => {
                                                return {
                                                    label: value,
                                                    value: value
                                                };
                                            });
                                            this.target_epsg_id = [res.data.data.epsg_dst_info.pcs, res.data.data.epsg_dst_info.latitude_zone, res.data.data.epsg_dst_info.zone];
                                        })
                                        .catch(err => console.error(err));
                                })
                                .catch(err => console.error(err));
                        } else {
                            this.target_epsg_id = [res.data.data.epsg_dst_info.pcs];
                        }
                    })
                    .catch(err => {
                        this.$message.error(err);
                    });
            },
            // 初始化源坐标系
            loadEpsg_zone(params) {
                return new Promise((resolve, reject) => {
                    // 初始化源坐标系
                    util.ajax.get('/epsg_zone', {
                        params: params
                    }).then((res) => {
                        if (res.data.code !== 200) {
                            reject(res.data.message);
                        } else {
                            resolve(res.data.data);
                        }
                    }).catch(err => {
                        reject(err);
                    });
                });
            },
            //初始化cfd接口数据
            loadCfdParameter() {
               
                return util.ajax.get('/input_cfd/' + this.projectId).then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    this.prevUploadInfo.cfdInfo = res.data.data;
                    if (res.data.data.section_num) {
                        this.cfdForm.section_num = res.data.data.section_num;
                    }
                    if (res.data.data.horizontal_resolution) {
                        this.cfdForm.horizontal_resolution = res.data.data.horizontal_resolution;
                    }
                    if (res.data.data.vertical_resolution) {
                        this.cfdForm.vertical_resolution = res.data.data.vertical_resolution;
                    }
                    if (res.data.data.air_density_input) {
                        this.cfdForm.air_density_input = res.data.data.air_density_input;
                    }
                    if (res.data.data.temperature_json) {
                        this.cfdForm.temperature_json = res.data.data.temperature_json.slice(1, 2);
                    }
                }).catch(() => {
                    this.$message.error('获取CFD参数失败！');
                });
            },
            //初始化测风塔数据
            loadMastInfo() {
                this.mastList.data = [{
                    id: null,
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                    filename: '',
                    filename_txt: '',
                }];
                return util.ajax.get('/input_mast/' + this.projectId).then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    this.prevUploadInfo.mastInfo = res.data.data || [];
                    if (res.data.data && res.data.data.length > 0) {
                        
                        this.mastList.data = [];

                        res.data.data.forEach((item,index ,obj) => {
                            
                            this.mastList.data.push({
                                id: item.mast_id,
                                code: item.mast_name,
                                x: item.coordinate_x,
                                y: item.coordinate_y,
                                height: item.height,
                                filename: item.filename,
                                filename_txt: item.filename_txt,
                            });
                        });
                        this.mastList.data.sort(function(a, b) {
                            return parseInt(a.code) - parseInt(b.code) || a.code.toUpperCase() - b.code.toUpperCase() ;
                        });
                       
                        for(let i=0; i<this.mastList.data.length; i++){
                            
                            for(let j=i+1; j<this.mastList.data.length; j++){
                                if(this.mastList.data[i].code == this.mastList.data[j].code){
                                    
                                    this.mastList.data[j].isCopy = true;
                                }
                            }
                        }
                       
                        
                    }
                }).catch(() => {
                    this.$message.error('获取测风塔信息失败！');
                });
            },
            // 初始化获取线上的机位点数据
            loadTurbineInfo() {
                
                this.turbineList.data.splice(0, 1, {
                    turbine_id: null,
                    code: '',
                    type: '',
                    x: '',
                    y: '',
                    power_curve_filename: null,
                    height: '',
                    input_power_curve_list: [
                        {
                            value: 'list',
                            label: '功率曲线库',
                            children: []
                        },
                        {
                            value: 'upload',
                            label: '自定义'
                        }
                    ]
                });
                return util.ajax.get('/input_turbine/' + this.projectId + '/1').then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    console.log('no return');
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    // 储存至检查数据里
                    if (res.data.data && res.data.data.length > 0) {
                        this.prevUploadInfo.turbineInfo = [];
                        res.data.data.forEach((item) => {
                            this.prevUploadInfo.turbineInfo.push({
                                turbine_id: item.turbine_id,
                                code: item.turbine_name,
                                type: item.turbine_type,
                                x: item.coordinate_x,
                                y: item.coordinate_y,
                                height: item.height,
                                power_curve_filename: ['list', item.power_curve_filename]
                            });
                        });
                    }
                    // 储存在表单数据里
                    if (res.data.data && res.data.data.length > 0) {
                        this.turbineList.data = [];
                        res.data.data.forEach((item) => {
                            this.loadTurbineTypeList(item.turbine_type, (list) => {
                                this.turbineList.data.push({
                                    turbine_id: item.turbine_id,
                                    code: item.turbine_name,
                                    type: item.turbine_type,
                                    x: item.coordinate_x,
                                    y: item.coordinate_y,
                                    height: item.height,
                                    power_curve_filename: ['list', item.power_curve_filename],
                                    input_power_curve_list: [
                                        {
                                            value: 'list',
                                            label: '功率曲线库',
                                            children: list
                                        },
                                        {
                                            value: 'upload',
                                            label: '自定义'
                                        }
                                    ]
                                });
                            });
                        });
                    }

                    // console.log(this.prevUploadInfo.turbineInfo,this.turbineList.data,"00")
                    this.turbineList.data.sort(function(a, b) {
                            return parseInt(a.code) - parseInt(b.code) || a.code.toUpperCase() - b.code.toUpperCase() ;
                        });
                }).catch(() => {
                    this.$message.error('获取风机信息失败！');
                });
            },
            // 获取指定风机的工具曲线文件列表
            loadTurbineTypeList(type, callback) {
                let params = {
                    turbine_type: type,
                    user_id: this.userInfo.user_id
                };
                return util.ajax.get('/input_power_curve?turbine_type=' + params.turbine_type + '&user_id=' + params.user_id).then((res) => {
                    if (res.data.code === 404) {
                        return;
                    }
                    if (res.data.code !== 200) {
                        this.$message.error(res.data.message);
                        return;
                    }
                    if (res.data.data && res.data.data.length > 0) {
                        let arr = [];
                        res.data.data.forEach((item) => {
                            arr.push({
                                value: item.file_name,
                                label: item.file_name
                            });
                        });
                        callback(arr);
                    }
                }).catch((err) => {
                    console.log(err);
                    this.$message.error('获取功率曲线文件列表失败！');
                });
            },
            loadData(){
                this.$nextTick(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    let promiseArr = [];
                    const p1 = this.loadCfdParameter();
                    const p2 = this.loadMastInfo();
                    const p3 = this.loadTurbineInfo();
                    promiseArr = [p1, p2, p3];
                    if (this.$refs.folderTableRef) {
                        const p4 = this.$refs.folderTableRef.init();
                        promiseArr.push(p4);
                    }
                    Promise.all(promiseArr).then(() => {
                        this.loading.close();
                    }).catch(() => {
                        this.loading.close();
                    });
                });
            },
            open(projectId) {
                this.projectId = projectId;
                this.dialogVisible = true;
                this.init();
                this.loadData();
            },
            // 设置默认参数
            defaultPrevUploadInfo() {
                return {
                    cfdInfo: {
                        terrain_filename: '',
                        rough_filename: '',
                        section_num: '',
                        horizontal_resolution: '',
                        vertical_resolution: '',
                        air_density_input: '',
                        temperature_json: '',
                        epsg_src: '',
                        epsg_dst: ''
                    },
                    mastInfo: [],
                    turbineInfo: []
                };
            },
            // 关闭前回调 
            beforeClose(done) {
                // console.log(done)
                if (this.$refs.progressBar.visibility) {
                    this.$refs.progressBar.close(done);
                } else {
                    done();
                    this.projectId=null;
                    this.$emit('close');
                }
            },
            onConfirmCancel(done) {
                this.beforeClose(done);
            },
            
        }
    };
</script>
<style lang="less" scoped>
//新样式
.parameterBox /deep/ .parameterBox-confirm{
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border-radius: 0;
    overflow: auto;
}
.parameterBox /deep/ .el-form-item__label{
    opacity: 0.8 !important;
}
.parameterBox /deep/ .el-dialog__wrapper .el-cascader__label{
    color:rgba(51,200,111,0.7) !important;
}
.parameterBox .el-select /deep/ .el-input__inner{
    color: rgba(51,200,111,0.7) !important;
    border: 1px solid #888d97 !important;
    opacity: 1;
    width: 190px;
}
.parameterBox .powerCurveBox /deep/ .el-form-item__content{
    width: 190px !important;
    position: relative;
    left: 4px;
}
.parameterBox /deep/ .el-dialog .el-dialog__body .el-form-item__label{
    color: rgba(211,219,235,0.7) !important;
    padding: 0 ;
    width: 96px;
    text-align: left;
}
.parameterBox /deep/ .el-table__empty-block {
    width: 100% !important;
    box-sizing: border-box;
    border-right: 1px solid rgba(159, 164, 162, 0.5);
    border-left: 1px solid rgba(159, 164, 162, 0.5);
}
.parameterBox .content4 /deep/ .cell{
    margin-bottom: 3px !important;
}
.contentHeight1 .redBorderValid /deep/ .el-cascader input{
    border: 1px solid red !important;
}
.contentHeight1 .terrainBorderValid /deep/ .el-select input{
    border: 1px solid red !important;
}
.contentHeight1 .terrainUploadBorder .terrainBtn{
    border: 1px solid red !important;
}
.contentHeight1 .terrainUploadBorder2 .terrainBtn2{
    border: 1px solid red !important;
}
.contentHeight3 .redBorderValid /deep/ .el-cascader input{
    border: 1px solid red !important;
}
.tabHeaderRight{
    width: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/ .icon{
        display: inline-block !important;
        cursor: pointer;
    }
}
.contentHeight2 /deep/ .el-form-item{
    margin-bottom: 0 !important;
}
.contentHeight3 /deep/ .trigger{
    width: 130px !important;
}
.gf-table.el-table .cell, .contentHeight4 /deep/ .gf-table.el-table th div{
    padding-right: 2px !important;
}
.contentHeight4 /deep/ .gf-table.el-table td:nth-of-type(1) .cell input ,.contentHeight4 /deep/ .gf-table.el-table th:nth-of-type(1) .cell input{
    height: 15px !important;
    position: absolute;
    left: 0;
    opacity: 0 !important;
}
.contentHeight4 .el-select /deep/ .el-input__inner{
    width: 123px !important;
}
.contentHeight4 .icon-mid{
    width: 35px !important;
}
.contentHeight4 /deep/ .el-form-item.el-form-item--feedback.is-error .el-input__inner{
    border: 1px solid red !important;
}
.contentHeight5 /deep/ .el-checkbox__label,.contentHeight6 /deep/ .el-checkbox__label,.contentHeight7 /deep/ .el-checkbox__label{
    padding-left: 5px !important;
}
.content1{
    .upload-form{
        .original-form-inline{
            margin: 0 auto;
            position: relative;
            left: 5px;
        }
    }
}
.param-container{
    display: flex;
    margin: 0 auto;
    padding-top: 0;
    color: rgba(211,219,235,0.7);
    width: 980px;
}
.titleBox{
    display: inline-block;
    .tabIcon{
        display: inline-block;
        width: 23px;
    }
}
.leftBox {
    padding: 7px 0 0 0;
    margin: 0;
    div{
        box-sizing: border-box;
        width: 35px;
        height: 35px;
        border: 1px solid rgba(211,219,235,0.7);
        border-radius:50%;
        font-weight:bold;
        font-size:17px;
        text-align: center;
        line-height: 35px;
        cursor: pointer;
    }
    .line{
        display: block;
        height: 10px;
        margin-left: 18px;
        border-left: 1px solid rgba(211,219,235,0.7);
        transition: all 0.5s;
    }
    li:last-child .line{
        height: 0;
    }
}
.disableActive{
    background:rgba(51,200,111, 0);
}
.readyActive{
    background:rgba(51,200,111, 1);
    border:none !important;
}
.zhihuiActive{
    background:rgba(195,195,195, 0.5);
    border:none !important;
    cursor:not-allowed !important;
}
.leftActive>div{
    background:rgba(51,200,111,1);
    border:none !important;
    color: #fff;
}

.rightBox {
    padding: 0 0 0 15px;
    margin: 0;
    width: 880px;
    position: relative;
   
    p{
        margin: 5px 0 0 0;
        padding: 0 20px;
        border-radius:3px;
        border: 1px solid rgba(211,219,235,0.7);
        border-radius: 3px;
        height: 39px;
        line-height: 39px;
        display: flex;
        justify-content: space-between;
    }
    .tooltipContent{
        box-sizing: border-box;
        position: absolute;
        width: 880px;
        border-radius: 10px;
        padding: 10px 20px;
        color: #33C86F;
        line-height: 20px;
        text-align: justify;
        background: #001831;
        border: 1px dashed rgba(212, 239, 246, 0.5);
        opacity: 1;
        z-index: 2003;
        top: -25px;
        .closeTip{
            position: absolute;
            top: -5px;
            right: -10px;
            border: 1px solid rgba(220, 241, 247, 0.6);
            color: rgba(212,239,246,0.6);
            background: #001831;
            font-weight: bold;
            border-radius: 50%;
            height:20px;
            width:20px;
            z-index : 5555;
            font-size: 15px;
            display: flex;
            justify-content: center;
            align-content: center;
            cursor: pointer;
        } 
        .tooltip-arrow{
            position: absolute;
            bottom: -10px;
            right: 267px;
            width: 20px;
            height: 10px;
            overflow: hidden;
            transform: rotate(180deg);
            .arrow-up{
            width: 17px;
            height: 17px;
            background: #001831;
            border: 1px solid rgba(212,239,246,0.5);
            transform: rotate(45deg) scale(0.8, 0.8);
            display: inline-block;
            }
        }
        .tooltip-arrow-down{
            position: absolute;
            bottom: -10px;
            left: 20px;
            width: 20px;
            height: 10px;
            overflow: hidden;
            .arrow-down{
            width: 17px;
            height: 17px;
            background: #001831;
            border: 1px dashed rgba(212,239,246,0.5);
            transform: rotate(45deg) scale(0.8, 0.8);
            display: inline-block;
            position: absolute;
            top: -10px;
            }
        }
    }
    // 每一步说明
    .tooltipContent1{
        top: 15px; 
        left: 265px;
        width: 400px;
        .tooltip-arrow{
            right: 37px;
        }
    }
    .tooltipContent2{
        top: -70px; 
        .tooltip-arrow{
            right: 300px;
        }
    }
    .tooltipContent3{
        top: 85px; 
        .tooltip-arrow{
            right: 30px;
        }
    }
    .tooltipContent4{
        top: 150px; 
        .tooltip-arrow{
            right: 30px;
        }
    }

}

.upload-terrain{
    width: 290px;
    margin: 0 auto 15px auto;
    display: flex;
    justify-content: space-between;
}
.arrow{
    transform: rotate(0deg);
    transition: all 0.5s;
    cursor: pointer;
}
.contentActive .arrowActive .arrow{
    transform: rotate(90deg);
    transition: all 0.5s;
}
.contentActive .arrowActive{
    border-radius: 3px 3px 0 0 !important;
    background:rgba(0,24,49,0.4);
    color: rgba(51,200,111,1);
}
.rightBox li>div{
    height: 0;
    transition: all 0.5s;
    overflow: hidden;
    border-radius: 0 0 3px 3px;
}
.leftActive .line{
    height: 245px;
    transition: all 0.5s;
}
.rightBox .contentActive .contentHeight{
    height: 245px;

    background:rgba(0,24,49,0.4);
    border: 1px solid rgba(211,219,235,0.7);
    border-top: none;
    transition: all 0.5s;
    padding: 0 30px;
}
.iconBoxHeader{
    height: 25px;
    width: 60px;
   
    text-align: center;
    padding: 5px 0 0 0 ;
    position: absolute;
    right: 0;
    top: 3px;
    z-index:1111;
}
.iconBoxHeader span{
    margin-left: 3px;
    display: inline-block !important;
    cursor: pointer;    
}
.iconBoxHeader .isCanClick{
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
}
.iconBoxHeader .icon{
    display: block !important;
}
.demo-ruleForm /deep/ .el-input__inner{
    border: 1px solid rgba(212, 239, 246, 0.8) !important;
    padding-left: 10px !important;
    text-align: left !important;
}
.iconBoxHeader .isCanClick{
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
}
.parameterBox /deep/ .changeDialog{
    width: 350px !important;
    height: 320px !important;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto !important;
    background: rgba(3,32,62,1) !important;
}
.parameterBox /deep/ .changeDialog .el-dialog__body{
    margin-top: 10px !important;
    
}
.parameterBox /deep/ .changeFengDialog{
    width: 835px !important;
    height: 600px !important;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto !important;
    background: rgba(3,32,62,1) !important;
    overflow: inherit !important;
}
.parameterBox /deep/ .changeFengDialog .el-dialog__header{
    border-bottom:1px solid rgba(212,239,246,0.5);
}
.parameterBox /deep/ .changeFengDialog .el-dialog__body{
    margin-top: 10px !important;
}
.parameterBox /deep/ .changeFengDialog .el-table__header-wrapper{
    background:rgba(51,200,111,0.2) !important;
    border: 1px solid rgba(159, 164, 162, 0.5);
    border-bottom: none;
    box-sizing: border-box;
}
.parameterBox /deep/ .changeFengDialog .el-table{
    color:rgba(212,239,246,0.8) !important;
}
.parameterBox /deep/ .changeFengDialog .el-table__body-wrapper{
    overflow: auto;
    max-height: 400px;
}
.parameterBox /deep/ .changeFengDialog .el-table__body{
    width: 100% !important;
}
.parameterBox /deep/ .changeFengDialog .el-form-item__content{
    line-height: 25px !important;
    color:rgba(212,239,246,0.8) !important;
}
.parameterBox /deep/ .changeFengDialog .need-border.el-table tr th.is-leaf{
    border-bottom: none !important;
}

.changeFengDialog {
    .content{
        
        
        
    }
    .btnBox{
        position: absolute;
        bottom: 30px;
        left: 50%;
        margin-left: -50px;
        /deep/ button{
            width: 100px !important;
        }
    }
}

.rightBox .planChange , .rightBox .opPlanChange{
    padding: 15px 0 0 0;
    display: flex;
    justify-content: space-between;
    .planBtn{
        width:150px;
        height:30px;
        background:rgba(51,200,111,0.3);
        border:1px solid rgba(51,200,111,1);
        border-radius:4px;
        text-align: center;
        font-size:14px;
        line-height: 30px;
        cursor: pointer;
        box-sizing: border-box;
        &>span{
            display: inline-block;
            border: 1px solid rgba(212,239,246,0.7);
            border-radius: 50%;
            width: 14px;
            height: 14px;
            line-height: 14px;
        }
    }
    .scroll{
        width: 650px;
        height:30px;
        border: 1px solid rgba(212,239,246, 0.4);
        border-radius:2px;
        font-size:13px;
        box-sizing: border-box;
        position: relative;
        .icon{
            display: inline-block !important;
        }
        .leftBtn , .rightBtn{
            box-sizing: border-box;
            cursor: pointer;
            width: 20px;
            height: 29px;
            line-height: 29px;
            text-align: center;
            position: absolute;
            top: 0;
        }
        .leftBtn{
            left: 0;
            border-left: 1px solid rgba(212,239,246, 0.4);
            transform: rotate(180deg);
        }
        .leftBtn:hover , .rightBtn:hover{
            color: #fff;
        }
        .rightBtn{
            right: 0;
            border-left: 1px solid rgba(212,239,246, 0.4);
        }
        &>div{
            width: 607px;
            overflow: hidden;
            margin: 0 auto;
        }
        .line{
            padding: 0 2px;
            height:30px;
            line-height: 30px;
            white-space: nowrap;
            position: relative;
            transition: all 0.4s;
            &>div{
                width: 150px;
                height:24px;
                display: inline-block;
                box-sizing: border-box;
                line-height: 24px;
                
                // border: 1px solid rgba(212,239,246, 0.4);
                position: relative;
                top: 1px;
                /deep/ .nameIpt{
                    width: 102px !important;
                    height: 23px !important;
                    border: none !important;
                    padding: 0 0 0 4px;
                }
                /deep/ input:focus {
                    border-color: rgba(159, 164, 162, 0 ) !important;
                    border: none !important;
                }
                /deep/ input , /deep/ .el-input__inner{
                    color:rgba(211,219,228,0.8) !important;
                    height: 23px !important;
                    
                    text-overflow:ellipsis;
                    position: relative;
                    top: -1px;
                }
                .hoverBtn{
                    display: none;
                    width: 40px;
                    height: 24px;
                    line-height: 24px;
                    position: absolute;
                    right: 0;
                    top: 1px;
                    .icon{
                        width: 14px;
                        height: 14px;
                        display: inline-block !important;
                        margin-left: 2px;
                        cursor: pointer;
                    }
                    .removeIcon{
                        width:17px;
                        height:17px;
                        position: relative;
                        top: 1px;
                    }
                }
                .clickBtn{
                    background:rgba(51,200,111,0.5);
                    border-radius:2px;
                    color: rgba(255,255,255,0.8);
                    width: 40px;
                    height: 22px;
                    line-height: 22px;
                    text-align: center;
                    font-size: 11px;
                    cursor: pointer;
                    position: absolute;
                    top: 1px;
                    right: 1px;
                }
            }
            .readonly{
                border: 1px solid rgba(212,239,246, 0.4);
            }
            &>div:hover .hoverBtn{
                display: inline-block !important;
                color: #33C86F;
            }
            .cursorInit /deep/ input , /deep/ .el-input__inner{
                cursor: initial !important;
            }
            .cursorMouse /deep/ input , /deep/ .el-input__inner{
                cursor: pointer !important;
            }
        }
    }
}
.rightBox .opPlanChange{
   
}

.uploadBtn {
    width: 130px;
    height: 30px;
    border-radius: 4px;
    border: solid 1px rgba(51,200,111,0.7);
    text-align: center;
    line-height: 30px;
    padding: 0 15px;
    color: rgba(51,200,111,0.7);
    font-size: 14px;
    &:hover {
        color: rgba(51,200,111,1);
        border: solid 1px rgba(51,200,111,1);
    }
}

.jiweiBox{
    position: relative;
}
//设置每一步的高度
.leftActive .line1{
    height: 235px;
}
.leftActive .line1_left{
    height: 415px;
}
.leftActive .line2{
    height: 330px;
}
.leftActive .line3{
    height: 335px;
}
.leftActive .line4{
    height: 380px;
}
.rightBox .contentActive .contentHeight1{
    height: 220px;
}
.rightBox .contentActive .contentHeight1_left{
    height: 400px;
}
.rightBox .contentActive .contentHeight2{
    height: 315px;
}
.rightBox .contentActive .contentHeight3{
    height: 320px;
}
.rightBox .contentActive .contentHeight4{
    height: 365px;
}
//设置每一步的高度
.bottomBtn{
    display: flex;
    justify-content: center;
    padding-top: 25px;
}
.tabHeader{
    height: 40px;
    display: flex;
    justify-content: space-between;
    padding: 15px 0 0 0 ;
}

.errIcon{
    color: red;
    padding: 0 0 0 10px;
    .icon{
        position: relative;
        top: 2px;
    }
}
.bgBox{
    position: absolute;
    width:98%;
}
.bgBox>span{
    width: 50%;
    height: 24px;
    display: inline-block;
    background:rgba(51,200,111,0.6);
    border-radius: 20px;
    position: absolute;
    left:0;
    transition: all 0.5s;
}
.bgActive{
    left: 50% !important;
    transition: all 0.5s;
}
.spanTip{
    position: relative;
    z-index: 5;
    opacity: 0.8;
}
.uploadActive{
    background:rgba(51,200,111,0.6);
    border:1px solid rgba(51,200,111,0.6) !important;
}
.btnUpload{
    position: absolute;
    z-index: -11;
    opacity: 0;
}
.simulationDiv{
    display: flex;
    justify-content: center;
    border: 1px solid#33C86F;
    width: 290px !important;
    padding: 3px;
    margin: 20px auto 15px auto !important;
    border-radius: 20px;
    box-sizing: border-box;
    position: relative;
}
.mode-div{
    height: 24px;
    border-radius: 10px;
    cursor: pointer;
    color: #D4EFF6;
    font-size: 14px !important;
    line-height: 24px;
    width: 50%;
    text-align: center;
    display: inline-block;
    background:rgba(51,200,111,0);
}
.mode-div.mode-tab-active{
    background:rgba(51,200,111,0);
}
.jiweidianUpload{
    position: absolute;
    z-index: -11;
    opacity: 0;
}
.checkbox /deep/ input{
    opacity: 0 !important;
    position: absolute;
}

.terrainWTred /deep/ .wt-upload-btn{
    border: 1px solid red !important;
}
.wtDensityParent /deep/ .terrainValidSuccess{
    background: rgba(51, 200, 111, 0.6);
    border: 1px solid rgba(51, 200, 111, 0.6) !important;
    color: rgba(212, 239, 246, 0.7) !important;
}
.imgtip1{
  width: 100%;
  border-radius: 5px;
   cursor: pointer;
}
.imgtip2{
  width: 800px;
  height: 550px;
  border-radius: 5px;
  position: fixed;
  left: 0;right: 0;
  top: 0;bottom: 0;
  margin: auto;
  z-index: 9999;
  cursor: pointer;
}

.tooltipBox{
    position: absolute;
    right: -55px;
    top: 0;
    width: 45px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &>span{
        cursor: pointer;
    }
}
.tooltipBox2{
    right: 210px;
}  


//上传文件red框
.mastTable /deep/ .is-error .triggerBox .el-input__inner{
    border: 1px solid #FF4967 !important;
}


//临时提第四步
.linshi {
    padding: 20px 0;
    display: flex;
    position: relative;
    a{
        color: rgba(211, 219, 235, 0.7);
        text-decoration: none;
    }
    .icon{
        display: inline-block !important;
        color: rgba(51,200,111,0.6);
        position: relative;
        top: 3px;
        margin: 0 10px 0 20px;
    }
    .download-btn{
        margin: 0 10px 0 0px;
    }
    .shuoming{
        position: absolute;
        right: -10px;
        top: 20px;
        cursor: pointer;
    }
}

</style>