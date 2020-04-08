<template>
    <div class="plan-list-container" :class="styleShow?'plan-list-container-show':''" v-if="planVisible">
        <!--<windTower-switch class="windTower-switch" @windTowerChange="onWindTowerChange"></windTower-switch>-->
        <div class="list-panel" :style="'width:'+ planTipWdith +'px;'">
            <plan-tip 
            :id="'plan'+plan.scheme_id"
            @getSchemeId="onGetSchemeId" 
            v-for="plan in plans" 
            v-show="currentMode===(Number(plan.scheme_id) >= 0)" 
            :key="plan.scheme_id" :ref="plan.scheme_id" 
            :planData="plan" 
            :selectedPlanId="selectedPlanId" 
            :contrastDataArr="contrastData"
            :mouser-over-plan-id="mouseOverPlanId" 
            @clickPlan="onPlanClick" 
            @clickShowDetail="onShowDetailClick" 
            @clickButton="onPlanButtonClick" 
            @planMouseOver="onPlanMouseOver" 
            @transitionComplete="onTransitionComplete"
             @beforeEnter="onBeforeEnter" 
             @changeWidth="changeWidth">
            </plan-tip>
        </div>
    </div>
</template>

<script>
import PlanTip from './plan-tip.vue';
// import windTowerSwitch from '../windTower-switch';
import util from '../../libs/util';

