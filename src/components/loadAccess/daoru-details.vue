<template>
    <el-dialog 
    :close-on-click-modal="false"
    custom-class="daoru-details"
    width="60%"
    title="确认数据"
    @close="close"
    :visible.sync="visible">
        <div class="content">
            <p>匹配到以下<span style="color: #33C86F;font-size: 18px;"> {{newArrData.length}} </span>条数据符合要求，是否上传更新到风参表里！</p>
            <el-table :data="newArrData" style="width: 100%" class="gf-table need-border box" >
                <el-table-column prop="turbine_name" label="风机编号" width="">
                </el-table-column>

                <el-table-column prop="coordinate_x" label="X" width="">
                </el-table-column>

                <el-table-column prop="coordinate_y" label="Y">
                </el-table-column>

                <el-table-column prop="elevation" label="海拔">
                </el-table-column>

                <el-table-column prop="turbine_type" label="机型">
                </el-table-column>
            </el-table>

            
            <div class="bottomBtn">
                <el-button type="primary" class="gf-button" @click="onUpload">确 定</el-button>
            </div>
        </div>

    </el-dialog>
</template>
<script>
    export default{
        name:"daoru-details",
        props:{
            daoruCommitVisible:{
                type: Boolean,
                default:false
            },
            daoruDataList:{
                type:Array,
                default:[]
            }
        },
        watch: {
            daoruCommitVisible:function(val){
                // console.log(val);
                if(val){
                    this.visible = true;
                }else{
                    this.visible = false;
                }
            },
            daoruDataList:function(val){
                if(val){
                    this.filterData(val);
                }
            }
        },
        data () {
            return{
                visible:false,
                newArrData:[],
                newArrData2:[]
            }
        },
        methods: {
            filterData(list){
                // console.log(data);
                let data = [...list];
                let data2 = [...list];
               
                // console.log(this.$store.state.scheme.currentFans);
                let fans = this.$store.state.scheme.currentFans;
                let arr=[];
                let newArr=[];
                let arr2=[];
                let newArr2=[];
                data.filter((item) => {
                    // console.log(item[1]);
                    arr.push(item[1]);
                });
                // console.log(arr);
                newArr = fans.filter(obj=>arr.indexOf(obj.turbine_name)!=-1);
                /////////上面展示用，下面传后端用////////////

                fans.filter(obj=> arr2.push(obj.turbine_name));
                arr2.forEach((item,index) => {
                    newArr2 = data2.filter((obj,index2)=>arr2.indexOf(obj[1])!=-1);
                })
                ///////////////////////////////
                // console.log(newArr);
                // console.log(newArr2);
                this.newArrData = newArr;
                this.newArrData2 = newArr2;
                // console.log(this.newArrData);
                // console.log(this.newArrData2);
            },
            onUpload(){
                this.$emit("uploadDaoruList",this.newArrData2);
            },
            close(){
                this.visible = false;
                this.$emit("closeDaoruDetails");
            }
        }
    }
</script>
<style lang="less" scoped>
/deep/ .el-dialog__header{
    height: 40px !important;
    line-height: 40px !important;
    padding: 0 10px !important;
}
/deep/ .el-dialog__headerbtn{
    top: 0 !important;
    right: 5px !important;
}
/deep/ .el-dialog__body{
    margin-top: 0 !important;
    padding-top: 0 !important;
}
/deep/ .el-table__body-wrapper{
    max-height: 140px;
    overflow: auto;
}
.content{
    color: #D4EFF6;
}
.bottomBtn{
    padding-top: 10px;
    display: flex;
    justify-content: center;
}
.gf-button{
    border: none;
}
</style>