<template>
    <el-dialog title="价格"
               :visible.sync="dialogVisible"
               @close="onClose"
               @open="onOpen"
               width="30%"
               class="my-dialog"
               :modal="false"
    >
        <el-form :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm"
                 label-width="140px">
            <el-radio-group v-model="ruleForm.selectModel" @change="radioSelect" size="small">
                <el-radio-button v-for="item in ruleForm.models"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                </el-radio-button>
            </el-radio-group>

            <el-form-item label="机组数量：">
                <div style="flex-direction: row;">
                    <span style="color: #D4EFF6; opacity: 0.5">{{ruleForm.count}}台</span>
                </div>
            </el-form-item>
            <el-form-item prop="price" label="机组单价：">
                <div style="flex-direction: row;">
                    <el-input style="width:60%" v-model="ruleForm.price" placeholder="请填写机组单价" :onchange="isUpdate=true"></el-input>
                    <span style="color: #D4EFF6; opacity: 0.5"> 元/KW</span>
                </div>
            </el-form-item>
            <el-form-item prop="lifting_price" label="单台吊装价格：">
                <div style="flex-direction: row;">
                    <el-input style="width:60%" v-model="ruleForm.lifting_price" placeholder="请填写单台吊装价格" :onchange="isUpdate=true"></el-input>
                    <span style="color: #D4EFF6; opacity: 0.5">万元</span>
                </div>
            </el-form-item>
            <el-form-item prop="anchor_price" label="锚栓单价：">
                <div style="flex-direction: row;">
                    <el-input style="width:60%" v-model.trim="ruleForm.anchor_price" placeholder="请填写锚栓单价" :onchange="isUpdate=true"></el-input>
                    <span style="color: #D4EFF6; opacity: 0.5">元/吨</span>
                </div>
            </el-form-item>
            <el-form-item class="btnBox center-sp">
                <el-button class="gf-button" style="width: 208px;" type="primary" @click="submitForm('ruleForm')">保存
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import util from '@/libs/util';
    import _ from 'lodash';

    export default {
        name: 'fan-price',
        props: {},
        data: function () {
            const regex = /^[1-9]\d*$/u;
            let validatePlus = (rule, value, callback) => {
                if (!regex.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            // const regexPoint = /^\d+(\.\d?)?$/u;
            const regexPoint = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/u;
            let validatePoint = (rule, value, callback) => {
                if (!regexPoint.test(value)) {
                    callback(new Error('请输入正整数或保留一位小数'));
                    // callback(new Error('请输入正浮点型，>0'));
                } else {
                    callback();
                }
            };
            // const regex4Point = /^\d+(\.\d{1,4})?$/u;
            const regex4Point = /^[1-9]\d*$/u;
            let validate4Point = (rule, value, callback) => {
                if (!regex4Point.test(value)) {
                    // callback(new Error('请输入正整数或至多保留四位小数'));
                    callback(new Error('请输入正整数，>0'));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible: false,
                isUpdate: false,
                extraMap: new Map(),
                ruleForm: {
                    projectId: '',
                    planId: '',
                    selectModel: null,
                    models: [],
                    price: null,
                    count: null,
                    tower_price: 8000,
                    rebar_price: 6500,
                    preSelectModel: null,
                    anchor_price: null,
                    lifting_price: null
                },
                lifting_price: {},
                rules: {
                    selectModel: [
                        {required: true, message: '请选择机型！', trigger: 'change'}
                    ],
                    price: [
                        {required: true, message: '请填写机组单价！', trigger: 'change'},
                        {validator: validatePlus, trigger: 'change'}
                    ],
                    lifting_price: [
                        {required: true, message: '请填写单台吊装价格！', trigger: 'change'},
                        {validator: validatePoint, trigger: 'change'}
                    ],
                    anchor_price: [
                        {required: true, message: '请填写锚栓单价！', trigger: 'change'},
                        {validator: validate4Point, trigger: 'change'}
                    ]
                },
                originTower: []
            };
        },
        computed: {
            // 经过替换后的风机组数组
            approveTower() {
                // 取出不同的部分数组
                let diffArr = _.differenceBy(this.scheme.originFans, this.scheme.typeChanges, 'turbine_name');
                // 把不同的部分数组与更换后的数组合并
                return _.concat(diffArr, this.scheme.typeChanges);
            },
            // 增加的风机组容量
            addFansTower() {
                return this.scheme.addFans;
            },
            // 实时风机组容量=经过替换后的风机组容量+增加的风机组容量-删除的风机组容量
            currentTower() {
                let tmpTower = _.concat(this.approveTower, this.addFansTower);
                for (let fan in this.scheme.delFans) {
                    let index = _.findIndex(tmpTower, ['turbine_id', this.scheme.delFans[fan]]);
                    tmpTower.splice(index, 1);
                }
                return tmpTower;
            },
            scheme() {
                return this.$store.state.scheme;
            },
            fanPrice: function () {
                let obj;
                obj = JSON.parse(JSON.stringify(this.$store.state.scheme.fanPrice));
                return obj;
            }
        },
        methods: {
            // 机组单价追加全表单合法性验证
            reValidAllPrice () {
                let valid = true;
                const regexPlus = /^[1-9]\d*$/u;
                this.extraMap.forEach(model => {
                    if (model === '') {
                        valid = false;
                    }
                    if (model === 0) {
                        valid = false;
                    }
                    if (isNaN(model) || !regexPlus.test(model)) {
                        valid = false;
                    }
                });
                return valid;
            },
            // 单台吊装价格追加全表单合法性验证
            reValidAllLiftingPrice () {
                let valid = true;
                const regexFloat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/u;
                Object.values(this.lifting_price).forEach(model => {
                    if (model === '') {
                        valid = false;
                    }
                    if (model === 0) {
                        valid = false;
                    }
                    if (isNaN(model) || !regexFloat.test(model)) {
                        valid = false;
                    }
                });
                return valid;
            },
            open(projectId, planId) {
                if (this.$refs['ruleForm']) {
                    this.$refs['ruleForm'].resetFields();
                }

                this.projectId = projectId;
                this.planId = planId;
                this.dialogVisible = true;
                this.ruleForm.models = [];

                // this.fanPrice = this.$store.state.scheme.fanPrice;
                this.ruleForm.electric_price = this.fanPrice.electric_price;
                this.ruleForm.tower_price = this.fanPrice.tower_price;// 钢塔单价
                this.ruleForm.rebar_price = this.fanPrice.rebar_price;  // 钢筋单价
                this.ruleForm.tower_weight = this.fanPrice.tower_weight;
                this.ruleForm.anchor_price = this.fanPrice.anchor_price;
                // this.lifting_price = this.fanPrice.lifting_price;

                // 机型价格解析
                this.extraMap = new Map();
                this.fanPrice.extraMap.forEach(model => {
                    if (this.towerCount(model[0]) > 0) {
                        this.ruleForm.models.push({value: model[0], label: model[0]});
                        this.extraMap.set(model[0], model[1]);
                        this.lifting_price[model[0]] = this.fanPrice.lifting_price[model[0]];
                    }
                });
                this.ruleForm.selectModel = this.ruleForm.models[0].value;
                this.preSelectModel = this.ruleForm.selectModel;
                this.ruleForm.lifting_price = this.lifting_price[this.preSelectModel];
                this.ruleForm.price = this.extraMap.get(this.ruleForm.selectModel);

                this.ruleForm.count = this.towerCount(this.ruleForm.selectModel);
            },
            close() {
                this.dialogVisible = false;
            },
            radioSelect() {
                // TODO 记录点击事件前的机型价格
                this.lifting_price[this.preSelectModel] = parseFloat(this.ruleForm.lifting_price);
                this.extraMap.set(this.preSelectModel, parseInt(this.ruleForm.price));
                this.ruleForm.price = this.extraMap.get(this.ruleForm.selectModel);
                this.preSelectModel = this.ruleForm.selectModel;
                this.ruleForm.count = this.towerCount(this.ruleForm.selectModel);
                this.ruleForm.lifting_price = this.lifting_price[this.preSelectModel];
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isUpdate) {
                            this.$refs[formName].validate((valid) => {
                                if (valid) {
                                    this.extraMap.set(this.preSelectModel, parseInt(this.ruleForm.price));
                                    this.lifting_price[this.preSelectModel] = parseFloat(this.ruleForm.lifting_price);
                                    // 追加全表单合法性验证
                                    if (!this.reValidAllPrice() || !this.reValidAllLiftingPrice()) {
                                        this.$message.error('存在不正确的数据项，请检查！');
                                        return;
                                    }

                                    let fanData = {
                                        electric_price: parseFloat(this.ruleForm.electric_price),
                                        tower_price: parseInt(this.ruleForm.tower_price),
                                        rebar_price: parseInt(this.ruleForm.rebar_price),
                                        anchor_price: parseFloat(this.ruleForm.anchor_price),
                                        lifting_price: this.lifting_price,
                                        extraMap: this.extraMap
                                    };

                                    this.$store.commit('priceModify', fanData);
                                    this.dialogVisible = false;
                                } else {
                                    return false;
                                }
                            });
                        } else {
                            this.dialogVisible = false;
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 计算机组数量
            towerCount(type) {
                return _.sumBy(this.currentTower, power => (power.turbine_type === type ? 1 : 0));
            },
            onClose () {
                console.log("关闭事件")
                this.Bus.$emit("priceOpen",false)
            },
            onOpen () {
                this.isUpdate = false;
            }
        },
        created() {
            this.originTower = this.scheme.originFans;
        }
    };
</script>

<style scoped>

    .btnBox {
        text-align: center;
        margin-top: 20px;
    }

    .my-dialog >>> .el-radio-group {
        width: 100%;
        text-align: center;
    }
</style>
