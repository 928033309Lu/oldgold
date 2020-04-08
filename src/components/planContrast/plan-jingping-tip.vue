<template>
    <div class="plan-jingping-tip">
        <div class="title">
            <span class="titleName">[ {{ box1.scheme_name }} ]</span> 
            
        </div>
        <!-- <ul class="plan-jingping-content">
            <li>
                <span>项目回收期：</span> <span><span class="col">{{box1.c14 ? fixedNumber(box1.c14) : '-'}}</span> <span>年</span></span>
            </li>
            <li>
                <span>装机容量：</span> <span><span class="col">{{box1.c4 ? fixedNumber(box1.c4) : '-'}}</span> <span>万千瓦</span></span>
            </li>
            <li>
                <span>年发电量：</span> <span><span class="col">{{box1.c5 ? fixedNumber(box1.c5) : '-'}}</span> <span>万度</span></span>
            </li>
            <li>
                <span>发电销售收入总额：</span> <span><span class="col">{{box1.c9 ? fixedNumber(box1.c9) : '-'}}</span> <span>万元</span></span>
            </li>
            <li>
                <span>营业总成本费用：</span> <span><span class="col">{{box1.c10 ? fixedNumber(box1.c10) : '-'}}</span> <span>万元</span></span>
            </li>
            <li>
                <span>财务净现值：</span> <span><span class="col">{{box1.c13 ? fixedNumber(box1.c13) : '-'}}</span> <span>万元</span></span>
            </li>
            <li>
                <span>偿债备付率：</span> <span><span class="col">{{box1.c15 ? fixedNumber(box1.c15) : '-'}}</span> <span></span></span>
            </li>
            <li>
                <span>全投资内部收益率：</span> <span><span class="col">{{box1.c11 ? fixedNumber(box1.c11) : '-'}}</span> <span>%</span></span>
            </li>
        </ul> -->
        <ul class="plan-jingping-content">
            <li>
                <span>项目容量：</span> <span><span class="col">{{box1.design_capacity ? fixedNumber(box1.design_capacity) : '-'}}</span> <span>万KW</span></span>
            </li>
            <li>
                <span>等效小时数：</span> <span><span class="col">{{box1.cut_hour ? fixedNumber(box1.cut_hour) : '-'}}</span> <span>H</span></span>
            </li>
            <li>
                <span>单位总投资：</span> <span><span class="col">{{box1.c8 ? fixedNumber(box1.c8) : '-'}}</span> <span>元/KW</span></span>
            </li>
            <li>
                <span>度电成本(VAT&CIT)：</span> <span><span class="col">{{box1.c21 ? fixedNumber(box1.c21) : '-'}}</span> <span>元/KW</span></span>
            </li>
            <li>
                <span>Pt(投资回收期)：</span> <span><span class="col">{{box1.c14 ? fixedNumber(box1.c14) : '-'}}</span> <span>年</span></span>
            </li>
            <li>
                <span>全投资净现值@8.0%：</span> <span><span class="col">{{box1.total_investment_value ? fixedNumber(box1.total_investment_value) : '-'}}</span> <span>万元</span></span>
            </li>
            <li>
                <span>资本金净现值@10.0%：</span> <span><span class="col">{{box1.capital_found_value ? fixedNumber(box1.capital_found_value) : '-'}}</span> <span>万元</span></span>
            </li>
            <li>
                <span>PIRR(全投资内部收益率)：</span> <span><span class="col">{{box1.c11 ? fixedNumber(box1.c11) : '-'}}</span> <span>%</span></span>
            </li>
            <li>
                <span>EIRR(资本金内部收益率)：</span> <span><span class="col">{{box1.c12 ? fixedNumber(box1.c12) : '-'}}</span> <span>%</span></span>
            </li>
        </ul>
    </div>
</template>
<script>
    export default{
        name:"plan-jingping-tip",
        props:{
            box1:{}
        },
        data () {
            return{
                
            }
        },
        methods: {
            fixedNumber (number, fixed = 2) {
                if (!number || isNaN(Number(number))) return number;
                return Number(number).toFixed(fixed);
            }
        }
    }
</script>
<style lang="less" scoped>
    .plan-jingping-tip{
        color:rgba(212,239,246,1);
        margin-top: 20px;
        /* margin-right: 8px; */
    }
    .plan-jingping-content{
        border:1px solid rgba(212,239,246,0.5);
        font-size: 11px;
        padding: 0;
        margin: 5px 0 0 0;
        width: 244px;
        li{
            padding: 3px 0 5px 10px;
            border-bottom: 1px solid rgba(159,164,162,0.5); 
            &>span:first-child{
                display: inline-block;
                width: 133px;
            }
            &>span:nth-of-type(2){
                display: inline-block;
                width: 97px;
                overflow: hidden;
                white-space: nowrap;
                position: relative;
                top: 3px;
            }
        }
        li:last-child{
            border: none;
        }
        .col{
            color:rgba(51,200,111,1);
        }
    }
</style>