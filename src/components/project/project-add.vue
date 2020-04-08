<template>
    <my-dialog :title=" modifyFlag ? '编辑项目' : '添加项目' " :visible.sync="dialogVisible" @open="onOpen" @close="onClose" width="400px" :modal="false" custom-class="project-add-class" :closeOnClickModal="false">
        <div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm forScrollBar">
                <el-form-item prop="projectName">
                    <!-- <el-input id='inputName' v-model="ruleForm.projectName" @keyup.native="proving" placeholder="请输入项目名称" onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" oncontextmenu = "value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"></el-input> -->
                    <el-input id='inputName' v-model="ruleForm.projectName" placeholder="项目名称"></el-input>
                </el-form-item>
                <el-form-item prop="selectOwner" class="iconBottomBox">
                    <el-select v-if='modifyFlag' :disabled='true' v-model="ruleForm.selectOwner" popper-class="gf-popper" :popper-append-to-body="false" placeholder="请选择业主单位" style="width:100%;">
                        <el-option v-for="item in ruleForm.owners" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-else v-model="ruleForm.selectOwner" popper-class="gf-popper" :popper-append-to-body="false" placeholder="请选择业主单位" style="width:100%;">
                        <el-option v-for="item in ruleForm.owners" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <div class="iconBottom"></div>
                </el-form-item>
                <el-form-item prop="designCapacity" class="projectCapacity">
                    <div style="flex-direction: row;">
                        <el-input style="width:45%" v-model="ruleForm.designCapacity" placeholder="请填写项目容量"></el-input>
                        <span style="color: #D4EFF6; opacity: 0.5">MW</span>
                    </div>
                </el-form-item>
                <!--<el-form-item prop="latitude">-->
                <!--<el-input v-model.number="ruleForm.latitude" placeholder="请输入项目纬度"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item prop="longitude">-->
                <!--<el-input v-model.number="ruleForm.longitude" placeholder="请输入项目经度"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item prop="region" class="projectCapacity iconBottomBox">
                    <el-cascader v-model="ruleForm.region" style="width:70%" placeholder="选择位置" :options="ruleForm.provinces" popper-class="gf-popper" @active-item-change="handleItemChange">
                    </el-cascader>
                    <div class="iconBottom2"></div>
                </el-form-item>
                <el-form-item prop="description">
                    <el-input maxlength="200" type="textarea" :rows="2" class="description" v-model="ruleForm.description" placeholder="项目描述文字"></el-input>
                </el-form-item>
                <el-form-item class="btnBox">
                    <el-button class="gf-button" :disabled="onAdding" style="width:180px;margin-top:3px;" type="primary" @click="submitForm('ruleForm')">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </my-dialog>
</template>

<script>
import { getRules } from './rules';
import util from '@/libs/util';
import MyDialog from '../common/my-dialog';
const rules = getRules(true);

