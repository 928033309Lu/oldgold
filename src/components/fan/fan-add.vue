<template>
    <el-dialog title="添加风机"
               :visible.sync="dialogVisible" @open="onOpen"
               width="800px"
               :modal="false"
               :before-close="beforeClose"
               custom-class="dialogBox"
    >
        <el-form  ref="ruleForm"  :show-message="false">
            <el-table class="gf-table need-border content-table" :data="ruleForm" min-height= "50" max-height="250">
                <el-table-column width="80px" label="风机编号" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-form-item >
                            <!-- :prop="scope.$index+'.turbine_name'"
                        :rules="{validator: coordinateName, trigger: 'change'}"  -->
                            <el-input v-model="scope.row.turbine_name"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="机型" width="130px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-form-item 
                        >
                            <el-select :disabled="dataLoading" v-model="scope.row.selectModel" 
                            @visible-change="((value)=>{visibleChange( value, scope.row.selectModel )})"
                            @change="onChange" popper-class="gf-popper" placeholder="请选择" style="width:100%;">
                                <el-option v-for="item in scope.row.models"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="风速" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-form-item 
                            >
                            <span style="color: #d4eff6;opacity: 0.5;">{{ scope.row.speed  | numFilter}} m/s</span>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="经度" width="100px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-form-item 
                            >
                            <span style="color: #d4eff6;opacity: 0.5;">{{ scope.row.lon  | numFilter}}</span>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="纬度" width="100px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-form-item 
                            >
                            <span style="color: #d4eff6;opacity: 0.5;">{{ scope.row.lat  | numFilter}}</span>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="轮毂高度" min-width="90px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-form-item 
                        >
                            <el-select v-model="scope.row.selectWrgHeights"  @change="onChangeHeight" popper-class="gf-popper" placeholder="请选择" style="width:100%;">
                                <el-option v-for="item in scope.row.wrgHeights"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="功率曲线" width="140px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-form-item 
                        >
                            <el-cascader
                                    placeholder="请选择"
                                    style="width:100%;"
                                    :options="scope.row.input_power_curve_list"
                                    v-model="scope.row.selectPowerCurves"
                                    :show-all-levels="false"
                                    popper-class="gf-popper"
                                    @change="handleChange(scope.row.selectModel)">
                            </el-cascader>
                        </el-form-item>
                    </template>
                </el-table-column>
               
            </el-table>
        </el-form>
        <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="fromBox" label-position="left" label-width="100px">
            <el-form-item label="风机编号：" prop="turbine_name">
                    <el-input v-model="ruleForm.turbine_name"></el-input>
            </el-form-item>
            <el-form-item label="风速：">
                <span style="color: #d4eff6;opacity: 0.5;">{{ ruleForm.speed  | numFilter}} m/s</span>
            </el-form-item>
            <el-form-item label="经度：">
                <span style="color: #d4eff6;opacity: 0.5;">{{ ruleForm.lon  | numFilter}}</span>
            </el-form-item>
            <el-form-item label="纬度：">
                <span style="color: #d4eff6;opacity: 0.5;">{{ ruleForm.lat  | numFilter}}</span>
            </el-form-item>
            <el-form-item prop="selectModel" label="机型：">
                <el-select :disabled="dataLoading" v-model="ruleForm.selectModel" @change="onChange" popper-class="gf-popper" placeholder="请选择机型" style="width:100%;">
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
        <el-upload
                class="upload-demo"
                action="/input_power_curve"
                :http-request="httpRequest"
                :show-file-list="false"
                :on-success="onSuccessHandle"
                :on-error='onErrorHandle'
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
    import typeDialog from '../new-parameter-upload/type-dialog';
    import curveDialog from '../new-parameter-upload/curve-dialog';
    export default {
        name: 'fan-change',
        components:{
            typeDialog,
            curveDialog
        },
        props: {
        },
        data () {
            var validatorName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入编号'));
                } 
                else if (!/^[A-Za-z0-9-]{1,10}$/.test(value)) {
                    callback(new Error('允许输入数字、字母、中划线、字符不超10'));
                }
                else if (!/^[\w.-]{1,10}$/.test(value)) {
                    callback(new Error('允许输入数字、字母、中划线、字符不超10'));
                }
                else {
                    callback();
                }
            };
            return {
                dataLoading: true, //是否禁用下拉菜单
                isClick : true, //防止双击
                dialogVisible: false,
                nextTab: false,
                // ruleForm: {
                //     turbine_name: null,
                //     unitNumber: '',
                //     speed: null,
                //     lon: null,
                //     lat: null,
                //     selectModel: null,
                //     models: [],
                //     selectPowerCurves: [],
                //     input_power_curve_list: [
                //         {
                //             value: 'list',
                //             label: '功率曲线库',
                //             children: []
                //         },
                //         {
                //             value: 'upload',
                //             label: '自定义'
                //         }
                //     ],
                //     powerCurves: [],
                //     selectWrgHeights: null,
                //     wrgHeights: []
                // },
                ruleForm: [{
                    turbine_name: '',
                    unitNumber: '',
                    speed: null,
                    lon: null,
                    lat: null,
                    selectModel: null,
                    models: [],
                    selectPowerCurves: [],
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
                    wrgHeights: []
                }],
                wrgHeights: {},
                rules: {
                    turbine_name: [
                        
                        { validator: validatorName, trigger: 'change' }
                    ],
                    unitNumber: [
                        {required: true, message: '请输入机组编号', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在1到100个字符', trigger: 'blur'}
                    ],
                    selectModel: [
                        { required: true, message: '请选择机型！', trigger: 'change' }
                    ],
                    selectWrgHeights: [
                        { required: true, message: '请选择轮毂高度！', trigger: 'change' }
                    ],
                    selectPowerCurves: [
                        { required: true, message: '请选功率曲线！', trigger: 'blur' }
                    ]
                },
                projectId: "",
                pointX: "",
                pointY: "",
                currentPlanMode: "wt",
                turbineOptions: [],
                oldTurbineType: null
            };
        },
        watch: {
            'ruleForm.selectPowerCurves' (nw,old) {
                
            }
        },
        computed:{
           //风机编号
           coordinateName(){
                return  this.coordinateName1;
            },
            userInfo(){
                return this.$store.state.user.loginUserInfo;
            }
        },
        mounted () {
            // this.ruleForm.selectModel = null;
            // this.ruleForm.selectPowerCurves = [];
            
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
            visibleChange(isTrue, value){
                // console.log(value);
                if(isTrue){
                    this.oldTurbineType = value;
                }
            },
            restoreType(isTrue, optimize){
                console.log(isTrue, optimize);
                if(isTrue){
                    this.ruleForm[0].selectModel = this.oldTurbineType;
                }else{
                    let list = this.ruleForm[0].input_power_curve_list[0].children
                    if(list.length>0){
                        this.ruleForm[0].selectPowerCurves = ['list',list[list.length-1].value];
                    }else{
                        this.ruleForm[0].selectPowerCurves = [];
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
                    this.ruleForm[0].selectModel = value;
                    that.loadTurbineTypeList(value, (list) => {
                        that.ruleForm[0].input_power_curve_list = [
                                {
                                    value: 'list',
                                    label: '功率曲线库',
                                    children: list
                                },
                                {
                                    value: 'upload',
                                    label: '自定义'
                                }
                            ];
                        if (list.length > 0) {
                            this.ruleForm[0].selectPowerCurves = ['list',list[list.length-1].value];
                        }else {
                            this.ruleForm[0].selectPowerCurves = [];
                        }
                    });
                    that.turbineOptions.unshift({
                        key:'T'+ Math.floor(Math.random()*10000),
                        value: value,
                        label: value
                    })

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
                    that.ruleForm[0].input_power_curve_list[0].children = list;
                    if (list.length > 0) {
                        that.ruleForm[0].selectPowerCurves = ['list',list[list.length-1].value];
                    }else {
                        that.ruleForm[0].selectPowerCurves = [];
                    }
                });
            },
            initData(){
                this.ruleForm[0].selectModel = null;
                this.ruleForm[0].selectPowerCurves = [];
                // 取得机型列表
                util.ajax.get('/properties/'+ this.$store.state.user.loginUserInfo.user_id +'?key=turbines', {}).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }

                    // this.ruleForm.models = retData.data.items.map((ele, index, arr) => {
                    this.ruleForm[0].models = retData.data.items.map((ele, index, arr) => {
                        return {value: ele, label: ele};
                    });
                    this.ruleForm[0].models.push({
                            value: "自定义机型",
                            label: "自定义机型"
                        });
                    this.turbineOptions = this.ruleForm[0].models;
                }).catch((/* err */) => {
                    this.$message.error('取得机型数据失败！');
                });

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
            // 关闭前回调
            beforeClose (done) {
                // this.$emit('closeFanAdd', 'add');
                // this.ruleForm.selectModel = null;
                // this.ruleForm.selectPowerCurves = [];
                this.ruleForm[0].selectModel = null;
                this.ruleForm[0].selectPowerCurves = [];
                // this.$emit('onDistribute', 'add', false);
                done();

                // console.log("111")
                this.Bus.$emit("isOpenAddOne",false)
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
            onErrorHandle() {
                this.$message.error('上传自定义功率曲线失败');
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
                // formData.append('turbine_type', this.ruleForm.selectModel);
                formData.append('turbine_type', this.ruleForm[0].selectModel);
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
            handleChange (value) {
                console.log(value)
                // if (this.ruleForm.selectPowerCurves[0] === 'upload') {
                if (this.ruleForm[0].selectPowerCurves[0] === 'upload') {
                    // this.upload();
                    this.$refs.curveDialog.open(value, false);
                }
            },
            onChangeHeight(val){
                // console.log(val)
                this.ruleForm[0].speed = "";
                let args = this.currentPlanMode ? 'of' : 'wt';
                util.ajax.get('/fastspeed/' + this.projectId + '/wind-speed?x=' + this.pointX + '&y=' + this.pointY + '&mode=' + args + '&h=' + val, {}).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error('取得风速:' + retData.message);
                        this.ruleForm[0].speed = "";
                        return;
                    }
                    if(retData.data.speed != -1 && retData.data.speed){
                        this.ruleForm[0].speed = retData.data.speed;
                    }else{
                        this.$message.error('该高度不支持添加风机');
                    }
                }).catch((/* err */) => {
                    this.$message.error('取得风速失败！');
                });

            },
            open (type, lan, lat, point, projectId, turbineHeight, currentPlanMode) {
                this.projectId = projectId;
                this.pointX = point.x;
                this.pointY = point.y;
                this.currentPlanMode = currentPlanMode;

                this.initData();
                this.ruleForm[0].lon = null;
                this.ruleForm[0].lat = null;
                this.ruleForm[0].speed = null;
                this.ruleForm[0].selectModel = null;
                this.dataLoading = true;
                // console.log(point);
                if (!type) {
                    // 取得风速
                    // args:of：GoldFoam模式；wt：WT模式
                    let args = currentPlanMode ? 'of' : 'wt';
                    //新接口
                    util.ajax.get('/fastspeed/' + projectId + '/wind-speed?x=' + point.x + '&y=' + point.y + '&mode=' + args, {}).then(res => {
                        let retData = res.data;
                        if (retData.code !== 200) {
                            this.$message.error('取得风速:' + retData.message);
                            return;
                        }
                        // console.log(turbineHeight)
                        // this.dialogVisible = true;
                        // this.ruleForm.lon = lan;
                        // this.ruleForm.lat = lat;
                        // this.ruleForm.coordinate_x = point.x;
                        // this.ruleForm.coordinate_y = point.y;
                        // this.ruleForm.speed = retData.data.speed;
                        // this.ruleForm.powerCurves = null;
                        // this.ruleForm.selectPowerCurves = [];
                        // this.ruleForm.unitNumber = null;
                        this.ruleForm[0].lon = lan;
                        this.ruleForm[0].lat = lat;
                        this.ruleForm[0].coordinate_x = point.x;
                        this.ruleForm[0].coordinate_y = point.y;
                        this.ruleForm[0].speed = retData.data.speed;
                        this.ruleForm[0].powerCurves = null;
                        this.ruleForm[0].selectPowerCurves = [];
                        this.ruleForm[0].unitNumber = null;
                        
                        // this.ruleForm.selectWrgHeights = null;
                        this.ruleForm[0].selectWrgHeights = null;

                        this.dataLoading = false;
                    }).catch((/* err */) => {
                        this.$message.error('取得风速失败！');
                    });
                }
                this.dialogVisible = true;
                // todo 调用接口获取风机编号
                // 取得轮毂高度列表
                util.ajax.get('/properties/'+ this.$store.state.user.loginUserInfo.user_id +'?key=turbine_height', {}).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        this.$message.error(retData.message);
                        return;
                    }

                    this.wrgHeights = retData.data.items;
                }).catch((/* err */) => {
                    this.$message.error('取得轮毂高度失败！');
                });
            },
            close () {
                this.dialogVisible = false;
            },
            onChange (value) {
                // console.log(value);
                if(value == "自定义机型"){
                    this.$refs.typeDialog.open(false);
                    return;
                }

                // this.ruleForm.selectPowerCurves = [];
                this.ruleForm[0].selectPowerCurves = [];
                // if (this.ruleForm.selectModel) {
                if (this.ruleForm[0].selectModel) {
                    // this.ruleForm.powerCurves = this.ruleForm.selectModel.replace(/[^a-zA-Z\d]/g, '_') + '.gfwtg';
                    // util.ajax.get('/input_power_curve?turbine_type=' + this.ruleForm.selectModel + '&user_id=' + this.$store.state.user.loginUserInfo.user_id).then((res) => {
                    util.ajax.get('/input_power_curve?turbine_type=' + this.ruleForm[0].selectModel + '&user_id=' + this.$store.state.user.loginUserInfo.user_id).then((res) => {
                        if (res.data.code === 404) {
                            return;
                        }
                        if (res.data.code !== 200) {
                            this.$message.error(res.data.message);
                            return;
                        }
                        var arr = [];
                        if (res.data.data && res.data.data.length > 0) {
                            res.data.data.forEach((item) => {
                                arr.push({
                                    value: item.file_name,
                                    label: item.file_name
                                });
                            });
                            
                        }
                        this.ruleForm[0].input_power_curve_list = [
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
                            // this.ruleForm.selectPowerCurves = ['list',arr[arr.length-1].value];
                            this.ruleForm[0].selectPowerCurves = ['list',arr[arr.length-1].value];
                        }else {
                            // this.ruleForm.selectPowerCurves = [];
                            this.ruleForm[0].selectPowerCurves = [];
                        }
                    }).catch(() => {
                        this.$message.error('获取功率曲线文件列表失败！');
                    });
                    // this.ruleForm.selectWrgHeights = null;
                    this.ruleForm[0].selectWrgHeights = null;
                    // let arr = this.wrgHeights[this.ruleForm.selectModel];
                    let arr = this.wrgHeights[this.ruleForm[0].selectModel];
                    let mm = [];
                    arr.forEach(function (value, i) {
                        mm.push({value: value, label: value});
                    });
                    // this.ruleForm.wrgHeights = mm;
                    this.ruleForm[0].wrgHeights = mm;
                }
            },
            checkFanLonlat (coordinate_x, coordinate_y) {
                let currentFans = this.$store.state.scheme.currentFans;
                for (let i = 0; i < currentFans.length; i++) {
                    if (currentFans[i].coordinate_x === coordinate_x && currentFans[i].coordinate_y === coordinate_y ) {
                        return currentFans[i].turbine_name;
                    }
                }
                return undefined;
            },
            checkFanName (name) {
                let currentFans = this.$store.state.scheme.currentFans;
                // console.log(currentFans)
                for (let i = 0; i < currentFans.length; i++) {
                    if (currentFans[i].turbine_name === name ) {
                        return currentFans[i].turbine_name;
                    }
                }
                return undefined;
            },
            
            submitForm (formName) {
                if(this.isClick){
                    this.isClick = false;

                    let sameFanName=this.checkFanLonlat(this.ruleForm[0].coordinate_x,this.ruleForm[0].coordinate_y);
                    let sameFanName2=this.checkFanName(this.ruleForm[0].turbine_name);
                    if(this.ruleForm[0].turbine_name == ""){
                        this.$message.error('请输入风机编号');
                        this.nextTab = false;
                    }
                    else if( sameFanName ){
                        this.$message.error('风机坐标与现有风机'+sameFanName+'重复!');
                        this.nextTab = false;
                    } else if( sameFanName2 ){
                        this.$message.error('风机坐标与现有风机'+sameFanName2+'重复!');
                        this.nextTab = false;
                    }
                    else {
                        this.nextTab = true;
                    }
                    if(this.nextTab){
                    // this.$refs[formName].validate((valid) => {
                    //     if (valid) {
                            let fanData = {
                                equivalent_hours: 0,
                                speed: this.ruleForm[0].speed,
                                turbine_name: this.ruleForm[0].turbine_name,
                                turbine_type: this.ruleForm[0].selectModel,
                                coordinate_x: this.ruleForm[0].coordinate_x,
                                coordinate_y: this.ruleForm[0].coordinate_y,
                                height: this.ruleForm[0].selectWrgHeights,
                                longitude: this.ruleForm[0].lon,
                                latitude: this.ruleForm[0].lat,
                                power_curve_filename: this.ruleForm[0].selectPowerCurves[1] || null
                            };
                            if(fanData.turbine_type == null){
                                this.$message.error('请选择机型');
                            }
                            else if(fanData.power_curve_filename==null) {
                                this.$message.error("请选择功率曲线!");                            
                            }
                            else if(fanData.height == null){
                                this.$message.error('请选择轮毂高度');
                            }
                            else if(fanData.speed == -1 || !fanData.speed){
                                this.$message.error('此高度没有相对应的风速，请重新选择高度！');
                            }
                            else {
                                this.$store.commit('addTurbine', fanData);
                                this.dialogVisible = false;
                                this.$emit('fanAdded', fanData);
                                console.log(this.$store.state.scheme.currentFans);
                            }
                    //     } else {
                    //         return false;
                    //     }
                    // });
                    }

                    setTimeout(()=>{
                        this.isClick = true
                    },1000)
                }
            },
            onOpen () {
                if (this.$refs['ruleForm']) {
                    this.$refs['ruleForm'].resetFields();
                }
            }
        }
    };
</script>

<style scoped>

    .btnBox {
        text-align: center;
        margin-top: 20px;
    }

    .forScrollBar>>>.el-select-dropdown.el-popper.gf-popper{
        border-color: rgba(64,158,255,0.3);
        /*top: 289px!important;*/
    }
    .forScrollBar>>>.gf-popper .el-select-dropdown__item.selected{
        display: none!important;
    }

    .forScrollBar>>>.el-input__suffix{
        display: none;
        /*修改存疑*/

    }

    .forScrollBar>>>.el-select__caret{
        color: #d4eff6;
        font-size: 14px;
        transition: transform .3s;
        transform: rotate(180deg);
        line-height: 16px;
        cursor: pointer;
    }
    >>> .el-input__icon{
        line-height: 0px !important;
    }
    >>> .el-input__inner{
        height: 30px !important;
        border: 1px solid rgba(212, 239, 246, 0.5) !important;
    }
</style>
