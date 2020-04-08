<template>
    <el-dialog title="添加风机-按指定坐标"
               :visible.sync="dialogVisible" @open="onOpen"
               width="840px"
               :modal="false"
               custom-class="addCoordinateDialog"
               :before-close="beforeClose"
               v-bind:class="margin"
    >
        <div class="add-buttons-group">
            <div class="download-button">
                <icon name="download" style="height: 18px;width: 18px; color: rgba(51,200,111,0.6)"/>
                <a :href="output_template" target="_blank" >下载模版</a>
            </div>
            <el-upload ref="upload"
                       style="display: inline"
                       :action="'/input_xy_file/'+project_id+'/'+scheme_id"
                       :show-file-list="false"
                       :http-request="parseTurbineFile"
                       >
                       <icon name="load" class="upload-btn"/>
                       <div class="import-button"  slot="trigger">导入文件</div>
            </el-upload>
        </div>
        <div class="coordinate-body" v-bind:style="{height:bodyHeight}">
                <div class="delAllIcon" @click="delAll">
                    <icon name="remove" class="remove-btn" />
                </div> 
                    
                <el-form :model="ruleForm" ref="ruleForm"  :show-message="false">
                    <el-table class="gf-table need-border content-table" :data="ruleForm.coordinateList" min-height= "50" max-height="250">
                        <el-table-column width="80px" label="风机编号" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-form-item 
                                :prop="'coordinateList.'+scope.$index+'.turbine_name'"
                                :rules="{validator: coordinateName, trigger: 'change'}" >
                                        <el-tooltip class="item" 
                                        effect="light" 
                                        popper-class="onmytooltip"
                                        content="允许输入数字、字母、中划线、字符不超10"
                                        :disabled="/^[\w.-]{1,10}$/.test(scope.row.turbine_name) || !isValid ? true : false"
                                        :visible-arrow="false"
                                        placement="top">
                                    <el-input v-model="scope.row.turbine_name"
                                    @blur="offBlur"
                                    @focus="onfocus"
                                    class="gf-table-input name-input"  />
                                        </el-tooltip>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="机型" width="130px" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-form-item >

                                    <el-select v-model="scope.row.turbine_type"
                                    @visible-change="((value)=>{visibleChange( value, scope.row.turbine_type, scope.$index )})"
                                     @change="onChange2(scope.$index, scope.row)"
                                      popper-class="gf-popper" 
                                      placeholder="请选择机型"
                                       style="width:100%;">
                                        <el-option v-for="item in ruleForm.models"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="投影坐标X" width="120px" header-align="center" align="center">
                                <template slot-scope="scope">
                                <el-form-item 
                                :prop="'coordinateList.'+scope.$index+'.coordinate_x'"
                                :rules="{validator: validateX, trigger: 'change'}">
                                        <el-tooltip class="item" 
                                        effect="light" 
                                        popper-class="onmytooltip"
                                        :content="'8位整数，可保留四位小数'" 
                                        :disabled="/^\d{8}(\.\d{1,4})?$/.test(scope.row.coordinate_x) || !isValid ? true : false"
                                        :visible-arrow="false"                                      
                                        placement="top">
                                    <el-input v-model="scope.row.coordinate_x"
                                    @blur="offBlur"
                                    @focus="onfocus"
                                                class="gf-table-input"  />
                                        </el-tooltip>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="投影坐标Y" width="120px" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-form-item 
                                :prop="'coordinateList.'+scope.$index+'.coordinate_y'"
                                :rules="{validator: validateY, trigger: 'change'}">
                                        <el-tooltip class="item" 
                                        popper-class="onmytooltip" 
                                        effect="light" 
                                        content="7位整数，可保留四位小数" 
                                        :visible-arrow="false"
                                        :disabled="/^\d{7}(\.\d{1,4})?$/.test(scope.row.coordinate_x) || !isValid ? true : false"
                                        placement="top">
                                    <el-input v-model="scope.row.coordinate_y"
                                    @blur="offBlur"
                                    @focus="onfocus"
                                                class="gf-table-input"  />
                                        </el-tooltip>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="轮毂高度(米)" width="90px" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-select  
                                    v-model="scope.row.height" 
                                    popper-class="gf-popper" 
                                    @change="onChange3(scope.$index, scope.row)"
                                    placeholder="请选择" style="width:100%;">
                                        <el-option v-for="item in scope.row.wrgHeights"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="功率曲线文件" min-width="140px" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-form-item>

                                    <el-cascader
                                    :disabled="!scope.row.turbine_type"
                                    v-model="scope.row.power_curve_filename" 
                                        placeholder="请选择功率曲线"
                                        
                                        style="width:100%;"
                                        :options="scope.row.input_power_curve_list"
                                        :show-all-levels="false"
                                        popper-class="gf-popper"
                                        @change="((value)=>{handleChange2(value, scope.$index ,scope.row)})">
                                    </el-cascader>
                                    
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column width="50px" align="center">
                            <template slot-scope="scope">
                                <div class="icon-box">
                                    <span  @click="deleteFormItem(scope.$index)">
                                        <icon name="remove" class="remove-btn"/>
                                    </span>    
                                    <el-tooltip class="item" :visible-arrow="false" popper-class="onmytooltip" effect="light" content="风机坐标超出风场范围" placement="top">
                                        <icon v-show="scope.row.failed" class="jingshiicon" name="jingshi" style="color: #FF4967;margin-left: 4px"></icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
                <div @click="addFormItem" class="add-btn">+ 新增</div>
                      

            
            <!-- <el-form :model="ruleForm"
                     ref="ruleForm"
                     inline
                     label-position="left"
                     :rules="rules"
                     hide-required-asterisk
                     label-width="102px">
                <div :class="[ruleForm.coordinateList.length>1?'coordinate-box':'coordinate-boxs']">
                    <div class="coordinate" v-for="(item, index) in ruleForm.coordinateList" :key="122+index">
                        <el-form-item label="投影坐标X：" :prop="'coordinateList.'+index+'.coordinate_x'"
                                    :rules="{required: true, validator: validateX, trigger: 'change'}"
                        >
                              
                            <el-input v-model="item.coordinate_x"  @blur="offBlur"></el-input>
                               
                        </el-form-item>
                        <el-form-item label="投影坐标Y：" :prop="'coordinateList.'+index+'.coordinate_y'"
                                    :rules="{required: true, validator: validateY, trigger: 'change'}"
                        >
                                
                            <el-input v-model="item.coordinate_y" @blur="offBlur"></el-input>
                               
                            <div v-if="index === 0"  @click="addFormItem" style="width: 14px;display: inline-block">
                                <icon name="zengjia" style="color: #33C86F;margin-left: 4px;cursor: pointer;"></icon>
                            </div>
                            <div @click="deleteFormItem(index)" style="width: 14px;display: inline-block">
                                <icon name="wechaticon13" style="color: #33C86F;margin-left:2px;width: 18px;height:18px;cursor: pointer;"></icon>
                            </div>
                            <div v-if="item.failed"  style="width: 14px;display: inline-block">
                                <div
                                        @mouseenter="showTips(index)"
                                        @mouseleave="hiedTips(index)"
                                        class="tipShow"
                                >
                                <el-tooltip class="item" effect="dark" content="风机超出风场范围" placement="right">
                                    <icon name="jingshi" style="color: #FF4967;margin-left: 4px"></icon>
                                </el-tooltip>
                                   

                                </div>
                            </div>
                        </el-form-item>
                    </div>
                </div>
                
                <el-form-item prop="selectModel" label="机型："
                >
                    <el-select v-model="ruleForm.selectModel" @change="onChange" popper-class="gf-popper" placeholder="请选择机型" style="width:100%;">
                        <el-option v-for="item in ruleForm.models"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="selectPowerCurves" label="功率曲线：">
                    <el-cascader
                            placeholder="请选择功率曲线"
                            style="width:100%;"
                            :options="ruleForm.input_power_curve_list"
                            v-model="ruleForm.selectPowerCurves"
                            :show-all-levels="false"
                            popper-class="gf-popper"
                            @change="handleChange()">
                    </el-cascader>
                </el-form-item>
                <el-form-item prop="selectWrgHeights" label="轮毂高度：">
                    <el-select v-model="ruleForm.selectWrgHeights" popper-class="gf-popper" placeholder="请选择轮毂高度" style="width:100%;">
                        <el-option v-for="item in ruleForm.wrgHeights"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form> -->
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
        <div class="btnBox">
            <el-button class="gf-button" style="width: 208px;" type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </div>


        <!-- //自定义机型 -->
            <type-dialog :turbineOptions="turbineOptions" @restoreType="restoreType" @changeType="changeType" ref="typeDialog"></type-dialog>
            <curve-dialog :userInfo="userInfo" @restoreType="restoreType" @changeCurve="changeCurve" ref="curveDialog"></curve-dialog>
    </el-dialog>
