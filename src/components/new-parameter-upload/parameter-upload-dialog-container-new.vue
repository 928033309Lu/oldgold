<style lang="less" scoped>
    @import "./parameter.less";
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
    /* .mytip:after{
        display:block;
        content:'';
        border-width:6px 6px 6px 6px;
        border-style:solid;
        border-color:rgba(220, 241, 247, 0.5) transparent transparent transparent;
        position:absolute;
        left:13px;
        top:100%;
    } */
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
    .wtDensity{
        
        width: 290px;
        margin: 0 auto;
    }
    .wtDensity /deep/ .el-input{
        width: 190px !important;
    }
    .wtDensity /deep/ .el-form-item__content{
        display: flex;
        justify-content: space-between;
    }
    .wtDensity /deep/ .el-form-item__label{
        width: 90px !important;
        text-align: left;
    }
    // .wtDensity /deep/ .content2wtDensityWidth{
    //     position: relative;
    //     left: -6px;
    // }

</style>
<template>
    <div class="parameterBox">
        <el-dialog title="上传参数" class="scroll"
                   :visible.sync="dialogVisible"
                   custom-class="parameterBox-new"
                   width="100%"
                   :modal="false"
                   :close-on-click-modal="false"
                   :before-close="beforeClose">
            <div class="param-container" v-if="!uploadSuccess">
                <div class="tabs newTabs">
                        <!-- #D4EFF6 -- 0.8-->
                    <div class="newTab-item" v-bind:class="tabItemFirst">
                       <span class="newfonts">1</span>
                       <div class="newTitle">上传无人机数据</div>
                    </div>
                    <div class="item-line"> <span class="item-lineTo"  v-bind:class="tabItemFirst"></span> </div>

                    <div class="newTab-item" v-bind:class="tabItemSecond">
                        <span class="newfonts">2</span>
                        <div class="newTitle">设置流场仿真模式</div>
                    </div>
                    <div class="item-line"> <span class="item-lineTo"  v-bind:class="tabItemSecond"></span> </div>

                    <div class="newTab-item" v-bind:class="tabItemThird">
                        <span class="newfonts">3</span>
                        <div class="newTitle">上传测风塔数据</div>
                    </div>
                    <div class="item-line"> <span class="item-lineTo"  v-bind:class="tabItemThird"></span> </div>

                    <div class="newTab-item" v-bind:class="tabItemFour">
                        <span class="newfonts">4</span>
                        <div class="newTitle">上传机位点数据</div>
                    </div>
                    <div class="item-line"> <span class="item-lineTo"  v-bind:class="tabItemFour"></span> </div>

                    <div class="newTab-item" v-bind:class="tabItemFive">
                        <span class="newfonts">5</span>
                        <div class="newTitle">上传工程设计数据</div>
                    </div>
                </div>
                <!-- 提示内容 -->
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
                    请按照WT计算地形要求，上传风电场外扩后地形，支持“.map/.tif”格式
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
                <div class="tooltipContent tooltipContent5" v-if="tooltipShow5">
                    <div class="closeTip" @click="tooltipShow5 = false"><span>×</span></div>  
                    <div class="tooltip-arrow">
                        <div class="arrow-up"></div>
                    </div>
                   55555555
                </div> 
                <!-- 提示内容end -->
        <!-- 第一步 -->
                <div class="row" v-if="tabIndex === 0">
                    <div class="content content1 oneContent">
                        <div class="upload-tab upload-tab-you">
                            <div class="bgBox">
                                <span  :class="{'bgActive':!uploadTabActiveFirst}"></span>
                            </div>
                            <div class="upload-tab-tag"
                                v-bind:class="{'upload-tab-active':uploadTabActiveFirst}"
                                @click="uploadTabChange(!uploadTabActiveFirst,true)" >
                                <span class="spanTip">上传无人机地形</span>
                            </div>
                            <div class="upload-tab-tag"
                                v-bind:class="{'upload-tab-active':!uploadTabActiveFirst}"
                                @click="uploadTabChange(!uploadTabActiveFirst,false)" >
                                <span class="spanTip">上传已有地形</span>
                            </div>

                            <!-- 说明 -->
                            <div class="tooltipBox tooltipBox1">
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
                        <!-- <div class="upload-terrain" :class="!terrainValue_Valid? 'terrainBorderValid' :''">
                            <span style="color: rgba(211,219,235,0.7)">地形复杂度：</span>
                            <el-select v-model="terrainValue" popper-class="gf-popper" placeholder="请选择">
                                <el-option
                                v-for="(item,index) in terrainList"
                                :key="index"
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>
                        </div> -->
                        <div class="upload-terrain" :class="!kmzFileName_Valid? 'kmzFileName_Valid' :''">
                            <div class="kmzFileName" :class="kmzFileName ? 'kmzFileNameActive':''"
                                @click="()=>{this.$refs.kmzUpload.click()}"> 
                                {{ kmzFileName  ? kmzFileName : '上传风场范围(.kml/.kmz)'}} 
                            </div>
                            <el-upload  action="/"  class="jiweidianUpload" accept=".kmz,.kml"
                            :before-upload="beforeKmzUpload" :http-request="httpKmzRequest"><button ref="kmzUpload"></button></el-upload>
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
                        
                        <!--进度条 -->
                        <folder-table v-if="uploadTabActiveFirst" :project_id="projectId" ref="folderTableRef"
                            @fileFormChange="fileFormChangeHandle" @Expand="onExpandHandle"
                            @closeProgressBar="onCloseProgressBar"
                        ></folder-table>
                    </div>
                </div>
        <!-- 第二步 -->
                <div class="row" v-show="tabIndex === 1">
                    <div class="twoContent">
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
                            <!-- 说明 -->
                            <div class="tooltipBox tooltipBox2" v-if="!simulationMode">
                                <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                    content="查看说明" :disabled="tooltipShow2" :visible-arrow="false">
                                    <span style="display: inline-block;" @click="tooltipShow2 = true">
                                        <icon name="shuoming" style="width:18px;height:18px;color: rgba(212,239,246,0.6);"/>
                                    </span>
                                </el-tooltip>     
                            </div>
                        </div>
                        <!-- 内容 -->
                        <div class="content content2" v-show="simulationMode">
                            <el-form ref="cfdForm"
                                class="content2InputWidth"
                                :model="cfdForm"
                                :rules="cfdRules"
                                label-position="left"
                                label-width="120px"
                                style="width: 290px;margin: 0 auto;">
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
                            <div class="wtDensity">
                                <el-form ref="cfdForm2" class="content2wtDensityWidth" :model="cfdForm" :rules="cfdRules2">                    
                                    <el-form-item prop="air_density_input" label="空气密度:">
                                        <el-input v-model="cfdForm.air_density_input"
                                                :disabled="uploadLoading" class="gf-input" style="width: 190px;height: 30px"/>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <wt-file-upload-panel id="wtFileUpload" ref="wtFileUpload" :projectId="projectId"></wt-file-upload-panel>
                        </div>

                        <!-- //视频 -->
                        <div class="video" v-show="!simulationMode">
                            <video ref="video" controls="controls" width="100%" height="100%">
                                <source :src="videoUrl">
					            Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
        <!-- 第三步 -->
                <div class="row" v-show="tabIndex === 2">
                    <div class="content content3 content4 threeContent">
                        <el-upload  action="/"    class="jiweidianUpload" accept=".txt"
                            :before-upload="beforeMastlistUpload" :http-request="httpMastlistRequest"><button ref="mastlistUpload"></button></el-upload>
                        <div class="tabHeader">
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
                                    content="查看说明" :disabled="tooltipShow3" :visible-arrow="false">
                                    <span style="display: inline-block;" @click="tooltipShow3 = true">
                                        <icon name="shuoming" style="width:18px;height:18px;color: rgba(212,239,246,0.6);"/>
                                    </span>
                                </el-tooltip>
                            </div>
                        </div>
                        <!-- 内容 -->
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
                                                @blur="offBlur(1)" @focus="onfocus(1)"                 
                                            />                                          
                                        </el-tooltip>
                                            
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="投影坐标X"  width="125px" header-align="center" align="center">
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
                                                @blur="offBlur(2)" @focus="onfocus(2)"       
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
                                                @blur="offBlur(22)" @focus="onfocus(22)"
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
                                                @blur="offBlur(222)"  @focus="onfocus(222)" 
                                            />
                                        </el-tooltip>
                                            
                                            
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="投影坐标Y" width="125px"  header-align="center" align="center">
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
                                                @blur="offBlur(3)"  @focus="onfocus(3)"
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
                                                @blur="offBlur(33)" @focus="onfocus(33)"
                                            />
                                        </el-tooltip>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="风数据文件(.txt)" width="145px" align="center">
                                    <template slot-scope="scope">
                                        <el-form-item :prop="'data.'+scope.$index+'.filename_txt'" 
                                        :rules="{validator: validateFileName, trigger: 'change'}">
                                            
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
                                                    
                                        <el-tooltip class="item" 
                                        effect="light" 
                                        :popper-class="isTrue4?'offmytooltip':'onmytooltip'"
                                        :content="/^[\+]?\d+(\.\d)?$/.test(scope.row.height) ? '0-300，可保留一位小数':'0-300，可保留一位小数'"
                                        :disabled="scope.row.height<300&&scope.row.height>0 || isTrue4 ? true : false"
                                        :visible-arrow="false"
                                        placement="top">
                                            <el-input v-model="scope.row.height" :disabled="uploadLoading"
                                                    class="gf-table-input"
                                                @blur="offBlur(4)" @focus="onfocus(4)"    
                                                    />
                                        </el-tooltip>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                
                                <el-table-column label="测风文件(.tim)" width="145px" align="center">
                                    <template slot-scope="scope">
                                        <el-form-item :prop="'data.'+scope.$index+'.filename'" 
                                        :rules="{validator: validateFileName, trigger: 'change'}">
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
                    </div>
                </div>
        <!-- 第四步 -->
                <div class="row" v-show="tabIndex === 3">
                    <div class="content content3 content4 fourContent">
                        <!-- 选择方案 -->
                        <div class="planChange">
                            <div class="planBtn" @click="addPlan(false)"> <span>+</span>已有点位方案</div>
                            <div class="scroll">
                                <span class="leftBtn" @click="changeLine('left',false)"><icon name="arrow-right-copy"/></span>
                                <span class="rightBtn" @click="changeLine('right',false)"><icon name="arrow-right-copy"/></span>
                                <div>
                                    <div class="line" id="dataLine" :style="{left: leftX +'px',width: (planArr1.length*150)+'px'}">
                                        <div v-for="(item,index) of planArr1" :key="index" 
                                        :class="!item.readonly? 'readonly cursorInit' : 'cursorMouse' " >
                                            <el-input v-model="item.scheme_name" :readonly="item.readonly" @click.native.stop="selectedPlan(item)" 
                                            :style="item.isOpen?'background:rgba(51,200,111,0.6);border-radius:3px;':''"  
                                            :class="{redActive: planArr1ValidIndex.indexOf(index) != -1}"
                                            class="gf-table-input nameIpt"/>  
                                            <span class="hoverBtn" v-if="item.readonly"> 
                                                <span @click.stop="changePlan(item,index)"><icon name="bianji"/></span>  
                                                <span @click.stop="removePlan(item,index)"><icon name="remove" class="removeIcon" /></span> 
                                            </span>
                                            <span class="clickBtn" v-if="!item.readonly" @click.stop="item.readonly=true">确认</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 选择优化排布 -->
                        <div class="opPlanChange">
                            <div class="planBtn" @click="addPlan(true)"> <span>+</span> 自动化方案</div>
                            <div class="scroll">
                                <span class="leftBtn" @click="changeLine('left',true)"><icon name="arrow-right-copy"/></span>
                                <span class="rightBtn" @click="changeLine('right',true)"><icon name="arrow-right-copy"/></span>
                                <div>
                                    <div class="line" id="dataLineOp" :style="{left: leftX2 +'px',width: (planArr2.length*150)+'px'}">
                                        <div v-for="(item,index) of planArr2" :key="index" :class="!item.readonly? 'readonly cursorInit' : 'cursorMouse' " >
                                            <el-input v-model="item.scheme_name" :readonly="item.readonly" @click.native.stop="selectedPlan(item)" 
                                            :style="item.isOpen?'background:rgba(51,200,111,0.6);border-radius:3px;':''" 
                                            :class="{redActive: planArr2ValidIndex.indexOf(index) != -1}" 
                                            class="gf-table-input nameIpt"/>  
                                            <span class="hoverBtn" v-if="item.readonly"> <span @click.stop="item.readonly=false"><icon name="bianji"/></span>  
                                            <span @click.stop="removePlan(item,index)"><icon name="remove" class="removeIcon" /></span> </span>
                                            <span class="clickBtn" v-if="!item.readonly" @click.stop="item.readonly=true">确认</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!-- 机位点数据      -->
                        <div class="jiweiBox">
                            <el-upload  action="/input_turbine_file"    class="jiweidianUpload" accept=".txt"
                                :before-upload="beforeTurbineUpload" :http-request="httpTurbineRequest"><button ref="turbineUpload"></button></el-upload>
                            <!-- 机位点列表 -->
                            <div v-for="(item,index) of planArr1" :key="index" v-show="item.isOpen">
                                <div class="tabHeader">
                                    <div class="tabHeaderRight">
                                        <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                            content="导入文件" :visible-arrow="false">
                                            <span  @click="onClickTurbineUpload(item)" style="display: inline-block;">
                                                <icon name="daoru" style="width:18px;height:18px;color: rgba(212,239,246,0.6);transform: rotate(90deg);"/>
                                            </span>
                                        </el-tooltip>
                                        <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                            content="下载模板" :visible-arrow="false">
                                            <span style="display: inline-block;" @click="turbineMoban">
                                                <icon name="xiazaijiangyiicon" style="width:23px;height:23px;color: rgba(212,239,246,0.6);"/>
                                            </span>
                                        </el-tooltip>
                                        <el-tooltip class="item" placement="top" effect="light" popper-class="onmytooltip" 
                                            content="查看说明" :disabled="tooltipShow4" :visible-arrow="false">
                                            <span style="display: inline-block;" @click="tooltipShow4 = true">
                                                <icon name="shuoming" style="width:18px;height:18px;color: rgba(212,239,246,0.6);"/>
                                            </span>
                                        </el-tooltip>
                                    </div>
                                </div>
                                <!-- 批量操作 -->
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
                                </div>
                                
                                <el-form :model="item" :ref="'turbineListRef'+index" status-icon >
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
                                                    @blur="offBlur('1b')" @focus="onfocus('1b')"/>

                                                </el-tooltip>

                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="机型" width="131px" header-align="center" align="center">
                                            <template slot-scope="scope">
                                                
                                                <el-form-item :prop="'data.'+scope.$index+'.turbine_type'"
                                                    :rules="{validator: validateSelecta, trigger: 'change'}">
                                                    <el-select v-model="scope.row.turbine_type" :disabled="uploadLoading"
                                                            popper-class="gf-popper" placeholder="请选择"
                                                            @visible-change="((value)=>{visibleChange( value, scope.$index, scope.row ,item)})"
                                                            @change="handleTurboTypeChangeNew(scope.$index, scope.row ,item)">
                                                        <el-option v-for="item2 of turbineOptions" :key="item2.key"
                                                                :label="item2.label" :value="item2.value"/>
                                                    </el-select>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="115px" label="投影坐标X" header-align="center" align="center">
                                            <template slot-scope="scope">
                                                <el-form-item :prop="'data.'+scope.$index+'.coordinate_x'"
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
                                                    @blur="offBlur('2b')" @focus="onfocus('2b')"/>
                                                
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
                                                    @blur="offBlur('22b')" @focus="onfocus('22b')"/>
                                                
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
                                                    @blur="offBlur('222b')" @focus="onfocus('222b')"/>
                                                
                                                </el-tooltip>
                                            
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="115px" label="投影坐标Y" header-align="center" align="center">
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
                                                    @blur="offBlur('3b')" @focus="onfocus('3b')"/>
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
                                                        @blur="offBlur('33b')" @focus="onfocus('33b')" />
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
                                                        @blur="offBlur('4b')" @focus="onfocus('4b')"/>
                                                </el-tooltip>

                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="功率曲线文件" width="160px" header-align="center" align="center">
                                            <template slot-scope="scope">
                                                <div style="height: 33px;line-height: 33px"
                                                :class="!scope.row.turbine_type ? 'cascaderDrop' : ''"
                                                    >
                                                    <el-cascader
                                                        :disabled="!scope.row.turbine_type ? true : false"
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
                                        <el-table-column width="38px" align="center">
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
                    <!-- 优化排布数据 -->
                        <div class="youhuaBox">
                            <div v-for="(item,index) of planArr2" :key="index" v-show="item.isOpen" >
                                <el-form class="tarForm" :ref="'targetForm' + index"
                                label-position="left"
                                label-width="80px"
                                :rules="epcRules"
                                :model="item"
                                style="width:240px">
                                    <el-form-item prop="target" label="优化目标 :">
                                        <el-select v-model="item.target" :disabled="uploadLoading"
                                            popper-class="gf-popper" placeholder="请选择" >
                                            <el-option v-for="(item1,index1) of targetOptions" :key="index1"
                                                :label="item1.label" :value="item1.value"/>
                                        </el-select>
                                    </el-form-item>
                                </el-form>

                                <div class="left" >
                                    <div>
                                        <div class="label">
                                            <div>机型 ：</div>
                                            <div>功率曲线 ：</div>
                                            <div>轮毂高度 ：</div>
                                            <div>数量(台) ：</div>
                                        </div>
                                        <el-form v-for="(item2,index2) of item.data" :key="index2"
                                            :ref="index + 'optForm' + index2"
                                            class="optForm"
                                            :model="item2"
                                            :rules="epcRules"
                                            style="width:160px">
                                            <el-form-item prop="turbine_type">
                                                <el-select v-model="item2.turbine_type" :disabled="uploadLoading"
                                                        popper-class="gf-popper" placeholder="请选择"
                                                        @visible-change="((value)=>{visibleChange2( value, index2, item2)})"
                                                        @change="handleTurboTypeChangeYouhuaNew(index2, item, item.data )">
                                                    <el-option v-for="item3 of turbineOptions" :key="item3.key"
                                                            :label="item3.label" :value="item3.value"/>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item  :class="!item2.turbine_type ? 'cascaderDrop' : ''">
                                                <el-cascader
                                                :disabled="!item2.turbine_type ? true : false"
                                                    expand-trigger="hover"
                                                    :options="item2.input_power_curve_list"
                                                    v-model="item2.power_curve_filename"
                                                    :show-all-levels="false"
                                                    popper-class="powerCurve"
                                                    @change="((value)=>{handleChangeyouhuaNew(value , item2)})"
                                                >
                                                </el-cascader>
                                            </el-form-item>
                                            <el-form-item  prop="height">
                                                <el-tooltip class="item" 
                                                effect="light" 
                                                :popper-class="isTrueTar1?'offmytooltip':'onmytooltip'"
                                                :content="/^[\+]?\d+(\.\d)?$/.test(item2.height) ? '0-300，可保留一位小数':'0-300，可保留一位小数'"
                                                :disabled="item2.height<300&&item2.height>0 || isTrueTar1? true : false"
                                                :visible-arrow="false"
                                                placement="top">
                                                    <el-input v-model="item2.height" type="number"
                                                    @blur="offBlur('Tar1')" @focus="onfocus('Tar1')" 
                                                    ></el-input>
                                                </el-tooltip>
                                            </el-form-item>
                                            <el-form-item  prop="number">
                                                <el-tooltip class="item" 
                                                effect="light" 
                                                :popper-class="isTrueTar2?'offmytooltip':'onmytooltip'"
                                                :content="/^[1-9]\d*$/.test(item2.number) ? '正整数':'正整数'"
                                                :disabled="/^[1-9]\d*$/.test(item2.number) || isTrueTar2? true : false"
                                                :visible-arrow="false"
                                                placement="top">
                                                    <el-input v-model="item2.number" type="number"
                                                    @input="ondesignCapacity(item2)"
                                                    @blur="offBlur('Tar2')" @focus="onfocus('Tar2')"
                                                    ></el-input>
                                                </el-tooltip>
                                            </el-form-item>
                                            <div class="remove" v-if="index2 != 0" @click="removeYouhua(item, item2.id)">×</div>
                                        </el-form>
                                        <div v-show="design_capacity_vaild" class="design_capacity">容量已超过额定项目容量{{design_capacity}}MW</div>
                                    </div>
                                </div>
                                <!-- <div class="button" @click="addYouhua(item)">
                                    <span><icon name="add"></icon></span>
                                    <span>新增机型</span>
                                </div> -->
                                
                            </div>
                        </div>
                       
                    </div>
                </div>
        <!-- 第五步 -->
                <div  class="row" v-show="tabIndex === 4">
                    <div class="content">
                        <!-- accept=".xlsx" -->
                    <el-upload  action="/"  class="jiweidianUpload" 
                        :before-upload="beforeEpcUpload" :http-request="httpEpcRequest"><button ref="epcUpload"></button></el-upload>
                        <div class="fiveContent">
                            <p><el-checkbox v-model="checked_station"></el-checkbox>升压站设计
                                <span class="fiveTipShow" v-show="fiveTipShow1">不勾选将跳过升压站设计，计算完毕后将不包括该模块</span>
                            </p>
                                <div class="header" v-if="checked_station">
                                    <el-radio v-model="auto_station" label="1">自动升压站选址</el-radio>
                                    <el-radio v-model="auto_station" label="2">已有升压站坐标  </el-radio>
                                </div>
                                <div v-if="auto_station == '2' && checked_station" class="uploadBtn" :class="!station_Valid? 'stationFileError': ''" v-show="!stationFileName"
                                    @click="()=>{this.$refs.epcUpload.click()}"> 
                                    <span>+</span> 导入升压站站址坐标 
                                </div>
                                <div v-if="auto_station == '2' && checked_station" class="uploadBtn success" v-show="stationFileName"
                                    @click="()=>{this.$refs.epcUpload.click()}"> 
                                    {{stationFileName}}
                                </div>
                            <p><el-checkbox v-model="checked_line"></el-checkbox>自动集电线路设计
                                <span class="fiveTipShow" v-show="fiveTipShow2">不勾选将跳过集电线路设计，计算完毕后将不包括该模块</span>
                            </p>
                            <p><el-checkbox v-model="checked_road"></el-checkbox>自动场内道路设计
                                <span class="fiveTipShow" v-show="fiveTipShow3">不勾选将跳过场内道路设计，计算完毕后将不包括该模块</span>
                            </p>
                            <el-form :model="epcForm" ref="typeForm" class="demo-ruleForm"
                                label-width="100px">
                                <el-form-item  label="道路宽度：">
                                    <el-input v-model="epcForm.width" class="gf-table-input" readonly/>
                                </el-form-item>
                                <el-form-item  label="最大坡度：">
                                <el-input v-model="epcForm.ascent" class="gf-table-input" readonly/>
                                </el-form-item>
                                <el-form-item  label="转弯半径：">
                                    <el-input v-model="epcForm.radius" class="gf-table-input" readonly/>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                
        <!-- 提交 -->
                <div class="steps" :class=" stepClass ">
                    <div class="step-item step-prev" @click="decrease" v-if="tabIndex !==0">
                        <el-button class="gf-button" style="width: 100%" type="primary">
                            {{stepPrev}}
                        </el-button>
                    </div>
                    <div class="step-item step-next">
                        <el-button class="gf-button" @click="increase" style="width: 100%" type="primary"
                                   :loading="uploadLoading" :disabled="false">
                            {{stepNext}}
                        </el-button>
                    </div>
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

            <!-- 批量修改 -->
            <el-dialog title="批量调整机型数据"
                    :modal="false"
                    :visible.sync="dialogVisibleChange" 
                    :close-on-click-modal="false"
                    custom-class="changeDialog"
                    >
                <el-form :model="ruleFormChangeObj" ref="ruleFormChange" 
                label-width="100px" class="demo-ruleForm">
                    <el-form-item  label="选中：">
                        {{ selectedTurbineIds && selectedTurbineIds.length }}台
                    </el-form-item>
                    <el-form-item  label="机型：" style="text-align: justify;">
                        <el-select v-model="ruleFormChangeObj.jixing" popper-class="gf-popper" placeholder="请选择" >
                            <el-option v-for="item2 of turbineOptions" :key="item2.key"
                                    :label="item2.label" :value="item2.value"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="轮毂高度：">
                        <el-input type="number" v-model="ruleFormChangeObj.height" 
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
            <!-- //自定义机型 -->
            <type-dialog :turbineOptions="turbineOptions" @restoreType="restoreType" @changeType="changeType" ref="typeDialog"></type-dialog>
            <curve-dialog :userInfo="userInfo" @restoreType="restoreType" @changeCurve="changeCurve" ref="curveDialog"></curve-dialog>

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
    import typeDialog from './type-dialog';
    import curveDialog from './curve-dialog';


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
            errTip,
            typeDialog,
            curveDialog
        },
        mounted() {
            if(this.$store.state.user.loginUserInfo.role != 1){
                this.simulationMode = false;
            }
            
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
                if (parseFloat(value) <= 0 || parseFloat(value) > 1.5) {
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
                if (value == '' || value == null) {
                    callback(new Error('请选择文件'));
                } else {
                    callback();
                }
            };
            //正整数
            const validateNumber = (rule, value, callback) => {
                if (value == '' || value == null) {
                    callback(new Error('请输入参数'));
                } else if (!/^[1-9]\d*$/.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            return {
                design_capacity: null, //项目容量
                design_capacity_vaild: false,
                waitingUploading: false,
                tooltipShow1: false,  //显示查看说明
                tooltipShow2: false,
                imgDetail: true,
                tooltipShow3: false,
                tooltipShow4: false,
                tooltipShow5: false,
                waitingLoading: false,
                //
                epsg_src_Valid: true,  //验证出现redBorder
                epsg_dst_Valid: true,
                terrainValue_Valid: true,  //地形类型验证出现redBorder
                kmzFileName_Valid: true,  //kmz验证出现redBorder
                terrainUpload_Valid: true,  //地形上传验证出现redBorder
                terrainUpload_Valid2: true,  
                terrain_WT_Valid: true,  //仿真参数上传文件上传验证出现redBorder
                //
                terrainList: [],
                terrainValue : "",  //地形类型
                kmzFileName : "",  //kmz文件
                terrainId: 0,  // 0-平原、1-山地、2-丘陵、3-复杂山地
                confirmShow: false,   //txt确认框
                fengList: {
                    data: []
                },
                //第四步 optimize=>true=>优化
                nowSchemeIds: -1, //当前方案ID
                mergeIds: -1, // 导入机位点的当前方案ID
                nowTurbineIds: "", //当前修改机型的机位点ID
                oldTurbineType: "", //存储点击自定义前的机型
                oldCurve: null, //存储点击自定义前的功率曲线
                planNameArr:[],
                planArr1:[],  //方案
                planArr2:[],  //优化
                leftX: 0,
                leftX2: 0,
                dialogVisibleChange: false,  //批量改删
                ruleFormChangeObj:{      //批量改删
                    jixing: "",
                    height: ""
                },
                isCanClick: true,
                selectedTurbineIds:[],
                //
                targetOptions:[{
                    label:"发电量最优",
                    value:"发电量最优"
                },{
                    label:"LCOE最优",
                    value:"LCOE最优"
                }],
                //第五步
                shengyaListData: null, //上传升压站解析存起来的数据
                checked_station: true,  //是否勾选升压站
                checked_line: true,  
                checked_road: true,  
                auto_station: "2",  //1=>自动，2=>已有
                epcForm:{
                    width: 5,
                    ascent: 15,
                    radius: 40
                },
                stationFileName: null,
                station_Valid: true,  //上传升压站文件红框
                fiveTipShow1: false, //提示文字
                fiveTipShow2: false,
                fiveTipShow3: false,
                //
                validate1: true,
                validate2: true,
                validate3: true,
                validate4: true,
                validate5: true,
                //
                validTip3: true,
                planArr1ValidIndex:[], //验证机位点表单结果
                planArr2ValidIndex:[], //验证优化排布表单结果
                planArr2Target:[], //验证优化目标
                //
                // ------------------------
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
                isTrueTar1:true,
                isTrueTar2:true,
                spanArr:[],
                pos:0,
                myfile:null,
                isOpenTip:1,
                backisCopy:false,
                // rules: {
                //     name: [
                //         { required: true, message: '请输入活动名称', trigger: 'blur' },
                //         { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                //     ],
                // },
                pcs:null,  //上一次的pcs名字
                downLoadTip: true,
                shuomingTip: true,
                
                validateMastListCodea: validateMastListCode,
                validateMastListHeighta: validateMastListHeight,
                turbinListCode: turbinListCode,
                validateSelecta: validateSelect,
                validateFileName: validateFileName,
                epsgTipShow: false,
                uploadTerrainName: null,
                formInline: {
                    user: '',
                    region: ''
                },
                epsg_id: null,
                uploadTabActiveFirst: true,
                userInfo: {},
                tmpRow: '', // 风机型号暂存
                nextDisable4: false,
                nextDisable3: false,
                nextDisable2: false,
                expandTableClassName: 'height766',
                files: [],
                uploadedFolder: [],
                uploadSuccess: false,
                toolTipShow: false,
                tabIndex: 0,
                dialogVisible: false,
                projectId: '',
                prevUploadInfo: this.defaultPrevUploadInfo(),
                isAerialUploaded: false,
                // mastList: [],
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
                epcRules: {
                    target:[
                        {validator: validateSelect, trigger: 'change'}
                    ],
                    turbine_type:[
                        {validator: validateSelect, trigger: 'change'}
                    ],
                    height:[
                        {validator: validateMastListHeight, trigger: 'blur'}
                    ],
                    number:[
                        {validator: validateNumber, trigger: 'blur'}
                    ]
                },
                turbineOptions: [],
                totalPictures: 0,
                totalText: 0,
                UploadBegin: false,
                uploadCompleted: true,
                mastListFormRules: {
                    code: [
                        {validator: validateMastListCode, trigger: 'blur'}
                    ],
                    x: [
                        
                    ],
                    y: [

                    ],
                    height: [
                   
                    ]
                },
                projectInfo: {},
                deleting: false,
                pcsOptions: [],
                epsg_src: null, // 源坐标系
                // epsg_dst_copy: null, // 目标坐标系
                epsg_dst: null, // 目标坐标系
                target_epsg_id: null,
                uploadTerrainBox: false,
                azbStatus: true,  //第三步
                bzbStatus: true,  //第四步
                acftStatus: true,
                bcftStatus: true,
                cascaderStatus: true,
                landStatus: true,
                towerList: [],   //点加号后  复制的一行数据push在这里
                // simulationOption: {mode:0, goldfoamSelected:true, wtSelected:false } // 流场仿真模式 0：GoldFoam；1：WT
                simulationMode: false, // 流场仿真模式 T：GoldFoam；F：WT
                waitingDel : false,
                tabIndexDelNum: null,  //存储第几步
                is_wt: "0"    //0gf  1wt
            };
        },
        computed: {
         
            // 编号验证结果
            bianhao() {

            },
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
            dialogMarginTop() {
                return (document.body.clientHeight - ((this.expandTableClassName === 'height766') ? 600 : 906)) / 2 + 'px';
            },
            tabItemFirst() {
                if (this.tabIndex >= 0) return {active: true};
            },
            tabItemSecond() {
                if (this.tabIndex >= 1) return {active: true};
            },
            tabItemThird() {
                if (this.tabIndex >= 2) return {active: true};
            },
            tabItemFour() {
                if (this.tabIndex >= 3) return {active: true};
            },
            tabItemFive() {
                if (this.tabIndex >= 4) return {active: true};
            },
            stepPrev() {
                if (this.tabIndex > 0) return '上一步';
            },
            stepNext() {
                if (this.tabIndex < 4) return '下一步';
                return '提交计算';
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
                    // let mast = this.mastList.find((i) => {
                    //     return i.id === item.mast_id;
                    // });
                    let mast = this.mastList.data.find((i) => {
                        return i.id === item.mast_id;
                    });
                    if (!mast) {
                        opData.push({op: 'delete', data: item});
                    }
                });
                // this.mastList.forEach((item, index) => {
                //     let mast = this.prevUploadInfo.mastInfo.find((prevItem) => {
                //         return prevItem.mast_id === item.id;
                //     });
                //     if (!item.id) {
                //         if (item.code || item.x || item.y || item.height || item.file) {
                //             opData.push({op: 'insert', data: item});
                //         }
                //     } else if (item.code != mast.mast_name || item.x != mast.coordinate_x ||
                //         item.y != mast.coordinate_y || item.height != mast.height || item.file) {
                //         opData.push({op: 'update', data: item});
                //     }
                // });
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
                        item.y !== mast.coordinate_y || item.height !== mast.height || item.filename != mast.filename|| item.filename_txt != mast.filename_txt) {
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
            turbineFileTempUrl: function () {
                return util.baseUrl + '/input_turbine_file';
            },
            // 下载UAV模板
            output_template() {
                if (this.tabIndex === 0) return util.baseUrl + '/output_template?args=uav';// 无人机
                if (this.tabIndex === 2) return util.baseUrl + '/output_template?args=mast';// 测风数据模版下载
                if (this.tabIndex === 3) return util.baseUrl + '/output_template?args=wt';// 风机排布模版下载
            },
            //-----------------------------
            terrainUavUrl() {
                return util.baseUrl + '/output_template?args=uav';// 无人机
            },
            loginUserInfo () {
                return this.$store.state.user.loginUserInfo;
            },
            // 视频
            videoUrl (){
                // https://goldfarm2.s3.cn-north-1.amazonaws.com.cn/static/video/video_a.mp4
                return util.baseUrl + "/static/video/video_a.mp4";
            },
            stepClass (){
                if(!this.simulationMode && this.tabIndex==1){
                    return "twoContentsteps";
                }
                if(this.tabIndex==3){
                    return "fourContentsteps";
                }
                if(this.tabIndex==4){
                    return "fiveContentsteps";
                }
            }
        },
        watch: {
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
                this.cascaderStatus = true;
            },
            target_epsg_id() {
                this.epsg_id = this.target_epsg_id;
            },
            uploadTerrainName() {
                this.landStatus = true;
            },
            waitingDel () {
                this.$store.commit('globeLoading', {loading: this.waitingDel, text: '正在删除数据...'});
            },
            //-------------------------
            waitingLoading () {
                this.$store.commit('globeLoading', {loading: this.waitingLoading, text: '正在上传数据文件，请稍后...'});
            },
            waitingUploading (){
                this.$store.commit('globeLoading', {loading: this.waitingUploading, text: '正在提交数据，请稍后...'});
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
            kmzFileName(val){
                if(!val){
                    this.kmzFileName_Valid = false;
                }else{
                    this.terrainValue_Valid = true;
                }
            },
            stationFileName(val){
                if(!val){
                    this.station_Valid = false;
                }else{
                    this.station_Valid = true;
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
            checked_station(val){
                if(!val){
                    this.checkedLine = val;
                    this.fiveTipShow1 = true;
                    setTimeout(()=>{
                        this.fiveTipShow1 = false;
                    },2000)
                }
            },
            checked_line(val){
                if(!val){
                    this.fiveTipShow2 = true;
                    setTimeout(()=>{
                        this.fiveTipShow2 = false;
                    },2000)
                }
            },
            checked_road(val){
                if(!val){
                    this.fiveTipShow3 = true;
                    setTimeout(()=>{
                        this.fiveTipShow3 = false;
                    },2000)
                }
            }
        },
        updated() {
            
            // this.getSpanArr(this.mastList.data);
            // this.mastList.data
            
        },
       
        methods: {
            //数量*单机容量超出项目容量，出现提示语
            ondesignCapacity(item){
                if(item.turbine_type){
                    let type = item.turbine_type;
                    let arr = type.split("/");
                    let str = arr[arr.length-1];
                    console.log(str)
                    if( (item.number*str) > (this.design_capacity*1000) ){
                        this.design_capacity_vaild = true;
                    }else{
                        this.design_capacity_vaild = false;
                    }
                }

            },
            //测试需求，红框的时候才显示tooltip
            onfocus(index){
                this['isTrue'+index] = false;
            },
            offBlur(index){
                this['isTrue'+index] = false;
            },
            turbineMoban(type){
                let link = document.createElement('a');
                link.style.display = 'none';
                link.target = '_blank';
                link.href = util.baseUrl + "/output_template?args=wt";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            //
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
                    callback(new Error('X为-180-180，允许输入到小数点后四位'));
                }
                //  else if (!/^(([1-9]?[0-9]|1[0-7][0-9])(\.\d{1,4})?|180)$/.test(value)) {
                //     callback(new Error('X为0-180，允许输入到小数点后四位'));
                // } 
                // /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/
                 else if (!/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(value)) {
                    callback(new Error('X为-180-180，允许输入到小数点后四位'));
                } 
                else {
                    callback();
                }
            },
            // WGS84投影坐标Y
            validateWGS84Y(rule, value, callback) {
                if (value === '') {
                    callback(new Error('Y为-90-90，允许输入到小数点后四位'));
                }
                //  else if (!/^(([1-9]?[0-9]|1[0-7][0-9])(\.\d{1,4})?|180)$/.test(value)) {
                //     callback(new Error('Y为0-180，允许输入到小数点后四位'));
                // }
                         // /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
                 else if (!/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(value)) {
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
                    callback(new Error('X为6位正数，允许输入到小数点后四位'));
                } else {
                    callback();
                }
            },
            // 其他投影坐标X
            validateCoordinateX(rule, value, callback) {
                if (value === '') { 
                    callback(new Error('X为8位正数，允许输入到小数点后四位'));
                } else if (!/^[\d]{8}(\.\d{1,4})?$/.test(value)) {                     
                    callback(new Error('X为8位正数，允许输入到小数点后四位'));
                } else {
                    callback();
                }
            },
            // 其他投影坐标Y
            validateCoordinateY(rule, value, callback) {
                if (value === '') {
                    callback(new Error('X为7位正数，允许输入到小数点后两四位'));
                } else if (!/^[\d]{7}(\.\d{1,4})?$/.test(value)) {
                    callback(new Error('X为7位正数，允许输入到小数点后四位'));
                } else {
                    callback();
                }
            },
            // 关闭前回调
            beforeClose(done) {
                if (this.$refs.progressBar.visibility) {
                    this.$refs.progressBar.close(done);
                } else {
                    done();
                    this.projectId=null;
                    this.$emit('close');
                }
                
                //暂停视频
                this.$refs.video && this.$refs.video.pause();
            },
            onConfirmCancel(done) {
                this.beforeClose(done);
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
            // 处理功率曲线级联选择框 ------jia
            handleChange(value, row, index) {
                // console.log(value[1].split(".")[1])
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
                // else{
                //     if (index === 0 && value[0] !== 'upload') {
                //         console.log(this.turbineList.data)
                //         for (let i = 0; i < this.turbineList.data.length; i++) {
                //             this.turbineList.data.splice(i, 1, {
                //                 code: this.turbineList.data[i].code,
                //                 type: this.turbineList.data[i].type,
                //                 x: this.turbineList.data[i].x,
                //                 y: this.turbineList.data[i].y,
                //                 turbine_id: this.turbineList.data[i].turbine_id,
                //                 height: this.turbineList.data[i].height,
                //                 power_curve_filename: row.power_curve_filename,
                //                 input_power_curve_list: [
                //                     {
                //                         value: 'list',
                //                         label: '功率曲线库',
                //                         children: row.input_power_curve_list[0].children
                //                     },
                //                     {
                //                         value: 'upload',
                //                         label: '自定义'
                //                     }
                //                 ]
                //             });
                //             this.deleting = true;
                //         }
                //     }
                // }

                if (value[0] === 'upload') {
                    

                    row.power_curve_filename = ['list', this.getDefaultPowerCurveFileName(row.input_power_curve_list[0].children)];
                    this.tmpRow = row;
                    this.upload();
                    
                }
                // console.log(value, row, index)
            },
            goCheck() {
                this.dialogVisible = false;
                this.$emit('calculateStarted', this.projectId );
            },
            // 内部table展开事件处理
            onExpandHandle(status) {
                (status) ? this.expandTableClassName = 'height906' : this.expandTableClassName = 'height766';
            },
            //切换事件
            uploadTabChange(oldisTrue, isTrue){
                this.uploadTabActiveFirst = oldisTrue;
            },
            simulationChange(isTrue){
                this.simulationMode = isTrue;
                if(isTrue) this.$refs.video && this.$refs.video.pause();
            },
            //路径格式
            getKmlFileUrl (fileName) {
                let newfileName = encodeURIComponent(fileName);
                // https://goldfarm2.s3.cn-north-1.amazonaws.com.cn/56015/UAV/input/area_features.kmz
                return util.S3Path + this.projectId + '/UAV/input/area_features.kmz';
            },
            //上传KMZ前
            beforeKmzUpload(file){
                // console.log(file);
                let fileName = file.name;
                let arr = fileName.split(".");
                let str = arr[arr.length-1];
                // console.log(str);
                if(str != "kmz" && str != "KMZ" && str != "kml" && str != "KML"){
                    this.$message.error("请选择后缀为.kmz/.kml的文件！");
                    return false;
                }
                if (/^.*[\s]+.*$/.test(file.name)) {
                    this.$message.error('文件名中不能含有空格！');
                    return false;
                }
            },
            //自定义上传KMZ
            httpKmzRequest(option){
                // console.log(option);
                this.waitingLoading = true;
                let fileName = option.file.name;
                let data = new FormData();
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                data.append("map_km_file",option.file);
                util.ajax.post('/map_km_upload/'+this.projectId, data, config)
                .then((res) => {
                    // console.log(res);
                    if(res.data.code == 201){
                        
                        this.kmzFileName = fileName;
                        this.waitingLoading = false;
                    }else{
                        this.$message.error("上传文件失败！");
                        this.waitingLoading = false;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.waitingLoading = false;
                    this.$message.error("上传文件失败！");
                });
                
            },
            
            //init获取KMZ
            getKmzData(){
                util.ajax.get('/map_km_upload/'+this.projectId).then((res)=>{
                    // console.log(res)
                    if(res.data.code == 201){
                        this.kmzFileName = res.data.data.filename;
                    }else{
                        this.kmzFileName = "";
                    }
                }).catch((err)=>{
                    console.log(err);
                    this.kmzFileName = "";
                    this.$message.error("获取风场范围数据失败！");
                })
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
             //测风塔信息
            onClickMastlistUpload(){
                this.$refs['mastlistUpload'].click();
            },
            //第四步
            //机位点
            onClickTurbineUpload(item){
                // console.log(item);
                this.mergeIds = item.id;
                this.$refs['turbineUpload'].click();
            },
            //机位点导入前
            beforeTurbineUpload(file){
                if(file.type != "text/plain"){
                    this.$message.error("请选择后缀为.txt的文件！");
                    return false;
                }
            },
            //导入机位点自定义
            httpTurbineRequest(option){
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
                    
                    this.mergeTurbineListNew(res.data.data);
                }).catch(() => {
                    this.loading.close();
                    this.$message.error('文件上传失败');
                });
            },
            //转格式 
            mergeTurbineListNew(newList){
                if (!newList) return;
                // console.log(newList);
                var templist = []
                newList.forEach((item) => {
                    if (!item ) return;
                    templist.push({
                        id : Math.floor(Math.random()*10000),
                        turbine_id: '',
                        turbine_name: item.turbine_name,
                        coordinate_x: item.coordinate_x,
                        coordinate_y: item.coordinate_y,
                        height: item.height,
                        turbine_type: "",
                        power_curve_filename: [],
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
                });
                 this.planArr1.forEach((item,index)=>{
                    if(item.id == this.mergeIds){
                        item.data = templist;
                    }
                })
               
            },
            //退出自定义还原之前的值
            restoreType(isTrue, optimize){
                let that = this;
                if(!optimize){
                    this.planArr1.forEach((item,index)=>{
                        if(item.id == that.nowSchemeIds){
                            item.data.forEach((item2,index2)=>{
                                if(item2.id == that.nowTurbineIds){
                                    if(isTrue){
                                        item2.turbine_type = that.oldTurbineType;
                                    }else{
                                        item2.power_curve_filename = that.oldCurve;
                                    }
                                }
                            })
                        }
                    })
                }else{
                    this.planArr2.forEach((item,index)=>{
                        if(item.id == that.nowSchemeIds){
                            item.data.forEach((item2,index2)=>{
                                if(item2.id == that.nowTurbineIds){
                                    if(isTrue){
                                        item2.turbine_type = that.oldTurbineType;
                                    }else{
                                        item2.power_curve_filename = that.oldCurve;
                                    }
                                }
                            })
                        }
                    })
                }
                 
            },
            postTurbineType(value, height, item2, that){
                util.ajax.post('/properties/'+ this.loginUserInfo.user_id, {
                    turbine_type: value,
                    turbine_height: height,
                }).then((res)=>{
                    // console.log(res)
                    if(res.data.code != 201){
                        this.$message.error("上传失败："+ res.data.message);
                        this.getTurbineType();
                        return;
                    }
                    item2.turbine_type = value;
                    that.loadTurbineTypeList(value, (list) => {
                        item2.input_power_curve_list[0].children = list;
                        item2.power_curve_filename = ['list', ''];
                    });
                    that.turbineOptions.unshift({
                        key:'T'+ Math.floor(Math.random()*10000),
                        value: value,
                        label: value
                    })

                }).catch((err)=>{
                    console.log(err);
                    this.$message.error("上传自定义机型失败");
                    this.getTurbineType();
                })
            },
            changeType(value ,optimize, height){
                //nowTurbineIds  --  nowSchemeIds
               
                let that = this;
                if(!optimize){
                    this.planArr1.forEach((item,index)=>{
                        if(item.id == that.nowSchemeIds){
                            item.data.forEach((item2,index2)=>{
                                if(item2.id == that.nowTurbineIds){
                                    that.postTurbineType(value, height, item2, that);
                                    
                                }
                            })
                        }
                    })
                }else{
                    this.planArr2.forEach((item,index)=>{
                        if(item.id == that.nowSchemeIds){
                            item.data.forEach((item2,index2)=>{
                                if(item2.id == that.nowTurbineIds){
                                    that.postTurbineType(value, height, item2, that);
                                    
                                }
                            })
                        }
                    })
                }
            },
            changeCurve(value, turbine_type, optimize){
                // console.log(value, turbine_type, optimize)
                let that = this;
                if(!optimize){
                    this.planArr1.forEach((item,index)=>{
                        if(item.id == that.nowSchemeIds){
                            item.data.forEach((item2,index2)=>{
                                if(item2.turbine_type == turbine_type){
                                    that.loadTurbineTypeList(turbine_type, (list) => {
                                        item2.input_power_curve_list[0].children = list;
                                        if(item2.id == that.nowTurbineIds){
                                            item2.power_curve_filename = ['list', list[list.length-1].value];
                                        }
                                    });
                                }
                            })
                        }
                    })
                }else{
                    this.planArr2.forEach((item,index)=>{
                        if(item.id == that.nowSchemeIds){
                            item.data.forEach((item2,index2)=>{
                                if(item2.turbine_type == turbine_type){
                                    that.loadTurbineTypeList(turbine_type, (list) => {
                                        item2.input_power_curve_list[0].children = list;
                                        if(item2.id == that.nowTurbineIds){
                                            item2.power_curve_filename = ['list', list[list.length-1].value];
                                        }
                                    });
                                }
                            })
                        }
                    })
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
                }  
            },
            //删除所选
            delAllJiwei(){
                // console.log(this.selectedTurbineIds)
                // console.log(this.nowSchemeIds)
                let that = this;
                if(!this.isCanClick){
                    this.planNameArr.forEach((item,index)=>{
                        if(item.id == that.nowSchemeIds){
                            console.log(item)
                            for (let i = 0; i < that.selectedTurbineIds.length; i++) {
                                for (let j = 0; j < item.data.length; j++) {
                                    if(item.data[j].id == that.selectedTurbineIds[i].id){
                                        item.data.splice(j,1);
                                    }
                                }
                            }
                        }
                    })
                }
            },
            //确定修改
            submitForm(){
                // console.log(this.ruleFormChangeObj)
                // console.log(this.selectedTurbineIds)
                // console.log(this.nowSchemeIds)
                if(!this.ruleFormChangeObj.jixing || !this.ruleFormChangeObj.height){
                    this.$message.warning("内容不能为空！");
                    return;
                }

                let that = this;
                let type = this.ruleFormChangeObj.jixing;
                let height = this.ruleFormChangeObj.height;
                this.planNameArr.filter((item,index)=> {
                    if(item.id == that.nowSchemeIds){
                        for (let i = 0; i < that.selectedTurbineIds.length; i++) {
                            for (let j = 0; j < item.data.length; j++) {
                                if(item.data[j].id == that.selectedTurbineIds[i].id){
                                    // console.log(item.data[j])
                                     that.loadTurbineTypeList(type, (list) => {
                                        item.data[j].turbine_type = type;
                                        item.data[j].height = height;
                                        item.data[j].power_curve_filename = ['list', that.getDefaultPowerCurveFileName(list)];
                                        item.data[j].input_power_curve_list = [
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
                            }
                        }
                    }
                })
                
               
                this.ruleFormChangeObj = {
                    jixing: "",
                    height: ""
                }
                this.dialogVisibleChange = false;
            },
            //添加方案
            addPlan( type ){
                this.planNameArr.forEach((item,index)=>{
                    item.isOpen = false;
                })
                let newObj = {
                    id:  Math.floor(Math.random()*10000),  
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
                            children: []
                        },
                        {
                            value: 'upload',
                            label: '自定义'
                        }
                    ]
                }
                if(!type){
                    if(this.planArr1.length >= 20){
                        this.$message.warning("新建已有方案不能超20个！");
                        return;
                    }
                    let ids = Math.floor(Math.random()*10000);
                    let obj = {
                        scheme_name: "默认方案",
                        id: -1,
                        scheme_id: -1,
                        optimize: false,
                        data:[newObj],
                        isOpen: true,
                        readonly: true
                    }
                    if(this.planArr1.length<=0){
                        this.nowSchemeIds = -1;
                        this.planNameArr.push(obj);
                    }else{
                        this.nowSchemeIds = ids;
                        this.planNameArr.push(
                           {
                                scheme_name: "新增方案",
                                id: ids,
                                scheme_id: "",
                                optimize: type,
                                data:[newObj],
                                isOpen: true,
                                readonly: true
                            }
                        )
                    }
                }else{
                    if(this.planArr2.length >= 10){
                        this.$message.warning("新建优化排布方案不能超10个！");
                        return;
                    }
                    let ids = Math.floor(Math.random()*10000);
                    this.nowSchemeIds = ids;
                     this.planNameArr.push(
                       {
                            scheme_name: "新增优化方案",
                            id: ids,
                            scheme_id: "",
                            optimize: type,
                            target: "",
                            data:[{
                                id: Math.floor(Math.random()*10000),
                                number: "",
                                height: "",
                                turbine_type: "",
                                power_curve_filename: null,
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
                            }],
                            isOpen: true,
                            readonly: true
                        }
                    )
                }
            },
            //删除方案
            removePlan(item,index){
                console.log(item,index)
                if(item.id == -1){
                    this.$message.warning("默认方案不可删除！");
                    return;
                }
                this.planNameArr.forEach((item2,index2)=>{
                    if(item2.id == item.id && item2.id != -1){
                        console.log(item2)
                        this.planNameArr.splice(index2,1);
                        this.leftX = 0;
                        this.leftX2 = 0;
                    }
                })
                console.log(this.planNameArr)
            },
            //
            changePlan(item,index){
                if(item.id == -1){
                    this.$message.warning("默认方案名字不可修改！");
                    return;
                }
                item.readonly = false;
            },
            //选中方案
            selectedPlan(item){
                this.nowSchemeIds = item.id;
                console.log(this.nowSchemeIds);
                if(!item.isOpen && item.readonly){
                    console.log(item);
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
           
            //新增一个机型--优化
            addYouhua(obj){
                console.log(obj);
                var newObj = {
                    id:  Math.floor(Math.random()*10000),  
                    number: "",
                    height: "",
                    turbine_type: "",
                    power_curve_filename: null,
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
                }
                obj.data.push(newObj);
            },
            //删除一个机型--优化
            removeYouhua(obj , id){
                console.log(obj);
                obj.data.forEach((item,index)=>{
                    if(item.id == id){
                        obj.data.splice(index,1);
                    }
                })
            },
            //新增一行机位点
            addTurbineNew(obj){
                // console.log(obj);
                var newObj = {
                    id:  Math.floor(Math.random()*10000),  
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
                            children: []
                        },
                        {
                            value: 'upload',
                            label: '自定义'
                        }
                    ]
                }
                obj.data.push(newObj);
            },
            //选择前存储机型,自定义机型取消用来还原
            visibleChange(type, index, obj, row){
                // console.log(type, index,obj,row);
                if(type){
                    this.oldTurbineType = obj.turbine_type;
                }
            },
            visibleChange2(type, index, obj){
                // console.log(type, index, obj);
                if(type){
                    this.oldTurbineType = obj.turbine_type;
                }
            },
            
             //选择机型事件--新
            handleTurboTypeChangeNew(index,obj,row){
                // console.log(index,obj,row);
                this.nowTurbineIds = obj.id; 
                if(obj.turbine_type == "自定义机型"){
                    obj.turbine_type = this.oldTurbineType;
                    this.$refs.typeDialog.open(false);
                    return;
                }
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
                                    that.oldCurve = ['list', that.getDefaultPowerCurveFileName(list)];
                                })
                            }
                        })
                        
                    });

                }else{
                    const type = obj.turbine_type;
                    this.loadTurbineTypeList(type, (list) => {
                        console.log(list)
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
                        that.oldCurve = ['list', that.getDefaultPowerCurveFileName(list)];
                    });

                }
            },
            //选择功率曲线事件--新
            handleChangeNew(value, obj, row, index){
                // console.log(value, obj, row, index);
                this.nowTurbineIds = obj.id;
                if( value[0] == 'upload'){
                    this.$refs.curveDialog.open(obj.turbine_type, false);
                }
            },
            //优化排布--选择机型事件--新
            handleTurboTypeChangeYouhuaNew(index,row,arr){
                console.log(index,row,arr)
                let that = this;
                let obj = arr[index];

                this.nowTurbineIds = obj.id; 
                if(obj.turbine_type == "自定义机型"){
                    obj.turbine_type = this.oldTurbineType;
                    this.$refs.typeDialog.open(true);
                    return;
                }

                const type = obj.turbine_type;
                this.loadTurbineTypeList(type, (list) => {
                    
                    obj.turbine_type = type;
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
                    that.oldCurve = ['list', that.getDefaultPowerCurveFileName(list)];
                });
  
            },
            //优化排布  ----   选择功率曲线事件--新
            handleChangeyouhuaNew(value, obj){
                // console.log(value,obj)
                this.nowTurbineIds = obj.id;
                if( value[0] == 'upload'){
                    this.$refs.curveDialog.open(obj.turbine_type, true);
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
            //第五步
            //上传升压站文件前
            beforeEpcUpload(file){
                let stra = file.name.split(".")
                let strb = stra[stra.length-1]
                // console.log(strb)
                if(strb != 'xlsx' && strb != 'xls'){
                    this.$message.warning('请选择文件格式为.xlsx/.xls');
                    return false;
                }
            },
            //自定义上传升压站文件
            httpEpcRequest(option){
                console.log(option)
                this.waitingLoading = true;
                let data = new FormData();
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                
                data.append('syz_excel', option.file,option.file.name);
                util.ajax.post("/reveal_station_read", data, config)
                .then((res) => {
                    this.waitingLoading = false;
                    if(res.data.code == 200){
                        this.shengyaListData = res.data.data;
                        this.stationFileName = option.file.name;
                        console.log(this.shengyaListData,"解析升压站返回数据");
                    }else{
                        this.$message.error(res.data.message);
                        this.stationFileName = "";
                    }
                })
                .catch((err) => {
                    this.waitingLoading = false;
                    console.log(err);
                    this.stationFileName = "";
                });
            },
            // 、、
            //第二步cfd表单验证
            valid2(){
                var isTrue = true;
                if(this.$refs.cfdForm){
                    this.$refs.cfdForm.validate((valid) => {
                        console.log("cfdForm表单验证："+ valid);
                        isTrue = valid;
                        return valid;
                    });

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
            increase1(){
                //判断源坐标系epsg_src，地形类型terrainValue，地形上传uploadTabActiveFirst=true=>uploadedFolder[0].name / if=false=>uploadTerrainName
                //kmz===>  kmzFileName
                if(this.uploadTabActiveFirst && this.uploadedFolder.length   && this.epsg_src && this.kmzFileName){
                    return true;
                }
                else if(!this.uploadTabActiveFirst && this.uploadTerrainName  && this.epsg_src && this.kmzFileName){  
                    return true;
                }
                else{
                    if(!this.epsg_src){
                        this.epsg_src_Valid = false;
                    }
                    if(!this.epsg_dst){
                        this.epsg_dst_Valid = false;
                    }
                   
                    if(this.uploadTabActiveFirst && this.uploadedFolder.length<=0){
                        this.terrainUpload_Valid = false;
                    }else{
                        this.terrainUpload_Valid = true;
                    }
                    if(!this.uploadTabActiveFirst && !this.uploadTerrainName){
                        this.terrainUpload_Valid2 = false;
                    }else{
                        this.terrainUpload_Valid2 = true;
                    }
                    if(!this.kmzFileName){
                        this.kmzFileName_Valid = false;
                    }else{
                        this.kmzFileName_Valid = true;
                    }

                    return false;
                }
            },
            increase2(){
                if( !this.simulationMode  && this.$refs.wtFileUpload && this.$refs.wtFileUpload.fileName==null){
                    this.terrain_WT_Valid = false;
                }else{
                    this.terrain_WT_Valid = true;
                }
                //判断simulationMode=true=> valid2() , if=false=>cfdForm.air_density_input 、this.$refs.wtFileUpload.fileName!==null,
                if( this.simulationMode && this.valid2() ){
                    return true;
                }
                else if( !this.simulationMode && this.valid2() && this.$refs.wtFileUpload && this.$refs.wtFileUpload.fileName!==null ){
                    return true;
                }
                else{
                    return false;
                }
            },
            increase3(){
                //判断目标坐标系epsg_dst，表格验证this.valid3()
                if( this.valid3() ){
                    return true;
                }else{
                    return false;
                }
            },
            valid4(index){
                var isTrue4 = true;
                // console.log(this.$refs['turbineListRef'+index])
                this.$refs['turbineListRef'+index][0].validate(valid => {
                    // console.log("mastListForm表单验证："+ valid);
                    isTrue4 = valid;
                    return valid;
                });
                return {
                    index,
                    isTrue4
                };
            },
            validYou4(index, index2){
                var isTrueYou4 = true;
                this.$refs[index + 'optForm'+index2][0].validate(valid => {
                    isTrueYou4 = valid;
                    return valid;
                });
                return {
                    index: index,
                    isTrueYou4: isTrueYou4
                };
            },
            validTarget(index){
                var isTarget = true;
                this.$refs['targetForm'+index][0].validate(valid => {
                    isTarget = valid;
                    return valid;
                });
                return isTarget;
            },
            increase4(){
                //验证全部数据
                this.planArr1ValidIndex = [];
                this.planArr2ValidIndex = [];
                this.planArr2Target = [];
                this.planArr1.forEach((item,index)=>{
                    if(!this.valid4(index).isTrue4){
                        this.planArr1ValidIndex.push(this.valid4(index).index);
                    }
                })
                this.planArr2.forEach((item,index)=>{
                    this.planArr2Target.push(this.validTarget(index));
                    item.data.forEach((item2,index2)=>{
                        if(!this.validYou4(index, index2).isTrueYou4){
                            this.planArr2ValidIndex.push(this.validYou4(index, index2).index);
                        }
                    })
                })
                console.log("机位点验证不通过的index：");
                console.log(this.planArr1ValidIndex);
                console.log("优化排布验证不通过的index：");
                console.log(this.planArr2ValidIndex);
                console.log("优化目标：");
                console.log(this.planArr2Target);

                let targetType = this.planArr2Target.some((item,index)=> item == false );

                if( this.planArr1ValidIndex.length <= 0 && this.planArr2ValidIndex.length <= 0 && !targetType){
                    return true;
                }else{
                    return false;
                }
            },
            increase5(){
                if(this.auto_station == '2' && this.checked_station && this.stationFileName){
                    this.station_Valid = true;
                    return true;
                }
                else if (this.auto_station == '1' && this.checked_station){
                    return true;
                }
                else if (!this.checked_station){
                    return true;
                }
                else{
                    this.station_Valid = false;
                    return false;
                }
            },
            // 下一步
            increase() {
                this.defaultTooltip();
                switch (this.tabIndex){
                    case 0 :
                        this.validate1 = this.increase1();
                    break;
                    case 1 :
                        this.validate2 = this.increase2();
                    break;
                    case 2 :
                        this.validate3 = this.increase3();
                        this.increase3tip();
                    break;
                    case 3 :
                        this.validate4 = this.increase4();
                    break;
                    case 4 :
                        this.validate5 = this.increase5();
                    break;
                }
                console.log("总验证：",this.validate1,this.validate2,this.validate3,this.validate4,this.validate5)
                
                if (this.tabIndex == 4 && this.validate1 && this.validate2 && this.validate3 && this.validTip3 && this.validate4 && this.validate5) {
                    this.doUpload();
                }
                if (this.tabIndex < 4 && this.validate1 && this.validate2 && this.validate3 && this.validTip3 && this.validate4 && this.validate5) {
                    this.tabIndex++;
                }
                 
            },
            
            // 上一步
            decrease() {
                this.defaultTooltip();
                if (this.tabIndex > 0) this.tabIndex--;
                for(let i=0; i<= 4; i++){
                    this['validate'+(i+1)] = true;
                }
            },
            increase3tip(){
                var arrdata = this.mastList.data.filter((item,index)=>{
                    return !item.isCopy
                })
                // console.log(arrdata,"过滤掉isCopy")
                var temp = [];
                var index = [];
                var temp2 = [];
                var index2 = [];
                for(var i = 0; i < arrdata.length; i++) {
                    for(var j = i + 1; j < arrdata.length; j++){
                        if ((arrdata[i].x == arrdata[j].x)&&(arrdata[i].y == arrdata[j].y)){
                            index.push(j)
                            i++;
                            j = i;
                        }
                        if ((arrdata[i].code == arrdata[j].code)&&(arrdata[i].code == arrdata[j].code)){
                            index2.push(j)
                            i++;
                            j = i;
                        }
                    }
                    temp.push(arrdata[i]);
                    temp2.push(arrdata[i]);
                }  
                // console.log(temp)原数据
                for(var i = 0 ; i < index.length - 1; i ++){
                    for(var j = 0 ; j < index.length - i - 1; j ++){
                        if(index[j] > index[j + 1]){	
                            var ls = index[j];
                            index[j] = index[j + 1];
                            index[j + 1] = ls;
                        }
                    }
                }
                for(var i = 0 ; i < index2.length - 1; i ++){
                    for(var j = 0 ; j < index2.length - i - 1; j ++){
                        if(index2[j] > index2[j + 1]){	
                            var ls2 = index[j];
                            index2[j] = index2[j + 1];
                            index2[j + 1] = ls2;
                        }
                    }
                }
                var str = "";
                var str2 = "";
                for(let i=0; i<index.length; i++){
                    str += (index[i]+1)+",";
                }
                for(let i=0; i<index2.length; i++){
                    str2 += (index2[i]+1)+",";
                }
                str = str.substring(0,str.length-1);
                str2 = str2.substring(0,str2.length-1);
       
                if(index.length>0) {
                    this.$message.error("第"+(str)+"个与之前坐标数据有重复");
                    this.validTip3 = false;
                    return false;
                }else {
                    this.validTip3 = true;
                }
                if(index2.length>0) {
                    this.$message.error("第"+(str2)+"个与之前测风塔编号有重复");
                    this.validTip3 = false;
                    return false;
                }else {
                    this.validTip3 = true;
                }
                //过滤出来判断高度，
                var arrayTwo = Object.values(this.mastList.data.reduce((res, item) => {
                    res[item.code] ? res[item.code].push(item) : res[item.code] = [item];
                    return res;
                }, {}));

                let aaa = true;
                arrayTwo.forEach((item,index)=>{
                    if(item.length>1){
                        for(var i = 0; i < item.length; i++) {
                            for(var j = i + 1; j < item.length; j++){
                                if ((item[i].height == item[j].height)){
                                //    console.log("有重复")
                                this.$message.error("多个高度里面有重复！");  
                                aaa = false;
                                return false;                               
                                    i++;
                                    j=i;
                                    break;
                                }
                            }
                        }
                    }
                })
                if(aaa){
                    this.validTip3 = true;
                }else{
                    this.validTip3 = false;
                }
            },
            // 获取upload组件返回的fileList
            fileFormChangeHandle(fileForm) {
                this.uploadedFolder = fileForm;
            },
            // 数据上传完成监听事件
            uploadCompletedHandle(status) {
                this.uploadCompleted = status;       
            },
            handleClick() {
                
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
            onCloseProgressBar () {
                this.$refs['progressBar'].closePorgressBar();
            },
            defaultTooltip (){
                this.tooltipShow1 = false;
                this.tooltipShow2 = false;
                this.tooltipShow3 = false;
                this.tooltipShow4 = false;
                this.tooltipShow5 = false;
            },
            //get第四步
            loadTurbineInfoNew(){
                this.planNameArr = []
                util.ajax.get("/scheme_upload/"+ this.projectId).then((res)=>{
                    // console.log(res.data.data)
                    if(res.data.code != 200){
                        this.$message.error(res.data.message);
                        return;
                    }
                    let planNameArr = res.data.data; 
                    if(res.data.data.length > 0){
                        planNameArr.map((item,index)=>{
                            if(item.scheme_id == 0){
                                planNameArr.splice(index, 1);
                            }
                        })
                        
                    }
                    if(planNameArr.length > 0){
                        planNameArr.map((item,index)=>{
                            item.id = Math.floor(Math.random()*10000);
                            item.isOpen = false;
                            item.readonly = true;
                            
                            if(item.scheme_id == -1 ){
                                item.id = -1;
                                item.isOpen = true;
                                item.optimize = false;
                            }else{
                                item.scheme_id = "";
                            }
                            if(item.data.length>0){
                                item.data.map((item2,index2)=>{
                                    item2.id = Math.floor(Math.random()*10000);
                                    item2.input_power_curve_list = [
                                        {
                                            value: 'list',
                                            label: '功率曲线库',
                                            children: []
                                        },
                                        {
                                            value: 'upload',
                                            label: '自定义'
                                        }
                                    ];
                                    item2.turbine_type = "";
                                    item2.power_curve_filename = [];
                                })
                            }else{
                                let newObj = {
                                    id:  Math.floor(Math.random()*10000),  
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
                                            children: []
                                        },
                                        {
                                            value: 'upload',
                                            label: '自定义'
                                        }
                                    ]
                                }
                                item.data.push(newObj);
                            }
                        })
                        this.planNameArr = planNameArr;
                        this.planNameArr.sort((a, b)=>{
                            return a.id - b.id;
                        })
                    }else{
                        this.addPlan(false);
                    }
                }).catch((err)=>{
                    this.$message.error("获取机位点数据失败！");
                    console.log(err)
                })
            },
            //
            getFiveData(){
                util.ajax.get("/engineering_choose/"+ this.projectId).then((res)=>{
                    // console.log(res)
                    if(res.data.code == 200){
                        this.auto_station = res.data.data.auto_station;
                        this.checked_station = res.data.data.checked_station;
                        this.checked_line = res.data.data.checked_line;
                        this.checked_road = res.data.data.checked_road;
                    }
                   
                }).catch((err)=>{
                    this.$message.error("获取工程设计数据失败！");
                    console.log(err)
                })
            },
            open(projectId, design_capacity) {
                this.design_capacity = design_capacity;
                this.projectId = projectId;
                this.dialogVisible = true;
                this.init();
                this.loadData();
            },
            init() {
                this.tabIndex = 0;
                if(this.tabIndexDelNum == 3){
                    this.tabIndex = 3;
                    this.tabIndexDelNum = null;
                }else{
                    this.tabIndexDelNum = null;
                    this.tabIndex = 0;
                }
                this.prevUploadInfo = this.defaultPrevUploadInfo();
                // 1.5需要默认值
                // this.cfdForm.section_num = '';
                // this.cfdForm.grid_resolution = '';
                this.isAerialUploaded = false;
                // this.mastList = [];
                this.mastList.data = [];
                this.turbineList.data = [];
                this.uploadLoading = false;
                this.cfdUploading = false;
                this.uploadSuccess = false;
                this.defaultTooltip();
                //获取KMZ范围数
                this.getKmzData();
                //获取第五步
                this.getFiveData();
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
                   this.getTurbineType();
                }
                this.loadEpsg_zone({})
                    .then(data => {
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
                    })
                    .catch(err => console.error(err));
            },
            getTurbineType(){
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
                    this.turbineOptions.push({
                            key:'11T',
                            value: "自定义机型",
                            label: "自定义机型"
                        });
                }).catch(() => {
                    this.$message.error('获取机型列表失败');
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
            // 处理源坐标系选择事件 --yuan
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
            // 处理源坐标系选择事件-yuan
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

                //切换了坐标源把...的删除，不能验证通过不了
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
            // 处理目标坐标系选择事件
            onTargetChange(value) {
                // console.log(value,"yuan3")
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

                //切换了坐标源把...的删除，不能验证通过不了
                this.mastList.data = [{
                    id: null,
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                    filename: ''
                }];
            },
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
            loadData() {
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
                    const p3 = this.loadTurbineInfoNew();
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
            loadCfdParameter() {
                // this.cfdForm.section_num = '';
                // this.cfdForm.grid_resolution = '';
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
            loadMastInfo() {
               
                this.mastList.data = [{
                    id: null,
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                    filename: '',
                    filename_txt: ''
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
                        // this.mastList = [];
                        this.mastList.data = [];

                        res.data.data.forEach((item,index ,obj) => {
                            
                            this.mastList.data.push({
                                id: item.mast_id,
                                code: item.mast_name,
                                x: item.coordinate_x,
                                y: item.coordinate_y,
                                height: item.height,
                                filename: item.filename,
                                filename_txt: item.filename_txt
                            });
                        });
                        this.mastList.data.sort(function(a, b) {
                            return parseInt(a.code) - parseInt(b.code) || a.code.toUpperCase() - b.code.toUpperCase() ;
                        });
                        // console.log(this.mastList.data,"提交计算后的数据")
                        //之前的问题--提交计算后拿回来渲染后，1--验证有Bug--???--暂时无法解决
                        // 2--重复名字的就是之前有isCopy控制的，就不显示。现在有出现----bug---???理论手动加isCopy为true就行
                        // 
                        for(let i=0; i<this.mastList.data.length; i++){
                            
                            for(let j=i+1; j<this.mastList.data.length; j++){
                                if(this.mastList.data[i].code == this.mastList.data[j].code){
                                    // console.log(this.mastList.data[i])
                                    // console.log(this.mastList.data[j])
                                    this.mastList.data[j].isCopy = true
                                }
                            }
                        }
                       
                        
                    }
                }).catch(() => {
                    this.$message.error('获取测风塔信息失败！');
                });
            },
            // 获取线上的机位点数据
            loadTurbineInfo() {
                // this.turbineList.data = [];
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
                    }else{
                        callback([]);
                    }
                }).catch((err) => {
                    console.log(err)
                    this.$message.error('获取功率曲线文件列表失败！');
                });
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

            uploadTurbineInfoNew(){
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                this.planNameArr.sort((a, b)=>{
                    return a.id - b.id;
                })
                this.planNameArr.forEach((item,index)=>{
                    if(item.scheme_id == ''){
                        item.scheme_id = Number("-"+ (index + 1));
                    }
                })
                // console.log(this.planNameArr)
                return new Promise((resolve, reject) => {
                    util.ajax.post("/scheme_upload/"+ this.projectId, {
                        scheme_data: this.planNameArr
                    }, config).then((res)=>{
                        // console.log(res)
                        if(res.data.code != 201){
                            reject(res.data.message)
                        }else{
                            resolve(res.data.message)
                            console.log("机位点数据:OK");
                        }
                    }).catch((err)=>{
                        reject(err)
                        this.waitingUploading = false;
                        console.log(err)
                    })
                })
            },
            uploadFive(){
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                let choose = {};
                choose.checked_road = this.checked_road;
                choose.checked_line = this.checked_line;
                choose.checked_station = this.checked_station;
                choose.auto_station = this.auto_station;
                choose.length = this.planNameArr.length;
                return new Promise((resolve, reject) => {
                    util.ajax.post("/engineering_choose/"+ this.projectId, {
                        engineering_choose: choose
                    }, config).then((res)=>{
                        // console.log(res)
                        if(res.data.code != 201){
                            reject(res.data.message)
                        }else{
                            resolve (res.data.message);
                            console.log("工程设计数据：ok");
                        }
                    }).catch((err)=>{
                        reject (err);
                        this.waitingUploading = false;
                        console.log(err)
                    })
                })
            },
            uploadFiveStation(){
                var config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 360000
                };
                if(this.auto_station == "2" && this.checked_station){
                    var length = this.planNameArr.length;
                    return new Promise((resolve, reject) => {
                        util.ajax.post("/reveal_station_save/"+ this.projectId+"/0",{
                            station_info : this.shengyaListData,
                            length: length
                        },config)
                        .then(res=>{
                            // console.log(res)
                            if(res.data.code == 201){
                                console.log("升压站:"+res.data.message);
                                resolve(res.data.message)
                            }else{
                                console.log(res.data);
                                this.$message.error(res.data.message);
                                reject(res.data.message)
                            }
                        }).catch((err) => {
                            console.log(err);
                            this.waitingUploading = false;
                            this.$message.error("上传升压站数据失败");
                        });
                    })
                }else{
                    return new Promise((resolve, reject) => {
                        resolve("ok")
                        console.log("wu升压站文件");
                    })
                }
            },
            // 总上传进程
            doUpload() {
                // 队列上传成功后会调用开始计算接口
                this.waitingUploading = true;
                const p1 = this.uploadCfd();
                const p2 = this.uploadMastInfo();
                const p3 = this.uploadTurbineInfoNew();
                const p4 = this.uploadFive();
                const p5 = this.uploadFiveStation();
                
                
                Promise.all([p1, p2, p3, p4, p5]).then(() => {
                    console.log(this.cfdParamStatus);
                    let args = '';
                    
                    if (this.simulationMode) {
                       
                        // 选择了goldfoam模式
                        // args = this.uploadTabActiveFirst ? 'main_0' : 'main_1';
                        args = 'new_wt_main';
                    } else {
                       
                        // 选择了wt模式
                        // args = this.uploadTabActiveFirst ? 'wt_main_0' : 'wt_main_1';
                        args = 'new_wt_main';
                    }
                   

                    let data = {
                        args: args
                    };
                    // const config = {
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     }
                    // };
                    util.ajax.post(`/calculate/${this.projectId}/1`, data).then((res) => {
                        this.waitingUploading = false;
                        if (res.data.code !== 200) {
                            this.$message.error(res.data.message);
                        } else {
                            // this.dialogVisible = false;
                            this.uploadSuccess = true;  //显示上传页面  或  点击查看按钮
                        }
                        // this.$emit('calculateStarted', this.projectId);
                    }).catch(() => {
                        this.$message.error('启动计算处理失败');
                    });
                }).catch((err) => {
                    this.waitingUploading = false;
                    this.$message.error('上传失败');
                    console.error(err);
                });
                // this.uploadSuccess = true;
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
                //is_wt ==新增区分模式==> 0 GF   1 WT
                // console.log('当前模式模式0GF1WT：'+ this.is_wt);
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
                    this.waitingUploading = false;
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
                        return util.ajax.post('mast_alter/'  + this.projectId + '/' + item.data.id, formData, config).then(res => {
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
                    this.waitingUploading = false;
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
                    // return this.loadTurbineInfo().then(() => {
                    //     this.turbineUploading = false;
                    // });
                    this.turbineUploading = false;
                }).catch(err => {
                    this.turbineUploading = false;
                    throw err;
                });
            },
            // 复制新一行测风塔数据增加测风塔高度
            addRow(index, rows , obj) {
                this.backisCopy = true
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
 
                    // console.log(rows,"看")
                }else{
                    this.$message({
                        message:"此行数据内容不能为空"
                    })
                }
            },
            // 增加测风塔数据行
            addMast() {
                this.backisCopy = false
                if (this.uploadLoading) {
                    return;
                }
                this.mastList.data.push({
                    id: null,
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                   
                    filename: '',
                    filename_txt: '',
                    hidden: true
                });
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
                            children: []
                        },
                        {
                            value: 'upload',
                            label: '自定义'
                        }
                    ]
                });
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
                    this.deleting = true;
                    rows.splice(index, 1);
                }
                console.log(this.mastList.data)
            },
            //一键删除
            delAll(){
                // console.log(111)
                this.$confirm('此操作将删除全部机位点, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                    })
                .then(() => {
                    // console.log(this.turbineDataChange);
                    this.delAxios();
                })
            },
            delAxios(){
                this.waitingDel = true;     
                //不传turbine_id，一键删除接口
                util.ajax.delete('input_turbine/' + this.projectId + '/1')
                .then((res)=>{
                    
                    if(res.status == 200){
                        this.waitingDel = false;
                        //储存第几步,重新进入项目--旧
                        // this.tabIndexDelNum = 3;
                        // this.$emit('projectOverCal', false, true);
                        console.log('deleteAll:'+res.data.message);
                        //清空当前步骤数据--新
                        this.prevUploadInfo.turbineInfo = [];
                        this.turbineList.data= [];
                    }
                    
                }).catch((err)=>{
                    this.waitingDel = false;
                    console.error(err)
                })
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
                                children: []
                            },
                            {
                                value: 'upload',
                                label: '自定义'
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
            onFileUploadChange(file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, fileList.length - 1);
                }
            },
            // 获取功率曲线名称
            getCurveFilename(turbineType) {
                if (!turbineType) {
                    return '';
                } else {
                    return turbineType.replace(/[^a-zA-Z0-9_]/g, '_') + '.gfwtg';
                }
            },
            // 获取测风塔文件名称
            setMastFile(row, event) {
                // console.log(row)
                row.filename = event.name;
                row.file = event;
               
                // console.log(row)
                
            },
            // 判断测风塔数据行是否为空
            isMastListEmpty() {
                let count = 0;
                // this.mastList.forEach((item) => {
                //     if (item.code || item.x || item.y || item.height || item.file) {
                //         count++;
                //     }
                // });
                this.mastList.data.forEach((item) => {
                    if (item.code || item.x || item.y || item.height || item.file) {
                        count++;
                    }
                });
                return count === 0;
            },
            // 判断风机点位数据是否为空
            isTurbineListEmpty() {
                let count = 0;
                // this.turbineList.data.forEach((item) => {
                //     if (item.code || item.type || item.x || item.y || item.height) {
                //         count++;
                //     }
                // });
                return count;
            },
            getDefaultPowerCurveFileName (fileList) {
                // console.log(fileList)
                if (!fileList || fileList.length === 0) return null;
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].value && String(fileList[i].value).toLowerCase().lastIndexOf('0.1.gfwtg') === String(fileList[i].value).length - 9) {
                        return fileList[i].value;
                    }
                }

                return fileList[0].value;
            },
            // 处理风机选择事件  --jixing
            handleTurboTypeChange(index, row) {
                // console.log(index,row,"机型事件")
                // row.type
                let that =this;
                if (index === 0) {
                    const hasOtherType = this.turbineList.data.some((item, index) => {
                        if (index === 0) {
                            return false;
                        }
                        return !!item.type;
                    });
                    // console.log(hasOtherType)
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

            // // todo:上传数据时暂时改为只能单选goldfoam或wt模式
            // gfModeChange(){
            //     this.simulationOption.wtSelected = !this.simulationOption.goldfoamSelected;
            //     this.simulationOption.mode = this.simulationOption.goldfoamSelected?0:1;
            // },
            // wtModeChange(){
            //     this.simulationOption.goldfoamSelected = !this.simulationOption.wtSelected;
            //     this.simulationOption.mode = this.simulationOption.goldfoamSelected?0:1;
            // }
    //-------------------------------------

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
        },
        created() {
            this.userInfo = this.$store.state.user.loginUserInfo;
            this.uploadTabActiveFirst = false;//todo:隐藏新建无人机地形
        }
    };
