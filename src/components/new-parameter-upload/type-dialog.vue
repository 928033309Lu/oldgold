<template>
    <el-dialog title="自定义机型"
        :modal="false"
        :visible.sync="typeVisible" 
        :close-on-click-modal="false"
        :before-close="beforeClose"
        custom-class="typeDialog" >
        <el-form  ref="typeForm" 
            :model="typeForm"
            :rules="myRules"
            label-width="90px" class="demo-ruleForm">
            <el-form-item prop="name" label="字母缩写：" style="text-align: justify;">
                <el-input v-model="typeForm.name"  class="gf-table-input gf-table-input2" />
                <div class="spanTip"> 示例：<b style="color:#E20B4D">GW</b>140/2500 </div>
            </el-form-item>
            <el-form-item prop="dia" label="叶轮直径：">
                <el-input type="number" v-model="typeForm.dia"  class="gf-table-input gf-table-input2" />
                <div class="spanTip"> 示例：GW<b style="color:#E20B4D">140</b>/2500 <span>(m)</span></div>
            </el-form-item>
            <el-form-item prop="cap" label="单机容量：">
                <el-input type="number" v-model="typeForm.cap"  class="gf-table-input gf-table-input2" />
                <div class="spanTip"> 示例：GW140/<b style="color:#E20B4D">2500</b> <span>(kw)</span></div>
            </el-form-item>
            <el-form-item prop="height" label="轮毂高度：">
                <el-input type="number" v-model="typeForm.height"  class="gf-table-input gf-table-input" />
            </el-form-item>
            <el-form-item  label="机型名称：">
                <span> {{value}} </span>
            </el-form-item>
        </el-form>
        <div class="btnBox">
            <el-button class="gf-button" style="width: 208px;" type="primary" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>

export default {
    name: "type-dialog",
    components: {
        
    },
    props: ["turbineOptions"],
    data () {
        const valid999 = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入叶轮直径'));
            }
            else if (value<10) {
                return callback(new Error('取值范围10~999'));
            }
            else if (value>999) {
                return callback(new Error('取值范围10~999'));
            }
            else {
                callback();
            }
        };
        const valid1000 = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入单机容量'));
            }
            else if (value<1000) {
                return callback(new Error('取值范围1000~9999'));
            }
            else if (value>9999) {
                return callback(new Error('取值范围1000~9999'));
            }
            else {
                callback();
            }
        };
        const validAZ = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入厂家代号'));
            }
            else if (!/^[a-zA-Z]+$/.test(value)) {
                return callback(new Error('英文字母代号'));
            }
            else {
                callback();
            }
        };
        const validHeight = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入轮毂高度'));
            }
            else if (value <= 0 || value > 300 ) {
                return callback(new Error('取值范围 0~300'));
            }
            else {
                callback();
            }
        };
        return {
            myRules:{
                dia: [
                    {validator: valid999, trigger: 'change'}
                ],
                cap: [
                    {validator: valid1000, trigger: 'change'}
                ],
                name: [
                    {validator: validAZ, trigger: 'change'}
                ],
                height: [
                    {validator: validHeight, trigger: 'change'}
                ],
            },
            typeVisible:false,
            typeForm: {
                name: "",
                dia: "",
                cap: "",
                height: "90"
            },
            optimize: false 
        }
    },
    computed: {
        value (){
            return (this.typeForm.name).toUpperCase() + "-" + this.typeForm.dia + "/" + this.typeForm.cap;
        }
    },
    created () {
    
    },
    mounted () {

    },
    methods: {
        open(isTrue){
            this.typeVisible = true;
            this.optimize = isTrue;
        },
        submitForm (){
            let isValid = false;
            this.$refs.typeForm.validate(valid => {
                isValid = valid;
                return valid;
            });
            if(!isValid){
                return;
            }
            if(!this.typeForm.name || !this.typeForm.dia || !this.typeForm.cap){
                this.$message.warning("数据不能为空！");
                return;
            }
            let type = this.turbineOptions.some((item,index)=>{
                return item.value == this.value;
            })
            // console.log(type)
            if(!type){
                this.$emit("changeType", this.value, this.optimize , this.typeForm.height);
                this.typeVisible = false;
                this.typeForm = {
                    name: "",
                    dia: "",
                    cap: "",
                    height: "90"
                }
            }else{
                this.$message.warning("机型列表已有该机型！");
            }
        },
        beforeClose(){
            this.typeVisible = false;
            this.$emit("restoreType",true ,this.optimize);
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .gf-table-input2.el-input .el-input__inner{
    border: 1px solid #888d97 !important
}
/deep/ .typeDialog{
    width: 455px !important;
    height: 390px !important;
    background: #03203e !important;
    box-sizing: border-box;
    .el-dialog__header{
        opacity: 0.8;
    }
}
/deep/ .demo-ruleForm{
    margin: 10px 0 0 10px !important;
    .el-form-item__content{
        width: 150px !important;
    }
}
.spanTip{
    font-size: 11px;
    width: 154px;
    position: absolute;
    right: -150px;
    top: 0;
    padding-left: 40px;
    box-sizing: border-box;
    &>span{
        position: absolute;
        left: 8px;
        top: 0;
    }
}
.btnBox{
    padding: 0 0 0 100px;
}
/deep/ .el-form-item__error{
    text-align: left !important;
    top: -12px !important;
}
/deep/ .el-form-item.is-error .el-input__inner{
    border: 1px solid #FF4967 !important;
}
</style>