export default {
    name: 'project-add',
    components: { MyDialog },
    data () {
        return {
            dialogVisible: false,
            modifyFlag: false,
            oldProjectInfo: {},
            firstLoadCity: false,
            ruleForm: {
                projectName: '',
                designCapacity: '',
                description: '',
                selectOwner: null,
                region: [],
                // longitude: null,
                // latitude: null,
                provinces: [],
                owners: []
            },
            rules: rules,
            projectInfo: null,
            onAdding: false // 正在新建项目
        };
    },
    mounted () {
        util.ajax.get('/position', {}).then(res => {
            // console.log(JSON.stringify(res));
            let retData = res.data;
            if (retData.code !== 200) {
                this.$message.error(retData.message);
                return;
            }

            this.ruleForm.provinces = retData.data.map((ele, index, arr) => {
                // return {value: ele.province_id, label: ele.province_name, children: []};
                return { value: ele.province_name, id: ele.province_id, label: ele.province_name, children: [] };
            });
        }).catch((/* err */) => {
            this.$message.error('取得行政区划数据失败！');
        });
    },
    methods: {
        open (projectInfo) {
            this.dialogVisible = true;
            if (this.$refs['ruleForm']) {
                this.$refs['ruleForm'].resetFields();
            }
            util.ajax.get('/owners', {}).then(res => {
                let retData = res.data;
                if (retData.code !== 200) {
                    this.$message.error(retData.message);
                    return;
                }

                this.ruleForm.owners = retData.data.map((ele, index, arr) => {
                    return { value: ele.owner_id, label: ele.owner_name };
                });
            }).catch((/* err */) => {
                this.$message.error('取得业主清单数据失败！');
            });

            // 打开时带着项目信息，表示为编辑
            if (projectInfo) {
                this.firstLoadCity = true;
                this.modifyFlag = true;
                this.oldProjectInfo = projectInfo;
                this.ruleForm.projectName = projectInfo.project_name;
                this.ruleForm.designCapacity = projectInfo.design_capacity;
                this.ruleForm.description = projectInfo.description;
                this.ruleForm.selectOwner = projectInfo.owner_name;

                let selectRegion = [projectInfo.province, projectInfo.city, projectInfo.county];
                this.ruleForm.region = selectRegion;
                this.handleItemChange([projectInfo.province]);
                this.projectInfo = projectInfo;
            } else {
                this.modifyFlag = false;
                this.firstLoadCity = false;
                this.ruleForm.projectName = '';
                this.ruleForm.designCapacity = '50';
                this.ruleForm.description = '';
                this.ruleForm.selectOwner = null;
                this.ruleForm.region = [];
            }
        },
        close () {
            this.dialogVisible = false;
        },
        handleItemChange (val) {
            // console.log('active item:', JSON.stringify(val));
            // 选择省
            if (val.length === 1) {
                const selectProvinceCode = val[0];
                const provinceData = this.ruleForm.provinces.filter((data) => {
                    return (data.value === selectProvinceCode);
                });

                if (provinceData[0].children.length <= 0) {
                    this.queryCity(provinceData[0]);
                }
                // 选择城市
            } else if (val.length === 2) {
                const selectProvinceCode = val[0];
                const provinceData = this.ruleForm.provinces.filter((data) => {
                    return (data.value === selectProvinceCode);
                });
                const selectCityCode = val[1];
                const cityData = provinceData[0].children.filter((data) => {
                    return (data.value === selectCityCode);
                });

                if (cityData[0].children.length <= 0) {
                    cityData[0].children = this.queryCountry(provinceData[0], cityData[0]);
                }
            }
        },
        queryCity (province) {
            util.ajax.get('/position?province_id=' + province.id, {}).then(res => {
                let retData = res.data;
                if (retData.code !== 200) {
                    this.$message.error(retData.message);
                    return;
                }

                const citys = retData.data.map((ele, index, arr) => {
                    // return {value: ele.city_id, label: ele.city_name, children: []};
                    return { value: ele.city_name, id: ele.city_id, label: ele.city_name, children: [] };
                });

                province.children = citys;

                if (this.firstLoadCity && this.ruleForm.region && this.ruleForm.region.length > 2) {
                    this.firstLoadCity = false;
                    this.handleItemChange([this.oldProjectInfo.province, this.oldProjectInfo.city]);
                }
            }).catch((/* err */) => {
                this.$message.error('取得[行政区划-城市]数据失败！');
            });
        },
        queryCountry (province, city) {
            util.ajax.get('/position?province_id=' + province.id + '&city_id=' + city.id, {}).then(res => {
                let retData = res.data;
                if (retData.code !== 200) {
                    this.$message.error(retData.message);
                    return;
                }

                const countries = retData.data.map((ele, index, arr) => {
                    // return {value: ele.county_id, label: ele.county_name};
                    return { value: ele.county_name, id: ele.county_id, label: ele.county_name };
                });

                city.children = countries;
            }).catch((/* err */) => {
                this.$message.error('取得[行政区划-县区]数据失败！');
            });
        },
        submitForm (formName) {
            if (this.onAdding) return;
            this.onAdding = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var value = document.getElementById("inputName").value;
                    var reg = /^\d+$/;
                    if (reg.test(value) === true) {
                        this.$message.warning("项目名称不可以都是数字");
                        this.onAdding = false;
                        return false;
                    }
                    const ownerData = this.ruleForm.owners.filter((data) => {
                        return (data.value === this.ruleForm.selectOwner);
                    });
                    if (ownerData.length > 0) {
                        this.onAdding = false;
                        this.getLngLat(this.ruleForm.selectOwner);
                    } else {
                        util.ajax.post('/owners', {
                            owner_name: this.ruleForm.selectOwner
                        }).then(res => {
                            this.onAdding = false;
                            let retData = res.data;
                            if (retData.code === 201) {
                                this.$store.state.app.needRefreshProjectList = true;
                                this.getLngLat(retData.data.owner_id);
                            } else {
                                this.$message.error(retData.message);
                            }
                        }).catch((/* err */) => {
                            this.onAdding = false;
                            this.$message.error('保存项目信息失败！');
                        });
                    }
                } else {
                    this.onAdding = false;
                    this.$message.error('项目信息输入不正确！');                  
                }
            });
        },
        getLngLat (ownerId) {
            this.onAdding = true;
            // 调用高德API服务获取经纬度
            let province = this.ruleForm.region.length > 0 ? this.ruleForm.region[0] : '';
            let city = this.ruleForm.region.length > 1 ? this.ruleForm.region[1] : '';
            let county = this.ruleForm.region.length > 2 ? this.ruleForm.region[2] : '';
            let address = province + city + county;
            util.amap.get('/geocode/geo?address=' + address + '&key=' + util.amapKey, {
            }).then(res => {
                this.onAdding = false;
                console.log(res.data);
                let retData = res.data;
                if (retData.status === '1') {
                    let lnglat = retData.geocodes[0].location.split(',');
                    let lng = lnglat[0];
                    let lat = lnglat[1];
                    this.createProject(ownerId, lng, lat);
                } else {
                    this.$message.error(retData.info);
                }
            }).catch((/* err */) => {
                this.onAdding = false;
                this.$message.error('调用高德API服务失败！');
            });
        },
        createProject (ownerId, lng, lat) {
            let data = {
                project_name: this.ruleForm.projectName,
                design_capacity: parseFloat(this.ruleForm.designCapacity),
                description: this.ruleForm.description,
                owner_id: ownerId,
                // longitude: parseInt(lng),
                // latitude: parseInt(lat),
                longitude: lng,
                latitude: lat,
                location_province: this.ruleForm.region.length > 0 ? this.ruleForm.region[0] : '',
                location_city: this.ruleForm.region.length > 1 ? this.ruleForm.region[1] : '',
                location_county: this.ruleForm.region.length > 2 ? this.ruleForm.region[2] : ''
            };
            // 判断是否为编辑项目
            if (this.modifyFlag) {
                // 判断是否为仅修改了项目容量
                if (
                    this.projectInfo.design_capacity !== parseFloat(data.design_capacity)
                ) {
                    util.ajax.get('/get_calculation_status/' + this.oldProjectInfo.project_id).then(res => {
                        let retData = res.data;
                        if (retData.code === 200) {
                            if (retData.data === false) {
                                util.ajax.put('/projects/' + this.oldProjectInfo.project_id, data).then(res => {
                                    let retData = res.data;
                                    if (retData.code === 200) {
                                        this.$emit('close');
                                    } else {
                                        this.$message.error(retData.message);
                                    }
                                }).catch((/* err */) => {
                                    this.$message.error('更新项目失败！');
                                });
                            } else {
                                this.$confirm('若修改项目容量，则重新进行优化排布方案的计算，是否重新发起?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    util.ajax.put('/projects/' + this.oldProjectInfo.project_id, data).then(res => {
                                        let retData = res.data;
                                        if (retData.code === 200) {
                                            this.$message.success('保存成功!');
                                            util.ajax.put('/update_optimization/' + this.oldProjectInfo.project_id).then(res => {
                                                let retData = res.data;
                                                if (retData.code === 200) {
                                                    this.$message.success('发起重新计算成功!');
                                                    this.$emit('close');
                                                } else {
                                                    this.$message.error(retData.message);
                                                }
                                            }).catch((/* err */) => {
                                                this.$message.error('发起重新计算成功！');
                                            });
                                        } else {
                                            this.$message.error(retData.message);
                                        }
                                    }).catch((/* err */) => {
                                        this.$message.error('更新项目失败！');
                                    });
                                }).catch(() => { });
                            }
                        } else {
                            this.$message.error(retData.message);
                        }
                    }).catch((/* err */) => {
                        this.$message.error('检查项目状态失败！');
                    });
                } else {
                    this.onAdding = true;
                    util.ajax.put('/projects/' + this.oldProjectInfo.project_id, data).then(res => {
                        this.onAdding = false;
                        let retData = res.data;
                        if (retData.code === 200) {
                            this.$emit('close');
                        } else {
                            this.$message.error(retData.message);
                        }
                    }).catch((/* err */) => {
                        this.onAdding = false;
                        this.$message.error('更新项目失败！');
                    });
                }
            } else {
                this.onAdding = true;
                util.ajax.post('/projects', data).then(res => {
                    this.onAdding = false;
                    let retData = res.data;
                    if (retData.code !== 201) {
                        this.$message.error(retData.message);
                        return;
                    }
                    this.$emit('newProject', lng, lat, res.data.data);        
                    this.$emit('close');
                }).catch((/* err */) => {
                    this.onAdding = false;
                    this.$message.error('保存项目信息失败！');
                });
            }
        },
        onOpen () {
            // if (this.$refs['ruleForm']) {
            //     this.$refs['ruleForm'].resetFields();
            // }
        },
        onClose () {
            this.$emit('close');
        },
        proving (msg) {
            // var value = document.getElementById("inputName").value;
            // var reg=/^\d+$/;
            // if(reg.test(value)==true){
            //     this.$message.warning("都是数字！不通过");
            //     return false;
            // }else{
            // }
        }
    }
};
</script>