</script>
<style lang="less" scoped>
   
   /deep/ .el-table__empty-text {
    display: inline-block;
    width: 100% !important;
    height: 100% !important;
    line-height: 55px;
    box-sizing: border-box;
    border-right: 1px solid rgba(159, 164, 162, 0.5);
    border-left: 1px solid rgba(159, 164, 162, 0.5);
   }
    .myHidden{
        opacity: 0 !important;
    }
    .uploadTerrainNameBox {
        width:290px;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        color: rgba(51,200,111,0.7);
    }
    .uploadTerrainBox {
        display: none;
    }
    .content4 {
        max-height: 300px;
        overflow-y: scroll; 
        position: relative;
    }
    .content4 .delAllIcon{
        position: absolute;
        right: 16px;
        top: 8px;
        z-index: 999;
    }
    .content .el-select /deep/ .el-input__inner{
        color: rgba(51,200,111,0.7) !important;
        border: 1px solid #888d97 !important;
    }
    .el-select-dropdown__item.selected{
        background: rgba(1,24,48,0.8) !important;
        color: rgba(51,200,111,0.7) !important;
        font-weight: 500 !important;
    }
    .el-select-dropdown__item:hover{
        color: #fff !important;
        background: rgba(1,24,48,0.8) !important;
    }
    .el-select-dropdown__item{
        background: none !important;
        font-weight: 500 !important;
        padding: 0 13px !important;
    }
    .parameterBox /deep/ .el-dialog__wrapper .el-cascader__label{
        color:rgba(51,200,111,0.7) !important;
    }
    .el-dialog__wrapper .el-dialog .el-dialog__header{
        background: rgba(212,239,246,0) !important;
    }
    .el-dialog__wrapper .el-dialog .el-dialog__header span {
        color: #fff;
    }
    .el-input_inner:focus
    {
        border: 1px solid #ccc !important;
    }
    .formCascader {
        border: 1px solid #FF4967;
    }
    .landBorder {
        border: 1px solid #FF4967;
    }
    .input.el-checkbox__original{
        display: none !important;
    }
    .simulationDiv{
        /* text-align: center;
        padding-top: 10px;
        padding-bottom: 20px; */
        display: flex;
        justify-content: center;
        border: 1px solid#33C86F;
        width: 290px !important;
        padding: 3px;
        margin: 0 auto 15px auto !important;
        border-radius: 20px;
        box-sizing: border-box;
        position: relative;
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
    // .modecheck{
    //     padding-right: 12px !important;
    // }
    // .mode-outer-div{
    //     display: inline-block;
    //     border: 1px solid rgba(51,200,111,1);
    //     opacity: 0.6;
    //     border-radius: 17px;
    //     padding: 4px 5px;
    // }
    // .mode-inner-div{
    //     background:rgba(51,200,111,1);
    //     opacity:0.6;
    //     border-radius:14px;
    //     padding: 7px 18px;
    //     cursor: pointer;
    // }
    .mode-div{
            height: 24px;
            border-radius: 10px;
            /* padding-left: 15px;
            padding-right: 15px; */
            cursor: pointer;
            color: #D4EFF6;
            font-size: 14px !important;
            line-height: 24px;
            width: 50%;
            text-align: center;
            display: inline-block;
            background:rgba(51,200,111,0);
    }
    .spanTip{
        position: relative;
        z-index: 5;
        opacity: 0.8;
    }
    .mode-div.mode-tab-active{
      /* background-color:rgba(51,200,111,0.6); */
      background:rgba(51,200,111,0);
    }
    .parameterBox /deep/ .el-form-item__label{
        opacity: 0.8 !important;
    }
    .parameterBox .redborder{
        border: 1px solid red !important;
    }
// 、、、、
.upload-tab-you{
    width: 293px !important;
    margin: 0 auto 15px auto !important;
}
.upload-terrain{
    width: 290px;
    margin: 0 auto 15px auto;
    display: flex;
    justify-content: space-between;
    position: relative;
    left: -5px;
}
.terrainUploadBorder .terrainBtn{
    border: 1px solid red !important;
}
.terrainUploadBorder2 .terrainBtn2{
    border: 1px solid red !important;
}
.terrainBtn{
    position: relative;
    left: -5px;
}
.terrainBtn2{
    width: 288px !important;
    position: relative;
    left: -4px;
    /deep/ input{
        text-align: center !important;
    }
}
.jiweidianUpload{
    position: absolute;
    z-index: -11;
    opacity: 0;
}
.oneContent{
    padding: 30px 0 20px 0;
    /deep/ .original-form-inline{
        margin: 0 auto 0px auto !important;
    }
    /deep/ .el-form-item__label{
        padding: 0 15px 0 0 !important;
    }
    /deep/ .upload-terrain input{
        opacity: 0.9 !important;
    }
    .redBorderValid /deep/ .el-cascader input{
        border: 1px solid red !important;
    }
    .terrainBorderValid /deep/ .el-select input{
        border: 1px solid red !important;
    }
    .terrainUploadBorder .terrainBtn{
        border: 1px solid red !important;
    }
    .terrainUploadBorder2 .terrainBtn2{
        border: 1px solid red !important;
    }
    
    .kmzFileName{
        width: 290px;
        border: 1px dashed rgba(212, 239, 246, 0.7);
        border-radius: 4px;
        height: 30px;
        line-height: 30px;
        color: rgba(211, 219, 235, 0.7);
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .kmzFileName:hover{
        border: 1px dashed rgba(212, 239, 246, 1);
    }
    .kmzFileName_Valid .kmzFileName{
        border: 1px solid red !important;
    }
    .kmzFileNameActive{
        color:rgba(51, 200, 111, 0.7);
    }
}
.tooltipBox{
    position: absolute;
    width: 45px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &>span , a{
        cursor: pointer;
    }
}
.tooltipBox1{
    right: -55px;
    top: 2px;
}
.tooltipBox2{
    // top: 3px;
    top: 105px;
    right: 212px;
}
.tooltipContent{
    box-sizing: border-box;
    position: absolute;
    width: 820px;
    border-radius: 10px;
    padding: 10px 20px;
    color: #33C86F;
    line-height: 20px;
    text-align: justify;
    background: #001831;
    border: 1px dashed rgba(212, 239, 246, 0.5);
    opacity: 1;
    z-index: 2003;
    top: 55px;
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
        right: 240px;
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

.tooltipContent1{
    top: 93px; 
    left: 160px;
    width: 510px;
    .tooltip-arrow{
        right: 90px;
    }
}
.tooltipContent2{
    top: 2px;
    .tooltip-arrow{
        right: 238px;
    }
}
.tooltipContent3{
    top: 62px;
    .tooltip-arrow{
        right: 9px;
    }
}
.tooltipContent4{
    top: 176px;
    .tooltip-arrow{
        right: 9px;
    }
}
//----------
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
.twoContent{
    padding: 30px 0 20px 0;
    position: relative;
    /deep/ .el-form-item{
        margin-bottom: 2px !important;
    }
    /deep/ .content2InputWidth {
        position: relative;
        left: 2px;
    }
    .terrainWTred /deep/ .wt-upload-btn{
        border: 1px solid red !important;
    }
    .terrainWTgreen /deep/ .wt-btn-font{
        color: rgba(51, 200, 111, 1) !important;
    }
    
    .video{
        position: absolute;
        right: -128px;
        top: 30px;
        width: 350px;
        height: 250px;
        border: 1px solid #9fa4a2;
        border-radius: 3px;
        box-sizing: border-box;
        /deep/ video::-webkit-media-controls-panel{
            background: rgba(0,0,0,0.8) !important;
            div,button{
                color: #fff !important;
                background: #fff !important;
            }
        }
    }
    
}
//--------
.tabHeader{
    height: 30px;
    padding: 5px 0 0 0;
    display: flex;
    justify-content: flex-end;
}
.tabHeaderRight{
    width: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
        outline: none;
    }
    /deep/ .icon{
        display: inline-block !important;
        cursor: pointer;
    }
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
.content4.threeContent{
    overflow-y: initial !important;
}
.content4.fourContent{
    overflow-y: initial !important;
}
.threeContent{
    width: 800px !important;
    padding: 10px 0 20px 0;
    /deep/ .el-form-item.el-form-item--feedback.is-error .el-input__inner{
        border: 1px solid red !important;
    }
    .el-select /deep/ .el-input__inner{
        width: 123px !important;
    }
}
.fourContent{
    width: 800px !important;
    padding: 10px 0 20px 0;
    .youhuaBox /deep/ .el-input__inner{
        border: 1px solid #888d97 !important;
    }
    
    /deep/ .el-form-item.el-form-item--feedback.is-error .el-input__inner{
        border: 1px solid red !important;
    }
    /deep/ .el-form-item.is-error .el-input__inner{
        border: 1px solid red !important;
    }
    
    /deep/ .gf-table.el-table td:nth-of-type(1) .cell input , /deep/ .gf-table.el-table th:nth-of-type(1) .cell input{
        height: 15px !important;
        position: absolute;
        left: 0;
        opacity: 0 !important;
    }
    /deep/ .tarForm{
        padding: 0 5px;
        margin-top: 35px;
        position: absolute;
    }
    /deep/ .optForm{
        background: rgba(1,24,48,0.5) !important;
        padding: 5px 5px 0 5px;
        border-radius: 5px;
        margin-right: 5px;
        position: relative;
    }
    .remove{
        position: absolute;
        right: -5px;
        top: -5px;
        width: 15px;
        height: 15px;
        text-align: center;
        line-height: 15px;
        background:rgba(212,239,246,1);
        color: #000;
        border-radius: 50%;
        cursor: pointer;
        display: none;
    }
    /deep/ .optForm:hover .remove{
        display: block;
    }
    .youhuaBox /deep/ .el-form-item__label{
        line-height: 32px !important;
    }
    
    .youhuaBox{
        &>div{
            display: flex;
            position: relative;
            .label{
                position: absolute;
                width: 80px;
                left: 0;
                line-height: 33px;
                color: #d4eff6;
                opacity: 0.8;
                padding-left: 5px;
            }
        }
        .left{
            max-width: 650px;
            overflow-x: auto;
            display: flex;
            padding-top: 75px;
            padding-left: 80px;
            &>div:nth-of-type(1){
                display: flex;
            }
        }
        .button{
            margin-top: 75px;
            width: 150px;
            height: 130px;
            text-align: center;
            color: rgba(159,164,162,1);
            background:rgba(212,239,246,0.1);
            border:1px dashed rgba(159,164,162,0.8);
            border-radius:3px;
            cursor: pointer;
            .icon{
                display: inline-block !important;
                width: 15px;
                height: 15px;
            }
            span:nth-of-type(1){
                display: inline-block;
                border:1px solid rgba(159,164,162,1);
                border-radius: 50%;
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                margin-top: 40px;
            }
            span:nth-of-type(2){
                display: block;
            }
        }
    }
}
.fiveContent{
    width: 340px;
    margin: 0 auto;
    color: rgba(212,239,246,0.7);
    padding-top: 5px;
    // 单选框
    /deep/ .el-checkbox, /deep/ .el-radio{
        color: rgba(212,239,246,0.7) !important;
    }
    /deep/ .el-checkbox{
        margin-right: 10px;
    } 
    /deep/ .el-radio__inner{
        border: 1px solid rgba(159, 164, 162, 0.5) !important;
    }
    .header{
        padding-left: 25px;
    }
    .uploadBtn{
        width: 290px;
        height: 30px;
        line-height: 30px;
        color: rgba(212,239,246,0.7);
        border-radius: 4px;
        border:1px dashed rgba(212,239,246,0.7);
        text-align: center;
        cursor: pointer;
        margin: 14px auto 0 auto;
        &>span{
            display: inline-block;
            width: 13px;
            height: 13px;
            line-height: 13px;
            text-align: center;
            border-radius: 50%;
            border:1px solid rgba(212,239,246,0.7);
        }
    }
    .uploadBtn:hover{
        border:1px dashed rgba(212,239,246,1);
    }
    .uploadBtn.success{
        color: #33C86F !important;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .stationFileError{
        border: 1px solid red !important;
    }
    /deep/ .demo-ruleForm input{
        color: #33C86F !important;
    }
    &>p{
        position: relative;
    }
    .fiveTipShow{
        position: absolute;
        right: 0px;
        top: 0;
        width: 320px;
        height:30px;
        line-height: 30px;
        text-align: center;
        background:rgba(0,24,49,0.9);
        border:1px dashed rgba(212,239,246,0.7);
        font-size:12px;
        color:rgba(51,200,111,1);
        border-radius: 50px;
    }
}

.planChange , .opPlanChange{
    color: rgba(244,244,244,0.8);
    padding: 15px 0 0 0;
    display: flex;
    justify-content: space-between;
    .planBtn{
        width:143px;
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
        width: 620px;
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
            width: 577px;
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
                width: 145px;
                height:24px;
                display: inline-block;
                box-sizing: border-box;
                line-height: 24px;
                
                // border: 1px solid rgba(212,239,246, 0.4);
                position: relative;
                top: 1px;
                /deep/ .nameIpt{
                    width: 97px !important;
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
.jiweiBox{
    position: relative;
}

.iconBoxHeader{
    height: 25px;
    width: 60px;
   
    text-align: center;
    padding: 5px 0 0 0 ;
    position: absolute;
    right: 0;
    top: 37px;
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
.iconBoxHeader .isCanClick{
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
}
//------------------
.newTabs{
    width: 80% !important;
}
.item-line{
    padding: 7px 0 !important;
}
.item-lineTo{
    width: 80px !important;
}
.newTitle{
    left: -20px !important;
    bottom: -22px !important;
}
//上传文件red框
.mastTable /deep/ .is-error .triggerBox .el-input__inner{
    border: 1px solid #FF4967 !important;
}
.param-container .steps {
    margin: 45px 210px 0 210px !important;
}
.param-container{
    margin: 25px auto 0 auto !important;
}
.parameterBox /deep/ .parameterBox-new{
    height: 100% !important;
    margin-top: 0 !important;
}
.parameterBox /deep/ .changeDialog{
    height: 320px !important;
    width: 430px !important;
    background: #03203e !important;
    .btnBox{
        margin: 20px 0 0 90px;
    }
}
/deep/ .demo-ruleForm{
    width: 250px !important;
    margin: 0 0 0 30px;
    /deep/ .el-input__inner{
        border: 1px solid #d4eff6  !important;
    }
}

.fourContentsteps{
    position: relative;
    top: 100px;
}
.fiveContentsteps{
    position: relative;
    top: 20px;
}
.param-container .steps{
    margin: 0 255px 0 255px !important;
}
.cascaderDrop /deep/ .el-cascader__label{
    cursor: not-allowed !important;
} 
.fourContent .planChange .scroll .line /deep/ .redActive .el-input__inner{
    color: red !important;
}
.fourContent .opPlanChange .scroll .line /deep/ .redActive .el-input__inner{
    color: red !important;
}
/deep/ .content3 .el-form-item.el-form-item--feedback.is-success .el-input__suffix, /deep/ .content4 .el-form-item.el-form-item--feedback.is-success .el-input__suffix{
    display: block !important;
}
.twoContentsteps{
    position: relative;
    top: 115px;
}
.design_capacity{
    font-size: 11px;
    height: 20px;
    line-height: 20px;
    position: absolute;
    bottom: -18px;
    left: 85px;
}
</style>