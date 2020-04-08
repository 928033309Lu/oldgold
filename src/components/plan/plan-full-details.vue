<style lang="less" scoped>
    @import "./plan-full-details";
</style>
<template>
    <el-dialog title="风"
               :modal="false"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               custom-class="plan-full-details"
               width="90%"
               :center="true">
        <div class="contentBox">
            <div class="planDetailHeader">
                <div class="title">[ {{planName}} ]</div>
                <!-- <div class="lineAndCycle"></div> -->
                <!-- <div class="button" v-if="active" @click="active = false"><icon name="canshupeizhi" class="canshushezhi"></icon>查看参数设置</div> -->
                <!-- <div class="button" v-else @click="active= true"><icon name="fanhui" class="fanhui" style="vertical-align: -0.25em;width: 18px; height: 18px;"></icon>返回</div> -->
                <div class="close" v-if="active" @click="closeDetail"><i class="el-dialog__close el-icon el-icon-close"></i></div>
            </div>
            <!-- <details-one v-if="active" ref="detailsone"
                         :projectId="projectId"
                         :planId="planId"
            ></details-one>
            <details-two v-else @save="onSave" ref="detailstwo"
                         :projectId="projectId"
                         :planId="planId"
            ></details-two> -->
            <div style="padding: 0 40px 30px 40px;">
                <details-new ref="detailsNew" :projectId="projectId" :planId="planId" @save="onSave"></details-new>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    // import detailsOne from './details-one';
    // import detailsTwo from './details-two';
    import detailsNew from './details-new';

    export default {
        name: 'plan-full-details',
        components: { detailsNew},
        data () {
            return {
                ruleForm: {},
                projectId: null,
                planId: null,
                dialogVisible: false,
                formLabelAlign: {
                    name: '',
                    region: '',
                    type: ''
                },
                active: true,
                planName: '默认方案'
            };
        },
        methods: {
            open (projectId, planId, planName) {
                if (!projectId || !planId) return;
                this.dialogVisible = true;
                this.projectId = projectId;
                this.planId = planId;
                this.planName = planName;
            },
            onSave () {
                this.$emit('planDetailCalculating', true);
                // this.active = true;
            },
            closeDetail () {
                this.dialogVisible = false;
                this.$emit('close');
                //关闭经评恢复右下角的详情
                this.$emit("closeFanOptimize",false);
                this.projectId = null;
                this.planId = null;
                this.$refs['detailsNew'].initgridData();
            },
            refreshData () {
                // this.$refs['detailsone'].refreshData();
                // this.$refs['detailstwo'].refreshData();
                this.$refs['detailsNew'].refreshData();
            }
        },
        created () {
            this.open();
        }
    };
</script>

<style lang="less" scoped>

</style>
