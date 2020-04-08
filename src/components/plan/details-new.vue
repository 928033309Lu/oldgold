<template>
    <div class="details-new">
        <div class="topbox">
            <ul>
                <li>
                    <p><b>{{box1.design_capacity ? fixedNumber(box1.design_capacity) : '-'}}</b>MW</p>
                    <p>项目容量</p>
                </li>
                <li>
                    <p><b> - </b>万元</p>
                    <p>全投资净现值@8.0%</p>
                </li>
                <li>
                    <p><b> - </b>万元</p>
                    <p>资本金净现值@10.0%</p>
                </li>
            </ul>
            <ol>
                <li>
                    <p><b>{{box1.cut_hour ? fixedNumber(box1.cut_hour) : '-'}}</b></p>
                    <p>h</p>
                    <p>等效小时数</p>
                </li>
                <li>
                    <p><b>{{box1.c8 ? fixedNumber(box1.c8) : '-'}}</b></p>
                    <p>万元</p>
                    <p>动态总投资</p>
                </li>
                <li>
                    <p><b>{{box1.c21 ? fixedNumber(box1.c21) : '-'}}</b></p>
                    <p>元/KW</p>
                    <p>度电成本</p>
                </li>
                <li>
                    <p><b>{{box1.c14 ? fixedNumber(box1.c14) : '-'}}</b></p>
                    <p>年</p>
                    <p>Pt(投资回收期)</p>
                </li>
                <li>
                    <p><b>{{box1.c11 ? fixedNumber(box1.c11) : '-'}}</b></p>
                    <p>%</p>
                    <p>PIRR(全投资内部收益率)</p>
                </li>
                <li>
                    <p><b>{{box1.c12 ? fixedNumber(box1.c12) : '-'}}</b></p>
                    <p>%</p>
                    <p>EIRR(资本金内部收益率)</p>
                </li>   
            </ol>
        </div>

        <div class="content">
            <p>参数设置</p>
            <div class="bottomboxs">
                    <details-two-new ref="detailsTwoNew" :projectId="projectId" :planId="planId" @save="onSave"></details-two-new>
            </div>
        </div>
        <div class="baocunbox">
            <div class="saveButton" @click="post"> 保存并刷新经评结果</div>
        </div>
    </div>
</template>
<script>
    import detailsTwoNew from './details-two-new';
    import util from '@/libs/util';
    import ECharts from '../../echarts/ECharts';
    import { fixedNumber } from '@/libs/function-util';
    import { baseTooltipFormatter } from '@/libs/echarts-util';
    export default{
        name:"details-new",
        props: ['projectId', 'planId'],
        components: {detailsTwoNew},
        data (){
            return{
                box1:{}
            }
        },
        created () {
            this.fixedNumber = fixedNumber;
        },
        watch: {
           
            planId: function (val) {
                if(val){
                    this.refreshData();
                }
            }
        },
        mounted() {
            this.refreshData();
        },
        computed: {
            enManager: function () {
                if(this.$store.state.user.loginUserInfo.role === 3){
                    return true;
                }else if(this.$store.state.user.loginUserInfo.role === 10){
                    return true;
                }else{
                    return false;
                }
            }
        },
        methods: {
            refreshData(){
                this.requestThree();
                this.$refs['detailsTwoNew'].refreshData();
            },
            initgridData(){
                this.$refs['detailsTwoNew'].initgridData();
            },
            // 主要经济指标
            requestThree () {
                this.box1 = {};
                util.ajax.get('/evaluation_result', {
                    params: {
                        scheme_id: this.planId,
                        project_id: this.projectId
                    }
                }).then(res => {
                    console.log(res);
                    this.box1 = res.data.data || {};
                }).catch((err) => {
                    console.log(err);
                });
            },
            post(){
                if(this.enManager){
                    this.$message('您没有权限执行修改和保存此操作！');
                    return;
                }
                this.$refs['detailsTwoNew'].post();
            },
            onSave () {
                this.$emit('save', true);
            },
        }
    }
</script>
<style lang="less" scoped>
    .details-new{
        color:rgba(212,239,246,1);
        font-size:13px;
    }
    .topbox{
        box-sizing: border-box;
        border:1px solid rgba(211,219,228,0.6);
        height: 150px;
        width: 100%;
        display: flex;
        p{
            margin: 0;
            padding: 0;
        }
        &>ul{
            margin: 0;
            padding: 0 0 0 15px;
            box-sizing: border-box;
            height: 100%;
            width: 180px;
            border-right: 1px solid rgba(211, 219, 228, 0.6);
            li{
                height: 45px;
                padding-top: 5px;
            }
            b{
                color:rgba(51,200,111,1);
            }  
        }
        &>ol{
            margin: 0;
            padding: 0;
            display: flex;
            width: 100%;
            height: 100%;
            li{
                height: 100%;
                flex:1;
                text-align: center;
                p{
                    padding: 16px 0 0 0 ;
                }
            }
            li:nth-of-type(3){
                flex:0.7;
            }
            li:nth-of-type(5),li:nth-of-type(6){
                flex:1.1;
            }
            b{
                color:rgba(51,200,111,1);
                font-size: 28px;
            }
        }
    }
    .content{
        width: 100%;
        margin-top: 10px;
        &>p{
            height: 30px;
            background:rgba(51,200,111,0.3);
            line-height: 30px;
            padding: 0 0 0 10px;
            margin: 0;
        }
    }
    .bottomboxs{
        box-sizing: border-box;
        border:1px solid rgba(211,219,228,0.6);
        border-bottom:1px none;
        /* display: flex; */
        width: 100%;
        
    }
    .baocunbox{
        border:1px solid rgba(211,219,228,0.6);
        display: flex;
        .saveButton{
            width: 170px;
            height: 34px;
            border-radius: 4px;
            background-color: RGBA(51, 200, 111, 0.5);
            color: RGBA(255, 255, 255, 1);
            font-size: 14px;
            cursor: pointer;
            line-height: 34px;
            text-align: center;
            margin: 10px auto;
        }
    }
</style>