</template>

<script>
    import util from '@/libs/util';
    import _ from 'lodash';
    import typeDialog from '../new-parameter-upload/type-dialog';
    import curveDialog from '../new-parameter-upload/curve-dialog';
    export default {
        name: 'fan-add-coordinate',
        components:{
            typeDialog,
            curveDialog
        },
        props: {
            projectIds:{
                type: Number,
                default: null
            }
        },
        data () {
            return {
                isTrue:true,
                isOpenTip:false,
                isClick:true, //防止重复点击过快

                wrgHeights: {},
                wrgHeights2: {},
                dialogVisible: false,
                ruleForm: {
                    unitNumber: '',
                    speed: null,
                    lon: null,
                    lat: null,
                    selectModel: null,
                    models: [],
                    selectPowerCurves: null,
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
                    powerCurves: [],
                    selectWrgHeights: null,
                    wrgHeights: [],
                    coordinateList: [
                        {
                            coordinate_x: null,
                            coordinate_y: null,
                            turbine_name: null,
                            height: null,
                            turbine_type: null,
                            power_curve_filename: null,
                            input_power_curve_list:[
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
                            failed:false,
                            wrgHeights:[]
                        }
                    ],
                   
                },
                zbStatus: false,
                zbStatus0: false,
                zbStatus2: false,
                zbStatus3: false,
                tmpRow: '', // 风机型号暂存
                isValid: false,
                liandongAll: false,
                liandongAllheight: false,
                liandongHeight: false,
                rules: {
                    selectModel: [
                        { required: true, message: '请选择机型！', trigger: 'change' }
                    ],
                    selectWrgHeights: [
                        { required: true, message: '请选择轮毂高度！', trigger: 'change' }
                    ],
                    selectPowerCurves: [
                        { required: true, message: '请选功率曲线！', trigger: 'change' }
                    ]
                },
                projectId: null,
                planId: null,
                coordinateList: [
                    {
                        coordinate_x: null,
                        coordinate_y: null
                    }
                ],
                output_template: util.baseUrl + '/output_template?args=xy',
                notOk: [],
                points: [],
                tipShow: [false, false, false, false, false, false, false, false, false, false],
                inputCfd: {},
                project_id: null,
                scheme_id : null,
                turbineOptions: [],
                oldTurbineType: null,
                nowTurbineIds: 0
            };
        },
        watch: {
            projectIds:function(val){
                this.project_id = val;
                // console.log(this.project_id,this.scheme_id )
            }
        },
        computed: {
            bodyHeight () {
                if (this.ruleForm.coordinateList.length === 1) return '188px';
                return `${(this.ruleForm.coordinateList.length - 1) * 47 + 188}px`;
            },
            margin () {
                return {
                    'margin2': this.ruleForm.coordinateList.length === 2 || this.ruleForm.coordinateList.length === 3,
                    'margin4': this.ruleForm.coordinateList.length === 4 || this.ruleForm.coordinateList.length === 5,
                    'margin6': this.ruleForm.coordinateList.length === 6 || this.ruleForm.coordinateList.length === 7,
                    'margin8': this.ruleForm.coordinateList.length === 8 || this.ruleForm.coordinateList.length === 9,
                    'margin10': this.ruleForm.coordinateList.length === 10
                };
            },
            validateX () {
                return (this.inputCfd.epsg_src === 4326) ? this.validateWGS84X : this.validateCoordinateX;
            },
            validateY () {
                return (this.inputCfd.epsg_src === 4326) ? this.validateWGS84Y : this.validateCoordinateY;
            },
            //风机编号
            coordinateName(){
                return  this.coordinateName1;
            },
            userInfo(){
                return this.$store.state.user.loginUserInfo;
            }
        },
        mounted () {
            
        },
        filters: {
            numFilter (value) {
                if (value) {
                    // 截取当前数据到小数点后两位
                    let realVal = Number(value).toFixed(2);
                    // num.toFixed(2)获取的是字符串
                    return Number(realVal);
                } else {
                    return value;
                }
            }
        },
        methods: {
            //选择前存储机型,自定义机型取消用来还原
            visibleChange(isTrue, value, index){
                console.log(value,index);
                if(isTrue){
                    this.oldTurbineType = value;
                    this.nowTurbineIds = index;
                }
            },
            restoreType(isTrue, optimize){
                console.log(isTrue, optimize);
                let that = this;
                if(isTrue){
                    this.ruleForm.coordinateList[that.nowTurbineIds].turbine_type = that.oldTurbineType;
                }else{
                    let list = that.ruleForm.coordinateList[that.nowTurbineIds].input_power_curve_list[0].children;
                    if(list.length>0){
                        that.ruleForm.coordinateList[that.nowTurbineIds].power_curve_filename = ['list', list[list.length - 1].value]
                    }else{
                        that.ruleForm.coordinateList[that.nowTurbineIds].power_curve_filename = []
                    }
                }
            },
            changeType(value, optimize , height){
                console.log(value, optimize , height)
                let that = this;
                this.postTurbineType(value, height, that);
            },
            postTurbineType(value, height, that){
                util.ajax.post('/properties/'+ this.userInfo.user_id, {
                    turbine_type: value,
                    turbine_height: height,
                }).then((res)=>{
                    // console.log(res)
                    if(res.data.code != 201){
                        this.$message.error("上传失败："+ res.data.message);
                        
                        return;
                    }
                    that.ruleForm.coordinateList[that.nowTurbineIds].turbine_type = value;
                    that.loadTurbineTypeList(value, (list) => {
                        that.ruleForm.coordinateList[that.nowTurbineIds].input_power_curve_list[0].children = list;
                        if (list.length > 0) {
                            that.ruleForm.coordinateList[that.nowTurbineIds].selectPowerCurves = ['list',list[list.length-1].value];
                        }else {
                            that.ruleForm.coordinateList[that.nowTurbineIds].selectPowerCurves = null;
                        }
                    });
                }).catch((err)=>{
                    console.log(err);
                    this.$message.error("上传自定义机型失败");

                })
            },
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
            changeCurve(value , turbine_type , optimize){
                // console.log(value , turbine_type , optimize)
                let that = this;
                this.loadTurbineTypeList(turbine_type, (list) => {
                    that.ruleForm.coordinateList.forEach((item,index)=>{
                        if(item.turbine_type == turbine_type){
                            item.input_power_curve_list[0].children = list;
                            if (list.length > 0) {
                                item.power_curve_filename = ['list',list[list.length-1].value];
                            }else {
                                item.power_curve_filename = [];
                            }
                        }
                    })
                });
            },
            initData(){
                this.ruleForm.selectModel = null;
                this.ruleForm.selectPowerCurves = [];
                // 取得机型列表
                util.ajax.get('/properties/'+ this.$store.state.user.loginUserInfo.user_id +'?key=turbines', {}).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }

                    this.ruleForm.models = retData.data.items.map((ele, index, arr) => {
                        return {value: ele, label: ele};
                    });
                    this.ruleForm.models.push({
                            value: "自定义机型",
                            label: "自定义机型"
                        });
                    this.turbineOptions = this.ruleForm.models;
                }).catch((/* err */) => {
                    this.$message.error('取得机型数据失败！');
                });
                // 取得轮毂高度列表
                util.ajax.get('/properties/'+ this.$store.state.user.loginUserInfo.user_id +'?key=turbine_height', {}).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }

                    this.wrgHeights = retData.data.items;
                    this.wrgHeights2 = retData.data.items;
                }).catch((/* err */) => {
                    this.$message.error('取得轮毂高度失败！');
                });
            },
            offBlur(){
                this.isValid = true;
            },
            onfocus(){
                this.isValid = false;
            },
            coordinateName1 (rule, value, callback)  {
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
                
            },
            // WGS84投影坐标X
            validateWGS84X (rule, value, callback) {
                if (value === '') {
                    callback(new Error('X为-180-180，允许输入到小数点后四位'));
                } 
                // else if (!/^(([1-9]?[0-9]|1[0-7][0-9])(\.\d{1,4})?|180)$/.test(value)) {
                //     callback(new Error('0-180四位小数'));
                // }
                else if (!/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|180(([.][0]{1,4})?))$/.test(value)) {
                    callback(new Error('X为-180-180，允许输入到小数点后四位'));
                } 
                 else {
                    callback();
                }
            },
            // WGS84投影坐标Y
            validateWGS84Y (rule, value, callback) {
                if (value === '') {
                    callback(new Error('Y为-90-90，允许输入到小数点后四位'));
                } 
                // else if (!/^(([1-9]?[0-9]|1[0-7][0-9])(\.\d{1,4})?|180)$/.test(value)) {
                //     callback(new Error('0-180四位小数'));
                // } 
                else if (!/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(value)) {
                    callback(new Error('Y为-90-90，允许输入到小数点后四位'));
                }
                else {
                    callback();
                }
            },
            // 其他投影坐标X
            validateCoordinateX (rule, value, callback) {
                if (value === '') {
                    callback(new Error('8位正数4位小数!'));
                } else if (!/^[\d]{8}(\.\d{1,4})?$/.test(value)) {
                    callback(new Error('8位正数4位小数!'));
                } else {
                    callback();
                }
            },
            // 其他投影坐标Y
            validateCoordinateY (rule, value, callback) {
                if (value === '') {
                    callback(new Error('7位正数4位小数'));
                } else if (!/^[\d]{7}(\.\d{1,4})?$/.test(value)) {
                    callback(new Error('7位正数4位小数'));
                } else {
                    callback();
                }
            },
            showTips (index) {
                this.tipShow.splice(index, 1, true);
            },
            hiedTips (index) {
                this.tipShow.splice(index, 1, false);
            },
            addFormItem () {
                // if (this.ruleForm.coordinateList.length === 10) return this.$message.error('只能支持导入最多10个点位！');
                let that = this;
                this.ruleForm.coordinateList.push(
                    {
                        coordinate_x: null,
                        coordinate_y: null,
                        turbine_name: null,
                        height: null,
                        turbine_type: null,
                        power_curve_filename: null,
                        input_power_curve_list:[
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
                        failed:false,
                        wrgHeights:[]
                    }
                );
            },
            deleteFormItem (index) {
                // if (this.ruleForm.coordinateList.length <= 1) return;
                this.ruleForm.coordinateList.splice(index, 1);
            },
            // 关闭前回调
            beforeClose (done) {
                this.$emit('closeFanAdd', 'coordinate');
                // this.ruleForm.coordinateList = this.getDefaultCoordList();
                this.ruleForm.coordinateList = [];
                this.ruleForm.selectModel = null;
                this.ruleForm.selectPowerCurves = [];
                this.ruleForm.selectWrgHeights = null;
                this.notOk = [];
                this.points = [];
                done();
                
            },
            // 间接调用upload
            upload () {
                this.$refs.button.click();
            },
            onSuccessHandle (response, file, fileList) {
                console.log(file);
                this.$message.success('上传自定义功率曲线成功');         
                this.onChange1();
    
            },
            httpRequest (option) {
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
                formData.append('user_id', this.$store.state.user.loginUserInfo.user_id);
                formData.append('turbine_type', this.ruleForm.selectModel);
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
            // 处理功率曲线级联选择框
            handleChange () {
                if (this.ruleForm.selectPowerCurves[0] === 'upload') {
                    this.upload();
                }
            },
            handleChange2 (value , i , row) {
                // console.log(value, index ,row)
                // console.log(row.input_power_curve_list[0].children)
                
                if (value[0] !== 'upload') {
                    // for (let i = 0; i < this.ruleForm.coordinateList.length; i++) {
                        this.ruleForm.coordinateList.splice(i, 1, {
                           
                            coordinate_x: this.ruleForm.coordinateList[i].coordinate_x,
                            coordinate_y:this.ruleForm.coordinateList[i].coordinate_y,
                            turbine_name: this.ruleForm.coordinateList[i].turbine_name,
                            height: this.ruleForm.coordinateList[i].height,
                            wrgHeights: this.ruleForm.coordinateList[i].wrgHeights,
                            turbine_type: this.ruleForm.coordinateList[i].turbine_type,
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
                       
                    // }
                }
                if (value[0] === 'upload') {
                    // console.log(row.input_power_curve_list[0].children)
                    // row.power_curve_filename = ['list', this.getDefaultPowerCurveFileName(row.input_power_curve_list[0].children)];
                    // this.tmpRow = row;
                    // // console.log(this.tmpRow)
                    // this.upload();      
                    let that = this;   
                    this.$refs.curveDialog.open(row.turbine_type, false);
                }
                
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
            open (projectId, planId, turbineHeight, inputCfd) {
                this.initData();
                this.dialogVisible = true;
                this.projectId = projectId;
                this.planId = planId;
                this.ruleForm.selectWrgHeights = null;
                this.ruleForm.selectPowerCurves = [];
                this.inputCfd = inputCfd;
                // console.log(inputCfd);
                // console.log(this.dialogVisible)
            },
            close () {
                this.dialogVisible = false;
                this.$emit('closeFanAdd', 'coordinate');
                this.ruleForm.coordinateList = this.getDefaultCoordList();
                this.ruleForm.selectModel = null;
                this.ruleForm.selectPowerCurves = [];
                this.ruleForm.selectWrgHeights = null;
                // console.log(this.dialogVisible)
            },
            //机型事件
            onChange2(index ,row){
                //每个机型对应的曲线
                console.log(index , row , row.turbine_type)
                if(row.turbine_type == "自定义机型"){
                    this.$refs.typeDialog.open(false);
                    return;
                }
                // console.log(this.ruleForm.coordinateList)
                this.ruleForm.coordinateList[index].height = null;
                this.ruleForm.coordinateList[index].wrgHeights = null;

                util.ajax.get('/input_power_curve?turbine_type=' + row.turbine_type + '&user_id=' + this.$store.state.user.loginUserInfo.user_id).then((res) => {
                        if (res.data.code === 404) {
                            return;
                        }
                        if (res.data.code !== 200) {
                            this.$message.error(res.data.message);
                            return;
                        }
                        var arr = [];
                        if (res.data.data.length > 0) {
                            res.data.data.forEach((item) => {
                                arr.push({
                                    value: item.file_name,
                                    label: item.file_name
                                });
                            });
                        }
                            //导入联动全部
                            if(this.liandongAll){
                                this.liandongAll = false;
                                
                                this.ruleForm.coordinateList.forEach((item2,index2)=>{
                                    item2.turbine_type = row.turbine_type;
                                    item2.input_power_curve_list = [
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
                                    if (arr.length > 0) {
                                        //联动曲线
                                        this.ruleForm.coordinateList[index2].power_curve_filename = ['list', arr[arr.length - 1].value];
                                    } else {
                                        this.ruleForm.coordinateList[index2].power_curve_filename = [] ;
                                    }
                                })
                               
                            }
                            this.ruleForm.coordinateList[index].input_power_curve_list = [
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
                            if (arr.length > 0) {
                                // console.log(arr[arr.length - 1].value, arr) 
                                //联动曲线
                                this.ruleForm.coordinateList[index].power_curve_filename = ['list', arr[arr.length - 1].value];
                            } else {
                                this.ruleForm.coordinateList[index].power_curve_filename = [] ;
                            }
                        
                    }).catch(() => {
                        this.$message.error('获取功率曲线文件列表失败！');
                    });
                    
                    //联动高度
                    let arrHei = this.wrgHeights2[this.ruleForm.coordinateList[index].turbine_type];                  
                    let mm = [];
                    arrHei.forEach(function (value, i) {
                        mm.push({value: value, label: value});
                    });
                    this.ruleForm.coordinateList[index].wrgHeights = mm;
                    this.ruleForm.coordinateList[index].height = mm[0].value;
                    //联动全部高度
                    if(this.liandongAllheight){
                        this.liandongAllheight = false;
                        let arrHei2 = this.wrgHeights2[this.ruleForm.coordinateList[index].turbine_type];                  
                        let mm2 = [];
                        arrHei2.forEach(function (value, i) {
                            mm2.push({value: value, label: value});
                        });
                        this.ruleForm.coordinateList.forEach((item,index)=>{
                            item.wrgHeights = mm2;
                            item.height = mm2[0].value;
                        })
                    }
            },
            onChange (index , row) {
                // console.log(index,row)
                this.ruleForm.selectPowerCurves = [];              
                if (this.ruleForm.selectModel) {
                    // this.ruleForm.powerCurves = this.ruleForm.selectModel.replace(/[^a-zA-Z\d]/g, '_') + '.gfwtg';
                    util.ajax.get('/input_power_curve?turbine_type=' + this.ruleForm.selectModel + '&user_id=' + this.$store.state.user.loginUserInfo.user_id).then((res) => {
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
                            this.ruleForm.input_power_curve_list = [
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
                            if (arr.length > 0) {
                                this.ruleForm.selectPowerCurves = ['list', arr[arr.length - 1].value];
                            } else {
                                this.ruleForm.selectPowerCurves = [];
                            }
                        }
                    }).catch(() => {
                        this.$message.error('获取功率曲线文件列表失败！');
                    });
                    this.ruleForm.selectWrgHeights = null;
                    // console.log(this.wrgHeights,this.ruleForm.selectModel)
                    let arr = this.wrgHeights[this.ruleForm.selectModel];                  
                    let mm = [];
                    // console.log(arr)
                    arr.forEach(function (value, i) {
                        mm.push({value: value, label: value});
                    });
                    this.ruleForm.wrgHeights = mm;
                    // console.log(mm)
                }
            },
            //轮毂高度
            onChange3(index ,row){
                // console.log(index , row );
                if(this.liandongHeight){
                    this.liandongHeight = false;
                    // row.height
                    this.ruleForm.coordinateList.map((item,index)=>{
                        item.height = row.height;
                    })
                }
            },
            /**
             * 检测输入风机的经纬度是否合法（是否与现有风机重复）
             * @returns T:通过验证；F:没通过验证
             */
            checkFanLonlat (lon, lat) {
                let currentFans = this.$store.state.scheme.currentFans;
                // console.log(currentFans)
                for (let i = 0; i < currentFans.length; i++) {
                    if (currentFans[i].coordinate_x === Number(lon) && currentFans[i].coordinate_y === Number(lat)) {
                        return false;
                    }
                }
                return true;
            },
            checkFanLonlat2 (name) {
                let currentFans = this.$store.state.scheme.currentFans;
                // console.log(currentFans)  //nearest_turbine_name//
                for (let i = 0; i < currentFans.length; i++) {
                    if (currentFans[i].nearest_turbine_name === name ) {
                        return false;
                    }
                }
                return true;
            },
            submitForm (formName) {
            //防止点击过快,重复点击
            if(this.isClick){
                this.isClick = false
                
                var temp = [];
                var index = [];
                var temp0 = [];
                var index0 = [];
               
                for(var i = 0; i < this.ruleForm.coordinateList.length; i++) {
                    for(var j = i + 1; j < this.ruleForm.coordinateList.length; j++){
                        if ((this.ruleForm.coordinateList[i].coordinate_x == this.ruleForm.coordinateList[j].coordinate_x)&&(this.ruleForm.coordinateList[i].coordinate_y == this.ruleForm.coordinateList[j].coordinate_y)){
                            index.push(j)
                            i++;
                            j = i;
                        }
                        if ( this.ruleForm.coordinateList[i].turbine_name == this.ruleForm.coordinateList[j].turbine_name ){
                            index0.push(j)
                            i++;
                            j = i;
                        }
                    }
                    temp.push(this.ruleForm.coordinateList[i]);
                    temp0.push(this.ruleForm.coordinateList[i]);
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
                for(var i = 0 ; i < index0.length - 1; i ++){
                    for(var j = 0 ; j < index0.length - i - 1; j ++){
                        if(index0[j] > index0[j + 1]){	
                            var ls = index0[j];
                            index0[j] = index0[j + 1];
                            index0[j + 1] = ls;
                        }
                    }
                }
                var str = "";
                var str0 = "";
                for(let i=0; i<index0.length; i++){
                    str0 += (index0[i]+1)+",";
                }
                str = str.substring(0,str.length-1);
                str0 = str0.substring(0,str0.length-1);
                if(index.length>0) {
                    this.$message.error("第"+(str)+"个与之前坐标数据有重复");
                    this.zbStatus = false;
                }else {
                    this.zbStatus = true;
                }
                if(index0.length>0) {
                    this.$message.error("第"+(str0)+"个与之前编号有重复");
                    this.zbStatus0 = false;
                }else {
                    this.zbStatus0 = true;
                }

                let problemNums = [];
                for (let i = 0; i < this.ruleForm.coordinateList.length; i++) {
                    if (!this.checkFanLonlat(this.ruleForm.coordinateList[i].coordinate_x, this.ruleForm.coordinateList[i].coordinate_y)) {
                        problemNums.push(i + 1);
                    }
                }
                let problemNums2 = [];
                for (let i = 0; i < this.ruleForm.coordinateList.length; i++) {
                    if (!this.checkFanLonlat2(this.ruleForm.coordinateList[i].turbine_name)) {
                        problemNums2.push(i + 1);
                    }
                }

                if (problemNums.length > 0) {
                    this.$message.error('第' + problemNums + '个坐标与现有风机坐标重复');
                    return;
                }
                //是否与数据库重复
                if (problemNums2.length > 0) {
                    this.$message.error('第' + problemNums2.join(",") + '个编号与现有风机编号重复');
                    return;
                }

                for(var i = 0; i < this.ruleForm.coordinateList.length; i++) {
                    if (this.ruleForm.coordinateList[i].turbine_name == null){
                        this.$message.error("请输入风机编号");
                        this.zbStatus2 = false;
                    }else{
                        this.zbStatus2 = true;
                    }
                    if (this.ruleForm.coordinateList[i].turbine_type == null){
                        this.$message.error("请选择机型");
                        this.zbStatus3 = false;
                    }else{
                        this.zbStatus3 = true;
                    }
                    if (this.ruleForm.coordinateList[i].height == null){
                        this.$message.error("请选择轮毂高度");
                        this.zbStatus4 = false;
                    }else{
                        this.zbStatus4 = true;
                    }
                    // console.log( this.ruleForm.coordinateList )
                }
                
                let that = this;
                this.$refs[formName].validate((valid) => {
                    that.notOk = [];
                    if (valid && that.zbStatus && that.zbStatus0 && that.zbStatus2 && that.zbStatus3 && that.zbStatus4) {
                        const promises = that.ruleForm.coordinateList.map((value, index) => {
                            // console.log(value,index)
                            return new Promise((resolve, reject) => {
                                //根据红线区域判断是否超过风场范围
                                that.$emit('isOutOfFarm', parseInt(value.coordinate_x), parseInt(value.coordinate_y), (p, point) => {
                                    // console.log(p,point)
                                    that.points.push({index: index, point: point });
                                    // console.log(that.points)
                                    p.then((res) => {
                                        if (res) that.notOk.push(index);
                                        
                                        resolve();
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                                });
                            });
                        });
                        // console.log(that.notOk,"notOk")
                        Promise.all(promises)
                            .then(() => {
                                // console.log(that.notOk,"notOk>0是超出范围")
                                // console.log(that.ruleForm.coordinateList)
                                if (that.notOk.length === 0) {
                                    that.ruleForm.coordinateList && that.ruleForm.coordinateList.forEach((value, index) => {
                                       
                                        // let point = _.find(that.points, {index: index});
                                        //我修改---------
                                        // let point = that.points[that.points.length-1]
                                        let point = that.points[index]
                                       
                                        //为了添加多个不重叠，上面一行
                                        // console.log(point)
                                        let fanData = {
                                            equivalent_hours: 0,
                                            turbine_name: value.turbine_name,
                                            //把这里都换成每一个对应起来，从遍历里面取
                                            // turbine_type: that.ruleForm.selectModel,
                                            turbine_type: value.turbine_type,
                                            coordinate_x: value.coordinate_x,
                                            coordinate_y: value.coordinate_y,
                                            // height: that.ruleForm.selectWrgHeights,
                                            height: value.height,
                                            longitude: point.point.x,
                                            latitude: point.point.y,
                                            power_curve_filename: value.power_curve_filename[1] || []
                                            // power_curve_filename: that.ruleForm.selectPowerCurves[1] || null
                                        };
                                        console.log(fanData,"提交")
                                        that.$store.commit('addTurbine', fanData);
                                        that.$emit('fanAdded', fanData);
                                    });
                                    
                                    // this.dialogVisible = false;
                                    this.$emit('closeFanAdd', 'coordinate');
                                    this.dialogVisible = false;
                                    that.points = []
                                    
                                    // that.ruleForm.coordinateList = that.getDefaultCoordList();

                                    
                                } else {
                                    let arr = [];
                                    that.notOk.forEach(value => {
                                        arr.push(value);
                                        // console.log(that.ruleForm.coordinateList[value])
                                        // that.ruleForm.coordinateList.splice(value, 1, {
                                        //     coordinate_x: that.ruleForm.coordinateList[value].coordinate_x,
                                        //     coordinate_y: that.ruleForm.coordinateList[value].coordinate_y,
                                        //     turbine_name: that.ruleForm.coordinateList[value].turbine_name,
                                        //     height: that.ruleForm.coordinateList[value].height,
                                        //     turbine_type: that.ruleForm.coordinateList[value].turbine_type,
                                        //     power_curve_filename: that.ruleForm.coordinateList[value].power_curve_filename[0],
                                        //     input_power_curve_list: that.ruleForm.coordinateList[value].input_power_curve_list,
                                        //     failed: true
                                        // });
                                        that.ruleForm.coordinateList[value].failed = true;
                                    });
                                    this.$message.error('第' + arr.join(",") + '行坐标超出风场位置！');
                                }
                            })
                            .catch(err => {
                                console.error(`${err} is not ok`);
                            });
                    } else {
                        return false;
                    }
                });
                setTimeout(()=>{
                    this.isClick = true
                },1500)
            }
            },
            onOpen () {
                if (this.$refs['ruleForm']) {
                    this.$refs['ruleForm'].resetFields();
                    this.ruleForm.coordinateList = this.getDefaultCoordList();
                    // console.log(this.ruleForm.coordinateList)
                }
            },
            delAll(){
                this.$confirm('此操作将删除全部机位点, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                    })
                .then(() => {
                    
                    this.ruleForm.coordinateList = [];
                })
            },
            // 导入风机点位数据模板
            parseTurbineFile (option) {
                console.log(option)
                let that = this;
                const formData = new FormData();
                const file = option.file;
                const filename = file.name;
                const idx = filename.lastIndexOf('.');
                let ext = '';
                if (idx > -1) {
                    ext = filename.substring(idx + 1, filename.length);
                }
                if (ext !== 'txt') {
                    // this.resetInput();
                    this.$message.error('请选择扩展名为.txt的文件。');
                    return;
                }
                formData.append('xy_file', file, file.name);            
                option.headers['Content-Type'] = 'multipart/form-data';
                util.ajax.post(option.action, formData, {
                    headers: option.headers
                }).then((res) => {
                    if (res.data.code !== 201) {
                        that.$message.error('文件解析失败，请确保文件内容符合要求。');
                        // console.error(res.data.message);
                        return;
                    }
                    // if (res.data.data.length > 10) return that.$message.error('只能支持导入最多10个点位！');
                    // if ((res.data.data.length + that.ruleForm.coordinateList.length) > 11) return that.$message.error('只能支持导入最多10个点位！');
                    that.mergeCoordList(res.data.data);
                }).catch(() => {
                    if (that.loading) {
                        that.loading.close();
                    }
                    that.$message.error('文件上传失败');
                });
            },
            mergeCoordList (newlist) {
                console.log(newlist)  //后端修改了，需要传两个参数
                let templist = this.ruleForm.coordinateList || this.getDefaultCoordList();
                for (let i = 0; i < templist.length; i++) {
                    if (!templist[i].coordinate_x && !templist[i].coordinate_y) {
                        templist.splice(i, 1);
                        i--;
                    }
                }
                templist = templist.concat(newlist);
                templist.forEach((item,index)=>{
                    item.height= null;
                    item.turbine_type= null;
                    item.power_curve_filename= [];
                    item.input_power_curve_list=[
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
                    item.failed= false;
                    item.wrgHeights=[];
                })
                this.ruleForm.coordinateList = templist.length === 0 ? this.getDefaultCoordList() : templist;
                this.liandongAll = true;
                this.liandongAllheight = true;
                this.liandongHeight = true;
                // console.log(templist,4444,this.ruleForm.coordinateList)
            },
            getDefaultCoordList () {
                let that = this;
                return [
                    {
                        equivalent_hours: 0,
                        coordinate_x: null,
                        coordinate_y: null,
                        turbine_name: null,
                        height: null,
                        turbine_type: null,
                        power_curve_filename: [],
                        input_power_curve_list:[
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
                        failed: false,
                        wrgHeights:[]
                    }
                ];
            }
        }
    };
</script>

<style lang="less" scoped>
  /deep/ .el-table__empty-text{
  display: inline-block;
    width: 100% !important;
    border-right: 1px solid rgba(159, 164, 162, 0.5);
    border-left: 1px solid rgba(159, 164, 162, 0.5);
    height: 100%;
    line-height: 50px;
    box-sizing: border-box;
}
.mytable{
    border: 1px solid rgba(211, 219, 228, 0.6);
    width: 100%;
    text-align: center;
    color:rgba(212,239,246,0.9);
}
.coordinate-body {
    padding: 0 20px; 
    max-height: 300px;
    overflow-y: scroll; 
}
.upload-btn{
    color: rgba(51,200,111,0.6);
}
.coordinate-body{
    position: relative;
    .delAllIcon{
        position: absolute;
        right: 41px;
        top: 8px;
        z-index: 999;
    }
    .remove-btn {
        font-size: 18px;
        color: #33C86F;
        cursor: pointer;
        opacity: 0.7;
        &:hover {
        opacity: 1;
        }
    }
    .add-btn {
        height: 29px;
        line-height: 29px;
        text-align: center;
        border: 1px solid rgba(159,164,162,0.5);
        border-top: none;
        color: rgba(212,239,246,0.9);
        font-size: 14px;
        cursor: pointer;
        &:hover {
        color: #33C86F;
        }
    }
}
.coordinate-body .name-input{
    width: 70px !important;
}
.coordinate-body /deep/ .el-input--suffix{
    width: 100% !important;
}
/deep/ .el-input__icon{
    line-height: 0px !important;
}
.coordinate-body .el-select /deep/ .el-input__inner{
    color: rgba(51,200,111,0.7) !important;
    border: 1px solid #888d97 !important;
}
.icon-box{
    width: 30px;
    position: relative;
    .jingshiicon{
        position: absolute;
        right: -10px;
        top:5px;
    }
}
/deep/ .el-table tr td{
    padding: 3px 0 0 0 !important;
    border-bottom: none !important;
}
    .btnBox {
        text-align: center;
        margin-top: 20px;
    }
    .add-buttons-group{
        display: flex;
        justify-content: flex-start;
        color:rgba(212,239,246,0.9);
        font-size: 14px;
        margin-bottom: 10px;
        text-decoration: none;
        cursor: pointer;
        margin-left:20px;
    }
    .download-button a{
        color:rgba(212,239,246,0.9) !important;
        text-decoration: none;
    }
    .import-button{
        margin-left: 20px;
        text-decoration: none;
    }
    .tipShow{
        position: relative;
    }
    .tipShow .tooltip{
        position: absolute;
        top: -52px;
        right: -20px;
        border-radius: 20px;
        width: 295px;
        height: 28px;
        padding: 10px;
        color: #33C86F;
        line-height: 30px;
        text-align: justify;
        background: rgba(0, 24, 49, 1);
        border: 1px solid #D4EFF6;
        opacity: 1;
        z-index: 2003;
    }
    .tipShow .tooltip .tooltip-arrow-down{
        position: absolute;
        bottom: -10px;
        right: 15px;
        width: 20px;
        height: 10px;
        overflow: hidden;
    }
    .tipShow .tooltip .tooltip-arrow-down .arrow-down{
        width: 17px;
        height: 17px;
        background: #001831;
        border: 1px solid #D4EFF6;
        transform: rotate(45deg) scale(0.8, 0.8);
        display: inline-block;
        position: absolute;
        top: -10px;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s linear;
    }
    .fade-leave-active{
        transition: opacity .1s linear;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0
    }
/deep/ .el-cascader__label{
    color: rgba(51, 200, 111, 0.7) !important;
}
/deep/ .el-table__body{
    width: 792px !important;
}
    /* .forScrollBar>>>.el-select-dropdown.el-popper.gf-popper{
        border-color: rgba(64,158,255,0.3);
     
    }
    .forScrollBar>>>.gf-popper .el-select-dropdown__item.selected{
        display: none!important;
    }

    .forScrollBar>>>.el-input__suffix{
        display: none;
        
    }

    .forScrollBar>>>.el-select__caret{
        color: #d4eff6;
        font-size: 14px;
        transition: transform .3s;
        transform: rotate(180deg);
        line-height: 16px;
        cursor: pointer;
    }
    .coordinate-body {
        height: 280px!important;
        padding-left: 16px;
        
    }
    .coordinate-box {
        min-height: 100px!important;
        max-height: 150px!important;
        overflow: auto;
    }
    .coordinate-boxs {
        height: 47px!important;
    } */
</style>



