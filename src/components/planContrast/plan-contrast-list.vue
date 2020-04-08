<template>
    <div class="plan-contrast-list" :class="!contrastProjectCanClick? 'openActive':''">
        <ul class="content" :class="transformActive?'':'openHeight'">

                <li v-for="(item,index) in planlist" :key="index">
                    <div>
                        <input type="checkbox" v-model="item.isSelected"  @change="onPlanChange(item,index,$event)"  />
                        <span class="name"> {{item.scheme_name}} </span>
                    </div>
                    <div>
                            <!-- green","purple","yellow -->
                        <span class="yuan"> 
                            <span class="yuanxin"></span> 
                        </span>
                        <!-- <span class="yuan" v-if="item.col == 'purple'?false:true"> 
                            <span class="yuanxin purple" ></span> 
                        </span>
                        <span class="yuan" v-if="item.col == 'yellow'?false:true"> 
                            <span class="yuanxin yellow" ></span> 
                        </span> -->
                        <span></span>
                        <span   class="fanzhuan"> 
                            <i  @click="onClickIcon(item,index,$event)" 
                            class="iconfont icon-chuangyikongjianICON_fuzhi-" style="width: 12px;height:12px;cursor: pointer;display: block;"></i>
                        </span>
                    </div>
                </li>

        </ul>
        <div class="bottomIcon" @click="transformActive=!transformActive">
            <span :class="transformActive?'transformActive':''"><i class="iconfont icon-arrow-right-copy"></i></span>
        </div>
    </div>
</template>
<script>
    import util from '../../libs/util';
    export default{
        name:"plan-contrast-list",
        props:{
            contrastProjectCanClick:{
                type: Boolean,
                default: true
            }
        },
        watch: {
            contrastProjectCanClick:function(val){
                this.planlist = [];
                if(!val){
                    this.planlist = [...this.$store.state.app.currentProjectPlans];
                    if (this.planlist) {
                        this.planlist.sort(this.planSort);

                        this.planlist.forEach((item,index) => {
                            item.isSelected = false;
                            item.col = null;
                            item.iconSelected = false;
                        });
                    }
                    // console.log(this.planlist)
                }else{
                    this.planlist = [];
                }
            },
            waitingTwoMinute () {
                this.$store.commit('globeLoading', {loading: this.waitingTwoMinute, text: '正在获取数据...'});
            }
        },
        data () {
            return{
                iNum: 0,
                newColArr1 :[],
                newUrlArr1 :[],
                newActiveArr1 :[],
                newColArr :[],
                newUrlArr :[],
                newActiveArr :[],
                z : 0,
                length: 0,
                transformActive:false,
                waitingTwoMinute:false,
                fans:[],
                isDisabled:false,
                planlist:[],
                currentMode: true // T:GoldFoam模式；F:WT模式
            }
        },
        methods: {
            onClickIcon(planData,indextab ,ev){
                // console.log(planData.iconSelected)
                if(planData.isSelected && planData.iconSelected){
                    ev.target.style.color= "rgb(212,239,246)";
                    // ev.target.parentNode.classList.remove("cols");
                    planData.iconSelected = false;
                    this.$emit("setSchemeTurbineNameVisible" , planData.scheme_id, false);
                    return;
                }
                
                if(planData.isSelected && !planData.iconSelected){
                    ev.target.style.color= "#00ff00";
                    // ev.target.parentNode.classList.add("cols");
                    planData.iconSelected = true;
                    this.$emit("setSchemeTurbineNameVisible" , planData.scheme_id, true);
                    return;
                }
               
                // console.log(planData, planData.iconSelected );
            },
            onPlanChange(planData ,indextab ,ev){
                let contrastData = this.planlist.filter((item,index)=>{
                    return item.isSelected == true;
                })
                let contrastData2 = this.planlist.filter((item,index)=>{
                    return item.isSelected !== true;
                })
              
                console.log("已选中："+contrastData.length+"个");
                this.length = contrastData.length;
                // console.log(planData)
                if(planData.isSelected){
                    //=====================
                    // var colorArr = ["#00ff00","#ff00ff","yellow"];
                    // var urlArr = [
                    //     "static/schemecompare/green.png",
                    //     "static/schemecompare/purple.png",
                    //     "static/schemecompare/yellow.png"
                    // ];
                    // var activeArr = ['green','purple','yellow'];              
                    // if(this.newColArr.length< this.length){   
                    //     // planData.color = colorArr[this.z];
                    //     // planData.url = urlArr[this.z];
                    //     // planData.activeCol = activeArr[this.z];                     
                    //     this.newUrlArr.push(urlArr[this.z]);
                    //     this.newColArr.push(colorArr[this.z]);
                    //     this.newActiveArr.push(activeArr[this.z]);
                    //     // console.log(this.length%3 , this.z)                   
                    //     if(this.length%3 == 0){
                    //         this.z=0;
                    //     }else{
                    //         this.z++;
                    //     }
                    // }    
                    //=====================
                    var colorArr1 = ["#00ff00","#ff00ff","yellow"];
                    var urlArr1 = [
                        "static/schemecompare/green.png",
                        "static/schemecompare/purple.png",
                        "static/schemecompare/yellow.png"
                    ];
                    var activeArr1 = ['green','purple','yellow']; 

                    this.newUrlArr1 = urlArr1[this.iNum % urlArr1.length];
                    this.newColorArr1 = colorArr1[this.iNum % colorArr1.length];
                    this.newActiveArr1 = activeArr1[this.iNum % activeArr1.length];
                    this.iNum++;
                    
                    this.getfengjiList(planData , planData.isSelected ,indextab ,contrastData.length ,ev ,contrastData);
                    
                }else{
                    
                    ev.target.parentNode.nextElementSibling.lastChild.lastChild.style.color= "rgb(212,239,246)";
                    ev.target.parentNode.nextElementSibling.firstChild.className = "yuan";
                    this.$emit("removeSchemeTurbines" , planData.scheme_id);
                }

                this.$store.commit("contrastData", contrastData);
            },
            getsanwei(planData , fans ,isSelected ,indextab ,length ,ev ,contrastData){
                //加载一个方案的风机图标
                let schemeOptions = {};
              
                schemeOptions.imgUrl = this.newUrlArr1; 
                schemeOptions.color = this.newColorArr1;
                ev.target.parentNode.nextElementSibling.firstChild.classList.add(this.newActiveArr1); 
                // console.log(this.iNum ,this.newUrlArr1,this.newColorArr1,this.newActiveArr1);
                //=====================
                // schemeOptions.imgUrl = planData.url; 
                // schemeOptions.color = planData.color; 
                // ev.target.parentNode.nextElementSibling.firstChild.classList.add(planData.activeCol);   
                //=====================
                // schemeOptions.imgUrl = this.newUrlArr[this.length-1]; 
                // schemeOptions.color = this.newColArr[this.length-1];
                // ev.target.parentNode.nextElementSibling.firstChild.classList.add(this.newActiveArr[this.length-1]);              
                
                var arr =[];
                fans.forEach((item,index)=>{
                    var turbineOptions ={};
                    turbineOptions.point = [item.longitude,item.latitude];     //风机坐标
                    turbineOptions.name = item.turbine_name ;   //风机名称
                    turbineOptions.id =  item.turbine_id ;  //风机编号
                    arr.push(turbineOptions);
                })
                // console.log(arr)
                this.$emit("createSchemeTurbines" , planData.scheme_id, schemeOptions, arr);
                this.waitingTwoMinute = false;

            },
            getfengjiList(planData ,isSelected ,indextab ,length ,ev ,contrastData){
                this.waitingTwoMinute = true;
                // 风机列表
                util.ajax.get('/input_turbine/' + planData.project_id + '/' +  planData.scheme_id, {
                    // util.ajax.get('/output_pg_list/' + projectId + '/' + planId, {
                }).then(res => {
                    
                    let retData = res.data;
                    if (retData.code !== 200) {

                    } else {
                        this.fans = res.data.data;
                        this.fans.forEach((item) => {
                            if (item.latitude && item.longitude) {
                            } else {
                                let point = this.XYZ2BLH({ x: parseFloat(item.coordinate_x), y: parseFloat(item.coordinate_y), z: 0 });
                                item.longitude = point.x;
                                item.latitude = point.y;
                            }
                        });
                        // console.log(this.fans, "fans");
                        this.getsanwei(planData , this.fans ,isSelected ,indextab ,length ,ev);
                    }
                })
            },
            XYZ2BLH (point) {
                return window.viewer.XYZ2BLH(point);
            },
            changeMode (mode) {
                this.currentMode = mode;

            },
            planSort (pA, pB) {
                if (this.currentMode) {
                    return pA.scheme_id - pB.scheme_id;
                } else {
                    return pB.scheme_id - pA.scheme_id;
                    // return palnA.scheme_id - planB.scheme_id;
                }
            },
            defaultInfo(){
                this.newColArr =[];
                this.newUrlArr =[];
                this.newActiveArr =[];
                this.z = 0;
                this.newColArr1 =[];
                this.newUrlArr1 =[];
                this.newActiveArr1 =[];
                this.iNum = 0;
                this.length =0;
            }
        }
    }
