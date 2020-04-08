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
    .newTitle2{
        left: -20px !important;
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
                <div class="tabs newTabs newTabsyou">
                        <!-- #D4EFF6 -- 0.8-->
                    <div class="newTab-item" v-bind:class="tabItemFirst">
                       <span class="newfonts">1</span>
                       <div class="newTitle newTitle2">排布成果</div>
                    </div>
                    <div class="item-line"> <span class="item-lineTo"  v-bind:class="tabItemFirst"></span> </div>

                    <div class="newTab-item" v-bind:class="tabItemSecond">
                        <span class="newfonts">2</span>
                        <div class="newTitle newTitle2">工程设计成果(可选)</div>
                    </div>
                    <div class="item-line"> <span class="item-lineTo"  v-bind:class="tabItemSecond"></span> </div>

                    <div class="newTab-item" v-bind:class="tabItemThird">
                        <span class="newfonts">3</span>
                        <div class="newTitle newTitle2">经评成果</div>
                    </div>
                    <div class="item-line"> <span class="item-lineTo"  v-bind:class="tabItemThird"></span> </div>

                    <div class="newTab-item" v-bind:class="tabItemFour">
                        <span class="newfonts">4</span>
                        <div class="newTitle newTitle2">可选模块</div>
                    </div>
                </div>
                <!-- //说明内容 -->
                <div class="header-tip">
                    <div v-show="tipShow1 && uploadTabActiveFirst && tabIndex === 0" class="tooltip">
                        <div class="closeTip"  @click="tipShow1 = false"><span>×</span></div>  
                        <div class="tooltip-arrow">
                            <div class="arrow-up"></div>
                        </div>
                        请提供当前方案的排布数据，包括机位编号、投影坐标x（包含带号）、投影坐标y、机型、轮毂高度，具体格式参见样例数据
                    </div>
                    <div v-show="tipShow11 && !uploadTabActiveFirst && tabIndex === 0" class="tooltip tooltip11">
                        <div class="closeTip"  @click="tipShow11 = false"><span>×</span></div>  
                        <div class="tooltip-arrow">
                            <div class="arrow-up"></div>
                        </div>
                        请上传机型、标签、投影坐标x（包含带号）、投影坐标y、轮毂高度为必填列，机型与标签命名格式一致
                    </div>
                    <div v-show="tipShow2 && tabIndex === 1" class="tooltip tooltip2">
                        <div class="closeTip"  @click="tipShow2 = false"><span>×</span></div>  
                        <div class="tooltip-arrow">
                            <div class="arrow-up"></div>
                        </div>
                        请上传当前方案的升压站拐点的投影坐标（包含带号），具体格式参见样例数据
                    </div>
                    <div v-show="tipShow2a && tabIndex === 1" class="tooltip tooltip2a">
                        <div class="closeTip"  @click="tipShow2a = false"><span>×</span></div>  
                        <div class="tooltip-arrow">
                            <div class="arrow-up"></div>
                        </div>
                        请上传当前方案对应的道路数据文件
                    </div>
                    <div v-show="tipShow2b && tabIndex === 1" class="tooltip tooltip2b">
                        <div class="closeTip"  @click="tipShow2b = false"><span>×</span></div>  
                        <div class="tooltip-arrow">
                            <div class="arrow-up"></div>
                        </div>
                        请上传当前方案对应的线路数据文件或者压缩包
                    </div>
                    <div v-show="tipShow4 && tabIndex === 3" class="tooltip tooltip3">
                        <div class="closeTip"  @click="tipShow4 = false"><span>×</span></div>  
                        <div class="tooltip-arrow">
                            <div class="arrow-up"></div>
                        </div>
                        1、若上传线路成果dxf文件，可以以二维线展示线路路径<br/>
                        2、若上传道亨工程文件夹，则可以三维塔模型展示线路成果及更多统计信息
                    </div>
                    <div v-show="tipShow4a && tabIndex === 3" class="tooltip tooltip3a">
                        <div class="closeTip"  @click="tipShow4a = false"><span>×</span></div>  
                        <div class="tooltip-arrow">
                            <div class="arrow-up"></div>
                        </div>
                        请上传当前方案对应中心点的风图谱文件
                    </div>
                </div>
                <div class="row" v-if="tabIndex === 0">
                    <div class="content content1">
                        
                        <div class="upload-tab upload-tab-you">
                            <div class="bgBox">
                                <span ref="bgUploadActives" :class="{'bgActive':!uploadTabActiveFirst}"></span>
                            </div>
                            <div class="upload-tab-tag"
                                 v-bind:class="{'upload-tab-active':uploadTabActiveFirst}"
                                 @click="uploadTabChange(!uploadTabActiveFirst,true)"
                            >
                            <span class="spanTip">上传机位点</span>
                            </div>
                            <div class="upload-tab-tag"
                                 v-bind:class="{'upload-tab-active':!uploadTabActiveFirst}"
                                 @click="uploadTabChange(!uploadTabActiveFirst,false)"
                            >
                            <span class="spanTip">上传发电量成果</span>
                            </div>
                        </div>
                        <div class="upload-form">
                            <el-form :inline="true" :model="formInline" class="original-form-inline original-form-inline2">
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
                        <div ref="jiweidianBoxRef" class="upload-button upload-button-tab1" v-if="uploadTabActiveFirst" :class="uploadJiweidianObj.active?'uploadBoxActive':''">  
                            <el-upload  action="/input_turbine_file"    class="jiweidianUpload"
                            :before-upload="beforeJiweidainUpload" :http-request="httpJiweidianRequest"><button ref="jiweidianUpload"></button></el-upload>           
                            <div class="uploadHover" style="width:283px;height: 100%;position: relative;" @mouseenter="cuowuActive1 = true" @mouseleave="cuowuActive1 = false">
                                <div v-if="!uploadJiweidianObj.active" @click="onClickJiweidainUpload" style="display:flex;align-items:center;justify-content: center;">
                                    <div style="height: 30px;line-height: 25px;padding-left: 10px">
                                        <span class="icon">
                                            <icon name="zengjia"></icon>
                                        </span>
                                    </div>
                                    <div style="margin-left: 5px;">
                                        添加机位点文件(.txt)
                                    </div>
                                </div>
                                <div v-if="uploadJiweidianObj.active"  @click="onClickJiweidainUpload" class='uploadTerrainNameBox'>
                                    {{uploadJiweidianObj.name}}
                                </div>
                                <div @click="errorChange('jiweidian')" class="cuowuIcon" v-show="jiweidianError && cuowuActive1"><i class="iconfont icon-cuowu"></i></div>
                                <div  class="zhedie" @click="openJidianTable">{{!uploadJiweidianObj.open?'展开':'收起'}}</div>

                                <div class="link rightTipBox">
                                    <el-tooltip class="item" 
                                        effect="light" 
                                        popper-class="onmytooltip"
                                        content="查看说明"           
                                        :disabled="tipShow1"                         
                                        placement="top">
                                        <span
                                        
                                        style="padding-top:10px;"
                                        @click="tipShow1 = true"
                                        >
                                            <icon name="shuoming" style="height: 20px;width: 20px;" ></icon>
                                        </span>
                                    </el-tooltip>
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    popper-class="onmytooltip"
                                    content="下载模版"                                    
                                    placement="top">
                                        <a target="_blank" 
                                      
                                        style="padding-top:10px;"
                                        :href="turbineFileTempUrlyouke">
                                            <icon name="xiazaijiangyiicon" style="height: 22px;width: 23px; color: rgba(212,239,246,0.6)"/>
                                        </a>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="content content3 content4 content5 jidianBox" v-if="uploadTabActiveFirst"  :class="uploadJiweidianObj.open?'contentyouke1Height':'contentyouke1'">
                            <div style="height:15px;"></div>
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
                            <el-form :model="turbineListYouke" ref="turbineListRef" status-icon >
                                <el-table  :header-cell-class-name="must" class="gf-table need-border content-table" :data="turbineListYouke.data" min-height= "50" max-height="200" @selection-change="handleSelectionChange">
                                    <el-table-column  type="selection" width="50" align="center">                   
                                    </el-table-column>
                                    <el-table-column label="序号" width="60px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item  >
                                                <span>{{scope.$index+1}}</span>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="90px" label="标签" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.code'" 
                                                            :rules="{validator: turbinListCode, trigger: 'blur'}">
    
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            :popper-class="isTrue1b?'offmytooltip':'onmytooltip'"
                                            content="允许输入数字、字母、中划线、字符不超10" 
                                            :disabled="/^[\w.-]{1,10}$/.test(scope.row.code)"
                                            :visible-arrow="false"                                      
                                            placement="top">
                                                <el-input v-model="scope.row.code" :disabled="uploadLoading"
                                                            class="gf-table-input" />
    
                                            </el-tooltip>
    
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="机型" width="140px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            
                                            <el-form-item :prop="'data.'+scope.$index+'.type'" 
                                            :rules="{validator: turbinListType, trigger: 'blur'}">
                                                <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue1b?'offmytooltip':'onmytooltip'"
                                                    content="请输入数字、字母、符号/" 
                                                    :disabled="scope.row.type!='' && scope.row.type!=null ?true:false"
                                                    :visible-arrow="false"                                      
                                                    placement="top">
                                                    <el-input v-model="scope.row.type" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                </el-tooltip>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="130px" label="X" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.x'"
                                                            :rules="{validator: validateX, trigger: 'blur'}">
    
                                            
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            :popper-class="isTrue2b?'offmytooltip':'onmytooltip'"
                                            content="八位正数,可带四位小数"
                                            :disabled="/^\d{8}(\.\d{1,4})?$/.test(scope.row.x)"
                                            :visible-arrow="false"
                                            v-show="isOpenTip==1"
                                            placement="top">
                                                <el-input v-model="scope.row.x" :disabled="uploadLoading"
                                                            class="gf-table-input"  />
                                            
                                            </el-tooltip>
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            :popper-class="isTrue22b?'offmytooltip':'onmytooltip'"
                                            content="-180至180,可带四位小数"
                                            :disabled="scope.row.x>-180&&scope.row.x<180  && /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(scope.row.x)"
                                            :visible-arrow="false"
                                            v-show="isOpenTip==2"
                                            placement="top">
                                                <el-input v-model="scope.row.x" :disabled="uploadLoading"
                                                            class="gf-table-input" />
                                            
                                            </el-tooltip>
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            :popper-class="isTrue222b?'offmytooltip':'onmytooltip'"
                                            content="六位正数,可带四位小数"
                                            :disabled="/^\d{6}(\.\d{1,4})?$/.test(scope.row.x)"
                                            :visible-arrow="false"
                                            v-show="isOpenTip==3"
                                            placement="top">
                                                <el-input v-model="scope.row.x" :disabled="uploadLoading"
                                                            class="gf-table-input" />
                                            
                                            </el-tooltip>
                                        
                                            <!-- :content="scope.row.x !='' ? /^\d{8}(\.\d{1,4})?$/.test(scope.row.x) ? '格式正确':'八位正数,可带四位小数':'不能为空'" -->
    
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="130px" label="Y" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.y'"
                                                            :rules="{validator: validateY, trigger: 'blur'}">
    
                                            <el-tooltip class="item"
                                            effect="light" 
                                            :popper-class="isTrue3b?'offmytooltip':'onmytooltip'"
                                            content="七位正数,可带四位小数"
                                            :disabled="/^\d{7}(\.\d{1,4})?$/.test(scope.row.y)"
                                            :visible-arrow="false"
                                            v-show="isOpenTip==1 || isOpenTip==3"
                                            placement="top">
                                                <el-input v-model="scope.row.y" :disabled="uploadLoading"
                                                            class="gf-table-input"  />
                                            </el-tooltip>
                                            <el-tooltip class="item"
                                                effect="light" 
                                                :popper-class="isTrue33b?'offmytooltip':'onmytooltip'"
                                                content="-90至90,可带四位小数"
                                                :disabled="scope.row.y>-90&&scope.row.y<90  && /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(scope.row.y)"
                                                :visible-arrow="false"
                                                v-show="isOpenTip==2"
                                                placement="top">
                                                <el-input v-model="scope.row.y" :disabled="uploadLoading"
                                                            class="gf-table-input"
                                                            
                                                />
                                            </el-tooltip>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="轮毂高度(米)" width="100px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.height'"
                                                            :rules="{validator: validateMastListHeighta, trigger: 'blur'}">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                            content="0-300，可保留一位小数"
                                            :disabled="scope.row.height<300&&scope.row.height>0 &&/^[\+]?\d+(\.\d)?$/.test(scope.row.height)"
                                            :visible-arrow="false"
                                            placement="top">
                                                <el-input v-model="scope.row.height" :disabled="uploadLoading"
                                                        class="gf-table-input"
                                                        
                                                        />
                                            </el-tooltip>
    
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                   
                                    <el-table-column width="60px" align="center">
                                        <template slot-scope="scope">
                                            <div class="icon-mid iconright">
                                            <span @click="delRowYou(scope.$index, turbineListYouke.data)">
                                                <icon name="remove" class="remove-btn"/>
                                            </span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form>
                            <div class="add-btn" @click="addTurbineYouke">+ 新增</div>
                           
                        </div>
                        <div ref="chengguoBoxRef" class="upload-button upload-button-tab1" v-if="!uploadTabActiveFirst" :class="uploadChengguoObj.active?'uploadBoxActive':''">
                            <el-upload  action="/read_pg_excel"   class="jiweidianUpload"
                            :before-upload="beforeChengguoUpload" :http-request="httpChengguoRequest"><button ref="chengguoUpload"></button></el-upload>
                            <div class="uploadHover" style="width: 283px;height: 100%;position: relative;" @mouseenter="cuowuActive2 = true" @mouseleave="cuowuActive2 = false">
                                <div v-if="!uploadChengguoObj.active" @click="onClickChengguoUpload" style="display:flex;align-items:center;justify-content: center;">
                                    <div style="height: 30px;line-height: 25px;margin-left:10px;">
                                        <span class="icon">
                                            <icon name="zengjia"></icon>
                                        </span>
                                    </div>
                                    <div style="margin-left: 5px;">
                                        添加发电量成果文件(.xls/.xlsx)
                                    </div>
                                </div>
                                <div v-if="uploadChengguoObj.active"  @click="onClickChengguoUpload" class='uploadTerrainNameBox'>
                                    {{uploadChengguoObj.name}}
                                </div>
                                <div  class="zhedie" @click="openChengguoTable">{{!uploadChengguoObj.open?'展开':'收起'}}</div>
                                <div @click="errorChange('chengguo')" class="cuowuIcon" v-show="chengguoError && cuowuActive2"><i class="iconfont icon-cuowu"></i></div>
                                <div class="link rightTipBox">
                                    <el-tooltip class="item" 
                                        effect="light" 
                                        popper-class="onmytooltip"
                                        content="查看说明"  
                                        :disabled="tipShow11"                                  
                                        placement="top">
                                        <span
                                        
                                        style="padding-top:10px;"
                                        @click="tipShow11 = true"
                                        >
                                            <icon name="shuoming" style="height: 20px;width: 20px;" ></icon>
                                        </span>
                                    </el-tooltip>
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    popper-class="onmytooltip"
                                    content="下载模版"                                    
                                    placement="top">
                                        <a target="_blank" 
                                      
                                        style="padding-top:10px;"
                                        :href="turbineFileTempUrlyouke">
                                            <icon name="xiazaijiangyiicon" style="height: 22px;width: 23px; color: rgba(212,239,246,0.6)"/>
                                        </a>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="content content3 content4 content5 chenguoBox" v-if="!uploadTabActiveFirst"  :class="uploadChengguoObj.open?'contentyouke2Height':'contentyouke1'">
                            <div class="iconBoxHeader">
                                <span @click="changeChengguo" :class="isCanClick2? 'isCanClick' : '' ">
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    popper-class="onmytooltip"
                                    content="修改所选风机的机型参数"
                                    :visible-arrow="false"
                                    placement="top">
                                        <icon name="yingyong" style="width:20px;height:20px;color:#33C86F;"></icon>
                                    </el-tooltip>
                                </span>
                                <span @click="delAllChengguo" :class="isCanClick2? 'isCanClick' : '' ">
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
                            <el-form :model="chengguoListYouke" ref="chengguoListRef" status-icon >
                                <el-table :header-cell-class-name="must" class="gf-table need-border content-table" :data="chengguoListYouke.data" min-height= "50" max-height="230" @selection-change="handleSelectionChange2">
                                    <el-table-column  type="selection" width="43" align="center">
                                    </el-table-column>
                                    <el-table-column label="序号" width="40px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item  >
                                                <span>{{scope.$index+1}}</span>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="机型" width="120px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.turbine_type'" 
                                            :rules="{validator: turbinListType, trigger: 'blur'}">
                                            <el-tooltip class="item" 
                                                effect="light" 
                                                :popper-class="isTrue1b?'offmytooltip':'onmytooltip'"
                                                content="请输入数字、字母、符号/" 
                                                :disabled="scope.row.turbine_type!='' && scope.row.turbine_type!=null ?true:false"
                                                :visible-arrow="false"                                      
                                                placement="top">
                                                <el-input v-model="scope.row.turbine_type" :disabled="uploadLoading"
                                                :class="scope.row.zfocus_index?'focus_index':''"
                                                @focus="focusBlur(scope.row)"
                                                class="gf-table-input" />
                                                </el-tooltip>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="标签" width="70px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                                <el-form-item :prop="'data.'+scope.$index+'.turbine_name'" 
                                                :rules="{validator: turbinListCode, trigger: 'blur'}">
                                                    <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue1b?'offmytooltip':'onmytooltip'"
                                                        content="允许输入数字、字母、中划线、字符不超10" 
                                                        :disabled="/^[\w.-]{1,10}$/.test(scope.row.turbine_name)"
                                                        :visible-arrow="false"                                      
                                                        placement="top">
                                                    <el-input v-model="scope.row.turbine_name" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                    </el-tooltip>
                                                </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="X" width="118px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.coordinate_x'"
                                            :rules="{validator: validateX, trigger: 'blur'}">
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue2b?'offmytooltip':'onmytooltip'"
                                                    content="八位正数,可带四位小数"
                                                    :disabled="/^\d{8}(\.\d{1,4})?$/.test(scope.row.coordinate_x)"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==1"
                                                    placement="top">
                                                        <el-input v-model="scope.row.coordinate_x" :disabled="uploadLoading"
                                                                    class="gf-table-input" />
                                                    
                                                    </el-tooltip>
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue22b?'offmytooltip':'onmytooltip'"
                                                    content="-180至180,可带四位小数"
                                                    :disabled="scope.row.coordinate_x>-180 && scope.row.coordinate_x<180 && /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(scope.row.coordinate_x)"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==2"
                                                    placement="top">
                                                        <el-input v-model="scope.row.coordinate_x" :disabled="uploadLoading"
                                                                    class="gf-table-input"  />
                                                    
                                                    </el-tooltip>
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue222b?'offmytooltip':'onmytooltip'"
                                                    content="六位正数,可带四位小数"
                                                    :disabled="/^\d{6}(\.\d{1,4})?$/.test(scope.row.coordinate_x)"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==3"
                                                    placement="top">
                                                        <el-input v-model="scope.row.coordinate_x" :disabled="uploadLoading"
                                                                    class="gf-table-input"  />
                                                    
                                                    </el-tooltip>
                                                
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Y" width="118px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.coordinate_y'"
                                            :rules="{validator: validateY, trigger: 'blur'}">
                                                <el-tooltip class="item"
                                                effect="light" 
                                                :popper-class="isTrue3b?'offmytooltip':'onmytooltip'"
                                                content="七位正数,可带四位小数"
                                                :disabled="/^\d{7}(\.\d{1,4})?$/.test(scope.row.coordinate_y)"
                                                :visible-arrow="false"
                                                v-show="isOpenTip==1 || isOpenTip==3"
                                                placement="top">
                                                    <el-input v-model="scope.row.coordinate_y" :disabled="uploadLoading"
                                                                class="gf-table-input"  />
                                                </el-tooltip>
                                                <el-tooltip class="item"
                                                    effect="light" 
                                                    :popper-class="isTrue33b?'offmytooltip':'onmytooltip'"
                                                    content="-90至90,可带四位小数"
                                                    :disabled="scope.row.coordinate_y>-90&&scope.row.coordinate_y<90 && /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(scope.row.coordinate_y)"
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
                                    <el-table-column label="轮毂高度(米)" width="100px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                                <el-form-item :prop="'data.'+scope.$index+'.height'"
                                                :rules="{validator: validateMastListHeighta, trigger: 'blur'}">
                                                    <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="0-300，可保留一位小数"
                                                        :disabled="scope.row.height<300&&scope.row.height>0 && /^[\+]?\d+(\.\d)?$/.test(scope.row.height)"
                                                        :visible-arrow="false"
                                                        placement="top">
                                                    <el-input type="number" title=" " v-model="scope.row.height" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                    </el-tooltip>
                                                </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="海拔(米)" width="75px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                                <el-form-item 
                                                >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正数，可保留三位小数"
                                                        :disabled="/^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(scope.row.elevation)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.elevation" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                    <!-- </el-tooltip> -->
                                                </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="等效小时数" width="80px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                                <el-form-item 
                                                >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="请输入正数"
                                                        :disabled="isNaN(scope.row.equivalent_hours) && scope.row.equivalent_hours > 0"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.equivalent_hours" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                    <!-- </el-tooltip> -->
                                                </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="平均风速(米/秒)" width="110px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                                <el-form-item 
                                                >
                                                    <!-- <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                    content="正数，可保留三位小数"
                                                    :disabled="/^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(scope.row.waked_speed)"
                                                    :visible-arrow="false"
                                                    placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.waked_speed" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                    <!-- </el-tooltip> -->
                                                </el-form-item>
                                        </template>
                                    </el-table-column> 
                                    <el-table-column label="韦布尔参数A(米/秒)" width="135px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                                <el-form-item 
                                               >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正数，可保留三位小数"
                                                        :disabled="/^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(scope.row.at)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.at" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                    <!-- </el-tooltip> -->
                                                </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="韦布尔参数K(米/秒)" width="135px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正数，可保留三位小数"
                                                        :disabled="/^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(scope.row.kt)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.kt" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>               
                                    <el-table-column label="考虑尾流效应的发电量(兆瓦小时/年)" width="145px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正数，可保留三位小数"
                                                        :disabled="/^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(scope.row.array_yield)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.array_yield" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                   
                                    <el-table-column label="考虑尾流效应的平均风速(米/秒)" width="120px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正数，可保留三位小数"
                                                        :disabled="/^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(scope.row.free_speed)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.free_speed" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="尾流效应导致的平均折减率(%)" width="120px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正负小数，可保留三位小数"
                                                        :disabled="/^[+-]?\d*\.?\d{1,3}$/.test(scope.row.waked_discount)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.waked_discount" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="该点的空气密度(千克/立方米)" width="120px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正数，可保留三位小数"
                                                        :disabled="/^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(scope.row.air_density)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.air_density" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <!-- representative_ambiance 特征湍流强度 -->
                                    <el-table-column label="特征湍流强度" width="100px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正负小数,可保留三位小数"
                                                        :disabled="/^[+-]?\d*\.?\d{1,3}$/.test(scope.row.representative_wake_added)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.representative_wake_added" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <!-- average_shear平均风切变指数 -->
                                    <el-table-column label="平均风切变指数" width="100px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正负小数,可保留三位小数"
                                                        :disabled="/^[+-]?\d*\.?\d{1,3}$/.test(scope.row.average_shear)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.average_shear" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <!-- max_inc最大入流角(度) -->
                                    <el-table-column label="最大入流角(度)" width="100px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正负小数,可保留三位小数"
                                                        :disabled="/^[+-]?\d*\.?\d{1,3}$/.test(scope.row.max_inc)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.max_inc" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <!-- max_inclination_sector出现最大入流角的风向扇区(度) -->
                                    <el-table-column label="出现最大入流角的风向扇区(度)" width="120px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正负小数,可保留三位小数"
                                                        :disabled="/^[+-]?\d*\.?\d{1,3}$/.test(scope.row.max_inclination_sector)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.max_inclination_sector" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <!-- nearest_turbine_name最近相邻风机的标签 -->
                                    <el-table-column label="最近相邻风机的标签" width="100px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="允许输入数字、字母、中划线、字符不超10"
                                                        :disabled="/^[\w.-]{1,10}$/.test(scope.row.nearest_turbine_name)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input  v-model="scope.row.nearest_turbine_name" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <!-- distance_to_nearest_turbine相邻风机的最近距离(米) -->
                                    <el-table-column label="相邻风机的最近距离(米)" width="100px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item 
                                            >
                                                    <!-- <el-tooltip class="item" 
                                                        effect="light" 
                                                        :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                        content="正数，可保留三位小数"
                                                        :disabled="/^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(scope.row.distance_to_nearest_turbine)"
                                                        :visible-arrow="false"
                                                        placement="top"> -->
                                                    <el-input type="number" title=" " v-model="scope.row.distance_to_nearest_turbine" :disabled="uploadLoading"
                                                    class="gf-table-input" />
                                                <!-- </el-tooltip> -->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="60px" align="center">
                                        <template slot-scope="scope">
                                            <div class="icon-mid">
                                            <span @click="delRowYou(scope.$index, chengguoListYouke.data)">
                                                <icon name="remove" class="remove-btn" />
                                            </span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form>
                            <div class="add-btn" @click="addChengguoListYouke"><span></span><span></span>+ 新增</div>
                            
                        </div>
                    </div>
                </div>
                <div class="row" v-show="tabIndex === 1">
                    <el-upload  action="/"    class="jiweidianUpload"
                    :before-upload="beforeDaoluUpload" :http-request="httpDaoluRequest"><button ref="daoluUpload"></button></el-upload>
                    <el-upload  action="/"    class="jiweidianUpload"
                    :before-upload="beforeXianluUpload" :http-request="httpXianluRequest"><button ref="xianluUpload"></button></el-upload>
                    <el-upload  action="/"    class="jiweidianUpload"
                    :before-upload="beforeShengyaUpload" :http-request="httpShengyaRequest"><button ref="shengyaUpload"></button></el-upload>
                    
                    <div class="content content2 content4 content5 content4scroll" >
                        <div class="content2header">
                            <div ref="daoluBoxRef" class="uploadbtnBox uploadHover" @mouseenter="cuowuActive3 = true" @mouseleave="cuowuActive3 = false" :class="uploadDaoluObj.active?'uploadBoxActive':''">
                                <div v-if="!uploadDaoluObj.active" @click="onClickDaoluUpload" style="display:flex;align-items:center;justify-content: center;">
                                    <div style="height: 30px;line-height: 25px;">
                                        <span class="icon">
                                            <icon name="zengjia"></icon>
                                        </span>
                                    </div>
                                    <div style="margin-left: 10px;">
                                        添加道路成果(.dxf)
                                    </div>
                                </div>
                                <div v-if="uploadDaoluObj.active" @click="onClickDaoluUpload" class='uploadTerrainNameBox'>
                                    {{uploadDaoluObj.name}}
                                </div>
                                <div @click="errorChange('daolu')" class="cuowuIcon" v-show="daoluError && cuowuActive3"><i class="iconfont icon-cuowu"></i></div>
                                <div class="link rightTipBox">
                                    <el-tooltip class="item" 
                                        effect="light" 
                                        popper-class="onmytooltip"
                                        content="查看说明" 
                                        :disabled="tipShow2a"                                     
                                        placement="top">
                                        <span
                                       
                                        style="padding-top:10px;"
                                        @click="tipShow2a = true"
                                        >
                                            <icon name="shuoming" style="height: 20px;width: 20px;" ></icon>
                                        </span>
                                    </el-tooltip>
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    popper-class="onmytooltip"
                                    content="下载模版"                                    
                                    placement="top">
                                        <a target="_blank" 
                                       
                                        style="padding-top:10px;"
                                        :href="turbineFileTempUrlyouke2daolu">
                                            <icon name="xiazaijiangyiicon" style="height: 22px;width: 23px; color: rgba(212,239,246,0.6)"/>
                                        </a>
                                    </el-tooltip>
                                </div>
                            </div>
                            <div ref="xianluBoxRef" class="uploadbtnBox uploadHover" @mouseenter="cuowuActive4 = true" @mouseleave="cuowuActive4 = false" :class="uploadXianluObj.active?'uploadBoxActive':''">
                                <div v-if="!uploadXianluObj.active" @click="onClickXianluUpload" style="display:flex;align-items:center;justify-content: center;">
                                    <div style="height: 30px;line-height: 25px;">
                                        <span class="icon">
                                            <icon name="zengjia"></icon>
                                        </span>
                                    </div>
                                    <div style="margin-left: 10px;">
                                        添加线路成果压缩包(.zip/.dxf)
                                    </div>
                                </div>
                                <div v-if="uploadXianluObj.active"  @click="onClickXianluUpload" class='uploadTerrainNameBox'>
                                    {{uploadXianluObj.name}}
                                </div>
                                <div @click="errorChange('xianlu')" class="cuowuIcon" v-show="xianluError && cuowuActive4"><i class="iconfont icon-cuowu"></i></div>
                                <div class="link rightTipBox">
                                    <el-tooltip class="item" 
                                        effect="light" 
                                        popper-class="onmytooltip"
                                        content="查看说明" 
                                        :disabled="tipShow2b"                                     
                                        placement="top">
                                        <span
                                        
                                        style="padding-top:10px;"
                                        @click="tipShow2b = true"
                                        >
                                            <icon name="shuoming" style="height: 20px;width: 20px;" ></icon>
                                        </span>
                                    </el-tooltip>
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    popper-class="onmytooltip"
                                    content="下载模版"                                    
                                    placement="top">
                                        <span
                                        style="padding-top:10px;"
                                        @click="xianlumoban">
                                            <icon name="xiazaijiangyiicon" style="height: 22px;width: 23px; color: rgba(212,239,246,0.6)"/>
                                        </span>
                                    </el-tooltip>
                                </div>
                                
                            </div>
                            <div ref="shengyaBoxRef" class="uploadbtnBox uploadHover" @mouseenter="cuowuActive5 = true" @mouseleave="cuowuActive5 = false" :class="uploadShengyaObj.active?'uploadBoxActive':''">
                                <div v-if="!uploadShengyaObj.active" @click="onClickShengyaUpload" style="display:flex;align-items:center;justify-content: center;">
                                    <div style="height: 30px;line-height: 25px;">
                                        <span class="icon">
                                            <icon name="zengjia"></icon>
                                        </span>
                                    </div>
                                    <div style="margin-left: 10px;">
                                        添加升压站成果(.xls/.xlsx)
                                    </div>
                                </div>
                                <div v-if="uploadShengyaObj.active"   @click="onClickShengyaUpload" class='uploadTerrainNameBox'>
                                    {{uploadShengyaObj.name}}
                                </div>
                                <div  class="zhedie" @click="openShengyaTable">{{!uploadShengyaObj.open?'展开':'收起'}}</div>
                                <div @click="errorChange('shengya')" class="cuowuIcon" v-show="shengyaError && cuowuActive5"><i class="iconfont icon-cuowu"></i></div>
                                <div class="link rightTipBox">
                                    <el-tooltip class="item" 
                                        effect="light" 
                                        popper-class="onmytooltip"
                                        content="查看说明" 
                                        :disabled="tipShow2"                                     
                                        placement="top">
                                        <span
                                       
                                        style="padding-top:10px;"
                                        @click="tipShow2 = true"
                                        >
                                            <icon name="shuoming" style="height: 20px;width: 20px;" ></icon>
                                        </span>
                                    </el-tooltip>
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    popper-class="onmytooltip"
                                    content="下载模版"                                    
                                    placement="top">
                                        <a target="_blank" 
                                       
                                        style="padding-top:10px;"
                                        :href="turbineFileTempUrlyouke2">
                                            <icon name="xiazaijiangyiicon" style="height: 22px;width: 23px; color: rgba(212,239,246,0.6)"/>
                                        </a>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        
                        <div class="content3 content2footer" :class="uploadShengyaObj.open?'contentyouke22Height':'contentyouke1'">      
                                    
                                <el-form :model="shengyaListYouke" ref="shengyaListRef" status-icon >
                                    <el-table class="gf-table need-border content-table" :data="shengyaListYouke.data" min-height= "50" max-height="216">
                                        <el-table-column width="80px" label="点位" header-align="center" align="center">
                                            <template slot-scope="scope">
                                               
                                                <el-form-item>
                                                    <span>点位{{scope.$index+1}}</span>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="X" width="127px" header-align="center" align="center">
                                            <template slot-scope="scope">
                                                <el-form-item :prop="'data.'+scope.$index+'.longitude'" 
                                                :rules="{validator: validateX, trigger: 'blur'}">
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue2b?'offmytooltip':'onmytooltip'"
                                                    content="八位正数,可带四位小数"
                                                    :disabled="/^\d{8}(\.\d{1,4})?$/.test(scope.row.longitude)"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==1"
                                                    placement="top">
                                                        <el-input v-model="scope.row.longitude" :disabled="uploadLoading"
                                                                    class="gf-table-input"  />
                                                    
                                                    </el-tooltip>
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue22b?'offmytooltip':'onmytooltip'"
                                                    content="-180至180,可带四位小数"
                                                    :disabled="scope.row.longitude>-180&&scope.row.longitude<180 && /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(scope.row.longitude)"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==2"
                                                    placement="top">
                                                        <el-input v-model="scope.row.longitude" :disabled="uploadLoading"
                                                                    class="gf-table-input" />
                                                    
                                                    </el-tooltip>
                                                    <el-tooltip class="item" 
                                                    effect="light" 
                                                    :popper-class="isTrue222b?'offmytooltip':'onmytooltip'"
                                                    content="六位正数,可带四位小数"
                                                    :disabled="/^\d{6}(\.\d{1,4})?$/.test(scope.row.longitude)"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==3"
                                                    placement="top">
                                                        <el-input v-model="scope.row.longitude" :disabled="uploadLoading"
                                                                    class="gf-table-input" />
                                                    
                                                    </el-tooltip>
                                                   
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Y" width="127px" header-align="center" align="center">
                                            <template slot-scope="scope">
                                                <el-form-item :prop="'data.'+scope.$index+'.latitude'" 
                                                :rules="{validator: validateY, trigger: 'blur'}">
                                                    <el-tooltip class="item"
                                                    effect="light" 
                                                    :popper-class="isTrue3b?'offmytooltip':'onmytooltip'"
                                                    content="七位正数,可带四位小数"
                                                    :disabled="/^\d{7}(\.\d{1,4})?$/.test(scope.row.latitude)"
                                                    :visible-arrow="false"
                                                    v-show="isOpenTip==1 || isOpenTip==3"
                                                    placement="top">
                                                        <el-input v-model="scope.row.latitude" :disabled="uploadLoading"
                                                                    class="gf-table-input"  />
                                                    </el-tooltip>
                                                    <el-tooltip class="item"
                                                        effect="light" 
                                                        :popper-class="isTrue33b?'offmytooltip':'onmytooltip'"
                                                        content="-90至90,可带四位小数"
                                                        :disabled="scope.row.latitude>-90&&scope.row.latitude<90  && /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(scope.row.latitude)"
                                                        :visible-arrow="false"
                                                        v-show="isOpenTip==2"
                                                        placement="top">
                                                        <el-input v-model="scope.row.latitude" :disabled="uploadLoading"
                                                                    class="gf-table-input"
                                                                    
                                                        />
                                                    </el-tooltip>
                                                   
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="高程" width="100px" header-align="center" align="center">
                                            <template slot-scope="scope">
                                                <el-form-item :prop="'data.'+scope.$index+'.elevation'"
                                                    :rules="{validator: elevationVal, trigger: 'blur'}">
                                                        <el-tooltip class="item" 
                                                            effect="light" 
                                                            :popper-class="isTrue4b?'offmytooltip':'onmytooltip'"
                                                            content="正数，可保留三位小数"
                                                            :disabled="/^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(scope.row.elevation)"
                                                            :visible-arrow="false"
                                                            placement="top">
                                                        <el-input v-model="scope.row.elevation" :disabled="uploadLoading"
                                                        class="gf-table-input" />
                                                        </el-tooltip>
                                                </el-form-item>
                                               
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="40px" align="center">
                                            <template slot-scope="scope">
                                                <div class="icon-mid">
                                                <span @click="delRowYou(scope.$index, shengyaListYouke.data ,'shengya')">
                                                    <icon name="refresh1" class="remove-btn"/>
                                                </span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form>
                                <div class="add-btn" @click="addShengyaListYouke">+ 新增</div>   
                                             
                        </div>
                    </div>
                </div>
                <div class="row" v-show="tabIndex === 2">
                    <div class="content content2 content3left">
                        <el-form ref="jingpingFormRef"
                        class="content2form"
                            :model="jingpingForm"
                            :rules="cfdRulesYouke"
                            label-position="left"
                            label-width="120px"
                            style="width: 300px;margin: 0 auto">
                            <el-form-item prop="equivalent_hours"  label="等效小时数:">
                                <el-input v-model="jingpingForm.equivalent_hours" placeholder=""
                                        :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                <div class="unit">h</div>
                            </el-form-item>
                            <el-form-item prop="total_invested"  label="动态总投资:">
                                <el-input v-model="jingpingForm.total_invested"
                                        :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                <div class="unit">万元</div>
                            </el-form-item>
                            <el-form-item  prop="vat_cit" label="度电成本(VAT&CIT):">
                                <el-input v-model="jingpingForm.vat_cit"
                                        :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                <div class="unit">元/KW</div>
                            </el-form-item>
                            <el-form-item prop="pt"  label="Pt(投资回收期):">
                                <el-input v-model="jingpingForm.pt"
                                        :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                <div class="unit">年</div>
                            </el-form-item>
                            <el-form-item prop="n_p_v"  label="投资净现值:">
                                <el-input v-model="jingpingForm.n_p_v"
                                        :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                <div class="unit">万元</div>
                            </el-form-item>
                            <el-form-item  prop="cost_per_kilowatt" label="单位千瓦造价:">
                                <el-input v-model="jingpingForm.cost_per_kilowatt"
                                        :disabled="uploadLoading" class="gf-input" style="width: 214px;height: 30px"/>
                                <div class="unit">元/KW</div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="row" v-show="tabIndex === 3">
                    <el-upload  action="/"    class="jiweidianUpload"
                    :before-upload="beforeZhongheUpload" :http-request="httpZhongheRequest"><button ref="zhongheUpload"></button></el-upload>
                    <!-- <el-upload  action="/"    class="jiweidianUpload"
                    :before-upload="beforeHeightUpload" :http-request="httpHeightRequest"><button ref="heightUpload"></button></el-upload>                  -->
                    <el-upload  action="/"    class="jiweidianUpload"
                    :before-upload="beforeMastlistUpload" :http-request="httpMastlistRequest"><button ref="mastlistUpload"></button></el-upload>

                    <div class="content content2 content4 content5 content4scroll">
                        <div class="content2header">
                            <div class="upload-button upload-button-you" @mouseenter="cuowuActive6 = true" @mouseleave="cuowuActive6 = false">
                                <upload-terrain 
                                        
                                        :project_id="projectId"
                                        @click.native="handleClick"
                                        @uploadBegin="onUploadBegin"
                                        @uploadCompleted="uploadTerrainCompletedHandle"
                                        @uploadErr="uploadErrHandle"
                                        
                                >
                                    <div class="uploadbtnBox" style="width: 280px;height: 100%"  :class="uploadDixingObj.active?'uploadBoxActive':''">
                                        <div style="display:flex;align-items:center;justify-content: center;"
                                        v-if="!uploadDixingObj.active">
                                            <div style="height: 30px;line-height: 25px;padding-left: 10px">
                                                <span class="icon">
                                                    <icon name="zengjia"></icon>
                                                </span>
                                            </div>
                                            <div style="margin-left: 10px;">
                                                添加地形文件(.map/.tif)                                 
                                            </div>
                                        </div>
                                        <div v-if="uploadDixingObj.active"  @click="onClickDixingUpload" class='uploadTerrainNameBox'>
                                            {{uploadDixingObj.name}}
                                        </div>
                                        <div @click="errorChange('dixing')" class="cuowuIcon" v-show="dixingError && cuowuActive6"><i class="iconfont icon-cuowu"></i></div>
                                    </div>
                                </upload-terrain>
                            </div>
                            <folder-table v-if="uploadTabActiveFirst" :project_id="projectId" ref="folderTableRef"
                                            @fileFormChange="fileFormChangeHandle" @Expand="onExpandHandle"
                                            @closeProgressBar="onCloseProgressBar"
                            ></folder-table>
                            
                            <div class="uploadbtnBox uploadHover" @mouseenter="cuowuActive7 = true" @mouseleave="cuowuActive7 = false" :class="uploadZhongheObj.active?'uploadBoxActive':''">
                                <div v-if="!uploadZhongheObj.active" @click="onClickZhongheUpload" style="display:flex;align-items:center;justify-content: center;">
                                    <div style="height: 30px;line-height: 25px;">
                                        <span class="icon">
                                            <icon name="zengjia"></icon>
                                        </span>
                                    </div>
                                    <div style="margin-left: 10px;">
                                        添加综合风图谱(.wrg)
                                    </div>
                                </div>
                                <div v-if="uploadZhongheObj.active"  @click="onClickZhongheUpload" class='uploadTerrainNameBox'>
                                    {{uploadZhongheObj.name}}
                                </div>
                                <div @click="errorChange('zhonghe')" class="cuowuIcon" v-show="zhongheError && cuowuActive7"><i class="iconfont icon-cuowu"></i></div>
                                <div class="link rightTipBox">
                                    <el-tooltip class="item" 
                                        effect="light" 
                                        popper-class="onmytooltip"
                                        content="查看说明"   
                                        :disabled="tipShow4a"                                   
                                        placement="top">
                                        <span 
                                        style="padding-top:10px;"
                                        @click="tipShow4a = true"
                                        >
                                            <icon name="shuoming" style="height: 20px;width: 20px;" ></icon>
                                        </span>
                                    </el-tooltip>
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    popper-class="onmytooltip"
                                    content="下载模版"                                    
                                    placement="top">
                                        <a target="_blank" 
                                       
                                        style="padding-top:10px;"
                                        :href="turbineFileTempUrlyouke4a">
                                            <icon name="xiazaijiangyiicon" style="height: 22px;width: 23px; color: rgba(212,239,246,0.6)"/>
                                        </a>
                                    </el-tooltip>
                                </div>
                            </div>
                            <div class="uploadbtnBox uploadHover" @mouseenter="cuowuActive8 = true" @mouseleave="cuowuActive8 = false" :class="uploadHeightObj.active?'uploadBoxActive':''">
                                <div v-if="!uploadHeightObj.active" @click="onClickHeightUpload" style="display:flex;align-items:center;justify-content: center;">
                                    <div style="height: 30px;line-height: 25px;">
                                        <span class="icon">
                                            <icon name="zengjia"></icon>
                                        </span>
                                    </div>
                                    <div style="margin-left: 10px;">
                                        添加图谱高度
                                    </div>
                                </div>
                                <div v-if="uploadHeightObj.active"    class='uploadTerrainNameBox'>
                                    {{uploadHeightObj.name}}
                                </div>
                                <div  @click="errorChange('height')" class="cuowuIcon" v-show="heightError && cuowuActive8"><i class="iconfont icon-cuowu"></i></div>
                                <div v-if="uploadHeightObj.active" class="zhedie" @click="openHeightTable">{{!uploadHeightObj.open?'展开':'收起'}}</div>
                            </div>
                            <div class="slierBox" v-if="uploadHeightObj.open">
                                <span class="left" @click="leftClick">{{'<'}}</span>
                                <div class="overUlBox">
                                    <ul class="ulBox" :style="{left: leftX +'px'}">
                                        <li :class="silerClickActive == item?'bgActive':''" v-for="(item,index) of heightlist" :key="index"><span @click="silerClick(item)">{{item}}</span></li>
                                    </ul>
                                </div>
                                <span class="danwei"><span></span>m</span>
                                <span class="right" @click="rightClick">{{'>'}}</span>
                            </div>
                            <div class="uploadbtnBox uploadHover" @mouseenter="cuowuActive9 = true" @mouseleave="cuowuActive9 = false" :class="uploadMastlistObj.active?'uploadBoxActive':''">
                                <div v-if="!uploadMastlistObj.active" @click="onClickMastlistUpload" style="display:flex;align-items:center;justify-content: center;">
                                    <div style="height: 30px;line-height: 25px;">
                                        <span class="icon">
                                            <icon name="zengjia"></icon>
                                        </span>
                                    </div>
                                    <div style="margin-left: 10px;">
                                        添加测风塔文件(.txt)
                                    </div>
                                </div>
                                <div v-if="uploadMastlistObj.active"   @click="onClickMastlistUpload" class='uploadTerrainNameBox'>
                                    {{uploadMastlistObj.name}}
                                </div>
                                <div  class="zhedie" @click="openMastlistTable">{{!uploadMastlistObj.open?'展开':'收起'}}</div>
                                <div  @click="errorChange('mastlist')" class="cuowuIcon" v-show="mastlistError && cuowuActive9"><i class="iconfont icon-cuowu"></i></div>
                                <div class="link rightTipBox">
                                    <el-tooltip class="item" 
                                        effect="light" 
                                        popper-class="onmytooltip"
                                        content="查看说明"   
                                        :disabled="tipShow4"                                   
                                        placement="top">
                                        <span
                                       
                                        style="padding-top:10px;"
                                        @click="tipShow4 = true"
                                        >
                                            <icon name="shuoming" style="height: 20px;width: 20px;" ></icon>
                                        </span>
                                    </el-tooltip>
                                    <el-tooltip class="item" 
                                    effect="light" 
                                    popper-class="onmytooltip"
                                    content="下载模版"                                    
                                    placement="top">
                                        <!-- <a target="_blank" 
                                      
                                        style="padding-top:10px;"
                                        :href="turbineFileTempUrlyouke4">
                                            <icon name="xiazaijiangyiicon" style="height: 22px;width: 23px; color: rgba(212,239,246,0.6)"/>
                                        </a> -->
                                        <span 
                                        style="padding-top:10px;"
                                        @click="mastmoban">
                                            <icon name="xiazaijiangyiicon" style="height: 22px;width: 23px; color: rgba(212,239,246,0.6)"/>
                                        </span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="content3 content3footer" :class="uploadMastlistObj.open?'contentyouke3Height':'contentyouke1'">
                            <div class="upload-form" style="width: 310px;margin: 0 auto 0 auto;">
                                <el-form inline class="original-form-inline">
                                    <el-form-item>
                                        <div slot="label">
                                            <div>源坐标系:</div>
                                        </div>
                                        <el-cascader
                                                :options="pcsOptions"
                                                :show-all-levels="false"
                                                v-model="target_epsg_id"
                                                popper-class="powerCurve"
                                                @active-item-change="handleItemChange"
                                                @change="onTargetChange"
                                                :disabled="true"
                                        ></el-cascader>
                                        <!-- 箭头样式也加了影藏 .content3footer .el-input__suffix -->
                                    </el-form-item>
                                </el-form>
                            </div>
                           
                            <el-form :model="mastList"  ref="mastListFormRef" status-icon :show-message="false">
                                <el-table class="gf-table need-border"  max-height="216"
                                :data="mastList.data" 
                                
                                @cell-click="handleHover">
                                    <el-table-column width="90px" label="测风塔编号" header-align="center" align="center">
                                        <template slot-scope="scope">
    
                                            <el-form-item :prop="'data.'+scope.$index+'.code'" 
                                            :rules="{validator: validateMastListCodea, trigger: 'blur' }"
                                                            >
                                                            
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            :popper-class="isTrue1?'offmytooltip':'onmytooltip'"
                                            content="允许输入数字、字母、中划线、字符不超10" 
                                            :disabled="/^[\w.-]{1,10}$/.test(scope.row.code)"
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
                                    <el-table-column label="X" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.x'"
                                                            :rules="{validator: validateX, trigger: 'blur' }">
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            :popper-class="isTrue2?'offmytooltip':'onmytooltip'"
                                            content="八位正数,可带四位小数"
                                            :disabled="/^\d{8}(\.\d{1,4})?$/.test(scope.row.x)"
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
                                            content="-180至180,可带四位小数"
                                            :disabled="scope.row.x>-180&&scope.row.x<180 && /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(scope.row.x)"
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
                                            content="六位正数,可带四位小数"
                                            :disabled="/^\d{6}(\.\d{1,4})?$/.test(scope.row.x)"
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
                                    <el-table-column label="Y" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.y'" id="elForm"
                                                            :rules="{validator: validateY, trigger: 'blur'}">
                                            <el-tooltip class="item"
                                                effect="light" 
                                                :popper-class="isTrue3?'offmytooltip':'onmytooltip'"
                                                content="七位正数,可带四位小数"
                                                :disabled="/^\d{7}(\.\d{1,4})?$/.test(scope.row.y)"
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
                                                content="-90至90,可带四位小数"
                                                :disabled="scope.row.y>-90&&scope.row.y<90 && /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(scope.row.y)"
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
                                    <el-table-column label="测风高度(米)" width="110px" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.height'"
                                                            :rules="{validator: validateMastListHeighta, trigger: 'blur'}"
                                                            >
                                                            
                                                            <!-- :rules="{validator: validateMastListHeighta, trigger: 'blur'}" -->
                                            <el-tooltip class="item" 
                                            effect="light" 
                                            :popper-class="isTrue4?'offmytooltip':'onmytooltip'"
                                            content="0-300，可保留一位小数"
                                            :disabled="scope.row.h<300&&scope.row.h>0 && /^[\+]?\d+(\.\d)?$/.test(scope.row.height)"
                                            :visible-arrow="false"
                                                placement="top">
                                                <el-input v-model="scope.row.height" :disabled="uploadLoading"
                                                        class="gf-table-input"
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
                                    <el-table-column label="测风文件" width="150px" align="center">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'data.'+scope.$index+'.filename'" >
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
                                                <span class="icon" @click="delRowYou(scope.$index, mastList.data)">
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
                </div>
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
                <div class="steps">
                    <div class="step-item step-prev" @click="decreaseYouke" v-if="tabIndex !==0">
                        <el-button class="gf-button" style="width: 100%" type="primary">
                            {{stepPrev}}
                        </el-button>
                    </div>
                    <div class="step-item step-next">
                        <el-button class="gf-button" @click="increaseYouke" style="width: 100%" type="primary"
                                   :loading="uploadLoading" :disabled="false">
                            {{stepNext}}
                        </el-button>
                    </div>


                </div>
            </div>
            <div class="upload-success" v-if="uploadSuccess">
                <div class="container">
                    <div class="tit">项目数据初始化中，请等待...</div>
                </div>
            </div>
            <progress-bar ref="progressBar" @confirmCancel="onConfirmCancel"></progress-bar>
            <el-dialog title="批量调整机型数据"
                    :modal="false"
                    :visible.sync="dialogVisibleChange" 
                    custom-class="changeDialog"
                    width="30%">
                <el-form :model="ruleFormChangeObj" ref="ruleFormChange" label-width="100px" class="demo-ruleForm">
                    <el-form-item  label="选中：">
                        {{uploadTabActiveFirst ? selectedTurbineIds.length : selectedChengguoIds.length }}台
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
                
                if (value === '' || value == null) {
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
            //机型
            const turbinListType = (rule, value, callback)=>{
                if (value === '' || value == null) {
                    this.zoneAllTip = true;
                    callback(new Error('请输入数据'));
                }
                else if(value && value.indexOf("/") == -1){
                    this.zoneAllTip = true;
                    callback(new Error('请输入数字、字母、符号/、字符不超15'));
                }
                // else if(/^[0-9a-zA-Z\(\)]{1,15}$/.test(value)){
                //     callback(new Error('允许数字、字母、符号/、字符不超15'));
                // }
                 else {
                    callback();
                }
            }
            //等效小时数
            const isNaNVal = (rule, value, callback)=>{
                if (value === '' || value == null) {
                    callback(new Error('请输入数据'));
                } 
                else if ( isNaN(value) && value > 0 ) {
                    callback(new Error('请输入正数'));
                }
                 else {
                    callback();
                }
            }
             //折减系数通用正数，可保留4位小数
             const elevationVal4 = (rule, value, callback)=>{
                if (value === '' || value == null) {
                    callback(new Error('请输入数据'));
                } 
                else if (!/^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/.test(value)) {
                    callback(new Error('正数，可保留两位小数'));
                }
                 else {
                    callback();
                }
            }
            //海拔-通用正数，可保留三位小数
            const elevationVal = (rule, value, callback)=>{
                if (value === '' || value == null) {
                    callback(new Error('请输入数据'));
                } 
                else if (!/^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(value)) {
                    callback(new Error('正数，可保留两位小数'));
                }
                 else {
                    callback();
                }
            }
            //海拔-通用正负小数可保留三位小数
            const elevationVal2 = (rule, value, callback)=>{
                if (value === '' || value == null) {
                    callback(new Error('请输入数据'));
                } 
                else if (!/^[+-]?\d*\.?\d{1,3}$/.test(value)) {
                    callback(new Error('正负小数,可保留三位小数'));
                }
                 else {
                    callback();
                }
            }
            //风机编号
            const turbinListCode = (rule, value, callback) => {
                if (value === '' || value == null) {
                    this.zoneAllTip = true;
                    callback(new Error('请输入编号'));
                } 
                else if (!/^[A-Za-z0-9-]{1,10}$/.test(value)) {
                    this.zoneAllTip = true;
                    callback(new Error('请正确输入'));
                }
                else if (!/^[\w.-]{1,10}$/.test(value)) {
                    this.zoneAllTip = true;
                    callback(new Error('允许输入数字、字母、中划线、字符不超10'));
                }
                 else {
                    callback();
                }
            };
            // 测风高度、轮毂高度
            const validateMastListHeight = (relu, value, callback) => {
                if (value === '' || value == null) {
                    this.zoneAllTip = true;
                    callback(new Error('请输入高度'));
                } 
                // else if (!/^\d{1,3}(\.\d{1})?$/.test(value)) {
                //     callback(new Error('请正确输入'));
                // } 
                else if (!/^[\+]?\d+(\.\d)?$/.test(value)) {
                    this.zoneAllTip = true;
                    callback(new Error('请正确输入,1-300,可保留一位小数'));
                } 
                else if (parseFloat(value) < 1 || parseFloat(value) > 300) {
                    this.zoneAllTip = true;
                    callback(new Error('1-300,可保留一位小数'));
                } else {
                    callback();
                }
            };
            // 机型
            const validateSelect = (rule, value, callback) => {
                if (value === '' || value == null) {
                    callback(new Error('请选择参数'));
                } else {
                    callback();
                }
            };
            // 上传的文件名
            const validateFileName = (rule, value, callback) => {
                if (value === '' || value == null) {
                    callback(new Error('请选择文件'));
                } else {
                    callback();
                }
            };
            return {
                uploadJiweidianObj:{
                    active:false,
                    open:false,
                    name: ""
                },
                uploadChengguoObj:{
                    active:false,
                    open:false,
                    name: ""
                },
                uploadDaoluObj:{
                    active:false,
                    open:false,
                    name: ""
                },
                uploadXianluObj:{
                    active:false,
                    open:false,
                    name: ""
                },
                uploadShengyaObj:{
                    active:false,
                    open:false,
                    name: ""
                },
                uploadDixingObj:{
                    active:false,
                    open:false,
                    name: ""
                },
                uploadZhongheObj:{
                    active:false,
                    open:false,
                    name: ""
                },
                uploadHeightObj:{
                    active:false,
                    open:false,
                    name: ""
                },
                uploadMastlistObj:{
                    active:false,
                    open:false,
                    name: ""
                },
                waitingHttp: false,
                waitingHttpDixing:false,
                comebacking:false,
                dixing: true,

                tipShow1: false,
                tipShow11: false,
                tipShow2: false,
                tipShow2a: false,
                tipShow2b: false,
                tipShow4: false,
                tipShow4a: false,

                cuowuActive1: false,
                cuowuActive2: false,
                cuowuActive3: false,
                cuowuActive4: false,
                cuowuActive5: false,
                cuowuActive6: false,
                cuowuActive7: false,
                cuowuActive8: false,
                cuowuActive9: false,

                //////以上游客
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
                looktip: true,
                
                validateMastListCodea: validateMastListCode,
                validateMastListHeighta: validateMastListHeight,
                turbinListCode: turbinListCode,
                turbinListType: turbinListType,
                elevationVal: elevationVal,
                elevationVal4: elevationVal4,
                isNaNVal: isNaNVal,
                elevationVal2: elevationVal2,
                validateSelecta: validateSelect,
                validateFileName: validateFileName,
                epsgTipShow: false,
                uploadTerrainName: null,   //精细化地形
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
                isTurbine: false,
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
                //游客部分
                //第一步
                turbineListYouke: {
                    data: [
                        
                    ]
                },
                // 第二步
                chengguoListYouke:{
                    data:[]
                },
               
                shengyaListYouke:{
                    data:[]
                },
                //第三步经评成果
                jingpingForm:{
                    equivalent_hours:"0",
                    total_invested:"0",
                    vat_cit:"0",
                    pt:"0",
                    n_p_v:"0",
                    cost_per_kilowatt:"0"
                },
                //第四步
                mastListYouke:{
                    data:[]
                },
                silerClickActive: 0,
                leftX: 0,
                heightlist:[60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150],
                dialogVisibleChange: false,
                selectedTurbineIds:[],
                selectedChengguoIds: [],
                selectedChengguoIds:[],
                changeJiweiArr:[],
                changeChengguoArr: [],
                ruleFormChangeObj:{
                    jixing: "",
                    height: ""
                },
                isCanClick: true,
                isCanClick2: true,
                //
                nextDisableYou1:false,
                nextDisableYou2:false,
                nextDisableYou3:false,
                nextDisableYou4:false,

                zoneX: 0,
                zoneY: 0,
                zoneXtip: false,
                zoneYtip: false,
                zoneAllTip: false,

                xianluZip: true,
                initLoading: false,
                //以上
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
                cfdRulesYouke:{
                    equivalent_hours: [
                        {validator : elevationVal ,trigger: 'blur'}
                    ],
                    total_invested: [
                        {validator : elevationVal ,trigger: 'blur'}
                    ],
                    vat_cit: [
                        {validator : elevationVal ,trigger: 'blur'}
                    ],
                    pt: [
                        {validator : elevationVal ,trigger: 'blur'}
                    ],
                    n_p_v: [
                        {validator : elevationVal ,trigger: 'blur'}
                    ],
                    cost_per_kilowatt: [
                        {validator : elevationVal ,trigger: 'blur'}
                    ]
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
                waitingLoading: false,
                tabIndexDelNum: null,  //存储第几步
                is_wt: "0"    //0gf  1wt
            };
        },
        computed: {
         
            // 编号验证结果
            bianhao() {

            },
            validateX() {
                console.log(this.epsg_dst ,this.isOpenTip,"ID");
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
                return (document.body.clientHeight - ((this.expandTableClassName === 'height766') ? 650 : 906)) / 2 + 'px';
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
            //游客测风塔使用原来这逻辑
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
            //    console.log(this.mastList.data,"mastList.data")
            //    console.log(this.prevUploadInfo.mastInfo,"prevUploadInfo.mastInfo")
            //    console.log(opData,"对比");
                this.mastList.data.forEach((item, index) => {
                    //
                    let mast = this.prevUploadInfo.mastInfo.find((prevItem) => {
                        // console.log(prevItem,"prevItem")
                        return prevItem.mast_id === item.id;
                    });
                //    console.log(mast,"mast")
                //    console.log(item,"item")
                    if (!item.id) {
                        if (item.code || item.x || item.y || item.height || item.file) {
                            opData.push({op: 'insert', data: item});
                        }
                    } else if ( mast && item.code !== mast.mast_name || item.x !== mast.coordinate_x ||
                        item.y !== mast.coordinate_y || item.height !== mast.height || item.file) {
                        opData.push({op: 'update', data: item});
                    }
                });
                // console.log(opData,"对比");
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
             //下载模版接口--机位点--成果
             turbineFileTempUrlyouke: function () {
                if(this.uploadTabActiveFirst){
                    return util.baseUrl + '/output_template?args=wt_reveal';
                }else{
                    return util.baseUrl + '/output_template?args=pg';
                }
            },
            //升压站
             turbineFileTempUrlyouke2: function () {        
                return util.baseUrl + "/output_template?args=syz";    
            },
            //道路
             turbineFileTempUrlyouke2daolu: function () {        
                return util.baseUrl + "/output_template?args=road";    
            },
            //线路----到时候改JS写法，写两个模版xianlumoban()
             turbineFileTempUrlyouke2xianlu: function () {        
                return util.baseUrl + "/output_template?args=line";    
            },
            //测风塔
             turbineFileTempUrlyouke4: function () {
                 return util.baseUrl + "/output_template?args=mast_coordinate";   
            },
            //综合风图谱
             turbineFileTempUrlyouke4a: function () {
                 return util.baseUrl + "/output_template?args=wrg";   
            },
            // 下载UAV模板
            output_template() {
                if (this.tabIndex === 0) return util.baseUrl + '/output_template?args=uav';// 无人机
                if (this.tabIndex === 2) return util.baseUrl + '/output_template?args=mast';// 测风数据模版下载
                if (this.tabIndex === 3) return util.baseUrl + '/output_template?args=wt';// 风机排布模版下载
            },
            nowProjectId(){
                // console.log(this.$store.state.app.nowProjectId);
                return this.$store.state.app.nowProjectId;
            },
            jiweidianError(){
                if(this.uploadJiweidianObj.name){
                    return true;
                }else{
                    return false;
                }
            },
            chengguoError(){
                if(this.uploadChengguoObj.name){
                    return true;
                }else{
                    return false;
                }
            },
            daoluError(){
                if(this.uploadDaoluObj.name){
                    return true;
                }else{
                    return false;
                }
            },
            xianluError(){
                if(this.uploadXianluObj.name){
                    return true;
                }else{
                    return false;
                }
            },
            shengyaError(){
                if(this.uploadShengyaObj.name || this.shengyaListYouke.data.length>0){
                    return true;
                }else{
                    return false;
                }
            },
            dixingError(){
                if(this.uploadDixingObj.name){
                    return true;
                }else{
                    return false;
                }
            },
            zhongheError(){
                if(this.uploadZhongheObj.name){
                    return true;
                }else{
                    return false;
                }
            },
            heightError(){
                if(this.uploadHeightObj.name){
                    return true;
                }else{
                    return false;
                }
            },
            mastlistError(){
                if(this.uploadMastlistObj.name){
                    return true;
                }else{
                    return false;
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
            initLoading () {
                this.$store.commit('globeLoading', {loading: this.initLoading, text: '正在获取数据...'});
            },
            waitingLoading () {
                this.$store.commit('globeLoading', {loading: this.waitingLoading, text: '正在上传数据文件，请稍后...'});
            },
            waitingDel () {
                this.$store.commit('globeLoading', {loading: this.waitingDel, text: '正在删除数据...'});
            },
            waitingHttp () {
                this.$store.commit('globeLoading', {loading: this.waitingHttp, text: '正在提交数据，请稍后...'});
            },
            waitingHttpDixing () {
                this.$store.commit('globeLoading', {loading: this.waitingHttpDixing, text: '项目数据初始化中，请等待...'});
            },
            comebacking () {
                this.$store.commit('globeLoading', {loading: this.comebacking, text: '返回上一步中，请稍后...'});
            },
          
            
        },
        updated() {
            
            
        },
       
        methods: {
            //游客模式
            //设置*号
            must(obj) {
                // console.log(obj.columnIndex);
                if(obj.columnIndex == 2 || obj.columnIndex == 3 || obj.columnIndex == 4 || obj.columnIndex == 5 || obj.columnIndex == 6) {
                    return 'must';
                }
            },

            //确定修改
            submitForm(){
                if(this.uploadTabActiveFirst){
                    this.changeJiweiArr.map((item,index)=>{
                        item.type = this.ruleFormChangeObj.jixing;
                        item.height = this.ruleFormChangeObj.height;
                    })
                    for (let i = 0; i < this.changeJiweiArr.length; i++) {
                        for (let j = 0; j < this.turbineListYouke.data.length; j++) {
                            if(this.turbineListYouke.data[j].id === this.changeJiweiArr[i].id){
                                this.turbineListYouke.data[j].type = this.changeJiweiArr[i].type;
                                this.turbineListYouke.data[j].height = this.changeJiweiArr[i].height;
                            }
                        }
                    }
                    this.ruleFormChangeObj = {
                        jixing: "",
                        height: ""
                    }
                    this.dialogVisibleChange = false;
                }
                else{
                    this.changeChengguoArr.map((item,index)=>{
                        item.turbine_type = this.ruleFormChangeObj.jixing;
                        item.height = this.ruleFormChangeObj.height;
                    })
                    for (let i = 0; i < this.changeChengguoArr.length; i++) {
                        for (let j = 0; j < this.chengguoListYouke.data.length; j++) {
                            if(this.chengguoListYouke.data[j].id === this.changeChengguoArr[i].id){
                                this.chengguoListYouke.data[j].turbine_type = this.changeChengguoArr[i].turbine_type;
                                this.chengguoListYouke.data[j].height = this.changeChengguoArr[i].height;
                            }
                        }
                    }
                    this.ruleFormChangeObj = {
                        jixing: "",
                        height: ""
                    }
                    this.dialogVisibleChange = false;
                }
                
            },
            //修改所选风机的机型参数
            changeJiwei(){
                if(!this.isCanClick){
                    this.dialogVisibleChange = true;
                    this.ruleFormChangeObj.jixing = this.turbineListYouke.data[0].type;
                    this.ruleFormChangeObj.height = this.turbineListYouke.data[0].height;
                }
            },
            changeChengguo(){
                if(!this.isCanClick2){
                    this.dialogVisibleChange = true;
                    this.ruleFormChangeObj.jixing = this.chengguoListYouke.data[0].turbine_type;
                    this.ruleFormChangeObj.height = this.chengguoListYouke.data[0].height;
                }
            },
            //删除所选
            delAllJiwei(){
                if(!this.isCanClick){

                    for (let i = 0; i < this.changeJiweiArr.length; i++) {
                        for (let j = 0; j < this.turbineListYouke.data.length; j++) {
                            if(this.turbineListYouke.data[j].id === this.changeJiweiArr[i].id){
                                this.turbineListYouke.data.splice(j,1);
                            }
                        }
                    }

                }
            },
            delAllChengguo(){
                if(!this.isCanClick2){

                    for (let i = 0; i < this.changeChengguoArr.length; i++) {
                        for (let j = 0; j < this.chengguoListYouke.data.length; j++) {
                            if(this.chengguoListYouke.data[j].id === this.changeChengguoArr[i].id){
                                this.chengguoListYouke.data.splice(j,1);
                            }
                        }
                    }

                }
            },
            //复选框事件
            handleSelectionChange(val) {
                this.changeJiweiArr = val;
                this.selectedTurbineIds = [];
                val.forEach(row => {
                    this.selectedTurbineIds.push(row);
                });
                
                if(this.selectedTurbineIds.length<=0){
                    this.isCanClick = true;
                }else{
                    this.isCanClick = false;
                }
                this.isCanClick2 = false;
            },
            handleSelectionChange2(val){
                this.changeChengguoArr = val;
                this.selectedChengguoIds = [];
                val.forEach(row => {
                    this.selectedChengguoIds.push(row);
                });
                if(this.selectedChengguoIds.length<=0){
                    this.isCanClick2 = true;
                }else{
                    this.isCanClick2 = false;
                }
                this.isCanClick = false;
            },
            //线路下载模版-两个util.baseUrl + "/output_template?args=line"; args=line_dxf
            xianlumoban(){
                let link = document.createElement('a');
                link.style.display = 'none';
                link.target = '_blank';
                link.href = util.baseUrl + "/output_template?args=line";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                let link2 = document.createElement('a');
                link2.style.display = 'none';
                link2.target = '_blank';
                link2.href = util.baseUrl + "/output_template?args=line_dxf";
                document.body.appendChild(link2);
                link2.click();
                document.body.removeChild(link2);
            },
            //测风下载模版-两个util.baseUrl + "/output_template?args=mast_coordinate"; args=mast-10min-90m
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
            initJiweidian(){
                this.uploadJiweidianObj={
                    active:false,
                    open:false,
                    name: ""
                }
                this.turbineListYouke= {
                    data: []
                }
            },
            initChengguo(){
                this.uploadChengguoObj={
                    active:false,
                    open:false,
                    name: ""
                }
                this.chengguoListYouke={
                    data:[]
                }
            },
            initDaolu(){
                this.uploadDaoluObj={
                    active:false,
                    open:false,
                    name: ""
                }
               
            },
            initXianlu(){
                this.uploadXianluObj={
                    active:false,
                    open:false,
                    name: ""
                }
               
            },
            initShengya(){
                this.uploadShengyaObj={
                    active:false,
                    open:false,
                    name: ""
                }
                this.shengyaListYouke={
                    data:[]
                }
            },
            initDixing(){
                this.uploadDixingObj={
                    active:false,
                    open:false,
                    name: ""
                }
            },
            initZhonghe(){
                this.uploadZhongheObj={
                    active:false,
                    open:false,
                    name: ""
                }
            },
            initHeight(){
                this.uploadHeightObj={
                    active:false,
                    open:false,
                    name: ""
                }
                this.silerClickActive = 0;
            },
            initMastlist(){
                this.uploadMastlistObj={
                    active:false,
                    open:false,
                    name: ""
                }
                this.mastList={
                    data:[]
                }
                // this.mastListYouke={
                //     data:[]
                // }
            },
            clearInitYouke(){
                this.epsg_dst = null;
                this.target_epsg_id = null;
                
                this.initJiweidian();
                this.initChengguo();
                this.initDaolu();
                this.initXianlu();
                this.initShengya();
                this.initDixing();
                this.initZhonghe();
                this.initMastlist();
                
                //第三步经评成果
                this.jingpingForm={
                    equivalent_hours:"0",
                    total_invested:"0",
                    vat_cit:"0",
                    pt:"0",
                    n_p_v:"0",
                    cost_per_kilowatt:"0"
                }
                
            },
            //间接点击上传机位点事件
            onClickJiweidainUpload(){
                this.$refs['jiweidianUpload'].click();
            },
            //成果
            onClickChengguoUpload(){
                this.$refs['chengguoUpload'].click();
            },
            //道路
            onClickDaoluUpload(){
                this.$refs['daoluUpload'].click();
            },
            //线路
            onClickXianluUpload(){
                this.$refs['xianluUpload'].click();
            },
            //升压站
            onClickShengyaUpload(){
                this.$refs['shengyaUpload'].click();
            },
            //地形
            onClickDixingUpload(){
                this.$refs['dixingUpload'].click();
            },
            //综合风图谱
            onClickZhongheUpload(){
                this.$refs['zhongheUpload'].click();
            },
            //图谱高度
            onClickHeightUpload(){
                // this.$refs['heightUpload'].click();
                this.httpHeightRequest();
            },
            //测风塔信息
            onClickMastlistUpload(){
                this.$refs['mastlistUpload'].click();
            },
            //点击删除按钮
            errorChange(type){
                switch (type) {
                    case "jiweidian":
                        this.$confirm('此操作会删除已上传的文件及其表格数据！', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        })
                        .then(() => {
                            this.initJiweidian();
                        }).catch(() => { });
                    break;
                    case "chengguo":
                        this.$confirm('此操作会删除已上传的文件及其表格数据！', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        })
                        .then(() => {
                            this.initChengguo();
                        }).catch(() => { });
                    break;
                    case "daolu":
                        this.$confirm('此操作会删除已上传的道路文件！', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        })
                        .then(() => {
                            
                            this.delDaoluHttp();
                        }).catch(() => { });
                    break;
                    case "xianlu":
                        this.$confirm('此操作会删除已上传的线路文件！', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        })
                        .then(() => {
                            
                            this.delXianluHttp();
                        }).catch(() => { });
                    break;
                    case "shengya":
                        this.$confirm('此操作会删除已上传的文件及其表格数据！', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        })
                        .then(() => {
                            this.initShengya();
                        }).catch(() => { });
                    break;
                    case "dixing":
                        this.$confirm('此操作会删除已上传的地形文件！', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        })
                        .then(() => {
                            
                            this.delDixingHttp();
                        }).catch(() => { });
                    break;
                    case "zhonghe":
                        this.$confirm('此操作会删除已上传的综合风图谱文件！', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        })
                        .then(() => {
                            
                            this.delZhongheHttp();
                        }).catch(() => { });
                    break;
                    case "height":
                        this.$confirm('此操作会删除已上选择的默认高度！', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        })
                        .then(() => {
                            this.initHeight();
                        }).catch(() => { });
                    break;
                    case "mastlist":
                        this.$confirm('此操作会删除已上传的文件及其表格数据！', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        })
                        .then(() => {
                            this.waitingDel = true;
                            const p1 = this.delMast();
                            Promise.all([p1]).then(() => {
                                setTimeout(()=>{
                                    this.waitingDel = false;
                                    this.loadMastInfo();
                                },1000)
                                
                            }).catch((err)=>{
                                this.waitingDel = false;
                                console.log(err);
                            })
                            
                        }).catch(() => { });
                    break;
                }
            },
            //可选模块删除
            //道路
            delDaoluHttp(){
                if(this.uploadDaoluObj.name){
                    util.ajax.delete(`/reveal_road/${this.projectId}/1`).then((res) => {
                        // console.log(res,"道路删除接口");
                        if(res.data.code == 204){
                            this.$message.success("道路文件删除成功！");
                            this.initDaolu();
                        }else{
                            this.$message.error("道路文件删除失败！");
                        }
                    }).catch((err) => {
                        this.$message.error("道路文件删除失败！");
                    });
                }
                
            },
            //线路
            delXianluHttp(){
                if(this.uploadXianluObj.name && this.xianluZip){
                    util.JdxlUrl.get("/deletescheme",{
                        params:{
                            project_id : this.projectId ,
                            scheme_id : 1
                        }
                    }).then(res=>{
                        // console.log(res);
                        if(res.data.code == 0){
                            this.$message.success("线路压缩包.zip删除成功！");
                            this.initXianlu();
                        }else{
                            this.$message.error("线路压缩包.zip删除失败！");
                        }
                    }).catch((err) => {
                        this.$message.error("线路压缩包.zip删除失败！");
                    });
                        
                }
                if(this.uploadXianluObj.name && !this.xianluZip){
                    util.ajax.delete("/reveal_line_convert/"+ this.projectId +"/1")
                    .then((res)=>{
                        // console.log(res);
                        if(res.data.code == 204){
                            this.$message.success("线路文件.dxf删除成功！");
                            this.initXianlu();
                        }else{
                            this.$message.error("线路文件.dxf删除失败！");
                        }
                    }).catch(err => {
                        console.log(err);
                        this.$message.error("线路文件.dxf删除失败！");
                    });
                }
            },
            //地形
            delDixingHttp(){
                if(this.uploadDixingObj.name){
                    util.ajax.delete(`/input_terrain/${this.projectId}`).then((res) => {
                        console.log(res,"地形删除接口");
                        if(res.data.code == 204){
                            this.$message.success("地形文件删除成功！");
                            this.initDixing();
                        }else{
                            this.$message.error("地形文件删除失败！");
                        }
                    }).catch((err) => {
                        this.$message.error("地形文件删除失败！");
                    });
                }
            },
            //综合/input_wrg_file/<int:project_id>
            delZhongheHttp(){
                util.ajax.delete(`/input_wrg_file/${this.projectId}`).then((res) => {
                    console.log(res,"综合风图谱删除接口");
                    if(res.data.code == 204){
                        this.$message.success("综合风图谱文件删除成功！");
                        this.initZhonghe();
                        this.initHeight();
                    }else{
                        this.$message.error("综合风图谱文件删除失败！");
                    }
                }).catch((err) => {
                    this.$message.error("综合风图谱文件删除失败！");
                });
                
            },

            //机位点上传前
            beforeJiweidainUpload(file){
                // console.log(file);
                if(file.type != "text/plain"){
                    this.$message.error("请选择后缀为.txt的文件！");
                    return false;
                }
            },
            //机位点自定义上传
            httpJiweidianRequest(option){
                // console.log(option);
                this.turbineListYouke.data = [];
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
                    // console.log(res);
                    this.loading.close();
                    if (res.data.code !== 201) {
                        this.$message.error(res.data.message);
                        this.uploadJiweidianObj = {
                            active: false,
                            open: false,
                            name : ""
                        }
                        return;
                    }
                    this.mergeTurbineListYouke(res.data.data , option);
                    
                }).catch(() => {
                    this.loading.close();
                    this.$message.error('文件上传失败');
                    this.uploadJiweidianObj =  {
                        active:false,
                        open:false,
                        name: ""
                    };
                });
            },
            //成果上传前
            beforeChengguoUpload(file){
                // console.log(file);//application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                let arr = file.name.split(".");
                let str = arr[arr.length-1];
                // console.log(str);
                if(str != "xlsx" && str != "xls"){
                    this.$message.error("请选择后缀为.xlsx/.xls的文件！");
                    return false;
                }
            },
            //成果自定义上传
            httpChengguoRequest(option){
                // console.log(option);
                this.chengguoListYouke.data = [];
                const formData = new FormData();
                const file = option.file;

                formData.append('pg_excel', file, file.name);
                formData.append('is_reveal', "1");
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
                    // console.log(res);
                    this.loading.close();
                    if (res.data.code != 200) {
                        this.$message.error(res.data.message);
                        this.uploadChengguoObj = {
                            active: false,
                            open: false,
                            name : ""
                        }
                        return;
                    }
                    this.chengguoListYouke.data = res.data.data;
                    // console.log(this.chengguoListYouke.data);
                    this.chengguoListYouke.data.map((item,index)=>{
                        item.coordinate_x = Number(String(item.coordinate_x).replace(/^(.*\..{4}).*$/,"$1"));
                        item.coordinate_y = Number(String(item.coordinate_y).replace(/^(.*\..{4}).*$/,"$1"));
                        item.zfocus_index = false;
                        item.id =  Math.random()*10000000;
                    })
                    this.uploadChengguoObj = {
                        active: true,
                        open: true,
                        name : option.file.name
                    }
                }).catch((err) => {
                    this.loading.close();
                    console.log(err);
                    this.$message.error('文件上传失败');
                    this.uploadChengguoObj =  {
                        active:false,
                        open:false,
                        name: ""
                    };
                });
            },
            //道路上传前
            beforeDaoluUpload(file){
                // console.log(file);
                let arr = file.name.split(".");
                let str = arr[arr.length-1];
                // console.log(str);
                if(str != "dxf"){
                    this.$message.error("请选择后缀为.dxf的文件！");
                    return false;
                }
            },
            //道路自定义
            httpDaoluRequest(option){
               
                this.waitingLoading = true;
                // console.log(option);
                let data = new FormData();
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 600000
                };
                data.append('road_dxf', option.file,option.file.name);
                util.ajax.post("/reveal_road/"+this.projectId+"/1", data, config)
                .then((res) => {
                    this.waitingLoading = false;
                    console.log(res,"daolu");
                    if(res.data.code == 201){

                        this.uploadDaoluObj = {
                            active: true,
                            open: true,
                            name : option.file.name
                        }
                    }else{
                        this.$message.error(res.data.message);
                        this.uploadDaoluObj = {
                            active: false,
                            open: false,
                            name : ""
                        }
                    }
                })
                .catch((err) => {
                    this.waitingLoading = false;
                    console.log(err);
                    this.$message.error('文件上传失败');
                    this.uploadDaoluObj =  {
                        active:false,
                        open:false,
                        name: ""
                    };
                });
            },
            //线路上传前
            beforeXianluUpload(file){
               
                // console.log(file);
                let arr = file.name.split(".");
                let str = arr[arr.length-1];
                let str2 = str.toLowerCase();
                // console.log(str2);
                if(str2 == "zip"){
                    if(!this.xianluZip){  
                        util.ajax.delete("/reveal_line_convert/"+ this.projectId +"/1")
                        .then((res)=>{
                            if(res.data.code != 204){
                                this.$message.error("线路文件.dxf删除失败！");
                            }
                        }).catch(err => {
                            this.$message.error("线路文件.dxf删除失败！");
                            return;
                        });
                    }
                    
                    this.xianluZip = true;
                }else if(str2 == "dxf"){
                    if(this.xianluZip){
                       util.JdxlUrl.get("/deletescheme",{
                            params:{
                                project_id : this.projectId ,
                                scheme_id : 1
                            }
                        }).then(res=>{
                            if(res.data.code != 0){
                                this.$message.error("线路压缩包.zip删除失败！");
                            }
                        }).catch((err) => {
                            this.$message.error("线路压缩包.zip删除失败！");
                            return;
                        });
                    }

                    this.xianluZip = false;
                }else{
                    this.$message.error("请选择后缀为.zip/.dxf的压缩包！");
                    return false;
                }
                
            },
            //线路自定义--- http://1.202.243.97:8008/jdxl/getstatus/project_id=1&scheme_id=1   code=0成功
            httpXianluRequest(option){
                // console.log(option);
                this.waitingLoading = true;
                if( this.xianluZip ){
                    //上传的是zip
                    let data = new FormData();
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        timeout: 99999999
                    };
                    data.append('file', option.file,option.file.name);
                    data.append('project_id', this.projectId);
                    data.append('scheme_id', 1);
                    util.JdxlUrl.post("/uploadfile", data, config)
                    .then((res) => {
                        // this.waitingLoading = false;
                        // console.log(res,"线路");
                        if(res.data.code == 0){
                            this.optionFileName = option.file.name;
                            this.checkReqXianlu();
                            
                        }else{
                            this.waitingLoading = false;
                            this.$message.error('文件上传失败:'+res.data.data);
                            this.uploadXianluObj = {
                                active: false,
                                open: false,
                                name : ""
                            }
                        }
                    }).catch((err) => {
                        this.waitingLoading = false;
                        console.log(err);
                        this.$message.error('文件上传失败');
                        this.uploadXianluObj = {
                            active:false,
                            open:false,
                            name: ""
                        };
                    });

                }else{   //上传的是dxf
                    let data = new FormData();
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        timeout: 99999999
                    };
                    data.append('line_dxf_file', option.file,option.file.name);
                    // data.append('project_id', this.projectId);
                    // data.append('scheme_id', 1);
                    util.ajax.post("/reveal_line_convert/"+ this.projectId +"/1", data, config)
                    .then((res) => {
                        // console.log(res)
                        if(res.data.code == 201){
                            this.waitingLoading = false;
                            this.uploadXianluObj = {
                                active: true,
                                name: option.file.name
                            };
                        }else{
                            this.waitingLoading = false;
                            this.$message.error(res.data.message);
                            this.uploadXianluObj = {
                                active:false,
                                open:false,
                                name: ""
                            };
                        }
                       
                    }).catch((err) => {
                        this.waitingLoading = false;
                        console.log(err);
                        this.$message.error('文件上传失败');
                        this.uploadXianluObj = {
                            active:false,
                            open:false,
                            name: ""
                        };
                    });
                }
                
            },
            //线路
            checkReqXianlu(){
                util.JdxlUrl.get("/getstatus",{
                    params:{
                        project_id : this.projectId ,
                        scheme_id : 1
                    }
                })
                .then((res) => {
                    // console.log(res.data.code,"线路");
                    if(res.data.code == 0){
                        
                        this.waitingLoading = false;
                        this.uploadXianluObj = {
                            active: true,
                            open: true,
                            name : this.optionFileName
                        }
                       
                    }else if(res.data.code == -2){
                        setTimeout(()=>{
                            this.checkReqXianlu();
                        },10000)
                    }else{
                        this.waitingLoading = false;
                        this.$message.error('文件上传失败:'+res.data.data);
                    }

                })
                .catch((err) => {
                    console.log(err);
                    this.waitingLoading = false;
                    this.$message.error('文件上传失败:'+res.data.data);
                    this.uploadXianluObj = {
                        active: false,
                        open: false,
                        name : ""
                    }
                })
            },
            //升压站上传前
            beforeShengyaUpload(file){
                // console.log(file);
                let arr = file.name.split(".");
                let str = arr[arr.length-1];
                // console.log(str);
                if(str != "xlsx" && str != "xls"){
                    this.$message.error("请选择后缀为.xlsx/.xls的文件！");
                    return false;
                }
            },
            //升压站自定义
            httpShengyaRequest(option){
                this.shengyaListYouke.data = [];
                this.waitingLoading = true;
                // console.log(option);
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
                    // console.log(res);
                    if(res.data.code == 200){
                        this.shengyaListYouke.data = res.data.data;
                        this.shengyaListYouke.data.map((item,index)=>{
                            item.latitude = Number(String(item.latitude).replace(/^(.*\..{4}).*$/,"$1"));
                            item.longitude = Number(String(item.longitude).replace(/^(.*\..{4}).*$/,"$1"));
                        })
                        this.uploadShengyaObj = {
                            active: true,
                            open: true,
                            name : option.file.name
                        }
                    }else{
                        this.$message.error(res.data.message);
                        this.uploadShengyaObj = {
                            active: false,
                            open: false,
                            name: ""
                        }
                    }
                })
                .catch((err) => {
                    this.waitingLoading = false;
                    console.log(err);
                    this.uploadShengyaObj = {
                        active: false,
                        open: false,
                        name: ""
                    }
                });
            },
           
            //综合风图谱上传前
            beforeZhongheUpload(file){
                // console.log(file);
                let arr = file.name.split(".");
                let str = arr[arr.length-1];
                // console.log(str);
                if(str != "wrg" ){
                    this.$message.error("请选择后缀为.wrg的压缩包！");
                    return false;
                }
            },
            //综合风图谱自定义
            httpZhongheRequest(option){
                // console.log(option);
                this.waitingLoading = true;
                let data = new FormData();
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 600000
                };
                data.append('wrg_file', option.file,option.file.name);
                util.ajax.post("/input_wrg_file/"+this.projectId,data,config)
                .then((res) => {
                    this.waitingLoading = false;
                    console.log(res,"综合风图谱文件接口");
                    if(res.data.code == 201){

                        this.uploadZhongheObj = {
                            active:true,
                            open:true,
                            name: option.file.name
                        };
                        this.silerClickActive = 90;
                        this.uploadHeightObj.name = "请选择图谱默认高度";
                        this.uploadHeightObj.active = true;
                        this.uploadHeightObj.open = true;
                        this.uploadMastlistObj.open = false;
                    }else{
                        this.$message.error('文件上传失败');
                        this.uploadZhongheObj = {
                            active:false,
                            open:false,
                            name: ""
                        };
                    }
                })
                .catch((err) => {
                    this.waitingLoading = false;
                    console.log(err);
                    this.$message.error('文件上传失败');
                    this.uploadZhongheObj = {
                        active:false,
                        open:false,
                        name: ""
                    };
                });
            },
            //图谱高度上传前
            // beforeHeightUpload(file){
               
            // },
            // //图谱高度自定义
            httpHeightRequest(){
                if(!this.uploadZhongheObj.name){
                    this.$message.error('请先上传综合风图谱文件,再选择高度！');
                    return;
                }
                this.silerClickActive = 0;
                this.uploadHeightObj.name = "请点击选择图谱高度";
                this.uploadHeightObj.active = true;
                this.uploadHeightObj.open = true;
                this.uploadMastlistObj.open = false;
            },
            //测风塔信息上传前
            beforeMastlistUpload(file){
                // console.log(file);
                if(file.type != "text/plain"){
                    this.$message.error("请选择后缀为.txt的文件！");
                    return false;
                }
            },
            delMast(){
                
                let mastListIds = this.mastList.data.filter((item,index)=>{
                    return item.id;
                })
                // console.log(mastListIds,"delmastListIds");
                // console.log(this.prevUploadInfo.mastInfo,"prevUploadInfo.mastInfo");
                mastListIds.map((item) => {
                    if (item.id) {
                        return util.ajax.delete('input_mast/' + this.projectId + '/' + item.id).then(res => {
                            if (res.data.code !== 204) {
                                throw res.data.message;
                            }
                            console.log('input_mast_del=> ok');
                        });
                    }
                })
                if(mastListIds.length<=0){
                    return "nonehttpMast";
                }
            },
            daoruMast(option){
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
                    console.log(res,"解析mast");
                    if(res.data.code == 201){
                        this.prevUploadInfo.mastInfo =  [];
                        this.mastList.data = [];
                        res.data.data.forEach((item,index ,obj) => {
                            this.mastList.data.push({
                                id: null,
                                code: item.mast_name,
                                x: item.coordinate_x,
                                y: item.coordinate_y,
                                height: item.height,
                                filename: '',
                                hidden: true
                            });
                        });
                        if(this.mastList.data.length>0){

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
                        
                        //展开
                        this.uploadMastlistObj = {
                            active: true,
                            open: true,
                            name : "input_mast.txt"
                        }
                        this.uploadHeightObj.open = false;
                        
                    }else{
                        this.$message.error(res.data.message);
                        this.uploadMastlistObj = {
                            active:false,
                            open:false,
                            name: ""
                        }
                    }
                })
                .catch((err) => {
                    this.waitingLoading = false;
                    console.log(err);
                    this.uploadMastlistObj = {
                        active: false,
                        open: false,
                        name: ""
                    }
                });

            },
            //测风塔信息自定义
            httpMastlistRequest(option){
                this.waitingLoading = true;
                //导入前删除已有的
                const p2 = this.delMast();
                Promise.all([p2]).then(() => {
                    this.daoruMast(option);
                })
                // this.mastListYouke.data = [];
                // let data = new FormData();
                // let config = {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     }
                // };
                // data.append('mast_coordinate', option.file,option.file.name);
                // util.ajax.post("/reveal_mast_read", data, config)
                // .then((res) => {
                //     this.waitingLoading = false;
                //     // console.log(res);
                //     if(res.data.code == 201){
                //         this.mastListYouke.data = res.data.data;
                //         this.mastListYouke.data.map((item,index)=>{
                //             item.x = Number(String(item.x).replace(/^(.*\..{4}).*$/,"$1"));
                //             item.y = Number(String(item.y).replace(/^(.*\..{4}).*$/,"$1"));
                //         })
                //         this.uploadMastlistObj = {
                //             active: true,
                //             open: true,
                //             name : option.file.name
                //         }
                //         this.uploadHeightObj.open = false;
                        
                //     }else{
                //         this.$message.error(res.data.message);
                //         this.uploadMastlistObj = {
                //             active:false,
                //             open:false,
                //             name: ""
                //         }
                //     }
                // })
                // .catch((err) => {
                //     this.waitingLoading = false;
                //     console.log(err);
                //     this.uploadMastlistObj = {
                //         active: false,
                //         open: false,
                //         name: ""
                //     }
                // });
            },
            //测风塔数据
            getMastListYouke(newlist , optionName){
                if (!newlist) return;
                    
                let templist = [];
                newlist.forEach((item) => {
                    templist.push({
                        id: Math.random()*10000000,
                        name: item.mast_name,
                        x:item.coordinate_x,
                        y:item.coordinate_y,
                        h:item.height,
                        filename:item.filename,
                       
                    });
                });
                this.mastListYouke.data = templist;
                for(let i=0; i<this.mastListYouke.data.length; i++){
                    for(let j=i+1; j<this.mastListYouke.data.length; j++){
                        if(this.mastListYouke.data[i].name == this.mastListYouke.data[j].name){
                            this.mastListYouke.data[j].isCopy = true;
                        }
                    }
                }
                this.uploadMastlistObj = {
                    active: true,
                    open: true,
                    name : optionName
                }
            },
            //机位点数据
            getTurbineListYouke (newlist , optionName) {
                if (!newlist) return;
                let templist = [];
                // console.log(newlist)
                newlist.forEach((item) => {
                    
                    templist.push({
                        id: Math.random()*10000000,
                        turbine_id: '',
                        code: item.turbine_name,
                        type: item.turbine_type,
                        x: Number(String(item.coordinate_x).replace(/^(.*\..{4}).*$/,"$1")),
                        y: Number(String(item.coordinate_y).replace(/^(.*\..{4}).*$/,"$1")),
                        height: item.height,
                       
                    });
                });
                this.turbineListYouke.data = templist;
                this.uploadJiweidianObj = {
                    active: true,
                    open: true,
                    name : optionName
                }
            },
            //机位点自定义上传后数据
            mergeTurbineListYouke (newlist , option) {
                if (!newlist) return;
                let templist = [];
                // console.log(newlist)
                newlist.forEach((item) => {
                    
                    templist.push({
                        id: Math.random()*10000000,
                        turbine_id: '',
                        code: item.turbine_name,
                        type: item.turbine_type,
                        x: Number(String(item.coordinate_x).replace(/^(.*\..{4}).*$/,"$1")),
                        y: Number(String(item.coordinate_y).replace(/^(.*\..{4}).*$/,"$1")),
                        height: item.height,
                       
                    });
                });
                this.turbineListYouke.data = templist;
                this.uploadJiweidianObj = {
                    active: true,
                    open: true,
                    name : option.file.name
                }
            },
            // 增加一行---风机点位数据
            addTurbineYouke() {
                if (this.uploadLoading) {
                    return;
                }
                
                this.$refs['jiweidianBoxRef'].classList.remove("borderRed");
                this.turbineListYouke.data.push({
                    id: Math.random()*10000000,
                    turbine_id: null,
                    code: '',
                    type: '',
                    x: '',
                    y: '',
                    height: '',
                   
                });
                document.querySelector(".el-table__body-wrapper").scrollTop =  document.querySelector(".el-table__body-wrapper").scrollHeight;
            },
            focusBlur(row){
                row.zfocus_index = false;
                // console.log(row)
            },
            // 增加一行---发电量成果数据
            addChengguoListYouke() {
                if (this.uploadLoading) {
                    return;
                }
                this.$refs['chengguoBoxRef'].classList.remove("borderRed");
                this.chengguoListYouke.data.map((item,index)=>{
                    item.zfocus_index = false;
                })
                this.chengguoListYouke.data.push({
                    id:  Math.random()*10000000,
                    turbine_type:"",
                    turbine_name:"",
                    coordinate_x:"",
                    coordinate_y:"",
                    elevation:"",
                    height:"",
                    waked_speed:"",
                    equivalent_hours:"",
                    at:"",
                    kt:"",
                    array_yield:"",
                    yield_78:"",
                    free_speed:"",
                    waked_discount:"",
                    air_density:"",
                    zfocus_index: true
                });
                document.querySelector(".el-table__body-wrapper").scrollTop =  document.querySelector(".el-table__body-wrapper").scrollHeight;
            },
            // 增加一行---升压站数据 --下线了
            addShengyaListYouke(){
                if (this.uploadLoading) {
                    return;
                }
                if(this.shengyaListYouke.data.length>=4){
                    this.$message.warning("升压站拐点不能超过4个！");
                    return;
                }
                let index = this.shengyaListYouke.data.length;
                this.$refs['shengyaBoxRef'].classList.remove("borderRed");
                this.shengyaListYouke.data.push({
                    // name:"点位"+(index+=1),
                    longitude:"",
                    latitude:"",
                    elevation:"",
                });
                document.querySelector(".el-table__body-wrapper").scrollTop =  document.querySelector(".el-table__body-wrapper").scrollHeight;
            },
            // 增加一行---测风塔数据
            addMastlistYouke(){
                if (this.uploadLoading) {
                    return;
                }
                this.mastListYouke.data.push({
                   name:"",
                   x:"",
                   y:"",
                   h:"",
                   filename:"",
                   file:{}
                });
                document.querySelector(".el-table__body-wrapper").scrollTop =  document.querySelector(".el-table__body-wrapper").scrollHeight;
            },
            // 增加一行---增加测风塔
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
                   
                    filename: '',
                    hidden: true
                });
            },
            //折叠表格
            openJidianTable(){
                this.uploadJiweidianObj.open = !this.uploadJiweidianObj.open;
            },
            openChengguoTable(){
                this.uploadChengguoObj.open = !this.uploadChengguoObj.open;
            },
            openDaoluTable(){
                this.uploadDaoluObj.open = !this.uploadDaoluObj.open;
            },
            openXianluTable(){
                this.uploadXianluObj.open = !this.uploadXianluObj.open;
            },
            openShengyaTable(){
                this.uploadShengyaObj.open = !this.uploadShengyaObj.open;
            },
            openHeightTable(){
                this.uploadHeightObj.open = !this.uploadHeightObj.open;
                if(this.uploadHeightObj.open){
                    this.uploadMastlistObj.open = false;
                }
            },
            openMastlistTable(){
                this.uploadMastlistObj.open = !this.uploadMastlistObj.open;
                if(this.uploadMastlistObj.open){
                    this.uploadHeightObj.open = false;
                }
            },
            // 处理功率曲线级联选择框
            handleChangeYouke(value, row, index) {  
                if(value[1]){
                    let stra = value[1].split(".")
                    let strb = stra[stra.length-1]
                    // console.log(strb)
                    if(strb == 'wtg' || strb == 'gfwtg'){                   
                        if (index === 0 && value[0] !== 'upload') {
                            // for (let i = 0; i < this.turbineListYouke.data.length; i++) {
                                this.turbineListYouke.data.splice(index, 1, {
                                    code: this.turbineListYouke.data[index].code,
                                    type: this.turbineListYouke.data[index].type,
                                    x: this.turbineListYouke.data[index].x,
                                    y: this.turbineListYouke.data[index].y,
                                    turbine_id: this.turbineListYouke.data[index].turbine_id,
                                    height: this.turbineListYouke.data[index].height,
                                   
                                });
                               
                                this.bzbStatus = true;
                            // }
                        }
                    }else{
                        this.$message({
                            message:"文件格式必须为.gfwtg/.wtg"
                        })
                        this.bzbStatus = false;
                    }
                }
              
            },
            // 处理风机选择事件 
            handleTurboTypeChangeYouke(index, row) {
                // console.log(index,row,"机型事件")
                // row.type
                let that =this;
                if (index === 0) {
                    const hasOtherType = this.turbineListYouke.data.some((item, index) => {
                        if (index === 0) {
                            return false;
                        }
                        return !!item.type;
                    });
                    // console.log(hasOtherType)
                    if (!hasOtherType) {
                        const type = this.turbineListYouke.data[0].type;
                        this.loadTurbineTypeList(type, (list) => {
                            for (let i = 0; i < this.turbineListYouke.data.length; i++) {
                                this.turbineListYouke.data.splice(i, 1, {
                                    code: this.turbineListYouke.data[i].code,
                                    type: type,
                                    x: this.turbineListYouke.data[i].x,
                                    y: this.turbineListYouke.data[i].y,
                                    turbine_id: this.turbineListYouke.data[i].turbine_id,
                                    height: this.turbineListYouke.data[i].height,
                                  
                                });
                               
                            }
                        });
                    }
                    else{
                        this.loadTurbineTypeList(this.turbineListYouke.data[0].type, (list) => {
                                this.turbineListYouke.data.splice(0, 1, {
                                    code: this.turbineListYouke.data[0].code,
                                    type: this.turbineListYouke.data[0].type,
                                    x: this.turbineListYouke.data[0].x,
                                    y: this.turbineListYouke.data[0].y,
                                    turbine_id: this.turbineListYouke.data[0].turbine_id,
                                    height: this.turbineListYouke.data[0].height,
                                   
                                });
                              
                        });
                    }


                } else {
                    this.loadTurbineTypeList(row.type, (list) => {
                        row.input_power_curve_list[0].children = list;
                        row.input_power_curve_list[0].disabled = false;
                        row.input_power_curve_list[1].disabled = false;
                        
                    });
                }
            },

            //清空第二步数据
            cleartablist2(){
                this.delDaoluHttp();
                this.delXianluHttp();
                this.initShengya();
            },
            //上一步
            decreaseYouke(){
                this.toolTipShow = false;
                // console.log("上一步");
                //由于epsg影响第二步，目前方案，退回去第一步的话要提醒清空第二步的数据
                // if(this.tabIndex == 1){
                //     this.$confirm('此操作将清空第二步工程设计成果数据, 是否继续?', '提示', {
                //         confirmButtonText: '确定',
                //         cancelButtonText: '取消',
                //         type: 'warning'
                //     }).then(() => {
                //         // this.cleartablist2();
                //         this.tabIndex--;

                //     }).catch(() => {
                //         this.tabIndex = 1;  
                //     });
                //     return;
                // }
                if (this.tabIndex > 0) this.tabIndex--;

            },
            //下一步-游客模式
            increaseYouke(){
                this.toolTipShow = false;
                // console.log(this.uploadTabActiveFirst);
                if(this.tabIndex==0) {
                    if(this.epsg_id==null) {  //原坐标值
                        this.$message.error("请选择源坐标系！");
                        this.cascaderStatus = false;   //是否有
                        return;
                    }else {
                        this.cascaderStatus = true;
                    }
                    if(this.uploadTabActiveFirst && this.uploadJiweidianObj.name == "" && this.turbineListYouke.data.length<=0) {  //上传成功名字
                        this.$message.error("请添加机位点文件！");
                        this.$refs['jiweidianBoxRef'].classList.add("borderRed");
                        this.landStatus = false;
                        return;
                    }else{                             
                        this.landStatus = true;
                    }
                    if(!this.uploadTabActiveFirst && this.uploadChengguoObj.name == "" && this.chengguoListYouke.data.length<=0){
                        this.$message.error("请添加发电量成果文件！");
                        this.$refs['chengguoBoxRef'].classList.add("borderRed");
                        this.landStatus = false;
                        return;
                    }else{                                   
                        this.landStatus = true;
                    }
                    //机位点
                    if(this.uploadTabActiveFirst){
                        //表格验证
                       
                        //my check 注释掉||(this.turbineList.data[i].code == this.turbineList.data[j].code)
                        var temp = [];
                        var index = [];
                        var temp2 = [];
                        var index2 = [];
                        for(var i = 0; i < this.turbineListYouke.data.length; i++) {
                           
                            for(var j = i + 1; j < this.turbineListYouke.data.length; j++){
                                if (this.turbineListYouke.data[i].x && this.turbineListYouke.data[i].y &&(this.turbineListYouke.data[i].x == this.turbineListYouke.data[j].x)&&(this.turbineListYouke.data[i].y == this.turbineListYouke.data[j].y)){
                                    index.push(j)
                                    i++;
                                    j = i;
                                }
                                if (this.turbineListYouke.data[i].code && (this.turbineListYouke.data[i].code == this.turbineListYouke.data[j].code)){
                                    index2.push(j)
                                    i++;
                                    j = i;
                                }
                            }
                            temp.push(this.turbineListYouke.data[i]);
                            temp2.push(this.turbineListYouke.data[i]);
                            
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
                            return;
                        }else {
                            this.bzbStatus = true;
                        }
                        if(index2.length>0) {
                            this.$message.error("第"+(str2)+"个与之前编号有重复");
                            this.bzbStatus = false;
                            return;
                        }else {
                            this.bzbStatus = true;
                        }

                        if(this.uploadJiweidianObj.name && this.turbineListYouke.data.length<=0){
                            this.$message.error("机位点数据不能为空!");
                            this.bzbStatus = false;
                            return;
                        }
                        
                    }
                    //成果
                    else{
                        var temp = [];
                        var index = [];
                        var temp2 = [];
                        var index2 = [];
                        for(var i = 0; i < this.chengguoListYouke.data.length; i++) {
                               
                            for(var j = i + 1; j < this.chengguoListYouke.data.length; j++){
                                if (this.chengguoListYouke.data[i].coordinate_x && this.chengguoListYouke.data[i].coordinate_y && (this.chengguoListYouke.data[i].coordinate_x == this.chengguoListYouke.data[j].coordinate_x)&&(this.chengguoListYouke.data[i].coordinate_y == this.chengguoListYouke.data[j].coordinate_y)){
                                    index.push(j)
                                    i++;
                                    j = i;
                                }
                                if (this.chengguoListYouke.data[i].turbine_name && (this.chengguoListYouke.data[i].turbine_name == this.chengguoListYouke.data[j].turbine_name)){
                                    index2.push(j)
                                    i++;
                                    j = i;
                                }
                            }
                            temp.push(this.chengguoListYouke.data[i]);
                            temp2.push(this.chengguoListYouke.data[i]);
                            
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
                            return;
                        }else {
                            this.bzbStatus = true;
                        }
                        if(index2.length>0) {
                            this.$message.error("第"+(str2)+"个与之前编号有重复");
                            this.bzbStatus = false;
                            return;
                        }else {
                            this.bzbStatus = true;
                        }

                        if(this.chengguoListYouke.data.length<=0){
                            this.$message.error("发电量成果数据不能为空!");
                            this.bzbStatus = false;
                            return;
                        }

                    }
                }
                //第二步验证
                if(this.tabIndex==1){
                    if(!this.uploadDaoluObj.name){
                        // this.$message.error("请添加道路成果文件！");
                        // this.$refs['daoluBoxRef'].classList.add("borderRed");
                        // this.bzbStatus = false;
                        // return;
                    }else{
                        this.bzbStatus = true;
                    }
                    if(!this.uploadXianluObj.name){
                        // this.$message.error("请添加线路成果压缩包！");
                        // this.$refs['xianluBoxRef'].classList.add("borderRed");
                        // this.bzbStatus = false;
                        // return;
                    }else{
                        this.bzbStatus = true;
                    }
                    
                    if(this.shengyaListYouke.data.length > 0){
                        //升压站验证
                   
                        var temp = [];
                        var index = [];
                        var temp2 = [];
                        var index2 = [];
                        for(var i = 0; i < this.shengyaListYouke.data.length; i++) {
                               
                            for(var j = i + 1; j < this.shengyaListYouke.data.length; j++){
                                if (this.shengyaListYouke.data[i].longitude && this.shengyaListYouke.data[i].latitude && (this.shengyaListYouke.data[i].longitude == this.shengyaListYouke.data[j].longitude)&&(this.shengyaListYouke.data[i].latitude == this.shengyaListYouke.data[j].latitude)){
                                    index.push(j)
                                    i++;
                                    j = i;
                                }
                                if (this.shengyaListYouke.data[i].name && (this.shengyaListYouke.data[i].name == this.shengyaListYouke.data[j].name)){
                                    index2.push(j)
                                    i++;
                                    j = i;
                                }
                            }
                            temp.push(this.shengyaListYouke.data[i]);
                            temp2.push(this.shengyaListYouke.data[i]);
                            
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
                            return;
                        }else {
                            this.bzbStatus = true;
                        }
                        if(index2.length>0) {
                            this.$message.error("第"+(str2)+"个与之前编号有重复");
                            this.bzbStatus = false;
                            return;
                        }else {
                            this.bzbStatus = true;
                        }
                        
                    }
                }
                //第三步验证
                if(this.tabIndex==2){

                    this.azbStatus = true;
                }
                // 第四步
                if(this.tabIndex==3){
                    // if(this.mastListYouke.data.length>=0){
                    //     //把isCopy的过滤掉验证
                    //     var arrdata = this.mastListYouke.data.filter((item,index)=>{
                    //         return !item.isCopy
                    //     })
                    //     //表格验证
                    //     var temp = [];
                    //     var index = [];
                    //     var temp2 = [];
                    //     var index2 = [];
                    //     for(var i = 0; i < this.mastListYouke.data.length; i++) {
                    //         if(this.mastListYouke.data[i].filename=="" || this.mastListYouke.data[i].filename==null){
                    //             this.$message.error("请选择测风文件！");
                    //             this.acftStatus = false;
                    //             return;
                    //         }
                    //     }
                    if(this.mastList.data.length>=0){
                        //把isCopy的过滤掉验证
                        var arrdata = this.mastList.data.filter((item,index)=>{
                            return !item.isCopy
                        })
                        // console.log(arrdata,"arrdata")
                        //表格验证
                        var temp = [];
                        var index = [];
                        var temp2 = [];
                        var index2 = [];
                        for(var i = 0; i < this.mastList.data.length; i++) {
                            if(this.mastList.data[i].filename=="" || this.mastList.data[i].filename==null){
                                this.$message.error("请选择测风文件！");
                                this.acftStatus = false;
                                return;
                            }
                        }
                        for(var i = 0; i < arrdata.length; i++) {
                            for(var j = i + 1; j < arrdata.length; j++){

                                if (arrdata[i].x && arrdata[i].y && (arrdata[i].x == arrdata[j].x)&&(arrdata[i].y == arrdata[j].y)){
                                    index.push(j)
                                    i++;
                                    j = i;
                                }
                                // if (arrdata[i].name && (arrdata[i].name == arrdata[j].name)){
                                if (arrdata[i].code && (arrdata[i].code == arrdata[j].code)){
                                    index2.push(j)
                                    i++;
                                    j = i;
                                }
                                
                            }
                            temp.push(arrdata[i]);
                            temp2.push(arrdata[i]);
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
                            this.acftStatus = false;
                            return;
                        }else {
                            this.acftStatus = true;
                        }
                        if(index2.length>0) {
                            this.$message.error("第"+(str2)+"个与之前编号有重复");
                            this.acftStatus = false;
                            return;
                        }else {
                            this.acftStatus = true;
                        }
                        //过滤出来判断高度，
                        // var arrayTwo = Object.values(this.mastListYouke.data.reduce((res, item) => {
                        var arrayTwo = Object.values(this.mastList.data.reduce((res, item) => {
                            // res[item.name] ? res[item.name].push(item) : res[item.name] = [item];
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
                                        // if ((item[i].h == item[j].h)){
                                        if ((item[i].height == item[j].height)){
                                        
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
                            this.acftStatus = true;
                        }else{
                            this.acftStatus = false;
                            return;
                        }
                        
                    }
                }
                // 验证是否可以进入下一页  
                if (!this.isNextStepDisabledyouke()) {
                    if (this.tabIndex === 3  && this.dixing) {
                        // 总上传进程
                        this.httpAllReq();
                    };
                    if (this.tabIndex < 3 && this.azbStatus && this.acftStatus && this.bzbStatus) {

                        this.tabIndex++;
                    }
                    //进入第二步就上传epsg接口
                    if(this.tabIndex == 1){
                        this.postEpsg();
                    }
                }
            },
            increase4(){
                this.$refs.mastListFormRef.validate(valid => {
                    console.log(valid,"测风塔验证");
                    this.nextDisable4 = !valid;
                    let target = document.querySelectorAll(".is-error")[0];
                    if(this.nextDisable4 && target){
                        target.scrollIntoView();
                    }
                });
                return this.nextDisable4;
            },
            //上传epsg
            postEpsg(){
                console.log(this.epsg_dst ,this.epsg_src,"下一步"); 
                //epsg_dst  //epsg_src
                let cfdData = {};
                cfdData.epsg_src = this.epsg_src;
                cfdData.epsg_dst = this.epsg_dst ? this.epsg_dst : this.epsg_src;
                util.ajax.post('/input_cfd/' + this.projectId, cfdData)
                .then((res) => {
                    // console.log(res);
                    if(res.data.code == 201){
                        console.log("上传epsg源坐标系OK");
                    }
                }).catch((err) => {
                   console.log(err);
                });
            },
            checkTip(){
                if(this.zoneXtip){
                    this.$message.warning("X、Y坐标必须符合源坐标系的范围，请修改后再进行尝试！");  
                }
                else if(this.zoneYtip){
                    this.$message.warning("Y坐标不在机位点的范围内，请修改后再进行尝试！");     
                }
                else if(this.zoneAllTip){
                    this.$message.warning("输入项不符合校验规则，请修改后再进行尝试！");      
                }
            },
            //下一步验证--游客模式
            isNextStepDisabledyouke(){
                // console.log(this.epsg_dst ,"这是epsg_dst的值")
                if (this.tabIndex === 0) {
                    // console.log("第一步");
                    if (this.uploadTabActiveFirst ) {
                        
                        this.$refs.turbineListRef.validate(valid => {
                            console.log(valid,"机位点验证");
                            this.nextDisable1 = !valid;
                            let target = document.querySelectorAll(".is-error")[0];
                            if(this.nextDisable1 && target){
                                target.scrollIntoView();
                            }
                        });
                        if(this.nextDisable1){
                            this.checkTip();
                        }else{
                            this.zoneXtip = false; //验证正确的话，还原状态
                            this.zoneAllTip = false;
                        }
                        return this.nextDisable1;     
                    } 
                    else if(!this.uploadTabActiveFirst ) {
                        
                        this.$refs.chengguoListRef.validate(valid => {
                            console.log(valid,"成果验证");
                            this.nextDisable1 = !valid;
                            let target = document.querySelectorAll(".is-error")[0];
                            if(this.nextDisable1 && target){
                                target.scrollIntoView();
                            }
                        });
                        if(this.nextDisable1){
                            this.checkTip();
                        }else{
                            this.zoneXtip = false; //验证正确的话，还原状态
                            this.zoneAllTip = false;
                        }
                        return this.nextDisable1;
                        
                    }

                    
                }
                if (this.tabIndex === 1 && this.shengyaListYouke.data.length>0) {
                    
                    this.$refs.shengyaListRef.validate((valid,obj) => {
                        console.log(valid,"升压站验证");
                        this.nextDisable2 = !valid;
                    });
                    if(this.nextDisable2){
                        this.checkTip();
                    }else{
                        this.zoneXtip = false; //验证正确的话，还原状态
                        this.zoneAllTip = false;
                    }
                    return this.nextDisable2;
                }
                //jingpingFormRef
                if (this.tabIndex === 2) {
                    this.$refs.jingpingFormRef.validate(valid => {
                        console.log(valid,"经评验证");
                        this.nextDisable3 = !valid;
                    });
                    return this.nextDisable3;
                }
                //mastListFormRef
                // if (this.tabIndex === 3 && this.mastListYouke.data.length>0) {
                if (this.tabIndex === 3 && this.mastList.data.length>0) {
                    
                    this.$refs.mastListFormRef.validate(valid => {
                        console.log(valid,"测风塔验证");
                        this.nextDisable4 = !valid;
                        let target = document.querySelectorAll(".is-error")[0];
                        if(this.nextDisable4 && target){
                            target.scrollIntoView();
                        }
                    });
                    if(this.nextDisable4){
                        this.checkTip();
                    }else{
                        this.zoneXtip = false; //验证正确的话，还原状态
                        this.zoneAllTip = false;
                    }
                    return this.nextDisable4;
                }
            },
            // 删除本行
            delRowYou(index, rows ,type) {
                // console.log(index, rows);
                if (this.uploadLoading) {
                    return;
                }
                if(type == "shengya"){
                    this.shengyaListYouke.data.map((item2,index2)=>{
                        if(index2 == index){
                            item2.longitude = "";
                            item2.latitude = "";
                            item2.elevation = "";
                        }
                    })
                    return;
                }
                rows.splice(index, 1);
                
            },
            //计算接口
            httpcalculate(){
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                util.ajax.post("/calculate/"+this.projectId+"/1" ,{
                    args : "show"
                }, config)
                .then(res=>{
                    if(res.data.code == 200){
                        this.waitingHttp = false;
                        
                        this.uploadSuccess = true;
                        this.getProjects();
                        
                        // this.$message.success("项��数据上传成功！");
                        // this.$emit("projectClicked",{project_id: this.projectId},1,"earth");
                        
                    }else{
                        this.waitingHttp = false;
                        this.$message.error("提交计算："+res.data.message);
                    }
                }).catch((err) => {
                    console.log(err);
                    this.waitingHttp = false;
                    this.$message.error("提交计算："+err);
                });
            },
            //获取项目详情数据
            getProjects(){
                if(!this.projectId){
                    return;
                }
                util.ajax.get('/projects/' + this.projectId).then(res => {
                    if (res.data.code !== 200) {
                        return;
                    }
                    // console.log(res.data.data.status_id);
                    if(res.data.data.status_id == 1){
                        setTimeout(()=>{
                            this.getProjects();
                        },2000)
                    }
                    if(res.data.data.status_id == 2){
                        console.log("计算完成");
                        this.uploadSuccess = false;
                        this.$message.success("项目数据上传成功！");
                        this.$emit("projectClicked",{project_id: this.projectId},1,"earth");
                        
                    }
                    //重新打开
                    if(res.data.data.status_id == 0){
                        this.open(this.projectId);
                        this.$message.error("项目数据初始化失败！");
                    };
                }).catch((err) => {
                    console.log(err);
                    this.uploadSuccess = false;
                });
            },
            //计算失败删除已写表数据
            setRemoveList(){
                util.ajax.delete("/reveal_remove_db/"+ this.projectId +"/1")
                .then(res=>{
                    // console.log(res.data)
                    if(res.data.code != 204){
                        this.$message.error("已上传的数据清空失败，建议重新新建项目！");
                    }
                    
                }).catch((err) => {
                    console.log(err);
                });
            },
            //提交计算再调用
            httpAllReq(){
                this.waitingHttp = true;
                this.httpFive();
                // const p4 = this.httpFour();
                const p4 = this.uploadMastInfo();
                const p1 = this.httpOne();
                const p2 = this.httpTwo();  
               
                const p3 = this.httpThree();
                const p44 = this.httpFourzhonghe();
      
                
                Promise.all([p4 , p1, p2, p3 ,p44 ])
                .then(() => {
                    console.log("开始计算");
                    setTimeout(()=>{
                        this.httpcalculate();
                    },3000)

                    // //判断控制一些功能--进入项目时接口获取判断
                    // this.isOpenBtn();
                }).catch((err) => {
                    this.$message.error('提交计算失败');
                    this.waitingHttp = false;
                    console.error(err);
                });
            },
            //图谱高度选中
            silerClick(item){
                console.log(item);
                this.silerClickActive = item;
                this.uploadHeightObj.name = this.silerClickActive+"m";
                this.uploadHeightObj.open = false;
            },
            //第1步接口
            httpOne(){
              
                if(this.uploadTabActiveFirst){
                    var arr = [];
                   
                    this.turbineListYouke.data.map((item,index)=>{
                        var obj = {
                            turbine_name: item.code,
                            turbine_type: item.type,
                            coordinate_x: item.x,
                            coordinate_y: item.y,
                            height: item.height,
                           
                        }
                        arr.push(obj);
                    })
                    var config = {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: 120000
                    };
                    // console.log(arr);
                    if(arr){
                        return new Promise((resolve, reject) => {
                            util.ajax.post("/reveal_turbine_save/"+this.projectId+"/1",{
                                turbine_info : arr,
                                is_reveal: "1"
                            },config)
                            .then(res=>{
                                // console.log(res)
                               
                                if(res.data.code == 201){
                                    console.log("第1步接口--机位点:"+res.data.message);
                                    resolve(res.data.message)
                                }else{
                                    this.$message.error(res.data.message);
                                    this.waitingHttp = false;
                                    reject(res.data.message)
                                }
                            }).catch((err) => {
                                console.log(err);
                                this.$message.error("上传机位点数据失败");
                                this.waitingHttp = false;
                            });
                        })
                    }

                }else{
                    // console.log(this.chengguoListYouke.data);
                    var arr2 = [];
                    this.chengguoListYouke.data.map((item,index)=>{
                        if(item.elevation){
                            item.elevation = Number(item.elevation).toFixed(3);
                        }
                        if(item.equivalent_hours){
                            item.equivalent_hours = Number(item.equivalent_hours).toFixed(3);
                        }
                        if(item.waked_speed){
                            item.waked_speed = Number(item.waked_speed).toFixed(3);
                        }
                        if(item.at){
                            item.at = Number(item.at).toFixed(3);
                        }
                        if(item.kt){
                            item.kt = Number(item.kt).toFixed(3);
                        }
                        if(item.array_yield){
                            item.array_yield = Number(item.array_yield).toFixed(3);
                        }
                        if(item.free_speed){
                            item.free_speed = Number(item.free_speed).toFixed(3);
                        }
                        if(item.waked_discount){
                            item.waked_discount = Number(item.waked_discount).toFixed(3);
                        }
                        if(item.air_density){
                            item.air_density = Number(item.air_density).toFixed(3);
                        }
                        if(item.representative_wake_added){
                            item.representative_wake_added = Number(item.representative_wake_added).toFixed(3);
                        }
                        if(item.average_shear){
                            item.average_shear = Number(item.average_shear).toFixed(3);
                        }
                        if(item.max_inc){
                            item.max_inc = Number(item.max_inc).toFixed(3);
                        }
                        if(item.max_inclination_sector){
                            item.max_inclination_sector = Number(item.max_inclination_sector).toFixed(3);
                        }
                        if(item.distance_to_nearest_turbine){
                            item.distance_to_nearest_turbine = Number(item.distance_to_nearest_turbine).toFixed(3);
                        }
                        
                        arr2.push(item);
                    })
                    // console.log(arr2);
                    var config = {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: 120000
                    };
                    return new Promise((resolve, reject) => {
                        if(arr2){

                            util.ajax.post("/reveal_pg_save/"+this.projectId+"/1",{
                                pg_info : arr2
                            },config)
                            .then(res=>{
                                // console.log(res)
                                // console.log(res.data.code+"第1步接口--成果:"+res.data.message);
                                if(res.data.code == 201){
                                    console.log("第1步接口--成果:"+res.data.message);
                                    resolve(res.data.message)
                                }else{
                                    this.$message.error("上传发电量成果失败");
                                    this.waitingHttp = false;
                                    reject(res.data.message)
                                }
                            }).catch((err) => {
                                console.log(err);
                                this.waitingHttp = false;
                            });
                        }
                    })
                }
              
            },
            //第2步接口
            httpTwo(){
                // console.log(this.shengyaListYouke.data);
                if(this.shengyaListYouke.data.length>0){
                    for(let i=0;i<=this.shengyaListYouke.data.length-1;i++){
                        this.shengyaListYouke.data[i].longitude = Number(this.shengyaListYouke.data[i].longitude);
                        this.shengyaListYouke.data[i].latitude = Number(this.shengyaListYouke.data[i].latitude);
                        this.shengyaListYouke.data[i].elevation = Number(this.shengyaListYouke.data[i].elevation);
                    }
                    console.log(this.shengyaListYouke.data,"0000");
                    var config = {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: 360000
                    };
                    return new Promise((resolve, reject) => {
                        util.ajax.post("/reveal_station_save/"+this.projectId+"/1",{
                            station_info : this.shengyaListYouke.data
                        },config)
                        .then(res=>{
                            // console.log(res)
                            
                            if(res.data.code == 201){
                                console.log("第2步接口--升压站:"+res.data.message);
                                resolve(res.data.message)
                            }else{
                                console.log(res.data);
                                this.$message.error(res.data.message);
                                this.waitingHttp = false;
                                reject(res.data.message)
                            }
                        }).catch((err) => {
                            console.log(err);
                            this.$message.error("上传升压站数据失败");
                            this.waitingHttp = false;
                        });
                    })

                }
            },
           
            //第3步接口
            httpThree(){
                this.jingpingForm.project_id = this.projectId;
                // console.log(this.jingpingForm)
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 120000
                };
                return new Promise((resolve, reject) => {

                    util.ajax.post("/input_evaluation_show",this.jingpingForm,config)
                    .then(res=>{
                        // console.log(res)
                        
                        if(res.data.code == 200){
                            console.log("第3步接口--经评:"+res.data.message);
                            resolve(res.data.message)
                        }else{
                            this.$message.error("上传经评数据失败");
                            this.waitingHttp = false;
                            reject(res.data.message)
                        }
                    }).catch((err) => {
                        console.log(err);
                        this.$message.error("上传经评数据失败");
                        this.waitingHttp = false;
                    });
                })
            },
            //第4步接口
            httpFourzhonghe(){
                if(this.silerClickActive!=0 && this.uploadZhongheObj.name){
                    return new Promise((resolve, reject) => {
                        util.ajax.post("/input_wrg_file/"+this.projectId,{
                            height: this.silerClickActive
                        })
                        .then((res) => {
                            // console.log(res,"风图谱高度接口");
                            if(res.data.code == 201){
                                console.log("风图谱高度接口："+res.data.message);
                                resolve(res.data.message)
                            }else{
                                this.$message.error("上传风图谱高度失败");
                                this.waitingHttp = false;
                                reject(res.data.message)
                            }
                            
                        })
                        .catch((err) => {
                            console.log(err);
                            this.$message.error("上传风图谱高度失败");
                            this.waitingHttp = false;
                        
                        });
                    })
                }
                else if(this.silerClickActive==0 && this.uploadZhongheObj.name){
                    return new Promise((resolve, reject) => {
                        util.ajax.post("/input_wrg_file/"+this.projectId,{
                            height: 90
                        })
                        .then((res) => {
                            console.log(res,"风图谱高度接口");
                            if(res.data.code == 201){

                                resolve(res.data.message)
                            }else{
                                this.$message.error("上传风图谱高度失败");
                                this.waitingHttp = false;
                                reject(res.data.message)
                            }
                            
                        })
                        .catch((err) => {
                            console.log(err);
                            this.$message.error("上传风图谱高度失败");
                            this.waitingHttp = false;
                        
                        });
                    })
                }
            },
            //第4步接口 上传测风塔数据 
            uploadMastInfo() {
                const opData = this.mastDataChange;
                this.mastUploading = true;
                const p = opData.map((item) => {
                    console.log(item);
                    let formData = new FormData();
                    formData.append('mast_name', item.data.code);
                    formData.append('coordinate_x', item.data.x);
                    formData.append('coordinate_y', item.data.y);
                    formData.append('height', item.data.height);
                    // 
                    if (item.data.file) {
                        formData.append('mast_file', item.data.file, item.data.file.name);
                    }
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    };
                    if (item.op === 'insert') {
                        return util.ajax.post('input_mast/' + this.projectId, formData, config).then(res => {
                            if (res.data.code !== 201) {
                                throw res.data.message;
                            }
                            console.log('input_mast_post--- ok');
                        });
                    } else if (item.op === 'update') {
                        // return util.ajax.put('input_mast/' + this.projectId + '/' + item.data.id, formData, config).then(res => {
                        return util.ajax.post('mast_alter/'  + this.projectId + '/' + item.data.id, formData, config).then(res => {
                            if (res.data.code !== 201) {
                                throw res.data.message;
                            }
                            console.log('input_mast_put--- ok');
                        });
                    } else {
                        return util.ajax.delete('input_mast/' + this.projectId + '/' + item.data.mast_id).then(res => {
                            if (res.data.code !== 204) {
                                throw res.data.message;
                            }
                            console.log('input_mast_del--- ok');
                        });
                    }
                });
                return Promise.all([...p]).then(() => {
                    console.log('测风塔接口all--- ok');
                    return this.loadMastInfo().then(() => {
                        console.log('input_get--- ok');
                        this.mastUploading = false;
                    });
                }).catch((err) => {
                    this.mastUploading = false;
                    throw err;
                });
            },
            httpFour(){
                
                // if(this.mastListYouke.data.length>0){
                //     const opData = this.mastListYouke.data;
                //     const p = opData.map((item,index)=>{
                //         console.log(item);
                //         let formData = new FormData();
                //         formData.append('mast_name', item.name);    //字段改了mast_name，coordinate_x，height
                //         formData.append('coordinate_x', item.x);
                //         formData.append('coordinate_y', item.y);
                //         formData.append('height', item.h);
                //         // formData.append('is_reveal', "1");  //游客模式
                //         if (item.file) {
                //             formData.append('mast_file', item.file, item.file.name);
                //         }
                //         const config = {
                //             headers: {
                //                 'Content-Type': 'multipart/form-data'
                //             },
                //             timeout: 120000
                //         };
                        
                //         return util.ajax.post('/input_mast/' + this.projectId, formData, config)
                //             .then(res=>{
                //                 console.log(res,"第四步测风塔接口");
                //                 if(res.data.code == 201){

                //                     console.log("第4步测风塔接口"+ res.data.message );
                //                 }else{
                //                     this.$message.error("上传测风塔数据失败");
                //                     this.waitingHttp = false;
                //                     throw res.data.message;
                //                 }
                //             }).catch((err) => {
                //                 console.log(err);
                //                 this.$message.error("上传测风塔数据失败");
                //                 this.waitingHttp = false;
                //             });
                //     })
                //     return Promise.all([...p]).then(() => {
                //         console.log("测风塔全部上传完成");
                        
                //     }).catch((err) => {
                //         this.$message.error("上传测风塔数据失败");
                //         this.waitingHttp = false;
                //         throw err;
                //     });
                // }
              
            },
            //源坐标系上传
            httpFive(){
                
                console.log(this.epsg_dst +"目标epsg源"+ this.epsg_src);
                var cfdData = {};
                cfdData.epsg_src = this.epsg_src;
                cfdData.epsg_dst = this.epsg_dst ? this.epsg_dst : this.epsg_src;
                util.ajax.post('/input_cfd/' + this.projectId, cfdData)
                .then((res) => {
                    // console.log(res,"源坐标系接口");
                    if(res.data.code == 201){

                        console.log("源坐标系接口:"+res.data.message);
                    }else{
                        this.$message.error("上传源坐标系失败");
                        this.waitingHttp = false;
                        
                    }
                }).catch((err) => {
                    console.log(err);
                    this.$message.error("上传源坐标系失败");
                    this.waitingHttp = false;
                });
                
            },
            //控制一些游客功能
            isOpenBtn(){
                //可选模块：
                // 不上传风图谱，则隐藏综合风图谱按钮
                if(!this.uploadZhongheObj.name){
                    this.$store.commit("noneZhonehe",true);
                }
                // 不填写测风信息，则没有方案名称 和 右侧测风信息模块（开关按钮
                if(!this.uploadMastlistObj.name){
                    this.$store.commit("noneMastlist",true);
                }
                //不选择上传“发电量成果”，则方案概览中只显示名称、等效小时数；且 点击单个风机不显示发电量成果窗口；
                //排布方案：
                //上传了发电量成果，则显示所有列
                //上传点位，则只显示点位及机型列
                //机位点
                if(this.uploadJiweidianObj.name && this.uploadTabActiveFirst){
                    this.$store.commit("noneJiweidian",true);
                }
                //成果
                if(this.uploadChengguoObj.name && !this.uploadTabActiveFirst){
                    this.$store.commit("noneChengguo",true);
                }
            },
            initCommit(){
                this.$store.commit("noneZhonehe",false);
                this.$store.commit("noneMastlist",false);
                this.$store.commit("noneJiweidian",false);
                this.$store.commit("noneChengguo",false);
            },

            leftClick(){
                if(this.leftX >= 0){
                    this.leftX = 0;
                }else{
                    this.leftX += 120;
                }
            },
            rightClick(){
                if(this.leftX <= (0-465)){
                    this.leftX = (0-465);
                }else{
                    this.leftX -= 120;
                }
            },
            //游客模式-- 复制新一行测风塔数据增加测风塔高度
            addRowYou(index, rows , obj){

                if(obj.code != "" && obj.x != "" && obj.y != ""){
                
                    if (this.uploadLoading) {
                        return;
                    }
                    rows.splice(index + 1, 0, {
                        id: null,
                        name: rows[index].name,
                        x: rows[index].x,
                        y: rows[index].y,
                        h: '',
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
            // 复制新一行测风塔数据增加测风塔高度
            addRow(index, rows , obj) {
                // console.log(index,rows,obj)
               
                if(obj.code != "" && obj.x != "" && obj.y != "" ){
                
                    if (this.uploadLoading) {
                        return;
                    }
                    if(!this.increase4()){
                        
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
                    }
 
                }else{
                    this.$message({
                        message:"此行数据内容不能为空"
                    })
                }
            },
            //游客模式以上===============================================================//
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
            
           //当某个单元格被点击时会触发该事件
            handleHover(row, column, cell, event) {
                // console.log(row, column, cell, event);
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
                // console.log(this.zoneX*10000+10000);
                // console.log(this.zoneX*10000);
                if (value === '') { 
                    this.zoneAllTip = true;
                    callback(new Error('X为6位正数，允许输入到小数点后四位'));
                } else if (!/^[\d]{6}(\.\d{1,4})?$/.test(value)) {  
                    this.zoneAllTip = true;                   
                    callback(new Error('X为8位正���，允许输入到小数点后四位'));
                }
                else if(value >= this.zoneX*10000+10000 || value < this.zoneX*10000){
                    this.zoneXtip = true;
                    callback(new Error('与源坐标不符'));
                }
                else {
                   
                    callback();
                }
            },
            // 其他投影坐标X
            validateCoordinateX(rule, value, callback) {
                // console.log(this.zoneX*1000000+1000000);
                // console.log(this.zoneX*1000000);
                if (value === '') { 
                    this.zoneAllTip = true;
                    callback(new Error('X为8位正数，允许输入到小数点后四位'));
                } else if (!/^[\d]{8}(\.\d{1,4})?$/.test(value)) {   
                    this.zoneAllTip = true;                  
                    callback(new Error('X为8位正数，允许输入到小数点后四位'));
                } 
                else if(value > this.zoneX*1000000+1000000 || value < this.zoneX*1000000){
                    this.zoneXtip = true;
                    callback(new Error('与源坐标不符'));
                }
                else {
                   
                    callback();
                }
            },
            // 其他投影坐标Y
            validateCoordinateY(rule, value, callback) {
                if (value === '') {
                    this.zoneAllTip = true;
                    callback(new Error('X为7位正数，允许输入到小数点后两四位'));
                } else if (!/^[\d]{7}(\.\d{1,4})?$/.test(value)) {
                    this.zoneAllTip = true;
                    callback(new Error('X为7位正数，允许输入到小数点后四位'));
                } 
                //游客升压站专业验证，加epsg //zoneY
                else if (this.uploadTabActiveFirst && this.shengyaListYouke.data && this.tabIndex == 1) {
                    this.zoneY = this.turbineListYouke.data[0].y;
                    if( parseInt(value/100000) != parseInt(this.zoneY/100000) ){
                        this.zoneYtip = true;
                        callback(new Error("不符合"));
                    }else{
                       
                        callback();
                    }
                } 
                else if (!this.uploadTabActiveFirst && this.shengyaListYouke.data && this.tabIndex == 1) {
                    this.zoneY = this.chengguoListYouke.data[0].coordinate_y;
                    if( parseInt(value/100000) != parseInt(this.zoneY/100000) ){
                        this.zoneYtip = true;
                        callback(new Error("不符合"));
                    }else{
                        
                        callback();
                    }
                } 
                else {
                    
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
                            for (let i = 0; i < this.turbineList.data.length; i++) {
                                this.turbineList.data.splice(i, 1, {
                                    code: this.turbineList.data[i].code,
                                    type: this.turbineList.data[i].type,
                                    x: this.turbineList.data[i].x,
                                    y: this.turbineList.data[i].y,
                                    turbine_id: this.turbineList.data[i].turbine_id,
                                    height: this.turbineList.data[i].height,
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
                            }
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
                // console.log(value, row, index)
            },
            closeYouke(){
                this.dialogVisible = false;
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

                //清空数据
                this.selectedTurbineIds = [];
                this.selectedChengguoIds = [];
                this.isCanClick = true;
                this.isCanClick2 = true;
            },
            simulationChange(isTrue){
               
                this.simulationMode = isTrue;
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
                this.uploadDixingObj.active = false;
                this.uploadTerrainName = null;
                this.uploadTerrainBox = true;
                this.dixing = false;
            },
            // 地形文件上传完成
            uploadTerrainCompletedHandle(file) {
                this.uploadTerrainBox = false;  //上传文字显示
                var fileSize = file.size;
                if(fileSize<=0) {
                    this.$message.error('附件大小不能为0kb!');
                    return false;
                    
                }else {
                    this.dixing = true;
                    this.uploadDixingObj.name = file.name;
                    this.uploadDixingObj.active = true;
                    this.uploadTerrainName = file.name;
                    this.$refs['progressBar'].closePorgressBar();
                }
            },
            //文件上传仍有问题,且有报错
            uploadErrHandle() {
                this.uploadTerrainBox = false;  //使上传按钮文字显示
                this.dixing = true;
            },
            onCloseProgressBar () {
                this.$refs['progressBar'].closePorgressBar();
            },
            //资料不全0
            opentwo(projectId){
                // console.log(projectId);
                this.projectId = projectId;
                this.dialogVisible = true;
                this.init();        
                this.uploadSuccess = true;
            },
            //计算中1
            open(projectId) {
                this.projectId = projectId;
                this.dialogVisible = true;
                this.init();
                this.uploadSuccess = false;
            },
            loadingGetList(){
                 this.$nextTick(() => {
                    this.loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    let promiseArr = [];

                    let p1 = this.getTurbineList(); //查询机位点
                    let p2 = this.getShengyaList();  //升压站
                    let p3 = this.getjingping();     //金萍
                    // let p4 = this.getMastList();     //测风塔
                    let p4 = this.loadMastInfo();     //测风塔
                    promiseArr = [p1, p2, p3 ,p4];
                    Promise.all( promiseArr ).then(() => {
                        this.loading.close();
                    }).catch(() => {
                        this.loading.close();
                    });
                });
                
            },
            getIsJiwei(){
                //上传了机位点  or  成果
                util.ajax.get("/reveal_deploy/"+this.projectId)
                .then((res)=>{
                    // console.log(res,"上传了机位点  or  成果");
                    if(res.data.code != 200){
                        this.$message.error("获取检测第一步上传的数据文件类型失败！");
                        return;
                    }
                    
                    if(res.data.data.turbine_from == "turbine"){
                        this.isTurbine = true;
                        console.log("游客模式：选择上传了--机位点");
                    }
                    if(res.data.data.turbine_from == "pg"){
                        this.isTurbine = false;
                        console.log("游客模式：选择上传了--成果发电量");
                    }
                })
            },
            getjingping(){
                return util.ajax.get("/input_evaluation_show?project_id="+ this.projectId )
                .then(res=>{
                    // console.log(res)
                    if(res.data.code !=200 ){
                        return;
                    }
                    let dataFrom = res.data.data;
                    this.jingpingForm = {
                        equivalent_hours: dataFrom.equivalent_hours,
                        total_invested: dataFrom.total_invested,
                        vat_cit: dataFrom.vat_cit,
                        pt: dataFrom.pt,
                        n_p_v: dataFrom.n_p_v,
                        cost_per_kilowatt: dataFrom.cost_per_kilowatt
                    }
                   
                }).catch((err) => {
                    console.log(err);
                    this.$message.error('获取经评数据失败！');
                });
            },
            getTurbineList(){
                this.getIsJiwei();
                setTimeout(()=>{
                    this.turbineListYouke.data = [];
                    this.chengguoListYouke.data = [];
                    return util.ajax.get('/reveal_turbine_get/' + this.projectId + '/1').then((res) => {
                        if (res.data.code !== 200) {
                            return;
                        }
                        if (res.data.data.length<=0 ) {
                            return;
                        }
                        let datalist = res.data.data;
                        console.log(datalist);
                        if( !this.isTurbine ){
                            //发电量
                            this.uploadTabActiveFirst = false;
                            this.chengguoListYouke.data = res.data.data;
                            this.uploadChengguoObj = {
                                active: true,
                                open: true,
                                name : "read_pg_excel"
                            }
                        }else{
                            //机位点
                            this.uploadTabActiveFirst = true;
                            this.getTurbineListYouke(res.data.data , "input_turbine" );
                        }
                    }).catch((err)=>{
                        console.log(err);
                        this.$message.error('获取机位点数据失败！');
                    })
                },1200)
            },
            getShengyaList(){
                this.shengyaListYouke.data = [];
                return util.ajax.get('/reveal_station_get/'+ this.projectId +"/1").then((res) => {
                    if (res.data.code !== 200 ) {
                        return;
                    }
                    if (res.data.data.length<=0 ) {
                        return;
                    }
                    // console.log(res);
                    this.shengyaListYouke.data = res.data.data;
                    this.uploadShengyaObj = {
                        active: true,
                        open: true,
                        name: "input_station"
                    }
                }).catch((err)=>{
                    console.log(err);
                    this.$message.error('获取升压站数据失败！');
                })
            },
            getMastList(){
                this.mastListYouke.data = [];
                return util.ajax.get('/input_mast/' + this.projectId).then((res) => {
                    if (res.data.code !== 200) {
                        return;
                    }
                    if (res.data.data.length<=0 ) {
                        return;
                    }
                    console.log(res);
               
                    this.getMastListYouke( res.data.data , "input_mast")
                    
                }).catch((err)=>{
                    console.log(err);
                    this.$message.error('获取测风塔数据失败！');
                })
            },
            loadMastInfo() {
               
                return util.ajax.get('/input_mast/' + this.projectId).then((res) => {
                    console.log(res,"getMast");
                    if (res.data.code !== 200) {
                        this.mastList.data = [];
                        this.uploadMastlistObj={
                            active:false,
                            open:false,
                            name: ""
                        }
                        this.prevUploadInfo.mastInfo = [];
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
                                filename: item.filename
                            });
                        });
                        if(this.mastList.data.length>0){
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
                        
                        //展开
                        this.uploadMastlistObj = {
                            active: true,
                            open: true,
                            name : "input_mast.txt"
                        }
                        
                    }
                }).catch(() => {
                    this.$message.error('获取测风塔信息失败！');
                });
            },
            //查询道路
            loadDaolu(){
                util.ajax.get("/reveal_road_check/"+  this.projectId +"/1")
                .then(res => {
                //    console.log(res,"查询道路");
                    if(res.data.code == 200){
                        this.uploadDaoluObj={
                            active:true,
                            name: res.data.data.filename
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            },
            //查询线路-返回1存在 返回0 不存在
            loadXianlu(){
                util.JdxlUrl.get("/queryscheme" , {
                    params:{
                        project_id : this.projectId,
                        scheme_id : 1
                    }
                })
                .then(res => {
                    // console.log(res,"查询线路");
                    if(res.data.code == 1){
                        this.uploadXianluObj={
                            active:true,
                            name: "circuit.zip"
                        }
                        this.xianluZip = true;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
                //dxf线路查询
                util.ajax.get("/reveal_line_convert/"+ this.projectId +"/1")
                .then((res)=>{
                    // console.log(res,"查询线路");
                    if(res.data.code == 200){
                        this.uploadXianluObj={
                            active: true,
                            name: "circuit.dxf"
                        }
                        this.xianluZip = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            init() {
                this.prevUploadInfo = this.defaultPrevUploadInfo();
                if ( this.$refs.folderTableRef ) {
                    this.$refs.folderTableRef.init();
                }
                this.zoneX = 0;
                this.zoneY = 0;
                //清空游客模式数据
                this.clearInitYouke();
                //查询道路
                this.loadDaolu();
                //查询线路
                this.loadXianlu();
                //查询地形
                this.loadTerrainFile();
                //查询表格数据
                this.loadingGetList();
                

                this.tabIndex = 0;
                
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
                
                // 初始化源坐标系
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
                    this.loadEpsg();  //查询显示源坐标系
                    
                })
                .catch(err => console.error(err));
               
            },
            // 获取已经上传的目标坐标系和源坐标系数值
            loadEpsg() {
                util.ajax.get('/project_epsg/' + this.projectId)
                    .then(res => {

                        // console.log(res,"end")
                        if (res.data.code === 404) {
                            return ;
                        };
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
                                            if(this.epsg_id[2]){
                                                let arr = [ ...this.epsg_id[2] ];
                                                let str = arr[2].split("（")[0].split(" ")[1];
                                                this.zoneX = str;
                                                // console.log(this.zoneX);   
                                            }
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
                console.log(val,"yuan")
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
                // console.log(value,"源坐标数据");
                //截取标志，再转坐标来做验证X
                if(value[2]){
                    let arr = [...value];
                    let str = arr[2].split("（")[0].split(" ")[1];
                    this.zoneX = str;
                    // console.log(this.zoneX);   
                }
                //
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
                this.mastList.data = [];
            },
            // 处理目标坐标系选择事件
            onTargetChange(value) {
                // console.log(value,"yuan3")
                //截取标志，再转坐标来做验证
                if(value[2]){
                    let arr = [...value];
                    let str = arr[2].split("（")[0].split(" ")[1];
                    this.zoneX = str;
                    // console.log(this.zoneX);   
                }
                //
                
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
                            this.uploadDixingObj.name = res.data.data.filename;
                            this.uploadDixingObj.active = true;
                        }
                    })
                    .catch(err => {
                        console.log(err);
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
                    const p3 = this.loadTurbineInfo();  //获取线上机位点数据
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
            
            // 获取线上的机位点数据
            loadTurbineInfo() {
                // this.turbineList.data = [];
                this.turbineListYouke.data.splice(0, 1, {
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
                        
                        return;
                    }
                    // console.log(res);
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
                        this.turbineListYouke.data = [];
                        res.data.data.forEach((item) => {
                            this.loadTurbineTypeList(item.turbine_type, (list) => {
                                this.turbineListYouke.data.push({
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

                    this.turbineListYouke.data.sort(function(a, b) {
                            return parseInt(a.code) - parseInt(b.code) || a.code.toUpperCase() - b.code.toUpperCase() ;
                        });
                }).catch(() => {
                    this.$message.error('获取风机信息失败！');
                });
            },
            // 获取指定风机的工具��线文件列表
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
   /deep/ .el-form--inline .el-form-item{
       margin-right: 0 !important;
   }
    .myHidden{
        opacity: 0 !important;
    }
    .uploadTerrainNameBox {
        width:230px;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        
    }
    .uploadTerrainBox {
        display: none;
    }
    .content4 ,.content5{
        /* max-height: 300px; */
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


    /* 游客 */
    .uploadBoxActive{
        background:rgba(51,200,111,0.3);
        border:1px solid rgba(51,200,111,1) !important;
    }
    .jiweidianUpload{
        position: absolute;
        z-index: -11;
        opacity: 0;
    }
    .contentyouke1{
        height: 0 !important;
        transition: all 0.5s;
        overflow: hidden;
    }
    .contentyouke1Height{
        height: 260px !important;
        transition: all 0.5s;
        overflow: hidden;
    }
    .contentyouke2Height{
        height: 275px !important;
        transition: all 0.5s;
        overflow: hidden;
    }
    /deep/ .el-table tr th{
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }
    .contentyouke3Height{
        height: 225px !important;
        transition: all 0.5s;
        overflow: hidden;
    }
    .contentyouke3Height .upload-form{
        position: relative;
        left: 6px;
    }
    .contentyouke22Height{
        height: 250px !important;
        transition: all 0.5s;
        overflow: hidden;
    }
    .youiconBox{
        width: 100%;
        height:25px;
        text-align:right;
    }
    .youiconBox4{
        position: absolute;
        right:0;
        top:5px;
    }
    .zhedie{
        z-index: 1111;
        position: absolute;
        right: 0;
        top: -5px;
        font-size: 9px;
        height: 40px;
        width: 25px;
        line-height: 40px;
        cursor: pointer;
    }
    .rightTipBox{
        position: absolute;
        z-index: 11111;
        right: -58px;
        top: 0px;
        width: 60px;
        height:34px;
        line-height:34px;
        // display: none;
    }
    .uploadHover:hover .rightTipBox{
        // display: block;
    }
    .cuowuIcon{
        position: absolute;
        left: 50%;
        top: 5px;
        width:20px;
        height: 20px;
        line-height: 20px;
        color: #fff;
        z-index: 111111;
        margin-left: -5px;
    }
   
    /deep/ .el-table__body-wrapper{
        border-left: 1px solid rgba(159, 164, 162, 0.5);
        border-right: 1px solid rgba(159, 164, 162, 0.5);
        box-sizing: border-box;
        max-height: 106px !important;
    }
    .chenguoBox /deep/ .el-table__body-wrapper{
        max-height: 165px !important;
    }
    .chenguoBox /deep/ .el-table__empty-block{
        text-align: left !important;
    }
    .chenguoBox /deep/ .el-table__empty-text{
        padding-left: 15.5% !important;
    }
    /* .jidianBox  /deep/ .el-table__header .el-table-column--selection .cell{
        position:relative;
        top: 4px;
    } */
    
    .contentyouke1Height /deep/ .el-table__body-wrapper{
        max-height: 160px !important;
    }
    .content2footer /deep/ .el-table__body-wrapper{
        max-height: 160px !important;
    }
    .content2footer /deep/ .el-table__body{
        left: -0.5px;
        position: relative;
    }
    .content3footer /deep/ .el-table__body-wrapper{
        max-height: 120px !important;
    }
    .content3footer /deep/ .el-form-item__label{
        padding-right: 0 !important;
        width: 85px !important;
        position:relative;
        top:-4px;
        text-align: left;
    }
    .content3footer{
        position:relative;
    }
    .content2{
        color:rgba(212,239,246,0.7);
       
        .content2header{
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .uploadbtnBox{
            width:244px;
            height:30px;
            border-radius:4px;
            line-height:30px;
            text-align: center;
            border:1px dashed rgba(212,239,246,0.7);
            cursor: pointer;    
            margin-bottom: 10px;
            position: relative;
        }
        .uploadbtnBox:hover{
            border:1px dashed rgba(212,239,246,1);
        }
    }
    .upload-button-you:hover:hover .uploadbtnBox{
        border:1px dashed rgba(212,239,246,1);
    }
    .content2footer{
        width: 474px !important;
        margin: 0 auto;
    }

   
    .content3left{
        position: relative;
        left: -25px;
        margin-bottom: 40px !important;
    }
    .content4scroll{
        overflow-y: inherit;
    }
    .content2form /deep/ .el-form-item__content{
        margin-left: 135px !important;
    }
    .content2form /deep/ .el-form-item__label{
        width: 132px !important;
        padding: 0 !important;
    }
    /deep/ .el-form-item{
        position: relative;
    }
    .overUlBox{
        width: 210px;
        overflow: hidden;
        margin-right: 22px;
        border:1px solid rgba(212,239,246,0.3);
        border-left:none;
        border-right:none;
        background:rgba(3,32,62,0.6);
        .ulBox{
            margin: 0;
            padding: 0;
            font-size: 14px;
            width: 670px;
            position: relative; 
            display: flex;
            &>li{   
                cursor: pointer;
                width:40px;        
                height:22px;
                line-height: 22px;
                text-align:center;
            }
           
            &>li:hover{
                background:rgba(0,0,0,1);
                color:#33C86F;
                font-weight:400;
            }
        }
    }
    .slierBox{
        
        margin: 0 0 10px 0;
        position: relative; 
        .left:hover,.right:hover{
            background:rgba(0,0,0,1);
            color:rgba(211,219,228,1);
            font-weight:500;
        }
        .left,.right,.danwei{
            height:22px;
            line-height: 22px;
            text-align:center;
            display: inline-block;
            width:22px;
            position: absolute;
            z-index:11;
            background:rgba(3,32,62,0.6);
            border:1px solid rgba(212,239,246,0.3);
        }
        .danwei{
            top:0;
            right:0;
            border-left:none;
        }
        .left{
            top:0;
            left:-22px;
            cursor: pointer;
            border-radius:2px 0 0 2px; 
        }
        .right{
            top:0;
            right:-22px;
            cursor: pointer;         
            border-radius:2px 0 0 2px;
        }
        .danwei>span{
            display: inline-block;
            height:10px;
            border-left:1px solid rgba(212,239,246,0.3);
            margin-right:3px;
        }

        .bgActive{
            background:rgba(0,0,0,1);
            color:#33C86F;
            font-weight:500;
        }
    }

    .header-tip .tooltip{
        position: absolute;
        top: 120px;
        right: 27px;
        border-radius: 10px;
        width: 720px;
        padding: 10px 20px;
        color: #33C86F;
        line-height: 20px;
        text-align: justify;
        background: rgba(0, 24, 49, 1);
        border: 1px dashed rgba(212,239,246,0.5);
        opacity: 1;
        z-index: 2003;
        .tooltip-arrow{
            position: absolute;
            bottom: -10px;
            right: 245px;
            width: 20px;
            height: 10px;
            overflow: hidden;
            transform: rotate(180deg);
            .arrow-up{
                width: 17px;
                height: 17px;
                background: #001831;
                border: 1px dashed rgba(212,239,246,0.5);
                transform: rotate(45deg) scale(0.8, 0.8);
                display: inline-block;
            }
            .arrow-down{
                width: 17px;
                height: 17px;
                background: #001831;
                border: 1px solid rgba(212,239,246,0.5);
                transform: rotate(45deg) scale(0.8, 0.8);
                display: inline-block;
            }
        }
    }
    .header-tip .tooltip11{
        top: 140px;
    }
    .header-tip .tooltip2{
        top: 128px;
        .tooltip-arrow{
            right: 242px;
        }
    }
    .header-tip .tooltip2a{
        top: 43px;
        .tooltip-arrow{
            right: 242px;
        }
    }
    .header-tip .tooltip2b{
        top: 88px;
        .tooltip-arrow{
            right: 242px;
        }
    }
    .header-tip .tooltip3{
        top: 150px;
    }
    .header-tip .tooltip3a{
        top: 86px;
    }
    .focus_index{
        border: 1px solid #ccc !important;
        border-radius: 4px ;
    }

    .unit{
        width: 60px;
        position: absolute;
        right: -115px;
        top: 0;
    }   
    .borderRed{
        border: 1px solid red !important;
    }
    .add-btn{
        position: relative;
    }
    .add-btn>span{
        position: absolute;
        display: inline-block;
        height: 12px;
    }
    .add-btn>span:nth-of-type(1){
        left:0px;
        top:-12px;
        border-left: 1px solid rgba(159, 164, 162, 0.5);
    }
    .add-btn>span:nth-of-type(2){
        right:0px;
        top:-12px;
        border-right: 1px solid rgba(159, 164, 162, 0.5);
    }
    .tit{
        margin: 0 auto;
        color: #fff;
        font-size:20px;
    }
    .parameterBox /deep/ .el-dialog{
        height: 650px !important;
    }
    .upload-tab-you{
        width: 290px !important;
        left: -7px !important;
        margin: 0 auto 15px auto !important;
    }
    .original-form-inline2{
        margin: 0 auto 5px auto !important;
    }
    .uploadbtnBox{
        width: 280px !important;
    }
    .uploadTerrainNameBox{
        width: 260px !important;
    }
    .upload-button{
        width: 280px !important;
        margin: 0  auto !important;
    }
    .upload-button-tab1{
        width: 283px !important;
        position: relative !important;
        left: -6px !important;
    }
    .steps{
        margin: 20px 210px 0 210px !important;
    }
    .jidianBox /deep/ .gf-table.el-table .cell, .jidianBox /deep/ .gf-table.el-table th div{
        padding-right: 0px !important;
    }
    /deep/ .el-table-column--selection .el-checkbox__original{
        opacity: 0 !important;
    }
    .iconright{
        padding-left: 10px !important; 
    }
    .jidianBox /deep/ .gf-table.el-table td:nth-of-type(1) .cell input ,.jidianBox /deep/ .gf-table.el-table th:nth-of-type(1) .cell input{
        height: 15px !important;
    }
    .chenguoBox /deep/ .gf-table.el-table td:nth-of-type(1) .cell input ,.chenguoBox /deep/ .gf-table.el-table th:nth-of-type(1) .cell input{
        height: 15px !important;
    }
    .iconBoxHeader{
        height: 25px;
        width: 60px;
        background:rgba(3,32,62,1);
        text-align: center;
        padding: 5px 0 0 0 ;
        position: absolute;
        right: 0;
        top:10px;
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
    .content3footer /deep/ .el-input__suffix{
        display: none !important;
    }


    .demo-ruleForm /deep/ .el-input__inner{
        border: 1px solid rgba(212, 239, 246, 0.8) !important;
        padding-left: 10px !important;
        text-align: left !important;
    }
    .btnBox {
        text-align: center;
        margin-top: 20px;
    }
    .parameterBox /deep/ .changeDialog{
        height: 320px !important;
    }
    .parameterBox /deep/ .changeDialog .el-dialog__body{
        margin-top: 10px !important;
        background: #03203e !important;
    }
    /deep/ table th.must div:before {
        content: '*';
        color: #ff1818;
    }
</style>