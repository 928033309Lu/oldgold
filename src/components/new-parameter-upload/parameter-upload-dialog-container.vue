<style lang="less" scoped>
    @import "./parameter.less";
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
        position: absolute;
        left: 50%;
        top: 55%;
        width: 264px;
        margin-left: -132px;
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
        <el-dialog title="上传参数" class="scroll"
                   :visible.sync="dialogVisible"
                   width="860px" :custom-class="expandTableClassName"
                   :top="dialogMarginTop"
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
                </div>
                <div class="row">
                    <div class="header-group">
                        <div class="button-group">
                            <div class="download-template" v-show="tabIndex === 3">
                                <a target="_blank" :href="turbineFileTempUrl">
                                    <div style="display: flex">
                                        <icon name="download" class="download-btn" style="color:#33C86F"/>
                                        <div class="text">下载模板</div>
                                    </div>
                                </a>
                            </div>
                            <div v-show="tabIndex === 2" class="upload-form" style="width: 287px">
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
                                <transition name="fade" v-if="tabIndex === 2">
                                    <div v-show="epsgTipShow" class="tooltip"
                                         style="height: 22px !important;padding-top: 8px !important;">
                                        <div class="tooltip-arrow-down">
                                            <div class="arrow-down"></div>
                                        </div>
                                        测风塔坐标系与风机坐标系应相同
                                    </div>
                                </transition>
                            </div>
                            <div class="upload-file" v-show="tabIndex === 3">
                                <icon v-if="uploadLoading" name="load" class="upload-btn"/>
                                <el-upload ref="upload"
                                           v-else
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

                            </div>
                            <div class="turbine-ops">
                                <span></span>


                                <span></span>
                            </div>
                        </div>
                        <div class="links-group" :style="tabIndex >=2 ? 'justify-content: flex-end;' : '' " v-if="tabIndex !== 1" :class="tabIndex === 3?'links-group links-group-top':'links-group'">
                            <div class="mytip mytip1" :class="tabIndex >=2 ? !uploadTabActiveFirst ? 'mytip mytip4' : 'mytip mytip3' : 'mytip mytip1'" :style="shuomingTip? 'display:none' : 'display:block' ">
                                查看说明
                            </div>
                            <div class="link">
                                <span
                                @mouseenter="shuomingTip = false"
                                @mouseleave="shuomingTip = true" 
                                @click="toolTipShow = true"
                                >
                                    <icon name="shuoming" style="height: 20px;width: 20px;" ></icon>
                                </span>

                                <!--无人机数据-->
                                <transition name="fade" v-if="tabIndex === 0 && uploadTabActiveFirst">
                                    <div v-show="toolTipShow" class="tooltip" :class="tabIndex >=2 ?  'tooltip tooltip3' : 'tooltip'">
                                            <div class="closeTip" @click="toolTipShow = false"><span>×</span></div>  
                                        <div class="tooltip-arrow">
                                            <div class="arrow-up"></div>
                                        </div>
                                        请分别上传各个架次的航拍数据，包括影像文件和POS信息两部分，具体格式可参见样例数据：其中，航拍影像为JPG格式，一般一个架次不超过1000张；POS信息为txt/csv格式，包括影像文件名、经度、纬度、高程四列/或者影像文件名、平面坐标x、平面坐标y、高程四列，具体格式请参见“样例数据”。
                                    </div>
                                    <!--<div class="tooltip-arrow arrow-up"></div>-->
                                </transition>
                                <!--上传地形数据-->
                                <transition name="fade" v-if="tabIndex === 0 && !uploadTabActiveFirst">
                                    <div v-show="toolTipShow" class="tooltip" :class="tabIndex >=2 ? 'tooltip tooltip3' : 'tooltip'"
                                         style="height: 22px !important;padding-top: 8px !important; ">
                                         <div class="closeTip" @click="toolTipShow = false"><span>×</span></div>   
                                        <div class="tooltip-arrow">
                                            <div class="arrow-up"></div>
                                        </div>
                                        请上传风电场项目兴趣区域地形数据，不包括外扩部分。
                                    </div>
                                </transition>
                                <!--测风塔数据-->
                                <transition name="fade" v-if="tabIndex === 2">
                                    <div v-show="toolTipShow" class="tooltip" :class="tabIndex >=2 ? !uploadTabActiveFirst ? 'tooltip tooltip4' : 'tooltip tooltip3' : 'tooltip'">
                                            <div class="closeTip" @click="toolTipShow = false"><span>×</span></div>  
                                        <div class="tooltip-arrow">
                                            <div class="arrow-up"></div>
                                        </div>
                                        一条测风塔记录可以对应多个测风高度，一个测风高度对应一个测风文件；测风文件为.tim格式，一般包括风向、风速、标准差、时间，具体格式请参见“样例数据”。
                                    </div>
                                </transition>
                                <!--风机排布-->
                                <transition name="fade" v-if="tabIndex === 3">
                                    <div v-show="toolTipShow" class="tooltip" :class="tabIndex >=2 ? !uploadTabActiveFirst ? 'tooltip tooltip4' : 'tooltip tooltip3' : 'tooltip'">
                                            <div class="closeTip" @click="toolTipShow = false"><span>×</span></div>    
                                        <div class="tooltip-arrow">
                                            <div class="arrow-up"></div>
                                        </div>
                                        应提供初始版本的风机排布方案，包括风机编号、平面坐标x、平面坐标y、轮毂高度四列，具体格式请参见“样例数据”。
                                    </div>
                                </transition>
                            </div>
                            <!--<div class="link" v-bind:class="{opacity:!uploadTabActiveFirst}"><a :href="output_template">
                                <div>下载样例数据</div>
                            </a></div>-->
                            <div class="link mytipBox" v-show='uploadTabActiveFirst'>
                                <div class="mytip" :class="tabIndex >=2 ? 'mytip5' : 'mytip'" :style="downLoadTip? 'display:none' : 'display:block' ">
                                    下载样例数据
                                </div>
                                <a target="_blank" 
                                @mouseenter="downLoadTip = false"
                                @mouseleave="downLoadTip = true"
                                :href="output_template">
                                    <icon name="download" style="height: 18px;width: 18px; color: rgba(212,239,246,0.6)"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="tabIndex === 0">
                    <div class="content content1">
                        <div class="upload-tab">
                            <div class="bgBox">
                                <span ref="bgUploadActives" :class="{'bgActive':!uploadTabActiveFirst}"></span>
                            </div>
                            <!-- @click="uploadTabActiveFirst =!uploadTabActiveFirst"/一样     -->
                            <div class="upload-tab-tag"
                                 v-bind:class="{'upload-tab-active':uploadTabActiveFirst}"
                                 @click="uploadTabChange(!uploadTabActiveFirst,true)"
                            >
                            <span class="spanTip">新建无人机地形</span>
                            </div>
                            <div class="upload-tab-tag"
                                 v-bind:class="{'upload-tab-active':!uploadTabActiveFirst}"
                                 @click="uploadTabChange(!uploadTabActiveFirst,false)"
                            >
                            <span class="spanTip">上传已有地形</span>
                            </div>
                        </div>
                        <div class="upload-form">
                            <el-form :inline="true" :model="formInline" class="original-form-inline">
                                <el-form-item label="源坐标系：">
                                    <!--源坐标系修改-->
                                    <!--tab1-->
                                    <el-cascader
                                            :options="pcsOptions"
                                            :show-all-levels="false"
                                            v-model="epsg_id"
                                            popper-class="powerCurve"
                                            @active-item-change="handleItemChange"
                                            @change="onEpsgChange"
                                            :class="[cascaderStatus==false?'formCascader':'']"
                                    ></el-cascader>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="upload-button" v-if="uploadTabActiveFirst">              
                            <upload-folder :project_id="projectId" @uploadCompleted="uploadCompletedHandle"
                                           v-if="uploadTabActiveFirst">
                                <div style="width: 245px;height: 100%">
                                    <div style="display:flex;align-items:center;justify-content: center;">
                                        <div style="height: 30px;line-height: 25px;padding-left: 10px">
                                            <span class="icon">
                                                <icon name="zengjia"></icon>
                                            </span>
                                        </div>
                                        <div style="margin-left: 10px;">
                                            添加无人机影像及POS文件
                                        </div>
                                    </div>
                                </div>
                            </upload-folder>
                        </div>
                        <div class="upload-button" v-if="!uploadTabActiveFirst">
                            <upload-terrain 
                                    :project_id="projectId"
                                    @click.native="handleClick"
                                    @uploadBegin="onUploadBegin"
                                    @uploadCompleted="uploadTerrainCompletedHandle"
                                    @uploadErr="uploadErrHandle"
                                    :class="[uploadTerrainBox?'uploadTerrainBox': '']"
                            >
                                <div style="width: 245px;height: 100%" :class="[landStatus==false?'landBorder': '']">
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
                        <folder-table v-if="uploadTabActiveFirst" :project_id="projectId" ref="folderTableRef"
                                      @fileFormChange="fileFormChangeHandle" @Expand="onExpandHandle"
                                      @closeProgressBar="onCloseProgressBar"
                        ></folder-table>

                    </div>
                </div>
                <div class="row" v-show="tabIndex === 1">
                   
                    <div class="content simulationDiv" v-if="$store.state.user.loginUserInfo.role==1">
                      <!-- <el-checkbox class="modecheck" v-model="simulationOption.goldfoamSelected" @change="gfModeChange"></el-checkbox>
                       <div  class="mode-outer-div"  :style="'margin-right: 40px;border:'+(simulationOption.mode === 0?'1px solid rgba(51,200,111,1);':'1px solid rgba(212,239,246,1);')">
                            <div  class="mode-inner-div" :style="'background:'+(simulationOption.mode === 0?'#33c86f':'none')" @click="simulationOption.mode = 0;simulationOption.goldfoamSelected=true;simulationOption.wtSelected=false;">
                                <div class="mode-div">GoldFoam模式</div>
                            </div>
                       </div>
                       <el-checkbox class="modecheck" v-model="simulationOption.wtSelected" @change="wtModeChange"></el-checkbox>
                       <div  class="mode-outer-div" :style="'border:'+(simulationOption.mode === 1?'1px solid rgba(51,200,111,1);':'1px solid rgba(212,239,246,1);')">
                            <div  class="mode-inner-div" :style="'background:'+(simulationOption.mode === 1?'#33c86f':'none')" @click="simulationOption.mode = 1;simulationOption.wtSelected=true;simulationOption.goldfoamSelected=false;">
                                <div  class="mode-div" >WT模式</div>
                            </div>
                       </div> -->
                       <!-- @click="simulationMode = true"/false -->
                        <div class="bgBox">
                            <!-- <span ref="bgActives"></span> -->
                            <span ref="bgActives" :class="{'bgActive':!simulationMode}"></span>
                        </div>
                        <div class="mode-div"
                                v-bind:class="{'mode-tab-active':simulationMode}"
                                
                                @click="simulationChange(true)"
                        >
                        <span class="spanTip">GoldFoam模式</span>
                        </div>
                        <div class="mode-div"
                                v-bind:class="{'mode-tab-active':!simulationMode}"
                                @click="simulationChange(false)"
                        >
                        <span class="spanTip">WT模式</span>
                        </div>
                    </div>
                   <!-- 权限除了1之外禁用 -->
                    <div class="content simulationDiv" v-if="$store.state.user.loginUserInfo.role!=1">
                        <div class="mode-div" 
                        v-bind:class="{'mode-tab-active':!simulationMode}"
                        @click="simulationChange(false)">
                            <span class="spanTip">WT模式</span>
                        </div>
                    </div>

                    <div class="content content2" v-show="simulationMode">
                        <el-form ref="cfdForm"
                                class="content2InputWidth"
                                 :model="cfdForm"
                                 :rules="cfdRules"
                                 label-position="left"
                                 label-width="120px"
                                 style="width: 300px;margin: 0 auto">
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
                    <div class="content content2" v-show="!simulationMode">
                        <wt-file-upload-panel id="wtFileUpload" ref="wtFileUpload" :projectId="projectId"></wt-file-upload-panel>
                        <div class="wtDensity">
                            <el-form ref="cfdForm2" :model="cfdForm" :rules="cfdRules">                    
                                <el-form-item prop="air_density_input" label="空气密度:">
                                    <el-input v-model="cfdForm.air_density_input"
                                            :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <div class="row" v-show="tabIndex === 2">
                    <div class="content content3">
                        <el-form :model="mastList"  ref="mastListForm" status-icon :show-message="false">
                            <el-table class="gf-table need-border" 
                            :data="mastList.data" 
                            :span-method="objectSpanMethod"
                            @cell-click="handleHover">
                                <el-table-column width="90px" label="测风塔编号" header-align="center" align="center">
                                    <template slot-scope="scope">
                                        <!-- ----validateMastListCode----/////:rules="rules.name" -->
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
                                                      
                                                    @blur="offBlur1"                                 
                                                    @focus="onfocus1"                       
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
                                                     
                                                      @blur="offBlur2"
                                                      @focus="onfocus2" 
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
                                                    
                                                    @blur="offBlur22"
                                                    @focus="onfocus22"
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
                                                     
                                                      @blur="offBlur222"
                                                      @focus="onfocus222" 
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
                                                      
                                                      @blur="offBlur3"
                                                      @focus="onfocus3"
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
                                                     
                                                      @blur="offBlur33"
                                                      @focus="onfocus33"
                                            />
                                        </el-tooltip>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="测风高度(米)" width="110px" header-align="center" align="center">
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
                                                    @blur="offBlur4"
                                                    @focus="onfocus4" 
                                                      />
                                        </el-tooltip>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column width="40px" align="center">
                                    <template slot-scope="scope">
                                        <div class="icon-mid zengjia">
                                            <span class="icon green" style="cursor: pointer"
                                            
                                                  @click="addRow(scope.$index, mastList.data , scope.row)">
                                            <icon name="zengjia"></icon>
                                        </span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column width="150px" align="center">
                                    <template slot-scope="scope">
                                        <el-form-item :prop="'data.'+scope.$index+'.filename'" :rules="{validator: validateFileName, trigger: 'blur'}">
                                            <file-upload-button 
                                            :filename="scope.row.filename" 
                                            :readonly="uploadLoading" 
                                            @file-selected="setMastFile(scope.row, $event)"/>

                                            <!-- <el-button class="gf-button selectedFile" type="primary">
                                                {{scope.row.filename}}
                                            </el-button> -->
                                            
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
                <div class="row" v-show="tabIndex === 3">
                    <div class="content content4 content4new" style="overflow-y: inherit;">
                        <div @click="delAll" class="delAllIcon">
                            <icon name="remove" class="remove-btn" />
                        </div> 
                           
                        <el-form :model="turbineList" ref="turbineListRef" status-icon >
                            <el-table class="gf-table need-border content-table" :data="turbineList.data" min-height= "50" max-height="250">
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
                                                      class="gf-table-input"  @blur="offBlur1b" @focus="onfocus1b"/>

                                        </el-tooltip>

                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="机型" width="130px" header-align="center" align="center">
                                    <template slot-scope="scope">
                                            <!-- :rules="{validator: validateSelecta, trigger: 'change'}" -->
                                        <el-form-item :prop="'data.'+scope.$index+'.type'"
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
                                <el-table-column width="120px" label="投影坐标X" header-align="center" align="center">
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
                                                      class="gf-table-input"  @blur="offBlur2b" @focus="onfocus2b"/>
                                        
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
                                                      class="gf-table-input"  @blur="offBlur22b" @focus="onfocus22b"/>
                                        
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
                                                      class="gf-table-input"  @blur="offBlur222b" @focus="onfocus222b"/>
                                        
                                        </el-tooltip>
                                    
                                        <!-- :content="scope.row.x !='' ? /^\d{8}(\.\d{1,4})?$/.test(scope.row.x) ? '格式正确':'八位正数,可带四位小数':'不能为空'" -->

                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column width="120px" label="投影坐标Y" header-align="center" align="center">
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
                                                      class="gf-table-input"  @blur="offBlur3b" @focus="onfocus3b"/>
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
                                                      @blur="offBlur33b"
                                                      @focus="onfocus33b"
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
                                                    @blur="offBlur4b"
                                                    @focus="onfocus4b" 
                                                    />
                                        </el-tooltip>

                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="功率曲线文件" width="180px" header-align="center" align="center">
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
                                <el-table-column width="40px" align="center">
                                    <template slot-scope="scope">
                                        <div class="icon-mid">
                                        <span v-if="turbineList.data.length > 1"
                                              @click="delRow(scope.$index, turbineList.data)">
                                            <icon name="remove" class="remove-btn"/>
                                        </span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>
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
                    </div>
                </div>

                <div class="steps">
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
        </el-dialog>
    </div>