</script>
<style lang="less" scoped>
    .plan-contrast-list{
        width: 200px;
        position: absolute;
        bottom: 60px;
        right: -200px;
        z-index: 999;
        transition: all 0.5s;
    }
    .openActive{
        right: 120px;
        transition: all 0.5s;
    }
    .content{
        width:100%;
        max-height: 300px;
        overflow-y :scroll;
        transition: all 0.5s;
        padding: 0;
        margin: 0;
        background:rgba(21,38,79,0.3);
        border-radius:4px;
        color: rgba(212,239,246,0.8);
        font-size:14px;
        li{
            display: flex;
            height: 25px;
            line-height: 25px;
            justify-content: space-between;
            div:nth-of-type(1){
                width: 85%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            div:nth-of-type(2){
                width: 15%;
                display: flex;
                justify-content: space-between;
                padding-right: 0;
            }
        }
    }
    .fanzhuan{
        position: relative;
        transform: rotate(180deg);
        color: rgb(212,239,246);
        i{
            font-size: 14px;
        }
    }
    .yuan{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(212,239,246,0.5);
        position: relative;
        top: 9px;
        opacity: 0;
    }
    .yuanxin{
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        /* background: red; */
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    /* green","purple","yellow */
    .green{
        opacity: 1;  
        &>span{
            background: #00ff00;
        }
    }
    .purple{
        opacity: 1;  
        &>span{
            background: #ff00ff;
        }
    }
    .yellow{
        opacity: 1;  
        &>span{
            background: yellow;
        }
    }
    .bottomIcon{
        cursor: pointer;
        width: 100%;
        height: 25px;
        text-align: center;
        line-height: 25px;
        font-size: 16px;
        background:rgba(21,38,79,0.3);
        color: rgba(212,239,246,0.8);
        border-radius: 0 0 4px 4px;
        &>span{
            position: relative;
            display: block;
            transform: rotate(-90deg);
            transition: all 0.5s;
        }
        .transformActive{
            transform: rotate(90deg);
            transition: all 0.5s;
        }
    }
    .openHeight{
        max-height: 80px;
        overflow-y :scroll;
        transition: all 0.5s;
    }
    .plan-contrast-list .iconClass{
        color: #00ff00;
    }
    .cols{
        color: #00ff00;
    }
</style>