<style scoped>
.btnBox {
  text-align: center;
  height: 20px;
}

.forScrollBar >>> .el-select-dropdown.el-popper.gf-popper {
  border-color: rgba(64, 158, 255, 0.5);
  /*top: 289px!important;*/
}
.forScrollBar >>> .gf-popper .el-select-dropdown__item.selected {
  display: none !important;
}

.forScrollBar >>> .el-input__suffix {
  display: none;
  /*修改存疑*/
}

.forScrollBar >>> .el-select__caret {
  color: #d4eff6;
  font-size: 14px;
  transition: transform 0.3s;
  transform: rotate(180deg);
  line-height: 16px;
  cursor: pointer;
}
.customClassNum {
    background: #ff0;
}
.el-form-item:nth-child(4) .el-dialog__wrapper .el-dialog .el-dialog__body .el-form-item__content .el-form-item__error{
    background: red;
}
/* .projectCapacity >>> .el-form-item__error {
    text-align: center;
} */
.iconBottomBox{
    position: relative;
}
.iconBottom,.iconBottom2{
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -7px;
    width: 7px;
    height: 7px;
    border-bottom: 2px solid #6F7A8A;
    border-right: 2px solid #6F7A8A;
    transform: rotate(45deg);
}
.iconBottom2{
    left: 65%;
}
</style>
