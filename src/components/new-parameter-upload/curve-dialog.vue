<template>
    <el-dialog title="自定义功率曲线"
        :modal="false"
        :visible.sync="typeVisible" 
        :close-on-click-modal="false"
        :before-close="beforeClose"
        custom-class="typeDialog" >
        <el-upload
                class="upload-demo"
                action="/input_power_curve"
                :before-upload="beforeUpload" 
                :http-request="httpRequest"
                accept=".gfwtg,.wtg"
                v-show="false">
            <button size="small" type="primary" ref="button"></button>
        </el-upload>
        <div class="uploadBtn" @click="clickUpload" v-if="!uploadValue"> 
            <span>+</span>上传功率曲线文件（.wtg/.gfwtg）
        </div>
        <div class="uploadBtn" @click="clickUpload" v-else style="color:rgba(51, 200, 111, 0.7)"> {{uploadValue }} </div>
        <el-form  ref="typeForm" 
            :model="sign"
            :rules="myRules"
            class="demo-ruleForm"
            label-width="110px">
            <el-form-item  label="机型名称：">
                <span>{{turbine_type}}</span>
            </el-form-item>
            <el-form-item  label="湍流强度：">
                <el-select v-model="strong" popper-class="gf-popper" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="sign" label="自定义标识：">
                <el-input v-model="sign.sign"  class="gf-table-input gf-table-input2" maxlength="10" />
                <div class="spanTip">可选填</div>
            </el-form-item>
            <el-form-item  label="功率曲线名称：">
                <span class="span"> {{value}} </span>
            </el-form-item>
        </el-form>
        <div class="btnBox">
            <el-button class="gf-button" style="width: 208px;" type="primary" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import util from '../../libs/util';
export default {
    name: "curve-dialog",
    components: {
        
    },
    props: ["userInfo"],
    data () {
        const validAZ = (rule, value, callback) => {
            if (value && !/^[a-zA-Z]+$/.test(value)) {
                return callback(new Error('允许输入字母'));
            }
            else {
                callback();
            }
        }
        return {
            houZui:"",
            myRules:{
                sign: [
                    {validator: validAZ, trigger: 'change'}
                ],
            },
            uploadValue: "",
            typeVisible:false,
            turbine_type: "",
            turbine_type_new: "",
            strong: "",
            sign: {
                sign: "AD"
            },
            options: [{
                value: '0.1',
                label: '0.1'
            },
            {
                value: '0.13',
                label: '0.13'
            },
            {
                value: '0.16',
                label: '0.16'
            }],
            optimize: false,
            waitingLoading: false
        }
    },
    computed: {
        value (){
            return this.turbine_type_new + "-" + this.strong + "-" + this.sign.sign + "." +this.houZui;
        }
    },
    watch:{
        waitingLoading () {
            this.$store.commit('globeLoading', {loading: this.waitingLoading, text: '正在上传数据文件，请稍后...'});
        },
    },
    created () {
    
    },
    mounted () {

    },
    methods: {
        open(turbine_type ,isTrue){
            this.turbine_type = turbine_type;
            let type = turbine_type;
            if(type){
                let arr = type.split("-").join("").split("/");
                this.turbine_type_new = arr.join('-');
            }else{
                this.turbine_type_new = '';
            }
            this.typeVisible = true;
            this.uploadValue = "";
            this.strong = "";
            this.optimize = isTrue;
        },
        clickUpload(){
           this.$refs.button.click();
        },
        beforeUpload(file){
            // console.log(!this.strong);
            if(!this.strong){
                this.$message.warning("请先选择湍流强度！");
                return false;
            }
            let filename = file.name;
            let arr = filename.split(".");
            let str = arr[arr.length-1];
            if(str.toLowerCase() != "wtg" && str.toLowerCase() != "gfwtg"){
                this.$message.warning("请选择后缀格式为.wtg/.gfwtg的文件！");
                return false;
            }
            this.houZui = str;
        },
        httpRequest(option){
            // console.log(option)
            this.waitingLoading = true;
            setTimeout(()=>{
                const formData = new FormData();
                const file = option.file;
                
                formData.append(option.filename, file, this.value);
                formData.append('user_id', this.userInfo.user_id);
                formData.append('turbine_type', this.turbine_type);
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
                    this.waitingLoading = false;
                    // console.log(res)
                    if(res.data.code == 200){
                        this.uploadValue = this.value;
                    }else if(res.data.code == 304){
                        this.$message.error(res.data.data);
                    }else{
                        this.uploadValue = "";
                        this.$message.error(res.data.data);
                    }
                }).catch(err => {
                    console.log(err);
                    this.uploadValue = "";
                    this.waitingLoading = false;
                });
            },800)
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
            if(!this.strong){
                this.$message.warning("请选择湍流强度！");
                return;
            }
            if(!this.uploadValue){
                this.$message.warning("请上传功率曲线文件！");
                return;
            }
            this.$emit("changeCurve", this.value , this.turbine_type , this.optimize);
            this.typeVisible = false;
        },
        beforeClose(){
            this.typeVisible = false;
            this.$emit("restoreType",false , this.optimize);
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
    height: 380px !important;
    background: #03203e !important;
    box-sizing: border-box;
    .el-dialog__header{
        opacity: 0.8;
    }
}
/deep/ .demo-ruleForm{
    width: 290px !important;
    margin: 0 0 0 60px !important;
    .el-form-item__label{
        text-align: left;
    }
    input, .el-input__inner{
        text-align: left !important;
    }
    .gf-table-input input{
        padding: 0 0 0 10px;
    }
    span{
        color: rgba(212, 239, 246, 0.7);
    }
}
.spanTip{
    font-size: 11px;
    width: 40px;
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    color: rgba(212, 239, 246, 0.6);
    
}
.btnBox{
    padding: 0 0 0 100px;
}
.uploadBtn{
    width: 290px;
    height: 30px;
    border-radius: 4px;
    margin: 0 auto;
    font-size: 14px;
    color: rgba(212, 239, 246, 0.7);
    line-height: 30px;
    text-align: center;
    border: 1px dashed rgba(212, 239, 246, 0.7);
    cursor: pointer;
    &>span{
        display: inline-block;
        width:13px;
        height:13px;
        border-radius: 50%;
        line-height: 13px;
        text-align: center;
        border: 1px solid rgba(212, 239, 246, 0.7);
        font-size: 11px;
    }
}
.uploadBtn:hover{
    border: 1px dashed rgba(212, 239, 246, 1);
}
.span{
    position: absolute;
    display: block;
    width: 250px;
    color: rgba(212, 239, 246, 0.7);
}
/deep/ .el-form-item__error{
    top: -12px !important;
    text-align: left !important;
}
/deep/ .el-form-item.is-error .el-input__inner{
    border: 1px solid #FF4967 !important;
}
</style>