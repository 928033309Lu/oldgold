<template>
    <el-dialog :title="singleMode?'调整机型':'批量调整机型'"
               :modal="false"
               :visible.sync="dialogVisible" @close="onClose" @open="onOpen"
               width="30%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item v-if="singleMode" prop="unitNumber" label="机组编号：">
                {{ ruleForm.unitNumber }}
            </el-form-item>
            <el-form-item prop="selectModel" label="机型：">
                <el-select v-model="ruleForm.selectModel" 
                @visible-change="((value)=>{visibleChange( value, ruleForm.selectModel )})"
                @change="onChange1" popper-class="gf-popper" placeholder="请选择机型" style="width:100%;">
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
                        popper-class="powerCurve"
                        @change="handleChange(ruleForm.selectModel)">
                </el-cascader>
            </el-form-item>
            <el-form-item prop="selectHub" label="轮毂高度：">
                <el-select v-model="ruleForm.selectHub" @change="onChange2" popper-class="gf-popper" placeholder="请选择轮毂高度" style="width:100%;">
                    <el-option v-for="item in ruleForm.wrgHeightsList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
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
    import { mapActions } from 'vuex';
    import typeDialog from '../new-parameter-upload/type-dialog';
    import curveDialog from '../new-parameter-upload/curve-dialog';

    export default {
        name: 'fan-change',
        components:{
            typeDialog,
            curveDialog
        },
        props: [],
        data () {
            return {
                turbineOptions:[],
                singleMode: true, // 是否是设置单个风机参数
                first: true,
                dialogVisible: false,
                modified: false,
                modifiedHeight: false,
                ruleForm: {
                    unitNumber: '',
                    selectModel: null,
                    models: [],
                    selectHub: null,
                    wrgHeightsList: [],
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
                    ]
                },
                rules: {
                    selectModel: [
                        { required: true, message: '', trigger: 'change' }
                    ],
                    selectHub: [
                        { required: true, message: '请选择轮毂高度', trigger: 'change' }
                    ],
                    selectPowerCurves: [
                        { required: true, message: '请选功率曲线', trigger: 'change' }
                    ]
                },
                fanInfo: {},
                fans: null,
                oldFan: null, // 存储一份
                oldcurrentFans: null, // 存储一份
                oldTurbineType: ""
            };
        },
        computed: {
            wrgHeightsList () {
                return this.$store.state.turbineBase.turbinesWrgHeights;
            },
            userInfo(){
                return this.$store.state.user.loginUserInfo;
            }
        },
        mounted () {
           
        },
        methods: {
            ...mapActions(['getTurbinesPowerCurves']),
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
                    this.ruleForm.selectModel = this.oldTurbineType;
                }else{
                    let list = this.ruleForm.input_power_curve_list[0].children;
                    if(list.length>0){
                        this.ruleForm.selectPowerCurves = ['list',list[list.length-1].value];
                    }else{
                        this.ruleForm.selectPowerCurves = [];
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
                    this.ruleForm.selectModel = value;
                    that.loadTurbineTypeList(value, (list) => {
                        that.ruleForm.input_power_curve_list = [
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
                            this.ruleForm.selectPowerCurves = ['list',list[list.length-1].value];
                        }else {
                            this.ruleForm.selectPowerCurves = [];
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
                    that.ruleForm.input_power_curve_list[0].children = list;
                    if (list.length > 0) {
                        that.ruleForm.selectPowerCurves = ['list',list[list.length-1].value];
                    }else {
                        that.ruleForm.selectPowerCurves = [];
                    }
                });
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
            handleChange (value) {
                if (this.ruleForm.selectPowerCurves[0] === 'upload') {
                    // this.upload();
                    this.$refs.curveDialog.open(value, false);
                }
                this.modified = true;
            },
            open (fanInfo, fans = null) {
                this.oldFan = {...fanInfo};
                this.oldcurrentFans = [...this.$store.state.scheme.currentFans];
                // console.log(this.oldcurrentFans);
                this.first = true;
                this.fanInfo = fanInfo;
                this.fans = fans;
                this.singleMode = !fans;
                this.dialogVisible = true;
                if (this.ruleForm.models.length === 0) {
                    this.ruleForm.models = this.$store.state.turbineBase.turbinesList;
                    this.turbineOptions = this.ruleForm.models;
                }
                if (this.$refs['ruleForm']) {
                    this.$refs['ruleForm'].resetFields();
                }

                this.ruleForm.unitNumber = this.fanInfo.turbine_name ? this.fanInfo.turbine_name : '';
                this.ruleForm.selectModel = this.fanInfo.turbine_type ? this.fanInfo.turbine_type : null;
                this.ruleForm.selectHub = this.fanInfo.height ? this.fanInfo.height : null;
                // 取得轮毂高度列表
                let arr = this.wrgHeightsList[this.ruleForm.selectModel];
                let mm = [];
                arr.forEach(function (value, i) {
                    mm.push({value: value, label: value});
                });
                this.ruleForm.wrgHeightsList = mm;
               

                this.onChange1();
                this.modified = false;
                this.modifiedHeight = false;
            },
            close () {
                this.dialogVisible = false;
            },
            onChange1 (value) {
                if(value == "自定义机型"){
                    this.$refs.typeDialog.open(false);
                    return;
                }
                if (!this.ruleForm.selectModel) return;
                // util.ajax.get('/input_power_curve?turbine_type=' + this.ruleForm.selectModel + '&user_id=' + this.$store.state.user.loginUserInfo.user_id).then((res) => {
                //     if (res.data.code === 404) {
                //         return;
                //     }
                //     if (res.data.code !== 200) {
                //         this.$message.error(res.data.message);
                //         return;
                //     }
                //     if (res.data.data && res.data.data.length > 0) {
                //         let power = [];
                //         res.data.data.forEach((item) => {
                //             power.push({
                //                 value: item.file_name,
                //                 label: item.file_name
                //             });
                //         });
                //         // this.ruleForm.input_power_curve_list[0].children = arr;
                //         this.ruleForm.input_power_curve_list = [
                //             {
                //                 value: 'list',
                //                 label: '功率曲线库',
                //                 children: power
                //             },
                //             {
                //                 value: 'upload',
                //                 label: '自定义'
                //             }
                //         ];
                //         if (power.length > 0) {
                //             this.ruleForm.selectPowerCurves = ['list',power[power.length-1].value];
                //         } else {
                //             this.ruleForm.selectPowerCurves = [];
                //         }
                //         if (this.first) {
                //             if (this.fanInfo.power_curve_filename) {
                //                 this.ruleForm.selectPowerCurves = ['list',this.fanInfo.power_curve_filename];
                //             } else {
                //                 this.ruleForm.selectPowerCurves = ['list',power[power.length-1].value];
                //             }
                //             this.first = false;
                //         } else {
                //             this.ruleForm.selectHub = null;
                //         }
                //     }
                // }).catch(() => {
                //     this.$message.error('获取功率曲线文件列表失败！');
                // });

                this.getTurbinesPowerCurves({turbineType: this.ruleForm.selectModel, userId: this.$store.state.user.loginUserInfo.user_id}).then(power => {
                    this.ruleForm.input_power_curve_list = [
                        {
                            value: 'list',
                            label: '功率曲线库',
                            children: power
                        },
                        {
                            value: 'upload',
                            label: '自定义'
                        }
                    ];
                    if (power.length > 0) {
                        this.ruleForm.selectPowerCurves = ['list', power[power.length - 1].value];
                    } else {
                        this.ruleForm.selectPowerCurves = [];
                    }
                    if (this.first) {
                        if (this.fanInfo.power_curve_filename) {
                            this.ruleForm.selectPowerCurves = ['list', this.fanInfo.power_curve_filename];
                        } else {
                            this.ruleForm.selectPowerCurves = ['list', power[power.length - 1].value];
                        }
                        this.first = false;
                    } else {
                        this.ruleForm.selectHub = null;
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error('获取功率曲线文件列表失败！');
                });

                let arr = this.wrgHeightsList[this.ruleForm.selectModel];
                let mm = [];
                if (arr) {
                    arr.forEach(function (value, i) {
                        mm.push({value: value, label: value});
                    });
                }
                this.ruleForm.wrgHeightsList = mm;
                this.modified = true;
            },
            onChange2 () {
                this.modified = true;
                this.modifiedHeight = true;
            },
            submitForm (formName) {
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let fanData = that.singleMode ? {...that.fanInfo} : {};
                        // fanData.turbine_name = this.ruleForm.unitNumber;
                        fanData.turbine_type = that.ruleForm.selectModel;
                        // fanData.coordinate_x = this.ruleForm.coordinate_x;
                        // fanData.coordinate_y = this.ruleForm.coordinate_y;
                        fanData.height = that.ruleForm.selectHub;
                        fanData.power_curve_filename = that.ruleForm.selectPowerCurves[1] || null;
                        if (that.singleMode) {
                            that.modified && that.$emit('changeTurbineType', fanData, that.modifiedHeight, this.oldFan);
                        } else {
                            let turbinNames = [];
                            that.fans.forEach(row => {
                                turbinNames.push(row.turbine_name);
                            });
                            let turbinNamesStr = turbinNames.toString();
                            let turbinNumStr = '';
                            if (that.fans.length > 6) {
                                turbinNamesStr = turbinNames.toString().substring(0, 30) + '...';
                                turbinNumStr = '等' + that.fans.length + '个';
                            }
                            that.$alert('确认修改【' + turbinNamesStr + '】' + turbinNumStr + '风机的机型参数?', '提示', {
                                confirmButtonText: '确定',
                                center: true,
                                callback: action => {
                                    if (action === 'confirm') {
                                        that.$emit('changeTurbineListType', fanData, that.fans , that.oldcurrentFans);
                                    }
                                }
                            });
                        }
                        that.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            onClose () {
                this.$emit('close');
            },
            onOpen () {

            },
        }
    };
</script>

<style scoped>

    .btnBox {
        text-align: center;
        margin-top: 20px;
    }

</style>
