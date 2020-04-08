<template>
    <transition name="fade">
        <div class="container-station">
            <div class="box">
                <el-row :gutter="10">
                    <el-col :span="10" class="label">占地面积：</el-col>
                    <el-col :span="14">{{ optimize.stationHeight }}平方米</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="10" class="label">基准高程：</el-col>
                    <el-col :span="14">{{ optimize.stationWidth }}米</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="10" class="label">总填方量：</el-col>
                    <el-col :span="14">{{ optimize.stationArea }}立方米</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="10" class="label">总挖方量：</el-col>
                    <el-col :span="14">{{ optimize.stationArea }}立方米</el-col>
                </el-row>
            </div>
            <div class="table station-table">
                <el-row :gutter="10">
                    <el-col :span="6" class="header">点位</el-col>
                    <el-col :span="6" class="header">经度</el-col>
                    <el-col :span="6" class="header">纬度</el-col>
                    <el-col :span="6" class="header">高程</el-col>
                </el-row>
                <el-row :gutter="10" class="body">
                    <el-col :span="6">点位1</el-col>
                    <el-col :span="6">12.32</el-col>
                    <el-col :span="6">12.32</el-col>
                    <el-col :span="6">12.32</el-col>
                </el-row>
                <el-row :gutter="10" class="body">
                    <el-col :span="6">点位1</el-col>
                    <el-col :span="6">12.32</el-col>
                    <el-col :span="6">12.32</el-col>
                    <el-col :span="6">12.32</el-col>
                </el-row>
                <el-row :gutter="10" class="body">
                    <el-col :span="6">点位1</el-col>
                    <el-col :span="6">12.32</el-col>
                    <el-col :span="6">12.32</el-col>
                    <el-col :span="6">12.32</el-col>
                </el-row>
                <el-row :gutter="10" class="body">
                    <el-col :span="6">点位1</el-col>
                    <el-col :span="6">12.32</el-col>
                    <el-col :span="6">12.32</el-col>
                    <el-col :span="6">12.32</el-col>
                </el-row>
            </div>
            <div class="bottom-icon" @click="stationDetailClose">
                <i class="el-icon-arrow-up"></i>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'station-detail',
        data () {
            return {
                optimizeType: 0,
                optimize: {
                    height: 0,
                    wight: 0,
                    area: 0
                }
            };
        },
        methods: {
            open (optimizeType, dataInfo) {
                this.optimizeType = optimizeType;
                if (!dataInfo) {
                    this.optimize = {};
                } else {
                    dataInfo.then((res) => {
                        console.log(res);
                        this.optimize = res;
                    });
                }
            },
            stationDetailClose () {
                this.$emit('stationDetailClose');
            },
            loadTable (productId) {
                // alert(productId);
            }
        }
    };
</script>

<style lang="less" scoped>
    .container{
        width: 220px;
        overflow:hidden;
        position:fixed;
        right: 145px;
        bottom: 33px;
        background: rgba(3, 32, 62, 1);
        opacity:0.6;
        font-size:12px;
        color:#33C86F;
        border-radius: 6px ;
        .box{
          margin:20px 30px;
          .el-col{
            line-height:30px;
            .detail{
                width: 78px;
                height: 23px;
                background-color: rgba(212, 239, 246, 0.3);
                color: #FFFFFF;
                padding: 3px 12px;
                border-radius: 12px;
            }
          }
          .label{
            color:#D4EFF6;
          }
        }
    }
    .container-station{
        width: 228px;
        height: 337px;
        overflow:hidden;
        position:fixed;
        right: 145px;
        bottom: 33px;
        background: rgba(3, 32, 62, 1);
        opacity:0.6;
        font-size:12px;
        color:#33C86F;
        border-radius: 6px ;
        .box{
          margin:20px 30px;
          .el-col{
            line-height:30px;
            .detail{
                width: 78px;
                height: 23px;
                background-color: rgba(212, 239, 246, 0.3);
                color: #FFFFFF;
                padding: 3px 12px;
                border-radius: 12px;
            }
          }
          .label{
            color:#D4EFF6;
          }
        }
        .table{
            margin-left: 11px;
            margin-right: 11px;
            width:204px;
            height:148px;
            border:1px solid rgba(220,241,247,0.26);
            border-radius:4px;
            .el-col{
                text-align: center;
                font-size:12px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(212,239,246,1);
                line-height:28px;
                .header{
                    font-size:14px;
                }
            }
            .body{
                border-top: 1px solid rgba(220,241,247,0.26);
            }
        }
        .bottom-icon{
            text-align: center;
            color:rgba(212,239,246,1);
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