export default {
    name: 'plan-list',
    components: { PlanTip },
   
    watch: {
        projectData: function () {
            this.loadPlanData();
        },
        "$store.state.user.shareOpenScheme"(val){
            if(val){
                console.log(val, "分享是否能进入方案")
                this.shareClickScheme()
            }
        }
    },
    data () {
        return {
            shareProject: JSON.parse(localStorage.getItem('shareQuery')) || null,
            activeIndex:null,
            contrastData:[],
            styleShow: false,
            planVisible: false,
            projectData: {},
            plans: [],
            selectedPlanId: null,
            mouseOverPlanId: null,
            planTipWdith: 150,
            currentMode: true // T:GoldFoam模式；F:WT模式
        };
    },
    mounted(){

    },
    methods: {
        shareClickScheme (){
            if(!this.shareProject){
                return
            }
            if(!this.$refs[this.shareProject.scheme]){
                setTimeout(()=>{
                   this.shareClickScheme()
                },3000)
                return
            }
            
            this.$refs[this.shareProject.scheme][0].shareClickPlan()
        },


        onGetSchemeId(scheme_id){
            this.$emit("getSchemeId",scheme_id);
        },
        styleOpen(type){
            // this.styleShow = !this.styleShow;
            this.styleShow = type;
            // console.log(this.styleShow)
            this.$emit("selectedProject", this.styleShow );
        },
        changeWidth (data) {
            this.planTipWdith = parseInt(data);
        },

        show (projectData) {
            this.planVisible = true;
            this.projectData = projectData;
            this.selectedPlanId = null;
        },
        close () {
            this.planVisible = false;
        },
        setNewData (plan) {
            // console.log(plan)
            for (let index = 0; index < this.plans.length; index++) {
                let item = this.plans[index];
                if (plan.scheme_id === item.scheme_id) {
                    // this.plans[index] = plan; 此方法不能引起视图更新
                    this.plans.splice(index, 1, plan);
                    return;
                }
            };
        },
        loadPlanData (notChangeSelect = false) {
            this.plans = [];
            util.ajax.get('/scheme_list/' + this.projectData.project_id, {
                credentials: true,
                params: {
                }
            }).then(res => {
                if (res.data.code !== 200) {
                    this.$message.error(res.data.message);
                    return;
                }
                this.plans = res.data.data;
                //开关WT
                if(this.currentMode){
                    this.currentMode = true;
                }else{
                    this.currentMode = false;
                }

                if (this.plans) {
                    this.plans.sort(this.planSort);
                }
                this.$store.commit('currentProjectPlans', this.plans);
                this.setDefaultPlan(notChangeSelect);
            }).catch(() => {
                // this.$message.error('获取方案数据失败！');
            });
        },

        setDefaultPlan (notChangeSelect = false) {
            if (this.plans !== null && this.plans.length > 0 && !notChangeSelect) {
                for (let i = 0; i < this.plans.length; i++) {
                    if (this.currentMode === (Number(this.plans[i].scheme_id) >= 0)) {
                        let planData = this.plans[i];
                        this.selectedPlanId = planData.scheme_id;
                        this.$store.commit('planId', this.selectedPlanId);
                        this.$emit('planSelected', this.projectData.project_id, planData.scheme_id, planData.status_id === 1 , false); // 1：表示计算中
                        // 计算中 status_id 也要显示风机。所以注掉下面的代码。 TODO:阿汤哥
                        if (planData.status_id === 1 && this.$refs[planData.scheme_id][0]) {
                            this.$refs[planData.scheme_id][0].showLog();
                        }
                        break;
                    }
                }
            }
        },

        getWTPlans () {
            if (this.plans === null) {
                return [];
            }

            let wtModePlans = [];
            this.plans.forEach(plan => {
                // console.log(plan,"wt")
                if (Number(plan.scheme_id) < 0) {
                    wtModePlans.push(plan);
                }
            });

            return wtModePlans;
        },

        changeMode (mode) {
            this.currentMode = mode;
            if (this.plans) {
                this.plans.sort(this.planSort);
            }
            this.setDefaultPlan();
        },
        // onWindTowerChange (isActive) {
        //     this.$emit('windTowerChange', isActive);
        // },
        onPlanClick (projectId, planId, calculating ,isTrue) {
            this.$emit("closeFanDetail"); //点击方案时关闭风机显示界面
            
            // if (this.selectedPlanId === planId) {
            //     this.selectedPlanId = null;
            // } else {
                this.selectedPlanId = planId;
            // }
            //selectedPlanId 注释了不赋值null,不能同意方案得点两次才能选中
            //isTrue控制默认方案不选中
            this.$emit('planSelected', projectId, this.selectedPlanId, calculating ,isTrue);
            this.$store.commit('planId', this.selectedPlanId);
        },
       
        onShowDetailClick (plandata) {
            this.$emit('showDetailClick', plandata);
        },
        onPlanButtonClick (action, projectId, planId) {

            this.$emit(action, projectId, planId);
        },
        onPlanMouseOver (planId) {
            this.mouseOverPlanId = planId;
        },
        onTransitionComplete () {
            if (this.mouseOverPlanId) {
                this.planTipWdith = 420;
            } else {
                this.planTipWdith = 150;
            }
        },
        onBeforeEnter () {
            this.planTipWdith = 420;
        },
        setCalculating (planId, calculating) {
            this.plans.forEach((plan) => {
                if (plan.scheme_id === planId) {
                    plan.status_id = (calculating ? 1 : 2);
                }
            });
        },
        planSort (planA, palnB) {
            if (this.currentMode) {
                return planA.scheme_id - palnB.scheme_id;
            } else {
                return palnB.scheme_id - planA.scheme_id;
                // return palnA.scheme_id - planB.scheme_id;
            }
        }
    }
};
</script>

<style scoped>
.plan-list-container {
  position: absolute;
  right: 0px;
  /* top: 150px; */
  top: 120px;
  bottom: 146px;
  flex-direction: column;
}
.plan-list-container-show{
    right: -150px !important;
}
.windTower-switch {
  position: absolute;
  right: 72px; /** 140 - 68*/
  top: -50px;
}
.list-panel {
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  top: 0;
  min-height: 416px; /** 142*3 -18 xueyb:150->142*/
  max-height: 558px; /** 142*4 -18 xueyb:150->142*/
  right: 0;
  /*padding-right: 20px;*/
}
.list-panel :last-child {
  margin-bottom: 0;
}
</style>
