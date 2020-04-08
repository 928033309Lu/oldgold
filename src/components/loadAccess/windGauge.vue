<template>
    <div :class="readonlyMode?'wind_gauge wind_gauge_readonly':'wind_gauge'" :style="maxViewMode?'height:290px;':'height:0px'">

        <!-- <div class="gauge_header" :style="maxViewMode?'':'position: absolute;right: 90px;bottom: 10px;'"> -->
            <!-- <div style="cursor: pointer;" >
                <el-tooltip class="item" effect="light" content="关闭更换机型提示" placement="top" popper-class="custom-tooltip wind-gauge-tooltip">
                    <icon name="genghuanfengjitishi"/>
                </el-tooltip>
            </div> -->
             <!-- <div style="cursor: pointer;" >
                <a target="_blank" v-bind:href="downLoadTable">
                    <el-tooltip class="item" effect="light" content="导出到Excel" placement="top" popper-class="custom-tooltip wind-gauge-tooltip">
                        <icon name="daochu"/>
                    </el-tooltip>
                </a>
            </div> -->           
            <!-- <div style="cursor: pointer;" v-if="!editMode" @click="youhuaClick" >
                <el-tooltip class="item" effect="light" content="手动优化" placement="top" popper-class="custom-tooltip wind-gauge-tooltip">
                    <icon name="shoudonghuanjie"/>
                </el-tooltip>
            </div>
             <div style="cursor: pointer;" @click="maxViewMode=!maxViewMode" >
                <el-tooltip class="item" effect="light" :content="maxViewMode?'隐藏风参表':'显示风参表'" placement="top" popper-class="custom-tooltip wind-gauge-tooltip">
                    <icon v-if="maxViewMode" name="minview"/>
                    <icon v-else name="maxview"/>
                </el-tooltip>
            </div>
            <div style="cursor: pointer;"  @click="close">
                <el-tooltip class="item" effect="light" content="退出排布方案" placement="top" popper-class="custom-tooltip wind-gauge-tooltip">
                    <icon name="guanbi"/>
                </el-tooltip>
            </div> -->
        <!-- </div> -->
        <!-- <div class="sanjiao"  v-show="maxViewMode"></div> -->
         <distribute-bar  ref="distributeBar" class="gauge_header" :enableRemove="selectedTurbineIds.length!==0" @addCustomLabel="addCustomLabel" @daoruXlxs="daoruXlxs" @editModeChange="editModeChange"  @viewChange="viewChange" @close="close" @changeType="changeType" @delSelectedRows="delSelectedRows"></distribute-bar>
        <div class="gauge_table" v-show="maxViewMode">
            <!--<el-form :model="turbineList" ref="turbineListRef" >-->
                <el-table v-if="!enManager" ref="turbindTable" :highlight-current-row="true" class="table"  :row-class-name="tableRowClassName" :data="tableData" @row-click="rowClick"  @selection-change="handleSelectionChange">
                    <el-table-column v-show="!readonlyMode" type="selection" :width="!readonlyMode?'50':'10'" >
                    </el-table-column>
                    <el-table-column width="70" :label="'风机数量|(' + tableData.length + '台)'" :render-header="renderHeader" header-align="center" align="center">
                        <template slot-scope="scope">{{scope.$index + 1}}</template>
                    </el-table-column>
                    <el-table-column prop="turbine_name" label="风机编号" header-align="center" align="center"/>
                    <el-table-column min-width="100" prop="coordinate_x" label="X" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span>{{Number(scope.row.coordinate_x).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100" prop="coordinate_y" label="Y" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span>{{Number(scope.row.coordinate_y).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="80" prop="elevation" label="海拔(m)" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.elevation">{{Number(scope.row.elevation).toFixed(2)}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="readonlyMode?120:150"  label="机型" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="readonlyMode">{{scope.row.turbine_type}}</span>
                            <el-select v-else v-model="scope.row.turbine_type" 
                            @visible-change="((value)=>{visibleChange( value, scope.row)})"
                            @change="onChange(scope.row, scope.row.turbine_type, scope.$index)" popper-class="gf-popper" placeholder="请选择机型" style="width:100%;">
                                <el-option v-for="item in turbinesList"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="!readonlyMode" min-width="275" label="功率曲线" header-align="center" align="center">
                        <template slot-scope="scope" >
                            <el-cascader
                                    placeholder="请选择功率曲线"
                                    style="width:230px;line-height: 23px;float: left"
                                    :options="scope.row.input_power_curve_list"
                                    v-model="powerCurveList[scope.$index]"
                                    :show-all-levels="false"
                                    popper-class="gf-popper"
                                    @change="((value)=>{onChangePower(value, scope.row, scope.$index)})">
                            </el-cascader>
                            <div v-if="((powerCurveList.length > 0)&&(powerCurveList[scope.$index][1]==='')||(powerCurveList[scope.$index][1]===null))" style="z-index: 3004;width: 18px;height:18px;display: inline-block;float: right">
                                <icon name="jingshi" style="color: #FF4967;z-index: 3004"></icon>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="readonlyMode?80:140" label="轮毂高度|(m)" :render-header="renderHeader" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="readonlyMode">{{scope.row.height}}</span>
                            <el-select v-else v-model="scope.row.height" @visible-change="focusHeight(scope.row)" @change="onChangeGao(scope.row, scope.row.height)" popper-class="gf-popper" placeholder="请选择轮毂高度" style="width:100px;float: left">
                                <el-option v-for="item in wrgHeightsList"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                            <div v-if="(scope.row.height==='')||(scope.row.height===null)" style="z-index: 3004;width: 18px;height:18px;display: inline-block;float: right">
                                <icon name="jingshi" style="color: #FF4967;z-index: 3004"></icon>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="90" :sortable="readonlyMode" prop="air_density" label="空气密度|(kg/m^3)" :render-header="renderHeader" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.air_density">{{Number(scope.row.air_density).toFixed(3)}}</span>
                            <span v-else></span>
                        </template>
                         <template slot-header="header">
                            <span>11</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="80" :sortable="readonlyMode" prop="at" label="A(m/s)"  header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.at">{{Number(scope.row.at).toFixed(4)}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="80" :sortable="readonlyMode" prop="kt" label="K" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.kt">{{Number(scope.row.kt).toFixed(4)}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100" :sortable="readonlyMode" prop="average_shear" label="平均风切变" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.average_shear">{{Number(scope.row.average_shear).toFixed(3)}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                     <el-table-column min-width="100" :sortable="readonlyMode" prop="max_inc" label="最大入流角|绝对值(度)" :render-header="renderHeader" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.max_inc">{{Number(scope.row.max_inc).toFixed(3)}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" :sortable="readonlyMode" prop="representative_wake_added" label="特征湍流强度"  header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.representative_wake_added">{{Number(scope.row.representative_wake_added).toFixed(3)}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="90" :sortable="readonlyMode" prop="free_speed" label="平均风速|(m/s)" :render-header="renderHeader" header-align="center" align="center"/>
                      <el-table-column min-width="90" :sortable="readonlyMode" prop="speed_discount" label="尾流损失|(%)" :render-header="renderHeader" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.speed_discount">{{Number(scope.row.speed_discount).toFixed(3)}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                      <el-table-column min-width="100" :sortable="readonlyMode" prop="waked_speed" label="尾流后风速|(m/s)" :render-header="renderHeader" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.waked_speed">{{scope.row.waked_speed}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                      <el-table-column min-width="90" :sortable="readonlyMode"  prop="array_yield" label="上网电量|(MWh)" :render-header="renderHeader" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.array_yield">{{scope.row.array_yield}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                      <el-table-column min-width="100" :sortable="readonlyMode" prop="equivalent_hours" label="等效小时数|(h)" :render-header="renderHeader" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.equivalent_hours">{{scope.row.equivalent_hours}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- //游客模式 -->
                <div v-if="enManager">
                    <!-- 机位点显示的 -->
                    <el-table v-if="!isShowChengguo" ref="turbindTable" :highlight-current-row="true" class="table"  :row-class-name="tableRowClassName" :data="tableData" @row-click="rowClick"  @selection-change="handleSelectionChange">
                        <el-table-column v-show="!readonlyMode" type="selection" :width="!readonlyMode?'50':'10'" >
                        </el-table-column>
                        <el-table-column width="70" :label="'风机数量|(' + tableData.length + '台)'" :render-header="renderHeader" header-align="center" align="center">
                            <template slot-scope="scope">{{scope.$index + 1}}</template>
                        </el-table-column>
                        <el-table-column prop="turbine_name" label="风机编号" header-align="center" align="center"/>
                        <el-table-column min-width="100" prop="coordinate_x" label="X" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span>{{Number(scope.row.coordinate_x).toFixed(2)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="100" prop="coordinate_y" label="Y" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span>{{Number(scope.row.coordinate_y).toFixed(2)}}</span>
                            </template>
                        </el-table-column>
                       
                        <el-table-column :min-width="readonlyMode?120:150"  label="机型" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="readonlyMode">{{scope.row.turbine_type}}</span>
                                <el-select v-else v-model="scope.row.turbine_type" @change="onChange(scope.row, scope.row.turbine_type, scope.$index)" popper-class="gf-popper" placeholder="请选择机型" style="width:100%;">
                                    <el-option v-for="item in turbinesList"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="!readonlyMode" min-width="275" label="功率曲线" header-align="center" align="center">
                            <template slot-scope="scope" >
                                <el-cascader
                                        placeholder="请选择功率曲线"
                                        style="width:230px;line-height: 23px;float: left"
                                        :options="scope.row.input_power_curve_list"
                                        v-model="powerCurveList[scope.$index]"
                                        :show-all-levels="false"
                                        popper-class="gf-popper"
                                        @change="((value)=>{onChangePower(value, scope.row, scope.$index)})">
                                </el-cascader>
                                <div v-if="((powerCurveList.length > 0)&&(powerCurveList[scope.$index][1]==='')||(powerCurveList[scope.$index][1]===null))" style="z-index: 3004;width: 18px;height:18px;display: inline-block;float: right">
                                    <icon name="jingshi" style="color: #FF4967;z-index: 3004"></icon>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :min-width="readonlyMode?80:140" label="轮毂高度|(m)" :render-header="renderHeader" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="readonlyMode">{{scope.row.height}}</span>
                                <el-select v-else v-model="scope.row.height" @visible-change="focusHeight(scope.row)" @change="onChangeGao(scope.row, scope.row.height)" popper-class="gf-popper" placeholder="请选择轮毂高度" style="width:100px;float: left">
                                    <el-option v-for="item in wrgHeightsList"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                                <div v-if="(scope.row.height==='')||(scope.row.height===null)" style="z-index: 3004;width: 18px;height:18px;display: inline-block;float: right">
                                    <icon name="jingshi" style="color: #FF4967;z-index: 3004"></icon>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- //成果显示的 -->
                    <el-table v-if="isShowChengguo" ref="turbindTable" :highlight-current-row="true" class="table"  :row-class-name="tableRowClassName" :data="tableData" @row-click="rowClick"  @selection-change="handleSelectionChange">
                        <el-table-column v-show="!readonlyMode" type="selection" :width="!readonlyMode?'50':'10'" >
                        </el-table-column>
                        <el-table-column width="70" :label="'风机数量|(' + tableData.length + '台)'" :render-header="renderHeader" header-align="center" align="center">
                            <template slot-scope="scope">{{scope.$index + 1}}</template>
                        </el-table-column>
                        <el-table-column prop="turbine_name" label="风机编号" header-align="center" align="center"/>
                        <el-table-column min-width="100" prop="coordinate_x" label="X" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span>{{Number(scope.row.coordinate_x).toFixed(2)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="100" prop="coordinate_y" label="Y" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span>{{Number(scope.row.coordinate_y).toFixed(2)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="80" prop="elevation" label="海拔(m)" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.elevation">{{Number(scope.row.elevation).toFixed(2)}}</span>
                                <span v-else> 0 </span>
                            </template>
                        </el-table-column>
                        <el-table-column :min-width="readonlyMode?120:150"  label="机型" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="readonlyMode">{{scope.row.turbine_type}}</span>
                                <el-select v-else v-model="scope.row.turbine_type" @change="onChange(scope.row, scope.row.turbine_type, scope.$index)" popper-class="gf-popper" placeholder="请选择机型" style="width:100%;">
                                    <el-option v-for="item in turbinesList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="!readonlyMode" min-width="275" label="功率曲线" header-align="center" align="center">
                            <template slot-scope="scope" >
                                <el-cascader
                                        placeholder="请选择功率曲线"
                                        style="width:230px;line-height: 23px;float: left"
                                        :options="scope.row.input_power_curve_list"
                                        v-model="powerCurveList[scope.$index]"
                                        :show-all-levels="false"
                                        popper-class="gf-popper"
                                        @change="((value)=>{onChangePower(value, scope.row, scope.$index)})">
                                </el-cascader>
                                <div v-if="((powerCurveList.length > 0)&&(powerCurveList[scope.$index][1]==='')||(powerCurveList[scope.$index][1]===null))" style="z-index: 3004;width: 18px;height:18px;display: inline-block;float: right">
                                    <icon name="jingshi" style="color: #FF4967;z-index: 3004"></icon>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :min-width="readonlyMode?80:140" label="轮毂高度|(m)" :render-header="renderHeader" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="readonlyMode">{{scope.row.height}}</span>
                                <el-select v-else v-model="scope.row.height" @visible-change="focusHeight(scope.row)" @change="onChangeGao(scope.row, scope.row.height)" popper-class="gf-popper" placeholder="请选择轮毂高度" style="width:100px;float: left">
                                    <el-option v-for="item in wrgHeightsList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                    </el-option>
                                </el-select>
                                <div v-if="(scope.row.height==='')||(scope.row.height===null)" style="z-index: 3004;width: 18px;height:18px;display: inline-block;float: right">
                                    <icon name="jingshi" style="color: #FF4967;z-index: 3004"></icon>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="90" :sortable="readonlyMode" prop="air_density" label="空气密度|(kg/m^3)" :render-header="renderHeader" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.air_density">{{Number(scope.row.air_density).toFixed(3)}}</span>
                                <span v-else>0</span>
                            </template>
                                <template slot-header="header">
                                <span>11</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="80" :sortable="readonlyMode" prop="at" label="A(m/s)"  header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.at">{{Number(scope.row.at).toFixed(4)}}</span>
                                <span v-else>0</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="80" :sortable="readonlyMode" prop="kt" label="K" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.kt">{{Number(scope.row.kt).toFixed(4)}}</span>
                                <span v-else>0</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="100" :sortable="readonlyMode" prop="average_shear" label="平均风切变" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.average_shear">{{Number(scope.row.average_shear).toFixed(3)}}</span>
                                <span v-else> 0 </span>
                            </template>
                        </el-table-column>
                            <el-table-column min-width="100" :sortable="readonlyMode" prop="max_inc" label="最大入流角|绝对值(度)" :render-header="renderHeader" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.max_inc">{{Number(scope.row.max_inc).toFixed(3)}}</span>
                                <span v-else> 0 </span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120" :sortable="readonlyMode" prop="representative_wake_added" label="特征湍流强度"  header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.representative_wake_added">{{Number(scope.row.representative_wake_added).toFixed(3)}}</span>
                                <span v-else> 0 </span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="90" :sortable="readonlyMode" prop="free_speed" label="平均风速|(m/s)" :render-header="renderHeader" header-align="center" align="center"/>
                            <el-table-column min-width="90" :sortable="readonlyMode" prop="speed_discount" label="尾流损失|(%)" :render-header="renderHeader" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.speed_discount">{{Number(scope.row.speed_discount).toFixed(3)}}</span>
                                <span v-else>0</span>
                            </template>
                        </el-table-column>
                            <el-table-column min-width="100" :sortable="readonlyMode" prop="waked_speed" label="尾流后风速|(m/s)" :render-header="renderHeader" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.waked_speed">{{scope.row.waked_speed}}</span>
                                <span v-else>0</span>
                            </template>
                        </el-table-column>
                            <el-table-column min-width="90" :sortable="readonlyMode"  prop="array_yield" label="上网电量|(MWh)" :render-header="renderHeader" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.array_yield">{{scope.row.array_yield}}</span>
                                <span v-else>0</span>
                            </template>
                        </el-table-column>
                            <el-table-column min-width="100" :sortable="readonlyMode" prop="equivalent_hours" label="等效小时数|(h)" :render-header="renderHeader" header-align="center" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.equivalent_hours">{{scope.row.equivalent_hours}}</span>
                                <span v-else>0</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                
            <!--</el-form>-->
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
            <el-upload ref="daoru" class="upload-demo" 
            accept=".xls,.xlsx" action="/read_pg_excel" :show-file-list="false" 
            :http-request="daoruRequest" :on-success="onDaoruSuccess"  :on-change="onChange">
                <button size="small" type="primary" ref="daorubutton">导入</button>
            </el-upload>
        </div>

        <type-dialog :turbineOptions="turbinesList" @restoreType="onRestoreType" @changeType="onChangeType" ref="typeDialog"></type-dialog>
        <curve-dialog :userInfo="userInfo" @restoreType="onRestoreType" @changeCurve="onChangeCurve" ref="curveDialog"></curve-dialog>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import errTip from '../../components/cesium/err-tip';
    import DistributeBar from '../../components/function/distribute-bar-new';
    import { mapActions } from 'vuex'
import { firstUrl } from '../cesium/subMoudle/constants';
import turbineBase from '../../store/modules/turbineBase';
import typeDialog from '../new-parameter-upload/type-dialog';
import curveDialog from '../new-parameter-upload/curve-dialog';

    export default {
        name: 'windGauge',
        // props:{
        //     productId: Number,
        //     planId: Number
        // },
        components: {
            DistributeBar, errTip, typeDialog, curveDialog
        },
        data () {
            return {
                daoruData:[], //导入返回的数据,用于判断展示
                maxViewMode:true,// 是否处于最大化模式
                readonlyMode:true,// 只读模式
                selectedTurbineIds:[],// 当前选择的风机集合
                lastSelectedTurbineIds:[],// 之前选择的风机集合，临时
                // ok: true,
                // visible: true,
                // input_power_curve_list: [
                //     {
                //         value: 'list',
                //         label: '功率曲线库',
                //         children: []
                //     },
                //     {
                //         value: 'upload',
                //         label: '自定义'
                //     }
                // ],
                tableData: [
                    {
                        Conclusion: '',
                        Weight: '',
                        air_density: '',
                        at: '',
                        average_shear: '',
                        coordinate_x: '',
                        coordinate_y: '',
                        elevation: '',
                        height: '',
                        kt: '',
                        load_id: '',
                        max_inc: '',
                        representative_wake_added: '',
                        turbine_type: '',
                        waked_speed: '',
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
                ],
                // tableLabel: "",
                // productId: null,
                // planId: null,
                turbinesList: [],
                turbinesWrgHeights:{},
                wrgHeightsList: [],
                // downLoadTable: null,
                selectRowIndex: 0,
                selectRow: {},
                powerCurveList: [
                    ['','']
                ],
                isShowChengguo: false,
                oldTurbineType: null,  //存储机型
                oldCurve: null,  //存储曲线
                nowTurbineIds: null  //当前操作的id
            };
        },
        computed: {
            userInfo () {
                return this.$store.state.user.loginUserInfo;
            },
            currentFans () {
                return this.$store.state.scheme.currentFans;
            },
            lastmodified () {
                return this.$store.state.scheme.lastmodified;
            },
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role == 11 || this.$store.state.user.loginUserInfo.role == 12){
                    return true;
                }else{
                    return false;
                }
            },
            // // 经过替换后的风机组数组
            // approveTower () {
            //     // 取出不同的部分数组
            //     let diffArr = _.differenceBy(this.scheme.originFans, this.scheme.typeChanges, 'turbine_name');
            //     // 把不同的部分数组与更换后的数组合并
            //     return _.concat(diffArr, this.scheme.typeChanges);
            // },
            // // 增加的风机组容量
            // addFansTower () {
            //     return this.scheme.addFans;
            // },
           
            // scheme () {
            //     return this.$store.state.scheme;
            // }
        },
        watch:{
            lastmodified () {
                this.loadTable(false);
            }

        },
        mounted () {
            if(this.$store.state.app.noneChengguo){
                //不选择上传“发电量成果”，则方案概览中只显示名称、等效小时数；
                // 且 点击单个风机不显示发电量成果窗口；
                this.isShowChengguo = true;
            }else{
                this.isShowChengguo = false;
            }
            // 取得机型列表
            this.getTurbinesList().then(turbinesList=> {
                this.turbinesList = turbinesList;
                let isPush = this.turbinesList.filter((item,index)=>{
                    return item.value == "自定义机型"
                })
                if(isPush.length<=0){
                    this.turbinesList.push({
                        label:"自定义机型",
                        value:"自定义机型"
                    })
                }
            }).catch(err=>{
                console.log(err);
                this.$message.error('取得机型数据失败！');
            });
            // 取得轮毂高度列表
            this.getTurbinesWrgHeights().then(turbinesWrgHeights=> {
                this.turbinesWrgHeights = turbinesWrgHeights;
            }).catch(err=>{
                console.log(err);
                this.$message.error('取得轮毂高度失败！');
            });
           
        },
        methods: {
            ...mapActions(['getTurbinesList',"getTurbinesWrgHeights",'getTurbinesPowerCurves']),
            //取消还原
            onRestoreType(isTrue){
                let that = this;
                this.tableData.forEach((item,index)=>{
                    if(item.turbine_id == that.nowTurbineIds){
                        if(isTrue){
                            item.turbine_type = that.oldTurbineType;
                        }else{
                            item.power_curve_filename = that.oldCurve;
                        }
                    }
                })
            },
            //自定义曲线
            onChangeCurve(value, turbine_type, optimize){
                // console.log(value, turbine_type)
                let that = this;
                this.tableData.forEach((item,index)=>{
                    if(item.turbine_id == that.nowTurbineIds){
                        that.$store.commit("pushCurveList", {
                            power_curve_filename: value, 
                            turbine_type: turbine_type
                        })
                        let arr = that.$store.state.turbineBase.turbinesPowerCurves && that.$store.state.turbineBase.turbinesPowerCurves[turbine_type]
                        item.input_power_curve_list[0].children = arr;
                        that.powerCurveList.splice(index, 1, ['list', arr[arr.length - 1].value]);
                        item.power_curve_filename = value;
                    }
                })
            },
            //自定义机型
            onChangeType(value ,optimize, height){
                // console.log(value)
                let that = this;
                this.tableData.forEach((item,index)=>{
                    if(item.turbine_id == that.nowTurbineIds){
                        // item.turbine_type = value;
                        // // 获取功率曲线
                        // that.focusPower(item, (arr) => {
                        //     if (arr.length > 0) {
                        //         that.powerCurveList.splice(index, 1, ['list', arr[arr.length - 1].value]);
                        //         row.power_curve_filename = arr[arr.length - 1].value;
                        //         that.$emit('changeTurbineType', item);
                        //     }
                        // });
                        that.postTurbineType(value, height, item, that, index);
                    }
                })
            },
            postTurbineType(value, height, item, that, index){
                util.ajax.post('/properties/'+ that.userInfo.user_id, {
                    turbine_type: value,
                    turbine_height: height,
                }).then((res)=>{
                    // console.log(res)
                    if(res.data.code != 201){
                        that.$message.error("上传失败："+ res.data.message);
                        that.getTurbineType();
                        return;
                    }
                    item.turbine_type = value;
                    that.getTurbineTypeList(item.turbine_type, (arr) => {
                        if(arr.length>0){
                            that.powerCurveList.splice(index, 1, ['list', arr[arr.length - 1].value]);
                            item.power_curve_filename = arr[arr.length - 1].value;
                        }else{
                            item.input_power_curve_list[0].children = [];
                            item.power_curve_filename = null;
                        }
                    });
                    that.turbinesList.unshift({
                        value: value,
                        label: value
                    })

                }).catch((err)=>{
                    console.log(err);
                    that.$message.error("上传自定义机型失败");
                    that.getTurbineType();
                })
            },
             // 获取指定风机的工具曲线文件列表
            getTurbineTypeList(type, callback) {
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
                            value: item,
                            label: item
                        });
                    });
                    this.turbinesList=temp;
                    this.turbinesList.push({
                            value: "自定义机型",
                            label: "自定义机型"
                        });
                }).catch(() => {
                    this.$message.error('获取机型列表失败');
                });
            },
            //选择前存储机型,自定义机型取消用来还原
            visibleChange(type, row){
                // console.log(type, row.turbine_type);
                if(type){
                    this.oldTurbineType = row.turbine_type;
                }
            },
            daoruRequest(option){
                // console.log(option);
                // this.$message.success("数据上传中...");
                const formData = new FormData();
                const file = option.file;
                const filename = file.name;
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                formData.append('pg_excel', file, file.name);            
                option.headers['Content-Type'] = 'multipart/form-data';
                // option.headers['Accept'] = '*/*';
                util.ajax.post(option.action, formData ,config).then((res) => {
                //    console.log(res);
                   if(res.data.code==200){
                       this.daoruData = res.data.data;
                    //    console.log(this.daoruData);
                       this.$emit("daoruData",this.daoruData);
                    //    this.$message.success("方案发电量结果更新成功");
                    //    this.$emit("daoruGetList");
                   }
                }).catch(err => {
                    console.log(err);
                });
            },
            onDaoruSuccess(response, file, fileList){
                console.log(response, file, fileList);
            },
            // onChange(file, fileList){
            //     console.log(file, fileList);
            // },
            delSelectedRows(){
                let turbinNames=[];
                this.tableData.forEach(row => {
                    if (this.selectedTurbineIds.indexOf(row.turbine_id)>=0) {
                        turbinNames.push(row.turbine_name);
                    }
                });
                let turbinNamesStr = turbinNames.toString() ;
                let turbinNumStr = '' ;
                if(this.selectedTurbineIds.length > 6) {
                    turbinNamesStr = turbinNames.toString().substring(0,30) + '...'
                    turbinNumStr = '等' + this.selectedTurbineIds.length + '个'
                }
                this.$alert('确认删除【' + turbinNamesStr + '】' + turbinNumStr + '风机?', '提示', {
                    confirmButtonText: '确定',
                    center: true,
                    callback: action => {
                        if (action === 'confirm') {
                           this.$emit('delTurbines',this.selectedTurbineIds);
                        }
                    }
                });
            },
            changeType(){
                let turbins=[];
                this.tableData.forEach(row => {
                    if (this.selectedTurbineIds.indexOf(row.turbine_id)>=0) {
                        turbins.push(row);
                    }
                });
                this.$emit('changeTurbineListType',turbins);
            },
            daoruXlxs(){
                console.log("触发导入");
                this.$refs.daorubutton.click();
            },
            addCustomLabel(type){
                this.$emit("addCustomLabel",type);
            },
            editModeChange(editMode){
                this.readonlyMode=!editMode;
                this.$emit('editModeChange', editMode)
            },
            viewChange(maxViewMode){
                this.maxViewMode=maxViewMode;
            },
            tableRowClassName({row, rowIndex}) {
                if (this.selectedTurbineIds.indexOf(row.turbine_id)>=0) {
                    return 'selected-row';
                }
                return 'normal-row';
            },
            handleSelectionChange(val) {
                this.selectedTurbineIds = [];
                val.forEach(row => {
                    this.selectedTurbineIds.push(row.turbine_id);
                });
            },
            // powerList (row) {
            //     if (!row) return null;
            //     return ['list', row.power_curve_filename];
            // },
            focusHeight (row) {
                if(!this.turbinesWrgHeights) return;
                let arr = this.turbinesWrgHeights[row.turbine_type];
                let mm = [];
                arr.forEach(function (value, i) {
                    mm.push({value: value, label: value});
                });
                this.wrgHeightsList = mm;
            },
            // 根据机型获取功率曲线
            focusPower (row, callback) {
                this.getTurbinesPowerCurves({turbineType:row.turbine_type,userId:this.$store.state.user.loginUserInfo.user_id}).then(arr=> {
                   row.input_power_curve_list = [
                        {
                            value: 'list',
                            label: '功率曲线库',
                            children: arr
                        },
                        {
                            value: 'upload',
                            label: '自定义'
                        }
                    ];
                    callback(arr);
                }).catch(err=>{
                    console.log(err);
                    this.$message.error('获取功率曲线文件列表失败！');
                });

                // util.ajax.get('/input_power_curve?turbine_type=' + row.turbine_type + '&user_id=' + this.$store.state.user.loginUserInfo.user_id).then((res) => {
                //     if (res.data.code === 404) {
                //         return;
                //     }
                //     if (res.data.code !== 200) {
                //         this.$message.error(res.data.message);
                //         return;
                //     }
                //     if (res.data.data && res.data.data.length > 0) {
                //         let arr = [];
                //         res.data.data.forEach((item) => {
                //             arr.push({
                //                 value: item.file_name,
                //                 label: item.file_name
                //             });
                //         });
                //         row.input_power_curve_list = [
                //             {
                //                 value: 'list',
                //                 label: '功率曲线库',
                //                 children: arr
                //             },
                //             {
                //                 value: 'upload',
                //                 label: '自定义'
                //             }
                //         ];
                //         if (callback) callback(arr);
                //     }
                // }).catch(() => {
                //     this.$message.error('获取功率曲线文件列表失败！');
                // });
            },
            rowClick (row) {
                this.$emit('windClickFan', row.turbine_id);
            },
            renderHeader (h, { column, $index }) {
                if(!column || !column.label) {
                    return h('span', {});
                }
                else if (column.label.indexOf('风机数量')>=0) {
                    return h('span', {}, [
                        h('span', {}, column.label.split('|')[0]),
                        h('br'),
                        h('em', {}, column.label.split('|')[1]),
                        h('span', {}, column.label.split('|')[2])
                    ]);
                }else {
                    return h('span', {}, [
                        h('span', {}, column.label.split('|')[0]),
                        h('br'),
                        h('span', {}, column.label.split('|')[1])
                    ]);
                }

            },
            compare(property){
                return function(a,b){
                    let value1 = a[property];
                    let value2 = b[property];
                    return value1 - value2;
                }
            },
            loadTable (first=true) {
                // this.planId = planId;
                // this.productId = productId;

                this.tableData = [];
                this.lastSelectedTurbineIds = this.selectedTurbineIds;
                this.selectedTurbineIds = [];
                // this.ok = true;
              
                // let tmpTower = _.concat(this.addFansTower, this.approveTower);
                // for (let fan in this.scheme.delFans) {
                //     let index = _.findIndex(tmpTower, ['turbine_id', this.scheme.delFans[fan]]);
                //     tmpTower.splice(index, 1)    ;
                // }
                // this.tableLabel = "风机数量|("+tmpTower.length+"台)";
                let newTable =_.cloneDeep(this.currentFans).sort(this.compare('turbine_id'));
                // console.log(newTable);
                // 初始化数据时循环遍历 根据机型获取功率曲线列表
                let that = this;
                this.getPowerCurveListA(newTable)
                    .then(table => {
                        that.tableData = table;
                        that.powerCurveList = that.tableData.map(value => {
                            return ['list', value.power_curve_filename];
                        });
                        that.$nextTick(()=>{
                            that.tableData.forEach(row => {
                                if (that.lastSelectedTurbineIds.indexOf(row.turbine_id)>=0) {
                                    that.$refs.turbindTable.toggleRowSelection(row,true);
                                }
                            }
                        );
                         that.lastSelectedTurbineIds = [];
                    });

                    });
                // util.ajax.get('/load_choose/' + productId + '/' + planId).then((res) => {
                //     let retData = res.data;
                //     if (retData.code !== 200) {
                //         // this.tableData = {};
                //     } else {
                //         this.downLoadTable =util.baseUrl+ "/load_download/"+this.productId+"/"+this.planId+"/"+retData.data[0].load_id;
                //     }
                // }).catch((/* err */) => {
                //     this.$message.error('取得载荷自动选型数据失败！');
                // });
            },
            // 异步改同步
            async getPowerCurveListA (list) {
                for (let i = 0; i<list.length; i++) {
                    // if (list[i].power_curve_filename === '' || list[i].power_curve_filename === null) {
                    //     list[i].input_power_curve_list = [
                    //         {
                    //             value: 'list',
                    //             label: '功率曲线库',
                    //             children: []
                    //         },
                    //         {
                    //             value: 'upload',
                    //             label: '自定义'
                    //         }
                    //     ]
                    // } else {
                        list[i].input_power_curve_list = await this.getPowerCurveList(list[i])
                    // }
                }
                return list
            },
            // Promise根据机型获取功率曲线列表
            getPowerCurveList (row) {
                return new Promise((resolve, reject) => {
                     // 获取功率曲线
                    this.focusPower(row, (arr) => {
                       resolve([
                                {
                                    value: 'list',
                                    label: '功率曲线库',
                                    children: arr
                                },
                                {
                                    value: 'upload',
                                    label: '自定义'
                                }
                            ]);
                        });
                    // util.ajax.get('/input_power_curve?turbine_type=' + row.turbine_type + '&user_id=' + this.$store.state.user.loginUserInfo.user_id).then((res) => {
                    //     if (res.data.code === 404) {
                    //         return;
                    //     }
                    //     if (res.data.code !== 200) {
                    //         this.$message.error(res.data.message);
                    //         return;
                    //     }
                    //     if (res.data.data && res.data.data.length > 0) {
                    //         let arr = [];
                    //         res.data.data.forEach((item) => {
                    //             arr.push({
                    //                 value: item.file_name,
                    //                 label: item.file_name
                    //             });
                    //         });
                    //         resolve([
                    //             {
                    //                 value: 'list',
                    //                 label: '功率曲线库',
                    //                 children: arr
                    //             },
                    //             {
                    //                 value: 'upload',
                    //                 label: '自定义'
                    //             }
                    //         ]);
                    //     }
                    // }).catch(() => {
                    //     this.$message.error('获取功率曲线文件列表失败！');
                    // });

                });
            },
            close () {
                // let ok =  this.tableData && this.tableData.length !== 0;
                // this.powerCurveList.map(value => {
                //     if (!value[1]) {
                //         ok = false;
                //     }
                // });
                // this.tableData.map(value => {
                //     if ((value.height==='')||(value.height===null)) {
                //         ok = false;
                //     }
                // });
                // if (!ok) {
                //     this.$confirm('当前数据项不完整,建议完善后再关闭。点击“确定”可继续关闭风参表 ?', '提示', {
                //         confirmButtonText: '确定',
                //         cancelButtonText: '取消',
                //         type: 'warning'
                //         }).then(() => {
                //             this.$emit('windGaugeClose');
                //         }).catch(() => {});
                // } else {
                    this.$emit('windGaugeClose');
                // }
            },
            // 更改机型回调
            onChange (row, turbineType, index) {
                console.log(row, turbineType, index)
                this.nowTurbineIds = row.turbine_id;
                if(turbineType == "自定义机型"){
                    this.$refs.typeDialog.open(false);
                    return;
                }
                row.turbine_type = turbineType;
                // 设置轮毂高度为空
                row.height = null;
                // 获取功率曲线
                this.focusPower(row, (arr) => {
                    if (arr.length > 0) {
                        this.powerCurveList.splice(index, 1, ['list', arr[arr.length - 1].value]);
                        row.power_curve_filename = arr[arr.length - 1].value;
                        this.$emit('changeTurbineType', row);
                    }
                });
            },
            onChangeGao (row, height) {
                row.height = height;
                this.$emit('changeTurbineType', row, true, row);
            },
            onChangePower (power, row, index) {
                console.log(power, row, index)

                this.selectRow = row;
                this.selectRowIndex = index;
                this.nowTurbineIds = row.turbine_id;
                this.oldCurve = row.power_curve_filename;
                if (power[0] === 'upload') {
                    // this.upload();
                    //自定义曲线
                    this.$refs.curveDialog.open(row.turbine_type, false);
                }else {
                    this.powerCurveList.splice(index, 1, ['list', power[1]]);
                    row.power_curve_filename = power[1];
                    this.$emit('changeTurbineType', row);
                }
            },
            // 间接调用upload
            upload () {
                this.$refs.button.click();
            },
            onSuccessHandle (response, file, fileList) {
                this.$message.success('上传自定义功率曲线成功');
                this.focusPower(this.selectRow);
                this.tableData[this.selectRowIndex].power_curve_filename = file.name;
                let fanData = {...this.selectRow};
                fanData.power_curve_filename = file.name;
                this.$emit('changeTurbineType', fanData);
            },
            httpRequest (option) {
                const formData = new FormData();
                const file = option.file;
                formData.append(option.filename, file, file.name);
                formData.append('user_id', this.$store.state.user.loginUserInfo.user_id);
                formData.append('turbine_type', this.selectRow.turbine_type);
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
            }
        }
    };
</script>

<style lang="less" scoped>
.gauge_table /deep/ .el-input__suffix{
    top: 0 !important;
}
/deep/ .el-input__icon{
    line-height: 20px !important;
}
.wind_gauge /deep/ .demo-ruleForm{
    width: 240px;
    .el-input__inner{
        border: 1px solid #dcdfe6 !important;
    }
}
    .wind_gauge{
        width: 100%;
        // height: 290px;
        position: absolute;
        bottom: 0;
        left: 0;
        .gauge_header{
            border-radius: 5px 5px 5px 5px;
            float: right;
            // width: 90px;
            height: 50px;
            background-color:rgba(3, 28, 53, 0.5);
            font-size: 24px;
            line-height: 30px;
            position: relative;
            top: -60px;
            right: 10px;
            div{
                color: #A3B6C3;
                // width: 33%;
                height: 100%;
                float: left;
                text-align: center;
                &:hover {
                    color: #DDEAF3;
                }
                a{
                    color: #A3B6C3;
                    &:hover {
                        color: #DDEAF3;
                    }
                }
            }
        }
        .sanjiao{
            width: 0;
            height: 0;
            border-top: 50px solid rgba(0,0,0,0);
            border-right: 50px solid rgba(3, 28, 53, 0.5);
            float: right;
        }

        .gauge_table{
            /deep/ .el-table__header th{
                font-weight: normal;
            }
            background: rgba(3, 28, 53, 0.5);
            height: 290px;
            width: 100%;          
            position: absolute;
            bottom: 0;
            .table{
                background: rgba(0, 0, 0, 0);
                width: 98%;
                height: 287px;
                margin-bottom: 8px;
                margin-left: 1%;
                margin-right: 1%;
                .table_fixed-label{
                    font-size: 12px;
                }
                .table_fixed-column{
                    background: rgba(0, 0, 0, 0);
                }

                .el-table__row .hover-row{
                    background: rgba(0, 0, 0, 0);
                }
            }
        }
        /*滚动轴加粗*/
        /*::-webkit-scrollbar{width:24px;height:10px;}
        ::-webkit-scrollbar-track{background-color:#bee1eb;}
        ::-webkit-scrollbar-thumb{background-color:#00aff0;}
        ::-webkit-scrollbar-thumb:hover {background-color:#aaa}
        ::-webkit-scrollbar-thumb:active {background-color:#00aff0}*/
    }

    .gauge_table /deep/ .el-table__body-wrapper.is-scrolling-left{
        padding-bottom: 10px;
        box-sizing: border-box;
    }

</style>