</template>

<script>
    import util from '../../libs/util';
    import UploadStatusIndicator from '../parameter-upload/upload-status-indicator';
    import FileUploader from '../fileupload/file-uploader';
    import FileUploadButton from '../fileupload/file-upload-button';
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
            GfLine,
            progressBar,
            uploadFolder,
            folderTable,
            uploadTerrain,
            wtFileUploadPanel,
            errTip
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
                simulationMode: true, // 流场仿真模式 T：GoldFoam；F：WT
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
            stepPrev() {
                if (this.tabIndex > 0) return '上一步';
            },
            stepNext() {
                if (this.tabIndex < 3) return '下一步';
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
                        item.y !== mast.coordinate_y || item.height !== mast.height || item.file) {
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
            loginUserInfo () {
                return this.$store.state.user.loginUserInfo;
            },
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
        },
        updated() {
            
            // this.getSpanArr(this.mastList.data);
            // this.mastList.data
            
        },
       
        methods: {
            onfocus1(){ this.isTrue1 = false},
            onfocus2(){ this.isTrue2 = false},
            onfocus22(){ this.isTrue22 = false},
            onfocus222(){ this.isTrue222 = false},
            onfocus3(){ this.isTrue3 = false},
            onfocus33(){ this.isTrue33 = false},
            onfocus4(){ this.isTrue4 = false},
            onfocus1b(){ this.isTrue1b = false},
            onfocus2b(){ this.isTrue2b = false},
            onfocus22b(){ this.isTrue22b = false},
            onfocus222b(){ this.isTrue22b = false},
            onfocus3b(){ this.isTrue3b = false},
            onfocus33b(){ this.isTrue33b = false},
            onfocus4b(){ this.isTrue4b = false},
            offBlur1(){ this.isTrue1 = false},
            offBlur2(){ this.isTrue2 = false},
            offBlur22(){ this.isTrue22 = false},
            offBlur222(){ this.isTrue222 = false},
            offBlur3(){ this.isTrue3 = false},
            offBlur33(){ this.isTrue33 = false},
            offBlur4(){ this.isTrue4 = false},
            offBlur1b(){ this.isTrue1b = false},
            offBlur2b(){ this.isTrue2b = false},
            offBlur22b(){ this.isTrue22b = false},
            offBlur222b(){ this.isTrue222b = false},
            offBlur3b(){ this.isTrue3b = false},
            offBlur33b(){ this.isTrue33b = false},
            offBlur4b(){ this.isTrue4b = false},
            //合并单元格
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                // console.log(rowIndex, columnIndex)
                // if (columnIndex === 0) {
                //         const _row = this.spanArr[rowIndex];
                //         const _col = _row>0 ? 1 : 0;
                //         return {
                //             rowspan: _row,
                //             colspan: _col
                //         }
                //     }
                //     if(columnIndex === 1){
                //         const _row = this.spanArr[rowIndex];
                //         const _col = _row>0 ? 1 : 0;
                //         return {
                //             rowspan: _row,
                //             colspan: _col
                //         }
                //     }              
            },
            getSpanArr(data) {　
                // console.log(data)
                // for (var i = 0; i < data.length; i++) {
                //     if (i === 0) {
                //     this.spanArr = [1,1,1,1,1,1,1];
                //     this.pos = 0
                //     } else {
                //     // 判断当前元素与上一个元素是否相同
                //         if (data[i].code === data[i - 1].code) {
                //             this.spanArr[this.pos] += 1;
                //             this.pos = this.spanArr[this.pos]
                //         } else {
                //             this.spanArr = [1,1,1,1,1,1,1];
                //             this.pos = i;
                //         }
                //     }                
                // }    
            },     
           //当某个单元格被点击时会触发该事件
            handleHover(row, column, cell, event) {
                // console.log(row, column, cell, event);
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
                    callback(new Error('X为8位正数，允许输入到小数点后四位'));
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
                // this.$store.commit('inProject', false);
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
            // 下一步
            increase() {
                this.toolTipShow = false;
                if(this.tabIndex==0) {
                    if(this.epsg_id==null) {
                        this.cascaderStatus = false;
                    }else {
                        this.cascaderStatus = true;
                    }
                    if(this.uploadTerrainName==null) {
                        this.landStatus = false;
                    }else {
                        this.landStatus = true;
                    }
                }
                if(this.tabIndex==1) {
                    this.$refs.cfdForm2.validate((valid) => {
                        if(!valid){
                            this.azbStatus = false;
                        }else{
                            this.azbStatus = true;
                        }
                    });
                }
                if(this.tabIndex==2) {
                    
                    // console.log("222")
                    for(var i = 0; i < this.mastList.data.length; i++) {
                        // console.log(this.mastList.data[i])
                        if(this.mastList.data[i].filename == ""){
                            this.$message({
                                message:"请选择文件",
                                type:"error"
                            })                          
                           
                        }
                       
                    }    
                   
                // console.log(this.mastList.data,"验证这数据")
                    
                    // if(this.backisCopy==false){
                        //把isCopy的过滤掉验证
                        var arrdata = this.mastList.data.filter((item,index)=>{
                            return !item.isCopy
                        })
                    // console.log(arrdata,"过滤掉isCopy")
                        //注释掉，别删
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
                        // console.log(temp,index)          
                        
                        if(index.length>0) {
                            this.$message.error("第"+(str)+"个与之前坐标数据有重复");
                            this.azbStatus = false;
                            return false;
                        }else {
                            this.azbStatus = true;
                        }
                        if(index2.length>0) {
                            this.$message.error("第"+(str2)+"个与之前测风塔编号有重复");
                            this.azbStatus = false;
                            return false;
                        }else {
                            this.azbStatus = true;
                        }
                        
                    // }
                   
                    //过滤出来判断高度，
                    var arrayTwo = Object.values(this.mastList.data.reduce((res, item) => {
                        res[item.code] ? res[item.code].push(item) : res[item.code] = [item];
                        return res;
                    }, {}));
                    // console.log(arrayTwo,"arrayTwo")
                    let aaa = true;
                    arrayTwo.forEach((item,index)=>{
                        if(item.length>1){
                            // console.log(item)
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
                        this.azbStatus = true;
                    }else{
                        this.azbStatus = false;
                    }
                    //注释掉
                    // var temps = [];
                    // var indexs = [];
                   
                    // for(var i = 0; i < this.mastList.data.length; i++) {
                    //     for(var j = i + 1; j < this.mastList.data.length; j++){
                    //         if ((this.mastList.data[i].code == this.mastList.data[j].code)){
                    //             indexs.push(j)
                    //             i++;
                    //             j = i;
                    //         }
                            
                    //     }
                    //     temps.push(this.mastList.data[i]);
                       
                    // }            
                    // for(var i = 0 ; i < indexs.length - 1; i ++){
                    //     for(var j = 0 ; j < indexs.length - i - 1; j ++){
                    //         if(indexs[j] > indexs[j + 1]){	
                    //             var ls = indexs[j];
                    //             indexs[j] = indexs[j + 1];
                    //             indexs[j + 1] = ls;
                    //         }
                    //     }
                    // }
                   
                    // var strs = "";
                    
                    // for(let i=0; i<indexs.length; i++){
                    //     strs += (indexs[i]+1)+",";
                    // }
                   
                    // strs = strs.substring(0,strs.length-1);
                   
                    // if(indexs.length>0) {
                    //     this.$message.error("第"+(strs)+"个与之前测风塔有重复，测风塔编号不可以重复");
                    //     // this.$message.error("测风塔编号 有重复");
                    //     this.acftStatus = false;
                    // }else {
                    //     this.acftStatus = true;
                    // }
                   
                    //注释掉
                }
                if(this.tabIndex==3) {
                    // console.log(this.turbineList.data,"ming")
                    for(var i=0 ; i<this.turbineList.data.length; i++){
                        if(this.turbineList.data[i].power_curve_filename==null){
                            this.$message.error("请选择机型");
                            this.bzbStatus = false;
                        }
                    }
                    //my check 注释掉||(this.turbineList.data[i].code == this.turbineList.data[j].code)
                    var temp = [];
                    var index = [];
                    var temp2 = [];
                    var index2 = [];
                    for(var i = 0; i < this.turbineList.data.length; i++) {
                        for(var j = i + 1; j < this.turbineList.data.length; j++){
                            if ((this.turbineList.data[i].x == this.turbineList.data[j].x)&&(this.turbineList.data[i].y == this.turbineList.data[j].y)){
                                index.push(j)
                                i++;
                                j = i;
                            }
                            if ((this.turbineList.data[i].code == this.turbineList.data[j].code)){
                                index2.push(j)
                                i++;
                                j = i;
                            }
                        }
                        temp.push(this.turbineList.data[i]);
                        temp2.push(this.turbineList.data[i]);
                    }            
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
                                var ls2 = index2[j];
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
                        this.bzbStatus = false;
                    }else {
                        this.bzbStatus = true;
                    }
                    if(index2.length>0) {
                        this.$message.error("第"+(str2)+"个与之前编号有重复");
                        this.bzbStatus = false;
                    }else {
                        this.bzbStatus = true;
                    }
                    
                }
                // 验证是否可以进入下一页  --jisuan
                if (!this.isNextStepDisabled()) {
                    if (this.tabIndex === 3&&this.bzbStatus&&this.bcftStatus) this.doUpload();
                    if (this.tabIndex < 3 && this.azbStatus&&this.acftStatus) this.tabIndex++;
                } else {
                    // this.$message.error('存在不正确的输入项！');
                    // this.$message({
                    //             message:"请输入内容以及文件",
                    //             duration: 1000,
                    //             type: "error"
                    //         })
                }
            },
            //切换事件
            uploadTabChange(oldisTrue, isTrue){
                // console.log(oldisTrue,isTrue)
                // if(!isTrue){
                //     this.$refs.bgUploadActives.classList.add("bgActive");
                // }else{
                //     this.$refs.bgUploadActives.classList.remove("bgActive");
                // }
                this.uploadTabActiveFirst = oldisTrue;
            },
            simulationChange(isTrue){
                // console.log(isTrue)
                // if(!isTrue){
                //     this.$refs.bgActives.classList.add("bgActive");
                // }else{
                //     this.$refs.bgActives.classList.remove("bgActive");
                // }
                this.simulationMode = isTrue;
            },
            // 下一步验证
            isNextStepDisabled() {
                
                // console.log(this.epsg_dst ,"这是epsg_dst的值")
                if (this.tabIndex === 0) {
                    if (this.uploadTabActiveFirst) {
                        return !(this.uploadedFolder.length > 0 && this.uploadCompleted && this.epsg_id);
                    } else {
                        return !(this.uploadTerrainName && this.epsg_id);
                    }
                }
                if (this.tabIndex === 1) {
                    let gfValid = false;// T：验证通过；F:验证未通过
                    let wtValid = false;
                    // if (this.simulationOption.goldfoamSelected) {
                       
                    if (this.simulationMode) {
                        this.$refs.cfdForm.validate((valid) => {
                            gfValid = valid;
                        });
                        return !gfValid;
                    } else {
                        // wt模式：fileName不为空表示已经上传了文件
                        wtValid = this.$refs.wtFileUpload.fileName!==null;
                        if(!wtValid){
                            this.$message.error("请上传定向成果压缩文件！");
                        }
                        return !wtValid;
                    }
                    // this.nextDisable2 = gfValid || wtValid;
                    // return this.nextDisable2;
                }

                if (this.tabIndex === 2) {
                    if (this.epsg_dst === null) return true;
                     
                    if (this.deleting) {
                        // this.$nextTick(() => {
                        this.$refs.mastListForm.validate(valid => {
                            // console.log(valid)
                            this.nextDisable3 = !valid;
                            
                        });
                        this.deleting = false;
                        // });
                        return this.nextDisable3;
                    } else {
                        this.$refs.mastListForm.validate(valid => {
                            // console.log(valid)
                            this.nextDisable3 = !valid;
                        });
                        return this.nextDisable3;
                    }
                }
                if (this.tabIndex === 3) {
                    if (this.deleting) {
                        // this.$nextTick(() => {
                        this.$refs.turbineListRef.validate(valid => {
                            this.nextDisable4 = !valid;
                        });
                        this.deleting = false;
                        // });
                        return this.nextDisable4;
                    } else {
                        this.$refs.turbineListRef.validate(valid => {
                            this.nextDisable4 = !valid;
                        });
                        return this.nextDisable4;
                    }
                }
            
            
            },
            // 上一步
            decrease() {
                this.toolTipShow = false;
                if (this.tabIndex > 0) this.tabIndex--;
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
            open(projectId) {
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
                // 初始化风机列表
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
                    filename: ''
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
                // this.mastList = [{
                //     id: null,
                //     code: '',
                //     x: '',
                //     y: '',
                //     height: '',
                //     filename: ''
                // }];
                this.mastList.data = [{
                    id: null,
                    code: '',
                    x: '',
                    y: '',
                    height: '',
                    filename: ''
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
                                filename: item.filename
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
                    }
                }).catch(() => {
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


            // 总上传进程
            doUpload() {
                // 队列上传成功后会调用开始计算接口
                const p1 = this.uploadCfd();
                const p2 = this.uploadMastInfo();
                const p3 = this.uploadTurbineInfo();
                this.uploadLoading = true;
                Promise.all([p1, p2, p3]).then(() => {
                    console.log(this.cfdParamStatus);
                    // if (this.cfdParamStatus === 'complete' && !this.isMastListEmpty()) {
                    //     // util.ajax.get('/foam/' + this.projectId + '/run').then((res) => {
                    //     //     if (res.data.code !== 200) {
                    //     //         this.$message.error(res.data.message);
                    //     //         this.uploadLoading = false;
                    //     //     } else {
                    //     //         this.dialogVisible = false;
                    //     //         this.uploadSuccess = true;
                    //     //     }
                    //     //     // this.$emit('calculateStarted', this.projectId);
                    //     // }).catch(() => {
                    //     //     this.$message.error('启动计算处理失败');
                    //     // });
                    //     let data = {
                    //         args: (this.uploadTabActiveFirst) ? 'main_0' : 'main_1'
                    //     };
                    //     const config = {
                    //         headers: {
                    //             'Content-Type': 'multipart/form-data'
                    //         }
                    //     };
                    //     util.ajax.post(`/calculate/${this.projectId}/1`, data, config).then((res) => {
                    //         if (res.data.code !== 200) {
                    //             this.$message.error(res.data.message);
                    //             this.uploadLoading = false;
                    //         } else {
                    //             this.dialogVisible = false;
                    //             this.uploadSuccess = true;
                    //         }
                    //         // this.$emit('calculateStarted', this.projectId);
                    //     }).catch(() => {
                    //         this.$message.error('启动计算处理失败');
                    //     });
                    // } else {
                    //     this.uploadLoading = false;
                    //     this.$message.success('上传成功');
                    //     // this.init();
                    //     // this.loadData();
                    // }
                    let args = '';
                    // // 流场仿真模式判断
                    // if (this.simulationOption.wtSelected && this.simulationOption.goldfoamSelected) {
                    //     args = this.uploadTabActiveFirst ? 'wt_and_foam_0' : 'wt_and_foam_1';
                    // } else if (this.simulationOption.wtSelected) {
                    //     // 只选择的wt
                    //     args = 'wt_main';
                    // } else if (this.simulationOption.goldfoamSelected) {
                    //     // 只选择了goldfoam
                    //     args = this.uploadTabActiveFirst ? 'main_0' : 'main_1';
                    // } else {
                    //     // todo: 都不选择是非法情形
                    // }

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
                    // const config = {
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     }
                    // };
                    util.ajax.post(`/calculate/${this.projectId}/1`, data).then((res) => {
                        if (res.data.code !== 200) {
                            this.$message.error(res.data.message);
                            this.uploadLoading = false;
                        } else {
                            // this.dialogVisible = false;
                            this.uploadSuccess = true;  //显示上传页面  或  点击查看按钮
                        }
                        // this.$emit('calculateStarted', this.projectId);
                    }).catch(() => {
                        this.$message.error('启动计算处理失败');
                    });
                }).catch((err) => {
                    this.uploadLoading = false;
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
    border-right: 1px solid rgba(159, 164, 162, 0.5);
    border-left: 1px solid rgba(159, 164, 162, 0.5);
   }
    .myHidden{
        opacity: 0 !important;
    }
    .uploadTerrainNameBox {
        width:230px;
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
        width: 300px !important;
        padding: 3px;
        margin: 0 auto 20px auto !important;
        border-radius: 20px;
        box-sizing: border-box;
        position: relative;
        left:-8px;
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

    .content4new /deep/ .el-table__body{
        width: 760px !important;
    }
</style>